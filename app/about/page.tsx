import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';
import { StorefrontMotion } from '@/components/storefront-motion';
import { CandyHand } from '@/components/candy-hand';
import { lifestyleImages } from '@/lib/lifestyle-images';
import './story.css';

export const metadata = {
  title: 'Our Story | Candy Rama',
  description:
    'A small team in Rosenberg, Texas, with a big appetite for candy discoveries. Get to know Candy Rama.',
};

export default function AboutPage() {
  return (
    <main className="candy-counter story-page">
      <StorefrontMotion />
      <StoreHeader />
      <section className="story-opening" aria-labelledby="story-heading">
        <div className="story-opening-copy">
          <h1 id="story-heading">
            Always curious.
            <br />
            Always candy.
          </h1>
          <p>
            We’re Candy Rama, a small team in Rosenberg, Texas, with a big
            appetite for trying something new. We love a familiar favorite—and
            the excitement of finding a candy we’ve never tried before.
          </p>
          <Link className="text-link" href="#our-curiosity">
            Get to know us <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
        <div className="story-opening-photo">
          <Image
            src="/generated/hero-tasting-counter-v1.png"
            alt="Rainbow sour belts, fruit gummies, and spicy candy gathered on a yellow tray"
            width={1536}
            height={1024}
            sizes="(max-width: 900px) 100vw, 58vw"
            preload
          />
        </div>
      </section>
      <section
        className="story-curiosity"
        id="our-curiosity"
        aria-labelledby="curiosity-heading"
      >
        <div className="story-curiosity-title">
          <h2 id="curiosity-heading">
            A new find
            <br />
            gets us going.
          </h2>
          <CandyHand />
        </div>
        <div className="story-curiosity-copy">
          <p>
            When something catches our eye, we get experimenting. We give it our
            best, then bring it online for you to try.
          </p>
          <p>
            There’s always another flavor, texture, or candy idea to get curious
            about.
          </p>
          <Link className="text-link" href="/shop">
            Explore the candy <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <section className="story-sharing" aria-labelledby="sharing-heading">
        <div className="story-sharing-photo">
          <Image
            src={lifestyleImages.backyardSharing}
            alt="Friends passing colorful candy around a sunny backyard table with a pink Candy Rama pouch"
            width={1536}
            height={1024}
            sizes="(max-width: 900px) 100vw, 58vw"
          />
        </div>
        <div className="story-sharing-copy">
          <h2 id="sharing-heading">
            Good candy.
            <br />
            Good company.
          </h2>
          <p>
            Open a bag for movie night. Bring something unexpected to the table.
            Pass around an old favorite and see who reaches for more.
          </p>
          <p>
            That’s the fun of candy: finding what you love and sharing a little
            of it.
          </p>
          <Link className="button primary" href="/shop">
            Find your next favorite{' '}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
      <StoreFooter />
    </main>
  );
}
