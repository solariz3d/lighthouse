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
