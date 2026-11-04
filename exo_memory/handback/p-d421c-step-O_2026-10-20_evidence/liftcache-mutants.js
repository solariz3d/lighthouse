'use strict';
// D421c part 4 (O): each mutant breaks one property of the lift-channel reuse; test/core_segcache_lift.test.js must go red on every one. Applied to a copy of the
// tree's file, run, restored. Reports applied / caught / NOT APPLIED.   node stepcache-mutants.js <tree>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = process.argv[2];
const M = [
  ['L1 kh counted as a lift channel', 'src/core/adapter.js', "const LIFT = new Set(['h', 'l'])", "const LIFT = new Set(['h', 'l', 'kh'])"],
  ['L2 the by-id path skips the inputs check', 'src/core/adapter.js', 'hit = same(h) && sameButLift(last, P) ? h : null;', 'hit = h && sameButLift(last, P) ? h : null;'],
  ['L3 a field outside the channels is not compared', 'src/core/adapter.js', "if (x !== 'channels') { if (!sameValue(A[x], B[x])) return false; continue; }", "if (x !== 'channels') continue;"],
  ['L4 no reuse by id at all', 'src/core/adapter.js', 'hit = same(h) && sameButLift(last, P) ? h : null;', 'hit = null;'],
  ['L5 the channel set is not compared (a channel added or removed)', 'src/core/adapter.js', 'if (ca.length !== cb.length || !ca.every((c, i) => c === cb[i] && (LIFT.has(c)', 'if (!ca.every((c, i) => (LIFT.has(c)'],
];
let applied = 0, caught = 0, na = 0;
for (const [name, file, from, to] of M) {
  const f = path.join(TREE, file), src = fs.readFileSync(f, 'utf8');
  if (src.split(from).length !== 2) { na++; console.log(`NOT APPLIED  ${name}`); continue; }
  applied++; fs.writeFileSync(f, src.replace(from, to));
  try { const r = spawnSync(process.execPath, ['--test', 'test/core_segcache_lift.test.js'], { cwd: TREE, encoding: 'utf8' }); const red = r.status !== 0; if (red) caught++; console.log(`${red ? 'caught      ' : 'SURVIVED    '} ${name}`); }
  finally { fs.writeFileSync(f, src); }
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${na}`);
