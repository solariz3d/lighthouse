# Clean up after ourselves: the disk filled at 12:13 and it must not happen again. Librarian, on D, 2026-10-10 12:4x. Lap D287.

The keeper, 12:13: "Transcript writes are failing (disk full — ENOSPC) major problem". 12:43: "now we need to make sure we clean up after ourselves to avoid this happening again".

## What filled C: (measured today, by the Third Place and the librarian)
- **`gen-consumer-*` in %TEMP%:** 3,837 folders since 09-03, never deleted. About 21 GB (the Third Place sampled 25 folders; the librarian deleted 3,763, freeing 22.6 GB).
- **Cargo `target` folders in worktrees:** 2–4 GB each, never removed after landing. The librarian deleted 10, freeing 24 GB. Separately, Consonance's main target is 14 GB.
- **Claude Code temp, about 60 GB, mostly pane scratchpads:** in-scratchpad cargo targets (`CARGO_TARGET_DIR` in a scratchpad, e.g. B's `d273/target-*`), generated trees and renders. Deleting old task-output logs freed ~0 GB, so the bulk is scratchpads. NOT deleted: hand-backs cite scratchpad files as evidence.
- **About 260,000 other test folders in %TEMP%** (sg-test-*, rs-test-*, jev-*, actors-home-*, jssuite-*, sr-test-* …). Each is small. They leak the same way.
- **`LWSDebugOut.txt`**, 6.9 GB, outside the room (Logitech software). The keeper's to switch off.

## Part 1 (pane A): every harness deletes what it makes
- Find each creator of the temp prefixes above (`grep -rn "mkdtemp\|tmpdir()" consonance dev`) and make it remove its folder in a `finally`, including on failure and on a thrown test. When a run is killed, the janitor (part 2) catches what's left.
- `gen-consumer.js` first, since it was the 21 GB.
- **Rows:**
  - one row per creator: count the prefix's folders before and after a run, delta 0;
  - the same after a deliberately failing run;
  - the existing suites stay green.

## Part 2 (pane E, who built heavy-run's guards and the D247 ledger): a janitor and a disk guard
- **`consonance/tools/janitor.js`**, dry-run by default, `--apply` to delete. It prints what it would free per class and in total. It removes:
  - (a) %TEMP% folders matching the room's known test prefixes, older than 2 days;
  - (b) Claude task-output logs older than 7 days, except any file `exo_memory/` cites;
  - (c) cargo `target*` folders inside Claude scratchpads, idle for more than 2 days (regenerable; never cited as evidence);
  - (d) the `target` of any worktree under `Desktop/worktrees` whose HEAD is already in its repo's main and which has been idle for more than 24 h. It never touches the three main checkouts, and never touches a worktree that holds a heavy-run lock.
  - It never touches the keeper's folders (Downloads, Documents, %APPDATA% app data) or anything outside these four classes.
- **A daily Windows scheduled task** runs `janitor.js --apply` and appends one line per run (freed GB, per class) to `<data>/janitor.jsonl`. It's registered by a script in the repo, so it can be removed with one command, and that command is written in the hand-back.
- **The disk guard, in `heavy-run.js`:** before taking a slot, it reads C:'s free space. Under 50 GB it warns. Under 20 GB it refuses with the free figure and the janitor's dry-run total. So a heavy run never fills the disk again.
- **Rows:**
  - each class deletes old entries and keeps young ones;
  - a cited task output is kept;
  - a locked or unmerged worktree's target is kept;
  - dry-run deletes nothing;
  - the guard refuses at a faked low free space and runs at a normal one;
  - mutants on the janitor's keep-rules, since a wrong keep-rule deletes evidence.

## Part 3 (pane C): evidence lives in the record, not in a scratchpad
- List every scratchpad path that `exo_memory/handback/*.md` cites. Copy each cited file, not whole scratchpads and never a cargo target, into that hand-back's `_evidence/` folder, keeping its name. Report count and bytes.
- Then old scratchpads become safe for a later janitor class (scratchpads idle for more than 14 days). That class is NOT built in this lap. It waits until C's copy is checked.

## Order and landing
- Parts 1, 2 and 3 are independent and run in parallel.
- Part 2's scheduled task is installed by the chair after landing, with the dry-run output shown to the librarian first.
- Feel tier: no. The janitor deletes files, so its keep-rules get mutants and the full test file.

NEXT: chair dispatch D287 part 1 to A, part 2 to E (after its D277 work is done) and part 3 to C when this plan is read

## Amendment (librarian, 12:4x): where things live. The keeper: "if anything store shit on my HDD lol"
- Checked (`Get-PhysicalDisk` / `Get-Partition`): **C:** is a 931 GB SATA SSD, the full one. **G:** is a 2 TB NVMe SSD, 825 GB free and faster than C:. **Z:** is a 3 TB HDD, 944 GB free. **D:** is the 250 GB USB stick, never a target.
- **Builds and scratch go to G:, not the HDD.** Cargo on a spinning disk would slow every landing several times over (inferred, not measured). So `CARGO_TARGET_DIR` for worktrees and pane scratch, gen-consumer's temp and output, and the harnesses' temp roots (part 1 makes the root configurable, defaulting to `G:\consonance-scratch` when G: exists) all go there.
- **Archives go to Z: (the HDD):** the janitor's class (b) logs and, after C's copy, old scratchpads are MOVED to `Z:\consonance-archive\<date>\` instead of deleted, so nothing cited is ever lost.
- The disk guard reads the free space of the drive it is about to write to, not just C:.

## Ruling on C's 75 cited directories (librarian, 12:5x; `handback/p-evidencecopy-C_2026-10-10.md`, judgement 1)
- **Small evidence folders get copied whole,** in one more pass of C's script: each cited directory up to 20 MB in total, leaving out `target*`, `node_modules` and generated trees (`*-gen*`). Its files go into the citing hand-back's `_evidence/`, the same as the 307.
- **Anything larger, and the 8 whole-scratchpad citations, is NOT copied into the repo.** The janitor MOVES such a scratchpad to `Z:\consonance-archive\<project>\<session>\scratchpad\` (the HDD; the path under it is kept). It is never deleted, so the citation still resolves by name. Cargo targets inside it are deleted first, because they are regenerable and never evidence.
- **The janitor archives, it does not delete, any scratchpad that is cited outside `handback/`** (loop/, journal/, the maps, the board), since C's scan covered only hand-backs. So a missed citation costs a trip to Z:, never a loss.
- **A correction to C's hand-back:** it says "on THIS machine (machine L)". This is machine D. The "missing" counts are D's.

## Part 1 read (librarian, 14:4x; `handback/p-tempclean-A_2026-10-10.md`, git-blob 08e97832…)
- **Accepted.** 13 leaking files measured directly: 333 folders left before, 0 after, same pass counts. Full js-suite on `62e776c7`: 172 green, 0 failed, scratch root empty afterwards. Red-first shown for 6 rows; scratch.js mutants 7 of 8 caught, the survivor equivalent.
- **The three deviations stand:** ledger-union, delete-gate and push-gate keep the real OS temp dir (still removed at exit). Ledger-union losing 50 placements in a row on G: (2 of 8 runs) is a FINDING for its owner, queued, not fixed here.
- **Queued, not in this lap:** Rust `temp_dir()` (29 sites) and fixed-name temp files. The janitor covers what they leave meanwhile.
- **For E (part 2):** class (a) also sweeps `G:\consonance-scratch`, per A's landing notes.
- **Order:** no heavy-run lock is held (checked: `cat heavy-run*.lock` printed nothing), so the keeper's restart is clear now. After it, the chair lands A's three commits and runs the full js-suite once, then dispatches part 2 to E.
