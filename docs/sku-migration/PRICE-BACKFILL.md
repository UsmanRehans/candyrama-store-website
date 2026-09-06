# TwistedTreatz storefront price backfill

Checked on 2026-09-06 against the public TwistedTreatz Shopify catalog:

- Catalog: https://www.twistedtreatz.com/collections/all
- Machine-readable catalog: https://www.twistedtreatz.com/products.json?limit=250
- Match rule: exact, case-sensitive equality between Shopify variant `sku` and `variant_sku`
- Accepted only when every live occurrence of that SKU had the same price
- Result: 128 CSV rows populated, covering 120 distinct leaf SKUs
- Remaining: 948 rows intentionally blank

No fuzzy title, flavor, family, size, or pack matching was used. Reused Shopify
SKUs with conflicting prices were skipped. The 33 duplicate leaf-SKU assignments
already present in the CandyRama variant file remain an upstream review blocker;
the price pass does not resolve or rename them.

Blank prices must be imported as `NULL`, never as zero. A variant cannot be made
active until it has both an approved price and a known stock quantity.
