// start_height.js (pane B, L250 repair): how high a layout's start dummy sits above the road under it, by the page's own src/reference/road.js
// groundUnder, on the road pane O's reader keeps (tools/kn5.cjs readKn5, O's tight rule at adf307c: digits, then a valid key, then an end, a digit or a
// separator), for each reference in the LOCAL key (out/reference-key.json). Read only; prints numbers and aliases only, never a name.
// usage: node start_height.js
'use strict';
const fs = require('fs'), path = require('path');
const T = 'C:/Consonance/t180-wt-l243', { readKn5 } = require(T + '/tools/kn5.cjs'), { groundUnder } = require(T + '/src/reference/road.js');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks', key = JSON.parse(fs.readFileSync(T + '/out/reference-key.json', 'utf8'));
const out = [];
for (const a of Object.keys(key).filter((k) => /^reference track \d+$/.test(k))) {
  const td = path.join(AC, key[a].track), L = key[a].layout;
  const ini = [L ? `models_${L}.ini` : null, 'models.ini'].filter(Boolean).map((f) => path.join(td, f)).find((f) => fs.existsSync(f));
  const listed = ini ? [...fs.readFileSync(ini, 'utf8').matchAll(/^\s*FILE\s*=\s*(.+?)\s*$/gmi)].map((m) => path.join(td, m[1])) : [path.join(td, `${key[a].track}.kn5`)];
  const sIni = [path.join(td, L, 'data', 'surfaces.ini'), path.join(td, 'data', 'surfaces.ini')].find((x) => fs.existsSync(x));
  const valid = new Set(['ROAD', 'KERB']); if (sIni) for (const sec of fs.readFileSync(sIni, 'utf8').split(/^\s*\[/m)) { const k = /^\s*KEY\s*=\s*(\S+)/mi.exec(sec), v = /^\s*IS_VALID_TRACK\s*=\s*(\d)/mi.exec(sec); if (k && v && v[1] === '1') valid.add(k[1].toUpperCase()); }
  const batches = [], dummies = [];
  for (const f of listed.filter((x) => fs.existsSync(x))) {
    const k = readKn5(f); dummies.push(...(k.dummies || []));
    for (const m of k.meshes) { const r = /^\d+(.*)$/.exec(m.name); if (!r) continue; const up = r[1].toUpperCase(); if ([...valid].some((v) => up.startsWith(v) && !/\p{L}/u.test(up.charAt(v.length)))) batches.push({ positions: m.pos, indices: m.idx }); }
  }
  const s = dummies.find((d) => d.name.toUpperCase() === 'AC_START_0');
  const row = { alias: a, roadTriangles: batches.reduce((n, b) => n + b.indices.length / 3, 0), hasStart: !!s };
  if (s) {
    const t0 = process.hrtime.bigint(), y = groundUnder(batches, s.pos), ms = Number(process.hrtime.bigint() - t0) / 1e6;
    row.startAboveRoadM = y === null ? null : +(s.pos[1] - y).toFixed(3); row.groundUnderMs = +ms.toFixed(1);
    // and the AI line's first point (ai/fast_lane.ai: 16-byte header, then points of 20 bytes: x, y, z, length, id), for the gap O measured
    const ai = path.join(td, L, 'ai', 'fast_lane.ai');
    if (fs.existsSync(ai)) { const b = fs.readFileSync(ai); const p = [b.readFloatLE(16), b.readFloatLE(20), b.readFloatLE(24)]; row.startToLineFirstPointM = +Math.hypot(s.pos[0] - p[0], s.pos[2] - p[2]).toFixed(1); row.lineFirstPointAboveRoadM = +(p[1] - (groundUnder(batches, p) ?? NaN)).toFixed(3); }
  }
  out.push(row);
}
console.log(JSON.stringify(out, null, 1));
