# Theo: Candy Rama implementation baseline

Date: September 21, 2026. Planning-only source audit for the Rich n Richer comparison. No production state, credentials, database contents, purchases, customer records, or live end-to-end transactions were inspected. “Implemented” below means present in this checkout, not independently proven deployed or operational. Competitor observations belong to the main research report.

## Preserve

Keep Candy Rama's existing `StoreHeaderClient`, toolbar, soft corners, product cards, Candy Counter palette and page shell. Retain products, SKUs, prices, packaging, existing routes and the owner's U.S. unpaid-order-review policy. Extend existing components; do not replace the commerce platform to imitate another shop. Preserve the cream product background matching `--counter-paper`.

## Current functionality and gaps

| Area | Repository evidence | Implemented / gap |
|---|---|---|
| Navigation | `components/store-header-client.tsx`, `components/store-chrome.tsx` | Desktop and mobile shop/Pick Four/gifting/story navigation; account and cart badge; newsletter trigger; footer service links. No customer search control. Keep this chrome, adding discovery within it. |
| Catalog | `app/shop/page.tsx`, `components/shop-catalog.tsx`, `lib/server/catalog.ts` | Database-backed active products and variant prices; sour/sweet/spicy/crunchy filters, URL craving parameter, count and empty state. No text search, sort, compound filters, dedicated collection pages or pagination. Catalog is small: build lightweight search/sort first, defer large-catalog complexity. |
| Product cards | `components/product-card.tsx`, `components/add-to-cart-button.tsx` | Product links, current default variant price and real cart add. Not a fake buy button. Preserve and improve feedback rather than rebuild. |
| PDP | `app/product/[slug]/page.tsx`, `components/product-options.tsx` | Breadcrumb, one product image, description, size/price selection, cart add and generic allergen guidance. Related products are simply first three other records. No product gallery/zoom, PDP quantity selector, structured per-SKU ingredient/allergen panel, review system or detailed shipping accordion. Product loader intentionally fetches only first image and omits ingredient detail. Expose approved data; do not invent it. |
| Bundles | `components/pick-four-builder.tsx` | Working four-slot builder, repeated selections, default variants, live subtotal, 15% savings and cart integration. Extend this; don't commission a duplicate bundle builder. Size selection is absent here. |
| Cart | `components/cart-provider.tsx`, `components/cart-page-client.tsx` | Persistent local-storage cart, quantity/remove, estimated totals, shipping threshold message, four-bag offer, gift message, checkout and payment-link fallback. No cart drawer or inline suggested product add. Unknown/deactivated SKU lines are silently omitted from rendered lines while stored items still feed checkout: add explicit reconciliation messaging. |
| Payment | `app/cart/page.tsx`, `app/api/v1/checkout/route.ts`, `app/api/v1/orders/payment-link/route.ts`, `app/api/webhooks/stripe/route.ts` | Real Stripe hosted checkout code with stock reservation; UI pay-now is conditional on live Stripe configuration. Unpaid order request is implemented with server prices, U.S. address, idempotency, pending status and notification attempt; stock is deliberately not reserved. Presence of code does not prove live configuration. Preserve clear distinction between request received, paid and shipped. |
| Account | `components/customer-account.tsx`, `app/api/v1/account/orders/route.ts` | Sign-up/sign-in, authenticated order history, points/referral display, carrier/tracking text. No forgot-password UI, address book, reorder button or clickable carrier tracking. Backend failure currently falls back to zero points/no orders with a message: distinguish unavailable data from genuine empty state. |
| Contact / wholesale | `components/contact-form.tsx`, `components/wholesale-form.tsx`, corresponding `/api/v1` routes | Actual submitted forms, not decorative stubs. Contact depends on email delivery; wholesale persists application and separately reports notification outcome. Confirm integrations in release acceptance. |
| Newsletter / loyalty | `app/api/v1/newsletter/route.ts`, checkout route, account component | Subscriber persistence and first-order offer eligibility are coded; rewards/referral checkout logic exists. Not evidence of an operational email-marketing campaign or approved loyalty program economics. Do not duplicate signup or add competing offer rules. |
| Content pages | `app/{about,gifting,why-candyrama,faq,allergens,dietary-information,candy-safety,freshness-promise,wholesale,contact,careers,investors}/page.tsx`; `app/legal/*/page.tsx` | Existing brand, service, policies, gifting and informational pages. Careers is honestly no-open-roles plus email; investor page is informational plus email. These aren't commerce gaps demanding new software. Review public promises against approved operations; FAQ contains shipping timing, facility allergen and 50-bag bulk-pricing claims that source code alone cannot verify. |
| Measurement / SEO | Search of `app`, `components`, `lib`; `app/layout.tsx` | No storefront funnel instrumentation found. Metadata exists; no route sitemap/robots files found. Do not claim conversion lift from visual inspiration. Establish baseline events and valid structured product data before growth experiments. |
| Back office | `app/admin/catalog`, `app/admin/orders`, admin API routes, README | Existing catalog workbook/image and fulfillment surfaces, integration checks and shipping label code. Reuse; external service readiness is unverified in this audit. |

## Prioritized engineering acceptance criteria

### P0 — operational clarity before extra features

1. Verify deployed catalog, product/variant IDs, cart price, offer and shipping calculation agree. Review existing offer rules with Nico; do not silently change pricing or eligibility. Client estimate and authoritative checkout must explain any difference.
2. Exercise paid checkout in an appropriate test environment and unpaid order requests without charging customers. Test duplicate submit, unavailable/deactivated variant, zero recorded stock (unpaid request allowed), payment failure/cancel, confirmation, notification failure and paid-versus-pending labels. No paid or ready-to-ship language for a pending request.
3. Complete password reset, clear account loading/error/empty states, safe carrier links and a customer-facing tracking/help entry point. Reorder must reprice and revalidate current variants.
4. Instrument product view, search/filter, add/remove, checkout start, order request success and payment-confirmed purchase distinctly. Deduplicate purchase by order ID and exclude emails/addresses from analytics. Avery owns metric definitions.

### P1 — make existing products easier to discover and decide on

5. Add accessible search in current chrome with product-name/category/description matching, keyboard operation, count, clear action and useful zero-results state. Preserve search/filter state in URL and back navigation. Start with current catalog; add sorting by price/name only where defensible. Newest requires valid catalog dates; best-selling requires actual sales data.
6. Expand PDP data adapter and page for approved ingredient/allergen facts, net weight, gallery, quantity and concise delivery/returns accordions. Missing facts remain explicit, never guessed. Size change updates price/weight/cart SKU together. Only verified uploaded images become product gallery images.
7. Add an optional cart drawer using the existing provider, with confirmation, quantity/remove and clear full-cart/payment-request handoff. It must work by keyboard, return focus, respect reduced motion, and never cover core mobile controls. Preserve the full cart route.
8. Improve related products and cart add-ons using existing active SKUs and transparent category rules. No fabricated best sellers, ratings, scarcity or discounts. Hide empty collections rather than fabricate products.

### P2 — evidence-led retention and merchandising

9. Add collection/occasion landing pages only where existing assortment supports them; reuse catalog cards and service-page shell. Keep current gifting and Pick Four flows. Wishlists or reviews should follow demonstrated need and operational moderation/consent requirements, not competitor feature count.
10. Validate structured metadata/canonical URLs, sitemap, accessibility, responsive layouts and performance. Test phone/tablet/desktop and empty/loading/error/long-name/multiple-size states. Any new menu, search or drawer must preserve the current header/toolbar visually.

Suggested build order: P0 reliability/measurement → search + PDP → cart convenience → selective merchandising/retention. No code implementation or publishing is authorized by this planning request.

## Audit limits

Source inspection, not security certification, live visual QA or commerce integration verification. Impeccable context ran successfully and reported existing visual implementation with no PRODUCT.md/DESIGN.md and no automatic hooks. Planning preserves incumbent styling; no new UI or detector run was performed. Relevant installed Next.js docs must be read when implementation starts. Production release needs explicit scope plus the existing team's visual, claims and operational checks.

## Owner steering: trust through videos, reviews and brand content

Cando relayed the owner's selected lead outcome during the audit. This supersedes the discovery-first build sequencing above: keep reliability checks as release gates, but deliver the trust content foundation and real proof modules before search/cart conveniences. Rich n Richer uses outbound marketplace catalog destinations per the main research; this is not a reason to replace Candy Rama's native commerce.

### Trust implementation evidence

- `prisma/schema.prisma:280` already defines Review with product relation, rating/body, PENDING status, author/email and verifiedOrder boolean. This is a **schema foundation**, not a complete review product: no public review submission/read or moderation routes, published review display or proof-verification workflow were found in app/components/lib. Do not treat the boolean alone as verified-purchase evidence.
- `components/home-conversion-sections.tsx:259` contains a “REAL REVIEWS COMING AFTER THE FIRST BITE” block and generated social/workshop images. Current `app/page.tsx` does **not import that component**. It is legacy code, not evidence that today's homepage displays reviews. Never reintroduce generated imagery as real customer proof or actual workshop documentation.
- Story page is implemented in `app/about/page.tsx` with generated/lifestyle imagery. It provides brand narrative, not verified team/facility footage. No active video trust gallery or reusable content publishing model was found in the inspected storefront files.

### Revised first build tranche

1. **Small editorial content layer:** Define reusable brand/video/story records carrying title, concise caption, asset/poster, transcript/captions, related existing SKU slugs, provenance, usage permission, reviewer, publish state and ordering. Start with a versioned content manifest if only the team edits; add CMS/admin only when owner editing needs justify it. No database schema change is made by this plan.
2. **Video proof modules:** Add a compact homepage row after the near-top product lineup, richer story-page clips and relevant PDP clips. Preserve Candy Rama chrome, corners and original product assortment. Use genuine footage of real products/team where available; label illustrative assets appropriately. Poster-first, user-initiated playback, no autoplay audio, captions/transcripts, keyboard controls, reduced-motion support, and third-party embed loading only on deliberate interaction. Validate mobile loading/performance and provider privacy behavior before release.
3. **Real reviews:** Extend the existing Review foundation with submission, moderation queue, published-only reads, spam controls and safe author display. Verify purchase through server-side order/product evidence; never trust submitted verifiedOrder. Make invited reviews possible after fulfilled orders, with authorized consent/outreach workflow. Until authentic reviews exist, omit scores/counts rather than seed fake content. Count and aggregate only eligible published reviews. Review provenance and rights for photo/video attachments must be recorded.
4. **Consistent trust facts:** Make story/PDP/FAQ/freshness/shipping/allergen copy draw from approved operational facts. Separate real product facts from lifestyle illustration. Lauren validates claims, Nico verifies process, Vita checks asset truth and crops, Theo tests states/rendering. Fix claims mismatches before turning them into repeated trust badges.
5. **Measure the trust journey:** Record proof-module impressions, intentional video plays/completions and clicks to related existing PDPs without collecting customer personal information. Measure add-to-cart/order outcomes downstream; do not treat video views as revenue or promise lift. Avoid a large experiment stack at current small-catalog scale.

Acceptance: no counterfeit social proof; source/permission trace for every published proof asset; no header/toolbar replacement; product lineup stays near the top; real reviews absent means honest empty/hidden module; published review counts match approved records; videos remain optional and accessible; all story/help claims agree; mobile performance remains within agreed baseline. Search, sorting and cart drawer move to subsequent optional scope.
