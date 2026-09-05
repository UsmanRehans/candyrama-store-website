import { NextRequest, NextResponse } from 'next/server';
import { wholesaleSchema } from '@/lib/schemas/commerce';
import { db } from '@/lib/server/db';

export async function POST(request: NextRequest) {
  const parsed = wholesaleSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Please check the application fields.' }, { status: 400 });
  const data = parsed.data;
  const application = await db.wholesaleApplication.create({ data: { ...data, website: data.website || null } });
  return NextResponse.json({ data: { id: application.id } }, { status: 201 });
}
