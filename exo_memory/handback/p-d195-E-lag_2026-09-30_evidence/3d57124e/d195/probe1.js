// how much does the LS fit ring for a Bloss ramp of R metres then a hold, on a piece of length L (knots every ~20 m)?  node probe1.js <tree>
const T = process.argv[2] + '/';
const D = require(T + 'src/core/document.js'), { channelFn } = require(T + 'src/core/extend.js');
const rows = [];
for (const [L, w0, w1] of [[100, 31, 12], [100, 12, 31], [45, 31, 12], [60, 20, 8], [30, 31, 12], [25, 31, 12]]) {
  const K = D.evenKnots(L), span = K.length ? K[0] : L;
  for (const [label, R] of [['0.5 span', span / 2], ['0.75 span', span * 0.75], ['1 span', span], ['1.5 span', span * 1.5], ['2 span', span * 2], ['whole piece', L]]) {
    if (R > L + 1e-9) continue;
    const from = { v: w0, m: 0 }, f = channelFn(from, w1, R), P = D.roadPiece({ length: L, family: 'bowl', from: null, channels: Object.fromEntries(D.CHANNELS.map((ch) => [ch, ch === 'w' ? f : (s) => 0])) });
    // an empty-start piece has no held start; evaluate the curve
    let over = 0, under = 0, err = 0; const lo = Math.min(w0, w1), hi = Math.max(w0, w1);
    for (let s = 0; s <= L + 1e-9; s += 0.25) { const v = D.channelAt(P, 'w', s).v, ideal = f(s); over = Math.max(over, v - hi); under = Math.max(under, lo - v); err = Math.max(err, Math.abs(v - ideal)); }
    const cp = P.channels.w, cpOver = Math.max(0, Math.max(...cp) - hi), cpUnder = Math.max(0, lo - Math.min(...cp));
    rows.push(`L ${L} w ${w0}->${w1} | R ${R.toFixed(1)} (${label}, span ${span.toFixed(1)}) | curve over ${over.toFixed(3)} under ${under.toFixed(3)} | max |fit-ideal| ${err.toFixed(3)} | control pts over ${cpOver.toFixed(3)} under ${cpUnder.toFixed(3)}`);
  }
}
console.log(rows.join('\n'));
