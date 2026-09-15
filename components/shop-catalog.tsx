'use client';
import { useState } from 'react';
import { ProductCard } from './product-card';
import type { StorefrontProduct } from '@/lib/products';
const categories = ['All treats', 'Sour', 'Sweet', 'Spicy', 'Crunchy'];
export function ShopCatalog({
  products,
  initialCraving,
}: {
  products: StorefrontProduct[];
  initialCraving: string;
}) {
  const [active, setActive] = useState(initialCraving);
  const filtered = products.filter(
    (product) =>
      active === 'all' ||
      (active === 'crunchy'
        ? ['bark', 'brittle'].includes(product.category.toLowerCase())
        : active === 'sweet'
          ? ['sweet', 'gummies'].includes(product.category.toLowerCase())
          : product.category.toLowerCase() === active),
  );
  function selectCategory(value: string) {
    setActive(value);
    window.history.replaceState(
      null,
      '',
      value === 'all' ? '/shop' : `/shop?craving=${value}`,
    );
  }
  return (
    <section className="catalog-shell">
      <div className="catalog-toolbar">
        <div className="filter-pills" aria-label="Product categories">
          {categories.map((label, index) => {
            const value = index === 0 ? 'all' : label.toLowerCase();
            return (
              <button
                type="button"
                className={active === value ? 'active' : ''}
                aria-pressed={active === value}
                onClick={() => selectCategory(value)}
                key={value}
              >
                {label}
              </button>
            );
          })}
        </div>
        <span className="counter-product-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'treat' : 'treats'}
        </span>
      </div>
      <div className="product-grid catalog-grid">
        {filtered.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      {filtered.length === 0 && (
        <output className="counter-empty">
          No treats in this category right now. Try another flavor.
        </output>
      )}
    </section>
  );
}
