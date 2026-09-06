'use client';

import Link from 'next/link';
import type { Session } from '@supabase/supabase-js';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Gift, LogOut, PackageCheck, Sparkles } from 'lucide-react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type CustomerOrder = {
  id: string;
  orderNumber: string;
  status: string;
  totalCents: number;
  discountCents: number;
  createdAt: string;
  shippedAt: string | null;
  carrier: string | null;
  trackingNumber: string | null;
  items: Array<{
    id: string;
    nameSnapshot: string;
    quantity: number;
    priceCents: number;
  }>;
};

type AccountData = {
  email: string;
  rewardPoints: number;
  referralCode: string | null;
  orders: CustomerOrder[];
};

export function CustomerAccount() {
  const [session, setSession] = useState<Session | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [marketing, setMarketing] = useState(false);
  const [account, setAccount] = useState<AccountData | null>(null);
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

  useEffect(() => {
    if (!session) return;
    const headers = new Headers({
      Authorization: `Bearer ${session.access_token}`,
    });
    void fetch('/api/v1/account/orders', { headers })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        setAccount(result.data);
      })
      .catch((error) => {
        setMessage(
          error instanceof Error
            ? error.message
            : 'Your orders could not be loaded.',
        );
        setAccount({
          email: session.user.email ?? '',
          rewardPoints: 0,
          referralCode: null,
          orders: [],
        });
      });
  }, [session]);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const supabase = getSupabaseBrowser();
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setMessage(error ? 'Email or password is incorrect.' : 'Welcome back!');
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else {
        if (marketing)
          await fetch('/api/v1/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, source: 'customer-account' }),
          });
        setMessage(
          data.session
            ? 'Your account is ready!'
            : 'Check your inbox to confirm your email, then sign in.',
        );
      }
    }
    setBusy(false);
  }

  async function signOut() {
    await getSupabaseBrowser().auth.signOut();
    setMessage('Signed out. See you next time!');
  }

  if (!session)
    return (
      <section className="account-shell">
        <div className="account-intro">
          <p className="eyebrow">YOUR CANDY CORNER</p>
          <h1>Orders, points, and good stuff.</h1>
          <p>
            Create an account with the same email you use at checkout. Your past
            and future orders will meet you here.
          </p>
          <div>
            <PackageCheck />
            <span>See every order</span>
            <Sparkles />
            <span>Track Sugar Points</span>
            <Gift />
            <span>Find your referral code</span>
          </div>
        </div>
        <form className="account-auth-card" onSubmit={submit}>
          <div className="account-tabs">
            <button
              className={mode === 'signin' ? 'active' : ''}
              type="button"
              onClick={() => setMode('signin')}
            >
              Sign in
            </button>
            <button
              className={mode === 'signup' ? 'active' : ''}
              type="button"
              onClick={() => setMode('signup')}
            >
              Create account
            </button>
          </div>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </label>
          {mode === 'signup' && (
            <label className="cart-check">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(event) => setMarketing(event.target.checked)}
              />
              Send me new drops and sweet offers
            </label>
          )}
          <button className="button primary" disabled={busy}>
            {busy
              ? 'One sec…'
              : mode === 'signin'
                ? 'Sign in'
                : 'Create my account'}
          </button>
          {message && <output>{message}</output>}
          <small>
            By creating an account, you agree to our{' '}
            <Link href="/legal/privacy">privacy policy</Link>.
          </small>
        </form>
      </section>
    );

  return (
    <section className="account-dashboard">
      <div className="account-dashboard-head">
        <div>
          <p className="eyebrow">MY CANDYRAMA</p>
          <h1>Hey, sweet tooth.</h1>
          <p>{account?.email ?? session.user.email}</p>
        </div>
        <button type="button" onClick={signOut}>
          <LogOut /> Sign out
        </button>
      </div>
      <div className="account-stats">
        <article>
          <span>Sugar Points</span>
          <strong>{account?.rewardPoints ?? 0}</strong>
        </article>
        <article>
          <span>Referral code</span>
          <strong>{account?.referralCode ?? 'After your first order'}</strong>
        </article>
        <article>
          <span>Orders</span>
          <strong>{account?.orders.length ?? 0}</strong>
        </article>
      </div>
      <div className="account-orders">
        <h2>Order history</h2>
        {message && <output>{message}</output>}
        {!account ? (
          <p>Loading your candy history…</p>
        ) : account.orders.length === 0 ? (
          <div className="empty-cart">
            <p>No orders yet. Let’s fix that.</p>
            <Link className="button primary" href="/shop">
              Shop candy
            </Link>
          </div>
        ) : (
          account.orders.map((order) => (
            <article className="account-order" key={order.id}>
              <div>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <h3>{order.orderNumber}</h3>
                <b>{order.status}</b>
              </div>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.quantity} × {item.nameSnapshot}
                    </span>
                    <strong>
                      ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                    </strong>
                  </li>
                ))}
              </ul>
              <div>
                <span>Total</span>
                <strong>${(order.totalCents / 100).toFixed(2)}</strong>
                {order.trackingNumber && (
                  <span>
                    {order.carrier} {order.trackingNumber}
                  </span>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
