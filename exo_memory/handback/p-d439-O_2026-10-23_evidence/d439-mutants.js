'use strict';
// D439 (O): each mutant breaks one property of D439's change to finish.js (the roll straight left out of the close when the roll is laid first; both orders of
// laying searched and the lower side load taken). test/core_finish_joints + core_finish_bank + core_finish must go red on each. Applied to the tree's file, run,
// restored (also on exit). Under the heavy-run lock. Reports applied / caught / NOT APPLIED.   node d439-mutants.js <tree> [mutant id prefix,...]
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]), ONLY = process.argv[3] ? process.argv[3].split(',') : null, FILE = 'src/core/finish.js';
require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'd439-mutants (finish.js mutated in turn: do not read this tree meanwhile)', tree: TREE });
const M = [
  ['K1 the roll straight laid first stays in the close', 'const shut = first ? window.slice(1) : window;', 'const shut = window;'],
  ['K2 the first closer found is taken (roll last first, as before)', 'if (found.length) return found.reduce((a, b) => (b.side < a.side ? b : a)).result;', 'if (found.length) return found[0].result;'],
  ['K3 the closer with the HIGHER side load is taken', '(b.side < a.side ? b : a)', '(b.side > a.side ? b : a)'],
  ['K4 the side load leaves out gravity', '(v * v * k[1] + G) * q.L[1]', '(v * v * k[1]) * q.L[1]'],
  ['K5 the side load reads the first piece on (the whole lap, not the closer)', 'side: sideLoad(out.result.doc, doc.pieces.length)', 'side: sideLoad(out.result.doc, 0)'],
  ['L1 sigma measured from the window start (D439 (d) undone at the head)', 'a = startOf.get(road[0]) + (U0[2] + U0[3] + U0[4]) / 3,', 'a = startOf.get(road[0]),'],
  ['L2 sigma ending at the start line (D439 (d) undone at the seam)', 'z = startOf.get(road[road.length - 1]) + (UL[nl - 1] + UL[nl] + UL[nl + 1]) / 3,', 'z = startOf.get(road[road.length - 1]) + last.length,'],
  ['L3 the cup eased over the close window only (the roll straight left out of it)', 'laid = cupHome(laid, window); res = closeBanked(laid, shut', 'laid = cupHome(laid, shut); res = closeBanked(laid, shut'],
  ['B4 every piece banked, upright or not (D434)', '    const up = uprightSet.has(p);', '    const up = true;'],
  ['B7 no bank at all (D434; anchored on the D439 call)', 'res = closeBanked(laid, shut, bank); } catch (err) {', 'res = close(laid, { window: shut }); } catch (err) {'],
].filter(([n]) => !ONLY || ONLY.some((o) => n.startsWith(o + ' ')));
let applied = 0, caught = 0, na = 0;
const f = path.join(TREE, FILE), src = fs.readFileSync(f, 'utf8');
process.on('exit', () => fs.writeFileSync(f, src));
for (const [name, from, to] of M) {
  const norm = src.replace(/\r\n/g, '\n');
  if (norm.split(from).length !== 2) { na++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++; const out = norm.replace(from, to); fs.writeFileSync(f, src.includes('\r\n') ? out.replace(/\n/g, '\r\n') : out);
  try {
    const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'test/core_finish_joints.test.js', 'test/core_finish_bank.test.js', 'test/core_finish.test.js'], { cwd: TREE, encoding: 'utf8', timeout: 30 * 60 * 1000 });
    const red = r.status !== 0; if (red) caught++;
    const failed = [...new Set((r.stdout.match(/^\s*not ok \d+ - row \d+[^\n]{0,40}/gm) || []).map((l) => l.trim().replace(/^not ok \d+ - /, '')))];
    console.log(`${red ? 'caught      ' : 'SURVIVED    '} ${name}${red ? `  (${failed.join('; ') || 'status ' + r.status})` : ''}`);
  } finally { fs.writeFileSync(f, src); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}`);
