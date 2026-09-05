import 'server-only';
import ExcelJS from 'exceljs';
import { z } from 'zod';

export const productColumns = ['slug','name','category','status','price_usd','stock_qty','low_stock_at','net_weight','tagline','description','ingredients','allergens_pipe','seasonal','accent_color','available_from','available_to','image_url'] as const;
const categories = ['GUMMIES','SOUR','SPICY','BRITTLE','BARK','CHOCOLATE','CHEWS','GIFT_BOXES','SEASONAL'] as const;
const statuses = ['DRAFT','ACTIVE','ARCHIVED'] as const;

export const productRowSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100), name: z.string().min(2).max(160),
  category: z.enum(categories), status: z.enum(statuses), price_usd: z.coerce.number().min(0).max(100000),
  stock_qty: z.coerce.number().int().min(0).max(100000), low_stock_at: z.coerce.number().int().min(0).max(100000),
  net_weight: z.string().min(1).max(80), tagline: z.string().max(300).default(''), description: z.string().min(1).max(10000),
  ingredients: z.string().min(1).max(10000), allergens_pipe: z.string().max(2000).default(''),
  seasonal: z.union([z.boolean(),z.string()]).transform(value => typeof value === 'boolean' ? value : value.toLowerCase() === 'true'),
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/), available_from: z.union([z.string(),z.date()]).optional().nullable(),
  available_to: z.union([z.string(),z.date()]).optional().nullable(), image_url: z.string().optional().default(''),
});
export type WorkbookProductRow = z.infer<typeof productRowSchema>;

function excelDate(value: unknown) { if (!value) return ''; if (value instanceof Date) return value.toISOString().slice(0,10); if(typeof value==='string'||typeof value==='number')return String(value); return ''; }
export async function parseProductWorkbook(buffer: Buffer) {
  const workbook = new ExcelJS.Workbook(); await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
  const sheet = workbook.getWorksheet('Products'); if (!sheet) throw new Error('The workbook must contain a Products sheet.');
  const headers = (sheet.getRow(1).values as unknown[]).slice(1).map(String);
  if (productColumns.some((column,index) => headers[index] !== column)) throw new Error('The Products columns were changed or reordered. Download a fresh workbook.');
  const rows: WorkbookProductRow[] = []; const errors: string[] = [];
  for (let number = 2; number <= Math.min(sheet.rowCount, 501); number++) {
    const values = sheet.getRow(number).values as unknown[]; if (!values[1]) continue;
    const raw = Object.fromEntries(productColumns.map((column,index) => [column, index === 14 || index === 15 ? excelDate(values[index + 1]) : values[index + 1] ?? '']));
    const parsed = productRowSchema.safeParse(raw); if (parsed.success) rows.push(parsed.data); else errors.push(`Row ${number}: ${parsed.error.issues.map(issue => `${issue.path.join('.')} ${issue.message}`).join(', ')}`);
  }
  if (sheet.rowCount > 501) errors.push('The workbook exceeds the 500-product import limit.');
  if (errors.length) throw new Error(errors.slice(0,20).join('\n')); if (!rows.length) throw new Error('No product rows were found.');
  return rows;
}

export async function buildProductWorkbook(products: Array<Record<string, unknown>>) {
  const workbook = new ExcelJS.Workbook(); workbook.creator = 'CandyRama';
  const sheet = workbook.addWorksheet('Products', { views: [{ state:'frozen',xSplit:2,ySplit:1 }] });
  sheet.columns = productColumns.map(key => ({ header:key,key,width: ['description','ingredients'].includes(key) ? 46 : ['tagline','allergens_pipe','image_url'].includes(key) ? 34 : ['slug','name'].includes(key) ? 25 : 16 }));
  products.forEach(product => sheet.addRow(product));
  sheet.autoFilter = { from:'A1',to:'Q1' }; sheet.getRow(1).height = 32;
  sheet.getRow(1).eachCell(cell => { cell.fill = {type:'pattern',pattern:'solid',fgColor:{argb:'FF4E0F34'}}; cell.font = {name:'Arial',bold:true,color:{argb:'FFFFFFFF'}}; cell.alignment = {horizontal:'center',vertical:'middle',wrapText:true}; });
  sheet.getColumn('price_usd').numFmt = '$0.00'; sheet.getColumn('available_from').numFmt = 'yyyy-mm-dd'; sheet.getColumn('available_to').numFmt = 'yyyy-mm-dd';
  sheet.getColumn('slug').eachCell((cell,row) => { if(row>1) cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFEFE7EB'}}; });
  sheet.getColumn('image_url').eachCell((cell,row) => { if(row>1) cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFEFE7EB'}}; });
  for(let row=2;row<=501;row++){
    sheet.getCell(`C${row}`).dataValidation={type:'list',allowBlank:false,formulae:[`"${categories.join(',')}"`]};
    sheet.getCell(`D${row}`).dataValidation={type:'list',allowBlank:false,formulae:[`"${statuses.join(',')}"`]};
    sheet.getCell(`M${row}`).dataValidation={type:'list',allowBlank:false,formulae:['"TRUE,FALSE"']};
  }
  const notes = workbook.addWorksheet('Instructions'); notes.columns=[{width:22},{width:78}];
  notes.addRow(['CandyRama product import']); notes.mergeCells('A1:B1'); notes.getCell('A1').font={name:'Arial',size:18,bold:true,color:{argb:'FF4E0F34'}};
  notes.addRow([]); notes.addRows([['Field','How to edit'],['slug','Permanent identifier. Do not change it after creation.'],['price_usd','Enter dollars and cents.'],['allergens_pipe','Separate allergens with |, for example Milk|Soy.'],['seasonal','Use TRUE or FALSE.'],['available dates','Use YYYY-MM-DD or leave blank.'],['image_url','Reference only. Images are updated separately after approval.'],['New products','Add a row with a unique slug and all required fields.']]);
  notes.getRow(3).eachCell(cell=>{cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF4E0F34'}};cell.font={name:'Arial',bold:true,color:{argb:'FFFFFFFF'}}});
  return Buffer.from(await workbook.xlsx.writeBuffer());
}
