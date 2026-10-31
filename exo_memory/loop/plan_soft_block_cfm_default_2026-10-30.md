# The soft road's CFM: a quarter of today's value as the exporter's default, on the keeper's named yes. Librarian, 2026-10-30 19:3x

## What the night measured (the record, not a summary of it: `exo_memory/handback/p-d563-wheel-under-O_2026-10-30.md`, sections C07, C11, C09 again, C00 at 19:04, STIFF)

- Seven helix passes on ELYSIUM's shipped soft block (`SOFT_CFM 0.0002`, `MAX_DEPTH 4`, `SOFT_ERP 0.8`), four cars: five held, two went through. Load, speed, depth and position on the bank do not separate them; the chassis box's sinking rate as it crosses −11 cm does: the holds ≤ 0.63 m/s, the breaks 1.66 and 1.96 m/s. A break is followed by a throw out the underside of about 125 g.
- The same GRX on the same road with `SOFT_CFM 0.00005` (O's D525 variant B, installed tonight as ELYSIUM GATES STIFF): 64.88 g for 1.54 s at ≥ 55 g, harder and longer than its break, with the box 4.5–5.4 cm OVER the mesh the whole time and h flat at −17.5 cm. Neither registered falsifier fired. One pass, one car.
- The box-under ride (the Hangul's 15 cm settle and the yaw as it came out) does not occur when the box never enters the mesh; on this pass it did not.

## The decision, his

`src/export/trackfiles.js` SOFT_COLLISION_BLOCK's `SOFT_CFM=0.0002` is FINDINGS §4c's value, read from other authors' tracks, and the room's own text says the T-180 soft road is what lets these cars hold 60 g without a rigid bounce. Changing it changes the feel of every track the builder exports from then on, and his racing copy of ELYSIUM only if he re-exports or patches it. That is a named trade and needs his word on this item (memory `named-trade-needs-named-yes`). My recommendation: **yes, 0.00005 as the default**, with the shipped block's other keys unchanged, because the measured failure (two cars through the road and thrown) is worse than any feel cost seen on the one pass, and the keeper's own words on it were "it seemed to hold, I think we are onto something". What would change my mind: a STIFF pass that bounces or launches at the helix entry where the soft road did not, or a car that cannot hold 60 g on STIFF that held it on the soft road.

## If yes: Part 1 (pane E, PROVE IT: an exported data format)

- `trackfiles.js`: `SOFT_CFM=0.00005`, the header comment carrying the why (this file's path and the seven-pass record), FINDINGS' value kept in the comment as the measured origin. The fixtures' `surfaces.ini` change by that one line (named, not 0 of 9: the kn5 0 of 9, the ini one line each); the export harness whole; CHANGELOG one line in a player's words: "The road is firmer under a car at very high load: cars that used to sink through the surface in the hardest corners now stay on it."
- The Export dialog keeps no setting for it (one value, one road); the D525 variants remain as test tracks only.
- The checker's lines are unchanged: they were measured on the soft road and are conservative on a firmer one (the mesh is reached later, if at all); a re-measure of `chassisG` on STIFF is a later lap, not this one.

## If yes: Part 2 (his racing copy)

ELYSIUM itself: either he adopts ELYSIUM GATES STIFF as the copy he races (it is his export byte for byte plus the moved gate plus this value; its records start empty) or the next re-export of his Oct-22 document carries both. His call; nothing is installed over `t180b_elysium`.

## More passes, before or after, his choice

C11 (Matryoshka) and C09 (Hangul) on STIFF at their broken and ridden paces would take the evidence from one pass to three cars; the falsifiers stay as registered (a sink past −11 cm faster than 1 m/s; a plateau of −14 cm or deeper at 58–62 g).

surfaced: p-d563 (the seven passes, the separator, the STIFF section), p-d525-soft-O_2026-10-28.md:45 (variant B), trackfiles.js SOFT_COLLISION_BLOCK and its FINDINGS §4c comment, docs/research/04 (private store) for the key semantics, memory `named-trade-needs-named-yes`.
