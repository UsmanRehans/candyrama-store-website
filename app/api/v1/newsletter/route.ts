import { NextRequest, NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/schemas/commerce';
import { db } from '@/lib/server/db';

export async function POST(request: NextRequest) {
  try {
    const input = newsletterSchema.parse(await request.json());
    const email = input.email.toLowerCase();
    const subscriber = await db.newsletterSubscriber.upsert({
      where: { email },
      create: {
        email,
        source: input.source,
      },
      update: { active: true, source: input.source, consentedAt: new Date() },
    });
    const priorOrders = await db.order.count({ where: { email } });
    const offerEligible = !subscriber.offerRedeemedAt && priorOrders === 0;
    return NextResponse.json(
      {
        data: {
          subscribed: true,
          offerEligible,
          offer: offerEligible
            ? 'Buy one treat and get one treat free automatically on your first order.'
            : null,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error && typeof error === 'object' && 'issues' in error)
      return NextResponse.json(
        { error: 'Enter a valid email address.' },
        { status: 400 },
      );
    console.error('newsletter_signup_failed', error);
    return NextResponse.json(
      { error: 'Signup is taking a candy break. Try again soon.' },
      { status: 503 },
    );
  }
}
