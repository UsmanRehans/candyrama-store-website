# Vita — calm website video direction

September 21, 2026. Direction only; no render, code change or deployment. Latest owner request for beautiful, easygoing website footage supersedes the preceding close-up branded reveals and closing cards.

## One scene first

Create one quiet landscape brand scene rather than a row of portrait advertisements. Start with an eight-second locked-camera shot: a warm cream tabletop in soft afternoon light, one complete hot-pink Candy Rama pouch and a small cream dish of visually referenced candy. Keep the setting simple and welcoming; no people, shipping workspace or implied real business operations. A soft pink background area and a restrained yellow accent connect it to the store.

Packaging should occupy approximately 30–35% of frame height, fully visible with room above, below and to both sides. Use the already inspected pink rainbow pouch unchanged as a composite, with its existing wordmark readable; match perspective and contact shadow. Place the pouch just right of center and the dish slightly forward-left, leaving roughly half the scene visually quiet. Do not enlarge candy into a macro or add a giant logo just to fill space. No promotional text, hard cuts, entrances, end card, zoom or floating package. Subtle diffuse light/shadow movement is enough. A stationary package and camera are more credible together than an unmoving package against a drifting generated room.

This is an initial framing brief, not an accepted exact generation prompt. Vita must inspect the actual scene/reference composition and exact prompt before any new generation, then review the result.

## Placement in the actual homepage

Inspected `app/page.tsx`, `app/candy-counter.css` and the relevant selector locations in `app/candy-motion.css`. The current page sequence is header, three-pouch discovery hero, complete product lineup, team story, craving links, pick-four offer, footer. Preserve the header, toolbar, existing symmetrical three-pouch hero and immediate product access.

Preferred local prototype: a single standalone figure **after the complete product grid and before the existing story**, constrained to the catalog's content width. Let the cream page surface surround it with the site's existing soft corner treatment. No extra heading, paragraph or shopping CTA is necessary. Use one short outside-frame provenance line, Lauren's proposed “AI-created brand scene.” This identifies the image's nature without styling it like a customer testimonial.

Do not replace `discovery-story-image` in this scope. That slot is currently 3:2, occupies 60% of the desktop story row and stacks below 900px; its adjacent “Small team” text and “Meet Candy Rama” link risk making a generated scene look like evidence about the actual team. Avery and Lauren independently favored a separate post-catalog moment for this reason. Existing generated story imagery deserves its own provenance review; that is not a reason to compound the ambiguity with the new video.

## Desktop and mobile

- Desktop: compose and review a **16:9** landscape master, with the full package and dish inside the middle 70% of width. Use 1920×1080 as a working master, then encode a appropriately sized lightweight web derivative. At a 1200px displayed width the pouch is approximately 200–235px tall: recognizably branded without dominating the page.
- Mobile: author a separately reviewed **4:3** composition, not a portrait crop of the landscape export. Move pouch and dish closer while retaining their whole silhouettes and breathing room. Keep pouch near 40% of frame height so its identity survives small display size. A 960×720 working asset is adequate for the initial prototype; final encoding follows measured visual quality and load performance.
- Poster: export the same balanced resting composition for each size. It must communicate the complete scene before motion loads. Preserve all package artwork, avoid edge tangencies, and inspect at actual phone width.
- The first and last frames should be visually close if a loop is proposed. Do not call it seamless before inspecting that join. One eight-second scene is enough to evaluate the direction; do not produce three more variants first.

## Motion and implementation boundary

The visual concept must work as a still. Start the prototype with the poster and a discreet play control; no autoplay audio. If a later ambient-autoplay version is chosen, mute it, provide pause, load only near the viewport, pause when offscreen, and honor reduced-motion/data preferences with the poster. Do not create simultaneous competing movement beside this scene. Theo should verify actual browser behavior, controls and load cost before public use.

Avery recommends comparing the poster and motion version with identical artwork; that is a sensible bounded check, not proof that video improves sales. Observe load behavior and whether shoppers still reach products comfortably before increasing motion or production scope.

## Acceptance criteria for the next review

Complete readable pink packaging, reference-consistent candy, stable light/perspective/contact, generous scene context, no fake documentary implication, and a restful composition at desktop and phone sizes. The brand name should be present through packaging naturally, not through a forced advertising title. Record generation provenance and retain the external AI-scene disclosure. Internal concept acceptance remains separate from accurate-SKU and publication approval.
