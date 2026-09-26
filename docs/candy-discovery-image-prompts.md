# Candy discovery campaign — image prompts

September 14, 2026 · Vita prompt review · User requested new AI imagery and a more image-led candy discovery direction.

## Source inspection and intended use

Vita directly viewed `public/generated/rainbow-sour-cutout.png`, `blue-sour-cutout.png`, `chamoy-cutout.png`, `brittle-cutout.png`, and `rainbow-mix-launch.png`, plus `public/brand/packaging-board.png` and `assets/amazon-demo/packaging-reference.jpeg`. The loose candy assets are generated concepts. The packaging board contains placeholders and unsupported claims; it is not production label artwork. The actual packaging photograph establishes the recognizable pink/cream/plum packaging look but contains creases and perspective distortion. Neither new image below should generate packaging or text. Keep recognizable packaging in the separate shoppable product presentation using current source assets.

These are campaign illustrations, not exact SKU photographs, verified assortment contents, or evidence of a Texas factory/team. Use no competitor photographs as inputs. Parent will generate with the built-in image tool, one call per asset. No input reference files are required: this is new campaign imagery informed by inspected category references, not an edit or product-identity reproduction.

## 1. Hero — the tasting counter

Vita exact-prompt verdict: **ACCEPT for generation as campaign concept.** Grounded tabletop staging conveys discovery through contrasting candy forms rather than another floating mound. Quiet left area supports a short HTML headline. A tight right-center candy grouping supports a mobile crop. No manufacturing inference.

```text
Use case: ads-marketing
Asset type: wide website hero campaign photograph, landscape 3:2, no embedded text.
Primary request: Create a distinctive, appetizing editorial candy still life for a small, curious Texas-based candy shop. Convey the excitement of discovering many different kinds of candy through a real-looking tasting counter. This is a candy campaign concept, not a photograph of an exact product assortment.
Scene/backdrop: A warm pale cream matte tabletop continuing seamlessly into a warm cream background. One low, shallow pale butter-yellow tray sits diagonally on the right side. A small plum paper square peeks out beneath one corner. No room, workshop, people, or hands.
Subject: An inviting edited assortment on and beside the tray: two loosely folded rainbow sour belts, translucent jewel-red and golden gummy bears, a few blue-and-white gummy rings, and several deep red sugar-and-chili-coated gummy pieces. Each kind is clearly distinguishable. Arrange them in little conversational groups, with two or three pieces casually outside the tray, rather than one generic heap. Candy rests physically on the surface.
Composition/framing: Slightly elevated three-quarter camera angle, close enough to see sugar crystals and gummy translucency. Keep the left 40 percent calm and mostly empty cream for HTML headline and buttons. Concentrate the complete tray and candy focal composition in the right-center 55 percent, leaving safe space around its edges so a portrait crop of that area still makes sense. Avoid cropping the hero belt or central ring. The candy supplies the visual energy; props remain subordinate.
Lighting/mood: Warm directional afternoon studio light, clean soft-edged cast shadows, realistic highlights, friendly and tactile rather than luxurious or clinical. Sharp appetizing candy detail, restrained depth of field, editorial food photography rather than glossy 3D rendering.
Color palette: Cream and butter yellow backdrop with a small plum accent; vibrant candy reds, blues, greens and golds. Natural saturation with clear color separation.
Constraints: No lettering, logos, packaging, labels, badges, watermarks, people, hands, factories, cowboy props, Texas flags, ingredient props, or floating candy. Do not show branded candy characters. Do not use a repeated grid, collage panels, cartoon rendering, exaggerated wet gloss, or artificial rainbow gradients. No giant pile filling the entire frame.
```

## 2. Supporting macro — texture discoveries

Vita exact-prompt verdict: **ACCEPT for generation as campaign concept.** A close, horizontal still life adds texture contrast and a different scale from the hero. It must not be attached to a single SKU as proof of contents or labeled as an actual new release.

```text
Use case: ads-marketing
Asset type: supporting editorial candy macro image, landscape 4:3, no text.
Primary request: Photograph a small, beautifully observed selection of contrasting candy textures for an image-led candy discovery website. Make the viewer want to look closely and try something different. This is conceptual campaign imagery, not documentation of a particular product or recipe.
Scene/backdrop: A clean matte pale blush-pink tabletop, warm and light enough to sit naturally beside cream web sections. No dishes or other props.
Subject: Three distinct candy forms arranged as one intimate still life: a ribbon of rainbow sour belt folded once into a soft open loop, a translucent amber gummy ring partly standing against the belt, and two deep red coated gummy pieces with individually visible fine sugar and spice-like granules. Add one small blue gummy bear at the base for scale and a contrasting smooth texture. Keep the candies separate enough that every outline reads clearly; a few tiny sugar crystals may rest on the surface.
Composition/framing: Very close low three-quarter macro view, composition traveling diagonally from lower left to upper right. The belt and ring are the main focal relationship. Fill about 75 percent of the frame with this compact group, leaving a quiet margin all around. Keep the major candy forms entirely within the central square crop so the image also works on mobile. This is not a pile, a pattern, or a divided comparison graphic.
Lighting/mood: Soft side light reveals translucent edges, fine sugar crystals and the matte granular red coating. Realistic dimensional shadows, rich but believable color, shallow yet sufficient depth of field so the main candy forms stay legible. Tactile editorial macro food photography, not plastic or 3D art.
Constraints: No words, letters, logos, packaging, labels, watermarks, hands, people, fruit, chilies, kitchen equipment, fake steam, dripping sauce, floating candy, cartoon faces, novelty scenery, or brand-specific shapes. Do not imply a flavor, ingredient list, release date, or exact bag contents through extra props. Avoid harsh black backgrounds and hyperglossy synthetic surfaces.
```

## Output review still required

Prompt approval is not output approval. Vita must view each generated asset and final desktop/mobile crop before use, checking candy geometry, texture, staging, background, focal clarity, unintended text/claims, and compatibility with the page composition. Record per-asset accept/revise/reject decisions after generation. Preserve files as versioned project assets and record generated provenance; no final asset has yet been reviewed in this document.

## Generated output review — September 14, 2026

Vita directly inspected both full generated outputs using `view_image`.

- Hero, `exec-ecbcf4ce-faaf-461a-b8b7-a1cdc164f8ef.png`: **ACCEPT as campaign concept.** Clear belts, bears, blue rings and red coated pieces; believable contact shadows, inviting cream light, no accidental lettering or people. Left area provides headline space, although a belt reaches into the middle at about 35% width. Keep copy within the left third at desktop. Tray and some right-side candy already extend beyond the source's right edge; preserve the source ratio for the broad composition. On mobile use a separate image block with a right-biased crop or full 3:2 image rather than placing text over a center-cropped cover image. Not accepted as exact SKU/assortment photography.
- Macro, `exec-6c7b27a0-629e-4cbf-8abf-fa7d509f3d41.png`: **ACCEPT as supporting campaign concept.** Strong visible texture contrast and recognizable outlines, no text, clean blush background, useful change of scale from the hero. The close arrangement fills more than the requested central safe area: a square crop can cut the outer belt/red piece and portrait cover is unsuitable. Prefer original 4:3 ratio with no text overlay; use contain or a taller container preserving the complete composition. Not accepted as exact product or ingredient evidence.

Final browser-rendered desktop/mobile crop review remains pending. These full-output decisions do not claim inspection of a final page export. Parent retains generated source locations and will copy accepted project assets before references are shipped.
