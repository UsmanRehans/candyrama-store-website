import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { hasDemoSession } from '@/lib/server/amazon-demo-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Explicitly enumerate reviewed assets; arbitrary filesystem paths are never served.
const files: Record<string, string> = {
  'fonts/anton.woff2': 'font/woff2',
  'fonts/nunito.woff2': 'font/woff2',
  'images/all-candy-18.png': 'image/png',
  'images/brand-stacked.png': 'image/png',
  'images/fruit-pouch.jpg': 'image/jpeg',
  'images/header-blue.png': 'image/png',
  'images/header-rainbow.png': 'image/png',
  'images/hero.webp': 'image/webp',
  'images/pouch.jpg': 'image/jpeg',
  'images/previous-aplus.png': 'image/png',
  'images/sharing.webp': 'image/webp',
  'images/slices.webp': 'image/webp',
  'preview.css': 'text/css; charset=utf-8',
  'preview.js': 'text/javascript; charset=utf-8',
};

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const headers = {
    'Cache-Control': 'private, no-store',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'X-Content-Type-Options': 'nosniff',
  };
  if (!await hasDemoSession()) return new Response('Unauthorized', { status: 401, headers });
  const { path: segments } = await params;
  const name = segments.join('/');
  if (!Object.hasOwn(files, name)) return new Response('Not found', { status: 404, headers });
  const bytes = await readFile(path.join(process.cwd(), 'assets/amazon-demo/v8', name));
  return new Response(bytes, { headers: { ...headers, 'Content-Type': files[name] } });
}
