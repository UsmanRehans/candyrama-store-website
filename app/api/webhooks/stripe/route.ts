import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/server/db';
import { requireEnv } from '@/lib/server/env';
import { getStripe } from '@/lib/server/stripe';
import { sendOrderConfirmation } from '@/lib/server/email';

type ReservedItem = { productId: string; name: string; priceCents: number; quantity: number };

async function releaseReservation(event: Stripe.Event, session: Stripe.Checkout.Session) {
  const attemptId = session.metadata?.checkoutAttemptId ?? session.client_reference_id;
  if (!attemptId) return;
  await db.$transaction(async tx => {
    await tx.webhookEvent.create({ data: { id: event.id, provider: 'stripe', eventType: event.type } });
    const attempt = await tx.checkoutAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt || attempt.status !== 'OPEN') return;
    const items = attempt.items as ReservedItem[];
    for (const item of items) {
      await tx.product.update({ where: { id: item.productId }, data: { stockQty: { increment: item.quantity } } });
      await tx.stockMovement.create({ data: { productId: item.productId, delta: item.quantity, reason: 'CHECKOUT_RELEASED' } });
    }
    await tx.checkoutAttempt.update({ where: { id: attempt.id }, data: { status: 'EXPIRED' } });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

async function completeOrder(event: Stripe.Event, session: Stripe.Checkout.Session) {
  if (session.payment_status !== 'paid') return;
  const attemptId = session.metadata?.checkoutAttemptId ?? session.client_reference_id;
  if (!attemptId) throw new Error('Stripe session is missing checkout attempt id');
  const details = session.customer_details;
  const address = session.collected_information?.shipping_details?.address ?? details?.address;
  const shippingName = session.collected_information?.shipping_details?.name ?? details?.name;
  if (!details?.email || !address?.line1 || !address.city || !address.state || !address.postal_code || !shippingName) throw new Error('Stripe session is missing required customer details');
  const customerEmail = details.email.toLowerCase();
  const shippingLine1 = address.line1;
  const shippingCity = address.city;
  const shippingState = address.state;
  const shippingZip = address.postal_code;

  const confirmedOrder = await db.$transaction(async tx => {
    await tx.webhookEvent.create({ data: { id: event.id, provider: 'stripe', eventType: event.type } });
    const attempt = await tx.checkoutAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt || attempt.status !== 'OPEN') return;
    const items = attempt.items as ReservedItem[];
    const sequence = await tx.orderSequence.upsert({ where: { key: 'orders' }, create: { key: 'orders', value: 1001 }, update: { value: { increment: 1 } } });
    const customer = await tx.customer.upsert({ where: { email: customerEmail }, create: { email: customerEmail, name: details.name ?? shippingName, phone: details.phone }, update: { name: details.name ?? shippingName, phone: details.phone } });
    const order = await tx.order.create({ data: {
      orderNumber: `CR-${String(sequence.value).padStart(6, '0')}`, customerId: customer.id, email: customerEmail, status: 'PAID',
      subtotalCents: attempt.subtotalCents, discountCents: session.total_details?.amount_discount ?? 0, shippingCents: session.shipping_cost?.amount_total ?? attempt.shippingCents,
      taxCents: session.total_details?.amount_tax ?? 0, totalCents: session.amount_total ?? attempt.subtotalCents + attempt.shippingCents,
      shippingName, shippingLine1, shippingLine2: address.line2, shippingCity, shippingState,
      shippingZip, shippingCountry: address.country ?? 'US', stripeSessionId: session.id,
      stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id, paidAt: new Date(),
      items: { create: items.map(item => ({ productId: item.productId, nameSnapshot: item.name, priceCents: item.priceCents, quantity: item.quantity })) },
    }});
    await tx.checkoutAttempt.update({ where: { id: attempt.id }, data: { status: 'COMPLETED', completedAt: new Date() } });
    await tx.auditLog.create({ data: { action: 'order.paid', resourceType: 'order', resourceId: order.id, metadata: { stripeSessionId: session.id } } });
    return { email: order.email, orderNumber: order.orderNumber, totalCents: order.totalCents };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  if (confirmedOrder) await sendOrderConfirmation(confirmedOrder).catch(error => console.error('order_confirmation_email_failed', { orderNumber: confirmedOrder.orderNumber, error }));
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  let event: Stripe.Event;
  try { event = getStripe().webhooks.constructEvent(body, signature, requireEnv('STRIPE_WEBHOOK_SECRET')); }
  catch { return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 }); }
  try {
    if (event.type === 'checkout.session.completed') await completeOrder(event, event.data.object);
    else if (event.type === 'checkout.session.expired') await releaseReservation(event, event.data.object);
    else await db.webhookEvent.create({ data: { id: event.id, provider: 'stripe', eventType: event.type } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ received: true });
    console.error('stripe_webhook_failed', { eventId: event.id, eventType: event.type, error });
    return NextResponse.json({ error: 'Webhook processing failed.' }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
