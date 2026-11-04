'use strict';
// D443 (O): does a straight onto the start, long enough for the bank's ramp, mend the seam dip? A probe copy of the tree's finish.js (written beside it as
// src/core/finish_seam_probe_o.js, deleted after, never committed) gives every route without a laid-last roll a straight of SEAM metres onto the start (aimed
// that far behind it, as a roll laid last is). Each SEAM value finishes P's pitched lap(s) and prints the route, length and the closer's stations out.
//   node seam-probe.js <tree> <kv> <tail> <roll> <seam m> [<seam m> ...]
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const T = path.resolve(process.argv[2]), [kv, tail, roll] = process.argv.slice(3, 6).map(Number), SEAMS = process.argv.slice(6).map(Number);
const SRC = path.join(T, 'src/core/finish.js'), PROBE = path.join(T, 'src/core/finish_seam_probe_o.js');
let s = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');
const a = 'laidRoll = first ? null : roll;'; if (s.split(a).length !== 2) throw new Error('anchor');
s = s.replace(a, 'laidRoll = first || !roll ? (Number(process.env.SEAM) > 0 ? { bank: first ? roll.bank : bank, lengthM: Number(process.env.SEAM) } : null) : roll;');
fs.writeFileSync(PROBE, s); process.on('exit', () => { try { fs.unlinkSync(PROBE); } catch (e) { /* gone */ } });
const run = `const path = require('path'), T = ${JSON.stringify(T)}, D = require(path.join(T, 'src/core/document.js')), AD = require(path.join(T, 'src/core/adapter.js')), F = require(path.join(T, 'src/core/finish_seam_probe_o.js'));
const { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js')), DEG = Math.PI / 180;
let d = D.createDoc('p'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: 1500, targets: { kv: 0 } }, 180 * DEG);
d = extend(d, { length: 300, targets: { kv: ${kv} } }); d = extend(d, { length: 100, targets: { kv: 0 } });
const open = extend(d, { length: ${tail}, targets: { c: 35, phi: ${roll} * DEG } });
try { const r = F.finishToStart(open), { segments, path: p } = AD.toPath(r.doc, { step: 2 }), ids = new Set(r.doc.pieces.slice(open.pieces.length).map((P) => P.id)); let n = 0, out = 0;
  for (const q of p.samples) { if (!ids.has(segments[q.seg].id)) continue; const k = q.kvec, km = Math.hypot(...k); if (km < 1 / 600) continue; n++; if (Math.asin(Math.max(-1, Math.min(1, (q.U[0] * k[0] + q.U[1] * k[1] + q.U[2] * k[2]) / km))) < -5 * DEG) out++; }
  console.log(r.plan.report.slice(0, 150) + ' | out ' + out + '/' + n); } catch (e) { console.log('REFUSED ' + e.code + ' ' + String(e.message).slice(0, 150)); }`;
for (const seam of SEAMS) { const o = spawnSync(process.execPath, ['-e', run], { encoding: 'utf8', env: { ...process.env, SEAM: String(seam) } }); console.log(`SEAM ${seam}: ${o.stdout.trim()}${o.stderr ? ' ERR ' + o.stderr.slice(-300) : ''}`); }
