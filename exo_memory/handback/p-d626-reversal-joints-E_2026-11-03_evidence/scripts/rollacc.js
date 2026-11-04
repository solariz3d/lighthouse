// usage: node rollacc.js <checkout> <save> [label]
// At every joint between two road pieces: the bank either side (start, joint, end of each piece), the kind (rolls on / turns back / into or out of a hold /
// both hold), and the peak roll ACCELERATION within 60 m of the joint as built (2 m segments: rate change between neighbouring segments / 2 m), in °/m², with
// the lift it gives a wheel 10 m out at 170 m/s (the 3 g bar: 29.4 m/s², i.e. 0.0058 °/m²).
'use strict';
const fs = require('fs'), path = require('path');
const [R, save, label = ''] = process.argv.slice(2);
const D = require(path.join(R, 'src/core/document.js')), A = require(path.join(R, 'src/core/adapter.js'));
const DEG = Math.PI / 180, MIN = 0.02 * DEG;
const doc = D.parse(fs.readFileSync(save, 'utf8')), segs = A.toSegments(doc);
let s = 0; const pts = []; for (const g of segs) { pts.push({ s, rate: (g.roll1 - g.roll0) / g.length }); s += g.length; }
let o = 0; const out = [];
doc.pieces.forEach((P, i) => {
  o += P.length; const B = doc.pieces[i + 1]; if (!B || P.type !== 'road' || B.type !== 'road') return;
  const mA = D.channelAt(P, 'phi', P.length / 2).d1, mB = D.channelAt(B, 'phi', B.length / 2).d1;
  const roll = (x) => (Math.abs(x) >= MIN ? Math.sign(x) : 0), a = roll(mA), b = roll(mB);
  const kind = !a && !b ? 'both hold' : a && b ? (a === b ? 'rolls on' : 'turns back') : a ? 'into a hold' : 'out of a hold';
  let peak = 0; for (let k = 1; k < pts.length; k++) if (Math.abs(pts[k].s - o) < 60) peak = Math.max(peak, Math.abs(pts[k].rate - pts[k - 1].rate) / (pts[k].s - pts[k - 1].s));
  const v = (Q, t) => (D.channelAt(Q, 'phi', t).v / DEG).toFixed(1);
  out.push({ joint: Math.round(o), pieces: `${P.id}|${B.id}`, kind, bank: `${v(P, 0)} -> ${v(P, P.length)} | -> ${v(B, B.length)}`, peakDegM2: +(peak / DEG).toFixed(5), lift10m170: +(10 * peak * 170 * 170).toFixed(1) });
});
console.log(label); for (const r of out) console.log(`${r.joint}\t${r.pieces}\t${r.kind}\t${r.bank}\tpeak ${r.peakDegM2} °/m²\tlift ${r.lift10m170} m/s²`);
