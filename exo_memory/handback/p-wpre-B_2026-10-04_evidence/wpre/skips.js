// skips.js (pane B, D232): test/widths.test.js in four states, each in a temp copy of the tree: FULL reads (row 4 must RUN and pass), reads ABSENT
// (row 4 SKIPS, nothing fails), reads PARTIAL (2 of 19: row 4 SKIPS, nothing fails), and a STALE committed file with full reads (Aurora's p90 56 -> 55:
// row 4 must FAIL, so the rebuild has teeth).   node skips.js <tree>
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]), { LAYOUTS } = require(path.join(TREE, 'tools/widths.cjs'));
const run = (d) => { const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-concurrency=1', '--test-reporter=spec', 'test/widths.test.js'], { cwd: d, encoding: 'utf8', timeout: 10 * 60 * 1000, env: Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT')) });
  const s = r.stdout.replace(/\x1b\[[0-9;]*m/g, ''); const g = (k) => +((s.match(new RegExp(`ℹ ${k} (\\d+)`)) || [])[1]);
  return { exit: r.status, tests: g('tests'), pass: g('pass'), fail: g('fail'), skipped: g('skipped'), row4: (s.split('\n').find((l) => /row 4: the committed file/.test(l)) || '').trim().slice(0, 170) }; };
const copy = (reads) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'b-wpre-')); for (const c of ['src', 'tools', 'test', 'docs', 'package.json']) fs.cpSync(path.join(TREE, c), path.join(d, c), { recursive: true });
  if (reads === 'full') fs.cpSync(path.join(TREE, 'reads'), path.join(d, 'reads'), { recursive: true });
  if (reads === 'partial') { fs.mkdirSync(path.join(d, 'reads')); for (const [f] of LAYOUTS.slice(0, 2)) fs.copyFileSync(path.join(TREE, 'reads', `${f}.read.json`), path.join(d, 'reads', `${f}.read.json`)); }
  return d; };
const out = {};
for (const st of ['full', 'absent', 'partial', 'stale']) {
  const d = copy(st === 'stale' ? 'full' : st);
  if (st === 'stale') { const f = path.join(d, 'src/doc/widths.json'), t = fs.readFileSync(f, 'utf8'), from = '"name": "Aurora Cryopticon (medium)",\n   "median_m": 34,\n   "p10_m": 32,\n   "p90_m": 56', n = t.replace(/\r\n/g, '\n').split(from).length - 1;
    out.staleApplied = n === 1; fs.writeFileSync(f, t.replace(/\r\n/g, '\n').replace(from, from.replace('"p90_m": 56', '"p90_m": 55'))); }
  out[st] = run(d); fs.rmSync(d, { recursive: true, force: true });
}
console.log(JSON.stringify(out, null, 1));
