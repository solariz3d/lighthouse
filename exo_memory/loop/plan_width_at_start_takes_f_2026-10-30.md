# Width at start takes F, as bank, cup and edge do. Librarian, 2026-10-30 22:2x

The keeper, 22:23, on 0.4.31 with a screenshot (`C:\Users\nname\Pictures\Screenshots\start width.png`: a 1,000 m piece after a 32 m road, width 55 with "start" ticked): "the start should work the same for the width as well, so it gradually comes in instead of like screenshot." The road flares from 32 to 55 m in a short wedge at the joint, then runs straight. F (his 20:31 choice) was applied to bank, cup and edge only (`app/core/panel.js:73-86`, `src/core/extend.js` `startShapes { c, e, er }`); width kept its old at-start ramp.

## The change (pane C, PROVE IT: core geometry; C wrote F's packet 1)

- `startShapes` gains the width channel: a ticked width at start lays F's shape (a 20 m rise as laid, then the fade) over F_RAMP_M = 300 m, capped at half the piece as the others are; no roll bar applies to width, so the ramp is 300 m unless the piece is shorter. Both halves of the road widen symmetrically about the line, as width does today.
- Tests first: his screenshot's case (32 → 55 m at start on a 1,000 m piece) laid with the width's rate of change peaking at 20 m and done by about 235 m, no step at the joint (C1 on the edge rows), the half-widths within 1 cm of F's curve scaled to the 23 m change; a narrowing (55 → 32) the same mirrored; a piece shorter than 80 m takes the swell's halves; nothing ticked byte-equal; the ramp harness whole with one new mutant (width dropped from startShapes).
- Checks that read the width: the pit lane's span, the apron (it follows the edge rows), the AI sides, the checker's footprint: their tests once.
- CHANGELOG, folded into F's line: "A bank, cup, edge or width ticked "at start" now eases in from the piece's first metre and settles over about 235 m."

Branch: off land-0431 (a6af8cf + 492a264). Rides the next release with the apron. Falsifier: on his re-drive or his eye, the flare still reads as a wedge at the joint: then the rise is too short for width and the width's rise is lengthened, not the whole F.

surfaced: panel.js:73-86 (F_RAMP_M, F_RISE_M, startShapeOf, the at-start ramp rule), extend.js startShapes, p-d573-f-default-C (F's rows and tests), the screenshot.
