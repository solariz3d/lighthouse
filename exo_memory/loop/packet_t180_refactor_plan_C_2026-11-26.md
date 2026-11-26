# Packet L248 (pane C, on L): the T-180 UI refactor, a spec draft and a real-page look

His word, 02:50: yes to planning the refactor ("we have tons of time and usage"). Before that, 02:37: "We defintelly
need to do a whole UI refactor, but keep all the plumbing." The research is
`research/clean_ui_design_sources_2026-11-26.md` (§0, §5, §6): use it, not memory.

## 1. A spec draft: `exo_memory/briefs/t180_ui_refactor_spec.md`
Cover the chrome only. The 3D overlay layer gets a section headed "ours, to measure", with the open questions listed.
- **One radius scale** on a Fluent-like ramp (2 under 32 px, 4 default, 8 large, 12 the ceiling for a floating panel),
  and each look picks a single factor (Radix's model). Write each look's factor and say why.
- **Concentric nesting:** an inner radius is the outer radius minus the padding.
- **Capsule rule:** at most one capsule in the whole UI (the standout action), or none.
- **Glass:** only on the control layer over the 3D view (Apple), with a fill thick enough for fine text.
- **Glow:** where it is allowed, and the budget.
- **Colour roles:** Radix's 12-step structure, mapped onto each look's existing palette.
- **What does not change:** list the plumbing files the refactor leaves alone (core, export, native side, panel logic).
  The refactor touches only CSS tokens, theme files and markup classes.

## 2. A look on the real page, CSS only
Apply the draft as a CSS override onto builder 0ab6cc8's real page in headless Chrome (no source edits). Screenshot each
of the six looks, before and after, in the same view: Coast Esses laid, a menu open, a dialog open if one is cheap to
open. Build one self-contained HTML page with before and after side by side per look (as L245's was). The librarian
publishes it.

## 3. His open calls, shown not asked
If it is cheap, show one look in two layouts: the panels docked as now, and floating over the view. He picks.
Density stays fixed unless the spec finds a reason.

Tier: research and a mock; no builder commit. Hand-back to the librarian, claims checked or inferred.
