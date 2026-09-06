import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/admin-auth';
import { sendIntegrationTest } from '@/lib/server/email';

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    const delivery = await sendIntegrationTest(admin.email);
    if (!delivery.sent)
      return NextResponse.json(
        { error: 'Add RESEND_API_KEY and a verified EMAIL_FROM sender first.' },
        { status: 503 },
      );
    return NextResponse.json({ data: { sent: true } });
  } catch (error) {
    console.error('resend_test_failed', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'The test email failed.',
      },
      { status: 502 },
    );
  }
}
