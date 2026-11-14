# Packet for pane B: the dark patch in a floor (item 226), and the hall he called cool (item 224)

Written by the librarian on D, 2026-11-14 13:3x, while every run is paused at his word of 13:22
(`briefs/lighthouse_the_room.md:172`). **Nothing in this packet starts before the chair's resume.** At the resume B first
finishes the landing of `d676-filter-on-c` 8210cd4 (the suite again on a quiet machine, both world reds read); this packet
comes after it.

Tier: prove it (the generator's geometry: a fault here is in every world and nobody sees it until he does).

**SOURCE: what produces this, and what limits it.** The generator's solids for a room (`gen/src`), drawn as they are by the
renderer. What should have caught it is the row `no_solid_is_thin_or_overlaps_another` (`gen/tests/geometry_tests.cpp:79-121`,
read by me in his clone at e091beb). That row builds eight chunks round the origin (`build_block(gen, -1, -1, -1, 0, 0, 0)`,
`:83`). A chunk is 12 cells of 3 m (`gen/src/gen.h:24`, `:31`), so the row sees x and z from -36 m to 36 m. His patch is at
x = -43.85 m, in chunk -2 0 -1: **7.85 m outside what the row looks at.** Which seeds the row's cases cover is not read by me.

## His words (verbatim in `briefs/dreamzone2_the_game.md`, items 226 and 224)

- Item 226, 12:55, with a picture and a red ring round a dark block in a room: "also, to find the room for u to see the screen
  shot better which i couldnt do, look in the most recent run to see where i last died to precisly pin point down the exact
  area you will see the lighting bug right in the middle of the room from different angles"
- Item 224, 12:44, a picture with no words but its file name: "cool place in seed".
- On a stair bug, 11-12 (`loop/plan_l189_no_unintended_drops_2026-11-12.md:3`): "remember its not just fixing the one instance
  of it, but the proc gen itself that produces it"

## What is known, and by whom (`handback/p-d676-C_2026-11-14.md`, "Item 226", :52-98)

- **Checked by pane C:** his run `run-20261114-185333` (seed 5, brutal, build e091beb) replayed and held at 11.00 s. He stands
  at (-42.36, 0, -5.53). The centre of his view meets the floor at (-43.85, 0, -1.74). The patch is there with the noise fix
  off and on, with the flashlight off, and with his body not drawn. From cameras placed round it, it lies flat at floor height.
- **Looked at by me:** C's pictures 3, 4 and 6. The patch is about one cell across (my reading of picture 4, not measured).
- **Inferred by C, not traced:** two surfaces in the same plane. Its dark streaks run straight across the screen from every
  camera.
- **Not known:** which surfaces; whether they are generator solids at all; how often it happens.

## The steps, in order

**R0, read before building anything.** List every solid of that world within 2 m of (-43.85, 0, -1.74) in x and z and within
0.2 m of the floor in height: kind, material, lo, hi, chunk, and the generator rule that emitted it. Use the world his run
used (its record carries the seed, the level and the settings). Say in one line what the two surfaces are, or that there is
only one solid there.

**R1, red first, on the row that exists.** Ask `no_solid_is_thin_or_overlaps_another` of his world and of a block of chunks
that holds chunk -2 0 -1.
- **If it is red at that spot:** two solids share volume there. Go on to R2.
- **If it is green:** C's inference does not hold in the form "two generator solids". Stop and ring with what R0 listed and
  what else is drawn at floor height there (the world layer, the renderer's own list). No fix is written on a guess.

**R2, the count, before the fix.** The same check over more seeds and over blocks away from the origin: how many overlaps a
world, by pair of kinds. Before the run, B writes down the number it expects and which outcome it would not want.

**R3, the fix, at the rule that emits the second solid,** not at this room. And the row's sweep is widened for good so it
also sees a block away from the origin. Name what the wider sweep costs in test time.

**R4, mutants.** With the fix reverted the row is red. The widened sweep's bounds each have a mutant.

**R5, what else moved.** A solid removed or moved can change what a run collides with. Print the 12-seed fingerprint and
replay his kept runs on the fix, and name every run that no longer replays the same, with its reason. A change there is a
finding to report, not to hide.

**R6, for his eye.** The same held view of his run (C's capture, 11.00 s), before and after, on a build that has the noise
fix as landed. Two pictures. Taken only when Star Citizen is not on the card, or as settled pictures with no timing read.

## Item 224, in the same wake, read only

His hall is in `run-20261114-184242.txt` (seed 1, brutal): at 102.5 s he stood at (-381.8, 3.5, 280.4), on the level 3.5 m
up (replayed by me at 12:5x; both fingerprints matched). **Which piece of the generator made that hall:** the biome, the rule
or template, its parameters, and how many times a world of that size gets one. One paragraph and the rule's name. It is the
first place of the generated world he has pointed at and called cool (his item 179: "cool pathways with intent mixed into the
randomness"); the count is what a later lap would turn up. No change is made here.

## Registered before the run

- **This lap is wrong if,** after the fix, the patch is still in the held view of his run; or if R2's count is not zero on
  the fixed generator while the row is green.
- **The unwelcome outcome, named now:** R1 is green on his chunk. Then the cause is not where this packet looked, and the
  packet is rewritten from R0's list.

## Rules that hold

- Work in a tree on G:, never in his clone. His run files are copied, not opened for writing.
- No frame-time figure is taken while a game of his runs.
- The lander is named by the chair; B does not land its own fix.
- The hand-back: one file under `exo_memory/handback/`, its digest in the ring with the function named, a `BASE:` line for
  each repository changed, and a map line.
