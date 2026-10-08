// node runcargo.js <cwd> <outfile> -- <cargo args...> : one heavy run at a time (heavy-run.js hold), then cargo, output to a file, marker file when done.
const fs = require('fs'), cp = require('child_process'), path = require('path');
const args = process.argv.slice(2), cwd = args[0], out = args[1], cmd = args.slice(3);
const H = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
H.hold({ cmd: 'cargo ' + cmd.join(' ') + ' (A, D273 composer fixtures)' });
const env = { ...process.env, PATH: 'C:\\Users\\nname\\.cargo\\bin;' + process.env.PATH, CARGO_TARGET_DIR: path.join(path.dirname(out), 'target') };
const r = cp.spawnSync('cargo', cmd, { cwd, env, encoding: 'utf8', maxBuffer: 1 << 28, shell: true });
fs.writeFileSync(out, (r.stdout || '') + '\n--- stderr ---\n' + (r.stderr || '') + '\n--- exit ' + r.status + '\n');
fs.writeFileSync(out + '.done', String(r.status));
