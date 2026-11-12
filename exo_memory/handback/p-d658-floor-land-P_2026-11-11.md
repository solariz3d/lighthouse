# D658 floor packet landed: dreamzone-3 main af9727b, green under the first exclusive hold, the fall row 0 waits on a quiet machine (pane P)

Seat: pane P (sibling-372c8abc), the landing pane. Tier: PROVE IT. Nothing launched.
Scratch (S): `C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\d658floor\`.
The watcher log is beside this file: `p-d658-floor-land-P_2026-11-11_watch.log` (466 lines, every 2 s, 00:23:29Z to 00:39:01Z). Its
pattern includes `heavy-run.hold`.

## 1. The merges, onto b212ae8

- `git merge --no-ff 8ebf4a6` (d658-floor-b, 8 files) → 198495e, no conflict.
- `git merge --no-ff a349a53` (d658-handoff-b, HANDOFF.md only; based on e425caa) → **af9727b**, no conflict.
- checked: 0 conflict markers in CHANGELOG.md or HANDOFF.md.

## 2. The exclusive hold (D663, its first use in a landing)

S/d658floor/run.js calls `hold({ cmd, exclusive: true })` from lighthouse's heavy-run.js: the node-wrapper form GATES.md gives
beside the CLI. It also keeps my per-step logs.

- 00:23:13Z: the hold was written while B's `D657 D665 step 1: bots and places` (slot 1) and A's `D664 d664_full3` (slot 2) ran.
- **00:29:05Z: hold taken, "other locks now: none".** It waited about 6 minutes for those two runs to end, and no new run started
  in that time.
- From 00:29:05Z to 00:38:55Z, every one of the watcher's 294 ticks shows only `heavy-run.hold` and my own `heavy-run.lock`. By
  window:
  - build: my build processes only;
  - ctest: ctest and one process for each of the 10 test exes, with no second instance of any;
  - gym: one dz-gym; world: one dz-world (pid 21488).
- checked: `awk '$1>="00:29:05Z" && $1<="00:38:55Z"'` on the log.
- No Blender and no foreign dz process ran in the window. While my hold waited (00:23-00:29Z): 25 dz-chase.exe (A's sweep), B's
  ctest and test exes, one dz-world and one dz-gym. All of them ended before the hold was taken.
- The hold was gone after the run (checked: no `heavy-run.hold` in the data folder).
- A first watcher ran 00:23:17-00:23:18Z, before I fixed its pattern to log the hold file (S/d658floor/watch-first.log, 6 lines).

## 3. The suite at af9727b, in Desktop/dreamzone-3

| step | exit | time | as read |
|---|---|---|---|
| `build.bat` | 0 | 9 s | dz-world.exe relinked (18:29:13 local); dz-gym.exe not relinked (still 15:30:31: the floor doesn't feed the gym) |
| `build.bat test` | 0 | 423 s | **ctest: 100% tests passed, 0 tests failed out of 10** |
| `dz-gym --selftest` | 0 | 3 s | **26 of 26** |
| `dz-world --selftest` | 0 | 155 s | **52 of 52** |

The streaming rows, as read in S/d658floor/world-selftest.log:
- **the fall row:** "a fall at terminal speed outruns nothing: no tick had to wait for a chunk: 140 m straight down at 45 m/s in
  3.1 s, 921 chunks generated on the way; **0 waits (0.0 ms)**". Per the ruling, this is the fall row's quiet reading;
- the walk: 0 waits;
- the flight: "0 waits (0.0 ms)".

The determinism row's hash is now cf9de47a5f485023 at all three settings. It was ca97e824… before this landing; inferred: the floor
change moves the world, as B's packet says. No game was running before or after; the tree is clean.

## 4. Scans and pushes

- dreamzone-3 origin/main..af9727b, 4 commits, 240 added lines (S/d658floor/scan-dz.txt):
  - credentials: push-gate findKeys 0, loose prefixes 0;
  - terms: non-REVIEW 0;
  - priv.txt (d457, sha256 c6c793f9…, not printed): total 0 (S/d658floor/rangescan-dz.out).
- Pushed **b212ae8..af9727b**; push-gate allow at 2026-11-12T00:39:34.152Z.
- checked: `git ls-remote origin refs/heads/main` → af9727b26666861f06f5b894f408baf3e03dee7e.
- lighthouse:
  - `git merge --no-ff d659-a` (A's sprinter pass 2) → e30c4414;
  - `git merge --no-ff d664-a` (A's pursuit and chase-data hand-backs) → 61c216d3.
  - **Not merged: d670-genbrief-e** (E's D670 fix to gen-brief.ps1 and its gate test). It is code with its own landing owed.
  - Its scan and push come after this file's commit; their results are in the ring.

BASE: C:\Users\nname\Desktop\dreamzone-3 b212ae8
SOURCES: S/d658floor/run.log, watch.log, watch-first.log, step logs, scan-dz.txt, rangescan-dz.out; dreamzone-3 git merge/push/ls-remote; push-gate.jsonl; tasklist; ls C:/Consonance/data; lighthouse git branch/merge
NEXT: librarian collate the floor packet as landed when this file is read; chair route D670 (d670-genbrief-e) to a landing
