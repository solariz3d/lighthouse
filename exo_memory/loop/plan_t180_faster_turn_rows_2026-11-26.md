# Plan: a faster turn-change row (pane E, D677, 2026-11-26): a plan, no code

The chair's order (20:54:57Z): the catalogue's main class. O's [T3] by-hand study finds that the control that would cut the count most,
in 53 of 74 sections, is the turn-change row the panel already has. The core needs about 10.3 m per °/100m of change, so every row was
refused or missed. This plan gives where the law lives, what a faster one costs, the options, and a registered prediction for [T3].

- Base: t180 `ceb21f5` (landing-1126), read only.
- Measurement: synthetic shapes only. They ran in a scratch worktree, `G:/consonance-scratch/e-fastrow` at `ceb21f5`, never committed,
  with three env-read lines in its `src/core/extend.js` (`FR_K`, the turn's spread; `FR_SHARE`, BASE_SHARE_MAX; `FR_FLOOR`, SECOND_FLOOR_M).
  Unset, the copy is the base byte for byte in behaviour.
- Scripts: `fr_probe.cjs` and `fr_cut.cjs` in this session's scratchpad, `scratchpad/fr/`. They are local and named in the hand-back
  trail only. Every run was headless and BelowNormal; no heavy-run lock was taken (one file per run), and the lock was read for "timing" first.
- No other author's track data is in this file. [T3] appears only through O's committed hand-back, quoted.

## My bias, stated first

**I wrote the bar these rows are held to.**
- D637 (`exo_memory/handback/p-d637-turn-climb-joints-E_2026-11-03.md:71`) carried the bank's roll bar to curvature.
- My L139 registration (`fc21dcdd`) put the turn and climb rows on it. Its words: *"A 5 m second turn is laid and read clean, yet it is a
  lateral jerk no driver wants. The minimum has to come from a ride rule."*

So I hold a stake in the law staying. The rows below are written so that a seat with no stake can re-run them and read the dial.

**The unwelcome outcomes, named before the runs:**
- (a) *"the law refuses a row for a shape the cut lays freely, so it buys no smoothness."* This is the one against my own law.
- (b) *"no option that keeps the bar reaches [T3]'s rate, so the control in the 53 lines is not a faster row but a waived bar."* This is
  the one against the chair's framing.

**(a) came true. (b) is registered below as a prediction**, because testing it needs [T3]'s data, which this file may not hold.

## 1. Where the law lives, and what it guards

### The law (all at `ceb21f5`)

- **`src/core/extend.js:494-497` `minLaw`:** a turn or climb change's own shortest is `3·|Δ| / ROUTE_BAR`.
  - Δ is in rad/m. That is **5.15 m per °/100m**.
  - checked: `fr_probe.cjs law`, a 2,000 m piece starting at its own rate. Each shape needs 25.7 / 51.5 / 102.9 / 205.9 m for changes of
    5 / 10 / 20 / 40 °/100m, which is 5.14-5.15 m per °/100m.
- **`:345` `ROUTE_BAR = 29.4 / (10·170²)`:** "3 g at a wheel 10 m out at 170 m/s, per metre squared". In curvature terms, the load
  changes by at most 3 g over 10 m of road at 170 m/s.
- **`:347` `SECOND_FLOOR_M = 20`, applied at `:385`:** the shortest is never under 20 m.
- **`:388-400` `ceilOf` and `:499` `BASE_SHARE_MAX = 0.5`:** these give the doubling.
  - When the piece's own first turn ramp still runs under the change (D642, the change ADDS on top), the law takes that ramp's peak out of
    the change's budget: `m = own / (1 − share)`, with the share capped at 0.5. So the law is at most ×2: **10.3 m per °/100m**.
  - For the turn, the share is the closed form `(3·|first step| / ROUTE_BAR) / piece length` (`:504-508`). The cap is hit whenever the first step's own law is half the piece's length or more
    (0 → −80 °/100m needs 412 m, so any piece under 824 m).
  - checked: on 300 m and 120 m pieces whose first ramp runs from 0 to −80 °/100m over the whole piece, every −80-based change needs
    10.29-10.30 m per °/100m. This is O's 51.5 / 102.9 / 205.9 m (O's hand-back `:31`), reproduced.
  - The same shapes on a 2,000 m piece need 6.48 (the share under the cap).
- **Refused at `:570-581`:** `BAD_SECOND`, "needs at least X m before the piece's end". The quintic shape the law is sized for is the
  `:369-370` comment: *"every change blends by the quintic, whose rate of change peaks at 1.875·|Δ|/L, 0.625 of ROUTE_BAR there."*

### What the record says it guards

- **The bar is the bank's.** `src/core/adapter.js:402` `BANK_BAR`, "3 g at a wheel 10 m out at 170 m/s". It is sized on his replay
  (`adapter.js:393-394`: *"295 m/s² at a wheel 10 m out at 170 m/s (his replay: 62 to 134 m/s² where it turns back, holds or starts)"*).
- **D637 made it a curvature bar** for the at-start ramp (`app/core/panel.js:161-171` `routeStartM`, `ROUTE_SPREAD = 3`). It was measured
  there: *"2.35 laid his p33 at 1.25 times the bar, 3 under it"*.
- **L139 put every field's later changes on it.** The keeper's words:
  - 2026-11-05 00:34: *"Remember its more than just the banking, its the turns, climb, etc."*
  - 06:49Z: *"what if i want the climb to change more than once per piece, the same with turns?"*
  - 07:00Z: *"we dont want the bumps, we want the transmutations to be smooth all around the board"* (`extend.js:294`, `:335-336`).
- **D642 is why the base share exists.** His 19:54Z words: *"it makes it more sharp and takes the original shape away"*, so a change ADDS
  and never squeezes (`extend.js:320`). The base share is how the law budgets a first ramp still moving under the change.
- **The bank's comfort length, 31.5·√deg (`extend.js:294-298`, L139),** is the bank's own version of the same smooth-all-around rule.
  It does not bind a turn row. It binds the bank that follows one (section 2d).

**So the law guards one quantity: the rate at which the lateral load changes inside a piece** (κ′ = dκ/ds). It holds the document's
quintic to 0.625 of the bar, or about 0.3 when the base share doubles it.

## 2. What a faster law costs, measured on synthetic shapes

### Setup and measures

- **The shape:** a 200 m lead-in at rate r0, then a 300 m piece at r0 with one turn change to r1 over its last X m, then 150 m at r1.
  The piece starts at its own rate (no first ramp) unless marked.
- **How it is read:** the built path (`adapter.js toPath`, a sample every 0.25 m), heading rate by central differences. Measures at the
  **460 km/h design speed** (`src/validate/limits.js:78`, 127.78 m/s):
  - **κ′/bar:** the peak dκ/ds over ROUTE_BAR.
  - **jerk:** the peak lateral jerk v³·κ′, in g/s. 1.0 bar is **21.7 g/s at 460** (51 g/s at the bar's own 170 m/s).
  - **hold:** the most the rate leaves r0 before the mark.
  - **end:** how far the rate is from r1 at the piece's end; **over:** the most it passes r1.
  - **C2:** the largest rate step between 0.25 m samples within 2 m of the mark and of the piece's end.
  - **roll:** the bank that would balance the turn at 460, atan(v²κ/g): its change, its peak roll rate, and its roll acceleration over the
    bar. The row moves no bank. This is what a bank that follows the turn would have to do.

### 2a. The row, a 40 °/100m change (−40 → −80)

| X m | m per °/100m | κ′/bar | jerk g/s | hold | end | over | C2 step | roll °/s | roll acc/bar |
|---|---|---|---|---|---|---|---|---|---|
| 206 | 5.15 (the law) | 0.625 | 13.5 | 0.000 | 0.000 | 0 | 0.000 | 3.1 | 0.40 |
| 128.8 | 3.22 | 0.999 | 21.6 | 0.000 | 0.000 | 0 | 0.001 | 5.0 | 1.00 |
| 116.4 | 2.91 | 1.340 | 29.0 | 0.000 | 0.000 | 0 | 0.001 | 10.0 | 6.43 |
| 103 | 2.58 | 1.264 | 27.4 | 0.000 | 0.001 | 0 | 0.001 | 6.1 | 2.17 |
| 72.8 | 1.82 | 1.766 | 38.2 | 0.000 | 0.001 | 0 | 0.003 | 8.8 | 4.03 |
| 40 | 1.00 | 3.310 | 71.7 | 0.000 | 0.015 | 0 | 0.024 | 17.9 | 12.85 |
| 30 | 0.75 | 4.994 | 108.2 | 0.000 | 0.023 | 0 | 0.038 | 25.5 | 21.19 |
| 20 | 0.50 | 6.248 | 135.3 | 0.000 | 0.219 | 0 | 0.308 | 32.1 | 32.98 |
| 10 | 0.25 | 20.571 | 445.5 | 0.000 | 2.440 | 0.139 | 2.998 | 58.7 | 69.57 |

### 2b. An S, −10 → +10 (Δ 20)

| X m | m per °/100m | κ′/bar | jerk g/s | end | over | roll °/s |
|---|---|---|---|---|---|---|
| 206 | 10.30 | 0.312 | 6.8 | 0.000 | 0 | 387 |
| 103 | 5.15 | 0.632 | 13.7 | 0.000 | 0 | 780 |
| 64.4 | 3.22 | 0.990 | 21.4 | 0.002 | 0 | 1,165 |
| 58.2 | 2.91 | 1.497 | 32.4 | 0.005 | 0 | 1,670 |
| 36.4 | 1.82 | 2.878 | 62.3 | 0.007 | 0.099 | 3,553 |
| 20 | 1.00 | 3.124 | 67.7 | 0.110 | 0 | 3,813 |
| 10 | 0.50 | 10.285 | 222.7 | 1.220 | 0.070 | 8,166 |

### 2c. A small change, −80 → −75 (Δ 5)

- At 26 m (5.2 m per °/100m) the row reads 0.612 of the bar, and ends 0.008 off.
- At 13 m: 1.98 of the bar, ending 0.25 off.
- At 6 m: 4.29, ending 0.44 off.
- At 3 m: 8.57, with a hold of 0.046 and ending 0.60 off.

checked, all of 2a-2c: `FR_K=0.001 FR_FLOOR=1 node fr_probe.cjs cost <r0> <r1> <X,…>` → `scratchpad/fr/cost1.txt`, `cost_opts.txt`.

### 2d. With the first ramp moving under the change (the D642 case, `FR_BASE=1`)

The piece's first ramp runs from 0 to r0 over its 300 m.

| shape | X m | m per °/100m | κ′/bar (the change and the ramp, as built) |
|---|---|---|---|
| −80 → −60 | 206 | 10.30 (today's law) | 0.612 |
| −80 → −60 | 103 | 5.15 | 0.677 |
| −80 → −60 | 64.4 | 3.22 | 0.753 |
| −80 → −60 | 52 | 2.60 | 1.023 |
| −80 → −60 | 36.4 | 1.82 | 2.731 |
| −80 → −75 | 26 | 5.20 | 0.482 |
| −80 → −75 | 13 | 2.60 | 1.978 |
| −20 → −40 | 103 | 5.15 | 0.732 |
| −20 → −40 | 52 | 2.60 | 1.292 |

checked: `cost_base.txt`, and the last command of the run log.

### 2e. The same change made by a CUT

A new piece of X m, typed at r1, laid on the **unpatched** law:

| shape | X m | m per °/100m | κ′/bar | jerk g/s | refused? |
|---|---|---|---|---|---|
| −40 → −80 | 206 | 5.15 | 0.50 | 10.8 | no |
| −40 → −80 | 128.8 | 3.22 | 0.81 | 17.6 | no |
| −40 → −80 | 103 | 2.58 | 1.02 | 22.1 | no |
| −40 → −80 | 72.8 | 1.82 | 1.46 | 31.7 | no |
| −40 → −80 | 40 | 1.00 | 2.56 | 55.5 | no |
| −40 → −80 | 20 | 0.50 | 5.08 | 110.0 | no |
| −40 → −80 | 10 | 0.25 | 10.16 | 220.0 | no |
| −10 → +10 | 20 | 1.00 | 2.54 | 55.0 | no |

checked: `node fr_cut.cjs -40 -80 206,103,40,20,10`, `node fr_cut.cjs -10 10 103,40,20,10`, `node fr_cut.cjs -40 -80 72.8,128.8`.

### What the measurements say

1. **κ′ follows the quintic, 1.875·Δ/X, nearly everywhere.** It reads 0.625 at the law, 1.0 at 3.22 m per °/100m and 3.3 at 1.0.
   **The exception, which every option must answer:** at 2.91 m per °/100m both shapes read **above** what the closed form gives
   (1.34 and 1.50 against 1.11), and 2.91 reads higher than the shorter 2.58 does (1.264). Likewise the S at 1.82 reads 2.88, not 1.77.
   - inferred: the knots inserted at `extend.js:312-315` (SECOND_SUB 8, KNOT_GAP_M 5 m) fall differently at some lengths, as the bank's
     probe spikes did (`:291`, "147 m: about 0.019° per degree of change, while 146.5 m and 147.5 m are clean").
   - **So a law written in closed form alone can lay rows over its own bar.** Seen at the combined law's own minimum (1.82, below): the S
     reads 1.63 × the 460 bar. For O2 alone the readings at its minimum are 0.999 and 0.990; past its minimum it is not measured, only
     inferred from the readings above. Any faster law needs the row read on the built road, as the bank's `spanHolds` already does
     (`:403-410`).
2. **The hold before the mark costs nothing.** It is 0.000 °/100m at every span of 6 m or more, and at most 0.046 at 3-5 m. D642's hold is
   made by construction (the control points before the mark are held at 0, `:320-327`), not by the law's length.
3. **C2 and the shape hold down to about 30 m, then break.**
   - At 20 m the row ends 0.11-0.22 °/100m short of its target. At 10 m it is 1.2-2.4 short and overshoots on the way, and the rate steps
     3.0 °/100m between 0.25 m samples at the piece's end, against the quintic's own 1.9.
   - inferred: that is the next piece taking up what the row missed, and the joint keeps the line continuous.
   - **The row's shape floor is the knot spacing, about 20 m, and SECOND_FLOOR_M already sits there.** A row shorter than ~20 m is a
     cut's job.
4. **Roll is not the turn law's to give.** A bank that balanced a 40 °/100m change at 460 would move 2.45° and roll at 3-18 °/s across the
   spans above. But an S at 460 swings the balance bank 142°, at 387 °/s even at today's 10.3. The bank's own law
   (31.5·√142 ≈ 375 m) is what governs a turn whose bank follows it, and no turn option here moves it.
   - O's table names the bank as the binding control in 4 sections, the turn in 53 (O `:17-24`). So inferred: the bank law does not bind
     [T3]'s rows first.
5. **The base share's doubling is not needed where it was measured.**
   - At 5.15 (half today's law) the change on a moving first ramp read 0.48-0.73 of the bar as built (2d, three shapes); at 3.22, 0.75.
   - The 0.5 cap is a closed-form ceiling. On the bank the room already replaced it with a built-road read (`:381-384`, E's 9a1a566f §5),
     for the same reason.
6. **The cut is not guarded, and it is no rougher than the row it replaces (outcome (a)).**
   - The same change as a new piece of the same length is laid at every length, down to 10 m, and is refused at none.
   - At equal length the cut reads **0.77-0.83 of the row's κ′** (40 m: 2.56 against 3.31; 72.8 m: 1.46 against 1.77; 128.8 m: 0.81
     against 1.00).
   - So a person refused a 40 m row types a 40 m piece instead and gets a road 2.56 × the bar. **The refusal buys about 1.3×, and only
     against the one route the panel offers for a change inside a piece.**
   - O's 560 by-hand pieces are cuts (O `:33`: *"the hand counts below are made of cuts, not rows"*). They already ride at whatever κ′ the
     cuts gave, unrefused.

## 3. Options

Each option below is tier **PROVE IT** (core maths, a guard). Each needs:
- test first;
- the mutation harnesses that name `src/core/extend.js` whole;
- the full suite at landing.

Each starts with a red row: the row is written and seen red on `ceb21f5` before any code. Every row reads the BUILT road (section 2, finding 1), never the
closed form alone. Bar readings use the rows' own 1.05 margin (`extend.js:427`, "the rows read the built path to 1.05").

### O0. The law stays as it is

- Cost: none.
- Gain: none for [T3]. A person keeps cutting at the extremes, at O's counts, with the cut unguarded (2e).
- The honest form of keeping it adds one thing: the refusal names the cut ("or end the piece here and type the next"), so the panel says
  what the person will do anyway. That part is tier check it, panel wording.

### O0′. The law, applied to both routes

- Hold a new piece's own first turn ramp to the same bar.
- This is the consistent form of the keeper's "smooth all around the board". It would make [T3] **harder** by hand, not easier: 2e's 40 m
  cut would be refused like the row.
- Named so the choice is visible. I do not recommend it without his word.

### O1. The base share read on the built road (×2 where the first ramp runs under the change)

- **What it changes:** the turn and climb take the bank's route. `spanHolds` reads one probe of the built road between the change's own
  minimum and the closed-form ceiling, instead of the 0.5 cap.
- **Gain:** 10.3 → 5.15 m per °/100m where a first ramp runs under the change, which is O's case. Nothing where none does.
- **Cost:** none past the bar. The built peak is under it by construction of the check (2d: 0.48-0.73 at 5.15).
- **Red-first rows:**
  - R1a: a 300 m piece, first ramp 0 → −80 °/100m over the whole piece, a change −80 → −60 from 197 m (103 m). It is refused on `ceb21f5`
    ("needs at least 205.9 m"). It must lay, and its built κ′ must be ≤ 1.05 × the bar (measured 0.677).
  - R1b: a change on a moving first ramp that reads over 1.05 as built is still refused: −80 → −75 over 13 m (2d: 1.98). The refusal
    names a span whose built road holds.
  - R1c: a piece with no first ramp. Its refusals are byte-equal to today's.
  - R1d, mutation: restoring the 0.5 cap turns R1a red.
- This is the one option that keeps the bar exactly as ruled. inferred: it is not the keeper's call, as the bar does not move. The
  chair may still rule it is.

### O2. The spread at the quintic's own peak (3 → 1.875)

- **What it changes:** `minLaw` sizes the change so that the quintic itself reaches the bar, not 0.625 of it.
- **Gain:** 5.15 → 3.22 m per °/100m, and 10.3 → 6.44 with the cap.
- **Cost:** the row's peak goes 0.625 → 1.0 of the bar (2a: 0.999; 2b: 0.990), so 13.5 → 21.6 g/s at 460.
  - Today's margin was never measured to be needed on rows. It came from the at-start ramp (D637: a spread of 2.35 laid p33 at 1.25×,
    when the ramp shape was not the quintic).
- **Red-first rows:**
  - R2a: −40 → −80 over 129 m on a piece with no first ramp. It is refused today ("needs at least 205.9 m"). It must lay at ≤ 1.05.
  - R2b: the same over 128 m is refused (the minimum is 3.22 × 40 = 128.8 m).
  - R2c, the non-monotone row: every whole metre from the new minimum to 60 m past it, on both 2a's and 2b's shapes, read on the built
    road, ≤ 1.05. It is RED if the closed form alone lets through a span that reads over 1.05 (section 2, finding 1).
  - R2d, mutation: spread 1.875 → 1.7 turns R2c red.
- **His call:** it spends the margin his "smooth all around" ruling was given with.

### O3. The bar sized at the design speed (170 → 127.78 m/s)

- **What it changes:** the rows' bar is 3 g over 10 m at 460 km/h (`limits.js:78`, the design speed, "the pooled p50 of the same laps").
  That is ROUTE_BAR × (170/127.78)² = × 1.770.
- **Gain:** 5.15 → 2.91 m per °/100m. With O2: 1.82.
- **Cost:**
  - At 170 m/s a row at its minimum changes the load by 5.3 g over 10 m. At 460 the jerk is the same 21.7 g/s × 1.77 = 38 g/s
    (2a at 1.82: 38.2).
  - It is a shared constant: `extend.js:345`, `panel.js:168` (the at-start ramp), and in spirit `adapter.js:402`, the bank's bar sized on
    **his replay**. Moving only the rows' copy splits one bar into two.
- **Red-first rows:**
  - R3a: −40 → −80 over 117 m is refused today. It lays, and its built κ′ is ≤ 1.05 × the 460 bar.
  - R3b: the at-start ramp and the bank's bar are unchanged (byte-equal on the existing `core_early_turn_climb` and bank rows).
  - R3c, mutation: the 460 bar used for the at-start ramp turns R3b red.
- **His call, outright:** it moves the speed the room's ride rule is read at.

### O4. A row under the bar is shown, not refused (down to the shape floor)

- **What it changes:** a turn or climb row of 20 m or more lays whatever its κ′, and the panel shows its built peak × the bar in amber, as
  the roll amber does. Under ~20 m it is refused, naming the cut, because the row loses its shape there (section 2, finding 3).
- **Gain:** down to 0.5 m per °/100m on a 40 °/100m change (20 m), and to the floor on any change.
- **Cost:** a row reads up to the cut's own κ′ at the same length, and about 1.3× more (2e). At 20 m on Δ 40 that is 6.25 × the bar,
  135 g/s at 460, against the cut's 5.08 and 110.
- **Red-first rows:**
  - R4a: −40 → −80 over 40 m lays, and the panel reports 3.31 ± 0.1 × the bar.
  - R4b: the same over 15 m is refused, naming the cut.
  - R4c: the row's end is within 0.25 °/100m of its target at every whole metre from 20 to 60 m (2a/2b's shapes; it is red at 10 m today
    by 2.4).
  - R4d, mutation: the refusal floor 20 → 10 turns R4c red.
- **His call, outright:** it reverses "we dont want the bumps" for rows, and makes them as smooth as the cut, no smoother.

### O5. A row shaped to the cut (smaller, optional)

- The cut's first ramp reads 0.77-0.83 of the row's κ′ at the same length (2e).
- Laying a row's step with the first ramp's shape instead of the plain quintic would give rows the same 1.2-1.3×.
- It needs D642's additive hold kept (section 2, finding 2): an open question, not measured here.

### Combined

- O1 + O2 + O3 = **1.82 m per °/100m**, with or without a first ramp. It is under the 460 bar in closed form.
- As built it reads 1.766 × the 170 bar on 2a (≈ 1.0 at 460) but **2.878 on the S (1.63 at 460)**, and 2.73 with a first ramp. So even the
  combined law needs R2c's built-road read, or it lays over its own bar on some shapes.

## 4. Which option would make [T3]'s 53 sections, registered as a falsifier

O's words for [T3]'s shape: *"[T3]'s turns change their rate by tens of °/100m over tens of metres"* (O `:32`). inferred: about **1 m per
°/100m**, the order of the 2a row at 40 m. This plan did not open [T3]'s data.

**Measured here:** at 1 m per °/100m a row reads 3.3 × the 170 bar, and a cut 2.56. That is above every option that keeps a bar: O1 5.15,
O2 3.22, O3 2.91, combined 1.82.

**The prediction, registered before any [T3] re-run** ("made in fewer pieces" means fewer than O's by-hand count for that section, inside
the same tolerance as [T3]):

| option | sections of the 53 made in fewer pieces than O's count |
|---|---|
| O1 alone | **at most 5** |
| O1 + O2 + O3 (every row at or under a bar) | **fewer than 27** (under half) |
| O4 (rows shown, not refused, floor 20 m) | **at least 40** |

**The test:**
- O's `hand.js` (rows form) in `G:/consonance-scratch/o-t3-work`, re-run on a scratch build of each option (env lines like this plan's).
- Count: sections where rows plus cuts beat O's count. Totals reported beside O's 560.
- The runner should be a seat that wrote neither this plan nor O's study.

**This plan is wrong (degenerating) if:**
- O1 + O2 + O3 makes 40 or more of the 53 in fewer pieces. Then "tens over tens" was a misreading by me, the bar-respecting options
  suffice, and O4 is unneeded. **That is the outcome I would most like to be told, and I name it so it is sayable.**
- O4 makes fewer than 27. Then the row is not [T3]'s binding control at all: the count is held by something this plan did not measure
  (climb, bank or width coupling at the same cuts, or the steering), and the catalogue's "faster turn row" class is wrong as named.
- R2c (or its equivalent for the option built) passes on the closed form alone. Then finding 1's non-monotone readings were my probe's, not the
  builder's.

## Where I come down (inferred, my judgment; the calls are his)

**O1 now.**
- It is a measured fix to a ceiling the room already replaced for the bank, it keeps his bar exactly, and it halves O's 10.3.
- My prediction says it barely helps [T3]. Take that as the price of keeping the bar, not as an argument against O1.

**Then one question to the keeper, carrying 2e, because it is the finding he has not seen.**
- **His rows are held to a bar his cuts are not, and the cut is only about 1.3× smoother at the same length.**
- So either:
  - the bar means it for every route (O0′: [T3] by hand gets harder);
  - or it does not for a faithful copy, and rows are shown, not refused (O4: the 53 get their control).
- O2 and O3 are half-measures between the two, and by my prediction they do not reach [T3].
- **I would not move the bar's speed (O3) at all without his replay in hand.** It is the one number in this chain sized on his driving.

What would change my mind:
- R2c passing on the closed form (then O2 is cheap);
- or the re-run showing combined ≥ 40 (then O4 is unneeded).

## Corrections made while writing

- **I first read O's 10.3 as the law itself.** The law is 5.15, and 10.3 is the base-share cap on pieces whose first ramp runs under the
  change. checked above, both numbers reproduced.
- **I first took "C2 at the marks" to mean κ steps at the mark.** κ is continuous at every span measured (a cubic B-spline channel). What
  breaks under ~20 m is the target and the shape, with the next piece's catch-up visible as a 3.0 °/100m step per 0.25 m at the joint.
- **I expected the closed form to bound the built road at every span.** 2.91 m per °/100m reads 1.34 and 1.50 where the closed form gives
  1.11, so it does not (section 2, finding 1).

SOURCES: `src/core/extend.js` and `app/core/panel.js` at `ceb21f5` (via the read-only worktree `C:\Consonance\t180-wt-e-reader`, `src`
and `app` identical to `ceb21f5`); `src/core/adapter.js:393-402`; `src/validate/limits.js:78`; O's
`exo_memory/handback/p-unmakeable-T3-hand-O_2026-11-26.md:9-36`; `exo_memory/handback/p-d637-turn-climb-joints-E_2026-11-03.md:71,155-168`;
`fc21dcdd` (the L139 registration); the scratch runs above.
- **I first wrote that the closed form lays rows over the bar under O2.** Measured, that happens at the combined law's minimum (the S at
  1.82: 1.63 × the 460 bar). At O2's own minimum the rows read 0.999 and 0.990. Past it, the risk is inferred, and R2c exists to test it.
