# The faster-turn-row prediction, tested on [T3] (D677): pane B, 2026-11-26

The chair's order (21:05:15Z, updated 22:01:59Z and 22:13:13Z): run O's `hand.js` on O1, on O1+O2+O3 and on O4, and count [T3]'s 53 turn-change sections that each makes in fewer pieces than O's count. Report against pane E's registered numbers.
- E's plan: `exo_memory/loop/plan_t180_faster_turn_rows_2026-11-26.md` §4.
- O's counts: `exo_memory/handback/p-unmakeable-T3-hand-O_2026-11-26.md`, per-section table.
- I wrote neither the plan nor the study. Scratch only: no branch, no code committed. [T3]'s data stayed local; this file names sections by index and metres only.

## The result

| build | made in fewer pieces than O's count | E's registered prediction | verdict |
|---|---|---|---|
| **baseline, `ceb21f5` unmodified** (added by me, see "Why a baseline") | **5 of 53** | none | none |
| **O1**, `o1-turn-share-e` **bfa6732** | **5 of 53, an UPPER BOUND** | at most 5 | **holds** |
| **O1+O2+O3** (scratch on bfa6732) | **5 of 53, an upper bound** (bfa6732's flaw under it) | under 27 | **holds** |
| **O4** (scratch on ceb21f5) | **5 of 53** | at least 40 | **FAILS** |

**The same five sections in all four builds:** 37 (7361–7528 m), 43 (8968–9130), 45 (9295–9379), 61 (11289–11468), 104 (19273–19401).
- Every one is made by **plain pieces, no rows** (`sp none`), and in the same number of pieces on every build: 5, 5, 4, 5, 4 against O's 6, 6, 5, 7, 5.
- checked: `G:\consonance-scratch\b-fr-work\out_{base,o1,o123,o4}.jsonl` → 53 lines each, `fewer` 5 each, the same k, N and sp; 0 errors; 1,729 tries on each build.
- checked: the made records (k, N, spacing, worst) of the baseline and O1 are identical.

**So none of the three options makes a single section that unmodified `ceb21f5` does not.**
- Each option's gain over today, by this instrument, is **0 of 53**.
- The five are O's counts beaten by `hand.js`'s plain equal-piece route. O ran that route only up to 2 pieces (`hr.jsonl`, NMAX 2), and O's limits already say "not proven minimal".
- **For O, a separate correction to the study:** O's counts on sections 37, 43, 45, 61 and 104 can each be lowered by one or two pieces, with no new control.

## The predictions, read honestly

**O1 at most 5 holds, as does the combined under 27, but trivially.** They predicted the bar-keeping options barely help. They help not at all, because the plain route already makes the five.

**O4 at least 40 fails, by 35.** E registered the degenerating condition in advance, verbatim: *"O4 makes fewer than 27. Then the row is not [T3]'s binding control at all: the count is held by something this plan did not measure (climb, bank or width coupling at the same cuts, or the steering), and the catalogue's 'faster turn row' class is wrong as named."*
- **It fires.**
- What the runs show held the count once the turn law was lifted is below. It bounds what "wrong as named" means.

## What binds once the law is lifted

Laid row attempts are those where a piece with rows was laid and then read against [T3]'s tolerance.

| build | sections where a row attempt laid | best worst/tol per section: median | min | under 1.5 | refused attempts | laid and missed |
|---|---|---|---|---|---|---|
| baseline | 13 | 7.83 | 2.62 | 0 | 1,333 | 391 |
| O1 | 19 | 6.49 | 1.61 | 0 | 1,307 | 417 |
| O1+O2+O3 | 34 | 6.16 | 1.38 | 1 | 1,195 | 529 |
| O4 | 51 | 3.25 | 1.14 | 7 | 976 | 748 |

- checked: `out_*.jsonl.raw`, the `tried` records (`worst` = the worst measure's error over its tolerance, ≤ 1 is made).
- **The options do what they say:**
  - They lay rows in more sections: 13 → 51.
  - They bring the attempts closer: a median of 7.83 → 3.25.
  - None crosses 1.0.
- **Under O4, every remaining turn refusal is the 20 m floor:** 357 attempts at 15 m spacing and 191 at 20 m, each "needs at least 20.0 m".
- **Width rows,** whose law O4 does not touch, are refused 377 times: 342 second, 30 third and 5 fourth width changes. Pass clearance refuses 31, and cup rows 12.
- **The measures the laid O4 row attempts miss are spread wide, not concentrated on turn:**
  - heading 388, position 342, turn peak 341, pitch 336, elevation 320;
  - width 240, bank 146, edge 36.
  - inferred: past the turn law, the count is held by **the aim**, plus climb and width. That is `hand.js`'s linear-influence solve with 4 retypes, missing heading, position, pitch and elevation together.

**So the honest form of the failure** has two possible readings, and this test cannot tell them apart:
- either a person aiming better than `hand.js` makes some of these;
- or the 53 sections need climb and width rows freed as well.

What it can say is narrower: lifting the turn-row law alone, down to a 20 m floor, takes `hand.js`'s rows from 0 sections made to 0 sections made.

## Why a baseline

All five O1 sections were made without rows, so the row law never decided them. Counting them as O1's would credit an option with a pre-existing gap in O's counts. The chair's order asked for three runs; the fourth answers whether the count is the options' at all. It is not.

## Method

- **The instrument:** O's `hand.js`, `steer.js`, `lay.js`, `sections.js`, `geo.js` and `profile.js`, copied from `G:/consonance-scratch/o-t3-work` to `G:/consonance-scratch/b-fr-work`.
  - The one change: the tree path O's files hard-coded (`G:/consonance-scratch/o-t3`, at ceb21f5) became `process.env.FR_TREE`. `route.js` takes the same tree through `ROUTE_TREE`.
  - `VAR` is O's `hand.var.json`; `TRIES` (4) and `SPS` (inf, 120, 80, 60, 40, 30, 20, 15) are hand.js's defaults.
- **Control:** my copy on ceb21f5 reproduces O's own rows run (`o-t3-work/hr.jsonl`, NMAX 2) exactly on sections 6, 38, 59 and 107: the same tries in the same order, the same laid, refused and made verdicts.
  - checked: `b-fr-work/ctl_base.jsonl`
- **The count:** `run.cjs` runs `hand.js` once per section with **NMAX = O's count − 1**. A section counts only if it is made in fewer pieces than O's count, by any number of pieces up to that and any spacing.
  - O's count per section is taken from O's table, the 53 sections whose line is "a turn whose rate changes along the piece through marks".
  - The runs went through `heavy-run.js --run` at BelowNormal; `go.sh` retried on exit 3.
- **The builds,** each checked on E's `fr_probe.cjs law` (copied from E's scratchpad), giving the shortest change accepted, in m per °/100m:

| build | how | no first ramp | with a first ramp 0 → r0 |
|---|---|---|---|
| baseline | `G:\consonance-scratch\b-sharp-base` at ceb21f5 | 5.14–5.15 | 5.15–6.48 |
| O1 | `G:\consonance-scratch\b-fr-o1` at bfa6732, clean | 5.14–5.15 | 5.15–5.16 |
| O1+O2+O3 | `G:\consonance-scratch\b-fr-o123` at bfa6732; `minLaw` spread 3 → 1.875 (O2), and the rows' bar × (170/127.78)² in `minLaw` and in O1's `routePeak` (O3) | 1.81–1.82 (20 m floor on small changes) | 1.81–1.96 |
| O4 | `G:\consonance-scratch\b-fr-o4` at ceb21f5 with E's three env lines, run with `FR_K=0.001` (floor 20 m) | 20 m on every change | 20 m |

- The O1+O2+O3 and O4 builds are mine, from the plan's §3 descriptions. The plan's §0 env lines cover O2 and O4 but not O1 or O3, so O1 is the real branch and O3 is a constant edit. My bias: I built two of the three things being measured.

## Upper bounds, and the one path that is not monotone

- O1 and O1+O2+O3 sit on bfa6732, before E's F1/F2 repair (`exo_memory/handback/p-d677-o1-repair-E_2026-11-26.md`). That repair refuses a change that ends at the next mark and reads over the bar on the built road, which is hand.js's case.
- **Both counts are upper bounds,** per the chair's note of 22:13:13Z: a refusal removes an attempt from hand.js's grid of piece counts and spacings, and never adds one.
- inferred: the one path where a repair could change an outcome otherwise is hand.js's retype loop. A refused retype stops it and keeps the best earlier try, where bfa6732 kept retyping.
- None of the five sections was made by rows, so here the bound and the value coincide: 5.

## Limits

- **The aim is hand.js's, not a person's.** O's limits say the same of O's counts. A better aim could make sections the options lay but miss: O4 has 7 sections under 1.5 × tolerance.
- **One instrument, one track.** [T3] only; the five plain-piece wins are hand.js's equal division, not O's extremes-cut route.

## Corrections

- None to the result. In the session I told the chair O1's count "can only err high". The chair's note made it an upper bound; the retype-loop path above is the one qualification I found.
