import assert from 'node:assert/strict';
import test from 'node:test';
import {
  matchesExistingPaymentLinkOrder,
  paymentLinkTotals,
} from './payment-link-order';
import { paymentLinkOrderSchema } from './schemas/payment-link';

const validInput = {
  requestId: '4b4859dc-d41c-4c92-b037-4e0da50f4900',
  items: [{ variantSku: 'CR-SOUR-8OZ', quantity: 4 }],
  email: 'Shopper@Example.com',
  shipping: {
    name: 'Candy Fan',
    line1: '123 Main St',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    country: 'US',
  },
  giftRecipientName: 'A Friend',
  giftMessage: 'Enjoy!',
} as const;

void test('payment-link schema validates and normalizes a US order', () => {
  const parsed = paymentLinkOrderSchema.parse(validInput);
  assert.equal(parsed.email, 'shopper@example.com');
  assert.equal(parsed.shipping.state, 'TX');
});

void test('payment-link schema rejects non-US and malformed addresses', () => {
  assert.equal(
    paymentLinkOrderSchema.safeParse({
      ...validInput,
      shipping: { ...validInput.shipping, country: 'CA' },
    }).success,
    false,
  );
  assert.equal(
    paymentLinkOrderSchema.safeParse({
      ...validInput,
      shipping: { ...validInput.shipping, zip: 'ABC' },
    }).success,
    false,
  );
  assert.equal(
    paymentLinkOrderSchema.safeParse({
      ...validInput,
      items: [
        { variantSku: 'CR-SOUR-8OZ', quantity: 11 },
        { variantSku: 'CR-SOUR-8OZ', quantity: 10 },
      ],
    }).success,
    false,
  );
});

void test('an idempotent retry must match the saved address, gift, and items', () => {
  const input = paymentLinkOrderSchema.parse(validInput);
  const existing = {
    id: input.requestId,
    email: input.email,
    status: 'PENDING',
    shippingName: input.shipping.name,
    shippingLine1: input.shipping.line1,
    shippingLine2: null,
    shippingCity: input.shipping.city,
    shippingState: input.shipping.state,
    shippingZip: input.shipping.zip,
    shippingCountry: input.shipping.country,
    giftRecipientName: input.giftRecipientName ?? null,
    giftMessage: input.giftMessage ?? null,
    items: [{ skuSnapshot: 'CR-SOUR-8OZ', quantity: 4 }],
  };
  assert.equal(matchesExistingPaymentLinkOrder(existing, input), true);
  assert.equal(
    matchesExistingPaymentLinkOrder(existing, {
      ...input,
      shipping: { ...input.shipping, zip: '78702' },
    }),
    false,
  );
});

void test('payment-link totals apply the existing four-item bundle savings', () => {
  assert.deepEqual(
    paymentLinkTotals([
      {
        productId: 'product',
        variantId: 'variant',
        sku: 'CR-SOUR-8OZ',
        name: 'Sour Candy',
        priceCents: 1000,
        quantity: 4,
      },
    ]),
    {
      subtotalCents: 4000,
      discountCents: 600,
      shippingCents: 599,
      taxCents: 0,
      totalCents: 3999,
      discountCode: 'PICK_FOUR_15',
    },
  );
});
