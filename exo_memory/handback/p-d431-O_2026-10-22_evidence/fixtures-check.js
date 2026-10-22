'use strict';
// D431 (O): laps the metric was NOT chosen on. Each saved closed fixture of the repo (test/fixtures/F*.core2.json that is a closed lap), opened by dropping its
// last road piece(s) (1, then 2), then finished: the worst one-knot spike at the closer's joints and seam (bar2's measure), the gap, the lowest road load, the
// route; or the refusal.   node fixtures-check.js <tree>
const TREE = process.argv[2], fs = require('fs'), path = require('path');
const D = require(`${TREE}/src/core/document.js`), F = require(`${TREE}/src/core/finish.js`), { residual } = require(`${TREE}/src/core/close.js`);
const per100 = (v) => (v * 100 * 180) / Math.PI;
function worst(doc, from) {
  const pairs = []; for (let j = from + 1; j < doc.pieces.length; j++) pairs.push([j - 1, j]); if (doc.closed) pairs.push([doc.pieces.length - 1, 0]);
  let w = { over: 0 };
  for (const [i, j] of pairs) for (const ch of ['kh', 'kv']) {
    if (doc.pieces[i].type !== 'road' || doc.pieces[j].type !== 'road') continue;
    const S = [...doc.pieces[i].channels[ch].map(per100).slice(-6), ...doc.pieces[j].channels[ch].map(per100).slice(1, 6)];
    for (let k = 1; k + 1 < S.length; k++) { const hi = Math.max(S[k - 1], S[k + 1]), lo = Math.min(S[k - 1], S[k + 1]), o = S[k] > hi ? S[k] - hi : S[k] < lo ? lo - S[k] : 0; if (o > w.over) w = { over: +o.toFixed(3), at: `${doc.pieces[i].id}|${doc.pieces[j].id} ${ch}` }; }
  }
  return w;
}
const dir = path.join(TREE, 'test', 'fixtures');
for (const f of fs.readdirSync(dir).filter((x) => /^F\d.*\.core2\.json$/.test(x))) {
  let doc; try { doc = D.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { continue; }
  if (!doc.closed || doc.pieces.length < 3) continue;
  for (const drop of [1, 2]) {
    const open = { ...doc, closed: false, pieces: doc.pieces.slice(0, doc.pieces.length - drop) };
    if (open.pieces[open.pieces.length - 1].type !== 'road') continue;
    try { const r = F.finishToStart(D.checkDoc(open)); const rs = residual(r.doc);
      console.log(JSON.stringify({ fixture: f.slice(0, 24), drop, word: r.plan.word, worstSpike: worst(r.doc, open.pieces.length), gapMm: +(rs.gapM * 1000).toFixed(3), minHoldG: r.plan.minHoldG }));
    } catch (e) { console.log(JSON.stringify({ fixture: f.slice(0, 24), drop, refused: `${e.code}: ${String(e.message).slice(0, 90)}` })); }
  }
}
