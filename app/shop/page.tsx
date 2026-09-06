import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { StoreFooter, StoreHeader } from "@/components/store-chrome";
import { connection } from "next/server";
import { getStorefrontProducts } from "@/lib/server/catalog";

const categories = [
  { label: "All treats", value: "all" },
  { label: "Sour", value: "sour" },
  { label: "Sweet", value: "sweet" },
  { label: "Spicy", value: "spicy" },
  { label: "Crunchy", value: "crunchy" },
];

export const metadata = {
  title: "Shop All Candy | CandyRama",
  description:
    "Shop CandyRama sour gummies, spicy candy, bark, and brittle. Every order is packed by hand in Texas.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ craving?: string }>;
}) {
  await connection();
  const requestedCraving = (await searchParams).craving?.toLowerCase() ?? "all";
  const activeCraving = categories.some(
    (category) => category.value === requestedCraving,
  )
    ? requestedCraving
    : "all";
  const products = await getStorefrontProducts();
  const filteredProducts = products.filter((product) => {
    if (activeCraving === "all") return true;
    if (activeCraving === "crunchy")
      return ["bark", "brittle"].includes(product.category.toLowerCase());
    return product.category.toLowerCase() === activeCraving;
  });
  return (
    <main>
      <StoreHeader />
      <section className="page-hero shop-hero">
        <p className="eyebrow">FIND YOUR NEW FAVORITE</p>
        <h1>All the good stuff.</h1>
        <p>Sweet, sour, spicy, or crunchy. Pick your kind of candy drama.</p>
      </section>
      <section className="catalog-shell">
        <div className="catalog-toolbar">
          <div className="filter-pills" aria-label="Product categories">
            {categories.map((category) => (
              <Link
                className={activeCraving === category.value ? "active" : ""}
                href={
                  category.value === "all"
                    ? "/shop"
                    : `/shop?craving=${category.value}`
                }
                key={category.value}
              >
                {category.label}
              </Link>
            ))}
          </div>
          <label>
            Sort by{" "}
            <select defaultValue="featured">
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="new">Newest</option>
            </select>
          </label>
        </div>
        <div className="catalog-summary">
          <p>
            <strong>{filteredProducts.length}</strong> treats ready to make your
            day
          </p>
          <Link href="/about">Meet CandyRama →</Link>
        </div>
        <div className="product-grid catalog-grid">
          {filteredProducts.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      </section>
      <StoreFooter />
    </main>
  );
}
