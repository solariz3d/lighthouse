# Catalogue: the shapes the T-180 builder cannot make yet, from five reference tracks (librarian, D, 2026-11-26)

His word of 12:48 (verbatim in `briefs/t180_unmakeable_shapes.md`). Merged from the five track hand-backs and the studies that
followed them. Every figure here is a pane's, checked in its hand-back; this file adds the merge and the ranking, nothing measured.
Track names stay out ([T1]..[T5]; key local).

## The five tracks, as measured (base: builder landing-1126 ceb21f5)

| track | sections made | by hand | only by steering | not made | hand-back |
|---|---|---|---|---|---|
| [T1] | 75 / 96 (8,254 / 9,162 m) | 39 (1,995 m) | 36 | 21 (908 m) | `handback/p-unmakeable-T1-A_2026-11-26.md` (+ correction 20:04Z) |
| [T2] | 61 / 61 section by section; the whole lap refused | 61, but 4,420 pieces at 5-20 m | 0 | 2 classes (close pass, floor) | `G:/consonance-scratch/lh-t2-c/exo_memory/handback/p-unmakeable-T2-C_2026-11-26.md` (branch unmakeable-t2-c 4580697b, not yet on main) |
| [T3] | 116 / 119 | 560 pieces by hand for the 74 once steered | (1,767 steered pieces) | 3 (read noise and one landing) | `handback/p-unmakeable-T3-O_2026-11-26.md`, `handback/p-unmakeable-T3-hand-O_2026-11-26.md` |
| [T4] | 365 / 370 | 193 | 172 (19 of 20 hairpins) | 5 + 5 of 7 jumps | `handback/p-unmakeable-T4-B_2026-11-26.md` |
| [T5] | 21 / 71 (3,430 / 10,734 m) | 9 of 10 made sections need 7-26 pieces | 1 | 50 | `handback/p-unmakeable-T5-E_2026-11-26.md` (§9, §10) |

**The headline:** almost every shape can be REACHED. What fails is reaching it by hand in a sane number of pieces, and a
road that is not the same on both sides.

## The classes, ranked (tracks first, then sections)

### 1. A turn whose rate changes along a piece, fast enough: ALL FIVE tracks (the piece-count class)

- [T3]: the one control that would cut the count most in 53 of 74 sections. [T4]: 172 sections only by steering, 19 of 20
  hairpins. [T1]: 36 only by steering. [T5]: 7-26 pieces a made section. [T2]: 4,420 typed pieces at 5-20 m.
- The control exists (turn change rows, `app/core/panel.js:71`), but the core needs ~10.3 m per °/100m of change
  (`src/core/extend.js:494-499`), so the rows were refused or missed everywhere.
- A cut of the same change is never refused and is only ~1.3x smoother (`loop/plan_t180_faster_turn_rows_2026-11-26.md` §2e).
- **Building:** O1 (the base share read on the built road; halves the law, bar unchanged). **Testing:** the plan's registered
  prediction (O1 at most 5 of [T3]'s 53; O1+O2+O3 under 27; O4 at least 40), by a seat that wrote neither study.
- **His call:** O4 (rows shown, not refused, down to 20 m) against O0' (the bar for every route); O2/O3 spend the margin or move
  the bar's speed.

### 2. A road not the same on both sides (asymmetric cross-section): FOUR tracks

- [T1] one-sided edge steps: 5 sections, 140 m. [T5] width steps: 8 of its 11 kinks, plus the first pass's. [T4] the level
  shelf joined to one rim: 5 sections, 332 m (`handback/p-crossfall-A0-A_2026-11-26.md`: the pit tool is no route). [T2] the
  off-centre floor: 16 of 61 sections (the panel has a symmetric middle; per-side edges only from s ≥ 0.5, `document.js:51`).
- Every route tried missed, including 72 sideways Grab runs on [T5] (§5b) and the pit lane on [T4].
- **His call:** the stored right-side channel (`loop/plan_t180_cross_section_2026-11-26.md` (b), the `er` pattern). It is a
  stored-data change. The no-data route bends the centreline (a false corner).
- Caveat for [T2] and [T4]: the reader's tilts are unsigned and its rims read ~45° where the mesh is 15-30°, so part of this
  may be the reader. [T1] and [T5]'s steps are checked by edge walks.

### 3. A road passing close over itself: TWO tracks

- [T2]: the whole lap is refused at section 20 (`PASS_CLEARANCE`, `app/core/coreshell.js:475`); the read's own geometry is
  under the builder's 3.1 m margin in 4 places with no apron, 6 with it. [T3]'s helix: made with Track ▸ Edge apron at 0.
- **His call:** the margin is the builder's rule by design (`src/validate/passclear.js:39`). Whether to lower it, count the
  underside differently, or leave such tracks to be built with a looser layout.

### 4. The road's shape across a jump: ONE track ([T4], 5 of 7 jumps) — BUILT

- `handback/p-d677-build1-C1-O_2026-11-26.md`, builder `o-c1-landing-start` 9e79648: after a flight, Extend starts at the
  typed cross-section. No stored-data change. Waiting for a second read.

### 5. Sharp refuses corners the rate pieces lay: TWO tracks ([T1] six post-jump 90s, [T4] 36) — BUILDING

- `handback/p-sharp-vs-rate-B_2026-11-26.md`: Sharp judges at 970 km/h and refuses on ambers the checker only shows. Build 2:
  Sharp refuses on reds only. His 970 display (D256) stays.

### 6. A bank continuing past −360°: ONE track ([T1], 228 m)

- The panel wraps on purpose (his D259, 2026-10-06); the core lays it. **His call**, three answers costed in
  `loop/plan_t180_floors_and_wrap_2026-11-26.md` (b).

### 7. A bank reversal inside a short bend: ONE track ([T1] switchback, 288 m) — parked

- The floors are not the blocker (M-A0, M-C0 in the same plan); lowering them makes a short bank row ring to −100°. No route.

## Not builder gaps, found on the way

- **Our reader:** fixed for [T5] (cupped slab road, a landing guard), builder branch `reader-downray-e` dab271b, read pending.
  Still open: [T4]'s rim artifact, [T2]'s unsigned tilts.
- **The pit lane at gap 0:** exported red on any road. Fixed on `l-pitgap-a` 44c770f (refused under 0.1 m by name), read pending.
- **The two [T3] "panel gaps"** were reachable in the app (Edge apron; Delete on the landing): no build.
- **Every floor** (corner 21 m, bank fit 26 m, width 40 m, extra rows 21 m) and the 3 g bar: measured, not the blocker, kept.

## For him in the morning (the calls)

1. Class 2: the stored right-side channel, yes or no.
2. Class 1: rows shown, not refused (O4), or the bar for every route (O0'); with the prediction test's numbers beside it.
3. Class 3: the pass clearance margin.
4. Class 6: the −360 wrap (D259 against his 11-03 spiral ask).
5. The release batch, when he has tried the builds: landing-1126 (+ E's File/Edit fix), the reader, the pit gap, build 1,
   build 2, O1.

## Amendment, 2026-11-26 ~19:00 local: class 1's registered prediction FAILED (pane B's test)

`handback/p-faster-rows-prediction-B_2026-11-26.md` (B wrote neither the plan nor the study; scratch only; a baseline added).
On [T3]'s 53 sections, made in fewer pieces than O's count: baseline ceb21f5 **5**, O1 **5**, O1+O2+O3 **5**, O4 **5**, the
same five sections in every build, all made by plain pieces with no rows. E's plan registered "O4 at least 40" and, in
advance, its own degenerating condition ("O4 makes fewer than 27 ... the catalogue's 'faster turn row' class is wrong as
named"). **It fired.**

What this changes:
- **Class 1 stands as a gap (the piece count is real) but its NAME was wrong.** Lifting the turn-row law, even down to a 20 m
  floor, takes the instrument's rows from 0 sections made to 0. The rows lay in more sections (13 to 51) and come closer
  (median worst 7.83 to 3.25 x tolerance), but none crosses.
- **What holds the count past the turn law** (B, inferred from the misses): the AIM (heading, position, pitch and elevation
  missed together by the instrument's solve), and the climb and width rows (width rows refused 377 times under O4).
  The test cannot tell "a person aims better" from "climb and width rows need freeing too".
- **O1 still stands as a correct fix** (it keeps his bar and removes a closed-form cap the bank already dropped), but its
  measured gain on [T3] is 0. O4 no longer has a measured case; the morning question changes accordingly.
- O's [T3] counts on sections 37, 43, 45, 61 and 104 are 1-2 pieces high (plain equal pieces beat them); O's study already
  said "not proven minimal".
