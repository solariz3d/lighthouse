// usage (from the scratch folder): node ramps.js <checkout> <save> — for each joint whose centre jerk (U or L) is over 2× mid-piece (feel.js): where the peak
// sits from the joint, the two pieces' lengths, and over which metres each piece's own turn (kh) and climb (kv) change (|rate| over 1% of the piece's largest),
// counted from the joint: "before its end" for the piece ending there, "from its start" for the piece starting there
const [R, save] = process.argv.slice(2);
const D = require(R + '/src/core/document.js');
process.argv = [process.argv[0], 'feel.js', R, save, 'x'];
const log = console.log; console.log = () => {}; const rows = require('./feel.js'); console.log = log;
const doc = D.parse(require('fs').readFileSync(save, 'utf8')); let o = 0; const at = {}; doc.pieces.forEach((P) => { at[P.id] = { a: o, P }; o += P.length; });
const ramp = (P, ch, from) => { let m = 0; for (let s = 0; s <= P.length; s += 1) m = Math.max(m, Math.abs(D.channelAt(P, ch, s).d1)); if (m < 1e-9) return '-';
  let s = from ? 0 : P.length; const dir = from ? 1 : -1; while (s >= 0 && s <= P.length && Math.abs(D.channelAt(P, ch, s).d1) < 0.01 * m) s += dir;
  let e = s; while (e >= 0 && e <= P.length && Math.abs(D.channelAt(P, ch, e).d1) >= 0.01 * m) e += dir;
  return from ? `${s.toFixed(0)}-${e.toFixed(0)}` : `${(P.length - s).toFixed(0)}-${(P.length - e).toFixed(0)}`; };
log('joint\tpieces\tU peak from the joint (m)\tL peak (m)\tlengths\tturn: end of the first / start of the second\tclimb: the same');
for (const r of rows) { if (!(r.U.ratio > 2 || r.L.ratio > 2)) continue; const [a, b] = r.pieces.split('|'), off = (x) => (x === null ? '-' : (x - r.joint).toFixed(1));
  log(`${r.joint}\t${r.pieces}\t${off(r.U.at)}\t${off(r.L.at)}\t${at[a].P.length}/${at[b].P.length}\t${ramp(at[a].P, 'kh', false)} / ${ramp(at[b].P, 'kh', true)}\t${ramp(at[a].P, 'kv', false)} / ${ramp(at[b].P, 'kv', true)}`); }
