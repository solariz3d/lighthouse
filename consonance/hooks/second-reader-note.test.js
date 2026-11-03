// second-reader-note.test.js - node --test consonance/hooks/second-reader-note.test.js   (D631 (b))
//
// The same-turn note: a PostToolUse hook on the two hand-back verbs that shows the RINGING seat the second reader's flags on the ring it just
// sent, as additionalContext beside the tool result. It never blocks (the ring is already delivered when PostToolUse fires) and fails open.
// NO MODEL CALL HERE: the ledger rows the worker would write are written by the test. The data dir is a temp dir every time.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const NOTE = path.join(__dirname, 'second-reader-note.js');
const INSTALL = path.join(__dirname, '..', '..', 'dev', 'shell', 'install.ps1');
const LIB = 'mcp__consonance__call_librarian', CHAIR = 'mcp__consonance__call_chair';
const N = require('./second-reader-note.js');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function tmpDir() { return require('../tools/scratch.js').mkdtemp('sr-note-test-'); }
function rows(dir) { try { return fs.readFileSync(path.join(dir, 'second-reader.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)); } catch (_) { return []; } }
const addRow = (dir, row) => fs.appendFileSync(path.join(dir, 'second-reader.jsonl'), JSON.stringify({ ts: new Date().toISOString(), seat: 'A', tool: LIB, ringSha: 'f'.repeat(64), ...row }) + '\n');
const liveLock = (dir) => fs.writeFileSync(path.join(dir, 'second-reader.lock'), JSON.stringify({ pid: process.pid, ts: Date.now(), token: 't' }));

function envFor(dir, extra = {}) {
  const base = { ...process.env }; delete base.CONSONANCE_DREAM; delete base.CONSONANCE_SECOND_READER_RUN;
  return { ...base, CONSONANCE_DATA: dir, CONSONANCE_PANE: 'A', CONSONANCE_SECOND_READER_NOTE_WAIT_MS: '3000', ...extra };
}
const post = (tool, id = 'toolu_n', extra = {}) => JSON.stringify({ session_id: 's1', hook_event_name: 'PostToolUse', tool_name: tool, tool_input: { text: 'the ring' }, tool_response: 'delivered', tool_use_id: id, ...extra });
function run(dir, input, extra = {}) {
  const t0 = Date.now(), r = spawnSync(process.execPath, [NOTE], { input, env: envFor(dir, extra), encoding: 'utf8', timeout: 20000 });
  return { status: r.status, stdout: r.stdout, ms: Date.now() - t0, out: r.stdout.trim() ? JSON.parse(r.stdout) : null };
}
function runAsync(dir, input, extra = {}) {
  return new Promise((resolve) => { const t0 = Date.now(), c = spawn(process.execPath, [NOTE], { env: envFor(dir, extra), stdio: ['pipe', 'pipe', 'ignore'] }); let out = '';
    c.stdout.on('data', (d) => { out += d; }); c.on('close', (code) => resolve({ status: code, stdout: out, ms: Date.now() - t0, out: out.trim() ? JSON.parse(out) : null })); c.stdin.end(input); });
}
const FLAGS = [{ quote: 'The suite is all green.', names: 'the js suite run' }, { quote: "A's count is 1584.", names: "A's hand-back" }];

test('NOTE: an ok row with flags for THIS ring gives one PostToolUse additionalContext naming each flagged sentence and its source; never a decision', () => {
  const dir = tmpDir(); addRow(dir, { status: 'ok', toolUseId: 'toolu_n', flags: FLAGS });
  const r = run(dir, post(LIB)); assert.strictEqual(r.status, 0);
  assert.ok(r.out && r.out.hookSpecificOutput, r.stdout); assert.strictEqual(r.out.hookSpecificOutput.hookEventName, 'PostToolUse');
  const ctx = r.out.hookSpecificOutput.additionalContext;
  for (const f of FLAGS) { assert.ok(ctx.includes(f.quote), ctx); assert.ok(ctx.includes(f.names), ctx); }
  assert.ok(/delivered/i.test(ctx) && /not a block/i.test(ctx), 'the note must say the ring went through and that this is not a block: ' + ctx);
  assert.ok(!/"decision"|permissionDecision|"continue"\s*:\s*false/.test(r.stdout), r.stdout);
});
test('NOTE: a shown note is a ledger line (status note-shown, the tool_use_id and the count; no quote text)', () => {
  const dir = tmpDir(); addRow(dir, { status: 'ok', toolUseId: 'toolu_n', flags: FLAGS }); run(dir, post(LIB));
  const x = rows(dir).filter((r) => r.status === 'note-shown'); assert.strictEqual(x.length, 1); assert.strictEqual(x[0].toolUseId, 'toolu_n'); assert.strictEqual(x[0].flags, 2);
  assert.strictEqual(rows(dir).filter((r) => r.status === 'note-shown').some((r) => JSON.stringify(r).includes('all green')), false);
});
test('SILENT: an ok row with no flags, a skipped-class row, a skipped-busy row and an error row each give no output, at once', () => {
  for (const row of [{ status: 'ok', flags: [] }, { status: 'skipped-class' }, { status: 'skipped-busy' }, { status: 'skipped-no-text' }, { status: 'error', error: 'timeout' }]) {
    const dir = tmpDir(); addRow(dir, { ...row, toolUseId: 'toolu_n' }); liveLock(dir);   // a live lock (another ring's worker) must not make it wait: this ring's row is final
    const r = run(dir, post(LIB)); assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, '', row.status); assert.ok(r.ms < 1500, `${row.status} took ${r.ms} ms`);
  }
});
test('SAME RING ONLY: flags on another ring\'s row (another tool_use_id) are never shown', () => {
  const dir = tmpDir(); addRow(dir, { status: 'ok', toolUseId: 'toolu_other', flags: FLAGS });
  const r = run(dir, post(LIB)); assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, '');
});
test('WAITS FOR THE WORKER: with the worker still running (live lock, no row yet), a row that lands a second later is shown in the same call', async () => {
  const dir = tmpDir(); liveLock(dir);
  const p = runAsync(dir, post(CHAIR)); await sleep(1000); addRow(dir, { status: 'ok', toolUseId: 'toolu_n', flags: FLAGS.slice(0, 1) });
  const r = await p; assert.strictEqual(r.status, 0); assert.ok(r.out, 'no note'); assert.ok(r.out.hookSpecificOutput.additionalContext.includes(FLAGS[0].quote));
});
test('BOUNDED: a worker that never writes its row gives no output by the wait limit, and one note-timeout line', () => {
  const dir = tmpDir(); liveLock(dir);
  const r = run(dir, post(LIB), { CONSONANCE_SECOND_READER_NOTE_WAIT_MS: '1200' }); assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, '');
  assert.ok(r.ms < 4000, `took ${r.ms} ms`); assert.deepStrictEqual(rows(dir).map((x) => x.status), ['note-timeout']);
});
test('BOUNDED: no row and no worker running (the reader is not installed, or never started) gives no output within the short grace, and no row', () => {
  const dir = tmpDir(); const r = run(dir, post(LIB)); assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, ''); assert.ok(r.ms < 2500, `took ${r.ms} ms`);
  assert.strictEqual(rows(dir).length, 0);
});
test('NEVER BLOCKS: any input gives exit 0 and never a decision; other tools, the reentrancy variable and the dream gate are silent no-ops', () => {
  const dir = tmpDir(); addRow(dir, { status: 'ok', toolUseId: 'toolu_n', flags: FLAGS });
  for (const input of ['', 'not json', '{', 'null', '[]', post('Bash'), post('mcp__consonance__chair_inject'), post(LIB, null)]) {
    const r = run(dir, input); assert.strictEqual(r.status, 0); assert.strictEqual(r.stdout, '', input.slice(0, 60));
  }
  assert.strictEqual(run(dir, post(LIB), { CONSONANCE_SECOND_READER_RUN: '1' }).stdout, '');
  assert.strictEqual(run(dir, post(LIB), { CONSONANCE_DREAM: '1' }).stdout, '');
  const bad = path.join(dir, 'a-file'); fs.writeFileSync(bad, 'x'); assert.strictEqual(run(dir, post(LIB), { CONSONANCE_DATA: bad }).status, 0);
});
test('RENDER: the note is plain counts and quotes from the row, at most 5 shown with the rest counted, each quote clipped', () => {
  const many = Array.from({ length: 8 }, (_, i) => ({ quote: 'sentence ' + i + ' ' + 'y'.repeat(400), names: 'src ' + i }));
  const t = N.render(many); assert.ok(t.includes('8 sentence')); assert.ok(t.includes('sentence 4') && !t.includes('sentence 5 ')); assert.ok(/3 more/.test(t)); assert.ok(!t.includes('y'.repeat(301)));
});
test('REGISTERED: install.ps1 copies the note hook and registers it on PostToolUse with exactly the two hand-back verbs and a timeout above the wait', () => {
  const src = fs.readFileSync(INSTALL, 'utf8').replace(/\r\n/g, '\n');
  assert.ok(/From = 'consonance\\hooks\\second-reader-note\.js';\s+To = 'hooks\\second-reader-note\.js'/.test(src), 'no file entry');
  const m = src.match(/@\{ Event = 'PostToolUse';\s+Rel = 'hooks\\second-reader-note\.js';\s+Runner = 'node';\s*\n\s*Matcher = '([^']+)'(?:;\s*Timeout = (\d+))? \}/);
  assert.ok(m, 'no PostToolUse registration'); assert.deepStrictEqual(m[1].split('|').sort(), [CHAIR, LIB].sort());
  assert.ok(m[2] && Number(m[2]) * 1000 > N.WAIT_MS, 'the registration needs a Timeout above the note\'s own wait');
});
