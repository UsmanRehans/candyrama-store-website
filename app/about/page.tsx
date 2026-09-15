import Image from 'next/image';
import Link from 'next/link';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';

export const metadata = {
  title: 'Our Story | Candy Rama',
  description: 'Meet Candy Rama, a Texas candy brand with big candy energy and a soft spot for sharing.',
};

export default function AboutPage() {
  return (
    <main className="candy-counter">
      <StoreHeader />
      <section className="counter-gifting">
        <p className="eyebrow">Our story</p>
        <h1>Made for passing around.</h1>
        <p>
          We are Candy Rama, a Texas candy brand for people who always want one
          more handful. Big candy energy. Plenty to share.
        </p>
        <Link className="button primary" href="/shop">Taste the lineup</Link>
      </section>
      <section className="counter-story">
        <div className="counter-story-copy">
          <p className="eyebrow">Howdy, sweet tooth!</p>
          <h2>Good company. Great candy plans.</h2>
          <p>
            Candy belongs at movie nights, on road trips, and in the desk drawer
            everybody knows about. Pick your craving, bring your people, and
            open a bag.
          </p>
          <Link className="text-link" href="/gifting">Send a little happy</Link>
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
