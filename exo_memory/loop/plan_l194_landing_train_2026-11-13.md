# L194: the landing train. Landings stop being serial, by hand, and blocked by his play. Librarian, on L, 2026-11-13 02:5x local

**Why:** a landing today is one pane merging by hand, about 11 minutes of suites run one after another (B's L174 landing: 644 s), the stamp, the scan, the push, and a wait whenever he has the game open. Over 13 hours and four panes that is the room's largest serial cost.
**Pane:** B (it wrote the launcher, the game guard and the lock tools). Start right after L188 step 1 lands. Tier: prove it (landing code).

## Three changes, in order of cost
1. **The suites in parallel.**
   - `build.bat test` runs the 11 suites one after another. Run them with `ctest -j` at a registered count.
   - **First check:** which suites take the renderer or a fixed port or file, so no two that share one run together.
   - **Bar:** the same 11 pass, each suite's own count unchanged, and both self-tests green.
   - Record the wall time before and after (reported, not a timing run).
2. **The train.** A script in `tools/` (or `consonance/tools/` if it is the room's):
   - panes add a line to a READY list: branch, sha, pane, lap;
   - under the exclusive hold and the memory gate, the train makes a fresh branch from main in **its own worktree**, merges each READY branch in order, builds, and runs the suites and both self-tests;
   - **green:** main fast-forwards to the batch, the scan and the push gate run, origin is pushed, and one board line names what landed;
   - **red:** it drops the newest branch and tries again, down to one. The dropped branches go back to their panes with the failing rows named;
   - a merge conflict drops that branch with the conflicting file named.
3. **Promotion without stopping his game.**
   - The train builds in its own worktree, so his running `dz-world.exe` is never built over.
   - The built binaries and `launch.stamp` are copied into the main checkout only when the guard says no game is running. Otherwise the train waits at that last step alone, and the next batch can already be building.
   - **Bar:** `launch.ps1 world -Check` reads "up to date" after a promotion, and the promoted `dz-world.exe` is byte-identical to the train's.

## Kept from today's landings
- B's guard, the exclusive hold, BelowNormal priority, the credential and privacy scan, the push gate, `world.local.txt` never touched.
- A landing's hand-back is still the pane's, with its "for his eye" section. Only the mechanics move to the train.

## Tests (red first where a row can be)
- **A red branch in a batch of three:** the other two land, the red one is named.
- **A conflict:** dropped and named, with nothing half-merged left behind.
- **With a stand-in game process running** (as B's guard test did): the build and suites complete, promotion waits, and it completes when the stand-in exits.
- **A killed train** (the low-memory reaper's case): the exit trap leaves main, the READY list and the worktree clean.

## Not in this lap
- Fewer suites per landing. The whole suite still runs on every batch.
