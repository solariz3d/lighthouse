# Hand-back: [T1], the shapes the T-180 builder cannot make yet (pane A, 2026-11-26, written 19:52Z)

Packet: `exo_memory/loop/packet_t180_unmakeable_shapes_2026-11-26.md` (chair D677), plus the chair's addendum of 19:33Z
(the simplest route per made section, its piece count, STEERED, and the counts by hand against by steering).
Research only. No builder code changed and nothing was merged, installed or pushed. Base: builder `landing-1126` ceb21f5,
in my own detached worktree `G:/consonance-scratch/a-t1-unmake`.

On names and data: this file speaks of [T1], metres along the lap, and our own measured differences. The read, its key
and every script that opens it stay local in `G:/consonance-scratch/a-t1-scratch/` (uncommitted).

## The counts

    checked: node final.js (in the scratch folder), first line → sections 96; made 73 (by hand 39, steered only 34);
             length made 7778 of 9162 m (by hand 1995 m)

- **Sections made: 73 / 96.** That is 95 road sections plus the jump. Length made: **7,778 m / 9,162 m** (85%).
- **By hand: 39 sections, 1,995 m.** Each has one set of values read off the reference and typed, with no measuring
  against it.
- **Only by steering: 34 sections, 5,783 m.** The figure is 7,778 − 1,995 (inferred arithmetic, from the two checked
  figures above).
- **Not made: 23 sections, 1,384 m.**

Read the hand/steered split the way [T3]'s is read. Almost every long corner on this lap was made only by STEERED rate
pieces. Every steeply banked 30–45° corner that was made, but one (3040–3120), is in that group, as are every banked S and the full roll.
What is made by hand is mostly the straights, the short links between corners, the jump and two corners (3040–3120, and
the post-jump 90° at 5563–5714).

## What "by hand" and STEERED mean here

- **By hand** (no measure, no undo):
  - one corner piece: turn and climb in exact degrees, with the bank, width and cup at the exit;
  - one piece plus extra turn/climb/bank rows;
  - **typed-rate pieces**: the reference's average turn and climb over each piece, typed once as rates;
  - the jump: Extend, then Jump with turn and climb as a rate, with the landing pose typed into its boxes.
- **STEERED, the solved-rate pieces.** Each piece's turn and climb are found by laying it, reading the built head's
  heading and pitch, undoing, and re-laying it (a secant, 3 to 8 rounds). Each piece is also aimed back onto the
  reference's line by the offset measured at its start. This is the measure, undo, re-lay loop of [T3]'s route column.
  No person would do it 15 times a corner.
- **Simplest route** is the first route that made the section, in this order: one corner piece; the same with the bank
  "early"; one piece with 1–3 extra row sets; Sharp; then rate pieces from the longest step (40 m) down to 10 m. For
  sections made only by steering, the typed-rate forms were tried after that (40/30/20/15/10 m, and 20 m with bank marks
  every 10 m). That second pass is `handpass.js`.

## The tolerances (registered before measuring: `TOLERANCES.md` in the scratch folder)

| measure | bar |
|---|---|
| position | p95 3 m, max 5 m |
| exit heading | 2° |
| bank p95 | 5° |
| pitch p95 | 2° |
| width p95 | 2 m |
| cup p95 | 5° |
| peak turn rate | within 20% (only where the reference's peak is above 30°/100 m) |
| peak roll rate | within 30% or 0.15°/m (only where the reference's peak is above 0.3°/m) |

The amendments and corrections that followed are in the same file, each with its reason. None of them changed a bar.

1. **Amendment 1.** The reference's width is taken as its median over ±3 stations. Its cupped-road width jitters 2–4 m
   from one station to the next.
2. **Amendment 2.** For matching only, the built line is extended 20 m along its end tangent. Without it, a road a few
   metres short read as a position spike at the last station.
3. **Correction 3** (my bug). The compare now uses the same truncated estimator on both sides at the section's ends.
4. **Correction 4** (my bug, found 19:15Z). Pieces are now laid at the length along the reference's centre, not its
   walked distance, which is 2–6% shorter on banked turns. Every section was re-run after this.
5. **Amendment 5.** Registered *after* the switchback zone was measured: there, junction rows are also left out of
   position and pitch. It changed no verdict, since the zone fails both ways (below).

**Noise check** (`jitter.js`): the reference's pitch jitter is at most 0.73° p95 on every section, so the pitch bar is
usable. Its heading jitter is over the 2° bar on two sections, 2128–2332 (2.04°) and 8774–8794 (2.9°), so the
exit-heading bar is unusable on those two. Neither section's verdict rests on exit heading.

**Two run variants, one compare.** The third full run made the steered solver aim at the reference's centred estimate,
where earlier it aimed at the section's own estimate, and it gave junction rows their neighbour's width. The compare was
not changed. A section counts as made if either aim made it:

- six sections were made only by the earlier aim: 0–184, 1940–2128, 6466–6490 (by hand), 6522–6686, 7750–8030, and
  5415–5439, which is now made by hand with typed-rate pieces;
- two were made only by the later aim: 3556–3771 and 4143–4239.

**The full roll (4239–5048).** These sections were laid both from a head wound to −360° and from zero. The two runs agree
except on 4239–4267, which the zero start made. The wound run's start pitch ignored its 240 m of pre-roll, which is my
artefact, so the made result stands.

## The table

The columns are section · class · made? · simplest route that made it (pieces), or the nearest form when not made ·
worst difference against its bar · what blocks it · routes tried. Each row is checked by `node final.js`, which writes
`table.local.json`. The rows were printed from it.

| section (m) | class | made? | simplest route (pieces) / nearest | worst vs bar | what blocks it | routes tried |
|---|---|---|---|---|---|---|
| 0–184 | straight | yes, STEERED | solved-rate pieces (solver aimed at the section-own estimate) every 40 m (5 pieces) | exit heading 1.1 ° (bar 2) |  | 28: one corner piece, one piece + extra rows, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 184–236 | short jog at a one-sided edge step (read or road: unresolved) | no | nearest: solved-rate pieces every 10 m, flow | width p95 2.2 m (bar 2) | the read's centre steps 2-2.5 m where one edge moves; width is symmetric with a 40 m change floor (extend.js:356) and the panel has no side-offset field (inferred) | 16: one corner piece, rate pieces, rate pieces + flow marks |
| 236–368 | banked S (bank changes side) | yes, STEERED | solved-rate pieces every 20 m (7 pieces) | exit heading 1.4 ° (bar 2) |  | 17: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 368–624 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 20 m, bank flow marks every 10 m (13 pieces) | pitch p95 1.9 ° (bar 2) |  | 23: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 624–880 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 40 m (7 pieces) | width p95 2.0 m (bar 2) |  | 15: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 880–1136 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 30 m (9 pieces) | width p95 2.0 m (bar 2) |  | 16: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 1136–1392 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 25 m (10 pieces) | pitch p95 1.5 ° (bar 2) |  | 24: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 1392–1648 | banked S (bank changes side) | yes, STEERED | solved-rate pieces every 30 m (9 pieces) | bank p95 4.1 ° (bar 5) |  | 16: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 1648–1772 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 10 m (13 pieces) | exit heading 2.0 ° (bar 2) |  | 19: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 1772–1788 | straight, banked | yes, by hand | one corner piece (1 piece) | exit heading 0.8 ° (bar 2) |  | 1: one corner piece |
| 1788–1940 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 15 m (11 pieces) | cup p95 3.4 ° (bar 5) |  | 18: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 1940–2128 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces (solver aimed at the section-own estimate) every 12 m (16 pieces) | pitch p95 2.0 ° (bar 2) |  | 31: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 2128–2332 | steeply banked corner (30-45°) | no | nearest: solved-rate pieces every 15 m | pitch p95 2.3 ° (bar 2) | no refusal on the nearest form; SHARP_TOO_TIGHT, BAD_SECOND on others | 24: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks |
| 2332–2368 | straight, banked | yes, STEERED | solved-rate pieces every 20 m (2 pieces) | cup p95 2.5 ° (bar 5) |  | 7: one corner piece, rate pieces, typed-rate pieces |
| 2368–2532 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 20 m (9 pieces) | pitch p95 1.3 ° (bar 2) |  | 16: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 2532–2552 | straight | yes, by hand | one corner piece (1 piece) | width p95 1.7 m (bar 2) |  | 1: one corner piece |
| 2552–2640 | banked corner | yes, STEERED | solved-rate pieces every 25 m (4 pieces) | peak roll 0.44 vs 0.59 °/m (bar 0.18) |  | 21: one corner piece, one piece + extra rows, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 2640–2660 | straight, banked | yes, by hand | one corner piece (1 piece) | cup p95 2.8 ° (bar 5) |  | 1: one corner piece |
| 2660–2680 | short jog at a one-sided edge step (read or road: unresolved) | yes, by hand | one corner piece (1 piece) | width p95 1.9 m (bar 2) |  | 1: one corner piece |
| 2680–2696 | straight, banked | yes, by hand | one corner piece (1 piece) | peak roll 0.53 vs 0.70 °/m (bar 0.21) |  | 1: one corner piece |
| 2696–2936 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 20 m, bank flow marks every 10 m (12 pieces) | bank p95 4.1 ° (bar 5) |  | 23: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 2936–2952 | straight, banked | yes, by hand | one corner piece (1 piece) | bank p95 4.4 ° (bar 5) |  | 1: one corner piece |
| 2952–2988 | straight, banked | no | nearest: solved-rate pieces every 20 m, bank flow marks every 10 m | peak turn 22 vs 37 °/100 m (41%, bar 20%) | no refusal: this form did not | 11: one corner piece, rate pieces, rate pieces + flow marks |
| 2988–3040 | straight, banked | yes, by hand | typed-rate pieces every 10 m (5 pieces) | exit heading 1.7 ° (bar 2) |  | 8: one corner piece, rate pieces, typed-rate pieces |
| 3040–3120 | steeply banked corner (30-45°) | yes, by hand | one piece + 2 extra turn/climb/bank row sets (1 piece) | pitch p95 1.1 ° (bar 2) |  | 4: one corner piece, one piece + extra rows |
| 3120–3148 | straight, banked | yes, by hand | typed-rate pieces every 10 m (3 pieces) | exit heading 1.7 ° (bar 2) |  | 5: one corner piece, rate pieces, typed-rate pieces |
| 3148–3172 | short jog at a one-sided edge step (read or road: unresolved) | no | nearest: solved-rate pieces every 15 m | peak turn 15 vs 61 °/100 m (75%, bar 20%) | the read's centre steps 2-2.5 m where one edge moves; width is symmetric with a 40 m change floor (extend.js:356) and the panel has no side-offset field (inferred) | 8: one corner piece, rate pieces, rate pieces + flow marks |
| 3172–3188 | straight | yes, by hand | one corner piece (1 piece) | bank p95 2.9 ° (bar 5) |  | 1: one corner piece |
| 3188–3284 | straight | yes, by hand | typed-rate pieces every 20 m (5 pieces) | width p95 1.7 m (bar 2) |  | 11: one corner piece, one piece + extra rows, rate pieces, typed-rate pieces |
| 3284–3308 | short jog at a one-sided edge step (read or road: unresolved) | no | nearest: solved-rate pieces every 15 m | peak turn 19 vs 58 °/100 m (67%, bar 20%) | the read's centre steps 2-2.5 m where one edge moves; width is symmetric with a 40 m change floor (extend.js:356) and the panel has no side-offset field (inferred) | 8: one corner piece, rate pieces, rate pieces + flow marks |
| 3308–3436 | banked S (bank changes side) | yes, STEERED | solved-rate pieces every 15 m, steer gain 0.5 (9 pieces) | width p95 1.5 m (bar 2) |  | 27: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 3436–3556 | banked S (bank changes side) | yes, STEERED | solved-rate pieces every 15 m (8 pieces) | cup p95 4.5 ° (bar 5) |  | 18: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 3556–3771 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 12 m (18 pieces) | exit heading 2.0 ° (bar 2) |  | 25: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 3771–3819 | straight, banked | yes, by hand | one corner piece (1 piece) | exit heading 1.5 ° (bar 2) |  | 1: one corner piece |
| 3819–3891 | banked corner | no | nearest: solved-rate pieces every 15 m | exit heading 4.8 ° (bar 2) | no refusal on the nearest form; TURN_TOO_SHORT on others | 23: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks |
| 3891–3967 | flat corner | no | nearest: solved-rate pieces every 10 m | peak turn 50 vs 84 °/100 m (41%, bar 20%) | no refusal: this form did not | 21: one corner piece, one piece + extra rows, rate pieces, rate pieces + flow marks |
| 3967–4143 | the full roll over a crest (rolling through inverted while turning and climbing) | yes, STEERED | solved-rate pieces every 12 m (15 pieces) | exit heading 1.9 ° (bar 2) |  | 25: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 4143–4239 | the full roll over a crest (rolling through inverted while turning and climbing) | yes, STEERED | solved-rate pieces every 10 m (10 pieces) | exit heading 1.9 ° (bar 2) |  | 19: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 4239–4267 | banked road after the full roll (same surface as within one turn) | yes, STEERED | solved-rate pieces every 15 m (2 pieces) | pitch p95 1.3 ° (bar 2) |  | 13: one corner piece, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 4267–4471 | bank passing below -360° (past one full roll) | no | nearest: solved-rate pieces every 40 m, bank flow marks every 10 m | peak roll 5.12 vs 0.60 °/m (bar 0.18) | the panel sends a bank within one turn (panel.js:434 bankTarget, :475 secThen; the Twist brush coreshell.js:61): a target past -360 unwinds the roll | 24: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks |
| 4471–4503 | banked road after the full roll (same surface as within one turn) | yes, by hand | one corner piece (1 piece) | exit heading 1.6 ° (bar 2) |  | 1: one corner piece |
| 4503–4527 | banked road after the full roll (same surface as within one turn) | yes, by hand | typed-rate pieces every 15 m (2 pieces) | exit heading 1.8 ° (bar 2) |  | 4: one corner piece, rate pieces, typed-rate pieces |
| 4527–4551 | bank passing below -360° (past one full roll) | no | nearest: solved-rate pieces every 15 m, bank flow marks every 10 m, steer gain 0.5 | peak roll 5.69 vs 0.56 °/m (bar 0.17) | the panel sends a bank within one turn (panel.js:434 bankTarget, :475 secThen; the Twist brush coreshell.js:61): a target past -360 unwinds the roll | 8: one corner piece, rate pieces, rate pieces + flow marks |
| 4551–4579 | banked road after the full roll (same surface as within one turn) | yes, by hand | one corner piece (1 piece) | bank p95 4.6 ° (bar 5) |  | 1: one corner piece |
| 4579–4851 | banked road after the full roll (same surface as within one turn) | no | nearest: solved-rate pieces every 12 m | exit heading 15.8 ° (bar 2) | no refusal on the nearest form; BAD_SECOND on others | 23: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks |
| 4851–4871 | banked road after the full roll (same surface as within one turn) | no | nearest: solved-rate pieces every 10 m | peak roll 0.14 vs 0.32 °/m (bar 0.15) | no refusal: this form did not | 5: one corner piece, rate pieces |
| 4871–5027 | banked road after the full roll (same surface as within one turn) | yes, STEERED | solved-rate pieces every 30 m (5 pieces) | pitch p95 1.3 ° (bar 2) |  | 13: one corner piece, one piece + extra rows, rate pieces, typed-rate pieces |
| 5027–5048 | banked road after the full roll (same surface as within one turn) | yes, by hand | one corner piece (1 piece) | bank p95 3.2 ° (bar 5) |  | 1: one corner piece |
| 5048–5223 | jump (flight to a landing) | yes, by hand | Extend the take-off, Jump with turn & climb as rate, landing pose typed in the boxes (2 pieces) | landing pose within 0.01 of the read; take-off pitch 7.53 vs 7.52° |  | 1: jump |
| 5223–5415 | straight | yes, by hand | one piece + 3 extra turn/climb/bank row sets (1 piece) | pitch p95 1.3 ° (bar 2) |  | 5: one corner piece, one piece + extra rows |
| 5415–5439 | straight | yes, by hand | typed-rate pieces every 15 m (2 pieces) | exit heading 1.3 ° (bar 2) |  | 10: one corner piece, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 5439–5535 | abrupt banked 90° after the jump | yes, STEERED | solved-rate pieces every 30 m (3 pieces) | bank p95 3.9 ° (bar 5) |  | 16: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 5535–5563 | straight, banked | yes, by hand | one corner piece (1 piece) | bank p95 2.8 ° (bar 5) |  | 1: one corner piece |
| 5563–5714 | abrupt banked 90° after the jump | yes, by hand | one piece + 3 extra turn/climb/bank row sets (1 piece) | bank p95 5.0 ° (bar 5) |  | 5: one corner piece, one piece + extra rows |
| 5714–5758 | straight, banked | yes, by hand | one corner piece (1 piece) | exit heading 1.2 ° (bar 2) |  | 1: one corner piece |
| 5758–5774 | straight, banked | yes, by hand | one corner piece (1 piece) | bank p95 3.2 ° (bar 5) |  | 1: one corner piece |
| 5774–5818 | straight, banked | yes, by hand | one corner piece (1 piece) | width p95 1.8 m (bar 2) |  | 1: one corner piece |
| 5818–6006 | abrupt banked 90° after the jump | yes, STEERED | solved-rate pieces every 10 m (19 pieces) | bank p95 4.8 ° (bar 5) |  | 19: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 6006–6154 | abrupt banked 90° after the jump | yes, STEERED | solved-rate pieces every 25 m (6 pieces) | exit heading 1.3 ° (bar 2) |  | 24: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 6154–6170 | straight | yes, by hand | one corner piece (1 piece) | exit heading 1.3 ° (bar 2) |  | 1: one corner piece |
| 6170–6270 | straight, banked | yes, by hand | typed-rate pieces every 30 m (4 pieces) | pitch p95 1.9 ° (bar 2) |  | 9: one corner piece, one piece + extra rows, rate pieces, typed-rate pieces |
| 6270–6390 | abrupt banked 90° after the jump | yes, STEERED | solved-rate pieces every 20 m, bank flow marks every 10 m (6 pieces) | pitch p95 2.0 ° (bar 2) |  | 23: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 6390–6442 | short jog at a one-sided edge step (read or road: unresolved) | yes, by hand | typed-rate pieces every 30 m (2 pieces) | exit heading 1.7 ° (bar 2) |  | 4: one corner piece, rate pieces, typed-rate pieces |
| 6442–6466 | straight, banked | yes, by hand | typed-rate pieces every 15 m (2 pieces) | bank p95 2.9 ° (bar 5) |  | 4: one corner piece, rate pieces, typed-rate pieces |
| 6466–6490 | straight, banked | yes, by hand | one corner piece (values read off the section-own estimate) (1 piece) | width p95 2.0 m (bar 2) |  | 9: one corner piece, rate pieces, rate pieces + flow marks |
| 6490–6506 | straight, banked | yes, by hand | typed-rate pieces every 10 m (2 pieces) | exit heading 1.8 ° (bar 2) |  | 4: one corner piece, rate pieces, typed-rate pieces |
| 6506–6522 | straight, banked | yes, by hand | one corner piece (1 piece) | exit heading 1.6 ° (bar 2) |  | 1: one corner piece |
| 6522–6686 | abrupt banked 90° after the jump | yes, STEERED | solved-rate pieces (solver aimed at the section-own estimate) every 12 m (14 pieces) | pitch p95 2.0 ° (bar 2) |  | 30: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 6686–6702 | straight, banked | yes, by hand | one corner piece (1 piece) | exit heading 2.0 ° (bar 2) |  | 1: one corner piece |
| 6702–6750 | straight | yes, by hand | one corner piece (1 piece) | cup p95 2.7 ° (bar 5) |  | 1: one corner piece |
| 6750–6770 | short jog at a one-sided edge step (read or road: unresolved) | no | nearest: solved-rate pieces every 10 m | peak turn 6 vs 35 °/100 m (82%, bar 20%) | the read's centre steps 2-2.5 m where one edge moves; width is symmetric with a 40 m change floor (extend.js:356) and the panel has no side-offset field (inferred) | 5: one corner piece, rate pieces |
| 6770–7030 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 40 m (7 pieces) | exit heading 1.7 ° (bar 2) |  | 15: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 7030–7286 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 20 m, steer gain 0.5 (13 pieces) | bank p95 3.8 ° (bar 5) |  | 26: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 7286–7394 | banked corner | yes, STEERED | solved-rate pieces every 20 m (6 pieces) | exit heading 1.9 ° (bar 2) |  | 16: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 7394–7442 | banked switchback run (bends every 20-50 m, bank reversing about ±37°, ±15° humps) | no | nearest: solved-rate pieces every 12 m | exit heading 19.8 ° (bar 2) | no refusal on the best forms; Sharp refused (SHARP_TOO_TIGHT); the steered forms that drift into the next leg refused PASS_CLEARANCE | 19: one corner piece, Sharp, rate pieces, rate pieces + flow marks |
| 7442–7514 | banked switchback run (bends every 20-50 m, bank reversing about ±37°, ±15° humps) | no | nearest: solved-rate pieces every 15 m | pitch p95 4.9 ° (bar 2) | no refusal on the best forms; Sharp refused (SHARP_TOO_TIGHT); the steered forms that drift into the next leg refused PASS_CLEARANCE | 24: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks |
| 7514–7558 | banked switchback run (bends every 20-50 m, bank reversing about ±37°, ±15° humps) | no | nearest: solved-rate pieces every 10 m, flow | pitch p95 8.0 ° (bar 2) | no refusal on the best forms; Sharp refused (SHARP_TOO_TIGHT); the steered forms that drift into the next leg refused PASS_CLEARANCE | 16: one corner piece, Sharp, rate pieces, rate pieces + flow marks |
| 7558–7582 | banked switchback run (bends every 20-50 m, bank reversing about ±37°, ±15° humps) | no | nearest: one corner piece, bank "early" | pitch p95 5.2 ° (bar 2) | no refusal on the best forms; Sharp refused (SHARP_TOO_TIGHT); the steered forms that drift into the next leg refused PASS_CLEARANCE | 8: one corner piece, rate pieces, rate pieces + flow marks |
| 7582–7614 | banked switchback run (bends every 20-50 m, bank reversing about ±37°, ±15° humps) | no | nearest: solved-rate pieces every 10 m | pitch p95 3.0 ° (bar 2) | no refusal on the best forms; Sharp refused (SHARP_TOO_TIGHT); the steered forms that drift into the next leg refused PASS_CLEARANCE | 15: one corner piece, Sharp, rate pieces, rate pieces + flow marks |
| 7614–7634 | banked switchback run (bends every 20-50 m, bank reversing about ±37°, ±15° humps) | no | nearest: one corner piece, bank "early" | exit heading 18.3 ° (bar 2) | no refusal on the best forms; Sharp refused (SHARP_TOO_TIGHT); the steered forms that drift into the next leg refused PASS_CLEARANCE | 8: one corner piece, Sharp, rate pieces |
| 7634–7658 | banked switchback run (bends every 20-50 m, bank reversing about ±37°, ±15° humps) | no | nearest: one corner piece, bank "early" | pitch p95 8.7 ° (bar 2) | no refusal on the best forms; Sharp refused (SHARP_TOO_TIGHT); the steered forms that drift into the next leg refused PASS_CLEARANCE | 11: one corner piece, Sharp, rate pieces, rate pieces + flow marks |
| 7658–7682 | banked switchback run (bends every 20-50 m, bank reversing about ±37°, ±15° humps) | no | nearest: solved-rate pieces every 10 m, flow | exit heading 6.6 ° (bar 2) | no refusal on the best forms; Sharp refused (SHARP_TOO_TIGHT); the steered forms that drift into the next leg refused PASS_CLEARANCE | 8: one corner piece, rate pieces, rate pieces + flow marks |
| 7682–7702 | wide road (35-45 m) | yes, STEERED | solved-rate pieces every 10 m (2 pieces) | bank p95 3.8 ° (bar 5) |  | 4: one corner piece, rate pieces, typed-rate pieces |
| 7702–7730 | wide road (35-45 m) | no | nearest: solved-rate pieces every 10 m | cup p95 7.2 ° (bar 5) | no refusal; cup or roll rate short (BANK_FIT_FLOOR_M 26 m, extend.js:364: inferred) | 8: one corner piece, rate pieces, rate pieces + flow marks |
| 7730–7750 | wide road (35-45 m) | no | nearest: solved-rate pieces every 10 m | peak roll 0.34 vs 0.63 °/m (bar 0.19) | no refusal; cup or roll rate short (BANK_FIT_FLOOR_M 26 m, extend.js:364: inferred) | 5: one corner piece, rate pieces |
| 7750–8030 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces (solver aimed at the section-own estimate) every 15 m, steer gain 0.5 (19 pieces) | peak roll 0.65 vs 0.88 °/m (bar 0.26) |  | 30: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 8030–8078 | straight, banked | yes, by hand | one corner piece (1 piece) | bank p95 4.1 ° (bar 5) |  | 1: one corner piece |
| 8078–8298 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 15 m (15 pieces) | exit heading 1.5 ° (bar 2) |  | 18: one corner piece, one piece + extra rows, Sharp, rate pieces, typed-rate pieces |
| 8298–8514 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 15 m, steer gain 0.5 (15 pieces) | exit heading 1.6 ° (bar 2) |  | 27: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 8514–8530 | straight, banked | yes, by hand | one corner piece (1 piece) | exit heading 0.7 ° (bar 2) |  | 1: one corner piece |
| 8530–8730 | steeply banked corner (30-45°) | yes, STEERED | solved-rate pieces every 15 m, steer gain 0.5 (14 pieces) | bank p95 3.5 ° (bar 5) |  | 28: one corner piece, one piece + extra rows, Sharp, rate pieces, rate pieces + flow marks, typed-rate pieces |
| 8730–8774 | short jog at a one-sided edge step (read or road: unresolved) | yes, by hand | one corner piece (1 piece) | bank p95 2.7 ° (bar 5) |  | 1: one corner piece |
| 8774–8794 | short jog at a one-sided edge step (read or road: unresolved) | no | nearest: solved-rate pieces every 10 m, flow | peak turn 10 vs 84 °/100 m (88%, bar 20%) | the read's centre steps 2-2.5 m where one edge moves; width is symmetric with a 40 m change floor (extend.js:356) and the panel has no side-offset field (inferred) | 5: one corner piece, rate pieces |
| 8794–8810 | straight | yes, by hand | one corner piece (1 piece) | exit heading 1.9 ° (bar 2) |  | 1: one corner piece |
| 8810–8986 | straight | yes, by hand | typed-rate pieces every 30 m (6 pieces) | pos p95 2.8 m (bar 3) |  | 8: one corner piece, one piece + extra rows, rate pieces, typed-rate pieces |
| 8986–9162 | straight | yes, by hand | one corner piece (1 piece) | pos p95 0.4 m (bar 3) |  | 1: one corner piece |

## The classes not made, and where each limit lives

Only class 1 is written as "cannot". The others are "these forms did not": every route listed was tried, and no refusal
says why the nearest one missed.

### 1. A bank passing below −360° (past one full roll): 2 sections, 228 m (4267–4471, 4527–4551). A panel gap, not a core gap.

    checked: node roll2.js / roll3.js / twist.js (scratch)

- **What the panel sends.** A typed −392 rolls the built road to −360, then −195.2, then −32 at 230/280/330 m: it
  unwinds, with a worst step of 6.13°/m.
- **What the core alone lays.** Given targets.phi −392, the core lays −360, −375.2, −392 at the same points, at most
  0.62°/m.
- **The other panel forms.**
  - A flow mark gives −32.
  - A flow mark plus an extra row gives −10, then −32.
  - An extra row alone is refused with BAD_SECOND.
  - A Twist brush drag of −2° near −358 unwinds to about −27.
- **Where the panel wraps.**
  - `app/core/panel.js:434` (bankTarget);
  - `:475` (secThen, the extra rows);
  - `app/core/coreshell.js:61` (bankWithinTurn, the brush).
- **This is deliberate.** The comment at `panel.js:429-433` records the earlier ruling: "No nearest-equivalent rewrite".
- **What the gap does not touch.** Sections whose bank only *sits* past −360 are the same surface as within one turn,
  and they were made: 4471–4503, 4503–4527, 4551–4579, 4871–5027, 5027–5048. The gap is only where the bank must keep
  going down through −360. In 4527–4551 the bank wobbles across −360, so each typed value just below it wraps a full
  turn back.

  inferred: on a continuous lap the head arrives wound, so the same unwinding hits only the sections that cross
  downward. That is the per-section lead-in result, checked with DUMP=1 on 4471–4503: the section-own bank is −17°, and
  the lead-in carried the head there.

### 2. The banked switchback run, 7394–7682: 8 sections, 288 m

The heading swings 50–115° every 40–60 m, the bank reverses about ±37°, and the pitch goes over ±15° humps at a width of
24 m.

    checked: node -e (scratch) → the read's closest legs here: 35.0 m centre to centre, 6.6 m height difference

The read's junction rows are where its cross-ray reaches the next leg (width 49–78 m). It is not a fork.

**Section by section,** no route made any of the eight. Sharp refused (SHARP_TOO_TIGHT, "fold" and "leaves-surface",
tightest 48–385 m). One-piece corners on the 20 m sections hit TURN_TOO_SHORT (`src/core/turnby.js:147`). The checked
synthetic floor is 58.7° in 20 m refused, "needs at least 21 m".

**Laid whole** (`node zone.js`, and `JALL=1 node zone.js` for amendment 5): one corner piece per bend, with a refused
bend carried into the next piece, as he would.

| route | position p95 | bank p95 | pitch p95 | width p95 | exit | peak turn |
|---|---|---|---|---|---|---|
| one corner per bend | 19.4–20.6 m | 30.2° | 24–26° | 10.6 m | 2.6° | 302 vs 387 °/100 m |
| the same, bank "early" | 19.1–20.7 m | 35.7° | — | — | 2.9° | — |
| corner with the bank peak as a mid mark and the climb split at mid | 38 m | — | — | — | — | — |

The mid-mark form was refused with CLIMB_TOO_SHORT ("needs at least 21.0 m before the piece's end").

The best of all was STEERED rate pieces every 15 m at steer gain 0.5:

- position p95 3.7 m, or 4.5 m with amendment 5, against 3;
- exit heading 8.9°;
- bank p95 9.2°;
- pitch p95 3.7–4.5°;
- peak turn 271 against 387 °/100 m.

Rate pieces at 10, 15 and 20 m without the gentler steer were refused PASS_CLEARANCE (`app/core/coreshell.js:475`, "too
close to another pass of the road …"). The built road drifted into the neighbouring leg.

inferred: what is missing is a corner tighter and shorter than the 21 m floor, carrying a bank reversal inside it.
Neither a corner piece (its floor) nor Sharp (its load limit, below) reaches it.

### 3. The short jog at a one-sided edge step: 5 of 8 not made, 140 m

These are 184–236, 3148–3172, 3284–3308, 6750–6770 and 8774–8794.

At each, one edge of the read moves and the other does not; for example, at 3168 m, left/right 13/10 → 14/6. That steps
the read's centre 2–2.5 m sideways inside 20–50 m. Every route missed the peak turn by 67–88%, or the width by 0.2 m.
Where a road-width step lives, the builder's width is symmetric, with a 40 m change floor
(`src/core/extend.js:356` CHANGE_FLOOR_M). The panel has no field for a side offset.

inferred, unresolved: whether this is a kerb or road-edge feature, or the reader's edge choice. Three of the class *were*
made by hand (2660–2680, 6390–6442, 8730–8774), all where the step is smaller.

### 4. Near-misses with no refusal (these forms did not): 8 sections, 728 m

- **2128–2332, steeply banked corner:** pitch p95 2.3° against 2. Also tried with 8 secant rounds; heading jitter makes
  the exit bar unusable here.
- **2952–2988, banked link:** peak turn 22 against 37 °/100 m.
- **3819–3891, banked corner:** exit heading 4.8°. TURN_TOO_SHORT on its one-piece forms.
- **3891–3967, a flat corner over a 13° crest:** peak turn 50 against 84 °/100 m.
- **4579–4851, the 182° banked hairpin after the roll:** exit heading 15.8–27° on every rate form, with the position
  inside its bar on the best. Every form's peak roll is 0.69–1.16 against the read's 1.91 °/m. inferred: the bank cannot
  change fast enough. The candidate is BANK_FIT_FLOOR_M 26 m (`src/core/extend.js:364`), and a 16 m piece's bank mark
  was refused BAD_SECOND ("needs more room than the piece's 16.1 m"; `src/core/extend.js:520`). This is the largest
  single unmade section that is not a panel gap.
- **4851–4871:** peak roll 0.14 against 0.32 °/m.
- **7702–7730 and 7730–7750, wide road (35–45 m):** cup 7.2° against 5, and peak roll 0.34 against 0.63 °/m.

## The abrupt 90s after the jump, re-measured (packet note)

All six are made: 5439–5535, 5563–5714, 5818–6006, 6006–6154, 6270–6390, 6522–6686. Only 5563–5714 is made by hand
(one piece with 3 extra row sets). The other five are made only by steering (3–19 solved pieces), and typed-rate pieces
did not make them.

**Sharp refuses each of them at its width.**

    checked: results.local.json sharp refusals

| section | Sharp asked for | tightest it allows | reason given |
|---|---|---|---|
| 5439–5535 | R 39 m | 62.7 m | load-above-proven |
| 5818–6006 | R 35 m | 121.0 m | leaves-surface |
| 6006–6154 | R 32 m | 37.5 m | load-above-proven |
| 6270–6390 | R 39 m | 46.2 m | load-above-proven |

The limit is in `src/core/sharp.js:132`. So the 10-09 work did not make them placeable as one Sharp each, as that plan
hoped. They are laid as chains of rate pieces. Its "R ≈ 22 m on a 20 m window" is on a different estimator from mine
(peak 146–180 °/100 m on 8 m), so the two are not compared.

## Corrections, including my own

- **Correction 3 and correction 4** were my bugs, found and fixed before the counted runs. Every result before
  correction 4 was discarded.
- **The counts moved within the lap,** as forms were added and the bugs fixed:
  - 55/95 (first batch after correction 4);
  - 68/95, 7,239 m (with the second-pass forms);
  - 66/95 (the third run, new solver aim, before merging);
  - **73/96, 7,778 m now** (both aims, the post-roll merge, and the jump counted as a section).

  Only the last one stands.
- **The pre-roll run** had two bugs of mine:
  - its compare offset counted only the lead-in (fixed);
  - its start pitch ignored the pre-roll (not fixed; worked around by taking the zero-start result on 4239–4267).
- **lay.js sent extra bank rows unwrapped** where the panel wraps them (`panel.js:475`). Fixed before the counted runs.

## Scripts (local, uncommitted: they open the read at run time)

They live in `G:/consonance-scratch/a-t1-scratch/`.

- **Library and compare:** `t1lib.js` (the read), `lay.js` (the panel's extendOptions, headless), `cmp.js` (lead-in and
  compare), `routes.js` (the route forms).
- **Runs:** `batch.js`, `pass2.js`, `handpass.js` (the by-hand forms), `zone.js` (the switchback laid whole),
  `final.js` (this table), `summarize.js`.
- **Checks:** `jitter.js` (noise), `jump.js`, `roll.js`, `roll2.js`, `roll3.js`, `twist.js`, `corner.js`,
  `flowchk.js`, `dbgpre.js`.
- **Registered tolerances:** `TOLERANCES.md`.
- **Results:** `results.local.json`, `results.run3.local.json`, `postroll.local.json`, and `old/` (the second-pass
  results).

Ran headless at BelowNormal. Neither his app nor the game was launched, and the heavy-run lock was not taken: no suite
was run, only the scratch scripts.
