// findings-return.test.js — deterministic fixtures; every arm exercises the hook as the
// harness would: JSON on stdin, ledger/state paths via env, exit code observed.
// Run: node --test consonance/hooks/findings-return.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HOOK = path.join(__dirname, 'findings-return.js');
const PANE_CWD = 'C:\\panes\\sibling-test';

function tmpdir() { return fs.mkdtempSync(path.join(os.tmpdir(), 'fret-')); }

function env(tmp, extra) {
  return {
    ...process.env,
    VANTAGE_FINDINGS: path.join(tmp, 'findings.jsonl'),   // the agreed wire var (was FINDINGS_LEDGER)
    RETURN_LEDGER: path.join(tmp, 'returns.jsonl'),
    RETURN_STATE_DIR: path.join(tmp, 'state'),
    ...extra,
  };
}

function runHook(tmp, extraEnv, stdin) {
  return spawnSync(process.execPath, [HOOK], {
    input: stdin !== undefined ? stdin : JSON.stringify({ session_id: 'abcd1234-x', cwd: PANE_CWD }),
    encoding: 'utf8',
    env: env(tmp, extraEnv),
    timeout: 15000,
  });
}

function writeFindings(tmp, rows) {
  fs.writeFileSync(path.join(tmp, 'findings.jsonl'), rows.map(r => JSON.stringify(r)).join('\n') + '\n');
}
function appendFinding(tmp, row) {
  fs.appendFileSync(path.join(tmp, 'findings.jsonl'), JSON.stringify(row) + '\n');
}
function context(r) {
  if (!r.stdout) return '';
  return JSON.parse(r.stdout).hookSpecificOutput.additionalContext;
}
function returnRows(tmp) {
  const f = path.join(tmp, 'returns.jsonl');
  if (!fs.existsSync(f)) return [];
  return fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
}

// Fixtures are A-SCHEMA rows — the shape second-vantage.js actually appends (its header is the
// contract). The flat spec below is test-local shorthand; row() builds the real nested shape
// from it, so each test body reads as before while exercising the true wire. The first
// generation of this file used flat rows A never emits — green against a shape that never
// crossed the joint (caught 2026-08-15; see attached.test.js).
function row(over) {
  const f = {
    id: 'f-001', pane: 'sibling-test', verdict: 'DISAGREE', audited: true, world_moved: false,
    claim: 'BOOT.md is ~43 KB', command: 'stat -c %s exo_memory/BOOT.md',
    derived: '51852', head: 'abc1234', ts: '2026-08-15T17:00:00Z',
    ...over,
  };
  const r = {
    ts: f.ts,
    source: { session: 'abcd1234', pane: f.pane, turn_ts: f.ts, head: f.head },
    tier: 'artifact', claim: f.claim, verdict: f.verdict,
    commands: f.command === undefined ? [] : [f.command],
    evidence: f.derived === undefined ? '' : f.derived,
    audit: { clean: f.audited, reason: '' },
    world: { checked: false, moved: f.world_moved, claimHead: f.head || '', currentHead: '' },
    status: '', surface: false, caveat: '',
  };
  if (f.id !== undefined) r.id = f.id;
  return r;
}

test('an audited DISAGREE surfaces once, with claim, command, and derived value', () => {
  const tmp = tmpdir();
  writeFindings(tmp, [row()]);
  const r = runHook(tmp);
  assert.strictEqual(r.status, 0);
  const ctx = context(r);
  assert.ok(ctx.includes('claim: "BOOT.md is ~43 KB"'));
  assert.ok(ctx.includes('reader ran: `stat -c %s exo_memory/BOOT.md`'));
  assert.ok(ctx.includes('reader got: 51852'));
  assert.ok(ctx.includes('claim-time HEAD: abc1234'));
  const traced = returnRows(tmp);
  assert.strictEqual(traced.length, 1);
  assert.deepStrictEqual(traced[0].surfaced, ['f-001']);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('unread means unread — the same finding never surfaces twice', () => {
  const tmp = tmpdir();
  writeFindings(tmp, [row()]);
  const first = runHook(tmp);
  assert.ok(context(first).includes('f-001'));
  const second = runHook(tmp);
  assert.strictEqual(second.status, 0);
  assert.strictEqual(second.stdout, '');
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('AGREE rows surface nowhere and leave no trace', () => {
  const tmp = tmpdir();
  writeFindings(tmp, [row({ verdict: 'AGREE' })]);
  const r = runHook(tmp);
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout, '');
  assert.strictEqual(returnRows(tmp).length, 0);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('another pane\'s DISAGREE does not surface here', () => {
  const tmp = tmpdir();
  writeFindings(tmp, [row({ pane: 'sibling-other' })]);
  const r = runHook(tmp);
  assert.strictEqual(r.stdout, '');
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('C3: an unaudited DISAGREE is held — announced as a count line, content withheld, then surfaces when audited', () => {
  const tmp = tmpdir();
  writeFindings(tmp, [row({ audited: false })]);
  const first = runHook(tmp);
  const ctx1 = context(first);
  assert.ok(ctx1.includes('held-unaudited'));
  assert.ok(ctx1.includes('f-001'));
  assert.ok(!ctx1.includes('BOOT.md is ~43 KB'));          // content withheld
  assert.strictEqual(returnRows(tmp)[0].misses[0].reason, 'held-unaudited');
  const second = runHook(tmp);                              // hold announced ONCE, not re-nagged
  assert.strictEqual(second.stdout, '');
  appendFinding(tmp, row({ audited: true }));               // A audits: a new row, same id
  const third = runHook(tmp);
  assert.ok(context(third).includes('claim: "BOOT.md is ~43 KB"'));
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('C2: WORLD-MOVED surfaces as nothing — no block, no trace', () => {
  const tmp = tmpdir();
  writeFindings(tmp, [row({ world_moved: true })]);
  const r = runHook(tmp);
  assert.strictEqual(r.stdout, '');
  assert.strictEqual(returnRows(tmp).length, 0);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('C6: any F0 mention carries both denominators, appended mechanically', () => {
  const tmp = tmpdir();
  writeFindings(tmp, [row({ claim: 'per F0 the reader catches everything' })]);
  const ctx = context(runHook(tmp));
  assert.ok(ctx.includes('2/2 on the reachable subset'));
  assert.ok(ctx.includes('2 of 16 of the curated record'));
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('no F0 mention, no caveat — the line is not furniture', () => {
  const tmp = tmpdir();
  writeFindings(tmp, [row()]);
  const ctx = context(runHook(tmp));
  assert.ok(!ctx.includes('reachable subset'));
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('a malformed DISAGREE (no command) is a traced hold, not a silent drop and not a loop', () => {
  const tmp = tmpdir();
  writeFindings(tmp, [row({ command: undefined })]);   // A-schema: commands[] empty
  const first = runHook(tmp);
  assert.ok(context(first).includes('malformed-row'));
  assert.strictEqual(returnRows(tmp)[0].misses[0].reason, 'malformed-row');
  const second = runHook(tmp);
  assert.strictEqual(second.stdout, '');
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('overflow past the per-turn cap rides the next turn — every finding surfaces exactly once', () => {
  const tmp = tmpdir();
  writeFindings(tmp, Array.from({ length: 7 }, (_, i) => row({ id: `f-${i}` })));
  const first = context(runHook(tmp));
  const second = context(runHook(tmp));
  const count = s => (s.match(/- claim: /g) || []).length;
  assert.strictEqual(count(first), 5);
  assert.strictEqual(count(second), 2);
  const third = runHook(tmp);
  assert.strictEqual(third.stdout, '');
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('the non-coverage sentence rides every surfaced block (anti-halo, visible non-coverage)', () => {
  const tmp = tmpdir();
  writeFindings(tmp, [row()]);
  const ctx = context(runHook(tmp));
  assert.ok(ctx.includes('the absence of a row is non-coverage, never verification'));
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('CONSONANCE_DREAM: exits 0, prints nothing, writes no state', () => {
  const tmp = tmpdir();
  writeFindings(tmp, [row()]);
  const r = runHook(tmp, { CONSONANCE_DREAM: '1' });
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout, '');
  assert.ok(!fs.existsSync(path.join(tmp, 'state')));
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('garbage stdin: exits 0, prints nothing', () => {
  const tmp = tmpdir();
  writeFindings(tmp, [row()]);
  const r = runHook(tmp, {}, 'this is not json {');
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout, '');
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('missing findings ledger is a LINE, once — not a silent early return', () => {
  // The old behavior here (asserted by this test's first generation: "exits 0, prints
  // nothing") is the exact silence the A→K filename split hid behind. Ferry's law now
  // applies to the hook's own input: absent ledger → one announcement + one trace, then quiet.
  const tmp = tmpdir();
  const first = runHook(tmp);
  assert.strictEqual(first.status, 0);
  const ctx = context(first);
  assert.ok(ctx.includes('ABSENT'));
  assert.ok(ctx.includes(path.join(tmp, 'findings.jsonl')));
  assert.strictEqual(returnRows(tmp)[0].event, 'ledger-absent');
  const second = runHook(tmp);                          // once means once
  assert.strictEqual(second.stdout, '');
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('empty findings ledger says so once, then goes quiet; rows arriving later still surface', () => {
  const tmp = tmpdir();
  fs.writeFileSync(path.join(tmp, 'findings.jsonl'), '');
  const first = runHook(tmp);
  assert.ok(context(first).includes('EMPTY'));
  assert.strictEqual(returnRows(tmp)[0].event, 'ledger-empty');
  assert.strictEqual(runHook(tmp).stdout, '');
  appendFinding(tmp, row());
  assert.ok(context(runHook(tmp)).includes('claim: "BOOT.md is ~43 KB"'));
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('a row with no id is watermarked by content hash — it still cannot loop', () => {
  const tmp = tmpdir();
  const noId = row(); delete noId.id;
  writeFindings(tmp, [noId]);
  const first = runHook(tmp);
  assert.ok(context(first).includes('id: sha1:'));
  const second = runHook(tmp);
  assert.strictEqual(second.stdout, '');
  fs.rmSync(tmp, { recursive: true, force: true });
});
