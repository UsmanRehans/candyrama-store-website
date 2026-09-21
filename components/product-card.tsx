import { ProductPhoto } from "@/components/product-photo";
import Link from "next/link";
import { Flame, Sparkles, Zap } from "lucide-react";
import { ViewTransition } from "react";
import type { StorefrontProduct } from "@/lib/products";
import { AddToCartButton } from "@/components/add-to-cart-button";

export function ProductCard({
  product,
  revealIndex,
}: {
  product: StorefrontProduct;
  revealIndex?: number;
}) {
  const flavorCue =
    product.slug.includes("spicy") || product.slug.includes("chamoy")
      ? { label: "Heat", Icon: Flame }
      : product.slug.includes("bark")
        ? { label: "Crunch", Icon: Zap }
        : { label: "Sugar", Icon: Sparkles };
  const FlavorIcon = flavorCue.Icon;

  return (
    <article
      className={`product-card ${product.tone}`}
      data-product={product.slug}
      data-reveal={revealIndex === undefined ? undefined : ""}
      data-reveal-index={revealIndex}
    >
      <Link
        href={`/product/${product.slug}`}
        className="product-image"
        aria-label={`View ${product.name}`}
      >
        <ViewTransition
          name={`product-${product.slug}`}
          share="product-morph"
          default="none"
        >
          <ProductPhoto src={product.image} alt={product.name} />
        </ViewTransition>
        <span className="product-spill" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="flavor-cue" aria-hidden="true">
          <FlavorIcon size={13} strokeWidth={2.6} />
          {flavorCue.label}
        </span>
      </Link>
      <div className="product-info">
        <div>
          <span className="product-category">{product.category}</span>
          <h3>
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
        </div>
        <span className="price">{product.price}</span>
      </div>
      {product.note && <p className="product-note">{product.note}</p>}
      <AddToCartButton
        variantSku={product.variantSku}
        available={product.available}
        purchaseEnabled={product.purchaseEnabled}
      />
    </article>
  );
}
