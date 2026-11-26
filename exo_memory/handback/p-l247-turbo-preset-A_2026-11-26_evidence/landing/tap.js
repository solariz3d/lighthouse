'use strict';
const fs = require('fs'); const path = require('path'); const { spawnSync } = require('child_process');
const TREE = "C:\\Consonance\\lh-wt-l247", OUT = "C:\\Users\\zackn\\AppData\\Local\\Temp\\claude\\4589df4838997b56\\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\\scratchpad\\l247land";
const files = fs.readFileSync(path.join(OUT, 'tap-files.txt'), 'utf8').split('\n').filter(Boolean);
const tot = { tests: 0, pass: 0, fail: 0, skipped: 0, todo: 0, cancelled: 0 }; const notZero = []; const failed = [];
const out = fs.openSync(path.join(OUT, 'tap.out'), 'w');
for (const f of files) {
  const t = Date.now();
  const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', f], { cwd: TREE, encoding: 'utf8', timeout: 300000, maxBuffer: 256 << 20 });
  const text = (r.stdout || '') + (r.stderr || '');
  fs.writeSync(out, '### ' + f + ' exit ' + r.status + (r.signal ? ' signal ' + r.signal : '') + ' ' + (Date.now() - t) + ' ms\n' + text + '\n');
  const n = {};
  for (const k of Object.keys(tot)) { const m = new RegExp('^# ' + k + ' (\\d+)', 'm').exec(text); n[k] = m ? Number(m[1]) : 0; tot[k] += n[k]; }
  if (r.status !== 0) notZero.push(f + ' exit ' + r.status + (r.signal ? ' ' + r.signal : ''));
  if (n.fail) failed.push(f + ' fail ' + n.fail);
}
const line = 'TAP files ' + files.length + ' · tests ' + tot.tests + ' · pass ' + tot.pass + ' · fail ' + tot.fail + ' · skipped ' + tot.skipped + ' · todo ' + tot.todo + ' · cancelled ' + tot.cancelled + ' · not exit 0: ' + notZero.length;
fs.writeSync(out, '\n' + line + '\n'); fs.closeSync(out);
fs.writeFileSync(path.join(OUT, 'tap-failed.txt'), line + '\nfailed:\n' + failed.join('\n') + '\nnot exit 0:\n' + notZero.join('\n') + '\n');
process.exit(0);
