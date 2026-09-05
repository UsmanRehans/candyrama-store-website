'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './cart-provider';

type Product = { slug: string; name: string; category: string; note: string; price: string; priceCents: number; image: string; tone: string; badge?: string };

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  function quickAdd() { add(product.slug); setAdded(true); window.setTimeout(() => setAdded(false), 1200); }
  return <article className={`product-card ${product.tone}`}>
    {product.badge && <span className="product-badge">{product.badge}</span>}
    <Link href={`/product/${product.slug}`} className="product-image"><Image src={product.image} alt={product.name} width={520} height={520} /></Link>
    <div className="product-info"><div><span className="product-category">{product.category}</span><h3>{product.name}</h3><p>{product.note}</p></div><span className="price">{product.price}</span></div>
    <button className="quick-add" onClick={quickAdd}>{added ? 'Added!' : 'Quick add'} <span>{added ? '✓' : '+'}</span></button>
  </article>;
}
