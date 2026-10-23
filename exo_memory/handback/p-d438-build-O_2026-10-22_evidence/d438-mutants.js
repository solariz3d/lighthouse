'use strict';
// D438 build (O): each mutant breaks one property of the closer's joints, its cup or its bank (finish.js bankPlan / cupHome / the roll's length; and D434's
// B1–B7 again, their anchors moved to the D438 code where it changed). test/core_finish_joints.test.js + test/core_finish_bank.test.js must go red on each.
// Applied to the tree's file, run, restored (also on exit). Under the heavy-run lock. Reports applied / caught / NOT APPLIED.
//   node d438-mutants.js <tree> [mutant id prefix,...]
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]), ONLY = process.argv[3] ? process.argv[3].split(',') : null, FILE = 'src/core/finish.js';
require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'd438-mutants (finish joints + bank rows)', tree: TREE });
const M = [
  ['J1 no acceleration limit', 'const BANK_ACCEL = 2e-4,', 'const BANK_ACCEL = 1e6,'],
  ['J2 the acceleration projection moves the pins', '.filter(([x]) => !x.pinned), nn', '.filter(() => true), nn'],
  ['J3 the limits act on the added bank only (the laid bank ignored)', 'l: laid.pieces[p].channels.phi[i], t:', 'l: 0, t:'],
  ['J4 the roll straight laid by its rate only (not long enough for the acceleration)', 'ROLL_ACCEL_FIT = 1.5;', 'ROLL_ACCEL_FIT = 0;'],
  ['J5 no cup home (the call removed)', 'try { laid = cupHome(laid, window); res = closeBanked(', 'try { res = closeBanked('],
  ['J6 the cup eased linearly, not by smootherstep', 'return q * q * q * (10 - 15 * q + 6 * q * q); };', 'return q; };'],
  ['J7 half the cup brought home', 'delta = F.channels.c[0] - D.pieceEnd(last).c.v;', 'delta = (F.channels.c[0] - D.pieceEnd(last).c.v) / 2;'],
  ['J8 the cup ignores the joint slope rule', 'B[0] = A[na - 1]; B[1] = B[0] + (hB / hA) * (A[na - 1] - A[na - 2]); } });\n  return D.checkDoc({ ...laid,', '} });\n  return D.checkDoc({ ...laid,'],
  ['J9 one sweep only', 'BANK_SWEEPS = 400,', 'BANK_SWEEPS = 1,'],
  ['J10 the rate passes keep no laid rate (cap without the laid span)', 'const cap = (a, b) => Math.max(rate * (b.s - a.s), Math.abs(b.l - a.l));', 'const cap = (a, b) => rate * (b.s - a.s);'],
  ['B1 the bank leans the wrong way', 'const bankOf = (k, share) => -share * Math.atan(', 'const bankOf = (k, share) => share * Math.atan('],
  ['B2 sized from the laid route only (no second pass)', '    res = close(banked({ ...first.doc, closed: false }, bankPlan(first.doc, window, share, uprightSet, laid), plan1), { window });', '    res = first;'],
  ['B3 the pins are moved by the rate passes', '  for (let k = 1; k < seq.length; k++) { if (seq[k].pinned) continue; const d = cap(', '  for (let k = 1; k < seq.length; k++) { const d = cap('],
  ['B4 every piece banked, upright or not', '    const up = uprightSet.has(p);', '    const up = true;'],
  ['B5 no rate limit', 'const BANK_SHARE = 0.75, BANK_TRIES = 3, BANK_ROLL = 0.9,', 'const BANK_SHARE = 0.75, BANK_TRIES = 3, BANK_ROLL = 1e6,'],
  ['B6 half the share', 'const BANK_SHARE = 0.75, BANK_TRIES = 3, BANK_ROLL = 0.9,', 'const BANK_SHARE = 0.5, BANK_TRIES = 3, BANK_ROLL = 0.9,'],
  ['B7 no bank at all (the call reverted)', 'res = closeBanked(laid, window, bank); } catch (err) {', 'res = close(laid, { window }); } catch (err) {'],
].filter(([n]) => !ONLY || ONLY.some((o) => n.startsWith(o + ' ')));
let applied = 0, caught = 0, na = 0;
const f = path.join(TREE, FILE), src = fs.readFileSync(f, 'utf8');
process.on('exit', () => fs.writeFileSync(f, src));
for (const [name, from, to] of M) {
  const norm = src.replace(/\r\n/g, '\n');
  if (norm.split(from).length !== 2) { na++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++; const out = norm.replace(from, to); fs.writeFileSync(f, src.includes('\r\n') ? out.replace(/\n/g, '\r\n') : out);
  try {
    const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'test/core_finish_joints.test.js', 'test/core_finish_bank.test.js'], { cwd: TREE, encoding: 'utf8', timeout: 30 * 60 * 1000 });
    const red = r.status !== 0; if (red) caught++;
    const failed = [...new Set((r.stdout.match(/^\s*not ok \d+ - row \d+[^\n]{0,40}/gm) || []).map((l) => l.trim().replace(/^not ok \d+ - /, '')))];
    console.log(`${red ? 'caught      ' : 'SURVIVED    '} ${name}${red ? `  (${failed.join('; ') || 'status ' + r.status})` : ''}`);
  } finally { fs.writeFileSync(f, src); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}`);
