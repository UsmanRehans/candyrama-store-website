'use client';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Download, RefreshCw, Upload } from 'lucide-react';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { AdminProductBrowser } from './admin-product-browser';

export function AdminCatalogClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
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
    const { error } = await getSupabaseBrowser().auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${location.origin}/admin/catalog`,
      },
    });
    setMessage(
      error ? error.message : 'Check your email for the secure sign-in link.',
    );
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
          <p>
            Use an invited administrator email. We’ll send a one-time secure
            link.
          </p>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@candyrama.com"
            />
          </label>
          <button
            className="button primary"
            disabled={busy || !email}
            onClick={signIn}
          >
            {busy ? 'Sending…' : 'Email sign-in link'}
          </button>
          {message && <output className="admin-message">{message}</output>}
        </section>
      </main>
    );
  return (
    <main className="admin-shell">
      <section className="admin-card wide">
        <p className="eyebrow">CANDYRAMA ADMIN</p>
        <div className="admin-title-row">
          <div>
            <h1>Store operations</h1>
            <p>
              Catalog, integrations, and launch readiness in one protected
              workspace.
            </p>
          </div>
          <div className="admin-nav">
            <Link className="button secondary" href="/admin/orders">
              Orders
            </Link>
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => void refreshIntegrations()}
            >
              <RefreshCw /> Refresh status
            </button>
          </div>
        </div>
        {integrations && (
          <section className="integration-panel">
            <div className="integration-heading">
              <h2>Integrations</h2>
              <span>
                {integrations.catalog.products} products ·{' '}
                {integrations.catalog.variants} variants
              </span>
            </div>
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
            {integrations.carriers.length > 0 && (
              <p className="carrier-list">
                <strong>Connected carriers:</strong>{' '}
                {integrations.carriers.join(', ')}
              </p>
            )}
            <div className="admin-actions">
              <button
                className="button secondary"
                disabled={busy}
                onClick={() => void testResend()}
              >
                Send Resend test email
              </button>
            </div>
          </section>
        )}
        <section className="catalog-admin-section">
          <h2>Product catalog</h2>
          <p>
            Download the current catalog, edit it in Excel, then upload the same
            workbook. Imports are validated and recorded in the audit log.
          </p>
          <div className="admin-actions">
            <button
              className="button secondary"
              disabled={busy}
              onClick={download}
            >
              <Download /> Download products + variants
            </button>
            <label className={`button primary${busy ? ' disabled' : ''}`}>
              <Upload /> Upload edited workbook
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
          </div>
        </section>
        <AdminProductBrowser token={session.access_token} />
        <div className="admin-note">
          <strong>Images stay separate.</strong>
          <p>
            Attach product images in your CandyRama chat. They can be cleaned,
            approved, and uploaded without risking spreadsheet links or
            accidental image replacement.
          </p>
        </div>
        {message && <output className="admin-message">{message}</output>}
        <button
          className="text-link"
          onClick={() => void getSupabaseBrowser().auth.signOut()}
        >
          Sign out
        </button>
      </section>
    </main>
  );
}
