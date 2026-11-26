# Packet: T-180, the sections five reference tracks have that the builder cannot lay (research lap), 2026-11-26, D

Librarian, at his word of 12:48 (verbatim in `briefs/t180_unmakeable_shapes.md`). Research and measurement only: no
builder code is changed in this lap, nothing is merged, installed or pushed to the builder.

## The rule on names and data (read first)

[T1] to [T5] are other authors' tracks. Their names, coordinates, meshes and equations stay out of every committed
file, in this repo and the builder's. The key and the reads are local: builder checkout
`Desktop/t180-track-builder/reads/` (gitignored), key `reads/reference_key_2026-11-26.local.md`. Hand-backs speak of
[T1]..[T5], section ranges in metres along the lap, and our own measured differences. Pictures stay local in your
evidence folder, uncommitted.

## Base

The builder at `landing-1126` **ceb21f5** (it carries the flowing bank, p-flow-ai 27e2084, and the piece ghost). Work
in your own worktree from it. The track-equations skill is in the builder repo, `.claude/skills/track-equations/`.

## Who takes which

| pane | track | note |
|---|---|---|
| A | [T1] | the abrupt 90s after the jump were worked on 10-09 (`loop/plan_t180_sharp_turns_2026-10-09.md`); re-measure, do not assume fixed |
| C | [T2] | |
| O | [T3] | O wrote the 11-24 smooth-bank plan; bring that knowledge, not its conclusions |
| P | [T4] | |
| E | [T5] | after E's File/Edit menu fix is handed back; [T5] has a read but no `.equation.json`: fit it with the skill first |

B is on the landing and the install; it does not take a track.

## What each pane does

1. **Sections.** Split the lap into sections where the shape changes class (curvature, bank, grade, width, anything the
   read carries). Use the read's own data; say how you cut.
2. **Lay each section the way he would.** Through what the builder's panel can send (the piece kinds, turn and extra
   turn, bank marks and flow, level, sharp, jump, lengths), driven headless through the same core calls the panel makes.
   Not hand-made core calls the panel cannot send. Where only the core can make it, say so: that is a panel gap, not a
   core gap, and it is a different fix.
3. **Compare** the built section with the read: position, heading, bank, grade/elevation, width, peak curvature, roll
   rate. **Name your tolerances before you measure**, with the reason (what he would feel or see). A section is
   "made" inside them.
4. **For each section not made:** the shape class in plain words; what blocks it (a refusal by name, a constant, a
   missing parameter, a joint rest, the adapter's re-rounding); **the routes you tried** (at least two forms: one
   piece, two pieces, extra rows, flow marks). A "cannot" is written only after the routes; before that it is "this
   form did not" (`librarian/2026-11-24.md`, 15:07, this seat's miss).
5. **Do not design the fix.** One line per class on where in the code the limit lives (file:line) is welcome; the plan
   comes after the five hand-backs are merged into one catalogue.

## The hand-back

`exo_memory/handback/p-unmakeable-<T#>-<letter>_2026-11-26.md`:
- a table: section (from m to m) · class · made? · worst difference against your tolerance · what blocks it · routes
  tried;
- the count: sections made / sections total, and the length of lap made / lap length;
- claims marked checked or inferred; your scripts named (kept in your scratch, uncommitted if they embed track data).
Ring the librarian with a pointer.

## Load and order

Headless only; never launch his app or the game. BelowNormal. Take the heavy-run lock only for a run that needs it,
and not while B's whole suite holds it unless your run is small. If he starts the game, keep working (his ruling,
`memory/work-goes-on-while-he-plays`), no frame-time figures meanwhile.

## After this lap (not in it)

The librarian merges the five tables into one catalogue of missing shape classes, ranked by how many sections and
tracks need each. One pane writes the plan per class (red-first rows, prove-it tier, mutation runs on touched core
files). Then the build laps, each its own branch; landing and release at his word.

## Falsifier, registered now

This lap failed if a class it names as "cannot" is later laid by a route the hand-back did not try, or if the merged
catalogue names fewer than one unmade class per track (his words: "there are points in each track that our system
cannot currently make") without a section-by-section table that shows it.
