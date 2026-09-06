'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { ExternalLink, PackageCheck, RefreshCw } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type Order = {
  id: string;
  orderNumber: string;
  email: string;
  status: string;
  totalCents: number;
  shippingName: string;
  shippingCity: string;
  shippingState: string;
  createdAt: string;
  carrier: string | null;
  serviceLevel: string | null;
  trackingNumber: string | null;
  shippingLabelUrl: string | null;
  items: Array<{
    id: string;
    nameSnapshot: string;
    skuSnapshot: string | null;
    quantity: number;
  }>;
};

export function AdminOrdersClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
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
        emailRedirectTo: `${location.origin}/admin/orders`,
      },
    });
    setMessage(
      error ? error.message : 'Check your email for the secure sign-in link.',
    );
    setBusy(false);
  }
  async function authorizedFetch(url: string, init?: RequestInit) {
    if (!session) throw new Error('Your admin session expired.');
    const headers = new Headers(init?.headers);
    headers.set('Authorization', `Bearer ${session.access_token}`);
    return fetch(url, { ...init, headers });
  }
  async function load() {
    setBusy(true);
    setMessage('');
    try {
      const response = await authorizedFetch('/api/v1/admin/orders');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setOrders(result.data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Orders could not be loaded.',
      );
    }
    setBusy(false);
  }
  useEffect(() => {
    const token = session?.access_token;
    if (!token) return;
    const headers = new Headers({ Authorization: `Bearer ${token}` });
    void fetch('/api/v1/admin/orders', { headers })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        setOrders(result.data);
      })
      .catch((error) =>
        setMessage(
          error instanceof Error
            ? error.message
            : 'Orders could not be loaded.',
        ),
      );
  }, [session]);
  async function buyLabel(order: Order) {
    if (
      !window.confirm(
        `Purchase the cheapest available shipping label for ${order.orderNumber}? This can create a real ShipStation charge.`,
      )
    )
      return;
    setBusy(true);
    setMessage('');
    try {
      const response = await authorizedFetch(
        `/api/v1/admin/orders/${order.id}/shipping-label`,
        { method: 'POST' },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setMessage(
        `Label purchased for ${order.orderNumber}: ${result.data.carrier} ${result.data.serviceLevel}.`,
      );
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Label purchase failed.',
      );
      setBusy(false);
    }
  }
  if (!session)
    return (
      <main className="admin-shell">
        <section className="admin-card">
          <p className="eyebrow">CANDYRAMA ADMIN</p>
          <h1>Orders sign in</h1>
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
      <section className="admin-card orders-admin">
        <div className="admin-title-row">
          <div>
            <p className="eyebrow">CANDYRAMA ADMIN</p>
            <h1>Orders</h1>
            <p>Paid orders, fulfillment, tracking, and ShipStation labels.</p>
          </div>
          <div className="admin-nav">
            <Link className="button secondary" href="/admin/catalog">
              Catalog
            </Link>
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => void load()}
            >
              <RefreshCw /> Refresh
            </button>
          </div>
        </div>
        {message && <output className="admin-message">{message}</output>}
        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="admin-note">
              <strong>No orders yet.</strong>
              <p>
                Completed Stripe sandbox orders will appear here automatically.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-summary">
                  <div>
                    <span className="order-status">{order.status}</span>
                    <h2>{order.orderNumber}</h2>
                    <p>
                      {order.shippingName} · {order.shippingCity},{' '}
                      {order.shippingState}
                    </p>
                    <small>
                      {new Date(order.createdAt).toLocaleString()} ·{' '}
                      {order.email}
                    </small>
                  </div>
                  <strong>${(order.totalCents / 100).toFixed(2)}</strong>
                </div>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity}× {item.nameSnapshot}
                      {item.skuSnapshot ? ` · ${item.skuSnapshot}` : ''}
                    </li>
                  ))}
                </ul>
                {order.shippingLabelUrl ? (
                  <a
                    className="button primary"
                    href={order.shippingLabelUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink /> Open label
                  </a>
                ) : (
                  ['PAID', 'PACKING'].includes(order.status) && (
                    <button
                      className="button primary"
                      disabled={busy}
                      onClick={() => void buyLabel(order)}
                    >
                      <PackageCheck /> Buy cheapest label
                    </button>
                  )
                )}
                {order.trackingNumber && (
                  <p className="tracking-line">
                    <strong>
                      {order.carrier} {order.serviceLevel}
                    </strong>{' '}
                    · {order.trackingNumber}
                  </p>
                )}
              </article>
            ))
          )}
        </div>
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
