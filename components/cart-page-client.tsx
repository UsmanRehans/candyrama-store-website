'use client';
import '@/app/cart/cart.css';
import { ProductPhoto } from '@/components/product-photo';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './cart-provider';
import { PaymentLinkOrder } from './payment-link-order';
import type { StorefrontProduct } from '@/lib/products';

export function CartPageClient({
  products,
  canPayOnline = false,
}: {
  products: StorefrontProduct[];
  canPayOnline?: boolean;
}) {
  const { items, setQuantity } = useCart();
  const [email, setEmail] = useState('');
  const [showPaymentLink, setShowPaymentLink] = useState(!canPayOnline);
  const [orderNumber, setOrderNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftRecipientName, setGiftRecipientName] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [useRewards, setUseRewards] = useState(false);
  const lines = items.flatMap((item) => {
    const product = products.find(
      (candidate) =>
        candidate.variantSku === item.variantSku ||
        candidate.variants?.some((variant) => variant.sku === item.variantSku),
    );
    if (!product) return [];
    const variant = product.variants?.find(
      (candidate) => candidate.sku === item.variantSku,
    );
    return [
      {
        ...item,
        product: variant
          ? {
              ...product,
              price: variant.price,
              priceCents: variant.priceCents,
              netWeight: variant.netWeight,
            }
          : product,
      },
    ];
  });
  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.priceCents * line.quantity,
    0,
  );
  const bundleDiscount =
    lines.reduce((sum, item) => sum + item.quantity, 0) >= 4
      ? Math.round(subtotal * 0.15)
      : 0;
  const quantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 599;
  const total = subtotal - bundleDiscount + shipping;
  async function checkout() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          email: email || undefined,
          giftRecipientName: isGift ? giftRecipientName : undefined,
          giftMessage: isGift ? giftMessage : undefined,
          referralCode: referralCode || undefined,
          useRewards,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.data?.checkoutUrl)
        throw new Error(result.error ?? 'Checkout is unavailable.');
      window.location.assign(result.data.checkoutUrl);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Checkout is unavailable.',
      );
      setLoading(false);
      setShowPaymentLink(true);
    }
  }
  if (orderNumber)
    return (
      <section className="cart-shell" aria-live="polite">
        <h1>Order received.</h1>
        <p>
          Your order number is <strong>{orderNumber}</strong>.
        </p>
        <p>
          Payment is still due. We’ll review your order and email your payment
          link. Your candy ships after payment.
        </p>
        <Link href="/shop" className="button primary">
          Keep exploring
        </Link>
      </section>
    );
  return (
    <section className="cart-shell">
      <h1>Your bag</h1>
      {lines.length > 0 && (
        <p className="cart-intro">
          {quantity} {quantity === 1 ? 'bag' : 'bags'} of candy drama.
        </p>
      )}
      {lines.length === 0 ? (
        <div className="empty-cart">
          <p>Your bag is ready for something sweet.</p>
          <Link className="button primary" href="/shop">
            Shop all candy
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-lines">
            {lines.map(({ product, variantSku, quantity }) => (
              <article className="cart-line" key={variantSku}>
                <ProductPhoto src={product.image} alt={product.name} />
                <div>
                  <h2>{product.name}</h2>
                  <p>
                    {product.variants?.find(
                      (variant) => variant.sku === variantSku,
                    )?.label ??
                      product.netWeight ??
                      'Candy bag'}
                  </p>
                  <button
                    className="cart-remove"
                    type="button"
                    onClick={() => setQuantity(variantSku, 0)}
                  >
                    Remove
                  </button>
                </div>
                <label>
                  Qty
                  <input
                    aria-label={`Quantity for ${product.name}`}
                    type="number"
                    min="0"
                    max="20"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(variantSku, Number(event.target.value))
                    }
                  />
                </label>
                <strong className="cart-line-price">
                  ${((product.priceCents * quantity) / 100).toFixed(2)}
                </strong>
              </article>
            ))}
            {quantity < 4 && (
              <div className="cart-upsell">
                <span>
                  {quantity === 3
                    ? 'One more bag unlocks fifteen percent off.'
                    : 'Make it four bags and save fifteen percent.'}
                </span>
                <Link className="button primary" href="/shop">
                  {quantity === 3 ? 'Pick a fourth' : 'Pick another bag'}
                </Link>
              </div>
            )}
          </div>
          <aside className="cart-summary">
            <h2 className="eyebrow">Order summary</h2>
            <p>
              <span>Subtotal</span>
              <strong>${(subtotal / 100).toFixed(2)}</strong>
            </p>
            {bundleDiscount > 0 && (
              <p className="cart-saving">
                <span>Four bag savings</span>
                <strong>-${(bundleDiscount / 100).toFixed(2)}</strong>
              </p>
            )}
            <p>
              <span>Shipping</span>
              <strong>{subtotal >= 5000 ? 'Free' : '$5.99'}</strong>
            </p>
            <p className="shipping-progress">
              {shipping === 0
                ? 'Your order qualifies for free shipping.'
                : `$${((5000 - subtotal) / 100).toFixed(2)} away from free shipping.`}
            </p>
            <p className="cart-total">
              <span>Estimated total</span>
              <strong>${(total / 100).toFixed(2)}</strong>
            </p>
            <small>
              U.S. shipping only. Taxes and eligible offers are finalized before
              payment.
            </small>
          </aside>
          <section className="cart-checkout" aria-labelledby="cart-details-heading">
            <h2 id="cart-details-heading">Your details</h2>
            {canPayOnline && (
              <label>
                Email for your receipt
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>
            )}
            <p className="automatic-offer-note">
              Email list member on your first order? We’ll check your welcome
              offer before payment.
            </p>
            <label className="cart-check">
              <input
                type="checkbox"
                checked={isGift}
                onChange={(event) => setIsGift(event.target.checked)}
              />
              This is a gift
            </label>
            {isGift && (
              <div className="gift-fields">
                <label>
                  Who is it for?
                  <input
                    value={giftRecipientName}
                    onChange={(event) =>
                      setGiftRecipientName(event.target.value)
                    }
                    maxLength={80}
                    placeholder="Their name"
                  />
                </label>
                <label>
                  Gift message
                  <textarea
                    value={giftMessage}
                    onChange={(event) => setGiftMessage(event.target.value)}
                    maxLength={300}
                    rows={4}
                    placeholder="Write something sweet"
                  />
                </label>
                <small>{giftMessage.length} of 300 characters</small>
              </div>
            )}
            {canPayOnline && (
              <>
                <label>
                  Referral code
                  <input
                    value={referralCode}
                    onChange={(event) =>
                      setReferralCode(event.target.value.toUpperCase())
                    }
                    maxLength={24}
                    placeholder="CANDYCODE"
                  />
                </label>
                <label className="cart-check">
                  <input
                    type="checkbox"
                    checked={useRewards}
                    onChange={(event) => setUseRewards(event.target.checked)}
                  />
                  Use my Sugar Points
                </label>
                <small>
                  We will apply every available point tied to this email.
                </small>
              </>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            {canPayOnline && (
              <button
                className="button primary"
                disabled={loading}
                onClick={checkout}
              >
                {loading ? 'Opening checkout…' : 'Pay now'}
              </button>
            )}
            {!showPaymentLink && (
              <button
                type="button"
                className="button secondary"
                onClick={() => setShowPaymentLink(true)}
              >
                Pay by link instead
              </button>
            )}
            {showPaymentLink && (
              <PaymentLinkOrder
                email={email}
                giftRecipientName={isGift ? giftRecipientName : undefined}
                giftMessage={isGift ? giftMessage : undefined}
                onComplete={setOrderNumber}
              />
            )}
          </section>
        </div>
      )}
    </section>
  );
}
