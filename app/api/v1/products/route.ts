import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function GET() {
  const products = await db.product.findMany({ where: { status: 'ACTIVE' }, include: { images: { orderBy: { position: 'asc' } } }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ data: products.map(({ priceCents, compareAtCents, stockQty, ...product }) => ({ ...product, priceCents, compareAtCents, available: stockQty > 0 })) }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
}
