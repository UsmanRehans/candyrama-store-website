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
  return (
    <button
      className="quick-add"
      disabled={purchaseEnabled && (!available || !variantSku)}
      onClick={() => {
        if (!purchaseEnabled) {
          setAdded(true);
          window.setTimeout(() => setAdded(false), 1600);
          return;
        }
        if (!variantSku) return;
        add(variantSku);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
    >
      {!purchaseEnabled
        ? added
          ? 'Launching soon ✓'
          : 'Coming soon ✦'
        : !available
          ? 'Sold out'
          : added
            ? 'Added to your bag ✓'
            : 'Add to bag +'}
    </button>
  );
}
