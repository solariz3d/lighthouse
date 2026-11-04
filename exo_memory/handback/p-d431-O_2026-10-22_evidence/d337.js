'use strict';
// D431 (O): ELYSIUM's near-closed save (fixtures-d337/pre-close.t180track, the keeper's, private) closed as one press does (closejob runClose finish): the report,
// each piece's largest move, and at the bent window's joints and the seam the spike and wiggle measures (kh, kv, °/100 m, six points before | five after).
//   node d337.js <tree>
const TREE = process.argv[2], fs = require('fs'), path = require('path');
const D = require(`${TREE}/src/core/document.js`), { runClose } = require(`${TREE}/app/core/closejob.js`);
const base = D.parse(fs.readFileSync(path.join(TREE, 'fixtures-d337', 'pre-close.t180track'), 'utf8'));
const t0 = Date.now(), res = runClose({ doc: base, finish: true }), ms = Date.now() - t0;
console.log(JSON.stringify({ ms, report: res.report, window: res.window && res.window.pieces, moves: (res.displacement || []).filter((x) => x.maxM > 0).map((x) => ({ piece: x.piece, maxM: +x.maxM.toFixed(3) })) }));
const p100 = (v) => (v * 100 * 180) / Math.PI, w = res.window.pieces, d = res.doc, pairs = [];
for (let j = w[0] + 1; j <= w[w.length - 1]; j++) pairs.push([j - 1, j]); pairs.push([d.pieces.length - 1, 0]);
for (const [i, j] of pairs) for (const ch of ['kh', 'kv']) {
  const S = [...d.pieces[i].channels[ch].map(p100).slice(-6), ...d.pieces[j].channels[ch].map(p100).slice(1, 6)];
  let o = 0; const ext = [];
  for (let k = 1; k + 1 < S.length; k++) { const up = S[k] - Math.max(S[k - 1], S[k + 1]), dn = Math.min(S[k - 1], S[k + 1]) - S[k]; o = Math.max(o, up, dn); if (up > 0.05) ext.push([k, 1]); else if (dn > 0.05) ext.push([k, -1]); }
  const wiggle = ext.some(([k, s]) => ext.some(([k2, s2]) => s2 === -s && Math.abs(k2 - k) <= 2));
  console.log(`${d.pieces[i].id}|${d.pieces[j].id} ${ch} spike ${o.toFixed(3).padStart(7)} wiggle ${wiggle ? 'YES' : 'no '}  ${S.map((v) => v.toFixed(2)).join(' ')}`);
}
