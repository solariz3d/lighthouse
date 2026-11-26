const fs = require('fs'), rd = (f) => fs.readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse), T = rd('tip.jsonl'), B = rd('base.jsonl');
const k = (c) => JSON.stringify([c.set, c.ch, c.lead, c.first, c.L, c.opts, c.changes]);
const bm = new Map(B.map((c) => [k(c), c])); const by = {};
for (const t of T) { const b = bm.get(k(t)), s = (by[t.set] = by[t.set] || { n: 0, sameBytes: 0, newlyLaid: 0, newlyLaidOver105: [], laidOver105tip: [], laidOver105base: 0, refusedSame: 0, refusedDiffer: [] }); s.n++;
  if (t.laid && b.laid && t.sha === b.sha) s.sameBytes++;
  if (!t.laid && !b.laid) { if (t.msg === b.msg && t.needM === b.needM) s.refusedSame++; else s.refusedDiffer.push([t.changes, b.needM, t.needM]); }
  if (t.laid && !b.laid) { s.newlyLaid++; if (t.peak > 1.05) s.newlyLaidOver105.push([t.ch || 'kh', t.first, t.opts, t.changes, t.peak, 'base needM', b.needM]); }
  if (t.laid && t.peak > 1.05) s.laidOver105tip.push([t.changes, t.peak]); if (b.laid && b.peak > 1.05) s.laidOver105base++;
  if (b.laid && !t.laid) (s.nowRefused = s.nowRefused || []).push([t.changes, t.msg]); }
for (const [set, s] of Object.entries(by)) { console.log(`${set}: n ${s.n}, same bytes ${s.sameBytes}, refused same ${s.refusedSame}, refusal differs ${s.refusedDiffer.length}, newly laid ${s.newlyLaid}, newly laid over 1.05 ${s.newlyLaidOver105.length}, laid over 1.05 at tip ${s.laidOver105tip.length} (at base ${s.laidOver105base})${s.nowRefused ? ', now refused ' + s.nowRefused.length : ''}`);
  for (const x of s.newlyLaidOver105.slice(0, 12)) console.log('   NEW>1.05', JSON.stringify(x)); if (set === 'C') for (const x of s.refusedDiffer) console.log('   C differs', JSON.stringify(x)); }
