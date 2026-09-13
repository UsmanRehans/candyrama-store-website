import 'server-only';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const demoCookie = 'candyrama-demo';
export const demoLifetime = 60 * 60 * 8;

function equal(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function demoConfigured() {
  return Boolean(process.env.AMAZON_DEMO_PASSWORD_HASH && process.env.AMAZON_DEMO_SESSION_SECRET);
}

export function checkDemoPassword(username: string, password: string) {
  if (!demoConfigured() || password.length > 256) return false;
  const [salt, expected] = process.env.AMAZON_DEMO_PASSWORD_HASH!.split(':');
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64).toString('hex');
  return equal(actual, expected) && equal(username, process.env.AMAZON_DEMO_USERNAME || 'Hani');
}

function sign(value: string) {
  return createHmac('sha256', process.env.AMAZON_DEMO_SESSION_SECRET!).update(value).digest('hex');
}

export function createDemoSession() {
  const payload = `${Math.floor(Date.now() / 1000) + demoLifetime}.${randomBytes(24).toString('hex')}`;
  return `${payload}.${sign(payload)}`;
}

export async function hasDemoSession() {
  if (!demoConfigured()) return false;
  const token = (await cookies()).get(demoCookie)?.value;
  if (!token || token.length > 200) return false;
  const [expiry, nonce, signature, extra] = token.split('.');
  if (extra || !expiry || !nonce || !signature || !/^\d+$/.test(expiry)) return false;
  const remaining = Number(expiry) - Math.floor(Date.now() / 1000);
  return remaining > 0 && remaining <= demoLifetime && equal(signature, sign(`${expiry}.${nonce}`));
}
