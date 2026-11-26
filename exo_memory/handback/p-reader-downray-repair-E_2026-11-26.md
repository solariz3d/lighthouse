# Repair: the reader's down-ray band on banked road (pane E, machine D, 2026-11-26)

Packet: the chair's D677 REPAIR ROUND of 21:50:55Z, on pane C's read (NOT CLEAN, one finding:
`G:\consonance-scratch\lh-t2-c\exo_memory\handback\p-reader-downray-read-C_2026-11-26.md`, C's commit 80757765). Tier CHECK IT, rows
red first. Base `reader-downray-e` dab271b, in the reader branch's own worktree `C:\Consonance\t180-wt-e-reader` (not BUILD 3's).

**Branch `reader-downray-e`, tip `a8e54b742a0c71ddd62111c6207a27b6b387e14a`, pushed** (dab271b..a8e54b7, a fast-forward; push gate
`allow` at 21:55:02Z). Three files: `tools/piecewise.cjs`, `test/piecewise.test.js`, `CHANGELOG.md`. Synthetic geometry only.

- checked: `git ls-remote origin refs/heads/reader-downray-e` → `a8e54b742a0c71ddd62111c6207a27b6b387e14a`
- checked: scan of the commit (body and added lines, the room's pattern) → 0 and 0

## 1. The band follows the surface past the window

C's cause held: `downBand` cast every ray in a height window fixed at the station (8 m over, 3 m under), so a banked road left the
window at about window / sin(bank) along the surface. Two changes, in `downBand` only:

- **The window moves with the band.** `layers(u, ref)` centres it on `ref`: the station for the first layer (as before), then the band's
  last point at every step out. The band still takes the layer nearest the last point, within `stepMax` (1 m), so a road over the band
  stays metres away and is not taken.
- **The step across is refined.** With the window moved, the band still stopped short: at a fixed 0.25 m step across, a side steeper
  than acos(0.25 / 1) = 75.5° makes each step longer than the 1 m cap, and the band broke there. inferred by arithmetic, then checked by
  the change: 40° bank + 50° sides reached 90°, and the band read 36.34 of 38 before the refinement, 38 within 0.5 after. The step now
  halves down to du/64 (4 mm) where the next layer is missing or past the cap, and resets to du after each accepted step. This also finds
  each edge to 4 mm instead of to the last 0.25 m sample.

**Its limit, named in the code and the CHANGELOG:** a surface past vertical (an overhang) cannot be seen by rays from above, and ends the
band. C's 52° bank with 50° sides turns to 102°: it reads 47.95 of 49 (checked, below).

### Rows, red first (C's cases A)

Four rows in `test/piecewise.test.js`, the same cupped road and strip as C's `synth.js` (a floor, 4 m sides, the station on a 2 m strip
1.5 m under the top), C's bars: width within 0.5 m, centre within 0.3 m of the top's centre.

| row | at dab271b's `piecewise.cjs` | at the tip |
|---|---|---|
| bank 20°, 27 m, sides to 50° | red: width 26.19 | green |
| bank 20°, 49 m, sides to 50° | red: width 31.93 | green |
| bank 40°, 38 m, sides to 50° | red: width 16.64 | green |
| bank 52°, 49 m, sides to 30° | red: width 13.40 | green |

- checked: `node --test test/piecewise.test.js` with only `tools/piecewise.cjs` stashed back to dab271b → `tests 20, pass 16, fail 4`, the
  four rows above, widths as listed (`G:\consonance-scratch\e-reader-repair\red_dab271b.txt`); at the tip → `tests 20, pass 20, fail 0`
  (`green.txt`). The red widths are C's own (C's table, `p-reader-downray-read-C_2026-11-26.md:62-64`).
- **The 52° row uses 30° sides, not 50°.** With 50° sides it is the overhang above. I made that call against C's grid, where 52° with 30°
  sides is one of C's cases. The overhang stays a named limit, not a row.

### C's own 60 cases on the tip

- checked: `node <C's evidence>/synth.js C:/Consonance/t180-wt-e-reader` → **48 of 60 ok** (C read 30 of 60 at dab271b, 20 at ceb21f5);
  `G:\consonance-scratch\e-reader-repair\synth_tip.txt`.
- The 12 misses, all named limits:
  - **8 at a 58° bank, unchanged from base** (width 1.99, no re-read). This is C's "second limit": the top is found only within 2.5 m
    straight up, and a station 1.5 m under a 58° surface is 2.8 m under it.
  - **4 at a 52° bank with 50° sides, the overhang:** 10.94 of 12, 25.94 of 27, 36.94 of 38 and 47.95 of 49, about 1.06 m short each.
    The centre is 0.72 m off (0.32 at 49 m), against 2.53 m at dab271b.
- C's A2 (a second road level with the cup's rim): 26.99 of 27. C's B cases read as in C's file (B1 and B2 fire, B1b and B3 do not):
  this repair does not touch the guard.

## 2. M5 is killed

A new row: a flat 20 m road, the station on the strip under it, and beside its right edge a second road 2.5 m lower, inside the
height window. The band must stop at the edge (width 20 within 0.5, centre on the road) and not step down onto it.

- checked: `sh G:\consonance-scratch\e-reader-repair\mutants.sh C:/Consonance/t180-wt-e-reader` (C's six, plus the new code's own; each
  restored by `git checkout` on the committed tree) → **applied 9 / caught 8 / NOT APPLIED 1** (`mutants.txt`):
  - NOT APPLIED: C's M5 string `if (!next || next.d > stepMax) break;`, because that line was rewritten. Its equivalent on the new line
    (`if (!next || next.d > stepMax) { h /= 2; continue; }` → `if (!next) { …`) is applied and **caught by the new row**.
  - caught: M1 (the new rows don't add to it; row 2 catches it), M2, M3, M4. New ones: M7 and M9, the window held at the station again
    (caught by three banked rows each), and M8, no refinement (caught by three banked rows).
  - **SURVIVED: M6**, the band always taken over the walk. C called it minor: the trigger already requires the walk to read under half.
    Not in this packet; still open.

## 3. The guard's comment

At the landing guard (`tools/piecewise.cjs:164-166`): `drivenM` (20 m) must stay under the reader's shortest jump, because the skill's
`read_track.cjs` looks for landings from 25 m out only, and a landing is always within its gap of the take-off. A radius at 25 m or past it
would end every jump. Raise one only with the other.

- checked: `grep -n "dist = 25" ~/.claude/skills/track-equations/scripts/read_track.cjs` → **:160** on machine D (and :164, the debug
  path). The order and C both cite :157. inferred: C read another copy. The comment anchors on the code (`for (let dist = 25; …`), not
  on a line number.

## 4. Who calls it

The skill's two callers, both outside the repo:

- `~/.claude/skills/track-equations/scripts/fit-pieces.cjs:11` spawns `tools/piecewise.cjs` (the skill's steps 2-9); its printed report
  carries `rereadByDownRays` and `falseLandings`.
- `~/.claude/skills/track-equations/evals/regressions.test.js:51` calls `PW.meshCentreline(read, …)` directly and scores the fit against
  registered bars (`:56-64`). C found these SKIP on this machine (no matching reads in `T180_REPO/reads`), so nobody has seen whether the
  re-read moves them.

checked: `grep -rn "meshCentreline\|downBand\|piecewise" <skill>/scripts/*.cjs <skill>/evals/*.js` → those two.

In the repo, `meshCentreline` and `downBand` are reached only from `test/piecewise.test.js` and the module's own command line (`grep -rln`
→ those two files). Shipped code does require `tools/piecewise.cjs`, but for its basis functions only:
- `src/core/document.js:18` (`basis, basisN, bandChol`);
- `src/core/close.js:24` (`basis, denseSolve`);
- `app/test/drag-ghost.test.js:25`.

This repair touches none of them.

## Corrections

- My first edit of the test file went through a shell string, and bash took the template literals' backticks as command substitution: the
  file was left with `test(, …`. I caught it with `node --check`, restored the file by `git checkout`, and re-inserted the rows from a quoted
  heredoc. Nothing was committed in between.
- My first lock check printed "timing". It matched my own lock's text, "(not a timing session)", not a timing session. checked: both lock
  files' `cmd`. The single-file run it preceded needed no lock.
- After the window fix alone, three rows were still red. I read the remaining shortfall as the step cap at steep sides. The refinement
  turned two of them green, and the third was the overhang, so I gave that row 30° sides (§1).

## Map line

`exo_memory/map/E.md`, 2026-11-26, reader-downray repair.
