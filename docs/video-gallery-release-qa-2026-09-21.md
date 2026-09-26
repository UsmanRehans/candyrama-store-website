# Video gallery release and QA

Owner explicitly requested the existing clips in the store, publication, and QA. This supersedes the earlier no-deployment instruction for this scoped gallery only. The future calm wide scene remains a separate unproduced direction.

## Release

- Live: https://thecandyrama.com
- Deployment: `dpl_GNtxW3GR7p3DJ55adjvMctfU9Mk5`, READY, production.
- Immutable URL: https://candyrama-store-1hqojmlwy-usmans-projects-dc9dc6bd.vercel.app
- Previous production: `dpl_BpXk2BSdzLcTZqdEyapexVT1veXg` (September 16).
- Branch: `codex/candyrama-trust-video-handoff-2026-09-21`. Deployment made from local working files; no commit/push performed.

Added three self-hosted, previously Vita-reviewed concept MP4s with optimized JPEG posters after the complete product lineup. Explicit AI-created/promotional disclosure; no customer-review claims. Added client playback controls and scoped styling. Header, hero, products, shopping routes, cart and order code were not edited. `.vercelignore` excludes local database, environments, dependency/build caches and working artifacts from upload.

## Checks passed

- Production build including TypeScript and all 40 static pages passed locally and on Vercel. Initial sandbox build failed only because it could not fetch existing Google Fonts; network-enabled build passed.
- Four existing payment-link tests pass. New component and homepage targeted lint pass; corrected semantic status element during lint.
- Theo independently reviewed component/release scope: no blocking code issue. Design detector found only three preexisting warnings in unrelated stylesheet sections; preserved those elements.
- Actual in-app browser: all three clips play locally and from the production domain; no video source exists before deliberate Play. No autoplay. Native controls and visible button synchronize; replay and keyboard activation exercised. Switching clips pauses the previous clip; scrolling out of view pauses playback. Color reached six seconds/end; Movie reached eight seconds/end locally; Pouch reached eight seconds/end live.
- Phone 390px, tablet 768px and desktop 1280px widths inspected; phone/tablet document width matched viewport with no horizontal overflow. Full pouch/posters preserved; AI labels and controls readable. Viewport override reset afterward.
- Browser error log empty during sampled local and live checks.
- Local quick-add → cart smoke test succeeded: item, variant, quantity, totals and U.S. unpaid-order form rendered. Test cart item removed afterward. No checkout/order/email/payment submitted.
- Live homepage, Shop, Cart, Pick Four and Rainbow Sour Mix product route returned HTTP 200. All three poster JPEGs returned 200; all three MP4s returned 206 to a byte-range request, with correct `video/mp4`, matching content ranges and expected lengths.
- Live before/after comparison preserved all 12 product links and identical three hero image URLs.
- `git diff --check` passed. HTTP evidence saved locally at `outputs/ai-video-concepts-2026-09-21/live-http-qa.json`.

## Review boundaries

Initial asset output review was independently performed by Vita. Rendered desktop/phone/tablet inspection was performed by the parent in the Vita role: the independent Vita worker's browser inventory was unavailable. This is not a claim of separate independent rendered-page approval. The earlier root browser-access quota blocker resolved on this QA pass.

This was a scoped production smoke test, not every-browser certification or a completed payment/order integration test. No deliberate failed-network simulation, reduced-motion preference toggle, screen-reader session, or hidden-tab UI test was performed. Source implements no autoplay for any motion preference, error/retry fallback, document-hidden pause and no automatic resumption. Existing third-party checkout/email/shipping services were not exercised with transactions. New gallery performance was checked through source gating and asset sizes, not a full Lighthouse/Web Vitals baseline study.


## Owner correction — hero only; gallery rejected

Owner rejected the separate video gallery and clarified “main toolbar” means the hero/banner beneath navigation. Production was rolled back successfully to `dpl_BpXk2BSdzLcTZqdEyapexVT1veXg`; browser verification confirms original hero, complete lineup and story, without gallery. Local gallery component, insertion, styles and public media copies were removed; original production studies remain archived in outputs.

The earlier after-catalog plan is superseded. AI footage is authorized only inside the existing hero/banner. Preserve navigation, established design, products and packaging. Reference inspected directly: Rich & Richer uses `/video/Hero.mp4`, a 10.005-second muted autoplay loop behind HTML hero content, starting on shelves of packaged candy and transitioning to household products. Adapt the ambient hero treatment to Candy Rama only. Do not add a video gallery or present AI as customer footage.
