import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { requireAdmin } from '@/lib/server/admin-auth';
import { db } from '@/lib/server/db';
import {
  buildProductWorkbook,
  parseProductWorkbook,
  pipeList,
} from '@/lib/server/product-workbook';

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const products = await db.product.findMany({
    include: {
      images: { orderBy: { position: 'asc' }, take: 1 },
      variants: { orderBy: { position: 'asc' } },
    },
    orderBy: { name: 'asc' },
  });
  const productRows = products.map((product) => ({
    slug: product.slug,
    sku: product.sku ?? '',
    brand: product.brand,
    product_family: product.productFamily ?? '',
    flavor: product.flavor ?? '',
    name: product.name,
    category: product.category,
    status: product.status,
    price_usd: product.priceCents / 100,
    stock_qty: product.stockQty,
    low_stock_at: product.lowStockAt,
    net_weight: product.netWeight,
    tagline: product.tagline ?? '',
    description: product.description,
    ingredients: product.ingredients,
    allergens_pipe: product.allergens.join('|'),
    seasonal: product.isSeasonal,
    accent_color: product.accentColor,
    available_from: product.availableFrom ?? '',
    available_to: product.availableTo ?? '',
    image_url: product.images[0]?.url ?? '',
  }));
  const variantRows = products.flatMap((product) =>
    product.variants.map((variant) => ({
      product_slug: product.slug,
      sku: variant.sku,
      size_sig: variant.sizeSig,
      net_weight: variant.netWeight,
      price_usd: variant.priceCents / 100,
      compare_at_usd:
        variant.compareAtCents === null ? '' : variant.compareAtCents / 100,
      stock_qty: variant.stockQty,
      low_stock_at: variant.lowStockAt,
      is_default: variant.isDefault,
      active: variant.active,
      amazon_skus_pipe: variant.amazonSkus.join('|'),
      shopify_skus_pipe: variant.shopifySkus.join('|'),
      tiktok_skus_pipe: variant.tiktokSkus.join('|'),
      temu_skus_pipe: variant.temuSkus.join('|'),
    })),
  );
  const file = await buildProductWorkbook(productRows, variantRows);
  return new NextResponse(file, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="CandyRama-Product-Catalog.xlsx"',
      'Cache-Control': 'no-store',
    },
  });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const form = await request.formData();
  const file = form.get('file');
  if (
    !(file instanceof File) ||
    file.size > 5_000_000 ||
    !file.name.toLowerCase().endsWith('.xlsx')
  )
    return NextResponse.json(
      { error: 'Upload one .xlsx file smaller than 5 MB.' },
      { status: 400 },
    );
  try {
    const { products, variants } = await parseProductWorkbook(
      Buffer.from(await file.arrayBuffer()),
    );
    const result = await db.$transaction(
      async (tx) => {
        let created = 0,
          updated = 0,
          variantsCreated = 0,
          variantsUpdated = 0;
        const productsBySlug = new Map<string, { id: string }>();
        for (const row of products) {
          const existing = await tx.product.findUnique({
            where: { slug: row.slug },
          });
          const availableFrom = row.available_from
            ? new Date(row.available_from)
            : null;
          const availableTo = row.available_to
            ? new Date(row.available_to)
            : null;
          const data = {
            sku: row.sku || null,
            brand: row.brand,
            productFamily: row.product_family || null,
            flavor: row.flavor || null,
            name: row.name,
            category: row.category,
            status: row.status,
            priceCents: Math.round(row.price_usd * 100),
            stockQty: row.stock_qty,
            lowStockAt: row.low_stock_at,
            netWeight: row.net_weight,
            tagline: row.tagline || null,
            description: row.description,
            ingredients: row.ingredients,
            allergens: pipeList(row.allergens_pipe),
            isSeasonal: row.seasonal,
            accentColor: row.accent_color.toUpperCase(),
            availableFrom,
            availableTo,
          };
          if (existing) {
            const saved = await tx.product.update({
              where: { id: existing.id },
              data,
            });
            productsBySlug.set(row.slug, saved);
            updated++;
            if (existing.stockQty !== row.stock_qty)
              await tx.stockMovement.create({
                data: {
                  productId: existing.id,
                  delta: row.stock_qty - existing.stockQty,
                  reason: 'ADMIN_WORKBOOK_IMPORT',
                  actorId: admin.userId,
                },
              });
          } else {
            const saved = await tx.product.create({
              data: { slug: row.slug, ...data },
            });
            productsBySlug.set(row.slug, saved);
            created++;
          }
        }
        for (const row of variants) {
          const product = productsBySlug.get(row.product_slug);
          if (!product)
            throw new Error(
              `Variant ${row.sku} references missing product ${row.product_slug}.`,
            );
          const existing = await tx.productVariant.findUnique({
            where: { sku: row.sku },
          });
          if (existing && existing.productId !== product.id)
            throw new Error(
              `Variant SKU ${row.sku} already belongs to another product.`,
            );
          if (row.is_default)
            await tx.productVariant.updateMany({
              where: {
                productId: product.id,
                isDefault: true,
                NOT: { sku: row.sku },
              },
              data: { isDefault: false },
            });
          const data = {
            productId: product.id,
            sizeSig: row.size_sig,
            netWeight: row.net_weight,
            priceCents: Math.round(row.price_usd * 100),
            compareAtCents:
              row.compare_at_usd === null
                ? null
                : Math.round(row.compare_at_usd * 100),
            stockQty: row.stock_qty,
            lowStockAt: row.low_stock_at,
            isDefault: row.is_default,
            active: row.active,
            amazonSkus: pipeList(row.amazon_skus_pipe),
            shopifySkus: pipeList(row.shopify_skus_pipe),
            tiktokSkus: pipeList(row.tiktok_skus_pipe),
            temuSkus: pipeList(row.temu_skus_pipe),
          };
          if (existing) {
            await tx.productVariant.update({
              where: { id: existing.id },
              data,
            });
            variantsUpdated++;
            if (existing.stockQty !== row.stock_qty)
              await tx.stockMovement.create({
                data: {
                  productId: product.id,
                  variantId: existing.id,
                  delta: row.stock_qty - existing.stockQty,
                  reason: 'ADMIN_WORKBOOK_IMPORT',
                  actorId: admin.userId,
                },
              });
          } else {
            const saved = await tx.productVariant.create({
              data: { sku: row.sku, ...data },
            });
            variantsCreated++;
            if (row.stock_qty > 0)
              await tx.stockMovement.create({
                data: {
                  productId: product.id,
                  variantId: saved.id,
                  delta: row.stock_qty,
                  reason: 'ADMIN_WORKBOOK_IMPORT',
                  actorId: admin.userId,
                },
              });
          }
        }
        await tx.auditLog.create({
          data: {
            actorId: admin.userId,
            action: 'products.workbook_imported',
            resourceType: 'product',
            metadata: {
              created,
              updated,
              variantsCreated,
              variantsUpdated,
              productRows: products.length,
              variantRows: variants.length,
            },
          },
        });
        return {
          created,
          updated,
          variantsCreated,
          variantsUpdated,
          total: products.length,
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    return NextResponse.json({ data: result });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'The workbook could not be imported.',
      },
      { status: 400 },
    );
  }
}
