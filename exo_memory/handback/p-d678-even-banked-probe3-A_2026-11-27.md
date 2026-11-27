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
