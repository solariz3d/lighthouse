# T-180: three blind simulations of the floor box in a soft road contact, scored against the record

2026-11-27

written by researcher subagents (Fable) for the librarian (L): three simulation builders kept blind to recorded outcomes, a scorer, this writer; a checker's section follows

## Answer first

- **No. The simulations do not reproduce the record by the registered bar.** All three fail the part that says a pass sinking at 1.66 m/s or more goes through on the softer setting.
- **What the contact itself says decides hold against through: a depth, not a sink rate.** In the public library's collider the push reverses once the box bottom is 0.25 m under the road. Short of that the contact is a spring and settles.
- In the simulations, runs sinking at 2.56 to 10.08 m/s at 0.11 m still hold. The record's line sits between 0.63 and 1.66 m/s. The simulated line, where there is one, sits at roughly 3.5 to 11 m/s.
- Both recorded breaks are missed. Every simulation says "holds" for every recorded load when the load arrives slowly.
- The one part all three meet is the bare hold at 65 g on the stiffer setting. Even there the simulated box sits under the road, where the record has it 4.5 to 5.4 cm clear.
- Two things the sources do not give flip the simulated outcomes more than the road setting does: how many contact points the game keeps for the box, and whether the tyres keep pushing once the hub is under the road.
- By the plan's own line, the finding is that the public library's contact, as these three built it, does not carry the record's sink-rate separator. The next step named there is data, not more reasoning.

## The bar as registered

From `exo_memory/loop/plan_fable_researchers_2026-11-27.md:184`, the section "His offer, 06:19", verbatim:

> the simulation counts as reproducing the record only if, with nothing tuned on the cases, on the softer setting (0.0002) a pass sinking at 0.63 m/s or less holds and one at 1.66 m/s or more goes through, AND on the stiffer setting (0.00005) a pass at 65 g holds. If the two builders disagree with each other, neither is believed.

Three builders ran, not two. "The two" is read as: the builders must agree on each of the three parts for that part to count.

The plan's next two lines (`:185-186`): if it reproduces, it is asked for predictions; if it does not, "that is the finding ... and the next step is data, not more reasoning."

## What each builder built

All three used the same public sources: ODE at commit 0e0e94b5, the car's data files at tag v0.12.0, and the patch's comments on the surface keys. All three used 850 kg, a tick of 1/333 s, SOFT_ERP 0.8, a box 0.5 m tall, and one vertical direction with no pitch.

All three got the same contact stiffness and damping per contact point:

| SOFT_CFM | kp per point | kd per point | 1/cfm per point |
|---|---|---|---|
| 0.0002 | 1.332e6 N/m | 1,000 N·s/m | 5,000 N·s/m |
| 0.00005 | 5.328e6 N/m | 4,000 N·s/m | 20,000 N·s/m |

All three found that n equal contact points act like SOFT_CFM divided by n. So 0.0002 with four points is the same as 0.00005 with one (A and B both state it).

**Builder A** (`simA\`)

- One state: the box bottom's height above the road and its rate.
- Load: 20 g for 1.5 s, straight ramp to the peak, held 2 s.
- Tyres give 4 × 270,000 = 1.08e6 N/m between 25 g (suspension solid) and 40 g (box touches). That puts the box 0.116 m clear at the stops.
- Baseline: n = 4 contact points, tyres keep pushing under the road, the normal reverses past half height ("flip").
- At n = 4 the contact totals 5.33e6 N/m and 20,000 N·s/m on 0.0002; 2.13e7 N/m and 80,000 N·s/m on 0.00005.
- Key assumption: n = 4. A says it is "my assumption, not a sourced figure".

**Builder B** (`simB\`)

- One state: the height of the centre of gravity above the road.
- Load: settled at 20 g, held 0.2 s, straight ramp to the peak, held 2 s. Downforce 44.4 kN at 800 km/h.
- Same tyre slope as A; B puts the stops at box bottom 0.123 m above the road.
- Baseline: N = 4, flip, and the tyres give no force once the hub centre is under the road (box bottom 0.086 m under).
- Box alone at N = 4 would rest at 0.25 m only at 160 g on 0.0002 and 639 g on 0.00005 (40 g and 160 g at N = 1).
- Key assumption: the tyres are lost at 0.086 m. B: "Nothing I read says which the game does."

**Builder C** (`simC\`)

- Two states: box bottom and hub, 730 kg body and 120 kg hubs.
- Load: 3 s settle at 20 g, straight ramp to the peak, 2 s hold.
- The 25 g stop load was not fitted; the files alone gave 25.68, 24.88 and 24.20 g at 600, 800 and 970 km/h. The 40 g touch was fitted with one length.
- Tables are at n = 1. C's own count for a 2 × 3 m box on 2 m rows is n = 10.
- Tyres keep pushing in the tabled runs.
- Key assumption: the contact count. C: "The number of points the game keeps is the unknown that decides the outcome."

## Where the three agree and where they do not

**They agree on:**

- The only way through is the normal reversal at 0.25 m under the road. Before it, the contact is a spring and a damper and settles.
- With the reversal switched off and the tyres kept, nothing goes through. A: nothing at any n. B: nothing, deepest 0.256 m at N = 4 and 1.0 m at N = 1. C: the same five runs hold at 0.258 to 0.401 m.
- 0.00005 is four times stiffer and four times more damped than 0.0002.
- The contact count moves the answer as much as the setting does.
- 65 g on 0.00005 holds, with the box bottom under the road: A 0.0093 m (0.0325 m at n = 1), B 0.009 m, C 0.033 m at n = 1 and 0.004 m at n = 10.
- Sink rate at 0.11 m does not separate cleanly in most readings. A at n = 1 has a hold at 10.29 m/s above a through at 8.72 m/s. B at N = 2 has a hold at 3.53 m/s and a through at 3.51 m/s.
- C adds that the contact "never runs away slowly": every through run crossed during the rise or within 0.034 s after the peak.

**They do not agree on:**

- Baselines. Through runs out of 40 on 0.0002: A 0, B 1, C 5 at n = 1 and 0 at n = 10.
- Whether a clean sink-rate line exists. C at n = 1 puts one at about 9.1 m/s (holds to 9.01, through from 9.27). B at N = 4 puts one between 10.1 and 11.4 m/s on a single through run. A finds no clean line on 0.0002.
- Single cells, like for like (0.0002, one point, flip, tyres kept). Counts are close: A 5, B 4 plus 1 stuck inverted, C 5. But 65 g at 0.05 s rise holds in A (at 0.463 m, which A calls an artefact) and goes through in C; 80 g at 0.1 s rise goes through in A and holds in C at 0.247 m.
- Tyres lost, one point, 0.0002: A 30, B 30, C 36 of 40.

## The score

The scorer's text, unedited.

# Score: three soft-contact simulations against the record and the registered bar

**Verdict: DOES NOT REPRODUCE.** All three builders fail part (b), and the bar (`loop/plan_fable_researchers_2026-11-27.md:184`) needs all three parts. The only part met, by all three, is the bare hold at 65 g on 0.00005.

Read by me: `handback/p-d563-wheel-under-O_2026-10-30.md:337-467`, `trackfiles.js:17-36` at c522ea6, and the research note's Answer first, score and checker sections. Nothing was run or retuned; simulation figures are the builders' own. The relayed L266 ring was not part of this step and was not acted on.

## 1. The record's passes

| id | setting | peak load, duration | sink rate at 0.11 m | deepest | outcome | source (`p-d563…`) |
|---|---|---|---|---|---|---|
| reference 1 | 0.0002 | 58 g at the crossing | 0.28 m/s | −11.3 cm | held | `:341`, `:413` |
| reference 2 | 0.0002 | not on the lines read | never crosses | −6.9 cm | held | `:342`, `:414` |
| C05 | 0.0002 | not on the lines read | never crosses | −3.0 cm | held | `:343`, `:415` |
| C09 | 0.0002 | 62.8 g | 0.63 m/s | −15.9 cm | held | `:344`, `:416` |
| C00 19:04 | 0.0002 | 64.61 g, 1.18 s at ≥ 55 g | 0.15 m/s | −14.9 cm, settled 0.6 s | held | `:402-405`, `:417` |
| C07 | 0.0002 | 62.87 g, 0.42 s at ≥ 55 g | 1.66 m/s | −16.1 cm, then through | broke | `:345`, `:418`, `:452-453` |
| C11 | 0.0002 | 57.67 g peak | 1.96 m/s | −13.1 cm, then through | broke | `:346`, `:358`, `:419` |
| C07s | 0.00005 | 64.88 g, 1.54 s at ≥ 55 g | never sinks | +4.5 cm (clear, +5.4 at load) | held | `:452-457` |

- **Held passes with a rate:** three (0.15, 0.28, 0.63 m/s) against two broken, as the checker corrects (research note `:315`).
- **How the load arrived:** it built over more than a second (checker, `:329`), and the broken passes started sinking from the surface at their load peak (`:392`).
- **Stiff setting:** one pass of one car (`:467`).

## 2. Each simulation against the bar

Each builder is scored on its own baseline first, then on its other readings.

| part | A (baseline n = 4, tyres kept) | B (baseline N = 4, tyres lost at 0.086 m) | C (n = 1 tables; its own count is n = 10) |
|---|---|---|---|
| (a) ≤ 0.63 m/s holds, 0.0002 | CANNOT TELL: slowest crossing is 1.38 m/s | CANNOT TELL: slowest crossing is 1.26 m/s | PASS at n = 1 (0.16, 0.46, 0.62 m/s all hold); CANNOT TELL at n = 10 (none reaches 0.11 m) |
| (b) ≥ 1.66 m/s goes through, 0.0002 | FAIL: 0 of 40 through; holds at 4.00 to 10.07 m/s | FAIL: holds at 3.05 to 10.08 m/s; one through, at 11.36 m/s | FAIL: holds at 2.56 to 9.01 m/s at n = 1; nothing through at n = 10 |
| (c) 65 g holds, 0.00005 | holds: PASS | holds: PASS | holds: PASS |
| (c) box 4.5 to 5.4 cm clear | FAIL: 0.0093 m under | FAIL: 0.009 m into the road | FAIL: 0.033 m under (n = 1), 0.004 m under (n = 10) |

- **(a) on other readings:**
  - A at n = 1 has two runs in the band, 0.25 and 0.46 m/s, and both hold.
  - B at N = 1 says "every run that reaches 0.11 m goes through", which would fail.
- **(b) on other readings:** no reading in any report puts the line near the record's.
  - A at n = 1 holds up to 10.29 m/s.
  - A with tyres lost has throughs from 4.2 m/s beside a hold at 4.5 m/s.
  - B at N = 2 has a hold at 3.53 m/s and a through at 3.51 m/s.
  - C puts its line at about 9.1 m/s.
- **Size of the miss on (b):** the simulations' line sits at roughly 3.5 to 11 m/s against the record's 0.63 to 1.66 m/s.
- **(c) hold is weak evidence:** every simulation also holds 65 g on 0.0002 at the slower rise times, so this part does not show the setting as the lever.
- **(c) clearance:** all three were built so the box touches at 40 g, so none can show a box clear of the road at 65 g.

## 3. Agreement between builders

- **(a): they disagree at their baselines.** C can show it, A and B cannot. It rests on the contact count (A and B took 4; C tabled 1 and counted 10). All three name this as the choice that flips most.
- **(b): they agree, all FAIL.**
- **(c): they agree on the hold and on the box being under the road.**
- **Which runs go through, baseline to baseline:** 0 of 40 (A), 1 of 40 (B), 5 of 40 (C at n = 1), 0 (C at n = 10). This rests on contact count and on whether the tyres keep pushing once the hub is under the sheet.
- **Like for like (0.0002, one point, flip, tyres kept):** 5 (A), 4 plus 1 stuck inverted (B), 5 (C). The cells differ:
  - 65 g at 0.05 s rise holds in A (0.463 m, which A calls an artefact) and goes through in C.
  - 80 g at 0.1 s rise goes through in A and holds in C at 0.247 m.
- **Like for like, tyres lost at one point:** 30 (A), 30 (B), 36 (C).
- **By the bar's "if the builders disagree, neither is believed":** part (a) does not count.

## 4. Beyond the bar

Nearest run is the same peak load at the longest rise in the sweep (0.8 s), since the record's loads built over more than a second.

| pass | A baseline | B baseline | C n = 1 / n = 10 | outcome | depth and rate |
|---|---|---|---|---|---|
| reference 1 (58 g, 0.28 m/s, −11.3) | 60 g: holds, 0.027 m, no crossing | 60 g: holds, 0.027 m | 60 g: holds, 0.073 / 0.012 m | HIT | MISS |
| reference 2 (−6.9, never crosses) | 50 to 60 g: 0.013 to 0.027 m | same | 0.036 to 0.073 m at n = 1 | HIT | near for C at n = 1 only |
| C05 (−3.0, never crosses) | as above | as above | as above | HIT | near for A and B |
| C09 (62.8 g, 0.63 m/s, −15.9) | 65 g: holds, 0.033 m | 65 g: holds, 0.033 m | 65 g: holds, 0.091 / 0.015 m | HIT | MISS |
| C00 19:04 (64.6 g, 0.15 m/s, −14.9) | 65 g: holds, 0.033 m | 65 g: holds, 0.033 m | 65 g: holds, 0.091 / 0.015 m | HIT | MISS |
| C07 (62.87 g, 1.66 m/s, broke) | 60 and 65 g hold at every rise | 60 and 65 g hold at every rise | 65 g through only at 0.05 s rise, 10.16 m/s | MISS | MISS |
| C11 (57.67 g, 1.96 m/s, broke) | 55 and 60 g hold at every rise | same | 55 and 60 g hold at every rise | MISS | MISS |
| C07s (0.00005, 64.88 g, +4.5 cm) | holds, 0.9 cm under | holds, 0.9 cm under | holds, 3.3 / 0.4 cm under | HIT | MISS |

- **Runs that did produce about 1.66 m/s:** A 60 g at 0.05 s rise (1.38 m/s), B 65 g at 0.1 s (1.26 m/s), C 80 g at 0.4 s (1.50 m/s). All hold.
- **The pattern:** every simulation says "holds" for every recorded load at a slow rise. The six HITs are the six holds, and both breaks are MISSes.
- **Depth under a held load:** the record's box sat 13 to 15 cm in at 60 to 64 g. The simulations settle at 3.3 cm with four points and 9.1 to 9.2 cm with one.
- **Holds at 11 to 25 cm:** allowed, at one contact point or with tyres lost.
  - A at n = 1 settles as deep as 0.244 m.
  - C at n = 1 reaches 0.247 m.
  - B has four runs resting at 0.102 to 0.141 m on the box alone.
- **Holds at 26 to 28 cm for seconds (C15, research note `:96`):** not allowed under the normal reversal at 0.25 m, which is every builder's only way through.
  - They appear only with the reversal switched off (B 0.256 m, C 0.258 to 0.401 m), and then nothing goes through.
  - A's one deeper hold, 0.463 m, A itself reads as an artefact.

## 5. Verdict

**DOES NOT REPRODUCE**, by the bar as registered. Part (b) fails in all three, part (a) is shown by one builder and only at a contact count the others did not take, and part (c) holds in all three with the box under the road where the record has it 4.5 to 5.4 cm clear.

By the plan's own line (`plan_fable_researchers_2026-11-27.md:186`) the finding is that the public library's contact, as these three built it, does not carry the record's sink-rate separator. The next step named there is data.

## 6. Predictions

Part (c)'s hold is passed by all three, so the step's condition is met on its narrowest reading. The plan (`:185`) offers predictions only if the bar is met, and it is not. These come from models whose through mechanism failed part (b); treat them as the weakest kind.

- **Small `MAX_DEPTH` (0.1 m):**
  - All three: no pass goes through on either setting, and the car is kicked or keeps bouncing (A 2 runs, B 2 runs, C 18 to 27 runs at n = 1; A puts the kick at 6.7 m/s).
  - Wrong if a car goes through mid-road with it set, or rides the helix at 60 g or more with no bounce.
  - At 0.2 m the builders disagree: A and B 0 through, C 9 through with its rigid-kick reading. No prediction.
- **Rigid box contact (`RIGID_WITH_BOXES=1`):**
  - All three: nothing goes through, and the box is never deeper than 0.026 to 0.097 m (A 0.034, B 0.036, C 0.026 or 0.097).
  - Wrong if a pass goes through, or the box is seen more than 10 cm under.
- **Extended box:** the builders disagree. B holds all 40; A and C still have 1 to 2 through at one contact point (80 and 90 g, 0.05 s rise). It rests on contact count, and on which way the extension moves the 0.25 m reversal, which no source settles. No prediction.
- **Against the first prediction from the record:** bodies were 3.9 to 5.0 m under with `MAX_DEPTH=4` and nothing turned hard (checker, research note `:337`).

(End of the scorer's text.)

## What the variants predict

The bar was not met, so the plan offers no predictions. The scorer allowed two, as the weakest kind, because all three builders agree on them. Each is stated so one lap can prove it wrong.

1. **`MAX_DEPTH` at 0.1 m.** Predicted: no pass goes through on either setting, and the car is kicked or keeps bouncing where the box goes past 0.1 m. Wrong if a car goes through mid-road with it set, or carries 60 g or more with no bounce.
2. **`RIGID_WITH_BOXES=1`.** Predicted: nothing goes through, and the box is never more than 10 cm under the road. Wrong if a pass goes through, or the box is seen more than 10 cm under.

No prediction is made for `MAX_DEPTH` at 0.2 m or for the extended box. The builders disagree on both.

The scorer's caution stands against the first: the record already has bodies 3.9 to 5.0 m under with `MAX_DEPTH=4` and nothing turning hard. If the key did nothing at 4, a lap at 0.1 tests whether it does anything at all.

## What this changes for the track editor

Nothing yet. The simulations failed the bar, so no editor rule can rest on them.

## How to re-run each simulation

All three are plain Node scripts with no dependencies. Each writes its own `results.json` beside it and has a `README.md`.

| builder | folder | command | time, runs |
|---|---|---|---|
| A | `exo_memory\research\t180_soft_contact_simulation_2026-11-27_evidence\simA\` | `node sim.js` | 0.2 s; `results.json` 466 KB |
| B | `exo_memory\research\t180_soft_contact_simulation_2026-11-27_evidence\simB\` | `node sim.js` | 0.8 s; 2,880 runs |
| C | `exo_memory\research\t180_soft_contact_simulation_2026-11-27_evidence\simC\` | `node sim.js` | 0.7 s; 3,520 runs |

Times and run counts are the builders' own. This writer ran none of them.

## Not known, not modelled

**Not known (no source any builder read settles it):**

- How many contact points the game keeps for a car box. This flips outcomes most in all three.
- Whether the tyre rays still give force once the hub is under the road. A: 5 through becomes 30 at n = 1 on 0.0002. C: 5 becomes 36.
- Whether the game's collider shares the public library's normal reversal at half height.
- The game's own solver settings: its hard-contact ERP and CFM, any cap on correcting velocity, bounce threshold, iteration count.
- What "hard" means for `MAX_DEPTH` and `RIGID_WITH_BOXES`. C tried two readings and they gave different results.
- What `EXTEND_COLLIDER_BOXES` does: neither the amount nor the direction is documented.
- The suspension's motion ratio, and whether `MIN_LENGTH` is a hard stop (B).

**Not modelled by any builder:**

- Pitch, and road curvature under a 3 m flat box. B notes tilt would delay the reversal a little past 0.25 m. C notes the box ends sit 13 mm closer than the middle at 84 m radius.
- The car's mesh collider (A). Anti-roll bars and solver iteration error (C).
- A box clear of the road at 65 g. All three were built so the box touches at 40 g, so none could show the record's clearance on the stiffer setting.

**Doubts the builders raised about their own work:**

- A: the 0.086 m hub figure rests on a linear tyre at 40 g, which is 0.31 m of deflection on a 0.395 m tyre.
- A and B: the ODE manual page returned 404 for them; A derived the stiffness formula from the solver lines, B quoted it from memory. C reached the manual and quotes it.
- All three report reading no recorded outcome. Each saw only the patch's comment lines, and one config line saying the box extension "prevents cars from falling through the ground in when falling fast".

**What the record has that no simulation produced:**

- A break at a sink rate of 1.66 or 1.96 m/s under a load that built over more than a second.
- A box held 13 to 15 cm in at 60 to 64 g (four-point runs settle at 3.3 cm).
- Holds at 26 to 28 cm for seconds, which the 0.25 m reversal does not allow.

## Checker (a subagent that wrote none of the above)

2026-11-27. Read-only apart from re-running the three simulations in place. Each claim below is marked checked (I ran or opened it) or inferred.

**Verdict on the verdict: it stands.** DOES NOT REPRODUCE follows from the bar as registered (`loop/plan_fable_researchers_2026-11-27.md:184`, reopened; the quote in this note is verbatim). Part (b) fails in every reading of every builder, and no part of the bar was relaxed to reach that.

### 1. Re-runs

- **All three sim.js files were read first** (checked): plain Node, `fs` and `path` only, no network, no child process, one write each, to `results.json` in its own folder.
- **All three ran in under a second each** (checked; about 1.3 s for the three together), so the heavy-run wrapper was not needed.
- **`results.json` is byte-identical before and after in all three** (checked, sha256):
  - simA sha256 `21dbedf925b621c9…`
  - simB sha256 `0aefd6511a6849b6…`
  - simC sha256 `c8cdaf622b4241bb…`
- **The figures the note quotes came out again** (checked against the printed tables and the JSON):
  - A: 0 of 40 through at baseline; slowest crossing 1.38 m/s; holds at 4.00 to 10.07 m/s; at n = 1, 5 through, a hold at 10.29 above a through at 8.72, holds at 0.25 and 0.46; 30 through with tyres lost; 65 g on 0.00005 at −0.0093 m (−0.0325 m at n = 1); the 0.463 m flipped hold.
  - B: 1 of 40 through at baseline, at 11.36 m/s; holds at 3.05 to 10.08; slowest crossing 1.26; N = 2 hold 3.53 against through 3.51; N = 1 with tyres lost, 30 of 30 reaching 0.11 m go through; 65 g on 0.00005 at 0.009 m under; four holds resting at 0.102 to 0.141 m.
  - C: 5 of 40 at n = 1 and 0 at n = 10; holds to 9.01, through from 9.27; holds at 0.16, 0.46, 0.62; 36 with tyres lost; 65 g on 0.00005 at −0.033 and −0.004 m; stop loads 25.68, 24.88, 24.20 g; 3,520 runs.
  - Run counts: B 2,880 and C 3,520 (checked). A's file is 466,323 bytes.

### 2. Signs of tuning

- **None found toward the record** (checked). No constant near 0.63 or 1.66 m/s appears in any sim.js or README. 0.11 m is used only to read off a rate, never as a rule. 65 g appears only as a point to report.
- **No code looks as though its builder knew the outcomes.** A search of the three folders for the record's rates, pass labels and the track's name finds nothing, and every simulation gives the opposite of the record on the breaks.
- **The brief itself carried record-derived inputs**, which is not the same as tuning on outcomes but should be said: the 25 g and 40 g points, the 0.11 m reading depth, 65 g, and a load grid dense at 55 to 65 g. A and B fit both load points; C fits one.
- **`trackfiles.js:17-36` holds the outcomes in a comment** (lines 20 to 26: the two rates, the hold on the stiffer setting, the clearance). The plan gave builders `:27-36` only (`plan_fable_researchers_2026-11-27.md:183`), which is the block without the comment. I cannot check what each builder actually opened; each README says none was read.
- **"Goes through" is defined differently, and it decides one cell.** A and B call a run through when the box's top is under the sheet (depth ≥ box height). C calls it through as soon as the depth passes half height (`simC/sim.js:94-95`). The note's "65 g at 0.05 s rise holds in A and goes through in C" is this difference: A and B reach the same 0.463 m there (B labels it INVERTED). The like-for-like counts "5, 4 plus 1, 5" compare two definitions. It does not touch part (b).
- **Unsourced constants, all declared by their builders:** the contact count (4, 4, 1 and 10); the bounce threshold (0, 0, 0.1 m/s); the "hard" contact's CFM (0, 1e-10, 1e-5); the tyre-loss depth.
- **A and B are close to one model** (inferred from the code): same stages, same series-spring formulas, same tyre-loss depth 0.0862 m, tables equal to two or three figures. All three are builds of one brief with one degree of freedom, so their agreement checks the coding more than the physics.

### 3. Arithmetic

- **Stiffness and damping are right in all three** (checked by hand from ERP = h kp / (h kp + kd), CFM = 1 / (h kp + kd), h = 1/333 s): kp = ERP / (h CFM) = 0.8 × 333 / 0.0002 = 1,332,000 N/m and kd = (1 − ERP) / CFM = 1,000 N·s/m; 5,328,000 and 4,000 on 0.00005. 1/CFM is 5,000 and 20,000.
- **The three solver lines are the same equation** (checked): A and B solve per row with n rows, C solves for the total; all reduce to n points acting as CFM / n.
- **One label is loose.** "At n = 4 the contact totals 5.33e6 N/m and 20,000 N·s/m" uses 4 × 1/CFM, not 4 × kd. The damping in the manual's sense is 4,000 N·s/m at n = 4 on 0.0002 and 16,000 on 0.00005. The table above it has both columns, so this is a naming slip, not a wrong number.
- B's box-alone rest loads (160 g, 639 g, 40 g, 160 g) follow from kp × n × 0.25 m / (850 × 9.81) (checked: 159.7 g).
- I did not reopen the library's source for the half-height reversal. It is three builders' reading of one file, not something this check confirmed.

### 4. The record

- **The score's table matches the source** (checked, `handback/p-d563-wheel-under-O_2026-10-30.md:340-467`): all eight rows, rates, depths, loads, durations and outcomes.
- **Two cells marked "not on the lines read" are in the record** at `:194-195`: 58.24 g for the second reference pass and 52.24 g for C05.
- **The citations `:315`, `:329`, `:337` and `:96` do not point into this note.** They are lines of `research/t180_why_a_car_goes_through_a_road_2026-11-27.md` (checked: its `:315`, `:329`, `:337` and `:96` hold what is quoted). The score never names that file.
- **"With the reversal switched off and the tyres kept ... B: nothing, deepest 0.256 m at N = 4 and 1.0 m at N = 1" is mislabelled** (checked in `simB/results.json`). Those two figures are B's tyres-lost reading, where 29 of 40 runs at N = 1 end with the whole box under the sheet (B's BURIED). With tyres kept, B's deepest is 0.18 m at N = 4 and 0.405 m at N = 1 (5 runs past half height, none past full). The same slip is in the score's section 4 ("B 0.256 m").
- **"A finds no clean line on 0.0002"** holds at n = 1 and at baseline. At n = 2 A's summary does report a clean split (hold to 11.51, one through at 13.51 m/s).

### 5. Answer first, and names

- **No track name appears** in the note or in the three evidence folders (checked by search).
- **Nothing listed as not known is stated as known in "Answer first".** The second bullet is scoped to the public library's collider, which is the right scope; it still rests on a reading of the collider that no one outside the three builders has checked.
- **"Runs sinking at 2.56 to 10.08 m/s still hold"** is a union across builders of the holds above 1.66 m/s (C's lowest, B's highest), not one builder's range. A at n = 1 also holds at 10.29.

### 6. What the note should have said and did not

1. **The record's breaks begin shallower than the simulations' only way through.** The broken pass was at −16.1 cm, then −21.5 and −50.9 cm on the next two 15 ms frames (`p-d563…:196-197`); the other broke at −13.1 cm (`:369-371`). The box was already accelerating down before 25 cm. Every simulation needs the box at 25 cm before anything pushes it on. That is a mismatch of mechanism, and it is stronger evidence than the rate line that the game's contact differs from these builds (inferred from the record's frames; no simulation was run for it).
2. **Almost every simulated pass sinking at 1.66 m/s or more comes from a load that rises in 0.05 to 0.2 s**, which the record's passes did not do. At the two longest rises the fastest crossings are 1.65 m/s (A, n = 1), 1.50 (C) and none (A and B baselines), and all hold. Part (b) fails either way; the size of the miss ("3.5 to 11 m/s") is measured on runs unlike the record's.
3. **The two rates are not measured the same way.** The record's is a three-frame difference of a per-frame box height (`p-d563…:349`); the simulations report the velocity at the tick of crossing. Not quantified here.
4. **Part (a) and part (b) rest on three held passes and two broken ones** (the score says so; "Answer first" does not).
5. **Two departures from the plan, both declared but worth one line each:** three builders ran where the plan registered two, and two predictions are offered although the plan offers them only if the bar is met. The clearance row under part (c) is an addition to the bar, not a part of it; it makes the score stricter, not looser.

---
**Librarian’s check, 2026-11-27 07:09 (L):** Answer first and the checker’s result read by me. Re-run by me: simA and simC (`node sim.js` in each folder, under a second each); each `results.json` has the same sha256 before and after (21dbedf925b621c9…, c8cdaf622b4241bb…). No sim.js names a child process or a network module (grep). simB not re-run by me. **The bar was mine, registered before the builders started, and it was not met.** What follows from that is in the plan’s own line: the next step is data from driven laps, not more reasoning about the engine.
