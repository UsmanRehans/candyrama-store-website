"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import type { StorefrontProduct } from "@/lib/products";

export function CartPageClient({
  products,
}: {
  products: StorefrontProduct[];
}) {
  const { items, setQuantity } = useCart();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftRecipientName, setGiftRecipientName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [useRewards, setUseRewards] = useState(false);
  const lines = items.flatMap((item) => {
    const product = products.find(
      (candidate) => candidate.variantSku === item.variantSku,
    );
    return product ? [{ ...item, product }] : [];
  });
  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.priceCents * line.quantity,
    0,
  );
  async function checkout() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/v1/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        throw new Error(result.error ?? "Checkout is unavailable.");
      window.location.assign(result.data.checkoutUrl);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Checkout is unavailable.",
      );
      setLoading(false);
    }
  }
  return (
    <section className="cart-shell">
      <p className="eyebrow">YOUR CANDY STASH</p>
      <h1>Your bag</h1>
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
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                />
                <div>
                  <h2>{product.name}</h2>
                  <p>{product.note}</p>
                  <strong>{product.price}</strong>
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
              </article>
            ))}
          </div>
          <aside className="cart-summary">
            <h2>Order summary</h2>
            <p>
              <span>Subtotal</span>
              <strong>${(subtotal / 100).toFixed(2)}</strong>
            </p>
            <p>
              <span>Shipping</span>
              <strong>{subtotal >= 5000 ? "Free" : "$5.99"}</strong>
            </p>
            <small>Taxes are calculated securely at checkout.</small>
            <label>
              Email for your receipt
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </label>
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
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button
              className="button primary"
              disabled={loading}
              onClick={checkout}
            >
              {loading ? "Opening checkout…" : "Secure checkout"}
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
