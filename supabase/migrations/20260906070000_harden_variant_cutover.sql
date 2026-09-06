-- Forward-only variant cutover hardening. Incomplete catalog rows stay staged;
-- only variants with known commerce data can become active.
SET lock_timeout = '5s';

ALTER TABLE "Product"
  ALTER COLUMN "netWeight" DROP NOT NULL,
  ALTER COLUMN "priceCents" DROP NOT NULL,
  ALTER COLUMN "stockQty" DROP DEFAULT,
  ALTER COLUMN "stockQty" DROP NOT NULL,
  ALTER COLUMN "lowStockAt" DROP DEFAULT,
  ALTER COLUMN "lowStockAt" DROP NOT NULL;

ALTER TABLE "ProductVariant"
  ALTER COLUMN "sizeSig" DROP NOT NULL,
  ALTER COLUMN "netWeight" DROP NOT NULL,
  ALTER COLUMN "priceCents" DROP NOT NULL,
  ALTER COLUMN "stockQty" DROP DEFAULT,
  ALTER COLUMN "stockQty" DROP NOT NULL,
  ALTER COLUMN "active" SET DEFAULT false;

ALTER TABLE "ProductVariant"
  DROP CONSTRAINT IF EXISTS "ProductVariant_priceCents_check",
  DROP CONSTRAINT IF EXISTS "ProductVariant_stockQty_check";

ALTER TABLE "ProductVariant"
  ADD CONSTRAINT "ProductVariant_priceCents_check" CHECK ("priceCents" IS NULL OR "priceCents" >= 0),
  ADD CONSTRAINT "ProductVariant_compareAtCents_check" CHECK ("compareAtCents" IS NULL OR ("priceCents" IS NOT NULL AND "compareAtCents" > "priceCents")),
  ADD CONSTRAINT "ProductVariant_stockQty_check" CHECK ("stockQty" IS NULL OR "stockQty" >= 0),
  ADD CONSTRAINT "ProductVariant_active_requires_commerce_fields_check" CHECK (NOT "active" OR ("priceCents" IS NOT NULL AND "stockQty" IS NOT NULL));

DROP INDEX IF EXISTS "ProductVariant_productId_position_idx";
DROP INDEX IF EXISTS "ProductVariant_active_idx";
DROP INDEX IF EXISTS "ProductVariant_one_default_per_product";
CREATE INDEX "ProductVariant_productId_active_position_idx" ON "ProductVariant"("productId", "active", "position");
CREATE UNIQUE INDEX "ProductVariant_one_active_default_per_product" ON "ProductVariant"("productId") WHERE "isDefault" = true AND "active" = true;

ALTER TABLE "StockMovement" DROP CONSTRAINT IF EXISTS "StockMovement_variantId_fkey";
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_variantId_fkey"
  FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
