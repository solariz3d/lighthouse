# Brief: T-180, two shapes to reach: the banked S in one section, and the wall hairpin

Written 2026-11-10 (D) by the librarian. Nothing here is built yet. It is the next lap after D650.

## His words (verbatim; newest last; all 2026-11-10, on D, to the librarian)

Three track names in his sentences are other authors' tracks. Their names stay out of this public repo, so each is replaced by a
bracketed stand-in and nothing else in the sentence is changed. He knows which they are; ask him, or see the pictures.

- 16:32, with a picture (`t180_banked_s_reference_2026-11-10.png`, his red arrows on the two turns): "also analyze this image and look
  at [reference track A]s first turn, do you see how its like two 90s together, but the banking levels out before banking into the next
  one, effectively being 4 banking changes in the one section in quick succesion, can we do this?"
- 16:35: "also one piece i knew we couldnt make, dont have a screen shot, but you will see it, go to [reference track B], or even the
  top of [reference track C], the upside U turn variations, the best one in my head is the [reference track B] one, its like a Inverted
  U you drive on like a wall and its a hairpin, you know? Look at [reference track B] and find the inverted U wall turn hairpin"
- 16:37: "find the highest point and thats where the turn is on [reference track C]"
- 16:38, when the librarian said no read of it existed: "The [reference track C], there has to be, we have recordings" (he was right:
  a read from 2026-09-28 was on D's Desktop).

Earlier the same day, the two limits he hit on the way to these shapes (both fixed; `briefs/t180_second_bank.md` has them):
- 13:56, picture `t180_extra_turn_held_2026-11-10.png`: the extra turn stopped near 2.64° on a 125 m −90° piece.
- 15:42, picture `t180_extra_bank_held_2026-11-10.png`: "it jumps to -5 degrees and then stops", on the extra bank.

## The problem, in one line
He wants to build, by hand in the builder, two shapes real T-180 tracks have: an S whose bank goes in, level, the other way, level
inside one short section; and a hairpin made by riding up and over an arch on a steeply banked wall.

## What the shapes are (measured by the librarian from existing local reads; coarse numbers only, no layout)

**The banked S** (from his picture): a right turn banked into the turn, the road levels, a left turn banked the other way, level
again. Four bank changes after level: in, level, the other way, level.

**The wall hairpin on reference track B**: about 13.3 km into its lap, the only stretch of that track whose centre is banked 60° or
more. About 300 m end to end.
- Run-in, about 130 m: climbs to about 46° of pitch while rolling to about 65° of bank.
- The top, about 80 m: pitch goes from about +46° to about −41°, the map heading turns about 100°, bank held near 65°.
- Run-out, about 100 m: comes down and unrolls.
- It rises about 85 m and turns about 140° on the map in all. Width 28 to 32 m.

**The wall hairpin on reference track C**: at that track's highest point (about 1,180 m above its lowest).
- Comes in banked about 40°.
- The climb, about 200 m: pitch up to about 78°, bank to 70–77°, rising about 170 m.
- The crest, about 120 m: pitch from about +78° to about −55°, bank about 95° (past vertical).
- Down at about −50°, bank easing back to about 40°. Width 30 to 43 m, widest at the crest.
- No map-turn figure: at that steepness the heading read from the forward vector jumps about.

So both hairpins are an arch ridden on a wall; most of the turn comes from going up and over.

The reads are on D only and are gitignored (they are other authors' layouts): the first in `Downloads/t180-track-builder/reads/`,
the second in `Desktop/t180-track-builder/reads/` and, re-read 2026-11-10, in `Downloads/t180-fresh/reads/`. On L, read them again
with the track-equations skill if the tracks are installed there.

## State (2026-11-10 17:4x, D): not started

What the builder can and cannot do today, t180 main `3b33b38`:
- The core takes a list of changes per field. One node run laid a 600 m piece with turn −90°, an extra turn +90° at 300 m and three
  extra bank changes at 150, 300 and 450 m. Its bank control points read max 2.5° and min −22.5° where about +20° and −20° were
  expected, so **the shape is not confirmed**; read the bank along the built road before believing it.
- The panel gives ONE extra handle per field. That is his own word of 2026-11-05 (`app/core/panel.js`, the comment at "ONE extra
  handle per field": "perhaps we should only do two per action on the piece … until we figure out how to make it work right").
- As two pieces the S is close today: each half is a 90° turn whose extra bank brings it back to level, which D649 and D650 freed.
- The wall hairpin has not been tried in the builder. No claim that it can or cannot be made.

## The next lap (planned, not dispatched; one pane, prove-it tier)
1. Prove the four-change bank in one piece on the BUILT road (the bank read along the road, not the control points).
2. Let the panel carry more than one extra per field, so the changes can be added by hand. This moves his 11-05 limit: tell him.
3. Lay each wall hairpin from the numbers above through the core, headless, and report every refusal by name. Do not fit the other
   authors' layouts; use the coarse numbers.
4. The drag-cost cache from D650 (below), with a row that asserts it.

## Open, his calls
- Quick banks on a STRAIGHT road, the same way as the bank before: still refused, because the builder of the road mesh smooths a
  fast roll back (his 2026-11-05 "we dont want the bumps" ruling, living in the adapter's bank plan). Freeing it changes how the road
  is built.
- More than one extra per field in the panel (item 2 above).
