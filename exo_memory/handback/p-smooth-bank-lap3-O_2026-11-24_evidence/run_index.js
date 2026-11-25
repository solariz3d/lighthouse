// LAP 3: the tests that read app/index.html and were not among panel.js's 47 (less the mutation harnesses); one node --test run
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const T = 'G:/consonance-scratch/o-smooth-t180', seen = fs.readFileSync('G:/consonance-scratch/o-smooth-work/touched_lap3.txt', 'utf8').split('\n')[0];
const files = ['app/test', 'test'].flatMap((d) => fs.readdirSync(path.join(T, d)).filter((f) => f.endsWith('.test.js')).map((f) => `${d}/${f}`))
  .filter((f) => fs.readFileSync(path.join(T, f), 'utf8').includes('index.html') && !seen.includes(f) && !/mutation\.test\.js$/.test(f));
const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', ...files], { cwd: T, encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28, env: { ...process.env, TMP: 'G:/consonance-scratch/o-smooth-work/tmp', TEMP: 'G:/consonance-scratch/o-smooth-work/tmp' } });
const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, '');
fs.writeFileSync('G:/consonance-scratch/o-smooth-work/index_lap3.txt', `files ${files.length}: ${files.join(' ')}\n` + out);
console.log(files.length, 'files;', out.split('\n').filter((l) => /^ℹ (tests|pass|fail|skipped|todo)/.test(l)).join(' · '));
for (const l of out.split('\n')) if (/^[✖⚠] /.test(l)) console.log(l.slice(0, 220));
