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

## Part 2 read (librarian, 19:4x; `handback/p-janitor-E_2026-10-10.md`, git-blob e8234033…, 15,227 B)
- **Accepted.** `ef8fe910` on `be4ccafd` (branch d287-e). Red first shown (janitor module absent; 5 of 6 guard rows red); green 61/61; janitor mutants 25 of 25 caught; heavy-run mutants 68 of 70, both survivors (#16, #30) survive on `be4ccafd` too, so they predate this lap (queued for heavy-run's owner).
- **The dry run reads right:** (a) 20,567 room-prefixed temp folders older than 2 days, 2.19 GB; (b) 20 small logs MOVED to `Z:\consonance-archive\…`, 2 kept as cited; (c)/(d) 0, all 8 targets in use. Nothing on D:, no drive roots, no junctions followed. The prefixes come from the source, not a hand list.
- **E's open decisions, ruled:** (1) (b)/(c) limited to the room's Claude projects: **keep** — `brain-rot` is the keeper's, not the room's. (2) `claimrec-ask-` (66 folders): **leave it**; small, and widening the scan into `exo_memory/` by guess is the worse risk. (3) `t180-soak-` (1,261) and `rc2-*`: left alone, correct; T-180's own soak cleanup is a queued finding for that repo.
- **Found by E, fixed in the branch:** `heavy-run.mutants.js` control was `pass 5 fail 34` on main (temp tree lacked `scratch.js`). Lands with ef8fe910.
- **Outside the packet, accepted:** one `state-manifest.json` row (janitor.jsonl) and 6 benign drive letters in `portable-paths.baseline.json`.
- **Order:** A's part 1 is on main as `b03d7320 50ed5c8d 1dc31c9c`; the chair's landing js-suite holds `heavy-run.lock` (started 00:33Z). After it is green: land `ef8fe910`, run the js-suite once more, then install the task (`janitor-task.ps1`, then `-Check`). The first real `--apply` is the task's own 05:40 run; its `janitor.jsonl` line comes to me.

## The landing suite's three findings, ruled (librarian, 19:5x; `loop/landing_suite_d287_2026-10-10.md`)
- **1. Evidence copies in discovery → A.** Ruling: js-suite discovery skips any directory whose name ends `_evidence` (beside `attic` in `SKIP_DIRS`, `js-suite.js:151`). The copies keep their bytes and names: renaming would make them no longer byte-for-byte copies of what was cited. The suite prints how many evidence files it skipped, so the skip is visible, not silent (its own rule, `js-suite.js:451`). Rows red first: a failing `x.test.js` under `foo_evidence/` is not run, and one under `foo_evidencex/` still is. A also checks the other walkers against the 922 (`carrier-drift.js:95`, `portable-paths`, the mutants harnesses, gen-consumer staging) and says which ones see them.
- **2. Hook tests read the real home → B.** `sources-gate.test.js` and `reply-slot.test.js` pin their mode: each runs its children with a temp `USERPROFILE`/`HOME`, so the real `~/.consonance.json` never reaches them. Add one row per file that sets `gates_mode: light` in that temp home and checks the light behaviour, so both modes are tested on purpose. Red first: the current files go red with `light` in the real home (the chair showed this).
- **3. CRLF in the main checkout:** no fix. The chair's rule stands — landing suites run in a clean worktree on G:. Renormalising 3,254 working copies in the keeper's checkout is not worth the risk.
- **The SOURCES gate in light mode:** that's by design. D277 kept SOURCES blocking and changed only what it matches: what was actually run or fetched, not the wording (`plan_lighten_the_load_2026-10-09.md:34`). If a ring is refused for an item that really was run this turn, it's a finding for E, with the refused text attached.
- **Order:** A and B in parallel → land both → land `ef8fe910` → one js-suite in a clean worktree on G: → push → install the janitor task (`-Check`).
- **A's follow-up read (19:5x; `handback/p-evidenceskip-A_2026-10-10.md`, git-blob 8ad633f8…, 3,641 B): accepted.** `3ef25252` on `d287-a2` from main `8b09b16e`. Red first 43/2 → 45/0; 2 of 2 mutants caught; real tree `174 test files (922 test files skipped under *_evidence)`. portable-paths and gen-consumer do not see the copies; carrier-drift reads their 195 .md/.html and stays GREEN (left as is). A's stated limit stands: the rule is the `_evidence` suffix only, so the evidence copier (C's part 3) must keep that suffix. Held for B's part before ringing the chair (wait for every output).
- **B's follow-up read (19:5x; `handback/p-hermetichooks-B_2026-10-10.md`, git-blob 49f8bbe6…, 7,936 B): accepted.** `793970ec` on `d287-b` from `8b09b16e`. With the real home in light: sources-gate 54/4 and reply-slot 30/6 before; 59/0 and 37/0 after. The new light rows have teeth (a copy forced strict fails both). No hook source was touched.
- **B's findings, routed (they do not block this landing; neither is in js-suite's path):**
  - **F1 → E, and it is live now.** In light mode `lightMatch`'s `light-command` rule (`cmd.includes(item)`) counts a path that was only *mentioned* (echo, a comment, `ls`) as opened. The same matcher also errs the other way: it refused my ring at 19:4x for `C:\…\consonance\tools\js-suite.js`, which I really had read with `grep -n … consonance/tools/js-suite.js` (relative path, after a `cd`; log `sources-gate.jsonl` ring 2eb8b2bdd226). Both errors have one cause: it matches the command's text, not what the command opened. One lap for E: match a path item against the files a command actually read (resolve relative paths against the cwd; a read verb such as cat, grep, sed or head, not echo or ls). Rows red first for both directions.
  - **F2 → A.** `sources-gate.mutants.js` and `reply-slot.mutants.js` don't copy `consonance/tools/scratch.js`, so both controls are red on main (11/25 and 8/50). That's the same defect E fixed in `heavy-run.mutants.js`. A fixes both and checks every other `*.mutants.js` copy list for `scratch.js`, then runs each harness to a green control.
  - **F3:** reply-slot in light warns even when its ledger can't be written. That's by design; a warning is not a gate. No action.
- **Order now:** land `3ef25252` (A), `793970ec` (B) and `ef8fe910` (E) → one js-suite in a clean worktree on G: → push → install the janitor task (`-Check`). F1 (E) and F2 (A) are dispatched in parallel now and land after.
