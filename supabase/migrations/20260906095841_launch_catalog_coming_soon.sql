-- The backend is the storefront source of truth. Only launch products with a
-- currently available TwistedTreatz counterpart are public. Stock remains zero
-- and application checkout is separately feature-gated until launch.
SET lock_timeout = '5s';

UPDATE "Product"
SET "status" = 'ARCHIVED', "updatedAt" = CURRENT_TIMESTAMP
WHERE "status" = 'ACTIVE';

UPDATE "Product" SET
  "sku" = 'TT-Gushers-SourBlueRaspberry',
  "productFamily" = 'Gushers',
  "flavor" = 'Sour Blue Raspberry',
  "category" = 'SOUR',
  "categoryConfidence" = 'HIGH',
  "status" = 'ACTIVE',
  "priceCents" = NULL,
  "stockQty" = NULL,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'prod_blue_raspberry';

UPDATE "Product" SET
  "sku" = 'TT-ExoticGummyMix-Assorted',
  "productFamily" = 'Exotic Gummy Mix',
  "flavor" = 'Assorted',
  "category" = 'SOUR',
  "categoryConfidence" = 'HIGH',
  "status" = 'ACTIVE',
  "priceCents" = NULL,
  "stockQty" = NULL,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'prod_rainbow_sour';

UPDATE "Product" SET
  "sku" = 'TT-Gushers-ChamoyTajin',
  "productFamily" = 'Gushers',
  "flavor" = 'Chamoy Tajin',
  "category" = 'SPICY',
  "categoryConfidence" = 'HIGH',
  "status" = 'ACTIVE',
  "priceCents" = NULL,
  "stockQty" = NULL,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'prod_chamoy_heatwave';

UPDATE "Product" SET
  "sku" = 'TT-GummyBears-Assorted',
  "productFamily" = 'Gummy Bears',
  "flavor" = 'Assorted',
  "category" = 'GUMMIES',
  "categoryConfidence" = 'HIGH',
  "status" = 'ACTIVE',
  "priceCents" = NULL,
  "stockQty" = NULL,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'prod_gummy_party';

UPDATE "Product" SET
  "sku" = 'TT-ChocolateBark-RainbowCrunch',
  "productFamily" = 'Chocolate Bark',
  "flavor" = 'Rainbow Crunch',
  "category" = 'BARK',
  "categoryConfidence" = 'HIGH',
  "status" = 'ACTIVE',
  "priceCents" = NULL,
  "stockQty" = NULL,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'prod_chocolate_bark';

UPDATE "Product" SET
  "sku" = 'TT-GummyBears-SpicyChamoy',
  "productFamily" = 'Gummy Bears',
  "flavor" = 'Spicy Chamoy',
  "category" = 'SPICY',
  "categoryConfidence" = 'HIGH',
  "status" = 'ACTIVE',
  "priceCents" = NULL,
  "stockQty" = NULL,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'prod_spicy_bears';

UPDATE "ProductVariant"
SET "active" = false, "isDefault" = false, "updatedAt" = CURRENT_TIMESTAMP
WHERE "productId" IN (
  'prod_blue_raspberry', 'prod_rainbow_sour', 'prod_chamoy_heatwave',
  'prod_gummy_party', 'prod_chocolate_bark', 'prod_spicy_bears'
);

INSERT INTO "ProductVariant" (
  "id", "productId", "sku", "sizeSig", "netWeight", "priceCents",
  "stockQty", "position", "isDefault", "active", "createdAt", "updatedAt"
) VALUES
  ('pv_blue_4oz', 'prod_blue_raspberry', 'Blue-Gusher-4oz-1pk', '4oz|1pk', '4 oz', 599, 0, 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pv_blue_8oz', 'prod_blue_raspberry', 'Blue-Gusher-8oz-1PK', '8oz|1pk', '8 oz', 999, 0, 1, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pv_blue_1lb', 'prod_blue_raspberry', 'Blue-Gusher-8oz-2PK', '8oz|2pk', '1 lb', 1799, 0, 2, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('pv_rainbow_half', 'prod_rainbow_sour', 'ExoticGummyMix-0.5lb-1pk', '8oz|1pk', '1/2 lb', 499, 0, 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pv_rainbow_1lb', 'prod_rainbow_sour', 'ExoticGummyMix-1lb-1pk', '1lb|1pk', '1 lb', 949, 0, 1, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pv_rainbow_2lb', 'prod_rainbow_sour', 'ExoticGummyMix-2lbs-1pk', '2lb|1pk', '2 lb', 1599, 0, 2, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pv_rainbow_jar', 'prod_rainbow_sour', 'ExoticGummyMix-3.25lbs-Jar-1pk', '3.25lb|jar', '3.25 lb jar', 2499, 0, 3, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pv_rainbow_7lb', 'prod_rainbow_sour', 'ExoticGummyMix-7lb-1pk', '7lb|jar', '7 lb jar', 5999, 0, 4, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('pv_chamoy_4oz', 'prod_chamoy_heatwave', 'Chamoy-Gusher-4oz', '4oz|1pk', '4 oz', 599, 0, 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pv_chamoy_8oz', 'prod_chamoy_heatwave', 'Chamoy-Gusher-8oz-1pk', '8oz|1pk', '8 oz', 999, 0, 1, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pv_chamoy_1lb', 'prod_chamoy_heatwave', 'Chamoy-Gusher-8oz-2pk', '8oz|2pk', '1 lb', 1799, 0, 2, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('pv_bears_half', 'prod_gummy_party', 'Bear-Assort-8oz-1PK', '8oz|1pk', '1/2 lb', 499, 0, 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pv_bears_1lb', 'prod_gummy_party', 'Bear-Assort-16oz-1PK', '1lb|1pk', '1 lb', 899, 0, 1, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pv_bears_5lb', 'prod_gummy_party', 'Bear-Assort-16oz-5PK', '1lb|5pk', '5 lb pack', 2999, 0, 2, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('pv_bark_half', 'prod_chocolate_bark', 'FruityPebbleBark-8oz-1pk', '8oz|1pk', '1/2 lb', 1799, 0, 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pv_bark_1lb', 'prod_chocolate_bark', 'FruityPebbleBark-1lb-1pk', '1lb|1pk', '1 lb', 2299, 0, 1, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pv_bark_2lb', 'prod_chocolate_bark', 'FruityPebbleBark-2lbs', '2lb|1pk', '2 lb', 3999, 0, 2, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

  ('pv_spicy_half', 'prod_spicy_bears', 'SpicyGummyBears-8oz-1PK', '8oz|1pk', '1/2 lb', 999, 0, 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('pv_spicy_1lb', 'prod_spicy_bears', 'SpicyGummyBears-1lb-1PK', '1lb|1pk', '1 lb', 1799, 0, 1, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("sku") DO UPDATE SET
  "productId" = EXCLUDED."productId",
  "sizeSig" = EXCLUDED."sizeSig",
  "netWeight" = EXCLUDED."netWeight",
  "priceCents" = EXCLUDED."priceCents",
  "stockQty" = 0,
  "position" = EXCLUDED."position",
  "isDefault" = EXCLUDED."isDefault",
  "active" = true,
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "ProductImage" (
  "id", "productId", "storagePath", "url", "alt", "position", "createdAt"
) VALUES
  ('img_blue_raspberry', 'prod_blue_raspberry', '/generated/blue-raspberry-launch.png', '/generated/blue-raspberry-launch.png', 'Clear pouch of blue raspberry sour candy', 0, CURRENT_TIMESTAMP),
  ('img_rainbow_sour', 'prod_rainbow_sour', '/generated/rainbow-mix-launch.png', '/generated/rainbow-mix-launch.png', 'Clear pouch of assorted rainbow sour candy', 0, CURRENT_TIMESTAMP),
  ('img_chamoy_heatwave', 'prod_chamoy_heatwave', '/generated/chamoy-heatwave-launch.png', '/generated/chamoy-heatwave-launch.png', 'Clear pouch of chamoy chili candy', 0, CURRENT_TIMESTAMP),
  ('img_gummy_party', 'prod_gummy_party', '/generated/gummy-bear-party-launch.png', '/generated/gummy-bear-party-launch.png', 'Clear pouch of assorted gummy bears', 0, CURRENT_TIMESTAMP),
  ('img_chocolate_bark', 'prod_chocolate_bark', '/generated/chocolate-crunch-bark-launch.png', '/generated/chocolate-crunch-bark-launch.png', 'Clear pouch of rainbow cereal chocolate bark', 0, CURRENT_TIMESTAMP),
  ('img_spicy_bears', 'prod_spicy_bears', '/generated/spicy-gummy-bears-launch.png', '/generated/spicy-gummy-bears-launch.png', 'Clear pouch of spicy chamoy gummy bears', 0, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO UPDATE SET
  "storagePath" = EXCLUDED."storagePath",
  "url" = EXCLUDED."url",
  "alt" = EXCLUDED."alt",
  "position" = EXCLUDED."position";
