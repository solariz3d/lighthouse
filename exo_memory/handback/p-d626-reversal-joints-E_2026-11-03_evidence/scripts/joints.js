// usage: node joints.js <checkout> <save> [label]
// Joint by joint, as BUILT (src/core/adapter.js toPath, the centre line every 0.5 m): what a car on the centre and on a wheel 10 m out feels per v², and how
// fast that changes (jerk per v³), at each joint against the same piece's own middle. For the centre: the path's curvature vector kvec split along the road's U
// (vertical) and L (lateral); for the wheel 10 m out: the same plus the roll's own share, 10 · φ'' along U. Each is read within 15 m of the joint and, for the
// piece's own spread, over its interior (all but 30 m at each end: the largest |jerk| there). A joint "reads like mid-piece" when its acceleration has no step (the jump
// across 2 m is no bigger than the interior's largest × 1.5) and its jerk stays within the larger interior's largest × 1.5 (or under 1e-6 /m², flat).
// Also per field (kh, kv, phi, c, w): the document's rate at the joint and the larger piece's mid-piece |rate| (does the field's rate drop to 0 at the joint?).
'use strict';
const fs = require('fs'), path = require('path');
const [R, save, label = ''] = process.argv.slice(2);
const D = require(path.join(R, 'src/core/document.js')), A = require(path.join(R, 'src/core/adapter.js'));
const doc = D.parse(fs.readFileSync(save, 'utf8'));
const S = A.toPath(doc).path.samples.map((x) => ({ s: x.s, kvec: x.kvec.slice(), U: x.U.slice(), L: x.L.slice(), roll: x.roll }));
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const N = S.length, ds = S[1].s - S[0].s;
const aU = S.map((x) => dot(x.kvec, x.U)), aL = S.map((x) => dot(x.kvec, x.L));
const rollAcc = S.map((x, i) => (i > 0 && i < N - 1 ? (S[i + 1].roll - 2 * x.roll + S[i - 1].roll) / (ds * ds) : 0));
const wU = aU.map((v, i) => v + 10 * rollAcc[i]);   // a wheel 10 m out on the raised side: the roll's acceleration adds along U
const jerk = (a) => a.map((v, i) => (i > 1 && i < N - 2 ? (a[i + 2] - a[i - 2]) / (4 * ds) : 0));
const ch = { centreU: aU, centreL: aL, wheelU: wU };
const J = {}; for (const k of Object.keys(ch)) J[k] = jerk(ch[k]);
const idx = (s) => Math.max(0, Math.min(N - 1, Math.round(s / ds)));
const pct = (a, p) => { const t = [...a].sort((x, y) => x - y); return t.length ? t[Math.min(t.length - 1, Math.floor(p * (t.length - 1)))] : 0; };
let o = 0; const pieces = doc.pieces.map((P) => { const r = { P, a: o, b: o + P.length }; o += P.length; return r; });
console.log(label);
const rows = [];
for (let k = 0; k + 1 < pieces.length; k++) {
  const A_ = pieces[k], B_ = pieces[k + 1]; if (A_.P.type !== 'road' || B_.P.type !== 'road') continue;
  const j = A_.b, mid = (p) => [idx(p.a + p.P.length / 4), idx(p.b - p.P.length / 4)];
  const out = { joint: Math.round(j), pieces: `${A_.P.id}|${B_.P.id}` };
  let ok = true;
  for (const key of Object.keys(ch)) {
    const a = ch[key], jj = J[key];
    // the piece's own interior: all of it but 30 m at each end, so a joint is held to what the piece's own bank and turn changes already do inside it
    const spread = (p) => { const i0 = idx(p.a + 30), i1 = idx(p.b - 30); const js = [], steps = []; for (let i = i0; i <= i1; i++) { js.push(Math.abs(jj[i])); if (i >= i0 + 4) steps.push(Math.abs(a[i] - a[i - 4])); } return { j95: js.length ? Math.max(...js) / 1.5 : 0, step: Math.max(0, ...steps) }; };
    const sa = spread(A_), sb = spread(B_), jBar = Math.max(1.5 * Math.max(sa.j95, sb.j95), 1e-6), stepBar = Math.max(sa.step, sb.step, 1e-7);
    let jMax = 0, stepMax = 0; for (let i = idx(j - 15); i <= idx(j + 15); i++) { jMax = Math.max(jMax, Math.abs(jj[i])); if (i >= 4) stepMax = Math.max(stepMax, Math.abs(a[i] - a[i - 4])); }
    const good = jMax <= jBar && stepMax <= stepBar * 1.5 + 1e-7;
    if (!good) ok = false;
    out[key] = `${good ? 'ok' : 'BUMP'} jerk ${jMax.toExponential(2)} (mid ${jBar.toExponential(2)}), step ${stepMax.toExponential(2)} (mid ${stepBar.toExponential(2)})`;
  }
  const fieldRates = {}; for (const f of ['kh', 'kv', 'phi', 'c', 'w']) {
    if (!A_.P.channels[f]) continue;
    const at = D.channelAt(A_.P, f, A_.P.length).d1, midA = Math.abs(D.channelAt(A_.P, f, A_.P.length / 2).d1), midB = Math.abs(D.channelAt(B_.P, f, B_.P.length / 2).d1);
    if (Math.max(midA, midB) > 1e-9) fieldRates[f] = `${at.toExponential(1)} at the joint, ${Math.max(midA, midB).toExponential(1)} mid-piece`;
  }
  out.fields = fieldRates; out.ok = ok; rows.push(out);
}
for (const r of rows) console.log(`${r.joint}\t${r.pieces}\t${r.ok ? 'reads like mid-piece' : 'BUMP'}\n\tcentre U: ${r.centreU}\n\tcentre L: ${r.centreL}\n\twheel 10 m U: ${r.wheelU}\n\tfields' rate: ${JSON.stringify(r.fields)}`);
console.log(`joints: ${rows.length}, reading like mid-piece: ${rows.filter((r) => r.ok).length}`);
