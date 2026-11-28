// light.js: one node --test file at BelowNormal, its TAP to <out>. usage: node light.js <out.tap> <tree> <test file...>
const os = require('os'), fs = require('fs'), { spawnSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const [out, tree, ...files] = process.argv.slice(2);
const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...files], { cwd: tree, stdio: ['ignore', fs.openSync(out, 'w'), 'inherit'] });
process.exit(r.status);
