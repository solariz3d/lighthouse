// runs mnm.js on the base tree, then the branch tree, each in its own process (so the module caches never mix); stops at the first failure
const { spawnSync } = require('child_process'), path = require('path');
for (const [tree, out] of [['G:/consonance-scratch/o-smooth-base', 'mnm2_base'], ['G:/consonance-scratch/o-smooth-t180', 'mnm2_branch']]) {
  const r = spawnSync(process.execPath, ['--max-old-space-size=4096', path.join(__dirname, 'mnm.js'), tree, path.join(__dirname, 'tracks'), path.join(__dirname, out + '.json')], { stdio: ['ignore', 'inherit', 'inherit'], windowsHide: true });
  if (r.status !== 0) { console.error(`mnm on ${tree} exited ${r.status}`); process.exit(1); }
}
