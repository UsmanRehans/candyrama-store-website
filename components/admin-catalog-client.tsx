'use client';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  Boxes,
  Download,
  ExternalLink,
  LogOut,
  RefreshCw,
  ShoppingBag,
  Upload,
} from 'lucide-react';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { AdminProductBrowser } from './admin-product-browser';

export function AdminCatalogClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [integrations, setIntegrations] = useState<null | {
    checks: Record<
      string,
      { status: 'connected' | 'needs_setup' | 'error'; detail: string }
    >;
    carriers: string[];
    catalog: { products: number; variants: number };
    checkedAt: string;
  }>(null);
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    void supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) =>
      setSession(next),
    );
    return () => data.subscription.unsubscribe();
  }, []);
  async function signIn() {
    setBusy(true);
    setMessage('');
    const { error } = await getSupabaseBrowser().auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage('Email or password is incorrect.');
    } else {
      setMessage('Signed in securely.');
    }
    setBusy(false);
  }
  async function authorizedFetch(url: string, init?: RequestInit) {
    const token = session?.access_token;
    if (!token) throw new Error('Your admin session expired.');
    const headers = new Headers(init?.headers);
    headers.set('Authorization', `Bearer ${token}`);
    return fetch(url, { ...init, headers });
  }
  async function refreshIntegrations() {
    setBusy(true);
    setMessage('');
    try {
      const response = await authorizedFetch('/api/v1/admin/integrations');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setIntegrations(result.data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Integration check failed.',
      );
    }
    setBusy(false);
  }
  async function testResend() {
    setBusy(true);
    setMessage('');
    try {
      const response = await authorizedFetch(
        '/api/v1/admin/integrations/resend/test',
        { method: 'POST' },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setMessage(`Test email sent to ${session?.user.email}.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Resend test failed.',
      );
    }
    setBusy(false);
  }
  useEffect(() => {
    const token = session?.access_token;
    if (!token) return;
    const headers = new Headers({ Authorization: `Bearer ${token}` });
    void fetch('/api/v1/admin/integrations', { headers })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        setIntegrations(result.data);
      })
      .catch((error) =>
        setMessage(
          error instanceof Error ? error.message : 'Integration check failed.',
        ),
      );
  }, [session]);
  async function download() {
    setBusy(true);
    setMessage('');
    try {
      const response = await authorizedFetch('/api/v1/admin/products/workbook');
      if (!response.ok) throw new Error((await response.json()).error);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'CandyRama-Product-Catalog.xlsx';
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage('Current product workbook downloaded.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Download failed.');
    }
    setBusy(false);
  }
  async function upload(file: File) {
    setBusy(true);
    setMessage('');
    try {
      const body = new FormData();
      body.set('file', file);
      const response = await authorizedFetch(
        '/api/v1/admin/products/workbook',
        { method: 'POST', body },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setMessage(
        `Import complete: ${result.data.created} products created, ${result.data.updated} products updated, ${result.data.variantsCreated} variants created, and ${result.data.variantsUpdated} variants updated.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Import failed.');
    }
    setBusy(false);
  }
  if (!session)
    return (
      <main className="admin-shell">
        <section className="admin-card">
          <p className="eyebrow">CANDYRAMA ADMIN</p>
          <h1>Catalog sign in</h1>
          <p>Sign in with an approved administrator account.</p>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@candyrama.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          <button
            className="button primary"
            disabled={busy || !email || !password}
            onClick={signIn}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
          {message && <output className="admin-message">{message}</output>}
        </section>
      </main>
    );
  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">CandyRama</div>
        <nav aria-label="Admin navigation">
          <Link className="active" href="/admin/catalog">
            <Boxes /> Catalog
          </Link>
          <Link href="/admin/orders">
            <ShoppingBag /> Orders
          </Link>
          <a href="https://thecandyrama.com" target="_blank" rel="noreferrer">
            <ExternalLink /> View store
          </a>
        </nav>
      </aside>
      <section className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <h1>Product catalog</h1>
            <p>Search products, manage variants, and add images.</p>
          </div>
          <div className="admin-account">
            <span>{session.user.email}</span>
            <button onClick={() => void getSupabaseBrowser().auth.signOut()}>
              <LogOut /> Sign out
            </button>
          </div>
        </header>
        <div className="admin-workspace-content">
          <section className="admin-toolbar" aria-label="Catalog tools">
            <div>
              <strong>{integrations?.catalog.products ?? '—'} products</strong>
              <span>{integrations?.catalog.variants ?? '—'} variants</span>
            </div>
            <div className="admin-toolbar-actions">
              <button disabled={busy} onClick={download}>
                <Download /> Export
              </button>
              <label className={busy ? 'disabled' : ''}>
                <Upload /> Import workbook
                <input
                  type="file"
                  accept=".xlsx"
                  disabled={busy}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void upload(file);
                    event.target.value = '';
                  }}
                />
              </label>
              <button
                disabled={busy}
                onClick={() => void refreshIntegrations()}
              >
                <RefreshCw /> Refresh
              </button>
            </div>
          </section>
          {integrations && (
            <section className="admin-system-status">
              <h2>System status</h2>
              <div className="integration-grid">
                {Object.entries(integrations.checks).map(([name, check]) => (
                  <article
                    key={name}
                    className={`integration-card ${check.status}`}
                  >
                    <div>
                      <span className="status-dot" />
                      <strong>{name}</strong>
                    </div>
                    <p>{check.detail}</p>
                  </article>
                ))}
              </div>
              <button disabled={busy} onClick={() => void testResend()}>
                Test email
              </button>
            </section>
          )}
          <AdminProductBrowser token={session.access_token} />
          {message && <output className="admin-message">{message}</output>}
        </div>
      </section>
    </main>
  );
}
