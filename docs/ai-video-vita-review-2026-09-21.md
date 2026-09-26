# Vita review — AI promotional video concepts

September 21, 2026. Independent Vita role review for internal concept delivery only. No deployment or production-photography approval.

## Evidence and review limits

Read the Vita skill and `docs/team/brand.md`, `workflow.md`, `vita.md`, `docs/ai-video-concepts-2026-09-21.md`, and `docs/amazon-visual-direction-v6.md`. Visually inspected the actual packaging authority `assets/amazon-demo/packaging-reference.jpeg`, current pink gummy and rainbow pouch PNGs, candy-only rainbow macro, current movie-night lifestyle image, and historical alternatives.

Output review used the contact sheets named below: eight sampled frames for Spotlight and Movie-night, six for Color. This establishes visible consistency at those samples, not uninterrupted playback, every-frame integrity, audio verification, or device playback QA. Parent reports audio removed from the final Movie-night export; Vita did not independently listen or inspect its streams. Final MP4 verdicts refer to their corresponding supplied final contact sheets.

## Exact prompts accepted before generation

**Pink pouch background — accept.**

> Create an eight-second portrait studio background for a candy package advertisement. A clean warm cream platform against a soft pink and yellow backdrop, with very subtle moving light. Locked camera and stable platform geometry, no camera drift. Leave an uncluttered central area for a package to be composited later. Soft realistic shadows and a cheerful tactile studio atmosphere. No objects, candy, people, letters, logos or packaging. Keep the platform stable and geometry consistent throughout.

Approved unchanged compositing source: `public/generated/gummy-bear-party-pink-v1.png`, 1254 × 1254 with alpha. Preserve full seams and proportions. Existing generated pouch art is not independently verified SKU photography.

**Color in motion — accept with candy-only start image.**

> Create a six-second portrait candy advertising concept using the supplied image as the visual source. Preserve the visible sugared candy pieces, their shapes, colors, coatings and relative scale. Keep the candy resting on the warm yellow tabletop. Make one slow, small camera push toward the sugar texture with subtle natural changes in highlights and realistic contact shadows. One continuous shot; calm, appetizing, tactile studio light. Keep the ring and rainbow strip recognizable in the central portrait crop. Do not add, remove, melt, stretch or animate the candy itself. No bowl, packaging, people, hands, writing, logos, extra candy varieties or sound. End on a steady composed detail.

Source inspected: `public/generated/lifestyle/appetite-rainbow-sour-v1.png`. This is generated camera/light motion from existing concept imagery. It does not show the originally proposed candy-tumbling action.

**Movie-night — accept for candy-reference conditioning.**

> Create an eight-second portrait candy lifestyle advertising concept. On a small cozy living-room tabletop, one shallow cream ceramic bowl holds a modest loose arrangement of only the sugared candy forms visible in the reference image: rainbow strips, two-tone rings and blue-and-white pieces. Preserve those reference shapes, colors and granular sugar coating. No additional candy types. A soft sofa and very subtle defocused screen glow sit in the background, with no recognizable screen content. Warm inviting light, a slow short camera push toward the bowl, realistic contact shadows and restrained depth of field. Bowl and candy remain stationary and consistent. One continuous shot ending in a calm portrait composition. No people, faces, hands, packaging, logos, letters, or sound.

Same candy-only reference. Approval was for reference conditioning; if using start-frame-only generation, a new scene still requires review first. The current human movie-night image was rejected as a start frame because it contains people and packaging; historical mixed-bowl and clear-pouch alternatives were rejected for product/packaging mismatch. This record does not assert a separate intermediate still was inspected by Vita.

## Final per-asset verdicts

All paths in this section are under `outputs/ai-video-concepts-2026-09-21/`.

| Final asset | Actual evidence inspected | Verdict and findings |
| --- | --- | --- |
| `pink-pouch-spotlight.mp4` | `spotlight-background-sheet.jpg`; initial `pink-pouch-spotlight-sheet.jpg`; corrected `pink-pouch-spotlight-sheet-v3.jpg` | **Accept for internal AI concept delivery.** Stable sampled stage geometry, recognizable full pouch and readable disclosure. Initial composite was revised because it appeared suspended; v3 adds a close contact shadow and grounds the unchanged pouch. |
| `color-in-motion.mp4` | Initial `color-in-motion-sheet.jpg`; corrected `color-in-motion-sheet-final.jpg` | **Accept for internal AI concept delivery.** Three source candy forms remain recognizable with visible sugar texture and a restrained push. Landscape generation is preserved within a yellow portrait composition instead of cropping away candy. Historical badge bearing “SMALL BATCH” and an obsolete slogan was rejected and replaced with clean editable “Taste the Twist.” Corrected sheet contains no historical badge. |
| `movie-night.mp4` | `movie-night-sheet.jpg` | **Accept for internal AI concept delivery.** Three reference candy forms remain recognizable in a modest cream bowl. Warm living-room setting communicates the occasion without people, packaging regeneration or a testimonial. Sampled camera push retains candy identity; no readable screen text. Screen contains a blurred scenic image, so the strict no-recognizable-content prompt was not literally achieved; it is unobtrusive and acceptable for this internal illustration. |

All final sheets show a persistent readable “AI-generated concept” label. The three treatments have distinct jobs: packaging recognition, candy texture, and an illustrative occasion. Color's framed landscape layout is less immersive than native portrait footage but protects the complete candy composition.

## Scope of acceptance

- Internal promotional concepts, not real customer footage, reviews, actual business operations, or evidence of a purchase experience.
- Not verified exact SKU appearance, assortment, quantity, weight, ingredient, origin, manufacturing, dietary or fulfillment claims.
- Existing artwork and generated references establish visual continuity, not product-fact verification.
- Keep the concept disclosure attached to previews and delivered exports. Do not place these clips among genuine testimonials in a way that confuses their provenance.
- Before public use, complete uninterrupted playback/device QA and the separate publication decision. No deployment is authorized by this review.

## Owner-requested branded edit revision

The owner subsequently asked for more interesting videos showing packaging and the brand name. **Accept the revised edit plan before export; revised outputs are not yet inspected.** This acceptance covers editing existing footage and unchanged pouch sources, not new image generation.

- Spotlight: animate the existing gummy pouch and its contact shadow together into their resting position over the first 0.6 seconds, with restrained easing and no bounce or overshoot. Maintain believable contact at the final baseline.
- Color: use the already inspected `public/generated/rainbow-mix-pink-v1.png` unchanged; open and close on a large pouch, with the full candy footage inset during the middle beat. Give each beat enough time to read within the six-second duration.
- Movie-night: use the rainbow pouch to align with sugared-candy imagery. Introduce it as an explicit editorial card with a solid brand-color backing or border; do not pretend the composite pouch physically occupied the generated room. Close on a pink package card.
- All three: visible native “Candy Rama” text, unchanged packaging, and a closing hold of at least one second. Do not recreate a logo in substitute typography. Retain the AI-generated concept disclosure throughout.

These revisions strengthen brand recognition beyond the initial candy-led concepts. Final revised exports require inspection before extending the per-asset acceptance above to them.
