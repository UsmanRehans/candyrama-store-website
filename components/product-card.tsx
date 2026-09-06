'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { StorefrontProduct } from '@/lib/products';

export function ProductCard({ product }: { product: StorefrontProduct }) {
  const [notice, setNotice] = useState(false);
  function quickAdd() {
    setNotice(true);
    window.setTimeout(() => setNotice(false), 1600);
  }
  return (
    <article className={`product-card ${product.tone}`}>
      {product.badge && <span className="product-badge">{product.badge}</span>}
      <Link href={`/product/${product.slug}`} className="product-image">
        <Image
          src={product.image}
          alt={product.name}
          width={520}
          height={520}
          unoptimized
        />
      </Link>
      <div className="product-info">
        <div>
          <span className="product-category">{product.category}</span>
          <h3>{product.name}</h3>
          <p>{product.note}</p>
        </div>
        <span className="price">{product.price}</span>
      </div>
      <button
        className="quick-add"
        onClick={quickAdd}
      >
        {notice ? 'Launching soon!' : 'Coming soon'}{' '}
        <span>{notice ? '✓' : '✦'}</span>
      </button>
    </article>
  );
}
