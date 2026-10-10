// session-start-light.test.js: node --test dev/shell/hooks/session-start-light.test.js   (D277 part 5, seat A)
// The session-start hook behind ONE switch, `gates_mode` in ~/.consonance.json (the switch of consonance/hooks/gate-mode.test.js; plan: exo_memory/loop/plan_lighten_the_load_2026-10-09.md, part 5).
// This hook runs LIVE at every session start, so every row runs a COPY of it against a temp shell dir, a temp HOME and a fixed clock: nothing here reads or writes the real ~/.claude/shell.
//   row 1   the key absent / "strict" / anything but "light" / unreadable: the output is BYTE-FOR-BYTE what the hook produced before this change (pinned by sha256 of the unmodified hook's output, startup, resume and compact)
//   row 2   "light" (any case, spaces, a BOM): startup is the trimmed digest under the measured budget; the day's counts are right
//   row 3   "light" on resume and compact (a thread that was never dark): counts only, under a smaller budget
//   row 4   light keeps what is used and rare: the ambient block, the seat's own recent sessions, the L3 notices and the night table are byte-identical to strict
//   row 5   the Third Place's wake is the same in both modes
//   row 6   a digest light cannot read (no groups, empty, junk) falls back to the digest as it is: nothing is hidden by a parse failure; and the hook never throws
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');
const { spawnSync } = require('child_process');

const SHELLSRC = path.join(__dirname, '..');
const HOOK = process.env.SESSION_START_UNDER_TEST || path.join(__dirname, 'session-start.js');   // (a mutated copy, for the mutation run)
const FIXED = Date.parse('2026-10-09T17:00:00Z');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const mk = (f, text) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
const cp = (from, to) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); };

// ---- the fixture: two days of digests in the real layout (the sizes of 2026-10-05 and 10-06 on this machine) ----
const CWDS = ['third-place', 'librarian', 'main', 'sibling-5bf9d657', 'sibling-3d57124e', 'sibling-0845a868', 'sibling-07b8a48f', 'sibling-a80a1c20'].map((n) => 'C:\\Consonance\\instances\\' + n);
const COUNTS = { '2026-10-06': [36, 127, 98, 61, 55, 52, 49, 4], '2026-10-05': [20, 61, 44, 25, 23, 22, 18, 2] };
const hms = (i, n) => { const s = Math.floor(i * 86399 / Math.max(1, n - 1)); return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((x) => String(x).padStart(2, '0')).join(':'); };
function digest(date, counts = COUNTS[date]) {
  const total = counts.reduce((a, b) => a + b, 0), parts = [`# ${date} Digest`, '', `## ${total} sessions`, ''];
  counts.forEach((n, g) => { parts.push(`### ${CWDS[g]}`); for (let i = 0; i < n; i++) parts.push(`- ${hms(i, n)} UTC`); parts.push(''); });
  return parts.join('\n');
}
const LIB = CWDS[1], TP = CWDS[0];
function install({ config = {}, digests = true, l3 = false, knock = false, extra = {} } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ss-light-')), shell = path.join(root, 'shell'), home = path.join(root, 'home'), inst = path.join(root, 'instances');
  cp(HOOK, path.join(shell, 'hooks', 'session-start.js'));
  for (const f of ['ambient.js', 'fresh-guard.js']) cp(path.join(SHELLSRC, 'lib', f), path.join(shell, 'lib', f));
  if (digests) for (const d of Object.keys(COUNTS)) mk(path.join(shell, 'digests', d + '.md'), digest(d));
  // the seat's own recent sessions (and, for the night table, a stop by someone else before the dark)
  mk(path.join(shell, 'event_log.jsonl'), [LIB, TP].flatMap((cwd) => ['2026-10-09T10:00:00.000Z', '2026-10-09T11:00:00.000Z', '2026-10-09T12:00:00.000Z', '2026-10-09T13:00:00.000Z'].map((t, i) => JSON.stringify({ type: 'session_stop', timestamp: t, cwd, session_id: 'earlier' + i }))).join('\n') + '\n');
  if (l3) mk(path.join(shell, 'l3_overseer.jsonl'), JSON.stringify({ type: 'l3_overseer_verdict', timestamp: new Date(FIXED - 3600e3).toISOString(), trajectory: 'frame-hardening', recommendation: 'watch', specific_observations: 'the same three paragraphs, again, in a row' }) + '\n');
  if (knock) { mk(path.join(shell, 'duration', 'goal-x', 'progress.md'), '[DRIFT-FOUND] a goal fired in the dark\n'); fs.utimesSync(path.join(shell, 'duration', 'goal-x', 'progress.md'), new Date(FIXED - 600e3), new Date(FIXED - 600e3)); }
  mk(path.join(home, '.consonance.json'), JSON.stringify({ ambient_lat: '50.4452', ambient_lon: '-104.6189', ambient_label: 'Regina, SK', ambient_tz: 'America/Regina', instances_dir: inst, ...config }));
  fs.mkdirSync(inst, { recursive: true });
  mk(path.join(root, 'fixed-clock.js'), `const R = Date, F = ${FIXED}; class FD extends R { constructor(...a) { if (a.length) super(...a); else super(F); } static now() { return F; } } global.Date = FD;\n`);
  for (const [f, text] of Object.entries(extra)) mk(path.join(shell, f), text);
  return { root, shell, home };
}
function run(e, source, cwd, { rawConfig } = {}) {
  if (rawConfig !== undefined) mk(path.join(e.home, '.consonance.json'), rawConfig);
  const r = spawnSync(process.execPath, ['-r', path.join(e.root, 'fixed-clock.js'), path.join(e.shell, 'hooks', 'session-start.js')], {
    input: JSON.stringify({ hook_event_name: 'SessionStart', source, session_id: 'now-1', cwd }), encoding: 'utf8', timeout: 20000, cwd: e.root,
    env: { PATH: process.env.PATH, SystemRoot: process.env.SystemRoot, USERPROFILE: e.home, HOME: e.home, CONSONANCE_SHELL_DIR: e.shell },
  });
  assert.equal(r.status, 0, `exit ${r.status}: ${r.stderr}`);
  return r.stdout;
}
const ctxOf = (stdout) => JSON.parse(stdout).hookSpecificOutput.additionalContext;
const B = (s) => Buffer.byteLength(s);
const roots = [];
const fresh = (o) => { const e = install(o); roots.push(e.root); return e; };
test.after(() => { for (const r of roots) try { fs.rmSync(r, { recursive: true, force: true }); } catch (_) { /* temp */ } });

// The unmodified hook's output on THIS fixture (computed at 9b5f40ba before any edit): bytes and sha256 of the whole stdout.
const GOLDEN = {
  startup: { bytes: 12539, sha: '63d842a4c3575fe38cea6a353f3b0ad9badf3d66b9cdbc5c206a446c941eb9d8' },
  resume: { bytes: 12539, sha: '63d842a4c3575fe38cea6a353f3b0ad9badf3d66b9cdbc5c206a446c941eb9d8' },
  compact: { bytes: 12539, sha: '63d842a4c3575fe38cea6a353f3b0ad9badf3d66b9cdbc5c206a446c941eb9d8' },
};
if (process.env.GOLDEN_PRINT) {
  const e = fresh();
  for (const s of ['startup', 'resume', 'compact']) { const out = run(e, s, LIB); console.log(`${s}: { bytes: ${B(out)}, sha: '${sha(out)}' }`); }
  process.exit(0);
}

test('row 1: the key absent, "strict", a word that is not light, a non-string, unreadable or not JSON: the output is BYTE-FOR-BYTE the hook as it was (startup, resume, compact)', () => {
  const e = fresh();
  for (const s of ['startup', 'resume', 'compact']) { const out = run(e, s, LIB); assert.deepEqual({ bytes: B(out), sha: sha(out) }, GOLDEN[s], `${s}: key absent`); }
  const strictOut = Object.fromEntries(['startup', 'resume', 'compact'].map((s) => [s, run(e, s, LIB)]));
  for (const cfg of [{ gates_mode: 'strict' }, { gates_mode: 'lite' }, { gates_mode: 'warn' }, { gates_mode: true }, { gates_mode: 1 }, { gates_mode: ['light'] }, { gates_mode: null }, { gates_mode: '' }]) {
    for (const s of ['startup', 'resume', 'compact']) assert.equal(run(e, s, LIB, { rawConfig: JSON.stringify({ ambient_lat: '50.4452', ambient_lon: '-104.6189', ambient_label: 'Regina, SK', ambient_tz: 'America/Regina', ...cfg }) }), strictOut[s], `${JSON.stringify(cfg)} ${s}`);
  }
  for (const raw of ['{ not json', '', '[]']) assert.equal(run(e, 'startup', LIB, { rawConfig: raw }).length > 0, true, `unreadable config ${JSON.stringify(raw)} still produces output`);
  assert.equal(B(strictOut.startup) > 12000, true, 'control: today\'s startup digest is the 12-13 KB the census measured');
});

const LIGHT = { gates_mode: 'light' };
const START_BUDGET = 2200, CONTINUE_BUDGET = 1600;   // measured on this fixture: see the hand-back; bytes of additionalContext
test('row 2: light, at startup: the digests are counts plus the last three of the newest day, the whole injection under the budget, the counts right', () => {
  const e = fresh({ config: LIGHT }), strict = ctxOf(run(fresh(), 'startup', LIB)), light = ctxOf(run(e, 'startup', LIB));
  assert.ok(B(light) <= START_BUDGET, `${B(light)} B is over ${START_BUDGET}`); assert.ok(B(light) < B(strict) / 5, `${B(light)} against ${B(strict)}`);
  assert.match(light, /^# Shell context \(from ~\/\.claude\/shell\)\n## Ambient context \(Regina, SK\)/, 'the ambient block is first, as before');
  assert.match(light, /## Recent session digests\n### 2026-10-06\n482 sessions\n/, 'the newest day: its total');
  const total = (d) => COUNTS[d].reduce((a, b) => a + b, 0); assert.equal(total('2026-10-06'), 482);
  for (let g = 0; g < CWDS.length; g++) assert.ok(light.includes(`- ${CWDS[g]}: ${COUNTS['2026-10-06'][g]}`), `${CWDS[g]} count`);
  assert.ok(light.includes(`- ${LIB}: 127 · last ${hms(126, 127)}, ${hms(125, 127)}, ${hms(124, 127)} UTC`), 'the last three, newest first, for the newest day');
  assert.match(light, new RegExp(`### 2026-10-05\\n${total('2026-10-05')} sessions\\n`), 'the older day: its total'); assert.ok(light.includes(`- ${LIB}: 61\n`) && !light.includes(`- ${LIB}: 61 ·`), 'and counts only');
  assert.doesNotMatch(light, /\n- \d\d:\d\d:\d\d UTC/, 'no timestamp list left'); assert.match(light, /## Recent sessions in C:\\Consonance\\instances\\librarian\n- 2026-10-09T13:00:00\.000Z/, 'the seat\'s own recent sessions stay');
  for (const v of [' light ', 'LIGHT', 'Light']) assert.equal(ctxOf(run(fresh({ config: { gates_mode: v } }), 'startup', LIB)), light, JSON.stringify(v));
  assert.equal(ctxOf(run(e, 'startup', LIB, { rawConfig: '\uFEFF' + JSON.stringify({ ambient_lat: '50.4452', ambient_lon: '-104.6189', ambient_label: 'Regina, SK', ambient_tz: 'America/Regina', gates_mode: 'light' }) })), light, 'a BOM before the JSON');
});

test('row 3: light, on resume and compact (a thread that was never dark): counts only, under a smaller budget', () => {
  const e = fresh({ config: LIGHT });
  for (const s of ['resume', 'compact']) {
    const light = ctxOf(run(e, s, LIB)), strict = ctxOf(run(fresh(), s, LIB));
    assert.ok(B(light) <= CONTINUE_BUDGET, `${s}: ${B(light)} B is over ${CONTINUE_BUDGET}`); assert.ok(B(light) < B(strict) / 8, `${s}: ${B(light)} against ${B(strict)}`);
    assert.ok(light.includes(`- ${LIB}: 127\n`) && !light.includes(' · last '), `${s}: counts, no times`); assert.match(light, /### 2026-10-06\n482 sessions\n/); assert.match(light, /### 2026-10-05\n\d+ sessions\n/);
  }
});

test('row 4: light changes ONLY the digests: the ambient block, the seat\'s own recent sessions, the L3 notices and the night table are the same text as strict', () => {
  const cfgs = [{}, LIGHT], outs = cfgs.map((c) => ctxOf(run(fresh({ config: c, l3: true, knock: true, extra: { } }), 'startup', LIB)));
  // (the night table needs a stop by ANOTHER session after which things knocked: the fixture's 13:00 stop is by an earlier session id)
  const cut = (txt, title) => { const m = new RegExp(`(^|\\n)(## ${title}[^\\n]*\\n[\\s\\S]*?)(?=\\n## |\\n---$|$)`).exec(txt); return m ? m[2] : null; };
  for (const title of ['Ambient context', 'L3 — arc-perceptions', 'While you were dark', 'Recent sessions in ']) {
    const a = cut(outs[0], title), b = cut(outs[1], title); assert.ok(a, `strict has "${title}"`); assert.equal(b, a, `"${title}" is the same in light`);
  }
  assert.match(outs[1], /\*\*frame-hardening\*\*/, 'the L3 notice is there'); assert.match(outs[1], /goal-x — \[DRIFT-FOUND\]/, 'and the night table\'s knock');
});

test('row 5: the Third Place\'s wake is the same in both modes (no digests either way; its own recent sessions and the ambient block)', () => {
  const TPC = TP, s = ctxOf(run(fresh(), 'startup', TPC)), l = ctxOf(run(fresh({ config: LIGHT }), 'startup', TPC));
  assert.equal(l, s); assert.doesNotMatch(l, /Recent session digests/); assert.match(l, /Ambient context/); assert.match(l, /Recent sessions in /);
});

test('row 6: a digest light cannot read is left as it is (nothing is hidden by a parse failure), and the hook never throws', () => {
  for (const [name, text] of [['no groups', '# 2026-10-06 Digest\n\n## 12 sessions\n'], ['junk', 'x'.repeat(400) + '\n\u0000\n'], ['empty', ''], ['text lines', '# 2026-10-06 Digest\n\n## 3 sessions\n\n### C:\\x\\y\n- 01:02:03 UTC — a first line of text\n- 02:03:04 UTC — another\n- 03:04:05 UTC\n']]) {
    const e = fresh({ config: LIGHT, digests: false, extra: { 'digests/2026-10-06.md': text } }), light = ctxOf(run(e, 'startup', LIB)), strict = ctxOf(run(fresh({ digests: false, extra: { 'digests/2026-10-06.md': text } }), 'startup', LIB));
    if (name === 'text lines') { assert.ok(light.includes('- C:\\x\\y: 3 · last 03:04:05, 02:03:04, 01:02:03 UTC'), 'a line with text after the time still counts, the text is dropped'); assert.doesNotMatch(light, /a first line of text/); }
    else assert.equal(light, strict, `${name}: left exactly as strict leaves it`);
  }
  const noDir = fresh({ config: LIGHT, digests: false }); assert.doesNotThrow(() => ctxOf(run(noDir, 'startup', LIB)), 'no digests dir at all');
});
