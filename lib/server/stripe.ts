import 'server-only';
import Stripe from 'stripe';
import { requireEnv } from '@/lib/server/env';

let client: Stripe | undefined;
export function getStripe() {
  return client ??= new Stripe(requireEnv('STRIPE_SECRET_KEY'), { appInfo: { name: 'CandyRama', version: '1.0.0' } });
}
