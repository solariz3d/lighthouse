// quiet.js (pane B, L266): what the machine is doing, read before every timed run. His app (t180-track-builder.exe), his game (acs.exe, starcitizen.exe; a run
// WAITS while one runs, as heavy-run --wait-game does), Content Manager (recorded only), the machine's CPU busy over one second (all cores, from os.cpus()), and
// the heavy-run lock: each slot file and the hold, with whether its pid is alive. Read only; it changes nothing.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawnSync } = require('child_process');
const DATA = 'C:\\Consonance\\data';
const HIS = ['t180-track-builder.exe'], GAMES = ['acs.exe', 'starcitizen.exe'], CM = ['content manager.exe'];
const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
function procs() {
  const r = spawnSync('tasklist', ['/fo', 'csv', '/nh'], { encoding: 'utf8', windowsHide: true });
  return (r.stdout || '').split(/\r?\n/).map((l) => (l.split('","')[0] || '').replace(/^"/, '').toLowerCase()).filter(Boolean);
}
function busyPct(ms = 1000) {
  const t = () => os.cpus().reduce((a, c) => { const s = Object.values(c.times).reduce((x, y) => x + y, 0); return { idle: a.idle + c.times.idle, all: a.all + s }; }, { idle: 0, all: 0 });
  const a = t(); sleepSync(ms); const b = t();
  return +((1 - (b.idle - a.idle) / Math.max(1, b.all - a.all)) * 100).toFixed(1);
}
const alive = (pid) => { if (!Number.isInteger(pid) || pid <= 0) return false; try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
function locks() {
  const out = {};
  for (const f of ['heavy-run.lock', 'heavy-run.2.lock', 'heavy-run.3.lock', 'heavy-run.hold']) {
    let j = null; try { j = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')); } catch (e) { /* absent */ }
    out[f] = j ? { pid: j.pid, seat: j.seat, cmd: j.cmd, alive: alive(j.pid), mine: !!(j.token && j.token === process.env.CONSONANCE_HEAVY_RUN_TOKEN) } : null;
  }
  return out;
}
function snapshot() {
  const p = procs();
  return { t: new Date().toISOString(), hisApp: HIS.filter((n) => p.includes(n)), game: GAMES.filter((n) => p.includes(n)), contentManager: CM.some((n) => p.includes(n)), busyPct: busyPct(), locks: locks() };
}
/** wait while a game of his runs (checked every 30 s); returns the seconds waited */
function waitGame(log) {
  const t0 = Date.now(); let said = false;
  for (;;) { const g = GAMES.filter((n) => procs().includes(n)); if (!g.length) return Math.round((Date.now() - t0) / 1000); if (!said) { said = true; log(`waiting: his game runs (${g.join(', ')})`); } sleepSync(30000); }
}
module.exports = { snapshot, waitGame, locks, sleepSync, DATA };
