# The aim or the coupled rows? [T3]'s 53 under O4 (D677): pane B, 2026-11-26

The chair's order of 00:58:13Z, on my prediction result (`exo_memory/handback/p-faster-rows-prediction-B_2026-11-26.md`, lighthouse `0546ef2`).
- Under O4 (the turn and climb row law lifted to a 20 m floor), O's `hand.js` laid rows in 51 of the 53 sections and made none.
- Two readings were left open:
  - **the aim:** `hand.js`'s linear-influence solve and 4 retypes miss what a better aim would hit;
  - **the coupled rows:** the other row laws still refuse or distort what the section needs.
- Scratch only. Same instrument; [T3]'s data stays local.

## Registered BEFORE any run (this section was committed before the runs started; see the commit that adds it)

**What the two runs are**, each on the O4 build (`ceb21f5` + E's three env lines, `FR_K=0.001`, the 20 m floor), with NMAX = O's count − 1 as before:
- **(a) the aim given room:** `TRIES` 4 → 12, and the spacing list made finer above the floor: `inf,160,120,100,80,70,60,50,45,40,35,30,25,20` (was `inf,120,80,60,40,30,20,15`; 15 m is under the floor and was always refused). Row laws as in O4.
- **(b) the coupled rows lifted:** the width, cup and edge row floors set to the same 20 m.
  - `CHANGE_FLOOR_M` w 40 → 20, c, e, er 26 → 20, by one env-read line, scratch only.
  - **The climb is already at 20 m under O4:** `minLaw` serves `kh` and `kv` alike, and the O4 run had 0 climb refusals. So (b) adds width, cup and edges.
  - `TRIES` and the spacing list stay at O4's (4; the default list), so that only the laws move.
  - The bank's law (`SECOND_MIN_K`) is not touched by either run.

**The measure:**
- Primary: sections of the 53 made in fewer pieces than O's count, beyond O4's 5 (37, 43, 45, 61, 104, all plain pieces). Sections added by rows are counted separately from any made by plain pieces.
- Secondary: per section, the best (lowest) worst/tol of a laid row attempt; O4's median is 3.25, minimum 1.14.

**What each outcome means, fixed now:**
- **"It is the aim":** (a) adds **5 or more** sections (10% of 53) made with rows, and (b) adds **1 or fewer**.
  - Corroborating: (a) moves the median best worst/tol from 3.25 to 2.0 or less, and (b) leaves it within ±0.5 of 3.25.
- **"It is the coupled rows":** (b) adds **5 or more** sections made with rows, and (a) adds **1 or fewer**.
  - Corroborating: (b) brings the width refusals (377 in O4) near 0, and the misses on width and edge fall.
- **Both:** each adds 5 or more. Then both bind, and I report how far the two sets of sections overlap.
- **Neither (the outcome I would least like, named so it is sayable):** each adds **1 or fewer**. Then the count is held by neither reading as tested. Candidates, untested here:
  - the 20 m floor itself;
  - the bank's law;
  - the coupling between channels that `hand.js`'s per-channel solve does not model;
  - an aim better than 12 retypes of the same solve, which (a) does not exclude.
- **Between (2 to 4 added by either):** not decisive. I report it as that, and do not round it to a reading.

**My bias:** I named the two readings in my last result, so I hold a stake in one of them being the answer. The "neither" outcome is the one against me.

## Results (written after both runs; nothing above this heading was changed)

**Outcome, by the registered primary measure: NEITHER.** (a) adds 1 section and (b) adds 0. Each is "1 or fewer", so neither reading, as tested, is what holds [T3]'s count. That is the outcome I named as the one against me.

| run | made in fewer pieces than O's count | beyond O4's five | made WITH rows | rows laid in (of 53) | best worst/tol: median | min | under 1.5 | refused | refused for width, cup or edges |
|---|---|---|---|---|---|---|---|---|---|
| O4 (the earlier run) | 5: 37, 43, 45, 61, 104 | (none) | 0 | 51 | 3.25 | 1.14 | 7 | 976 | 392 |
| **(a) aim: 12 retypes, finer spacings** | 6: 37, 43, **45**, **59**, 61, 104 | **1 (59)** | **2 (45, 59)** | 50 | 3.24 | 1.28 | 6 | 1,110 | 772 |
| **(b) width, cup and edges at 20 m** | 5: 37, 43, 45, 61, 104 | **0** | **0** | 53 | 3.03 | 1.11 | 11 | 633 | **0** |

- checked: `G:\consonance-scratch\b-fr-work-a\out_o4aim.jsonl` and `G:\consonance-scratch\b-fr-work-b\out_o4rows.jsonl` → 53 lines each, 0 errors; tries 2,330 for (a) and 1,729 for (b), the same as O4's 1,729 since its grid did not change.
- checked: the `.raw` files beside them, for the per-try records. "Refused for width, cup or edges" counts refusal reasons matching `(w|c|e|er) change`.

### (a), the aim

- **Section 59:** made in 1 piece with rows at 80 m spacing, against O's 2. In O4 the same piece and spacing laid at 1.40 × tolerance, and its best was 1.14 at 20 m.
  - inferred: the extra retypes made it, since 80 m was already in O4's list.
- **Section 45:** made in 1 piece with rows at 45 m spacing, 10 rows. That replaces the plain route's 4 pieces, against O's 5. O4's best at 1 piece was 1.19 at 40 m.
  - inferred: the new 45 m spacing made it, or the retypes, or both; one run cannot split them.
  - It was already one of the five, so it does not count as added.
- **The rest did not move:** median 3.24 against 3.25, and 6 sections under 1.5 against 7. The corroborating condition (median ≤ 2.0) fails.
- **Note on the measure:** I wrote "adds 5 or more sections made with rows" and set the primary measure as "beyond O4's 5". Counting only sections made with rows, (a) has 2. That falls in the "between" band, not in "neither".
  - The two counts were not distinguished when I registered, and that ambiguity is mine.
  - Neither count reaches the "it is the aim" threshold of 5.

### (b), the coupled rows

- **The lift did what it says:**
  - refusals for width, cup and edges fell from 392 to 0;
  - rows laid in all 53 sections;
  - 11 sections came under 1.5 × tolerance, against 7.
- **Nothing was made:** 0 sections with rows. The median best moved from 3.25 to 3.03, within the ±0.5 I registered for "unmoved".
- **The width misses did not fall:** width is missed on 61% of O4's laid-and-missed row attempts and on 66% of (b)'s; edge is missed on 9.1% of both.
  - checked: the same `.raw` files, counting attempts laid with rows and missed (O4 394, (a) 860, (b) 737), by whether `fails` names width or edge.
  - Freeing the width rows to change in 20 m did not let `hand.js` match [T3]'s width.
- **What still refuses in (b):** the 20 m floor, at 15 m spacing (357) and at 20 m (230), plus 5 at 30 m; and pass clearance, about 30.

## What this does and does not say

- **Neither reading, as tested, is the binding one.**
  - Giving the aim three times the retypes and a finer grid made 1 more section (2 counting 45).
  - Freeing the coupled row laws to the turn's 20 m floor made 0.
- **The candidates I named before the runs remain, all untested:**
  - the 20 m floor itself, now the main cause of refusals in (b);
  - the bank's law;
  - coupling between channels, which `hand.js`'s per-channel solve does not model;
  - an aim better than 12 retypes of the same solve.
- inferred: the persistent width misses, even with width rows free, point at the last two. `hand.js` may not be setting width marks where [T3]'s width actually changes.
  - That is a reading of the miss counts, not a test.
  - The test that would separate it: run (b) with width taken from [T3]'s own width marks, not solved.
- inferred: the misses are spread across heading, position, peak, pitch and elevation in all three runs, which says the solve misses several channels at once, not one.
- **The limit stands:** this instrument is `hand.js`, not a person. A person aiming by hand could still make sections that both runs only lay.

## Method, beyond the registration

- **Folders:** `G:/consonance-scratch/b-fr-work-a` and `b-fr-work-b` are copies of `b-fr-work` (the same `hand.js` and its files, with `FR_TREE`), so the two runs had their own folders.
  - They shared the tree `G:/consonance-scratch/b-fr-o4`, so heavy-run ran them one after the other.
- **(b)'s line** in that scratch tree's `src/core/extend.js`, gated by `FR_WFLOOR`. Unset, it is base: `{ w: 40, c: 26, e: 26, er: 26 }`; with `FR_WFLOOR=20`, all four are 20.
  - checked: `secondMinM('w',24,30)` → 40.0 unset, 20.0 set; `secondMinM('c',10,40)` → 26.0 unset, 20.0 set; `secondMinM('kv',0,0.002)` → 20.0 in both.
- **Env:**
  - (a) ran with `FR_K=0.001 TRIES=12 SPS=inf,160,120,100,80,70,60,50,45,40,35,30,25,20`;
  - (b) ran with `FR_K=0.001 FR_WFLOOR=20`, its TRIES and SPS hand.js's defaults.
  - Both through `heavy-run.js --run` at BelowNormal, with a retry on exit 3 (`b-fr-work/go2.sh`).
- **The tree:** `b-fr-o4` is ceb21f5 plus E's env diff plus the (b) line. The chair's order names `C:\Users\nname\Downloads\t180-fresh` as a scratch O4.
  - I used my own O4 tree, the one the prediction result was measured on, so O4's numbers here and there are one build.
  - inferred: the two trees are the same build in effect. I did not diff them.

## Corrections

- The prediction result's figure of "377" width refusals counted second, third and fourth width changes only. With cup and edges, by the regex above, O4's count is 392. The registration above quotes 377; the table here uses 392 for all three runs.
