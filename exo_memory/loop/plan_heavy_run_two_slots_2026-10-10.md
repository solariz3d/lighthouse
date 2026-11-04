# Two heavy runs at once, and faster mutation harnesses. Librarian, on D, 2026-10-10 09:4x. Lap D286.

The keeper, 09:38: "i wonder if there is a way to do multiple heavy runs at once, more panes? We have the usage".

## What limits us now (read, with paths)
- **The lock covers the whole machine, not one tree.** `consonance/tools/heavy-run.js` takes ONE file, `<data>/heavy-run.lock`. Its header says
  "one heavy runner per tree", but the data dir is shared, so a t180 landing waits on a lighthouse cargo run in a different worktree. The reason the lock exists
  (2026-09-23: seats read each other's half-written files IN ONE CHECKOUT) only applies within the same tree.
- **The crash fear has one measurement:** D247 (`handback/p-stress-E_2026-10-05.md`) ran 4 h 4 min of parallel load, peaking at 17 node processes,
  with min free RAM 33.10 GB, and there was **no crash**. E's own caveat: one clean night is one data point.
- **One full t180 run is mostly mutation harnesses:** 4,236 of 5,285 s serial (80%). Raising the inner concurrency did not help (inner 4 ≈ inner 6), because
  each harness runs its mutants one after another. E inferred that the lever is running mutants concurrently inside a harness.
- More panes alone would not help. They would queue at the same lock.

## Part 1 (pane A, who fixed heavy-run in D283): two slots, one per tree
- `heavy-run.js` gets **N slots, default 2** (`CONSONANCE_HEAVY_SLOTS` overrides; 1 restores today's behaviour). The slot files are `heavy-run.lock` and `heavy-run.2.lock`.
- **The same tree still runs only one at a time:** each lock records the tree (`git rev-parse --show-toplevel` of the cwd). A runner whose tree already holds a slot
  waits, whatever slot is free.
- D283's takeover rules apply per slot, unchanged: a young lock is taken only when tasklist agrees.
- **Rows:**
  - two runners on different trees both run;
  - two runners on the same tree: the second waits;
  - a third runner with both slots held waits and names both holders;
  - with SLOTS=1 the existing tests pass unchanged;
  - a dead holder in slot 2 is taken over and logged;
  - the mutants on `heavy-run.js` still catch.
- **Tier:** this is a room instrument that guards every heavy run, so run its full test file and the mutants.

## Part 2 (pane E, who built suite2 and ran D247): mutants concurrently in the two app harnesses
- In `app/test/core-mutation.test.js` and `app/test/mutation.test.js`, run up to K mutants at once (K = 3, env override), each in its own temp copy, so no two
  mutants touch one file.
- **Registered before any run:**
  - KEEP if the caught/not-caught set is identical mutant by mutant vs serial on the same tree, AND both harnesses are ≥ 40% faster, AND free RAM stays above 8 GB;
  - otherwise DROP and report.
- Keep a crash-proof ledger as in D247 (fsynced every 5 s). If the PC crashes, stop, keep serial, and record the bugcheck.

## Order
- Parts 1 and 2 are independent and run in parallel.
- Part 2's measured runs hold one slot. Until Part 1 lands, they hold the only slot, so the chair schedules them when no landing is waiting.
- Each part lands on its own green bar. Part 1 lands in lighthouse, Part 2 in t180.

NEXT: chair dispatch D286 part 1 to A and part 2 to E (E after its D277 repair's green bar) when this plan is read

## Amendment (librarian, 09:4x): the crash retest, at the keeper's word
The keeper, 09:39: "it was never us making the pc crash from the heavy runs, it was my outdated drivers and bios. we could test it again though".
- Checked (`Get-WinEvent` System 41/1001/6008, last 14 days): unexpected shutdowns on 09-28, 09-29, 09-30, 10-03, 10-05 (twice) and 10-06 19:59. **None since**
  (about 3.5 days, which included the full suites for Turn by, Sharp and D285). BIOS 1.M3 (dated 2026-09-09). When the keeper updated it is the keeper's account, not checked here.
- **The retest is part 2's measured run, made deliberate:** when part 1 has landed, run part 2's K=3 harnesses in one slot WHILE a full t180 suite runs in the
  other (two trees). Keep D247's fsynced ledger. Report any shutdown with its Event Log bugcheck. **Registered:** no unexpected shutdown during the run, with load at
  or above D247's peak of 17 node processes, counts as one more clean data point, not proof. A crash stops it, and the heavy lane goes back to one slot.

## Amendment 2 (librarian, 09:4x): the retest is withdrawn; part 2 is parked
The keeper, 09:41: "why dont we test it by doing the work we need to do instead of making a test for it, lets get back to retrieval".
- **Part 1 stays** (two slots). Real work then runs side by side, and that IS the test. Any unexpected shutdown goes to the Event Log, as before.
- **Amendment 1's deliberate retest is WITHDRAWN.** Nothing for it had started (`verify/B` held only claims.json at 09:4x; no retest run existed).
- **Part 2 (concurrent mutants) is PARKED** behind the retrieval line. It is a speed lap, not a crash test, and can be picked up later as its own lap.
