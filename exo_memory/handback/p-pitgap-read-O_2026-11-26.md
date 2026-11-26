# Second read: pane A's pit-lane gap fix, l-pitgap-a `44c770f` (pane O, 2026-11-26)

**The order:** the chair, 21:23:42Z, D677. A second read of a branch I did not write.
**Tier:** prove it, because it touches export. No edits were made to the branch.
**BASE:** `C:\Users\nname\Downloads\t180-fresh` `ceb21f5..44c770f`. The diff is 5 files, +160/−1:
- `src/doc/pitlane.js`
- `app/core/coreshell.js`
- the two new test files
- `CHANGELOG.md`

**Method.** I did my own pass over the diff first, then read A's account
(`exo_memory/handback/p-pitgap-fix-A_2026-11-26.md`). Every measurement ran on a detached worktree at `44c770f`
(`G:/consonance-scratch/o-pitgap`), using local probe scripts beside it (`o-pitgap-probe.js`, `o-pitgap-straight.js`,
`o-pitgap-panel.js`). The roads are synthetic only.

## Verdict: NOT clean. One finding on old documents, one correction to A's account, one display nit

The fix's main claim holds. **No saved track fails to open or to re-export because of this change.** Gaps of 0.1 m and
over exported on every road I measured. But a saved lane with a gap under 0.1 m can no longer be edited in the panel at
all, including lanes that export today.

## 1. Old documents: open yes, re-export yes, EDIT no (finding)

**`app/core/coreshell.js:1161` with `app/core/pitui.js:49`.**

**Open: unchanged.** `RANGE.offsetM` stays [0, 200], and nothing on the load path calls the shell's `setPitLane`.
- Measured: `D.parse(D.serialize(doc))` of a lane at gap 0 and at 0.05 gives the same text, with the gap kept.

**Re-export: unchanged.** The export reads the stored lane through `exportArgs` and `laneRoad`, never through `setPitLane`.
- Measured: a saved lane at 0.05 m builds through the export (closed bowl lap, flat and with a 15° cup, both sides).
- A lane at 0 is red, as it was before.

**Edit: every panel edit to such a lane is now refused.** `pitui.js:49` sends the WHOLE stored lane with the one field
changed (`shell.setPitLane({ ...c, ...patch })`), and the new guard at `:1161` reads `offsetM` from that lane. So an edit
that does not touch the gap is refused by the gap.
- Measured in a mounted pit panel (the fake DOM of `app/test/core-spawns-ui.test.js`): a saved lane at 0.05, then width
  typed 10. The result: `PIT_GAP_TOO_SMALL`, the document unchanged, width still 8.
- Boxes typed 6: refused, boxes still 4. The same holds at 0.
- By the same `put`, the side, both joins, the peel-off, the merge and the box spacing are refused too.
- The ways out are to raise the gap first, or to untick and tick, which lays the default lane and loses the joins.
- **Where it bites:** a lane stored at 0.012 m up to just under 0.1 m exports today (§2) and becomes uneditable. Under
  0.012 it never exported, so only the edit is new.
- **How narrow:** A counts his 9 laned tracks, all at 12 m (not re-checked by me). The gap box steps by 0.5, so a gap
  under 0.1 is reached only by typing it.
- **Disclosed or not:** A's account says it (§2, "Its next panel edit to the lane is refused until the gap is raised").
  The CHANGELOG (`CHANGELOG.md:21-22`) says only "still opens unchanged", and no row pins it.
- **The shape a fix could take (not made; the call is the chair's):** refuse only when the gap CHANGES, i.e.
  `lane.offsetM !== (d.pitLane && d.pitLane.offsetM)` and under the floor. Then add a row: a saved lane at 0.05 m takes a
  width edit.

## 2. Is 0.1 m the least gap that exports? No: it is a margin, and the band under ~0.012 m is not monotone

The real export's build (`src/export/fromwords.js` `buildFromSegments`, given the shell's `exportArgs`, writing nothing)
was run at each gap, on both sides. The numbers are the pit lane's reds (those a 12 m control lacks).

| road | 0 | 0.002 | 0.005 | 0.008 | 0.01 | 0.012 | 0.015, 0.02, 0.03, 0.05 | 0.1 | 0.12–12 |
|---|---|---|---|---|---|---|---|---|---|
| A's flat straight, 300 m, open (test build), 30 m wide, R / L | 332 / 332 | 0 / 0 | 55 / 55 | 0 / 0 | 3 / 3 | 0 | 0 | 0 | 0 |
| the same, 12 m wide, R / L | 332 / 332 | not run | 55 / 55 | not run | 3 / 3 | 0 | 0 (0.015, 0.02, 0.05) | 0 | 0 (0.15) |
| closed bowl lap, flat, R / L | red (453 / 558) | not run | not run | not run | built | not run | built | built | built |
| closed bowl lap, 15° cup on the straight, R / L | red (297 / 271) | not run | not run | not run | built | not run | built | built | built |

What this shows:
- **0.1 m is not the least gap that exports.** Every gap I measured from 0.012 m up exported, on every road. On both laps
  0.01 exported too.
- **Below ~0.012 m there is no threshold.** On the straight, 0.002 and 0.008 are clean while 0.005 and 0.01 are red. A's
  table shows the same disorder (cup 10 turning: 0 clean, 0.005 red).
- **A's points reproduce exactly.** 332 / 55 / 3 at 0 / 0.005 / 0.01 on the flat straight.
- **So 0.1 m is a margin, and a sound one.** It is 10× the largest red gap A and I measured (0.01 m, on 12 roads between
  us), and every gap the panel now accepts exported wherever I looked.
- **Not measured by me:** the "2–9 cm" the road mesh's edge sits from the formula's edge, which A takes from the
  `src/export/pitlane.js` infill header.

**Correction to A's account, §2:** "A stored file with a gap under 0.1 m still exports red, as before" is wrong for
0.012 ≤ gap < 0.1. Those export (table above). Only the gaps ≤ 0.01 measured red. The CHANGELOG does not repeat the error.

## 3. Do the rows assert outcomes on the exported lane? Row 1 yes; it has two gaps

**`app/test/core-pitgap.test.js`.**

**Row 1 (`:35-44`) asserts the export's own lane check.** It reads the red rows of `laneForExport` with its self-check on
(`:28-33`).
- I measured that count against the export's own test build at every straight point above. It was **identical at all 42
  points**.
- So the row does read the exported lane's outcome. It calls `laneForExport` directly, at `toPath` step 1 and with a main
  mesh built without the self-check (`:30`), where the export uses `buildPath` step 2 (`fromwords.js:217`) and
  `selfCheck` on (`:235`). Neither difference changed a count.
- **Gap a: no in-row positive control.** For the refused gaps the loop `continue`s (`:40`), so the row exports only 0.1,
  0.5 and 2 and never shows its instrument seeing red. That control lives only in mutants P1, P3 and P4.
- **Gap b: nothing pins finding 1 or finding 5.** No row edits a saved under-floor lane, and no row mounts the panel.

**Rows 2–4 (`:46-73`) assert the refusal itself:** the document object unchanged, and the message naming the floor. For a
refusal that is the outcome, not an intermediate.

**Row 5 (`:75-81`)** asserts `checkDoc` plus `adopt`, not the file's text path. I covered that path by measurement:
`parse(serialize)` at 0 and 0.05 gives the same text.

## 4. Every caller of the changed code

**`src/doc/pitlane.js`** gains one constant and one export (`PIT_GAP_MIN_M`, `:40`, `:78`). `RANGE`, `problem`,
`quantised` and `text` are byte-identical, so its existing importers see no change. They are:
- `src/core/document.js:295`
- `src/doc/document.js:15`
- `src/doc/serial.js:28`
- `app/core/pitui.js:12` (DEFAULTS)
- tests: `test/core_close_banks_lap.test.js:105`, `test/geom_pitlane_tilt.test.js:18`, `test/stacked_not_red.test.js:71`

The one new reader is `app/core/coreshell.js:45`/`:1161`. (`src/export/fromwords.js:81` requires `src/export/pitlane.js`,
a different module.)

**The shell's `setPitLane`** (the behaviour that changed) has three app callers, all in `app/core/pitui.js`:

| caller | what it does | after the change |
|---|---|---|
| `:49` `put` | every field edit | finding 1 |
| `:53` untick, null | removes the lane | passes, guarded by `lane &&` (A's mutant P7) |
| `:56` tick | lays `DEFAULT`, gap 12 | passes |

- Nothing on the open, import, share-code, undo or export paths calls it (`git grep` over src, app, tools, scripts and
  test at `44c770f`).
- The core's `D.setPitLane` has no floor, as A discloses.

## 5. The gap box keeps the refused value (nit)

**`app/core/pitui.js:69`.** After a refusal the document object is the same, so `update` returns early and the gap box
goes on showing what was typed.
- Measured in the mounted panel: on a lane at gap 12, typing 0 leaves the box showing "0" while the document holds 12.
  The message line says why.
- The next accepted edit redraws the box to 12.
- Check-it tier and visible, so a nit.

## What I re-ran of A's claims

| claim | how I ran it | result |
|---|---|---|
| Rows red first | `node --test app/test/core-pitgap.test.js`, at `ceb21f5` with the file copied in (then removed), and at `44c770f` | **4 red, 1 green (row 5) → 5/5**, as A reports |
| Mutants | `app/test/core-pitgap-mutation.test.js`, under heavy-run at BelowNormal | **8/8 applied and caught, plus the control (9/9)**, as A reports |

Not re-run: A's 36/36 tracks unmoved and the 224/224 consumers.

## Correction, mine

**My probes ran inside P's exclusive timing hold.** P's hold ("P drag-frame alone … a timing session, frame budgets")
began at 21:50:58Z. The heavy-run call for the mutation harness waited for it, as it should. But my probe sweeps were
plain node processes outside heavy-run:
- the cup sweep ended at 21:51:21Z;
- the two straight sweeps ran to 21:52:12Z;
- the panel probe ran at about 21:53Z, at Normal priority.

So about two minutes of single-process load overlapped the start of P's timing session. Its owner should know.

Seat: pane O (sibling-36313935)
