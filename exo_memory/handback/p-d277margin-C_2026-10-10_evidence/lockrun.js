// lockrun.js: the chair's load rules (2026-09-28, after the BSOD) for every node test or bench run of mine.
//   node lockrun.js "<label>" <log file> -- <bash command>
// Holds the heavy-run lock (one heavy job at a time), then runs the command in bash with NODE_OPTIONS=--max-old-space-size=4096,
// so every node it starts, nested ones included, carries the cap. The command's output goes to the log, with start/end/exit.
const fs = require('fs'), { spawnSync } = require('child_process');
const i = process.argv.indexOf('--'), label = process.argv[2], log = process.argv[3], cmd = process.argv.slice(i + 1).join(' ');
if (i < 0 || !label || !log || !cmd) { console.error('usage: node lockrun.js "<label>" <log> -- <command>'); process.exit(2); }
const t0 = new Date().toISOString();
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: `t180 C: ${label}` });
const a = new Date().toISOString();
fs.appendFileSync(log, `== ${label} · asked ${t0} · lock held ${a} · NODE_OPTIONS=--max-old-space-size=4096\n$ ${cmd}\n`);
const env = { ...Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT')), NODE_OPTIONS: '--max-old-space-size=4096' };
const r = spawnSync('bash', ['-c', cmd], { env, encoding: 'utf8', maxBuffer: 1 << 28, timeout: 60 * 60 * 1000 });
fs.appendFileSync(log, (r.stdout || '') + (r.stderr || '') + `== exit ${r.status}${r.signal ? ' signal ' + r.signal : ''} · done ${new Date().toISOString()}\n`);
process.exit(r.status == null ? 1 : r.status);
