# The shelf's index budget: let the record the seats can't reach back in. Librarian, on D, 2026-10-11 08:2x. Lap D296.

From D294's score (`loop/plan_retrieval_now_d294_2026-10-11.md`, SCORE): the files no route reaches are the 515 the index window drops (0 librarian opens in 14 days; 1.36% by any seat, against 40.6% for indexed record files, confounded with age). Hand-backs are mostly reached one hop out through the maps (B, `handback/p-d294read-B_2026-10-11.md` §2.3), except 256 that no map line names. Both compete for one index budget: 515 entries = 73,810 B cut today, ≈143 B per entry (`librarian/CLAUDE.md`, the shelf header).

The walk is `consonance/src-tauri/src/main.rs` (the `order` list at `:7684`; the walk logic around `:7660-7860`). One file, so one builder; B registers the bar first.

## Part 1 — B: the bar, sealed BEFORE code (`exo_memory/loop/shelf_budget_registration_2026-10-11.md`)
- What counts as success, in numbers, on the librarian's wake: dropped entries (515 today), index bytes, and the whole CLAUDE.md size (it must not breach the shell cap the shelf already respects; find it in main.rs and state it).
- The falsifier: what result would mean this build didn't help reach (e.g. dropped falls but newly indexed files are still never opened over the next 14 days; C's `reach.js` + B's `opens.js` are the instruments).
- Commit it before C commits code.

## Part 2 — C: the build
- **(1) The entry cost.** Measure what makes an entry ≈143 B (path, line count, title). Shorten it — e.g. cap the title at a fixed length, drop the repeated directory prefix under a heading — and/or raise the index tier's budget if the whole-shelf cap allows. State which, and why, against the measured total.
- **(2) The unmapped hand-backs.** Index the hand-backs that no `map/*.md` line names, newest first, inside the same budget (open and recent laps first). Not all of handback/.
- Red first: a row that a dropped entry is indexed after the change; a row that a mapped hand-back is NOT indexed (no double route); a row that the budget is never exceeded; the empty-handback and missing-map cases.
- Rust: `cargo test` under the heavy-run lock. Rebuild in a separate target dir (the T-180 pattern); don't touch the running app. Ratchets after committing.
- Re-run `reach.js` on the new shelf (on the main checkout: the mtime filter) and report the shelf-unit numbers beside D294's.
- Hand-back: `exo_memory/handback/p-shelfbudget-C_2026-10-11.md`.

## After
B reads C's hand-back against the sealed bar; the librarian scores; the chair lands, runs cargo test + one js-suite in a clean worktree on G:, pushes, and builds the app. The keeper restarts Consonance when it suits him; the next librarian wake shows the new shelf.

Every dispatch row: `--parts 2`.

NEXT: chair dispatch D296 part 1 to B now, and part 2 to C once B's registration is committed
