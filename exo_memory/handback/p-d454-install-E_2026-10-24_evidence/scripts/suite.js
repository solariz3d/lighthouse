// suite.js (D454 part 3, pane E): README's `node consonance/tools/js-suite.js`, as written, from the stranger clone's root, in the stranger's env (env2.txt)
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const env = {}; for (const l of fs.readFileSync(path.join(__dirname, 'env2.txt'), 'utf8').split('\n')) { const i = l.indexOf('='); if (i > 0) env[l.slice(0, i)] = l.slice(i + 1); }
const t0 = Date.now();
const r = spawnSync(process.execPath, ['consonance/tools/js-suite.js'], { cwd: 'C:/Users/nname/Downloads/cons-d454-e/clone2/consonance', env, encoding: 'utf8', maxBuffer: 1 << 28, windowsHide: true });
fs.writeFileSync(path.join(__dirname, 'suite.out'), (r.stdout || '') + '\n--- stderr ---\n' + (r.stderr || ''));
console.log('exit', r.status, 'signal', r.signal, 'error', r.error && (r.error.code + ' ' + r.error.message), 'min', ((Date.now() - t0) / 60000).toFixed(1));
console.log((r.stdout || '').trim().split('\n').slice(-12).join('\n'));
