// jev-flags.test.js — the standalone flags hook, with no network and nothing outside jev/. Every fixture lives in a temp
// dir; config is injected, so these tests do not depend on lib/config.js (built in parallel, L114).
//
//   node jev/test/jev-flags.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const F = require('../bin/jev-flags.js');

const SID = 'aaaaaaaa-0000-4000-8000-000000000001';
const OTHER = 'bbbbbbbb-0000-4000-8000-000000000002';
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'jev-flags-'));
const row = (o) => ({ ts: '2026-09-23T12:00:00.000Z', session_id: SID, turn_uuid: 't2', verdict: 'drift', probabilities: { drift: 0.6, clean: 0.3, abstain: 0.1 }, reason: 'the move holds its answer back from the question asked', model: 'typesafe-ai/jev', prompt_sha256: 'x'.repeat(64), usage: {}, ...o });

/** A transcript whose last turn ended at uuid `last` (an assistant row with stop_reason end_turn). */
function transcript(dir, rows) {
  const f = path.join(dir, 't.jsonl');
  fs.writeFileSync(f, rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
  return f;
}
const turnEnd = (uuid, extra = {}) => ({ uuid, message: { role: 'assistant', stop_reason: 'end_turn', content: [{ type: 'text', text: 'done' }] }, ...extra });

/** A session-audience setup: a ledger with `rows`, a transcript whose last turn is t2. */
function session(rows, trRows = [turnEnd('t1'), { uuid: 'u2', message: { role: 'user', content: 'next' } }, turnEnd('t2')]) {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, F.LEDGER), rows.map((r) => (typeof r === 'string' ? r : JSON.stringify(r))).join('\n') + '\n');
  const tr = transcript(dir, trRows);
  const config = { judge: 'all', optedOut: false, ledgerDir: dir, gateway: {}, rubricPath: null, audience: 'session', dream: false };
  return { dir, config, input: { session_id: SID, transcript_path: tr, cwd: dir } };
}
const runS = (s) => F.run({ input: s.input, env: {}, home: s.dir, config: s.config });

// ── session audience ──────────────────────────────────────────────────────────────────────────────────────────────
test('SESSION: the last turn\'s mark is ONE line, with the invitation wording and Jev\'s reason', () => {
  const out = runS(session([row({})]));
  assert.strictEqual(out, '[jev · worth a second look] your last turn: the move holds its answer back from the question asked');
});

test('SESSION: a CLEAN last turn is silent', () => {
  assert.strictEqual(runS(session([row({ verdict: 'clean' })])), '');
});

test('SESSION: no row yet for the last turn is silent (the judge may still be running)', () => {
  assert.strictEqual(runS(session([row({ turn_uuid: 't1' })])), '');
});

test('SESSION: an OLDER turn\'s mark is never shown as the last turn\'s', () => {
  assert.strictEqual(runS(session([row({ turn_uuid: 't1' }), row({ verdict: 'clean' })])), '');
});

test('SESSION: the NEWEST row for the last turn wins, both ways', () => {
  assert.strictEqual(runS(session([row({}), row({ verdict: 'clean' })])), '');
  assert.match(runS(session([row({ verdict: 'clean' }), row({})])), /^\[jev · worth a second look\] your last turn: /);
});

test('SESSION: another session\'s mark on a same-named turn is never shown', () => {
  assert.strictEqual(runS(session([row({ session_id: OTHER })])), '');
});

test('SESSION: an ABSTAIN is a non-clean row and is shown, as the contract says', () => {
  assert.match(runS(session([row({ verdict: 'abstain', reason: 'the move is a bare token' })])), /your last turn: the move is a bare token$/);
});

test('SESSION: an interrupted last turn (no end_turn) offers no older turn in its place', () => {
  const s = session([row({ turn_uuid: 't1' })], [turnEnd('t1'), { uuid: 'x', message: { role: 'assistant', stop_reason: 'tool_use', content: [] } }]);
  assert.strictEqual(runS(s), '');
});

test('SESSION: a sidechain row after the turn does not move "the last turn"', () => {
  const s = session([row({})], [turnEnd('t2'), turnEnd('side', { isSidechain: true })]);
  assert.match(runS(s), /your last turn:/);
});

// ── the wording ───────────────────────────────────────────────────────────────────────────────────────────────────
const NASTY = ['Drift detected in this move', 'I caught drift here', 'you are drifting again', 'you were wrong to say that',
  'detected drift: the user', 'confirmed drift', 'You lied about the count', 'drift was detected'];

test('WORDING: a reason carrying a forbidden phrase is DROPPED, and the line says no reason could be shown', () => {
  for (const r of NASTY) {
    const out = runS(session([row({ reason: r })]));
    assert.strictEqual(out, '[jev · worth a second look] your last turn (Jev gave no reason that can be shown)', r);
  }
});

test('WORDING: no line this hook writes matches a forbidden phrase, in either audience', () => {
  const lines = NASTY.map((r) => runS(session([row({ reason: r })])));
  lines.push(...F.consonanceLines({ rows: NASTY.map((r, i) => row({ session_id: `s${i}`, reason: r, ts: new Date(Date.UTC(2026, 8, 23, 12, i)).toISOString() })), pane: 'M', ids: { main: 'M', librarian: 'L' }, now: Date.parse('2026-09-23T13:00:00Z') }));
  for (const l of lines) for (const re of F.FORBIDDEN) assert.doesNotMatch(l, re, l);
});

test('WORDING: the session line never says "drift" at all unless Jev\'s own shown reason does', () => {
  assert.doesNotMatch(runS(session([row({ reason: 'the answer skipped the question' })])), /drift/i);
});

test('WORDING: a long, multi-line reason becomes ONE line of at most 200 characters', () => {
  const out = runS(session([row({ reason: `first line\nsecond\tline ${'x'.repeat(400)}` })]));
  const reason = out.replace('[jev · worth a second look] your last turn: ', '');
  assert.ok(!/\n/.test(out) && reason.length === 200 && reason.startsWith('first line second line'), out);
});

// ── resilience ────────────────────────────────────────────────────────────────────────────────────────────────────
test('A CORRUPT ledger line is skipped: the good row still shows', () => {
  const out = runS(session(['{not json', JSON.stringify(row({})), '[]', '"a string"']));
  assert.match(out, /your last turn:/);
});

test('optedOut is silence, whatever the ledger holds', () => {
  const s = session([row({})]);
  assert.strictEqual(F.run({ ...s, env: {}, home: s.dir, config: { ...s.config, optedOut: true } }), '');
});

test('DREAM GUARD: on and in a dream run (CONSONANCE_DREAM) is silence; on outside a dream still shows; off ignores the env', () => {
  const s = session([row({})]);
  const r = (dream, env) => F.run({ input: s.input, env, home: s.dir, config: { ...s.config, dream } });
  assert.deepStrictEqual([r(true, { CONSONANCE_DREAM: '1' }) === '', /your last turn:/.test(r(true, {})), /your last turn:/.test(r(false, { CONSONANCE_DREAM: '1' }))], [true, true, true]);
});

test('NEVER FAILS THE PROMPT: a config that throws gives silence, and the error goes to the local log with no turn text', () => {
  const before = fs.existsSync(path.join(os.tmpdir(), F.LOG)) ? fs.readFileSync(path.join(os.tmpdir(), F.LOG), 'utf8').length : 0;
  const out = F.hook({ stdin: JSON.stringify({ session_id: SID }), env: {}, home: tmp(), loadConfig: () => { throw new Error('config broke'); } });
  const log = fs.readFileSync(path.join(os.tmpdir(), F.LOG), 'utf8').slice(before);
  assert.deepStrictEqual([out, /jev-flags Error: config broke/.test(log)], ['', true]);
});

test('NEVER FAILS THE PROMPT: stdin that is not JSON is silence, logged beside the ledger', () => {
  const s = session([row({})]);
  const out = F.hook({ stdin: '{broken', env: {}, home: s.dir, loadConfig: () => s.config });
  assert.strictEqual(out, '');
});

test('the CLI always exits 0, and prints nothing or one valid hook object', () => {
  const r = spawnSync(process.execPath, [path.join(__dirname, '..', 'bin', 'jev-flags.js')], { input: '{broken', encoding: 'utf8', env: { ...process.env, HOME: tmp(), USERPROFILE: tmp() } });
  assert.strictEqual(r.status, 0);
  if (r.stdout) assert.strictEqual(JSON.parse(r.stdout).hookSpecificOutput.hookEventName, 'UserPromptSubmit');
});

test('the MODULE requires nothing outside jev/: only Node built-ins and relative paths', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'bin', 'jev-flags.js'), 'utf8');
  const reqs = [...src.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);
  for (const r of reqs) assert.ok(['fs', 'os', 'path'].includes(r) || r === '../lib/config.js', r);
});

// ── consonance audience ───────────────────────────────────────────────────────────────────────────────────────────
const IDS = { main: 'MAIN', librarian: 'LIB', thirdPlace: 'TP' };
const NOW = Date.parse('2026-09-23T13:00:00Z');
const crow = (o) => row({ turn_uuid: 'z', ...o });

test('CONSONANCE: the chair and the librarian see marks; a pane sees nothing', () => {
  // The mark is about PANE-B, so PANE-A's silence can only come from the reader rule, not from the own-move rule (the
  // first version used PANE-A's own row, and a mutant that let every pane read survived it).
  const rows = [crow({ session_id: 'PANE-B' })];
  const got = ['MAIN', 'LIB', 'PANE-A', undefined].map((pane) => F.consonanceLines({ rows, pane, ids: IDS, now: NOW }).length);
  assert.deepStrictEqual(got, [1, 1, 0, 0]);
});

test('CONSONANCE: never the reader\'s own move, never the Third Place', () => {
  const rows = [crow({ session_id: 'MAIN' }), crow({ session_id: 'TP' })];
  assert.deepStrictEqual(F.consonanceLines({ rows, pane: 'MAIN', ids: IDS, now: NOW }), []);
});

test('CONSONANCE: seats by pane letter, newest first, within 12 h, at most 5 lines with the rest counted', () => {
  const rows = Array.from({ length: 7 }, (_, i) => crow({ session_id: `P${i}`, ts: new Date(NOW - (i + 1) * 60000).toISOString() }));
  rows.push(crow({ session_id: 'OLD', ts: new Date(NOW - 13 * 3600000).toISOString() }));
  const lines = F.consonanceLines({ rows, pane: 'LIB', ids: IDS, now: NOW, letters: { P0: 'A' } });
  assert.ok(lines.length === 5 && / A · /.test(lines[0]) && /\(\+2 more in 12 h\)$/.test(lines[4]) && !lines.some((l) => /OLD/.test(l)), lines.join('\n'));
});

test('CONSONANCE: an abstain surfaces only at p >= 0.80, as the room rules', () => {
  const lo = crow({ session_id: 'P', verdict: 'abstain', probabilities: { abstain: 0.7 } });
  const hi = crow({ session_id: 'Q', verdict: 'abstain', probabilities: { abstain: 0.85 } });
  assert.strictEqual(F.consonanceLines({ rows: [lo, hi], pane: 'MAIN', ids: IDS, now: NOW }).length, 1);
});

test('CONSONANCE: the line says the label Jev CHOSE and that it is unverified — no reason text, no verdict on anyone', () => {
  const [l] = F.consonanceLines({ rows: [crow({ session_id: 'P' })], pane: 'MAIN', ids: IDS, now: NOW, letters: { P: 'B' } });
  assert.match(l, /^\[jev · worth a second look\] unverified · B · turn \d\d:\d\d · Jev chose "drift" p=0\.60$/);
});

test('CONSONANCE: without a room (no main.rs through room_path) it is silent', () => {
  const s = session([crow({ session_id: 'P' })]);
  assert.strictEqual(F.run({ input: s.input, env: { CONSONANCE_PANE: 'MAIN' }, home: s.dir, config: { ...s.config, audience: 'consonance' } }), '');
});

test('CONSONANCE: the room found through room_path gives the chair its lines, end to end', () => {
  const s = session([crow({ session_id: 'P', ts: new Date(NOW - 60000).toISOString() })]);
  const repo = path.join(s.dir, 'repo');
  fs.mkdirSync(path.join(repo, 'consonance', 'src-tauri', 'src'), { recursive: true });
  fs.mkdirSync(path.join(repo, 'exo_memory'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'consonance', 'src-tauri', 'src', 'main.rs'), 'const MAIN_SID: &str = "MAIN";\nconst LIBRARIAN_SID: &str = "LIB";\nconst THIRD_PLACE_SID: &str = "TP";\n');
  fs.writeFileSync(path.join(s.dir, '.consonance.json'), JSON.stringify({ room_path: path.join(repo, 'exo_memory', 'BOOT.md') }));
  const out = F.run({ input: s.input, env: { CONSONANCE_PANE: 'MAIN', JEV_FLAGS_NOW: new Date(NOW).toISOString() }, home: s.dir, config: { ...s.config, audience: 'consonance' } });
  assert.match(out, /^\[jev · worth a second look\] unverified · P · /);
});

// ── the contracts, end to end: the CLI through the REAL lib/config.js load() (C's, L114) ─────────────────────────────
test('END TO END: the CLI, through lib/config.js, prints the one hook line for a marked last turn', () => {
  const home = tmp();
  const env = { ...process.env, HOME: home, USERPROFILE: home, LOCALAPPDATA: path.join(home, 'AppData', 'Local'), XDG_STATE_HOME: path.join(home, '.local', 'state') };
  delete env.CONSONANCE_DREAM;
  const cfg = require('../lib/config.js').load({ env, home, cwd: home });
  fs.mkdirSync(cfg.ledgerDir, { recursive: true });
  fs.writeFileSync(path.join(cfg.ledgerDir, F.LEDGER), JSON.stringify(row({})) + '\n');
  const tr = transcript(home, [turnEnd('t2')]);
  const r = spawnSync(process.execPath, [path.join(__dirname, '..', 'bin', 'jev-flags.js')], { input: JSON.stringify({ session_id: SID, transcript_path: tr, cwd: home }), encoding: 'utf8', env, cwd: home });
  assert.strictEqual(r.status, 0);
  assert.strictEqual(JSON.parse(r.stdout).hookSpecificOutput.additionalContext, '[jev · worth a second look] your last turn: the move holds its answer back from the question asked');
});
