// the queue form for sculpt-frame, tested on a scratch lock folder: a hold with no slot (acquire holdOnly), two children with its token each take a REAL slot
// (both marked --timing), and a run without the token waits on the hold (and gives up after 3 s here)
'use strict';
const fs = require('fs'), path = require('path'), { spawn, spawnSync } = require('child_process');
const H = 'C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js', D = path.join(__dirname, 'data'), NODE = process.execPath;
const base = { ...process.env, CONSONANCE_DATA: D, CONSONANCE_HEAVY_WAIT_MS: '3000' }; delete base.CONSONANCE_HEAVY_RUN_TOKEN;
process.env.CONSONANCE_DATA = D; delete process.env.CONSONANCE_HEAVY_RUN_TOKEN;
const HR = require(H);
const hh = HR.acquire({ cmd: 'TEST hold, no slot', exclusive: true, holdOnly: true, maxWaitMs: 5000, dataDir: D, log: (m) => console.log('acquire log:', m) });
console.log('hold:', fs.readdirSync(D).filter((f) => /heavy-run/.test(f)).join(', '), 'slot', hh.slot);
const kid = { ...base, CONSONANCE_HEAVY_RUN_TOKEN: hh.holder.token };
const A = spawn(NODE, [H, '--run', '--timing', '--priority', 'idle', '--cmd', 'TEST A (token)', '--', NODE, '-e', 'setTimeout(()=>{},6000)'], { cwd: path.join(__dirname, 'treeA'), env: kid, stdio: 'ignore' });
const t = Date.now(); while (Date.now() - t < 2500) {}
const show = `const fs=require('fs');for(const f of ['heavy-run.lock','heavy-run.2.lock','heavy-run.hold']){let j=null;try{j=JSON.parse(fs.readFileSync(require('path').join(process.env.CONSONANCE_DATA,f),'utf8'))}catch(e){}console.log(f, j?JSON.stringify({cmd:j.cmd,timing:j.timing,exclusive:j.exclusive}):'none')}`;
const B = spawnSync(NODE, [H, '--run', '--timing', '--priority', 'belownormal', '--cmd', 'TEST B (token)', '--', NODE, '-e', show], { cwd: path.join(__dirname, 'treeB'), env: kid, encoding: 'utf8' });
console.log('B (token) exit', B.status, '\n' + B.stdout.trim(), B.stderr.trim().split('\n').filter((l) => !/capped to/.test(l)).join(' | '));
const t2 = Date.now();
const C = spawnSync(NODE, [H, '--run', '--cmd', 'TEST C (no token)', '--', NODE, '-e', 'console.log("C ran")'], { cwd: path.join(__dirname, 'treeB'), env: base, encoding: 'utf8' });
console.log('C (no token) exit', C.status, 'after', Date.now() - t2, 'ms; stdout:', JSON.stringify(C.stdout.trim()), 'stderr:', C.stderr.trim().split('\n').filter((l) => !/capped to/.test(l)).map((l) => l.slice(0, 140)).join(' | '));
A.on('exit', () => { hh.release(); console.log('after release:', fs.readdirSync(D).filter((f) => /heavy-run\.(lock|2\.lock|hold)$/.test(f)).join(', ') || 'no lock, no hold'); });
