# The new core: you shape the track as equations, and water shows you whether it flows. A spec for the keeper to read BEFORE anything is built. Librarian, on D, 2026-09-28 05:4x.

*Written for the keeper's vision, in his words: "an intuitive and ingenious track builder for t-180s … it would make lots
and lots of people happy."*

## What you do in it (the whole experience, first build)

1. **Start.** You get a flat loop, a plain circle of road, like a lump of clay. Or you open an example: a real track's
   equation from your own PC (Serpents, Thunderhead…), kept local.
2. **Extend.** At the open end (the build head, same camera as now), you push forward and the road CONTINUES the way it
   was going:
   - straight stays straight;
   - a curve keeps curving;
   - a spiral keeps tightening;
   - climb and bank carry on too.

   You steer it with a few handles (turn harder or softer, climb, bank) and let go when the curve is done.
3. **Sculpt.** Anywhere on the track, you grab and drag with a soft brush: push a hill up, bank a corner harder, widen a
   stretch, deepen the bowl.
   - The brush has a size (how many metres it affects) and fades at its edges, so there are never kinks.
   - Everything around the brush stays joined and smooth.
4. **Close the loop.** One click. The track closes exactly, with the fix spread invisibly over the parts you did not just
   touch.
5. **Pour water.** Turn on the water at your design speed. A sheet of streams runs down the track, riding the surface the
   way a T-180 would with no steering. You SEE:
   - where it rides up the walls;
   - where it bunches into one line;
   - where it fans out;
   - and in RED, where it spills over the lip, lifts off, or crosses itself.

   Fix the red by sculpting, and watch the water change.
6. **Export.** Same as now: a working AC track folder.

## How it works underneath (so the panes build the right thing)

- **The track IS a short list of numbers:** piecewise equations (D184's engine).
  - Each piece is a smooth spline in distance s for position, bank, width and the cross-section's rise.
  - Pieces join with matching position, direction and curvature.
  - Jumps are pieces joined by a flight arc.
- **Extend** = add a piece whose functions start with the end value and slope of the last piece (a continuation), shaped
  by your handles.
- **Sculpt** = add a smooth bump, fading to zero at the brush edges, to one function over the brush window, then re-join.
  It is local by construction.
- **Close** = the exact-closure solve from D184.
- **The cross-section's shape** comes from the measured rise-rate law (C's finding: "a rim rises at a rate, not to an
  angle"). That is kept as data, not as the old font system.
- **Water** = many frictionless particles on the surface at design speed (the validated method: one streamline predicts
  a water slide's flow).
- **Reused from the current app:** the window, the cameras, export and install. Not reused: pieces, fonts, the palette
  (paused, "not yet", at the keeper's word).

## How we know it works, before you ever touch it (registered now)

1. **Round trip:** load Serpents' and Thunderhead's equations, export, read back. The same track within 5 m / 5°.
2. **Extend:** a continued circle stays a circle (radius error < 1%); a continued clothoid stays a clothoid.
3. **Sculpt:** a brush leaves everything outside its window unchanged, bit for bit, and never makes a kink (curvature
   continuous across the brush edge).
4. **Close:** closure error < 1 cm after one click, on 20 random tracks.
5. **Water:** on a flat banked circle at its balanced speed, the water rides one height and never spills (the textbook
   case). On a deliberately too-shallow bank, it spills where theory says it will.
6. **Speed:** extend and sculpt stay under 50 ms per step on a 40 km track.

**Then the real test is yours:** you build a track in it. If it does not feel right, what you say becomes the next
thing we fix.

## Build order (one step at a time, each proven before the next)

- **(a)** D184's engine: reading tracks into equations and back, exactly.
- **(b)** The core model: extend, sculpt, close, with tests 2–4.
- **(c)** Water, with test 5.
- **(d)** Wiring it into the app: build head, brush on the preview, water drawn live, export, with tests 1 and 6.
- **(e)** A small, real build for you to try.
