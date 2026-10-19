# D412: the T-180 full suite, faster (librarian, 2026-10-19 07:2x)

**Why:** every landing waits on at least one full suite, and only one heavy run goes at a time. 0.4.8 needed two: 2,324 s at 9a92f3a and 2,078 s at 3841908 (`p-0.4.8-landing-B_2026-10-19.md` §3 and §3a). The keeper wants the room to go faster (2026-10-19 07:02). Of the levers ranked that morning, this is the biggest.

**What exists (checked 07:2x):**
- `package.json:3`: `node --test --test-concurrency=4 "test/*.test.js" "app/test/*.test.js"`. The machine is a Ryzen 7 9850X3D (16 threads) with an RTX 5080.
- 3,266 tests: 243 test files, 15 of them mutation files, which ran 579 mutants on the final tree. Each mutant copies `app/` (core-mutation's header, `app/test/core-mutation.test.js:2-5`).
- The heavy-run lock has two slots (`heavy-run.js`), and stale slot files have cost hours. A's detached holder fix (2026-10-19 11:02Z ring) is in A's evidence folder only, not in the repo.

**Pane:** the new Opus 5.5 pane.

**Part 1, measure (no code change):**
- Run the full suite once under the lock, with `--test-reporter=tap`. From the TAP, give per-file wall time, the top 20 files, and how much the mutation files take together.
- Also measure CPU use over the run (average and peak cores busy), so we know whether concurrency 4 leaves the machine idle.
- Hand back the table before changing anything. I rule on part 2 from it.

**Part 2, the likely moves (pick from the measurement, smallest first; each one its own commit, test first where it is code):**
- Concurrency from 4 to a measured number (6 or 8?). Check that timing-sensitive rows are excluded or serialised: drag-frame, and anything that asserts milliseconds. Re-run twice and compare the not-ok sets.
- Mutation harnesses: copy only the files the mutant's test needs instead of all of `app/`, or share one copy per harness with a per-mutant overlay. NOT APPLIED must stay 0 and every mutant must still be caught. Show the counts against 0.4.8's (579/579/0).
- The slowest non-mutation files: note anything obviously wasteful, with no rewrites of what a test checks.
- heavy-run.js: bring A's holder fix into the repo (the holder exits when its parent's pipe closes or the parent is gone, and removes its file), with a test that hard-kills the parent and finds the file gone.

**The bar:**
- No test is removed or weakened.
- The not-ok set is identical to 0.4.8's (empty).
- Mutation counts are identical.
- Target: under 20 minutes wall, measured twice.

**Rules:** headless, `--mute-audio`, one heavy run at a time under the lock, on a branch from b306309, no push. Hand back to the librarian.

NEXT: chair send part 1 to the new Opus 5.5 pane now; it hands back the per-file table to the librarian before any change.
