'use strict';
const os = require('os'), fs = require('fs'), { spawnSync } = require('child_process'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const [cwd, out] = process.argv.slice(2);
const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', 'test/core_finish_joints.test.js'], { cwd, encoding: 'utf8', maxBuffer: 1 << 26, timeout: 30 * 60 * 1000 });
fs.writeFileSync(out, (r.stdout || '') + '\n# stderr\n' + (r.stderr || '') + `\n# exit ${r.status}\n`);
