import 'server-only';
import ExcelJS from 'exceljs';
import { z } from 'zod';

export const productColumns = [
  'slug',
  'sku',
  'brand',
  'product_family',
  'flavor',
  'name',
  'category',
  'status',
  'price_usd',
  'stock_qty',
  'low_stock_at',
  'net_weight',
  'tagline',
  'description',
  'ingredients',
  'allergens_pipe',
  'seasonal',
  'accent_color',
  'available_from',
  'available_to',
  'image_url',
] as const;
export const variantColumns = [
  'product_slug',
  'sku',
  'size_sig',
  'net_weight',
  'price_usd',
  'compare_at_usd',
  'stock_qty',
  'low_stock_at',
  'is_default',
  'active',
  'amazon_skus_pipe',
  'shopify_skus_pipe',
  'tiktok_skus_pipe',
  'temu_skus_pipe',
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
  .union([z.boolean(), z.string()])
  .transform((value) =>
    typeof value === 'boolean' ? value : value.toLowerCase() === 'true',
  );
const optionalMoney = z
  .union([z.literal(''), z.coerce.number().min(0).max(100000)])
  .transform((value) => (value === '' ? null : value));

export const productRowSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(100),
  sku: z.string().max(160).default(''),
  brand: z.enum(brands),
  product_family: z.string().max(160).default(''),
  flavor: z.string().max(160).default(''),
  name: z.string().min(2).max(160),
  category: z.enum(categories),
  status: z.enum(statuses),
  price_usd: z.coerce.number().min(0).max(100000),
  stock_qty: z.coerce.number().int().min(0).max(100000),
  low_stock_at: z.coerce.number().int().min(0).max(100000),
  net_weight: z.string().min(1).max(80),
  tagline: z.string().max(300).default(''),
  description: z.string().min(1).max(10000),
  ingredients: z.string().min(1).max(10000),
  allergens_pipe: z.string().max(2000).default(''),
  seasonal: booleanValue,
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  available_from: z.union([z.string(), z.date()]).optional().nullable(),
  available_to: z.union([z.string(), z.date()]).optional().nullable(),
  image_url: z.string().optional().default(''),
});
export const variantRowSchema = z.object({
  product_slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(100),
  sku: z.string().min(1).max(180),
  size_sig: z.string().min(1).max(100),
  net_weight: z.string().min(1).max(80),
  price_usd: z.coerce.number().min(0).max(100000),
  compare_at_usd: optionalMoney,
  stock_qty: z.coerce.number().int().min(0).max(100000),
  low_stock_at: z.coerce.number().int().min(0).max(100000),
  is_default: booleanValue,
  active: booleanValue,
  amazon_skus_pipe: z.string().max(4000).default(''),
  shopify_skus_pipe: z.string().max(4000).default(''),
  tiktok_skus_pipe: z.string().max(4000).default(''),
  temu_skus_pipe: z.string().max(4000).default(''),
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
  if (columns.some((column, index) => headers[index] !== column))
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
  const duplicateSkus = variants
    .map((row) => row.sku)
    .filter((sku, index, all) => all.indexOf(sku) !== index);
  if (duplicateSkus.length)
    errors.push(`Duplicate variant SKU: ${duplicateSkus[0]}`);
  const defaultCounts = new Map<string, number>();
  for (const row of variants)
    if (row.is_default)
      defaultCounts.set(
        row.product_slug,
        (defaultCounts.get(row.product_slug) ?? 0) + 1,
      );
  for (const [slug, count] of defaultCounts)
    if (count > 1) errors.push(`${slug} has more than one default variant.`);
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
      : ['tagline', 'allergens_pipe', 'image_url'].includes(key)
        ? 34
        : ['slug', 'sku', 'name', 'product_family'].includes(key)
          ? 25
          : 16,
  }));
  products.forEach((product) => productSheet.addRow(product));
  styleHeader(productSheet, 'U');
  productSheet.getColumn('price_usd').numFmt = '$0.00';
  productSheet.getColumn('available_from').numFmt = 'yyyy-mm-dd';
  productSheet.getColumn('available_to').numFmt = 'yyyy-mm-dd';
  for (let row = 2; row <= 501; row++) {
    productSheet.getCell(`C${row}`).dataValidation = {
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
      formulae: [`"${statuses.join(',')}"`],
    };
    productSheet.getCell(`Q${row}`).dataValidation = {
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
    width: key.endsWith('_pipe')
      ? 32
      : ['product_slug', 'sku'].includes(key)
        ? 28
        : 16,
  }));
  variants.forEach((variant) => variantSheet.addRow(variant));
  styleHeader(variantSheet, 'N');
  variantSheet.getColumn('price_usd').numFmt = '$0.00';
  variantSheet.getColumn('compare_at_usd').numFmt = '$0.00';
  for (let row = 2; row <= 2001; row++) {
    variantSheet.getCell(`I${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"TRUE,FALSE"'],
    };
    variantSheet.getCell(`J${row}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"TRUE,FALSE"'],
    };
  }
  const notes = workbook.addWorksheet('Instructions');
  notes.columns = [{ width: 22 }, { width: 90 }];
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
      'One row per flavor-level product. Keep slug and canonical SKU stable.',
    ],
    [
      'Variants',
      'One row per sellable size or pack. Variant SKU is required and must be unique.',
    ],
    ['price_usd', 'Enter dollars and cents. Never enter wholesale cost here.'],
    [
      '*_skus_pipe',
      'Separate channel SKUs with |. These are reconciliation references only.',
    ],
    ['is_default', 'At most one TRUE variant per product.'],
    ['allergens_pipe', 'Separate allergens with |, for example Milk|Soy.'],
    [
      'Images',
      'image_url is reference-only. Upload approved images separately in admin.',
    ],
  ]);
  notes.getRow(3).eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4E0F34' },
    };
    cell.font = { name: 'Arial', bold: true, color: { argb: 'FFFFFFFF' } };
  });
  return Buffer.from(await workbook.xlsx.writeBuffer());
}
