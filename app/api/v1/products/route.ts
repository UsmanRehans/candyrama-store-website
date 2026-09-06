import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function GET() {
  const products = await db.product.findMany({
    where: { status: 'ACTIVE' },
    include: {
      images: { orderBy: { position: 'asc' } },
      variants: {
        where: {
          active: true,
          priceCents: { not: null },
          stockQty: { not: null },
        },
        orderBy: [{ isDefault: 'desc' }, { position: 'asc' }],
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(
    {
      data: products.flatMap(
        ({
          priceCents: _legacyPrice,
          compareAtCents: _legacyCompareAt,
          stockQty: _legacyStock,
          lowStockAt: _legacyLowStock,
          netWeight: _legacyWeight,
          stripePriceId: _legacyStripePrice,
          categoryConfidence: _categoryConfidence,
          sourceMasterSkus: _sourceMasterSkus,
          variants,
          ...product
        }) => {
          const preferred = variants[0];
          if (
            !preferred ||
            preferred.priceCents === null ||
            preferred.stockQty === null
          )
            return [];
          return [
            {
              ...product,
              priceCents: preferred.priceCents,
              compareAtCents: preferred.compareAtCents,
              available: preferred.stockQty > 0,
              variants: variants.map(
                ({
                  stockQty,
                  stripePriceId: _stripePriceId,
                  amazonSkus: _amazonSkus,
                  shopifySkus: _shopifySkus,
                  tiktokSkus: _tiktokSkus,
                  temuSkus: _temuSkus,
                  lowStockAt: _lowStockAt,
                  ...variant
                }) => ({
                  ...variant,
                  available: stockQty !== null && stockQty > 0,
                }),
              ),
            },
          ];
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
