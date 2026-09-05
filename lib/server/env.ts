import 'server-only';
import { z } from 'zod';

const optionalSecret = z.string().min(1).optional();
const schema = z.object({
  DATABASE_URL: optionalSecret,
  DIRECT_URL: optionalSecret,
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalSecret,
  SUPABASE_SERVICE_ROLE_KEY: optionalSecret,
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
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
  CUSTOMER_CARE_EMAIL: z.email().default('customercare@twistedtreatz.com'),
  IP_HASH_SECRET: optionalSecret,
});

export const env = schema.parse(process.env);

export function requireEnv<K extends keyof typeof env>(key: K): NonNullable<(typeof env)[K]> {
  const value = env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value as NonNullable<(typeof env)[K]>;
}
