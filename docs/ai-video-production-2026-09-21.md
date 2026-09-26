# AI video production — September 21, 2026

Internal promotional concepts only. No publication or deployment authorized. Working branch: `codex/candyrama-trust-video-handoff-2026-09-21`.

## Connection and first submission

Fresh Higgsfield tools are callable and account access works; no reinstall was needed. Initial balance: 270 credits, Starter plan. Seedance 2.5 cost preflight succeeded (56 credits for 8 seconds at 720p), but generation was rejected with `Requires plus plan or higher`; no job ID was returned. Kling 3.0 standard/silent preflight estimated 12 credits and successfully submitted the first video job.

- Job: `13064b97-52a0-4f1a-ba2a-7c74e3f5ee73`
- Model: `kling3_0`; `duration: 8`, `aspect_ratio: 9:16`, `mode: std`, `sound: off`, one output.
- Purpose: generated background for Pink pouch spotlight; existing pouch composited afterward without regenerating lettering.
- Packaging authority: `assets/amazon-demo/packaging-reference.jpeg`.
- Foreground: `public/generated/gummy-bear-party-pink-v1.png`, SHA-256 `ddd49aebd9d00e29d2992e9eb7f7431899c6cef870a5c8736b7d1f76ff41d65d`.
- Public asset at `https://candyrama-store.vercel.app/generated/gummy-bear-party-pink-v1.png` was fetched and its hash matched the local file.

Exact generated-background prompt, accepted by independently delegated Vita after inspecting packaging and current assets:

> Create an eight-second portrait studio background for a candy package advertisement. A clean warm cream platform against a soft pink and yellow backdrop, with very subtle moving light. Locked camera and stable platform geometry, no camera drift. Leave an uncluttered central area for a package to be composited later. Soft realistic shadows and a cheerful tactile studio atmosphere. No objects, candy, people, letters, logos or packaging. Keep the platform stable and geometry consistent throughout.

Vita's preflight: ACCEPT for internal concept generation. Preserve complete pouch, proportions and seams; inspect contact shadow and faint alpha fringe on cream. Existing foreground is generated concept art, not verified SKU photography. Prompt acceptance is not output acceptance.

## Remaining concepts: preflight

Vita inspected `public/generated/lifestyle/appetite-rainbow-sour-v1.png` and accepted it as the candy-only concept reference. SHA-256 `d4e2e3a378b11e8f14b4e330994ac120b65e36be1bb394f60bc85dd602d479b3`; the deployed copy's hash matches. No current SKU accuracy is claimed from an existing generated image.

Color in motion — accepted exact image-to-video prompt:

> Create a six-second portrait candy advertising concept using the supplied image as the visual source. Preserve the visible sugared candy pieces, their shapes, colors, coatings and relative scale. Keep the candy resting on the warm yellow tabletop. Make one slow, small camera push toward the sugar texture with subtle natural changes in highlights and realistic contact shadows. One continuous shot; calm, appetizing, tactile studio light. Keep the ring and rainbow strip recognizable in the central portrait crop. Do not add, remove, melt, stretch or animate the candy itself. No bowl, packaging, people, hands, writing, logos, extra candy varieties or sound. End on a steady composed detail.

Movie-night — accepted exact prompt for reference-conditioned video, not start-frame-only mode:

> Create an eight-second portrait candy lifestyle advertising concept. On a small cozy living-room tabletop, one shallow cream ceramic bowl holds a modest loose arrangement of only the sugared candy forms visible in the reference image: rainbow strips, two-tone rings and blue-and-white pieces. Preserve those reference shapes, colors and granular sugar coating. No additional candy types. A soft sofa and very subtle defocused screen glow sit in the background, with no recognizable screen content. Warm inviting light, a slow short camera push toward the bowl, realistic contact shadows and restrained depth of field. Bowl and candy remain stationary and consistent. One continuous shot ending in a calm portrait composition. No people, faces, hands, packaging, logos, letters, or sound.

Vita rejected the current people/packaging movie-night lifestyle image for this no-people brief, the obsolete clear-pouch launch image, and the older oversized mixed bowl without reliable candy identity. If the selected model supports only start images, generate and review a new still before image-to-video.

## Output status

Three initial concept videos completed and frame-reviewed by Vita; see `ai-video-vita-review-2026-09-21.md`. Initial clips are studies, not the owner-selected website direction. Save final media, reproducible edit sources, posters and per-asset verdicts under `outputs/ai-video-concepts-2026-09-21/` (gitignored local artifacts). Keep a persistent “AI-generated concept” label. These clips are separate from genuine customer reviews and real team/operations footage.


## Completed initial studies and owner correction

- Pink pouch spotlight: job `13064b97-52a0-4f1a-ba2a-7c74e3f5ee73`, 12 credits. Final 8-second portrait edit preserves the original pouch and corrects the contact shadow.
- Color in motion: job `0f4205ee-0c9d-447d-a5a6-1c593d6d3085`, Kling 3.0 standard/silent, 9 credits. Provider returned 1108×828 despite 9:16 request. Final 6-second portrait layout retains full footage; historical small-batch badge was rejected and removed.
- Movie-night: job `0066299f-756a-409b-bb16-de9e49eae687`, MiniMax H3, 16 credits. 1440×2560 source; final 8-second 720×1280 silent edit. The model's generic `image` role was normalized by the tool to `image_references`.
- Balance after generation: 233 credits, down from 270 (37 total). No plan upgrade or new subscription. All three final edits have persistent AI-concept labels; source masters, posters, editable Higgsedit projects and manifest are saved locally in the output directory.
- A standalone local review page is `outputs/ai-video-concepts-2026-09-21/index.html`. It is not integrated into the storefront. Browser opening/playback QA was blocked by automatic approval review reporting a Codex usage limit. No browser workaround was attempted. Review is based on exported frame sheets and renderer output, not continuous playback/device acceptance.

Owner feedback after these studies: wants packaging and Candy Rama name visible, but explicitly does not want close-up-heavy advertising. Prefers beautiful, easygoing scenes suited to the website and requested Vita, Lauren and Avery collaborate on the smartest setup. This supersedes proposed tight pouch reveals and ad-style closing cards. Additional generation and integration paused while the team defines the website-native pilot. Nothing deployed; existing website remains unchanged.

Latest agreed team recommendation: [calm website video pilot](ai-video-website-team-plan-2026-09-21.md). One wide packaging-led scene after the catalog, separately composed mobile version, poster-first playback. This supersedes portrait-ad reveals/end cards. Next: a reviewed scene composition and one restrained pilot; no deployment.


## Authorized storefront release

Owner subsequently requested the existing three videos be placed in the store and QA performed. Gallery is deployed on https://thecandyrama.com after the product lineup. See [release and QA record](video-gallery-release-qa-2026-09-21.md). This supersedes earlier no-deploy status for the scoped gallery. The new calmer wide scene is still a future concept.
