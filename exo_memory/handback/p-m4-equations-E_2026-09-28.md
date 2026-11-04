# M4 · the length of each track's equation (pane E) · 2026-09-28, night

**Packet:** the chair's re-order (E: M4 ahead of R2; R2 is parked and handed to A in
`p-r2-water-E_2026-09-28.md`). M4 is registered in `exo_memory/loop/design_t180_global_flow_2026-09-27.md` §12.
**Nothing is committed. No AC launch.**

**The prediction and falsifier, quoted from §12:** "N ≤ 200 per function for most tracks (the smooth-equation idea
holds). It fails if most tracks need N > 1,000, or never converge because jumps and discontinuities dominate."

## 1 · THE METHOD, fixed before any real track was fitted (written 00:5x)

Before this section, `tools/fourier.cjs` and `src/doc/equation.js` had run ONLY on synthetic laps
(`test/fourier.test.js`, §1.9). No read of a real track had passed through the fit.

### 1.1 The tracks
- **The 13 T-180 layouts of M1:** Rainbow Road, Centrifuge, Hazen Loop, Onuris (Long), Sakura Speedway, Coast, Nordic,
  Thunderhead (normal), Eagleton (full), T-180 Test Track, The Bowltrack, T-180 Bowl Track and Serpents Spiral.
- **The source is their `READ_PROFILE=1` reads** in `reads/` (gitignored), as made for the corpus.

### 1.2 Sampling
- The read's road stations are resampled linearly in d onto **M = round(lap / 4) points**, so Δs = lap/M ≈ 4 m and the
  grid is exactly periodic.
- **A jump's flight is the straight chord from take-off to landing:** the read's d runs across the gap, and the
  interpolation between the last take-off and first landing station is that chord. So a jump IS a discontinuity in the
  series (the pitch and heading break at the lip and at the landing), and the fit has to carry it.

### 1.3 The functions
- **The tangent** T is the centred difference of the centreline over ±Δs.
- **Heading** θ = atan2(Tx, Tz) and **pitch** p = asin(Ty), in the geometry's own curve model (`src/geom/path.js`).
  They are kept continuous through vertical: past ±90° θ keeps its meaning and p carries on, and within about 3° of
  vertical the heading holds its last value.
- **Roll** φ is the read normal's angle about T from the geometry's gravity-frame left (`path.js` FRAME).
- Each is unwrapped. Its whole turns over the lap are its `net`. A read whose angles do not return to whole turns is
  refused.
- **Cross-section:** wl and wr (m), and psiL and psiR (the tilt at ¼, ½, ¾ and the edge of each side, degrees).

### 1.4 The fit
- Each periodic remainder f − net·s/L is transformed by its DFT (the least-squares fit on a uniform grid), then
  **truncated at N harmonics**.
- **The heading rate and pitch rate are the exact derivatives** of the truncated heading and pitch series. So "N per
  function" counts the same harmonics whether one speaks of the angle or its rate.

### 1.5 The rebuild, through the builder's geometry core
- **One segment per Δs:** k0/k1 = the heading rate at its ends, kp0/kp1 = the pitch rate at its ends, roll0/roll1 =
  the roll series at its ends, heartline 0.
- It is built by **`buildPath`** (`src/geom`), starting at the read's first point, heading and pitch.

### 1.6 The closure projection (design notes §3)
- **Heading, pitch and roll close by construction:** whole turns, and the trapezoid sum of a periodic series over its
  own grid is exact.
- **Position:** the least-norm correction of the 1st and 2nd harmonics of θ and p, and of p's mean, weighted by k² (their
  rate energy; the mean counts as k = 1). It makes the rebuilt end meet its start.
  - It is solved by Newton on **`buildPath`'s own end gap**, to 1 mm, with the Jacobian from the rectangle rule on the
    nodes.
- **Found on the synthetic lap:** no periodic pitch term moves the net climb to first order, so without p's mean the
  closing system was singular and the Newton step diverged (0.14 m → 6.3 m). The mean is now a variable.

### 1.7 The score
For **every road station of the read:**
- **line error:** the distance from the read's centre to the rebuilt line (rebuilt samples within ±150 m of the
  station's s, refined on the segments);
- **bank error:** the angle about the read tangent between the read normal and the rebuilt road normal U, both
  projected off the tangent.

**A station passes** at a line error ≤ 5 m and a bank error ≤ 5°. **The track passes at N** when ≥ 95% of stations pass
the line test AND ≥ 95% pass the bank test.

### 1.8 N, the verdict, and what is reported beside it
- **The sweep:** N ∈ {1, 2, 3, 5, 8, 12, 20, 30, 50, 75, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 4000,
  5000}, each below Kmax = ⌊(M − 1)/2⌋, then Kmax itself.
- **One N for the three angle series together.** A track's N is the FIRST listed N that passes. If even Kmax fails, the
  track **never converges**.
- **THE VERDICT:**
  - **FAILS** if more than half of the 13 (≥ 7) have N > 1,000 or never converge (the falsifier, as quoted);
  - **PASS** otherwise;
  - **beside it:** whether the prediction itself is met (≥ 7 tracks at N ≤ 200). A PASS without it is stated as that.
- **Reported beside, not part of the verdict:**
  - the first N passing the line alone, and the bank alone (from the same sweep);
  - the p95 line and bank error at each N;
  - the position gap the projection closed;
  - N for the cross-section on the grid (wl and wr within 1 m on ≥ 95% of samples; all eight tilts within 5°);
  - **spectrum shape:** N99, the harmonic count holding 99% of the power of the heading rate, the pitch rate and the
    roll rate.

### 1.9 Checked before any real track (synthetic laps, `node --test --test-concurrency=4 test/fourier.test.js` → 9/9)
- a lap made from 3-harmonic heading, pitch and roll series closes to < 1 mm, and is recovered at **N = 3**;
- the same with one full roll-over keeps its whole turn and fits at N = 3;
- an unclosed read is refused;
- the loader's document resolves, and ends ≤ 2 m from its start with the heading exactly one turn;
- an equation's jump becomes a jump word;
- a malformed equation is refused;
- **no coefficient file or read is tracked,** and the writer refuses a path git does not ignore.

**Two faults were caught there and fixed before any real track:**
- the closing system was singular (above);
- **the scorer matched each station to the sample 150 m back:** the segment refinement always reaches the next vertex,
  so a vertex never beat it. The line distance was still right, but the bank came from the wrong sample, stuck at 88%.

### 1.10 Privacy (§12)
- **The coefficient files are written ONLY to `reads/<layout>.equation.json`.** The writer checks `git check-ignore`
  and `git ls-files` and refuses otherwise, and fails closed if git cannot answer.
- **They are never committed:** the test above checks it.
- **FINDINGS §7h gets numbers only:** N, errors and spectrum shape.

### 1.11 What each outcome would mean, said now
- **A PASS with most N ≤ 200** says a T-180 lap is a short equation: a few hundred numbers per function.
- **A FAIL driven by jump tracks** (Hazen, Coast, Sakura, Eagleton, Rainbow carry jumps) says the jumps must be local
  terms on top of the series, not inside it. §12 already names that as the alternative.
- **Note on 5 m over 20+ km:** the line criterion integrates heading errors, so a heading error of 0.25 mrad sustained
  over 20 km is 5 m. The closure projection removes the global drift but not the local error. The rebuild is a harsh test
  of the heading series, and a high N on long tracks may reflect that.

## 1b · CORRECTIONS to §1, made after the first real run and BEFORE the verdict run (written 05:0x)

**§1's registration is untouched above: the prediction, the falsifier, the tolerances (5 m, 5°, 95%), the N list and the
verdict rule. What changed is the machinery that reads a track into functions and rebuilds it. Each change was forced by a
measured failure. The verdict is run once, after all of them, on all 13 layouts.**

**The first real run (method as registered, 03:1x, under the lock):**
- Rainbow, Centrifuge and Hazen Loop all read "never converges", even at the exact fit.
- It then CRASHED on Onuris: "theta: the lap's whole turns are −1.500".
- **As registered, the method could not evaluate the tracks at all.** That is a fault of the method, not a result about
  the prediction.

**The diagnosis** (`scratchpad/m4/diag*.js`, each run under the lock, numbers only):
- integrate the sampled angles straight back and compare them with the sampled line (the floor, before any fit);
- then rebuild at N = 20, 200 and the exact fit.

| # | correction | the evidence that forced it | shelf |
|---|---|---|---|
| 1 | **s is the centre line's own 3-D length, not the reader's walked d** (about 0.5% longer: the reader re-centres every step) | Sakura's floor: 110 m → 10.5 m | 01 §5 |
| 2 | **reader glitches** (a station > 3 m off its ±8 m chord) interpolated over; every station still SCORED; counts reported per layout | Rainbow had steps of +127° then −76° in 8 m. Flagged share with a ±12 m window: 0.16–3.1% on 11 layouts, and 9–16% on the two bowl tracks, where that window was too long (real bends). ±8 m is used. | 01 §5 |
| 3 | **angles from CHORDS at their midpoints**, with an exact half-sample shift of the coefficients; each rebuilt segment turns by EXACTLY the equation's change across it (the builder's heading then equals the equation's at every node) | linear node RATES drifted: a trapezoid of the rate is not the series' own angle where the rate swings | 03 §1 (the shift), 01 §5 |
| 4 | **heading through near vertical**: interpolated where the chord's horizontal part is < 0.3; pitch taken consistent with it (p = atan2); leaving a vertical stretch, the chords may read a + π from there on, so a road that came over the top keeps its θ and p gains 2π (the builder's loop convention) | Sakura reaches 82–88°, and chord headings there swing ±40°; the branch guess flipped (Onuris' crash). Found on the way: **Sakura has one vertical loop and Onuris three** (pitch +1 and +3 turns). The threshold is a CHOICE tuned on ONE track: Sakura's exact-fit line score was 72.5 / 77.6 / **88.3** / 62.7 % at 0.1 / 0.2 / 0.3 / 0.4. | 01 §5 |
| 5 | **the closure uses harmonics 1 … \|heading turns\| + 3** (the same weighted least-norm formula, 02 §2) | on a lap winding n times the 1st and 2nd harmonics barely move the end, so closing Centrifuge (10 turns) bent its line by 84 m; with 1 … 13, by 21.6 m | 02 §3 |
| 6 | **the read line is resampled at EQUAL CHORD length c** (bisection so the M-th point closes the lap); the rebuild uses steps of c; s = i·c | varying chord lengths left an 8–12 m floor on the long tracks; after this, the floor is 0.00–0.73 m on Rainbow, Centrifuge and Thunderhead (4–6 m on the looping tracks) | 01 §5 |

**The same four layouts after all six, at the EXACT fit** (the floor that the prediction is tested above):

| layout | line: share within 5 m | line p95 | bank: share within 5° | bank p95 |
|---|---|---|---|---|
| Sakura | 96.6% | 4.8 m | 99.9% | 1.3° |
| Onuris (long) | 99.9% | 3.0 m | 100% | 0.9° |
| Thunderhead | 99.8% | 1.9 m | 99.3% | 2.0° |
| Centrifuge | 95.5% | 4.4 m | 99.8% | 1.4° |
| Rainbow | 73.6% | 6.3 m | 99.9% | 0.9° |

- Rainbow, Thunderhead and Centrifuge were measured before correction 4's persistent offset was added (it changes only layouts that go near vertical). The sweep gives the current figures.

**Two faults caught in my own tools on the way, both fixed:**
- **`diag.js` fitted without the half-sample shift for one round,** so that round's rebuild numbers were half a sample out
  of step. They were re-run after the fix, and the table above is from the corrected runs.
- **The loader test compared the document's length with the synthetic arc (3,000 m) exactly.**
  - Under equal chords, the equation's own length is M·c = 2,999.988 m. The document is quantised at 0.1 mm per word.
  - The test now compares with `eq.lapM` within 0.1 mm per word, and the arc within 5 cm.

**The formulas, per the chair's standing rule (maths from the shelf):**
- The ones M4 already used are cited to 02 §1–§3 and 03 §1–§2.
- The ones it did not have are ADDED to the shelf with their sources before this verdict run:
  - 01 §5 (new), 03 §1 (the half-sample shift) and 02 §3 (the M4 bullet corrected);
  - MATH_SOURCES: WIKI-DFT and WIKI-SAGITTA, both secondary, opened.
- C was told on the board.
- **Their known-answer tests:** `node --test --test-concurrency=4 test/fourier.test.js` → **12/12** (the 9 of §1.9, plus
  "03 §1, the half-sample shift", "01 §5, equal chords" and "01 §5, through vertical").
- **One overclaim of mine, corrected in the shelf before it was read:** I first wrote that "no T-180 road" bends under
  10.7 m. The corpus' tight words have a 10th-percentile radius of 51 m, but the reader smooths over about 40 m, so that
  is UNMEASURED, and 01 §5 now says so.

**The verdict rule is unchanged (§1.8):** FAILS if ≥ 7 of 13 need N > 1,000 or never converge; PASS otherwise; whether the
prediction (≥ 7 at N ≤ 200) is met is said beside it.

## 2 · THE RESULT (the verdict sweep, run once after §1b, 04:57, under the lock)

`node tools/fourier.cjs sweep reads --write` (`scratchpad/m4/run.js`: the heavy-run lock, `--max-old-space-size=4096`).
The output is `scratchpad/m4/sweep.json`, sha256 `4068490edb40a5e5`; figures below are read from it.

**VERDICT: PASS. The falsifier did NOT fire (5 of 13 need N > 1,000 or never converge; it needed ≥ 7). The prediction IS
met: 7 of 13 at N ≤ 200.** Seven is the smallest possible majority of 13, so the margin is one track.

| layout | lap | N (both) | N line | N bank | at N: line within 5 m | line p95 | bank within 5° | bank p95 | glitches |
|---|---|---|---|---|---|---|---|---|---|
| Serpents Spiral | 2.1 km | **12** | 12 | 8 | 99.0% | 2.9 m | 100% | 1.7° | 3 |
| The Bowltrack | 2.5 km | **30** | 30 | 30 | 100% | 2.0 m | 98.2% | 3.9° | 1 |
| Eagleton | 8.7 km | **75** | 75 | 50 | 100% | 2.5 m | 99.95% | 1.3° | 4 |
| Onuris (long) | 24.4 km | **150** | 150 | 100 | 96.7% | 4.5 m | 99.2% | 2.4° | 9 |
| T-180 Bowl Track | 2.1 km | **150** | 30 | 150 | 99.4% | 1.1 m | 96.5% | 4.6° | 5 |
| Thunderhead | 9.5 km | **200** | 200 | 150 | 97.0% | 4.8 m | 98.6% | 3.2° | 20 |
| T-180 Test Track | 8.1 km | **200** | 75 | 200 | 100% | 1.9 m | 95.8% | 4.9° | 0 |
| Coast | 21.7 km | 1,000 | 1,000 | 150 | 97.8% | 4.6 m | 100% | 1.3° | 2 |
| Sakura | 21.9 km | 2,000 | 2,000 | 150 | 95.4% | 5.0 m | 99.9% | 1.3° | 5 |
| Nordic | 21.2 km | 2,652 (the exact fit) | 2,652 | 100 | 98.5% | 4.6 m | 99.96% | 1.5° | 21 |
| Hazen Loop | 32.1 km | 3,000 | 3,000 | 300 | 97.7% | 4.4 m | 99.97% | 1.5° | 0 |
| Centrifuge | 36.6 km | 4,000 | 4,000 | 200 | 95.5% | 4.5 m | 99.7% | 1.4° | 23 |
| Rainbow Road | 45.3 km | **never** | never | 300 | (at the exact fit, 5,687) 73.6% | 6.3 m | 99.9% | 0.9° | 282 |

**What it shows, read from the table:**
- **The BANK is a short equation everywhere:** N bank ≤ 300 on all 13, and ≤ 150 on 9.
- **The LINE's length grows with the lap.** Every layout ≤ 10 km passes at N ≤ 200. Every layout ≥ 21 km except Onuris
  needs 1,000–4,000 or never converges. This is what §1.11 said in advance could happen: 5 m over 20+ km is a harsh test
  of the heading series, since a 0.25 mrad sustained heading error is 5 m over 20 km.
- **So the smooth-equation idea holds for the SHAPE (bank) at any length, and for the LINE on laps up to about 10 km.** On
  long laps the line needs thousands of terms, or local terms on top of a short series, which is §12's named alternative.
- **Rainbow never converges:** 73.6% at the exact fit. It has 282 reader glitches, the most by far (the next is 23). Its
  read line is the noisiest, and the exact fit is capped by that, not by the Fourier series (inferred from the glitch count,
  not traced further).

**What it does NOT show:**
- **N99, the harmonic count holding 99% of each rate's power, sits at the top of the spectrum on every layout** (e.g.
  Sakura 2,729 of 2,742). The RATES are noise-dominated at the shortest wavelengths, because differencing amplifies the
  reader's noise. So N99 is not a shape measure here, and **§1.8's "spectrum shape" is NOT delivered.** A spectrum of the
  angles, not the rates, would be the next thing to try. Not done: frozen.
- **The near-vertical threshold (0.3) was tuned on ONE track** (§1b row 4). The verdict with another threshold is unknown.
- **Width and ψ** (reported beside): N width 75–4,000; N ψ 1–4,000. Not part of the verdict.
- **The margin:** one fewer track at N ≤ 200 would leave the prediction unmet, though the falsifier still would not fire.

**Privacy:**
- The 13 coefficient files are `reads/<layout>.equation.json`: untracked, and `git check-ignore` confirms they are
  ignored.
- This hand-back and the output hold numbers only.
- **FINDINGS §7h (the public summary) is NOT written. It is PARKED by the freeze.**

## 3 · State at the freeze (the chair, 04:57: "FREEZE … NO NEW WORK")

**Done and rung tonight:**
- R1's items (`p-r1-items-E`, both addenda; the full suite green, 831/0 and 389/0);
- the ripple (`p-d182-ripple-E`: 203/203 on both vocabularies);
- the walled-bowl tests (`p-d182-walltests-E`: 56/56 on three trees);
- M4's verdict (this file).

**Parked:**
- **R2, water:** handed to A at 00:3x (`p-r2-water-E`), with no run by me;
- **M4's FINDINGS §7h,** its "spectrum shape", and any use of the equations (the loader `node tools/fourier.cjs open` is
  written and unit-tested, but no real equation has been opened);
- **R1's A diff** (the "T-180 track" checkbox, `scratchpad/r1/a-t180-toggle.diff`): with A, not applied.

**On disk, uncommitted (the t180 repo), mine:**
- **modified:** app/test/{handles, handles-panel, validate-ui, validate-ui-panel, validate-ui-speed,
  validate-ui-jumpdefault}.test.js, app/validate-ui/labels.js, docs/FINDINGS.md, scripts/build_platform_test.js,
  src/export/{fromwords, layouts, trackfiles}.js, src/validate/{index, limits}.js,
  test/{export-textures, export_words, validate_bounds, validate_jumps}.test.js, tools/read_track.cjs;
- **new:** app/test/export-csp.test.js, src/doc/{corpus.json, equation.js}, src/validate/raygap.js,
  test/{corpus, export_csp, export_width, fourier, pre_d182_words, spectrum, validate_raygap, water}.test.js (pre_d182_words
  is a helper, not a test), tools/{corpus, fourier, spectrum, water}.cjs;
- **my additions inside C's new docs/math/:** 01 §5, 03 §1, 02 §3 and two MATH_SOURCES rows.
- M4's files now: `tools/fourier.cjs` sha256 `27462520fa217232`, `test/fourier.test.js` `f1b8f695af800478`.
- **Not mine, left alone:** `tools/water.cjs` was edited after I parked R2 (01:30), by A presumably.
