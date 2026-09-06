import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/admin-auth';
import { db } from '@/lib/server/db';

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const orders = await db.order.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      orderNumber: true,
      email: true,
      status: true,
      totalCents: true,
      shippingName: true,
      shippingCity: true,
      shippingState: true,
      createdAt: true,
      carrier: true,
      serviceLevel: true,
      trackingNumber: true,
      shippingLabelUrl: true,
      items: {
        select: {
          id: true,
          nameSnapshot: true,
          skuSnapshot: true,
          quantity: true,
        },
      },
    },
  });
  return NextResponse.json(
    { data: orders },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
