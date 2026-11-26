// nostart_check.js (pane B, L250 repair): every installed layout with NO AI line, through the page's own code: its road (tools/kn5.cjs readKn5, O's
// tight rule at adf307c) and its start (the first AC_START_0, else the time line's middle, as kn5road.rs chooses), written as the native side's
// bytes (road.js encodeRoad), read back (decodeRoad) and placed (roadReference with no line, which sets the start down on the road under it).
// Read only. Prints numbers only: layouts are "layout N" in the local survey's order, never a name. Note: kn5road.rs also leaves out a model the
// ini places at a POSITION or ROTATION; this does not, so its counts may run a little over O's.
// usage: node nostart_check.js <survey.json>
'use strict';
const fs = require('fs'), path = require('path');
const T = 'C:/Consonance/t180-wt-l243', { readKn5 } = require(T + '/tools/kn5.cjs'), { encodeRoad, decodeRoad, roadReference } = require(T + '/src/reference/road.js');
const AC = 'C:/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/tracks';
const survey = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = [];
survey.forEach((row, i) => {
  if (row.ai !== false) return;
  const td = path.join(AC, row.track), L = row.layout || '';
  const ini = [L ? `models_${L}.ini` : null, 'models.ini'].filter(Boolean).map((f) => path.join(td, f)).find((f) => fs.existsSync(f));
  const listed = ini ? [...fs.readFileSync(ini, 'utf8').matchAll(/^\s*FILE\s*=\s*(.+?)\s*$/gmi)].map((m) => path.join(td, m[1])) : [path.join(td, `${row.track}.kn5`)];
  const sIni = [path.join(td, L, 'data', 'surfaces.ini'), path.join(td, 'data', 'surfaces.ini')].find((x) => fs.existsSync(x));
  const valid = new Set(['ROAD', 'KERB']); if (sIni) for (const sec of fs.readFileSync(sIni, 'utf8').split(/^\s*\[/m)) { const k = /^\s*KEY\s*=\s*(\S+)/mi.exec(sec), v = /^\s*IS_VALID_TRACK\s*=\s*(\d)/mi.exec(sec); if (k && v && v[1] === '1') valid.add(k[1].toUpperCase()); }
  const batches = [], dummies = [];
  for (const f of listed.filter((x) => fs.existsSync(x))) {
    const k = readKn5(f); dummies.push(...k.dummies);
    for (const m of k.meshes) { const r = /^\d+(.*)$/.exec(m.name); if (!r) continue; const up = r[1].toUpperCase(); if ([...valid].some((v) => up.startsWith(v) && !/\p{L}/u.test(up.charAt(v.length)))) batches.push({ positions: m.pos, indices: m.idx }); }
  }
  const find = (n) => dummies.find((d) => d.name.toUpperCase() === n);
  const S = find('AC_START_0'), Lt = find('AC_TIME_0_L'), Rt = find('AC_TIME_0_R');
  let start = null;
  if (S) { const f = S.fwd, l = Math.hypot(...f); start = { pos: S.pos, T: f.map((v) => v / l), from: 'AC_START_0' }; }
  else if (Lt && Rt) { const dx = Rt.pos[0] - Lt.pos[0], dz = Rt.pos[2] - Lt.pos[2], l = Math.hypot(dx, dz); start = { pos: Lt.pos.map((v, k) => (v + Rt.pos[k]) / 2), T: [dz / l, 0, -dx / l], from: 'AC_TIME_0' }; }
  const r = { layout: i + 1, triangles: batches.reduce((n, b) => n + b.indices.length / 3, 0), startFrom: start ? start.from : null };
  try {
    const bytes = encodeRoad(batches, start ? { start } : { start: null, noStart: 'none' });
    const t0 = process.hrtime.bigint(), road = decodeRoad(bytes), t1 = process.hrtime.bigint(), ref = roadReference(road, null), t2 = process.hrtime.bigint();
    Object.assign(r, { bytes: bytes.length, decodeMs: +(Number(t1 - t0) / 1e6).toFixed(1), placeMs: +(Number(t2 - t1) / 1e6).toFixed(1), placedBy: ref.placedBy, startAboveRoadM: ref.startAbove === null ? null : +ref.startAbove.toFixed(3) });
  } catch (e) { r.refused = `${e.code || ''}: ${e.message}`.slice(0, 160); }
  out.push(r);
});
const above = out.map((r) => r.startAboveRoadM).filter((v) => v !== null && v !== undefined).sort((a, b) => a - b);
console.log(JSON.stringify({ layouts: out.length, placed: out.filter((r) => r.placedBy).length, noRoadUnderStart: out.filter((r) => r.placedBy && r.startAboveRoadM === null).length, refused: out.filter((r) => r.refused).length,
  startAboveRoadM: above.length ? { min: above[0], median: above[above.length >> 1], max: above[above.length - 1] } : null, rows: out }, null, 1));
