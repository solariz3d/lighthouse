// o_made_probe.js (pane O, L260 track 6, plan only; scratch): his own saved tracks as overlays, measured at f3cd425. Read only: each file is read
// into memory and never written; names are never printed ("made N" in the list's sorted order, the eq- files the Open list shows).
// Per track: does f3cd425's D.parse take it (else its CoreError code); its length; and what drawing it would cost in the page: toSegments, buildPath
// (step 2), the builder's own road mesh (buildMesh, lean, as the overlap check builds it), and a flat ribbon of its width along its centreline.
//   node o_made_probe.js <f3cd425 tree> <tracks folder>
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [T0, DIR] = process.argv.slice(2), T = path.resolve(T0);
const D = require(path.join(T, 'src/core/document.js'));
const { toSegments } = require(path.join(T, 'src/core/adapter.js'));
const G = require(path.join(T, 'src/geom/index.js'));
const ms = (t) => +(Number(process.hrtime.bigint() - t) / 1e6).toFixed(1);
const files = fs.readdirSync(DIR).filter((f) => /^eq-.*\.t180track$/.test(f)).sort();
const others = fs.readdirSync(DIR).filter((f) => /\.t180track$/.test(f) && !/^eq-/.test(f)).length;
const rows = [];
files.forEach((f, i) => {
  const row = { made: i + 1, bytes: fs.statSync(path.join(DIR, f)).size };
  const text = fs.readFileSync(path.join(DIR, f), 'utf8');
  let doc; let t = process.hrtime.bigint();
  try { doc = D.parse(text); row.parseMs = ms(t); } catch (e) { row.refused = e.code || e.name; row.newer = /newer builder/.test(String(e.message)); rows.push(row); return; }
  row.pieces = doc.pieces.length; row.closed = !!doc.closed;
  if (!doc.pieces.length) { row.empty = true; rows.push(row); return; }
  try {
    t = process.hrtime.bigint(); const segs = toSegments(doc); row.segMs = ms(t);
    t = process.hrtime.bigint(); const p = G.buildPath(segs, { step: 2, closed: !!doc.closed, start: { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch } }); row.pathMs = ms(t); row.lengthM = Math.round(p.lengthM);
    t = process.hrtime.bigint(); const n = p.samples.length, pos = new Float32Array(n * 6); p.samples.forEach((q, k) => { const w = 6; for (let a = 0; a < 3; a++) { pos[k * 6 + a] = q.pos[a] + q.L[a] * w; pos[k * 6 + 3 + a] = q.pos[a] - q.L[a] * w; } }); row.ribbonMs = ms(t); row.ribbonVerts = n * 2;
    t = process.hrtime.bigint(); const mesh = G.buildMesh(p, segs, { lean: true }); row.meshMs = ms(t);
    row.meshKeys = Object.keys(mesh).slice(0, 8);
  } catch (e) { row.drawError = e.code || e.name; }
  rows.push(row);
});
const ok = rows.filter((r) => r.parseMs !== undefined);
console.log(JSON.stringify({ listed: files.length, notListedOldPieceBuilder: others, parse: `${ok.length} of ${files.length}`, refused: rows.filter((r) => r.refused).map((r) => ({ made: r.made, code: r.refused, newer: r.newer })),
  longestM: Math.max(...ok.map((r) => r.lengthM || 0)), slowest: ok.reduce((a, r) => ((r.segMs || 0) + (r.pathMs || 0) + (r.meshMs || 0) > (a.segMs || 0) + (a.pathMs || 0) + (a.meshMs || 0) ? r : a), {}), rows }, null, 1));
