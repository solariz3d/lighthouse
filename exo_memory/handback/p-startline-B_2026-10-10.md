# D284 (pane B): the start line moved forward with every piece. Cause named, fixed, rows red first

**Fix:** t180 `9bdd10d` on branch `b-startline`, worktree `C:\Users\nname\Desktop\worktrees\b-startline-wt`, from main `8639987`. Not pushed. 4 files:
`src/markers/layout.js`, `app/core/coreshell.js`, the new `app/test/core-startline-creep.test.js` and `CHANGELOG.md` (an [Unreleased] Fixed entry).
**Evidence:** `exo_memory/handback/p-startline-B_2026-10-10_evidence/`, holding `repro.js`, `repro_before.out`, `repro_after.out`, `red_base.out`, `green.out` and `targeted.out`.

## 1. Reproduced in the app's core shell (`repro.js`; before = 8639987)
The harness reads the line two ways:
- **"shown":** `spawnsInfo()`'s AC_TIME_0 gate midpoint, which is what the panel and the preview draw;
- **"auto":** `startLayout(...)`, which is what the export uses when there are no spawns.

| case | after each append (Straight 200 / broad turn 30°/100 m / Turn by 60° / Sharp −90° R40) |
|---|---|
| (a) automatic, with a pit lane so it is drawn | line z **385 → 585 → 607 → 607 → 607**; along p1 385 → p2 185 → p3 7 → p3 7 → p3 7 |
| (a′) automatic, no pit lane (export only) | the same anchors |
| (b) hand-placed, along 100 on a 400 m first piece | **z 100 every time** (p1 100). It never moved. |
| **keeper's live autosave** (COPY of `autosave.t180auto`, 05:45; three straights 1000/500/500, pit lane on p1, no spawns) | **p3 485 (z 1985) → p4 185 (z 2185)** with one Straight |
| keeper's saved tracks (COPIES; 5 open, no closed ones; TRACK 2 hand-placed) | TRACK 2: p1 858, unchanged; the 4 automatic ones did not move on +Straight (their head is not on their longest straight) |

So it is the **automatic** line, on an **open** track, when the piece added extends the straight the line is on. That is the keeper's case: a pit lane makes
the automatic start visible, and they were adding Straights to the start straight. The extra 22 m after the broad turn is the same cause: the turn's first
segment is under `STRAIGHT_K` and joins the run.

The keeper's files were never written: their sha256 matched before and after (`keeper_sha_before.txt`, compared at the end).

## 2. The cause, named, and the fix
- **Cause:** `src/markers/layout.js:192` (at 8639987), `sLine = best.b - c.lineMarginM`. The line goes 15 m before the far end of the longest straight run.
  On an open track that far end is the build head, so every Straight appended to the start straight lengthens the run and carries the line along. The
  suspects in the plan are cleared:
  - `spawnsLayout` / `anchorS` / `segStarts`: case (b) holds to 0.000 m.
  - `st.resolved.start`: the start does not move.
  - `spawnslayer`: it draws `spawnsInfo`, which already carries the moved anchor.
- **Fix:** `defaultLayout` gets the option `firstPiece`. With it, the line goes near the end of the run's FIRST piece (the segments that carry the run's
  first id), `min(run end, max(first piece end, run start + need)) − 15`, so it is never nearer the run's start than the grid and pits need.
  `coreshell.js` `startLayout` passes it **for an open track only**. The panel, the preview and the TEST export all go through `startLayout` with
  `open: !closed`, so they agree.
- **Rule as the chair set it:** "moves only if the longest straight genuinely changed". I read a straight that grows at its far end as the same straight,
  so the line stays. A separate, longer straight moves the line, and the panel keeps saying "Automatic: …", since no spawns are written (a row checks
  this).
- **After the fix** (`repro_after.out`):
  - (a) and (a′) stay at p1 385 through all four appends.
  - The keeper's autosave goes to **p1 985 and stays** with +Straight. That is beside their pit lane (p1 100–900), not at the head.
  - (b) and TRACK 2 are unchanged.

**What changes, so the chair can rule on it:**
1. On an OPEN track the automatic line now sits earlier on the four automatic saved tracks than it did: FINAL TEST p5 137 → p3 985; FIRST TRACK
   p13 485 → p12 985; HUMP BUG p2 137 → p1 985; TEST TRACK 3 p3 127 → p1 1485. This shows in the panel and in a TEST export only.
2. A CLOSED track uses the old rule, untouched, so a finished track's export is unchanged. A row pins it: on a closed lap whose straight spans p1+p2, the
   line stays near p2's end. The consequence: **closing** an unfinished track whose start straight spans several pieces moves the line to the straight's
   far end, as it always did at Close. The other choice was to apply the rule to closed tracks too, which moves the start in every re-export of a
   finished track. I left that out because it is the keeper's call.

## 3. Rows (`app/test/core-startline-creep.test.js`), red first at 8639987: 3 of 6 failed (`red_base.out`)
| row | 8639987 | 9bdd10d |
|---|---|---|
| hand-placed along 100: unchanged ≤ 0.01 m after Straight, broad turn, Turn by, Sharp (and still p1 100) | pass (guard: it never moved) | pass |
| automatic: a Straight added to its straight leaves it put; the panel line = the export line | **FAIL: moved 200.000 m** | pass |
| automatic: unchanged through all four appends, the export line equal at each | **FAIL: 200.000 m** | pass |
| automatic: a genuinely longer, separate straight moves it there; still no spawns field | pass | pass |
| save, reopen, append (hand-placed and automatic) | **FAIL: automatic 200.000 m** | pass |
| a closed lap keeps its old automatic line (straight p1+p2: the line near p2's end) | pass (guard) | pass |

**Checks**, under the heavy-run lock, `--test-concurrency=1`:
- new rows **6/6**;
- targeted **318/318, 0 fail**, over 23 files: core-spawns, core-spawns-ui, core-pitlane, markers-panel, core-xsec, core-xsec-mutation, core-shell (app);
  core_spawns, core_pitlane, core_pitflat, core_xsec, core_xsec_math, core_xsec_mutation, markers, markers_export, markers_lane, markers_track,
  export-layouts, export_test_unfinished, geom-pitlane, export_pitboxes, export_pitinfill, core_cup_readers.
- **Not run:** the full suite and the core harnesses. They are owed at landing, as the packet says, because this is the export's start position.

## Corrections (mine)
- **W1:** my first `repro.js` run (the "before" table) ran outside the heavy-run lock. It was a light, 1.5 s, single-process run, but the rule covers
  every node run. Every run after it was under the lock.
- **W2:** one shell call stalled on a stray `cat >` that waited on stdin. I stopped it, and it had written nothing (`git status` was clean). The edits
  were then made with Edit.

NEXT: chair land b-startline (9bdd10d) after the full suite + core harnesses at landing; rule on applying firstPiece to closed tracks too (left out: it moves finished tracks' exported start)
