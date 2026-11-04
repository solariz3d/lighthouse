// spawncheck.js (D454 part 3, pane E): which part of suite.js's spawn gives ENOENT: the env file, or the cwd
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const env = {}; for (const l of fs.readFileSync(path.join(__dirname, 'env2.txt'), 'utf8').split('\n')) { const i = l.indexOf('='); if (i > 0) env[l.slice(0, i)] = l.slice(i + 1); }
const cwd = 'C:\\Users\\nname\\Downloads\\cons-d454-e\\clone2\\consonance';
const t = (name, opts) => { const r = spawnSync(process.execPath, ['-e', 'console.log(1)'], { encoding: 'utf8', ...opts }); console.log(name.padEnd(28), 'status', r.status, 'error', r.error && r.error.code); };
console.log('cwd exists:', fs.existsSync(cwd), 'TEMP in env:', env.TEMP, 'exists:', fs.existsSync(env.TEMP || ''));
t('env file, this cwd', { env });
t('this env, clone cwd', { cwd });
t('env file, clone cwd', { env, cwd });
const bad = Object.keys(env).filter((k) => !/^[A-Za-z_][A-Za-z0-9_().]*$/.test(k)); console.log('odd key names:', bad.length, bad.map((k) => JSON.stringify(k).slice(0, 20)).join(' '));
const crs = Object.entries(env).filter(([, v]) => /\r/.test(v)).map(([k]) => k); console.log('values with a CR:', crs.length, crs.slice(0, 5).join(' '));
