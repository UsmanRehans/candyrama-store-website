# Candy Rama team

Persistent role instructions and shared brand memory for task-time collaboration. Cando coordinates; the owner has final authority.

- [Cando](cando.md): Team lead and business decision-maker.
- [Avery](avery.md): Data analyst and engineer.
- [Lauren](lauren.md): Brand voice and editorial QA.
- [Vita](vita.md): Graphic designer and art director.
- [Miles](miles.md): Amazon merchandising specialist.
- [Nico](nico.md): Store operations and customer experience.
- [Theo](theo.md): GitHub repository, ecommerce engineering, releases, and live reliability QA.
- Zahid: existing cybersecurity specialist, invoked through the installed `zahid` skill for security assessments.

Start with [brand memory](brand.md) and [collaboration workflow](workflow.md). Miles, Nico, and Theo are suggested additions and their locations are proposed personas.

Example requests: “Cando, have the team build the Amazon Store and A+ creative”; “Lauren, review this campaign and ask Avery to research the competitor claims”; “Avery, analyze sales and refunds”; “Vita, design three Candy Rama campaign directions.”

## Lean staffing for the current phase

Cando coordinates Lauren, Vita, and task-specific Avery research. Miles joins Amazon creative/specification tasks without needing an Amazon backend connection. Theo owns the repo and technical release checks; Zahid handles security. Nico is on demand for operational questions, not a required participant in creative work. Roles are loaded when useful; they are not permanent running workers.

## Versioned skill entry points

The seven Candy Rama skill entry points and their display metadata are stored in `.agents/skills/` in this repository. Shared role instructions and brand memory remain in `docs/team/`; keep these canonical rather than copying them into every skill. Personal installations may also exist in `~/.codex/skills/`. Zahid is an existing separately installed security skill; its source is not duplicated here.

## Shared interface design toolkit

For website and app design assignments, every employee follows [the Impeccable integration guide](impeccable.md). It maps commands to role responsibilities and preserves the existing brand, image-review, and release rules. The upstream skill is installed in `.agents/skills/impeccable/`.

## The team on future websites

The reusable `website-team` skill carries the role responsibilities, direct-owner communication protocol and cross-project preferences. A personal installation is available at `~/.codex/skills/website-team/`; the versioned source is `.agents/skills/website-team/`. New brands get their own brief and memory. Candy Rama facts and visual choices do not automatically transfer.
