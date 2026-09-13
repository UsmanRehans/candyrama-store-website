import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
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
      <section className="home-photo-strip" aria-label="CandyRama favorites">
        <Link href="/product/rainbow-sour-mix" className="home-photo-card tall">
          <Image
            src="/generated/rainbow-mix-launch.png"
            alt="Rainbow Sour Mix spilling from a CandyRama bag"
            fill
            sizes="(max-width: 700px) 100vw, 40vw"
          />
          <span>
            <small>Sour and loud</small>
            <strong>Rainbow Sour Mix</strong>
            <ArrowRight />
          </span>
        </Link>
        <Link href="/product/chamoy-heatwave" className="home-photo-card">
          <Image
            src="/generated/chamoy-heatwave-launch.png"
            alt="Chamoy Heatwave candy with a sweet and spicy kick"
            fill
            sizes="(max-width: 700px) 100vw, 30vw"
          />
          <span>
            <small>Sweet meets heat</small>
            <strong>Chamoy Heatwave</strong>
            <ArrowRight />
          </span>
        </Link>
        <Link href="/product/blue-raspberry-blast" className="home-photo-card">
          <Image
            src="/generated/blue-raspberry-launch.png"
            alt="Blue Raspberry Blast sour candy"
            fill
            sizes="(max-width: 700px) 100vw, 30vw"
          />
          <span>
            <small>Big blue pucker</small>
            <strong>Blue Raspberry Blast</strong>
            <ArrowRight />
          </span>
        </Link>
      </section>
      <section className="home-pick-four">
        <div>
          <p className="eyebrow">THE FOUR BAG BOX</p>
          <h2>
            Four favorites.
            <br />
            15% happier.
          </h2>
          <p>Pick any four bags and we will take 15% off automatically.</p>
          <Link href="/pick-four" className="button primary">
            Build my box <ArrowRight />
          </Link>
        </div>
        <div className="home-box-art" aria-hidden="true">
          <span>
            <Image
              src="/generated/rainbow-sour-cutout.png"
              alt=""
              width={230}
              height={230}
            />
          </span>
          <span>
            <Image
              src="/generated/blue-sour-cutout.png"
              alt=""
              width={230}
              height={230}
            />
          </span>
          <span>
            <Image
              src="/generated/chamoy-cutout.png"
              alt=""
              width={230}
              height={230}
            />
          </span>
          <span>
            <Image
              src="/generated/brittle-cutout.png"
              alt=""
              width={230}
              height={230}
            />
          </span>
          <Sparkles />
        </div>
      </section>
      <section className="home-paths">
        <Link href="/gifting">
          <span className="home-path-image">
            <Image
              src="/generated/gummy-bear-party-launch.png"
              alt="A colorful CandyRama gift bag"
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
            />
          </span>
          <strong>Send a sweet gift</strong>
          <span>Add a note at checkout.</span>
          <ArrowRight />
        </Link>
        <Link href="/freshness-promise">
          <span className="home-path-image">
            <Image
              src="/generated/workshop.png"
              alt="CandyRama treats being packed by hand"
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
            />
          </span>
          <strong>Packed with care</strong>
          <span>See how we keep every bag fresh.</span>
          <ArrowRight />
        </Link>
        <Link href="/account">
          <span className="home-path-image">
            <Image
              src="/generated/candy-picnic.png"
              alt="Friends enjoying CandyRama treats together"
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
            />
          </span>
          <strong>Come back for more</strong>
          <span>Track orders and Sugar Points.</span>
          <ArrowRight />
        </Link>
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
            We pack candy for people who always want one more handful. Every bag
            brings the flavor. Boring bites can stay home.
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
      <StoreFooter />
    </main>
  );
}
