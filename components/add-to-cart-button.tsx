'use client';
import { useState } from 'react';
import { useCart } from './cart-provider';
export function AddToCartButton({
  slug,
  available = true,
}: {
  slug: string;
  available?: boolean;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      className="quick-add"
      disabled={!available}
      onClick={() => {
        add(slug);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
    >
      {!available ? 'Sold out' : added ? 'Added to your bag ✓' : 'Add to bag +'}
    </button>
  );
}
