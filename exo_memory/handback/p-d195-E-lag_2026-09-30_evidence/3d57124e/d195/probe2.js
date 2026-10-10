// ramp of R metres then hold, piece length L: extra knots at R*j/q inside the ramp (and the even knots elsewhere): the fit's overshoot past the target and past the start, and |fit - ideal|
const T = process.argv[2] + '/';
const D = require(T + 'src/core/document.js'), { channelFn } = require(T + 'src/core/extend.js');
function knotsFor(L, R, q) {
  const even = D.evenKnots(L), ramp = []; for (let j = 1; j <= q; j++) ramp.push((R * j) / q);
  const keep = even.filter((k) => ramp.every((r) => Math.abs(r - k) > R / (2 * q)) );
  const all = [...ramp, ...keep].filter((k) => k > 0.5 && k < L - 0.5).sort((a, b) => a - b);
  return [...new Set(all.map((k) => +k.toFixed(4)))];
}
const out = [];
for (const [L, w0, w1] of [[100, 31, 12], [100, 12, 31], [60, 20, 8], [30, 31, 12]]) for (const R of [20, 10, 5]) {
  if (R >= L) continue;
  for (const q of [0, 1, 2, 3, 4, 6, 8]) {
    const K = q === 0 ? D.evenKnots(L) : knotsFor(L, R, q), f = channelFn({ v: w0, m: 0 }, w1, R);
    const P = D.roadPiece({ length: L, family: 'bowl', from: null, knots: K, channels: Object.fromEntries(D.CHANNELS.map((ch) => [ch, ch === 'w' ? f : () => 0])) });
    let pastTarget = 0, pastStart = 0, err = 0; const dec = w1 < w0;
    for (let s = 0; s <= L + 1e-9; s += 0.1) { const v = D.channelAt(P, 'w', s).v; pastTarget = Math.max(pastTarget, dec ? w1 - v : v - w1); pastStart = Math.max(pastStart, dec ? v - w0 : w0 - v); err = Math.max(err, Math.abs(v - f(s))); }
    const cp = P.channels.w, lo = Math.min(w0, w1), hi = Math.max(w0, w1), cpOut = Math.max(0, Math.max(...cp) - hi, lo - Math.min(...cp));
    out.push(`L ${L} ${w0}->${w1} R ${R} q ${q} (${K.length} knots) | past target ${pastTarget.toFixed(3)} past start ${pastStart.toFixed(3)} | max|fit-ideal| ${err.toFixed(3)} | control pts outside [lo,hi] by ${cpOut.toFixed(3)}`);
  }
}
console.log(out.join('\n'));
