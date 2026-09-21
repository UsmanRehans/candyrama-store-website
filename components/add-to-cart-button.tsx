'use client';
import { useState } from 'react';
import { useCart } from './cart-provider';
export function AddToCartButton({
  variantSku,
  available = true,
  purchaseEnabled = false,
}: {
  variantSku?: string;
  available?: boolean;
  purchaseEnabled?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const disabled = !purchaseEnabled || !available || !variantSku;
  return (
    <button
      type="button"
      className="quick-add"
      disabled={disabled}
      onClick={() => {
        if (!variantSku) return;
        add(variantSku);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
    >
      <span aria-live="polite">
        {!purchaseEnabled
          ? 'Ordering unavailable'
          : !available || !variantSku
            ? 'Sold out'
            : added
              ? 'Added to your bag'
              : 'Quick add'}
      </span>
    </button>
  );
}
