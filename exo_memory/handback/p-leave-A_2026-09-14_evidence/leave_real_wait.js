// P-LEAVE D-3, with REAL liveness: a real node process holds a fixture stick's ledger.lock; the real waiter (real
// pidAnswers, real tasklist image check) must not export until that process has exited. Only the export and the
// notices are stubbed; the volume roots are a temp dir. Nothing touches the real stick or the real data dir.
const fs = require('fs'), path = require('path'), os = require('os'), { spawn, spawnSync } = require('child_process');
const W = require('C:/Users/nname/Desktop/lighthouse/dev/stick-waiter.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'leave-real-'));
const data = path.join(tmp, 'data'); const vol = path.join(tmp, 'vol'); const stick = path.join(vol, 'consonance-L-20260911');
fs.mkdirSync(path.join(stick, 'consonance-tails'), { recursive: true }); fs.mkdirSync(data, { recursive: true });
fs.writeFileSync(path.join(stick, 'consonance-tails', 'ledger.json'), '{}');
const deadApp = spawnSync(process.execPath, ['-e', ''], { windowsHide: true }).pid;   // a pid that has exited
const holdMs = 7000;
const orphan = spawn(process.execPath, ['-e', `setTimeout(() => {}, ${holdMs})`], { windowsHide: true, stdio: 'ignore' });
let orphanExitedAt = null;
orphan.on('exit', () => { orphanExitedAt = Date.now(); });
fs.writeFileSync(path.join(stick, 'consonance-tails', 'ledger.lock'), JSON.stringify({ pid: orphan.pid, image: 'node', script: 'tail-carry.js', at: new Date().toISOString() }));
fs.writeFileSync(path.join(data, W.LEAVE_STARTED), JSON.stringify({ pid: deadApp, image: 'consonance.exe', at: new Date().toISOString(), stick }));
const t0 = Date.now();
// runWaiter is synchronous; the orphan's 'exit' event cannot fire until it returns, so read the orphan's liveness
// independently at export time with the real kernel check instead.
let exportAt = null, orphanAliveAtExport = null;
const r = W.runWaiter(['--data', data, '--app-pid', String(deadApp), '--app-image', 'consonance.exe'], {
  volumeRoots: () => [vol],
  pollMs: 500,
  exportCarry: () => { exportAt = Date.now(); orphanAliveAtExport = W.pidAnswers(orphan.pid); return { stdout: JSON.stringify({ code: 0, outcome: 'NOTHING_TO_DO', rows: [] }) + '\n' }; },
  notify: () => {},
  pidsOf: () => [],
});
console.log(JSON.stringify({
  outcome: r.outcome, exports: r.exports, orphanPid: orphan.pid, holdMs,
  exportAfterMs: exportAt && exportAt - t0, orphanAliveAtExport,
  leaveStartedRemoved: !fs.existsSync(path.join(data, W.LEAVE_STARTED)),
  status: fs.readFileSync(path.join(data, W.STATUS), 'utf8').split('\n').slice(0, 4),
}, null, 1));
setTimeout(() => fs.rmSync(tmp, { recursive: true, force: true }), 200);
