# D678 probe 3: the level's red where the bank changes. Is it the level's, or a line of the designed surface? Pane A, D, 2026-11-27

**The order:** the chair's D678 dispatch, 17:13:19Z, probe 3. **The packet:** `loop/packet_t180_sculpt_even_banked_probe3_2026-11-27.md` (3f4f4532).
**It follows:** `handback/p-d678-even-banked-probe2-A_2026-11-27.md` (3555f20f).
**Base:** builder `landing-1127-l263` c522ea6, in a detached worktree in scratch (`G:/consonance-scratch/a-d678-p3/wt`), removed at the end.
**Tier:** measure only. No build, no install, nothing of the grab committed; his app not launched.
**Evidence:** `handback/p-d678-even-banked-probe3-A_2026-11-27_evidence/`.
**My stake:** probe 2's hand-back gave the mechanism I expect this run to confirm, unchecked: the plane centre turns the bank's change along the road into a
change of the centre's height, and the new centre runs along a line the designed surface already had. That is branch A below. Read its rows with that in
mind; default to refuted.

---

## Registered before the run (2026-11-27 17:24Z; committed before the probe is written or run)

### What the checker reads, from its code (c522ea6), first

- **The leaves-surface red is the load on the centreline only** (`src/validate/index.js:381`: `u === 0 && line.fHold_g < 0`). Its unit is g:
  - `fHold_g` = the specific force along the surface's normal, f·n / g, with f = v²·κ⃗ / (1 − κ⃗·o) + a_T·T + g·ŷ, plus the car's downforce d·v / g;
  - the bar: **red below 0 g**.
- **Its speed:** the app checks an open track at full speed (`app/validate-ui/panel.js:69`: `fullSpeed: true`), so v = 970 km/h (`limits.js` `vmaxKmh`).
  - The downforce there is (200 / 850)·269.4 / 9.81 ≈ 6.5 g. inferred, arithmetic.
- **It reads every lateral line u of the profile too** (`:340-378`), but with the centreline's curvature scaled by 1 / (1 − κ⃗·o).
  - **The roll rate is left out by design** (`:16-17`: "the roll RATE's contribution (the line swinging about T as φ changes) is left out").
  - That roll rate is exactly the term a line off the centre picks up where the bank changes. inferred, from the surface's geometry: a line at a fixed offset X
    across a surface whose bank φ changes along the road has a normal curvature of about X·φ″ beyond the centreline's.
  - **So the checker as it is cannot read this red off the centre, on any road.** Row 2 is therefore measured two ways (below).
- **How the level's centre line is drawn:** `src/core/adapter.js` `offsetPath` lifts each base station by h·UP + l·R at the same s, and takes the new
  centreline's curvature analytically from h, l and their first two derivatives. The base and the levelled road therefore share the station plane at each s
  (the same heading channel, the bank kept).

### The fixtures (probe 2's, rebuilt from even678.js's code, with nothing grabbed)

- B− and B+ (plan layout, bank ∓20° and ±20°), Bhold (hold layout, −20°), each with the default section (the "cup" the grab's centre drop comes from).
- C1 from base: probe 2's `levelC1` on each, unchanged.
- **Added (mine): cup-0 copies, B−0, B+0, Bhold0** (`makeBase` with cup 0, the way probe 2 made F0).
  - Why: on the default section the section deepens as it widens (E5's held rim rises 0.4353 m on the flat road, 0.4633 m on Bhold; checked in probe 2).
  - So row 1 as the packet words it cannot read nothing even on Bhold. The cup-0 copies take that known change out.
- **Checked before any row is read (K0):** each rebuilt base and C1 from base is byte-identical to probe 2's (sha256 of `serialize`, against `even678.json`
  `rows[].sha`), for B−, B+ and Bhold.

### The rows

| row | what is measured | pass | fail |
|---|---|---|---|
| **K0** | rebuilt fixtures equal probe 2's (sha256); my direct `validate` reads the same leaves-surface reds as the check job, on each base and each C1 from base | equal | any difference: stop, say so |
| **K1** | my measure (below) on C1-from-base's own centreline against `validate`'s centreline `fHold_g`, at every 2 m station in the window 150–490 | ≤ 0.001 g everywhere | over 0.01 g anywhere: stop, "the question cannot be separated with my measure" |
| **1a** | **The same surface, widened:** every 1 m over the window 150–490, the base's section sampled every 0.25 m across its own width; from each point, along the base's normal there, the distance to the levelled road's section in the same station plane. The largest | ≤ 0.01 m | > 0.05 m |
| **1b** | the same distance's change along the road: for each point across, its largest minus its smallest over the levelled stretch 180–460 (the ramps left out, where the level changes the section on purpose). The largest over the points | ≤ 0.01 m | > 0.05 m |
| **2** | **The checker along the level's centre line, on the base:** at each of the checker's 2 m stations in the window, the base's own surface at the across-position of C1's centre there (projected along the base's normal), lifted from the base path the way `offsetPath` lifts a centreline; then the checker's centreline load, `fHold_g`, at its speed, on that line, with the base's surface normal there | the line reads no red at a station: `fHold_g` ≥ 0 | red: `fHold_g` < 0 |
| **2x** | the checker as it is: its own lateral lines on the base (`validate`, every line kept) at the two profile u's either side of that across-position, `fHold_g` | reported, no bar | |
| **2c** | row 2 with the across-position held at one value (its median over the run 200–440) | reported, no bar | |
| **3** | **Bhold the control:** 1b and 2 read nothing there; 1a on Bhold0 reads nothing | 1b ≤ 0.01, row 2 ≥ 0 g at every station, 1a on Bhold0 ≤ 0.01 | otherwise the control fails, said so, and no branch is read |

**My measure (row 2 and K1):**
- The lift is `offsetPath`'s own formula, re-run on the base path at the checker's stations, with the line's sideways and height offsets (l, h) in place of a
  document's. Their first two derivatives are taken by central differences at 0.01 m (one-sided at a piece's ends, so each station reads its own piece, as
  `offsetPath` does).
- K1 runs the same function on C1's own l and h, so it checks the lift and the load together against the checker.

### Each branch, and what would make it true, registered

- **Branch A, "the level adds no bump; the checker reads a line of the designed surface it did not read before"**, if all of:
  - K0, K1 and row 3 hold;
  - row 2 reads red (`fHold_g` < 0) at one station or more inside each of C1-from-base's red ranges, B− 256–258 and B+ 200–206;
  - 1b is at most 0.05 m on B− and B+.
  - Then I say what a car driving that line on the base feels there, in g against the bar of 0 g, at the worst station.
- **Branch B, "the level makes the red"**, if row 2 reads `fHold_g` ≥ 0 at every station of both ranges.
  - Then I name what in C1 makes it, and the alternative below is run.
- **Mixed:** red on one road and not the other, or row 2 red while 1b is over 0.05 m (the line and the level's shape both in it). Said as such; the
  alternative is run.

### The alternative, run only in branch B or mixed (registered now, with its failing result)

- **Alt F, C1 fitted:** the same level, but the window's h control points are fitted by least squares to the evaluated in-plane target (h = h_ease + the
  sideways move times tan φ, every 0.25 m), instead of taking the target's value at each control point.
  - The cause it tests: C1 builds a product (l · tan φ) at control points, and a B-spline of a product is not the product of B-splines. Probe 2 measured the
    centre up to 0.0147 m off its in-plane target on B− (R4), and at 970 km/h a centimetre over a few tens of metres is several g.
- **Alt F fails if any of:**
  - from base on B− or B+, any red in the run or window that the base lacks;
  - its centre is more than 0.002 m off its in-plane target anywhere in the window;
  - anything outside the window changed;
  - on Bhold, any red, or any figure more than 0.001 m from C1's.

### Predictions (inferred, mine)

- K0 and K1 hold.
- **Row 2 reads red at both ranges: branch A.** The twist term X·φ″ with X about −2 m is negative where φ″ has the sign that crests the right side of the
  road: at the end of B−'s ramp (0 to −20°) and the start of B+'s (0 to +20°). Those are exactly where the two reds sit. Near those piece joints the turn's own
  curvature, which presses the car into a bank into the turn, is small.
  - The size, inferred: a smoothstep ramp of 20° over 60 m has |φ″| up to about 5.8·10⁻⁴ rad/m²; × 2 m × v² (72,600 m²/s²) ≈ 8.6 g off the road, against
    about 0.94 g of gravity and 6.5 g of downforce pressing it on. **So `fHold_g` within about −1 g of zero**, at a station or two.
- **Row 2x reads no red** there: the checker's lateral lines leave the roll rate out.
- **1a fails on the cupped roads** (inferred, about 0.43–0.46 m, the section's deepening at the rims), **Bhold included**. On the cup-0 copies it is at most
  0.02 m: between, from C1's control-point error.
- **1b passes on Bhold and Bhold0, and is between on B− and B+** (inferred 0.01–0.05 m). The cause, inferred: with the held rim's place across kept and the
  rim 0.435 m higher, the deeper section slides across the station frame by about 0.435·tan φ as the bank ramps, up to 0.158 m at 20°.
- C1 from base on B−0 and B+0 draws the same red stations as on B− and B+.

### The unwelcome outcomes, in the words that would make them true

- **U1: "row 2 reads no red at 256–258 or at 200–206."** Then my probe-2 mechanism was wrong: the level makes the red.
- **U2: "1b reads more than 0.05 m on B− or B+."** Then the levelled surface is not the base widened along the road, and the level adds shape of its own.
- **U3: "K1 fails."** Then my measure does not reproduce the checker, and the question cannot be separated with it.
- **U4: "row 2 reads a red on Bhold."** Then my measure reads reds the checker's own geometry does not hold, and the control fails.

### Amendment before the run (17:37Z, committed with the probe, nothing run yet)

Found while writing the probe, from the section's code (`src/geom/profile.js` `normalAt`):
- **On the cupped roads, row 2 and C1's centre differ by the dish too.**
  - The base's surface at the foot (about 2 m off its centre) slopes by the dish's own angle there, so its normal leans toward the road's middle.
  - C1's centre sits at its own section's flat bottom, with the normal straight up the section.
  - At the stations in question that lean multiplies the turn's sideways load, so on the cupped roads row 2 can differ from C1's centreline load by the
    dish alone, in either direction, whatever the level adds.
- So, added before the run (no bar on any of them; **the branch rule above is unchanged and reads the cupped B− and B+ rows**):
  - **2n:** row 2 with the normal taken straight up the section (as C1's centre has it), on every fixture. Reported.
  - **Row 2 on the cup-0 copies B−0 and B+0** as well, where the surface is the plane C1's centre is built in, so the dish cannot enter. Reported beside the
    cupped rows.
  - **U5, the unwelcome outcome this opens: "row 2 reads no red on the cupped B− or B+, and red on B−0 and B+0."** By the rule that is branch B or mixed and
    Alt F runs. I will say then that the difference between the cupped and the cup-0 rows is the dish at the foot, and not claim it as the level's.
- **How the probe finds the foot:**
  - C1's centre, in the base's station plane, projected along the base's normal onto the base's section, by bisection.
  - The bank is the document's channel at s (stated so that the diagnostics, the path's roll against the channel at the stations, can be read against it).
- **Alt F is written into the probe and gated there by the branch rule above.** It runs only in branch B or mixed; in branch A it is not run, and the output
  says so.

### What I will say about C1 and the tool, fixed now

- **In branch A:**
  - C1 is buildable as it is for flat roads, constant banks and ramping banks: the red is the designed surface's.
  - Where the level draws one, the tool should say that the new centre runs along a line the road already had, and that a car on it at the checker's speed
    already lifted off there before the level. The cure is the bank's change (a longer or later ramp), not the level.
  - The checker's lateral lines missing the roll rate is a separate finding for him, not a change made here.
- **In branch B:**
  - C1 is buildable for flat and constant-bank roads only.
  - If Alt F holds, Alt F is the build for ramping banks; if not, the level should leave a ramping bank's stretch alone and say so.

---

## Run 1, measured (18:13–18:17Z): the control failed, so no branch is read by the rule

**How it ran:**
- checked: `run1/run.log`. Started 18:13:05Z, waited for a heavy-run slot, ran under heavy-run (below normal, 8 of 16 CPUs), exit 0 at 18:17:24Z. The evidence
  log drops the 4 "heavy-run: waiting" lines (7 lines → 3).
- checked: `run1/even678b.json` (sha256 bb40a2bfd359b0ae…). `started` 18:16:54.870Z, `ended` 18:17:24.787Z, `errors` [].
- acs.exe was checked absent in the launch command, and a watch over the run saw no acs.exe start.
- The probe is `even678b.js` at 6c4f0c8f (blob 7e140bca), run unchanged.

### K0: holds

checked: `run1/even678b.json` `K0`.
- **Same bytes:** B−, B+ and Bhold rebuild to probe 2's bytes (base and C1 from base).
- **Same reds:** my direct `validate` reads the check job's leaves-surface reds on all six fixtures:

| fixture | base | C1 from base |
|---|---|---|
| B−, B−0 | none | 256–258 |
| B+, B+0 | 222–252, 268–312, 328–372, 388–432 | 200–206, 222–250, 268–312, 328–372, 388–432 |
| Bhold, Bhold0 | none | none |

- C1's centre off its in-plane target (`centreOff`, the document's bank): B− 0.0147, B+ 0.0125, B−0 0.0141, B+0 0.0141, Bhold 0, Bhold0 0.

### K1: between its bars on four fixtures

checked: `K1`, the largest |mine − the checker's| centreline `fHold_g` over the 171 stations of 150–490:

| fixture | B− | B+ | B−0 | B+0 | Bhold | Bhold0 |
|---|---|---|---|---|---|---|
| largest difference (g) | 0.0053 | 0.0045 | 0.0050 | 0.0050 | 0.0000146 | 0.0000141 |
| at s | 450 | 450 | 450 | 450 | 170 | 170 |

- That is over the 0.001 g pass bar and under the 0.01 g fail bar. inferred: a central difference across a knot of h. Not looked into.
- It is three orders below the loads that decide the question (−9 to +10 g).

### Row 1: fails everywhere but Bhold0's 1a

checked: `row1`.

| fixture | 1a (m) | 1a at | 1b (m) | 1b at u | the along-T displacement (m) | points with no intersection |
|---|---|---|---|---|---|---|
| B− | 0.5485 | s 244, u −6 | 0.4189 | −6 | 0.993 | 262 |
| B+ | 0.523 | s 216, u −6 | 0.4044 | −6 | 0.8189 | 0 |
| Bhold | 0.4872 | s 393, u −6 | **0.0458** | 5.75 (0.4033 to 0.4491) | 0.6546 | 343 |
| B−0 | 0.067 | s 217, u 5.75 | 0.1335 | −6 (−0.0665 to 0.067) | 0.9515 | 197 |
| B+0 | 0.067 | s 217, u 5.75 | 0.1335 | −6 | 0.9515 | 197 |
| Bhold0 | **0.0092** | s 473, u 6 | 0.0021 | 6 | 0.6284 | 251 |

**Two faults in my measure, mine:**
- **The along-T displacement.** The levelled section sits in the plane square to the levelled centreline, so where the centre moves sideways (the ramps
  150–180 and 460–490) its far points lie up to 0.99 m along the road from the base's station plane. Projecting them into that plane is only exact on a plane.
- **inferred: the 1b range.** My "levelled stretch, 180–460" assumed the level's width ramp ends at 180 and starts at 460. The width evaluated there
  is set by control points whose weight is under 1, so it can still be ramping inside the range. Bhold's 1b, at its held rim on a constant bank, varies by
  4.58 cm; that is the deeper dish still widening. Not checked in run 1.

### Row 3: the control fails

checked: `row3` → `{"r1bBhold":0.0458,"r1aBhold0":0.0092,"row2MinBhold":7.3728,"pass":false}`.
- Bhold 1b is 0.0458 m, over the 0.01 bar.
- Bhold0 1a (0.0092) and row 2 on Bhold (lowest +7.3728 g, at s 196) pass.
- **By the registered rule no branch is read. Alt F did not run** (the probe gated it, and wrote `altF: null`).

### What row 2 reads (reported, not read as a branch)

checked: `ranges` and `row2[fx].rows`.

**B− and B−0, stations 256 and 258:**

| measure | B− 256 | B− 258 | B−0 256 | B−0 258 |
|---|---|---|---|---|
| row 2 (the surface's slope at the foot) | −6.2436 | −0.2619 | −6.0912 | −0.0224 |
| 2n (the normal straight up the section) | −7.0625 | −0.6724 | | |
| 2c (one across-position) | −6.3502 | −0.277 | | |
| C1's centre, the checker | −1.7297 | −2.5526 | −1.1992 | −2.1265 |
| the base's centre, the checker | +10.1895 | +8.1764 | | |
| 2x, the checker's lateral lines either side of the foot | 11.07 and 10.53 | 8.39 and 8.26 | | |

**B+ and B+0, stations 200 to 206:**

| measure | 200 | 202 | 204 | 206 |
|---|---|---|---|---|
| B+ row 2 | +7.4602 | −0.3176 | −7.7546 | −7.0948 |
| B+ C1's centre | −2.4838 | −3.1307 | −3.7493 | −2.3629 |
| B+0 row 2 | +7.4627 | −0.74 | −8.8755 | −8.84 |
| B+0 C1's centre | −2.839 | −3.4957 | −4.1209 | −2.7413 |
| B+ 2x (both lines) | 7.45 or more | | | |

**What this shows:**
- **The checker's lateral lines (2x) read no red there on any fixture.** They leave the roll rate out, as their header says.
- **The base's surface along the foot (row 2) reads red there**, on the cupped roads and the cup-0 copies alike. But it does not land on C1's stations:
  - on B−, row 2 is red at 254, 256 and 258, while C1 is red at 256 and 258;
  - on B+, row 2 is red at 202–206, while C1 is red at 200–206; at 200, row 2 reads +7.46 and C1 −2.48.
  - inferred: C1's centre is a B-spline through control points, so it spreads the surface's corner over the control points' support.

### What the diagnostics found, and it moves the question

checked: `diag`.
- **The path's roll is not the document's bank channel on the four ramping fixtures.** It differs by up to **2.4286°** on B−, B+, B−0 and B+0, and by 0 on
  Bhold and Bhold0.
- checked: `src/core/adapter.js:403-433` (c522ea6) and `:564` (`const plan = bankPlan(doc)` in `toSegments`). The builder re-rounds the bank:
  - wherever the document's roll accelerates faster than `BANK_BAR` (29.4 / (10 · 170²) = 1.02·10⁻⁴ rad/m²: 3 g at a wheel 10 m out at 170 m/s), it rounds
    the corner over a window with a quintic;
  - "Only the BUILT roll moves; the document is not rewritten."
- checked: `row2.Bplus.rows[].phiDeg`, the path's roll every 2 m. On B+ it runs 0, 0.01, 0.0628, 0.1885, 0.41, 0.7432 … 10 at 200…230: a smooth S over the
  whole piece 200–260.
- checked: the document's bank channel at those places (probe 2's `bankEvery10`): 0 at 200, 1.992 at 210, 6.0014 at 220, 10 at 230.
- The document's φ″ (`phiDD`) is 0 along the ramp and up to **0.0011 rad/m²** in its two 8 m corners, 200–208 and 252–260.
- **C1 sets its height from the document's channel** (`levelC1`: `Math.tan(at(d1, 'phi', s))`). So its centre follows the document's sharp corners, in a
  plane the builder does not build. My row 2 used the document's channel too (registered so), so it measured the document's surface, not the built one.
- inferred: from the second differences of those printed rolls, the built bank's φ″ peaks near 5.5·10⁻⁴ rad/m² around s 212 on B+ (and 248 on B−). That
  is half the document's corner, and still over the bar, presumably because the window may not cross the piece's joints.

**So the question as asked (the level's, or a line of the designed surface?) turns on which surface is the designed one, and run 1 measured the wrong one.**
The road he drives and the checker reads is the built bank. Run 2 measures that.

---

## Run 2, registered before it runs (18:23Z; committed before its probe is written)

**The one question again, on the built road:** at C1's red stations (B− 256–258, B+ 200–206), does the built road's own surface, along the line C1's centre
takes, read red?

### The rows

- **K2: the built bank reproduces the path's roll.**
  - `AD.bankPlan(doc)[p].fn` (local s), or the channel where it is null, against the path's roll at every 2 m station of 150–490, on all six fixtures.
  - Pass: ≤ 10⁻⁹ rad everywhere. Fail: anything more: stop, and say "I cannot read the built bank".
- **2b: row 2 on the built bank.** As row 2 in every other respect, with the built bank in place of the channel, in both the foot and the line's offsets.
  - Red below 0 g.
  - Also reported, no bar: 2bn (the normal straight up the section) and 2bc (one across-position, the median over the run).
- **C1b: the level reading the built bank.** `levelC1` with one change: `tan` of the built bank of the levelled road at the control point, in place of the
  channel.
- **Row 1′**, C1b and C1 against the base:
  - on the built surfaces, as row 1 measures (the base's normal, the station plane);
  - over the stations where the levelled road's width evaluates to 16 ± 0.001 m, so the level's own width ramp and the along-T displacement are out;
  - bar ≤ 0.01 m "the same surface", > 0.05 m "not". The branch reads the cup-0 copies; the cupped rows are reported (the dish deepens by design).
- **Row 1 diagnostic (no bar):** row 1 on Bhold, as run 1 ran it, with each station's distance at u 5.75 kept, to place its 4.58 cm.

### C1b's failing result, registered now

C1b fails if any of:
- any leaves-surface red in the run or window that the base lacks, on B−, B+, B−0 or B+0;
- any red on Bhold or Bhold0, or C1b not byte-identical to C1 there (their built bank is the channel);
- its centre more than 0.05 m off its in-plane target on the built bank (passes at 0.01 or less; between is said);
- anything outside the window changed.

### How the run is read

- **If 2b reads no red at the C1 red stations** (B− 256–258 and B+ 200–206, cupped and cup-0): **the red there is the level's**.
  - Its cause: C1 reads the document's bank where the road is built with the bank plan's.
  - C1b is then the alternative, and its rows above say whether it holds.
- **If 2b reads red there:** the built road has the red on that line too, and **the red is the designed surface's.**
- **Wherever else 2b reads red,** I say so by station. A red the built road holds on the new centre's line is the designed surface's, wherever it lands.

### Predictions (inferred, mine)

- K2 holds.
- **2b reads no red at B− 256–258 or at B+ 200–206.** The built bank's acceleration there is about a third of its peak (smootherstep-shaped over the
  piece), so the twist at 2 m is about 4–6 g, under the 7.4 g pressing the car on.
- **2b reads red on B+ somewhere in 206–224, and nowhere on B−.**
  - On B+ the built bank's roll acceleration peaks around 212 (about 8 g at 2 m), where the turn begins to pull the car off a road banked away from it.
  - On B− the turn presses the car into a bank into the turn (about 20 g at 247).
- **C1b:**
  - draws no red the base lacks on B− or B−0;
  - draws one on B+ and B+0, at the stations where 2b is red, so **C1b fails there by its rule**, and that red is the built road's own;
  - is byte-identical to C1 on Bhold and Bhold0;
  - its centre is within 0.015 m of its target: between, the control-point error probe 2 measured.
- **Row 1′:**
  - C1b against the base on B−0 and B+0 is between (≤ 0.015 m, the control-point error);
  - C1 is over 0.05 m (the document's corners against the built bank, about 2·Δtan φ ≈ 0.08 m);
  - Bhold0 holds both.
- The row 1 diagnostic puts Bhold's 4.58 cm at the two ends of 180–460.

### The unwelcome outcomes

- **U6: "2b reads red at 256–258 or at 200–206."** Then the built road has C1's red too, and my bank-plan account is wrong or partial.
- **U7: "C1b draws a red on B− that the base lacks."** Then reading the built bank does not cure the level.
- **U8: "K2 fails."** Then I cannot reproduce the built bank, and I stop.
- **U9: "Row 1′ for C1b on B−0 is over 0.05 m."** Then the level adds shape of its own even on the built bank.

---

## Run 2, measured (18:26–18:28Z): the red at the registered stations is the level's

**How it ran:**
- checked: `run2/run2.log`.
  - It started at 18:26:31Z. acs.exe was absent and there was no exclusive hold, both checked in the launch command.
  - It ran under heavy-run (below normal, 8 of 16 CPUs) and exited 0 at 18:28:07Z.
  - A watch over the run saw no acs.exe ("run 2 finished, no acs.exe seen (18:28:08Z)").
- checked: `run2/even678c.json` (sha256 ac9a58b197e25814…). `errors` [].
- The probe is `even678c.js` at 12ed5881, committed after the registration (33e7c780) and before the run.

### K0 and K2: hold

- checked: `K0`. It holds again: the same bytes as probe 2 on B−, B+ and Bhold, and the same leaves-surface reds read both ways on all six fixtures (the table in run 1).
- checked: `K2`. The built bank (`AD.bankPlan(doc)[p].fn`, or the channel where it is null) equals the path's roll at all 171 stations of 150–490, on
  all six fixtures: **0 rad** largest difference. The levelled road's built bank equals the base's: 0 rad (the level moves no bank or turn).

### 2b: no red at the registered stations, on all four ramping fixtures

checked: `ranges2b`. The base's built surface along C1's centre's line, read with the checker's centreline load at its speed. The checker's speed here
is 970 km/h, its full speed on an open track. Red is fHold below 0 g.

| fixture, s | 2b (g) | 2bn, flat normal (g) | C1's centre, the checker (g) | the built bank (°) |
|---|---|---|---|---|
| B− 256 | +5.8394 | +4.9511 | −1.7297 | −19.9372 |
| B− 258 | +5.3868 | +4.9429 | −2.5526 | −19.99 |
| B−0 256, 258 | +5.4814, +5.3795 | the same | −1.1992, −2.1265 | the same |
| B+ 200 | +7.1287 | +7.0286 | −2.4838 | 0 |
| B+ 202 | +4.9116 | +4.6545 | −3.1307 | 0.01 |
| B+ 204 | +3.4656 | +2.8001 | −3.7493 | 0.0628 |
| B+ 206 | +2.6412 | +1.4044 | −2.3629 | 0.1885 |
| B+0 200–206 | +7.1202, +4.6646, +2.7357, +1.2709 | the same | −2.839, −3.4957, −4.1209, −2.7413 | the same |

**By the registered reading** (`reading` in the json: "no 2b red at the C1 red stations: the red there is the level's"): **the red there is the level's.**

**Its cause:** C1 reads the document's bank, where the road is built with the bank plan's.
- checked (run 1 `diag`): the two banks are up to 2.4286° apart.
- checked (`C1b[fx].c1CentreOffBuilt`): C1's centre is 0.0637 to 0.0714 m off its in-plane target on the built road, against 0.0125 to 0.0147 m on the
  document's.
- The document's bank turns its corners in 8 m at 0.0011 rad/m² (run 1), while the built bank's largest acceleration is 0.00055 rad/m², at s 212.
  checked: `windowWide2b.Bplus.maxPhiDD`.
- So C1's centre follows a corner the road does not have, and the checker reads the bump that leaves.

### C1b, the alternative: it cures the registered stations, and fails its rule on B+ and B+0

checked: `C1b`, `ranges2bC1b`, `windowWide2bC1b`.

**C1b's own centre at the registered stations, read by the checker** (it was −1.2 to −4.1 g under C1):
- B−: +5.5732, +4.3671
- B−0: +5.7581, +4.4939
- B+: +3.9992, +3.5767, +3.16, +1.8965
- B+0: +3.9104, +3.4591, +3.0153, +1.6647

| | B− | B+ | Bhold | B−0 | B+0 | Bhold0 |
|---|---|---|---|---|---|---|
| leaves-surface reds | none | 208–248, 268–312, 328–372, 388–432 | none | none | as B+ | none |
| the base's | none | 222–252, 268–312, 328–372, 388–432 | none | none | as B+ | none |
| centre off its target on the built bank (m) | 0.0156 | 0.0151 | 0 | 0.0151 | 0.0151 | 0 |
| byte-identical to C1 | | | yes | | | yes |
| anything outside the window changed | 0 | 0 | 0 | 0 | 0 | 0 |

Read against its failing result, registered at 33e7c780:
- **B−, B−0, Bhold, Bhold0: C1b holds.**
  - No red at all on B− or B−0.
  - Bhold and Bhold0 are byte-identical to C1, with no red.
  - The centre is between its bars (0.0151–0.0156 m: over 0.01, under 0.05), said so.
- **B+ and B+0: C1b fails**, by "any leaves-surface red in the run or window that the base lacks". Its first red range starts at 208, and the base's
  at 222, so 208 to 221 is red the base lacks.
  - **My probe's own flag reads `fails: false` there. That flag is wrong.** It counts a red range as the base's whenever it overlaps one, and
    208–248 overlaps 222–252. The test was copied from Alt F's in run 1. The verdict above is the rule read by hand against the printed ranges.

**What the B+ red at 208–221 is (reported station by station, as the reading registered).** checked: `row2b` and `row2bC1b`.

- **B+0 (cup 0): the built road's own surface on the new centre's line reads red from 210.**
  - 2b along the line, against the bar 0 g:

    | s | 208 | 210 | 212 | 216 | 220 | 222 | 224 |
    |---|---|---|---|---|---|---|---|
    | 2b (g) | +0.1778 | −0.6624 | −1.389 | −2.9802 | −5.1983 | −6.5869 | −8.1125 |
    | the base's centre (g) | +7.2746 | +6.9751 | +6.4166 | +4.2135 | +0.3858 | −2.0861 | −4.8303 |

  - **That is what a car driving that line on the base feels**, at 970 km/h, 2.0 m to the left of the base's centre (uFoot −2.0).
  - The checker's own lateral lines at u −3 and −1.5 read +6.98 at 210, +4.26 to +4.31 at 216 and +0.52 to +0.65 at 220. They do not see it:
    they leave out the roll rate (the checker's header, lines 16–17).
  - inferred: the size is the bank's twist. A line X m from the roll's axis takes X·φ″·v². At 2 m, 0.00055 rad/m² and 269 m/s, that is about 80 m/s²
    (8 g).
  - C1b's own centre reads red at 208 (−0.6272, where 2b reads +0.18) and departs from 2b by up to about 2.4 g between stations (210: −3.04 against
    −0.65; 216: −0.98 against −2.94). inferred: that is its 0.015 m centre error.
- **B+ (cupped): 2b, with the old dish's normal, reads no red until 224** (+2.28 at 208 to +1.03 at 222). **2bn, with the flat normal, reads red from
  210** (−0.46 at 210 to −5.91 at 222). C1b's centre is red from 208 (−0.25, −2.54, −1.24, −0.32, −0.32, −1.24, −2.56, −4.23 at 208…222).
  - inferred: the level re-centres the dish, so the new centre's normal is the flat one, and the tilt the old dish had there no longer holds the car
    on. So on a cupped road this red comes with the level's move of the dish, not with the old surface.

### Row 1′ and the row 1 diagnostic

checked: `row1p` and `row1diag`.
- **The full-width stretch:** 195–445 on the plan fixtures and 189–451 on the hold fixtures (251 and 263 stations). The along-T displacement there is at
  most 0.15 m, against 0.99 m in run 1.

| C1 / C1b against the base (m) | B−0 | B+0 | Bhold0 | B− | B+ | Bhold |
|---|---|---|---|---|---|---|
| C1 1a | 0.067 | 0.067 | 0.0001 | 0.5485 | 0.523 | 0.4872 |
| C1 1b | 0.1335 | 0.1335 | 0 | 0.1472 | 0.1437 | 0.0027 |
| C1b 1a | 0.0146 | 0.0146 | 0.0001 | 0.4965 | 0.4717 | 0.4872 |
| C1b 1b | 0.029 | 0.029 | 0 | 0.0476 | 0.0455 | 0.0027 |

- **On the cup-0 copies:**
  - C1 is "not the same surface" (over 0.05 m);
  - C1b is between (1a 0.0146, 1b 0.029). inferred: its 0.015 m centre error, seen as a ±0.015 m wobble at the far rim.
  - Bhold0 holds both.
- The cupped rows are reported, not read: the dish deepens by design.
- **The row 1 diagnostic places run 1's Bhold 4.58 cm.** Bhold's distance at u 5.75:
  - 0 at 150, 0.4033 at 180, 0.4491 from 194 to 446, 0.4033 at 460;
  - so it is all in the width ramp's ends, 180–194 and 446–460. On the full-width stretch Bhold's 1b is 0.0027 m.
- **Run 1's control, re-read on run 2's measure, holds:** Bhold 1b 0.0027, Bhold0 1a 0.0001, and 2b on Bhold has its lowest at +7.3728 g (196).
  - Run 2 did not register a row 3 of its own; this is said, not used as a gate.

### Predictions, scored

| prediction (registered at 33e7c780) | result |
|---|---|
| K2 holds | yes (0 rad) |
| 2b reads no red at B− 256–258 or B+ 200–206 | yes, on all four |
| 2b reads red on B+ somewhere in 206–224, and nowhere on B− | yes: B+ from 224, B+0 from 210; none on B− or B−0 |
| C1b draws no red the base lacks on B− or B−0 | yes |
| C1b draws one on B+ and B+0 where 2b is red, so it fails there by its rule | it fails there. On B+0, 2b is red from 210 and C1b from 208. On B+, 2b is not red until 224: **wrong for the cupped road** |
| C1b byte-identical to C1 on Bhold and Bhold0 | yes |
| C1b's centre within 0.015 m | **no**: 0.0151–0.0156 (between) |
| row 1′: C1b between on B−0 and B+0, ≤ 0.015 m | between, yes. 1a 0.0146, but **1b 0.029: over my 0.015** |
| row 1′: C1 over 0.05 m (about 0.08) | yes: 1a 0.067, 1b 0.1335 |
| row 1′: Bhold0 holds both | yes |
| the row 1 diagnostic puts the 4.58 cm at the ends of 180–460 | yes: 180–194 and 446–460 |

**Unwelcome outcomes:** U6, U7, U8 and U9: none came.

---

## The answers the packet asked for

**1. The red at B− 256–258 and B+ 200–206: the level's.** C1 sets its centre's height from the document's bank. The builder builds the bank plan's,
which re-rounds the document's 8 m corners (`adapter.js` `bankPlan`; "Only the BUILT roll moves; the document is not rewritten").
- The built road's surface along C1's line reads +1.3 to +7.1 g there (2b). C1's centre reads −1.2 to −4.1 g.
- The packet's other reading (the checker reading a line of the designed surface it never read) does not hold at those stations. It does hold
  4–14 m on, on B+0 (answer 3).

**2. Its cause, and the alternative.** The cause is the document's bank in C1's height. The alternative of my choosing was C1b, the same level reading
the built bank; its failing result was registered first (33e7c780). C1b:
- removes the registered reds on all four ramping fixtures;
- adds no red on B− or B−0;
- leaves the constant bank byte for byte as C1;
- **fails its rule on B+ and B+0** (208–221 red, which the base lacks at its centre).

**3. Whether C1 can be built as it is:**
- **Constant bank: yes.**
  - checked: Bhold and Bhold0 have no red, their centre is on target to 0, and C1b is byte-identical to C1 there.
- **Flat: yes.**
  - inferred: the bank plan leaves alone a bank that never accelerates past its bar ("A bank that never accelerates faster than the bar is built
    exactly as before", `adapter.js` header to `bankPlan`). So on a flat road C1 and C1b are one level.
  - L265's flat rows passed. Not re-measured here.
- **Ramping bank: not as it is.** It needs the one change C1b makes: read the built bank, not the channel. With it:
  - **Where the bank turns the road into the turn (B−, B−0): C1b draws nothing.**
  - **Where the bank rolls the road away from the turn (B+0, cup 0):** the new centre's line is red on the built road itself from 210. It already
    lifts at the checker's speed there (−0.66 g at 210 down to −8.1 g at 224, against the bar 0 g). The old centre does not lift (+6.98 g at 210),
    because the roll's twist is nothing on its own axis. The level adds no bump there; it puts the centre on that line.
  - **On a cupped road (B+):** the same red comes with the level's re-centring of the dish (2bn red from 210; 2b with the old dish's tilt not red
    until 224). It is the level's, and the dish is why. inferred.
  - C1b's own centre sits 0.015 m off its target, which moves its red by a station (208 on B+0) and its loads by up to about 2.4 g. Probe 2's
    control-point error; Alt F's least-squares fit was the registered cure for it and was not run.

**4. What the tool should tell him where a red of this kind is drawn.** My recommendation:
- **The 256–258 and 200–206 kind:** nothing. The tool should not draw it; it is C1's error, and reading the built bank removes it.
- **The B+0 kind, where the built road already lifts on the new centre's line:** a sentence at the red, in his words. For example: *"The bank rolls
  here. The new middle runs 2.0 m from the old one, and that line rises and falls with the roll. At the checker's speed a car on it already leaves the
  road here on the track as it stands; the old middle did not, because the roll turns about it. The level adds no bump; a longer bank change here, or
  a level that ends before it, would."* The figures to carry are:
  - the shift (2.0 m);
  - the line's load on the old road at the worst station (2b, in g);
  - the old centre's load there.
- **On a cupped road:** the same sentence, with "the level moves the bottom of the dish onto that line" in place of "already leaves the road".

---

## Corrections, mine

- **Probe 2 ran while he drove.** acs.exe was up from 16:35:39Z; probe 2 ran 16:39:29 to 17:03:36Z, and I made no acs check. It was found at 17:24Z
  and written into probe 2's hand-back (a044d6c8) and my memory. Probe 3's runs each checked acs.exe in the launch command and watched for it during
  the run.
- **Run 1 measured the document's surface, not the built one.** I registered row 2 on the document's bank channel without reading what `toSegments`
  builds. `adapter.js`'s header says it plainly at `bankPlan`. That cost run 1's question.
- **Run 1's row 1 range ran into the level's width ramp** (180–194 and 446–460). The registered control failed on that, not on the surface.
- **Run 1's row 1 projected across up to 0.99 m along the road.** It is exact only on a plane.
- **Predictions that failed:**
  - run 1: "1b passes on Bhold" (0.0458) and "row 2 within about −1 g of zero" (−6 to −9 g);
  - run 2: C1b's centre within 0.015 m (0.0151–0.0156); row 1′ C1b ≤ 0.015 m (1b 0.029); C1b's B+ red "where 2b is red", wrong on the cupped road.
- **My probe's `C1b.fails` flag is wrong on B+ and B+0** (an overlap counted as the base's). The rule is read by hand above.
- **A carrier, not a correction:** probe 2's ramping-bank figures for C1 stand as C1's figures. The reds they include at 256–258 and 200–206 are C1's
  own error, not the surface's.

## What is left open

- **Alt F (a least-squares centre) on the built bank.** Not run. It is the registered cure for C1b's 0.015 m.
- **Whether the bank plan's 0.00055 rad/m², over its own bar of 0.0001, should be rounded further.** That is the bank plan's question, not the
  level's. inferred: the window cannot cross a piece's joints.
- **The checker's lateral lines leaving out the roll rate.** They read +6.98 g where the line itself reads −0.66 g (B+0, 210). This is a finding for
  him, not a change made here.
