'use strict';
// pane E: run one node command under the heavy-run lock, with --max-old-space-size=4096 (the chair's load rules after the
// 01:46 blue screen). usage: node locked.js <label> <cwd> <out-file> <node args...>
const fs = require('fs'), { spawn } = require('child_process');
const [label, cwd, out, ...args] = process.argv.slice(2);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: `pane E: ${label}` });
const fd = fs.openSync(out, 'w'), t0 = Date.now();
const p = spawn(process.execPath, ['--max-old-space-size=4096', ...args], { cwd, stdio: ['ignore', fd, fd], env: { ...process.env, NODE_OPTIONS: ((process.env.NODE_OPTIONS || '') + ' --max-old-space-size=4096').trim() } });
p.on('close', (code) => { fs.appendFileSync(out, `\n[locked.js] exit ${code} in ${Math.round((Date.now() - t0) / 1000)} s\n`); process.exit(code || 0); });
