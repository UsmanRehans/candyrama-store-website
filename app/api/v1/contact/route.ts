import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/schemas/commerce';
import { sendContactNotification } from '@/lib/server/email';

export async function POST(request: NextRequest) {
  const parsed = contactSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Please check the contact form fields.' },
      { status: 400 },
    );
  try {
    const delivery = await sendContactNotification(parsed.data);
    if (!delivery.sent)
      return NextResponse.json(
        { error: 'Email delivery is not configured yet.' },
        { status: 503 },
      );
    return NextResponse.json({ data: { submitted: true } }, { status: 201 });
  } catch (error) {
    console.error('contact_email_failed', error);
    return NextResponse.json(
      {
        error:
          'We could not send your message. Please email customer care directly.',
      },
      { status: 502 },
    );
  }
}
