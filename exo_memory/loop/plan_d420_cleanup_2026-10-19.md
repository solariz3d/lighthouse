# D420: the cleanup (librarian, 2026-10-19 19:5x local)

The keeper, 19:58 local: **"do all the cleanup once ur ready"**. That is his yes on the deletes listed at
`exo_memory/librarian/2026-10-18.md` (the 19:54 entry) and on closing the stale laps. "Once ready" is read as: after
the work in flight is safe from it.

## Part 1: close the stale laps (chair, now, "just do it")

- D277 (landed 10-10), D334 (sounds installed with D334-D337), and D333 (paused, its job taken over by the public-text
  rule). The keeper accepted closing all three.
- The pulse lists +16 more as stale. The chair closes any it can show landed or was dropped. Anything it can't place
  goes on one list to the librarian, not to the keeper.

## Part 2: the t180 worktrees and branches (O, "prove it", because it deletes)

**When:** after the 0.4.9 release lands, and after A's overnight ABAB and P's D411 builders are done. Removing about
110 directories is disk and CPU load that would spoil a quiet timing window. Check that neither heavy-run lock is held
by a timing session before starting.

**Never touched:** `Desktop\t180-track-builder`; the repo's main checkout; the worktree of the branch that 0.4.9
shipped from; any worktree whose branch belongs to a lap still open at that time (ask the librarian if unsure).

**Steps:**
1. Census, before anything is removed. Run `git worktree list --porcelain` from any t180 worktree. For each worktree,
   record: path, HEAD, branch, whether it is dirty (`git status --porcelain`), and whether HEAD is reachable from the
   v0.4.9 tag or `main`. Write this to the evidence folder as `census-before.txt`.
2. Archive whatever would be lost. Make one `git bundle` of every branch, and every detached HEAD, that is NOT
   reachable from v0.4.9 or main. Write it to `Downloads\t180-archive\d420_2026-10-19.bundle` and run
   `git bundle verify` on it. For every dirty worktree, save `git diff` and the untracked file list into
   `Downloads\t180-archive\dirty\<name>\`. Record the sha256 of the bundle.
   - Known unmerged as of 19:54: `d404-a-memo` and `d404-c`. They are archived, not just deleted.
3. Remove: `git worktree remove` for each worktree (use `--force` only on dirty ones, and only after step 2 saved
   them), then `git branch -D` for their branches, then `git worktree prune`.
4. Verify:
   - before and after counts of worktrees and branches;
   - the bundle verifies;
   - `git fsck` is clean;
   - the release worktree and `Desktop\t180-track-builder` are untouched: same HEAD, no new status lines.

**Added 22:59 (the D411 ruling):** the 12 `d411-*` worktrees and 12 `d411-*` branches that D411's launcher hung off
`C:\Users\nname\Desktop\t180-track-builder` (P's hand-back §5) go too. They hold nothing unique: every diff, hand-back,
verdict and session record is copied under `exo_memory/handback/p-d411-P_2026-10-19_evidence/out/`. Remove only those
refs (`git worktree remove`, `git branch -D d411-*`, `git worktree prune`), and record that clone's HEAD and
`git status --short` before and after. Nothing else in that clone is touched. The four L5 extracts under
`Desktop\worktrees\p-d411-L5-*` are plain folders: delete them after a look.

## Part 3: the lighthouse leftovers (O, same lap, "just do it")

- Commit the 19 uncommitted hand-backs under `exo_memory/handback/`, by named paths. Run the credential scan first.
  Leave out anything about the private side project.
- `grep.exe.stackdump` is a crash dump. Look at it, then delete it. It is not tracked work.
- Leave every other dirty file. Most of them belong to panes that are still working.

## Hand-back

`exo_memory/handback/p-d420-cleanup-O_<date>.md`. It carries:
- the census before and after;
- the bundle path, its sha256 and the verify line;
- what was kept and why.

NEXT: O call_librarian with that pointer. The librarian verifies it on disk and gives the keeper the all-clear.
