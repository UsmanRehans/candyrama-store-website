import 'server-only';
import { Resend } from 'resend';
import { env } from './env';

export async function sendOrderConfirmation(order: { email: string; orderNumber: string; totalCents: number }) {
  if (!env.RESEND_API_KEY) return;
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: order.email,
    subject: `CandyRama order ${order.orderNumber} is confirmed`,
    html: `<div style="font-family:Arial,sans-serif;color:#4e0f34"><h1>Sweet! We have your order.</h1><p>Order <strong>${order.orderNumber}</strong> is confirmed.</p><p>Total: <strong>$${(order.totalCents / 100).toFixed(2)}</strong></p><p>We’ll email you again when your candy ships.</p></div>`,
  });
}
