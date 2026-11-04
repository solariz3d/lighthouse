# D522: the grab moves one side only, and stays inside the radius. Librarian, 2026-10-28 15:4x

The keeper, 15:39, on D520 installed (ceebe219…): "very nice, close, but now it should only affect one side of the track, which would be where the mouse is being clicked, not both sides, also, i noticed the rest of the track behind it changed, can we somehow isolate the change so that it doesnt do that?"

## What is on disk (checked at t180 d520-c 4291aed, worktree t180-wt-c519)

**Both sides moved** because D520's follow slides the SECTION WHOLE (l, h) for any press that is not on a rim: C's hand-back §1 "the centre, and partway out with nothing to lift … the section slides whole". Only a rim press keeps the far rim (the chord solve, §2). So a press a third of the way out lifts both edges by the full amount.

**The track behind changed** because the brush's footprint is wider than the press: the Grab's radius is the strip's radius, default 60 m (`app/core/panel.js:422`, floor KNOT_M 20 m), and the brush is widened to at least 3 knot spans and changes control points up to 2 spans beyond the asked window on each side (`src/core/sculpt.js:89-93`, `widened` :104): on 20 m knots a 60 m radius can move 100 m of road each side of the press, across the joint into the piece before (C1 kept). The bank channel does not re-route (`src/geom/path.js:112-115`: phi rotates the section about T; the centreline is untouched), so "behind" is the window, not a re-route. **Sharp** already exists and is the cure: it refines the knots under the brush first (`sculpt.js:182-191`, document.js refineKnots, Boehm) so the brush "acts at the asked radius instead of widening"; it is opt-in because re-quantising moves the track outside the window by up to 70 µm (E's D186 measurement).

**One-sided, with the channels there are:** the edge angles e (left) and er (right) are per side but start at the edge start s ≥ 0.5 of the half-width (`document.js:51` S_MIN 0.5, S_MAX 0.95), and only an edge piece carries them (`:342`, `:518`); so a true one-sided lift of the inner half of a side does not exist in the document today. What does exist exactly: the hinge about the FAR rim (phi + w + h + l, C's rim solve), which keeps the far rim where it is and tilts the far half less and less toward it.

## Decided (tell the keeper, he can veto)

1. **Every off-centre press hinges about the far rim** (C's rim solve, applied at the press's own share, not only at the rim): the pressed point follows the mouse exactly, the far rim does not move at all, the near side moves most. A press within a small centre band (|u| < 0.1) still lifts the whole section (there is no "side" at the centreline). Alt is free; it is not used.
2. **The Grab is sharp by itself**: the follow refines the knots under the press (Sharp's path) so the change stays inside the radius the band shows; the Sharp tick keeps governing the other tools. The band drawn on the road shows the radius USED (radiusUsed), so what he sees is what moves.
3. **The Grab's own radius default is 30 m** (the strip's control still sets it; the wheel and [ ] keys as before); the other tools keep 60. Because a grab is a local push, a bend is not.
4. The hint and the drag's value line say "this side; the far edge stays" and the radius.

If, with this installed, he still wants the far HALF not to move at all (a true one-sided lift of the inner half), that is a new per-side channel in the document (core/6, renderer, validator, export): a prove-it core lap, named here as D523 so he can call it; not started.

## Parts, one pane, C (holds d520-c), check it

Build on d520-c: `app/core/zonegrab.js` follow() (the hinge for every off-centre press; the centre band), `app/core/coreshell.js` beginFollow (sharp on for the follow), `app/core/panel.js` (the Grab's radius default, the band from radiusUsed, the words). Tests: the follow rows amended by name (far rim within 1 cm for presses at u = 0.25, 0.5, 0.75 on flat and 60° banked road; the centre band slides whole; the footprint of a 30 m grab on 20 m knots stays within 30 m + the refined span, measured on the document's control points), zonegrab/handles/core-pieces-ui files only, the skin test. No core change expected (sharp and the rim solve exist); if one is needed C says so and raises to prove it in the small. Install `.before-d522`, sha256, one hand-back; the keeper judges on CRAZY TEST's helix.

surfaced: panel.js:422, sculpt.js:89-93/:104/:182-191, path.js:112-115, document.js:51/:342/:518, p-d520-follow-C §1-§2.
