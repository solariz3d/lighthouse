// roadbytes.js (L250): a reference's road as read_reference_road's bytes, for the pictures' stand-in native side, made in node from the same kn5 files
// by tools/kn5.cjs readKn5 under pane O's rule (kn5road.rs header): the layout's models_<layout>.ini, else models.ini, else <track>.kn5; AC's ROAD and
// KERB plus every surfaces.ini KEY with IS_VALID_TRACK=1; a mesh is a surface when its name is digits and then the key ("starts with").
// Written with src/reference/road.js encodeRoad. Prints counts only, never a name. usage: node roadbytes.js 'reference track 1' <out file>
const fs = require('fs'), path = require('path');
const T = 'C:/Consonance/t180-wt-l243', { readKn5 } = require(T + '/tools/kn5.cjs'), { encodeRoad } = require(T + '/src/reference/road.js');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks', key = JSON.parse(fs.readFileSync(T + '/out/reference-key.json', 'utf8'));
const a = process.argv[2] || 'reference track 1', out = process.argv[3], td = path.join(AC, key[a].track), L = key[a].layout;
const ini = [L ? `models_${L}.ini` : null, 'models.ini'].filter(Boolean).map((f) => path.join(td, f)).find((f) => fs.existsSync(f));
const listed = ini ? [...fs.readFileSync(ini, 'utf8').matchAll(/^\s*FILE\s*=\s*(.+?)\s*$/gmi)].map((m) => path.join(td, m[1])) : [path.join(td, `${key[a].track}.kn5`)];
const kn5s = listed.filter((f) => fs.existsSync(f));
const sIni = [path.join(td, L, 'data', 'surfaces.ini'), path.join(td, 'data', 'surfaces.ini')].find((x) => fs.existsSync(x));
const valid = new Set(['ROAD', 'KERB']); if (sIni) for (const sec of fs.readFileSync(sIni, 'utf8').split(/^\s*\[/m)) { const k = /^\s*KEY\s*=\s*(\S+)/mi.exec(sec), v = /^\s*IS_VALID_TRACK\s*=\s*(\d)/mi.exec(sec); if (k && v && v[1] === '1') valid.add(k[1].toUpperCase()); }
const keys = [...valid];
const batches = []; let tris = 0, verts = 0;
const t0 = process.hrtime.bigint();
for (const f of kn5s) for (const m of readKn5(f).meshes) {
  const rest = /^\d+(.*)$/.exec(m.name); if (!rest) continue;
  const up = rest[1].toUpperCase(); if (!keys.some((k) => up.startsWith(k))) continue;
  batches.push({ positions: m.pos, indices: m.idx }); tris += m.idx.length / 3; verts += m.pos.length / 3;
}
const ms = Number(process.hrtime.bigint() - t0) / 1e6;
const bytes = encodeRoad(batches, { files: kn5s.length, missing: listed.length - kn5s.length, meshes: batches.length, surfaces: sIni ? (sIni.includes(path.join(L, 'data')) && L ? 'layout' : 'track') : 'defaults' });
if (out) fs.writeFileSync(out, bytes);
console.log(JSON.stringify({ alias: a, files: kn5s.length, missing: listed.length - kn5s.length, meshes: batches.length, triangles: tris, vertices: verts, validKeys: keys.length, bytes: bytes.length, readMs: Math.round(ms) }));
