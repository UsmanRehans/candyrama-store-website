import 'server-only';
import Stripe from 'stripe';
import { getStripeEnv } from '@/lib/server/env';

let client: Stripe | undefined;
export function getStripe() {
  const secretKey = getStripeEnv().secretKey;
  if (!secretKey)
    throw new Error('The active Stripe secret key is not configured.');
  return (client ??= new Stripe(secretKey, {
    appInfo: { name: 'CandyRama', version: '1.0.0' },
  }));
}
