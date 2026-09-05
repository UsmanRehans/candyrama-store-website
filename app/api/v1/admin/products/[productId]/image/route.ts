import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/admin-auth';
import { db } from '@/lib/server/db';
import { getSupabaseAdmin } from '@/lib/server/supabase';

function verifiedImageType(bytes: Uint8Array) {
  if (bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47) return {mime:'image/png',ext:'png'};
  if (bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff) return {mime:'image/jpeg',ext:'jpg'};
  if (String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP') return {mime:'image/webp',ext:'webp'};
  return null;
}

export async function POST(request: NextRequest,{params}:{params:Promise<{productId:string}>}) {
  const admin=await requireAdmin(request); if(!admin)return NextResponse.json({error:'Unauthorized.'},{status:401});
  const {productId}=await params; const product=await db.product.findUnique({where:{id:productId}}); if(!product)return NextResponse.json({error:'Product not found.'},{status:404});
  const form=await request.formData(); const file=form.get('file'); const altValue=form.get('alt'); const alt=(typeof altValue==='string'?altValue:product.name).trim().slice(0,180);
  if(!(file instanceof File)||file.size>10_000_000)return NextResponse.json({error:'Upload a PNG, JPEG, or WebP image smaller than 10 MB.'},{status:400});
  const bytes=new Uint8Array(await file.arrayBuffer()); const type=verifiedImageType(bytes); if(!type)return NextResponse.json({error:'The file is not a supported image.'},{status:400});
  const path=`products/${product.slug}/${randomUUID()}.${type.ext}`; const supabase=getSupabaseAdmin();
  const {error}=await supabase.storage.from('product-media').upload(path,bytes,{contentType:type.mime,cacheControl:'31536000',upsert:false});
  if(error){console.error('product_image_upload_failed',{productId,error});return NextResponse.json({error:'Image upload failed.'},{status:502});}
  const {data:{publicUrl}}=supabase.storage.from('product-media').getPublicUrl(path); const position=await db.productImage.count({where:{productId}});
  const image=await db.productImage.create({data:{productId,storagePath:path,url:publicUrl,alt:alt||product.name,position}});
  await db.auditLog.create({data:{actorId:admin.userId,action:'product.image_uploaded',resourceType:'product',resourceId:productId,metadata:{imageId:image.id,storagePath:path}}});
  return NextResponse.json({data:{id:image.id,url:image.url,alt:image.alt}},{status:201});
}
