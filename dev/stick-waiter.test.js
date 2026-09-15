// stick-waiter.test.js — run with: node dev/stick-waiter.test.js
//
// WHAT THIS GUARDS. The waiter runs on EVERY launch and does its work after the only surface the keeper has is gone.
// Its failures are all silent: exporting on a hand-off (racing the applier), exporting — or raising a notice — when
// no stick is plugged in (the no-stick bar), never exporting when one is, and a find rule that disagrees with the
// app's. So: the §3 six-case table is pinned EXACTLY (the Rust suite tests the same six, and neither may add a case),
// and each exit rule from "WHAT THE WAITER RUNS" has its own test.
//
// The app-alive probe is an injected image lookup, the export and the notice are injected, and the volume roots are
// temp directories — so nothing here touches a real drive, a real app, or the screen.
//
// P-NO-CONSOLE (2026-09-14): the export window is gone. What this file now also guards is that NOTHING in the waiter or
// the applier can put a console window on the screen — a static sweep over every child_process call, and the notice's
// own shape (no launch of the PowerShell app on click, no text spliced into a script).

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
/** A world: a data dir, a scripted app lifetime (image per probe), injected volumes, export and notice. */
function world(opts) {
  opts = opts || {};
  const data = path.join(tmp, `data${++seq}`);
  fs.mkdirSync(data, { recursive: true });
  const w = { data, exports: [], notices: [], sleeps: 0, roots: opts.roots || [], imageCalls: 0, answerCalls: 0 };
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
    notify: (title, body, statusPath) => { if (opts.noticeFails) throw new Error('notifications are off'); w.notices.push({ title, body, statusPath }); },
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

test('STAND DOWN: stick-apply.started.json names a live applier -> exit quietly, no find, no notice, no export', () => {
  const w = world({ roots: [stickVolume()], live: { 4242: 'node' } });
  put(path.join(w.data, A.STARTED), JSON.stringify({ pid: 4242, image: 'node', script: 'stick-apply.js', at: 'x', stick: 'x' }));
  let looked = false;
  w.inject.volumeRoots = () => { looked = true; return w.roots; };
  const r = go(w);
  assert.deepStrictEqual([r.code, r.outcome, looked, w.notices.length, w.exports.length], [0, 'STOOD_DOWN', false, 0, 0]);
});

test('a handshake naming a DEAD applier is not a hand-off: the exit is real', () => {
  const w = world({ roots: [stickVolume()] });
  put(path.join(w.data, A.STARTED), JSON.stringify({ pid: 4242, image: 'node', script: 'stick-apply.js', at: 'x', stick: 'x' }));
  go(w);
  assert.strictEqual(w.exports.length, 1);
});

test('NO STICK at exit: no notice, no export, no status file, no row — exit quietly', () => {
  const v = volume();
  const w = world({ roots: [v] });
  const before = fs.readdirSync(w.data).sort();
  const r = go(w);
  assert.deepStrictEqual([r.code, r.outcome, w.notices.length, w.exports.length, w.status()], [0, 'NO_STICK', 0, 0, null]);
  assert.deepStrictEqual(fs.readdirSync(w.data).sort(), before, 'the lock is gone again and nothing else was written');
});

test('ONE STICK at exit: "don\'t pull it yet" BEFORE the export, DONE after it, and the status ends DONE', () => {
  const v = stickVolume();
  const w = world({ roots: [v] });
  let exportsWhenFirstNotice = null;
  const notify = w.inject.notify;
  w.inject.notify = (t, b, p) => { if (exportsWhenFirstNotice === null) exportsWhenFirstNotice = w.exports.length; notify(t, b, p); };
  const r = go(w);
  assert.deepStrictEqual(w.exports, [path.join(v, 'consonance-L-20260911')], 'the folder, never the volume');
  assert.strictEqual(w.notices.length, 2, 'two notices (re-rule 5190f73): one as it starts, one as it ends');
  assert.strictEqual(exportsWhenFirstNotice, 0, 'the first notice is up before the export begins');
  assert.match(w.notices[0].body, /^Saving to the stick — don't pull it yet\./);
  assert.ok(w.notices[0].body.includes(path.join(v, 'consonance-L-20260911')), 'it names the stick folder');
  assert.match(w.notices[1].body, /^DONE \(CARRIED\) — 1 seat\(s\) written to the stick\. You can unplug it now\.$/);
  for (const n of w.notices) assert.strictEqual(n.statusPath, path.join(w.data, W.STATUS));
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

test('AMBIGUOUS at exit: a notice, NOT DONE naming every folder, nothing exported', () => {
  const v = volume();
  put(path.join(v, 'a', 'consonance-tails', 'ledger.json'));
  put(path.join(v, 'b', 'consonance-tails', 'ledger.json'));
  const w = world({ roots: [v] });
  const r = go(w);
  assert.deepStrictEqual([r.outcome, w.exports.length, w.notices.length], ['AMBIGUOUS', 0, 1]);
  assert.match(w.notices[0].body, /^NOT DONE — more than one stick folder/);
  assert.ok(w.notices[0].body.includes(path.join(v, 'a')) && w.notices[0].body.includes(path.join(v, 'b')), 'the notice names the folders');
  assert.match(w.status(), new RegExp(path.join(v, 'a').replace(/\\/g, '\\\\')));
  assert.match(w.status(), new RegExp(path.join(v, 'b').replace(/\\/g, '\\\\')));
  assert.match(w.status(), /@@END 2 NOT DONE AMBIGUOUS/);
});

test('a notice that cannot be shown does not cost the export — the status file says so, and nothing opens instead', () => {
  const w = world({ roots: [stickVolume()], noticeFails: true });
  const r = go(w);
  assert.deepStrictEqual([r.code, w.exports.length, w.notices.length], [0, 1, 0]);
  assert.strictEqual((w.status().match(/the notification could not be shown: notifications are off — nothing opens instead/g) || []).length, 2,
    'both failures are written — the start one does not stop the export, the end one does not stop DONE');
  assert.match(w.status(), /@@END 0 DONE CARRIED/);
});

test('a NOT DONE notice carries the reason and the stopped seats, not only the verdict', () => {
  const rows = [{ seat: 'librarian', sid: '0c0c0c0b-x', verdict: 'REFUSED', reason: 'UNIMPORTED_TAIL', stops: true, result: null }];
  const w = world({ roots: [stickVolume()], exports: [{ stdout: JSON.stringify({ code: 1, outcome: 'STOPPED', why: null, rows }) + '\n' }] });
  go(w);
  assert.strictEqual(w.notices.length, 2);
  assert.match(w.notices[1].body, /NOT DONE — exit 1, STOPPED\./);
  assert.match(w.notices[1].body, /librarian 0c0c0c0b-x: REFUSED \(UNIMPORTED_TAIL\)/);
});

// ── P-NO-CONSOLE: nothing the waiter or the applier starts can draw a console window ──

test('the notice is protocol-activated to the status file — a click never opens the PowerShell app', () => {
  const xml = W.toastXml('Consonance — the stick', 'DONE', path.join(tmp, 'stick-waiter.status.log'));
  assert.match(xml, /^<toast activationType="protocol" launch="file:\/\/\//);
  assert.match(xml, /stick-waiter\.status\.log"/);
});

test('the notice escapes every value it carries — a folder named with & < > " \' cannot break or inject into it', () => {
  const nasty = 'D&D <stick> "x" \'y\'';
  const xml = W.toastXml(nasty, nasty, path.join(tmp, 'a&b', 'stick-waiter.status.log'));
  // Every value lands in exactly one of two places: the launch attribute, or a <text> element. Neither may hold a raw
  // special character once the five entities are taken out.
  const values = [xml.match(/launch="([^"]*)"/)[1], ...[...xml.matchAll(/<text>([^<]*)<\/text>/g)].map((m) => m[1])];
  assert.strictEqual(values.length, 3, 'one launch target and two text elements');
  for (const v of values) assert.doesNotMatch(v.replace(/&(amp|lt|gt|quot|apos);/g, ''), /[<>"'&]/, `raw special character in ${v}`);
  assert.ok(xml.includes('D&amp;D &lt;stick&gt; &quot;x&quot; &apos;y&apos;'));
});

test('the PowerShell script is a constant: nothing from a stick, a path or a seat is spliced into it', () => {
  assert.doesNotMatch(W.TOAST_PS, /\$\{/, 'no template holes');
  assert.match(W.TOAST_PS, /\$env:CONSONANCE_TOAST_XML/, 'the text arrives by environment variable');
});

test('the notices are sent as Consonance: the app\'s own identifier, registered with DisplayName Consonance before Show', () => {
  const conf = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'consonance', 'src-tauri', 'tauri.conf.json'), 'utf8'));
  assert.strictEqual(W.APP_ID, conf.identifier, 'the id is tauri.conf.json\'s — one app, one name, if the app ever sends its own');
  const ps = W.TOAST_PS;
  const reg = ps.indexOf(`HKCU:\\Software\\Classes\\AppUserModelId\\${W.APP_ID}`);
  const show = ps.indexOf(`CreateToastNotifier('${W.APP_ID}').Show($t)`);
  assert.ok(reg >= 0 && show > reg, 'registered under HKCU, then shown under the same id');
  assert.match(ps, /-Name DisplayName -Value 'Consonance'/);
  assert.doesNotMatch(ps, /WindowsPowerShell/, 'no longer attributed to PowerShell');
  assert.ok(fs.existsSync(W.ICON), `the icon the registration points at exists: ${W.ICON}`);
});

test('both notices of an export carry ONE tag, so DONE replaces "don\'t pull it yet" instead of sitting beside it', () => {
  assert.match(W.TOAST_PS, new RegExp(`\\$t\\.Tag = '${W.TOAST_TAG}'`));
  assert.match(W.TOAST_PS, /\$t\.Group = '[a-z]+'/);
});

test('SWEEP: every child_process call in the waiter, the applier and the carry passes windowsHide: true — one named exception', () => {
  const files = ['stick-waiter.js', 'stick-apply.js', 'tail-carry.js', 'place-conversations.js'];
  const calls = [];
  for (const f of files) {
    const src = fs.readFileSync(path.join(__dirname, f), 'utf8');
    const re = /\b(spawnSync|spawn|execFileSync|execFile|execSync|exec)\(/g;
    let m;
    while ((m = re.exec(src))) {
      // the call's text up to its closing paren at depth 0
      let depth = 0, i = m.index + m[0].length - 1, end = -1;
      for (; i < src.length; i++) { const c = src[i]; if (c === '(') depth++; else if (c === ')') { depth--; if (depth === 0) { end = i; break; } } }
      const text = src.slice(m.index, end + 1);
      const line = src.slice(0, m.index).split('\n').length;
      calls.push({ f, line, text, hidden: /windowsHide:\s*true/.test(text) });
    }
  }
  assert.ok(calls.length >= 8, `the sweep found only ${calls.length} calls — it is not seeing the files`);
  const unhidden = calls.filter((c) => !c.hidden);
  // THE ONE EXCEPTION: relaunching consonance.exe — a GUI-subsystem program that allocates no console, where SW_HIDE
  // could start the app itself hidden (stick-apply.js, defaultRelaunch).
  const listing = unhidden.map((c) => `  ${c.f}:${c.line} ${c.text.replace(/\s+/g, ' ')}`).join('\n');
  assert.strictEqual(unhidden.length, 1, `expected exactly the relaunch unhidden; found:\n${listing}`);
  assert.strictEqual(unhidden[0].f, 'stick-apply.js', listing);
  assert.match(unhidden[0].text, /^spawn\(exe, \[\]/, listing);
});

test('SWEEP: no path in the waiter can open a console window on purpose — no "start", no cmd.exe, no --view launched', () => {
  const src = fs.readFileSync(path.join(__dirname, 'stick-waiter.js'), 'utf8').split('\n').filter((l) => !/^\s*(\/\/|\*)/.test(l)).join('\n');
  assert.doesNotMatch(src, /cmd\.exe/);
  assert.doesNotMatch(src, /['"`]start\b/);
  assert.doesNotMatch(src, /openWindow/);
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
  assert.deepStrictEqual(w.notices.map((n) => n.body.split(' ')[0]), ['Saving', 'DONE'], 'three attempts are ONE export to the keeper: one start notice, one end');
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

// ══ P-LEAVE (D063) — §2.3 a-d as re-ruled at §2.7: the app saves at close; the waiter is the FALLBACK ══════════════

const leaveFile = (w, name, rec) => put(path.join(w.data, name), JSON.stringify(Object.assign({ pid: APP, image: 'consonance.exe', at: '2026-09-14T11:50:00.000Z' }, rec || {})));
const exists = (w, name) => fs.existsSync(path.join(w.data, name));
const STICK_FOLDER = (v) => path.join(v, 'consonance-L-20260911');
const plantLedgerLock = (v, rec) => put(path.join(STICK_FOLDER(v), 'consonance-tails', 'ledger.lock'), JSON.stringify(Object.assign({ image: 'node', script: 'tail-carry.js', at: 'x' }, rec)));

test('P-LEAVE 2.1: the two LEAVE file names are the ruled ones — and equal the app\'s constants when sync_launch.rs has them', () => {
  assert.deepStrictEqual([W.LEAVE_STARTED, W.LEAVE_RESULT], ['stick-leave.started.json', 'stick-leave.result.json']);
  const rs = fs.readFileSync(path.join(__dirname, '..', 'consonance', 'src-tauri', 'src', 'sync_launch.rs'), 'utf8');
  for (const [name, value] of [['LEAVE_STARTED', W.LEAVE_STARTED], ['LEAVE_RESULT', W.LEAVE_RESULT]]) {
    const m = rs.match(new RegExp(`\\b${name}\\s*:\\s*&str\\s*=\\s*"([^"]+)"`));
    // Both halves land together: until E's constant exists this checks the JS side only, and says so.
    if (m) assert.strictEqual(m[1], value, `${name} disagrees with sync_launch.rs`);
    else console.log(`       (sync_launch.rs has no ${name} yet — the cross-check is pending E's half)`);
  }
});

test('P-LEAVE case b: a LEAVE_RESULT for the watched pid -> stand down: no find, no notice, no export — whatever its outcome', () => {
  for (const outcome of ['DONE', 'NOT_DONE']) {
    const w = world({ roots: [stickVolume()] });
    leaveFile(w, W.LEAVE_RESULT, { outcome, code: outcome === 'DONE' ? 0 : 1, rows: [] });
    let looked = false;
    w.inject.volumeRoots = () => { looked = true; return w.roots; };
    const r = go(w);
    assert.deepStrictEqual([r.code, r.outcome, looked, w.notices.length, w.exports.length], [0, 'STOOD_DOWN_LEAVE', false, 0, 0], outcome);
  }
});

test('P-LEAVE D-4: the waiter removes the LEAVE_RESULT it stood down on (and a same-pid LEAVE_STARTED beside it) — AFTER acting', () => {
  const w = world({ roots: [stickVolume()] });
  leaveFile(w, W.LEAVE_RESULT, { outcome: 'DONE', code: 0, rows: [] });
  leaveFile(w, W.LEAVE_STARTED);
  let presentWhenDeciding = null;
  w.inject.pidsOf = () => { presentWhenDeciding = exists(w, W.LEAVE_RESULT); return []; };
  go(w);
  assert.deepStrictEqual([exists(w, W.LEAVE_RESULT), exists(w, W.LEAVE_STARTED)], [false, false]);
  assert.strictEqual(presentWhenDeciding, false, 'removed once acted on, before the adoption check hands over');
});

test('P-LEAVE D-9: case b runs the adoption check before returning — a relaunch inside one poll is adopted and watched', () => {
  const w = world({ roots: [stickVolume()], lives: { 4999: ['consonance', null] } });
  leaveFile(w, W.LEAVE_RESULT, { outcome: 'DONE', code: 0, rows: [] });
  let round = 0;
  w.inject.pidsOf = () => (++round === 1 ? [4999] : []);
  const r = go(w);
  assert.strictEqual(w.exports.length, 1, 'the adopted session\'s own exit (no LEAVE files for 4999) is the fallback export');
  assert.strictEqual(r.outcome, 'CARRIED');
});

test('P-LEAVE D-9: case a (a live applier) runs the adoption check before returning too', () => {
  const w = world({ roots: [stickVolume()], live: { 4242: 'node' }, lives: { 4999: ['consonance', null] } });
  put(path.join(w.data, A.STARTED), JSON.stringify({ pid: 4242, image: 'node', script: 'stick-apply.js', at: 'x', stick: 'x' }));
  let round = 0;
  w.inject.pidsOf = () => (++round === 1 ? [4999] : []);
  const watched = [];
  const answers = w.inject.pidAnswers;
  w.inject.pidAnswers = (pid) => { watched.push(pid); return answers(pid); };
  const r = go(w);
  assert.ok(watched.includes(4999), `the relaunched app (4999) is adopted and polled; polled: ${[...new Set(watched)].join(', ')}`);
  assert.strictEqual(round, 2, 'and at 4999\'s own exit the adoption check runs again');
  assert.strictEqual(r.outcome, 'STOOD_DOWN');
});

test('P-LEAVE case c: LEAVE_STARTED with no LEAVE_RESULT -> WAIT while the ledger.lock holder is live, THEN export once', () => {
  const v = stickVolume();
  // the orphan tail-carry, pid 5100: alive for three polls, then gone
  const w = world({ roots: [v], lives: { 5100: ['node', 'node', 'node', null] } });
  leaveFile(w, W.LEAVE_STARTED, { stick: STICK_FOLDER(v) });
  plantLedgerLock(v, { pid: 5100 });
  let holderAtExport = 'not exported';
  const exp = w.inject.exportCarry;
  w.inject.exportCarry = (s) => { holderAtExport = w.inject.pidAnswers(5100); return exp(s); };
  const r = go(w);
  assert.strictEqual(w.exports.length, 1, 'one export, after the wait — never a retry race with the orphan');
  assert.strictEqual(holderAtExport, false, 'the export starts only once the holder pid is not live');
  assert.ok(w.sleeps >= 3, `waited across the holder's polls (slept ${w.sleeps})`);
  assert.strictEqual(r.outcome, 'CARRIED');
});

test('P-LEAVE case c: the fallback notices say the app stopped DURING its save, and name "fallback"', () => {
  const v = stickVolume();
  const w = world({ roots: [v] });
  leaveFile(w, W.LEAVE_STARTED, { stick: STICK_FOLDER(v) });
  go(w);
  assert.strictEqual(w.notices.length, 2);
  for (const n of w.notices) assert.match(n.title, /fallback/i);
  assert.match(w.notices[0].body, /stopped during its own save/);
  assert.match(w.status(), /fallback/i);
});

test('P-LEAVE D-4: case c removes LEAVE_STARTED only AFTER its export', () => {
  const v = stickVolume();
  const w = world({ roots: [v] });
  leaveFile(w, W.LEAVE_STARTED, { stick: STICK_FOLDER(v) });
  let presentAtExport = null;
  const exp = w.inject.exportCarry;
  w.inject.exportCarry = (s) => { presentAtExport = exists(w, W.LEAVE_STARTED); return exp(s); };
  go(w);
  assert.deepStrictEqual([presentAtExport, exists(w, W.LEAVE_STARTED)], [true, false]);
});

test('P-LEAVE D-4: the removal never takes a NEWER app\'s LEAVE file written while the fallback export ran', () => {
  const v = stickVolume();
  const w = world({ roots: [v] });
  leaveFile(w, W.LEAVE_STARTED, { stick: STICK_FOLDER(v) });
  const exp = w.inject.exportCarry;
  // mid-export, a relaunched app (pid 4999) begins its own Leave and writes the same name
  w.inject.exportCarry = (s) => { leaveFile(w, W.LEAVE_STARTED, { pid: 4999, stick: STICK_FOLDER(v) }); return exp(s); };
  go(w);
  assert.strictEqual(JSON.parse(fs.readFileSync(path.join(w.data, W.LEAVE_STARTED), 'utf8')).pid, 4999, 'the newer file stays');
});

test('P-LEAVE case c: no ledger.lock, or one naming a DEAD pid -> nothing to wait on, export at once', () => {
  for (const plant of [false, true]) {
    const v = stickVolume();
    const w = world({ roots: [v], life: [null] });            // the app already gone: every sleep below is the case-c wait
    leaveFile(w, W.LEAVE_STARTED, { stick: STICK_FOLDER(v) });
    if (plant) plantLedgerLock(v, { pid: 5222 });      // no life scripted for 5222: it does not answer
    go(w);
    assert.deepStrictEqual([w.exports.length, w.sleeps], [1, 0], plant ? 'dead holder' : 'no lock');
  }
});

test('P-LEAVE case c: a holder whose image cannot be told is waited on as live — never exported past', () => {
  const v = stickVolume();
  const w = world({ roots: [v], lives: { 5100: [undefined] } });
  leaveFile(w, W.LEAVE_STARTED, { stick: STICK_FOLDER(v) });
  plantLedgerLock(v, { pid: 5100 });
  const r = go(w);
  assert.deepStrictEqual([w.exports.length, r.outcome], [0, 'GAVE_UP']);
  assert.strictEqual(exists(w, W.LEAVE_STARTED), true, 'not acted on, so not removed');
});

test('P-LEAVE case c: a lock holder that is a live pid under ANOTHER image is not the orphan — export at once', () => {
  const v = stickVolume();
  const w = world({ roots: [v], lives: { 5100: ['explorer'] } });
  leaveFile(w, W.LEAVE_STARTED, { stick: STICK_FOLDER(v) });
  plantLedgerLock(v, { pid: 5100 });
  go(w);
  assert.strictEqual(w.exports.length, 1);
});

test('P-LEAVE case d: neither LEAVE file -> today\'s path, and its notices name "fallback"', () => {
  const w = world({ roots: [stickVolume()] });
  const r = go(w);
  assert.deepStrictEqual([w.exports.length, r.outcome], [1, 'CARRIED']);
  for (const n of w.notices) assert.match(n.title, /fallback/i);
  assert.match(w.notices[0].body, /without saving to the stick itself/);
});

test('P-LEAVE case d, no stick: still quiet — no notice, no status file', () => {
  const w = world();
  const r = go(w);
  assert.deepStrictEqual([r.outcome, w.notices.length, w.status()], ['NO_STICK', 0, null]);
});

test('P-LEAVE STALE: LEAVE files naming a DIFFERENT pid are ignored — case d runs — and the waiter does NOT remove them', () => {
  const w = world({ roots: [stickVolume()], life: [null] });
  leaveFile(w, W.LEAVE_RESULT, { pid: 3999, outcome: 'DONE', code: 0, rows: [] });
  leaveFile(w, W.LEAVE_STARTED, { pid: 3999 });
  const r = go(w);
  assert.deepStrictEqual([w.exports.length, r.outcome, w.sleeps], [1, 'CARRIED', 0], 'not a stand-down and not a wait');
  assert.deepStrictEqual([exists(w, W.LEAVE_RESULT), exists(w, W.LEAVE_STARTED)], [true, true], 'the app removes stale files, not the waiter');
});

test('P-LEAVE D-7: the image compares lower-cased with ".exe" stripped on BOTH sides; the pid decides first', () => {
  for (const image of ['consonance.exe', 'CONSONANCE.EXE', 'consonance', 'Consonance.Exe']) {
    const w = world({ roots: [stickVolume()] });
    leaveFile(w, W.LEAVE_RESULT, { image, outcome: 'DONE', code: 0, rows: [] });
    assert.strictEqual(go(w).outcome, 'STOOD_DOWN_LEAVE', image);
  }
  const w = world({ roots: [stickVolume()] });
  w.argv = ['--data', w.data, '--app-pid', String(APP), '--app-image', 'CONSONANCE.exe'];
  leaveFile(w, W.LEAVE_RESULT, { outcome: 'DONE', code: 0, rows: [] });
  assert.strictEqual(go(w).outcome, 'STOOD_DOWN_LEAVE', 'the argv side is normalised too');
  const x = world({ roots: [stickVolume()] });
  leaveFile(x, W.LEAVE_RESULT, { image: 'node', outcome: 'DONE', code: 0, rows: [] });
  assert.strictEqual(go(x).outcome, 'CARRIED', 'the right pid under another image is not this app\'s Leave');
});

test('P-LEAVE: a LEAVE_RESULT beats a LEAVE_STARTED for the same pid — the Leave finished, so no fallback', () => {
  const v = stickVolume();
  const w = world({ roots: [v], life: [null], lives: { 5100: ['node'] } });
  leaveFile(w, W.LEAVE_STARTED, { stick: STICK_FOLDER(v) });
  leaveFile(w, W.LEAVE_RESULT, { outcome: 'DONE', code: 0, rows: [] });
  plantLedgerLock(v, { pid: 5100 });
  const r = go(w);
  assert.deepStrictEqual([r.outcome, w.exports.length, w.sleeps], ['STOOD_DOWN_LEAVE', 0, 0]);
});

test('P-LEAVE: a live applier (case a) is checked before any LEAVE file', () => {
  const w = world({ roots: [stickVolume()], live: { 4242: 'node' } });
  put(path.join(w.data, A.STARTED), JSON.stringify({ pid: 4242, image: 'node', script: 'stick-apply.js', at: 'x', stick: 'x' }));
  leaveFile(w, W.LEAVE_RESULT, { outcome: 'DONE', code: 0, rows: [] });
  assert.strictEqual(go(w).outcome, 'STOOD_DOWN');
  assert.strictEqual(exists(w, W.LEAVE_RESULT), true, 'case a acts on no LEAVE file, so it removes none');
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
