// L217 R2 survey: for every track the repo's own tests export (and the platform test), the line the exporter writes today and its least |tangent x up| (as AC reads it).
const fs = require('fs'), path = require('path');
const R = 'C:/Consonance/t180-wt-ai';
const { generateAiLine, encodeAiLine, readAiLine } = require(R + '/src/export/ailine.js');
const D = require(R + '/src/core/document.js'), AD = require(R + '/src/core/adapter.js'), FW = require(R + '/src/export/fromwords.js');
const { buildPath } = require(R + '/src/geom/path.js');
const pt = require(R + '/scripts/platform_test.js');
function least(line) {
  const P = readAiLine(encodeAiLine(line)).points.map((p) => p.pos.map(Math.fround)), n = P.length;
  const h = (a, b) => { const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(...d); return l > 0 ? Math.hypot(d[0], d[2]) / l : 1; };
  const all = []; for (let k = 1; k < n - 1; k++) all.push(Math.min(h(P[k], P[k + 1]), h(P[k - 1], P[k]), h(P[k - 1], P[k + 1])));
  all.sort((a, b) => a - b); return { n, min: all[0], second: all[1], third: all[2] };
}
const out = [];
function doc(name, text) {
  for (const closed of [true, false]) try {
    const d = D.parse(text), segs = AD.toSegments(d);
    const start = { pos: d.start.pos.slice(), theta: d.start.heading, p: d.start.pitch };
    const p = AD.offsetPath(d, segs, buildPath(segs, { step: 2, closed, start }));
    const speeds = segs.filter((g) => g.kind === 'road').map((g) => g.speed), speedKmh = speeds.every((x) => Number.isFinite(x) && x > 0) ? Math.min(...speeds) * 3.6 : undefined;
    const { dsn, secs } = FW._internal.aiInput(segs, p);
    const r = least(generateAiLine(dsn, secs, { mode: 'floor', speedKmh, DS: 2, open: !closed }));
    out.push([name + (closed ? '' : ' (open)'), r.n, r.min, r.second, r.third, '']); return;
  } catch (e) { if (!closed || !/does not close/.test(String(e.message))) { out.push([name, 0, NaN, NaN, NaN, String(e.code || e.message).slice(0, 40)]); return; } }
}
const fx = path.join(R, 'test', 'fixtures');
for (const f of fs.readdirSync(fx).sort()) if (/\.(core2\.json|t180track)$/.test(f)) doc(f, fs.readFileSync(path.join(fx, f), 'utf8'));
const T = pt.buildTrack();
for (const mode of ['floor', 'wall']) { const r = least(generateAiLine(T.dsn, T.secs, { mode })); out.push(['platform_test (' + mode + ')', r.n, r.min, r.second, r.third, '']); }
console.log('track'.padEnd(52), 'points', 'least h', 'second', 'third');
for (const [n, c, a, b, d, note] of out) console.log(n.padEnd(52), String(c).padStart(6), Number.isNaN(a) ? note.padEnd(10) : a.toExponential(3), Number.isNaN(b) ? '' : b.toExponential(3), Number.isNaN(d) ? '' : d.toExponential(3));
