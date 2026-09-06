'use client';

import { SyntheticEvent, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export function WholesaleForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  async function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setSuccess(false);
    const formElement = event.currentTarget;
    try {
      const form = new FormData(formElement);
      const response = await fetch('/api/v1/wholesale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? 'Application could not be submitted.');
      formElement.reset();
      setSuccess(true);
      setMessage(
        'Application received. We’ll be in touch with wholesale options.',
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Application could not be submitted.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="contact-form compact" onSubmit={submit}>
      <label>
        Business name
        <input name="businessName" required minLength={2} />
      </label>
      <label>
        Contact name
        <input name="contactName" required minLength={2} />
      </label>
      <label>
        Work email
        <input name="email" type="email" required />
      </label>
      <label>
        Phone
        <input name="phone" type="tel" />
      </label>
      <label>
        Website
        <input name="website" type="url" placeholder="https://" />
      </label>
      <label>
        Estimated quantity
        <select name="estimatedQuantity">
          <option>50 to 99 units</option>
          <option>100 to 249 units</option>
          <option>250 to 499 units</option>
          <option>500+ units</option>
        </select>
      </label>
      <label>
        Anything else?
        <textarea name="message" rows={4} />
      </label>
      <button className="button secondary" type="submit" disabled={busy}>
        {busy ? (
          'Submitting…'
        ) : (
          <>
            Request pricing <ArrowRight />
          </>
        )}
      </button>
      {message && (
        <output className={success ? 'admin-message' : 'form-error'}>
          {message}
        </output>
      )}
    </form>
  );
}
