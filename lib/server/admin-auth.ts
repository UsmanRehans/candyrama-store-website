import 'server-only';
import { NextRequest } from 'next/server';
import { db } from './db';
import { getSupabaseAdmin } from './supabase';

export async function requireAdmin(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !data.user) return null;
  return db.adminProfile.findFirst({ where: { userId: data.user.id, active: true } });
}
