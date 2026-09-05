import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { requireAdmin } from '@/lib/server/admin-auth';
import { db } from '@/lib/server/db';
import { buildProductWorkbook, parseProductWorkbook } from '@/lib/server/product-workbook';

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request); if (!admin) return NextResponse.json({error:'Unauthorized.'},{status:401});
  const products = await db.product.findMany({include:{images:{orderBy:{position:'asc'},take:1}},orderBy:{name:'asc'}});
  const rows = products.map(product=>({slug:product.slug,name:product.name,category:product.category,status:product.status,price_usd:product.priceCents/100,stock_qty:product.stockQty,low_stock_at:product.lowStockAt,net_weight:product.netWeight,tagline:product.tagline??'',description:product.description,ingredients:product.ingredients,allergens_pipe:product.allergens.join('|'),seasonal:product.isSeasonal,accent_color:product.accentColor,available_from:product.availableFrom??'',available_to:product.availableTo??'',image_url:product.images[0]?.url??''}));
  const file = await buildProductWorkbook(rows);
  return new NextResponse(file,{headers:{'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','Content-Disposition':'attachment; filename="CandyRama-Product-Catalog.xlsx"','Cache-Control':'no-store'}});
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request); if (!admin) return NextResponse.json({error:'Unauthorized.'},{status:401});
  const form = await request.formData(); const file = form.get('file');
  if (!(file instanceof File) || file.size > 5_000_000 || !file.name.toLowerCase().endsWith('.xlsx')) return NextResponse.json({error:'Upload one .xlsx file smaller than 5 MB.'},{status:400});
  try {
    const rows = await parseProductWorkbook(Buffer.from(await file.arrayBuffer()));
    const result = await db.$transaction(async tx => {
      let created=0,updated=0;
      for (const row of rows) {
        const existing=await tx.product.findUnique({where:{slug:row.slug}}); const availableFrom=row.available_from?new Date(row.available_from):null; const availableTo=row.available_to?new Date(row.available_to):null;
        const data={name:row.name,category:row.category,status:row.status,priceCents:Math.round(row.price_usd*100),stockQty:row.stock_qty,lowStockAt:row.low_stock_at,netWeight:row.net_weight,tagline:row.tagline||null,description:row.description,ingredients:row.ingredients,allergens:row.allergens_pipe.split('|').map(value=>value.trim()).filter(Boolean),isSeasonal:row.seasonal,accentColor:row.accent_color.toUpperCase(),availableFrom,availableTo};
        if(existing){await tx.product.update({where:{id:existing.id},data});updated++;if(existing.stockQty!==row.stock_qty)await tx.stockMovement.create({data:{productId:existing.id,delta:row.stock_qty-existing.stockQty,reason:'ADMIN_WORKBOOK_IMPORT',actorId:admin.userId}});}else{await tx.product.create({data:{slug:row.slug,...data}});created++;}
      }
      await tx.auditLog.create({data:{actorId:admin.userId,action:'products.workbook_imported',resourceType:'product',metadata:{created,updated,rows:rows.length}}}); return {created,updated,total:rows.length};
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
    return NextResponse.json({data:result});
  } catch(error){return NextResponse.json({error:error instanceof Error?error.message:'The workbook could not be imported.'},{status:400});}
}
