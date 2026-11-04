# P-PITBALANCE-B: D285 part 2, the pit boxes balanced in the lane (pane B, machine D, 2026-10-10)

**VERDICT: cause CONFIRMED with numbers, fix COMMITTED with its rows.** Branch `b-pitbal`, commit **`01bb546`** on `land-d284-base` (`9bdd10d`), in worktree `C:\Users\nname\Desktop\worktrees\b-pitbal-wt` (fresh, no junctions). Not pushed, not landed. Files by name: `src/markers/index.js`, `test/markers_pitbalance.test.js` (new), `app/test/core-pitlane.test.js` (one test amended BY NAME), `CHANGELOG.md`. Evidence: `p-pitbalance-B_2026-10-10_evidence/`. Every run went through `scratchpad/d273/run.js` under the heavy-run lock.

## 1. The cause (confirmed)

`src/markers/index.js:27` (at 9bdd10d): with no hand-set `layout.pits.lane.along`, box 0 went at `lane.path.lengthM / 2` and every next box one `spacingM` BEHIND it. So the front half of the lane stayed empty, and pit 1 (AC_PIT_0) was the LAST box a car reached. That matches the keeper's words: "Pit 1 starts half way to the back of the pits".

Measured by `evidence/measure.js` (core shell spawnsInfo plus `buildPitLane`; the usable straight is [end of the `in` taper, start of the `out` taper]; a gap is from the straight's end to the box's edge, box half-length 2.4 m), at 9bdd10d (`measure_before.out`):

| case | lane length | usable straight | AC_PIT_0 at s | first box reached | gap before / after |
|---|---|---|---|---|---|
| fresh 1200 m, lane 100–900, spacing 24, 2 boxes | 800.94 | [79.47, 721.47] | 400.47 (= mid) | AC_PIT_1 | 294.6 / 318.6 |
| same, 6 boxes | 800.94 | same | 400.47 | AC_PIT_5 | 198.6 / 318.6 |
| same, 12 boxes | 800.94 | same | 400.47 | AC_PIT_11 | 54.6 / 318.6 |
| keeper's autosave COPY (12 × 13.5 m) | 502.34 | [81.17, 421.17] | 251.17 (= mid) | AC_PIT_11 | **19.1 / 167.6** |

## 2. The fix

In the same block of `src/markers/index.js`:
- **Automatic (no hand-set `along`):** the row is centred on the usable straight. `first = (a+b)/2 − (n−1)·spacing/2`; box k sits at `first + k·spacing`, so AC_PIT_0 is the first box after the entry.
- **Too long for the straight:** a row that needs more than the straight (`(n−1)·spacing + 2·SLOT_HALF_LENGTH > b−a`) stays centred, and an amber `pit-boxes-on-taper` goes up (through `checks.js:105`) saying the end boxes stand on the tapers.
- **Hand-set `layout.pits.lane.along`:** kept exactly as it was (from `along`, backwards by the spacing).

After (`measure_after.out`):

| case | AC_PIT_0 at s | first box reached | gap before / after | on a taper |
|---|---|---|---|---|
| 2 boxes | 388.47 | AC_PIT_0 | 306.6 / 306.6 | none |
| 6 boxes | 340.47 | AC_PIT_0 | 258.6 / 258.6 | none |
| 12 boxes | 268.47 | AC_PIT_0 | 186.6 / 186.6 | none |
| keeper's COPY | 176.92 | AC_PIT_0 | **93.35 / 93.35** | none |

## 3. Rows, red first

`test/markers_pitbalance.test.js` runs through the app's core shell on a 1200 m first piece with a real pit lane, and has 6 rows:
1. the row no longer starts at the midpoint, and AC_PIT_0 is first with each next box 24 m on;
2. to 4. for 2, 6 and 12 boxes, the gaps are equal within one spacing, and no box sits on a taper;
5. the boxes stand on the lane, with the count asked for, and the checks pass;
6. 30 boxes stay centred and raise the `pit-boxes-on-taper` amber.

- **Red at 9bdd10d** (`red_base.out`): 6 tests, **2 pass / 4 fail**. The midpoint, 6-box, 12-box and overflow-amber rows fail. The 2-box and on-lane rows pass at base as guards (2 boxes from the midpoint happen to stay within one spacing of balanced).
- **Green** (`green.out`): **6/6**.

## 4. Amended test (BY NAME)

`app/test/core-pitlane.test.js` "the pit boxes follow the lane's count and spacing" gave `[-14,-14,-14,-14,-14]` after the fix. It had pinned the old backwards direction. The rule changed, so the gap is now measured forwards: `pits[k].s - m.s` became `m.s - pits[k].s`. A dated comment says why. Count and spacing are checked exactly as before.

## 5. Other runs

- **targeted** (`targeted.out`, before the amendment): **159 tests / 158 pass / 1 fail**, over 19 files: markers_export, export_pitboxes, export_pittexture, doc-e2e, markers_lane, markers, markers_track, export_pitinfill, geom-pitlane, geom_pitlane_tilt, core_pitlane, doc-pitlane, export-layouts, export_test_unfinished, core_spawns, plus app/test core-pitlane, core-spawns, core-spawns-ui and core-startline-creep. The 1 fail is the test amended in §4.
- **targeted2** (`targeted2.out`, after the amendment, on the committed content): **128 / 128 pass, 0 fail**, over app/test/core-pitlane, markers_pitbalance, export_words, kn5write, lookmatch, platform_test, trackfiles and app/test/export (the other files that touch AC_PIT_ or the lane).
- **Pit infill (D279) on the keeper's copy** (`s7warn_after.out`): red `[]`, "0 red finding(s)", so no downforce-ray gap.
- **cmcheck** (`cmcheck_after.out`): `BAD: []`, pits 12, uiPitboxes "12", starts 8, meshes 34. A note that was already there and is not mine: `1WALL_T180_END` matches no surfaces.ini key.
- **Not run: the FULL suite.** It is owed at landing.

## 6. What moves

- **Box order is reversed:** AC_PIT_0 is now the first box after the entry, not the last.
- **Every track with a pit lane and no hand-set `along`** exports different AC_PIT_n positions. The CHANGELOG says so.
- **Hand-set `along` is unchanged.**
- **Scope:** only `src/markers` plus tests and the CHANGELOG. A's part 1 files (handles, spawnslayer, spawnsui) are untouched.

## 7. The keeper's files

The autosave was used only as a COPY (`$P/d285/autosave.copy`, 41,333 B).
- sha256 before: `b0320aa3…bbda1a`.
- sha256 after, re-hashed at the end: `b0320aa3…bbda1a` — **unchanged**, mtime still 06:10:09.

**Label correction:** `evidence/measure.js` labels the case "COPY, 05:45". It is the **06:10** copy, the file whose sha is above. The script's text was left as run.

## 8. Corrections

None this lap.

NEXT: chair: land `01bb546` (b-pitbal) with D285 part 1, with the full suite at landing. The keeper should see pit 1 near the lane's entry and the row balanced. An open question for whoever owns it: should a hand-set `along` also lay forwards? I left it unchanged, as asked.
