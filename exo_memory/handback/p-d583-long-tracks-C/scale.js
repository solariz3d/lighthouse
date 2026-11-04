// scale.js <repo> <in.t180track> <targetKm> <out.t180track>: the same lap, k times longer. Lengths, knots and every along-the-road position x k,
// curvatures kh, kv / k: every angle (heading, pitch) is kept, so a closed lap stays closed and the positions scale by k. The cross-section channels
// (w, phi, r, h, l, c, e, s) are kept as they are. Prints the document check and the closure gap of the path, before and after.
'use strict';
const fs = require('fs'), path = require('path');
const [, , REPO, IN, KM, OUT] = process.argv;
const D = require(path.join(REPO, 'src/core/document.js')), AD = require(path.join(REPO, 'src/core/adapter.js'));
const src = D.parse(fs.readFileSync(IN, 'utf8'));
const total = src.pieces.reduce((a, p) => a + (p.length || 0), 0), k = KM.startsWith('x') ? +KM.slice(1) : (+KM * 1000) / total;
const j = JSON.parse(D.serialize(src));
for (const p of j.pieces) {
  p.length *= k;
  if (p.knots) p.knots = p.knots.map((x) => x * k);
  for (const c of ['kh', 'kv']) if (p.channels && p.channels[c]) p.channels[c] = p.channels[c].map((x) => x / k);
}
const sc = (o, key) => { if (o && typeof o[key] === 'number') o[key] *= k; };
if (j.spawns) { sc(j.spawns.line, 'along'); sc(j.spawns.hotlap, 'along'); }
if (j.pitLane) { sc(j.pitLane.leave, 'along'); sc(j.pitLane.rejoin, 'along'); }
j.name = `scaled-${KM}km`;
const C = require(path.join(REPO, 'src/core/close.js'));
const open = D.parse(JSON.stringify({ ...j, closed: false }));
const res = C.close(open, { edited: open.pieces.map((_, i) => i) });
if (!res.converged) { console.log('close did not converge: ' + res.report); process.exit(2); }
console.log('re-closed: ' + res.report.slice(0, 300));
const out = res.doc;
const gap = (d) => { const s = AD.toPath(d, { step: 5 }).path.samples; const a = s[0].pos, b = s[s.length - 1].pos; return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]).toFixed(3); };
const chk = (d) => { try { const r = D.checkDoc(d); return r === undefined ? 'ok' : JSON.stringify(r).slice(0, 200); } catch (e) { return 'THROWS ' + e.message; } };
console.log(`in: ${total.toFixed(0)} m, check ${chk(src)}, path end gap ${gap(src)} m`);
console.log(`k ${k.toFixed(4)}; out: ${out.pieces.reduce((a, p) => a + p.length, 0).toFixed(0)} m, check ${chk(out)}, path end gap ${gap(out)} m`);
fs.writeFileSync(OUT, D.serialize(out));
console.log(`wrote ${OUT} ${fs.statSync(OUT).size} B`);
