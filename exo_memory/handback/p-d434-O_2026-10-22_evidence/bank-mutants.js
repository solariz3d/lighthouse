'use strict';
// D434 build (O): each mutant breaks one property of the closer's bank (finish.js bankPlan / closeBanked); test/core_finish_bank.test.js must go red on every one.
// Applied to the tree's file, run, restored. Reports applied / caught / NOT APPLIED.   node bank-mutants.js <tree>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = process.argv[2], FILE = 'src/core/finish.js';
const M = [
  ['B1 the bank leans the wrong way', 'const bankOf = (k, share) => -share * Math.atan(', 'const bankOf = (k, share) => share * Math.atan('],
  ['B2 sized from the laid route only (no second pass)', '    res = close(banked({ ...first.doc, closed: false }, bankPlan(first.doc, window, share, uprightSet), plan1), { window });', '    res = first;'],
  ['B3 the pins are moved by the passes', '  for (let k = 1; k < seq.length; k++) { if (seq[k].pinned) continue;', '  for (let k = 1; k < seq.length; k++) {'],
  ['B4 every piece banked, upright or not', '    const up = uprightSet.has(p);', '    const up = true;'],
  ['B5 no rate limit', 'const BANK_SHARE = 0.75, BANK_TRIES = 3, BANK_ROLL = 0.9,', 'const BANK_SHARE = 0.75, BANK_TRIES = 3, BANK_ROLL = 1e6,'],
  ['B6 half the share', 'const BANK_SHARE = 0.75, BANK_TRIES = 3, BANK_ROLL = 0.9,', 'const BANK_SHARE = 0.5, BANK_TRIES = 3, BANK_ROLL = 0.9,'],
  ['B7 no bank at all (the call reverted)', '      try { res = closeBanked(laid, window, bank); } catch (err) {', '      try { res = close(laid, { window }); } catch (err) {'],
];
let applied = 0, caught = 0, na = 0;
const f = path.join(TREE, FILE), src = fs.readFileSync(f, 'utf8');
for (const [name, from, to] of M) {
  const norm = src.replace(/\r\n/g, '\n');
  if (norm.split(from).length !== 2) { na++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++; const out = norm.replace(from, to); fs.writeFileSync(f, src.includes('\r\n') ? out.replace(/\n/g, '\r\n') : out);
  try {
    const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'test/core_finish_bank.test.js'], { cwd: TREE, encoding: 'utf8', timeout: 20 * 60 * 1000 });
    const red = r.status !== 0; if (red) caught++;
    const failed = (r.stdout.match(/^not ok \d+ - row \d+/gm) || []).map((l) => l.replace(/^not ok \d+ - /, ''));
    console.log(`${red ? 'caught      ' : 'SURVIVED    '} ${name}${red ? `  (${failed.join(', ')})` : ''}`);
  } finally { fs.writeFileSync(f, src); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}`);
