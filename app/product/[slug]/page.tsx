import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';
import { products } from '@/lib/products';

export function generateStaticParams() { return products.map(product => ({ slug: product.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const product = products.find(item => item.slug === slug); return product ? { title: `${product.name} | CandyRama`, description: product.note } : {}; }
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = products.find(item => item.slug === slug); if (!product) notFound();
  return <main><StoreHeader/><section className="product-detail"><div className={`product-detail-art ${product.tone}`}><Image src={product.image} alt={product.name} width={700} height={700} priority/></div><div className="product-detail-copy"><p className="eyebrow">{product.category} · SMALL-BATCH</p><h1>{product.name}</h1><p className="detail-price">{product.price}</p><p className="detail-note">{product.note}. Packed by hand in Texas for maximum flavor and maximum fun.</p><AddToCartButton slug={product.slug}/><div className="product-facts"><strong>8 oz (227g)</strong><br/>Ingredient and allergen information appears on the current package. Made in a shared facility.</div></div></section><StoreFooter/></main>;
}
