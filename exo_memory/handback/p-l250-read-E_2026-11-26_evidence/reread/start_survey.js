// start_survey.js <tree> <patch dir> <AC content\tracks>  (pane E, L250 re-read; scratch, never committed; names never printed: "layout N" in list_layouts order)
// For every layout's road patch (e_scratch_start_patches: the road within 40 m of its start and of its AI line's first point, the header's start kept),
// through the tree's OWN road.js (decodeRoad, groundUnder, roadReference) and ribbon.js (readAiShape, ribbonOf), read only:
//   - every road surface under the start's (x, z), as heights relative to the start; which one groundUnder takes; a surface overhead within reach
//   - the bank at the start: the road's height 1 m either side across the start's way; the slope along it
//   - where his start lands on the reference road: the road's extent left and right of the start across its way (to 40 m, a step of 0.1 m, kept
//     while the road under the step is within 1 m of the height taken)
//   - with an AI line: its first point's height above the road under it (what Road sits below his road by, as placed by the line)
'use strict';
const fs = require('fs'), path = require('path');
const [TREE, PATCH, TRACKS] = process.argv.slice(2);
const { decodeRoad, groundUnder, roadReference } = require(path.join(path.resolve(TREE), 'src/reference/road.js'));
const { readAiShape, ribbonOf } = require(path.join(path.resolve(TREE), 'src/reference/ribbon.js'));
// list_layouts, as reference.rs orders it (key_census.js's copy, which matched 61 layouts and 46 with an AI line in the L250 read)
function listLayouts(tracks) {
  const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch (e) { return false; } };
  const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch (e) { return false; } };
  const names = fs.readdirSync(tracks).filter((n) => isDir(path.join(tracks, n)));
  names.sort((a, b) => { const x = a.toLowerCase(), y = b.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
  const out = [];
  for (const t of names) {
    const td = path.join(tracks, t), layouts = [];
    if (isDir(path.join(td, 'ai')) || isFile(path.join(td, 'ui', 'ui_track.json'))) layouts.push('');
    try { const ls = fs.readdirSync(path.join(td, 'ui')).filter((l) => isFile(path.join(td, 'ui', l, 'ui_track.json'))); ls.sort(); layouts.push(...ls); } catch (e) { /* no ui */ }
    try { const ls = fs.readdirSync(td).filter((l) => isDir(path.join(td, l, 'ai')) && l !== 'ai' && !layouts.includes(l)); ls.sort(); layouts.push(...ls); } catch (e) { /* */ }
    if (!layouts.length) layouts.push('');
    for (const l of layouts) out.push({ track: t, layout: l, ai: path.join(td, l, 'ai', 'fast_lane.ai') });
  }
  return out;
}
/** every road surface's height under (x, z), any height */
function heightsUnder(batches, x, z) {
  const out = [];
  for (const { positions: P, indices: I } of batches) for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3, x0 = P[a], z0 = P[a + 2], x1 = P[b], z1 = P[b + 2], x2 = P[c], z2 = P[c + 2];
    const d = (z1 - z2) * (x0 - x2) + (x2 - x1) * (z0 - z2); if (d === 0) continue;
    const u = ((z1 - z2) * (x - x2) + (x2 - x1) * (z - z2)) / d, v = ((z2 - z0) * (x - x2) + (x0 - x2) * (z - z2)) / d, w = 1 - u - v;
    if (u < 0 || v < 0 || w < 0) continue;
    out.push(u * P[a + 1] + v * P[b + 1] + w * P[c + 1]);
  }
  return out.sort((p, q) => q - p);
}
const r3 = (v) => (v === null || v === undefined ? null : Math.round(v * 1000) / 1000);
const all = listLayouts(TRACKS), rows = [];
for (let n = 1; n <= all.length; n++) {
  const f = path.join(PATCH, `${n}.road`); if (!fs.existsSync(f)) { rows.push({ n, patch: 'none' }); continue; }
  const b = fs.readFileSync(f), road = decodeRoad(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
  const L = all[n - 1], hasAi = fs.existsSync(L.ai), row = { n, ai: hasAi ? 1 : 0, start: road.meta.start ? road.meta.start.from : null };
  const s = road.meta.start;
  if (s) {
    const [x, y, z] = s.pos, hs = heightsUnder(road.batches, x, z), g = groundUnder(road.batches, s.pos);
    row.surfacesUnder = hs.length; row.heightsRel = hs.slice(0, 6).map((h) => r3(h - y)); row.taken = r3(g === null ? null : g - y); row.startAbove = r3(g === null ? null : y - g);
    row.overheadWithin2m = hs.filter((h) => h > y && h <= y + 2).length; row.overheadAbove2m = hs.filter((h) => h > y + 2).length;
    if (g !== null) {
      const fl = Math.hypot(s.T[0], s.T[2]), fx = s.T[0] / fl, fz = s.T[2] / fl, lx = -fz, lz = fx;   // across the way, in the ground plane
      const at = (d) => groundUnder(road.batches, [x + lx * d, g + 0.5, z + lz * d], 1.5);
      const hl = at(1), hr = at(-1); row.bankDeg = hl !== null && hr !== null ? r3(Math.atan2(hl - hr, 2) * 180 / Math.PI) : null;
      const ga = groundUnder(road.batches, [x + fx, g + 0.5, z + fz], 1.5), gb = groundUnder(road.batches, [x - fx, g + 0.5, z - fz], 1.5);
      row.slopeDeg = ga !== null && gb !== null ? r3(Math.atan2(ga - gb, 2) * 180 / Math.PI) : null;
      const reach = (sign) => { let d = 0, prev = g; for (let k = 1; k <= 400; k++) { const h = groundUnder(road.batches, [x + sign * lx * k * 0.1, prev + 0.5, z + sign * lz * k * 0.1], 1.5); if (h === null || Math.abs(h - prev) > 0.3) break; prev = h; d = k * 0.1; } return r3(d); };
      row.roadLeftM = reach(1); row.roadRightM = reach(-1);
      const placed = roadReference(road, null); row.placedY = r3(placed.start.pos[1] - g);
    }
  }
  if (hasAi) {
    try {
      const raw = fs.readFileSync(L.ai), n2 = raw.readInt32LE(4), end = 16 + n2 * 20 + 4 + n2 * 72 + 4;
      const line = ribbonOf(readAiShape(new Uint8Array(raw.buffer, raw.byteOffset, Math.min(end, raw.length))));
      const p0 = line.start.pos, g0 = groundUnder(road.batches, p0);
      row.lineAbove = r3(g0 === null ? null : p0[1] - g0);
      if (s) row.startToLineM = r3(Math.hypot(s.pos[0] - p0[0], s.pos[2] - p0[2]));
    } catch (e) { row.lineErr = e.code || String(e.message || e).slice(0, 60); }
  }
  rows.push(row);
}
for (const r of rows) console.log(JSON.stringify(r));
const noAi = rows.filter((r) => r.ai === 0), withAi = rows.filter((r) => r.ai === 1);
const stat = (a) => { const v = a.filter((x) => x !== null && x !== undefined).sort((p, q) => p - q); return v.length ? { n: v.length, min: v[0], median: v[Math.floor((v.length - 1) / 2)], max: v[v.length - 1] } : { n: 0 }; };
console.log(JSON.stringify({
  layouts: rows.length, noAi: noAi.length, withAi: withAi.length,
  noAiStartAbove: stat(noAi.map((r) => r.startAbove)), noAiNoRoadUnder: noAi.filter((r) => r.start && r.taken === null).length,
  noAiStacked: noAi.filter((r) => r.surfacesUnder > 1).map((r) => ({ n: r.n, heightsRel: r.heightsRel, taken: r.taken })),
  anyOverheadWithin2m: rows.filter((r) => r.overheadWithin2m > 0).map((r) => ({ n: r.n, ai: r.ai, heightsRel: r.heightsRel, taken: r.taken })),
  anyOverheadAbove2m: rows.filter((r) => r.overheadAbove2m > 0).map((r) => ({ n: r.n, ai: r.ai, heightsRel: r.heightsRel, taken: r.taken })),
  noAiBank: stat(noAi.map((r) => (r.bankDeg === null || r.bankDeg === undefined ? null : Math.abs(r.bankDeg)))), noAiSlope: stat(noAi.map((r) => (r.slopeDeg === null || r.slopeDeg === undefined ? null : Math.abs(r.slopeDeg)))),
  allBank: stat(rows.map((r) => (r.bankDeg === null || r.bankDeg === undefined ? null : Math.abs(r.bankDeg)))),
  noAiLeft: stat(noAi.map((r) => r.roadLeftM)), noAiRight: stat(noAi.map((r) => r.roadRightM)),
  withAiLineAbove: stat(withAi.map((r) => r.lineAbove)), withAiLineErr: withAi.filter((r) => r.lineErr).length,
}));
