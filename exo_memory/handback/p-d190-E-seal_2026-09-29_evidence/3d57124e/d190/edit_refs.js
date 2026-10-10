const fs = require('fs'), WT = process.argv[2], R = WT + '/.claude/skills/track-equations/references/';
function rd(f) { let s = fs.readFileSync(R + f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n'); return [s, crlf]; }
function wr(f, s, crlf) { if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(R + f, s); console.log('edited', f, crlf ? '(CRLF)' : '(LF)'); }
// 03 §1b: non-negativity and the convex hull (BEFORE row 2 of the D190 seal leans on it)
{
  const [s0, crlf] = rd('03_bsplines.md'); let s = s0;
  const a = '## §2 The least-squares fit'; if (s.split(a).length !== 2) throw new Error('03 anchor');
  s = s.replace(a, () => String.raw`## §1b Non-negativity and the convex hull (added for the D190 cup, before it was used)

**SOURCED** (WIKI-BSPLINE, section "Computer-aided design and computer graphics", opened 2026-09-29): the basis is non-negative, "at all times each B_{i,n}(x) ≥ 0", and it sums to one, "∑ᵢ B_{i,n}(x) = 1" (§1). Together they make every point of the curve a convex combination of its control points, which is the page's statement that "the curve remains inside the bounding box of the control points".

**So, for one channel:** min over i of P_i ≤ c(s) ≤ max over i of P_i for every s. A guard on the CONTROL POINTS of a channel (the cup: every point in [0, 150]) therefore bounds the whole curve, with no need to sample it. The bound is not tight (a curve can stay well inside its hull), and it does not say where the extremes fall.

**Not used:** the variation-diminishing property (LYCHE-MORKEN, in 10_sculpt_close.md) is a stronger statement about oscillation, and nothing in the cup needs it.

` + a);
  wr('03_bsplines.md', s, crlf);
}
// MATH_SOURCES: the WIKI-BSPLINE row gains the property and the opened date
{
  const [s0, crlf] = rd('MATH_SOURCES.md'); let s = s0;
  const a = 'least-squares fitting, minimising Σ W(x)[y(x) − Σ α_i B_i(x)]². | 03 | secondary |';
  if (s.split(a).length !== 2) throw new Error('MATH_SOURCES anchor');
  s = s.replace(a, () => 'least-squares fitting, minimising Σ W(x)[y(x) − Σ α_i B_i(x)]². Non-negativity "at all times each B_{i,n}(x) ≥ 0" and the convex-hull property ("the curve remains inside the bounding box of the control points"), section "Computer-aided design and computer graphics" (opened 2026-09-29, D190, for 03 §1b). | 03, 03 §1b, 09 §9 | secondary |');
  wr('MATH_SOURCES.md', s, crlf);
}
// 09 §9: the cup
{
  const [s0, crlf] = rd('09_core_channels.md'); let s = s0.replace(/\n*$/, '\n');
  s += String.raw`
## §9 The cup channel c: the cross-section's edge angle (D190)

**The channel.** c(s), in DEGREES, is the angle ψ the road's surface has turned by, measured from the flat floor, at both edges u = ±w/2 (src/geom/profile.js: ψ(u) is the turning angle of the surface by its own arc length u). It is a clamped cubic B-spline in the piece's own s, like every channel, so its joints are C1 (§1) and it blends with the Bloss blend (§2). It is independent of bank φ: the profile is cupped first and then rolled by φ, so the road's centreline, its bank and its pitch do not depend on c (§3's cross-section is the only thing that does).

**The shape rule (a normalisation of MEASURED numbers, not a derived law).** The family's measured floors F = FLOORS[family] (src/geom/fonts.js: bowl [2.7, 8.6, 15.5, 15.5], half-pipe [5.6, 10.8, 14.1, 30.6], flat [0.7, 1.5, 2.3, 3.0] degrees, at AT = [¼, ½, ¾, 1] of the half-width) say where along the half-width the surface rises. A cup piece keeps that character and lets c set the depth: ψ at AT_i is c·F_i / F_edge, on both sides, linear in u between the four quarters, ψ(0) = 0. The edge (i = 4) is therefore exactly c. It is monotone for c ≥ 0 because every FLOORS row is non-decreasing (tested). Source: the FLOORS table and the D190 seal (V3); the rate cap of §3 does NOT apply to a cup piece.

**Legacy pieces are not migrated.** The old rule of §3 caps each quarter's rise at r·w/8, so where the cap binds the SHAPE changes, not only the edge (worst measured quarter difference 4.458° for a 12 m half-pipe, the D190 seal V1). A piece read from a /2 file therefore keeps rendering by §3, unchanged, and is a cup piece only when a cup is set on it. The edge angle a legacy piece renders is the sum of its four quarters' rises, legacyEdgeDeg(family, w, r) = Σᵢ min(Fᵢ − Fᵢ₋₁, r·w/8) (F₀ = 0), and that is what the readout shows for it and where a cup that follows it starts.

**The range [0, 150].** The two walls of a cup meet where the section's lateral extent X(w/2) = 0. Because the whole profile scales with w this angle depends on the family only (measured by the seal, bisection on X): bowl 159.681°, half-pipe 286.48°, flat 180.000°. The bowl is the tightest, since its last quarter is a flat plank. 150° leaves 9.68° to the bowl's touch. A cup outside [0, 150] is refused by name (BAD_CUP). By 03 §1b the curve lies in [min, max] of its control points, so checking the control points binds the curve.

**The fit rings.** The least-squares fit of §2 to a Bloss blend that is flat after its transition overshoots the target, and a control point can pass it by more than the curve does (seal V5: 174.65° for a 150° target over 10 m; measured on the core's own Extend: a 90° target over 40 m of a 200 m piece gives control points up to 99.130° and a curve that peaks at 92.122° before settling at 89.978°). So the Extend that builds a cup piece clamps its control points to [0, 150] after the fit, and the readout reports the DOCUMENT's c, not the typed target. A clamp can leave the curve short of a target at the top of the range: 150° over 20 m of a 60 m piece ends at 144.499° (measured), where the same target over 40 m of a 100 m piece ends at 150.000°.

**Linear in c at a fixed width (used by the adapter).** ψ at each quarter is c times a constant, so two cup profiles A (at c_A) and B (at c_B) of the same width and family satisfy: the blend (1 − x)·ψ_A + x·ψ_B, at matched fractions of the half-width, IS the cup profile at c = (1 − x)c_A + x c_B. src/geom/mesh.js blends a segment's profile from a "from" profile to its own with weight smoothstep((s0 + d)/length) at distance d into the segment, so a segment whose c runs from c₁ to c₂ is reproduced at both ends by choosing s0 and length with smoothstep((s0)/length) = x₁ and smoothstep((s0 + Δ)/length) = x₂ (Δ the segment's length), where x = (c − c_lo)/(c_hi − c_lo). **Inverting the weight (DERIVED):** S(z) = 3z² − 2z³ = y. Put z = ½ − sin φ: then S = ½ − ½·(3 sin φ − 4 sin³φ) = ½ − ½ sin 3φ (the triple-angle identity), so sin 3φ = 1 − 2y and z = ½ − sin(asin(1 − 2y)/3) for y in [0, 1]. The adapter polishes it with two Newton steps. A segment where c falls swaps the two profiles (from B, own A, weight 1 − x): the mesh's sample fractions (blendSamples) are symmetric in its two profiles, so every segment of a run has the same fractions and the boundary rows of two segments coincide (no seam zip).

**Cup then roll (no new formula).** The drivable-side normal of a profile point is n = cos ψ·U − sign(u)·sin ψ·L (src/geom/profile.js) in the gravity-frame station frame that already includes the roll (src/geom/path.js). At φ = +30° (left side up) and c = 60° the left edge's surface is at 60° + 30° = 90° to gravity, the right edge's at 60° − 30° = 30°, the centre's at 30°, by that normal (D190 seal row 6; measured there by a probe).
`;
  wr('09_core_channels.md', s, crlf);
}
