'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type CartItem = { variantSku: string; quantity: number };
type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (variantSku: string) => void;
  setQuantity: (variantSku: string, quantity: number) => void;
  clear: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const storageKey = 'candyrama-cart-v2';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restored, setRestored] = useState(false);
  useEffect(() => {
    let savedItems: CartItem[] = [];
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(storageKey) ?? '[]',
      );
      if (Array.isArray(saved))
        savedItems = saved.filter(
              (item): item is CartItem =>
                typeof item?.variantSku === 'string' &&
                item.variantSku.length > 0 &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0,
            );
    } catch {
      // Storage may be blocked; the in-memory cart still works.
    }
    queueMicrotask(() => {
      setItems(savedItems);
      setRestored(true);
    });
  }, []);
  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Retain the current cart when browser storage is unavailable.
    }
  }, [items, restored]);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      add: (variantSku) =>
        setItems((current) => {
          const found = current.find((item) => item.variantSku === variantSku);
          return found
            ? current.map((item) =>
                item.variantSku === variantSku
                  ? { ...item, quantity: Math.min(20, item.quantity + 1) }
                  : item,
              )
            : [...current, { variantSku, quantity: 1 }];
        }),
      setQuantity: (variantSku, quantity) =>
        setItems((current) =>
          quantity <= 0
            ? current.filter((item) => item.variantSku !== variantSku)
            : current.map((item) =>
                item.variantSku === variantSku
                  ? { ...item, quantity: Math.min(20, quantity) }
                  : item,
              ),
        ),
      clear,
    }),
    [items, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used inside CartProvider');
  return value;
}
