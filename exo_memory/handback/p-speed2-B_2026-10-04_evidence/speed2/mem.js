// mem.js (pane B, D236 item 5): does a closed loop's retained memory stay bounded over MANY drag-and-release cycles (two slots, not a growing chain of reused meshes)?
// A closed tube lap, one track model, 40 cycles of (coarse drag step, coarse step 2, release to full); heapUsed after two forced GCs every 5 cycles.
//   node --expose-gc mem.js <tree>
'use strict';
const path = require('path'), T = path.resolve(process.argv[2]) + '/';
const { createCoreShell } = require(T + 'app/core/coreshell.js'), { createTrackModel } = require(T + 'app/preview/trackmodel.js'), { FACTOR } = require(T + 'app/preview/coarse.js');
const gq = Math.PI * 180 / 2, MB = () => { global.gc(); global.gc(); return +(process.memoryUsage().heapUsed / 1048576).toFixed(1); };
(async () => {
  const s = await createCoreShell({ brushFn: null });
  s.extend({ length: 300, first: { w: 31, t: 360 } }); for (let i = 0; i < 4; i++) s.extend({ length: gq, transition: 40, targets: { kh: 1 / 180 } }); s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); s.close();
  if (!s.getState().history.present.closed) throw new Error('not closed: ' + s.getState().message);
  const tm = createTrackModel(); tm.update(s.getState().resolved);
  const series = [MB()];
  for (let c = 1; c <= 40; c++) {
    s.beginBrush({ mode: 'rate', channel: 'phi', s0: 100 + (c * 37) % 600, r: 40 }); tm.setDetail(FACTOR);
    s.brushTo(0.004); tm.update(s.getState().resolved); s.brushTo(0.008); tm.update(s.getState().resolved);
    s.endBrush(); tm.update(s.getState().resolved); tm.setDetail(1); const r = tm.update(s.getState().resolved);
    if (c % 5 === 0) series.push(MB());
    if (c === 40) console.log(JSON.stringify({ lastReused: r.mesh && r.mesh.stats ? r.mesh.stats.reused : null, segments: s.getState().resolved.segments.length }));
  }
  console.log(JSON.stringify({ heapUsedMB_every5cycles: series, growthFirstToLast: +(series[series.length - 1] - series[1]).toFixed(1) }));
})().catch((e) => { console.error(e); process.exit(1); });
