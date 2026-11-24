// runs release_cost.js for both options and on 15b1306's export, each in its own process
const { spawnSync } = require('child_process'), path = require('path'), H = __dirname;
for (const [tree, mode] of [['G:/consonance-scratch/o-smooth-t180', 'least'], ['G:/consonance-scratch/o-smooth-t180', 'backstep'], ['G:/consonance-scratch/o-smooth-work/tmp/base15b', '15b1306']]) {
  const r = spawnSync(process.execPath, [path.join(H, 'release_cost.js'), tree, mode], { encoding: 'utf8', windowsHide: true }); process.stdout.write(r.stdout + r.stderr);
}
