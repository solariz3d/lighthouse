# Plan: clean up after ourselves (librarian, 2026-10-24 08:0x)

Opened at the keeper's 07:59: "need to journal to make that never happen again, also there have been other areas we
havent been diligent cleaner". Journal: `exo_memory/journal/2026-10-24.md`. Rule: BUILDING.md, "Leave the machine as you
found it".

Tier: prove it (it deletes). Two parts. Nothing is deleted until the keeper has said yes to the list.

## Part 1 — the inventory (one pane, read-only; the chair names it, not O, P or the landing pane)

For each item, give a path, its size, its last write, and a verdict: **ours-done**, **ours-live** (a branch or lap still
open, naming it) or **his** (anything of his: his tracks, saves, AC folder, a private side project, his own folders).
1. Every registered t180 worktree (80 at 08:0x). For each: its branch, whether that branch is merged into local-0.4.17
   (1e436f6) or later, and whether the tree is clean.
2. Every `t180-*` entry in Downloads that is not a worktree (77). For each: is it a clone (`.git`), what it holds,
   and whether anything in the record still names it (`grep -rl` over exo_memory).
3. The scratchpads under `%LOCALAPPDATA%\Temp\claude\`: size per instance.
4. `%TEMP%`: Chrome or puppeteer profiles, `scoped_dir*`, and other leftovers from our runs.
5. Fake AC roots at drive roots (`C:\fake-*`) and exported test tracks anywhere outside a scratchpad.
6. Untracked files in the shared lighthouse checkout (the dirty count was 62 at 07:59), sorted into "hand-backs to
   commit" and "other".
7. Long-running processes started by us that are not infrastructure (the stick-waiter, world-sense and Consonance itself
   are infrastructure).
8. The git branches in t180 that are merged and have no worktree.

Output: a table per item and the totals, in the pane's hand-back, plus a proposed delete list with the bytes it frees.
**Delete nothing in part 1.**

## Part 2 — the clean (after the keeper's one yes to the list)

- Back up anything not already in git to one dated folder (list plus sha256), then delete it. Worktrees go through
  `git worktree remove`, never `rm`; then `git worktree prune`.
- Never touch `Desktop\t180-track-builder`, his tracks, his saves, or his AC folder.
- Afterwards: the counts again, and the bytes freed.

## Part 3 — so it stays clean

A pane builds `consonance/tools/leftovers.js`, an instrument that prints the counts above (tab proxies, worktrees,
non-worktree `t180-*` folders, `C:\fake-*`, our long-running processes). The landing hand-back carries its output, and
the pulse can read it.

NEXT: chair name an inventory pane for part 1 when this ring lands; then the librarian brings the keeper one delete list
to say yes to.
