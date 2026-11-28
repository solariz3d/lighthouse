// session678.js (pane E, D678 N3): one timing session, one pair. Waits until heavy-run --status shows BOTH slots free, no hold and no timing slot, and no game of
// his (polled every 10 s; the order: "start a session only when heavy-run.js --status shows both slots free and no hold"), then:
//   x  : node heavy-run.js --run --timing --exclusive --priority belownormal --cmd "<label>" -- node runner678.js ...   (the order's form; D642 and drag-frame)
//   sf : B's phase A (launcherA.js), the one departure: sculpt-frame's timed rows time only while BOTH slots are held and one is their own run (the test's bothSlots),
//        and a child of an exclusive holder re-enters the holder's slot (heavy-run.js:433-436), so under --exclusive they cannot time. Two runs of mine, BOTH marked
//        --timing: idle.js holding one slot at idle priority (cwd this non-git folder) and the runner in the other (cwd the second tree, a git tree, so the two are two
//        trees), BelowNormal. Every other heavy run waits on the slots while both are mine.
// Records when the session was launched, when the hold or the slots were seen taken, and when each process ended: how long each hold stood.
// usage: node session678.js <x|sf> <d642|sf|df> <out dir> <N> <label1>=<tree1> <label2>=<tree2> <cmd label>
'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), { spawn, spawnSync } = require('child_process');
const Q = require('./quiet678.js');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { /* */ }
const H = 'C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js', NODE = process.execPath;
// QUEUE (8th arg "queue"; the chair's ruling, 2026-11-28T02:00:07Z, replacing the start condition): no polling for an empty machine. His game is checked once
// before (a game: nothing starts); then x queues on heavy-run's own --run --timing --exclusive (it writes the hold, drains the slots, parks new runs); sf takes the
// same exclusive hold through heavy-run's own acquire() with no slot (holdOnly), and its two runs, carrying the hold's token, each queue for a real slot with
// --run --timing (under --exclusive a child re-enters the holder's ONE slot, and sculpt-frame times only with BOTH slots held). heavy-run's 30 min wait limit is
// raised to 240 min for these runs (CONSONANCE_HEAVY_WAIT_MS), so a queued session does not give up behind another seat's hold.
// The row 9 A/A registration: two OR FOUR <label>=<tree> arguments (four: the A/A's pair, then the Even pair, one round of both; runner678.js runs them in that order).
const [mode, kind, out, N, ...rest] = process.argv.slice(2), QUEUE = rest[rest.length - 1] === 'queue';
if (QUEUE) rest.pop();
const label = rest.pop(), ps = rest, [p1, p2] = ps;
if (!['x', 'sf'].includes(mode) || !label || /=/.test(label) || ![2, 4].includes(ps.length) || !ps.every((p) => /^[^=]+=.+/.test(p))) { console.error('usage: node session678.js <x|sf> <d642|sf|df> <out dir> <N> <l1>=<t1> <l2>=<t2> [<l3>=<t3> <l4>=<t4>] <cmd label> [queue]'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });
const log = (s) => { const l = `${new Date().toISOString()} ${s}`; console.log(l); fs.appendFileSync(path.join(out, 'session.log'), l + '\n'); };
const env = { ...process.env }; delete env.CONSONANCE_HEAVY_RUN_TOKEN;
const status = () => { const r = spawnSync(NODE, [H, '--status'], { encoding: 'utf8', env }); return { code: r.status, text: (r.stdout || '') + (r.stderr || '') }; };
const free = (s) => /EXCLUSIVE HOLD: none/.test(s.text) && /slot 1: free/.test(s.text) && /slot 2: free/.test(s.text) && !/timing session/.test(s.text);
if (QUEUE) env.CONSONANCE_HEAVY_WAIT_MS = String(240 * 60000);
const run = (name, cwd, args, envFor = env) => { const fd = fs.openSync(path.join(out, `${name}.out`), 'w'); const c = spawn(NODE, args, { cwd, stdio: ['ignore', fd, fd], env: envFor, windowsHide: true }); const t = Date.now(); log(`started ${name} (cwd ${cwd}): pid ${c.pid}`); return new Promise((res) => c.on('exit', (code) => { fs.closeSync(fd); log(`${name} exited ${code} after ${Math.round((Date.now() - t) / 1000)} s`); res({ code, started: t, ended: Date.now() }); })); };
(async () => {
  const t0 = Date.now(); let said = false, s;
  if (QUEUE) {
    const g = Q.games(); s = status();
    if (!g.ok) { log(`NOT STARTED: ${g.unreadable ? 'the process list could not be read' : `his game runs (${g.games.join(', ')}); nothing closed`}`); fs.writeFileSync(path.join(out, 'done'), 'never started\n'); return; }
    log(`QUEUED at once (the chair's ruling): no game; heavy-run --status (exit ${s.code}):\n${s.text}`);
  }
  for (; !QUEUE;) {
    s = status(); const g = Q.games();
    if (free(s) && g.ok) break;
    if (!said) { said = true; log(`waiting to start: ${!g.ok ? (g.unreadable ? 'process list unreadable' : `his game runs (${g.games.join(', ')})`) : 'the lock is not free'}:\n${s.text}`); }
    if (Date.now() - t0 > 240 * 60000) { log('gave up waiting after 240 min; nothing started'); fs.writeFileSync(path.join(out, 'done'), 'never started\n'); return; }
    Q.sleepSync(10000);
  }
  if (!QUEUE) log(`free after ${Math.round((Date.now() - t0) / 1000)} s of waiting; heavy-run --status (exit ${s.code}):\n${s.text}`);
  log(`machine before: ${JSON.stringify(Q.snapshot())}`);
  try { fs.unlinkSync(path.join(out, 'done')); } catch (e) { /* none */ }
  const R = path.join(__dirname, 'runner678.js'), t1 = p1.slice(p1.indexOf('=') + 1), t2 = p2.slice(p2.indexOf('=') + 1);
  let watch = null; const seen = { hold: null, slots: {} };
  watch = setInterval(() => { const L = Q.locks(); if (L['heavy-run.hold'] && !seen.hold) { seen.hold = new Date().toISOString(); log(`hold seen: ${JSON.stringify(L['heavy-run.hold'])}`); }
    for (const f of ['heavy-run.lock', 'heavy-run.2.lock']) if (L[f] && /^E D678 N3/.test(L[f].cmd || '') && !seen.slots[f]) { seen.slots[f] = new Date().toISOString(); log(`${f} taken by mine: ${JSON.stringify(L[f])}`); } }, 1000);
  if (mode === 'x') {
    await run(`${kind}-session`, t1, [H, '--run', '--timing', '--exclusive', '--priority', 'belownormal', '--cmd', label, '--', NODE, R, kind, out, N, ...ps]);
  } else {
    let hh = null, envKids = env;
    if (QUEUE) {
      const HR = require(H), w0 = Date.now();
      log('taking the exclusive hold (no slot) through heavy-run acquire(); it waits for any other hold to go');
      hh = HR.acquire({ cmd: `${label} (the hold: sculpt-frame times only with BOTH slots held, so its two runs take the slots under this hold)`, exclusive: true, holdOnly: true, maxWaitMs: 240 * 60000, log: (m) => log(`heavy-run: ${m}`) });
      log(`HOLD TAKEN after ${Math.round((Date.now() - w0) / 1000)} s: ${JSON.stringify({ ...hh.holder, token: 'set' })}`);
      envKids = { ...env, CONSONANCE_HEAVY_RUN_TOKEN: hh.holder.token };
    }
    try {
    const idle = run('idle', __dirname, [H, '--run', '--timing', '--priority', 'idle', '--cmd', `${label}: this slot held IDLE on purpose (sculpt-frame times only while BOTH slots are held, its bothSlots rule)`, '--', NODE, path.join(__dirname, 'idle.js'), path.join(out, 'done'), '300'], envKids);
    const w = Date.now();
    while (Date.now() - w < (QUEUE ? 240 * 60000 : 120000)) { const L = Q.locks(); if ([L['heavy-run.lock'], L['heavy-run.2.lock']].some((x) => x && x.alive && /held IDLE on purpose/.test(x.cmd || ''))) break; Q.sleepSync(500); }
    log(`the idle holder ${[Q.locks()['heavy-run.lock'], Q.locks()['heavy-run.2.lock']].some((x) => x && /held IDLE on purpose/.test(x.cmd || '')) ? 'holds a slot' : 'holds NO slot yet (the runner waits for it)'}`);
    const sf = run('sf-session', t2, [H, '--run', '--timing', '--priority', 'belownormal', '--cmd', label, '--', NODE, R, kind, out, N, ...ps], envKids);
    await Promise.all([idle, sf]);
    } finally { if (hh) { hh.release(); log('the hold released'); } }
  }
  clearInterval(watch);
  const s2 = status(); log(`after: heavy-run --status (exit ${s2.code}):\n${s2.text}`); log(`machine after: ${JSON.stringify(Q.snapshot())}`);
  log(`session over; launched ${new Date(t0).toISOString()} (waited ${Math.round((Date.now() - t0) / 1000)} s in all)`);
})().catch((e) => { log(`session678 failed: ${e.stack}`); try { fs.writeFileSync(path.join(out, 'done'), 'session failed\n'); } catch (_) {} process.exit(1); });
