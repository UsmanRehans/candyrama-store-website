import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';
import { connection } from 'next/server';
import { getStorefrontProducts } from '@/lib/server/catalog';

const categories = ['All treats', 'Sour', 'Sweet', 'Spicy', 'Bark & brittle'];

export const metadata = {
  title: 'Shop All Candy | CandyRama',
  description:
    'Shop CandyRama sour gummies, spicy candy, bark and brittle—all packed by hand in Texas.',
};

export default async function ShopPage() {
  await connection();
  const products = await getStorefrontProducts();
  return (
    <main>
      <StoreHeader />
      <section className="page-hero shop-hero">
        <p className="eyebrow">FIND YOUR NEW FAVORITE</p>
        <h1>All the good stuff.</h1>
        <p>Sweet, sour, spicy, crunchy—pick your kind of candy drama.</p>
      </section>
      <section className="catalog-shell">
        <div className="catalog-toolbar">
          <div className="filter-pills" aria-label="Product categories">
            {categories.map((category, index) => (
              <button className={index === 0 ? 'active' : ''} key={category}>
                {category}
              </button>
            ))}
          </div>
          <label>
            Sort by{' '}
            <select defaultValue="featured">
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="new">Newest</option>
            </select>
          </label>
        </div>
        <div className="catalog-summary">
          <p>
            <strong>{products.length}</strong> treats ready to make your day
          </p>
          <Link href="/about">Why small-batch tastes better →</Link>
        </div>
        <div className="product-grid catalog-grid">
          {products.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      </section>
      <StoreFooter />
    </main>
  );
}
