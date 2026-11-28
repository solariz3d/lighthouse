'use strict';
const path = require('path'), T = process.argv[2], TB0 = process.argv[3];
const F = require(path.join(T, 'test/even_fixtures.js')), ZG = require(path.join(T, 'app/core/zonegrab.js')), AD = require(path.join(T, 'src/core/adapter.js'));
const EV = require(path.join(T, 'src/core/even.js')), EVB = require(path.join(TB0, 'src/core/even.js'));
(async () => {
  const sh = await F.shellOn(F.fixture('B-')); F.grab(sh, 145, 16); const st = F.present(sh), run = F.runPieces(st);
  const a = EV.even(st, { ...run, value: 16, hold: 'left' }).doc, b = EVB.even(st, { ...run, value: 16, hold: 'left' }).doc;
  const wAt = (d) => { const g = F.geomOf(d); return ZG.frameAt(g.path, g.segments, 145, -1).w.toFixed(6); };
  console.log('section width at 145: start', wAt(st), 'bcedaaf', wAt(b), 'item 1', wAt(a));
  const seg = (d) => { const g = F.geomOf(d).segments[72]; return JSON.stringify(Object.fromEntries(Object.entries(g).filter(([k, v]) => typeof v !== 'object' || v === null))); };
  console.log('seg 72 start ', seg(st)); console.log('seg 72 item 1', seg(a));
  const keys = (d) => Object.keys(F.geomOf(d).segments[72]).join(',');
  console.log('keys', keys(st));
  console.log('cup at 145 start/item1', F.at(st, 'c', 145), F.at(a, 'c', 145), 'r', F.at(st, 'r', 145), F.at(a, 'r', 145));
})().catch((e) => { console.error(e); process.exitCode = 1; });
