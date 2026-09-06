import { connection } from 'next/server';
import { PickFourBuilder } from '@/components/pick-four-builder';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';
import { getStorefrontProducts } from '@/lib/server/catalog';

export default async function PickFourPage() {
  await connection();
  const products = await getStorefrontProducts();
  return (
    <main>
      <StoreHeader />
      <section className="pick-four-page">
        <div className="pick-four-intro">
          <p className="eyebrow">THE FOUR BAG BOX</p>
          <h1>
            Pick four.
            <br />
            Save 15%.
          </h1>
          <p>
            Build a box with any four bags. Mix every flavor or play favorites.
            Your savings show up automatically.
          </p>
        </div>
        <PickFourBuilder products={products} />
      </section>
      <StoreFooter />
    </main>
  );
}
