'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = { productSlug: string; quantity: number };
type CartContextValue = { items: CartItem[]; count: number; add: (slug: string) => void; setQuantity: (slug: string, quantity: number) => void; clear: () => void };
const CartContext = createContext<CartContextValue | null>(null);
const storageKey = 'candyrama-cart-v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
      if (Array.isArray(saved)) queueMicrotask(() => setItems(saved.filter(item => typeof item?.productSlug === 'string' && Number.isInteger(item?.quantity) && item.quantity > 0)));
    } catch { localStorage.removeItem(storageKey); }
  }, []);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(items)); }, [items]);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    add: slug => setItems(current => { const found = current.find(item => item.productSlug === slug); return found ? current.map(item => item.productSlug === slug ? { ...item, quantity: Math.min(20, item.quantity + 1) } : item) : [...current, { productSlug: slug, quantity: 1 }]; }),
    setQuantity: (slug, quantity) => setItems(current => quantity <= 0 ? current.filter(item => item.productSlug !== slug) : current.map(item => item.productSlug === slug ? { ...item, quantity: Math.min(20, quantity) } : item)),
    clear,
  }), [items, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('useCart must be used inside CartProvider'); return value; }
