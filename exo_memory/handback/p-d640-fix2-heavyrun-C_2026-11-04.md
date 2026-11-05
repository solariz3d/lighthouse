# D640 fix lap 2: heavy-run.test.js rows 3, 32 and 34 skip the low-disk warning (pane C)

Seat: pane C (sibling-0845a868). Tier: CHECK IT. Worktree `Desktop/worktrees/lh-d652-c`, branch `d652-c` off lighthouse main `d652e107`.
**Commit `1479f518`** (heavy-run.test.js only). Not pushed, not on main.

## The cause

`H.acquire()` runs the disk guard against the real drive (`heavy-run.js:213` → `checkDisk`). With C: under 50 GB, the guard logs
`heavy-run: WARNING: C:\ has … GB free, under 50 GB; …` (`heavy-run.js:112`) before anything else. Rows 3, 32 and 34 match `logs[0]`
against the waiting line, so they read the warning instead.
checked: the base run (`_evidence/heavy-run.test.before.summary`) → pass 58 / fail 3, not ok 3, 32 and 34. Row 3's failure text is the WARNING line at 38.9 GB.

## The fix (test only)

- **A helper**, `notDisk(logs)`: it drops the lines that match `^heavy-run: WARNING: .* GB free, under \d+ GB` and nothing else. It sits beside the
  file's other helpers, with a comment naming D287 and this ruling.
- **The three asserts**: they match `notDisk(logs)[0]` / `notDisk(e.logs)[0]` instead of `[0]`. Nothing else in each row changed.
- **The warning's own rows are untouched.** The row at `:577` (`logs.length === 1`, "WARNING: C:\ has 30.0 GB free") still checks the warning,
  and so do the disk mutants (62–68, all caught below).
- **heavy-run.js is unchanged.** checked: `git diff d652e107 --stat` → `heavy-run.test.js | 9 ++++++---`, 1 file.

## Checks

- checked: `node --test --test-concurrency=1 consonance/tools/heavy-run.test.js` → **pass 61 / fail 0** (`_evidence/heavy-run.test.after.summary`).
  C: was at 37 GB, so the warning was really given during the run; the green is under the condition that caused the red.
- checked: `node consonance/tools/heavy-run.mutants.js` (BelowNormal, background; it holds the lock itself, which took slot 2 beside P's cargo
  run) → the control (unmutated) passes 61/0; **applied 68 / caught 68 / NOT APPLIED 5** (`_evidence/heavy-run.mutants.out`).
  - The 5 not applied are 12, 29, 30, 32 and 61. All five anchor in `heavy-run.js`, which this lap did not change, so they come from the base, not from this fix.
  - They were left as they are: their anchors are found 2 times (12, 29, 30, 32) or 0 times (61).
  - The harness exits 1 because of them.
  - Mutant 58 counts as caught because the suite hung or crashed under it.

## Owed before this

The Cliffside install hand-back went as a ring with the file count and sha256 compare (6 of 6 OK), as that packet's NEXT asked. No file was owed,
and the track's name stays out of every repo.

BASE: C:\Users\nname\Desktop\worktrees\lh-d652-c d652e107
SOURCES: heavy-run.test.js before/after TAP; heavy-run.mutants.out; git diff d652e107 --stat; heavy-run.js:112, :213
