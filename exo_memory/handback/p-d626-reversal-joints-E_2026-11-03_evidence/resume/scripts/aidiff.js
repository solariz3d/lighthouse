// usage: node aidiff.js <old tree> <new tree> — ELYSIUM's AI line (the floor line, as ailine_vertical.test.js makes it) in both trees: its sha256, how many
// points, how many points moved (position over 1 mm), and the largest change of each per-point field the encoder writes besides position
'use strict';
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const line = (R) => {
  const D = require(path.join(R, 'src/core/document.js')), AD = require(path.join(R, 'src/core/adapter.js')), FW = require(path.join(R, 'src/export/fromwords.js'));
  const { buildPath } = require(path.join(R, 'src/geom/path.js')), AI = require(path.join(R, 'src/export/ailine.js'));
  const doc = D.parse(fs.readFileSync(path.join(R, 'test/fixtures/elysium-2026-10-22.t180track'), 'utf8')), segs = AD.toSegments(doc);
  const start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch }, p = AD.offsetPath(doc, segs, buildPath(segs, { step: 2, closed: true, start }));
  const speeds = segs.filter((g) => g.kind === 'road').map((g) => g.speed), speedKmh = speeds.every((x) => Number.isFinite(x) && x > 0) ? Math.min(...speeds) * 3.6 : undefined;
  const { dsn, secs } = FW._internal.aiInput(segs, p), L = AI.generateAiLine(dsn, secs, { mode: 'floor', speedKmh, DS: 2 });
  return { L, sha: crypto.createHash('sha256').update(AI.encodeAiLine(L)).digest('hex') };
};
const [O, N] = process.argv.slice(2), a = line(O), b = line(N);
console.log('old', a.sha, '\nnew', b.sha);
const pa = a.L.points || a.L.ideal || a.L.pts, pb = b.L.points || b.L.ideal || b.L.pts;
console.log('keys', Object.keys(a.L).join(','));
if (Array.isArray(pa) && Array.isArray(pb)) {
  let moved = 0, worst = 0; const n = Math.min(pa.length, pb.length);
  for (let i = 0; i < n; i++) { const x = pa[i].pos || pa[i], y = pb[i].pos || pb[i]; const d = Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); if (d > 1e-3) moved++; worst = Math.max(worst, d); }
  console.log(`points old ${pa.length} new ${pb.length}; moved over 1 mm: ${moved}; largest move ${worst.toFixed(4)} m`);
}
for (const k of Object.keys(a.L)) {
  const u = a.L[k], v = b.L[k]; if (!Array.isArray(u) || !Array.isArray(v) || typeof u[0] !== 'number') continue;
  let w = 0, c = 0; for (let i = 0; i < Math.min(u.length, v.length); i++) { const d = Math.abs(u[i] - v[i]); if (d > 1e-6) c++; w = Math.max(w, d); }
  console.log(`field ${k}: ${c} of ${u.length} differ, largest ${w.toExponential(2)}`);
}
