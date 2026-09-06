import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { getSupabaseAdmin } from '@/lib/server/supabase';

export async function GET(request: NextRequest) {
  const token = request.headers
    .get('authorization')
    ?.replace(/^Bearer\s+/i, '');
  if (!token)
    return NextResponse.json(
      { error: 'Sign in to see your orders.' },
      { status: 401 },
    );

  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  const email = data.user?.email?.toLowerCase();
  if (error || !email)
    return NextResponse.json(
      { error: 'Your session has expired.' },
      { status: 401 },
    );

  const [orders, customer] = await Promise.all([
    db.order.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalCents: true,
        discountCents: true,
        createdAt: true,
        shippedAt: true,
        carrier: true,
        trackingNumber: true,
        items: {
          select: {
            id: true,
            nameSnapshot: true,
            quantity: true,
            priceCents: true,
          },
        },
      },
    }),
    db.customer.findUnique({
      where: { email },
      select: { rewardPoints: true, referralCode: true },
    }),
  ]);

  return NextResponse.json(
    {
      data: {
        email,
        rewardPoints: customer?.rewardPoints ?? 0,
        referralCode: customer?.referralCode ?? null,
        orders,
      },
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
