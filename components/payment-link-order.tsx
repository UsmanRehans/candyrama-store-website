'use client';

import { useRef, useState, type SubmitEvent } from 'react';
import Link from 'next/link';
import { useCart } from './cart-provider';

import { usStates } from '@/lib/schemas/payment-link';

export function PaymentLinkOrder({
  email,
  giftRecipientName,
  giftMessage,
  onComplete,
}: {
  email: string;
  giftRecipientName?: string;
  giftMessage?: string;
  onComplete: (orderNumber: string) => void;
}) {
  const { items, clear } = useCart();
  const requestId = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const values = new FormData(event.currentTarget);
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await fetch('/api/v1/orders/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: requestId.current,
          items,
          email: values.get('email'),
          giftRecipientName,
          giftMessage,
          shipping: {
            name: values.get('name'),
            line1: values.get('line1'),
            line2: values.get('line2'),
            city: values.get('city'),
            state: values.get('state'),
            zip: values.get('zip'),
            country: 'US',
          },
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.data?.orderNumber) {
        if (response.status >= 400 && response.status < 500)
          requestId.current = null;
        throw new Error(
          result.error || 'We could not save your order. Please try again.',
        );
      }
      onComplete(result.data.orderNumber);
      clear();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="payment-link-order" onSubmit={submit}>
      <h3>Ship to a U.S. address</h3>
      <p>
        Place your order now. We’ll email a payment link after reviewing it. No
        payment is taken here.
      </p>
      <label>
        Email for your payment link
        <input
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={email}
          required
          maxLength={254}
        />
      </label>
      <label>
        Full name
        <input
          name="name"
          autoComplete="name"
          minLength={2}
          required
          maxLength={120}
        />
      </label>
      <label>
        Street address
        <input
          name="line1"
          autoComplete="shipping address-line1"
          minLength={3}
          required
          maxLength={160}
        />
      </label>
      <label>
        Apartment, suite, etc. (optional)
        <input
          name="line2"
          autoComplete="shipping address-line2"
          maxLength={160}
        />
      </label>
      <label>
        City
        <input
          name="city"
          autoComplete="shipping address-level2"
          minLength={2}
          required
          maxLength={100}
        />
      </label>
      <div className="shipping-address-row">
        <label>
          State
          <select
            name="state"
            autoComplete="shipping address-level1"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Select state
            </option>
            {usStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </label>
        <label>
          ZIP code
          <input
            name="zip"
            autoComplete="shipping postal-code"
            inputMode="numeric"
            pattern="[0-9]{5}(-[0-9]{4})?"
            placeholder="77471"
            required
            maxLength={10}
          />
        </label>
      </div>
      <p>Country: United States</p>
      <small>
        Your total is an estimate. Taxes, offers, and availability are confirmed
        with the payment link. Your order ships after payment.
      </small>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <button type="submit" className="button primary" disabled={busy}>
        {busy ? 'Saving your order…' : 'Place order · pay by link'}
      </button>
      <small>
        Need help? <Link href="/contact">Contact us</Link>.
      </small>
    </form>
  );
}
