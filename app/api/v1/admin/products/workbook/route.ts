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
    name: product.name,
    brand: product.brand,
    product_family: product.productFamily ?? '',
    flavor: product.flavor ?? '',
    candyrama_category: product.category,
    category_confidence: product.categoryConfidence,
    status: product.status,
    tagline: product.tagline ?? '',
    description: product.description,
    ingredients: product.ingredients,
    allergens_pipe: product.allergens.join('|'),
    seasonal: product.isSeasonal,
    accent_color: product.accentColor,
    source_master_skus: product.sourceMasterSkus.join('|'),
    available_from: product.availableFrom ?? '',
    available_to: product.availableTo ?? '',
    image_url: product.images[0]?.url ?? '',
  }));
  const variantRows = products.flatMap((product) =>
    product.variants.map((variant) => ({
      product_sku: product.sku ?? '',
      variant_sku: variant.sku,
      size_sig: variant.sizeSig ?? '',
      is_default: variant.isDefault,
      active: variant.active,
      position: variant.position,
      net_weight: variant.netWeight ?? '',
      price_usd: variant.priceCents === null ? '' : variant.priceCents / 100,
      compare_at_usd:
        variant.compareAtCents === null ? '' : variant.compareAtCents / 100,
      stock_qty: variant.stockQty ?? '',
      low_stock_at: variant.lowStockAt,
      stripe_price_id: variant.stripePriceId ?? '',
      amazon_skus: variant.amazonSkus.join('|'),
      shopify_skus: variant.shopifySkus.join('|'),
      tiktok_skus: variant.tiktokSkus.join('|'),
      temu_skus: variant.temuSkus.join('|'),
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
        const productsBySku = new Map<string, { id: string }>();
        for (const row of products) {
          const bySku = await tx.product.findUnique({
            where: { sku: row.sku },
          });
          const bySlug = await tx.product.findUnique({
            where: { slug: row.slug },
          });
          if (bySku && bySlug && bySku.id !== bySlug.id)
            throw new Error(
              `Product SKU ${row.sku} and slug ${row.slug} identify different products.`,
            );
          const existing = bySku ?? bySlug;
          const data = {
            sku: row.sku,
            brand: row.brand,
            productFamily: row.product_family,
            flavor: row.flavor,
            name: row.name,
            category: row.candyrama_category,
            categoryConfidence: row.category_confidence,
            sourceMasterSkus: pipeList(row.source_master_skus),
            status: row.status,
            tagline: row.tagline || null,
            description: row.description,
            ingredients: row.ingredients,
            allergens: pipeList(row.allergens_pipe),
            isSeasonal: row.seasonal,
            accentColor: row.accent_color.toUpperCase(),
            availableFrom: row.available_from
              ? new Date(row.available_from)
              : null,
            availableTo: row.available_to ? new Date(row.available_to) : null,
          };
          const saved = existing
            ? await tx.product.update({ where: { id: existing.id }, data })
            : await tx.product.create({ data: { slug: row.slug, ...data } });
          if (existing) updated++;
          else created++;
          productsBySku.set(row.sku, saved);
        }

        for (const row of variants) {
          const product = productsBySku.get(row.product_sku);
          if (!product)
            throw new Error(
              `Variant ${row.variant_sku} references missing product ${row.product_sku}.`,
            );
          const existing = await tx.productVariant.findUnique({
            where: { sku: row.variant_sku },
          });
          if (existing && existing.productId !== product.id)
            throw new Error(
              `Variant SKU ${row.variant_sku} already belongs to another product.`,
            );
          if (row.active && row.is_default)
            await tx.productVariant.updateMany({
              where: {
                productId: product.id,
                active: true,
                isDefault: true,
                NOT: { sku: row.variant_sku },
              },
              data: { isDefault: false },
            });
          const data = {
            productId: product.id,
            sizeSig: row.size_sig || null,
            netWeight: row.net_weight || null,
            priceCents:
              row.price_usd === null ? null : Math.round(row.price_usd * 100),
            compareAtCents:
              row.compare_at_usd === null
                ? null
                : Math.round(row.compare_at_usd * 100),
            stockQty: row.stock_qty,
            lowStockAt: row.low_stock_at,
            stripePriceId: row.stripe_price_id || null,
            position: row.position,
            isDefault: row.is_default,
            active: row.active,
            amazonSkus: pipeList(row.amazon_skus),
            shopifySkus: pipeList(row.shopify_skus),
            tiktokSkus: pipeList(row.tiktok_skus),
            temuSkus: pipeList(row.temu_skus),
          };
          const saved = existing
            ? await tx.productVariant.update({
                where: { id: existing.id },
                data,
              })
            : await tx.productVariant.create({
                data: { sku: row.variant_sku, ...data },
              });
          if (existing) variantsUpdated++;
          else variantsCreated++;
          if (row.stock_qty !== null && row.stock_qty !== existing?.stockQty) {
            await tx.stockMovement.create({
              data: {
                productId: product.id,
                variantId: saved.id,
                delta: row.stock_qty - (existing?.stockQty ?? 0),
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
          productRows: products.length,
          variantRows: variants.length,
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
