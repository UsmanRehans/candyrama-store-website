'use client';

import { useState } from 'react';
import type { StorefrontVariant } from '@/lib/products';
import { AddToCartButton } from './add-to-cart-button';

export function ProductOptions({
  variants,
  purchaseEnabled,
}: {
  variants: StorefrontVariant[];
  purchaseEnabled: boolean;
}) {
  const [selectedSku, setSelectedSku] = useState(variants[0]?.sku ?? '');
  const selected =
    variants.find((variant) => variant.sku === selectedSku) ?? variants[0];

  if (!selected) return null;

  return (
    <div className="product-options">
      <div className="product-option-heading">
        <span className="eyebrow">Pick your size</span>
      </div>
      <div className="product-option-grid" aria-label="Product options">
        {variants.map((variant) => (
          <button
            type="button"
            aria-pressed={variant.sku === selected.sku}
            className={variant.sku === selected.sku ? 'selected' : ''}
            key={variant.sku}
            onClick={() => setSelectedSku(variant.sku)}
          >
            <span>{variant.label}</span>
            <small>{variant.price}</small>
          </button>
        ))}
      </div>
      <p className="detail-price">
        {selected.price} <span>{selected.label}</span>
      </p>
      <AddToCartButton
        variantSku={selected.sku}
        available={selected.available}
        purchaseEnabled={purchaseEnabled}
      />
      <p className="selected-net-weight">
        {selected.netWeight
          ? `Net weight ${selected.netWeight}`
          : 'See package for net weight'}
      </p>
      {!purchaseEnabled && (
        <p className="coming-soon-note">
          Preview the options now. Ordering opens soon.
        </p>
      )}
    </div>
  );
}
