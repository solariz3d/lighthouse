// o_follow_survey.js (pane O, L259 track 5, plan only; scratch): can a follow tool read Line alone, or must it read Road too?
// Registered first: registration.md beside this file. Read only: his AC folder is read, nothing is written there. Names never printed:
// "layout N" in list_layouts order (reference.rs, as o_under.js and E's start_survey.js number them).
//   node --max-old-space-size=8192 o_follow_survey.js <f3cd425 tree> <AC content/tracks> <out.json>
// Per layout with an AI line: a station every 20 m along the line; at each, the mesh's cross-section through the AI point (the tree's own
// tools/piecewise.cjs crossSection, then downBand where the walk reads under half the AI width, as meshCentreline does), against the line's
// own frame (src/reference/ribbon.js acrossAt, copied below because it is not exported). Also the in-page cost of Road: index build ms and ms
// per cross-section, on this machine, at BelowNormal, under the other seats' load (named in the output).
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* recorded below */ }
const [TREE, TRACKS, OUT] = process.argv.slice(2);
const PW = require(path.join(path.resolve(TREE), 'tools/piecewise.cjs'));
const { readKn5 } = require(path.join(path.resolve(TREE), 'tools/kn5.cjs'));
const { readAiShape, isClosed } = require(path.join(path.resolve(TREE), 'src/reference/ribbon.js'));
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a) => Math.hypot(a[0], a[1], a[2]), unit = (a) => { const l = len(a); return l > 0 ? [a[0] / l, a[1] / l, a[2] / l] : [0, 0, 0]; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const isDir = (p) => { try { return fs.statSync(p).isDirectory(); } catch (e) { return false; } };
const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch (e) { return false; } };

function listLayouts(tracks) {   // reference.rs's order (o_under.js's copy)
  const names = fs.readdirSync(tracks).filter((n) => isDir(path.join(tracks, n)));
  names.sort((a, b) => { const x = a.toLowerCase(), y = b.toLowerCase(); return x < y ? -1 : x > y ? 1 : 0; });
  const out = [];
  for (const t of names) {
    const td = path.join(tracks, t), layouts = [];
    if (isDir(path.join(td, 'ai')) || isFile(path.join(td, 'ui', 'ui_track.json'))) layouts.push('');
    try { const ls = fs.readdirSync(path.join(td, 'ui')).filter((l) => isFile(path.join(td, 'ui', l, 'ui_track.json'))); ls.sort(); layouts.push(...ls); } catch (e) { /* no ui */ }
    try { const ls = fs.readdirSync(td).filter((l) => isDir(path.join(td, l, 'ai')) && l !== 'ai' && !layouts.includes(l)); ls.sort(); layouts.push(...ls); } catch (e) { /* */ }
    if (!layouts.length) layouts.push('');
    for (const l of layouts) out.push({ t, td, l });
  }
  return out;
}
function validKeys(td, l) {   // kn5road.rs: ROAD and KERB, plus every IS_VALID_TRACK=1 key of the layout's surfaces.ini, else the track's
  const s = [l ? path.join(td, l, 'data', 'surfaces.ini') : null, path.join(td, 'data', 'surfaces.ini')].filter(Boolean).find(isFile);
  const valid = new Set(['ROAD', 'KERB']);
  if (s) for (const sec of fs.readFileSync(s, 'latin1').split(/^\s*\[/m)) { const k = /^\s*KEY\s*=\s*(\S+)/mi.exec(sec), f = /^\s*IS_VALID_TRACK\s*=\s*(\d)/mi.exec(sec); if (k && f && f[1] === '1') valid.add(k[1].toUpperCase()); }
  return [...valid];
}
function modelFiles(td, t, l) {
  const ini = [l ? path.join(td, `models_${l}.ini`) : null, path.join(td, 'models.ini')].filter(Boolean).find(isFile);
  return ini ? [...fs.readFileSync(ini, 'latin1').matchAll(/^\s*FILE\s*=\s*(.+?)\s*$/gmi)].map((m) => m[1]) : [t + '.kn5'];
}
const tight = (name, keys) => { if (!/^\d/.test(name)) return false; const rest = name.replace(/^\d+/, '').toUpperCase(); return keys.some((k) => rest.startsWith(k) && !/\p{L}/u.test(rest.charAt(k.length))); };
function acrossAt(fwd, e) {   // src/reference/ribbon.js acrossAt at f3cd425, verbatim in effect
  const L = unit([fwd[2], 0, -fwd[0]]), nS = [e.nx, e.ny, e.nz], nl = len(nS);
  let n; if (nl > 0.5 && nl < 1.5) n = unit(nS); else if (Number.isFinite(e.camber) && e.camber !== 0) n = [Math.sin(e.camber) * L[0], Math.cos(e.camber), Math.sin(e.camber) * L[2]]; else n = [0, 1, 0];
  const a = sub(L, n.map((v) => v * dot(L, n))), al = len(a); return al > 1e-6 ? [a[0] / al, a[1] / al, a[2] / al] : L;
}
const pct = (xs, p) => { if (!xs.length) return null; const s = xs.slice().sort((a, b) => a - b); return +s[Math.min(s.length - 1, Math.floor(p * (s.length - 1)))].toFixed(3); };

const layouts = listLayouts(TRACKS), rows = [];
let curTrack = null, meshCache = new Map();
const t0 = Date.now();
for (let n = 1; n <= layouts.length; n++) {
  const { t, td, l } = layouts[n - 1];
  if (t !== curTrack) { curTrack = t; meshCache = new Map(); if (global.gc) global.gc(); }
  const aiPath = path.join(td, l, 'ai', 'fast_lane.ai');
  if (!isFile(aiPath)) { rows.push({ n, ai: 'none' }); continue; }
  let shape; try { shape = readAiShape(fs.readFileSync(aiPath)); } catch (e) { rows.push({ n, ai: 'does not read', code: e.code || 'ERR' }); continue; }
  try {
    const keys = validKeys(td, l), T = []; let files = 0, missing = 0;
    for (const f0 of modelFiles(td, t, l)) {
      const f = path.join(td, f0); if (!isFile(f)) { missing++; continue; } files++;
      if (!meshCache.has(f)) meshCache.set(f, readKn5(f).meshes.filter((m) => /^\d/.test(m.name)).map((m) => ({ name: m.name, pos: m.pos, idx: m.idx })));
      for (const m of meshCache.get(f)) if (tight(m.name, keys)) for (let i = 0; i < m.idx.length; i += 3) { const q = []; for (const j of [m.idx[i], m.idx[i + 1], m.idx[i + 2]]) q.push(m.pos[j * 3], m.pos[j * 3 + 1], m.pos[j * 3 + 2]); T.push(q); }
    }
    if (!T.length) { rows.push({ n, road: 'none', files, missing }); continue; }
    const tIx = Date.now(), ix = PW.rayIndex(T), indexMs = Date.now() - tIx;
    const P = shape.points.map((p) => p.pos), E = shape.extra, np = P.length, closed = isClosed(P);
    const fwdAt = (k) => unit(sub(closed ? P[(k + 1) % np] : P[Math.min(np - 1, k + 1)], closed ? P[(k - 1 + np) % np] : P[Math.max(0, k - 1)]));
    const st = { midOff: [], lineOff: [], widthDiff: [], bankDiff: [], noRoad: 0, stations: 0, reread: 0 };
    let acc = 0, next = 0; const tCs = Date.now();
    for (let k = 0; k < np; k++) {
      if (k) acc += len(sub(P[k], P[k - 1]));
      if (acc < next) continue; next += 20; st.stations++;
      const f = fwdAt(k), a = acrossAt(f, E[k]), up = unit(cross(f, a)), sl = Math.max(0, E[k].sideLeft || 0), sr = Math.max(0, E[k].sideRight || 0), p = P[k];
      let cs = PW.crossSection(ix, p, f, up);
      if (sl + sr > 0 && (!cs || cs.width < 0.5 * (sl + sr))) { const b = PW.downBand(ix, p, f); if (b && (!cs || b.width > cs.width)) { cs = b; st.reread++; } }
      if (!cs) { st.noRoad++; continue; }
      const mid = [p[0] + a[0] * (sl - sr) / 2, p[1] + a[1] * (sl - sr) / 2, p[2] + a[2] * (sl - sr) / 2];
      st.midOff.push(len(sub(mid, cs.centre))); { const rl = dot(sub(cs.right, p), a), rr = -dot(sub(cs.left, p), a); /* crossSection side(+1) walks along cross(f, n) = -a, the ribbon RIGHT */ for (const d of [rl - sl, rr - sr]) { (st.sideD = st.sideD || []).push(Math.abs(d)); st.sides = (st.sides || 0) + 1; if (d > 2) st.wider = (st.wider || 0) + 1; if (d < -2) st.narrower = (st.narrower || 0) + 1; } } st.lineOff.push(len(sub(p, cs.centre))); st.widthDiff.push(Math.abs(sl + sr - cs.width));
      const nm = dot(cs.normal, up) < 0 ? cs.normal.map((v) => -v) : cs.normal; st.bankDiff.push(Math.acos(Math.max(-1, Math.min(1, dot(unit(nm), up)))) * 180 / Math.PI);
    }
    const csMs = Date.now() - tCs, read = st.stations - st.noRoad;
    const row = { sideDiffP50: pct(st.sideD || [], 0.5), sides: st.sides, wider: st.wider || 0, narrower: st.narrower || 0, n, tris: T.length, files, missing, points: np, stations: st.stations, noRoad: st.noRoad, reread: st.reread, indexMs, csMsPerStation: +(csMs / Math.max(1, st.stations)).toFixed(2),
      midOff: { p50: pct(st.midOff, 0.5), p95: pct(st.midOff, 0.95), max: pct(st.midOff, 1) }, lineOff: { p50: pct(st.lineOff, 0.5), p95: pct(st.lineOff, 0.95), max: pct(st.lineOff, 1) },
      widthDiff: { p50: pct(st.widthDiff, 0.5), p95: pct(st.widthDiff, 0.95), max: pct(st.widthDiff, 1) }, bankDiff: { p50: pct(st.bankDiff, 0.5), p95: pct(st.bankDiff, 0.95), max: pct(st.bankDiff, 1) } };
    row.lineAloneServes = read > 0 && row.midOff.p95 <= 1.0 && row.widthDiff.p95 <= 2.0 && row.bankDiff.p95 <= 3.0 && st.noRoad <= 0.02 * st.stations;
    rows.push(row);
  } catch (e) { rows.push({ n, err: String(e && e.message || e).slice(0, 60) }); }
  process.stderr.write(`layout ${n}/${layouts.length} ${((Date.now() - t0) / 1000).toFixed(0)} s\n`);
}
const read = rows.filter((r) => r.midOff), serve = read.filter((r) => r.lineAloneServes);
const all = (k, q) => pct(read.map((r) => r[k][q]), 0.5);
const summary = {
  layouts: layouts.length, withAiLine: rows.filter((r) => r.ai !== 'none').length, read: read.length, notRead: rows.filter((r) => r.err || r.ai === 'does not read' || r.road === 'none').map((r) => ({ n: r.n, why: r.err || r.ai || r.road })),
  lineAloneServesOn: `${serve.length} of ${read.length}`, rule: 'Line alone only if it serves on at least 90% of the layouts that read (registration.md)', verdict: read.length && serve.length >= 0.9 * read.length ? 'Line alone serves' : 'both',
  medianOfLayoutP95: { midOff: all('midOff', 'p95'), lineOff: all('lineOff', 'p95'), widthDiff: all('widthDiff', 'p95'), bankDiff: all('bankDiff', 'p95') },
  layoutsFailing: { midOff: read.filter((r) => r.midOff.p95 > 1.0).length, widthDiff: read.filter((r) => r.widthDiff.p95 > 2.0).length, bankDiff: read.filter((r) => r.bankDiff.p95 > 3.0).length, noRoad: read.filter((r) => r.noRoad > 0.02 * r.stations).length },
  cost: { trisMax: Math.max(...read.map((r) => r.tris)), indexMsMedian: pct(read.map((r) => r.indexMs), 0.5), indexMsMax: Math.max(...read.map((r) => r.indexMs)), csMsPerStationMedian: pct(read.map((r) => r.csMsPerStation), 0.5), csMsPerStationMax: Math.max(...read.map((r) => r.csMsPerStation)) },
  priority: (() => { try { return os.getPriority(0); } catch (e) { return 'unknown'; } })(), node: process.version, wallS: Math.round((Date.now() - t0) / 1000),
};
fs.writeFileSync(OUT, JSON.stringify({ summary, rows }, null, 1));
console.log(JSON.stringify(summary));
