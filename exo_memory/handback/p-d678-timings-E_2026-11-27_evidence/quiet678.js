// quiet678.js (pane E, D678 N3): B's quiet.js (handback/p-l266-timings-B_2026-11-27_evidence/quiet.js), with his game read by heavy-run's OWN rule (gamesIn over
// readProcesses: StarCitizen and acs whatever their window, dz-world/dz-gym/dz-view with a window, anything under steamapps\common with a window, the profile's
// `games`), and a process list that cannot be read counted as NOT clear (never an empty "clear"). Records his app (t180-track-builder.exe) and Content Manager,
// the machine's CPU busy over one second, and every heavy-run slot file and the hold with whether its pid is alive. Read only; it changes and closes nothing.
'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const HR = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const DATA = 'C:\Consonance\data';
const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
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
    out[f] = j ? { pid: j.pid, seat: j.seat, cmd: j.cmd, timing: j.timing === true, alive: alive(j.pid), mine: !!(j.token && j.token === process.env.CONSONANCE_HEAVY_RUN_TOKEN) } : null;
  }
  return out;
}
/** { ok: true, games: [] } when the list was read and no game of his runs; ok false with games or unreadable otherwise (one retry before unreadable) */
function games() {
  let rows = HR.readProcesses(); if (!rows) { sleepSync(2000); rows = HR.readProcesses(); }
  if (!rows) return { ok: false, unreadable: true, games: [] };
  const names = rows.map((r) => String(r.name).toLowerCase());
  const g = HR.gamesIn(rows, (HR.profile && HR.profile().values.games) || []);
  return { ok: g.length === 0, games: g.map((x) => x.name), hisApp: names.includes('t180-track-builder'), contentManager: names.includes('content manager') };
}
function snapshot() { const g = games(); return { t: new Date().toISOString(), game: g.games, gameReadable: !g.unreadable, hisApp: !!g.hisApp, contentManager: !!g.contentManager, busyPct: busyPct(), locks: locks() }; }
module.exports = { snapshot, games, locks, sleepSync, DATA, alive };
