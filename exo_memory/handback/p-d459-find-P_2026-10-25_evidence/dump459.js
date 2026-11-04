'use strict';
const fs = require('fs'), path = require('path'); const [T, F] = process.argv.slice(2);
(async () => {
  const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
  const { createTrackModel } = require(path.join(T, 'app/preview/trackmodel.js'));
  const text = fs.readFileSync(F, 'utf8');
  const sh = await createCoreShell({ brushFn: null, exporter: null, storage: { openDoc: async () => text } }); await sh.open('TEST 10');
  const R = createTrackModel().update(sh.getState().resolved);
  const by = new Map(); for (const b of R.batches) { const k = b.key; const e = by.get(k) || { n: 0, rows: [], seam: b.seam }; e.n++; e.rows.push(b.rowS ? b.rowS.length : -1); by.set(k, e); }
  console.log('distinct keys', by.size, 'batches', R.batches.length);
  let i = 0; for (const [k, e] of by) { if (i++ < 30) console.log(k.padEnd(24), 'n', e.n, 'seam', e.seam, 'rows/batch', [...new Set(e.rows)].join(',')); }
  // first 3 batches of p19 and the last 3: key, rowS, rows in positions
  const p19 = R.batches.filter((b) => /p19/.test(b.key)); console.log('p19 batches', p19.length);
  for (const b of [...p19.slice(0, 3), ...p19.slice(-3)]) console.log(b.key, 'seam', b.seam, 'K', b.cols, 'rowS', JSON.stringify(b.rowS), 'rows in positions', b.cols ? b.positions.length / 3 / b.cols : '-', 'model[12..14]', Array.from(b.model).slice(12, 15).map((x) => x.toFixed(1)).join(','));
  const st = R.mesh && R.mesh._state; if (st) { const pc = st.pieces.find((p) => p.id === 'p19'); console.log('p19 state: K', pc.K, 'Us len', pc.Us.length, 'cells', pc.cells.length, 'cell0 rowS', JSON.stringify(pc.cells[0].rowS), 'cell1 rowS', JSON.stringify(pc.cells[1].rowS), 'cellLast rowS', JSON.stringify(pc.cells[pc.cells.length - 1].rowS)); }
})().catch((e) => { console.error('ERR', e.stack); process.exit(1); });
