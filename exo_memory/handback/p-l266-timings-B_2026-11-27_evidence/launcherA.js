// launcherA.js (pane B, L266): phase A again, sculpt-frame, after launcher.js's first try waited on itself. heavy-run lets no two runs of ONE tree hold slots at once
// (heavy-run.js blocks(): h.tree === myTree), and a run's tree is the git top level of its cwd, or one shared "not a git tree" for any other folder; launcher.js
// started both runners from the same non-git folder, so the sculpt-frame runner waited on the idle holder (12:05:35Z to 12:06:2xZ, nothing measured). Here the idle
// holder starts from this scratch folder (not git) and the sculpt-frame runner from the c66b503 worktree (its own git tree), so they are two trees.
// usage: node launcherA.js <tree f3cd425> <tree c66b503> <out dir> <N sculpt-frame>
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawn, spawnSync } = require('child_process');
const Q = require('./quiet.js');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const H = 'C:\\Consonance\\lighthouse\\consonance\\tools\\heavy-run.js', NODE = process.execPath;
const [f3, c66, out, nSf] = process.argv.slice(2);
const log = (s) => { const l = `${new Date().toISOString()} ${s}`; console.log(l); fs.appendFileSync(path.join(out, 'launcherA.log'), l + '\n'); };
const env = { ...process.env }; delete env.CONSONANCE_HEAVY_RUN_TOKEN;
const run = (name, cwd, args, extraEnv = {}) => { const fd = fs.openSync(path.join(out, `${name}.out`), 'w'); const c = spawn(NODE, args, { cwd, stdio: ['ignore', fd, fd], env: { ...env, ...extraEnv }, windowsHide: true }); c.on('exit', () => fs.closeSync(fd)); log(`started ${name} (cwd ${path.basename(cwd)}): pid ${c.pid}`); return new Promise((res) => c.on('exit', (code) => { log(`${name} exited ${code}`); res(code); })); };
(async () => {
  const st = spawnSync(NODE, [H, '--status'], { encoding: 'utf8' }); log(`heavy-run --status (exit ${st.status}):\n${st.stdout}`);
  log(`machine before: ${JSON.stringify(Q.snapshot())}`);
  try { fs.unlinkSync(path.join(out, 'sf.done')); } catch (e) { /* none */ }
  const idle = run('idleA', __dirname, [H, '--run', '--priority', 'idle', '--cmd', 'B L266: timings 2 of 2, this slot held IDLE on purpose: sculpt-frame times only while BOTH slots are held (its bothSlots rule)', '--', NODE, path.join(__dirname, 'idle.js'), path.join(out, 'sf.done'), '120']);
  const t0 = Date.now();
  while (Date.now() - t0 < 120000) { const L = Q.locks(); if ([L['heavy-run.lock'], L['heavy-run.2.lock']].some((s) => s && s.alive && /held IDLE on purpose/.test(s.cmd || ''))) break; Q.sleepSync(500); }
  log(`the idle holder ${[Q.locks()['heavy-run.lock'], Q.locks()['heavy-run.2.lock']].some((s) => s && /held IDLE on purpose/.test(s.cmd || '')) ? 'holds a slot' : 'holds NO slot yet (sfrun.js waits for it)'}`);
  const sf = run('sculpt-frameA', c66, [H, '--run', '--priority', 'belownormal', '--cmd', 'B L266: timings 2 of 2, sculpt-frame rows 1-4b, f3cd425 / c66b503 alternated', '--', NODE, path.join(__dirname, 'sfrun.js'), f3, c66, out, nSf], { CONSONANCE_DATA: Q.DATA });
  await Promise.all([idle, sf]);
  log(`machine after: ${JSON.stringify(Q.snapshot())}`);
  const st2 = spawnSync(NODE, [H, '--status'], { encoding: 'utf8' }); log(`heavy-run --status (exit ${st2.status}):\n${st2.stdout}`);
})().catch((e) => { log(`launcherA failed: ${e.stack}`); fs.writeFileSync(path.join(out, 'sf.done'), 'launcherA failed\n'); process.exit(1); });
