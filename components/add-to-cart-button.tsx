'use client';
import { useState } from 'react';
import { useCart } from './cart-provider';
export function AddToCartButton({
  variantSku,
  available = true,
}: {
  variantSku?: string;
  available?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      className="quick-add"
      disabled={!available || !variantSku}
      onClick={() => {
        if (!variantSku) return;
        add(variantSku);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
    >
      {!available ? 'Sold out' : added ? 'Added to your bag ✓' : 'Add to bag +'}
    </button>
  );
}
