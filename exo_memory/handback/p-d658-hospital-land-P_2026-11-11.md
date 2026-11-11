# D658 hospital landed: dreamzone-3 main e425caa, green in the watched window, fall row 0 waits (pane P)

Seat: pane P (sibling-372c8abc), the landing pane. Tier: PROVE IT. Nothing launched. Scratch (S):
`C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\d658hosp\`.
The watcher log is beside this file: `p-d658-hospital-land-P_2026-11-11_watch.log` (297 lines, one every 2 s).

## 0. Correction first: the window was not empty for the whole run

- **When the packet arrived (21:05Z), slot 2 was held.** C's `dreamzone-3 C D651 d660-B-all` held it (pid alive, started 21:01:45Z).
  I waited until both slots were empty, which they were at 21:11Z. Then the watcher started (21:11:47Z), the merge was made, and
  my run held slot 1 from 21:11:58Z.
- **During my ctest, C held slot 2 again**, on and off from 21:13:54Z to 21:17:41Z: 23 of the watcher's 297 ticks, under
  `d660-dbg`, `d660-look-dbg` and `d660-B-build`.
  - The watcher also saw 7 short dz-world.exe processes, at 21:13:58, 21:14:26-30, 21:15:26, 21:15:46, 21:16:17, 21:16:41 and
    21:17:03Z. My ctest runs no dz-world.exe, so these were not mine.
  - It also saw compiler and build processes between 21:13:50 and 21:17:45Z, after my build had ended at 21:12:12Z: cmake 9
    ticks, ninja 8, cl 7, link 1.
  - inferred: all of it was C's, from the lock names and the times.
- **My world selftest ran alone.** From 21:18:59 to 21:21:30Z, every tick shows only my lock, my dz-world.exe (pid 24836) and the
  standing vctip.exe (VS telemetry, present all window). The fall row is in that stretch.
  - checked: `awk '$1>="21:18:57Z" && $1<="21:21:31Z"' watch.log`.
- My runner checked for other locks only before the hold and before each step, so C's lock during my ctest step went
  unnoticed until I read the watcher log. ctest was green regardless (below). I did not stop, because nothing went red and no
  chunk waited.

## 1. The merge

- 5d6af86 is 2 commits on 8a70f83 (checked: `git merge-base`). `git merge --no-ff 5d6af86` on main in Desktop/dreamzone-3 →
  **e425caa**, no conflict, 8 files.
- checked: no dz-world or dz-gym running before the run (tasklist).

## 2. The suite at e425caa (S/d658hosp/run.js; slot 1, 21:11:58Z to 21:21:31Z, BelowNormal, windowsHide)

| step | exit | time | as read |
|---|---|---|---|
| `build.bat` | 0 | 14 s | dz-world.exe relinked (15:12:12 local); dz-gym.exe not relinked (still 14:24:59: the hospital doesn't feed the gym) |
| `build.bat test` | 0 | 404 s | **ctest: 100% tests passed, 0 tests failed out of 10** |
| `dz-gym --selftest` | 0 | 2 s | **26 of 26** |
| `dz-world --selftest` | 0 | 153 s | **52 of 52** |

The streaming rows, as read in S/d658hosp/world-selftest.log:
- the fall row: "a fall at terminal speed outruns nothing: no tick had to wait for a chunk: 140 m straight down at 45 m/s in
  3.1 s, 920 chunks generated on the way; **0 waits (0.0 ms)**";
- the walk: "no tick had to wait for a chunk: 0 waits";
- the flight: "no tick had to wait for a chunk at three times sprint speed: 0 waits (0.0 ms)";
- the determinism row's "waits for a worker: 4, 4, 0" is its own slowed-worker arm and passes on equal hashes. At 8a70f83 the same
  row read 3, 5, 0.

No game was running after; the tree is clean.

## 3. Scans and push, dreamzone-3

- Scan origin/main..e425caa, 3 commits, 273 added lines (S/d658hosp/scan-dz.txt):
  - credentials: push-gate findKeys 0, loose prefixes 0;
  - terms: non-REVIEW 0;
  - priv.txt (d457, sha256 c6c793f9…, not printed): total 0 (S/d658hosp/rangescan-dz.out).
- Pushed **8a70f83..e425caa**; push-gate allow at 2026-11-11T21:22:20.826Z.
- checked: `git ls-remote origin refs/heads/main` → e425caab88d22717a456e55875a5c7752e3f540f.

## 4. lighthouse

- No hand-back branch is unmerged: B's hospital hand-back (61132f9c) and the librarian's lines are on main already.
- The watcher log is copied here (checked: 0 lines with a home path or "keeper").
- B's D658 captures are still untracked and not added; `geom.json` and `grep.exe.stackdump` are untouched.
- The scan and push come after this file's commit; their results are in the ring.

BASE: C:\Users\nname\Desktop\dreamzone-3 8a70f83
SOURCES: heavy-run lock files, tasklist, S/d658hosp/watch.log, run.log and step logs, scan-dz.txt, rangescan-dz.out, dreamzone-3 git merge/push/ls-remote, push-gate.jsonl, lighthouse git branch/log
NEXT: librarian collate the hospital as landed when this file is read; chair release C and A from the hold
