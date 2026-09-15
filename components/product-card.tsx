import { ProductPhoto } from '@/components/product-photo';
import Link from 'next/link';
import type { StorefrontProduct } from '@/lib/products';

export function ProductCard({ product }: { product: StorefrontProduct }) {
  return (
    <article className={`product-card ${product.tone}`}>
      <Link
        href={`/product/${product.slug}`}
        className="product-image"
        aria-label={`View ${product.name}`}
      >
        <ProductPhoto src={product.image} alt={product.name} />
      </Link>
      <div className="product-info">
        <div>
          <span className="product-category">{product.category}</span>
          <h3>
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
        </div>
        <span className="price">{product.price}</span>
      </div>
    </article>
  );
}
