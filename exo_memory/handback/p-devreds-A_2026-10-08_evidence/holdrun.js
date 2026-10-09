// node holdrun.js <cwd> <outfile> <cmd> [args...] : hold the heavy-run lock (waits for the holder), run the command from <cwd>, write output + exit to <outfile>.
const fs = require('fs'), cp = require('child_process');
const [cwd, out, cmd, ...args] = process.argv.slice(2);
const H = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
H.hold({ cmd: cmd + ' ' + args.join(' ') + ' (A, devreds)' });
const r = cp.spawnSync(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 1 << 28, env: process.env });
fs.writeFileSync(out, (r.stdout || '') + '\n--- stderr ---\n' + (r.stderr || '') + '\n--- exit ' + r.status + '\n');
fs.writeFileSync(out + '.done', String(r.status));
