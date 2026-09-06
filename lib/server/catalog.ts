import 'server-only';
import { db } from './db';
import {
  products as designProducts,
  type StorefrontProduct,
} from '@/lib/products';
import { env } from './env';

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

function stableProductImageUrl(image: string) {
  return image.startsWith('/generated/')
    ? `https://candyrama-store.vercel.app${image}`
    : image;
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
    const variants = record.variants.flatMap((item) => {
      if (item.priceCents === null || item.stockQty === null) return [];
      return [
        {
          sku: item.sku,
          label: item.netWeight ?? item.sizeSig ?? 'Standard',
          price: `$${(item.priceCents / 100).toFixed(2)}`,
          priceCents: item.priceCents,
          netWeight: item.netWeight ?? undefined,
          available: env.STORE_PURCHASING_ENABLED && item.stockQty > 0,
        },
      ];
    });
    return [
      {
        slug: record.slug,
        name: record.name,
        category: categoryLabel(record.category),
        note: record.tagline ?? record.description,
        price: `$${(priceCents / 100).toFixed(2)}`,
        priceCents,
        image: stableProductImageUrl(
          record.images[0]?.url ??
            design?.image ??
            '/generated/rainbow-sour-cutout.png',
        ),
        tone: design?.tone ?? toneFor(record.accentColor),
        badge: design?.badge,
        netWeight: variant.netWeight ?? undefined,
        available: env.STORE_PURCHASING_ENABLED && variant.stockQty > 0,
        variantSku: variant.sku,
        purchaseEnabled: env.STORE_PURCHASING_ENABLED,
        variants,
      },
    ];
  });
}

export async function getStorefrontProduct(slug: string) {
  return (await getStorefrontProducts()).find(
    (product) => product.slug === slug,
  );
}
