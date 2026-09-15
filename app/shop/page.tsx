import { StoreFooter, StoreHeader } from '@/components/store-chrome';
import { ShopCatalog } from '@/components/shop-catalog';
import { connection } from 'next/server';
import { getStorefrontProducts } from '@/lib/server/catalog';
export const metadata = {
  title: 'Shop All Candy | CandyRama',
  description:
    'Sweet, sour, spicy, or crunchy. Find your new favorite CandyRama treat.',
};
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ craving?: string }>;
}) {
  await connection();
  const requested = (await searchParams).craving?.toLowerCase() ?? 'all';
  const active = ['all', 'sour', 'sweet', 'spicy', 'crunchy'].includes(
    requested,
  )
    ? requested
    : 'all';
  const products = await getStorefrontProducts();
  return (
    <main className="candy-counter">
      <StoreHeader />
      <section className="page-hero shop-hero">
        <p className="eyebrow">Find your new favorite</p>
        <h1>All the good stuff.</h1>
        <p>Sweet, sour, spicy, or crunchy.</p>
      </section>
      <ShopCatalog key={active} products={products} initialCraving={active} />
      <StoreFooter />
    </main>
  );
}
