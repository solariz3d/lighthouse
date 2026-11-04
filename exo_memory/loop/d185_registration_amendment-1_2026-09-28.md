# D185 REGISTRATION · AMENDMENT 1: test 3 (Sculpt), two clauses re-registered (pane B, 2026-09-28, sealed BEFORE its re-run)

**Amends:** `exo_memory/loop/d185_registration_2026-09-28.md` (sha256 `978be18b…`). Tests 2, 4 and 5 are unchanged, and so are test 3's
brushes, its base track, its W and W⁺, its control-point and channel-value clauses, and its C0/C1 clause.

**Why:** both clauses below FAILED as sealed. The failures are scored and recorded as such (`p-d185-read-B` §2; the verdict under
the original seal stands and is not re-scored), and each was traced to the registration, not to the code:
1. **The geometric no-kink clause FAILS WITH NO BRUSH on 20 of 30 cases** (found by E, `p-d185-sculpt-close-E` §3.1; confirmed by
   B). On a curving base, the κ-sample step measures the base's own curvature slope, so the clause scores where the window sits,
   not the brush.
2. **The κv "downstream moved rigidly" clause is wrong for the builder's gravity frame** (found by B). A constant pitch offset is
   not a rigid motion of a curving track when T = (cos p sin θ, sin p, cos p cos θ) (references/02 §2).
   - `kv_diag.js` (a falsifier registered before it ran) measured, on the 6 κv brushes: heading unchanged to 4.4e-16 rad, and
     pitch = old + one constant, to a spread of 8e-16 rad.

Both corrections were found by looking at results. That is why they are a NEW sealed file, with a NEGATIVE CONTROL that shows the
new clause can fail, and not an edit.

## A1-1 · 3b geometric clause, RE-REGISTERED: measured on the brush's own change
- **The measure:** on the adapter's samples at 0.5 m (aligned by index; the sculpt does not change the path length), Δκ(s) =
  κ_new(s) − κ_old(s), each κ by references/02 §3 at 0.5 m chords.
- **The steps:** stepᵢ = |Δκᵢ − Δκᵢ₋₁|.
- **PASS for a brush:** within ±5 m of EACH of the four sealed edges (s₀ − r, s₀ + r, and the two W⁺ edges), max step ≤ max step
  inside W's middle half [s₀ − r/2, s₀ + r/2], **plus 1e-9 m⁻¹** (so a brush that is exactly zero at an edge band is not failed by
  float noise).
- **THE POSITIVE CONTROL** (it must PASS, or the clause is void): the same rule with NO brush (Δκ ≡ 0) passes on all 30 windows.
- **THE NEGATIVE CONTROL** (it must FAIL, or the clause has no teeth): a BOX brush on the same channel, with the same Δ, added to
  every control point whose support meets W, with NO falloff. It is built directly on the document's control points, on the 6
  κh and κv brushes at r = 100. The clause must FAIL on at least 5 of those 6.
- **THE NARROW-BRUSH LIMIT, stated before the run** (the chair's ruling: a real, known limit; knot insertion is a follow-up):
  - A's knots are ≤ 20 m apart, and E's brush widens anything narrower than 3 spans. So an r = 20 m brush cannot end at s₀ ± 20, and
    those edges fall on its flanks.
  - **PREDICTION (E §3.2):** the r = 20 m brushes on κh at 25% and 75%, and on κv at 25%, miss this clause.
  - **Scoring:** the r = 100 m brushes (15) must ALL pass. The r = 20 m brushes (15) are scored and REPORTED against the prediction.
    A miss outside the predicted three is a FAIL. A predicted miss is the known limit, not a pass.

## A1-2 · 3a for κv brushes, RE-REGISTERED
- **Replaces** "the samples AFTER W⁺ are the old ones moved rigidly" for κv brushes only.
- **The measure:** for every adapter sample after W⁺ (aligned by index), the heading θ = atan2(Tx, Tz) and the pitch p = asin(Ty).
- **PASS:**
  - max |θ_new − θ_old| ≤ **1e-12 rad**;
  - max(p_new − p_old) − min(p_new − p_old) ≤ **1e-12 rad** (one constant pitch offset);
  - upstream samples `===`, as sealed.
- **κh brushes keep the rigid clause** (pairwise distances within 1e-6 m). That is a rotation about world up, and it IS rigid.

## A1-3 · The verdict rule for test 3 under this amendment
Test 3 PASSES when all of these hold:
- the sealed clauses that are unchanged (control points and channel values `===` outside, φ/w/r samples `===`, κh rigid, C0/C1)
  hold on all 30;
- A1-2 holds on all 6 κv brushes;
- A1-1 holds on all 15 r = 100 brushes, and on every r = 20 brush except the three predicted;
- both controls behave as stated (the positive passes 30/30; the negative fails on ≥ 5 of 6).

A predicted narrow-brush miss is reported as THE KNOWN LIMIT beside the verdict.

---
**Sealed by B** before its re-run. The sha256 and the time are in `exo_memory/handback/p-d185-read-B_2026-09-28.md` (section
AMENDMENT 1). The original seal's verdict on test 3 (FAIL as sealed) stands in the record.
