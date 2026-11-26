// kn5road.js (L243): can the builder's kn5 reader (tools/kn5.cjs readKn5) give an installed track's ROAD, and how wide is that road where its AI line runs?
// For each reference of the local key: the layout's kn5 files (models_<layout>.ini, else models.ini, else every .kn5 at the top), read with readKn5,
// timed; the meshes named as road (AC's physics names: a digit, then the surface key, e.g. 1ROAD...); then at every 25th AI point, the road's width
// across (the run of road under a line across the AI point, 0.25 m steps, +-80 m), against the AI line's own sideLeft + sideRight.
// Names stay in the key; this prints aliases only. Read only.
'use strict';
const fs = require('fs'), path = require('path');
const T = 'C:/Consonance/t180-wt-l243';
const { readKn5 } = require(T + '/tools/kn5.cjs');
const { readAiShape } = require(T + '/src/reference/ribbon.js');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const key = JSON.parse(fs.readFileSync(T + '/out/reference-key.json', 'utf8'));
const only = process.argv[2];
const out = {};
for (const a of Object.keys(key).filter((k) => k.startsWith('reference track') && (!only || k === only))) {
  const td = path.join(AC, key[a].track), L = key[a].layout;
  const ini = [L ? `models_${L}.ini` : null, 'models.ini'].filter(Boolean).map((f) => path.join(td, f)).find((f) => fs.existsSync(f));
  let kn5s = ini ? [...fs.readFileSync(ini, 'utf8').matchAll(/^\s*FILE\s*=\s*(.+?)\s*$/gmi)].map((m) => path.join(td, m[1])) : fs.readdirSync(td).filter((f) => /\.kn5$/i.test(f)).map((f) => path.join(td, f));
  const r = { kn5Files: kn5s.length, bytes: 0, readMs: 0, parsed: 0, refused: [], meshes: 0, roadMeshes: 0, roadTris: 0, keys: {} };
  // which keys are road: AC's own ROAD and KERB, and every key the track's surfaces.ini marks IS_VALID_TRACK=1; MODE=main keeps only the one with the most triangles
  const sIni = [path.join(td, L, 'data', 'surfaces.ini'), path.join(td, 'data', 'surfaces.ini')].find((x) => fs.existsSync(x));
  const valid = new Set(['ROAD', 'KERB']);
  if (sIni) for (const sec of fs.readFileSync(sIni, 'utf8').split(/^\s*\[/m)) { const k = /^\s*KEY\s*=\s*(\S+)/mi.exec(sec), v = /^\s*IS_VALID_TRACK\s*=\s*(\d)/mi.exec(sec); if (k && v && v[1] === '1') valid.add(k[1].toUpperCase()); }
  const byKey = {};
  for (const f of kn5s) {
    if (!fs.existsSync(f)) { r.refused.push('missing'); continue; }
    r.bytes += fs.statSync(f).size;
    const t0 = process.hrtime.bigint();
    let k; try { k = readKn5(f); r.parsed++; } catch (e) { r.refused.push(e.message.replace(/^.*?: /, '').slice(0, 80)); continue; } finally { r.readMs += Number(process.hrtime.bigint() - t0) / 1e6; }
    r.meshes += k.meshes.length;
    for (const m of k.meshes) {
      const km = /^\d+([A-Z]+)/i.exec(m.name); if (km) r.keys[km[1].toUpperCase()] = (r.keys[km[1].toUpperCase()] || 0) + 1;
      const kk = km && km[1].toUpperCase(); if (!kk || !valid.has(kk)) continue;
      r.roadMeshes++; byKey[kk] = byKey[kk] || [];
      for (let i = 0; i < m.idx.length; i += 3) { const p = (j) => [m.pos[m.idx[j] * 3], m.pos[m.idx[j] * 3 + 2]]; byKey[kk].push([p(i), p(i + 1), p(i + 2)]); }
    }
  }
  const mainKey = Object.keys(byKey).sort((p, q) => byKey[q].length - byKey[p].length)[0];
  const tris = process.env.MODE === 'main' ? (byKey[mainKey] || []) : Object.values(byKey).flat();
  Object.assign(r, { mode: process.env.MODE === 'main' ? 'the main road key only' : 'every valid-track surface', validKeys: Object.fromEntries(Object.entries(byKey).map(([k2, v2]) => [k2, v2.length])), mainKey, surfacesIni: !!sIni });
  r.roadTris = tris.length;
  // a 4 m grid of the road triangles (x, z)
  const G = 4, grid = new Map(), cell = (x, z) => `${Math.floor(x / G)},${Math.floor(z / G)}`;
  tris.forEach((t, i) => { const xs = t.map((q) => q[0]), zs = t.map((q) => q[1]); for (let x = Math.floor(Math.min(...xs) / G); x <= Math.floor(Math.max(...xs) / G); x++) for (let z = Math.floor(Math.min(...zs) / G); z <= Math.floor(Math.max(...zs) / G); z++) { const c = `${x},${z}`; if (!grid.has(c)) grid.set(c, []); grid.get(c).push(i); } });
  const inTri = (x, z, t) => { const [a, b, c] = t, s = (p, q) => (x - q[0]) * (p[1] - q[1]) - (p[0] - q[0]) * (z - q[1]); const d1 = s(a, b), d2 = s(b, c), d3 = s(c, a); return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0)); };
  const onRoad = (x, z) => (grid.get(cell(x, z)) || []).some((i) => inTri(x, z, tris[i]));
  const sh = readAiShape(fs.readFileSync(path.join(td, L, 'ai', 'fast_lane.ai'))), P = sh.points.map((q) => q.pos), n = P.length;
  const ratios = [], kn5W = [], aiW = []; let offRoad = 0;
  for (let k = 0; k < n; k += 25) {
    const f = [P[(k + 1) % n][0] - P[(k - 1 + n) % n][0], P[(k + 1) % n][2] - P[(k - 1 + n) % n][2]], fl = Math.hypot(f[0], f[1]), ax = f[1] / fl, az = -f[0] / fl;   // left, along the ground
    const at = (s) => onRoad(P[k][0] + ax * s, P[k][2] + az * s);
    if (!at(0)) { offRoad++; continue; }
    let lo = 0, hi = 0; while (lo > -80 && at(lo - 0.25)) lo -= 0.25; while (hi < 80 && at(hi + 0.25)) hi += 0.25;
    const w = hi - lo, e = sh.extra[k], wa = e.sideLeft + e.sideRight; kn5W.push(w); aiW.push(wa); ratios.push(wa / w);
  }
  const med = (v) => { const s = v.slice().sort((p, q) => p - q); return s.length ? s[s.length >> 1] : null; };
  Object.assign(r, { samples: ratios.length, offRoad, kn5WidthMed: med(kn5W), aiWidthMed: med(aiW), ratioMed: med(ratios), within5pct: ratios.filter((x) => Math.abs(x - 1) <= 0.05).length, mbRead: +(r.bytes / 1e6).toFixed(1) });
  delete r.bytes;
  out[a] = r;
}
console.log(JSON.stringify(out, null, 1));
