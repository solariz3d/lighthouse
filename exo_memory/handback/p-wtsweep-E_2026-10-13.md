# D319 part 1, pane E: the one-time removal of landed worktrees — 2026-10-13

**Packet:** the chair's D319 part 1 ring, 14:43. **Plan:** `exo_memory/loop/plan_worktree_cleanup_2026-10-13.md:20-32` (`fdb49126`,
`d149ecd4`). The keeper's "yes" is at its :3-4.
**Commit:** lighthouse `dc7639e7` on `d149ecd4`, branch `d319-e`, worktree `Desktop/worktrees/e-d319-wt`. Files:
`consonance/tools/worktree-sweep.js`, `consonance/tools/worktree-sweep.test.js`. The run outputs are kept beside the plan:
`exo_memory/loop/worktree_sweep_dry_2026-10-13.txt` and `worktree_sweep_apply_2026-10-13.txt`.

## 1. The result

```
checked: node consonance/tools/worktree-sweep.js --apply --repo <lighthouse> (15:05–15:13, 7 m 48 s) →
         163 worktrees: REMOVE 143 · UNLANDED 11 · DIRTY 7 · LOCK 1 · MAIN 1
         removed 143, refused 0; git worktree prune: ok
checked: the bytes of the 143, measured before each removal → 14.19 GB
checked: drive free space before → after (Get-PSDrive) → C: 186.12 → 191.00 GB (+4.88), G: 845.07 → 855.93 GB (+10.86)
         (the drives also take other seats' writes during the run, so their delta is not the sweep's alone)
checked: git worktree list, after → 20 entries (the main checkout and the 19 kept below)
```

- **The dry run (14:5x)** read the same 143 to remove: 163 worktrees, REMOVE 143, UNLANDED 10, DIRTY 8, LOCK 1, MAIN 1.
- **Between the dry run and the real run, my own worktree changed class:** DIRTY (the script not yet committed, and its own
  processes naming it), then UNLANDED once committed.
- **No worktree held a link; no worktree was named by a running process;** none was git-locked; none had gone missing.
- **The 14:3x lists:**
  - The re-classification agrees on 143 against the plan's 144: the D317 pair was to wait, and `b-d317-wt` now reads unlanded
    (below).
  - It finds 7 dirty, the plan's 7, plus C's live `c-d319-wt` under its lock.
  - It finds 11 unlanded: the plan's 10, of which `b-d317-wt` stays unlanded, plus my own `e-d319-wt`.

## 2. Every worktree kept, with its reason (for the keeper's list, via the librarian)

**UNLANDED (11): commits whose patch is not in main, by `git cherry main <HEAD>`.**
- `C:\Users\nname\Desktop\b-d317-wt` [d317-b]: `7bc8950208` D317 part 1: the window's X asks before ending working seats (main.rs).
  - D317 landed (`d149ecd4`'s parent line), but not with this patch byte for byte. inferred: the chair landed B's work in an amended
    form; the chair can say.
- `C:\Users\nname\Desktop\c-assembly-wt` [assembly-c]: `db2d7b0474` D277 part 6 (C), DRAFT only: what the seat-file assembly adds,
  per section, and what stays indexed.
- `C:\Users\nname\Desktop\worktrees\a-sd-wt` [startdigest-a]: `0794577d18` D277 part 5 (A): the session-start digest behind the
  gates_mode switch.
- `C:\Users\nname\Desktop\worktrees\c-d277margin-wt` [d277margin-c]:
  - `c4f1c5c56a` D277 margin fix: the light intakes' size margins are measured against what strict drops in this room
  - `b59f01d6da` D277 margin fix: the light pointer's span stops at a strict memory heading
- `C:\Users\nname\Desktop\worktrees\e-d319-wt` [d319-e]: `dc7639e77c`, this script. It lands with this hand-back; not for the
  keeper's list.
- `G:\b-d311b4-wt` [d311-b4]:
  - `8d59fb1c1f` D311 last bench fix: context fidelity
  - `92152b897a` D311: neutral paths in the context-fidelity test rows
  - `6443e97125` D311: the context-fidelity baseline, 22 dev units x 5 = 110, and B's 40-reply sample
  - `53e525d2f2` D311 context-fidelity run: A's hand-back section and map line
  - `7f3fc7dc5e` D311 context-fidelity second judge: B's blind REPEATS / not-REPEATS on A's 40 baseline3 replies
- `G:\consonance-worktrees\a-d294-wt` [d294-a]: `1b4cb7c014` D295: the trailing-reminder SHADOW in the Node pulse hook.
- `G:\consonance-worktrees\a-d296-wt` [d296-a]: `873d8239ef` D296 hand-back: carrier-drift evidence skip (seat A).
- `G:\consonance-worktrees\a-d311a3-wt` [d311-a3]: `2233be7f27` D311: the 40 R-ids for B's second-judge sample on the re-run.
- `G:\consonance-worktrees\a-d311a5-wt` [d311-a5]:
  - `d655966fca` D311 last bench fix: context fidelity
  - `41c8e10f1b` D311: neutral paths in the context-fidelity test rows
  - `63303245ab` D311: the context-fidelity baseline, 22 dev units x 5 = 110, and B's 40-reply sample
- `G:\worktrees\c-d311-wt3` [d311-c3]:
  - `8d59fb1c1f` D311 last bench fix: context fidelity
  - `92152b897a` D311: neutral paths in the context-fidelity test rows
  - `6443e97125` D311: the context-fidelity baseline, 22 dev units x 5 = 110, and B's 40-reply sample
  - `53e525d2f2` D311 context-fidelity run: A's hand-back section and map line
  - `144003fee9` D311 context-fidelity run: C's blind verdicts on the 110 replies, before any unseal

`8d59fb1c1f`, `92152b897a`, `6443e97125` and `53e525d2f2` are the same commits in two worktrees (`G:\b-d311b4-wt` and
`G:\worktrees\c-d311-wt3`).

**DIRTY (7): uncommitted files, by `git status --porcelain`.**
- `C:\Users\nname\Desktop\worktrees\a-cw-wt` (detached): 4 modified fixtures under `consonance/src-tauri/fixtures/screens/`
  (`composer_empty_reads_busy_2026-09-09.bin`, `composer_has_pasted_text_2026-09-19.bin`,
  `composer_slash_command_reads_empty_2026-09-09.bin`, `composer_unreadable_trust_dialog_2026-09-19.bin`).
- `G:\worktrees\e-d288base` (detached): ` M consonance/hooks/reply-slot.test.js`.
- Five in my own scratchpad (`...\sibling-07b8a48f\a2122153-...\scratchpad\`), each a red-first base tree from an earlier lap:
  - `cfgmerge\base-red-wt` and `usb\base-red-wt`: ` M consonance/src-tauri/src/main.rs`
  - `install\base-wt`: `?? consonance/hooks/dirs.test.js`, `?? dev/shell/install-fresh-home.test.js`
  - `lap3\base-wt`: ` M dev/shell/install-fresh-home.test.js`
  - `usb\base-wt`: `?? consonance/ui/usb-mode-wiring.test.js`

  inferred: each is a test planted on a base commit to show it red, which is why they are dirty. They are mine and hold nothing
  else, but they are on the keeper's list by the plan's rule; nothing was deleted.

**LOCK (1):** `C:\Users\nname\Desktop\worktrees\c-d319-wt` [d319-c]: C's part 2 in flight under its heavy-run lock (janitor.js,
janitor.mutants.js and janitor.test.js modified).

**MAIN (1):** `C:\Users\nname\Desktop\lighthouse`.

## 3. The script, and the guards the plan did not name

- **Classification.** `worktree-sweep.js` classifies from git at run time: MAIN, MISSING, GIT-LOCKED, LOCK, DIRTY with its files,
  UNLANDED with its commits and subjects, LINK, PROCESS, REMOVE.
- **The act.** `--apply` removes only REMOVE: clean, and HEAD in main or every patch in main by `git cherry`. It classifies each one
  again just before acting, removes it with plain `git worktree remove` (never --force, never rm -rf), and runs
  `git worktree prune` at the end. Branches are kept: every removal is undone by `git worktree add <path> <branch or sha>`.
- **Locks.** A heavy-run lock naming a worktree keeps it; any lock file counts, live or not. A lock that records no tree stops
  `--apply` altogether.
- **LINK, and why it is required, measured:**
  ```
  checked: scratchpad junction_probe.js, Git for Windows 2.40.0: a clean worktree with a junction under a gitignored path,
           removed with PLAIN `git worktree remove` (exit 0) → the junction's target folder is EMPTIED (its file is gone)
  ```
  So the 2026-09-28 loss does not need --force; any removal of a worktree holding a junction can empty a shared folder. A worktree
  with any junction or symlink inside is kept and each link named. None held one today.
- **PROCESS.** A running process whose command line or executable path names the worktree (Win32_Process via CIM) keeps it. A
  process whose working directory is inside it without naming it cannot be seen that way; Windows then refuses the removal, and the
  script lists the refusal, never forces it. There were 0 refusals.

```
checked: node --test consonance/tools/worktree-sweep.test.js, with the link guard off → 4 pass, 3 fail
         (the junction worktree was classed REMOVE and removed)
checked: the same, with the guard → 8 pass, 0 fail (on a throwaway repo with a real junction, cherry-pick, dirty, unlanded,
         heavy-run-locked, process-named and git-locked worktrees; process lists injected, git and the file system real)
checked: mutants (scratchpad mut_d319.sh) → applied 11 / caught 11 / NOT APPLIED 0: the link, lock, dirty, unlanded, process,
         untreed-lock, re-classification and git-locked guards each off; --force added; main not special; --apply ignored
```

## 4. Corrections, mine
- In the first mutant round, `--force` and "git-locked ignored" both survived: no test reached them. Two were added: the act refuses
  a dirty worktree directly (`removeOne`), and a git-locked worktree is kept. Both mutants are now caught.
- A test string lost its escape in my patch (`'git's'`) and the file failed to load once; it was fixed before the green run.
- A sed meant to retarget mutant 8 did not apply; I fixed the line by hand and confirmed it applied.

## 5. What the plan's falsifier would see
The janitor half (C, part 2) is what keeps it clean. This was a one-time run: re-running the dry run now would list the 19 above and
nothing to remove.

**Calls and wall time:** 1 dry run (3 m 47 s), 1 real run (7 m 48 s), 3 test runs and 11 mutants under the lock, 1 junction probe;
about 70 min including the lock waits.

## 6. Part 1b: the keeper's go on the 17 (15:3x–15:5x)

**The keeper, 15:31:** "delete the garbage and stuff we dont need boss". Plan: `plan_worktree_cleanup_2026-10-13.md:42-50`
(`b6adb32c`); the chair's part 1b ring, 15:32. Zero loss first, then removal.

**Rescue branches (the 7 dirty).** Each worktree's uncommitted files were committed with `git add -A` (which honours .gitignore) onto
a new branch at its HEAD. No file was over 10 MB, so none was held back. A credential scan of each file found nothing.
- **Naming.** Two pairs share a folder name (`base-red-wt`, `base-wt` under different scratchpad folders), so those branch names
  carry the parent folder.

| rescue branch | sha | files | base (HEAD) |
|---|---|---|---|
| `rescue/cfgmerge-base-red-wt-2026-10-13` | `ab083d8312` | 1 (`consonance/src-tauri/src/main.rs`) | `9b172cb5c1` |
| `rescue/install-base-wt-2026-10-13` | `4679942711` | 2 (`consonance/hooks/dirs.test.js`, `dev/shell/install-fresh-home.test.js`) | `ea4f5bcfde` |
| `rescue/lap3-base-wt-2026-10-13` | `d99ee37a81` | 1 (`dev/shell/install-fresh-home.test.js`) | `ab25d588a6` |
| `rescue/usb-base-red-wt-2026-10-13` | `88e672ed7d` | 1 (`consonance/src-tauri/src/main.rs`) | `c6d466291f` |
| `rescue/usb-base-wt-2026-10-13` | `edff4eb08e` | 1 (`consonance/ui/usb-mode-wiring.test.js`) | `c6d466291f` |
| `rescue/a-cw-wt-2026-10-13` | `a0d2ce7c01` | 4 (the screen fixtures) | `ea4f5bcfde` |
| `rescue/e-d288base-2026-10-13` | `bc568aacc7` | 1 (`consonance/hooks/reply-slot.test.js`) | `57ef433d24` |

**Keep branches (the 10 unlanded).** None was needed: each HEAD was already on its own named branch, and `git for-each-ref --contains`
named it.
- `d317-b` `a8fcfa7016` · `assembly-c` `db2d7b0474` · `startdigest-a` `0794577d18` · `d277margin-c` `b59f01d6da` · `d311-b4` `7f3fc7dc5e`
- `d294-a` `1b4cb7c014` · `d296-a` `873d8239ef` · `d311-a3` `2233be7f27` · `d311-a5` `63303245ab` · `d311-c3` `144003fee9`

**The removal.** For this run `worktree-sweep.js` got `--only <list>` (`e1f866e6`, the report fix `5204590e`). Only the listed
worktrees are touched. For them, an unlanded HEAD is no bar if a branch holds it; a HEAD no branch holds stays UNLANDED and kept.
Every other guard is unchanged, with re-classification before the act and never --force.
```
checked: node --test consonance/tools/worktree-sweep.test.js → before --only: 8 pass, 5 fail (the new --only tests); after: 13 pass, 0 fail
checked: mutants → applied 13 / caught 13 / NOT APPLIED 0 (the 11 above, the unlanded-guard mutant retargeted after its line moved,
         plus "held without a branch" and "--only ignores its list")
checked: the report-reason assertion against e1f866e6's script → fails (it printed "every patch is in main" for commits that are not);
         against 5204590e → passes
checked: worktree-sweep.js --only <the 17> (dry run) → 17 REMOVE, 1.67 GB
checked: worktree-sweep.js --apply --only <the 17> (39 s) → removed 17, refused 0; git worktree prune: ok; 1.67 GB measured before removal
checked: drive free space → C: 182.90 → 183.79 GB (+0.89), G: 855.94 → 856.92 GB (+0.98)
checked: every rescue and unlanded branch afterwards (git rev-parse) → all 17 present at the shas above
checked: git worktree list, after → C:/Users/nname/Desktop/lighthouse [main] · Desktop/worktrees/c-d319-wt [d319-c] ·
         Desktop/worktrees/e-d319-wt [d319-e]
```
- **Skips:** none of the 17 held a link, a lock or a running process. Not touched, by the packet: `c-d319-wt` (C, live), `e-d319-wt`
  (mine, until part 1 lands) and the main checkout.
- **Records:** the list run is `exo_memory/loop/worktree_sweep_1b_list_2026-10-13.txt`, its output
  `worktree_sweep_1b_apply_2026-10-13.txt`.
- **Across parts 1 and 1b:** 160 worktrees removed, 15.86 GB measured before removal, 0 refused, 0 forced. Every commit is on a branch.
- **Corrections, mine:**
  - Two regexes in my --only patch were broken by my own string escaping and the file failed to load once; fixed before any run.
  - The first --only dry run said "every patch is in main (git cherry)" for worktrees whose commits are not in main; the reason now
    says the commits stay on the branch, and a test pins it, seen red first against the previous script.

SOURCES: exo_memory/loop/plan_worktree_cleanup_2026-10-13.md · exo_memory/loop/worktree_sweep_apply_2026-10-13.txt · exo_memory/loop/worktree_sweep_1b_apply_2026-10-13.txt · consonance/tools/worktree-sweep.js
NEXT: librarian read §6 when it lands; then the collator lands D319 parts 1 and 2 once C's janitor is in (plan default)
