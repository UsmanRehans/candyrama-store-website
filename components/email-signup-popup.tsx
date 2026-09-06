'use client';

import Link from 'next/link';
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Mail, X } from 'lucide-react';

const openEvent = 'candyrama:open-signup';
const dismissedKey = 'candyrama-signup-dismissed';

export function openEmailSignup() {
  window.dispatchEvent(new Event(openEvent));
}

export function SignupButton({ className = '' }: { className?: string }) {
  return (
    <button className={className} type="button" onClick={openEmailSignup}>
      Join and save
    </button>
  );
}

export function EmailSignupPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [joined, setJoined] = useState(false);
  const [offerEligible, setOfferEligible] = useState(true);
  const emailRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    localStorage.setItem(dismissedKey, 'true');
  }, []);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(openEvent, show);
    const timer = window.setTimeout(() => {
      if (!localStorage.getItem(dismissedKey)) setOpen(true);
    }, 4500);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(openEvent, show);
    };
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => emailRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [open, close]);

  async function subscribe(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/v1/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'welcome-popup' }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Signup failed.');
      localStorage.setItem(dismissedKey, 'joined');
      setOfferEligible(result.data.offerEligible);
      setJoined(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Signup failed.');
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="signup-popup-backdrop">
      <dialog
        className="signup-popup"
        open
        aria-modal="true"
        aria-labelledby="signup-popup-title"
      >
        <button
          className="signup-popup-close"
          type="button"
          onClick={close}
          aria-label="Close signup offer"
        >
          <X />
        </button>
        <div className="signup-popup-sticker">
          <Mail />
          <span>FIRST ORDER TREAT</span>
        </div>
        {joined ? (
          <div className="signup-popup-success">
            <p className="eyebrow">YOU’RE ON THE LIST</p>
            <h2 id="signup-popup-title">Your BOGO is ready.</h2>
            {offerEligible ? (
              <>
                <p>
                  Add at least two treats to your bag, then enter this code in
                  your cart.
                </p>
                <strong className="signup-offer-code">SWEETSTART</strong>
                <Link className="button primary" href="/shop" onClick={close}>
                  Pick your treats
                </Link>
              </>
            ) : (
              <>
                <p>
                  You’re back on the CandyRama email list. SWEETSTART is
                  reserved for subscribers who have not placed their first order
                  yet.
                </p>
                <button
                  className="button primary"
                  type="button"
                  onClick={close}
                >
                  Got it
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <p className="eyebrow">A SWEET HELLO</p>
            <h2 id="signup-popup-title">Buy one. Get one free.</h2>
            <p>
              Join the CandyRama email list and your first order gets twice the
              candy energy.
            </p>
            <form onSubmit={subscribe}>
              <label htmlFor="popup-email">Email address</label>
              <input
                ref={emailRef}
                id="popup-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
              <button className="button primary" disabled={busy}>
                {busy ? 'Joining…' : 'Get my free treat'}
              </button>
              {message && <output role="alert">{message}</output>}
            </form>
            <small>
              By signing up, you agree to receive CandyRama emails. Unsubscribe
              anytime. <Link href="/legal/privacy">Privacy policy</Link>
            </small>
            <details>
              <summary>Offer details</summary>
              <p>
                For new subscribers on their first order. Add two or more
                eligible treats and use SWEETSTART. The lowest priced treat is
                free. One use per email. Cannot be combined with Sugar Points.
              </p>
            </details>
          </>
        )}
      </dialog>
    </div>
  );
}
