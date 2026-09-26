# Impeccable for the Candy Rama team

Impeccable is our shared interface design toolkit. Use it for website and app design, implementation, and visual review; ordinary analytics, operational questions, and Amazon listing research do not require it.

## Start a relevant assignment

Read the current user brief, `docs/team/brand.md`, `docs/team/workflow.md`, and your role contract first. Then read `.agents/skills/impeccable/SKILL.md` and run `sh .agents/skills/impeccable/scripts/impeccable context` from the repository root once per session. Read only the command reference needed for the assignment. If the engine is unavailable, disclose that and read the project context directly; do not pretend a detector ran.

Use current source and `docs/candy-counter-handoff-review.md` to understand the existing storefront. The handoff is implementation history, not a source of verified product or legal claims. Preserve established Candy Counter styling on refinement tasks. An explicitly requested redesign may change the appearance within its requested scope. Do not apply storefront styling to admin or Amazon demo surfaces without a relevant brief.

## Responsibility map

| Employee | Use of Impeccable |
| --- | --- |
| Cando | Scope the assignment, choose relevant specialists, use critique to prioritize specific problems, and resolve conflicts against the owner brief and evidence. |
| Vita | Own visual direction, shape, layout, typeset, colorize, and polish; inspect actual renders and product imagery. |
| Theo | Implement the design; use adapt, harden, optimize, and audit for responsive behavior, accessibility, interaction states, and performance. Read installed Next.js guides before code changes. |
| Lauren | Use clarify and editorial critique for readable, useful, on-brand interface copy; call Avery when analytical research is needed. |
| Nico | Review onboarding, cart, account, empty/error states, and customer expectations with onboard and harden; verify operational facts separately. |
| Avery | Define measurable hypotheses and evaluate evidence; use critique findings as hypotheses, never as proof of conversion lift. |
| Miles | Apply hierarchy and readability guidance to relevant Amazon creative previews; independently verify Amazon specifications and merchandising claims. |

## Team quality gates

Use actual subagents for useful independent assignments under the existing workflow, not all employees for every edit. Pass this guide and the relevant command reference along with the brief. Impeccable's bundled specialist agents supplement these roles; they do not replace Cando or Vita's mandatory image review.

Vita reviews exact prompts and references before every image-generation/edit call and visually reviews every output before use. Use the platform image-generation tool for raster edits. Preserve packaging identity, honest product proportions, and consistent image framing. Never invent product photography or claim source accuracy from a generated concept.

Theo verifies relevant pages at phone, tablet, and desktop widths, including menus, filters, product options, and cart states affected by the change. Check overflow and touch usability in actual rendered output. Lauren verifies claims with appropriate evidence. Separate visual quality, technical correctness, and commercial readiness in reports.

Impeccable guidance is subordinate to the user brief and established project requirements. Do not auto-rebrand, invent business facts, broaden a small task, change commerce settings, publish, or send external messages just because a command suggests it. Existing task authorization still applies; no extra owner approval is needed for authorized work.

## Installation and maintenance

Upstream: https://github.com/pbakaus/impeccable

Installed skill version: 4.3.1; native engine version: 0.1.5; pinned source commit `2149fcce39a90bb409df5f16515f316a76dc6199`.

The upstream skill content is vendored unchanged (with its Apache-2.0 license and executable launcher permission restored) at `.agents/skills/impeccable/`; keep Candy Rama adaptations in this guide. The seven repository and personal employee entry points read the canonical shared workflow, so this integration applies to both. New sessions discover the repository skill automatically.

The launcher downloads the versioned native engine into the user cache and checks its SHA-256 sidecar before execution. Run `sh .agents/skills/impeccable/scripts/impeccable engine-probe` to verify engine availability and `context` to inspect loaded context. Review upstream changes before upgrading and rerun validation afterward.

Optional edit hooks require Codex platform approval through `/hooks` when installed. The skill works through explicit commands without hooks. After finishing changed web UI, Theo runs `.agents/skills/impeccable/scripts/impeccable detect --json <changed targets>` once and triages findings against the brief and actual render. Do not report automatic hook coverage when hooks are inactive. Live editing helpers and their source injection are optional and must be scoped to a future live-editing request; do not alter production CSP for this installation. Product/design initialization and persistent build-path choices remain separate from installing the toolkit.
