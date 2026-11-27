// o_lay_time.js (pane O, L259 track 5, plan only; scratch): what one steered try costs through the core at f3cd425, as a track grows.
// A try = the panel's extendOptions -> turnby.extendCorner (what shell.extend calls) on a scratch document, then the built road's end read
// (adapter toSegments with the shell's own segment cache, then buildPath), which is what a steer measures. Our own synthetic shape only:
// 8 m rate pieces, the turn rate on a slow sine, a small climb, the bank following the turn, width 12. Three tries a piece (the studies
// used up to 4). Machine load at the time is named in the output (heavy-run --status beside it).
//   node o_lay_time.js <f3cd425 tree> [pieces=250]
'use strict';
const path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const TREE = path.resolve(process.argv[2]), N = Number(process.argv[3] || 250);
const D = require(path.join(TREE, 'src/core/document.js'));
const TB = require(path.join(TREE, 'src/core/turnby.js'));
const { toSegments } = require(path.join(TREE, 'src/core/adapter.js'));
const { buildPath } = require(path.join(TREE, 'src/geom/path.js'));
const { extendOptions } = require(path.join(TREE, 'app/core/panel.js'));
const cache = new WeakMap();
const endOf = (doc) => { const segs = toSegments(doc, { cache }); const p = buildPath(segs, { step: 0.5, closed: doc.closed, start: { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch } }); return p[p.length - 1]; };
let doc = D.createDoc('probe');
doc = TB.extendCorner(doc, extendOptions({ length: 100, turn: 0, climb: 0, bank: 0, width: 12, turnAs: 'rate' }));
const marks = [], t0 = Date.now(); let tries = 0, refused = 0, tryMs = [];
for (let i = 1; i <= N; i++) {
  const s = i * 8, turn = 60 * Math.sin(s / 300), climb = 3 * Math.sin(s / 170), bank = Math.max(-20, Math.min(20, turn / 4));
  let best = doc;
  for (let k = 0; k < 3; k++) {
    const t1 = process.hrtime.bigint();
    try { const d = TB.extendCorner(doc, extendOptions({ length: 8, turn: turn + (k - 1) * 0.5, climb, bank, width: 12, turnAs: 'rate' })); endOf(d); best = d; }
    catch (e) { refused++; if (refused < 4) console.error('refused', i, k, String(e.message).slice(0, 100)); }
    tryMs.push(Number(process.hrtime.bigint() - t1) / 1e6); tries++;
  }
  doc = best;
  if (i % 25 === 0) { const w = tryMs.slice(-75).sort((a, b) => a - b); marks.push({ pieces: i, roadM: 100 + 8 * i, tryMsMedian: +w[37].toFixed(1), tryMsMax: +w[w.length - 1].toFixed(1) }); }
}
console.log(JSON.stringify({ pieces: N, tries, refused, wallS: +((Date.now() - t0) / 1000).toFixed(1), marks, node: process.version, priority: os.getPriority(0) }));
