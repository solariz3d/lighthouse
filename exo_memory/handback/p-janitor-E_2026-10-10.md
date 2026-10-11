# p-janitor-E · D287 part 2: a janitor and a disk guard · pane E, on D, 2026-10-10 · DONE (task NOT installed: the chair installs it after the librarian reads the dry run)

Plan: `exo_memory/loop/plan_clean_up_after_ourselves_2026-10-10.md`: Part 2, the "where things live" amendment, the ruling on the 75 cited directories,
and "Part 1 read". **Result: lighthouse `ef8fe910` on `be4ccafd`, branch `d287-e`, worktree `Desktop/worktrees/e-d287-wt`. Not pushed.**
**The restart cut nothing of mine.** I had answered "clear" at 12:20; that answer evidently never reached the chair.

## Files
- `consonance/tools/janitor.js` (new), `janitor.test.js` (new, 15 rows), `janitor.mutants.js` (new, 25 mutants), `janitor-task.ps1` (new).
- `consonance/tools/heavy-run.js` (the disk guard), `heavy-run.test.js` (+6 rows), `heavy-run.mutants.js` (+7 guard mutants, the #6 re-anchor, `scratch.js` in its tree).
- **Outside the packet's four, said before landing:** `consonance/state-manifest.json` gets ONE row (`janitor.jsonl`, STAYS, "DECLARED WITH THE CODE THAT WRITES
  IT"), because without it the close check reports the new ledger as UNPLACED. `consonance/tools/portable-paths.baseline.json` gains the 6 BENIGN-TEST drive
  letters in the guard rows (the drive IS the subject there); I read the diff row by row: exactly those 6 and the count 354 → 360.

## The janitor (dry-run by default; `--apply` acts; `--json`)
- **(a) TEMP:** top-level folders of `%TEMP%` and the scratch root (`G:\consonance-scratch`) whose name is one of the ROOM's prefixes, older than 2 days.
  - The prefixes are read from the repo's own source, never a hand list: every literal passed to `mkdtemp`, and to the room's temp helpers (`tmp('dg-')`) when it
    ends at `-` or `_`, matched with Node's exact 6-character suffix; and the literal head of every Rust `temp_dir().join(format!("head{…"))`.
  - "Age" is the NEWEST mtime anywhere inside, not the folder's own.
- **(b) LOGS:** Claude task-output logs older than 7 days, MOVED to `Z:\consonance-archive\<date>\<project>\<session>\tasks\`, never deleted; a log whose task
  id appears anywhere in `exo_memory/` (the live room's AND the checkout's) is kept; with no archive drive nothing moves. Copy, size check, then unlink.
- **(c) SCRATCH:** cargo `target*` folders inside the room's Claude scratchpads, idle more than 2 days; a folder counts only if it carries cargo's CACHEDIR.TAG.
  Scratchpads themselves are NOT touched (the ruling: that class waits for C's copy).
- **(d) WORKTREE:** the cargo targets of a worktree under `Desktop\worktrees` whose HEAD is in main (`merge-base --is-ancestor`), idle more than 24 h (target AND
  git's HEAD/index/log). Kept: a main checkout; a worktree a heavy-run lock is held in; EVERY worktree while any lock records no tree or is unreadable.
- **Never:** through a symlink or junction (a folder with one inside is kept and named: removing a junction can remove its target); D:; a drive root;
  Downloads, Documents, AppData\Roaming. Every act re-checks root, age and links at the moment of the act.
- **A decision of mine, open to argue:** (b) and (c) look only at the room's Claude projects (`consonance` or `claude-instances` in the folder name). The first
  dry run would have moved two logs of another project of the keeper's (`brain-rot`), which is outside the room.

## The disk guard (heavy-run.js)
Before taking a slot it reads the free space (`fs.statfsSync`) of every drive the run writes to: the cwd, the scratch root, `CARGO_TARGET_DIR` when set. The
lowest decides. Under 50 GB: one WARNING line. Under 20 GB: refuses, **exit 4**, naming the drive, the free figure and the janitor's dry-run total. A drive that
cannot be read is said and skipped. A nested run is not re-checked. `scratch.js` and `janitor.js` are required lazily, so the guard loads beside any copy.

## The scheduled task: written, NOT installed
- Register (daily 05:40, a no-window wscript shim that waits for the exit code, 60-minute limit, IgnoreNew, no WakeToRun; `node --check` pre-flight and a
  dry run printed at the end): `powershell -ExecutionPolicy Bypass -File consonance\tools\janitor-task.ps1`
- **Remove, one line:** `powershell -ExecutionPolicy Bypass -File consonance\tools\janitor-task.ps1 -Uninstall`
- Check: `… janitor-task.ps1 -Check`. The file is ASCII only (0 non-ASCII bytes) and parses (PowerShell parser: 0 errors). I did NOT run it.

## Tests and mutants (all under the heavy-run lock; evidence in my scratchpad `d287/`)
| run | result | sha256 |
|---|---|---|
| red first on `be4ccafd` with the new rows copied in | janitor.test.js fails whole (no module); heavy-run.test.js 5 of the 6 guard rows red, 40 pass (`red2.tap`) | `8af09b2a06e1af5a…` |
| green: janitor + heavy-run + state-manifest tests | **61/61** (`green5.tap`) | `7f221eba30f985e7…` |
| janitor.mutants.js | control 15/0; **25 applied · 25 caught · 0 survived · 0 NOT APPLIED** (`jan-mut4.txt`) | `83272b39d4acd486…` |
| heavy-run.mutants.js | control 45/0; **70 applied · 68 caught · 2 survived · 0 NOT APPLIED** (`hr-mut2.txt`) | `4d54e5092fe32d26…` |
| portable-paths | green, 375 files, 426 known sites, 0 new (`pp4.txt`) | `9d23afca70875b41…` |
| carrier-drift | GREEN | — |
- **The two heavy-run survivors predate this lap:** #16 "race: the put-back does not check that the moved lock is alive" and #30 "tasklist: a spawn error is
  read as an answer" survive on `be4ccafd` too, with the same harness (`base-16.txt` `5d823ae8a0b1fe8b…`, `base-30.txt` `181ec456058a158f…`). Open for the owner;
  not touched here.
- **Found: `heavy-run.mutants.js` is broken on main today.** Its control is `pass 5 fail 34` (`base-hrmut-control.txt` `ade792122cdbdd11…`) because its temp tree
  never copied `scratch.js`, which `heavy-run.test.js`'s `tmp()` has needed since part 1. Fixed here (one name added to its copy list).
- **Not mutated, said by name:** the archive copy's size check (no fault-injection seam to make a short copy), and "descending into a found target"
  (no visible effect). Both rows were dropped rather than counted as survivors.

## Corrections I made to myself
- **I disarmed an existing mutant:** heavy-run #6 ("a timeout does not exit 3") was anchored on the exit line the guard extended; it is re-anchored.
- **My first prefix scan missed the commonest form**, `mkdtemp(path.join(os.tmpdir(), 'x-'))` (my regex refused the parentheses in `os.tmpdir()`), and did not
  read `jev/` or the temp helpers: `jev-parity-` (1,880 folders), `pg-`, `dg-` read as "not the room's". Fixed; the dry run's "not the room's" list now leads with
  `t180-soak-` (another repository's) and `rc2-*`.
- My prefix row named `main.rs` for `seal-gate-`; it is `mcp.rs`. That made the mutant harness's copy red; fixed, plus a second prefix `main.rs` really makes.
- A heredoc stripped backslashes from my appended guard rows (the shell-layer failure again); fixed line by line with Edit before any green was counted.
- One dry-run row compared a colour-coded number; fixed in the test.

## One janitor dry run, full output (`node consonance/tools/janitor.js` on `ef8fe910`, under the lock; `dryrun2.txt` sha256 `58645d4f36dcec2b…`)
```
janitor 2026-10-11T01:31:57.695Z
  (a) temp test folders (%TEMP%, scratch root), older than 2 days: 20567 → 2.19 GB
      kept: young 66568, a link inside 216
  (b) task-output logs older than 7 days, MOVED to the archive: 20 → 0.00 GB
      kept: young 619, cited in exo_memory 2
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-librarian\0c0c0c0b-0000-4000-8000-00000000115b\tasks\b6uigkvfk.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-librarian\0c0c0c0b-0000-4000-8000-00000000115b\tasks\b6uigkvfk.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-librarian\0c0c0c0b-0000-4000-8000-00000000115b\tasks\bfyy7ma6g.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-librarian\0c0c0c0b-0000-4000-8000-00000000115b\tasks\bfyy7ma6g.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-07b8a48f\a2122153-a37e-41a6-a86f-534267ec0565\tasks\b8zn1mee5.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-07b8a48f\a2122153-a37e-41a6-a86f-534267ec0565\tasks\b8zn1mee5.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-07b8a48f\a2122153-a37e-41a6-a86f-534267ec0565\tasks\bidpjskua.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-07b8a48f\a2122153-a37e-41a6-a86f-534267ec0565\tasks\bidpjskua.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-07b8a48f\a2122153-a37e-41a6-a86f-534267ec0565\tasks\bphll3l3m.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-07b8a48f\a2122153-a37e-41a6-a86f-534267ec0565\tasks\bphll3l3m.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\tasks\b1d8x62vv.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\tasks\b1d8x62vv.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\tasks\b7na1nq6y.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\tasks\b7na1nq6y.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\tasks\bqeu3vw4n.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-0845a868\0845a868-38f2-4cc2-b45a-431e0c088fb1\tasks\bqeu3vw4n.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\b3zi1vg5r.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\b3zi1vg5r.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\b7aqcnsrz.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\b7aqcnsrz.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\b944tcapk.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\b944tcapk.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\bh0yq7tu9.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\bh0yq7tu9.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\bi8oigz20.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\bi8oigz20.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\bnvf7p294.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\bnvf7p294.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\bqbrnj72c.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\bqbrnj72c.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\bu1j66n4q.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\bu1j66n4q.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\byiec2ub1.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\tasks\byiec2ub1.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-5bf9d657\12fb81f6-f4c0-4ef8-aad8-f0cdce091925\tasks\b3zcqotu4.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-5bf9d657\12fb81f6-f4c0-4ef8-aad8-f0cdce091925\tasks\b3zcqotu4.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-5bf9d657\12fb81f6-f4c0-4ef8-aad8-f0cdce091925\tasks\b9lxua99y.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-5bf9d657\12fb81f6-f4c0-4ef8-aad8-f0cdce091925\tasks\b9lxua99y.output
      move C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-5bf9d657\12fb81f6-f4c0-4ef8-aad8-f0cdce091925\tasks\bizurxkjr.output  (0.00 GB) → Z:\consonance-archive\2026-10-11\C--Consonance-instances-sibling-5bf9d657\12fb81f6-f4c0-4ef8-aad8-f0cdce091925\tasks\bizurxkjr.output
  (c) cargo targets in Claude scratchpads, idle over 2 days: 0 → 0.00 GB
      kept: young 7
  (d) cargo targets of merged worktrees idle over 24 h: 0 → 0.00 GB
      kept: young 1
  TOTAL: 2.19 GB
  not the room's (left alone; the most common names): t180-soak- 1261, rc2-home- 205, rc2-vicsek-phi-nodeps- 82, rc2-order-parameter-nodeps- 80, claimrec-ask- 66, rc2-data- 41, rc2-vicsek-phi-data- 41, rc2-vicsek-phi-home- 41
  DRY RUN — nothing changed. --apply to act.
```
The "kept" counts are folders the janitor saw and kept, with the reason. (c) and (d) found 8 targets, all in use. Today it would free **2.19 GB** in
(a) and move 20 small logs (b): the big leaks were cleared by hand on 2026-10-10, and A's part 1 stops new ones.

## Not established
- The scheduled task has never run (not installed).
- `--apply` was exercised only on sandboxes in the tests, never on the real disk.
- How long a first real `--apply` takes over ~87,000 temp folders: the dry run took about 50 s (`[locked.js] exit 0 in 50 s`).
- Rust `temp_dir()` names that are not a `format!` head with a `-`/`_` boundary (fixed names) are not matched, by design.
- **A known gap:** `claimrec-ask-` (66 folders) is room-made, by `exo_memory/loop/claimrec/`, but the prefix scan skips `exo_memory/` on purpose (its evidence
  copies hold other projects' scripts and would teach the janitor their prefixes). If the librarian wants it, the claimrec scripts belong under `consonance/tools/`,
  or the scan gains that one folder by name; I left it rather than widen the scan by guess. `t180-soak-` (1,261) and `rc2-*` are other repositories'.

NEXT: librarian read the dry run and route the task install to the chair, when this hand-back is read
