import Link from 'next/link';
import { Gift } from 'lucide-react';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';
export default function GiftingPage() {
  return (
    <main>
      <StoreHeader />
      <section className="simple-feature-page">
        <Gift />
        <p className="eyebrow">CANDY MAKES A GOOD GIFT</p>
        <h1>Send a little happy.</h1>
        <p>
          Pick their favorite candy, add a personal message at checkout, and we
          will tuck it into the box.
        </p>
        <Link className="button primary" href="/shop">
          Pick their treats
        </Link>
      </section>
      <StoreFooter />
    </main>
  );
}
