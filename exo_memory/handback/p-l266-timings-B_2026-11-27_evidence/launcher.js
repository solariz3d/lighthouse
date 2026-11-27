// launcher.js (pane B, L266): the one session, two phases, both held by this seat alone.
//   Phase A (timing 2, sculpt-frame): idle.js in one heavy-run slot (cmd "held IDLE on purpose"), then sfrun.js in the other; their rows time only while BOTH slots are
//     held (sculpt-frame.test.js bothSlots), and a child of an exclusive holder re-enters the holder's own slot (heavy-run.js, nested runs), so this phase cannot run
//     under the exclusive hold. While both slots are this seat's, every other heavy run waits by the slot rules.
//   Phase B (timing 1, D642): d642run.js under heavy-run --run --exclusive, as ordered: it writes the hold, then waits until every slot is free.
// The launcher itself takes no lock and does no work; it starts the three runs and records their exits.
// usage: node launcher.js <tree f3cd425> <tree c66b503> <tree 7b3926e> <tree e7b9128> <out dir> <N sculpt-frame> <N D642>
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawn, spawnSync } = require('child_process');
const Q = require('./quiet.js');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const H = 'C:\\Consonance\\lighthouse\\consonance\\tools\\heavy-run.js', NODE = process.execPath;
const [f3, c66, b7, e7, out, nSf, nD] = process.argv.slice(2);
const log = (s) => { const l = `${new Date().toISOString()} ${s}`; console.log(l); fs.appendFileSync(path.join(out, 'launcher.log'), l + '\n'); };
const env = { ...process.env }; delete env.CONSONANCE_HEAVY_RUN_TOKEN;
const run = (name, args, extraEnv = {}) => { const fd = fs.openSync(path.join(out, `${name}.out`), 'w'); const c = spawn(NODE, args, { stdio: ['ignore', fd, fd], env: { ...env, ...extraEnv }, windowsHide: true }); c.on('exit', () => fs.closeSync(fd)); log(`started ${name}: pid ${c.pid}`); return new Promise((res) => c.on('exit', (code) => { log(`${name} exited ${code}`); res(code); })); };
(async () => {
  const st = spawnSync(NODE, [H, '--status'], { encoding: 'utf8' }); log(`heavy-run --status (exit ${st.status}):\n${st.stdout}`);
  log(`machine before: ${JSON.stringify(Q.snapshot())}`);
  try { fs.unlinkSync(path.join(out, 'sf.done')); } catch (e) { /* none */ }
  // Phase A
  const idle = run('idle', [H, '--run', '--priority', 'idle', '--cmd', 'B L266: timings 2 of 2, this slot held IDLE on purpose: sculpt-frame times only while BOTH slots are held (its bothSlots rule)', '--', NODE, path.join(__dirname, 'idle.js'), path.join(out, 'sf.done'), '120']);
  const t0 = Date.now();
  while (Date.now() - t0 < 120000) { const L = Q.locks(); if ([L['heavy-run.lock'], L['heavy-run.2.lock']].some((s) => s && s.alive && /held IDLE on purpose/.test(s.cmd || ''))) break; Q.sleepSync(500); }
  log(`the idle holder ${[Q.locks()['heavy-run.lock'], Q.locks()['heavy-run.2.lock']].some((s) => s && /held IDLE on purpose/.test(s.cmd || '')) ? 'holds a slot' : 'holds NO slot yet (sfrun.js waits for it)'}`);
  const sf = run('sculpt-frame', [H, '--run', '--priority', 'belownormal', '--cmd', 'B L266: timings 2 of 2, sculpt-frame rows 1-4b, f3cd425 / c66b503 alternated', '--', NODE, path.join(__dirname, 'sfrun.js'), f3, c66, out, nSf], { CONSONANCE_DATA: Q.DATA });
  await Promise.all([idle, sf]);
  // Phase B
  const d = run('d642', [H, '--run', '--exclusive', '--priority', 'belownormal', '--cmd', 'B L266: timings 1 of 2, D642 row 1, 7b3926e / e7b9128 alternated', '--', NODE, path.join(__dirname, 'd642run.js'), b7, e7, out, nD], { CONSONANCE_HEAVY_WAIT_MS: String(60 * 60000) });
  await d;
  log(`machine after: ${JSON.stringify(Q.snapshot())}`);
  const st2 = spawnSync(NODE, [H, '--status'], { encoding: 'utf8' }); log(`heavy-run --status (exit ${st2.status}):\n${st2.stdout}`);
})().catch((e) => { log(`launcher failed: ${e.stack}`); fs.writeFileSync(path.join(out, 'sf.done'), 'launcher failed\n'); process.exit(1); });
