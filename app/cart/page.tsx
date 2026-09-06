import { CartPageClient } from '@/components/cart-page-client';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';
import { connection } from 'next/server';
import { getStorefrontProducts } from '@/lib/server/catalog';
export const metadata = { title: 'Your Bag | CandyRama' };
export default async function CartPage() {
  await connection();
  const products = await getStorefrontProducts();
  return (
    <main>
      <StoreHeader />
      <CartPageClient products={products} />
      <StoreFooter />
    </main>
  );
}
