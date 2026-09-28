# D185 REGISTRATION · AMENDMENT 2: test 3 as the chair ruled for D186, plus the new HILL test (pane B, 2026-09-28, sealed BEFORE any re-score)

**The name, plainly:** the chair's D186 packet calls this "amendment 1 (your §2.4)". An amendment 1 was ALREADY sealed and scored:
- `exo_memory/loop/d185_registration_amendment-1_2026-09-28.md`, sha256 `9344c072…`, sealed 08:43:23;
- run at 08:55, on the D185 code;
- under it test 3 did NOT pass (its negative control failed 2/6), and that result stands in `p-d185-read-B`.

A sealed file is never edited, so the chair's version is THIS file, amendment 2. It supersedes amendment 1 for every future score.
The ORIGINAL seal's verdict (test 3 FAILS as sealed: geometric 19/30, κv rigid 0/6) and amendment 1's result stay on the record,
beside whatever this one scores.

**Amends:** `exo_memory/loop/d185_registration_2026-09-28.md` (sha256 `978be18b…`). Tests 2, 4 and 5 are unchanged. Test 3 keeps
its base track (`gen_tracks.json` track 0), its 30 brushes (5 channels × 25/50/75% × r ∈ {20, 100} m, the same Δ), and its W and
W⁺.
- **W⁺ = W widened by 2 LOCAL knot spans each side**, read from the document being scored. With A's D186 knots it may be narrower
  than before, and it is recorded per brush.
- **To be scored on the D186 code** (E's brush, A's knots) when their hand-backs are in.

## A2-1 · 3a (unchanged from the seal, except κv)
- **Control points** whose support does not meet W: `===`, in every channel.
- **Channel values** at every adapter sample outside W⁺: `===`.
- **φ, w, r brushes:** every sample outside W⁺ has `pos`, `T`, `L`, `U`, `kvec`, `roll`, `bankG` and `grade` all `===`.
- **κh brushes:** upstream `===`; downstream rigid (pairwise distances every 10 m within 1e-6 m).
- **κv brushes (plain κv, not the hill):** upstream `===`; downstream heading unchanged (≤ 1e-12 rad) and pitch = old + ONE constant
  (spread ≤ 1e-12 rad). The gravity frame makes a pitch offset non-rigid; this is amendment 1's A1-2, unchanged.
- **PASS: 30/30.**

## A2-2 · 3b channel C0/C1 (unchanged from the seal)
At s₀ ± r and the W⁺ edges, δ = 1e-4 m:
- value jump < 1e-9·|Δ| beyond the slope;
- one-sided slope jump < 1e-4 × the bump's steepest slope.

**PASS: 30/30.**

## A2-3 · 3b geometric clause on the brush's OWN change, with r = 20 m KEPT IN
- **The measure:** Δκ(s) = κ_new(s) − κ_old(s) on the adapter's samples at 0.5 m (aligned by index), each κ by references/02 §3 at
  0.5 m chords. The steps are stepᵢ = |Δκᵢ − Δκᵢ₋₁|.
- **PASS for a brush:** within ±5 m of each of the four edges (s₀ ± r and the two W⁺ edges), max step ≤ the max step inside
  [s₀ − r/2, s₀ + r/2], + 1e-9 m⁻¹.
- **PASS for the clause: ALL 30 brushes, r = 20 m INCLUDED** (the chair: dropping them would flatter the result). A narrow brush
  that cannot end where it is asked FAILS here, and is named.
- **POSITIVE CONTROL** (no brush, Δκ ≡ 0): must pass 30/30, or the clause is void.
- **NEGATIVE CONTROL, replacing amendment 1's box brush** (which could not fail: a box on a C2 spline is still C2, amendment 1's
  finding):
  - on each of the 12 κh and κv brushes, splice a STEP into the measured Δκ series at the first edge s₀ − r: add
    **10 × that brush's own mid-half max step** to every Δκ sample at s ≥ s₀ − r;
  - **the clause must FAIL on 12 of 12.**
  - Said plainly: this tests the MEASURING CODE, not the core. The document cannot express a kink, so there is no core-made
    negative to use.

## A2-4 · NEW: THE HILL TEST (the librarian's ruling 2): "a hill brush leaves everything past W⁺ bit-for-bit, with NO close needed"
- **The brush:** E's D186 hill brush, whatever its API; the reader records the call.
- **What it asks for:** raise, or lower, the road by Δh at s₀ over radius r, so that the height rises and FALLS back.
- **The cases (12), on base track 0, OPEN, with no close called at any point:** Δh ∈ {+5, −5} m × s₀ at 25/50/75% of the length ×
  r ∈ {20, 100} m. **r = 20 m is kept in.**
- **W and W⁺** as above: W = [s₀ − r, s₀ + r], and W⁺ = W widened by 2 local knot spans of the brushed document.

**PASS for a case, ALL of:**
1. **Upstream:** every adapter sample with s < W⁺'s left edge is `===` in `pos`, `T`, `L`, `U`, `kvec`, `roll`, `bankG` and `grade`.
2. **Downstream:** every adapter sample with s > W⁺'s right edge is `===` in the same eight fields. This is the ruling: bit for bit,
   with no close needed. It is NOT rigid-within-a-tolerance and NOT a constant offset.
3. **It is a hill, not a no-op:**
   - the largest height change inside W, max over samples of (y_new − y_old)·sign(Δh), is ≥ **0.9·|Δh|** and ≤ **1.1·|Δh|**;
   - it occurs within **r/2** of s₀.
4. **It leaves the rest of the channels alone:** the control points of every channel except the one the hill uses are `===`
   everywhere (the reader records which channel that is, e.g. κv).
5. **No kink:** A2-2's C0/C1 rule on that channel, at the four edges.
6. **The adapter's path length** is within 1e-6 m of the base's. Any change in length would shift every downstream sample, and
   rule 2 would fail anyway; this one names the cause.

**PASS for the test:** ALL 12. A case whose API refuses r = 20 m (for example, "brush narrower than 3 knot spans") is scored FAIL
and named. It is not dropped.

## A2-5 · The verdict for test 3 and for the hill test
- **Test 3 PASSES under amendment 2** when A2-1 is 30/30, A2-2 is 30/30 and A2-3 is 30/30, and both controls behave (positive
  30/30, negative 12/12).
- **The hill test PASSES** at 12/12.
- **Each is reported beside the ORIGINAL seal's FAIL and amendment 1's result.**

---
**Sealed by B.** The sha256 and the time are in `exo_memory/handback/p-d186-amend-B_2026-09-28.md`. No re-score has run under this
file at the moment of sealing.
