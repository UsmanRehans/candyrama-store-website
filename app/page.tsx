import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';
import { connection } from 'next/server';
import { getStorefrontProducts } from '@/lib/server/catalog';

export default async function Home() {
  await connection();
  const products = await getStorefrontProducts();
  return (
    <main>
      <StoreHeader />
      <section className="hero lifestyle-hero">
        <Image
          className="lifestyle-hero-image"
          src="/generated/candy-picnic.png"
          alt="Friends sharing colorful CandyRama candy at a sunny backyard picnic"
          fill
          priority
          sizes="100vw"
        />
        <div className="lifestyle-shade" />
        <div className="hero-copy">
          <p className="eyebrow">SWEET. LOUD. MADE BY HAND.</p>
          <h1>
            Candy with
            <br />
            <em>main character</em>
            <br />
            energy.
          </h1>
          <p className="lede">
            Gummies, brittle, and wildly good treats. Packed with big flavor
            right here in Texas.
          </p>
          <div className="hero-buttons">
            <Link href="/shop" className="button primary">
              Shop all candy <ArrowRight />
            </Link>
            <Link href="/about" className="button secondary">
              Meet CandyRama
            </Link>
          </div>
          <div className="micro-proof">
            <span>
              <Star fill="currentColor" /> Big flavor in every bag
            </span>
            <span>Packed by hand in Texas</span>
          </div>
        </div>
      </section>
      <section className="ticker" aria-label="Candy categories">
        <span>GUMMIES</span>
        <b>✦</b>
        <span>BRITTLE</span>
        <b>✦</b>
        <span>SOUR STUFF</span>
        <b>✦</b>
        <span>SPICY AND SWEET</span>
      </section>
      <section className="shop-section" id="shop">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE GOOD STUFF</p>
            <h2>Pick your craving.</h2>
          </div>
          <Link href="/shop" className="text-link">
            Shop all treats <ArrowRight />
          </Link>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      </section>
      <section className="story-section" id="story">
        <div className="story-card">
          <p className="eyebrow">HOWDY, SWEET TOOTH!</p>
          <h2>
            Little batches.
            <br />
            Big candy drama.
          </h2>
          <p>
            We pack candy for people who always want one more handful. Every
            bag brings the flavor. Boring bites can stay home.
          </p>
          <Link href="/about" className="button secondary">
            Read our story
          </Link>
        </div>
        <div className="story-visual">
          <Image
            src="/generated/workshop.png"
            alt="Candy makers tossing colorful gummies by hand in a small Texas workshop"
            fill
            sizes="(max-width: 800px) 100vw, 55vw"
          />
        </div>
      </section>
      <section className="find-section" id="find-us">
        <div>
          <MapPin />
          <p className="eyebrow">CRAVING CANDYRAMA IRL?</p>
          <h2>Find us near you.</h2>
        </div>
        <Link href="#find-us" className="button primary">
          Find a stockist
        </Link>
      </section>
      <StoreFooter />
    </main>
  );
}
