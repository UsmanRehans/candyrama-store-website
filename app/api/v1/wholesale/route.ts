import { NextRequest, NextResponse } from 'next/server';
import { wholesaleSchema } from '@/lib/schemas/commerce';
import { db } from '@/lib/server/db';
import { sendWholesaleNotification } from '@/lib/server/email';

export async function POST(request: NextRequest) {
  const parsed = wholesaleSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Please check the application fields.' }, { status: 400 });
  const data = parsed.data;
  const application = await db.wholesaleApplication.create({ data: { ...data, website: data.website || null } });
  const delivery = await sendWholesaleNotification({ ...data, website: data.website || undefined }).catch(error => {
    console.error('wholesale_email_failed', { applicationId: application.id, error });
    return { sent: false as const };
  });
  return NextResponse.json({ data: { id: application.id, notificationSent: delivery.sent } }, { status: 201 });
}
