import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageSquareText } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { StoreFooter, StoreHeader } from "@/components/store-chrome";
import { StorefrontMotion } from "@/components/storefront-motion";
import { appetiteImages, lifestyleImages } from "@/lib/lifestyle-images";
import { getStorefrontProducts } from "@/lib/server/catalog";
import { connection } from "next/server";

export const metadata = {
  title: "Candy Gifts | Candy Rama",
  description:
    "Explore candy for birthdays, thank-yous, and just-because gifts. Pick their favorites and add a personal message in your bag.",
};

const cravingGifts = [
  { label: "Sour", image: appetiteImages.sour, href: "/shop?craving=sour" },
  { label: "Spicy", image: appetiteImages.spicy, href: "/shop?craving=spicy" },
  {
    label: "Crunchy",
    image: appetiteImages.crunchy,
    href: "/shop?craving=crunchy",
  },
] as const;

export default async function GiftingPage() {
  await connection();
  const products = await getStorefrontProducts();

  return (
    <main className="candy-counter gifting-page">
      <StorefrontMotion />
      <StoreHeader />

      <section className="gifting-hero" aria-labelledby="gifting-title">
        <div className="gifting-hero-photo">
          <Image
            src="/generated/candy-texture-macro-v1.png"
            alt="Rainbow sour belts, gummy rings, blue gummies, and spicy candy sparkling with sugar"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <h1 id="gifting-title">Candy gifts.</h1>
      </section>

      <section
        id="gift-candy"
        className="gifting-products"
        aria-labelledby="gift-candy-title"
      >
        <div className="gifting-section-heading gifting-product-heading">
          <h2 id="gift-candy-title">Pick their favorites.</h2>
          <Link className="text-link" href="/pick-four">
            Pick four and save 15% <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="product-grid gifting-product-grid">
          {products.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              revealIndex={index}
            />
          ))}
        </div>
        {products.length === 0 && (
          <output className="counter-empty">
            No treats are available right now. Check back for the next candy
            drop.
          </output>
        )}
      </section>

      <section
        className="gifting-cravings"
        aria-labelledby="gift-cravings-title"
      >
        <div className="gifting-section-heading">
          <h2 id="gift-cravings-title">Shop their craving.</h2>
        </div>
        <div className="gifting-craving-grid">
          {cravingGifts.map((craving) => (
            <Link
              className="gifting-craving"
              href={craving.href}
              key={craving.label}
            >
              <span className="gifting-craving-image">
                <Image
                  src={craving.image}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 42vw, 33vw"
                />
              </span>
              <span className="gifting-craving-label">
                {craving.label} <ArrowUpRight size={21} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="gifting-message" aria-labelledby="gift-message-title">
        <div className="gifting-message-photo">
          <Image
            src={lifestyleImages.movieNight}
            alt="Candy Rama gummies and a pink pouch ready to share at movie night"
            fill
            sizes="(max-width: 767px) 100vw, 46vw"
          />
        </div>
        <div className="gifting-message-copy">
          <MessageSquareText size={34} strokeWidth={2.2} aria-hidden="true" />
          <h2 id="gift-message-title">Make it personal.</h2>
          <p>
            Choose “This is a gift” in your bag and add a message before
            checkout.
          </p>
          <Link className="button secondary" href="/shop">
            Explore all candy <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
          <nav className="gifting-help-links" aria-label="Gift order help">
            <Link href="/allergens">Ingredient &amp; allergen information</Link>
            <Link href="/legal/shipping-returns">Shipping &amp; returns</Link>
          </nav>
        </div>
      </section>

      <StoreFooter />
    </main>
  );
}
