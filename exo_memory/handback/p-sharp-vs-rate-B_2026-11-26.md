# Sharp against rate pieces on [T4]: one load check, two uses of it (pane B, 2026-11-26, research only)

Chair question of 19:46:36Z (D677). Base: t180 `ceb21f5` (landing-1126), worktree `G:/consonance-scratch/b-t4-t180`,
detached. No code changed, nothing pushed, nothing installed. It ran headless at BelowNormal; his app and the game were
never launched. Same naming rule as the packet: only [T4], section numbers, and our own measured differences.

## The answer in three lines

1. **There are not two load checks; there is one, and the two paths use it differently.**
   - **Sharp** runs the track checker on a probe at the car's top speed, 970 km/h. It refuses on any amber except two.
   - **Extend** runs no load check at all. Its only gate is the pass clearance.
   - Run on the same radius, width and bank, the one check gives the same number to both corners: median difference 1 %.
     It puts the same "load above proven" amber on both, at 970 km/h, in 32 of the 35 pairs laid.
2. **Sharp's refusal is wrong for these 36 corners, for three separate reasons, each with file:line below:**
   - its speed is one no lap of [T4] reaches;
   - it turns ambers into refusals, though the checker's own source and its findings say they are shown, not forbidden;
   - on 7 of the 36 it says "too tight" for a cross-section amber that does not depend on the radius at all.
3. **What a car can drive.** The ground is the reference track itself. A driven clean lap of [T4] is in the builder's
   findings: its hardest moment is **34.07 g**, its top speed **655 km/h**, and it has no frame under the road. At the
   design speed of 460 km/h the check puts all 36 corners at 13–54 g, under the 90 g proven line.
   - **Is Extend right?** Its behaviour (lay the corner, show the amber) is right, but only because it does not judge;
     it is not a check that agrees. So both are wrong as checks: Sharp judges at the wrong speed and severity, and
     Extend does not judge.

## 1. The two paths, read (file:line at `ceb21f5`, and the builder checkout's `docs/FINDINGS.md` at `a19798e`)

### Sharp: `src/core/sharp.js`
- **The probe** (`probe`, sharp.js:91-102) is built fresh from the head's state:
  - a 60 m straight with the head's width and cross-section;
  - the corner at R;
  - a 60 m straight after it.
- **The judge** (`faults`, sharp.js:104-109) is
  `V.validate(path, toSegments(d), { csp: true, fullSpeed: true })` (sharp.js:106). It counts every red, and every amber
  within 5 m of the corner (NEAR_M, sharp.js:26).
- **Advisory** (sharp.js:111): `ADVISORY = new Set(['load-on-the-chassis', 'wall-swerve'])`. Only these two ambers are
  ignored. **`load-above-proven` and `bank-cup-edge` are not in it.**
- **The gate** (`extendSharp`, sharp.js:125-133): it refuses with `SHARP_TOO_TIGHT` if the probe has ANY red or ANY
  non-advisory amber. "Tightest at this width" is `tightestSharp` (sharp.js:115-122): a bisection for the smallest R at
  which the probe is green, up to `R_HI` = 2000 m (sharp.js:27).

### Extend: `app/core/coreshell.js` → `src/core/turnby.js` → `src/core/extend.js`
- **`extend`** (coreshell.js:760) is `commit('extend', () => TB.extendCorner(doc(), opts))`.
- **`commit`** (coreshell.js:478-482) builds the piece, runs `passClearanceGuard` (coreshell.js:480), and stores it.
  That is the only refusal on this path.
- **No load check:** neither `turnby.js` nor `extend.js` requires the validator.
  `checked: grep "validate|provenG" src/core/turnby.js src/core/extend.js → no match`
- **Where the load shows:** the app's live checker (`app/validate-ui/panel.js:69`) runs the same validator with
  `fullSpeed: true` unless a design speed is picked. So the rate corner is painted amber, not refused.

### The one check, its formula and constants: `src/validate/index.js` and `src/validate/limits.js`
- **The load on lateral line u** (index.js:8-16 states it; computed at :368-370):
  `f = v²·κ⃗ / (1 − κ⃗·o(u)) + a_T·T + g·ŷ`, and `fN_g = (f · n(u)) / g`.
  - `o(u)` is the line's offset from the centre, and `n(u)` the surface normal there. The hardest-hit line is usually at the
    edge: in 67 of the 71 corner runs below at 970 km/h it lies within 1.5 m of an edge. On sections 14 and 36 it is
    4–11 m in from the centre.
- **The ambers and limits:**
  - `fN_g > provenG` is AMBER 'load-above-proven' (index.js:382). provenG = **90** g (limits.js:29), from
    FINDINGS.md:105: *"Up to about 90 g: proven … That is the highest load survived, not a limit found"*.
  - Between `chassisG` = **40** (limits.js:18) and 90 is AMBER 'load-on-the-chassis' (index.js:385). Sharp ignores this
    one.
  - The sustained line is `sustainedG` = **55** g held more than 0.5 s (limits.js:33).
- **The speed:** `fullSpeed` fills an OPEN track at `vmaxKmh` = **970** km/h, everywhere, constant (index.js:183;
  limits.js:75). A closed lap is judged on the ghost lap instead (index.js:194-210): full thrust, never braking, capped
  at the same 970.
  - FINDINGS.md:503-505 on the ghost lap: *"never braking … That is harder than any driver, and it is meant to be: a
    track that holds under it holds under a driver. Its loads are an upper bound, not a prediction."*
- **The severity:** FINDINGS.md:112-113 on this amber: *"load above the highest survived (about 90 g today). It is
  shown, not forbidden."*
- **The other amber on 7 of the 36:** 'bank-cup-edge' (index.js:41-58, :482). The cross-slope change over the car's
  2 m on the raised side passes 8°. The source says: *"AMBER, never red: nothing is refused or changed."* (index.js:42)
  - It is measured on the cross-section, not the curvature, so no radius changes it.

**Why they differ, in one line:** Sharp reads an upper bound as a limit. At 970 km/h it asks a corner to hold more than
90 g, and turns two ambers that the checker says must not refuse into a refusal. Extend asks nothing.

## 2. Each corner run through the check, side by side (36 cases)

**How it was run** (`G:\consonance-scratch\b-t4-work\sharpcmp.cjs`, local). For each section where Sharp refused, the
head was laid as in [T4]'s run: a 210 m lead-in, then the Sharp form's straight. At that head:
- **(a) Sharp's own probe**, from `sharp.js`'s `probe`, was judged as `faults` judges it. The module was loaded read-only
  with one export added in memory; the file was not changed.
- **(b) The same corner laid by Extend in rate pieces,** with the same R, width, bank, cup and edges: 4 m ramp in, the
  hold, 4 m ramp out, then 60 m straight. It was judged by the same `V.validate` call.
- **Both at two speeds:** 970 km/h (Sharp's, `fullSpeed`) and 460 km/h (`designSpeedKmh`, limits.js:78, his design-speed
  default).
- **The speed columns** solve `fN = A·v² + C` from the two runs, for the speed at which the hardest line reaches 90 g,
  and the speed at which it reaches 34.07 g (the driven [T4] lap's maximum).

```
checked: node sharpcmp.cjs [36 ids] → sharpcmp.json, sharpcmp.log; node sharpsum.cjs → the table below and:
         speed source "design:970" and "design:460" on every run (the validator's own speedFrom and v)
checked: Sharp's probe was judged on 36 of 36. The rate corner was laid on 35: section 353 was refused PASS_CLEARANCE, against the
         test's own straight lead-in, the same artifact as in the [T4] hand-back, not the corner
checked: hardest line at 970 km/h: Sharp's probe 55.2–237.1 g; above 90 g on 34 of 36 Sharp probes, on 32 of 35 rate corners
checked: at 460 km/h: Sharp's probe 13.1–54.0 g, the rate corner 6.0–52.8 g; load-above-proven on 0 of 36 and 0 of 35;
         over 40 g on 1 each (section 13); over 55 g on none
checked: Sharp's probe against the rate corner at 970 km/h: median difference 1.0 %; 26 of 35 within 5 %
checked: bank-cup-edge on 7 Sharp probes and 7 rate corners
```

**Where the two corners differ by more than 5 %** (9 of 35: sections 60, 64, 151, 152, 250, 264, 285, 339, 343):
- On 151 my rate corner came out at R 74.2 m against 50.9 m. My lay missed; the builder did not.
- On 343 both corners leave the surface (red 'leaves-surface'), and their loads differ by 58 %.
- inferred: on the rest, the cross-section enters through a different transition. Sharp clips the typed fields'
  transitions to its first piece (sharp.js:45-47); my rate lay types them on the 4 m ramp. Not traced.
- **This does not change the answer.** On all 9, both corners sit on the same side of 90 g at each speed, except 339.
  There the rate corner is 82.0 g against Sharp's 91.3 at 970 km/h; both are 19–21 g at 460.

### The table

Bank is signed (+ raises the left). Sharp's refusal is quoted from its own message. "Speed for N g" is where the hardest
line reaches N.

| sec | R typed m | width m | bank ° | Sharp's refusal (its own words) | Sharp probe: hardest line g at 970 / 460 km/h | rate corner: hardest line g at 970 / 460 | Sharp probe ambers / reds at 970 | rate corner ambers / reds at 970 | speed for 90 g, Sharp / rate (km/h) | speed for 34 g, Sharp / rate (km/h) |
|---|---|---|---|---|---|---|---|---|---|---|
| 13 | 26.0 | 29.0 | 44.3 | (load-above-proven): tightest at this width: 67.5 m | 237.1 / 54.0 | 231.8 / 52.8 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis, roll-rate / roll-rate | 596 / 603 | 364 / 368 |
| 14 | 35.7 | 31.0 | 49.4 | (load-above-proven): tightest at this width: 70.0 m | 163.1 / 37.2 | 161.5 / 36.9 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 719 / 723 | 440 / 442 |
| 23 | 46.9 | 28.6 | 27.8 | (load-above-proven): tightest at this width: 52.8 m | 99.0 / 22.7 | 98.0 / 22.5 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 925 / 929 | 566 / 568 |
| 26 | 56.8 | 30.1 | -41.4 | (load-above-proven, roll-rate): tightest at this width: 63.9 m | 99.1 / 22.6 | 98.2 / 22.5 | load-above-proven, load-on-the-chassis, roll-rate / — | load-above-proven, load-on-the-chassis, roll-rate, seam-past-envelope / roll-rate | 924 / 928 | 566 / 569 |
| 36 | 32.7 | 29.0 | 36.5 | here (bank-cup-edge, load-above-proven), and no radius up to 2000 m is green | 144.0 / 32.9 | 140.7 / 32.1 | bank-cup-edge, load-above-proven, load-on-the-chassis / — | bank-cup-edge, load-above-proven, load-on-the-chassis / — | 766 / 775 | 469 / 474 |
| 59 | 49.5 | 29.0 | -31.4 | (load-above-proven): tightest at this width: 54.1 m | 96.6 / 22.2 | 96.5 / 22.2 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 936 / 936 | 573 / 573 |
| 60 | 41.7 | 30.0 | -25.0 | (load-above-proven): tightest at this width: 55.0 m | 112.3 / 25.7 | 102.3 / 23.5 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 868 / 910 | 531 / 556 |
| 63 | 52.8 | 29.0 | 39.3 | (load-above-proven): tightest at this width: 63.3 m | 104.9 / 24.0 | 104.6 / 23.9 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 898 / 899 | 550 / 551 |
| 64 | 48.1 | 30.0 | 26.2 | (load-above-proven): tightest at this width: 62.8 m | 112.7 / 25.7 | 95.1 / 21.9 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 866 / 943 | 531 / 577 |
| 71 | 53.4 | 29.0 | 45.1 | (load-above-proven): tightest at this width: 119.5 m | 116.4 / 26.4 | 112.0 / 25.5 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 853 / 869 | 523 / 533 |
| 121 | 37.5 | 29.0 | -27.6 | (load-above-proven): tightest at this width: 53.0 m | 118.2 / 27.1 | 117.5 / 26.9 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 846 / 848 | 517 / 519 |
| 151 | 50.9 | 29.0 | 65.4 | (load-above-proven): tightest at this width: 78.2 m | 134.7 / 30.4 | 93.6 / 21.1 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 793 / 951 | 487 / 585 |
| 152 | 49.9 | 30.3 | 35.9 | (load-above-proven): tightest at this width: 78.3 m | 137.3 / 30.9 | 103.0 / 23.6 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis, roll-rate / roll-rate | 785 / 906 | 483 / 555 |
| 167 | 57.0 | 31.0 | -47.7 | (load-above-proven): tightest at this width: 69.7 m | 107.3 / 24.4 | 107.3 / 24.4 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 888 / 888 | 545 / 545 |
| 202 | 30.4 | 29.0 | 39.9 | (load-above-proven): tightest at this width: 108.8 m | 167.2 / 37.9 | 164.3 / 37.3 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 711 / 717 | 436 / 439 |
| 206 | 41.8 | 29.0 | -27.8 | (load-above-proven): tightest at this width: 52.1 m | 107.2 / 24.6 | 107.1 / 24.6 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 888 / 889 | 543 / 544 |
| 217 | 53.6 | 31.0 | -16.4 | here (bank-cup-edge), and no radius up to 2000 m is green | 78.8 / 18.3 | 75.4 / 17.5 | bank-cup-edge, load-on-the-chassis / — | bank-cup-edge, load-on-the-chassis / — | 1037 / 1061 | 634 / 648 |
| 236 | 49.2 | 29.0 | 36.0 | (load-above-proven): tightest at this width: 60.3 m | 106.7 / 24.4 | 106.7 / 24.4 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 890 / 890 | 545 / 545 |
| 243 | 42.5 | 29.0 | 30.7 | (load-above-proven): tightest at this width: 54.7 m | 110.2 / 25.2 | 109.9 / 25.2 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 876 / 877 | 536 / 537 |
| 246 | 44.2 | 28.0 | 25.5 | (load-above-proven): tightest at this width: 50.5 m | 99.9 / 23.0 | 99.8 / 23.0 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 920 / 921 | 563 / 563 |
| 250 | 36.2 | 30.0 | 26.3 | (load-above-proven): tightest at this width: 97.2 m | 140.5 / 32.0 | 117.6 / 27.0 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis, wall-swerve / — | 775 / 848 | 475 / 518 |
| 257 | 47.2 | 30.0 | 24.4 | (load-above-proven): tightest at this width: 52.4 m | 97.9 / 22.5 | 95.6 / 22.0 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 930 / 941 | 569 / 576 |
| 264 | 43.5 | 31.0 | 35.9 | (load-above-proven): tightest at this width: 61.8 m | 120.0 / 27.4 | 113.7 / 25.9 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis, wall-swerve / — | 839 / 862 | 514 / 528 |
| 285 | 50.0 | 29.0 | 17.0 | (roll-rate, load-above-proven, roll-rate): tightest at this width: 78.9 m | 115.9 / 26.4 | 103.5 / 23.6 | load-above-proven, load-on-the-chassis, roll-rate / roll-rate | load-above-proven, load-on-the-chassis, roll-rate / — | 854 / 904 | 524 / 554 |
| 286 | 35.2 | 29.0 | -35.9 | (load-above-proven): tightest at this width: 60.1 m | 138.9 / 31.7 | 138.6 / 31.6 | load-above-proven, load-on-the-chassis / — | bank-cup-edge, load-above-proven, load-on-the-chassis / — | 780 / 781 | 478 / 478 |
| 318 | 53.1 | 29.0 | 37.6 | (load-above-proven): tightest at this width: 61.2 m | 101.3 / 23.2 | 101.3 / 23.2 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 914 / 914 | 560 / 560 |
| 329 | 54.2 | 30.0 | -39.1 | (load-above-proven): tightest at this width: 100.0 m | 99.3 / 22.7 | 99.3 / 22.7 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 923 / 923 | 565 / 565 |
| 339 | 48.7 | 30.1 | 11.2 | here (bank-cup-edge, load-above-proven), and no radius up to 2000 m is green | 91.3 / 21.1 | 82.0 / 19.0 | bank-cup-edge, load-above-proven, load-on-the-chassis / — | bank-cup-edge, load-on-the-chassis / — | 963 / 1017 | 589 / 622 |
| 340 | 48.2 | 29.0 | -37.0 | here (bank-cup-edge, load-above-proven), and no radius up to 2000 m is green | 110.0 / 25.1 | 108.8 / 24.9 | bank-cup-edge, load-above-proven, load-on-the-chassis / — | bank-cup-edge, load-above-proven, load-on-the-chassis, roll-rate / roll-rate | 877 / 882 | 537 / 540 |
| 343 | 48.0 | 29.0 | -17.9 | here (leaves-surface, bank-cup-edge), and no radius up to 2000 m is green | 55.2 / 13.1 | 23.2 / 6.0 | bank-cup-edge, load-on-the-chassis / leaves-surface | bank-cup-edge, roll-rate / leaves-surface | 1243 / 1939 | 758 / 1182 |
| 344 | 35.6 | 30.0 | -25.8 | here (bank-cup-edge, load-above-proven), and no radius up to 2000 m is green | 114.9 / 26.4 | 115.4 / 26.5 | bank-cup-edge, load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 858 / 856 | 525 / 523 |
| 349 | 31.7 | 30.0 | -31.4 | (load-above-proven): tightest at this width: 58.0 m | 144.6 / 32.9 | 144.5 / 32.9 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis, roll-rate / — | 764 / 765 | 468 / 468 |
| 353 | 30.5 | 29.0 | -29.8 | (load-above-proven): tightest at this width: 85.3 m | 135.1 / 30.9 | not laid (PASS_CLEARANCE on the test lead-in) | load-above-proven, load-on-the-chassis / — | not laid | — | — |
| 356 | 35.0 | 29.0 | 33.9 | (load-above-proven): tightest at this width: 59.5 m | 138.1 / 31.5 | 138.0 / 31.5 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis / — | 782 / 782 | 479 / 479 |
| 359 | 39.1 | 31.0 | -32.9 | here (bank-cup-edge, load-above-proven), and no radius up to 2000 m is green | 129.0 / 29.4 | 125.8 / 28.6 | bank-cup-edge, load-above-proven, load-on-the-chassis / — | bank-cup-edge, load-above-proven, load-on-the-chassis / — | 810 / 820 | 496 / 502 |
| 361 | 21.9 | 29.0 | 25.8 | (load-above-proven): tightest at this width: 87.6 m | 172.5 / 39.3 | 164.4 / 37.4 | load-above-proven, load-on-the-chassis / — | load-above-proven, load-on-the-chassis, roll-rate / — | 700 / 717 | 428 / 439 |

## 3. Which matches what a car can drive

**The three grounds the chair named, in the order they decide it:**

1. **The reference track itself: decisive, and it says Sharp is wrong here.**
   - **What the builder's findings hold:** a driven clean lap of [T4], in the speed table at `docs/FINDINGS.md:469` and the
     load table at `:400` (the [T4] row, by its replay; the builder checkout, `a19798e`). It reads:
     - speed p10 272, p50 433, p90 580, p99 623, **max 655 km/h**;
     - load p50 3.81, p99 17.26, p99.9 22.77, **max 34.07 g**;
     - **0 frames** with the box under the road.
   - **The 36 corners are on that lap.** My [T4] hand-back made each of them within tolerance of the read: 34 only by
     steering, 2 by hand. So the road Sharp refuses is the road a car drove clean.
   - **What the check says about that road at 970 km/h:** a car taking these corners at that speed would be at
     55–237 g. Nothing on that lap went over 34 g, so the car was not going that fast. That is no surprise: the lap's own
     top speed is 655.
   - **What speed keeps them inside the lap's measured maximum:** solved from the check, the hardest line reaches
     34.07 g at **364–758 km/h** (median 531). That sits inside the lap's own driven speeds, p10 272 to p99 623, except
     sections 217 and 343 (634 and 758 km/h), the two that Sharp refuses on the cross-section, not the load. Inferred, because the replay was not mapped to these corners: the driver took them at
     or under those speeds. The replay's speed at each corner was not measured. That is the check that would settle it
     (below).
2. **His design speed: agrees with the reference.**
   - At `designSpeedKmh` 460 (limits.js:78; FINDINGS.md:476, *"the speed a T-180 is at on a typical frame of a clean
     lap"*) the hardest line is 13.1–54.0 g on Sharp's own probe. That is under 90 g on all 36, under the 55 g sustained
     line on all 36, and over the 40 g chassis line on 1 (section 13, 54.0 g; an advisory Sharp itself ignores).
   - At the speed he set as typical, Sharp's own probe of every refused corner is inside the proven line.
3. **A physical bound: there is no measured ceiling to test against.**
   - The 90 g line is the highest load survived, *"not a limit found … The real red line is unknown. Nothing in the data
     broke."* (FINDINGS.md:105-107).
   - So the physical grounds cannot make a 100–237 g corner at 970 km/h "undriveable"; they can only say nobody has
     driven one. They also cannot make Sharp's refusal right. The findings set this load as amber because it is
     unproven, and say so: *"It is shown, not forbidden."* (FINDINGS.md:112-113).

**So, on the question asked:**
- **Sharp's check:** the right formula and constants, applied at the wrong speed and at the wrong severity. For these
  corners it is wrong. Its speed is one the reference never reaches, and it refuses where the checker's source and
  findings say to show.
- **On 7 of the 36, Sharp is wrong in a second way:**
  - **What it says:** "no radius up to 2000 m is green".
  - **What actually decides it:** 'bank-cup-edge' (6) and 'leaves-surface' with 'bank-cup-edge' (1, section 343). These
    are properties of the cross-section and of the climb, and the radius does not change them.
  - **The cost:** the message names the radius as the cause, so a person would chase a radius that cannot help.
  - **Where to look** (no fix designed): sharp.js:125-133 names `SHARP_TOO_TIGHT` for every fault, and sharp.js:111 is
    the advisory set that leaves `bank-cup-edge` out.
- **Extend:** not a check. It lays these corners, and the live checker paints them amber at 970 km/h exactly as Sharp's
  probe is painted. That matches the findings' "shown, not forbidden", and it matches the reference.
  - Its weakness is the other side. It would also lay a corner no speed holds; a red is shown, not refused, on this
    path. Inferred from coreshell.js:478-482, not tested here.
- **Both, as checks of driveability:** wrong for these corners. Sharp because 970 km/h with no braking is an upper bound
  (FINDINGS.md:503-505, "not a prediction") that it treats as a limit; Extend because it does not judge.
- **The judge that matches the reference:** the same formula at a speed a car carries into the corner. Two such
  speeds exist on disk: the design speed, and the driven lap. The builder has no corner-speed model; its ghost lap never
  brakes (index.js:194-210). Named, not designed.

## Falsifier (registered here, before anyone reads the replay)

This answer is wrong if the [T4] replay, mapped to lap distance, puts the car through any of these 36 corners at a speed
where the check's hardest line is over 90 g, and the car held. Then the 90 g line, not the speed, is what is wrong. The
replay's own maximum of 34.07 g makes that unlikely, but the maximum is over the car's frames, while the check reads
the hardest line across the whole road width. A driver's line is not the inside edge, so the two are not the same
measure. That is the gap this answer leaves open.

**The unwelcome outcome, in words that would make it true:** Sharp is right, and [T4]'s tight corners are driven only
because the driver takes a line far from the inside edge at the speeds the lap shows. Then a builder that lets a person
lay them must also tell him the line. The replay at the corner would show it, and it was not read.

## Corrections and limits

- **The chair's framing, "two load checks disagree", is not what the code holds.** One check is used as a gate by one
  path and not used by the other. The disagreement is in how it is used, not in the arithmetic: on the same corner the
  numbers agree to a median 1 %.
- **My own rate corner missed on 151** (R 74.2 against 50.9 typed), so that row compares unlike corners. On 353 my rate
  corner was refused PASS_CLEARANCE against my own straight lead-in; that is the test's artifact, as in [T4], and the row
  has no rate figures.
- **The 90 g and 34 g speeds are solved from two runs,** on the model `fN = A·v² + C`. It ignores the downforce term,
  which `fN_g` does not include (index.js:371-373), and treats the along-track term as zero on a constant speed. inferred:
  both hold for a constant-speed probe.
- **What was not run:** the replay itself (it is local and was not opened here), the whole closed lap on its ghost lap,
  and any picture.

## Scripts (in `G:\consonance-scratch\b-t4-work`; uncommitted, they read track data)

- `sharpcmp.cjs`: lays the 36 heads, judges Sharp's probe and the rate corner at 970 and 460 km/h, and writes
  `sharpcmp.json` and `sharpcmp.log`.
- `sharpsum.cjs`: makes the table above and the summary figures.
- `xprobe.cjs`: the cross-fall probe from the [T4] hand-back. It was not used here.
