const { spawnSync } = require('child_process'), H = __dirname, fs = require('fs');
const go = (name, args) => { const r = spawnSync(process.execPath, args, { cwd: H, encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28 }); fs.writeFileSync(H + '/' + name, r.stdout + r.stderr); console.log(`== ${name}\n` + (r.stdout + r.stderr)); };
go('d642_base.txt', [H + '/d642_both.js']);
go('mut_lap4_out.txt', [H + '/mut_lap4.js']);
