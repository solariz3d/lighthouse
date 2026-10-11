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
