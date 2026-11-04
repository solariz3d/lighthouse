# D319 part 2: the janitor keeps worktrees from piling up again (pane C, 2026-10-13)

The brief is `exo_memory/loop/plan_worktree_cleanup_2026-10-13.md:33-38` (fdb49126, d149ecd4), with the keeper's "yes" at `:3-4`. The work is on
branch `d319-c` in `Desktop/worktrees/c-d319-wt`, from main `d149ecd4`, in three commits:
- `96ef45b6`: the class, its tests and its mutants;
- `adc691f2`: portable-paths, two of my own strings;
- the commit carrying this hand-back and the map line.

Only `consonance/tools/janitor.js`, `janitor.test.js` and `janitor.mutants.js` changed.

## 1. What the janitor now does: class (e)
A worktree directly under `worktrees_dir` (the same key and env override (d) already uses) is REMOVED when ALL of these hold:
- it is a git worktree and not a main checkout;
- no heavy-run lock is held in it (and, as in (d), none is held at all while a lock records no tree);
- it has no symlink or junction anywhere inside (`survey`, which never walks through a link);
- it is clean: `git --no-optional-locks status --porcelain --untracked-files=all` is empty, so untracked files count;
- every patch of HEAD is in main: `git cherry main HEAD` has no `+` line. A landing by cherry-pick under a new id counts, which is
  how 127 of the 137 non-ancestor worktrees in the census were landed (plan `:11-13`). When git can't say, the worktree is kept;
- it has been idle over 24 h: nothing in it, and none of HEAD, index or logs/HEAD in its git dir, is younger;
- no live pane works in it. That means either a pane folder under `instances_dir` (`CONSONANCE_INSTANCES` overrides it) is the
  worktree or lies inside it, or the last 4 MB of a room transcript written in the last 24 h names the worktree's path, in Windows
  or Git Bash spelling.

The removal itself:
- **The act re-reads all of the above** and skips with "changed since the plan" if anything moved. Then it runs plain `git -C <main
  checkout> worktree remove <path>`, **never `--force`**, so git's own refusal is a second line.
- **The branch is kept.** Each removal appends one line to `<data>/janitor.jsonl`, `{ removed_worktree, head, branch, repo }`, so
  `git worktree add <path> <branch or head>` undoes it.
- **Kept reasons are reported per class**, as before: not a git worktree, a main checkout, a heavy-run lock, a link inside, not
  clean, patches not in main, young, a live pane is working in it.
- **Strays:** the report lists every worktree of the room's repository outside `worktrees_dir`, with its branch or detached HEAD.
  They are never removed. The run's ledger line carries their count.

## 2. Red first, then green
- checked: `node --test --test-concurrency=1 consonance/tools/janitor.test.js`, five new rows on the old janitor → 17 pass, 5 fail.
  Now 24/24 (two more rows were added later, see §3).
- The rows, all on temp repos under the sandbox (`scratch.mkdtemp`), never the live repo:
  - removed: a landed clean idle worktree, both the ancestor case and a cherry-picked one; logged with HEAD; branch kept;
  - kept, each with its reason, still on disk: dirty, untracked, unlanded, locked, link-holding (a junction; its target survives),
    young, and one a transcript names;
  - kept: a pane's own folder; a main checkout; any worktree while a lock records no tree;
  - the act: a worktree that turned dirty after the plan, and one that gained a commit not in main after the plan, are both kept;
  - git's refusal: facts that wrongly say "clean" still cannot get a worktree with an untracked file removed;
  - a stray is reported by path and never removed.
- checked: `node consonance/tools/portable-paths.js` → green, 392 files, 0 new (after `adc691f2`). `portable-paths.test.js` 43/0.

## 3. Mutants
`node consonance/tools/janitor.mutants.js` (it takes the heavy-run lock itself). There are 16 new mutants for (e): the idle floor,
unclean kept, untracked counted, unlanded kept, cherry versus ancestor, link, lock, main checkout, live pane, transcripts read,
`--no-optional-locks`, the act's re-check, `--force`, the log, strays listed, and inside versus outside the folder.
- First full run, on the uncommitted tree: **applied 40 / caught 38 / NOT APPLIED 1**. All three misses were my own:
  - **#23 (cherry versus ancestor) survived.** My cherry-pick row picked in the same second, onto the same parent and tree, so git made
    the SAME commit, an ancestor of main. The row never tested a landing under a new id. It now moves main on first and asserts the
    HEAD is not an ancestor.
  - **#30 (no re-check before the removal) survived.** My race row made the worktree dirty, and git's own refusal kept it, so the
    re-check was never what saved it. The row now also adds a clean, unlanded commit after the plan, which git would remove; only
    the re-check keeps it.
  - **#36 (the older "assertSafe is not called") was NOT APPLIED.** I had put the (e) branch where its anchor sits. The (e) branch now
    comes after (b), and the anchor is whole again.
  - checked: `--only 23`, `--only 30` and `--only 36` after the fixes → each CAUGHT, control 24/0.
- checked: the full run on the committed tree (`adc691f2`): **applied 41 / caught 41 / NOT APPLIED 0**, control 24/0.

## 4. Found on the way
- **A plain `git status` REWRITES the index**, which the janitor reads as "git touched this worktree". With it, every plan made each
  worktree look worked in a moment ago. It turned the existing (d) row "a lock that records no tree … control" red: the second plan in
  that row saw the target as young. `git --no-optional-locks status` doesn't write. Mutant #29 pins it (it makes 4 rows red).
  **The general point for the room:** any tool that ages things by git's own timestamps must never run a git command that writes them.

## 5. Read-only look at the real repository
These are calls only (`listWorktrees`, `removalFacts`); no plan and no apply were run against the live repo, as the packet says.
- checked: `node <scratchpad>/strays.js <worktree>`, run at 15:0x today, while E's one-time removal runs in parallel:
  - **163 worktrees listed, 95 outside worktrees_dir.** By folder: `G:\worktrees` 41, `G:\` 23, `G:\consonance-worktrees` 21,
    `Desktop` 3, and 7 in pane scratchpads (6 of them pane E's, 1 the librarian's).
  - inferred: these 85 on G: are what the brief calls "the G: scratch roots". The report lists each of them by path; it removes none,
    because `worktrees_dir` is the one folder the janitor owns.
- **For the keeper (a call, not mine):** two ways to bring the G: worktrees under the janitor.
  - Point `worktrees_dir` at one G: folder and have new worktrees made there.
  - Or I widen the class to a list of folders.

  Today the strays list only grows unless someone moves or lands them.

## 6. Not done, and why
- `consonance/tools/janitor-task.ps1` (line 8 and the task description at :113) still says "one line per run in janitor.jsonl". There are
  now also per-removal lines. That file is outside my packet's `janitor*.js`, so the collator or E should update its comment.
- I did not run gen-consumer or the full js-suite; the collator runs the suite. No new file was added and no new `require` was made.
- I didn't run the janitor for real, nor a dry run against the live disk.

## Corrections (my own)
- **#23 and #30 survived because of my own rows**, as above. A mutant run found them, not a reading of the code.
- **Three slips:**
  - the escape slip in the pane-text row (`'C:\x'`), caught by node's parse error;
  - `git cherry-pick -q`, which isn't a flag;
  - a "git no longer lists it" check that matched `repo-ancestor` by basename. The check now compares full paths through
    `listWorktrees`.
- **Two portable-paths hits were my own wording** (a drive letter in a comment and in a fixture). I reworded them rather than growing the
  baseline.

## 7. Amendment: the owned folders are a list (the librarian's ruling on §5, sent 21:36Z, under the keeper's 15:31 word). Commit `32d252e1`.
- **What changed** (`janitor.js`):
  - Class (e) walks every folder in `worktrees_dirs`. `ownedFolders()` deduplicates the list, and it refuses any entry that is a drive
    root, before reading anything under it, with a NOTE in the report. The refused root's worktrees stay strays, listed by path.
  - Strays are the worktrees outside EVERY owned folder.
  - Every guard of (e) holds per folder, unchanged: links, locks, live panes, clean, landed, idle, the act's re-check, never `--force`.
    The act's `assertSafe` checks each removal against its own folder.
  - (d) still runs on `worktrees_dir` alone. The ruling named (e), so that is the narrow reading.
- **The setting:** `listSetting()` reads `CONSONANCE_WORKTREES_DIRS` (split on the path delimiter), else the `worktrees_dirs` array in
  `~/.consonance.json`, else `[worktrees_dir]`. A value that is not an array is no folder at all, never a guess.
- **For the collator to set at landing** (I did not touch the live file), next to `worktrees_dir`:

      "worktrees_dirs": ["C:\\Users\\nname\\Desktop\\worktrees", "G:\\worktrees", "G:\\consonance-worktrees"]

  Without it, (e) owns `[worktrees_dir]` only, exactly as before the amendment.
- **Red first:** three new rows on the uncommitted change failed (24 pass / 3 fail) for the three missing pieces: the second folder
  not walked, no drive-root refusal, no `listSetting`. My first run had a fourth reason in it, my own: the drive-root row used a
  `within` the test file never defined. I fixed that before reading the reds.
  - **The rows:**
    - a landed clean worktree in the SECOND listed folder is removed and logged, while one in an unlisted folder is reported and kept;
    - a drive root in the list (the sandbox's own, `path.parse(root).root`, never a literal) is refused and said, no worktree under it
      is read, and the folder beside it still runs;
    - the setting's order: env, then array, then fallback, with a malformed value giving no folder.
  - **The sandbox now pins `worktreesDirs: null`**, so no test can read the machine's configured list once the collator sets it.
  - checked: 27/27.
- **Four new mutants:** a drive root owned; only the first folder walked; strays judged against the first folder only; a malformed list
  guessed at. checked: full run on `32d252e1`: applied 44 / caught 44 / NOT APPLIED 1, control 27/0. The one NOT APPLIED was #34, whose anchor my amendment rewrote; repointed to the new stray check, `--only 34` → CAUGHT (25/2). **Together: applied 45 / caught 45 / NOT APPLIED 0.**
- checked: `node consonance/tools/portable-paths.js` → green, 0 new.
- The `janitor-task.ps1` comment stays the collator's at landing, as ruled (§6).

NEXT: librarian, collate D319 part 2 with its amendment when this ring lands. Plan default after it: the collator lands D319 once E's
part 1b report is in, sets `worktrees_dirs` as above, and runs the full suite once.

## 8. Follow-up: janitor-task.ps1's text (the chair's packet, 22:02Z). Commit `bd3d6bcb` on `d319-c2`, from main `48e647e3`.
- `:8`: the comment now says a run appends one ledger line per run AND one per worktree it removes, with its HEAD and branch, so
  `git worktree add` undoes it.
- `:113`: the `-Description` now says it removes landed, clean, idle worktrees in the owned folders (`worktrees_dirs`, never --force),
  reports the strays outside them, and writes one ledger line per removed worktree.
- Text only: the diff touches those two places and nothing else; the schedule, trigger and command are unchanged.
  checked: `git diff HEAD~1` → 2 removed lines, 3 added, all comment or -Description.
  checked: PowerShell's parser on the file → 0 parse errors.
  checked: no other file reads its text (`grep -rl janitor-task` → only itself).
- **portable-paths is RED, and not from this commit.** checked: `node consonance/tools/portable-paths.js`, in this worktree and on the main
  checkout at `48e647e3` → the same single hit, `consonance/tools/worktree-sweep.test.js:43`, a `c:\program files\…` string in a test
  fixture. `git log -1` on that file → `057bbed2`, E's D319 part 1b. E's to reword (or to baseline as a BENIGN-TEST), and the full suite
  on 216dc89e..48e647e3 will show it red there too. My two lines carry no drive letter or user path.

NEXT: librarian, collate §8 when this ring lands. Plan default after it: the chair lands bd3d6bcb as a records-only commit, and E rewords
worktree-sweep.test.js:43 so portable-paths is green on main again.
