// sourced-stop.test.js — deterministic fixtures; every arm exercises the hook as the harness
// would: JSON on stdin, ledger path via env, exit code observed.
// Run: node --test consonance/hooks/sourced-stop.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HOOK = path.join(__dirname, 'sourced-stop.js');

function runHook(stdin, env, tmp) {
  return spawnSync(process.execPath, [HOOK], {
    input: stdin,
    encoding: 'utf8',
    env: { ...process.env, SOURCED_LEDGER: path.join(tmp, 'ledger.jsonl'), ...env },
    timeout: 15000,
  });
}

function fixtureTranscript(tmp, records) {
  const f = path.join(tmp, 'transcript.jsonl');
  fs.writeFileSync(f, records.map(r => JSON.stringify(r)).join('\n') + '\n');
  return f;
}

const user = text => ({ type: 'user', message: { role: 'user', content: text }, timestamp: '2026-08-15T11:00:00.000Z' });
const toolResult = () => ({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', content: 'ok' }] }, timestamp: '2026-08-15T11:00:02.000Z' });
const assistant = (text, tools = []) => ({
  type: 'assistant', timestamp: '2026-08-15T11:00:01.000Z',
  message: { role: 'assistant', content: [{ type: 'text', text }, ...tools.map(n => ({ type: 'tool_use', name: n, input: {} }))] },
});

function tmpdir() { return fs.mkdtempSync(path.join(os.tmpdir(), 'sstop-')); }
function ledgerRows(tmp) {
  const f = path.join(tmp, 'ledger.jsonl');
  if (!fs.existsSync(f)) return [];
  return fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
}

test('an unsourced value-turn is recorded as such', () => {
  const tmp = tmpdir();
  const t = fixtureTranscript(tmp, [user('how big?'), assistant('The file has 340 lines and is still running.')]);
  const r = runHook(JSON.stringify({ session_id: 'abcd1234-x', transcript_path: t, cwd: 'C:\\panes\\sibling-test' }), {}, tmp);
  assert.strictEqual(r.status, 0);
  const rows = ledgerRows(tmp);
  assert.strictEqual(rows.length, 1);
  assert.strictEqual(rows[0].sourced, false);
  assert.ok(rows[0].values.includes('linecount'));
  assert.ok(rows[0].values.includes('state'));
  assert.strictEqual(rows[0].session, 'abcd1234');
  assert.strictEqual(rows[0].pane, 'sibling-test');
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('a value-turn that read a source is recorded sourced', () => {
  const tmp = tmpdir();
  const t = fixtureTranscript(tmp, [user('check'), assistant('Measured: 340 lines.', ['Read'])]);
  const r = runHook(JSON.stringify({ session_id: 's', transcript_path: t }), {}, tmp);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(ledgerRows(tmp)[0].sourced, true);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('only the LAST turn is scanned — an earlier value-turn does not leak in', () => {
  const tmp = tmpdir();
  const t = fixtureTranscript(tmp, [
    user('first'), assistant('It has 999 lines.', []),
    user('second'), assistant('No values here at all.'),
  ]);
  runHook(JSON.stringify({ session_id: 's', transcript_path: t }), {}, tmp);
  const rows = ledgerRows(tmp);
  assert.strictEqual(rows.length, 1);
  assert.deepStrictEqual(rows[0].values, []);       // [] rows keep the denominator honest
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('a tool_result user record does not reset the turn', () => {
  const tmp = tmpdir();
  const t = fixtureTranscript(tmp, [
    user('go'), assistant('Reading it now.', ['Read']), toolResult(), assistant('It has 42 lines.'),
  ]);
  runHook(JSON.stringify({ session_id: 's', transcript_path: t }), {}, tmp);
  const rows = ledgerRows(tmp);
  assert.strictEqual(rows[0].sourced, true);        // the Read and the value are one turn
  assert.ok(rows[0].values.includes('linecount'));
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('CONSONANCE_DREAM: exits 0, writes nothing', () => {
  const tmp = tmpdir();
  const t = fixtureTranscript(tmp, [user('x'), assistant('It has 42 lines.')]);
  const r = runHook(JSON.stringify({ session_id: 's', transcript_path: t }), { CONSONANCE_DREAM: '1' }, tmp);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(ledgerRows(tmp).length, 0);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('garbage stdin: exits 0, writes nothing, prints nothing', () => {
  const tmp = tmpdir();
  const r = runHook('this is not json {', {}, tmp);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout, '');
  assert.strictEqual(ledgerRows(tmp).length, 0);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('BOM-prefixed stdin still parses (PowerShell pipes prepend U+FEFF)', () => {
  const tmp = tmpdir();
  const t = fixtureTranscript(tmp, [user('x'), assistant('It has 42 lines.')]);
  const r = runHook('﻿' + JSON.stringify({ session_id: 's', transcript_path: t }), {}, tmp);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(ledgerRows(tmp).length, 1);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('missing transcript path: exits 0, writes nothing', () => {
  const tmp = tmpdir();
  const r = runHook(JSON.stringify({ session_id: 's', transcript_path: path.join(tmp, 'nope.jsonl') }), {}, tmp);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(ledgerRows(tmp).length, 0);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('never prints to stdout — a sensor, not a nag', () => {
  const tmp = tmpdir();
  const t = fixtureTranscript(tmp, [user('x'), assistant('Unsourced: 77 lines, port 8080, v1.2.3.')]);
  const r = runHook(JSON.stringify({ session_id: 's', transcript_path: t }), {}, tmp);
  assert.strictEqual(r.stdout, '');
  assert.strictEqual(r.status, 0);
  fs.rmSync(tmp, { recursive: true, force: true });
});

// ── v2 enrichment (build_ruling.md C2): claims, paths, heads ──

const toolUse = (name, input) => ({ type: 'tool_use', name, input });
const assistantWith = (text, blocks) => ({
  type: 'assistant', timestamp: '2026-08-15T11:00:01.000Z',
  message: { role: 'assistant', content: [{ type: 'text', text }, ...blocks] },
});

test('v2: a turn-text claim carries its sentence, kinds, channel turn, null path', () => {
  const tmp = tmpdir();
  const t = fixtureTranscript(tmp, [user('how big?'),
    assistant('Checked it just now. The file has 340 lines total. Nothing else changed.')]);
  runHook(JSON.stringify({ session_id: 's', transcript_path: t }), {}, tmp);
  const row = ledgerRows(tmp)[0];
  assert.strictEqual(row.v, 2);
  assert.strictEqual(row.claims.length, 1);
  assert.strictEqual(row.claims[0].sentence, 'The file has 340 lines total.');
  assert.ok(row.claims[0].kinds.includes('linecount'));
  assert.strictEqual(row.claims[0].channel, 'turn');
  assert.strictEqual(row.claims[0].path, null);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('v2: a value written into a prose artifact is a claim even when turn text has none', () => {
  const tmp = tmpdir();
  // The pane-blindness case the artifact channel exists for: figure ships via Write only.
  const t = fixtureTranscript(tmp, [user('file it'),
    assistantWith('Done, filed the report.', [
      toolUse('Write', { file_path: 'C:\\repo\\notes\\report.md', content: 'Suite green.\nThe suite has 267 tests passing.\n' }),
    ])]);
  runHook(JSON.stringify({ session_id: 's', transcript_path: t }), {}, tmp);
  const row = ledgerRows(tmp)[0];
  assert.deepStrictEqual(row.values, []);            // turn text carries nothing — v1 meaning intact
  assert.strictEqual(row.claims.length, 1);
  assert.strictEqual(row.claims[0].channel, 'artifact');
  assert.strictEqual(row.claims[0].path, 'C:\\repo\\notes\\report.md');
  assert.ok(row.claims[0].kinds.includes('count'));
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('v2: a non-prose artifact is NOT scanned — code version strings are not claims', () => {
  const tmp = tmpdir();
  const t = fixtureTranscript(tmp, [user('write it'),
    assistantWith('Wrote the module.', [
      toolUse('Write', { file_path: 'C:\\repo\\lib\\mod.js', content: '// requires v2.3.1\nconst LINES = "500 lines";\n' }),
    ])]);
  runHook(JSON.stringify({ session_id: 's', transcript_path: t }), {}, tmp);
  const row = ledgerRows(tmp)[0];
  assert.deepStrictEqual(row.claims, []);
  assert.deepStrictEqual(row.paths, ['C:\\repo\\lib\\mod.js']);   // the path still rides
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('v2: Edit new_string is scanned for prose targets; old_string never', () => {
  const tmp = tmpdir();
  const t = fixtureTranscript(tmp, [user('fix it'),
    assistantWith('Corrected the figure.', [
      toolUse('Edit', { file_path: 'C:\\repo\\journal.md', old_string: 'It has 99 lines.', new_string: 'It has 342 lines now.' }),
    ])]);
  runHook(JSON.stringify({ session_id: 's', transcript_path: t }), {}, tmp);
  const row = ledgerRows(tmp)[0];
  assert.strictEqual(row.claims.length, 1);
  assert.strictEqual(row.claims[0].sentence, 'It has 342 lines now.');
  assert.strictEqual(row.claims[0].channel, 'artifact');
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('v2: touched paths are collected, deduped, ordered', () => {
  const tmp = tmpdir();
  const t = fixtureTranscript(tmp, [user('go'),
    assistantWith('Working.', [
      toolUse('Read', { file_path: 'C:\\a\\one.js' }),
      toolUse('Edit', { file_path: 'C:\\a\\one.js', old_string: 'x', new_string: 'y' }),
      toolUse('Write', { file_path: 'C:\\a\\two.md', content: 'no values here' }),
      toolUse('Bash', { command: 'echo hi' }),
    ])]);
  runHook(JSON.stringify({ session_id: 's', transcript_path: t }), {}, tmp);
  assert.deepStrictEqual(ledgerRows(tmp)[0].paths, ['C:\\a\\one.js', 'C:\\a\\two.md']);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('v2: a claim sentence is capped at 240 chars', () => {
  const tmp = tmpdir();
  const long = 'The suite has 42 tests and ' + 'x'.repeat(400) + ' more words';
  const t = fixtureTranscript(tmp, [user('x'), assistant(long)]);
  runHook(JSON.stringify({ session_id: 's', transcript_path: t }), {}, tmp);
  const row = ledgerRows(tmp)[0];
  assert.strictEqual(row.claims.length, 1);
  assert.ok(row.claims[0].sentence.length <= 240);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('v2: claims are capped at 8', () => {
  const tmp = tmpdir();
  const many = Array.from({ length: 12 }, (_, i) => `File number${i} has ${i + 10} tests inside.`).join(' ');
  const t = fixtureTranscript(tmp, [user('x'), assistant(many)]);
  runHook(JSON.stringify({ session_id: 's', transcript_path: t }), {}, tmp);
  assert.strictEqual(ledgerRows(tmp)[0].claims.length, 8);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('v2: claim-time HEAD is resolved from a touched path inside a real repo', () => {
  const tmp = tmpdir();
  const repo = path.join(tmp, 'repo');
  fs.mkdirSync(repo);
  const g = (...args) => spawnSync('git', ['-C', repo, ...args], { encoding: 'utf8' });
  g('init', '-q');
  fs.writeFileSync(path.join(repo, 'f.md'), 'seed\n');
  g('add', 'f.md');
  g('-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'seed');
  const sha = g('rev-parse', 'HEAD').stdout.trim();
  assert.match(sha, /^[0-9a-f]{40}$/);                 // the fixture repo is real, or this test is void

  const t = fixtureTranscript(tmp, [user('x'),
    assistantWith('Noted 42 lines in there.', [toolUse('Read', { file_path: path.join(repo, 'f.md') })])]);
  // cwd deliberately NOT a repo: the head must come from the touched path, the pane case.
  runHook(JSON.stringify({ session_id: 's', transcript_path: t, cwd: tmp }), {}, tmp);
  const heads = ledgerRows(tmp)[0].heads;
  const tops = Object.keys(heads);
  assert.strictEqual(tops.length, 1);
  assert.strictEqual(heads[tops[0]], sha);
  assert.ok(!tops[0].includes('\\'));                  // forward slashes per the contract
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('v2: no reachable repo -> heads is {} — absent, never guessed', () => {
  const tmp = tmpdir();
  const t = fixtureTranscript(tmp, [user('x'), assistant('It has 42 lines.')]);
  runHook(JSON.stringify({ session_id: 's', transcript_path: t, cwd: tmp }), {}, tmp);
  assert.deepStrictEqual(ledgerRows(tmp)[0].heads, {});
  fs.rmSync(tmp, { recursive: true, force: true });
});
