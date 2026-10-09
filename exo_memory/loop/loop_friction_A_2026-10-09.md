# Loop friction, item 3 (lap speed before/after the gates) and H2 (split vs single-pane) — seat A, MEASURE ONLY, 2026-10-09

Plan: `exo_memory/loop/plan_loop_friction_2026-10-09.md` (item 3; RE-SPLIT, H2 at lines 49–52). Nothing was changed anywhere; this file, its
evidence directory and the hand-back are the only things written.

**Every number below is a line of one program's output.** The program and its output are stored beside this file:

    node exo_memory/loop/loop_friction_A_2026-10-09_evidence/loop_friction_A.js          # prints everything below; ~10 s
    exo_memory/loop/loop_friction_A_2026-10-09_evidence/out_A.txt                          # the output I read (sha256 79c36b54…)

It reads `C:\Consonance\data\lap.jsonl` (2,649 rows, 2026-08-24 07:24Z → 2026-10-09 17:15Z, machine D only) and `board.jsonl`. Re-running it later gives larger
numbers, since the ledger grows. Section names in `out_A.txt` are quoted beside each table as `[## NAME]`; `grep -n "^## " out_A.txt` lists them.

## Headline, then the limits

1. **Item 3: round time did not change at the gates.** Dispatch → the chair taking the chain back: median 14.4 min before, 12.0 after; the difference is −2.5 min with a 95%
   bootstrap interval of [−6.5, +3.6], so a change larger than about six minutes either way is excluded; against only the 14 days before the gates it is +0.4 [−3.8, +6.3].
   The upper quartile did rise (30.5 → 40.8 min). The strict "last hand-back arrived" time **cannot be compared across the gates**: both instruments that recorded it stopped
   on 2026-09-28, four days before the first gate.
2. **H2, as registered, comes back FALSE.** Split cycles' median dispatch → close is *longer*, not shorter, than single-pane cycles': 55.0 vs 14.6 min pooled, difference +40.4 [+25.3, +60.8].
3. **But that test cannot answer the keeper's question,** and I do not read it as an answer. The ledger records which panes were dispatched and when; it does not record how many
   independent parts the task had. The chair splits the bigger tasks, so the split group is the bigger-task group. That bias runs *against* H2 and I cannot remove it from this file.
4. **The one in-ledger measurement that does bear on parallel vs serial points the other way:** a round with 3 panes takes a median 13.3 min and with 4 panes 17.0, against 11.2 min
   for one pane — about 1.2–1.5× one pane's round, not 3–4×. That too has a confound (below). The two measurements disagree, and I report both.

## What is being measured, in this ledger's own terms

`lap.jsonl` is written by the chair's chain tooling (and the app, for dispatch rows). A *lap* id (e.g. `D265`) can stay open for days and holds many dispatches: `D265` alone has 79 rows spanning
2026-10-07 → 10-09. So the lap id is **not** the unit of a task. I used two units, both defined in `loop_friction_A.js`:

- **Round** = a maximal run of consecutive `dispatched` rows in one lap (their `to` letters unioned). 665 rounds. *Round time* has three versions:
  **E1** = dispatch → the next chain row that is not a dispatch (in 414 of 665 rounds that is `working/chair` (184 before, 22 transition, 208 after), the chair retaking the chain). **E2** = dispatch → a `handbacks-in` row.
  **E3** = dispatch → the last of each dispatched pane's first committee post on the board after the dispatch (chain-status.js's own definition of "this pane no longer owes").
- **Cycle** = from the first dispatch after a `filed` row to the next `filed` row, in one lap. 274 closed cycles that contain a dispatch. Cycles still open are excluded.

Gate cutoffs (the packet said 10-02/03): **C1 = 2026-10-02T19:58:12Z**, the first row in `sources-gate.jsonl` (a live probe); **C2 = 2026-10-03T12:02:32Z**, commit `783d5905`
"the reply slot goes LIVE" (`git log --reverse -S'SHADOW = false' -- consonance/hooks/reply-slot.js`). *before* = before C1, *transition* = C1..C2 (23 rounds, shown apart), *after* = from C2.
The trailer gate (since 2026-09-16, warn-only) and the second reader are older than C1, so *before* is not gate-free, only free of the SOURCES gate and the blocking reply slot.

## ITEM 3 — lap speed before vs after

### 3a. All rounds, minutes   `[## ITEM 3a]`   command: `node …/loop_friction_A.js | sed -n '/^## ITEM 3a/,/^## ITEM 3b/p'`

| era | rounds | E1 median (IQR) | E2 (handbacks-in recorded) |
|---|---|---|---|
| before | 430 | **14.4** (6.0–30.5) | n=98, median 20.3 (10.5–41.3) |
| transition | 23 | 4.6 (3.0–9.4) | n=0 |
| after | 212 (210 with an end row) | **12.0** (4.0–40.8) | n=0 |

- E1 after − before = **−2.5 min, 95% [−6.5, +3.6]** (seeded bootstrap of the difference of medians, 5,000 resamples).
- Sensitivity, `[## SENSITIVITY]`: *before* limited to 2026-09-18 → 10-02: n=316, median 11.5; after n=210, 12.0; difference **+0.4 [−3.8, +6.3]**.
- Weekly medians of E1 `[## ITEM 3d]`: week of 08-31 41.7 (n=30), 09-07 32.6 (n=16), 09-14 13.3 (n=105), 09-21 10.3 (n=167), 09-28 11.7 (n=173), 10-05 11.9 (n=167). The gates landed inside a steady stretch;
  the slow early weeks have few rounds and are what drags the whole-*before* median up to 14.4.
- E2 and E3 stop being recorded before the gates: the last `handbacks-in` row is 2026-09-28T14:25Z and the last letter-attributed committee post on the board is 2026-09-28T17:57Z
  (`[## E1 vs E3]`). **So "dispatch → hand-back" in the strict sense exists only for the before era** (E3: n=43 of 407 rounds with panes, median 16.5 min; the other 364 are censored because a
  pane had no post by the round's end — a ledger gap, not slow panes). Where both E1 and E3 exist (43 rounds) E1 is a median 2.0 min *after* E3 (IQR 0.7–8.8), within 2 min in 19 of 43, and before it in 3.
  That is the only evidence that E1 follows the last hand-back closely; it is from before-era rounds and is not shown for the after era.
- Volume rose: rounds per day 22.6 in the 14 days before, 34.1 after (`[## SENSITIVITY]`).

### 3b. Per pane, single-pane rounds only (E1, median min; IQR in the output)   `[## ITEM 3b]`

| pane | before (n) | after (n) |
|---|---|---|
| A | 9.8 (59) | 13.5 (31) |
| B | 12.5 (56) | 8.0 (47) |
| C | 12.5 (46) | 17.4 (25) |
| E | 10.7 (47) | 13.0 (28) |

I computed no interval per pane: the IQRs are wide (for example A after 4.3–46.1) and I would not read a direction from any single row. With co-dispatched rounds included `[## ITEM 3c]` the same panes read
A 13.6 → 11.2, B 14.6 → 10.6, C 15.1 → 13.1, E 18.2 → 13.0, i.e. the sign of A, C and E flips between the two views, which is itself the sign that these per-pane rows do not carry a gate effect.

### 3c. Cycles (first dispatch → filed)   `[## ITEM 3e]`

before n=237 median 30.3 min; after n=32 median **128.1** (diff +97.8 [+49.6, +156.9]). **This is not a speed comparison and should not be read as one:** cycle *size* changed. Rounds per cycle, median / mean:
before 1.0 / 1.8, after 4.5 / 6.5. There were 237 closings across 430 before-rounds and 32 across 212 after-rounds, so the chair files far less often per round after the gates (or the long lap is held open
across more rounds, as `D265` is). I have not established which, or why. What the cycle numbers show is that "closed" means something different in the two eras.

## H2 — does a task with ≥3 independent parts finish sooner split across panes, merge included?

Registered falsifier (plan lines 49–52): **FALSE if, among comparable multi-part laps, split laps' median dispatch → close is NOT shorter than single-pane laps'.**

### H2a. Cycles by how the panes were used   `[## H2 - single-pane vs split cycles]`  command: `… | sed -n '/^## H2 - single/,/^## H2 - the merge/p'`

| class (definition) | n | dispatch → filed, median min (IQR) | rounds / cycle, median |
|---|---|---|---|
| single: one pane for the whole cycle | 86 | **14.6** (5.6–30.3) | 1 |
| serial: one pane per round, 2+ different panes | 34 | 32.7 (13.9–77.4) | 2.5 |
| split=2: some round dispatched 2 panes | 69 | 48.6 (19.0–117.5) | 1 |
| split≥3: some round dispatched 3+ panes | 65 | 65.5 (33.0–259.8) | 2 |
| no lettered pane (dispatch named only a non-pane seat) | 20 | 61.7 (29.0–403.0) | 1 |

- Pooled: split (maxK ≥ 2) n=134 median 55.0 vs single 14.6: **+40.4 [+25.3, +60.8]**. Split ≥ 3 n=65 median 65.5: **+50.9 [+25.8, +102.8]**.
- Stratified by rounds per cycle, the only size the ledger records: 1 round — split n=61 31.4 vs single n=76 12.8, **+18.5 [+7.5, +29.8]**; 2–3 rounds — split n=38 55.0 vs single n=10 35.6, **+19.5 [−18.2, +63.2]** (not distinguishable);
  4+ rounds — split n=35 median 191.2, **no single-pane comparator exists** (n=0).
- By era: before +27.5 [+18.0, +42.6] (split n=114, single n=80); after +266.5 [+87.9, +405.5] but single n=5 only. Single-pane cycles went from 80 of 237 closed cycles before to 5 of 32 after.
- By the letter of the falsifier, **H2 is FALSE on this ledger.** I will not stop there, because of the following.

### H2b. Why this test does not decide the question (named, not adjusted away)

1. **Part count is not recorded.** "≥3 independent parts" is the property H2 is about; `lap.jsonl` has no field for it. The pane set is a *consequence* of the chair's judgement that the task was big or multi-part. So split cycles are, by
   construction, the bigger-task group. Direction of the bias: against H2. Size of the bias: unknown; I have no way to estimate it from this file.
2. **Rounds per cycle is not an independent size measure.** It is partly an outcome of splitting (split≥3 median 2 rounds; after-era split≥3 median 14), so stratifying on it controls only partly. The 1-round stratum is the cleanest comparison
   and still reads split slower by 18.5 min [7.5, 29.8], with the same unknown-size caveat.
3. **A cycle is not always one task.** Cycles over 8 h: single 0 of 86, serial 1 of 34, split=2 6 of 69, split≥3 9 of 65, non-pane 5 of 20 (`[## Hours the cycles span]`). A long lap held open over several tasks inflates the split group. Medians resist a few such cycles; they do not
   resist 15 of 134.
4. **Kind of work is uncontrolled.** I did not read what the tasks were. Single-pane cycles include quick doc fixes and keep-warm; split cycles include the consumer-parity build. I did not code this and a recoding of 274 cycles by task type is the next step if this needs settling.
5. **The merge is not visible here.** "Tail" = chair retakes the chain after the last panes-round → filed has a median of 0.0–0.1 min in every class (`[## H2 - the merge alone]`). The collation by the librarian and the chair's landing are written as text and commits, not as a timed ledger
   row, so in this file the merge costs about zero. I do not believe the real merge is zero; I can say only that lap.jsonl cannot see it. That means H2's "merge INCLUDED" clause is not testable from this ledger, only the dispatch → close part.
6. **The gates themselves.** After C2 the practice also changed (more rounds per cycle, fewer single-pane cycles, higher volume). Any before/after comparison of H2 mixes the gates with that change.

### H2c. The in-ledger evidence that points the other way: round time by number of panes in the round   `[## ROUND TIME BY NUMBER OF PANES]`

E1 median (min), all eras: **K=1 11.2 (n=358); K=2 15.8 (n=176); K=3 13.3 (n=55); K=4 17.0 (n=50).** Before: 11.8 / 17.9 / 21.8 / 17.5. After: 11.4 / 15.6 / 11.5 / 13.1 (n=131 / 48 / 14 / 17).
So dispatching three or four panes in one round costs roughly 1.2–1.5× one pane's round in elapsed time. If a K-pane round's parts were each as large as a one-pane task, doing them serially would cost about K× (3–4×). **That "if" is the weak step:** the
parts in a K-pane round may well be smaller than a one-pane task, E1 is the chair's retake rather than the last hand-back (E1 − E3 median +2.0 min where both exist; E3 for K ≥ 3 has no uncensored round at all), and rounds are not cycles. So H2c supports *"adding a pane to a round
is cheap in elapsed time"*; it does not support *"splitting a task finishes it sooner"* any more than H2a refutes it.

## What this does and does not establish

- **Establishes** (with the bootstrap intervals above): no change in median round time at the gates; no single-pane-vs-split comparison in this ledger in which split is faster; round time grows slowly with panes per round.
- **Does not establish:** that the gates have no cost (a rise in the upper quartile, 30.5 → 40.8 min, is visible and uncaused here; the paperwork gates' own refusal-to-resend time is E's item 2 and is not here); that splitting is slower for comparable work; that the merge is free; or anything about the quality of what was produced.
- **Not measured at all:** the part count of any task; what any cycle was about; the cost of writing briefs; the hand-back reading time of the chair/librarian; anything on other machines (`lap.jsonl` is machine-local).
- **My position in the data:** this seat's own rounds are in the ledger being measured, as are the chair's `retake` rows, which are self-reported in part (dispatch rows are written by the app on arrival; chain rows by the chair's tooling).

## What would settle H2 (stated, not done: MEASURE ONLY)

The missing variable is the part count, and it is cheap to record going forward. Candidates, none applied: (a) a `parts` field in the `inquiry`/`dispatched` row set by whoever writes the plan, so the registered comparison can run on laps where it is ≥ 3; (b) a retrospective coding of the 65 split≥3
cycles and 86 single cycles by independent-part count, read from the hand-back files they produced (`exo_memory/handback/`), by a seat that does not hold the answer. (b) is a day of reading; (a) is one field.

Corrections made on the way (so the record is straight): my first pass labelled 106 cycles "single"; 20 of those named no lettered pane (dispatches to the librarian and similar), so they are now their own row and the pooled test already used the 86. My first board-based E3
read 565 letter-attributed committee posts out of 8,289 committee rows; the rest are attributed to `chair`, `gate`, `digest-gate` and similar, so E3 is limited to rounds before 2026-09-28, as reported.
