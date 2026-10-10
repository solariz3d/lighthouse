const WT = 'C:/Users/nname/AppData/Local/Temp/c-d186-wt/', fs = require('fs'), path = require('path'), os = require('os');
const { createCoreShell } = require(WT + 'app/core/coreshell.js'), { makeExporter } = require(WT + 'app/export/export.js'), { toPath } = require(WT + 'src/core/adapter.js');
(async () => {
  const writes = [], storage = { writeExport: async (dir, folder, files) => { writes.push([folder, files.length]); } };
  const ex = await makeExporter(async (p) => fs.readFileSync(path.join(WT, p), 'utf8'));
  const s = await createCoreShell({ storage, exporter: ex, localBrush: null });
  const R = 180, q = Math.PI * R / 2, t = Date.now();
  s.extend({ length: 300, family: 'bowl' }); console.log('extend 1', s.getState().message, s.getState().resolved.segments.length, s.getState().lastStep);
  for (let i = 0; i < 4; i++) { s.extend({ length: q, transition: 40, targets: { kh: 1 / R } }); if (s.getState().message) console.log('extend msg', s.getState().message); }
  s.extend({ length: 60, transition: 40, targets: { kh: 0 } });
  console.log('pieces', s.getState().history.present.pieces.length, 'build ms', Date.now() - t);
  const t2 = Date.now(); s.close(); console.log('close', s.getState().messageKind, s.getState().message, Date.now() - t2, 'ms', 'closed', s.getState().history.present.closed);
  const { path: p, segments } = toPath(s.getState().history.present);
  s.pour({ path: p, segments }, { speedKmh: 200, count: 5, lengthM: 800 }); const w = s.getState().water;
  console.log('water', s.getState().message, w && w.streams.length, w && w.reds.map((r) => r.text).slice(0, 4), w && w.ms);
  const t3 = Date.now(); await s.exportTo('C:/tmp-not-used-t180'); console.log('export', s.getState().messageKind, (s.getState().message || '').slice(0, 300), Date.now() - t3, 'ms', writes, s.getState().exportReds && s.getState().exportReds.slice(0, 3));
})().catch((e) => { console.error('FAIL', e.stack); process.exit(1); });
