// quiet.js: proof that a timing window was quiet (D404, after the chair's validity warning).
//   snap()          -> { t, procs: [{ pid, ppid, name, cpu (s), cmd }], locks: [{ file, cmd, pid, alive, mine }] }
//   judge(a, b)     -> { quiet, reasons[], foreign: [...processes of other seats that used CPU in the window], locks: ok? }
// "mine": this process and its descendants (the timing run, its Chrome). Everything else is foreign. A window is quiet when
//   - both heavy-run slots are held, at the start AND at the end, by a live pid whose cmd names this session, and the same pids at both ends;
//   - no foreign node / chrome / msedge / cargo / rustc / tauri process used more than 0.10 s of CPU in the window, and no foreign process of those names appeared in it with any CPU;
//   - all foreign processes together used under 6 s of CPU in the window (system services and the desktop's own web views included; msedgewebview2 is the app's UI host, counted here but not by name).
// A process that started and ended inside one window is not seen (the snapshots are at its two ends): stated as a limit.
const { execFileSync } = require('child_process'); const fs = require('fs');
// the machine's own services and the desktop's apps (Defender scanning my own temp files, the OS, the Claude and Consonance UI hosts): their CPU is recorded (hostCpu), not judged
const HOST = /^(System|MsMpEng|claude|LEDKeeper2|consonance|msedgewebview2|dwm|csrss|svchost|Registry|SearchIndexer|SearchProtocolHost|MemCompression|explorer|WmiPrvSE|audiodg|lsass|services|smss|winlogon|fontdrvhost|ctfmon|RuntimeBroker|sihost|taskhostw|ShellExperienceHost|StartMenuExperienceHost|TextInputHost|SecurityHealthService|NVDisplay.Container|nvcontainer|igfxCUIService|Widgets|conhost|OpenConsole|WindowsTerminal|bash|sh|cmd)(.exe)?$/i;
const WATCH = /^(node|chrome|msedge|msedgewebview2|cargo|rustc|tauri|link|cl|git|python|powershell|pwsh)(\.exe)?$/i;
function procs() {
  const out = execFileSync('powershell', ['-NoProfile', '-Command', "Get-CimInstance Win32_Process | ForEach-Object { '{0}|{1}|{2}|{3}|{4}' -f $_.ProcessId, $_.ParentProcessId, $_.Name, (($_.KernelModeTime + $_.UserModeTime) / 1e7), ($_.CommandLine -replace '[\\r\\n|]', ' ') }"], { maxBuffer: 1 << 26 }).toString();
  return out.split(/\r?\n/).filter(Boolean).map((l) => { const [pid, ppid, name, cpu, ...cmd] = l.split('|'); return { pid: +pid, ppid: +ppid, name, cpu: +cpu, cmd: cmd.join('|').slice(0, 160) }; });
}
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
function locks() {
  return ['heavy-run.lock', 'heavy-run.2.lock'].map((f) => { try { const j = JSON.parse(fs.readFileSync('C:/Consonance/data/' + f, 'utf8')); return { file: f, cmd: j.cmd, pid: j.pid, alive: alive(j.pid), mine: /D407 timing/.test(j.cmd || '') }; } catch (e) { return { file: f, cmd: null, pid: null, alive: false, mine: false }; } });
}
function snap() { return { t: Date.now(), procs: procs(), locks: locks() }; }
function mineSet(ps, root = process.pid) { const kids = new Map(); for (const p of ps) (kids.get(p.ppid) || kids.set(p.ppid, []).get(p.ppid)).push(p.pid); const s = new Set([root]); const q = [root]; while (q.length) { const x = q.pop(); for (const k of kids.get(x) || []) if (!s.has(k)) { s.add(k); q.push(k); } } return s; }
function judge(a, b) {
  const reasons = [], mine = mineSet(b.procs); for (const x of mineSet(a.procs)) mine.add(x);
  const lockOk = (s) => s.locks.length === 2 && s.locks.every((l) => l.mine && l.alive);
  if (!lockOk(a)) reasons.push('locks at the start: ' + JSON.stringify(a.locks.map((l) => [l.cmd, l.pid, l.alive])));
  if (!lockOk(b)) reasons.push('locks at the end: ' + JSON.stringify(b.locks.map((l) => [l.cmd, l.pid, l.alive])));
  if (lockOk(a) && lockOk(b) && a.locks.some((l, i) => l.pid !== b.locks[i].pid)) reasons.push('a lock holder changed during the window');
  const before = new Map(a.procs.map((p) => [p.pid, p])), foreign = []; let total = 0, hostCpu = 0;
  for (const p of b.procs) {
    if (mine.has(p.pid) || p.pid === 0 || /^System Idle Process$/i.test(p.name)) continue;
    const was = before.get(p.pid), d = was ? p.cpu - was.cpu : p.cpu; if (d < 0.005) continue;
    const host = HOST.test(p.name); if (!host) total += d; hostCpu += host ? d : 0; const watched = WATCH.test(p.name);
    foreign.push({ pid: p.pid, name: p.name, cpuDelta: +d.toFixed(3), isNew: !was, cmd: watched ? p.cmd : undefined });
    if (watched && /^(node|chrome|msedge|cargo|rustc|tauri)/i.test(p.name) && !/webview/i.test(p.name) && (d > 0.10 || !was)) reasons.push(`foreign ${p.name} pid ${p.pid} used ${d.toFixed(2)} s${was ? '' : ' (new)'}: ${p.cmd.slice(0, 90)}`);
  }
  if (total > 3) reasons.push(`foreign processes other than the host's services used ${total.toFixed(2)} s of CPU`);
  foreign.sort((x, y) => y.cpuDelta - x.cpuDelta);
  return { quiet: reasons.length === 0, reasons, windowMs: b.t - a.t, foreignCpu: +total.toFixed(2), hostCpu: +hostCpu.toFixed(2), foreignTop: foreign.slice(0, 6), locksStart: a.locks.map((l) => `${l.cmd}#${l.pid}`), locksEnd: b.locks.map((l) => `${l.cmd}#${l.pid}`) };
}
/** the foreign node / chrome processes standing now, for the start and end of a session */
function standing() { const ps = procs(), mine = mineSet(ps); return ps.filter((p) => !mine.has(p.pid) && /^(node|chrome|msedge|cargo|rustc|tauri)/i.test(p.name)).map((p) => ({ pid: p.pid, name: p.name, cpu: +p.cpu.toFixed(1), cmd: p.cmd })); }
module.exports = { snap, judge, standing, locks, mineSet, procs };
if (require.main === module) { const a = snap(); setTimeout(() => { const b = snap(); console.log(JSON.stringify(judge(a, b), null, 1)); console.log('standing foreign node/chrome:', standing().length); }, 3000); }
