# D438: the pit lane flips up at its ends; the closer's joints and seam on the banked copy (librarian, 2026-10-22 21:3x)

## The keeper, 21:33

"recorded a replay of it, it works in theory, but where the pieces connect there is too big of a bump, then how the banking and cupping connects to the end of the track doesnt work right, as well, look at the pits, the like flip up towards the beginning and end, it should be smooth even."

## Checked by the librarian

- **The replay is of the wrong copy.** `Documents\Assetto Corsa\replay\ohyeah2389_t180_mach6_t180b_test_track_10_banked__221026-213144.acreplay` names `t180b_test_track_10_banked`.
  - That copy is the one **I** hand-banked this morning (scratchpad `d434\bank2.js`, forced past the 2 stacked reds).
  - It sits on his OLD closer, which still has the joint overshoot D431 fixed (kh −23.54 at p42|p43).
  - It is NOT O's build (`t180b_test_track_10_copy_banked_closer`, from D431 + D434 + D432, installed 21:20).
  - Both folders sit in his AC list with near names. The mix-up is mine.
- Copies are in `scratchpad\d438\`:
  - the replay, `r.acreplay`, sha256 872eb23b…;
  - his save `eq-TEST TRACK 10.t180track`, sha256 4045b7b3….
- His pit lane: `side R, leave p1 along 100, rejoin p1 along 900, offsetM 12, width 8, divergeM 80, mergeM 80`.

## Part 1: the pit lane flips up at its ends. Pane C. Tier: prove it (export geometry)

1. Map the replay to the document with `scratchpad\d431\rp.js` (AI s equals document s to 1.3 m, P's D433). Find where the car is on the pit lane, and what the lane surface does under it in the diverge (100–180 m) and the merge (820–900 m).
2. Measure the lane's mesh in both kn5s, against the main road beside it: its height, its bank across the lane, and its edge lift along the lane. Use the kn5s in `t180b_test_track_10_banked` and `..._copy_banked_closer`. Name the code that makes the flip (src/geom/pitlane.js or src/export/pitlane.js), with path:line.
3. **Test first:** across the diverge and merge, the lane's cross-slope and height follow the main road's surface smoothly, with no lift at the lane's ends beyond the main road's own. Red on b6969da.
4. Fix it so the lane is even and smooth from leave to rejoin. Run the export mutation coverage, and the pitlane tests whole.
5. Make headless shots before and after (`--mute-audio`). Leave his tracks untouched.

## Part 2: the closer's joints and seam on the RIGHT copy. Pane O. Tier: check it (measure; build only if a number says so)

1. Using P's `kstep436.js` (`exo_memory/handback/p-d436-P_2026-10-22_evidence/`), measure the sudden change in curvature under the outer wheels (±8.4 m) at the closer's joints (p41|p42, p42|p43, p43|p44) and at the seam (p44|p1), for three versions:
   - his saved closer (old);
   - my morning `eq-TEST TRACK 10 banked` (the one he drove);
   - O's 15e4e81 + D432 build (the copy installed at 21:20).
2. Measure the bank and cup through the seam into p1, for "how the banking and cupping connects to the end of the track".
3. If O's build still has a step at a joint or the seam larger than his own good joints, plan the fix and say what it costs.

NEXT: chair route D438 Part 1 to C and Part 2 to O now; both hand back to the librarian.

## Part 2 ruled, 2026-10-22 21:3x (librarian): O's §4 goes. D434 does not land without it

O measured it in `exo_memory/handback/p-d438-O_2026-10-22.md`.
- O's own D434 build steps 95.9 °/100 m under the outer wheels at p41|p42. That is 11.9 g at 300 km/h.
- The morning copy he drove steps 66.9. His old closer steps 37.8.
- His own worst joint is 24.3, and his 90th percentile is 21.7.
- On every copy the cup is pulled 37.3° → 10° in the last 30–40 m.

**Ruled:**
- **Go on §4 steps 1–4**, on a new branch from d434-o 681727f. The reviewed sha stays as reviewed.
- **The joint bar:** every closer joint and the seam must be ≤ 21.7 °/100 m at u ±8.4, which is his own 90th percentile.
- **The cup rate:** spread the cup change over the closer's whole length, at no more than his own road's fastest, 0.021 °/m. Where that doesn't fit, take the slowest rate the closer allows, and report it.
  - On TEST TRACK 10 that means 27.3° over 3.9 km, about 0.007 °/m.
  - The keeper can veto the rate.
- **Test first:** each closer joint and the seam, and the cup's rate on the closer. They must be red on 681727f, for TEST TRACK 10 and TEST 10.
- **The whole proof:** the close and core harnesses whole. Make before and after shots, and a TEXTURED kn5 of a copy (check that the asphalt .dds is in it). If Finish's route changes, say so.
- **D434 rides the next batch only together with this fix.** 15e4e81 and 681727f are not landed alone.
- P reviews the new branch.

NEXT: chair route D438 Part 2 build to O now; O hands back to the librarian; P reviews after.

## P's review ruled, 2026-10-22 23:3x (librarian): (a) folds in before landing; (b) and (c) become D439

P's review is in `exo_memory/handback/p-d438-review-P_2026-10-22.md`.
- On his two tracks every bar holds. The sweep reproduces O's figures exactly, and O's removal d52c4cc is identical to f5e1994 on all 48 laps.
- On 45 laps built here, P found three defects. The rows don't see any of them.

**My J6 ruling at 23:08 was wrong.** I kept smootherstep because "its 0.0128 peak is within 0.021". That holds only on his long closers. On 14 of P's 45 laps the peak is 0.0204–0.0377 °/m, over the bar, and the ruling's own fallback clause was not built.

**Ruled:**
- **(a) Pane O, now, on d438-o. Tier: prove it.**
  - The cup eases LINEARLY on every closer (J6 reversed). O measured the joints within 0.2 °/100 m of smootherstep's, and the peak is lower.
  - Where Δ/L is still over 0.021, the slowest rate wins and Finish's report says the rate.
  - A row on a short built closer (P's turn 150, tail 300, roll 54: 0.0217 now), red first.
  - Rows 1–5 re-run, the two core harnesses whole, and a fresh textured kn5 copy.
- **(b) and (c) become D439, the next solver lap. Pane O after (a). Tier: prove it (core geometry).**
  - (b) The roll straight is bent by the close and leans OUT: −26.3° and 5.07 g on built laps.
    - Fix: keep the roll straight out of the close window when the roll is laid first (finish.js:361), or hold its kh at 0.
  - (c) Two laps flip to an unbanked roll-last close, at 10.89 and 9.16 g.
    - Fix: when a roll is owed, try `'first'` before `'last'`, or take the route with the lower side load (finish.js:384).
  - Red rows come from P's laps: turn 210 tail 300 roll 30, and turn 180 tail 1,200 roll 10 and roll 30.
  - P reviews it.
  - It rides the same batch if it is done before the batch lands. Otherwise it rides the next one.
- D434 and D438 land together, with (a), for his two tracks. A comment at finish.js:312 says that 1.5 is a margin set by the bloss blend's shape (P §1.1).

NEXT: chair route (a) to O now, then D439 to O when (a) hands back; P reviews both; all hand back to the librarian.

## P's review of (a) ruled, 2026-10-23 00:3x (librarian): (a) accepted; σ's origin folds into D439

P's §5 in `exo_memory/handback/p-d438-review-P_2026-10-22.md`.
- (a) holds on every lap. The cup is over the bar on 3 of 45 laps, down from 14, each with its note.
- 7cc2ca4's J8 comment says what was ruled.
- **New finding:** the linear ease reads 1.27–1.30 × Δ/L, not 1.00 ×. σ is measured from the window's start while the first piece's two points are held, so the first free span runs at 1.5 ×.
  - The 3 laps that still fire the fallback have Δ/L of 0.0187–0.0201, under the bar. Their note, "too short", is not true of them.

**Ruled. Added to D439 (O), part (d):**
- Measure σ from the first piece's second Greville abscissa ξ₁: σ = (ξ − ξ₁)/(z − ξ₁).
- Tighten row 7's bar from 1.5 × to 1.05 × Δ/L. The fix must make it go red first.
- Add a row: no lap with Δ/L ≤ 0.021 prints the cup note.
- J8 stays the identity it claims (P inferred this; O checks it).

D434 and D438 land with (a) at 7cc2ca4 for his two tracks. D439 rides the same batch if it is done in time.

NEXT: chair relay (d) to O now, folded into D439; O hands back to the librarian; P reviews.

## D439 ruled from O's side, 2026-10-23 02:1x (librarian): to P for review; §5 becomes D440

O's hand-back is `exo_memory/handback/p-d439-O_2026-10-23.md`, d439-o cd3dc42 on 7cc2ca4.
- (b): on P's three laps, 0 stations out.
- (c): built as the ruled second option, the lower side load. Option one broke core_finish row 12, whose lap is better rolled last (5.55 g against 8.08). Accepted.
- (d): σ is pinned at both ends; the seam half goes beyond my formula and is accepted. The cup reads 1.00 × Δ/L: 0.0069 on TEST TRACK 10 and 0.0058 on TEST 10.
- J8 is checked as the identity.
- On his tracks: TEST 10 is identical. TEST TRACK 10 keeps its route; p41|p42 goes 14.5 → 2.7, side load 4.51 g, gap 0.083 mm.

**Route:**
- P reviews cd3dc42. In parallel, O builds a textured kn5 copy of TEST TRACK 10 at cd3dc42 + d432-e 3c870e3, named `..._copy_closer_d439`, for the librarian to install.
- D439 rides this batch if P's review is in before the landing.

**D440 (§5): a lap where both orders give a bad closer. Pane O after the kn5. Tier: prove it.**
- Ruled, combining both of O's candidates:
  1. A closer with any station leaning out is never taken; the search tries the next route.
  2. Among the routes that pass, the lower side load wins, within an order and across orders.
  3. If no route passes, Finish refuses by name. It never lays a closer that leans out.
- Red row: O's lap (a 180° turn over 400 m, then a 1,200 m tail rolling 10°).
- Measure the search time on his two tracks and say what it costs.
- This is not on his two tracks. It rides the next batch, not this one.

NEXT: chair route the cd3dc42 review to P and the d439 kn5 to O now; then D440 to O; all hand back to the librarian.

## P's D439 review ruled, 2026-10-23 02:2x (librarian): D439 accepted; four notes fold into D440

P's review: `exo_memory/handback/p-d439-review-P_2026-10-23.md`.
- On his two tracks and all 47 sweep laps: 0 stations out, no false cup notes, the cup at 1.00–1.02 × Δ/L, and every joint ≤ 17.7.
- **D439 is accepted at d439-o cd3dc42.** It rides this batch with D434 and D438.

**Correction, mine.** Above, "D439 ruled from O's side" says "TEST 10 is identical". That is one word too strong: its cup moved, 0.0075 → 0.0058 °/m, under (d). Its route, joints, lean, side load and gap are identical.

**Added to D440 (O):**
- (e) Ranking within an order by side load is already part of rule 2. The red rows come from P's rises: turn 210 / 300 / roll 90, 3.49 → 4.42 g; turn 180 / 700 / 90, 5.37 → 5.95 g.
- (f) The rank must not read a vertical wall as the best closer. Turn 180 / 1,200 / roll 90 reads a mean lean of 90.0° and 1.00 g, because the normal load, about 5.6 g, is not read.
  - Ruled: the rank reads the whole load at the design speed, |f|/g with the normal part included, not only the lateral part. The red row is that lap: it must not win over a banked closer whose whole load is lower.
- (g) SIDE_BANKED_G's comment names the lap it does not separate (turn 180 / 700 / roll 54, 6.17 g), or the bar is re-based.
- (h) Wrap the second order in a `try`, so that a refusal there keeps the first order's closer. Add a row only if it can be reached.

NEXT: chair relay (e)–(h) to O now, folded into D440; O hands back to the librarian; P reviews.

## D440 ruled from O's side (librarian, 2026-10-23 ~04:20)

Hand-back `exo_memory/handback/p-d440-O_2026-10-23.md` (git-blob 2934ecbf…, 11,068 B), t180 d440-o c422e8e from cd3dc42 (a5fa5c0, dd2ae71, c422e8e).

checked (one run each, the pane's evidence): rank-BG.out:3 TEST 10 → LSL R300 2,901 m, lat 4.21 g (§2 row B as stated); rank-BG.out:68 rank G → RSL R900 10,413 m; harnesses-final.tap 114 ok / 0 not ok; d440-mutants-final.out "applied 8 / caught 4 / NOT APPLIED 0", N5 N6 H1 H2 survive as §5 says.

**Rulings.**
1. **Never-lean-out (rule 1), refuse by name (rule 3), (g), (h): ACCEPTED as built**, pending P's review. Row 9 red-first at cd3dc42 (1,171 of 1,172 out) and green at d440-o; his two tracks' figures identical to D439; no measurable search cost on them.
2. **The load rank, (e) and (f): WITHDRAWN, not built. A (first-found) stands.** My own D440 ruling asked for it; §2's table shows every rank breaks a rule already held (his tracks' D439 routes, row 6, row 12, D439 (c)), and the gain is 0.02 g on TEST 10. The (f) premise was wrong, and the physics is O's, checked by reasoning: f = v²κ⃗ + g·ŷ is fixed by the path, so a whole-load rank cannot see bank. That is a ruling error of mine (folding (f) in unchecked), recorded here.
3. **(f)'s 90° wall** is a lean question, not a load question. It joins the keeper's open question 2 (the bank size): a cap on closer lean, or a check of load below design speed. Not built until he answers.
4. **N5, N6, H1, H2 surviving: accepted.** No lap in 114 reaches them; no option is to be added only to reach them. They ride as guards.
5. D439 K1 now surviving (held twice by rule 1) and K5 NOT APPLIED (anchor renamed): accepted.

Next: P reviews d440-o c422e8e (prove it: rows 9–10 red-first, the refusal path by reading, the two-order try, a sweep of the leaning laps). D440 then joins the batch after plan_batch_0415_landing (or that landing takes d440-o if it has not started; the chair decides by whether the landing pane has begun).

## P's D440 review ruled (librarian, 2026-10-23 ~06:22)

Review `exo_memory/handback/p-d440-review-P_2026-10-23.md` (git-blob 4773d510…, 13,862 B). P reproduced rows 9–10 red-first, read the refusal (unreached in 286 laps), probed the two-order try (H1/H2 hold), swept 286 laps (0 out, 0 refusals, 8 roads changed), and found his two tracks byte-identical to D439. 3 files: 35 tests, 34 pass, 0 fail, 1 skip.

**Rulings.**
1. **D440 d440-o c422e8e: ACCEPTED.** It parks for the batch after local-0.4.15.
2. **§2.1, the seam dips, become a lap: D443 for O**, after D440 lands or on top of c422e8e. Six of the 8 changed roads were short closers whose only lean-out was 2–11 stations at the seam onto the start, where D438 pins the bank to the start's while the road still bends. Rule 1 then buys a road 1.3–3.3× longer. The fix belongs in the seam, not in rule 1's count:
   - bring the bank to the start's value before the last curve ends, or let it lean in until then, so no seam station leans out by more than 5°;
   - re-run P's pitched and tight families; the short closers (e.g. kv −0.0006/600/10 LSL 1,120 m) should come back with 0 out;
   - his two tracks must stay byte-identical;
   - prove it.

   The keeper is told so he can veto it.
3. **§2.2, the first-found cost** (the row-9 lap: a 3.53 g roll-first closer exists against 8.70 g taken; the 180/600 lap goes 973 → 5,396 m for 0.74 g), waits with the keeper's bank question (open question 2), beside the withdrawn rank. Nothing is built for it.
4. **§2.3, vertical curvature read as lean:** accepted as unreachable today (roadHold refuses crests under R 1,665 m first). D443 should name it in a comment, with no row.
5. **P's correction (no heavy-run slot held):** noted. From here P holds a slot for any probe over about 2 minutes, which settles the D442 noise.

## D443 ruled from O's side (librarian, 2026-10-23 ~06:36)

O's hand-back is `exo_memory/handback/p-d443-O_2026-10-23.md` (git-blob 034ccd46…, 9,697 B). It is NOT built; d443-o sits at c422e8e.

checked: lean-h-cd3dc42.out:1-5. Every station counted out on P's five laps leans INTO its horizontal turn (+10.6° to +24.7°). checked: hlean-pitched.out:8,11,12,14,15. Option 2 takes the short roads (1,120 / 995 / 1,119 / 2,495 / 999 m).

**My D443 premise was wrong.** I took P's §1.4 ("all the dips are at the seam") into the ruling unchecked. O measured it: one of the five is at the seam, four sit at turn joints up to 2,350 m before the seam, and none leans out against its turn. The bad reading is a crest under a bend, read through the 3-D κ. That is a ruling error of mine, recorded here.

**Rulings.**
1. **A crest under a bend is not leaning out.** D434's bar was written for a road tilting away from its turn, and a vertical crest is not a turn. Option 1, the seam straight, is DROPPED; its diff stays as evidence only.
2. **D443 is re-scoped to option 2, for O, prove it, from c422e8e:**
   - rule 1's lean in `closerLoad`, and core_finish_bank's `lean()` (the rows' own measure), read against the horizontal turn: κ less its world-up part, curved where |κh| > 1/600 m;
   - a new row on a pitched lap, red first at c422e8e: kv −0.0006/600/10 takes RSR 3,309 m there and should take LSL 1,120 m with 0 out against the turn;
   - his two tracks and P's tight 108 identical to c422e8e (O's hlean-tight / hlean-tracks already show this; the build must reproduce it);
   - the mutation harness for the touched files whole, plus own mutants for the horizontal read (put the 3-D read back: the new row catches it);
   - fix the §2.3 comment wording to "unreachable as the ONLY cause".
3. Option 2's short roads carry 0.5–1.9 g more side load than the detours. That is the first-found trade, which already waits with the keeper's bank question. Not a reason to hold D443.
4. The keeper is told so he can veto. D443 rides with D440 in the batch after 0.4.15.

## P's D443 review ruled (librarian, 2026-10-23 ~07:14)

P's review is `exo_memory/handback/p-d443-review-P_2026-10-23.md` (git-blob efe745f4…, 13,151 B).
- Row 11 is red first at c422e8e.
- 3 files: 36 tests, 35 pass, 0 fail, 1 skip.
- Unchanged against c422e8e: his tracks and the 47-lap sweep, the tight 108, and 11 of the pitched 16.
- The other 5 pitched laps are back on cd3dc42's short roads.
- The steep 20 mends one wrong refusal: kv −0.003/300/10.
- No other reader of the lean.

**Rulings.**
1. **D443 d443-o da76067: ACCEPTED.** It rides with D440 in the batch after 0.4.15.
2. **P2 surviving: accepted, on P's count, not on the R 1,665 m argument.** On 141 laps, no station with |κh| < 1/600 m is read out. That argument was false on a closed document: roadHold reads the ghost lap's speed, and a crest of R 555 m held at 0.9 g.
3. **A small follow-up lap for O on top of da76067, D444, prove it, also riding that batch:**
   - (a) a row reaching FINISH_LEANS_OUT, on P's onelap443 lap: 180° over 1,500 m, 300 m at kv −0.003 to −34.4°, 100 m back to level, a 600 m tail rolling 10°. It asserts the code and the "N of its M curved stations" shape, so N5 and N6 get caught; their red-first is the mutants;
   - (b) the finish.js comment at :174-176: the crest bound is a design-speed one, so cite the measured count instead;
   - (c) the core_finish_bank header at :7: say horizontal κ, not 3-D (the carrier rule).
4. P's correction of its own D440 §1.4 is recorded. Together with mine at "D443 ruled from O's side", that closes the seam-premise trail.
