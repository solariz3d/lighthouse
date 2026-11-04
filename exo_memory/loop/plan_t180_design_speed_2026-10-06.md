# T-180: the design-speed "off" box vanishes; and should the check always run at max speed? Librarian, on D, 2026-10-06 13:0x. Lap D256.

The keeper, 12:56: "when I click the off box below design speed, it disapears and cannot be turned back on? … the design speed option is
weird, shouldnt it ideally always be the max speed so the track can support the most load even slower ones? In other words, it shoudl
always be maxed out".

## What exists (read at t180 `64fa6cf`, `app/validate-ui/speed.js`, `app/validate-ui/index.js:74-85`)
- A slider 50–970 km/h (970 = `MACH6.vmaxKmh`, the lap sim's cap), default 460 (`MACH6.designSpeedKmh`, the median of seven clean Mach 6
  laps), and an "off" box (off = no design speed: loads only from the closed lap's own ghost lap). It also sizes jump ramps (D179).
- The vanishing box: not yet reproduced. Inferred: something re-renders the validation panel's row on the off toggle (the picker row is
  mounted once by `mountSpeedPicker(speedRow, picker)`).

## The physics, so the ruling is honest
- **Loads rise with speed** (g ≈ v²/r in a turn or a dip), so checking at 970 is the STRICTEST test for "the road crushes the car".
- **But some checks get harder SLOWER:** a wall-ride, a tube's roof and a loop need ENOUGH speed for the car to stay on the surface, and a
  jump's landing is sized for a speed. A track checked only at max can be red-free and still drop a slower car off its tube roof.
- So "always maxed" is the right default for loads, and the slow end still needs checking where the road leans past vertical.

## The lap (two owners, in parallel)
1. **B (FEEL, folded into D255): fix the vanishing off box.** Reproduce in a row first, then fix so it toggles back on.
2. **E (validation, measure FIRST, nothing changed yet):** on copies of the keeper's tracks (TEST 1 recovered, the tube oval, the cup
   oval) and the fixtures F1–F9: the reds and ambers at 460, at 970, and with the closed lap's own ghost-lap speeds. Report per track:
   which reds appear only at 970, and whether the minimum-speed checks (surface adhesion on walls/roofs) exist today and at what speed.
   Then propose: (a) the slider replaced by a fixed full-speed load check, plus (b) a minimum-speed adhesion check on parts past vertical,
   plus (c) the closed lap's ghost-lap speeds when there is a loop. Registered before the run: if 970 turns more than half of the keeper's
   currently-green track pieces red, the proposal must say so plainly, because "always max" would then refuse most of what he builds.
- The keeper decides after the numbers. Nothing in the checker changes in this lap.

NEXT: chair pass item 1 to B with D255, and dispatch item 2 to E, when this plan is read

## The keeper's decision (13:2x), on E's measurement (`loop/design_speed_measure_2026-10-06.md`): ALL THREE
1. **Always max:** the slider (and its off box) goes; the panel checks loads at 970 (`MACH6.vmaxKmh`), as the export already does; on a
   closed loop the panel uses the ghost lap, so panel and export never disagree. (This replaces B's off-box fix: there is no box.)
2. **Centreline lift-off on OPEN tracks too** (`leaves-surface` beyond the closed lap's proof), at full speed. Expected new reds: TEST 1
   recovered p7, p9, p31, p32 (lift off already at 460), TEST p3.
3. **"holds above N km/h"** on centreline stations facing down (`sqrt(−B/A)`), as information; red only where no speed holds.
- Also: the D179 comment in `app/validate-ui/index.js` (the slider sizes jump ramps) is false for the equation core; correct it.
Owner E (validation; EXPORT tier, since export semantics change for open-track lift-off in the TEST export's warning list). Red rows first;
targeted tests; the librarian runs the validate/export harnesses once at install.
