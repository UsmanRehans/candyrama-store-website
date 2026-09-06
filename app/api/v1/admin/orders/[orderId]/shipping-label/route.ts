import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/admin-auth';
import {
  buyCheapestLabel,
  missingShippingOriginFields,
  quoteCheapestLabel,
} from '@/lib/server/shipstation';
import { sendShippingConfirmation } from '@/lib/server/email';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const admin = await requireAdmin(request);
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const missingOrigin = missingShippingOriginFields();
  if (missingOrigin.length > 0)
    return NextResponse.json(
      {
        error: `Shipping origin is incomplete. Configure: ${missingOrigin.join(', ')}.`,
      },
      { status: 503 },
    );
  const { orderId } = await params;
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true, customer: true },
  });
  if (!order || !['PAID', 'PACKING'].includes(order.status))
    return NextResponse.json(
      { error: 'Order is not ready for a shipping quote.' },
      { status: 409 },
    );
  if (order.shippingLabelUrl)
    return NextResponse.json(
      { error: 'A label already exists for this order.' },
      { status: 409 },
    );
  try {
    const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const quote = await quoteCheapestLabel(
      order.orderNumber,
      {
        name: order.shippingName,
        phone: order.customer?.phone,
        street1: order.shippingLine1,
        street2: order.shippingLine2,
        city: order.shippingCity,
        state: order.shippingState,
        zip: order.shippingZip,
        country: order.shippingCountry,
      },
      quantity * 8 + 4,
    );
    return NextResponse.json(
      { data: quote },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('shipping_rate_quote_failed', { orderId, error });
    return NextResponse.json(
      { error: 'Unable to retrieve shipping rates.' },
      { status: 502 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const admin = await requireAdmin(request);
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const missingOrigin = missingShippingOriginFields();
  if (missingOrigin.length > 0)
    return NextResponse.json(
      {
        error: `Shipping origin is incomplete. Configure: ${missingOrigin.join(', ')}.`,
      },
      { status: 503 },
    );
  const { orderId } = await params;
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true, customer: true },
  });
  if (!order || order.status !== 'PAID')
    return NextResponse.json(
      { error: 'Order cannot be shipped.' },
      { status: 409 },
    );
  if (order.shippingLabelUrl)
    return NextResponse.json(
      { error: 'A label already exists for this order.' },
      { status: 409 },
    );
  try {
    const lock = await db.order.updateMany({
      where: { id: order.id, status: 'PAID', shippingLabelUrl: null },
      data: { status: 'PACKING' },
    });
    if (lock.count !== 1)
      return NextResponse.json(
        { error: 'Label creation is already in progress.' },
        { status: 409 },
      );
    const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const label = await buyCheapestLabel(
      order.orderNumber,
      {
        name: order.shippingName,
        phone: order.customer?.phone,
        street1: order.shippingLine1,
        street2: order.shippingLine2,
        city: order.shippingCity,
        state: order.shippingState,
        zip: order.shippingZip,
        country: order.shippingCountry,
      },
      quantity * 8 + 4,
    );
    const updated = await db.order.update({
      where: { id: order.id },
      data: {
        carrier: label.carrier,
        serviceLevel: label.serviceLevel,
        trackingNumber: label.trackingNumber,
        shippingLabelUrl: label.labelUrl,
        status: 'PACKING',
      },
    });
    await db.auditLog.create({
      data: {
        actorId: admin.userId,
        action: 'shipping.label_purchased',
        resourceType: 'order',
        resourceId: order.id,
        metadata: { carrier: label.carrier, serviceLevel: label.serviceLevel },
      },
    });
    await sendShippingConfirmation({
      email: order.email,
      orderNumber: order.orderNumber,
      carrier: label.carrier,
      trackingNumber: label.trackingNumber,
    }).catch((error) =>
      console.error('shipping_confirmation_email_failed', {
        orderNumber: order.orderNumber,
        error,
      }),
    );
    return NextResponse.json({
      data: {
        orderNumber: updated.orderNumber,
        carrier: updated.carrier,
        serviceLevel: updated.serviceLevel,
        trackingNumber: updated.trackingNumber,
        labelUrl: updated.shippingLabelUrl,
      },
    });
  } catch (error) {
    await db.order
      .updateMany({
        where: { id: orderId, status: 'PACKING', shippingLabelUrl: null },
        data: { status: 'PAID' },
      })
      .catch((rollbackError) =>
        console.error('shipping_label_lock_rollback_failed', {
          orderId,
          rollbackError,
        }),
      );
    console.error('shipping_label_failed', { orderId, error });
    return NextResponse.json(
      { error: 'Unable to purchase a shipping label.' },
      { status: 502 },
    );
  }
}
