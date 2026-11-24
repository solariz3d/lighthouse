// what the real code does with the lists the survivor searches found
const T = 'G:/consonance-scratch/o-smooth-t180', D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), TB = require(T + '/src/core/turnby.js'), A = require(T + '/src/core/adapter.js');
const DEG = Math.PI / 180, lead = extend(D.createDoc('s'), { length: 300, family: 'bowl', first: { w: 33 } });
const near = (S, s) => S.reduce((a, b) => (Math.abs(b.s - s) < Math.abs(a.s - s) ? b : a));
const lists = { W2_B2: { first: [84.7, 5.41], marks: [[125.6, 13.42], [136.9, 18.16]] }, B36: { first: [51.4, 8.36], marks: [[61.8, 2.33], [93.7, 5.15], [120, 27.23]] } };
for (const [name, L] of Object.entries(lists)) for (const way of ['plain', 'corner90']) {
  const o = { length: 300, targets: { phi: L.first[1] * DEG }, transition: { phi: L.first[0] }, bankShape: 'flow', through: { phi: L.marks.map(([at, t]) => ({ at, target: t * DEG })) } };
  let d; try { d = way === 'plain' ? extend(lead, o) : TB.extendCorner(lead, { ...o, turnDeg: 90 }); } catch (e) { console.log(name, way, e instanceof D.CoreError ? 'refused' : 'UNTYPED', e.message.slice(0, 160)); continue; }
  const all = [0, L.first[1], ...L.marks.map((m) => m[1])], S = A.toPath(d, { step: 0.5 }).path.samples;
  let lo = 1e9, hi = -1e9, blo = 1e9, bhi = -1e9; for (let s = 0; s <= 300; s += 0.5) { const v = D.channelValue(d.pieces[1], 'phi', s) / DEG, b = near(S, 300 + s).roll / DEG; lo = Math.min(lo, v); hi = Math.max(hi, v); blo = Math.min(blo, b); bhi = Math.max(bhi, b); }
  console.log(name, way, 'laid; doc', lo.toFixed(4), '..', hi.toFixed(4), 'built', blo.toFixed(4), '..', bhi.toFixed(4), 'marks', Math.min(...all), '..', Math.max(...all));
}
