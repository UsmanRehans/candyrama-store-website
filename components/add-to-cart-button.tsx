'use client';
import { useState } from 'react';
import { useCart } from './cart-provider';
export function AddToCartButton({ slug }: { slug: string }) {
  const { add } = useCart(); const [added, setAdded] = useState(false);
  return <button className="quick-add" onClick={() => { add(slug); setAdded(true); window.setTimeout(() => setAdded(false), 1200); }}>{added ? 'Added to your bag ✓' : 'Add to bag +'}</button>;
}
