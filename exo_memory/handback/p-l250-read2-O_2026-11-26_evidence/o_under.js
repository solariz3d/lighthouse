// o_under.js (pane O, L250 second read; scratch): the road under every start and every AI line's first point on L, old groundUnder against new.
//   usage: node o_under.js <new tree> <old tree (b26db76's src, git archive)> <patch dir> <AC content\tracks>
// Names never printed: "layout N" in list_layouts order (pane E's start_survey.js numbering, whose patches these are). Read only.
// For each point (a layout's start from its kn5 header, and its AI line's first point where the line reads):
//   every road surface at its (x, z), relative to its height; those ABOVE it within 2 m (it sits a little under its road) and beyond; the closest surface to
//   the cut (|h - y|); old groundUnder (b26db76: the highest within 2 m above) and new (8c99a24: the highest at or below), and whether they differ.
// With a line, Road as the new roadReference places it: its start's height minus the road under the line's first point (0 is flush with his start).
// Then the latent case the new row hints at (it reads 1.9999999999999998 for 2): a point EXACTLY at a flat road's height, found by new groundUnder or not.
'use strict';
const fs = require('fs'), path = require('path');
const [NEW, OLD, PATCH, TRACKS] = process.argv.slice(2);
const N = require(path.join(path.resolve(NEW), 'src/reference/road.js')), O = require(path.join(path.resolve(OLD), 'src/reference/road.js'));
const { readAiShape, ribbonOf } = require(path.join(path.resolve(NEW), 'src/reference/ribbon.js'));
function listLayouts(tracks) {   // reference.rs's order (pane E's copy)
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
    for (const l of layouts) out.push(path.join(td, l, 'ai', 'fast_lane.ai'));
  }
  return out;
}
function heightsAt(batches, x, z) {   // every surface's height at (x, z): start_survey.js's heightsUnder
  const out = [];
  for (const { positions: P, indices: I } of batches) for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3, x0 = P[a], z0 = P[a + 2], x1 = P[b], z1 = P[b + 2], x2 = P[c], z2 = P[c + 2];
    const d = (z1 - z2) * (x0 - x2) + (x2 - x1) * (z0 - z2); if (d === 0) continue;
    const u = ((z1 - z2) * (x - x2) + (x2 - x1) * (z - z2)) / d, v = ((z2 - z0) * (x - x2) + (x0 - x2) * (z - z2)) / d, w = 1 - u - v;
    if (u < 0 || v < 0 || w < 0) continue;
    out.push(u * P[a + 1] + v * P[b + 1] + w * P[c + 1]);
  }
  return out;
}
const r3 = (v) => (v === null || v === undefined ? null : Math.round(v * 1000) / 1000);
const ai = listLayouts(TRACKS), rows = [];
for (let n = 1; n <= ai.length; n++) {
  const f = path.join(PATCH, `${n}.road`); if (!fs.existsSync(f)) { rows.push({ n, patch: 'none' }); continue; }
  const b = fs.readFileSync(f), road = N.decodeRoad(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
  const pts = [];
  if (road.meta.start) pts.push(['start', road.meta.start.pos]);
  let line = null;
  if (fs.existsSync(ai[n - 1])) {
    try { const raw = fs.readFileSync(ai[n - 1]), np = raw.readInt32LE(4), end = 16 + np * 20 + 4 + np * 72 + 4; line = ribbonOf(readAiShape(new Uint8Array(raw.buffer, raw.byteOffset, Math.min(end, raw.length)))); pts.push(['line', line.start.pos]); }
    catch (e) { rows.push({ n, what: 'line', err: e.code || String(e.message).slice(0, 40) }); }
  }
  for (const [what, p] of pts) {
    const hs = heightsAt(road.batches, p[0], p[2]), rel = hs.map((h) => h - p[1]);
    const gN = N.groundUnder(road.batches, p), gO = O.groundUnder(road.batches, p);
    const row = { n, what, surfaces: hs.length, aboveWithin2m: rel.filter((r) => r > 0 && r <= 2).map(r3), aboveBeyond2m: rel.filter((r) => r > 2).length,
      closestToCutM: hs.length ? r3(Math.min(...rel.map(Math.abs))) : null, oldTaken: gO === null ? null : r3(gO - p[1]), newTaken: gN === null ? null : r3(gN - p[1]), differ: gN !== gO };
    if (what === 'line') { const byLine = N.roadReference(road, line); row.roadByLineOffM = gN === null ? 'no road under' : r3(byLine.start.pos[1] - gN); row.lineAboveM = gN === null ? null : r3(p[1] - gN); }
    rows.push(row);
  }
}
for (const r of rows) console.log(JSON.stringify(r));
const pts = rows.filter((r) => r.what && !r.err), lines = pts.filter((r) => r.what === 'line'), starts = pts.filter((r) => r.what === 'start');
const stat = (a) => { const v = a.filter((x) => typeof x === 'number').sort((p, q) => p - q); return v.length ? { n: v.length, min: v[0], median: v[Math.floor((v.length - 1) / 2)], max: v[v.length - 1] } : { n: 0 }; };
// the latent case: a point exactly at a flat road's height (as an author might snap a start to its road), in random places on flat squares at many heights
let tried = 0, missed = 0, lower = 0; const ex = [];
for (const h of [0.1, 0.3, 1, 2, 2.2, 3.7, 9.5, 17.3, 41.9, 101.3, 255.7, 513.1]) {
  const hh = Math.fround(h);
  const sq = { positions: new Float32Array([-10, hh, -10, 10, hh, -10, 10, hh, 10, -10, hh, 10]), indices: new Uint16Array([0, 2, 1, 0, 3, 2]) };
  const below = { positions: new Float32Array([-10, hh - 6.8, -10, 10, hh - 6.8, -10, 10, hh - 6.8, 10, -10, hh - 6.8, 10]), indices: new Uint16Array([0, 2, 1, 0, 3, 2]) };
  let s = 12345 + Math.round(h * 100); const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648) * 19.8 - 9.9;
  for (let k = 0; k < 20000; k++) {
    const p = [rnd(), hh, rnd()], g = N.groundUnder([sq, below], p); tried++;
    if (g === null || g < hh - 1) { missed++; if (g !== null) lower++; if (ex.length < 3) ex.push({ h, at: p.map((v) => +v.toFixed(4)), got: g }); }
  }
}
console.log(JSON.stringify({
  layouts: ai.length, points: pts.length, starts: starts.length, lines: lines.length, lineErrors: rows.filter((r) => r.err).length,
  pointsWithRoadAboveWithin2m: pts.filter((r) => r.aboveWithin2m.length).map((r) => ({ n: r.n, what: r.what, aboveWithin2m: r.aboveWithin2m, oldTaken: r.oldTaken, newTaken: r.newTaken })),
  pointsWithRoadAboveBeyond2m: pts.filter((r) => r.aboveBeyond2m).length,
  oldAndNewDiffer: pts.filter((r) => r.differ).map((r) => ({ n: r.n, what: r.what, oldTaken: r.oldTaken, newTaken: r.newTaken })),
  noRoadUnderNew: pts.filter((r) => r.newTaken === null).map((r) => ({ n: r.n, what: r.what, surfaces: r.surfaces })),
  closestToCutM: stat(pts.map((r) => r.closestToCutM)),
  roadByLineOffM: stat(lines.map((r) => r.roadByLineOffM)), roadByLineNotFlush: lines.filter((r) => r.roadByLineOffM !== 0).map((r) => ({ n: r.n, off: r.roadByLineOffM })),
  lineAboveM: stat(lines.map((r) => r.lineAboveM)),
  exactOnFlatRoad: { tried, ownRoadMissed: missed, ofWhichALowerRoadTaken: lower, examples: ex },
}));
