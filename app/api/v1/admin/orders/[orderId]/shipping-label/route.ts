import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { requireAdmin } from '@/lib/server/admin-auth';
import { buyCheapestLabel } from '@/lib/server/shipstation';

export async function POST(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const { orderId } = await params;
  const order = await db.order.findUnique({ where: { id: orderId }, include: { items: true, customer: true } });
  if (!order || !['PAID', 'PACKING'].includes(order.status)) return NextResponse.json({ error: 'Order cannot be shipped.' }, { status: 409 });
  if (order.shippingLabelUrl) return NextResponse.json({ error: 'A label already exists for this order.' }, { status: 409 });
  try {
    const quantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const label = await buyCheapestLabel(order.orderNumber, { name: order.shippingName, phone: order.customer?.phone, street1: order.shippingLine1, street2: order.shippingLine2, city: order.shippingCity, state: order.shippingState, zip: order.shippingZip, country: order.shippingCountry }, quantity * 8 + 4);
    const updated = await db.order.update({ where: { id: order.id }, data: { carrier: label.carrier, serviceLevel: label.serviceLevel, trackingNumber: label.trackingNumber, shippingLabelUrl: label.labelUrl, status: 'PACKING' } });
    await db.auditLog.create({ data: { actorId: admin.userId, action: 'shipping.label_purchased', resourceType: 'order', resourceId: order.id, metadata: { carrier: label.carrier, serviceLevel: label.serviceLevel } } });
    return NextResponse.json({ data: { orderNumber: updated.orderNumber, carrier: updated.carrier, serviceLevel: updated.serviceLevel, trackingNumber: updated.trackingNumber, labelUrl: updated.shippingLabelUrl } });
  } catch (error) { console.error('shipping_label_failed', { orderId, error }); return NextResponse.json({ error: 'Unable to purchase a shipping label.' }, { status: 502 }); }
}
