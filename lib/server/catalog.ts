import 'server-only';
import { db } from './db';
import {
  products as designProducts,
  type StorefrontProduct,
} from '@/lib/products';

function categoryLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
function toneFor(accentColor: string) {
  const color = accentColor.toUpperCase();
  if (color === '#2EC5FF') return 'sky';
  if (color === '#FFD23F') return 'yellow';
  if (color === '#B5622A') return 'copper';
  if (color === '#8ED11F') return 'lime';
  if (color === '#6B1749' || color === '#4E0F34') return 'plum';
  return 'pink';
}

export async function getStorefrontProducts(): Promise<StorefrontProduct[]> {
  const records = await db.product.findMany({
    where: { status: 'ACTIVE' },
    include: {
      images: { orderBy: { position: 'asc' }, take: 1 },
      variants: {
        where: {
          active: true,
          priceCents: { not: null },
          stockQty: { not: null },
        },
        orderBy: [{ isDefault: 'desc' }, { position: 'asc' }],
      },
    },
    orderBy: { createdAt: 'asc' },
  });
  return records.flatMap((record) => {
    const variant = record.variants[0];
    if (!variant || variant.priceCents === null || variant.stockQty === null)
      return [];
    const design = designProducts.find(
      (product) => product.slug === record.slug,
    );
    const priceCents = variant.priceCents;
    return [
      {
        slug: record.slug,
        name: record.name,
        category: categoryLabel(record.category),
        note: record.tagline ?? record.description,
        price: `$${(priceCents / 100).toFixed(2)}`,
        priceCents,
        image:
          record.images[0]?.url ??
          design?.image ??
          '/generated/rainbow-sour-cutout.png',
        tone: design?.tone ?? toneFor(record.accentColor),
        badge: design?.badge,
        netWeight: variant.netWeight ?? undefined,
        available: variant.stockQty > 0,
        variantSku: variant.sku,
      },
    ];
  });
}

export async function getStorefrontProduct(slug: string) {
  return (await getStorefrontProducts()).find(
    (product) => product.slug === slug,
  );
}
