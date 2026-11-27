# L267: Sculpt's Even tool, stage 1 (the banked design pass) and stage 2 (the build). Pane A, L, 2026-11-27

**The order:** the chair's L267 dispatch, 12:52:30Z. **The packet:** `loop/packet_t180_sculpt_even_build_2026-11-27.md` (8f154624).
**The master:** `loop/plan_t180_sculpt_even_2026-11-27.md` with E5 (`handback/p-l265-sculpt-even-A_2026-11-27.md`, the 11:57Z section).
**Base:** builder `landing-1127-l263` c522ea6. I read it in my own detached worktree, `Downloads/t180-wt-l267-even`.
**Evidence:** `handback/p-l267-sculpt-even-build-A_2026-11-27_evidence/`.

---

## Stage 1, registered before the probe (2026-11-27 13:05Z; committed before it ran)

**What is measured: the librarian's direction.** "Even", for a setting whose value differs at the run's two ends, is the smooth ease between the two end values, read where the run is untouched.

I build it as **E6**, in the probe `bank267.js`:
- **The width** goes to 16 m, as in E5.
- **The bank, the centre's height and the sideways shift** each go to the smootherstep ease between their values at the window's two outer ends. Those are s 150 and s 490, where neither the grabs nor the level reach. The window is the plan's: the run 200–440, plus 20 m of margin and 30 m of ramp on each side.
- **The held (inner, left) rim** sits, at each station, where that evened section would put it at the start's width. The sideways shift l is solved so the rim stays there at 16 m and under the evened bank. This is E5's rule, generalised.
- **On a flat road, E6 is E5 exactly** (λ 5.9418 m, H 0).

**E5k is the comparison:** the same level with the bank left as the start has it. That is call 11's lean, "the bank is not flattened".

**What "the held rim stays" can mean when the section turns along the run.** There are three readings:
- **(a) One place across.** This cannot hold on a banked run. On the turn before any grab, the inner rim moves across as the bank rolls in, because the section turns about its centre.
  - inferred: the 12 m section's rim sits at (5.9418, 0.714) in the section. Turned by 20° with the left side up, it lies 5.9418·cos 20° − 0.714·sin 20° = 5.34 m across. Turned the other way, it lies 5.83 m across. At 0° it is 5.9418 m.
  - The flat row 3 (one place within 0.01 m) is a special case: it holds only where the bank is constant.
- **(b) Station by station, where the banked turn before any grab had it** (across). In height, the rim moves only by the section's own growth from 12 to 16 m, turned by the bank, because the centre's height is held (call 10). **This is the reading I register as row 3 on a bank (B3).**
- **(c) Held in place both across and up**, as the grab intends. This contradicts call 10 (the centre's height held), so it is not the row.

**The fixtures.** All are the plan's road: 4 turn pieces, each 60 m at 30° left, from s 200 to 440, 12 m wide, his grab on the outer rim to 16 m.
- **The lead is laid as 100 m + 100 m**, not 200 m. That way the window's near end (s 150) reads the run's own 12 m width and not the lead's own 31 → 12 m ease, the 11:57Z finding (`document.js:667`). The turn and the grabs are unchanged.
- **F:** flat. A regression check: E6 must reproduce E5b.
- **B+:** the plan's banked fixture, with 20° typed on the turn pieces.
  - The bank rolls in over the first turn piece (from s 200) and out over the exit (from s 440).
  - **Sign, inferred from the code:** the panel's bank is "+ = left side up" (`panel.js` `extendOptions`), and the turn's "+ = left" (`turnby.js`). So the plan's banked turn has its inner side up: it is banked away from the turn's centre.
  - The probe records the sign (`at320.leftSideUp`, `headingTowardRDeg`).
- **B−:** the same road with −20°, banked into the turn.
- **Bhold:** −20°, rolled in on a straight before s 140 and out on a straight after s 500. The bank is then constant across the whole window, which is the direction's own case where "a constant is the case where the two ends are equal".

**The rows on a bank** (every 1 m over the run, from T1 and from T2b). The first group measures against the levelled base: the base with no grab, levelled the same way.

| row | what passes |
|---|---|
| B1 | the width's spread ≤ 0.01 m |
| B2 | the outer rim (across and up) is within 0.01 m of the levelled base's: the scuffs are replaced whole. The flat row's "one place" does not apply where the bank turns the section. |
| B3 | the held rim's place across is within 0.01 m of the banked turn's before any grab, at every station (reading b) |
| B4 | nothing outside the window changed |
| B6 | the centre's height is within 0.01 m of its ease (here 0 at both ends) |
| B7 | no red on the run or in the window that the base lacks |
| B8 | the bank is within 0.5° of the banked turn's before any grab, at every station. This is "keeps the designed roll-in". 0.5° is the builder's own measure of a built bank still being the bank asked for (`extend.js` `BUILT_TOL`). |
| B9 | the bank is within 0.01° of the levelled base's. This is "removes the grabs' bank change". |

**It does not hold** (the plan's "did not fix it" bars) if, from T1 or T2b, any of these is true:
- the width's spread is over 0.05 m;
- the held rim across is more than 0.05 m from the turn's before any grab;
- anything outside the window changed;
- the centre's height is more than 0.05 m from its ease;
- there is a red on the run or in the window that the base lacks;
- the bank is more than 0.5° from the turn's before any grab;
- the bank is more than 0.1° from the levelled base's;
- the outer rim is more than 0.05 m from the levelled base's.

**THE FALSIFIER, registered:** the direction fails if, on B+ or B− (the plan's banked turn, either sign), from T1 or T2b, any of these clauses fires. If it fails, I hand back what does not hold and do not build stage 2 for banked roads.

**My predictions, registered with it:**
- **P1. The direction fails on B+ and on B−,** through B8 (the bank more than 5° from the turn's before any grab, somewhere on the run) and B3 (the held rim more than 0.05 m across).
  - Why: the bank rolls in over the first turn piece and out over the exit. The window's end values are therefore 0° at s 150, and at s 490 part of the way through the exit's roll-out (or 0°). An ease between them replaces the designed roll-in and hold.
  - The librarian's direction read the plan's line "its bank runs 0 to 20° along the run" as one roll-in across the run. That line was mine, and it was ambiguous.
- **P2.** On Bhold, E6 passes every banked row from T1 and from T2b. If it fails there, the direction fails even in its own easy case.
- **P3.** On F, E6 reproduces E5b: every flat row and every B row passes.
- **P4.** E5k (the bank kept) on B+ and B−:
  - from the base, B8 passes;
  - from T1 and T2b, it fails B9: the grabs' bank change stays, up to 5.0° from T1.
- **The unwanted outcome:** P1 is wrong and the direction passes on B+ and B−. That would mean my reading of the ease is wrong, and stage 2 starts.

**The one probe:** `bank267.js <tree at c522ea6> <out>`, through `heavy-run.js` at BelowNormal. Its figures go to `bank267.json`.
