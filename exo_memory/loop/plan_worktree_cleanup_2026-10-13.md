# Clean out the landed worktrees, and keep new ones in one place. Librarian, on D, 2026-10-13 14:4x. Lap D318.

**The keeper, 14:35:** "yes" (to removing worktrees whose work is already in main, with unlanded ones listed for him first),
"lets hope nothing irrelevant to lighthouse was put into the repo".

## Measured (librarian, 14:3x; the raw lists are beside this file)
- `git worktree list`: 162 entries, the main checkout included. 65 are under `Desktop/worktrees`, 3 are loose on the Desktop
  (`b-d317-wt`, `c-asmbuild-wt`, `c-assembly-wt`), and the rest are in pane scratchpads under Temp and on G:.
- `worktree_census_2026-10-13.txt`: 17 have HEAD in main and are clean; 7 have HEAD in main and are dirty; 137 have HEAD not in main.
- `worktree_unlanded_2026-10-13.txt`, `git cherry main <HEAD>` on the 137: **127 have every patch already in main** (landed by
  cherry-pick under a new id). **10 carry commits whose patches are not in main:** G:/worktrees/c-d311-wt3 (5), G:/b-d311b4-wt
  (5), G:/consonance-worktrees/a-d311a5-wt (3), Desktop/worktrees/c-d277margin-wt (2), and 1 each in a-d311a3-wt, a-d296-wt,
  a-d294-wt, a-sd-wt, Desktop/c-assembly-wt and Desktop/b-d317-wt (D317, landing now).
- The convention exists: `~/.consonance.json` `worktrees_dir` = `Desktop\worktrees` (D287, `plan_clean_up_after_ourselves_2026-10-10.md:90`).
  The janitor removes worktree *targets*, never worktrees (`:25`). B and C put three outside it.
- The repo audit the keeper asked for: 7,812 tracked files, with no film, media, archive or binary. Off-room projects appear only as
  plans: T-180 (64 paths), Thunderhead lights (1) and the Valheim mod (2). No credentials in them; the gate's scan runs on every push.

## Parts
- **Part 1, pane E: the one-time removal.** A script with `--dry-run` as the default, which prints every path and its class. Run
  for real, it removes:
  - the 144 that are clean, with HEAD in main or every patch in main, via `git worktree remove` (never `rm -rf`);
  - then `git worktree prune`.

  Never touched:
  - the main checkout;
  - a worktree holding a heavy-run lock;
  - the D317 pair (`b-d317-wt`, `e-d317-wt`) until the chair lands D317;
  - any of the 7 dirty ones (part 1 lists each one's dirty files for the librarian);
  - the 10 with unlanded commits.

  Branches are kept, since they cost nothing, so every removal is undone by `git worktree add`. Report the disk freed.
- **Part 2, pane C: keep it from coming back.**
  - The janitor (`consonance/tools/janitor*`) also removes a worktree that is clean, has every patch in main (`git cherry`), has
    been idle more than 24 h and holds no lock, and logs each removal.
  - It lists in its report any worktree outside `worktrees_dir` and the G: scratch roots.
  - Tests: a landed clean worktree is removed; a dirty one, an unlanded one and a locked one are kept; a stray is reported.
    Red first.
- **The keeper's list (librarian, after part 1):** the 10 unlanded worktrees with each commit's subject, and the 7 dirty ones
  with their files, so he can say keep or drop for each. Nothing in either group is deleted without his word.
