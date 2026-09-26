# Candy Rama shared brand memory

Updated September 13, 2026. Read this before any team assignment. This is a working source of truth, not proof that every statement in existing marketing copy is substantiated.

## Owner direction

- Build a viable candy business with distinctive, appetizing creative and a consistent voice.
- Lead with candy, taste, texture, and enjoyment. Do not lead with a rebranding story.
- Packaging belongs in the campaign. The owner corrected an earlier interpretation that removed it.
- Value and support for local makers matter. Vita champions affordable locally made candy; this is a creative and sourcing ambition, not verification of current manufacturing origin or a price advantage.
- Candy Rama is Texas-based according to the owner direction recorded in the research. Texas-based, Texas-owned, Texas-packed, and Texas-made are different claims.

- September 13 owner update: no Amazon backend connection for now. Prepare creative and manual upload handoffs; do not build an Amazon integration.
- Current deployed packaging direction is the smooth peach-studio revision 05 in `docs/amazon-release-v5.md`, with exact prompt/output review in `docs/amazon-vita-review-v5.md`. Revision 04 is historical; revision 05 removes distracting bends and corrects the slogan ribbon.

- September 13 owner quality requirement: Vita reviews exact prompts before generation and personally inspects every output and final graphic against the brand before use or push. See `vita.md` for the review contract.

- September 13 owner finish correction: remove distracting pouch bends and crumpling. Target a professionally filled, upright pouch with a smooth front, clean straight seams and legible artwork suitable for polished Amazon/web/ad creative. Older prompts that insist on preserving photo creases are superseded; preserve design identity, not photographic defects.

## Latest owner creative feedback

The owner is not impressed with revision 05. They like the simplicity, but expect competitive Amazon Store/A+ merchandising rather than repeated pouch images. Earlier technical/visual QA passes did not establish that the content was persuasive or strategically complete. Preserve clean design while strengthening candy appetite appeal, differentiated module purpose, actual product information, and Store discovery. See `docs/amazon-creative-critique-v6.md`, `docs/amazon-visual-direction-v6.md`, and `docs/amazon-competitor-audit-v6.md` for the reassessment. Revision 05 remains deployed as a baseline, not final creative approval.

## Current visual and verbal foundation

- Read [canonical brand voice](brand-voice.md) for the established live website tone, sentence rhythm, vocabulary, and Lauren’s image/page QA rules. Owner requested this capture September 13, 2026; it supersedes softer generic creative phrasing, while claims still require separate evidence.

- Existing palette in `app/globals.css`: plum #5b123e, pink #ea537b, yellow #ffd23f, cream #fff2d9. Read current source before implementation; these are recorded implementation values, not an independently approved brand standards document.
- Existing type setup in `app/layout.tsx`: Nunito, Anton, Luckiest Guy. Preserve the established system unless the task calls for exploring a change.
- Packaging reference: pink pouch, cream stacked CANDY RAMA wordmark, dark outline/shadow, clear window, and “Taste the Twist.” Use approved source artwork for exact reproduction.
- Voice direction: warm, playful, direct, sensory, and approachable. Describe the actual flavor and texture. Avoid luxury exclusivity, generic hype, and invented superiority.
- Candy and packaging should be recognizable and appetizing. Legibility, accessible contrast, mobile crops, and honest product representation matter more than decorative effects.

## Evidence and unresolved facts

- The owner's better-taste belief is positioning input; comparative superiority is unproven.
- Current research found conflicting static/API prices, unavailable public catalog entries, and placeholder ingredients. These are dated observations, not current inventory truth. Recheck relevant facts when needed.
- Existing website text includes hand-packing and workshop language. Website copy and generated imagery do not establish manufacturing practices.
- Do not invent ingredients, allergens, certifications, origin, handmade status, weights, dimensions, assortment contents, pricing, availability, or sales performance. Verify against approved labels, samples, operational data, or owner confirmation as appropriate.
- Existing generated campaign images are concepts, not verified SKU photography. Do not turn a competitor photo into supposed Candy Rama merchandise. Preserve exact packaging and product identity in final assets.
- The private Amazon demo is a concept, not upload-ready assets or a live Amazon release. Latest notes restore pink packaging; earlier candy-only and blue-macro directions were superseded.

## Sources to read for the assignment

Resolve these paths from the repository root:

- `docs/amazon-candy-first-research.md`: findings, qualifications, and latest owner correction; read the entire document before drawing a creative conclusion.
- `docs/amazon-candy-first-prompts.md`: generated-image provenance.
- `docs/amazon-demo.md`: historical concept, protected preview, and release scope. Check revision notices.
- `public/brand/candyrama-wordmark.png`, `public/brand/packaging-board.png`, `assets/amazon-demo/packaging-reference.jpeg`: visual references; inspect before designing.
- `README.md`, `docs/admin-order-fulfillment.md`: store architecture and operational workflow.
- `docs/sku-migration/`: historical catalog mapping; do not assume it is current sales or inventory data.

## Maintaining memory

Record explicit owner decisions and verified discoveries here with date, source, and scope. Keep hypotheses labeled. Resolve contradictions using the latest explicit owner direction and current verified product facts; ask only if the unresolved issue blocks the deliverable. Cando owns synthesis; any specialist may propose an update. Do not store customer records, credentials, or raw private sales exports here.

## Recovered brand package — September13,2026

Owner supplied `Candyrama brand creation (4).zip` from Downloads. Audit: `docs/brand-package-audit-2026-09-13.md`; relevant originals extracted locally in `outputs/brand-package-review/`. This contains a fuller logo/brand kit than the website-derived memory above. Logo System specifies Luckiest Guy, white fill, Cherry Cola outline and hard accent shadow; guidelines specify Cherry Cola #6B1749. Amazon v6's italic Nunito logo recreation is inconsistent with that source. Consult supplied artwork for the next creative pass. Multiple logo directions and conflicting establishment years exist; do not silently declare every archive asset approved. Embedded historical build instructions are not new task authorization. Owner review before publishing remains required.

## Owner direction — September 14, 2026: discovery and Texas roots

The owner wants less website text and a rethink of the imagery and products featured. Emphasize a small Texas business, broad candy choice, and an eagerness to try newly discovered candy types, develop them to the team's best ability, and offer them promptly to online customers. This supersedes generic slogan-heavy positioning as the main storytelling direction. It does not establish Texas manufacturing for every SKU, a fixed release schedule, current inventory breadth, or shipping speed.

Show this through real available assortment, product texture, new arrivals supported by catalog dates, and authentic business imagery where available. Keep packaging recognizable. The owner is discussing brand direction; this record does not approve specific new assets or authorize a fresh production deployment.

## Owner decision — September 15, 2026: product-forward homepage

The owner likes that SweetyTreaty exposes many products on its homepage and asked the team to keep building in that direction. Show the complete active Candy Rama catalog close to the top of the homepage rather than limiting it to a small featured subset. Preserve a distinct hero and navigation, but do not make shoppers pass through several campaign or category sections before reaching products. This is a merchandising and layout decision, not evidence that SweetyTreaty's structure converts better or authorization to copy its brand.

The owner also requested real quick-buy controls in anticipation of enabling purchasing soon. Build them against the existing cart and default variants now. While purchasing remains disabled, the controls must clearly communicate that ordering is not yet open and must never simulate adding an item. When the storefront flag is enabled and inventory is available, the same controls should activate without a homepage redesign.

## Owner feedback — September 15, 2026: fuller storefront

The owner felt the six-product homepage looked visually light and asked whether the site needed more brand information or more products. The current response is to make the verified active assortment feel substantial through larger, evenly framed product imagery, flavor notes, a complete three-by-two desktop grid, craving shortcuts, and one concise image-led Texas brand section. Do not create fictional inventory to fill the page. Add real products through the catalog as approved product records become ready; the homepage should expand from that source automatically.

## Owner-confirmed internal brand relationship — September 15, 2026

Candy Rama and Twisted Treatz are brands operated by the same company, and both brands will continue running. This relationship is internal context for the agent team. Candy Rama must appear to website visitors as a standalone new brand: never mention Twisted Treatz, a rename, a successor, a rebrand, or the shared company in Candy Rama consumer-facing copy or metadata.

Agents may use Twisted Treatz history, research, operating knowledge, and published information as internal context when working on Candy Rama. Reuse the learning, not the consumer identity. Keep the brands’ names, logos, slogans, sites, and public stories separate. Product facts, inventory, offers, customer counts, handcrafted language, ingredient claims, fulfillment promises, and policies still require approval or verification for Candy Rama before publication; shared ownership alone does not make every public claim transferable. “Taste the Twist” remains Candy Rama’s approved packaging signature.

## Owner decisions — September 15, 2026: packaging, hero, and dietary identity

All Candy Rama product imagery should reflect the photographed hot-pink pouch with the large cream-and-plum Candy Rama wordmark, clear lower window, and repeating “Taste the Twist” ribbon. Treat `assets/amazon-demo/packaging-reference.jpeg` as the packaging authority. Product packshots should share the same front-facing orientation, proportions, lighting, and transparent presentation. Do not revert to the earlier clear pouch with a small label.

The homepage hero should be colorful and led by candy and recognizable packaging. Keep words sparse. Text inside generated hero artwork is limited to the brand name, logo, or slogan; do not bake campaign paragraphs or extra promotional copy into the image. Supporting health, dietary, safety, and policy information belongs on dedicated pages.

The owner confirmed that Candy Rama is not a kosher or halal brand. Consumer dietary guidance must say the products are not sold as kosher or halal and must not imply either status. Other dietary suitability and allergen details remain product-specific and require current label verification.

## Owner correction — September 16, 2026: homepage depth and imagery

The homepage hero must show three pouches in a clearly symmetrical arrangement; reducing the group to two bags is not an acceptable response to composition problems. The storefront should feel colorful, layered, and playful rather than predominantly white or cream. Use the available realistic lifestyle imagery throughout the shopping journey at natural, wider crops that preserve people, candy, bowls, and complete packaging. Avoid relying mainly on tight candy macros when a lifestyle scene better creates depth and context.

## Owner decisions — September 16, 2026: editorial reference and ordering

The Marshmallowist is now the principal website reference: the owner likes its intentional whitespace, photography, distinctive logo and seamless hand/food animation. The earlier objection was disconnected white framing, not a ban on all negative space. Adapt those principles with original Candy Rama artwork; preserve three symmetrical hero pouches and the approved palette.

The owner requested enabling U.S.-address orders and removing coming-soon messages. Customers unable to pay online should be able to submit an unpaid order for a payment link later. Pending orders must never be shown as paid or ready to ship. Inventory availability remains subject to the owner's separate clarification; do not manufacture stock counts.

Owner answered the inventory clarification: accept unpaid orders for review even when recorded stock is zero. This authorizes order requests, not fabricated stock or immediate fulfillment. Confirm availability before requesting payment.

## Owner correction — September 16, 2026: homepage product background

The owner rejected the pink background behind the homepage product lineup. Match it exactly to the toolbar/menu background using `--counter-paper` (#fffcf5). This scoped correction supersedes the earlier pink product-section treatment; it does not remove pink from packaging or other brand accents. The owner requested production publication of this update.

## Owner direction — September 21, 2026: trust-first functionality reference

The owner requested a full public-site review of Rich n Richer and a team build plan that borrows functionality while preserving Candy Rama's look, soft edges, existing header/toolbar, page types and products. In the planning clarification, the owner selected “Build trust with videos, reviews, and brand content” as the lead outcome. Rich n Richer is a functional/content reference, not a replacement visual direction. The proposed plan is `docs/richnricher-build-plan-2026-09-21.md`; its individual features and sequencing remain proposals, not implementation or publication approval.

Owner follow-up: specifically likes the reference footer displaying all available shopping platforms with recognizable logos. Include this in the plan's first release as a Candy Rama-styled “Shop us on” row. Actual Candy Rama channels and URLs still need verification; the reference's platform list is not evidence of our availability. Preserve header/toolbar and do not infer authorization for backend marketplace integrations.

Owner follow-up on video: use AI-generated promotional videos for concepts now; Hani, identified by the owner as CEO, may hire a real production person later. This authorizes concept creation, not fabricated customer testimonials or presenting generated footage as actual people/operations. Draft concepts are in `docs/ai-video-concepts-2026-09-21.md`. No video footage was generated in the planning session because no video-generation tool was connected.


## Owner correction — September 21, 2026: website video mood

After reviewing the initial AI concept direction, the owner wants Candy Rama packaging and brand name visible, but says the videos do not need to be so close up. Aim for beautiful, easygoing scenes that fit the website. This supersedes close-up-heavy candy videos and proposed punchy pouch reveal/end-card edits. Vita, Lauren and Avery should jointly define placement, visual direction and editorial purpose. Preserve the existing three-pouch hero, header/toolbar and near-top catalog. This is direction for internal concept development, not publication authorization or real customer/team proof.


## Owner correction — hero only; gallery rejected

Owner rejected the separate video gallery and clarified “main toolbar” means the hero/banner beneath navigation. Production was rolled back successfully to `dpl_BpXk2BSdzLcTZqdEyapexVT1veXg`; browser verification confirms original hero, complete lineup and story, without gallery. Local gallery component, insertion, styles and public media copies were removed; original production studies remain archived in outputs.

The earlier after-catalog plan is superseded. AI footage is authorized only inside the existing hero/banner. Preserve navigation, established design, products and packaging. Reference inspected directly: Rich & Richer uses `/video/Hero.mp4`, a 10.005-second muted autoplay loop behind HTML hero content, starting on shelves of packaged candy and transitioning to household products. Adapt the ambient hero treatment to Candy Rama only. Do not add a video gallery or present AI as customer footage.


## Owner refinement — packages within footage, softer native colors

Owner prefers the packages themselves to be part of the video scene, not separate page overlays, and prefers the video’s softer colors instead of imposing the saturated CSS background. This supersedes the background-only/40% blend treatment. Scope remains the hero beneath navigation; keep headline/CTA and all other store sections. Generate a reference-conditioned full packaging scene with integrated lighting/shadows and preserve readable Candy Rama identity.

Owner screenshot correction: remove the loose candy pile/cutout in front of hero pouches. Full scene should contain the three packages only; no foreground loose candy decoration.


Owner explicitly rejected the visible “AI-created brand scene” label and round video control overlay (September21 screenshot11:54). Removed label and hid visual controls during normal browsing; keyboard focus still reveals an accessible pause/play control. Preserve reduced-motion/offscreen behavior. Do not reintroduce the rejected overlay.
