// LAP 3: the tests of the touched file (every test that loads app/core/panel.js), less the five mutation harnesses of other targets; one node --test run, its output kept.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const T = process.argv[2] || 'G:/consonance-scratch/o-smooth-t180', OUT = process.argv[3] || 'G:/consonance-scratch/o-smooth-work/touched_lap3.txt';
const HARNESS = /mutation\.test\.js$/;
const files = ['app/test', 'test'].flatMap((d) => fs.readdirSync(path.join(T, d)).filter((f) => f.endsWith('.test.js')).map((f) => `${d}/${f}`))
  .filter((f) => /core\/panel(\.js)?'/.test(fs.readFileSync(path.join(T, f), 'utf8').replace(/core\/panel\.js/g, "core/panel'")) && !HARNESS.test(f));
const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', ...files], { cwd: T, encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28, env: { ...process.env, TMP: 'G:/consonance-scratch/o-smooth-work/tmp', TEMP: 'G:/consonance-scratch/o-smooth-work/tmp' } });
const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
fs.writeFileSync(OUT, `files ${files.length}: ${files.join(' ')}\n` + out);
console.log(files.length, 'files;', out.split('\n').filter((l) => /^ℹ (tests|pass|fail|skipped|todo|duration_ms)/.test(l)).join(' · '));
for (const l of out.split('\n')) if (/^✖ /.test(l)) console.log(l.slice(0, 200));
