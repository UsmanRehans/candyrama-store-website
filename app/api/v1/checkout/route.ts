import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { checkoutSchema } from "@/lib/schemas/commerce";
import { db } from "@/lib/server/db";
import { env } from "@/lib/server/env";
import { getStripe } from "@/lib/server/stripe";

export async function POST(request: NextRequest) {
  let reservedAttemptId: string | undefined;
  try {
    if (!env.STORE_PURCHASING_ENABLED)
      return NextResponse.json(
        { error: "CandyRama ordering is coming soon." },
        { status: 503 },
      );
    const body = checkoutSchema.parse(await request.json());
    const quantities = new Map<string, number>();
    for (const item of body.items)
      quantities.set(
        item.variantSku,
        (quantities.get(item.variantSku) ?? 0) + item.quantity,
      );
    const variantSkus = [...quantities.keys()];
    const variants = await db.productVariant.findMany({
      where: {
        sku: { in: variantSkus },
        active: true,
        priceCents: { not: null },
        stockQty: { not: null },
        product: { status: "ACTIVE" },
      },
      include: { product: true },
    });
    if (variants.length !== variantSkus.length)
      return NextResponse.json(
        { error: "One or more products are unavailable." },
        { status: 409 },
      );

    const cart = variants.map((variant) => {
      const { product } = variant;
      if (variant.priceCents === null || variant.stockQty === null)
        throw new Error("VARIANT_INCOMPLETE");
      return {
        productId: product.id,
        variantId: variant.id,
        sku: variant.sku,
        name: variant.netWeight
          ? `${product.name} · ${variant.netWeight}`
          : product.name,
        priceCents: variant.priceCents,
        stripePriceId: variant.stripePriceId,
        quantity: quantities.get(variant.sku)!,
      };
    });
    const subtotalCents = cart.reduce(
      (sum, item) => sum + item.priceCents * item.quantity,
      0,
    );
    const customer = body.email
      ? await db.customer.findUnique({
          where: { email: body.email.toLowerCase() },
          select: { id: true, email: true, rewardPoints: true },
        })
      : null;
    const referral = body.referralCode
      ? await db.customer.findUnique({
          where: { referralCode: body.referralCode },
          select: { id: true, email: true },
        })
      : null;
    if (
      body.referralCode &&
      (!referral || referral.email === body.email?.toLowerCase())
    )
      return NextResponse.json(
        { error: "That referral code cannot be used." },
        { status: 400 },
      );
    const rewardPointsRedeemed =
      body.useRewards && customer
        ? Math.min(customer.rewardPoints, Math.floor(subtotalCents / 5))
        : 0;
    const rewardDiscountCents = rewardPointsRedeemed * 5;
    const shippingCents = subtotalCents >= 5000 ? 0 : 599;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    const stripe = getStripe();
    await Promise.all(
      cart.map(async (item) => {
        if (!item.stripePriceId) return;
        const price = await stripe.prices.retrieve(item.stripePriceId);
        if (
          !price.active ||
          price.currency !== "usd" ||
          price.unit_amount !== item.priceCents
        )
          throw new Error("STRIPE_PRICE_MISMATCH");
      }),
    );

    const attempt = await db.$transaction(
      async (tx) => {
        for (const item of cart) {
          const updated = await tx.productVariant.updateMany({
            where: {
              id: item.variantId,
              productId: item.productId,
              active: true,
              stockQty: { gte: item.quantity },
            },
            data: { stockQty: { decrement: item.quantity } },
          });
          if (updated.count !== 1) throw new Error("OUT_OF_STOCK");
          await tx.stockMovement.create({
            data: {
              productId: item.productId,
              variantId: item.variantId,
              delta: -item.quantity,
              reason: "CHECKOUT_RESERVED",
            },
          });
        }
        if (rewardPointsRedeemed > 0 && customer) {
          const reserved = await tx.customer.updateMany({
            where: {
              id: customer.id,
              rewardPoints: { gte: rewardPointsRedeemed },
            },
            data: { rewardPoints: { decrement: rewardPointsRedeemed } },
          });
          if (reserved.count !== 1) throw new Error("REWARDS_CHANGED");
        }
        return tx.checkoutAttempt.create({
          data: {
            email: body.email?.toLowerCase(),
            items: cart,
            subtotalCents,
            shippingCents,
            giftRecipientName: body.giftRecipientName || null,
            giftMessage: body.giftMessage || null,
            referralCode: body.referralCode || null,
            useRewards: body.useRewards,
            rewardPointsRedeemed,
            expiresAt,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    reservedAttemptId = attempt.id;

    const rewardCoupon =
      rewardDiscountCents > 0
        ? await stripe.coupons.create({
            amount_off: rewardDiscountCents,
            currency: "usd",
            duration: "once",
            name: "CandyRama rewards",
            metadata: { checkoutAttemptId: attempt.id },
          })
        : null;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        customer_email: body.email,
        client_reference_id: attempt.id,
        line_items: cart.map((item) =>
          item.stripePriceId
            ? { quantity: item.quantity, price: item.stripePriceId }
            : {
                quantity: item.quantity,
                price_data: {
                  currency: "usd",
                  unit_amount: item.priceCents,
                  product_data: {
                    name: item.name,
                    metadata: { variantSku: item.sku },
                  },
                },
              },
        ),
        shipping_address_collection: { allowed_countries: ["US"] },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: shippingCents, currency: "usd" },
              display_name:
                shippingCents === 0
                  ? "Free standard shipping"
                  : "USPS Ground Advantage",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 3 },
                maximum: { unit: "business_day", value: 5 },
              },
            },
          },
        ],
        automatic_tax: { enabled: true },
        allow_promotion_codes: !rewardCoupon,
        discounts: rewardCoupon ? [{ coupon: rewardCoupon.id }] : undefined,
        success_url: `${env.NEXT_PUBLIC_SITE_URL}/order/confirmed?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/cart?checkout=cancelled`,
        expires_at: Math.floor(expiresAt.getTime() / 1000),
        metadata: {
          checkoutAttemptId: attempt.id,
          giftRecipientName: body.giftRecipientName ?? "",
          giftMessage: body.giftMessage ?? "",
          referralCode: body.referralCode ?? "",
        },
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
              attempt.status !== "OPEN" ||
              attempt.stripeSessionId
            )
              return;
            const items = attempt.items as Array<{
              productId: string;
              variantId: string;
              quantity: number;
            }>;
            for (const item of items) {
              await tx.productVariant.updateMany({
                where: { id: item.variantId, productId: item.productId },
                data: { stockQty: { increment: item.quantity } },
              });
              await tx.stockMovement.create({
                data: {
                  productId: item.productId,
                  variantId: item.variantId,
                  delta: item.quantity,
                  reason: "CHECKOUT_CREATE_FAILED",
                },
              });
            }
            if (attempt.rewardPointsRedeemed > 0 && attempt.email)
              await tx.customer.update({
                where: { email: attempt.email },
                data: {
                  rewardPoints: { increment: attempt.rewardPointsRedeemed },
                },
              });
            await tx.checkoutAttempt.update({
              where: { id: attempt.id },
              data: { status: "FAILED" },
            });
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
      } catch (releaseError) {
        console.error("checkout_reservation_release_failed", {
          reservedAttemptId,
          releaseError,
        });
      }
    }
    if (error instanceof Error && error.message === "OUT_OF_STOCK")
      return NextResponse.json(
        { error: "A product just sold out. Please update your cart." },
        { status: 409 },
      );
    if (error instanceof Error && error.message === "STRIPE_PRICE_MISMATCH")
      return NextResponse.json(
        { error: "A product price is temporarily unavailable." },
        { status: 409 },
      );
    if (error instanceof Error && error.message === "REWARDS_CHANGED")
      return NextResponse.json(
        { error: "Your reward balance changed. Please try again." },
        { status: 409 },
      );
    if (error && typeof error === "object" && "issues" in error)
      return NextResponse.json(
        { error: "Invalid checkout request." },
        { status: 400 },
      );
    console.error("checkout_failed", error);
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable." },
      { status: 503 },
    );
  }
}
