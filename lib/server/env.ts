import 'server-only';
import { z } from 'zod';

// `.env.example` intentionally contains empty placeholders. Treat those as
// unconfigured so an unrelated optional integration cannot prevent startup.
// Feature entry points still call `requireEnv` before using their credentials.
const optionalSecret = z.preprocess(
  (value) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.string().min(1).optional(),
);
const optionalEmail = z.preprocess(
  (value) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.email().optional(),
);
const schema = z.object({
  DATABASE_URL: optionalSecret,
  DIRECT_URL: optionalSecret,
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalSecret,
  SUPABASE_SERVICE_ROLE_KEY: optionalSecret,
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
  STRIPE_MODE: z.enum(['test', 'live']).default('test'),
  STRIPE_TEST_SECRET_KEY: optionalSecret,
  STRIPE_TEST_WEBHOOK_SECRET: optionalSecret,
  NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY: optionalSecret,
  STRIPE_LIVE_SECRET_KEY: optionalSecret,
  STRIPE_LIVE_WEBHOOK_SECRET: optionalSecret,
  NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY: optionalSecret,
  // Legacy names remain supported while existing deployments migrate.
  STRIPE_SECRET_KEY: optionalSecret,
  STRIPE_WEBHOOK_SECRET: optionalSecret,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optionalSecret,
  SHIPSTATION_API_KEY: optionalSecret,
  SHIP_FROM_NAME: z.string().default('CandyRama'),
  SHIP_FROM_PHONE: optionalSecret,
  SHIP_FROM_STREET1: optionalSecret,
  SHIP_FROM_CITY: optionalSecret,
  SHIP_FROM_STATE: optionalSecret,
  SHIP_FROM_ZIP: optionalSecret,
  RESEND_API_KEY: optionalSecret,
  EMAIL_FROM: z.string().default('CandyRama <orders@example.com>'),
  EMAIL_REPLY_TO: optionalEmail,
  CUSTOMER_CARE_EMAIL: z.email().default('customercare@twistedtreatz.com'),
  ADMIN_NOTIFICATION_EMAIL: optionalEmail,
  IP_HASH_SECRET: optionalSecret,
});

export const env = schema.parse(process.env);

export function getStripeEnv() {
  const test = env.STRIPE_MODE === 'test';
  const useLegacyNames = !process.env.STRIPE_MODE;
  return {
    mode: env.STRIPE_MODE,
    secretKey:
      (test ? env.STRIPE_TEST_SECRET_KEY : env.STRIPE_LIVE_SECRET_KEY) ??
      (useLegacyNames ? env.STRIPE_SECRET_KEY : undefined),
    publishableKey:
      (test
        ? env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
        : env.NEXT_PUBLIC_STRIPE_LIVE_PUBLISHABLE_KEY) ??
      (useLegacyNames ? env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY : undefined),
    webhookSecret:
      (test
        ? env.STRIPE_TEST_WEBHOOK_SECRET
        : env.STRIPE_LIVE_WEBHOOK_SECRET) ??
      (useLegacyNames ? env.STRIPE_WEBHOOK_SECRET : undefined),
  };
}

export function requireEnv<K extends keyof typeof env>(
  key: K,
): NonNullable<(typeof env)[K]> {
  const value = env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value as NonNullable<(typeof env)[K]>;
}
