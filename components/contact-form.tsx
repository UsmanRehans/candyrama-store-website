'use client';

import { SyntheticEvent, useState } from 'react';

export function ContactForm() {
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
      const response = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error ?? 'Message could not be sent.');
      formElement.reset();
      setSuccess(true);
      setMessage(
        'Message sent. We’ll get back to you within 1 to 2 business days.',
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Message could not be sent.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        Name
        <input name="name" placeholder="Your name" required minLength={2} />
      </label>
      <label>
        Email
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
      </label>
      <label>
        What’s this about?
        <select name="subject">
          <option>General question</option>
          <option>Order help</option>
          <option>Wholesale</option>
          <option>Flavor idea</option>
        </select>
      </label>
      <label>
        Message
        <textarea
          name="message"
          rows={7}
          placeholder="Give us the sweet details"
          required
          minLength={10}
        />
      </label>
      <button className="button primary" type="submit" disabled={busy}>
        {busy ? 'Sending…' : 'Send message'}
      </button>
      {message && (
        <output className={success ? 'admin-message' : 'form-error'}>
          {message}
        </output>
      )}
    </form>
  );
}
