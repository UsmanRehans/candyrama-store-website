import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import {
  aggregatePaymentLinkItems,
  matchesExistingPaymentLinkOrder,
  paymentLinkTotals,
  type PaymentLinkCartItem,
} from '@/lib/payment-link-order';
import {
  paymentLinkOrderSchema,
  type PaymentLinkOrderInput,
} from '@/lib/schemas/payment-link';
import { db } from '@/lib/server/db';
import { sendPendingOrderNotifications } from '@/lib/server/email';
import { env } from '@/lib/server/env';

const existingOrderSelect = {
  id: true,
  orderNumber: true,
  email: true,
  status: true,
  shippingName: true,
  shippingLine1: true,
  shippingLine2: true,
  shippingCity: true,
  shippingState: true,
  shippingZip: true,
  shippingCountry: true,
  giftRecipientName: true,
  giftMessage: true,
  items: { select: { skuSnapshot: true, quantity: true } },
} satisfies Prisma.OrderSelect;

async function findIdempotentOrder(input: PaymentLinkOrderInput) {
  const existing = await db.order.findUnique({
    where: { id: input.requestId },
    select: existingOrderSelect,
  });
  if (!existing) return null;
  if (!matchesExistingPaymentLinkOrder(existing, input)) {
    throw new Error('IDEMPOTENCY_CONFLICT');
  }
  return existing;
}

export async function POST(request: NextRequest) {
  if (!env.STORE_PURCHASING_ENABLED) {
    return NextResponse.json(
      { error: 'Ordering is temporarily unavailable.' },
      { status: 503 },
    );
  }
  const origin = request.headers.get('origin');
  const allowedOrigins = new Set([
    request.nextUrl.origin,
    new URL(env.NEXT_PUBLIC_SITE_URL).origin,
  ]);
  if (origin && !allowedOrigins.has(origin)) {
    return NextResponse.json(
      { error: 'Request origin is not allowed.' },
      { status: 403 },
    );
  }

  let input: PaymentLinkOrderInput;
  try {
    const parsed = paymentLinkOrderSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please check the order and US shipping address.' },
        { status: 400 },
      );
    }
    input = parsed.data;
  } catch {
    return NextResponse.json(
      { error: 'Please send a valid JSON order request.' },
      { status: 400 },
    );
  }

  try {
    const existing = await findIdempotentOrder(input);
    if (existing) {
      return NextResponse.json({ data: { orderNumber: existing.orderNumber } });
    }

    const quantities = aggregatePaymentLinkItems(input.items);
    const variantSkus = [...quantities.keys()];
    const variants = await db.productVariant.findMany({
      where: {
        sku: { in: variantSkus },
        active: true,
        priceCents: { not: null },
        product: { status: 'ACTIVE' },
      },
      include: { product: true },
    });
    if (variants.length !== variantSkus.length) {
      return NextResponse.json(
        { error: 'One or more products are unavailable.' },
        { status: 409 },
      );
    }

    const cart: PaymentLinkCartItem[] = variants.map((variant) => {
      if (variant.priceCents === null) {
        throw new Error('VARIANT_INCOMPLETE');
      }
      const quantity = quantities.get(variant.sku)!;
      return {
        productId: variant.productId,
        variantId: variant.id,
        sku: variant.sku,
        name: variant.netWeight
          ? `${variant.product.name} · ${variant.netWeight}`
          : variant.product.name,
        priceCents: variant.priceCents,
        quantity,
      };
    });
    const totals = paymentLinkTotals(cart);

    const created = await db.$transaction(
      async (tx) => {
        const recentPendingOrders = await tx.order.count({
          where: {
            email: input.email,
            status: 'PENDING',
            createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) },
          },
        });
        if (recentPendingOrders >= 3) throw new Error('RATE_LIMITED');
        const sequence = await tx.orderSequence.upsert({
          where: { key: 'orders' },
          create: { key: 'orders', value: 1001 },
          update: { value: { increment: 1 } },
        });
        return tx.order.create({
          data: {
            id: input.requestId,
            orderNumber: `CR-${String(sequence.value).padStart(6, '0')}`,
            email: input.email,
            status: 'PENDING',
            ...totals,
            shippingName: input.shipping.name,
            shippingLine1: input.shipping.line1,
            shippingLine2: input.shipping.line2 ?? null,
            shippingCity: input.shipping.city,
            shippingState: input.shipping.state,
            shippingZip: input.shipping.zip,
            shippingCountry: input.shipping.country,
            giftRecipientName: input.giftRecipientName ?? null,
            giftMessage: input.giftMessage ?? null,
            rewardPointsRedeemed: 0,
            rewardPointsEarned: 0,
            internalNote:
              'Payment link requested. Stock is not reserved; availability and tax must be confirmed before payment.',
            items: {
              create: cart.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                skuSnapshot: item.sku,
                nameSnapshot: item.name,
                priceCents: item.priceCents,
                quantity: item.quantity,
              })),
            },
          },
          select: { orderNumber: true, totalCents: true },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    try {
      await sendPendingOrderNotifications({
        email: input.email,
        orderNumber: created.orderNumber,
        totalCents: created.totalCents,
        shippingName: input.shipping.name,
      });
    } catch (notificationError) {
      console.error('pending_order_notification_failed', {
        orderNumber: created.orderNumber,
        notificationError,
      });
    }

    return NextResponse.json(
      { data: { orderNumber: created.orderNumber } },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === 'P2002' || error.code === 'P2034')
    ) {
      try {
        const existing = await findIdempotentOrder(input);
        if (existing) {
          return NextResponse.json({
            data: { orderNumber: existing.orderNumber },
          });
        }
      } catch (retryError) {
        if (
          retryError instanceof Error &&
          retryError.message === 'IDEMPOTENCY_CONFLICT'
        ) {
          return NextResponse.json(
            { error: 'That request ID was already used for another order.' },
            { status: 409 },
          );
        }
      }
    }
    if (error instanceof Error && error.message === 'IDEMPOTENCY_CONFLICT') {
      return NextResponse.json(
        { error: 'That request ID was already used for another order.' },
        { status: 409 },
      );
    }
    if (error instanceof Error && error.message === 'RATE_LIMITED') {
      return NextResponse.json(
        { error: 'Too many order requests. Please wait and try again.' },
        { status: 429 },
      );
    }
    console.error('payment_link_order_create_failed', error);
    return NextResponse.json(
      { error: 'We could not save the order request. Please try again.' },
      { status: 500 },
    );
  }
}
