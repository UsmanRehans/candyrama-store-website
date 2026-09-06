import 'server-only';
import { Resend } from 'resend';
import { env } from './env';

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[
        character
      ]!,
  );
}

async function send(message: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  if (!env.RESEND_API_KEY)
    return { sent: false as const, reason: 'not_configured' as const };
  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    ...message,
  });
  if (error) throw new Error(`Resend rejected the email: ${error.message}`);
  return { sent: true as const };
}

export async function sendOrderConfirmation(order: {
  email: string;
  orderNumber: string;
  totalCents: number;
}) {
  return send({
    to: order.email,
    subject: `CandyRama order ${order.orderNumber} is confirmed`,
    html: `<div style="font-family:Arial,sans-serif;color:#4e0f34"><h1>Sweet! We have your order.</h1><p>Order <strong>${order.orderNumber}</strong> is confirmed.</p><p>Total: <strong>$${(order.totalCents / 100).toFixed(2)}</strong></p><p>We’ll email you again when your candy ships.</p></div>`,
  });
}

export async function sendContactNotification(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const destination = env.ADMIN_NOTIFICATION_EMAIL ?? env.CUSTOMER_CARE_EMAIL;
  return send({
    to: destination,
    replyTo: input.email,
    subject: `CandyRama contact: ${input.subject}`,
    html: `<div style="font-family:Arial,sans-serif;color:#4e0f34"><h1>New CandyRama message</h1><p><strong>From:</strong> ${escapeHtml(input.name)} (${escapeHtml(input.email)})</p><p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p><p>${escapeHtml(input.message).replace(/\n/g, '<br>')}</p></div>`,
  });
}

export async function sendWholesaleNotification(input: {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  estimatedQuantity: string;
  message?: string;
}) {
  const destination = env.ADMIN_NOTIFICATION_EMAIL ?? env.CUSTOMER_CARE_EMAIL;
  return send({
    to: destination,
    replyTo: input.email,
    subject: `CandyRama wholesale inquiry: ${input.businessName}`,
    html: `<div style="font-family:Arial,sans-serif;color:#4e0f34"><h1>New wholesale application</h1><p><strong>Business:</strong> ${escapeHtml(input.businessName)}</p><p><strong>Contact:</strong> ${escapeHtml(input.contactName)} (${escapeHtml(input.email)})</p><p><strong>Phone:</strong> ${escapeHtml(input.phone ?? 'Not provided')}</p><p><strong>Website:</strong> ${escapeHtml(input.website ?? 'Not provided')}</p><p><strong>Quantity:</strong> ${escapeHtml(input.estimatedQuantity)}</p><p>${escapeHtml(input.message ?? 'No additional message').replace(/\n/g, '<br>')}</p></div>`,
  });
}

export async function sendShippingConfirmation(input: {
  email: string;
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
}) {
  return send({
    to: input.email,
    subject: `Shipping label created for CandyRama order ${input.orderNumber}`,
    html: `<div style="font-family:Arial,sans-serif;color:#4e0f34"><h1>Your candy is being packed!</h1><p>We created a ${escapeHtml(input.carrier)} shipping label for order <strong>${escapeHtml(input.orderNumber)}</strong>. Tracking may take time to activate after the carrier receives it.</p><p>Tracking number: <strong>${escapeHtml(input.trackingNumber)}</strong></p></div>`,
  });
}
