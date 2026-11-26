# Plan: the two panel gaps from [T3], the jump's landing length and the apron under the pass check (pane O, 2026-11-26)

The chair's order (19:33:41Z): a plan, no code, for each gap. For each: the control he would see, red-first rows, the tier, and every
consumer with file:line. The plan may also say a gap should not be closed. Base: t180 `ceb21f5` (landing-1126), read only. No builder
code was changed. The runs below are local scratch scripts in `G:/consonance-scratch/o-t3-work` (they read another author's track),
named and uncommitted.

## Recommendation

**Close neither gap as a capability.** Writing this plan, I found the app already reaches both. My [T3] hand-back called them panel gaps
only because I searched `app/core/panel.js` and not the rest of `app/`. The hand-back carries the correction (its amendment of ~19:45Z):
**116 of 119 sections made**, and no section of [T3] is blocked by a panel gap.

What is left is smaller, and it is his call:
- **(a)** Nothing worth building for [T3]. A landing-length box would save two clicks and would not make section 100.
- **(b)** One honest change, if any: the `PASS_CLEARANCE` refusal should say that the apron counts and where to change it. The guard
  itself is truthful and should not be loosened.

Confidence: high on both verdicts. Each rests on one measured run per route, listed below. What would change my mind:
- for (a), a second track whose landing section is made with a short landing and missed with the 60 m one plus Delete;
- for (b), a track where a whole-track apron of 1 m is unacceptable (the help line's "a wheel can still drop under" argues against 0) and only a
  per-section apron would serve. That is a stored-data change (a new document field), so it is the keeper's call before any plan.

## (a) The jump's landing length

**The gap as filed.** `jumpHere(doc, extendOpts, { landing, landingM })` takes the landing's length (`src/core/jump.js:55`, default
`LANDING_M = 60`, `:27`). The shell's `jumpFor` never passes it (`app/core/coreshell.js:408`).

**The route the app already has, measured on [T3] section 100.**
- Steps:
  1. Jump.
  2. Click the landing piece on the track. `piecesui.js:176-183` → `shell.selectPiece`.
  3. **Delete selected**. `app/core/piecesui.js:64` → `coreshell.js:1382` `deleteSelection`; at the end of the track it simply goes.
  4. The flight is now the head. The landing boxes still move it: `src/core/jump.js` `landingOf` returns the flight when it is last, and `setLanding` uses it.
  5. Lay road from the flight's end.
- Result: pitch passes on all four routes (G8W, G15, G4W, K4). Position fails by 6.0–6.8 m.
- The core's `landingM` at 8 m and at 20 m gave the same picture: pitch made, 6.3 m of position. Checked, one run each.
- So **a landing-length control changes nothing [T3] can measure.** Section 100's blocker is elsewhere and unnamed. Inferred: the
  measuring across the gap. See the hand-back's amendment.

**Verdict: do not build it for [T3].** If he wants the convenience anyway, here is what it would be:
- **The control he would see:** a seventh box beside the six landing boxes (`app/core/panel.js:1119`, aria `landing length`), in metres,
  default 60. It would be read when Jump is pressed (`panel.js:1115` `jumpHere` → `shell.jump(opts())`).
  - Open question for him: whether typing in it afterwards should re-lay the landing. Today the landing piece is fixed once laid;
    only its pose moves.
- **Red-first rows** (each red at `ceb21f5`, except the guards):
  1. Jump with the length box at 20 lays a landing piece of 20 m (red: 60).
  2. The ghost shown before Jump (`coreshell.js:722` `candidateJump`) has the same 20 m landing (red: 60). Without this row the preview and the
     laid track disagree.
  3. A length of 0, a negative one or a non-number is refused by name (`BAD_LENGTH`, `jump.js:57`), shown through `JW.jumpWords`, and the
     track is unchanged.
  4. Guard, green before and after: with the box untouched, the landing is 60 m and the document is byte for byte the same as today's.
- **Tier: PROVE IT,** as named. Every commit runs the pass-clearance guard (`coreshell.js:480`), and the landing's length changes what that
  guard sees after a jump.
- **Every consumer** of the landing length (grep `landingM|LANDING_M|jumpHere|jumpFor` over `src/`, `app/`, `tools/`; the tests named
  by grep, not read):

| where | what it does with it |
|---|---|
| `src/core/jump.js:27` | `LANDING_M = 60`, the default |
| `src/core/jump.js:55`, `:57`, `:61` | `jumpHere`'s parameter, its `BAD_LENGTH` check, and the landing piece's length |
| `src/core/jump.js:89` | exports `LANDING_M` |
| `app/core/coreshell.js:408` | `jumpFor` calls `jumpHere` without it |
| `app/core/coreshell.js:722` | `candidateJump`, the ghost, through `jumpFor` |
| `app/core/coreshell.js:724` | `jump`, the laid one, through `jumpFor` |
| `app/core/panel.js:1115`, `:1116` | the Jump button and its handler |
| `app/core/panel.js:1283` | the keyboard reply's `jump` |
| `src/core/README.md` | documents it |
| `test/core_jump.test.js`, `test/core_bankswing.test.js`, `test/export_finalscene.test.js`, `app/test/sculpt-wash.test.js` | name `LANDING_M` or `landingM` |

## (b) The apron under the pass check

**The gap as filed.** `PASS_CLEARANCE` (`app/core/coreshell.js:453-475`) counts the track's apron, by default 2 m (`src/export/apron.js:52`),
and I wrote that the panel cannot send `edgeApronM`. **That is wrong.** **Track ▸ Edge apron** sets it:
`app/menubar/items.js:27-40`, a number box 0–10 m (step 0.1, aria `edge apron width in metres`) → `coreshell.js:1166` `setEdgeApron` →
`src/core/document.js:333`, one undo step, saved with the track.

**Measured on [T3] section 102** (the helix), apron typed through that call before laying:

| apron | G8W | G8 | G15 |
|---|---|---|---|
| 0 m | made, worst 0.83 | made, 0.76 | laid, heading 3.1° |
| 1 m | made, 0.83 | made, 0.76 | laid, heading 3.1° |
| 1.5 m | refused `PASS_CLEARANCE` | refused | laid, heading 3.1° |
| 2 m (default) | refused, underside 2.17 m over the road (3.1 needed) | not run | refused, 2.51 m |

**Verdict: do not loosen the guard; it is telling the truth.**
- The export lays the same apron the guard counts: `src/export/fromwords.js:317`, `withApron` with the same `edgeApronM`. The export's own
  clearance read uses the same `apronM` (`fromwords.js:358`).
- A guard that ignored the apron would pass a track whose exported aprons reach into the car's room.
- 1 m still covers the one measured excursion the default was sized for (0.86 m past the edge, the comment at `apron.js:52`). Inferred:
  that one excursion is the only measurement cited there.

**What is honestly missing is the way to it.** The refusal says "the underside of the road at … is 2.17 m over the road at …; a
road over another must keep its underside 3.1 m clear" (`coreshell.js:474-475`). It does not say that the apron is part of that
underside, nor that Track ▸ Edge apron changes it. I found the menu only by grepping for the field. He would have to know it exists.

**If he wants that change:**
- **The control he would see:** none new. The refusal text names the apron width counted and Track ▸ Edge apron. Whether it should do so
  only when a narrower apron would actually clear (a second `passClearance` read at `apronM: 0`) is his call. It would cost one more
  clearance pass on a refusal only.
- **Red-first rows:**
  1. Laying a pass whose aprons alone break the margin (a helix fixture, not [T3]'s data) is refused with a message naming "edge apron
     2.0 m" and "Track ▸ Edge apron" (red: neither is named).
  2. Guard: the same lay after `setEdgeApron(1)` commits. Green today; it pins the route this plan relies on.
  3. Guard: a true clip (road through road) at apron 0 is still refused, and its message does not offer the apron as the fix
     (if the conditional form is chosen).
  4. Guard: the export of row 2's track carries a 1 m apron (`fromwords.js:317`), so the guard and the mesh still agree.
- **Tier: PROVE IT,** as named. The text sits inside the guard's refusal path. The mutation runs that cover `app/core/coreshell.js` and
  `src/validate/passclear.js` at landing.
- **Every consumer** of the apron width (grep `edgeApronM|APRON_WIDTH_M|apronM|setEdgeApron|edgeApron(` over `src/`, `app/`):

| where | what it does with it |
|---|---|
| `src/core/document.js:325-335` | `checkEdgeApron`, `setEdgeApron`; absent means the default |
| `src/core/document.js:470` | `checkDoc` validates it |
| `src/core/document.js:527` | serialised |
| `src/core/document.js:556` | parsed |
| `src/core/document.js:738` | exports `APRON_MAX_M` |
| `src/export/apron.js:52` | `APRON_WIDTH_M = 2.0` |
| `src/export/apron.js:125`, `:504`, `:544` | `apronOf`, `apronCells`: the mesh |
| `src/export/fromwords.js:85`, `:311-317` | the export lays the apron |
| `src/export/fromwords.js:358` | the export's clearance read |
| `src/export/underskin.js:65-69` | `HULL_PLANK_W = 2.0`, a **constant**, not the track's apron: the hull depth under a rising edge always assumes the default plank. `passclear.js` reads the same `hullDepth`, so the guard and the export agree. Worth knowing before anyone ties the hull to the apron setting. |
| `src/validate/passclear.js:36`, `:67-92`, `:102-115` | `sectionOf` draws the apron out to `apronM`; `passClearance` defaults it |
| `src/validate/index.js:451-455` | the validator's pass-clearance reds, at `opts.apronM` |
| `app/core/coreshell.js:453-475` | the guard, before and after an edit; a changed apron alone re-reads |
| `app/core/coreshell.js:1164-1170` | `edgeApron`, `setEdgeApron` |
| `app/core/coreshell.js:1594` | the export options carry it |
| `app/export/export.js:144-146`, `app/export/exportjob.js:55-57` | the export job passes it through |
| `app/validate-ui/panel.js:67-69` | the validate panel's clearance at the track's apron |
| `app/menubar/items.js:27-40`, `app/core/trackmenu.js` | the Track ▸ Edge apron box |
| `app/test/export-apron-setting.test.js`, `app/test/core-trackmenu.test.js`, `app/test/core-mutation.test.js`, `app/test/export-isolated*.test.js` | name it (grep, not read) |

## Not planned here

A **per-section apron**, narrow only where the road passes over itself: a new document field, so a stored-data change. It is the
keeper's call first, and [T3] does not need it (a whole-track 1 m apron made 102).

## Checked or inferred

- **Checked:** every run named above, and every consumer read at the file:line given.
- **Inferred:** what the four test files assert (grepped by name only); that 0.86 m is the only excursion behind the 2 m default; and
  section 100's blocker.
