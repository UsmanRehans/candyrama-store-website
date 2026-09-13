# Candy Rama Amazon production specification

Miles review, September 13, 2026. Target: Amazon US, Basic A+ and Brand Store. This is a production plan for the pink-pouch assortment direction, not a claim of Seller Central access or upload approval.

## Verified format requirements

| Placement | Minimum pixels | File cap / notes |
| --- | --- | --- |
| Store header hero | 3000 × 600 | 5 MB; keep important content within center 70% because each side can lose 15% |
| Store navigation logo | 400 × 400 | 5 MB |
| Store medium image tile | 1500 × 750 | 5 MB |
| Store small image tile | 750 × 750 | 5 MB |
| Store full-width image-with-text, text over image | 3000 × 1500 | A different placement from the 3000 × 600 header |

Use Amazon's editable text fields. Check desktop/mobile layouts and crop previews in the builder. [Official Store creative specifications](https://advertising.amazon.com/resources/ad-specs/stores).

| Basic A+ module | Minimum image pixels |
| --- | --- |
| Standard Image Header with Text | 970 × 600 |
| Standard Image & Text Overlay, light/dark | 970 × 300 |
| Standard Three Images & Text | 300 × 300 each |
| Standard Single Side Image | 300 × 300 |
| Standard Company Logo | 600 × 180 |

These module names/sizes correspond to Amazon's published module model. Do not assume every wide A+ image uses the same size. [Official A+ module specifications](https://developer-docs.amazon/sp-api/docs/a-plus-content-examples).

Plan no more than **five Basic A+ modules per ASIN**, keep images at or below 2 MB, and put meaningful copy in editable fields so it remains readable on mobile. Seven-module plans require a different entitlement such as Premium; the historical competitor/demo layout does not establish Candy Rama eligibility. Avoid competitor comparisons, unsubstantiated superiority, prices, promotions, shipping claims, off-site links and contact details. Final account eligibility and desktop/mobile rendering must be checked in Seller Central. [Official Amazon A+ design guide](https://sell.amazon.com/blog/a-plus-content-design-guide).

## Recommended downloadable asset package

The filenames below are deliverable targets, not assertions that these exports already exist. Produce JPG or PNG working exports, a contact sheet, a copy/alt-text sheet, and a CSV/JSON manifest. Use the dimensions below as the final canvas sizes. Record source file, placement, module, dimensions, bytes, product/ASIN, copy, alt text, review status and unresolved facts for every output.

| Target export | Pixels | Placement and composition | Starting reference | Current status |
| --- | --- | --- | --- | --- |
| store-home-header.jpg | 3000 × 600 | Pink campaign, pouch and candy safely centered; optional native headline nearby | packaging-campaign.png + packaging-reference.jpeg | Concept only; rebuild wide composition rather than stretch |
| store-assortment-tile.jpg | 1500 × 750 | Assortment discovery with candy and pouch | same references | Concept only |
| store-fruit-slices-tile.jpg | 750 × 750 | Fruit slices collection; use verified photo for final | packaging-reference.jpeg | Concept only; not part of assortment ASIN story without confirmation |
| aplus-01-assortment-hero.jpg | 970 × 600 | Module 1: Header Image with Text, one assortment pouch with visible candy | packaging reference and campaign | Concept only; verify exact pack |
| aplus-02-candy-detail.jpg | 970 × 300 | Module 2: Overlay, appetizing assortment texture with clear text space | candy-abundance-v2.webp | Concept only; generated candy must match actual SKU |
| aplus-03-detail-01.jpg through aplus-03-detail-03.jpg | 300 × 300 each | Module 3: Three Images & Text, three confirmed product details | approved sample photography needed | Hold precise flavor/shape promises until confirmed |
| aplus-04-movie-night.jpg | 970 × 600 | Module 4: Header Image with Text, candy-sharing occasion | movie-night-v2.webp | Concept only; do not imply bowl quantity equals one pack |
| aplus-05-pouch.jpg | 300 × 300 | Module 5: Single Side Image, clear pouch and concise factual pack information | packaging-reference.jpeg | Reference available; label/weight/contents verification outstanding |

Paths above resolve under `assets/amazon-demo/`. An approved logo may also be prepared at 400 × 400 for the Store. Adding a separate Basic A+ logo module would consume a module slot, so integrate branding through truthful package imagery for this five-module plan.

The existing two-pouch campaign is useful for a Store concept; the assortment ASIN's A+ hero should show its own pouch. Do not present fruit slices as included in the assortment merely because both pouches appear in the brand campaign. Generated packaging is a visual study and needs exact-label review. The superseded blue-macro asset is excluded.

## Production and upload readiness

Cando should choose the bounded five-module assortment story. Lauren supplies restrained sensory copy and checks claims; Vita produces the compositions and crops; Miles checks dimensions/module mapping and actual builder previews. Avery evaluates competitor evidence without inventing sales results. Confirm the target ASIN, included candy/flavors, current label and pack facts before calling the pack upload-ready. Missing product facts should hold only dependent final claims, not concept design.

A format-correct export is not automatically ready to upload: exact SKU representation, approved packaging and facts, ownership of source assets, Seller Central eligibility, and the actual placement preview still matter. Any concept pack should visibly identify its review status in its README/manifest. It is neither a listing main-image pack nor an Amazon publication.

No store backend connection is needed to design or manually upload these files. A seller can use Amazon's Store builder and A+ Content Manager directly. Amazon API integration is a separate future project. Lack of integration also does not prevent Avery from researching publicly available competitors or analyzing owner-provided exports. Sales measurement requires real reports and cannot be inferred from this creative preview.
