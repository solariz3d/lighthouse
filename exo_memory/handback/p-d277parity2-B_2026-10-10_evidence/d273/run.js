// run.js (pane B, D273): ONE heavy-run lock hold; each step = { name, argv, cwd, env }, its output to <name>.out beside this file.
const { hold } = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const { spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
const [label, stepsFile] = process.argv.slice(2);
hold({ cmd: 'B D273 ' + label });
const steps = JSON.parse(fs.readFileSync(stepsFile, 'utf8'));
for (const s of steps) {
  const t0 = Date.now();
  const r = spawnSync(s.argv[0], s.argv.slice(1), { cwd: s.cwd, env: { ...process.env, ...(s.env || {}) }, encoding: 'utf8', maxBuffer: 1 << 29, timeout: 90 * 60 * 1000 });
  const out = `=== ${s.argv.join(' ')}\n=== cwd ${s.cwd}\n=== env ${JSON.stringify(s.env || {})}\n${r.stdout || ''}${r.stderr || ''}\n=== exit ${r.status} signal ${r.signal} error ${r.error ? r.error.message : ''} ${((Date.now() - t0) / 1000).toFixed(1)}s\n`;
  fs.writeFileSync(path.join(path.dirname(stepsFile), s.name + '.out'), out);
  console.log(`${s.name}: exit ${r.status} ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}
