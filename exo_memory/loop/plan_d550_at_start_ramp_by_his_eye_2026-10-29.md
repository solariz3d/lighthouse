# D550: the "at start" bank ramp, chosen by his eye from rendered candidates. Librarian, 2026-10-29 22:0x

The user, 22:01, on the D540 swell (SWELL_SPREAD 3.4, one Bloss bump, 151 m for 41°): "its still definitely ramping bad on both sides, the gradient does not want to be smooth, without the start its smooth but doesnt bank soon enough, but the other one ramps and just needs more smooth gradient". Three tries by number (D532, D535, D540) have not met his eye. This lap stops guessing: candidates are rendered on HIS piece from HIS camera, side by side on a page, and he picks.

## What his two sentences say about the shape (inferred, the lap tests it)

- "Without the start it's smooth": the whole-piece quintic over 1,000 m has a peak roll of about 0.08 °/m, a tenth of the swell's 0.66. Smooth to his eye means a MUCH lower rate than the checker's bar asks; the bar is irrelevant to the look.
- "But doesn't bank soon enough": the quintic's first fifth is nearly flat.
- "The other one ramps and just needs a smoother gradient": the swell starts within the first 20 m but packs 41° into 150 m.
- So: the roll RATE should come up quickly at the joint (a visible lean within the first 20 to 50 m) and then fade slowly over most of the piece. An ASYMMETRIC ramp: a short rise of the rate, a long fall, over a length near the cap (half the piece), not the roll bar's length.

## Part 1 (pane E, PROVE IT for the shape; pane A for the renders; one page from me)

E adds to extend.js a two-share ramp `rampShape(u, aRise, aFall)`: the rate rises over the first `aRise` of the ramp (Bloss), holds if `aRise + aFall < 1`, and falls over the last `aFall` (Bloss); `roundedLinear(u, a)` is the case aRise = aFall = a, the swell is aRise = aFall = ½, so the existing shapes are unchanged bytes (a test says so). The length rule for an at-start bank becomes `Lt = min(length / 2, max(SPREAD · |Δ| / rate, L_MIN))` with the shape and L_MIN as the candidate says.

**Four candidates on his piece** (1,000 m flat, then 1,000 m with bank −41.38 at start, cup 15.5, width 31; and the 20° and 54° variants in the tables only):

| id | shape | length for 41° | what it tests |
|---|---|---|---|
| A | the current swell, aRise = aFall = ½ | 151 m | the baseline he has |
| B | asymmetric, aRise 0.1, aFall 0.9 | 151 m | the quick rise alone |
| C | asymmetric, aRise 0.1, aFall 0.9 | 500 m (the cap) | quick rise, long fade |
| D | symmetric swell | 500 m (the cap) | long and gentle, slow start |

For each: the bank at 10 / 20 / 50 / 100 / 200 m, the peak roll rate and where, the kink metric (the rate's largest change over 2 m), and the checker's roll read. E hands the shapes and numbers back; A renders each candidate's first 300 m from the camera pose of his two screenshots (`C:\Users\nname\Pictures\Screenshots\still too big of a kink or bump…png` and `…without the at start clicked…png`: the free view looking back along the piece from past the joint; A matches it by eye from the shot, and says the pose it used), the same lighting and look, plus an overhead of the first 500 m with the cross lines, before any of it is installed. I put the four side by side on a page with the numbers under each; he picks one, or says "between B and C", and that one lands.

Tests for the shape (E): rampShape with equal shares equals roundedLinear to 1e-12 (bytes of every existing export unchanged: the nine fixtures 0 of 9, the goldens); the asymmetric ramp is C2 at both ends (the rate 0 and its slope 0 at u = 0 and 1); the bank reaches the target at the ramp's end; monotone; the kink metric per candidate recorded in the hand-back. The ramp harness whole with the new mutants (the rise share dropped; the fall share equal to the rise). The chosen candidate then gets its own rows (the figures on his piece) before C builds.

Falsifier for the lap: if he looks at the four and says none is right, the next move is a live handle (a field "bank over … m" or a drag on the ghost) so he sets the length himself, not a fifth guess by us.

Kept out until he picks: any install. 0.4.31 waits on this: it is the one item he has not yet said yes to.

surfaced: extend.js roundedLinear/roundOf/channelFn, panel.js crossStartM / SWELL_SPREAD, his two screenshots, D535 and D540's probe figures (S/d535/sweep.js, S/d540/his.js).
