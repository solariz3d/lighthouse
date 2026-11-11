# D659 step 1 landed: dreamzone-3 main 8a70f83 (256 materials, the shared fixtures at ids 128-255) (pane P)

Seat: pane P (sibling-372c8abc), the landing pane. Tier: PROVE IT. Nothing launched. Scratch (S):
`C:\Users\nname\AppData\Local\Temp\claude\ec51ccba2d59b61b\fbf98f8e-29da-4fb2-8610-c038d6372249\scratchpad\d659land\`.

## 1. The wait, then the merge

- The packet arrived at 20:20Z. B's "dz-world selftest twice on a quiet machine" held `heavy-run.lock` (started 20:18:23Z). I ran
  nothing until it cleared, using a bash-builtin check every 2 minutes on both slots. It found them clear at 14:24:21 local
  (20:24:21Z).
- checked: both slots empty, and no dz-world or dz-gym running (tasklist).
- 5c6afc8 is one commit on 95b53e4 (checked: `git merge-base`). `git merge --no-ff 5c6afc8` on main in Desktop/dreamzone-3
  → **8a70f83**, no conflict, 10 files.

## 2. The suite at 8a70f83

S/d659land/run.js, in Desktop/dreamzone-3: slot 1 from 20:24:37Z to 20:34:14Z, BelowNormal, windowsHide. Before the hold and before
each step it now stops if any lock names a timing session **or a quiet machine** (B's wording this time).

| step | exit | time | as read |
|---|---|---|---|
| `build.bat` | 0 | 23 s | dz-world.exe and dz-gym.exe relinked |
| `build.bat test` | 0 | 400 s | **ctest: 100% tests passed, 0 tests failed out of 10** |
| `dz-gym --selftest` | 0 | 3 s | **26 of 26** |
| `dz-world --selftest` | 0 | 151 s | **52 of 52** |

- His shortcuts' exes: dz-gym.exe 14:24:59, dz-world.exe 14:25:00 local, linked after the merge commit (14:24:33). The tree is
  clean and no game was running after.
- Not run here: the view's 24/24. It is the librarian's count from C's run, and the packet asked for the two selftests.

## 3. Scans and push, dreamzone-3

- Scan origin/main..8a70f83, 2 commits, 156 added lines (S/d659land/scan-dz.txt):
  - credentials: push-gate findKeys 0, loose prefixes 0;
  - terms: non-REVIEW 0;
  - priv.txt (d457, sha256 c6c793f9…, not printed): total 0 (S/d659land/rangescan-dz.out).
- Pushed **95b53e4..8a70f83**; push-gate allow at 2026-11-11T20:34:24.317Z.
- checked: `git ls-remote origin refs/heads/main` → 8a70f838fb16d57176498bbdf70c360159ad673a.

## 4. lighthouse

- `git merge --no-ff d659-a` (1185f7a6, A's hunter passes 1 and 2; the hand-back and A's map, text only) → 87c00f70. No other
  recent branch is unmerged. C's step 1 and B's hospital (in progress) hand-backs are already on main as their own commits.
- Still untracked and not added: B's D658 captures (`p-d658-school-B_2026-11-11_evidence/`), plus `geom.json` and
  `grep.exe.stackdump` as before.
- The scan and push come after this file's commit; their results are in the ring.

BASE: C:\Users\nname\Desktop\dreamzone-3 95b53e4
SOURCES: heavy-run lock files, tasklist, dreamzone-3 git merge/log/push/ls-remote, S/d659land/run.log and step logs, S/d659land/scan-dz.txt, rangescan-dz.out, push-gate.jsonl, lighthouse git branch/merge/diff
NEXT: librarian collate D659 step 1 as landed when this file is read; B rebases the hospital on 8a70f83
