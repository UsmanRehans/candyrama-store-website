'use client';

import Image from 'next/image';
import { Check, PartyPopper } from 'lucide-react';
import { useMemo, useState } from 'react';
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
  const subtotal = useMemo(
    () =>
      box.reduce(
        (sum, slug) =>
          sum + (choices.find((item) => item.slug === slug)?.priceCents ?? 0),
        0,
      ),
    [box, choices],
  );
  const total = Math.round(subtotal * 0.85);

  function toggle(slug: string) {
    setNotice('');
    setBox((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : current.length < 4
          ? [...current, slug]
          : current,
    );
  }

  function addBox() {
    if (box.length !== 4) {
      setNotice(
        `Pick ${4 - box.length} more ${box.length === 3 ? 'bag' : 'bags'} first.`,
      );
      return;
    }
    box.forEach((slug) => {
      const product = choices.find((item) => item.slug === slug);
      if (product?.variantSku) add(product.variantSku);
    });
    setNotice(
      'Your box is packed into your bag. The 15% savings will be added automatically.',
    );
  }

  return (
    <div
      className={
        box.length === 4 ? 'pick-four-builder complete' : 'pick-four-builder'
      }
    >
      <div className="pick-four-progress">
        <span>{box.length} of 4</span>
        <div>
          {[0, 1, 2, 3].map((slot) => (
            <i className={slot < box.length ? 'filled' : ''} key={slot}>
              {slot < box.length && <Check />}
            </i>
          ))}
        </div>
      </div>
      <div className="pick-four-grid">
        {choices.map((product) => (
          <button
            type="button"
            className={box.includes(product.slug) ? 'picked' : ''}
            onClick={() => toggle(product.slug)}
            key={product.slug}
          >
            <span className="pick-four-image">
              <Image
                src={product.image}
                alt=""
                width={240}
                height={240}
                unoptimized
              />
            </span>
            <strong>{product.name}</strong>
            <small>
              {box.includes(product.slug) ? 'In your box' : product.price}
            </small>
          </button>
        ))}
      </div>
      <div className="pick-four-total">
        <div>
          <small>Your four bag box</small>
          <strong>${(total / 100).toFixed(2)}</strong>
          {box.length === 4 && (
            <span>You save ${((subtotal - total) / 100).toFixed(2)}</span>
          )}
        </div>
        <button className="button primary" type="button" onClick={addBox}>
          Add my box <PartyPopper />
        </button>
        {notice && <output>{notice}</output>}
      </div>
      {box.length === 4 && (
        <div className="candy-confetti" aria-hidden="true">
          ✦ ● ★ ✦ ● ★
        </div>
      )}
    </div>
  );
}
