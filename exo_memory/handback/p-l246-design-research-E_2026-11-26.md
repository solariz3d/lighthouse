# L246 hand-back (pane E, on L): clean-UI design sources for the T-180 builder

Packet: `exo_memory/loop/packet_t180_design_research_E_2026-11-26.md` (1418cfa6, amended at 5bd7b3da). Tier: research
only. No builder file was changed, and builder 0ab6cc8 was read only. Seat: pane E, sibling-07b8a48f.

**The deliverable:** `exo_memory/research/clean_ui_design_sources_2026-11-26.md`. Read its §0 first. It ends with the
two sections the packet asks for: §5 "Against our six looks" and §6 "What a refactor would rest on".

## Findings, each marked

- **I refuse "rounded = cheap" in general.** checked: Fluent 2 shapes, Carbon's v12 migration note and token file,
  Apple's WWDC25 session 356, Primer's radius file. Every one rounds; Carbon is moving to rounded corners in v12.
  reader: the perception papers say curved shapes are preferred and read as warm, angular ones as competent. None says
  cheap.
- **What the sources do support is narrower, and it matches his eye:**
  - radius too large for the element on a dense desktop tool. checked: Apple, "in dense desktop environments, they're
    best used for standout actions"; Fluent, 2 px under 32 px. reader: Material 3, no large corners on dense parts;
  - nested radii that ignore padding. checked: Apple and Vercel; reader: Material 3.

  The four looks he called cheap exceed every desktop ramp read; SIGIL and glass sit inside them. checked: §5.1's table,
  from the CSS at 0ab6cc8.
- **The packet had two wrong premises,** corrected in §7:
  - checked: Carbon is not square on purpose;
  - reader: Apple's HIG Layout page has no concentricity text.
- **Against our looks (§5), with lines.** Radii first:
  - capsule labels on 22 px windows (skyline and skyline-night 12, aqua 10, aurora 8);
  - aqua's pill buttons;
  - 16-18 px panels;
  - non-concentric menus;
  - up to 10 distinct radii in one look.

  Then glows: the mark-colour glow on the label windows, accent glows on controls, dialog halos, glowing headings.

  Then glass:
  - the column's blur is supported (Apple's control layer);
  - the sources argue against blur on the road labels. checked: Apple, "Don't use Liquid Glass in the content layer";
    inferred: that a road label is content-layer. This bears on L245's mock.

  A proposal: one shared radius scale and one factor per look (the Radix structure).
- **Refactor (§6):** base the chrome on four sources:
  - Fluent 2 for sizes and shapes (only its Shapes page was read);
  - Radix's token structure for six looks;
  - Apple's Materials for surfaces over the view;
  - FAA AC 25-11B for anything drawn on the 3D view.

  **The research is good enough for the chrome and not, alone, for the 3D overlay layer:** labels and handles on
  geometry, contrast over a moving picture, gizmos. That part would be ours, by measurement. Floating against docked
  panels is his choice, because the sources disagree (Figma reversed floating panels; Apple builds on them).

## How the sources were read

Four reader subagents opened the pages. I re-fetched the load-bearing quotes and token values with curl and matched them;
those carry [checked] in the file. The rest carry [reader]: rendered-only sites, Material 3, Geist, Atlassian and Cloud
Four. The radius and glow counts are CSS declarations from `scratchpad/l246/count.js`, not C's rendered counts.

## Corrections to myself

- A first regex counted glass's `backdrop-filter: none` as a blur. Glass has 2 blur declarations, not 3; the file
  doesn't use the count.
- Two line numbers in a first draft were fixed before commit: skyline's column blur is `:71`, aqua's dock is `:121`.

NEXT: librarian, read §0, §5 and §6 and carry them to him; his read decides the radius and glow changes for pane A
and whether the refactor is planned.
