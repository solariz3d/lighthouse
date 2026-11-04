# p-twoslots-A — D286 part 1: two heavy-run slots, one per tree; seat A, 2026-10-10

Lighthouse worktree `C:\Users\nname\Desktop\worktrees\a-ts-wt`, branch `twoslots-a` from main `8fa65769`. **One commit, `e31c67fb`, named paths, local, not pushed.** Four files: `consonance/tools/heavy-run.js`, `heavy-run.test.js`, `heavy-run.mutants.js`, `consonance/state-manifest.json`. The live lock files were never touched.

## What it does
- **N slots, default 2.** `CONSONANCE_HEAVY_SLOTS` (or the `slots` option) takes 1..8; anything else is the default, so a typo cannot switch the lock off. Files: `heavy-run.lock` (slot 1), `heavy-run.2.lock`, `heavy-run.3.lock`...
- **Each lock records its `tree`:** `git rev-parse --show-toplevel` of the cwd, lower-cased on Windows. A runner whose tree already holds a slot waits whichever slot is free.
- **Non-git cwd (the call you asked me to state):** one shared bucket, `(not in a git tree)`. Non-git runs serialise with each other (unknown is the safe side) and run beside a run in a real tree. Same if git cannot run.
- **A lock with no `tree` (written by the old code) blocks every tree.** This matters until you land: every live holder is old-format, so until then a new-code runner behaves exactly like today.
- **One slot = today's behaviour:** every live lock blocks, including one in slot 2 held by someone with more slots. The scan reads all slot files (to 8) even when the runner may claim fewer.
- **A third runner with both slots held** waits and names BOTH holders (`... A and B still hold the slots`; the waiting line says `all 2 slots are held`). A runner held up by its own tree names only that holder (`it holds this tree`).
- **Takeover rules per slot, unchanged:** dead holder taken and logged (now with `(slot N)`), a young lock needs tasklist to agree, unreadable-lock grace. Nested runs re-enter their own slot, any slot.
- **A race I found and closed, not in the plan:** two runners of one tree can claim DIFFERENT free slots in the same instant, and both would run. After writing its claim a runner looks at the other slots once more and, if a blocking lock is there, removes its own claim and retries after a jitter. The one that proceeds is the one that saw nobody; any later claimer sees it. Row 'a RACE...' pins it through an `onClaim` seam.
- `state-manifest.json`: new STAYS row `heavy-run.*.lock`, because a new file in the data dir is unplaced at close until the manifest names it.

## Checks (all run this lap)
- `node --test consonance/tools/heavy-run.test.js` (from `consonance/`): **39 tests, 39 pass, 0 fail**. Also **38/38 with `CONSONANCE_HEAVY_SLOTS=1`** (run before the last row was added; the last row passes `slots` explicitly). Your five rows are there: different trees both run; same tree waits; a third names both; SLOTS=1; a dead slot-2 holder taken over and logged. Plus: the same tree waits whichever slot holds it; D283's second witness per slot; nested re-entry in slot 2; a legacy lock blocks; the race; the exclusive claim; slot-count parsing; `resolveTree` on real temp git repos; and a **real-process** row (two checkouts hold at once, two in one checkout do not).
- **Red first:** the rows were written before the code. On the old code the in-process rows fail at once; the real-process row and several others hang on the old code (the second runner waits on the machine-wide lock), so I stopped that run by hand. I did not capture a clean pass/fail count for the red state.
- **One existing row changed:** 'the lock holds {pid, seat, cmd, started}' now expects `tree` too (the record gained a field). Nothing else in the existing 17 rows was edited. They all pass at default and at SLOTS=1.
- **Mutants** (`node consonance/tools/heavy-run.mutants.js`, run under the lock): **63 applied, 61 caught, 2 survived, 0 not applied.** The 26 new ones cover slot count, slot file, tree blocking, the legacy lock, one-slot blocking, the tree record, tree resolution, naming of holders, the second look, the exclusive claim and per-slot takeover. The 2 survivors are #16 (put-back does not check the moved lock is alive) and #30 (a spawn error read as an answer); both are D283-era mutants whose anchors I did not change. **Inferred, not checked on the base commit:** D283's hand-back says 35 of 37 caught, which fits these two. My first run here also found one survivor of my own (`'wx'` became unobservable once I scan before claiming); I added a `beforeClaim` seam and a row, and it is caught. Two anchors that became ambiguous (tasklist 'not hidden', 'no timeout') were made unique.
- `portable-paths`: green (372 files, 417 sites, 0 new; one drive-letter test constant of mine was reworded first). `carrier-drift`: GREEN.
- **Not run:** the full js-suite, cargo, `state-manifest.test.js` beyond its one test (1 pass).

## Notes for the landing
- **BUILDING.md:187** still says "`<data>/heavy-run.lock`" in the singular. It is a wake document (and carrier), so I left it; it wants one clause when you land.
- **Seam options** `onClaim` and `beforeClaim` exist only for the tests.
- **Mixed fleet:** while any seat still runs the old `heavy-run.js` (every other checkout until it is updated), an old runner knows only slot 1 and a new runner in slot 2 is invisible to it. In practice a new runner finds slot 1 held by a tree-less lock and waits, so it only reaches slot 2 once slot 1 holds a new-format lock; but an OLD runner can start while a new one sits in slot 2 and the old one takes slot 1 of the same tree. That is the one window where two runs of a tree could overlap. It closes when the file is landed everywhere.
- I waited behind seat E's live runs for about 40 minutes in total and touched no lock that was not mine (I stopped two of my own waiting runners with PowerShell, after reading the command line).
- `a-ts-wt` (and the leftover `a-ds-base` from D285) are still on disk for you.

## BUILDING.md clause (chair's ruling on note 1, same day)
Commit **`991b5782`** on `twoslots-a`, one path, one line: `consonance/src-tauri/brief/BUILDING.md:187`, the parenthesis after `heavy-run.js` now reads "L098; two slots by default, one run per tree (`CONSONANCE_HEAVY_SLOTS=1` = one machine-wide)". I did not find the clause wrong. Run after the commit: `node consonance/tools/portable-paths.js` → **green** (372 files, 417 sites, 0 new); `node consonance/tools/carrier-drift.js` → **GREEN**. Note 2 (mixed fleet) is closed by the chair's ruling: every seat calls main's heavy-run.js by absolute path after the landing.

NEXT: chair cherry-pick 991b5782 on top of e31c67fb on land-d286
