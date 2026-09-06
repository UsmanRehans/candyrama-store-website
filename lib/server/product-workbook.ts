import 'server-only';
import ExcelJS from 'exceljs';
import { z } from 'zod';

export const productColumns = [
  'slug',
  'sku',
  'name',
  'brand',
  'product_family',
  'flavor',
  'candyrama_category',
  'category_confidence',
  'status',
  'tagline',
  'description',
  'ingredients',
  'allergens_pipe',
  'seasonal',
  'accent_color',
  'source_master_skus',
  'available_from',
  'available_to',
  'image_url',
] as const;

export const variantColumns = [
  'product_sku',
  'variant_sku',
  'size_sig',
  'is_default',
  'active',
  'position',
  'net_weight',
  'price_usd',
  'compare_at_usd',
  'stock_qty',
  'low_stock_at',
  'stripe_price_id',
  'amazon_skus',
  'shopify_skus',
  'tiktok_skus',
  'temu_skus',
] as const;

const categories = [
  'GUMMIES',
  'SOUR',
  'SPICY',
  'BRITTLE',
  'BARK',
  'CHOCOLATE',
  'CHEWS',
  'GIFT_BOXES',
  'SEASONAL',
] as const;
const statuses = ['DRAFT', 'ACTIVE', 'ARCHIVED'] as const;
const brands = ['TWISTED_TREATZ', 'OTHER_IP'] as const;
const booleanValue = z
  .union([z.boolean(), z.enum(['TRUE', 'FALSE', 'true', 'false'])])
  .transform((value) =>
    typeof value === 'boolean' ? value : value.toLowerCase() === 'true',
  );
const optionalNumber = z
  .union([z.literal(''), z.coerce.number().min(0).max(100000)])
  .transform((value) => (value === '' ? null : value));
const optionalInteger = z
  .union([z.literal(''), z.coerce.number().int().min(0).max(100000)])
  .transform((value) => (value === '' ? null : value));
const exactSku = z
  .string()
  .min(1)
  .max(180)
  .refine(
    (value) => value === value.trim(),
    'must not have leading or trailing whitespace',
  );

export const productRowSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(100),
  sku: exactSku,
  name: z.string().min(2).max(160),
  brand: z.enum(brands),
  product_family: z.string().min(1).max(160),
  flavor: z.string().min(1).max(160),
  candyrama_category: z.enum(categories),
  category_confidence: z.enum(['HIGH', 'REVIEW']),
  status: z.enum(statuses),
  tagline: z.string().max(300).default(''),
  description: z.string().max(10000),
  ingredients: z.string().max(10000),
  allergens_pipe: z.string().max(2000).default(''),
  seasonal: booleanValue,
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  source_master_skus: z.string().max(4000).default(''),
  available_from: z.union([z.string(), z.date()]).optional().nullable(),
  available_to: z.union([z.string(), z.date()]).optional().nullable(),
  image_url: z.string().optional().default(''),
});

export const variantRowSchema = z
  .object({
    product_sku: exactSku,
    variant_sku: exactSku,
    size_sig: z.string().max(100),
    is_default: booleanValue,
    active: booleanValue,
    position: z.coerce.number().int().min(0).max(100000),
    net_weight: z.string().max(80),
    price_usd: optionalNumber,
    compare_at_usd: optionalNumber,
    stock_qty: optionalInteger,
    low_stock_at: z.coerce.number().int().min(0).max(100000),
    stripe_price_id: z.string().max(255).default(''),
    amazon_skus: z.string().max(4000).default(''),
    shopify_skus: z.string().max(4000).default(''),
    tiktok_skus: z.string().max(4000).default(''),
    temu_skus: z.string().max(4000).default(''),
  })
  .superRefine((row, context) => {
    if (row.active && (row.price_usd === null || row.stock_qty === null))
      context.addIssue({
        code: 'custom',
        message: 'active variants require price_usd and stock_qty',
      });
    if (
      row.compare_at_usd !== null &&
      row.price_usd !== null &&
      row.compare_at_usd <= row.price_usd
    )
      context.addIssue({
        code: 'custom',
        message: 'compare_at_usd must be greater than price_usd',
      });
  });

export type WorkbookProductRow = z.infer<typeof productRowSchema>;
export type WorkbookVariantRow = z.infer<typeof variantRowSchema>;

function excelDate(value: unknown) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string' || typeof value === 'number')
    return String(value);
  return '';
}

function verifyHeaders(sheet: ExcelJS.Worksheet, columns: readonly string[]) {
  const headers = (sheet.getRow(1).values as unknown[]).slice(1).map(String);
  if (
    headers.length !== columns.length ||
    columns.some((column, index) => headers[index] !== column)
  )
    throw new Error(
      `The ${sheet.name} columns were changed or reordered. Download a fresh workbook.`,
    );
}

function styleHeader(sheet: ExcelJS.Worksheet, lastColumn: string) {
  sheet.autoFilter = { from: 'A1', to: `${lastColumn}1` };
  sheet.getRow(1).height = 32;
  sheet.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4E0F34' },
    };
    cell.font = { name: 'Arial', bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true,
    };
  });
}

export function pipeList(value: string) {
  return value
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function parseProductWorkbook(buffer: Buffer) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
  const productSheet = workbook.getWorksheet('Products');
  const variantSheet = workbook.getWorksheet('Variants');
  if (!productSheet || !variantSheet)
    throw new Error('The workbook must contain Products and Variants sheets.');
  verifyHeaders(productSheet, productColumns);
  verifyHeaders(variantSheet, variantColumns);
  const products: WorkbookProductRow[] = [];
  const variants: WorkbookVariantRow[] = [];
  const errors: string[] = [];

  for (
    let number = 2;
    number <= Math.min(productSheet.rowCount, 501);
    number++
  ) {
    const values = productSheet.getRow(number).values as unknown[];
    if (!values[1]) continue;
    const raw = Object.fromEntries(
      productColumns.map((column, index) => [
        column,
        ['available_from', 'available_to'].includes(column)
          ? excelDate(values[index + 1])
          : (values[index + 1] ?? ''),
      ]),
    );
    const parsed = productRowSchema.safeParse(raw);
    if (parsed.success) products.push(parsed.data);
    else
      errors.push(
        `Products row ${number}: ${parsed.error.issues.map((issue) => `${issue.path.join('.')} ${issue.message}`).join(', ')}`,
      );
  }
  for (
    let number = 2;
    number <= Math.min(variantSheet.rowCount, 2001);
    number++
  ) {
    const values = variantSheet.getRow(number).values as unknown[];
    if (!values[1]) continue;
    const raw = Object.fromEntries(
      variantColumns.map((column, index) => [column, values[index + 1] ?? '']),
    );
    const parsed = variantRowSchema.safeParse(raw);
    if (parsed.success) variants.push(parsed.data);
    else
      errors.push(
        `Variants row ${number}: ${parsed.error.issues.map((issue) => `${issue.path.join('.')} ${issue.message}`).join(', ')}`,
      );
  }
  if (productSheet.rowCount > 501)
    errors.push('The workbook exceeds the 500-product import limit.');
  if (variantSheet.rowCount > 2001)
    errors.push('The workbook exceeds the 2,000-variant import limit.');

  const duplicateProductSkus = products
    .map((row) => row.sku)
    .filter((sku, index, all) => all.indexOf(sku) !== index);
  const duplicateVariantSkus = variants
    .map((row) => row.variant_sku)
    .filter((sku, index, all) => all.indexOf(sku) !== index);
  if (duplicateProductSkus.length)
    errors.push(`Duplicate product SKU: ${duplicateProductSkus[0]}`);
  if (duplicateVariantSkus.length)
    errors.push(`Duplicate variant SKU: ${duplicateVariantSkus[0]}`);

  const productSkus = new Set(products.map((row) => row.sku));
  const variantsByProduct = new Map<string, WorkbookVariantRow[]>();
  for (const row of variants) {
    if (!productSkus.has(row.product_sku))
      errors.push(`Variant references missing product SKU: ${row.product_sku}`);
    variantsByProduct.set(row.product_sku, [
      ...(variantsByProduct.get(row.product_sku) ?? []),
      row,
    ]);
  }
  for (const product of products) {
    if (product.status === 'ACTIVE' && product.category_confidence === 'REVIEW')
      errors.push(
        `${product.sku} cannot be ACTIVE while category_confidence is REVIEW.`,
      );
    if (
      product.status === 'ACTIVE' &&
      (!product.description || !product.ingredients)
    )
      errors.push(
        `${product.sku} cannot be ACTIVE without description and ingredients.`,
      );
    const rows = variantsByProduct.get(product.sku) ?? [];
    const activeDefaults = rows.filter(
      (row) => row.active && row.is_default,
    ).length;
    if (product.status === 'ACTIVE' && activeDefaults !== 1)
      errors.push(
        `${product.sku} must have exactly one active default variant; found ${activeDefaults}.`,
      );
  }
  if (errors.length) throw new Error(errors.slice(0, 20).join('\n'));
  if (!products.length) throw new Error('No product rows were found.');
  return { products, variants };
}

export async function buildProductWorkbook(
  products: Array<Record<string, unknown>>,
  variants: Array<Record<string, unknown>>,
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'CandyRama';
  const productSheet = workbook.addWorksheet('Products', {
    views: [{ state: 'frozen', xSplit: 2, ySplit: 1 }],
  });
  productSheet.columns = productColumns.map((key) => ({
    header: key,
    key,
    width: ['description', 'ingredients'].includes(key)
      ? 46
      : [
            'tagline',
            'allergens_pipe',
            'image_url',
            'source_master_skus',
          ].includes(key)
        ? 34
        : ['slug', 'sku', 'name', 'product_family'].includes(key)
          ? 25
          : 18,
  }));
  products.forEach((product) => productSheet.addRow(product));
  styleHeader(productSheet, 'S');
  productSheet.getColumn('sku').numFmt = '@';
  productSheet.getColumn('source_master_skus').numFmt = '@';
  productSheet.getColumn('available_from').numFmt = 'yyyy-mm-dd';
  productSheet.getColumn('available_to').numFmt = 'yyyy-mm-dd';
  for (let row = 2; row <= 501; row++) {
    productSheet.getCell(`D${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: [`"${brands.join(',')}"`],
    };
    productSheet.getCell(`G${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: [`"${categories.join(',')}"`],
    };
    productSheet.getCell(`H${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"HIGH,REVIEW"'],
    };
    productSheet.getCell(`I${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: [`"${statuses.join(',')}"`],
    };
    productSheet.getCell(`N${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"TRUE,FALSE"'],
    };
  }

  const variantSheet = workbook.addWorksheet('Variants', {
    views: [{ state: 'frozen', xSplit: 2, ySplit: 1 }],
  });
  variantSheet.columns = variantColumns.map((key) => ({
    header: key,
    key,
    width: key.endsWith('_skus')
      ? 32
      : ['product_sku', 'variant_sku'].includes(key)
        ? 28
        : 16,
  }));
  variants.forEach((variant) => variantSheet.addRow(variant));
  styleHeader(variantSheet, 'P');
  variantSheet.getColumn('product_sku').numFmt = '@';
  variantSheet.getColumn('variant_sku').numFmt = '@';
  variantSheet.getColumn('stripe_price_id').numFmt = '@';
  variantSheet.getColumn('price_usd').numFmt = '$0.00';
  variantSheet.getColumn('compare_at_usd').numFmt = '$0.00';
  for (let row = 2; row <= 2001; row++) {
    variantSheet.getCell(`D${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"TRUE,FALSE"'],
    };
    variantSheet.getCell(`E${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"TRUE,FALSE"'],
    };
  }

  const notes = workbook.addWorksheet('Instructions');
  notes.columns = [{ width: 24 }, { width: 92 }];
  notes.addRow(['CandyRama catalog import']);
  notes.mergeCells('A1:B1');
  notes.getCell('A1').font = {
    name: 'Arial',
    size: 18,
    bold: true,
    color: { argb: 'FF4E0F34' },
  };
  notes.addRow([]);
  notes.addRows([
    ['Sheet / field', 'How to edit'],
    [
      'Products',
      'One row per brand + product family + flavor. Preserve canonical SKU text exactly.',
    ],
    [
      'Variants',
      'One row per sellable size or pack. Preserve leaf SKU text exactly.',
    ],
    [
      'Blank commerce data',
      'Leave unknown price, stock, size, weight, description, ingredients, and allergens blank. Do not enter zero as a placeholder.',
    ],
    [
      'Activation',
      'ACTIVE products require approved category mapping, content, and exactly one active default variant with price and stock.',
    ],
    [
      '*_skus',
      'Separate channel SKUs with |. These are reconciliation references only.',
    ],
    [
      'stripe_price_id',
      'Optional Stripe Price identifier. Never put secret keys or credentials in this workbook.',
    ],
  ]);
  styleHeader(notes, 'B');
  return Buffer.from(await workbook.xlsx.writeBuffer());
}
