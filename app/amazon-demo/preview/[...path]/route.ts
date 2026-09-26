import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { hasDemoSession } from '@/lib/server/amazon-demo-auth';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const files: Record<string, string> = {
  "index.html": "text/html; charset=utf-8",
  "preview.css": "text/css; charset=utf-8",
  "preview.js": "text/javascript; charset=utf-8",
  "images/brand-horizontal.png": "image/png",
  "images/hero.webp": "image/webp",
  "images/slices.webp": "image/webp",
  "images/sharing.webp": "image/webp",
  "images/brand-stacked.png": "image/png",
  "images/pouch.jpg": "image/jpeg",
  "images/previous-aplus.png": "image/png",
  "fonts/nunito.woff2": "font/woff2",
  "fonts/anton.woff2": "font/woff2",
  "images/fruit-pouch.jpg": "image/jpeg"
};
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
 const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'X-Content-Type-Options': 'nosniff' };
 if (!await hasDemoSession()) return new Response('Unauthorized', { status: 401, headers });
 const name = (await params).path.join('/');
 if (!Object.hasOwn(files, name)) return new Response('Not found', { status: 404, headers });
 const bytes = await readFile(path.join(process.cwd(), 'assets/amazon-demo/review-v7', name));
 return new Response(bytes, { headers: { ...headers, 'Content-Type': files[name] } });
}
