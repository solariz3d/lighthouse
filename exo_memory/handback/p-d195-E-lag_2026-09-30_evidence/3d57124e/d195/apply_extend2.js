const fs = require('fs'); const f = 'C:/Users/nname/Desktop/a-d195-wt/src/core/extend.js';
let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const i = s.indexOf('/**\n * A short ramp is a step in the second derivative'), j = s.indexOf('function extend(doc,'); if (i < 0 || j < 0) throw new Error('anchors');
s = s.slice(0, i) + `/**
 * A short ramp cannot be LEAST-SQUARES fitted by a cubic spline with knots every ~20 m: the Bloss blend has zero slope at both ends but its curvature jumps,
 * which the fit follows by ringing. Measured (D195, probe1/2) on w 31 → 12 over a 100 m piece: a 20 m ramp fits to 1.5 m off the ideal, overshoots the target
 * by 1.05 m and puts control points 5.1 m outside the range; a 10 m or 5 m ramp is worse; extra knots shrink it (0.28 m past the target at 4 subdivisions) but never
 * remove it; and the fitted hold is not flat (still 0.35 m off the target at twice the ramp). So a channel with a short ramp is NOT fitted: its control points
 * are the ideal ramp read at the Greville abscissae ξᵢ = (uᵢ₊₁ + uᵢ₊₂ + uᵢ₊₃)/3 (ref 03 §1, WIKI-BSPLINE, the quasi-interpolant: exact for a constant or a line).
 * A monotone ramp gives monotone control points, and a spline with monotone control points is monotone (variation-diminishing) and lies in the convex hull of
 * its control points (ref 03 §1b): it cannot overshoot its start or its target and cannot ring. The price is a slightly smoothed ramp (measured in the tests).
 * The piece gets RAMP_KNOTS subdivisions of the ramp as extra knots, so the smoothing is a few tenths of the change and not more, and the ideal ramp is
 * compressed to R − 2 subdivisions (R/2 at 4) because the curve at s depends on points up to about 2 subdivisions ahead: the CURVE then reaches its target by
 * R and holds it exactly afterwards (the control points from ξ ≥ R/2 ARE the target).
 */
const RAMP_KNOTS = 4;
function rampKnots(length, ramps, knotM) {
  const extra = []; for (const R of new Set(ramps)) for (let j = 1; j <= RAMP_KNOTS; j++) extra.push((R * j) / RAMP_KNOTS);
  const gap = Math.min(...ramps) / (2 * RAMP_KNOTS), keep = D.evenKnots(length, knotM).filter((k) => extra.every((e) => Math.abs(e - k) > gap));
  const all = [...extra, ...keep].filter((k) => k > 0.5 && k < length - 0.5).map((k) => +k.toFixed(4)).sort((a, b) => a - b);
  return all.filter((k, i) => i === 0 || k - all[i - 1] > 1e-6);
}
/**
 * Overwrite the free control points of channel \`ch\` (all but a joint's first two, which carry the continued value and slope, so the joint stays C1) with the
 * ideal ramp at the Greville abscissae, clamped into the range the start value, the target and those two points span (a no-op for a monotone ramp; the continued
 * slope of the joint may legitimately carry the first two points past the range and they are not touched).
 */
function rampControl(piece, ch, from, target, R, held) {
  const P = piece.channels[ch], U = D.knotVector(piece), free = held ? 2 : 0, dec = D.DEC[ch];
  const f = channelFn(from, target, Math.max(R - (2 * R) / RAMP_KNOTS, R / RAMP_KNOTS));
  let lo = Math.min(from.v, target), hi = Math.max(from.v, target); for (let i = 0; i < free; i++) { lo = Math.min(lo, P[i]); hi = Math.max(hi, P[i]); }
  for (let i = free; i < P.length; i++) {
    const xi = (U[i + 1] + U[i + 2] + U[i + 3]) / 3, v = Math.min(hi, Math.max(lo, f(xi)));
    P[i] = Number(v.toFixed(dec)) + 0;
  }
}

` + s.slice(j);
s = s.replace("  for (const ch of shortRamps) clampRamp(piece, ch, from[ch].v, targets[ch], ramp[ch], held);\n", "  for (const ch of shortRamps) rampControl(piece, ch, from[ch], targets[ch], ramp[ch], held);   // not fitted: see rampControl\n");
s = s.replace("See rampKnots and clampRamp for how the fit is kept from ringing.", "See rampKnots and rampControl for how a short ramp is kept from ringing.");
if (s.includes('clampRamp')) throw new Error('clampRamp left');
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s); console.log('extend.js patched (2)');
