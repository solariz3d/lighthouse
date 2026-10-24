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

## The keeper's yes, and part 2 ruled (librarian, 2026-10-24 08:4x)

C's inventory: `exo_memory/handback/p-d450-cleanup-inventory-C_2026-10-24.md` (git-blob e0fbfcab…, 43,483 B).

**The keeper, 08:4x:** to G1–G6 and the 3 merged branches, "1 but please make sure everything that is deleted is meant to be so". On his own folders he said yes to all four: `Documents\t180b_untitled`, the AC track `t180b_test_oval`, the 2 Desktop `ELYSIUM (T-180 track).before-*.zip`, and the 5 Desktop-repo worktrees t180-wt-e19, e20, e21, e22 and e24.

**Kept, by my ruling:** `Downloads\t180-tutorial` (the tutorial video treatment, draft 1, 10-22) and `Downloads\t180-handoff` (the Third Place's catch-up of 10-15). Both are documents, not leftovers. Also kept: everything ours-live, his tracks, and the Third Place's scratchpad.

**"Meant to be so" becomes a second pair of eyes. Part 2 runs in two seats:**
1. **The verifier (not C, and not the deleter).** It reads every path in g1.paths, g2.paths, g4.names, G5, g6.paths, the 3 branches and the 9 items of his, and re-derives each verdict from scratch at the time of its read:
   - a worktree: clean, with its head an ancestor of local-0.4.17/0.4.18 or 0 patches not landed in `git cherry`, and no lap open naming it;
   - a folder: what it holds, and that no open lap or plan names it;
   - a TEMP entry: not open by any running process;
   - his items:
     - t180b_untitled and t180b_test_oval are builder-made (the t180b_ prefix and their files);
     - his own ELYSIUM zip is present and unchanged beside the two .before zips;
     - e19–e24 are clean and merged.
   Output: one list of the paths that pass and one of those that do not, each with its reason. A path that fails is not deleted, and the librarian rules on it.
2. **The deleter**, after the librarian has read the verifier's lists:
   - back up every non-git text file and his 4 items to one dated folder outside Downloads, with a sha256 list;
   - re-check links right before each remove;
   - remove worktrees with `git worktree remove` in their own repo (e19–e24 inside `Desktop\t180-track-builder`, by his yes; that is the only write there), then `git worktree prune`;
   - delete branches with `git branch -d` only;
   - afterwards, the counts again and the bytes freed by `du`.
- Also owed, separately: a `.gitignore` rule in lighthouse for exported tracks (`**/fakeac/`, `**/tracks/*.kn5`, `**/out/`), so 6.0 GiB of kn5 can never be committed by a whole-folder add.
- The live items (D447's fakeac, o18–o22, land418, e43, P's open trees, a29's parked d407b-a) wait for their laps to file.

NEXT: chair name a verifier pane for part 2 step 1 when this ring lands; then the librarian reads its lists and names the deleter.
