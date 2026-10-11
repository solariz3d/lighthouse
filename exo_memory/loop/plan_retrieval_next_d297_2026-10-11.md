# Retrieval, next: legible titles, the F1–F3 scorer, and what light mode costs in reach. Librarian, on D, 2026-10-11 13:2x. Lap D297.

Why now: D296 closed at 09:3x (`loop/plan_shelf_index_budget_d296_2026-10-11.md:53-56`) and the line stopped. Nothing else was queued, and that was this seat's miss. The keeper asked at 13:21 why work ended. Nothing below needs strict mode or touches H3's after-sample.

## Parts, one pane each, run in parallel
1. **B: register the bar first,** before C's code lands. Use the same snapshot (`G:/consonance-scratch/c-d296/snap`) and the same 30-entry sample (seed 2961, `handback/p-d296read-B_2026-10-11.md` §3).
   - Legibility at cap 40 must rise from 22/28 (B sets the target number and says why).
   - Record entries listed must not fall below 267.
   - S3 ≤ 30,000 B and S4 ≤ 142,000 B must still hold.
   - B also states what a stripped label may lose. Example: "D177, packet C" is not in the path, so B rules whether losing it is allowed.
   - Then B reads C's re-dump against that bar.
2. **C: strip a leading lap/ledger label before the title is cut.** The code is `index_title`, `consonance/src-tauri/src/main.rs:7518-7534`. The case for it: 5 of the 6 illegible titles spent their 40 chars on a prefix (B §3).
   - Red-first rows on the six named titles.
   - Mutants on `index_title` only.
   - Re-dump base and new from the snapshot, the D296 way (`dump2.sh`).
   - It stays dormant, like D296.
3. **A: build the F1–F3 scorer now,** so it runs at W0 without anyone rebuilding it. The falsifiers are in `loop/shelf_budget_registration_2026-10-11.md`, at its foot.
   - Input: librarian transcripts, counting `Read` tool calls only. `read_ledger.jsonl` records no opens (C, `handback/p-reach-C_2026-10-11.md`).
   - Input: the list of NEW and OLD entries, taken from the two dumps.
   - Output: F1 new-entry opens, F2 old-entry open rate against 4.1%, F3 opens of the newly listed unmapped hand-backs.
   - Test it on a fixture transcript, plus one replay over the last 14 days. That replay is a baseline only, scored by nothing.
4. **E: what light mode costs in reach, MEASURE ONLY.** This is for the ~10-17 H3 decision.
   - Run C's `reach.js` on `librarian.light.md` and on the strict `new2` dump, from the same snapshot.
   - Report the unpointed share and the files reachable under each.
   - No verdict on the mode.

Checks: each pane runs targeted tests under the heavy-run lock. The chair runs the full suite before it lands.

## After
All four come back to the librarian, who scores against B's bar. The chair then lands and pushes. E's number goes beside H3 at the mode decision.

## SCORE (librarian, 13:4x). Hand-backs: A `handback/p-f1f3scorer-A_2026-10-11.md` (git-blob b9950237…), E `handback/p-lightreach-E_2026-10-11.md` (git-blob bd4c5447…), C `handback/p-labelstrip-C_2026-10-11.md` (git-blob 1b710c58…), B bar `loop/label_strip_registration_2026-10-11.md` (git-blob fdc4b94d…) and read `handback/p-d297read-B_2026-10-11.md` (git-blob c5591b7a…)
- **Part 2, the label strip: T1 22/28 MISSED, F-a FIRED.** T2 0 regressions, T3 268/463, T4 56/56, S3 29,919, S4 141,658, T5 and T6 (0/81) all met. It lands as a **lossless tidy-up, dormant**. It is NOT the legibility fix and is not counted as one.
  - The prediction that failed was B's §2 "why 24" (B W1). My ruling not to build the #27 clause stands: it reaches 23 at most.
  - The six illegible titles share one cause, and it is not a lap label: the finding sits past char 40 behind a document kind, a model id, a parenthetical, a series name or the subject (B §4). **Queued**, not dispatched: a claim-first title source (for example the first sentence after the heading, or a tail strip), with its own bar.
  - Side effect, named: the 15th carried body swaps `memory/user-solariz3d.md` → `memory/dont-offer-rest-assume-momentum.md` at the refill margin (C §3, B §1). This is churn by bytes, not a choice.
- **Part 3, the F1–F3 scorer: ACCEPTED.** 18 rows pass, mutants 15/15. A's three unit choices are kept as built. Baseline replay, scored by nothing: OLD 19/208 = 9.13%, NEW 0/115, hand-backs 0/56.
- **Part 4, light reach: recorded for the H3 mode decision.** By path, unpointed is 99.74% under light against 67.92% under strict (16 against 428 files). By directory, 49.34% against 46.80%. handback/ is in neither mode's directory list.
- OUTPUT → NEXT: changed. The legibility fix needs a different source for the title, not a strip. Under light mode, per-file reach is near zero; whether directory pointers get followed is what A's scorer can decide once strict runs.

## D297 CLOSED (librarian, 14:0x)
Landed and pushed as origin/main 6f6fc83c..9c6abfb3 (checked: `git fetch`; origin/main = 9c6abfb3, and it contains 562c1a77 and fc5549c5). The chair's full run: cargo 1027/0/5, js-suite 175/0/1 not-run. Dormant; no app rebuild. Next: D299, `loop/plan_claim_first_titles_d299_2026-10-11.md`.
