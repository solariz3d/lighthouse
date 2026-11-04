# D532: "at start" ramps are as long as the roll limit needs, not 20 m flat. Librarian, 2026-10-29 10:4x

The user, 10:42, with a screenshot (`C:\Users\nname\Pictures\Screenshots\the rest of the curve after the start at banked is very good just the transition from the straight to the bank is janky as you can see in the screen shot.png`): a 1,000 m piece after a straight, turn −360°, climb −7.22°, bank 20° with "at start" ticked, cup 15, left edge 10° at start, width 34.54. The red circle is the first stretch of the piece, where the surface twists sharply; the rest of the bend "is very good". His words: "you need to somehow keep what it does, but make the transition between pieces a lot more smoother gradient".

## What "at start" is today (checked in t180-fresh 9e6a249)

- `app/core/panel.js:51` `AT_START_M = 20`; `:87` a ticked box sets that channel's `transition` to `min(20, length)`; `:224` the tooltip: "reach this value within the first 20 m of the piece and hold it".
- `src/core/extend.js:18-19, :72-73, :254` the transition 'start' = the first knot span (≤ 20 m). The bank's ramp shape is D521's rounded-linear with `roundOf(Lt) = min(10, Lt/4)` (`extend.js:48-57`): on a 20 m ramp the rounding is 5 m each end, so the plateau rate of a 20° bank is 20/(20 − 5) ≈ 1.3 °/m, and the edge (quintic `smoother`, `C2_CHANNELS`) and the cup go in over the same 20 m.
- The checker's own roll bar (`src/validate/index.js:31-35`): AMBER above 0.9338 °/m, RED above 1.2144 °/m at a 20 m chord. So "at start" with 20° of bank lays a twist the checker marks, and his eye marks.
- The measured swings (D530's finding): a bank of 20° to 50° takes 40 to 120 m to come in on a real road.

## The change (pane E, PROVE IT: core maths; it changes the bytes Extend lays)

**"At start" keeps its meaning: the value is reached early and HELD for the rest of the piece. What changes is "early": as soon as the roll limit allows, never faster.** For the four cross-section channels (phi, c, e, er) a ticked box lays the ramp over

    L_start = clamp( max(AT_START_M, |Δ| / RATE_START), AT_START_M, length / 2 )

with Δ the change from the previous piece's end value to the target (degrees), `RATE_START` = the checker's amber roll rate 0.9338 °/m (one number, one source line, `limits.js` or `validate/index.js` as E finds cleanest; a comment says it is the checker's bar), and the cap at half the piece so the value is still held for at least half of it. Examples: 5° → 20 m (the floor); 20° → 21.4 m; 54° → 57.8 m; 20° on a 30 m piece → 15 m (the cap). Turn, climb and width keep the 20 m "at start" exactly as they are (they are not twists; the user has not asked). The bank's rounded-linear shape and the quintic for c/e/er stay; only Lt changes, so `roundOf` gives the full 10 m rounding on a ramp over 40 m.

- Where: `panel.js` extendOptions (`:87`) computes the per-channel transition from the head's current value and the target (it already has both: `atStart` and `targets`); or `extend.js` takes a transition value `'start'` and derives it, whichever keeps the bytes of every untouched case identical (E's call; the plan prefers panel.js so Close, Finish and every other caller of extend keep their bytes).
- `readout.js:60` `AT_START_M = 20` is the readout's own notion for the corner cell ("turn 0 at start"); unchanged.
- The tooltip at `panel.js:224` says the new rule in plain words: "reach this value as early as the road can roll to it (20 m at least, never faster than the checker's limit) and hold it; off: ease to it over the whole piece".
- CHANGELOG [Unreleased], one line, a player's words.

**Tests first, red before green** (`test/core_extend_at_start.test.js` or the existing extend tests' file, E's call): on a 1,000 m plain straight then a 1,000 m piece with bank 20 at start: the bank reaches 20° (within 0.01°) at the lap distance of the start ramp and holds to the end; the checker's `rollRates` over the piece reads a maximum under 0.9338 °/m (today it does not: that row is the red); the same with 54° reaches 54° at about 58 m, max roll under the bar; 5° reaches at 20 m; a 30 m piece with 20° reaches at 15 m; width at start is byte-identical to today; a piece with no box ticked is byte-identical to today; Close and Finish bytes unchanged (the nine export fixtures: 0 of 9 differ). Mutation: `test/core_ramp_mutation.test.js` whole (it reaches extend.js), with two new mutants (the floor dropped; the rate doubled), applied / caught / not-applied reported. Full suite at landing (the landing pane).

Falsifier for the lap: the user's own screenshot piece, rebuilt with the new ramp, must show no twist line at the joint and must still read "bank 20 at start" in the readout within the first 25 m. If the eye still sees a step where the straight meets the piece, the cause is not the ramp length (then look at the edge and cup ramps' shape, not their length), and the plan is wrong about where the jank lives.

Branch from t180-fresh main 9e6a249 in a worktree; plain commit message, co-author line allowed; no lap ids in new comments. Lands with the D529/D530 batch if it is ready before the user's yes, else the batch after.

surfaced: panel.js:51/:87/:224, extend.js:18-19/:48-57/:72-73/:254, validate/index.js:31-35, readout.js:60, core_ramp_mutation.test.js, plan_d530 (the measured swing lengths).
