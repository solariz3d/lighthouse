'use strict';
// D166 re-dispatch (pane E): mutation pass over src/validate/{limits,jumps,index}.js against test/validate*.test.js.
// One exact-string replacement per mutant (exactly one match, else NOT APPLIED); each file restored in a finally.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process'), crypto = require('crypto');
const REPO = 'C:/Users/nname/Desktop/t180-track-builder';
const F = { limits: 'src/validate/limits.js', jumps: 'src/validate/jumps.js', index: 'src/validate/index.js' };
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const M = [
  // limits: each number off its citation
  ['limits', 'stop 20 → 25', 'suspensionStopG: 20,', 'suspensionStopG: 25,'],
  ['limits', 'proven 90 → 60 (the withdrawn line)', 'provenG: 90,', 'provenG: 60,'],
  ['limits', 'jump falls 3.2 → 3.3', 'jumpG: Object.freeze([3.2, 6.3]),', 'jumpG: Object.freeze([3.3, 6.3]),'],
  ['limits', 'jump falls: one landing only', 'jumpG: Object.freeze([3.2, 6.3]),', 'jumpG: Object.freeze([3.2]),'],
  ['limits', 'reach 10° → 15°', 'downDeg: 10,', 'downDeg: 15,'],
  ['limits', 'reach fall 6.5 → 3.2', 'fallG: 6.5,', 'fallG: 3.2,'],
  ['limits', 'seam 5.9 → 1.1', 'seamP90Deg: 5.9,', 'seamP90Deg: 1.1,'],
  ['limits', 'stacked 2 → 1', 'stackedM: 2,', 'stackedM: 1,'],
  ['limits', 'steep 50 → 60', 'steepDeg: 50,', 'steepDeg: 60,'],
  ['limits', 'vmax 745 → 800', 'vmaxKmh: 745,', 'vmaxKmh: 800,'],
  ['limits', 'G 9.81 → 9.8', 'const G = 9.81;', 'const G = 9.8;'],
  ['limits', 'reach drop without the fall term', '+ 0.5 * reach.fallG * G * (dist / kmh(reach.minTakeoffKmh)) ** 2', ''],
  // jumps
  ['jumps', 'flight: cos² dropped', 'return x * Math.tan(thetaRad) - gEff * G * x * x / (2 * v * v * c * c);', 'return x * Math.tan(thetaRad) - gEff * G * x * x / (2 * v * v);'],
  ['jumps', 'minSpeed: climb ignored', 'const reach = D * Math.tan(thetaRad) - dh;', 'const reach = D * Math.tan(thetaRad);'],
  ['jumps', 'minSpeed: unmakeable not detected', 'if (!(reach > 0)) return Infinity;', ''],
  ['jumps', 'clear: > instead of >=', 'v >= vmin;', 'v > vmin * 1.001;'],
  ['jumps', 'minSpeed: the easier landing binds', 'minSpeed: Math.max(...landings.map((l) => l.minSpeed)),', 'minSpeed: Math.min(...landings.map((l) => l.minSpeed)),'],
  ['jumps', 'reachable always true', 'reachable: drop <= reachDrop(D, reach),', 'reachable: true,'],
  ['jumps', 'touchdown not interpolated', 'x = fq === fp ? p.x : q.x + (p.x - q.x) * fq / (fq - fp);', 'x = p.x;'],
  // index: the load
  ['index', 'load: gravity sign flipped', 'mul(p.T, aT)), [0, G, 0]);', 'mul(p.T, aT)), [0, -G, 0]);'],
  ['index', 'load: lateral line radius ignored', 'mul(p.kvec, v * v / margin)', 'mul(p.kvec, v * v)'],
  ['index', 'load: along-track accel dropped', 'add(mul(p.kvec, v * v / margin), mul(p.T, aT))', 'mul(p.kvec, v * v / margin)'],
  ['index', 'amber: >= proven', 'if (line.fN_g > car.provenG) raw.pts.push', 'if (line.fN_g > car.provenG - 1) raw.pts.push'],
  ['index', 'amber on fLat instead of fN', 'if (line.fN_g > car.provenG) raw', 'if (line.fLat_g > car.provenG) raw'],
  ['index', 'info: > instead of >=', 'else if (line.fN_g >= car.suspensionStopG) raw.pts.push', 'else if (line.fN_g > car.suspensionStopG + 0.05) raw.pts.push'],
  ['index', 'fold: < instead of <=', 'if (margin <= 0) { raw.pts.push', 'if (margin < -0.001) { raw.pts.push'],
  ['index', 'fold check removed', "if (margin <= 0) { raw.pts.push({ i, kind: 'red', s: p.s, u, reason: 'fold', worst: -margin }); continue; }", 'if (margin <= 0) continue;'],
  ['index', 'seam check removed', 'if (deg > car.seamP90Deg) raw.pts.push', 'if (false) raw.pts.push'],
  ['index', 'gap: jump gaps flagged too', "g.word !== 'jump' && !(!path.closed", "!(!path.closed"],
  ['index', 'gap: open head not exempt', "&& !(!path.closed && j === lastSeg)) raw.segReds.push", ') raw.segReds.push'],
  ['index', 'hole check removed', '> (S[i + 1].s - S[i].s) * 1.5 + 1e-6) raw.pts.push', '> Infinity) raw.pts.push'],
  ['index', 'soft-collision check removed', "if (opts.softCollision === false) red.push", 'if (false) red.push'],
  ['index', 'WALL wall-ride check removed', "g.word === 'wall-ride' && /^WALL/i.test(profiles[j].material)", 'false'],
  ['index', 'steep: CSP flag ignored', 'if (opts.csp === false) { const up', 'if (true) { const up'],
  ['index', 'steep check removed', "raw.pts.push({ i, kind: 'red', s: p.s, u, reason: 'steep-without-raycast', worst: Math.acos(up) / DEG });", ''],
  ['index', 'stacked: separation ignored', 'if (ds < sep || dist >= cell) continue;', 'if (dist >= cell) continue;'],
  ['index', 'stacked check removed', '  stacked(S, isRoad, profiles, path, car, opts, from, raw.stacked, rederive);', ''],
  ['index', 'edit: stale stack carried (partner ignored)', 'if (e.p < from) raw.stacked.set(k, { ...e }); else rederive.add(e.i);', 'raw.stacked.set(k, { ...e });'],
  ['index', 'edit: dropped stations not re-queried', 'if (pt.i < from && !rederive.has(pt.i)) continue;', 'if (pt.i < from) continue;'],
  ['index', 'buildMesh folds ignored', "for (const f of opts.folds) red.push", 'for (const f of []) red.push'],
  ['index', 'lap: leaves-surface removed', "if (l.u === 0 && l.fN_g < 0) where.push", 'if (false) where.push'],
  ['index', 'lap: jump failures ignored', "for (const L of jp.landings) if (!L.caught) where.push", 'for (const L of jp.landings) if (false) where.push'],
  ['index', 'lap: open path proves', "if (!path.closed) lap = { ok: null, reason: 'open' };", 'if (false) lap = null;'],
  ['index', 'lapsim: gravity along T ignored', 'const along = car.accel - G * (a.T[1] + b.T[1]) / 2;', 'const along = car.accel;'],
  ['index', 'lapsim: no speed cap', 'if (cur > vmax) cur = vmax;', ''],
  ['index', 'revalidate: no look-back', 'from = Math.max(0, from - 1);', ''],
  ['index', 'segment reds: carried segment re-checked one too few', 'const fromSeg = S[Math.min(from, n - 1)].seg,', 'const fromSeg = S[Math.min(from, n - 1)].seg + 1,'],
  ['index', 'revalidate: carries a station too many', 'for (const l of carried.lines) if (l.i < from)', 'for (const l of carried.lines) if (l.i <= from)'],
  ['index', 'revalidate: carried stacked kept past the cut', 'for (const [k, e] of carried.stacked) { if (e.i >= from) continue;', 'for (const [k, e] of carried.stacked) {'],
  ['index', 'stacked: only the new side marked', 'mark(pt, cell - dist, o.i); mark(o, cell - dist, pt.i);', 'mark(pt, cell - dist, o.i);'],
  ['index', 'stacked: first hit kept, not the deepest', 'if (!e || worst > e.worst || (worst === e.worst && pt.u < e.u))', 'if (!e)'],
  ['index', 'revalidate: closed not re-validated', 'if (!prev || !prev._raw || path.closed) return validate', 'if (!prev || !prev._raw) return validate'],
  ['index', 'revalidate: speed-model change ignored', 'if (speedProfile(path, segments, car, opts).from !== prev._raw.speedFrom) return validate(path, segments, opts);', ''],
  ['index', 'ranges: order not total', 'a.s - b.s || uu(a) - uu(b)', 'a.s - b.s'],
  ['index', 'design speed not preferred', "if (road.length && road.every((g) => Number.isFinite(g.speed) && g.speed > 0)) {", 'if (false) {'],
  ['index', 'sources dropped', 'source: SRC[f.reason],', 'source: undefined,'],
];
const orig = Object.fromEntries(Object.entries(F).map(([k, f]) => [k, fs.readFileSync(path.join(REPO, f))]));
let applied = 0, caught = 0, notApplied = 0; const rows = [];
for (const [which, name, from, to] of M) {
  const text = orig[which].toString('utf8'), n = text.split(from).length - 1;
  if (n !== 1) { notApplied++; rows.push(`NOT APPLIED (${n} matches)  ${which}: ${name}`); continue; }
  try {
    fs.writeFileSync(path.join(REPO, F[which]), text.replace(from, to));
    const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', 'test/validate.test.js', 'test/validate_jumps.test.js', 'test/validate_incremental.test.js'], { cwd: REPO, encoding: 'utf8', timeout: 180000 });
    applied++; const failed = r.status !== 0; if (failed) caught++;
    rows.push(`${failed ? 'caught  ' : 'SURVIVED'}  ${which}: ${name}`);
  } finally { fs.writeFileSync(path.join(REPO, F[which]), orig[which]); }
}
let ok = true; for (const [k, f] of Object.entries(F)) if (sha(fs.readFileSync(path.join(REPO, f))) !== sha(orig[k])) ok = false;
console.log(rows.join('\n'));
console.log(`\napplied ${applied} / caught ${caught} / NOT APPLIED ${notApplied} (of ${M.length}); files restored byte-exact: ${ok ? 'yes' : 'NO'}`);
if (!ok) process.exitCode = 2;
