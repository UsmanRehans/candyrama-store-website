# CandyRama SKU + Variant Migration — handoff pack

**Author:** Claude (analysis + schema draft). **For:** the CandyRama backend implementation assistant (ChatGPT) + Usman to review.
**Branch:** `feat/sku-variant-model`. **Status:** schema drafted & `prisma validate`-clean; **no migration run, nothing pushed.**

This folder is a self-contained handoff. It explains what changed in `prisma/schema.prisma`, why, what's left to do, and ships the data to seed from. It draws on a three-repo analysis (inventory app, sales-ingestion SKU spine, this store) — the two analysis docs are included here for context.

---

## TL;DR

1. **The canonical SKU system already exists** — a governed, cross-channel **SKU spine** (`sku_spine_v3` / `SKU_Map.xlsx`) in the `twisted-treatz-sales-data-ingestion` repo. **Do not invent a new SKU scheme.** Adopt the spine's SKUs.
2. **Grain:** a product is `brand + product_family + flavor`; **size/pack is a variant attribute, never part of identity.** Hierarchy lives in **columns, never parsed from the SKU string**.
3. **Schema change (this branch):** added a `ProductVariant` model + `sku`/`brand`/`productFamily`/`flavor` on `Product`, and nullable `variantId` on `OrderItem`/`StockMovement`. **Additive and non-breaking** — legacy `Product.priceCents`/`stockQty`/`stripePriceId` are retained (marked deprecated) so the app still compiles. The caller refactor is the next task (see §4).
4. **Data to seed:** `candyrama_products_import.csv` (276 products) + `candyrama_variants_import.csv` (1,076 variants), TwistedTreatz confectionery only, real leaf SKUs preserved.
5. **What only a human can supply:** retail price, stock counts, descriptions, ingredients, allergens, and confirmation of the category mapping. These are blank/flagged on purpose — **never fabricate them.**

---

## 1. What changed in `prisma/schema.prisma`

| Change | Why |
|---|---|
| New enum `ProductBrand { TWISTED_TREATZ, OTHER_IP }` | Spine's two-brand model (`ops/RULES.md`). |
| `Product.sku String? @unique` | The master SKU. Nullable during migration → make required after backfill. |
| `Product.brand`, `productFamily`, `flavor` | Hierarchy as columns (spine rule: never parse from the SKU string). |
| New model `ProductVariant` | Size/pack grain — the sellable unit. Carries `sku` (leaf), `sizeSig`, `priceCents`, `stockQty`, `stripePriceId`, `lowStockAt`, per-channel SKU arrays, `isDefault`. |
| `OrderItem.variantId?` + `skuSnapshot?` | Orders resolve to a variant; SKU frozen at purchase like name/price. |
| `StockMovement.variantId?` | Stock moves at variant grain; `productId` kept for rollups. |
| `Product.priceCents/stockQty/compareAtCents/lowStockAt/stripePriceId/netWeight` | **Kept, marked deprecated.** Source of truth is now the variant; retained only so existing callers compile mid-migration. |

Validate: `DATABASE_URL=… DIRECT_URL=… npx prisma validate` → *valid*.

## 2. The design rules to preserve (from the spine's governance)

- **`sku` is stable & opaque — never renamed, never parsed.** Legacy leaf SKUs with size fossils / `-revN` / case twins (`AssortedCaramelChews-1lb.` vs `-1lb`) are **kept verbatim** — they're join keys to the warehouse and platform listings.
- **`flavor` is never NULL** (`Original` / `Assorted`).
- **`product_family` / `flavor` are controlled vocabularies** — propose new values (flag for review), never silently mint.
- **No product listed without a SKU row.** Human (Hani) corrections outrank automation.

## 3. The data files

**`candyrama_products_import.csv`** — 276 products (brand+family+flavor grain).
Columns: `slug, sku, name, brand, product_family, flavor, candyrama_category, category_confidence, status, tagline, description, ingredients, allergens_pipe, seasonal, accent_color, source_master_skus`.
- `sku` = synthesized clean flavor-grain key `TT-{Family}-{Flavor}` (new; the leaves keep the real SKUs).
- `source_master_skus` = the SKU_Map master IDs that rolled into this product (traceability).
- `candyrama_category` = **best-guess** map to your `Category` enum; `category_confidence` is `HIGH` or `REVIEW`. **152 rows are REVIEW — needs business sign-off** (families like Fruit Slices, Jelly Belly, Swedish Candy, Hard Candy, Candy Corn, dried-fruit/nuts don't map cleanly to the 9-value enum).
- `description`, `ingredients`, `tagline`, `allergens_pipe` are **blank** — your workbook requires description+ingredients (min length 1), so this file is a **template to fill, not a direct import yet.**

**`candyrama_variants_import.csv`** — 1,076 variants (size/pack leaves).
Columns: `product_sku, variant_sku, size_sig, is_default, net_weight, price_usd, stock_qty, amazon_skus, shopify_skus, tiktok_skus, temu_skus`.
- `variant_sku` = the **real leaf SKU, verbatim.** `size_sig` parsed from it (weight/pack tokens only — allowed by the spine's "size tokens may come from strings" rule).
- `net_weight` derived from `size_sig` where possible; `stock_qty` is **blank** because on-hand isn't in the spine. `price_usd` is populated only for exact, unambiguous live-store SKU matches documented in `PRICE-BACKFILL.md`; unmatched prices remain blank.
- `amazon/shopify/tiktok/temu_skus` = which channels carry that exact leaf (reconciliation).

**`twistedtreatz-master-sku-catalog.csv`** — the full 842-master cross-channel catalog (all brands, incl. `Other (IP)` resale), revenue/units excluded. Reference for the whole company.

## 4. Remaining work for the implementation assistant (not done here)

1. **Migrate callers off deprecated `Product` fields → `ProductVariant`:** `app/api/v1/checkout/route.ts`, `app/api/webhooks/stripe/route.ts`, `app/api/v1/products/route.ts`, `components/product-card.tsx`, `components/cart-page-client.tsx`, and the workbook route. Add `stripePriceId` per variant.
2. **Extend the workbook contract** (`lib/server/product-workbook.ts`) to a two-sheet Products+Variants shape, or a flattened one-row-per-variant sheet — the current single-sheet importer is product-grain only.
3. **Backfill + then make required:** set `Product.sku`, `flavor`, and `ProductVariant` rows for every product, then tighten `sku`/`flavor` to non-null and point checkout/stock at variants.
4. **Decide `Other (IP)` scope** — the 293 resale masters (matches, detergent, apparel) are excluded from the import files; confirm they stay out of CandyRama.
5. **Confirm the 152 REVIEW category mappings** with Hani, or extend the `Category` enum.
6. **Consider `reservedQty`** on the variant if concurrent checkout could oversell (neither legacy system reserves stock).

## 5. Provenance / references
- Full analysis: `twistedtreatz-to-candyrama-sku-analysis.md` (inventory app + first pass) and `twistedtreatz-sku-analysis-ADDENDUM.md` (the real SKU spine — authoritative). Both in this folder.
- Source of truth: `twisted-treatz-sales-data-ingestion` → `SKU_Map.xlsx` ("Master SKU Map"), `scripts/build_sku_spine.py`, `ops/RULES.md`, `ops/CONCEPT.md`.
- **Excluded everywhere:** revenue, units, cost, customers, orders, credentials, env.
