// bothslots.js (C, D495): node bothslots.js <label> <cmd> [args...]. sculpt-frame.test.js times only while BOTH heavy-run slots are held by live
// processes, before the test file loads. So: a holder started in this scratch folder (not a git tree, so it does not block the run) takes slot 1 and
// keeps it until told to stop; then this process takes slot 2 for the run's own tree and runs the command under it; at the end both are released.
'use strict';
const { spawn, spawnSync } = require('child_process'), fs = require('fs'), path = require('path'), os = require('os');
const HEAVY = 'C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js', DATA = 'C:/Consonance/data', LABEL = 't180 C ' + process.argv[2];
const stop = path.join(os.tmpdir(), `bothslots-${process.pid}.stop`);
const holder = spawn(process.execPath, ['-e', `process.env.CONSONANCE_HEAVY_SLOTS = '1'; require(${JSON.stringify(HEAVY)}).hold({ cmd: ${JSON.stringify(LABEL + ' (slot 1, held for its second slot)')} });
  const fs = require('fs'); setInterval(() => { if (fs.existsSync(${JSON.stringify(stop)})) process.exit(0); }, 200);`], { cwd: __dirname, stdio: 'inherit' });
const lock = (f) => { try { return JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')); } catch (e) { return null; } };
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
let ok = false;
for (let i = 0; i < 36000 && !ok; i++) { const l = lock('heavy-run.lock'); ok = !!(l && l.pid === holder.pid); if (!ok) sleep(100); }
if (!ok) { fs.writeFileSync(stop, ''); console.error('bothslots: the holder never took slot 1'); process.exit(1); }
process.env.CONSONANCE_HEAVY_SLOTS = '2';
const h = require(HEAVY).hold({ cmd: LABEL });
console.error(`bothslots: slot 1 held by ${holder.pid}, slot ${h.slot} by this run, at ${new Date().toISOString()}; starting ${process.argv[3]}`);
const r = spawnSync(process.argv[3], process.argv.slice(4), { stdio: 'inherit' });
fs.writeFileSync(stop, '');
holder.on('exit', () => { try { fs.rmSync(stop); } catch (e) { /* gone */ } console.error(`bothslots: done at ${new Date().toISOString()}, exit ${r.status}`); process.exit(r.status === null ? 1 : r.status); });
