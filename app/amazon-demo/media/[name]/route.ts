import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { hasDemoSession } from '@/lib/server/amazon-demo-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const files: Record<string, string> = {
  'store-pouches-v5.jpg': 'image/jpeg',
  'aplus-gummy-hero-v5.jpg': 'image/jpeg',
  'aplus-gummy-detail-v5.jpg': 'image/jpeg',
  'aplus-gummy-pouch-v5.jpg': 'image/jpeg',
  'packaging-peach-v4.webp': 'image/webp',
  'candy-abundance-v2.webp': 'image/webp',
  'blue-macro-v2.webp': 'image/webp',
  'movie-night-v2.webp': 'image/webp',
  'packaging-campaign.png': 'image/png',
  'packaging-reference.jpeg': 'image/jpeg',
};

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' };
  if (!await hasDemoSession()) return new Response('Unauthorized', { status: 401, headers });
  const { name } = await params;
  if (!Object.hasOwn(files, name)) return new Response('Not found', { status: 404, headers });
  const bytes = await readFile(path.join(process.cwd(), 'assets/amazon-demo', name));
  return new Response(bytes, { headers: { ...headers, 'Content-Type': files[name], ...(new URL(request.url).searchParams.get('download') === '1' ? { 'Content-Disposition': `attachment; filename="${name}"` } : {}) } });
}
