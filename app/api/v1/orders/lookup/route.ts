import { NextRequest, NextResponse } from 'next/server';
import { orderLookupSchema } from '@/lib/schemas/commerce';
import { db } from '@/lib/server/db';

export async function POST(request: NextRequest) {
  const parsed = orderLookupSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  const order = await db.order.findFirst({ where: { orderNumber: parsed.data.orderNumber, email: parsed.data.email.toLowerCase() }, select: { orderNumber: true, status: true, carrier: true, trackingNumber: true, shippedAt: true, createdAt: true } });
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  return NextResponse.json({ data: order }, { headers: { 'Cache-Control': 'no-store' } });
}
