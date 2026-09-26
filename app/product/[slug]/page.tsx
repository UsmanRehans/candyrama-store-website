import { ProductPhoto } from "@/components/product-photo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ProductOptions } from "@/components/product-options";
import { StoreFooter, StoreHeader } from "@/components/store-chrome";
import { connection } from "next/server";
import {
  getStorefrontProduct,
  getStorefrontProducts,
} from "@/lib/server/catalog";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getStorefrontProduct(slug);
  return product
    ? { title: `${product.name} | CandyRama`, description: product.note }
    : {};
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const product = await getStorefrontProduct(slug);
  if (!product) notFound();
  const craving = ["Brittle", "Bark"].includes(product.category)
    ? "crunchy"
    : product.category.toLowerCase() === "gummies"
      ? "sweet"
      : product.category.toLowerCase();
  const related = (await getStorefrontProducts())
    .filter((item) => item.slug !== slug)
    .slice(0, 3);
  return (
    <main className="candy-counter">
      <StoreHeader />
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link href="/shop">Shop</Link>
        <span aria-hidden="true">→</span>
        <Link href={`/shop?craving=${encodeURIComponent(craving)}`}>
          {product.category}
        </Link>
        <span aria-hidden="true">→</span>
        <span>{product.name}</span>
      </nav>
      <section className="product-detail">
        <div className={`product-detail-art ${product.tone}`}>
          <ViewTransition
            name={`product-${product.slug}`}
            share="product-morph"
            default="none"
          >
            <ProductPhoto src={product.image} alt={product.name} priority />
          </ViewTransition>
        </div>
        <div className="product-detail-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="detail-note">{product.note}</p>
          <ProductOptions
            variants={product.variants ?? []}
            purchaseEnabled={product.purchaseEnabled ?? false}
          />
          <div className="product-facts">
            Ingredient and allergen information appears on the current package.{" "}
            <Link href="/allergens">Read ingredient and allergen guidance</Link>
          </div>
        </div>
      </section>
      <section className="product-related">
        <p className="eyebrow">Grab another bag</p>
        <div className="product-related-grid">
          {related.map((item) => (
            <Link
              href={`/product/${item.slug}`}
              key={item.slug}
              className="product-related-card"
            >
              <ProductPhoto src={item.image} alt="" />
              <div>
                <h2>{item.name}</h2>
                <span>{item.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <StoreFooter />
    </main>
  );
}
