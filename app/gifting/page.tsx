import Image from 'next/image';
import Link from 'next/link';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';

export const metadata = {
  title: 'Candy Gifts | Candy Rama',
  description: 'Pick their favorite candy and add a personal message to your order. A little candy goes a long way.',
};

export default function GiftingPage() {
  return (
    <main className="candy-counter">
      <StoreHeader />
      <section className="counter-gifting">
        <p className="eyebrow">Candy makes a good gift</p>
        <h1>Send a little happy.</h1>
        <p>
          Pick their favorite candy and add a personal message in your bag before
          checkout. Birthdays, thank yous, or just because.
        </p>
        <Link className="button primary" href="/shop">
          Pick their treats
        </Link>
      </section>
      <section className="counter-story">
        <div className="counter-story-copy">
          <p className="eyebrow">Our story</p>
          <h2>Made for passing around.</h2>
          <p>
            We are a Texas candy brand with a soft spot for people who always
            want one more handful. Bring a bag to movie night, a backyard hang,
            or wherever your people gather.
          </p>
          <Link className="text-link" href="/about">Get to know Candy Rama</Link>
        </div>
        <div className="counter-story-image">
          <Image
            src="/generated/workshop.png"
            alt="Illustrated Candy Rama workshop scene"
            fill
            sizes="(max-width: 1023px) 100vw, 400px"
          />
        </div>
      </section>
      <StoreFooter />
    </main>
  );
}
