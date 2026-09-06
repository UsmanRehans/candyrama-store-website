import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function GET() {
  const products = await db.product.findMany({
    where: { status: 'ACTIVE' },
    include: {
      images: { orderBy: { position: 'asc' } },
      variants: {
        where: { active: true },
        orderBy: [{ isDefault: 'desc' }, { position: 'asc' }],
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(
    {
      data: products.map(
        ({ priceCents, compareAtCents, stockQty, variants, ...product }) => {
          const preferred = variants[0];
          return {
            ...product,
            priceCents: preferred?.priceCents ?? priceCents,
            compareAtCents: preferred?.compareAtCents ?? compareAtCents,
            available: (preferred?.stockQty ?? stockQty) > 0,
            variants: variants.map(({ stockQty, ...variant }) => ({
              ...variant,
              available: stockQty > 0,
            })),
          };
        },
      ),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    },
  );
}
