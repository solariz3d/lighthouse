// usage: node extrema.js <checkout> <save> [label]
// Every turning point of the document's bank inside a road piece (its rate changes sign between two places it is not zero, read every 0.5 m; on a flat top, its middle): the document's bank there against the built bank
// there (the path's roll at that s). Reports how many there are, how many the build keeps within 0.05°, and the worst.
'use strict';
const fs = require('fs'), path = require('path');
const [R, save, label = ''] = process.argv.slice(2);
const D = require(path.join(R, 'src/core/document.js')), A = require(path.join(R, 'src/core/adapter.js'));
const doc = D.parse(fs.readFileSync(save, 'utf8')), DEG = Math.PI / 180;
const S = A.toPath(doc).path.samples, ds = S[1].s - S[0].s, rollAt = (s) => { const i = Math.max(0, Math.min(S.length - 1, Math.round(s / ds))); return S[i].roll; };
let o = 0, n = 0, kept = 0, worst = { d: 0 };
for (const P of doc.pieces) {
  if (P.type === 'road' && P.channels.phi && !P.tube) {
    let last = null;
    for (let s = 0; s <= P.length; s += 0.5) {
      const r = D.channelAt(P, 'phi', s).d1; if (Math.abs(r) < 1e-7) continue;
      if (last && Math.sign(r) !== last.sign) {
        const t = (last.s + s) / 2, v = D.channelAt(P, 'phi', t).v; n++; const d = Math.abs(rollAt(o + t) - v) / DEG; if (d < 0.05) kept++; if (d > worst.d) worst = { d, s: o + t, id: P.id, doc: v / DEG, built: rollAt(o + t) / DEG };
      }
      last = { s, sign: Math.sign(r) };
    }
  }
  o += P.length;
}
console.log(`${label}\tturning points ${n}, kept within 0.05° ${kept}${worst.id ? `; worst ${worst.d.toFixed(3)}° at s ${worst.s.toFixed(0)} (${worst.id}: document ${worst.doc.toFixed(2)}°, built ${worst.built.toFixed(2)}°)` : ''}`);
