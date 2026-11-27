# D678, pane E (D): first pass, REGISTERED BEFORE ANY RUN (written 2026-11-27 16:3xZ, from the order, the packet's Track 1, B's L268 hand-back and the diff e112a14..c2591bf; no probe has run)

Object: `l264-extend-holds-width-b` e112a14 (before) .. c2591bf (after), worktrees `G:\consonance-scratch\e-d678\wt-before`, `wt-after`, detached from origin.

## What c2591bf's CHANGELOG now says (the claims to test)

- C1 the held width is laid as a typed width's short ramp; leaves the head with its value and slope (joint smooth), goes past the head's width the way it was heading, comes back within the first knot span (at most 20 m; the whole piece at 20 m or less).
- C2 how far past: about 1.5 x the head's change per metre, in metres, at about 3.6 m (10 m piece: 0.75 x, at 1.8 m); 1.6 mm after +1.37 at end-5; up to 30 cm after the steepest heads measured (grab +2 at end-10, 0.19 /m).
- C3 within 1 mm by 7 to 14 m into a 100 m piece; on it from three quarters of the span (15 m); nothing past it after.
- C4 the price: after that grab w'' reaches 0.076 /m; after the wide brush (+5 at end-30, r 40) the edge bends about five times as hard as the brush itself bent it.
- C5 a level head lays exactly as before; a typed width still goes where it is typed.
- C6 the bank, cup and edges carry a brush's slope on as before (0.42 deg bank, 0.73 deg cup or edge every 100 m); the app has no right-width brush (Sculpt's brushes refuse it).

## My three L264 NOT CLEAN statements, against these words

- (a) "a few millimetres": replaced by C2. Test: C2's rule and range on heads the app's tools leave.
- (b) "within the first knot span": replaced by C1 + C3. Test: C3 on the same heads and on the new callers.
- (c) the 7.35 cm right width: removed; C6 says the app has no right-width brush. Test: the app's brush AND Sculpt's grab on the right width.

## Positive controls (an instrument that sees nothing proves nothing)

- P1 B's own `ripple268.js` (committed evidence) on wt-before must give B's "before" swings (E1..E8: 3.7, 25.8, 343.5, 560.5, 204.7, 718.3, 446.9, 311.1 mm) and on wt-after B's "after" (1.6, 10.6, 141.4, 230.8, 84.3, 295.7, 184.0, 128.0) to 0.1 mm. If not, stop: the heads are not the same heads.
- P2 my own measure must see the ringing where it exists: on wt-before, E4 Extend as shown must read "over 1 mm until" > 20 m (B: 96.1). A pass on wt-after by an instrument that also passes wt-before is no pass.
- P3 my grab must leave a head still changing (|slope| > 0); a level head would make every "held" row vacuous. Each row records the head's slope; a row whose head is level is reported as such and not counted.
- P4 the right-width brush refusal: the same call on the width ('w') must be accepted, so the refusal is about wd, not about the call.

## Predictions, stated before the run (inferred from reading the code; each to be checked)

- Turn (panel's Turn by), Jump's take-off, Level: they lay the held piece by `extend` with the panel's knotM, so C2/C3 hold as for Extend, numbers within 1% of Extend's from the same head.
- Turn with an extra corner: `solveList` inserts knots after extend (`D.insertKnots`); if that insertion is exact, w is unchanged; prediction: the same w as the plain corner to 1e-9.
- SHARP: `build` passes knotM = min(2, ramp) = 2 m, so startRampM(L1, 2) = 2 m: the held ramp is 2 m, not 20. Prediction: swing about 0.15 x slope (a tenth of C2's), within 1 mm by about 1.4 m, and w'' about ten times Extend's from the same head (about 0.76 /m after the E6 grab). If so, C2 and C4 are Extend's figures and Sharp's held piece is not described by them.
- FINISH: lays its first piece by Turn by or extend, then `closeBanked` may bend the new road's channels (w included) to meet the start. Prediction: unknown; measured, not predicted.

## NOT CLEAN if (any one)

1. A CHANGELOG sentence (C1..C6) is contradicted by a run with the app's own tools (the shell's default brushFn, Sculpt's grab, the panel's extendOptions, the shell's own actions), inside the scope the sentence states.
2. A held piece laid by Turn, Sharp, Jump, Level or Finish from a still-changing head has a joint problem, does not end at the head's width, level (where the piece is the hold's own), or moves a piece already laid.
3. B's published table (§2) or bend ratios (0.13 x to 4.94 x; E6 1.65 x) do not re-derive.

A finding outside a sentence's stated scope (e.g. Sharp, if C2 is scoped to Extend) is reported as a finding with its size, and named as scope, not as a contradiction.
