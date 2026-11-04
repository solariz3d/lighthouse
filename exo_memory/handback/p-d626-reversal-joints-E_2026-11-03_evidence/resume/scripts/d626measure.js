// usage: node d626measure.js <before tree> <after tree> <out.json>
// D626's record for the D190 fixtures: F3 and F5 (the two whose bank changes faster than the 3 g bar). Each tree's render digests come from the sealed
// test/fixtures/fixtures.js's OWN digests() (its text up to the write/check branch, evaluated with that tree as TREE, nothing copied), and the measure compares
// the two builds: which segments changed and in what, how far the built roll moved, whether any centre-line position moved, and the mesh's vertex count
'use strict';
const fs = require('fs'), path = require('path');
const [B, A, OUT] = process.argv.slice(2);
const NAMES = ['F3-bowl-narrow-12m-cap-binds', 'F5-flat-20m-bank-30'];
function load(R) {
  const src = fs.readFileSync(path.join(R, 'test/fixtures/fixtures.js'), 'utf8'), head = src.slice(0, src.indexOf("if (flag !== '--check')"));
  const argv = process.argv; process.argv = [argv[0], 'fixtures.js', R, path.join(R, 'test/fixtures'), '--check'];
  const fn = new Function('require', '__dirname', `${head}\nreturn { digests, D };`);
  try { return fn((m) => require(m.startsWith('.') ? path.join(R, 'test/fixtures', m) : m), path.join(R, 'test/fixtures')); } finally { process.argv = argv; }
}
const fb = load(B), fa = load(A), DEG = Math.PI / 180;
const AD = { b: require(path.join(B, 'src/core/adapter.js')), a: require(path.join(A, 'src/core/adapter.js')) };
const out = {};
for (const n of NAMES) {
  const text = fs.readFileSync(path.join(A, 'test/fixtures', `${n}.core2.json`), 'utf8');
  const db = fb.D.parse(text), da = fa.D.parse(text);
  const sb = AD.b.toSegments(db), sa = AD.a.toSegments(da), pb = AD.b.toPath(db).path.samples, pa = AD.a.toPath(da).path.samples;
  let segsRoll = 0, segsRate = 0, other = 0, rollMax = 0, posMax = 0, rollSamples = 0;
  sb.forEach((g, i) => { const h = sa[i]; const r = Math.max(Math.abs(g.roll0 - h.roll0), Math.abs(g.roll1 - h.roll1)); if (r > 0) segsRoll++; rollMax = Math.max(rollMax, r); if ('rollRate0' in h) segsRate++;
    const { roll0, roll1, rollRate0, rollRate1, ...rest } = g, { roll0: x0, roll1: x1, rollRate0: y0, rollRate1: y1, ...rest2 } = h; if (JSON.stringify(rest) !== JSON.stringify(rest2)) other++; });
  pb.forEach((x, i) => { const y = pa[i]; posMax = Math.max(posMax, Math.hypot(x.pos[0] - y.pos[0], x.pos[1] - y.pos[1], x.pos[2] - y.pos[2])); if (Math.abs(x.roll - y.roll) > 0) rollSamples++; });
  out[n] = { before: fb.digests(db), after: fa.digests(da), measure: { segments: sb.length, segments_count_after: sa.length, segments_whose_roll_changed: segsRoll, segments_carrying_a_roll_rate: segsRate,
    segments_changed_in_anything_but_roll: other, largest_roll_change_deg: +(rollMax / DEG).toFixed(4), path_samples: pb.length, path_samples_whose_roll_changed: rollSamples, largest_centreline_move_m: posMax } };
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
