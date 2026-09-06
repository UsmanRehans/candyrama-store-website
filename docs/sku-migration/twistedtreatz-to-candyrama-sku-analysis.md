# TwistedTreatz → CandyRama: SKU & Inventory Architecture Analysis

Prepared for handoff to the CandyRama implementation assistant. Read-only analysis; no repository was modified, no migration was run, no live database was queried. Customer, order, payment, credential, and environment data were deliberately excluded.

**Sources inspected**
- TwistedTreatz inventory app: `/Users/usman/Documents/GitHub/twisted-treatz-inventory-app/twisted-treatz-inventory/`
- CandyRama store: `/Users/usman/Documents/GitHub/candyrama-store-website/` @ `206bdc4`

---

## 0. The headline finding (read this first)

Two things dominate every recommendation below:

1. **Neither system has a SKU today.** There is no `sku`, `barcode`, `upc`, `variant`, `casePack`, `reservedQty`, `dimensions`, or `shippingWeight` column in either Prisma schema. The word "SKU" appears exactly once in the entire TwistedTreatz codebase — as a comment (`server/src/routes/products.ts:127`). Both systems identify products by a database key plus one human-readable natural key (an auto-increment `Int` name-matched in TwistedTreatz; a `slug` in CandyRama). Any "canonical SKU" must be **created**, not migrated.

2. **The two catalogs are not the same universe.** TwistedTreatz inventory is a **raw-materials / production-inventory** system: bags of powdered sugar, brownie mix, chamoy sauce, snow-cone syrup — each row carries a `usedIn` field naming *the finished candy it goes into* (`server/prisma/schema.prisma:27`). CandyRama is a **finished-goods DTC storefront**: retail candy with `slug`, `priceCents`, `stripePriceId`, images, and reviews. Roughly a third of the TwistedTreatz rows are pure ingredients (categories `Raw material`, `Grocery`) that have **no retail SKU equivalent at all**. The rest are resale candies whose relationship to CandyRama products is *many raw rows → one retail product*, not 1:1.

The practical consequence: this is **not a lift-and-shift migration**. It is (a) a *reference/data-source* exercise — pull brand, flavor, pack-size, and category facts across — plus (b) a *net-new SKU scheme* for CandyRama. Details and a recommended SKU format follow.

---

## 1. The current TwistedTreatz "SKU" system (plain English)

TwistedTreatz runs a two-surface inventory app (React client + Express/Prisma/Postgres server) for the **back-of-house**: an admin dashboard and a floor iPad that staff use to log raw-material takes. It answers "how much sugar / how many bags of gummies do we have, and when do we reorder," not "what can a customer buy."

- **There is no product code.** A "product" (`server/prisma/schema.prisma:10-39`) is identified internally by `id Int @id @default(autoincrement())`. Externally it is identified **by `name`** — the catalog importer matches rows to existing products case-insensitively on name because "the sheet has no id" (`server/src/routes/catalog.ts:16-18`, `:252`, `:294`). Name is therefore the *de facto* natural key, and it is **not unique-constrained** in the schema.
- **Unit of inventory = the purchase unit of a raw material.** Stock is counted in whole units of `purchaseUnit` ("Bag", "Box", "Gallon", "Bucket", "Tub", "Jar"; `schema.prisma:15`). Pack size is stored as a numeric `packSize Decimal(10,3)` + a `uom` string ("lb", "ct", "oz", "ea"; `schema.prisma:19-20`, normalized in `server/src/lib/measure.ts:10,33`). A legacy free-text `unitSize` ("5 lb", "128 oz") is retained for older rows (`schema.prisma:16`).
- **Brand is a first-class entity.** Promoted from a free-text column into `Brand` (`schema.prisma:44-51`); products keep `brandId` + a transitional `brandText` (`schema.prisma:23-25`).
- **Flavor** is a free-text `String?` on the product (`schema.prisma:14`) — not a variant.
- **Category is free text**, not an enum (`schema.prisma:13`). Live values include `Gummy`, `Raw material`, `Jelly Beans`, `Jelly`, `Sour Candy`, `Caramel Chews`, `Swedish Bubs`, `Candy Corn`, `Sweet Candy`, `Hard Candy`, `Spicy Candy`, `Grocery` — plus a case-variant duplicate `Raw Material`.
- **Inventory & movements.** On-hand is a single `currentQty Int` with an `alertThreshold Int` (default 10) for low-stock alerts (`schema.prisma:28-29`). Every change flows through one of three audited movement tables — **`Removal`** (floor takes, `schema.prisma:81-91`), **`Receipt`** (shipments received, `:93-105`), **`Adjustment`** (cycle counts & CSV imports, `:109-124`) — plus an **`AlertLog`** that de-dupes low-stock emails (`:126-131`). Creating a product is *never* a way to inject stock: `currentQty` is hard-coded to 0 on create and stock only moves via a movement row (`server/src/routes/products.ts:128-130`, `:224`).
- **Price is a supplier *cost*, not a retail price.** `unitPrice Decimal(10,2)` is what TwistedTreatz pays a supplier per purchase unit (`schema.prisma:30`; source column `Price` like `$6.98`, `$112.49` in `server/prisma/seed.ts`).
- **The operational contract is an Excel/CSV round-trip** with Hani's master sheet. Export/import columns are exactly: `Item, Category, Qty, Pack Size, UOM, Brand, Supplier, Alert Threshold` (`server/src/routes/catalog.ts:87`). Rows are matched by name; a qty change always writes an `Adjustment` so the audit trail stays truthful (`catalog.ts:401-455`).
- **Original source of truth** is `data/raw_materials.csv` (202 rows) with a richer column set than the schema keeps: `Raw Material, Category, Flavor, Packaging, Unit, Weight (lbs), Quantity, Unit, UOM, Price, Brand, Item, Purchased in` (`server/prisma/seed.ts:15-29`). Note `Weight (lbs)` and `Packaging`/`Unit`-count are **dropped** at seed time.

**No wholesale SKU, no case-pack, no barcode.** Searched across server, client, prisma, and sql — none exist.

---

## 2. Answers to your ten questions

| # | Question | Finding | Evidence |
|---|----------|---------|----------|
| 1 | Where is the canonical SKU stored / how generated? | **No SKU exists.** Canonical internal key = `Product.id` (autoincrement Int). Canonical *natural* key = `Product.name` (case-insensitive, **not** unique-constrained). No generator. | `schema.prisma:11`; `catalog.ts:252,294`; only "SKU" mention is a comment `products.ts:127` |
| 2 | Inventory tracked by what unit? | By **raw-material purchase unit** (Bag/Box/Gallon/Bucket/Tub/Jar) as a single `currentQty Int` per product. Not by variant, batch, or finished-good pack. | `schema.prisma:15,28` |
| 3 | All identifiers present | Internal DB id (`Int`). Natural key = `name`. `brandId`→`Brand`. **Absent:** SKU, barcode/UPC, slug, vendorId, variantId. `supplier` is a free-text string, not an id. | `schema.prisma:10-39,44-51` |
| 4 | Product/variant relationships | **No variant model.** Flavor is a scalar field. `usedIn` is a *free-text* pointer from raw material → finished candy (not a FK). One-to-many `Product`↔`Brand`. | `schema.prisma:14,27,25` |
| 5 | Pack sizes / weights / case qty / dimensions | `packSize Decimal(10,3)` + `uom`; legacy `unitSize`; `purchaseUnit`. Source CSV also has `Weight (lbs)` + `Packaging` + `Unit` count (**dropped at seed**). **No** case quantity, dimensions, or shipping weight anywhere. | `schema.prisma:15,16,19,20`; `seed.ts:15-29,105-108` |
| 6 | Adjustments / reservations / available / low-stock / history | `Adjustment`, `Receipt`, `Removal` movement tables (full history, each snapshots qtyBefore/qtyAfter); `alertThreshold` + `AlertLog` for low stock. **No reservation / no available-vs-on-hand split** — `currentQty` is the only stock number. | `schema.prisma:81-131` |
| 7 | Category & status values | Category = **free-text string**, 13 live values incl. a case-dupe (`Raw material` vs `Raw Material`). Status = **boolean `active`** only (soft-delete); no draft/archived states. | `schema.prisma:13,31` |
| 8 | Wholesale SKU / case-pack behavior | **None.** No wholesale pricing, case pack, or wholesale SKU in the inventory app. | (absence — grep across repo) |
| 9 | Fields to preserve exactly | `name`, `brand` (name), `flavor`, `category`, `packSize`+`uom`, `purchaseUnit`, and (as reference) `usedIn`. These are the human-verified facts with no reliable regeneration source. | §5 |
| 10 | SKU logic CandyRama can't represent safely | There is no SKU *logic* to lose. The real gaps run the other way (see §4): CandyRama can't represent packSize/uom split, purchase unit, supplier, brand entity, cost price, or the raw-material→finished-good relationship. And CandyRama's fixed **9-value category enum** can't hold TwistedTreatz's free-text categories. | §4 |

---

## 3. Field-by-field mapping: TwistedTreatz → CandyRama

Legend: **✅ direct** · **⚠️ transform/lossy** · **🆕 needs new CandyRama field** · **⛔ no target / out of scope**

| TwistedTreatz field | Type | CandyRama target | Fit | Notes |
|---|---|---|---|---|
| `Product.id` (Int autoincr.) | int | *(none — CandyRama uses `cuid`)* | ⛔ | Keep only as a cross-ref column (`legacyInventoryId`) if you want traceability. |
| `Product.name` | string | `Product.name` | ✅ | Also seeds `slug` (slugify, dedupe). Name is the join key for reconciliation. |
| `Product.category` (free text) | string | `Product.category` (enum) | ⚠️ | **Requires an explicit mapping table.** 13 free-text values → 9 enum values; several (`Raw material`, `Grocery`) have **no** enum home. See §7 risks. |
| `Product.flavor` | string? | *(fold into name/tagline)* | ⚠️ | No flavor field in CandyRama. Today it's descriptive, not a variant axis. |
| `Product.brandId`→`Brand.name` | rel | *(none)* | 🆕/⛔ | CandyRama has **no brand concept** — it's single-brand ("CandyRama"). Preserve source brand only if reselling third-party brands is in scope. |
| `Product.purchaseUnit` | string | *(none)* | ⛔ | Back-of-house purchasing concept; not a storefront field. |
| `Product.packSize` + `Product.uom` | Decimal+string | `Product.netWeight` (string) | ⚠️ | Compose e.g. `26.4` + `lb` → `"26.4 lb"`. **Lossy**: numeric+unit collapse into free text; can't compute/sort. |
| `Product.unitSize` (legacy) | string? | `Product.netWeight` (fallback) | ⚠️ | Use only when packSize/uom absent. |
| `Product.unitPrice` (supplier cost) | Decimal | `Product.priceCents` | ⛔ | **Do NOT map.** This is *cost*, not retail price. Retail price is a business decision. Treat as sensitive. |
| `Product.currentQty` | int | `Product.stockQty` | ⚠️ | Units differ (bags of raw material ≠ sellable retail units). See §7 — do **not** copy blindly. Source value is also unreliable (seed conflates weight with count, `seed.ts:107-108`). |
| `Product.alertThreshold` | int | `Product.lowStockAt` | ✅ | Direct concept match (default 10 → CandyRama default 6). |
| `Product.active` | bool | `Product.status` (enum) | ⚠️ | `true`→`ACTIVE`, `false`→`ARCHIVED`. No `DRAFT` source equivalent. |
| `Product.supplier` | string? | *(none)* | ⛔ | Purchasing data; out of storefront scope. |
| `Product.usedIn` | string? | *(none)* | ⛔ | Raw-material→finished-good pointer. Useful as *documentation* of which CandyRama product an ingredient supports; not a storefront field. |
| `Removal` / `Receipt` / `Adjustment` | tables | `StockMovement` | ⚠️ | CandyRama has one generic `StockMovement (delta, reason, orderId?, actorId?)` (`schema.prisma:161-171`). TT's three typed tables + qtyBefore/qtyAfter snapshots collapse into it; history is **not** worth migrating (different units, different domain). |
| `AlertLog` | table | *(none)* | ⛔ | Operational; regenerate in CandyRama if low-stock email is wanted. |
| `Brand`, `TeamMember`, `Admin` | tables | *(none / `AdminProfile`)* | ⛔ | Back-of-house identity — out of scope, and `Admin`/`TeamMember` are credential-bearing: **do not copy**. |

### CandyRama import contract (the target you must satisfy)
The Excel workbook is the supported write path (`lib/server/product-workbook.ts:5-18`, route `app/api/v1/admin/products/workbook/route.ts`). Columns, in order:
`slug, name, category, status, price_usd, stock_qty, low_stock_at, net_weight, tagline, description, ingredients, allergens_pipe, seasonal, accent_color, available_from, available_to, image_url`
- `slug` is the match/merge key and is **permanent** (`product-workbook.ts:55` instruction: "Do not change it after creation"); import upserts on it (`workbook/route.ts:24`).
- `category` and `status` are validated against the enums (`product-workbook.ts:6-7,49-50`); a value outside the 9/3 allowed will **reject the row**.
- `description` and `ingredients` are **required, min length 1** (`product-workbook.ts:13`) — TwistedTreatz has neither, so every imported row needs new copy.
- A stock delta on import writes a `StockMovement` reason `ADMIN_WORKBOOK_IMPORT` (`workbook/route.ts:26`).

---

## 4. Required CandyRama schema changes

Ordered by necessity. **None are required to *run* CandyRama** — they are only needed if you want to retain TwistedTreatz operational fidelity or add a real SKU.

**A. Add a real SKU (recommended, low risk).**
```prisma
model Product {
  // ...
  sku String @unique          // human-readable, permanent; see §5 for format
  // optional cross-system trace:
  legacyInventoryId Int?      // TwistedTreatz Product.id, for reconciliation
}
```
CandyRama currently leans on `slug` as the human key. A `slug` is URL/marketing-oriented and *can* change; a SKU should be permanent and channel-neutral (packing slips, wholesale, accounting, barcodes later). Keep both.

**B. If barcodes/scanning are ever needed:** `barcode String? @unique` (UPC/EAN). Not present today; add only when a scanner workflow is real.

**C. If pack facts must be queryable (not just displayed):** replace the free-text `netWeight` with structured fields, or add alongside it:
```prisma
netWeightValue Decimal? @db.Decimal(10,3)
netWeightUom   String?          // "lb","oz","g"
```
This preserves TwistedTreatz's `packSize`/`uom` split (`schema.prisma:19-20`) instead of collapsing to a string. Optional.

**D. If third-party brand resale is in scope:** add a `Brand` model + `Product.brandId`, mirroring TwistedTreatz (`schema.prisma:44-51`). Otherwise **skip** — CandyRama is single-brand by design.

**E. Category strategy — pick one (business decision, see §7):**
- *E1 (recommended):* keep the enum; map/curate TwistedTreatz free-text into it; drop non-retail categories.
- *E2:* convert `Product.category` to `String` (like TwistedTreatz) if you truly need open-ended categories — loses enum safety and the workbook dropdown.

**F. Reservations / available stock (only if overselling is a concern):**
```prisma
reservedQty  Int @default(0)
// availableQty = stockQty - reservedQty  (compute in app)
```
Neither system has this today; TwistedTreatz never needed it (back-of-house). A storefront with concurrent checkout may.

**G. Wholesale/case-pack (only if wholesale sells by the case):** a `caseQty Int?` + wholesale price fields, or a separate wholesale SKU. **Nothing to migrate** — TwistedTreatz has no such data; this is greenfield.

---

## 5. Recommended permanent SKU format

Because no SKU exists, you are free to design a clean one. Recommendation:

```
CR-<CAT>-<NNNN>          e.g.  CR-GUM-0007
```
- `CR` = CandyRama namespace (use `TT` for the raw-material inventory extract in §6 so the two never collide).
- `<CAT>` = 3-letter category code (stable, human-readable): `GUM` gummies, `SOU` sour, `SPY` spicy, `BRT` brittle, `BRK` bark, `CHO` chocolate, `CHW` chews, `GFT` gift boxes, `SEA` seasonal.
- `<NNNN>` = zero-padded sequence within the category, assigned once and **never reused**.

Rules that make it *permanent*:
1. Assign at product creation; **never** recompute from mutable fields (renaming a product or moving categories must **not** change its SKU — that's why `<CAT>` is a fixed birth-category prefix, not a live lookup).
2. `@unique`, case-insensitive, uppercase-normalized.
3. Independent of `slug`. Slug can change for SEO; SKU cannot.
4. If you later add pack-size variants, extend with a suffix (`CR-GUM-0007-5LB`) rather than encoding pack size into the base — keeps the base SKU stable.

This is deliberately *not* a "smart SKU" that encodes brand+flavor+size (those change and would force re-SKUing). Category prefix + opaque sequence is the industry-standard balance of human-scannability and stability.

---

## 6. Migration strategy (preserves existing identifiers)

**Framing:** treat TwistedTreatz as a *reference data source*, not a source of retail SKUs. Migrate facts, not stock.

1. **Snapshot & reconcile by name.** Export TwistedTreatz via the existing catalog CSV (`catalog.ts:/export`) or use the derived extract in §6-CSV. The join key on both sides is the (lower-cased, trimmed) product **name**.
2. **Preserve identifiers as data, not as keys.** For any TwistedTreatz row that becomes a CandyRama product, store its `legacyInventoryId` (the Int id) and its original `name`/`brand`/`flavor` verbatim so you can always trace back. Never reuse the Int id as CandyRama's primary key (CandyRama uses `cuid`).
3. **Assign new CandyRama SKUs** with the §5 format at creation time. Keep the TwistedTreatz proposed `TT-…` SKU (from the extract) only as a cross-reference column, so a packing-slip audit can bridge both systems.
4. **Curate categories** through an explicit mapping table (business sign-off): free-text → enum; explicitly mark `Raw material`/`Grocery` as **excluded** (not retail).
5. **Do not migrate stock or movement history.** Units differ and the source count is unreliable (`seed.ts:107-108`). Start CandyRama stock from a fresh physical count entered through the workbook (which writes a clean `StockMovement`).
6. **Do not migrate cost, supplier, team members, admins.** Cost is sensitive; identity tables carry credentials.
7. **Author required storefront copy.** `description` + `ingredients` are import-required (`product-workbook.ts:13`) and absent upstream — product/marketing must write them.
8. **Load via the workbook importer** (the supported, audited path) rather than raw SQL, so every row gets validated and audit-logged (`workbook/route.ts:21-29`).

**Identifier preservation summary**

| Identifier | TwistedTreatz | Preserve in CandyRama as | Why |
|---|---|---|---|
| Internal id | `Product.id` (Int) | `Product.legacyInventoryId Int?` | Traceability only |
| Natural key | `name` | join key + `Product.name` | Reconciliation |
| Brand | `Brand.name` | reference column (if resale in scope) | Third-party attribution |
| Proposed inventory SKU | `TT-<CAT>-<NNNN>` (from §6-CSV) | cross-ref column | Bridge to back-of-house |
| Retail SKU | *(none)* | **new** `CR-<CAT>-<NNNN>` | Canonical going forward |

---

## 6-CSV. Catalog extract (non-sensitive)

Delivered as `twistedtreatz-catalog-extract.csv` (203 rows). Derived deterministically from `data/raw_materials.csv` (the reliable, in-repo source of truth) — **not** from the live DB, which was not accessed.

Columns: `proposed_sku, name, category, flavor, brand, purchase_unit, pack_size_lbs, uom, used_in`.

Deliberately **excluded**: supplier unit **cost** (`Price` — competitively sensitive), on-hand **quantity** (unreliable — the seed conflates pack weight with stock count, `seed.ts:107-108`), and all identity/credential data. `proposed_sku` uses the `TT-<CAT>-<NNNN>` scheme (§5) so it never collides with CandyRama's `CR-…` SKUs. This is *inventory* data (raw materials + resale candy), so use it as a **reference** to build the CandyRama retail catalog — not as a drop-in product list.

---

## 7. Risks, ambiguities & business decisions needed

1. **Domain mismatch (biggest).** TwistedTreatz = raw materials + resale ingredients; CandyRama = finished retail goods. ~36 rows (`Raw material` 35 + `Grocery` 1, plus a case-dupe `Raw Material`) have **no retail equivalent**. *Decision:* confirm CandyRama sells finished candy only, so ingredients are excluded.
2. **Category enum vs free text.** 13 free-text categories → 9 fixed enum values, and some don't map (`Jelly`, `Jelly Beans`, `Candy Corn`, `Caramel Chews`, `Swedish Bubs`, `Sweet Candy`, `Hard Candy` have no clean enum home). *Decision:* provide the authoritative category mapping, or extend/relax the enum (`schema.prisma:17-27`).
3. **Data quality in source.** `Raw material` vs `Raw Material` (case dupe); embedded commas/quotes in `used_in` and `Purchased in` (e.g. `"Peanut brittle""`); `packSize` values like `0.0625` with uom `ea` (per-unit weight, not a count). Needs a cleanup pass before any load.
4. **`currentQty` is not sellable stock** and is unreliably derived (weight vs count). Do not seed CandyRama stock from it — take a fresh count.
5. **Price is cost, not retail.** Mapping `unitPrice`→`priceCents` would publish supplier costs as sale prices. Retail pricing is a business decision; treat cost as sensitive.
6. **No variants today, but flavor implies them.** Many rows are flavor variations of one product (8 Candy Corn flavors, Chamoy Tajin line). *Decision:* will CandyRama model these as separate products (current schema forces this) or introduce a variant model? Affects SKU suffixing (§5, rule 4).
7. **Brand scope.** CandyRama is single-brand; TwistedTreatz carries real brands (Zachary, Werther's, Member's Mark…). *Decision:* is any third-party resale happening, or is everything re-branded CandyRama? Determines whether change **D** is needed.
8. **`slug` permanence vs SKU.** CandyRama treats `slug` as the permanent key (`product-workbook.ts:55`), but slugs are marketing/SEO artifacts that teams *do* change. Adopting a real SKU (change A) removes that fragility — recommend doing it before catalog volume grows.
9. **Reservations/oversell.** Neither system reserves stock. A live storefront with concurrent checkout can oversell against a single `stockQty`. *Decision:* add change **F** if that risk matters.
10. **Wholesale.** `WholesaleApplication` exists (`schema.prisma:203-216`) but there is **no** wholesale pricing, case-pack, or wholesale SKU in either system. If wholesale sells by the case, that's greenfield design (change **G**), not a migration.

---

## Appendix — key file references

**TwistedTreatz** (`.../twisted-treatz-inventory/`)
- `server/prisma/schema.prisma:10-39` Product · `:44-51` Brand · `:81-124` Removal/Receipt/Adjustment · `:126-131` AlertLog
- `server/src/routes/products.ts:127-130,224` create-SKU comment + stock invariant · `:14-33` wire shape
- `server/src/routes/catalog.ts:87` CSV columns · `:16-18,252,294` match-by-name · `:401-455` movement-on-import
- `server/src/lib/measure.ts:10,33` UOM/packSize normalization
- `server/prisma/seed.ts:15-29` source CSV columns · `:105-108` weight/count conflation
- `data/raw_materials.csv` original source (202 rows)

**CandyRama** (`candyrama-store-website/` @ `206bdc4`)
- `prisma/schema.prisma:58-87` Product · `:11-27` Status/Category enums · `:161-171` StockMovement · `:203-216` WholesaleApplication
- `lib/server/product-workbook.ts:5` import columns · `:6-7` enum lists · `:13` required description/ingredients · `:55` slug-permanence note
- `app/api/v1/admin/products/workbook/route.ts:24,26` slug upsert + stock-movement-on-import
- `lib/products.ts` static storefront sample list · `supabase/seed.sql:1` seed Product columns (no SKU)
