# D276 item 4: the defensive-text trend in hand-backs, by date (pane C; MEASURE ONLY, no verdict on any seat, no reading of why)

The keeper, 10:59: the seats put "too much effort into their outputs being aligned in a safe way to not be called out". Plan: `loop/plan_loop_friction_2026-10-09.md`, item 4 (RE-SPLIT: C).

## The rule, fixed before the run (`scratchpad/inv/defensive.js`, read-only; the same rule for every file and every seat)
- **Unit:** a non-empty line of a dated hand-back, `exo_memory/handback/*_YYYY-MM-DD*.md`. Only files directly in that folder count; subfolders are evidence. Each file is dated by the date in its FILE NAME.
- **Section:** a markdown heading and every line under it, until the next heading of the same or a higher level.
- **NV (not verified):** what BUILDING's "what a hand-back owes" asks for, "what the finding does not establish". A line counts if it is:
  - in a section whose heading matches `does not establish | not established | what this/it does not prove/establish/show/cover | limits | not verified | unverified | not run | caveats | not (yet) shown/proven`; or,
  - outside such a section, a line matching `not verified | unverified | does not establish | not established | inferred:`.
- **SD (self-defence / self-correction):** a line counts if it is:
  - in a section whose heading matches `correction | my own | fault | mistake | slip(s) | I was wrong | errors of mine`; or,
  - outside NV and SD sections, a line matching `my own fault/error/mistake/slip | my mistake | I was wrong`.
- **One class per line:** a heading that matches both classes counts as NV, and a line counts once.
- **This is how NV and SD are separated:** by the heading the line sits under, plus a small set of inline phrases.
- **Periods:**
  - **before:** up to 2026-10-01;
  - **transition:** 2026-10-02 to 10-03 (the SOURCES gate went live 10-02, the reply slot 10-03);
  - **after:** from 2026-10-04.
- **Command:** `node scratchpad/inv/defensive.js C:/Users/nname/Desktop/lighthouse/exo_memory/handback` (add `--json` for the per-date data). It was run under the heavy-run lock on 2026-10-09 ~11:16 local. Outputs: `scratchpad/inv/d276.txt`, `d276.json`.

**A check on the rule itself** (`scratchpad/inv/defheads.js`, the headings each class captured):
- **NV:** 512 headings (105 distinct), led by "Not verified" (64, plus 123 numbered as "N · not verified") and "What this does not establish" (40, plus 52 numbered).
- **SD:** 364 headings (205 distinct), led by "Corrections, including mine" (30), "…including to myself" (20), "Corrections, mine" (19), "Corrections" (18) and "Corrections to myself" (17).
- **The SD tail is not clean.** It includes single headings about correcting a PREMISE or finding a defect ("the premise correction, confirmed independently…", "a defect the live run found in my own reader"). Those are findings, not self-defence. So SD over-counts slightly.

## The trend (789 dated hand-backs)

| period | files | lines | NV lines | **NV share of lines** | SD lines | **SD share of lines** | median lines / file | files with an NV section | files with an SD section | median NV share / file | median SD share / file |
|---|---|---|---|---|---|---|---|---|---|---|---|
| before (≤ 10-01) | 632 | 89,097 | 5,001 | **5.6%** | 5,569 | **6.3%** | 126 | 61.2% | 36.1% | 5.9% | 0.0% |
| transition (10-02..03) | 43 | 2,179 | 73 | **3.4%** | 77 | **3.5%** | 50 | 14.0% | 34.9% | 0.0% | 0.0% |
| after (≥ 10-04) | 114 | 9,173 | 463 | **5.0%** | 441 | **4.8%** | 65.5 | 65.8% | 56.1% | 6.1% | 3.4% |

**What the numbers show, stated without a reading of why:**
- **Share of all hand-back lines:**
  - NV: 5.6% before, 3.4% in transition, 5.0% after.
  - SD: 6.3% before, 3.5% in transition, 4.8% after.
  - Neither line share is higher after than before.
- **The share of hand-backs that HAVE a self-correction section rose:** 36.1% before, 56.1% after. The median file's SD share went from 0.0% to 3.4%. More files carry one, each a small part of a shorter file.
- **Hand-backs got shorter:** the median file went from 126 lines to 65.5. The per-date medians fell from about 170-250 lines (early September) to about 40-90 lines (October), and the fall begins before the gates (09-19 onwards: 125, 140, 97, 96, 87, 78 …).
- **The transition days (10-02/03) are low on both classes,** with 43 files and only 14% carrying an NV section.

## By date (line shares; `d276.txt` has every row)

| date | files | lines | NV | SD | median lines/file |
|---|---|---|---|---|---|
| 09-01 | 15 | 2,222 | 9.2% | 7.4% | 137 |
| 09-08 | 15 | 3,530 | 0.4% | 12.0% | 245 |
| 09-16 | 40 | 7,071 | 3.0% | 4.5% | 171.5 |
| 09-21 | 49 | 5,301 | 7.8% | 14.6% | 97 |
| 09-22 | 51 | 5,270 | 9.4% | 9.2% | 96 |
| 09-23 | 54 | 4,820 | 8.5% | 9.1% | 87 |
| 09-27 | 102 | 14,576 | 7.0% | 3.8% | 127.5 |
| 09-30 | 9 | 591 | 3.7% | 1.9% | 70 |
| 10-01 | 13 | 843 | 3.1% | 2.3% | 54 |
| 10-02 | 14 | 636 | 5.3% | 3.0% | 50 |
| 10-03 | 29 | 1,543 | 2.5% | 3.8% | 41 |
| 10-04 | 27 | 1,741 | 3.8% | 4.5% | 58 |
| 10-05 | 30 | 2,005 | 7.2% | 7.4% | 64 |
| 10-06 | 33 | 2,732 | 6.8% | 4.8% | 74 |
| 10-07 | 8 | 336 | 3.9% | 1.2% | 34.5 |
| 10-08 | 12 | 2,143 | 2.2% | 3.6% | 91 |
| 10-09 | 4 | 216 | 3.2% | 0.0% | 44.5 |

(A selection of the series; the other dates are in `d276.txt`.) The daily SD share swings widely (0.0% to 14.6%) on small daily counts.

## Confounders, named and not adjusted away
1. **Dating by file name.** A hand-back appended across days counts on its first date. My own `p-consumer-fork-C_2026-10-08.md` carries laps 1-6, written 10-08 and 10-09, all on 10-08.
2. **Rule coverage.** Defensive prose that sits under neither class's heading and uses none of the inline phrases is not counted; a reworded "what I didn't check" escapes. The SD tail over-counts slightly (above).
3. **Mix of work.** The "before" period holds the long research and audit hand-backs of September; "after" is mostly consumer-refresh laps, short and many. Line shares and lengths move with the kind of work as well as with any rule.
4. **Who writes.** The rule does not separate seats, as instructed. Per-seat mixes changed over the period, and so did the number of seats.
5. **Small samples:** transition 43 files, after 114, against 632 before.
6. **The measuring seat is one of the writers.** C wrote many of these hand-backs, including ones with "Corrections to myself" sections. The rule was fixed before the run and is mechanical; the reading is left to the librarian.

## What this does not establish
- **Whether any of these lines cost time or changed what was done.** That is items 1-3 (E, A).
- **That any trend is caused by the gates.** Lengths began falling before 10-02, and the mix of work changed too.
- **Whether an NV or SD line is useful or defensive in intent.** The rule classes headings and phrases, not purpose.
