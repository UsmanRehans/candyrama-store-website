import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/admin-auth';
import { db } from '@/lib/server/db';
import { env } from '@/lib/server/env';

type Check = { status: 'connected' | 'needs_setup' | 'error'; detail: string };

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin)
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const database: Check = await db.$queryRaw`SELECT 1`
    .then(() => ({
      status: 'connected' as const,
      detail: 'Database and Prisma are responding.',
    }))
    .catch(() => ({
      status: 'error' as const,
      detail: 'Database connection failed.',
    }));

  let stripe: Check = {
    status: 'needs_setup',
    detail: 'Add matching sandbox secret and publishable keys.',
  };
  if (
    env.STRIPE_SECRET_KEY?.startsWith('sk_test_') &&
    env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_') &&
    env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_')
  )
    stripe = {
      status: 'connected',
      detail: 'Sandbox keys and signed webhook are configured.',
    };
  else if (
    env.STRIPE_SECRET_KEY?.includes('_live_') ||
    env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('_live_')
  )
    stripe = {
      status: 'error',
      detail:
        'Live or mismatched key detected in local development. Replace both keys with sandbox keys.',
    };

  let shipstation: Check = {
    status: 'needs_setup',
    detail: 'Add a ShipStation V2 API key.',
  };
  let carriers: string[] = [];
  if (env.SHIPSTATION_API_KEY) {
    try {
      const response = await fetch('https://api.shipstation.com/v2/carriers', {
        headers: { 'API-Key': env.SHIPSTATION_API_KEY },
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(String(response.status));
      const payload = (await response.json()) as {
        carriers?: Array<{ friendly_name?: string; name?: string }>;
      };
      carriers = (payload.carriers ?? []).map(
        (carrier) => carrier.friendly_name ?? carrier.name ?? 'Carrier',
      );
      const originReady = Boolean(
        env.SHIP_FROM_PHONE && env.SHIP_FROM_STREET1 && env.SHIP_FROM_ZIP,
      );
      shipstation = {
        status: originReady ? 'connected' : 'needs_setup',
        detail: originReady
          ? `${carriers.length} carriers available; origin address configured.`
          : `${carriers.length} carriers available; complete the ship-from address.`,
      };
    } catch {
      shipstation = {
        status: 'error',
        detail: 'ShipStation rejected the API check.',
      };
    }
  }

  const resend: Check =
    env.RESEND_API_KEY && env.EMAIL_FROM && env.ADMIN_NOTIFICATION_EMAIL
      ? {
          status: 'connected',
          detail: 'Transactional and admin-notification email is configured.',
        }
      : {
          status: 'needs_setup',
          detail:
            'Add a Resend key, verified sender, and admin notification email.',
        };

  const productCount = await db.product.count();
  const variantCount = await db.productVariant.count().catch(() => 0);
  return NextResponse.json(
    {
      data: {
        checks: { database, stripe, shipstation, resend },
        carriers,
        catalog: { products: productCount, variants: variantCount },
        checkedAt: new Date().toISOString(),
      },
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
