# Re-read: pane A's pit-gap repair, l-pitgap-a `44c770f..7e42f02` (pane O, 2026-11-26)

**The order:** the chair, 22:05:58Z, queued; released 22:21:30Z, after my C1 repair was rung. D677.
**Tier:** prove it. No edits were made to the branch.
**BASE:** `C:\Users\nname\Downloads\t180-fresh` `l-pitgap-a` `44c770f..7e42f02`, read on origin by `git fetch` (`7e42f02f`). One commit,
6 files, +88/−10. I read only this range. My first read is `p-pitgap-read-O_2026-11-26.md`, beside this file. A's account is
`p-pitgap-repair-A_2026-11-26.md`.

## Verdict: CLEAN

All five points the chair named hold, measured. Nothing new is found.

| the chair's point | where | result |
|---|---|---|
| the refusal fires only when the gap CHANGES to under 0.1 m | `app/core/coreshell.js:1163-1164`: `gapNow` is the stored lane's gap; refused only when `offsetM !== gapNow && offsetM < PIT_GAP_MIN_M` | **holds** (probe below) |
| the red-first row: a saved lane at 0.05 m takes a width edit | `app/test/core-pitgap.test.js`, row 6, the pit panel mounted | **red at `44c770f`, green at `7e42f02`** |
| the CHANGELOG wording | `CHANGELOG.md:19-26` | **exact**: it names what is refused (under 0.1 m AND differing from the stored gap), what still works on a saved lane, and 0.1 m as a margin with the export's non-monotone band under 0.012 m. Every figure in it matches my first read's table |
| my `pitui.js:69` nit | `app/core/pitui.js:50` `put`: when the document did not change, `shownFor = null; update(…)` | **fixed**: on a lane at 12, typing 0 now leaves the box showing "12" |
| A's corrected §2: 0.1 m is a margin | `p-pitgap-fix-A_2026-11-26.md:70-73` and `:89-92`, marked corrections with the old wording kept; `src/doc/pitlane.js:38-39` | **correct**, and it agrees with my figures |

## What I re-ran

**A's rows, red first.** I wrote the tip's `app/test/core-pitgap.test.js` into the worktree at `44c770f` and ran it, removed it, then
checked out `7e42f02` (detached, no edits):

| | tests | pass | fail |
|---|---|---|---|
| `44c770f` with the tip's rows | 8 | 6 | **2**: row 6 (the width edit) and row 8 (the gap box) |
| `7e42f02` | 8 | 8 | 0 |

So rows 6 and 8 are red first, and row 7 is a guard (green on both), as A reports.

**A's mutation harness** (`app/test/core-pitgap-mutation.test.js`, through `heavy-run.js --run` at BelowNormal): **13/13**, the control
plus **12 of 12 mutants applied and caught** (P1–P12), as A reports. I read P9–P12 against the diff. Each removes or bends exactly one of the
repair's two moves (the `!== gapNow` test, which lane's gap is compared, the redraw, the `shownFor` reset), and each names a row that exercises it.

**My panel probe** (`G:/consonance-scratch/o-pitgap-panel.js`, extended with case C for this re-read; the pit panel mounted on the fake DOM, a closed
bowl lap; output `o-pitgap-panel.7e42.txt`):

| case | result at `7e42f02` |
|---|---|
| A: lane at 12, gap typed 0 | refused `PIT_GAP_TOO_SMALL`; the document stays at 12; **the box shows "12"** (it showed "0" at `44c770f`) |
| B: saved gap 0.05, width typed 10; boxes typed 6 | **laid** (it was refused at `44c770f`); the gap stays 0.05 |
| B: saved gap 0, the same edits | **laid**; the gap stays 0 |
| B: `parse(serialize)` at 0.05 and at 0 | the same text, gap kept (unchanged from the first read) |
| C: saved gap 0.05; side → L, leave point → 80, merge → 70, width → 10, one at a time | each **laid**, the gap kept at 0.05, the box showing "0.05" |
| C: that edited lane through the export's build (`buildFromSegments(...exportArgs())`) | **built** |
| C: gap typed 0.06 | refused; the document unchanged; the box back to "0.05" |
| C: gap typed 0.05 (its own value) | no change, no new refusal |
| C: gap typed 0.1 | laid, 0.1 |
| C: gap typed 0.05 (lowering it again) | refused; the box back to "0.1" |
| C: undo | back to 0.05, with the box showing "0.05" |

**My export sweep on A's flat straight** (`o-pitgap-straight.js`, 30 m wide, gaps 0 / 0.005 / 0.01 / 0.012 / 0.05 / 0.1, both sides; output
`o-pitgap-straight-7e42.jsonl`): **332 / 55 / 3 / 0 / 0 / 0** on both sides. That is identical to my first read. The diff does not touch the export
path, and the numbers confirm it. I did not re-run the two closed laps or the 12 m straight, for the same reason.

## Two observations, neither a finding

- **Re-typing a lane's own gap after a refusal leaves the refusal's message showing** (case C, "gap typed 0.05 (its own value)"). The edit is a no-op,
  so the shell returns without a new message, and the message line still shows the previous `PIT_GAP_TOO_SMALL`. The line names the earlier action,
  and the box and the document are right. This is how every no-op edit has always behaved, so it is not this change's.
- **`D.setPitLane` called directly still has no floor.** A says so in both hand-backs. Nothing on the load, import or export path calls the shell's
  `setPitLane`, and that is unchanged.

## Process

- The heavy-run call for my export sweep gave up waiting on pane E's run. E's run was not exclusive, but it counted all of `G:/consonance-scratch`
  as one tree. With no exclusive hold standing (I checked for the hold file), I ran the one sweep process directly at BelowNormal.
- The panel probe ran the same way, after the same check.
- The worktree `G:/consonance-scratch/o-pitgap` is now detached at `7e42f02`, with no edits.

Seat: pane O (sibling-36313935)
