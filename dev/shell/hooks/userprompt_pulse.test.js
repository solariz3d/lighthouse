// JS-SUITE: MACHINE-BOUND home=L root=PULSE_PYTHON
/* Tests for the ROW 10 condition in userprompt_pulse.py (2026-08-31, L021 P1c, pane E).
 *
 * The pulse is Python and reaches every seat on every turn, so it is exercised here the way it
 * runs: as a subprocess, with a hook-shaped stdin, an isolated HOME (the state file lands under
 * ~/.claude/shell), an isolated CONSONANCE_DATA (head-watch.jsonl), and a fixture transcript.
 * Nothing here touches the live state, the live transcript, or C:\Consonance\data.
 *
 * What the tests pin, one condition each:
 *   - a compaction row in THIS transcript after the previous prompt  -> the card path is on the line
 *   - a head-watch "start" after the previous prompt                 -> the card path is on the line
 *   - both boundaries BEFORE the previous prompt                     -> no card path (the path is not
 *                                                                        printed unconditionally)
 *   - no stdin transcript and no ledger                              -> no card path, pulse still valid JSON
 *   - MUTATION: the ROW 10 block removed from a copy                 -> the positive fixture prints no path
 *     (so the line is produced by the condition, not by anything else in the file)
 *
 * Run: node --test dev/shell/hooks/userprompt_pulse.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const HOOK = path.join(__dirname, 'userprompt_pulse.py');

/* WHICH PYTHON (D101 follow-on, pane A). The interpreter the machine registers for this hook, read from settings.json,
 * comes first: a test that ran a different interpreter than the registration would be testing a copy nothing loads.
 * resolvePython is PURE over `io` so its rule can be tested with fixtures on any machine. */
//
// The rule is the installer's (dev/shell/install.ps1:686-693, which registers this hook with runner `py`), in order:
//   1. the interpreter settings.json REGISTERS for userprompt_pulse.py — read from the PARSED JSON. The old regex ran
//      over the raw text, so it captured the path still JSON-escaped (C:\\Py\\python.exe) and its first pattern could
//      never match a Windows path at all; it worked on L only because Windows forgives doubled separators;
//   2. the first python.exe on PATH that is NOT under \WindowsApps\ — there, `python` is the Store stub (exit 9009);
//   3. the newest %LOCALAPPDATA%\Programs\Python\Python3*\python.exe, newest BY VERSION. The installer sorts FullName
//      as a string, which puts Python39 above Python314 — a divergence flagged to install.ps1's owner, not copied;
//   4. otherwise NO interpreter — never the stub, never a bare `python` that might be one.
// A stub is refused at every step, including a registration that names one.
const STUB = /[\\/]WindowsApps[\\/]/i;
function registeredPython(settingsText) {
  let cfg;
  try { cfg = JSON.parse(String(settingsText || '').replace(/^\uFEFF/, '')); } catch { return null; }
  const commands = [];
  (function walk(v) {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (k === 'command' && typeof x === 'string') commands.push(x); else walk(x); }
  })(cfg);
  for (const c of commands) {
    if (!/userprompt_pulse\.py/i.test(c)) continue;
    const m = /^\s*"([^"]+\.exe)"|^\s*(\S+\.exe)\b/i.exec(c);
    if (m && /python/i.test(m[1] || m[2])) return m[1] || m[2];
  }
  return null;
}
function resolvePython(io) {
  const reg = registeredPython(io.settings);
  if (reg && !STUB.test(reg) && io.isFile(reg)) return { exe: reg, rule: 'registered in ~/.claude/settings.json' };
  for (const dir of io.pathDirs || []) {
    const cand = path.join(dir, 'python.exe');
    if (!STUB.test(cand) && io.isFile(cand)) return { exe: cand, rule: 'first python.exe on PATH outside WindowsApps' };
  }
  const root = path.join(io.localAppData || '', 'Programs', 'Python');
  const vers = (io.listDir(root) || [])
    .map((n) => ({ n, v: /^Python3(\d*)$/i.exec(n) }))
    .filter((x) => x.v)
    .sort((a, b) => (Number(b.v[1]) || 0) - (Number(a.v[1]) || 0));
  for (const { n } of vers) {
    const cand = path.join(root, n, 'python.exe');
    if (io.isFile(cand)) return { exe: cand, rule: `newest ${n} under %LOCALAPPDATA%\\Programs\\Python` };
  }
  return { exe: null, rule: 'none found: no registration, no python.exe on PATH outside the WindowsApps stub, ' +
    'no %LOCALAPPDATA%\\Programs\\Python\\Python3*' };
}

const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };
const listDir = (p) => { try { return fs.readdirSync(p); } catch { return []; } };

/* The machine's own answer. PULSE_PYTHON is this file's declared root= (the JS-SUITE line above): set, it IS the
 * interpreter, and anything that is not an interpreter file — the runner's empty directory — means none. */
function machinePython() {
  const over = process.env.PULSE_PYTHON;
  if (over !== undefined) {
    return isFile(over) ? { exe: over, rule: 'PULSE_PYTHON' }
      : { exe: null, rule: `PULSE_PYTHON=${over} is not an interpreter file` };
  }
  let settings = '';
  try { settings = fs.readFileSync(path.join(os.homedir(), '.claude', 'settings.json'), 'utf8'); } catch { /* none */ }
  return resolvePython({ settings, pathDirs: (process.env.PATH || '').split(path.delimiter).filter(Boolean),
    localAppData: process.env.LOCALAPPDATA || '', isFile, listDir });
}

/* THE GATE, in the MACHINE-BOUND class's own terms (consonance/tools/js-suite.js): the universe line on every run; with
 * no interpreter, NOT-RUN with its reason, no assertions, exit 0 — unless the runner forces the gate open. */
const FOUND = machinePython();
console.log(`JS-SUITE: UNIVERSE interpreter=${FOUND.exe || 'none'} (${FOUND.rule})`);
if (!FOUND.exe && process.env.JS_SUITE_UNIVERSE !== 'force') {
  console.log(`JS-SUITE: NOT-RUN — no Python interpreter outside the Windows Store stub (${FOUND.rule})`);
  process.exit(0);
}
const PY = FOUND.exe || 'python';

function iso(msAgo) { return new Date(Date.now() - msAgo).toISOString(); }

/* One isolated run. Returns { ctx, raw, status }. */
function run({ prevMsAgo, compactMsAgo, startMsAgo, hook = HOOK, stdin = true }) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-home-'));
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-data-'));
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-cwd-sibling-'));
  const shell = path.join(home, '.claude', 'shell');
  fs.mkdirSync(shell, { recursive: true });
  const safe = path.basename(cwd).replace(/[^A-Za-z0-9\-_]/g, '_').slice(0, 64);
  if (prevMsAgo !== undefined) {
    const prev = new Date(Date.now() - prevMsAgo);
    // the hook writes local-offset ISO; give it the same shape it would have written
    const off = -prev.getTimezoneOffset();
    const sign = off >= 0 ? '+' : '-';
    const pad = (n) => String(Math.abs(n)).padStart(2, '0');
    const local = new Date(prev.getTime() - prev.getTimezoneOffset() * 60000).toISOString().slice(0, 19)
      + sign + pad(Math.floor(Math.abs(off) / 60)) + ':' + pad(Math.abs(off) % 60);
    fs.writeFileSync(path.join(shell, `pulse_state.${safe}.json`),
      JSON.stringify({ last_prompt_iso: local, first_seen_iso: local }));
  }
  const transcript = path.join(data, 'transcript.jsonl');
  const rows = [JSON.stringify({ type: 'user', timestamp: iso(3 * 3600e3), message: { role: 'user', content: 'hello' } })];
  if (compactMsAgo !== undefined) {
    rows.push(JSON.stringify({ type: 'user', isCompactSummary: true, timestamp: iso(compactMsAgo),
      message: { role: 'user', content: 'This session is being continued from a previous conversation' } }));
  }
  rows.push(JSON.stringify({ type: 'assistant', timestamp: iso(60e3), message: { role: 'assistant', content: 'ok' } }));
  fs.writeFileSync(transcript, rows.join('\n') + '\n');
  if (startMsAgo !== undefined) {
    fs.writeFileSync(path.join(data, 'head-watch.jsonl'),
      JSON.stringify({ ts: iso(startMsAgo), file: 'x', event: 'start', len: 1, head: '0' }) + '\n');
  }
  const r = spawnSync(PY, [hook], {
    cwd,
    input: stdin ? JSON.stringify({ hook_event_name: 'UserPromptSubmit', transcript_path: transcript, cwd }) : '',
    env: { ...process.env, USERPROFILE: home, HOME: home, CONSONANCE_DATA: data },
    encoding: 'utf8',
  });
  let ctx = null;
  try { ctx = JSON.parse(r.stdout).hookSpecificOutput.additionalContext; } catch { /* reported by the assertion below */ }
  return { ctx, raw: r.stdout, err: r.stderr, status: r.status };
}

// ── WHICH PYTHON: the resolver's rule, on fixtures (D101 follow-on) ──────────────────────────────────────────────────
// D HAS Python 3.14 and its bare `python` is the Windows Store stub (exit 9009, "Python was not found"). The old rule
// fell back to that stub, so all six tests below failed on D over a lookup, not over the hook.

// Every fixture path hangs off a drive-less root: a fixture string is still a site to portable-paths, and a drive letter
// here added five of them on the first run (pane A's own D083 rule, broken for the third time and caught by js-suite).
const FXR = path.join(path.sep, 'fx');
const STUB_DIR = path.join(FXR, 'AppData', 'Local', 'Microsoft', 'WindowsApps');
const LAD = path.join(FXR, 'AppData', 'Local');
const pyIn = (ver) => path.join(LAD, 'Programs', 'Python', ver, 'python.exe');
// settings.json in its real on-disk shape — JSON.stringify writes the escaping, so the fixture cannot drift from it.
const settingsFor = (exe) => JSON.stringify({ hooks: { UserPromptSubmit: [{ hooks: [{ type: 'command',
  command: `"${exe}" "${path.join(FXR, '.claude', 'shell', 'userprompt_pulse.py')}"` }] }] } });
function fx({ settings = '', pathDirs = [], files = [], pythons = [] }) {
  const have = new Set(files.map((f) => f.toLowerCase()));
  return {
    settings, pathDirs, localAppData: LAD,
    isFile: (p) => have.has(String(p).toLowerCase()),
    listDir: (p) => (path.normalize(p).toLowerCase() === path.join(LAD, 'Programs', 'Python').toLowerCase() ? pythons : []),
  };
}

test('WHICH PYTHON: a PATH whose only python is a WindowsApps stub is never chosen', () => {
  const r = resolvePython(fx({ pathDirs: [STUB_DIR], files: [path.join(STUB_DIR, 'python.exe'), pyIn('Python314')],
    pythons: ['Python314'] }));
  assert.strictEqual(r.exe, pyIn('Python314'), JSON.stringify(r));
});

test('WHICH PYTHON: with no real Python anywhere there is NO interpreter, and the reason says so', () => {
  const r = resolvePython(fx({ pathDirs: [STUB_DIR], files: [path.join(STUB_DIR, 'python.exe')] }));
  assert.strictEqual(r.exe, null, 'the stub must not be offered as an interpreter: ' + JSON.stringify(r));
  assert.match(r.rule, /stub|none/i, r.rule);
});

test('WHICH PYTHON: a real python.exe on PATH wins even when the stub comes first', () => {
  const real = path.join(FXR, 'Tools', 'Py', 'python.exe');
  const r = resolvePython(fx({ pathDirs: [STUB_DIR, path.dirname(real)], files: [path.join(STUB_DIR, 'python.exe'), real] }));
  assert.strictEqual(r.exe, real, JSON.stringify(r));
});

test('WHICH PYTHON: the NEWEST Python3x under LOCALAPPDATA, by version not by string (3.14 over 3.9)', () => {
  // install.ps1:691 sorts FullName as a STRING, which puts Python39 above Python314. Numbers here; flagged to B.
  const r = resolvePython(fx({ files: [pyIn('Python39'), pyIn('Python314'), pyIn('Python313')],
    pythons: ['Python39', 'Python314', 'Python313'] }));
  assert.strictEqual(r.exe, pyIn('Python314'), JSON.stringify(r));
});

test('WHICH PYTHON: an interpreter registered in settings.json wins (control — the old rule kept it too)', () => {
  const reg = path.join(FXR, 'Py', 'python.exe');
  const r = resolvePython(fx({ settings: settingsFor(reg),
    pathDirs: [STUB_DIR], files: [reg, pyIn('Python314')], pythons: ['Python314'] }));
  assert.strictEqual(r.exe, reg, JSON.stringify(r));
});

test('WHICH PYTHON: a registered interpreter that IS the Store stub is not taken', () => {
  const stub = path.join(STUB_DIR, 'python.exe');
  const r = resolvePython(fx({ settings: settingsFor(stub),
    files: [stub, pyIn('Python314')], pythons: ['Python314'] }));
  assert.strictEqual(r.exe, pyIn('Python314'), JSON.stringify(r));
});

const CARD = 'exo_memory/cards/claim-your-continuity.md';
const H = 3600e3;

test('a compaction of THIS transcript after the previous prompt puts the card path on the line', () => {
  const r = run({ prevMsAgo: 2 * H, compactMsAgo: 1 * H });
  assert.ok(r.ctx, 'pulse must emit valid hook JSON: ' + r.raw + r.err);
  assert.match(r.ctx, /crosses a compaction/, r.ctx);
  assert.ok(r.ctx.includes(CARD), 'the card PATH must be on the line: ' + r.ctx);
});

test('an app (re)start after the previous prompt puts the card path on the line', () => {
  const r = run({ prevMsAgo: 2 * H, startMsAgo: 1 * H });
  assert.ok(r.ctx, r.raw + r.err);
  assert.match(r.ctx, /crosses a restart/, r.ctx);
  assert.ok(r.ctx.includes(CARD), r.ctx);
});

test('boundaries BEFORE the previous prompt do not fire — the path is conditional, not furniture', () => {
  const r = run({ prevMsAgo: 1 * H, compactMsAgo: 2 * H, startMsAgo: 2 * H });
  assert.ok(r.ctx, r.raw + r.err);
  assert.ok(!r.ctx.includes(CARD), 'no boundary crossed, no card path: ' + r.ctx);
  assert.match(r.ctx, /since last msg/, 'the ordinary gap line still prints');
});

test('with no stdin transcript and no ledger the pulse is unchanged and still valid JSON (fails open)', () => {
  const r = run({ prevMsAgo: 2 * H, stdin: false });
  assert.ok(r.ctx, r.raw + r.err);
  assert.ok(!r.ctx.includes(CARD), r.ctx);
  assert.match(r.ctx, /^\[pulse\] /);
});

test('the first prompt (no previous) records the transcript offset and prints no path', () => {
  const r = run({ compactMsAgo: 1 * H });
  assert.ok(r.ctx, r.raw + r.err);
  assert.ok(!r.ctx.includes(CARD), 'nothing to cross on a first prompt: ' + r.ctx);
});

test('MUTATION: with the ROW 10 block removed, the positive fixture prints no path', () => {
  // Proves the line comes from the condition and from nothing else in the file.
  const src = fs.readFileSync(HOOK, 'utf8');
  const a = src.indexOf('# --- ROW 10 ON THE GAP');
  const b = src.indexOf('# --- end ROW 10');
  assert.ok(a > 0 && b > a, 'the ROW 10 block must be delimited by its two marker comments');
  const mutant = src.slice(0, a) + 'row10_part = ""\n' + src.slice(src.indexOf('\n', b) + 1);
  const mpath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'pulse-mut-')), 'userprompt_pulse.py');
  fs.writeFileSync(mpath, mutant);
  const r = run({ prevMsAgo: 2 * H, compactMsAgo: 1 * H, startMsAgo: 1 * H, hook: mpath });
  assert.ok(r.ctx, 'the mutant must still be a valid pulse: ' + r.raw + r.err);
  assert.ok(!r.ctx.includes(CARD), 'mutant printed the path anyway: ' + r.ctx);
  // and the control arm, same fixture, real hook: the path is there
  const c = run({ prevMsAgo: 2 * H, compactMsAgo: 1 * H, startMsAgo: 1 * H });
  assert.ok(c.ctx && c.ctx.includes(CARD), 'control must fire: ' + c.ctx);
});
