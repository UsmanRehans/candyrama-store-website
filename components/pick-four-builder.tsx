'use client';

import { ProductPhoto } from '@/components/product-photo';
import { useState } from 'react';
import type { StorefrontProduct } from '@/lib/products';
import { useCart } from './cart-provider';

export function PickFourBuilder({
  products,
}: {
  products: StorefrontProduct[];
}) {
  const { add } = useCart();
  const [box, setBox] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const choices = products.filter((product) => product.variantSku);
  const selected = box.flatMap((slug) => {
    const product = choices.find((item) => item.slug === slug);
    return product ? [product] : [];
  });
  const subtotal = selected.reduce(
    (sum, product) => sum + product.priceCents,
    0,
  );
  const complete = selected.length === 4;
  const total = complete ? subtotal - Math.round(subtotal * 0.15) : subtotal;
  const remaining = 4 - selected.length;
  const countWords = ['', 'One', 'Two', 'Three', 'Four'];

  function addBox() {
    if (
      !complete ||
      selected.some((product) => !product.purchaseEnabled || !product.available)
    )
      return;
    selected.forEach((product) => add(product.variantSku!));
    setNotice(
      'Your four bags are in your bag. Fifteen percent savings apply automatically at checkout.',
    );
  }

  return (
    <div className={`pick-four-builder${complete ? ' complete' : ''}`}>
      <div className="pick-four-slots" aria-label="Your four bag box">
        {[0, 1, 2, 3].map((slot) => {
          const product = selected[slot];
          return product ? (
            <div className="pick-four-slot filled" key={slot}>
              <ProductPhoto src={product.image} alt="" />
              <strong>{product.name}</strong>
              <button
                type="button"
                aria-label={`Remove ${product.name} from slot ${slot + 1}`}
                onClick={() => {
                  setBox((current) =>
                    current.filter((_, index) => index !== slot),
                  );
                  setNotice('');
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="pick-four-slot empty" key={slot}>
              Slot {slot + 1}
            </div>
          );
        })}
      </div>
      <div className="pick-four-total" aria-live="polite">
        <div>
          <strong>
            {complete
              ? 'Fifteen percent off. Sweet choice.'
              : `${countWords[remaining]} more ${remaining === 1 ? 'bag' : 'bags'} to unlock fifteen percent off`}
          </strong>
          <span>
            Box total {complete ? '' : 'so far '}${(total / 100).toFixed(2)}
          </span>
          {complete && (
            <small>You save ${((subtotal - total) / 100).toFixed(2)}</small>
          )}
        </div>
        <button
          className="button primary"
          type="button"
          disabled={!complete}
          onClick={addBox}
        >
          {complete ? 'Add to bag' : `Add ${remaining} more`}
        </button>
      </div>
      {notice && <output className="pick-four-notice">{notice}</output>}
      <div className="pick-four-grid">
        {choices.map((product) => {
          const canAdd = product.purchaseEnabled && product.available;
          return (
            <article className="pick-four-card" key={product.slug}>
              <div className="pick-four-image">
                <ProductPhoto src={product.image} alt={product.name} />
              </div>
              <p className="kicker">{product.category}</p>
              <h2>{product.name}</h2>
              <p>{product.price}</p>
              <button
                className="button secondary"
                type="button"
                disabled={!canAdd || complete}
                onClick={() => {
                  setBox((current) =>
                    current.length < 4 ? [...current, product.slug] : current,
                  );
                  setNotice('');
                }}
              >
                {!product.purchaseEnabled
                  ? 'Unavailable'
                  : !product.available
                    ? 'Sold out'
                    : 'Add to box'}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
