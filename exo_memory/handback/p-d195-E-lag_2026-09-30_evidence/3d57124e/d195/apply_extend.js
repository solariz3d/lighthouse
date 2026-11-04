const fs = require('fs'); const f = 'C:/Users/nname/Desktop/a-d195-wt/src/core/extend.js';
let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
function rep(a, b) { if (s.split(a).length !== 2) throw new Error('anchor: ' + a.slice(0, 80)); s = s.replace(a, () => b); }

rep("//   extend(doc, { length, transition, targets: { kh, kv, phi, w, r, c }, family, knotM })  -> a new document, one piece longer\n",
"//   extend(doc, { length, transition, targets: { kh, kv, phi, w, r, c }, family, knotM })  -> a new document, one piece longer\n//\n// `transition` is a number (metres, one for every channel, as ever) OR a per-channel map { w: 20, phi: 'start', … } (D194b): a channel missing from the\n// map uses the piece's length; a value 'start' is the SHORT RAMP AT THE START, startRampM(length, knotM) = the first knot span (≤ 20 m, or the whole\n// piece if shorter). A channel with a short ramp reaches its target inside it and HOLDS it for the rest of the piece (the whole piece at the new width,\n// with no jump: a later piece's joint is C1). See rampKnots and clampRamp for how the fit is kept from ringing.\n");

rep("function extend(doc, { length, transition, targets = {}, family, knotM, first } = {}) {",
`/** The ramp 'start' means: the first knot span of a piece of this length, at most KNOT_M (20 m); the whole piece when it is shorter than that. */
function startRampM(length, knotM) { const K = D.evenKnots(length, knotM); return K.length ? K[0] : length; }

/**
 * A short ramp is a step in the second derivative at its end (the Bloss blend has zero slope at both ends but its curvature jumps), which a cubic
 * spline with knots every ~20 m cannot follow: measured (D195, probe2) on w 31 → 12 over a 100 m piece, a 20 m ramp fits to 1.5 m off the ideal and overshoots
 * the target by 1.05 m, with control points 5.1 m outside the range; 10 m and 5 m ramps are worse. So a piece with a short ramp gets EXTRA KNOTS inside
 * the ramp, RAMP_KNOTS subdivisions of it (measured: 0.28 m past the target at 4 subdivisions of a 20 m ramp, 0.12 at 6, 0.07 at 8; 4 keeps the piece
 * to a few more control points), and the even knots that would sit within half a subdivision of one are dropped.
 */
const RAMP_KNOTS = 4;
function rampKnots(length, ramps, knotM) {
  const extra = []; for (const R of new Set(ramps)) for (let j = 1; j <= RAMP_KNOTS; j++) extra.push((R * j) / RAMP_KNOTS);
  const gap = Math.min(...ramps) / (2 * RAMP_KNOTS), keep = D.evenKnots(length, knotM).filter((k) => extra.every((e) => Math.abs(e - k) > gap));
  const all = [...extra, ...keep].filter((k) => k > 0.5 && k < length - 0.5).map((k) => +k.toFixed(4)).sort((a, b) => a - b);
  return all.filter((k, i) => i === 0 || k - all[i - 1] > 1e-6);
}
/**
 * The ramped channel stays between its start and its target (D190 V5's move, for every channel that takes a short ramp): a B-spline curve lies in the convex
 * hull of its control points (ref 03 §1b, WIKI-BSPLINE), so every free control point is clamped into [lo, hi] = the range of the start value, the target and the
 * two held start points (a joint's continued slope may legitimately carry the first two past the range; they are not touched), and the curve cannot overshoot.
 * Then every control point whose basis starts at or after the ramp's end IS the target, so the hold is exact from the first knot after the ramp.
 */
function clampRamp(piece, ch, v0, target, R, held) {
  const P = piece.channels[ch], U = D.knotVector(piece), free = held ? 2 : 0;
  let lo = Math.min(v0, target), hi = Math.max(v0, target); for (let i = 0; i < free; i++) { lo = Math.min(lo, P[i]); hi = Math.max(hi, P[i]); }
  for (let i = free; i < P.length; i++) P[i] = U[i] >= R - 1e-9 ? target : Math.min(hi, Math.max(lo, P[i]));
}

function extend(doc, { length, transition, targets = {}, family, knotM, first } = {}) {`);

rep("  const Lt = transition === undefined ? length : transition;\n  if (!(Lt > 0 && Lt <= length)) throw new D.CoreError('BAD_TRANSITION', `the transition must be in (0, length], got ${Lt}`);\n",
`  // one ramp length per channel: a number is the same for all (as before); a map gives some channels their own, the rest use the piece's length
  const perChannel = transition !== null && typeof transition === 'object' && !Array.isArray(transition), ramp = {};
  if (perChannel) {
    for (const [ch, v] of Object.entries(transition)) {
      if (!D.CHANNELS.includes(ch)) throw new D.CoreError('BAD_TRANSITION', \`the transition map has no channel "\${ch}" (known: \${D.CHANNELS.join(', ')})\`);
      const R = v === 'start' ? startRampM(length, knotM) : v;
      if (!(Number.isFinite(R) && R > 0 && R <= length)) throw new D.CoreError('BAD_TRANSITION', \`the transition of \${ch} must be in (0, length] or 'start', got \${v}\`);
      ramp[ch] = R;
    }
  } else {
    const Lt = transition === undefined ? length : transition;
    if (!(Lt > 0 && Lt <= length)) throw new D.CoreError('BAD_TRANSITION', \`the transition must be in (0, length], got \${Lt}\`);
  }
  const Lof = (ch) => (perChannel ? (ramp[ch] === undefined ? length : ramp[ch]) : transition === undefined ? length : transition);
  const shortRamps = Object.keys(ramp).filter((ch) => ramp[ch] < length - 1e-9 && targets[ch] !== undefined && targets[ch] !== null);
`);

rep("  const channels = Object.fromEntries(D.CHANNELS.map((ch) => [ch, channelFn(from[ch], targets[ch], Lt)]));\n  const piece = D.roadPiece({ length, family: fam, from: held ? from : null, channels, knotM, cup });\n",
`  const channels = Object.fromEntries(D.CHANNELS.map((ch) => [ch, channelFn(from[ch], targets[ch], Lof(ch))]));
  const knots = shortRamps.length ? rampKnots(length, shortRamps.map((ch) => ramp[ch]), knotM) : undefined;   // extra knots only where a ramp is short
  const piece = D.roadPiece({ length, family: fam, from: held ? from : null, channels, knotM, knots, cup });
  for (const ch of shortRamps) clampRamp(piece, ch, from[ch].v, targets[ch], ramp[ch], held);
`);
rep("module.exports = { extend, channelFn, bloss };", "module.exports = { extend, channelFn, bloss, startRampM, rampKnots, RAMP_KNOTS };");
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s); console.log('extend.js patched');
