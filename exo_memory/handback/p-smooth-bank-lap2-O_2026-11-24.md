# P-SMOOTH-BANK, LAP 2: the flowing bank held inside its marks, refused by name; (e) held and measured (pane O, 2026-11-24)

Tier: PROVE IT. Branch `o-smooth-bank` in t180-fresh, base `513cd93`, tip **`57e4b1c`** (two commits on 513cd93: `50bc9fb` the bank, `57e4b1c` the ramp harness's EX11 string; pushed after the scan, §8). Nothing on main, nothing
installed, nothing launched; his two layouts are not re-exported (§5 shows they rebuild byte for byte).
Answers: the reader's file `p-smooth-bank-read-C_2026-11-24.md` (blob 40b630d9), the chair's LAP 2 dispatch, the librarian's (e) ruling (`librarian/2026-11-24.md`
:19, lighthouse 30332e0f) and the chair's relay of it with the added measurement (11:16:49Z). My ruling request `p-smooth-bank-lap2-O_2026-11-24_ruling-e.md`
(git-blob 2a1a301e) is committed beside this file.

## 1. What changed (src/core/extend.js, src/core/turnby.js)

- **a. Inside the marks (finding 1).** `flowSolve` keeps the least bending through the marks (the same KKT solve as lap 1) whenever it already stays inside what
  they ask; where it does not, `flowInside` (Goldfarb and Idnani's dual method) lays the least bending that does. What they ask is read every `FLOW_EVERY_M` =
  0.25 m: inside the range of {the start, every mark} by `FLOW_HOLD` = 0.45° (`FLOW_ROOM` 0.5° less `FLOW_BUILT` 0.05°: the adapter's rounding moved a bank held at
  the bar 0.0025° past it), and on the marks' side (by 1e-8 rad) between two of one sign. The curve is read once more every 0.5 m (`flowWrong`), and the road as
  BUILT is read (`flowBuiltWrong`, `A.toPath` at 0.5 m) in `extend` and, for a corner, in `checkBankAsBuilt`. A list that cannot be laid inside is refused
  (`flowRefusal`, CoreError BAD_SECOND) naming the mark and the room it needs, found by `flowRoom` (the mark and those after it moved later, 5 m steps then back
  by the metre, and the list re-laid). No silent longer hold: the room is named, never taken.
- **b. No untyped throw (finding 2).** Before the solve, `flowDependent` eliminates the rows in mark order against the free points; a row that depends on the
  rows before it is refused by name, as its mark's room. The generic Error is not caught.
- **c. A dropped row is a refusal (finding 3).** A row with no free point is checked against the fixed points (relative 1e-9); one that fails is refused, the
  joint by name with the way through (`transition: { phi: … }`, the transition for the bank alone).
- **d.** CHANGELOG and MAP say C2 with insert's limit (`src/core/piece.js`:21, as the reader found it).

## 2. The rows, red then green

| row | on base 513cd93 | on the tip |
|---|---|---|
| drawn 1, the reader's three lists (finding 1) | red | green |
| drawn 2, the reader's singular lists (finding 2) | red (untyped "singular constraint system") | green, refused by name |
| drawn 3, 160 lists at 5 m (seed 11) | red | green: 88 laid, 72 refused by name |
| drawn 4, 80 lists at 20 m (seed 23) | red | green: 73 laid, 7 refused by name |
| drawn 5, 0 → 20° at 50 → 21° at 150 / 250 | red | green |
| drawn 6, the room named lays | red | green |
| drawn 7, one-number transition after F5 refused, naming the joint (finding 3) | red (laid C1) | green |
| drawn 8, the same with `transition: { phi }` lays C2 | green (companion) | green |
| drawn 9, 40 lists through a 90° corner | red (untyped throw, corner list 3) | green |
| drawn 10, two lists that need the side rows and the fine grid lay inside | red | green |
| drawn 11, a corner list whose built road banks the wrong way by 0.001° is refused by name | red | green |
| qp 1-3, the solver (textbook answer, infeasible → null, 300 problems against brute force) | red (no solver) | green |

The red runs: `drawn_red_513cd93.txt` (drawn 1-9: 8 fail, drawn 8 the pass) and a base export with the tip's test files (drawn 10, 11, qp 1-3: all fail).
The four flow files on the tip: **36 tests, 35 pass, 0 fail, 1 todo** (Part 3's straights, held: §6). All lap-1 flow rows are green, flow 7 (the S's bytes)
among them.

drawn 10 and 11 were not in the first harness run. Its four survivors are the reason they exist (§3).

## 3. Mutants

- **Flow harness** (`test/core_bank_flow_mutation.test.js`, 45 mutants, 17 of them new this lap): first run **41 of 45 caught**. Survivors: B2 (the side
  rows), B3 (2 m grid), B6 (the final read), W2 (a corner's built read). A differential search (`diff_search.js`, `survivor_search.js`: the same drawn lists
  laid on the tip and on each mutant) found a list each for B2, B3 and W2; those are drawn 10 and 11. **B6 alone is equivalent at these constants**: the final
  read's 0.5 m grid is a subset of the rows' 0.25 m grid, its bar is looser by FLOW_BUILT, and DEC.phi = 9 rounds a point by at most 5e-10 rad against
  FLOW_SIDE's 1e-8; no list of 2160 laid differently without it. It stays as the guard for the grid, so B6 is now the pair (2 m grid AND no final read),
  which the search shows laying a wrong-signed bank (−0.026°). Re-run: **45 of 45 caught** (`mut_lap2b.txt`).
- **Ramp harness** (`test/core_ramp_mutation.test.js`, re-run because extend.js changed, 106 mutants): **105 caught; EX11 NOT APPLIED**, because its string is the corner's `checked` line in turnby.js and this lap changed that line (the relay). It is now the same mutation on the line as it stands (t180 `57e4b1c`), and run alone it is **caught** by "row 4:" (`mut_ramp_lap2.txt`, `mut_ramp_ex11.txt`). So 106 of 106, with that one caught on its own run.

## 4. What changed in what he sees

Nothing in the S. The S's own list lays as before (flow 7, its bytes).

## 5. Unmoved

- **His 27 tracks and 9 fixtures** (`mnm.js` on the tip, against lap 1's base and branch): **36 of 36 unmoved**. Every item's serialize, built-path and export hashes are the same as on base and as in lap 1 (`mnm3_branch.json` against `mnm2_base.json` and `mnm2_branch.json`, timing left out). 24 of the 36 are export refusals, each with the same message hash as on base.
- **The two layouts he is driving**: `build_s.js` rebuilt both on the tip into a scratch folder. **All 18 files are byte-identical** to the exported ones
  (sha256 of every file but the bank json). The script's stub of today's check names the check line; it now accepts the line as this lap has it.

## 6. Item (e): held as ruled; the measurement

Held: the straights stay the todo row; nothing of Part 3 is coded. The measurement the chair added, local, summary numbers only, no layout. Instruments:
`s_straights.js` and `straight_acc.js` in `G:\consonance-scratch\o-smooth-work` (`FWD=pos`). The four reads were matched to the brief's columns by lap length
(20.7, 31.0, 34.4 and 21.0 km). The S is column 1 (reference track A): its bank at 340…710 m is the dbl90 table's.

**The read cannot give the adapter's 2 m chord.** Its stations are 4 m apart, so the second difference runs at h = 4, 8 and 16 m. That figure is
chord-bound: the same road reads 6-10× the bar at the 90th percentile on a 4 m chord, 1.1-1.7× on an 8 m chord, and 0.2-0.6× on a 16 m chord. So the
figure that answers the question is the **bound**: the least peak roll acceleration any curve needs to move Δ over L from rest to rest, 4Δ/L². No read
noise can raise it.

**1. The S's straights (column 1), against BANK_BAR = 1.017e-4 rad/m²:**

| stretch | bank | over | bound / bar | room at the bar | peak at h = 4 / 8 / 16 m, / bar |
|---|---|---|---|---|---|
| run-in 340-460 | 1.8° → 24.6° | 120 m | **1.09** | 125.1 m | 21.6 / 6.0 / 1.3 |
| ease-out 606-710 | 23.3° → 1.1° | 100 m | **1.52** | 123.3 m | 26.4 / 6.1 / 1.6 |

So the real S's ease-out cannot be laid under the bar by any curve. It needs about 123 m, and the road does it in 100. (The librarian's 126 m, at 23°,
is the same arithmetic.)

**The speed.** The bar is 3 g at a wheel 10 m out at 170 m/s. At his screenshot's 166 km/h (46.1 m/s), 3 g is 13.66 bars. The S's 1.52 bars is 0.11 of
that, and 1.52 bars reaches 3 g at 137.9 m/s (496 km/h).

**2. The four reads on straight road** (|κh| ≤ 1/600 m⁻¹, heading from the centre positions, ±8 m), the second difference over the bar:

| column | straight share | h = 4 m p90 / p99 | h = 8 m p90 / p99 | h = 16 m p90 / p99 | level-road floor, p90 at h = 4 / 8 |
|---|---|---|---|---|---|
| 1 | 23 % | 6.1 / 19.5 | 1.4 / 4.6 | 0.51 / 1.25 | 0.66 / 0.25 |
| 2 | 29 % | 10.1 / 26.4 | 1.7 / 5.1 | 0.57 / 1.15 | 3.8 / 0.40 |
| 3 | 23 % | 7.9 / 18.2 | 1.1 / 5.3 | 0.16 / 0.59 | 0.12 / 0.02 |
| 4 | 24 % | 6.4 / 22.6 | 1.3 / 8.4 | 0.38 / 1.52 | 3.7 / 1.05 |

The floor is the same figure on level straight road (|bank| < 1° across the chord), where the true value is about 0: it is the read's own noise at that
chord. On columns 2 and 4 the floor at 4 m is 3.7-3.8 bars, so the 4 m column there is mostly read noise.

**A first reading I withdrew before it reached anyone.** I first took heading and the bank's side vector from the reader's forward vector `f`. The dbl90 lap
found that vector faceted in 8° steps. It made turning road look straight between facets: the straight share came out about 50 %, and 13-55 bank changes per
track looked as if they ran wholly on straight road. Re-read from positions, the straight share is 23-29 % and there are 0-2 such changes per track. So
on these four tracks the bank mostly changes while the road still turns. The S's straights are the exception the brief chose, and their bound barely moved
(1.05 → 1.09 and 1.51 → 1.52).

**Reading it for his call.** The real S's ease-out sits at 1.5× the bar by a bound no noise touches. The bar is built from 170 m/s, against the 46 m/s he
drives there. Coding (e) at today's bar would refuse the shape he pointed at. The bar on straights is his.

## 7. The full suite

Once, at `57e4b1c`, under the exclusive lock, BelowNormal (`node --test --test-concurrency=4 "test/*.test.js" "app/test/*.test.js"`, TMP on G:,
`suite_lap2.txt`):

| tests | pass | fail | skipped | todo |
|---|---|---|---|---|
| 4738 | 4712 | **2** | 21 | 3 |

**The two fails are lap 1's two timing rows**, neither on the flowing bank, which is opt-in:
- `app/test/release-frame.test.js:121` row 1: worst frame 8.5 ms against 6.0 under the suite's load. **Alone on the tip it passes.**
- `app/test/core-extra-bank-drag-cost.test.js:94` D642: 2.15× against 2× in the suite; alone on the tip it failed once (2.56×). So I ran it alone,
  alternating 513cd93 (lap 1's tip, exported whole) and 57e4b1c, three times each, under the exclusive lock (`d642_ab.js`): **each tip failed once
  (2.08× and 2.02×) and passed twice.** It sits at its bar on this machine with or without this lap. (Lap 1 found it failing alone on base 3b33b38 at 2.01×.)

I report them as read, not as green. The landing pane's suite is the one that counts.

The three todos are as in lap 1: `aclook.test.js:219` and `core-extra-bank-drag-cost.test.js:111` (both on base), and mine, Part 3's straights ("run-in
3.819° at 360; ease-out 9.583° at 673"), held by the (e) ruling.

## 8. Pushed

**Branch `o-smooth-bank` only**: `513cd93..57e4b1c`. `git ls-remote` reads `57e4b1c9…` at `refs/heads/o-smooth-bank`. Push-gate row
`2026-11-24T12:26:38.043Z`, seat c88002b1, `decision: allow`, scanned `G:consonance-scratcho-smooth-t180` → origin `o-smooth-bank`. Nothing on main;
lighthouse main stays on HOLD. Evidence (probes and summary outputs, no read and no layout): `p-smooth-bank-lap2-O_2026-11-24_evidence/`.

NEXT: librarian call_librarian with this pointer, for (e)'s question to him.
