> September 13 update: the local demo now uses the candy-first direction described in [research and competitor findings](amazon-candy-first-research.md), with [three new image prompts](amazon-candy-first-prompts.md). The original Concept 01 record below is historical; its packaging layout and release validation do not describe the current revision. Concept 02 has not been deployed.

# Private Amazon creative preview

Route: `/amazon-demo`. This adds a review surface to the existing Next.js/Vercel storefront. It does not publish content to Amazon or connect the demo to checkout.

## Contents

- Brand store concepts for Home, Sweet Candy, Bark & Brittle, Sour Candy and New Arrivals.
- Seven stacked A+ concept panels, ending at Product Dimensions. Dimensions are explicitly unconfirmed; the supplied photo shows an 8 oz front label.
- Original packaging photo beside an AI-assisted campaign visualization based on that photo.
- Desktop and mobile preview widths. The storefront newsletter popup is suppressed on this route.

## References

- Product: https://www.amazon.com/dp/B0FZ21YJWP?th=1
- Store: https://www.amazon.com/stores/TwistedTreatz/page/FAAB15BF-03B8-4D4F-A1EF-BB6AC913A853
- Owner photo: WhatsApp Image 2026-09-07 at 11.16.23.jpeg

The reference product has seven 970×600 image modules: product hero, benefit/flavor introduction, two flavor grids, texture/quality, package sizes and blue raspberry feature. The demo adapts the visual format using Candy Rama's existing candy imagery and updated packaging. It does not inherit the competitor's flavor inventory, claims, weights or dimensions. The store's category tabs and large campaign/category graphics inform the navigation and composition.

## Authentication and assets

Server-only environment variables: `AMAZON_DEMO_USERNAME`, `AMAZON_DEMO_PASSWORD_HASH` (salt:hex scrypt digest), and `AMAZON_DEMO_SESSION_SECRET`. No plaintext password is stored in source. Missing configuration fails closed. Configure both the local environment and any deployment environment used for testing.

Sessions use HMAC-SHA256 signatures, random nonces, eight-hour expiry and HTTP-only, same-site strict cookies scoped to `/amazon-demo`; production HTTPS cookies are secure. Sign-in and sign-out require same-origin POST. Invalid logins are delayed; this is not a distributed rate limiter.

New artwork is deliberately stored outside `public/` in `assets/amazon-demo/`. The authenticated media route allowlists file names and disables caching. Next.js output tracing includes the protected files in the server function. The route and responses disallow search indexing. Existing public candy cutouts remain public.

## Artwork

Built-in image generation was used for `assets/amazon-demo/packaging-campaign.png`. The original supplied photo is stored at `assets/amazon-demo/packaging-reference.jpeg`. Existing candy cutouts are reused from `public/generated/`.

Exact generation prompt:

Create a polished photorealistic Candy Rama Amazon brand campaign product photograph, landscape 1536x1024. Use attached photo as packaging identity reference: two hot raspberry pink resealable stand-up 8 oz pouches, cream CANDY stacked above RAMA in enormous bold slightly slanted block type with dark burgundy outline and offset shadow; subtle irregular wavy line pattern on pink, cream ribbon repeating 'Taste the Twist', broad clear lower window with silver edges, pink bottom with 'NET WT. 8 OZ'. Preserve this exact updated packaging structure, do not use labels from other brands. Left pouch holds mixed colorful gummies; right pouch holds sugar-coated assorted fruit slices. Commercial studio product photography on solid bright pink background and ground, grounded soft shadows, crisp clear candy texture. Two upright pouches centered, one slightly angled, a few real gummy candies and sugar fruit slices scattered near base. No headline or interface text outside packaging. Clean premium playful candy campaign, no people. This is concept artwork, match packaging reference faithfully.

## Validation

Production build and targeted lint passed. HTTP checks covered an unauthenticated page, rejected image access, incorrect password, cross-origin POST rejection, successful sign-in, image retrieval, unknown file rejection and sign-out. Browser checks covered the desktop design, tab switching and narrow preview. Final upload-ready Amazon assets still require approved product facts and packaging artwork.

## Release scope

The release is prepared from the existing repository HEAD plus only the demo additions and its scoped configuration/popup changes. Pre-existing local changes to `app/page.tsx`, `app/globals.css`, `.artifacts/` and fulfillment documentation are not part of the release.
