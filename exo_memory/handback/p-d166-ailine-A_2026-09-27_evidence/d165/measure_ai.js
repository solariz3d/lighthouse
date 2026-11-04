// D166 measurement ONLY: does the recalled fast_lane.ai layout account for every byte of real files? Prints layout
// statistics and value ranges per field, never the points themselves. Usage: node measure_ai.js <list-file> <tracks-dir>
const fs = require('fs'), path = require('path');
const files = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/).filter(Boolean);
const root = process.argv[3];
const EXTRA = ['speed', 'gas', 'brake', 'latG', 'radius', 'sideLeft', 'sideRight', 'camber', 'direction', 'nx', 'ny', 'nz', 'length', 'fx', 'fy', 'fz', 'tag', 'grade'];
const rows = []; const agg = {}; const add = (k, v) => { const a = agg[k] || (agg[k] = { min: Infinity, max: -Infinity, n: 0, sum: 0 }); a.min = Math.min(a.min, v); a.max = Math.max(a.max, v); a.n++; a.sum += v; };
const checks = { lenMonotone: 0, lenNot: 0, idIsIndex: 0, idNot: 0, extraLenIsSegment: 0, extraLenIsCum: 0, extraLenOther: 0, fwdUnit: 0, fwdNot: 0, dirIsHeadingAtan2xz: 0, dirOther: 0, speedVsKmh: [] };
for (const rel of files) {
  const b = fs.readFileSync(path.join(root, rel)); let o = 0;
  const i32 = () => { const v = b.readInt32LE(o); o += 4; return v; }, f32 = () => { const v = b.readFloatLE(o); o += 4; return v; };
  const r = { rel: rel.replace(/^\.\//, '').replace(/\/[^/]+\/[^/]+$/, '').replace(/[^/]+/, 'T'), size: b.length };
  if (b.length < 16) { r.bad = 'tiny ' + b.length + ' B'; rows.push(r); continue; }
  r.version = i32(); r.n = i32(); r.lapTime = i32(); r.sampleCount = i32();
  if (r.version !== 7 || r.n <= 0 || 16 + r.n * 20 > b.length) { r.bad = 'header'; rows.push(r); continue; }
  const P = [];
  for (let k = 0; k < r.n; k++) { const x = f32(), y = f32(), z = f32(), len = f32(), id = i32(); P.push({ x, y, z, len, id }); }
  for (let k = 0; k < r.n; k++) { if (P[k].id === k) checks.idIsIndex++; else checks.idNot++; if (k && P[k].len >= P[k - 1].len) checks.lenMonotone++; else if (k) checks.lenNot++; }
  r.extraCount = i32();
  if (r.extraCount !== r.n) { r.bad = 'extraCount ' + r.extraCount; rows.push(r); continue; }
  for (let k = 0; k < r.n; k++) {
    const e = {}; for (const f of EXTRA) e[f] = f32();
    for (const f of EXTRA) add(f, e[f]);
    const nxt = P[(k + 1) % r.n], seg = Math.hypot(nxt.x - P[k].x, nxt.y - P[k].y, nxt.z - P[k].z);
    if (Math.abs(e.length - seg) < 0.05 * Math.max(seg, 0.01)) checks.extraLenIsSegment++; else if (Math.abs(e.length - P[k].len) < 0.01) checks.extraLenIsCum++; else checks.extraLenOther++;
    const fl = Math.hypot(e.fx, e.fy, e.fz); if (Math.abs(fl - 1) < 1e-3) checks.fwdUnit++; else checks.fwdNot++;
    if (fl > 0.5) { const hd = Math.atan2(e.fx, e.fz); const d = Math.abs(Math.atan2(Math.sin(e.direction - hd), Math.cos(e.direction - hd))); if (d < 0.05) checks.dirIsHeadingAtan2xz++; else checks.dirOther++; }
  }
  r.hasGrid = i32(); r.leftAfterHasGrid = b.length - o;
  rows.push(r);
}
const byGrid = {}; for (const r of rows) { const k = r.bad ? 'BAD ' + r.bad : `hasGrid=${r.hasGrid} left=${r.hasGrid === 0 ? r.leftAfterHasGrid : '(grid)'}`; byGrid[k] = (byGrid[k] || 0) + 1; }
const fields = {}; for (const [k, a] of Object.entries(agg)) fields[k] = { min: +a.min.toPrecision(5), max: +a.max.toPrecision(5), mean: +(a.sum / a.n).toPrecision(5) };
console.log(JSON.stringify({ files: rows.length, layouts: byGrid, lapTime: [...new Set(rows.map((r) => r.lapTime))].slice(0, 12), sampleCountEqN: rows.filter((r) => r.sampleCount === r.n).length,
  gridTail: rows.filter((r) => r.hasGrid === 1).slice(0, 3).map((r) => ({ n: r.n, left: r.leftAfterHasGrid })), checks, fields }, null, 1));
