// run_touched.js (pane A, L254): the touched test files, one at a time, each as TAP into <out>/<name>.tap, and one summary line per file.
// usage: node run_touched.js <tree> <out dir> <file> [file ...]   (run under heavy-run.js at BelowNormal)
'use strict';
const { spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
const [tree, out, ...files] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const rows = [];
for (const f of files) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', f], { cwd: tree, encoding: 'utf8', maxBuffer: 1 << 28 });
  const tap = (r.stdout || '') + (r.stderr ? `\n# STDERR\n${r.stderr}` : '');
  fs.writeFileSync(path.join(out, path.basename(f).replace(/\.js$/, '.tap')), tap);
  const n = (k) => { const m = tap.match(new RegExp(`^# ${k} (\\d+)`, 'm')); return m ? Number(m[1]) : null; };
  const failed = [...tap.matchAll(/^not ok \d+ - (.*)$/gm)].map((m) => m[1].slice(0, 140));
  const row = { file: f, exit: r.status, tests: n('tests'), pass: n('pass'), fail: n('fail'), skipped: n('skipped'), todo: n('todo'), s: Math.round((Date.now() - t0) / 1000), failed };
  rows.push(row); console.log(JSON.stringify(row));
}
fs.writeFileSync(path.join(out, 'summary.json'), JSON.stringify(rows, null, 1));
