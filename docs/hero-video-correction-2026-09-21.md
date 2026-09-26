# Hero-only correction

Owner rejected the after-catalog gallery and explicitly identified the hero/banner beneath navigation as the only AI video placement. Rollback completed to production deployment dpl_BpXk2BSdzLcTZqdEyapexVT1veXg. Gallery source/styles/public copies removed; original studies archived.

Inspected Rich & Richer live in browser: /video/Hero.mp4 is a 10.005-second muted looping full hero background with HTML content above. Frames show packaged candy shelves then bed/bath products. Only ambient presentation is relevant to Candy Rama, not their palette, content or layout.

Vita inspected existing packaging source images and accepted an exact background-only prompt to retain the three existing hero pouches and all lettering. First new Kling3 job 7875e859-a5e0-45cd-bed4-3c7b92c655b7 (preflight estimate: 12 credits) was rejected after actual contact-sheet and in-page inspection: dark mustard color, hard window shadows, curtain edge and low color boundary. It is not approved for publication. Second revised prompt is job 48ab1141-9be9-4ed4-9566-86226490e863.

Implementation adds one self-hosted silent video behind existing hero art, a keyboard-operable pause button and small AI-created background label. Existing CSS artwork remains initial/error/reduced-motion fallback. Reduced-motion preference gates automatic source loading; explicit playback is allowed. Offscreen/hidden-tab playback pauses, and manual pause is retained. Theo reviewed and fixed asynchronous playback state. TypeScript and targeted lint passed.

Browser QA caught ancestor overflow:hidden scroll-position movement when a focused pause button was resized to mobile. Hero overflow changed to clip to avoid internal programmatic scrolling while preserving bounds. Final media and final responsive verification pending.

Balance after both new submissions: 191 credits. This differs from the earlier estimate-based accounting; preserve observed balance rather than assert a per-job debit from estimate alone.


## Final acceptance

Vita independently viewed revision2 contact sheet and accepted it for adjusted compositing. Final video remaps wall406px→450px and floor314px→270px at1280×720, cropping16px side edges, with40% opacity over original exact brand gradient. Export is silent H264,8.042seconds,431KB approximately.

Independent Vita browser inventory remained empty. Root therefore explicitly performed final Vita-role review of actual browser screenshots at390×844 and1280×800: ACCEPT for the scoped ambient hero use. Bright yellow/pink, sharp unchanged package artwork, readable HTML headline/CTA, no gallery or new page section. This is not an independent final screenshot approval.

Build/TypeScript and Theo targeted lint passed. Browser pause and keyboard replay verified; actual revised motion viewed on mobile/desktop. Overflow clipping fix preserves headline when resizing focused controls. System reduced-motion change and simulated network failure were code-reviewed, not browser-injected. No checkout/order submission required for this visual-only scope.


## Hero-only release completed

Deployment `dpl_2oKTf23edFVvGuwVLoTiyNHwBtMu` built successfully and was explicitly promoted after the rollback to https://thecandyrama.com. Live browser shows only the original hero with the new soft AI background and unchanged pouch overlays, followed immediately by the catalog. No gallery. Live video range request returned206,video/mp4,430816bytes total. Final live screenshot reviewed. Manual pause remained paused after scrolling away/back in local final build. See [hero correction record](hero-video-correction-2026-09-21.md) for review and test limits.


## Full scene refinement

Owner requested packages physically within the filmed scene and native softer colors, superseding the background-only blend. Owner also explicitly rejected foreground loose candy pile; removed from source. Vita reviewed current three pink pouch references and exact fullscene prompt. MiniMax H3 job e0696585-1907-47e8-96b5-47cd88be2c87,8seconds16:9,3image references. Cost estimate endpoint rejected model while model catalog and generate endpoint supported it; generation submitted once successfully. Observed balance afterward175 (previous191).

Theo implemented full scene/poster at full opacity with no page pouch overlays or saturated gradient. Mobile contains entire16:9 footage below heading/CTA. Media acceptance and deployment pending.


## Full scene final acceptance and QA

Vita inspected full first/last frames and8-frame contact: ACCEPT fullscene promotional use. Center wordmark/ribbon readable, correct three candy identities, natural grounding, no loosecandy. Normal side-pouch overlap accepted; this remains AI promotional artwork, not exact product photography. Desktop export1280×560 extends a narrow native left scene edge for quiet copy space and retains original bannerheight; mobile retains full1600×900 film beneath copy. No separate pouch elements or CSSsaturation blend.

Root browser review1280desktop and390phone: accepted framing and contrast, zero loosepile/pouch DOMoverlays, nohorizontaloverflow. Actual8second playback and mobile source switch verified; manual pause persisted through resize and keyboardreplay worked. Build,TypeScript,targetedlint pass. Fullsystem reducedmotion and syntheticfailure remain code-reviewed notbrowserinjected.

Companion graphic completed with actual Vita+Lauren collaboration; see candy-drama-graphic-2026-09-21.md. Saved transparent PNG forreuse, no newhomepagegraphicplacement.


Fullscene release published as dpl_GKfwZoN9BAfBJUxLVCMVND17NtFP to https://thecandyrama.com. Cloudbuild succeeded; livebrowser verified full packaging scene, soft nativecolors, noforegroundpile. Both desktop/mobileMP4 range requests returned206/video/mp4. Graphic remains reusable asset at public/brand/illustrations/candy-drama-sticker.png; no extra section added.
