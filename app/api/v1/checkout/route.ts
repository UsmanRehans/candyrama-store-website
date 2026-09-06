import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { checkoutSchema } from '@/lib/schemas/commerce';
import { db } from '@/lib/server/db';
import { env } from '@/lib/server/env';
import { getStripe } from '@/lib/server/stripe';

export async function POST(request: NextRequest) {
  let reservedAttemptId: string | undefined;
  try {
    const body = checkoutSchema.parse(await request.json());
    const quantities = new Map<string, number>();
    for (const item of body.items)
      quantities.set(
        item.productSlug,
        (quantities.get(item.productSlug) ?? 0) + item.quantity,
      );
    const productSlugs = [...quantities.keys()];
    const products = await db.product.findMany({
      where: { slug: { in: productSlugs }, status: 'ACTIVE' },
      include: {
        variants: {
          where: { active: true },
          orderBy: [{ isDefault: 'desc' }, { position: 'asc' }],
        },
      },
    });
    if (products.length !== productSlugs.length)
      return NextResponse.json(
        { error: 'One or more products are unavailable.' },
        { status: 409 },
      );

    const cart = products.map((product) => {
      const variant = product.variants[0];
      return {
        productId: product.id,
        variantId: variant?.id,
        sku: variant?.sku ?? product.sku,
        name:
          variant && product.variants.length > 1
            ? `${product.name} · ${variant.netWeight}`
            : product.name,
        priceCents: variant?.priceCents ?? product.priceCents,
        quantity: quantities.get(product.slug)!,
        stockQty: variant?.stockQty ?? product.stockQty,
      };
    });
    const subtotalCents = cart.reduce(
      (sum, item) => sum + item.priceCents * item.quantity,
      0,
    );
    const shippingCents = subtotalCents >= 5000 ? 0 : 599;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const attempt = await db.$transaction(
      async (tx) => {
        for (const item of cart) {
          const updated = item.variantId
            ? await tx.productVariant.updateMany({
                where: {
                  id: item.variantId,
                  active: true,
                  stockQty: { gte: item.quantity },
                },
                data: { stockQty: { decrement: item.quantity } },
              })
            : await tx.product.updateMany({
                where: { id: item.productId, stockQty: { gte: item.quantity } },
                data: { stockQty: { decrement: item.quantity } },
              });
          if (updated.count !== 1) throw new Error('OUT_OF_STOCK');
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              delta: -item.quantity,
              reason: 'CHECKOUT_RESERVED',
            },
          });
        }
        return tx.checkoutAttempt.create({
          data: {
            email: body.email,
            items: cart,
            subtotalCents,
            shippingCents,
            expiresAt,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    reservedAttemptId = attempt.id;

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        customer_email: body.email,
        client_reference_id: attempt.id,
        line_items: cart.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: item.priceCents,
            product_data: { name: item.name },
          },
        })),
        shipping_address_collection: { allowed_countries: ['US'] },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: shippingCents, currency: 'usd' },
              display_name:
                shippingCents === 0
                  ? 'Free standard shipping'
                  : 'USPS Ground Advantage',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 3 },
                maximum: { unit: 'business_day', value: 5 },
              },
            },
          },
        ],
        automatic_tax: { enabled: true },
        allow_promotion_codes: true,
        success_url: `${env.NEXT_PUBLIC_SITE_URL}/order/confirmed?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/cart?checkout=cancelled`,
        expires_at: Math.floor(expiresAt.getTime() / 1000),
        metadata: { checkoutAttemptId: attempt.id },
      },
      { idempotencyKey: attempt.id },
    );
    await db.checkoutAttempt.update({
      where: { id: attempt.id },
      data: { stripeSessionId: session.id },
    });
    return NextResponse.json(
      { data: { checkoutUrl: session.url } },
      { status: 201 },
    );
  } catch (error) {
    if (reservedAttemptId) {
      try {
        await db.$transaction(
          async (tx) => {
            const attempt = await tx.checkoutAttempt.findUnique({
              where: { id: reservedAttemptId },
            });
            if (
              !attempt ||
              attempt.status !== 'OPEN' ||
              attempt.stripeSessionId
            )
              return;
            const items = attempt.items as Array<{
              productId: string;
              variantId?: string;
              quantity: number;
            }>;
            for (const item of items) {
              if (item.variantId)
                await tx.productVariant.update({
                  where: { id: item.variantId },
                  data: { stockQty: { increment: item.quantity } },
                });
              else
                await tx.product.update({
                  where: { id: item.productId },
                  data: { stockQty: { increment: item.quantity } },
                });
              await tx.stockMovement.create({
                data: {
                  productId: item.productId,
                  variantId: item.variantId,
                  delta: item.quantity,
                  reason: 'CHECKOUT_CREATE_FAILED',
                },
              });
            }
            await tx.checkoutAttempt.update({
              where: { id: attempt.id },
              data: { status: 'FAILED' },
            });
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
      } catch (releaseError) {
        console.error('checkout_reservation_release_failed', {
          reservedAttemptId,
          releaseError,
        });
      }
    }
    if (error instanceof Error && error.message === 'OUT_OF_STOCK')
      return NextResponse.json(
        { error: 'A product just sold out. Please update your cart.' },
        { status: 409 },
      );
    if (error && typeof error === 'object' && 'issues' in error)
      return NextResponse.json(
        { error: 'Invalid checkout request.' },
        { status: 400 },
      );
    console.error('checkout_failed', error);
    return NextResponse.json(
      { error: 'Checkout is temporarily unavailable.' },
      { status: 503 },
    );
  }
}
