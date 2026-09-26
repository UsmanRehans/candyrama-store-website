# Candy Rama — new Amazon Store and A+ image set

Miles · September 16, 2026 · Creative planning and manual-upload handoff. No Amazon publication or backend access.

The owner selected **Whole Store and A+ set**. Prepare a connected campaign image library with distinct merchandising jobs, not repeated pouch crops. US marketplace is a working assumption from the existing project; account eligibility and target ASINs are not verified.

## What the existing work actually establishes

- `assets/amazon-demo/packaging-reference.jpeg` is the owner-supplied packaging authority: mixed gummies in the left pouch and sugar-coated fruit pieces in the right. It supports packaging/reference-based concepts; it does not establish Amazon listing identity or exact sold assortment.
- v6/v7 concept work develops **mixed gummies** and **fruit slices**. It does not map either to a verified Candy Rama ASIN. v7's displayed 8 oz / 1 lb / 2 lb range is not independent verification of available variants.
- The website's six products are a separate storefront assortment. Do not silently assign those six to Amazon. Nor should the shared company's TwistedTreatz catalog automatically become Candy Rama Amazon inventory.
- `docs/sku-migration/README.md` describes 276 draft products and 1,076 historical variants; the CSV has `TWISTED_TREATZ` and `DRAFT` rows, and the full master includes third-party merchandise. This is useful internal mapping evidence, not an approved Amazon range.
- The owner previously requested roughly sixteen distinct varieties in a banner, each appearing in one location. `docs/amazon-banner-assortment-correction.md` explicitly leaves that assortment unverified. Do not fabricate sixteen varieties to fill it.

## Official format checks

Checked the following public Amazon guidance today. The chosen account's current builder remains the final validation surface.

| Placement | Working export specification | Crop/implementation constraint |
| --- | --- | --- |
| Store header | 3000 × 600 px minimum; at most 5 MB | Essential subject inside central 70%; up to 15% can disappear at each side. |
| Store logo | 400 × 400 px minimum; at most 5 MB | Use supplied approved artwork, not a newly generated logo. |
| Store large image tile | 1500 × 1500 px minimum; at most 5 MB | Custom mobile art supported. Reserve lower 12% if a native link title overlays a square tile. |
| Store medium image tile | 1500 × 750 px minimum; at most 5 MB | Reserve lower 19% for a native link title on a rectangular tile. |
| Store full-width image with overlaid native text | 3000 × 1500 px minimum | Keep copy native/editable; Amazon discourages baking text into images. |
| Store shoppable full-width scene | 3000 × 1500 px recommended | Tag only verified linked products; art alone does not establish assortment. |

Source: [Amazon Stores creative guidelines](https://advertising.amazon.com/resources/ad-specs/stores). The full-width plain-image tile has different minima from image-with-text; do not apply one generic canvas to every tile. Our larger working masters preserve options.

For **Basic A+**, Amazon's official module reference gives **970 × 300** for Standard Image & Dark/Light Text Overlay, **300 × 300 each** for Standard Three Images & Text, and **300 × 300** for Standard Single Left/Right Image. Use these as conservative planning targets. A 970 × 600 export in the previous demo is not proof that every Basic module accepts that slot. [Official standard module template PDF](https://m.media-amazon.com/images/G/35/sp-marketing-toolkit/Sellerfacingguides/BO/Standard_A_Module_Templates.pdf).

Amazon's type comparison lists Basic 970 × 300 and Premium 1464 × 600 image examples; these are not universal dimensions for every module. Retain high-resolution masters and create Premium variants only if the account actually offers the selected module. [Amazon A+ types overview](https://m.media-amazon.com/images/G/01/BX_Marketing/2023/AMZ_OnePager_PremiumA_09a-4-21-2023.pdf).

A+ is applied to brand-owned ASINs, and eligibility depends on the account/brand relationship. Current account access and Premium eligibility are unverified. [Amazon A+ overview and workflow](https://sell.amazon.com/tools/a-content).

## Current generation batch — four new masters

Cando's selected first batch is four new high-resolution masters: **Store campaign pair**, **mixed-gummy appetite**, **fruit-slice appetite**, and **shared gummy-and-pouch lifestyle**. These cover the whole Store direction and the two reference-based A+ directions without claiming a complete per-ASIN production library. The following larger manifest describes intended placements and later derivatives, not additional generation commitments for this batch.

| New master | Immediate merchandising use | Later module derivative |
| --- | --- | --- |
| Store campaign pair | Store opening feature with both reference packaging directions | Dedicated 5:1 header only after a crop preserves both complete pouches and safe zone; otherwise commission a true wide treatment. |
| Mixed-gummy appetite | Gummy discovery tile and matching product identity | Square Store crop; Basic A+ wide or detail derivative if composition and exact product mapping support it. |
| Fruit-slice appetite | Separate fruit-slice discovery and product identity | Matching fruit-slice A+ derivative; never silently substitute for mixed gummies. |
| Shared gummy-and-pouch lifestyle | Store sharing occasion, matching gummy A+ | Deliberate wide/mobile crops preserving hand, candy and pouch. |

Full masters are review assets. Do not mark them upload-ready merely because their aspect ratio resembles an Amazon slot. Pixel dimensions, packaging fidelity, final crop, file size and ASIN mapping all remain explicit checks.

## Proposed placement manifest

This is a whole-Store system plus an A+ template family. The exact image count can adapt to approved source references; no one needs to invent SKUs to make the system feel complete. Asset IDs below are proposed jobs, not claims that files already exist.

| ID | Image job and direction | Placement/export | Product truth and status |
| --- | --- | --- | --- |
| ST01 | Wide candy-and-pouch brand campaign; clear central grouping, color and real depth | Store header 3000 × 600, dedicated composition | Brand concept; exact range must be confirmed before upload. Three bags, if used, do not mean a three-pack offer. |
| ST02 | Natural sharing scene at a backyard table; complete upright pouch, small serving dish, hands | Store feature 3000 × 1500; mobile 1680 × 1680 working art | Scene expresses an occasion, not pack yield. No assertion that generated people are the real team. |
| ST03 | Mixed-gummy discovery: pouch plus reference-matched loose candy at useful viewing distance | Store category tile 1500 × 1500 | Reference direction from left pouch; ASIN/name/content mapping pending. |
| ST04 | Fruit-slice discovery: visibly distinct sugar-coated pieces and matching pouch | Store category tile 1500 × 1500 | Reference direction from right pouch; mapping pending. Do not relabel as website Rainbow Sour Mix. |
| ST05 | Cozy movie-night sharing; candy in foreground, human context retained | Store medium 1500 × 750; alternate mobile art | Brand occasion; may also support matching A+ after SKU verification. |
| AP01 | Single-product identity: one matching pouch with a modest group of corresponding pieces | Basic 970 × 300 wide composition; retain 3:2 master for other slots | Separate gummy and fruit-slice variants; never imply other shown products are included. |
| AP02a–c | Three purposeful details: supported sugar coating, gel sheen, distinct actual shape | Basic Three Images & Text, three 300 × 300 exports | Select only visible/verified details; no invented flavors from colors or heat/sour scales. |
| AP03 | One full, smooth front-facing pouch | Basic Single Image, 300 × 300; high-resolution master retained | Pair with native verified pack facts later. Reference weight does not establish sold SKU. |
| AP04 | The specific product being enjoyed in a believable sharing moment | Basic 970 × 300; alternate 3:2 master | Different job from packshot; no giant bowl suggesting one-pack quantity. |

Reuse the approved lifestyle master across Store/A+ only where product identity matches; create intentional alternate crops instead of repeating the same frame several times in one page. One A+ family may need product-specific variants, but those variants require real references first.

## Readiness and practical next inputs

Proceed now with concept generation from the packaging and existing source imagery, with Vita's exact-prompt and output review. Generation does not require Amazon login. Deliver originals, crop previews, export dimensions and source records; keep any unverified facts outside customer artwork.

Before calling product-specific files upload-ready, resolve the target Store URL/US marketplace, Candy Rama ASIN list, approved current loose-candy references and labels, offered pack weights/counts, and selected Basic/Premium module slots. These are upload-readiness dependencies, not a reason to stop making a reviewable campaign.

Do not add website URLs, QR codes, payment-link instructions, discounts, reviews, best-seller badges, certifications, origin/manufacturing claims, or Twisted Treatz branding to the Amazon art. This commission is for Store/A+ graphics, not listing main images; none of these lifestyle compositions should be handed off as the main product image.
