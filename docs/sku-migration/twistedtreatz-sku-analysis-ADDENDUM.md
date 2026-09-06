# ADDENDUM — The real TwistedTreatz SKU system lives in the sales pipeline

**This supersedes the "headline finding #1" of the first report.** My first pass looked only at the *inventory app* and CandyRama, and concluded "neither system has a SKU." That is true of those two repos — but it is **not** the whole company. The canonical SKU system lives in a third repo, **`twisted-treatz-sales-data-ingestion`**, and it is mature: a governed, 842-master, cross-channel **SKU spine** with a documented naming convention, hierarchy, and governance rules. Everything below is the authoritative SKU model to map into CandyRama. The inventory-app findings (raw materials, pack sizes, movements) still stand as-is.

Source repo: `/Users/usman/Documents/GitHub/twisted-treatz-sales-data-ingestion/`

---

## 1. The canonical SKU system (authoritative)

TwistedTreatz sells one catalog across **five channels** (Shopify, Amazon, TikTok Shop, Temu, gas-station bulk; Walmart + eBay dead-but-retained). Each channel has its *own* platform SKU. The company reconciles them into one **master SKU** so a product can be compared across channels. Parent company is **IP Traders** — hence the `IP` prefix on the resale brand (`ops/CONCEPT.md:7`).

### 1a. Grain & hierarchy — the most important thing to copy
The master SKU is at **brand + product-family + flavor grain**. **Size/pack is an attribute, never part of identity** (`ops/RULES.md:11-19`, `CLAUDE.md:32`). Hierarchy lives in **columns, never parsed from the SKU string**:

| Level | Column | Role |
|---|---|---|
| Brand | `brand` | `TwistedTreatz` \| `Other (IP)` — rollup/filter |
| Family | `product_family` | Product line ("Fruit Slices", "Gummy Bears", "Caramel Chews") |
| Flavor | `flavor` | **The comparison grain.** brand+family+flavor = one master SKU. **Never NULL** (`Original` for single-variant, `Assorted` for mixes) |
| Size/pack | `size_sig` | Variant ladder ("8oz", "1lb", "4pk") — an attribute, never identity |

`sku_spine_v3` (read only through `vw_sku_spine_current`) is the single source of truth (`CLAUDE.md:32`). Grain confirmed at **842 masters** in the live `SKU_Map.xlsx` (`ops/RULES.md:17` cites 842).

### 1b. The SKU string format
- **TwistedTreatz:** `TT-{Product}-{Form}-{Flavor}-{Size}` — refined 2026-07-07 to a *label convention for future listings only*, e.g. `TT-FruitSlices-Apple-8oz-2pk` (`ops/RULES.md:9,26`).
- **Other (IP)** (resale — Skittles, Mentos, matches, detergent…): legacy `IP12xx` scheme, kept as-is.
- **Governing rule:** `master_sku` is a **stable, opaque ID**. Legacy names with size fossils (`FruitSlice-Apple-8oz.`, `MentosMint-Jar-1ct-rev2`, `SwedishBubs-Mix-5.5oz-4pk`) **stay valid forever — never renamed to look prettier**; the columns carry the truth (`ops/RULES.md:22-23`). So the ID format is intentionally inconsistent across the 842 rows, and that is *by design*.

### 1c. How a master SKU is built (`scripts/build_sku_spine.py`)
1. **Amazon seller-SKU is the anchor** — Amazon's `seller_sku` *is* the master SKU (`build_sku_spine.py:109-129,152-153`).
2. Other channels (TikTok/Temu/Shopify) are matched onto anchors by a **normalized product signature**: distinctive title tokens (Jaccard + sequence blend) **gated by an exact size/pack match** (`:55-97,131-161`). Size is extracted separately into `size_sig` so numerics never pollute identity (`:58-77`).
3. Confidence tiers → `match_status`: `anchor` (1.0) / `matched` (≥0.55) / `resolved` (clean single-channel) / `needs_review` (0.40–0.55) / `unmatched`; plus `ai_proposed` in v3 (`:149-207`, `GOTCHAS.md:46`).
4. **Brand** assigned by majority-revenue vote, but an Amazon anchor's own brand is authoritative and can't be flipped (`:80-86,209-220`); `IP_BRANDS` set routes resale names to `Other (IP)` (`:47-53`).
5. Human review (Hani) corrections write back as **human-approved and outrank all AI/pipeline proposals** (`ops/RULES.md:27`).

### 1d. Cross-channel mapping shape
- `SKU_Map.xlsx` → **"Master SKU Map"** sheet: one row per master with array columns `Amazon SKU(s)`, `Shopify SKU(s)`, `TikTok SKU(s)`, `Temu SKU(s)` (`;`-separated, store-tagged e.g. `[so_bazic]`).
- `sku_spine_v3` (per-channel-row grain) columns: `master_sku, brand, platform, product_title, variation, seller_sku, size_sig, match_confidence, match_status` (`build_sku_spine.py:236-249`; v3 adds `product_family, flavor, store`).
- A **second, older** master system exists: warehouse `master_sku_list` keyed on Amazon `product_id`, with `shopify_skus/temu_skus/tiktok_skus` arrays matched by normalized name+brand+price±$5 (`sql/build_master_sku_list.sql:4,79-187`).

### 1e. Governance rules (copy these into CandyRama's process)
- **No product is listed without a master SKU row** (with brand tag). Whoever lists it adds the row (`ops/RULES.md:7,27`).
- **Never parse** brand/family/flavor/size from any SKU string — join the spine (`ops/RULES.md:22`).
- **`flavor` never NULL**; `product_family`/`flavor` come from **controlled vocabularies**; new values are *proposed* (flagged), never silently minted (`ops/RULES.md:24-25`).
- **Archive, never delete**; dead channels marked `is_active=FALSE` (`ops/RULES.md:31-33`).

---

## 2. Live catalog shape (from `SKU_Map.xlsx`, 842 masters)

| Brand | Masters |
|---|---|
| TwistedTreatz | 450 |
| Other (IP) | 293 |
| (unassigned) | 99 |

**133 product families.** Top: Fruit Slices (103), Matches (58), Gushers (55), Jelly Belly (50), Personal Care (37), Gummy Bears (37), Household (33), Saltwater Taffy (26), Caramel Chews (23), Swedish Candy (22), Candy Corn (21), Chocolate Bark (21), Apparel (16), Valentine Gummies (15)…

**Note the mix:** roughly half the catalog is **non-candy resale** (Matches, Personal Care, Household, Apparel) under `Other (IP)`. For CandyRama these are almost certainly out of scope — a CandyRama import should filter to `brand = TwistedTreatz` (and likely only the confectionery families).

---

## 3. Corrected mapping: TwistedTreatz SKU spine → CandyRama

| TwistedTreatz spine field | CandyRama target | Fit | Notes |
|---|---|---|---|
| `master_sku` (opaque, stable) | **new** `Product.sku @unique` | ✅ | **Preserve verbatim.** This is the identifier to carry across. Keep the exact string even where it's ugly (`FruitSlice-Apple-8oz.`) — it's the join key to the warehouse, dashboard, and platform listings. |
| `brand` | *(filter, or new `Brand`)* | ⚠️ | Import only `TwistedTreatz`; `Other (IP)` is resale, out of scope. |
| `product_family` | `Product.category` (enum) — or new field | ⚠️ | 133 families → CandyRama's 9-value enum. Needs a curated family→enum map; families are finer-grained than the enum. Consider adding `productFamily String?` to keep the real value. |
| `flavor` | *(name/tagline, or new `flavor`)* | ⚠️ | CandyRama has no flavor field and no variant model — see risk below. |
| `size_sig` (8oz/1lb/4pk) | `Product.netWeight` (string) or variant | ⚠️ | Here's the crux: TwistedTreatz treats size/pack as an **attribute of one master**; CandyRama has **one row per product, one `netWeight` string, one price**. To preserve the size ladder you need a variant model (see §4). |
| `Amazon/Shopify/TikTok/Temu SKU(s)` | *(cross-ref only)* | 🆕 | Store as channel-SKU reference columns/JSON if omni-channel reconciliation matters; otherwise drop for a storefront-only build. |
| `match_status`/`match_confidence` | *(drop)* | ⛔ | Pipeline metadata. Import only `anchor`/`matched`/`resolved`/human-approved rows; skip `needs_review`/`unmatched`. |
| `units`, `*revenue*`, cost | *(never import)* | ⛔ | Sales/financial data — out of scope and sensitive. |

---

## 4. The one hard structural conflict: grain

**TwistedTreatz master grain = brand+family+flavor, with size/pack as an attribute (`size_sig`). CandyRama grain = one Product row = one price = one `netWeight` string, and no variant model.**

These do not line up. A single TwistedTreatz master (`TT-FruitSlices-Apple`, flavor Apple) may span `8oz-1pk`, `8oz-2pk`, `1lb` — three sellable, separately-priced things. CandyRama can only represent that as **three separate `Product` rows** today. Options:

- **Option A — flatten (fastest):** one CandyRama `Product` per (master × size_sig). SKU becomes `master_sku` + size suffix (`TT-FruitSlices-Apple-8oz-2pk`). Loses the "these are the same product" rollup that the whole spine exists to provide.
- **Option B — add variants (correct):** add a `ProductVariant` model (`sku @unique`, `sizeSig`, `priceCents`, `stockQty`, `stripePriceId`) with `Product` at brand+family+flavor grain. This mirrors the spine exactly and keeps `master_sku` as `Product.sku`. Bigger schema change (order items, stock, Stripe all move to variant grain).

**This is a business/architecture decision and the single biggest item to resolve before implementation.** If CandyRama will ever sell the same flavor in multiple sizes (it will — the source data shows it pervasively), Option B is the durable answer.

---

## 5. Revised recommendations (replaces §4–§6 of the first report where they conflict)

1. **Adopt `master_sku` as CandyRama's `sku`** (`@unique`), preserved verbatim from the spine. Do **not** invent a new `CR-…` scheme — a governed one already exists; a second scheme is exactly what `ops/RULES.md:7` forbids. (My first report's `CR-<CAT>-<NNNN>` proposal is **withdrawn** — use the existing spine SKUs.)
2. **Keep hierarchy in columns, never parse the SKU** — port `brand`, `product_family`, `flavor`, `size_sig` as real fields. Add `productFamily` and (if not doing variants) a `sizeSig`/`flavor` field to CandyRama's Product.
3. **Decide grain (Option A vs B, §4) first.** Everything downstream (price, stock, Stripe, order items) depends on it.
4. **Import filter:** `brand = TwistedTreatz` + confectionery families + `match_status ∈ {anchor, matched, resolved, human-approved}` only.
5. **Preserve channel SKUs** as reference JSON if omni-channel stays in scope; drop otherwise.
6. **Source of truth for the extract** is `vw_sku_spine_current` / `SKU_Map.xlsx`, **not** the inventory app. Reconcile the two by product name where a finished good also appears as a resale line in the inventory app.
7. **Governance carries over:** no CandyRama product without a SKU row; new families/flavors proposed not minted; human corrections outrank automation.

---

## 6. New risks / decisions (in addition to the first report's)

1. **Grain mismatch (size as attribute vs row)** — §4. Biggest decision.
2. **Two unresolved master systems upstream** — `master_sku_list` (Amazon `product_id`) vs `platform_sku_map`/spine (`TT-…`). CandyRama should consume **only `sku_spine_v3`/`vw_sku_spine_current`**, the reconciled one (`ops/CONCEPT.md:67`, `GOTCHAS.md:65`).
3. **Messy legacy IDs are load-bearing** — `-revN` suffixes, trailing dots, case twins (`-1Pk` vs `-1pk`, `GOTCHAS.md:63`). Preserve exactly; do not "clean" them (renaming breaks warehouse/platform joins).
4. **~40% of masters are non-candy resale** (`Other (IP)`: matches, detergent, body spray, apparel). Confirm CandyRama excludes these.
5. **99 masters have no brand assigned** and some rows carry `(blank)` channel SKUs / `ai_proposed` status — needs Hani's review before they're trustworthy for a storefront.
6. **`product_family` (133) ≫ CandyRama category enum (9)** — needs an explicit curated mapping, or a schema change to store family.

---

## Appendix — key file references (sales-ingestion repo)
- `ops/RULES.md:5-27` SKU governance, format, hierarchy-in-columns, controlled vocab, human-outranks-AI
- `ops/CONCEPT.md:7,11-20,53,65-67` IP Traders/prefix, two brands, channels, platform_sku_map goal, master-SKU conflict
- `CLAUDE.md:32-33` master-SKU grain + brand vocabulary
- `scripts/build_sku_spine.py:47-53` IP brand set · `:55-97` size/token normalization · `:109-161` anchor+match · `:209-249` brand vote + spine schema
- `sql/build_master_sku_list.sql:4,79-187` the competing Amazon-anchored master list
- `SKU_Map.xlsx` sheets: `Master SKU Map` (842), `Channel SKU Detail` (3226), `Channel Activity`, `Fix List`
- `scripts/out/spine_input.json` grain `(platform, store, sku_raw, product_title, variation)`, 3207 records
- `GOTCHAS.md:40-65` export-layout drift, blank-SKU artifacts, dedup rules, two-master-systems gap

## Delivered file
- `twistedtreatz-master-sku-catalog.csv` — **842 master SKUs**, columns `Master SKU, Brand, Product family, Flavor, Amazon SKU(s), Shopify SKU(s), TikTok SKU(s), Temu SKU(s)`. Revenue and units columns **deliberately excluded** (sensitive). This is the authoritative catalog to build the CandyRama import from (filter to TwistedTreatz confectionery).
