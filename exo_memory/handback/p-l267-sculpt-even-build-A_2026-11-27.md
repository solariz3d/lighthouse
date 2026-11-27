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

---

## Stage 1, measured (2026-11-27 13:16Z)

**The run:** `bank267.js`, committed in 57382b3f before it ran. It ran 13:03:24 to 13:12:26Z with 0 errors:
```
node consonance/tools/heavy-run.js --status && node consonance/tools/heavy-run.js --run --priority belownormal --cmd "L267 A bank267 probe" -- node <evidence>/bank267.js <worktree> <out>
```
- checked: the child was node pid 32524, at BelowNormal, with 4.39 s of CPU at 13:03:28Z.
- Every figure below is in `bank267.json` (evidence), in `test[].numbers` and `rows[]`.

**Verdict (checked): the registered falsifier fired.**
- On the plan's banked turn, banked either way (B+ and B−), the direction fails from T1 and from T2b.
- **Stage 2 is not started.** Nothing was built, and the worktree was removed clean.

**E6, the direction.** Every figure is the largest over the run (200–440 m, every 1 m).
- "Before" means the banked turn before any grab.
- "Lv. base" means the base with no grab, levelled the same way.

| road | from | bank off before (°) | held rim across, off before (m) | held rim up, against before (m) | bank off lv. base (°) | outer rim off lv. base, across / up (m) | width spread | centre off its ease | reds: run / window / that the base lacks | ambers |
|---|---|---|---|---|---|---|---|---|---|---|
| F (flat) | T1 | 0 | 0 | +0.4353 | 0 | 0 / 0 | 0 | 0 | 0 / 0 / 0 | 0 |
| F (flat) | T2b | 0 | 0 | +0.4353 | 0 | 0 / 0 | 0 | 0 | 0 / 0 / 0 | 0 |
| B+ (plan's) | base | **17.4425** | **0.5646** | −1.2178 to +0.4875 | — | — | 0 | 0 | 3 / 4 / **1** | 0 |
| B+ | T1 | **17.4425** | **0.5646** | −1.2178 to +0.4875 | 0.0061 | 0.0005 / 0.0008 | 0 | 0 | 3 / 4 / **1** | 0 |
| B+ | T2b | **17.4425** | **0.5646** | −1.2178 to +0.4875 | 0.0132 | 0.0005 / 0.0018 | 0 | 0 | 3 / 4 / **1** | 1 |
| B− (into the turn) | T1 | **17.4425** | **0.1569** | +0.383 to +2.171 | 0.0061 | 0.0002 / 0.0008 | 0 | 0 | 0 / 1 / **1** | 3 |
| B− | T2b | **17.4425** | **0.1569** | +0.383 to +2.171 | 0.0132 | 0.0006 / 0.0018 | 0 | 0 | 0 / 1 / **1** | 3 |
| Bhold | T1 | 0 | 0 | −0.2547 | 0 | 0 / 0 | 0 | 0 | 0 / 2 / **2** | 4 |
| Bhold | T2b | 0 | 0 | −0.2547 | 0 | 0 / 0 | 0 | 0 | 0 / 2 / **2** | 4 |

On every row, nothing outside the window changed (0).

**E5k, the bank kept (call 11's lean),** from T1 / T2b. Figures are the same on all three banked roads unless shown.

| measure | T1 | T2b |
|---|---|---|
| bank off before (°) | 4.9984 | 5.0209 |
| bank off the levelled base (°) | 4.9984 | 5.0209 |
| outer rim off the levelled base, across / up (m) | 0.198–0.317 / 0.626–0.686 | 0.199–0.318 / 0.628–0.689 |
| held rim across, off before (m) | 0.2153 on B+, 0.0964 on B− and Bhold | 0.2163 on B+, 0.0968 on B− and Bhold |

- From the base, E5k leaves the bank exactly as designed (0.0000°).
- Its reds the base lacks: 1 on B+, 1 on B−, 2 on Bhold. They are the same places as E6's.

**The predictions, scored:**
- **P1 confirmed.** On B+ and B−, the bank lands 17.4425° off the design (predicted: over 5°). The held rim lands 0.5646 m (B+) and 0.1569 m (B−) across (predicted: over 0.05 m).
- **P2 failed.** On Bhold, E6 passes B1–B4, B6, B8 and B9 at 0. But it **fails B7: 2 reds in its own ramps** (152–162 and 478–488 m) that the base lacks. They are the same when levelled from the ungrabbed base, so they come from the level, not the grabs.
- **P3 confirmed.** On the flat road, E6 reproduces E5b: every row passes, the held rim is 0.0000 m across, and the rims rise 0.4353 m.
- **P4 confirmed as far as it went.** From the base, B8 is 0.0000°. B9 fails by 4.9984° (T1) and 5.0209° (T2b). P4 did not predict E5k's ramp reds.

**What does not hold, and why:**
1. **The ease overwrites a bank change designed inside the window.** checked.
   - Along B+, every 20 m from s 200:
     - the base: 0, 6.00, 14.00, then 20° to the end;
     - E6: 0.34, 0.86, 1.64, 2.65, 3.91, 5.31, 6.79, 8.26, 9.66, 10.92, 11.93, 12.71, 13.23°.
   - The window's end values are 0° at s 150 and 13.5716° at s 490, part of the way through the exit's roll-out.
   - inferred: the tool reads only the start. On T2b the grabs reach the whole run, so the designed bank is nowhere inside the window to read. No rule that reads only the start can tell the designed roll-in from a grab's bank change there.
2. **The ease does remove the grabs' bank change.** checked.
   - From T1, the levelled bank is within 0.0061° of the levelled base. From T2b it is within 0.0132°: over B9's 0.01° bar, and under the 0.1° fail bar. On Bhold it is within 0.0000°.
   - inferred: the ramps keep a share of the start's own values, and the first grab's change at s 215 reaches into them.
3. **The level's own ramps draw reds on a banked road, and none on the flat one.**
   - checked, the places: the reds lie only in ramps on banked road. B+ and B− draw one in the far ramp only (444–454 and 458–470 m); their near ramp, 150–180 m, is unbanked. Bhold draws one in each ramp.
   - inferred, the mechanism:
     - The level moves the centre about 1.97 m sideways over each 30 m ramp while holding its height (call 10).
     - On a road banked 20°, a sideways move at a held height is a move of Δl·sin 20° ≈ 0.67 m along the road's own normal. That is a dip or a crest under the car, the same class as E3's 0.24 m height ramp that drew reds on the flat.
     - **So call 10's lean holds on a flat road and not on a banked one.** Its banked form would move the centre within the road's own plane (Δh = Δl·tan φ). The held rim would then rise by the cup's growth alone, 0.4353 / cos φ, which is 0.46 m at 20°. Not measured.
4. **Row 3 on a bank (reading b) is measurable,** and E6 meets it exactly where the evened bank equals the design.
   - On Bhold the rim is 0.0000 m across. It sits 0.2547 m lower, which is the section's growth turned by −20°: 1.9407·sin(−20°) + 0.4353·cos 20° = −0.2547. checked against the arithmetic.
   - Where the evened bank leaves the design, the rim leaves with it: 0.5646 m on B+.
5. **Call 11's lean (E5k) keeps the design and keeps the grabs' bank change, 5.0°.** The outer rim then sits up to 0.32 m across and 0.69 m up off the evened road. So keeping the bank does not make a grabbed banked turn even. checked.

**Found while measuring, not asked (checked):**
6. **The plan's banked fixture banks the turn away from its centre.**
   - At s 320 on B+, the inner (left) rim stands 2.7032 m up and the outer 1.3612 m down; the turn bends 120° toward the inner side.
   - Its 4 reds before any grab (222–252, 268–312, 328–372 and 388–432 m) belong to that outward bank at 970 km/h.
   - Banked into the turn (B−), the same road draws 0 reds and 4 ambers before any grab.
   - The plan is amended in place (13:16Z).
7. **The plan's "its bank runs 0 to 20° along the run" was my ambiguous line.**
   - Measured: the bank rolls in over the first turn piece (1.99° at s 210, 14.00° at 240, 20° from 270), holds 20° to s 440, and rolls out over the exit (19.29° at 450, 13.57° at 490, 2.14° at 570).
   - The direction was read off that line, as P1 said. The plan is amended in place.
8. **The fixtures' lead is 100 m + 100 m** (12 m wide from s 100). The plan's T1 and T2b on the turn are otherwise unchanged. On the flat road the starts read as the plan's: T1 has 2 reds on the run; T2b has 2 in the window (192–196 and 444–448 m).

**What might hold** (inferred, none of it measured; for the chair and the librarian):
- **(i) Even the bank only where the design holds it constant.** Bhold shows that the ease then keeps the design and removes the grabs' change exactly.
  - But with the ramps outside the run (call 2), a run that ends where the roll-in ends puts its ramps over the roll-in. The window's ends have to lie on the hold.
- **(ii) Remove the cause rather than even it out.** The grab turned the bank by 5.0° because its pull is horizontal and the banked section's chord is not (plan item 1).
  - A grab that pulled along the section would leave no bank change to even. Then E5, with the bank kept and the centre moved within the road's plane, would be the level.
  - This is the grab (call 9), not this packet's tool.
- **(iii) The centre within the road's own plane** (point 3). Any of these needs it on a banked road.
- One more probe could measure (iii) with the bank kept, on Bhold and B−, from T1 and T2b. That is the chair's call.
