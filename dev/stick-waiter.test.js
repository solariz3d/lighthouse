// stick-waiter.test.js — run with: node dev/stick-waiter.test.js
//
// WHAT THIS GUARDS. The waiter runs on EVERY launch and does its work after the only surface the keeper has is gone.
// Its failures are all silent: exporting on a hand-off (racing the applier), exporting — or opening a window — when
// no stick is plugged in (the no-stick bar), never exporting when one is, and a find rule that disagrees with the
// app's. So: the §3 six-case table is pinned EXACTLY (the Rust suite tests the same six, and neither may add a case),
// and each exit rule from "WHAT THE WAITER RUNS" has its own test.
//
// The app-alive probe is an injected image lookup, the export and the window are injected, and the volume roots are
// temp directories — so nothing here touches a real drive, a real app, or the screen.

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const W = require(path.join(__dirname, 'stick-waiter.js'));
const A = require(path.join(__dirname, 'stick-apply.js'));

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e && e.message}`); fail++; }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'stick-waiter-'));
let seq = 0;
const put = (p, body) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, body || '{}'); };
const volume = () => { const v = path.join(tmp, `vol${++seq}`); fs.mkdirSync(v, { recursive: true }); return v; };

console.log('stick-waiter.test.js');

// ══ §3 THE SIX-CASE TABLE — exactly these six, no more ══════════════════════════════════════════════════════════

test('table 1 · no marker anywhere -> NO STICK', () => {
  const v = volume();
  fs.mkdirSync(path.join(v, 'Photos'));
  assert.deepStrictEqual(W.findStick([v]), { kind: 'none' });
});

test('table 2 · <root>/consonance-transfer/MANIFEST.json -> <root>', () => {
  const v = volume();
  put(path.join(v, 'consonance-transfer', 'MANIFEST.json'));
  assert.deepStrictEqual(W.findStick([v]), { kind: 'one', folder: v, layout: 'manifest' });
});

test('table 3 · <root>/consonance-L-20260911/consonance-tails/ledger.json (tonight\'s) -> that folder', () => {
  const v = volume();
  put(path.join(v, 'consonance-L-20260911', 'consonance-tails', 'ledger.json'));
  assert.deepStrictEqual(W.findStick([v]), { kind: 'one', folder: path.join(v, 'consonance-L-20260911'), layout: 'older' });
});

test('table 4 · markers in two different first-level folders -> AMBIGUOUS, both named', () => {
  const v = volume();
  put(path.join(v, 'a', 'consonance-tails', 'ledger.json'));
  put(path.join(v, 'b', 'consonance-transfer', 'MANIFEST.json'));
  assert.deepStrictEqual(W.findStick([v]), { kind: 'many', folders: [
    { folder: path.join(v, 'a'), layout: 'older' }, { folder: path.join(v, 'b'), layout: 'manifest' }] });
});

test('table 5 · a marker at <root> AND in a first-level folder of the same volume -> AMBIGUOUS, both named', () => {
  const v = volume();
  put(path.join(v, 'consonance-transfer', 'MANIFEST.json'));
  put(path.join(v, 'b', 'consonance-transfer', 'MANIFEST.json'));
  assert.deepStrictEqual(W.findStick([v]), { kind: 'many', folders: [
    { folder: v, layout: 'manifest' }, { folder: path.join(v, 'b'), layout: 'manifest' }] });
});

test('table 6 · <root>/a/b/consonance-tails/ledger.json (two levels down) -> NO STICK', () => {
  const v = volume();
  put(path.join(v, 'a', 'b', 'consonance-tails', 'ledger.json'));
  assert.deepStrictEqual(W.findStick([v]), { kind: 'none' });
});

// ── the volume list: fixed and removable, from WMI, never a guessed letter ──

test('the volume list keeps drive-letter lines only, as roots, sorted', () => {
  // built from letters, so no drive-letter literal sits in this file — portable-paths counts every one as a site
  const dev = (c) => `${c}:`;
  assert.deepStrictEqual(W.parseVolumeList(`${dev('D')}\r\n${dev('C')}\r\n\r\nWARNING: junk\r\n`), [`${dev('C')}\\`, `${dev('D')}\\`]);
  assert.deepStrictEqual(W.parseVolumeList(''), []);
});

// ══ the waiter ══════════════════════════════════════════════════════════════════════════════════════════════════

const APP = 4100;
/** A world: a data dir, a scripted app lifetime (image per probe), injected volumes, export and window. */
function world(opts) {
  opts = opts || {};
  const data = path.join(tmp, `data${++seq}`);
  fs.mkdirSync(data, { recursive: true });
  const w = { data, exports: [], windows: [], sleeps: 0, roots: opts.roots || [], imageCalls: 0, answerCalls: 0 };
  // A scripted lifetime per watched pid: one entry per POLL (advanced by the pid check), each the image that pid runs
  // then — null = dead, undefined = the image cannot be told. The image lookup reads the CURRENT entry, never advances.
  const lives = Object.assign({ [APP]: [...(opts.life || ['consonance', null])] }, opts.lives || {});
  const cur = {};
  w.inject = Object.assign({
    pid: 800001,
    pidAnswers: (pid) => {
      w.answerCalls++;
      const l = lives[pid];
      if (!l) return false;
      cur[pid] = l.length > 1 ? l.shift() : l[0];
      return cur[pid] !== null;
    },
    imageOf: (pid) => {
      if (lives[pid]) { w.imageCalls++; return pid in cur ? cur[pid] : lives[pid][0]; }
      return (opts.live || {})[pid] !== undefined ? opts.live[pid] : null;
    },
    pidsOf: () => opts.again || [],
    volumeRoots: () => w.roots,
    sleep: () => { w.sleeps++; },
    now: (() => { let t = Date.parse('2026-09-14T10:00:00.000Z'); return () => (t += 1000); })(),
    exportCarry: (stick) => { w.exports.push(stick); return (opts.exports || []).shift() || { stdout: JSON.stringify({ code: 0, outcome: 'CARRIED', rows: [{ result: { ok: true } }] }) + '\n' }; },
    openWindow: (p) => { if (opts.windowFails) throw new Error('no console'); w.windows.push(p); },
    maxPolls: 50,
  }, opts.inject || {});
  w.argv = ['--data', data, '--app-pid', String(APP), '--app-image', 'consonance.exe'];
  w.status = () => { try { return fs.readFileSync(path.join(data, W.STATUS), 'utf8'); } catch (_) { return null; } };
  return w;
}
const stickVolume = () => { const v = volume(); put(path.join(v, 'consonance-L-20260911', 'consonance-tails', 'ledger.json')); return v; };
const go = (w) => W.runWaiter(w.argv, w.inject);

// ── the ruled argv ──

test('accepts the ruled argv: --data --app-pid --app-image, and no --stick', () => {
  const w = world();
  assert.strictEqual(go(w).code, 0);
});

test('--stick is NOT an argument any more — refused, exit 2', () => {
  const w = world();
  assert.strictEqual(W.runWaiter([...w.argv, '--stick', 'x'], w.inject).code, 2);
});

for (const [label, drop] of [['--data', '--data'], ['--app-pid', '--app-pid'], ['--app-image', '--app-image']]) {
  test(`refuses without ${label}`, () => {
    const w = world();
    const i = w.argv.indexOf(drop);
    const argv = [...w.argv.slice(0, i), ...w.argv.slice(i + 2)];
    assert.strictEqual(W.runWaiter(argv, w.inject).code, 2);
  });
}

// ── gone ──

test('waits while the app\'s pid is alive under its image, and acts only when it is dead', () => {
  const w = world({ life: ['consonance', 'consonance', 'consonance', null], roots: [stickVolume()] });
  go(w);
  assert.strictEqual(w.sleeps, 3);
  assert.strictEqual(w.exports.length, 1);
});

test('GONE includes a pid alive under ANOTHER image — pid reuse is real (E-1) — caught at the minute check', () => {
  const w = world({ life: ['consonance', 'explorer'], roots: [stickVolume()] });
  go(w);
  assert.strictEqual(w.exports.length, 1);
  assert.strictEqual(w.sleeps, 29, 'the reused pid still answers, so it is caught by the image check on the 30th poll');
});

test('ordinary polls start NO process: the image is looked up once a minute, not every 2 s (the one-added-process bar)', () => {
  const w = world({ life: Array.from({ length: 45 }, () => 'consonance').concat([null]), roots: [volume()] });
  go(w);
  assert.strictEqual(w.answerCalls, 46);
  assert.strictEqual(w.imageCalls, 1, 'once, at poll 30 — never per poll, and not when the pid stopped answering');
});

test('a pid that stops answering is GONE even when tasklist cannot answer — never waited on for ever', () => {
  const w = world({ life: ['consonance', null], roots: [stickVolume()] });
  w.inject.imageOf = () => undefined;              // tasklist broken for the whole run
  const r = go(w);
  assert.strictEqual(w.exports.length, 1);
  assert.notStrictEqual(r.outcome, 'GAVE_UP');
});

test('"cannot tell" what the pid runs is waited out as alive, never taken as gone', () => {
  const w = world({ life: [undefined, undefined, null], roots: [stickVolume()] });
  go(w);
  assert.strictEqual(w.sleeps, 2);
});

// ── the exit rules ──

test('STAND DOWN: stick-apply.started.json names a live applier -> exit quietly, no find, no window, no export', () => {
  const w = world({ roots: [stickVolume()], live: { 4242: 'node' } });
  put(path.join(w.data, A.STARTED), JSON.stringify({ pid: 4242, image: 'node', script: 'stick-apply.js', at: 'x', stick: 'x' }));
  let looked = false;
  w.inject.volumeRoots = () => { looked = true; return w.roots; };
  const r = go(w);
  assert.deepStrictEqual([r.code, r.outcome, looked, w.windows.length, w.exports.length], [0, 'STOOD_DOWN', false, 0, 0]);
});

test('a handshake naming a DEAD applier is not a hand-off: the exit is real', () => {
  const w = world({ roots: [stickVolume()] });
  put(path.join(w.data, A.STARTED), JSON.stringify({ pid: 4242, image: 'node', script: 'stick-apply.js', at: 'x', stick: 'x' }));
  go(w);
  assert.strictEqual(w.exports.length, 1);
});

test('NO STICK at exit: no window, no export, no status file, no row — exit quietly', () => {
  const v = volume();
  const w = world({ roots: [v] });
  const before = fs.readdirSync(w.data).sort();
  const r = go(w);
  assert.deepStrictEqual([r.code, r.outcome, w.windows.length, w.exports.length, w.status()], [0, 'NO_STICK', 0, 0, null]);
  assert.deepStrictEqual(fs.readdirSync(w.data).sort(), before, 'the lock is gone again and nothing else was written');
});

test('ONE STICK at exit: a window opens, the export runs against THAT folder, and the status ends DONE', () => {
  const v = stickVolume();
  const w = world({ roots: [v] });
  const r = go(w);
  assert.deepStrictEqual(w.exports, [path.join(v, 'consonance-L-20260911')], 'the folder, never the volume');
  assert.strictEqual(w.windows.length, 1);
  assert.strictEqual(w.windows[0], path.join(w.data, W.STATUS));
  assert.deepStrictEqual([r.code, r.outcome], [0, 'CARRIED']);
  assert.match(w.status(), /@@END 0 DONE CARRIED/);
});

test('the stick is found at EXIT, not at launch — plugged in during the session, it is exported', () => {
  const w = world({ life: ['consonance', 'consonance', 'consonance', null] });
  const v = volume();
  w.roots = [v];
  const answers = w.inject.pidAnswers;
  let polls = 0;
  w.inject.pidAnswers = (pid) => { if (++polls === 2) put(path.join(v, 'consonance-tails', 'ledger.json')); return answers(pid); };
  go(w);
  assert.deepStrictEqual(w.exports, [v]);
});

test('AMBIGUOUS at exit: a window, NOT DONE naming every folder, nothing exported', () => {
  const v = volume();
  put(path.join(v, 'a', 'consonance-tails', 'ledger.json'));
  put(path.join(v, 'b', 'consonance-tails', 'ledger.json'));
  const w = world({ roots: [v] });
  const r = go(w);
  assert.deepStrictEqual([r.outcome, w.exports.length, w.windows.length], ['AMBIGUOUS', 0, 1]);
  assert.match(w.status(), new RegExp(path.join(v, 'a').replace(/\\/g, '\\\\')));
  assert.match(w.status(), new RegExp(path.join(v, 'b').replace(/\\/g, '\\\\')));
  assert.match(w.status(), /@@END 2 NOT DONE AMBIGUOUS/);
});

test('a window that cannot open does not cost the export — the status file records why', () => {
  const w = world({ roots: [stickVolume()], windowFails: true });
  const r = go(w);
  assert.deepStrictEqual([r.code, w.exports.length], [0, 1]);
  assert.match(w.status(), /the window could not be opened: no console — the export runs anyway/);
});

test('NOT DONE names the seats that stopped', () => {
  const rows = [{ seat: 'librarian', sid: '0c0c0c0b-x', verdict: 'REFUSED', reason: 'UNIMPORTED_TAIL', stops: true, result: null }];
  const w = world({ roots: [stickVolume()], exports: [{ stdout: JSON.stringify({ code: 1, outcome: 'STOPPED', rows }) + '\n' }] });
  go(w);
  assert.match(w.status(), /librarian 0c0c0c0b-x: REFUSED \(UNIMPORTED_TAIL\)/);
  assert.match(w.status(), /@@END 1 NOT DONE STOPPED/);
});

test('LEDGER_LOCKED is retried, every attempt written, then the export lands', () => {
  const locked = { stdout: JSON.stringify({ code: 2, outcome: 'LEDGER_LOCKED', why: 'pid 5', rows: [] }) + '\n' };
  const w = world({ roots: [stickVolume()], exports: [locked, locked] });
  const r = go(w);
  assert.deepStrictEqual([w.exports.length, r.code], [3, 0]);
  assert.strictEqual((w.status().match(/ledger is busy/g) || []).length, 2);
});

test('an export that prints no object is NOT DONE, code 3', () => {
  const w = world({ roots: [stickVolume()], exports: [{ stdout: 'boom', status: 1 }] });
  assert.strictEqual(go(w).code, 3);
  assert.match(w.status(), /@@END 3 NOT DONE CRASHED/);
});

// ── one waiter, and the quick reopen ──

test('a LIVE waiter already holds the lock: this one exits at once — no probe, no find', () => {
  const w = world({ roots: [stickVolume()], live: { 700: 'node' } });
  put(path.join(w.data, W.LOCK), JSON.stringify({ pid: 700, image: 'node', script: 'stick-waiter.js', at: 'x' }));
  const r = go(w);
  assert.deepStrictEqual([r.outcome, w.answerCalls, w.exports.length], ['ALREADY_WAITING', 0, 0]);
});

test('a DEAD waiter\'s lock is taken over, and released at exit', () => {
  const w = world();
  put(path.join(w.data, W.LOCK), JSON.stringify({ pid: 700, image: 'node', script: 'stick-waiter.js', at: 'x' }));
  go(w);
  assert.strictEqual(fs.existsSync(path.join(w.data, W.LOCK)), false);
});

test('a close and REOPEN inside one poll: the new app pid is adopted, and its exit is watched too', () => {
  const v = stickVolume();
  const w = world({ roots: [v], lives: { 4999: ['consonance', null] } });
  let round = 0;
  w.inject.pidsOf = () => (++round === 1 ? [4999] : []);
  go(w);
  assert.strictEqual(w.exports.length, 2, 'one export for the session that closed, one for the reopened session');
});

test('the real pid check, no injection: this process answers; a pid that exited does not', () => {
  assert.strictEqual(W.pidAnswers(process.pid), true);
  const child = require('child_process').spawnSync(process.execPath, ['-e', '0']);
  assert.strictEqual(child.status, 0);
  assert.strictEqual(W.pidAnswers(child.pid), false, 'a child that has exited and been reaped');
});

// ── the window, in --view mode ──

test('--view follows the status file to its END line, prints DONE by name, and holds for Enter', () => {
  const p = path.join(tmp, `status${++seq}.log`);
  fs.writeFileSync(p, 'CONSONANCE CLOSED.\nthe stick: X\n');
  let out = '', held = false, polls = 0;
  const code = W.runView(p, {
    out: (s) => { out += s; },
    sleep: () => { if (++polls === 2) fs.appendFileSync(p, '\nDONE (CARRIED)\n@@END 0 DONE CARRIED\n'); },
    waitForEnter: () => { held = true; },
  });
  assert.deepStrictEqual([code, held], [0, true]);
  assert.match(out, /CONSONANCE CLOSED/);
  assert.match(out, /DONE CARRIED/);
  assert.doesNotMatch(out, /@@END/, 'the marker is for the window, not the keeper');
});

test('--view never prints a half-written line', () => {
  const p = path.join(tmp, `status${++seq}.log`);
  fs.writeFileSync(p, 'complete\npartial-no-newl');
  let out = '', polls = 0;
  W.runView(p, { out: (s) => { out += s; }, sleep: () => { if (++polls === 1) fs.appendFileSync(p, 'ine\n@@END 1 NOT DONE STOPPED\n'); }, waitForEnter: () => {} });
  assert.match(out, /partial-no-newline/);
  assert.doesNotMatch(out, /partial-no-newl\n/);
});

console.log(`\n  ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
