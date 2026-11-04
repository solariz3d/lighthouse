'use strict';
// D440 (e)(f) (O): which RANK of the routes that pass keeps every rule already held? A probe copy of the tree's finish.js (written beside it as
// src/core/finish_rank_probe_o.js, deleted after, never committed) takes its rank from the environment:
//   LENF    within an order, the routes that pass are ranked among those whose planned length is at most LENF × the FIRST passing route's (0 = the first
//           passing route, as at dd2ae71; Infinity = all of them)
//   METRIC  'lat' (the peak lateral load, D439's sideLoad) or 'whole' (the peak |f|/g, the normal part included: the ruling's (f))
//   AF, AMETRIC  the same across the two orders (AF relative to the shorter of the two orders' picks; Infinity = D439's rule)
// Each config finishes the laps at stake and prints the route, the peak lateral and whole load on the closer, stations out, the mean lean, and the time.
//   node rank-probe.js <tree> <config name> [<config name> ...]   (configs below)
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const T = path.resolve(process.argv[2]), SRC = path.join(T, 'src/core/finish.js'), PROBE = path.join(T, 'src/core/finish_rank_probe_o.js');
const CONFIGS = {
  A: { LENF: 0, METRIC: 'lat', AF: Infinity, AMETRIC: 'lat' },       // dd2ae71 as committed
  B: { LENF: 1.25, METRIC: 'lat', AF: Infinity, AMETRIC: 'lat' },
  C: { LENF: 1.5, METRIC: 'lat', AF: Infinity, AMETRIC: 'lat' },
  D: { LENF: 1.5, METRIC: 'whole', AF: Infinity, AMETRIC: 'lat' },
  E: { LENF: 1.5, METRIC: 'whole', AF: Infinity, AMETRIC: 'whole' },
  F: { LENF: 1.25, METRIC: 'lat', AF: 1.25, AMETRIC: 'lat' },
  G: { LENF: Infinity, METRIC: 'whole', AF: Infinity, AMETRIC: 'whole' },
};
let s = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');
const rep = (a, b) => { if (s.split(a).length !== 2) throw new Error(`anchor not found once: ${a.slice(0, 80)}`); s = s.replace(a, b); };
const RANK = `const RANK = { LENF: Number(process.env.LENF), METRIC: process.env.METRIC, AF: Number(process.env.AF), AMETRIC: process.env.AMETRIC };\n`;
rep(`function closerLoad(doc, from) {`, `${RANK}function closerLoad(doc, from) {`);
rep(`  let side = 0, out = 0, curved = 0;`, `  let side = 0, out = 0, curved = 0, whole = 0;`);
rep(`    const km = Math.hypot(k[0], k[1], k[2]); if (km < 1 / 600) continue;`, `    whole = Math.max(whole, Math.hypot(v * v * k[0], v * v * k[1] + G, v * v * k[2]) / G);\n    const km = Math.hypot(k[0], k[1], k[2]); if (km < 1 / 600) continue;`);
rep(`  return { side, out, curved };`, `  return { side, out, curved, whole };`);
rep(`    let best = null, left = 0, worstRoad = null, out = null;`, `    let best = null, left = 0, worstRoad = null, out = null, firstLen = 0; const passed = [];`);
rep(`    for (const r0 of all) {\n      let laid, r = r0;`, `    for (const r0 of all) {\n      if (firstLen && !(r0.lengthM <= RANK.LENF * firstLen)) continue;\n      let laid, r = r0;`);
rep(`      const cand = ({ side: load.side,`, `      const cand = ({ side: load.side, whole: load.whole,`);
rep(`      return { passed: [cand] };`, `      if (!firstLen) firstLen = Math.max(1, r0.lengthM); passed.push(cand); continue;`);
rep(`    return { passed: [], fail:`, `    const key = (c) => (RANK.METRIC === 'whole' ? c.whole : c.side);\n    return { passed: passed.length ? [passed.reduce((a, b) => (key(b) < key(a) ? b : a))] : [], fail:`);
rep(`  if (found.length) return found.reduce((a, b) => (b.side < a.side ? b : a)).result;`,
  `  if (found.length) { const m0 = Math.min(...found.map((f) => f.result.plan.lengthM)), ak = (c) => (RANK.AMETRIC === 'whole' ? c.whole : c.side); return found.filter((f) => f.result.plan.lengthM <= RANK.AF * m0 || f.result.plan.lengthM === m0).reduce((a, b) => (ak(b) < ak(a) ? b : a)).result; }`);
fs.writeFileSync(PROBE, s);
process.on('exit', () => { try { fs.unlinkSync(PROBE); } catch (e) { /* gone */ } });
const run = `const path = require('path'), fs = require('fs'), T = ${JSON.stringify(T)}, D = require(path.join(T, 'src/core/document.js')), F = require(path.join(T, 'src/core/finish_rank_probe_o.js')), AD = require(path.join(T, 'src/core/adapter.js'));
const { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js')), { MACH6, G } = require(path.join(T, 'src/validate/limits.js'));
const DEG = Math.PI / 180, v = MACH6.designSpeedKmh / 3.6;
const p = (turnM, t, tail, roll) => () => { let e = D.createDoc('p'); e = extend(e, { length: 1000, family: 'bowl', first: { c: 10 } }); e = extendTurnBy(e, { length: turnM, targets: { kv: 0 } }, t * DEG); return extend(e, { length: tail, targets: { c: 35, phi: roll * DEG } }); };
const banked = (t, s, b) => () => { let d = D.createDoc('b'); d = extend(d, { length: 400 }); d = extendTurnBy(d, { length: 500 }, t * DEG); d = extend(d, { length: s }); d = extend(d, { length: 200, transition: 100, targets: { phi: b * DEG } }); return extend(d, { length: 100, targets: { kv: 0 } }); };
const quarter = () => { let d = D.createDoc('quarter'); d = extend(d, { length: 400 }); d = extendTurnBy(d, { length: 300 }, 90 * DEG); d = extend(d, { length: 600 }); d = extendTurnBy(d, { length: 300 }, 90 * DEG); d = extend(d, { length: 400 }); d = extendTurnBy(d, { length: 300 }, 90 * DEG); return extend(d, { length: 200 }); };
const fx = (f) => () => D.parse(fs.readFileSync(path.join(T, 'fixtures-d431', f), 'utf8'));
const LAPS = [['TEST TRACK 10', fx('testtrack10-open.t180track')], ['TEST 10', fx('test10-open.t180track')], ['core_finish row 6 (quarter)', quarter], ['core_finish row 12 (banked -150/200/54)', banked(-150, 200, 54)],
  ['(c) P 180/1200/10', p(1500, 180, 1200, 10)], ['(c) P 180/1200/30', p(1500, 180, 1200, 30)], ['(e) P 210/300/90', p(1500, 210, 300, 90)], ['(e) P 180/700/90', p(1500, 180, 700, 90)],
  ['(f) P 180/1200/90', p(1500, 180, 1200, 90)], ['(g) P 180/700/54', p(1500, 180, 700, 54)], ['D440 tight 180 over 400, 1200/10', p(400, 180, 1200, 10)]];
for (const [name, mk] of LAPS) {
  const open = mk(), t0 = Date.now(); let r;
  try { r = F.finishToStart(open); } catch (e) { console.log('  ' + name.padEnd(36) + ' REFUSED ' + e.code + ' ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s'); continue; }
  const sec = (Date.now() - t0) / 1000, { segments, path: pp } = AD.toPath(r.doc, { step: 2 }), ids = new Set(r.doc.pieces.slice(open.pieces.length).map((P) => P.id));
  let lat = 0, whole = 0, n = 0, out = 0, sum = 0;
  for (const q of pp.samples) { if (!ids.has(segments[q.seg].id)) continue; const k = q.kvec; lat = Math.max(lat, Math.abs((v * v * k[0] * q.L[0] + (v * v * k[1] + G) * q.L[1] + v * v * k[2] * q.L[2]) / G)); whole = Math.max(whole, Math.hypot(v * v * k[0], v * v * k[1] + G, v * v * k[2]) / G);
    const km = Math.hypot(...k); if (km < 1 / 600) continue; const l = Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[1] * k[1] + q.U[2] * k[2]) / km))) / DEG; n++; sum += l; if (l < -5) out++; }
  const P = r.plan; console.log('  ' + name.padEnd(36) + ' ' + (P.rollM ? (P.rollFirst ? 'FIRST' : 'LAST ') : '-    ') + ' ' + (P.word + ' R' + Math.round(P.radiusM)).padEnd(10) + String(P.lengthM).padStart(6) + ' m  lat ' + lat.toFixed(2) + ' g  whole ' + whole.toFixed(2) + ' g  out ' + out + '/' + n + '  lean ' + (sum / n).toFixed(1) + '°  ' + sec.toFixed(1) + ' s');
}`;
for (const name of process.argv.slice(3)) {
  const c = CONFIGS[name]; if (!c) { console.log(`== ${name}: no such config`); continue; }
  const o = spawnSync(process.execPath, ['-e', run], { encoding: 'utf8', env: { ...process.env, LENF: String(c.LENF), METRIC: c.METRIC, AF: String(c.AF), AMETRIC: c.AMETRIC }, maxBuffer: 1 << 26 });
  console.log(`== ${name} ${JSON.stringify(c)}\n${o.stdout}${o.stderr ? 'ERR ' + o.stderr.slice(-400) : ''}`);
}
