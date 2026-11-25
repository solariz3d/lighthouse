// LAP 4: the drag's time per frame, as the panel asks it (each frame: shell.candidateReadout(opts) then shell.candidate(opts, { coarse: true }), app/core/panel.js
// readout and ghost), whole (as before item a) against roomSearch: false (the panel while a drag runs). Two drags of one mark by 1 m: the second reader's q6 (its q2 list's
// mark 2, 45 to 125 m; it lays now at most frames) and a drag across a region still refused (the reader's drawn list 158's mark 1, 45 to 125 m, its next mark kept 20.9 m
// after). Tree argv[2]; 3 passes, the median per frame of the passes kept.
'use strict';
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), R = path.resolve(process.argv[2]);
const D = require(path.join(R, 'src/core/document.js')), { extend } = require(path.join(R, 'src/core/extend.js')), { createCoreShell } = require(path.join(R, 'app/core/coreshell.js'));
const DEG = Math.PI / 180;
const DRAGS = {
  'q6 (q2 list, mark 2)': (at) => ({ first: [23.2, 29.2], marks: [[40.9, -11.2], [at, 25.2], [at + 17.4, 20.6]] }),
  'list 158, mark 1 (refused throughout)': (at) => ({ first: [32.2, 21.3], marks: [[at, -9.4], [at + 20.9, -26.5]] }),
};
(async () => {
  const sh = await createCoreShell({ brushFn: null }); sh.commitDoc(extend(D.createDoc('p'), { length: 300, family: 'bowl', first: { w: 33 } }));
  const opts = (L, more) => ({ length: 300, targets: { phi: L.first[1] * DEG }, transition: { phi: L.first[0] }, bankShape: 'flow', through: { phi: L.marks.map(([a, d]) => ({ at: a, target: d * DEG })) }, ...more });
  const frame = (o) => { const t0 = performance.now(); let r = 'lays'; try { sh.candidateReadout(o); sh.candidate(o, { coarse: true }); } catch (e) { if (!(e instanceof D.CoreError)) throw e; r = 'refused'; } return { r, ms: performance.now() - t0 }; };
  const st = (a) => { const s = [...a].sort((x, y) => x - y); return a.length ? `n ${a.length}, median ${s[s.length >> 1].toFixed(1)} ms, p95 ${s[Math.floor(s.length * 0.95)].toFixed(1)}, max ${s[s.length - 1].toFixed(1)}, total ${a.reduce((x, y) => x + y, 0).toFixed(0)} ms` : '-'; };
  for (const [name, at2L] of Object.entries(DRAGS)) for (const [mode, more] of [['whole (before a)', {}], ['roomSearch: false (a drag)', { roomSearch: false }]]) {
    const per = [];
    for (let pass = 0; pass < 3; pass++) { let i = 0; for (let at = 45; at <= 125; at += 1, i++) { const f = frame(opts(at2L(at), more)); (per[i] = per[i] || { r: f.r, ms: [] }).ms.push(f.ms); } }
    const rows = per.map((x) => ({ r: x.r, ms: x.ms.sort((a, b) => a - b)[1] }));
    console.log(`${name}, ${mode}: ${rows.map((x) => (x.r === 'lays' ? '#' : '.')).join('')}`);
    console.log(`   every frame ${st(rows.map((x) => x.ms))}; refused frames ${st(rows.filter((x) => x.r === 'refused').map((x) => x.ms))}; laid frames ${st(rows.filter((x) => x.r === 'lays').map((x) => x.ms))}`);
  }
})().catch((e) => { console.error(e); process.exit(1); });
