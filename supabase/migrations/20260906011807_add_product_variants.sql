CREATE TYPE "ProductBrand" AS ENUM ('TWISTED_TREATZ', 'OTHER_IP');

ALTER TABLE "Product"
  ADD COLUMN "sku" TEXT,
  ADD COLUMN "brand" "ProductBrand" NOT NULL DEFAULT 'TWISTED_TREATZ',
  ADD COLUMN "productFamily" TEXT,
  ADD COLUMN "flavor" TEXT;

CREATE TABLE "ProductVariant" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "sku" TEXT NOT NULL,
  "sizeSig" TEXT NOT NULL,
  "netWeight" TEXT NOT NULL,
  "priceCents" INTEGER NOT NULL,
  "compareAtCents" INTEGER,
  "stockQty" INTEGER NOT NULL DEFAULT 0,
  "lowStockAt" INTEGER NOT NULL DEFAULT 6,
  "stripePriceId" TEXT,
  "amazonSkus" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "shopifySkus" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "tiktokSkus" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "temuSkus" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "position" INTEGER NOT NULL DEFAULT 0,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ProductVariant_priceCents_check" CHECK ("priceCents" >= 0),
  CONSTRAINT "ProductVariant_stockQty_check" CHECK ("stockQty" >= 0),
  CONSTRAINT "ProductVariant_lowStockAt_check" CHECK ("lowStockAt" >= 0),
  CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "OrderItem" ADD COLUMN "variantId" TEXT, ADD COLUMN "skuSnapshot" TEXT;
ALTER TABLE "StockMovement" ADD COLUMN "variantId" TEXT;

CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE INDEX "Product_brand_productFamily_idx" ON "Product"("brand", "productFamily");
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");
CREATE UNIQUE INDEX "ProductVariant_stripePriceId_key" ON "ProductVariant"("stripePriceId");
CREATE INDEX "ProductVariant_productId_position_idx" ON "ProductVariant"("productId", "position");
CREATE INDEX "ProductVariant_active_idx" ON "ProductVariant"("active");
CREATE UNIQUE INDEX "ProductVariant_one_default_per_product" ON "ProductVariant"("productId") WHERE "isDefault" = true;
CREATE INDEX "OrderItem_variantId_idx" ON "OrderItem"("variantId");
CREATE INDEX "StockMovement_variantId_createdAt_idx" ON "StockMovement"("variantId", "createdAt");

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductVariant" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "ProductVariant" FROM anon, authenticated;
