import Image from "next/image";
import { HeroVideo } from "@/components/hero-video";
import { CandyHand } from "@/components/candy-hand";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { PickFourMotion } from "@/components/pick-four-motion";
import { StorefrontMotion } from "@/components/storefront-motion";
import { StoreFooter, StoreHeader } from "@/components/store-chrome";
import { connection } from "next/server";
import { getStorefrontProducts } from "@/lib/server/catalog";
import { appetiteImages, lifestyleImages } from "@/lib/lifestyle-images";

const candyDirections = [
  {
    label: "Sour",
    craving: "sour",
    categories: ["sour"],
    image: appetiteImages.sour,
    tone: "sour",
  },
  {
    label: "Spicy",
    craving: "spicy",
    categories: ["spicy"],
    image: appetiteImages.spicy,
    tone: "spicy",
  },
  {
    label: "Crunchy",
    craving: "crunchy",
    categories: ["bark", "brittle"],
    image: appetiteImages.crunchy,
    tone: "crunchy",
  },
];

export default async function Home() {
  await connection();
  const products = await getStorefrontProducts();
  // Catalog order is oldest first; show every active product with new finds first.
  const lineup = [...products].reverse();
  const directions = candyDirections.filter((direction) =>
    products.some((product) =>
      direction.categories.includes(product.category.toLowerCase()),
    ),
  );
  return (
    <main className="candy-counter">
      <StorefrontMotion />
      <StoreHeader />
      <section className="discovery-hero" aria-labelledby="discovery-title">
        <div className="discovery-hero-copy">
          <h1 id="discovery-title">Taste the Twist.</h1>
          <Link href="#candy-lineup" className="button primary">
            Shop candy <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
        </div>
        <HeroVideo />
      </section>
      <section
        id="candy-lineup"
        className="counter-featured discovery-lineup"
        aria-labelledby="lineup-title"
      >
        <div className="section-heading">
          <h2 id="lineup-title">Find your next favorite.</h2>
          <Link href="/shop" className="text-link">
            Shop with filters <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <nav className="discovery-filter-links" aria-label="Shop by craving">
          <Link href="/shop">All candy</Link>
          {directions.map((direction) => (
            <Link
              key={direction.craving}
              href={`/shop?craving=${direction.craving}`}
            >
              {direction.label}
            </Link>
          ))}
        </nav>
        <div className="product-grid homepage-product-grid">
          {lineup.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              revealIndex={index}
            />
          ))}
        </div>
        {products.length === 0 && (
          <p>Our candy lineup is taking a little break. Check back soon.</p>
        )}
      </section>
      <section
        className="discovery-story"
        aria-labelledby="story-title"
        data-reveal
      >
        <div className="discovery-story-image">
          <Image
            src={lifestyleImages.backyardSharing}
            alt="Friends sharing colorful candy around a sunny backyard table"
            fill
            sizes="(max-width: 900px) 100vw, 60vw"
          />
        </div>
        <div className="discovery-story-copy">
          <h2 id="story-title">Small team. Big candy curiosity.</h2>
          <p>
            We’re Candy Rama, a small Texas team with a big appetite for trying
            something new.
          </p>
          <p>
            When a new candy catches our eye, we experiment, give it our best,
            and get it online for you to try.
          </p>
          <Link href="/about" className="text-link">
            Meet Candy Rama <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
      {directions.length > 0 && (
        <section
          className="discovery-cravings"
          aria-labelledby="cravings-title"
          data-reveal
        >
          <div className="section-heading">
            <h2 id="cravings-title">Follow your craving.</h2>
          </div>
          <div
            className="discovery-flavors"
            aria-label="Explore candy by craving"
          >
            {directions.map((direction) => (
              <Link
                key={direction.craving}
                href={`/shop?craving=${direction.craving}`}
                className={`discovery-flavor discovery-flavor-${direction.tone}`}
              >
                <div className="discovery-candy-image">
                  <Image
                    src={direction.image}
                    alt=""
                    width={1448}
                    height={1086}
                    sizes="(max-width: 639px) 100vw, 33vw"
                  />
                </div>
                <span>
                  {direction.label}
                  <ArrowUpRight size={22} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section
        className="counter-box-band discovery-box"
        data-reveal
        data-sparkle
      >
        <div className="discovery-box-photo">
          <Image
            src={lifestyleImages.movieNight}
            alt="Candy Rama gummies and a pink pouch being shared at movie night"
            fill
            sizes="(max-width: 767px) 100vw, 60vw"
          />
        </div>
        <div className="discovery-box-copy">
          <h2>Can’t pick just one?</h2>
          <div>
            <p>Pick four bags. Save 15%.</p>
            <Link href="/pick-four" className="button primary">
              Build your four <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <PickFourMotion />
        </div>
      </section>
      <div className="candy-hand-divider"><CandyHand /></div>
      <StoreFooter />
    </main>
  );
}
