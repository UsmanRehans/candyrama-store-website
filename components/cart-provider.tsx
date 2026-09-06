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
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(storageKey) ?? '[]',
      );
      if (Array.isArray(saved))
        queueMicrotask(() =>
          setItems(
            saved.filter(
              (item): item is CartItem =>
                typeof item?.variantSku === 'string' &&
                item.variantSku.length > 0 &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0,
            ),
          ),
        );
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);
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
