import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/server/db';
import { getStripeEnv } from '@/lib/server/env';
import { getStripe } from '@/lib/server/stripe';
import { sendOrderConfirmation } from '@/lib/server/email';

function referralCodeFor(customerId: string) {
  return `CANDY${customerId.slice(-8).toUpperCase()}`;
}

type ReservedItem = {
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  priceCents: number;
  quantity: number;
};

async function releaseReservation(
  event: Stripe.Event,
  session: Stripe.Checkout.Session,
) {
  const attemptId =
    session.metadata?.checkoutAttemptId ?? session.client_reference_id;
  if (!attemptId) return;
  await db.$transaction(
    async (tx) => {
      await tx.webhookEvent.create({
        data: { id: event.id, provider: 'stripe', eventType: event.type },
      });
      const attempt = await tx.checkoutAttempt.findUnique({
        where: { id: attemptId },
      });
      if (!attempt || attempt.status !== 'OPEN') return;
      const items = attempt.items as ReservedItem[];
      for (const item of items) {
        const released = await tx.productVariant.updateMany({
          where: { id: item.variantId, productId: item.productId },
          data: { stockQty: { increment: item.quantity } },
        });
        if (released.count !== 1)
          throw new Error('Reserved variant no longer belongs to its product');
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            variantId: item.variantId,
            delta: item.quantity,
            reason: 'CHECKOUT_RELEASED',
          },
        });
      }
      if (attempt.rewardPointsRedeemed > 0 && attempt.email)
        await tx.customer.update({
          where: { email: attempt.email },
          data: { rewardPoints: { increment: attempt.rewardPointsRedeemed } },
        });
      if (attempt.discountCode === 'SWEETSTART' && attempt.email)
        await tx.newsletterSubscriber.updateMany({
          where: {
            email: attempt.email,
            offerReservedAttemptId: attempt.id,
          },
          data: {
            offerReservedAttemptId: null,
            offerReservedUntil: null,
          },
        });
      await tx.checkoutAttempt.update({
        where: { id: attempt.id },
        data: { status: 'EXPIRED' },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}

async function completeOrder(
  event: Stripe.Event,
  session: Stripe.Checkout.Session,
) {
  if (session.payment_status !== 'paid') return;
  const attemptId =
    session.metadata?.checkoutAttemptId ?? session.client_reference_id;
  if (!attemptId)
    throw new Error('Stripe session is missing checkout attempt id');
  const details = session.customer_details;
  const address =
    session.collected_information?.shipping_details?.address ??
    details?.address;
  const shippingName =
    session.collected_information?.shipping_details?.name ?? details?.name;
  if (
    !details?.email ||
    !address?.line1 ||
    !address.city ||
    !address.state ||
    !address.postal_code ||
    !shippingName
  )
    throw new Error('Stripe session is missing required customer details');
  const customerEmail = details.email.toLowerCase();
  const shippingLine1 = address.line1;
  const shippingCity = address.city;
  const shippingState = address.state;
  const shippingZip = address.postal_code;

  const confirmedOrder = await db.$transaction(
    async (tx) => {
      await tx.webhookEvent.create({
        data: { id: event.id, provider: 'stripe', eventType: event.type },
      });
      const attempt = await tx.checkoutAttempt.findUnique({
        where: { id: attemptId },
      });
      if (!attempt || attempt.status !== 'OPEN') return;
      const items = attempt.items as ReservedItem[];
      const sequence = await tx.orderSequence.upsert({
        where: { key: 'orders' },
        create: { key: 'orders', value: 1001 },
        update: { value: { increment: 1 } },
      });
      const customer = await tx.customer.upsert({
        where: { email: customerEmail },
        create: {
          email: customerEmail,
          name: details.name ?? shippingName,
          phone: details.phone,
        },
        update: { name: details.name ?? shippingName, phone: details.phone },
      });
      const customerWithCode = customer.referralCode
        ? customer
        : await tx.customer.update({
            where: { id: customer.id },
            data: { referralCode: referralCodeFor(customer.id) },
          });
      const isFirstOrder =
        (await tx.order.count({ where: { customerId: customer.id } })) === 0;
      const rewardPointsEarned = Math.floor(
        Math.max(0, session.amount_subtotal ?? attempt.subtotalCents) / 100,
      );
      const order = await tx.order.create({
        data: {
          orderNumber: `CR-${String(sequence.value).padStart(6, '0')}`,
          customerId: customer.id,
          email: customerEmail,
          status: 'PAID',
          subtotalCents: attempt.subtotalCents,
          discountCents: session.total_details?.amount_discount ?? 0,
          shippingCents:
            session.shipping_cost?.amount_total ?? attempt.shippingCents,
          taxCents: session.total_details?.amount_tax ?? 0,
          totalCents:
            session.amount_total ??
            attempt.subtotalCents + attempt.shippingCents,
          shippingName,
          shippingLine1,
          shippingLine2: address.line2,
          shippingCity,
          shippingState,
          shippingZip,
          shippingCountry: address.country ?? 'US',
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id,
          giftRecipientName: attempt.giftRecipientName,
          giftMessage: attempt.giftMessage,
          referralCode: attempt.referralCode,
          discountCode: attempt.discountCode,
          rewardPointsRedeemed: attempt.rewardPointsRedeemed,
          rewardPointsEarned,
          paidAt: new Date(),
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              skuSnapshot: item.sku,
              nameSnapshot: item.name,
              priceCents: item.priceCents,
              quantity: item.quantity,
            })),
          },
        },
      });
      if (rewardPointsEarned > 0) {
        await tx.customer.update({
          where: { id: customer.id },
          data: { rewardPoints: { increment: rewardPointsEarned } },
        });
        await tx.rewardLedger.create({
          data: {
            customerId: customer.id,
            orderId: order.id,
            points: rewardPointsEarned,
            reason: 'ORDER_EARNED',
            description: `Earned on order ${order.orderNumber}`,
          },
        });
      }
      if (attempt.rewardPointsRedeemed > 0)
        await tx.rewardLedger.create({
          data: {
            customerId: customer.id,
            orderId: order.id,
            points: -attempt.rewardPointsRedeemed,
            reason: 'ORDER_REDEEMED',
            description: `Used on order ${order.orderNumber}`,
          },
        });
      if (isFirstOrder && attempt.referralCode) {
        const referrer = await tx.customer.findUnique({
          where: { referralCode: attempt.referralCode },
        });
        if (referrer && referrer.id !== customer.id) {
          const bonusPoints = 100;
          await tx.referral.create({
            data: {
              codeSnapshot: attempt.referralCode,
              referrerId: referrer.id,
              referredCustomerId: customer.id,
              orderId: order.id,
              bonusPoints,
            },
          });
          await tx.customer.update({
            where: { id: referrer.id },
            data: { rewardPoints: { increment: bonusPoints } },
          });
          await tx.customer.update({
            where: { id: customer.id },
            data: { rewardPoints: { increment: bonusPoints } },
          });
          await tx.rewardLedger.createMany({
            data: [
              {
                customerId: referrer.id,
                orderId: order.id,
                points: bonusPoints,
                reason: 'REFERRAL_BONUS',
                description: 'A friend placed their first order',
              },
              {
                customerId: customer.id,
                orderId: order.id,
                points: bonusPoints,
                reason: 'REFERRED_BONUS',
                description: 'Welcome referral bonus',
              },
            ],
          });
        }
      }
      if (attempt.discountCode === 'SWEETSTART') {
        const redeemed = await tx.newsletterSubscriber.updateMany({
          where: {
            email: customerEmail,
            offerReservedAttemptId: attempt.id,
            offerRedeemedAt: null,
          },
          data: {
            offerRedeemedAt: new Date(),
            offerReservedAttemptId: null,
            offerReservedUntil: null,
          },
        });
        if (redeemed.count !== 1)
          throw new Error('Signup offer reservation is missing');
      }
      await tx.checkoutAttempt.update({
        where: { id: attempt.id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
      await tx.auditLog.create({
        data: {
          action: 'order.paid',
          resourceType: 'order',
          resourceId: order.id,
          metadata: { stripeSessionId: session.id },
        },
      });
      return {
        email: order.email,
        orderNumber: order.orderNumber,
        totalCents: order.totalCents,
        rewardPointsEarned,
        referralCode: customerWithCode.referralCode,
        giftRecipientName: order.giftRecipientName,
      };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
  if (confirmedOrder)
    await sendOrderConfirmation(confirmedOrder).catch((error) =>
      console.error('order_confirmation_email_failed', {
        orderNumber: confirmedOrder.orderNumber,
        error,
      }),
    );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature)
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      getStripeEnv().webhookSecret ?? '',
    );
  } catch {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }
  try {
    if (event.type === 'checkout.session.completed')
      await completeOrder(event, event.data.object);
    else if (event.type === 'checkout.session.expired')
      await releaseReservation(event, event.data.object);
    else
      await db.webhookEvent.create({
        data: { id: event.id, provider: 'stripe', eventType: event.type },
      });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    )
      return NextResponse.json({ received: true });
    console.error('stripe_webhook_failed', {
      eventId: event.id,
      eventType: event.type,
      error,
    });
    return NextResponse.json(
      { error: 'Webhook processing failed.' },
      { status: 500 },
    );
  }
  return NextResponse.json({ received: true });
}
