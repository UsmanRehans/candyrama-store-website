# Brand voice source record — September 13, 2026

Lauren read the live public pages below using HTTP GET and extracted visible HTML text (script/style content excluded). Each returned HTTP 200. The web browsing tool rejected the hostname as unsafe to open; ordinary direct HTTP retrieval succeeded. This is a dated editorial extraction, not a visual browser audit, full archive, or verification of product claims.

| Live source | Observed voice / content |
| --- | --- |
| [Homepage](https://candyrama-store.vercel.app/) | Bold main-character hero, clipped candy category names, direct craving invitation, playful four-bag offer, social candy story, high-energy footer. Products displayed as coming soon. |
| [About](https://candyrama-store.vercel.app/about) | Friendly Texas persona, social sharing occasions, sensory flavor contrasts, anti-corporate workshop narrative. The narrative’s manufacturing assertions are not independently substantiated. |
| [Rainbow Sour Mix](https://candyrama-store.vercel.app/product/rainbow-sour-mix) | Names candy forms and zing; conversational stash language; options and coming-soon status. |
| [Chamoy Heatwave](https://candyrama-store.vercel.app/product/chamoy-heatwave) | Compact sweet-fruit/chili-lime sensory description; shared template wording and coming-soon status. |
| [Blue Raspberry Blast](https://candyrama-store.vercel.app/product/blue-raspberry-blast) | Electric color/flavor phrasing and puckery finish; shared template wording and coming-soon status. |

All three product URLs and About were present in the retrieved homepage link list. The requested task is editorial voice capture; the snapshot does not make prices, stock, pack sizes, or label statements approved for reuse.

## Live versus local source

Local `app/page.tsx` matches the principal live hero, craving invitation, four-bag promotion, and story wording. Local additionally contains a three-product photo strip with short sensory labels that did not appear in the extracted live homepage. Treat that strip as local-only observed copy, not evidence of deployment. The live source includes a numbered four-position box treatment while local source has four product image positions; presentation differences require visual inspection if relevant.

Local `app/about/page.tsx` matches the live narrative sections in the extracted text. Local `app/product/[slug]/page.tsx` supplies common packing/stash and ingredient disclaimer wording; product descriptions are loaded through the catalog. A local template match does not independently validate the database facts or Amazon product mapping.

## Owner decisions kept separate

The owner wants the established voice preserved and read by Lauren for image/page QA. Earlier owner direction keeps candy/taste central, retains pink packaging, and rejects a rebrand-led campaign. Latest owner packaging correction calls for a smooth, professionally filled pouch while retaining its identity. These directions govern new work even where earlier copy/prompts differ.

## Claim caution

The live homepage and About contain origin/manufacturing and workshop claims. The homepage also carries promotional and popularity labels. The team must preserve the confident writing style without automatically adopting those factual claims. Published website copy is the source for tone, not substantiation.
