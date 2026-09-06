import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/server/admin-auth';
import { db } from '@/lib/server/db';

const createProductSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(100),
  sku: z
    .string()
    .min(1)
    .max(180)
    .refine((value) => value === value.trim()),
  name: z.string().min(2).max(160),
  brand: z.enum(['TWISTED_TREATZ', 'OTHER_IP']).default('TWISTED_TREATZ'),
  productFamily: z.string().min(1).max(160),
  flavor: z.string().min(1).max(160),
  category: z.enum([
    'GUMMIES',
    'SOUR',
    'SPICY',
    'BRITTLE',
    'BARK',
    'CHOCOLATE',
    'CHEWS',
    'GIFT_BOXES',
    'SEASONAL',
  ]),
  categoryConfidence: z.enum(['HIGH', 'REVIEW']).default('REVIEW'),
  variantSku: z.string().max(180).optional(),
  sizeSig: z.string().max(100).optional(),
  netWeight: z.string().max(80).optional(),
});

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  const query =
    new URL(request.url).searchParams.get('q')?.trim().slice(0, 160) ?? '';
  const products = await db.product.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { slug: { contains: query, mode: 'insensitive' } },
            { sku: { contains: query, mode: 'insensitive' } },
            { productFamily: { contains: query, mode: 'insensitive' } },
            { flavor: { contains: query, mode: 'insensitive' } },
            {
              variants: {
                some: { sku: { contains: query, mode: 'insensitive' } },
              },
            },
          ],
        }
      : undefined,
    include: {
      images: { orderBy: { position: 'asc' } },
      variants: { orderBy: [{ isDefault: 'desc' }, { position: 'asc' }] },
    },
    orderBy: [{ updatedAt: 'desc' }, { name: 'asc' }],
    take: 50,
  });
  return NextResponse.json({ data: products });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    const input = createProductSchema.parse(await request.json());
    if (input.brand === 'OTHER_IP')
      return NextResponse.json(
        {
          error:
            'Other (IP) products are outside the approved CandyRama scope.',
        },
        { status: 400 },
      );
    const variantSku = input.variantSku?.trim();
    const product = await db.product.create({
      data: {
        slug: input.slug,
        sku: input.sku,
        name: input.name,
        brand: input.brand,
        productFamily: input.productFamily,
        flavor: input.flavor,
        category: input.category,
        categoryConfidence: input.categoryConfidence,
        status: 'DRAFT',
        description: '',
        ingredients: '',
        allergens: [],
        ...(variantSku
          ? {
              variants: {
                create: {
                  sku: variantSku,
                  sizeSig: input.sizeSig?.trim() || null,
                  netWeight: input.netWeight?.trim() || null,
                  isDefault: true,
                  active: false,
                },
              },
            }
          : {}),
      },
      include: { images: true, variants: true },
    });
    await db.auditLog.create({
      data: {
        actorId: admin.userId,
        action: 'product.created',
        resourceType: 'product',
        resourceId: product.id,
        metadata: { sku: product.sku, variantSku: variantSku ?? null },
      },
    });
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    if (error && typeof error === 'object' && 'issues' in error)
      return NextResponse.json(
        { error: 'Check the required product fields.' },
        { status: 400 },
      );
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    )
      return NextResponse.json(
        { error: 'That slug or SKU already exists.' },
        { status: 409 },
      );
    console.error('admin_product_create_failed', error);
    return NextResponse.json(
      { error: 'Product creation failed.' },
      { status: 500 },
    );
  }
}
