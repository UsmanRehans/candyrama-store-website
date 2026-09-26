# Vita: Candy Rama trust-content direction

Planning brief · September 21, 2026 · No application changes or generated assets.

## Purpose and evidence

Help a shopper judge the actual candy, see the people behind Candy Rama, and hear credible customer experiences. The owner selected videos, reviews, and brand content as the lead outcome, with existing products, header, toolbar, and Candy Rama appearance preserved.

Source review: current `app/page.tsx`, `app/product/[slug]/page.tsx`, `app/about/page.tsx`, `components/store-chrome.tsx`, `app/candy-counter.css`, `app/layout.tsx`, `lib/lifestyle-images.ts`, and team memory. This is a source-based direction, not an independent rendered-page visual approval. Cando's current competitor inspection supplies the observed TikTok carousel, testimonial lanes, and story section; these are useful functional references, not proof of conversion lift.

## Placement and behavior

| Surface | Proposed addition | Placement and job |
| --- | --- | --- |
| Homepage | Three authentic short video previews | Immediately after the complete product lineup; keep products close to the top. Suggested distinct jobs: show actual texture, show the bag and portion accurately, introduce a real person from the business. Tap to play, clear duration and captions, product link under each applicable clip. |
| Homepage | Real customer feedback | After the existing story and before craving tiles; one restrained row of up to three readable reviews. Show product, date, attribution allowed by customer, and verified-purchase label only when supported. Avoid endless animated quote lanes. Hide until genuine content exists. |
| Existing homepage story | Real team photograph or short founder/team film | Retain concise split composition and `/about` link. Authentic footage earns trust better than implying the current generated sharing illustration is documentary evidence. Keep imagery-led storytelling and sparse copy. |
| Product detail | SKU-specific video plus review summary and full reviews | Preserve the main packshot and purchase controls. Add thumbnail access to actual SKU footage; review summary can link down the page. Put full reviews after useful product facts and before related products. Never show a different SKU under a review or video. |
| About | A real introduction and one concise discovery/process story | Extend current `/about`; do not add a second competing brand-story page. Use actual business material and verified captions, with a clear path back to existing products. |
| Shop, cart, support | Small context-specific links | Review count only where real data exists; keep cart focused on buying and support focused on answers. Do not spread large video widgets through checkout. |

A new standalone video gallery is optional later, when there is enough useful material to browse. Initial clips can live in existing pages, with a simple reusable content library behind them. New navigation items should not be added just to fill space.

## Visual preservation contract

- Reuse current `StoreHeader` and `StoreFooter`, header rule, logo treatment, mobile menu, account/cart controls, and toolbar positions. Additions should fit the present content width and responsive padding.
- Keep Bricolage Grotesque headings and DM Sans body/control typography as applied by the active Candy Counter stylesheet. Earlier Nunito/Anton references are historical, not the current storefront authority.
- Preserve plum `#5b123e`, pink `#ea537b`, yellow `#ffd23f`, and toolbar/product-lineup paper `--counter-paper: #fffcf5`. Do not recolor the product lineup pink. Use existing plum/cream contrast for readable captions and review text.
- Honor the owner's soft-edge direction on new media panels and controls with restrained rounding; match actual neighboring rendered elements during design. Current source mixes square wrappers, 4px controls, and pill filters, so do not invent a universal radius or globally round the site as part of this scope.
- Retain the three-pouch hero, catalog-driven lineup, current packshots, and actual variant/price/product identities. Trust modules must not displace the lineup below several marketing sections.
- Produce Candy Rama layouts and media. Do not copy Rich n Richer's typography, visual arrangement, color treatment, words, photos, video, creators, or social proof.
- Prefer a quiet static media row over multiple moving carousels. Desktop can show three clips; phone can show one plus a visible next-item edge with explicit controls. Every clip must also be keyboard reachable. Reviews should remain readable without a time limit.

## Content and asset checklist

Initial content targets are production suggestions, not claims that these assets exist:

1. Three authentic 15–30 second clips with different jobs, plus 1080 × 1920 portrait masters, crop-safe cover images, editable captions/transcripts, approved title, duration, and relevant existing product slug. Do not crop faces, hands, packaging, or demonstration details to force a template.
2. One real team portrait or 30–60 second introduction, with a landscape master for the existing story area and a deliberate mobile crop. Names/roles/location statements need confirmation.
3. Approved review records with original wording, rating if collected, product mapping, date, publication permission, source, and verification status. Keep moderation independent of whether the review is positive. Do not borrow reviews from a sister brand or competitor.
4. Product footage showing current candy and recognizable approved pink packaging. Photograph accurate portions and sizes. Do not imply a generated packshot or lifestyle scene is a customer's submission or real business footage.
5. Media-use permission and music rights, originals, source/date, caption file, poster frame, mobile/desktop crop, and owner/content reviewer recorded per asset.
6. Short captions by Lauren; claims supported by business records. “Texas-based” must not become “Texas-made.” No unsupported hand-packed, freshness, inventory, shipping-speed, or popularity claims.

If authentic videos are not ready, omit the production module and record the missing assets in the handoff. If no reviews exist, show an honest product-level invitation to review where a real submission flow exists; do not publish mock quotes, zero-star ratings, or fabricated aggregate counts.

## Build and acceptance criteria

Theo should implement one reusable video card/player and one review component family, styled within the existing storefront. Reserve aspect ratios before loading; load video on intent, use poster images, keep audio off until the shopper chooses it, and pause playback when closed/offscreen. Provide captions, keyboard access, visible focus, touch-friendly controls, reduced-motion support, and understandable playback/load-error fallback. Social embeds should not be required to understand the content or purchase.

Vita and Theo should compare desktop, tablet, and phone renderings against pre-change baselines: unchanged header/toolbar, stable first product position, no horizontal overflow, legible reviews, intact packaging, workable modal focus/close behavior, and no autoplay competition. Asset fidelity and actual performance need review on the implemented pages; this brief does not claim those checks have passed.

The existing `HomeConversionSections` source file is not imported by the current homepage. It contains legacy/generated review-wall and workshop ideas and offers; do not revive it wholesale or describe those as live capabilities. The active source currently renders hero → complete lineup → story → craving tiles → Pick four → footer.

Impeccable context ran successfully and found incumbent styling but no PRODUCT.md/DESIGN.md. This bounded planning pass uses the explicit owner brief and current source; no visual redesign, framework migration, or application build was performed.
