import type { PaymentLinkOrderInput } from '@/lib/schemas/payment-link';

export type PaymentLinkCartItem = {
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  priceCents: number;
  quantity: number;
};

export type ExistingPaymentLinkOrder = {
  id: string;
  email: string;
  status: string;
  shippingName: string;
  shippingLine1: string;
  shippingLine2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  giftRecipientName: string | null;
  giftMessage: string | null;
  items: Array<{
    skuSnapshot: string | null;
    quantity: number;
  }>;
};

export function aggregatePaymentLinkItems(
  items: PaymentLinkOrderInput['items'],
) {
  const quantities = new Map<string, number>();
  for (const item of items) {
    quantities.set(
      item.variantSku,
      (quantities.get(item.variantSku) ?? 0) + item.quantity,
    );
  }
  return quantities;
}

export function paymentLinkTotals(cart: PaymentLinkCartItem[]) {
  const subtotalCents = cart.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discountCents = quantity >= 4 ? Math.round(subtotalCents * 0.15) : 0;
  const shippingCents = subtotalCents >= 5000 ? 0 : 599;
  return {
    subtotalCents,
    discountCents,
    shippingCents,
    taxCents: 0,
    totalCents: subtotalCents - discountCents + shippingCents,
    discountCode: discountCents > 0 ? 'PICK_FOUR_15' : null,
  };
}

export function matchesExistingPaymentLinkOrder(
  existing: ExistingPaymentLinkOrder,
  input: PaymentLinkOrderInput,
) {
  if (
    existing.id !== input.requestId ||
    existing.status !== 'PENDING' ||
    existing.email !== input.email ||
    existing.shippingName !== input.shipping.name ||
    existing.shippingLine1 !== input.shipping.line1 ||
    existing.shippingLine2 !== (input.shipping.line2 ?? null) ||
    existing.shippingCity !== input.shipping.city ||
    existing.shippingState !== input.shipping.state ||
    existing.shippingZip !== input.shipping.zip ||
    existing.shippingCountry !== input.shipping.country ||
    existing.giftRecipientName !== (input.giftRecipientName ?? null) ||
    existing.giftMessage !== (input.giftMessage ?? null)
  ) {
    return false;
  }

  const requested = aggregatePaymentLinkItems(input.items);
  const saved = new Map<string, number>();
  for (const item of existing.items) {
    if (!item.skuSnapshot) return false;
    saved.set(
      item.skuSnapshot,
      (saved.get(item.skuSnapshot) ?? 0) + item.quantity,
    );
  }
  return (
    requested.size === saved.size &&
    [...requested].every(([sku, quantity]) => saved.get(sku) === quantity)
  );
}
