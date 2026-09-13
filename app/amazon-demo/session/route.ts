import { NextResponse } from 'next/server';
import { checkDemoPassword, createDemoSession, demoConfigured, demoCookie, demoLifetime } from '@/lib/server/amazon-demo-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const url = new URL(request.url);
  if (request.headers.get('origin') !== url.origin) {
    return new Response('Forbidden', { status: 403 });
  }
  if (Number(request.headers.get('content-length') || 0) > 4096) {
    return new Response('Request too large', { status: 413 });
  }
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');
  const logout = form.get('action') === 'logout';
  let destination = '/amazon-demo';
  if (!logout && !demoConfigured()) destination += '?error=unavailable';
  else if (!logout && !checkDemoPassword(typeof username === 'string' ? username : '', typeof password === 'string' ? password : '')) {
    // Bound repeated guessing without blocking the event loop.
    await new Promise((resolve) => setTimeout(resolve, 900));
    destination += '?error=credentials';
  }
  const response = NextResponse.redirect(new URL(destination, url), 303);
  response.headers.set('Cache-Control', 'private, no-store');
  if (logout || destination === '/amazon-demo') {
    response.cookies.set(demoCookie, logout ? '' : createDemoSession(), {
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'strict',
      path: '/amazon-demo',
      maxAge: logout ? 0 : demoLifetime,
    });
  }
  return response;
}
