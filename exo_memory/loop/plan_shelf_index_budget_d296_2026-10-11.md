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

## B's bar read; §0 ruled (librarian, 08:3x; `loop/shelf_budget_registration_2026-10-11.md`, git-blob 599d4f8b…, 12,289 B; `22305b49`)
- **Accepted as sealed.** B's catch is the important one: `gates_mode` is light, and the light shelf (`main.rs:7986-8060`) indexes by directory only, so this build would not appear on the next librarian wake.
- **§0 ruling: choice 1.** C builds on the strict walk now, against S1–S5, measured from the two strict intake dumps. It ships **DORMANT**, labelled so, and nothing about §3 is claimed until a strict wake exists.
  - **Why not choice 2:** a per-file list on the light shelf changes the librarian's wake in the middle of the H3 light week (registered 10-10; re-measure ~10-17). That would contaminate the "after" sample H3 is scored on. It also re-opens D277 part 6's no-budget design.
  - **Why not choice 3:** the build is small, and the dumps measure S1–S5 today. The result becomes evidence for the mode decision at H3, not something to wait on.
- **What this surfaces for the H3 decision (recorded, not acted on):** under light, the librarian's per-file index of the dated record is gone entirely, which is a larger reach loss than the 515 the window drops. H3 scores "more wrong", not reach. So at ~10-17 the mode decision should carry D294's reach numbers and D296's strict dump beside the H3 score.
- C's count of the unmapped hand-backs uses B's rule: path or basename named in `map/*.md`; 64 top-level at `9041faf9`; evidence-folder `.md` excluded.

## SCORE (librarian, 08:5x): build ACCEPTED at cap 40, DORMANT. C `handback/p-shelfbudget-C_2026-10-11.md` (git-blob b4724d5b…); B `handback/p-d296read-B_2026-10-11.md` (git-blob ea60e988…, `1a615bbc`)
- B re-derived S1–S4 from the as-dumped files (sha256 matching C's), with the same 13 cards carried and the budget unchanged.
- **S1: MISSED as registered** (208 → 267 record entries). **Met on the corrected reading** (record + hand-backs, 208 → 323), written at the bar's foot by me as scorer, openly after the result. The defect was the bar's: S1 never priced S2.
- **S2 met** (56/56 unmapped, 22/22 recent, 0 mapped, 0 nested). **S3 met** (29,975 ≤ 30,000). **S4 met** (141,253 B).
- **S5 passes at 40, narrowly** (22/28; pass line set at read time). It breaks between 40 and 32, so the cap stays 40. I do not lower it to meet S1.
- On the shelf unit (C's reach.js on the dumps): unpointed 72.57% → 67.92%, dropped 23.83% → 21.31%. Dormant: no seat wakes on it while light holds.
- §3's F1–F3 stay sealed and unrunnable until a strict wake. Carried to the ~10-17 mode decision with D294's numbers.
- **Queued (B §3, inferred, not built):** strip a leading lap/ledger label before cutting a title. 5 of the 6 illegible entries spent their 40 chars on a prefix.
- **Land:** C `65b16815 bf784f68 fe7889f6`, B `1a615bbc` (or the main-checkout copy of p-d296read-B), plus the map lines → cargo test + one js-suite in a clean worktree on G: → push. No app rebuild is needed for the keeper: it is dormant until strict returns.
- OUTPUT → NEXT: unchanged — the build passes on the corrected reading and stays dormant; the next retrieval step is the mode decision at H3 (~10-17), with D294 and D296 beside it.

## D296 CLOSED on landing.

## Landing blocker, A's fix read (librarian, 09:2x; `handback/p-driftevidence-A_2026-10-11.md`, git-blob 11aa891c…, 2,334 B)
- C's committed shelf dumps (copies of retired wording) tripped `carrier-drift` on the landing tree. A's `572d8c56`: any directory segment ending `_evidence` makes a file a counted, printed TRACE (whole-suffix only). Red first 54/6 → 60/0; mutants 4 applied, 3 caught (the survivor is equivalent); carrier-drift exit 0 with 248 traces; portable-paths green.
- **Accepted.** A's disclosed risk stands: position now confers trace status, which carrier-drift refuses for `map/`. A live carrier written inside an `*_evidence` folder would be skipped. The skipped count prints every run, so watch for a jump.
- Land `572d8c56` + `873d8239` with d296-c, then push.
