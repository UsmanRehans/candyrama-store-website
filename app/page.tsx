import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { StoreFooter, StoreHeader } from '@/components/store-chrome';
import { connection } from 'next/server';
import { getStorefrontProducts } from '@/lib/server/catalog';

export default async function Home() {
  await connection();
  const products = await getStorefrontProducts();
  const preferred = [
    'rainbow-sour-mix',
    'chamoy-heatwave',
    'blue-raspberry-blast',
  ];
  const featured = [...products]
    .sort((a, b) => {
      const rank = (slug: string) =>
        preferred.includes(slug) ? preferred.indexOf(slug) : preferred.length;
      return rank(a.slug) - rank(b.slug);
    })
    .slice(0, 3);
  return (
    <main className="candy-counter">
      <StoreHeader />
      <section className="counter-hero">
        <div className="counter-hero-copy">
          <p className="eyebrow">Big flavor · Texas spirit</p>
          <h1>Candy with main character energy.</h1>
          <p className="lede">
            Sour stuff, sweet stuff and gummy stuff. Find your next handful of
            happy.
          </p>
          <div className="hero-buttons">
            <Link href="/shop" className="button primary">
              Shop the candy
            </Link>
            <Link href="/shop?craving=sour" className="text-link">
              Find your flavor
            </Link>
          </div>
        </div>
        <Image
          className="counter-hero-art"
          src="/generated/rainbow-sour-cutout.png"
          alt="Colorful rainbow sour candy"
          width={520}
          height={520}
          priority
          sizes="(max-width: 1023px) 90vw, 45vw"
        />
      </section>
      <section className="counter-featured">
        <div className="section-heading">
          <h2 className="eyebrow">The good stuff</h2>
          <Link href="/shop" className="text-link">
            See all treats →
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        {featured.length === 0 && (
          <p>New treats are on the way. Check back for the good stuff.</p>
        )}
      </section>
      <section className="counter-box-band">
        <div>
          <p className="eyebrow">The four bag box</p>
          <h2>Four favorites, fifteen percent off.</h2>
        </div>
        <Link href="/pick-four" className="button primary">
          Start your order
        </Link>
      </section>
      <section className="counter-story">
        <div className="counter-story-copy">
          <p className="eyebrow">Howdy, sweet tooth!</p>
          <h2>Tiny candy, huge personality.</h2>
          <p>
            We are a Texas based candy brand with a taste for the sweet, the
            sour, and the unexpected. Boring bites can stay home.
          </p>
          <Link href="/about" className="text-link">
            Read our story
          </Link>
        </div>
        <div className="counter-story-image">
          <Image
            src="/generated/workshop.png"
            alt="Illustration of a colorful candy packing scene"
            fill
            sizes="(max-width: 1023px) 100vw, 400px"
          />
        </div>
      </section>
      <StoreFooter />
    </main>
  );
}
