# Packet (on L; a planner, and a second pane for the mock if the chair splits it): Sculpt makes a stretch even. A plan and a mock; no build

**His words** are in `briefs/t180_sculpt_even.md` (04:59, verbatim, whole). Read them there before anything else. The
librarian's reading, told to him: with Sculpt he can push one spot, and nothing lets him bring a whole turn to the same
width (or bank, or cup), so a stretch shaped by hand looks scuffed. He asks for "some form of snap to a position to make
the surfaces even".

## What is on disk: do not work it out again

- The brief's "State" section: the brush is one bump (`src/core/sculpt.js:1-2`); a selected run only places the bump
  (`app/core/coreshell.js:535`, and the note at `:532`); Smooth is a relax (`sculpt.js:336`); no tool sets a run to a value.
- `handback/p-l260-sculpt-carry-A_2026-11-27.md`, "For a refactor of Sculpt": where one rule is decided in five places.
- Earlier Sculpt laps, for what was tried and why: `handback/p-d519-part2-C_2026-10-28.md`, `p-d520-follow-C_2026-10-28.md`,
  `p-d522-oneside-C_2026-10-28.md`, `p-d465-smooth-C_2026-10-25.md` (Track ▸ Smooth ramps), `loop/plan_t180_smooth_banked_turns_2026-11-24.md`.

## The plan says

1. **His example, measured first.** A turn of several pieces at one width; the Width tool dragged at its outer edge by hand,
   then every attempt to even it with the tools that exist (a wider brush, a selected run, Smooth). Give the width along the
   turn as numbers after each, and the unevenness left (its spread over the turn). That is the baseline a fix is scored against.
2. **Ways to make a stretch even,** each with what he does, what the road becomes, and what it costs to build. At least:
   - a selected run changes by the SAME amount along its whole length, with a ramp only at its two ends (a flat-topped
     window instead of a bump);
   - a selected run is brought TO a value: typed, or taken from one spot he points at ("make it all like here");
   - a drag that snaps to steps (say 0.5 m of width, 1° of bank) and shows the value while he drags.
   Say which of these answers his words, and which he did not ask for.
3. **The ends.** How the even stretch meets the road either side (the ramp's length and shape, the joint staying smooth),
   and what happens on a closed lap and at the open end.
4. **Which settings:** width first (his example); say whether bank, cup, the edges and the right width take the same tool
   unchanged, and what a route tool (Bend, Climb) would mean by "even".
5. **Sources.** How other editors solve it (a level or flatten brush in terrain tools; a constant falloff or a set-value
   over a selection in modelling and spline tools). Read them; cite only what was opened. No name of his, no word of his
   and no project name in a search.
6. **A registered test, before any build:** the number from item 1 that a fix must reach on his example, and what result
   would mean the tool did not fix it.
7. **A mock for his eye:** the real page, his example before and after, marked "mock · not built", in one look. Pictures
   stay uncommitted, in the hand-back's evidence folder.
8. **His calls,** listed, not decided. Rows and tier for the build, as an estimate.

Base: builder `landing-1127-l263` c522ea6. No build, branch, install or release. Hand-back to the librarian by
`call_librarian`, claims marked checked or inferred.
