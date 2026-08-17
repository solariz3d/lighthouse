// second-vantage.test.js — every guard shown failing, not asserted able to fail.
// Mock spawners stand in for `claude -p`; the audit, the C2 gate, the world check and the
// selection are exercised for real. The one thing mocks cannot show — that a real reader
// spawns and returns — is covered by the live smoke in the build report, not asserted here.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const sv = require('./second-vantage.js');

const ROW = {
  ts: '2026-08-15T17:00:00.000Z', session: 'abc12345', pane: 'main',
  turn_ts: '2026-08-15T16:59:58.000Z', values: ['count'], sourced: false, tools: 2,
  sentences: ['events.log holds 2213 lines'], wrote: ['exo_memory/x.md'], read: ['run1/items/t1/data/events.log'],
  head: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
};
const disagree = (cmds, ev) => ({
  failed: false,
  raw: `VERDICT: DISAGREE\nCOMMANDS:\n${cmds.join('\n')}\nEVIDENCE: ${ev}`,
});

// ---- C3: the audit fires on answer-key contact, and WITHOUT it the finding would surface ----
test('contaminated DISAGREE is disqualified — and surfaces when the guard is removed', () => {
  const dirty = sv.parseReader(disagree(
    ['cat exo_memory/journal/2026-08-15.md'], 'the journal correction says 1847').raw);
  const verdict = sv.audit(dirty, ROW);
  assert.equal(verdict.clean, false, 'guard must fire on journal contact');
  // the mutation: empty blocklist = guard removed. The specimen has no answer-class extension,
  // so the fence cannot save it — only the blocklist stands between it and SURFACE.
  const specimen = { commands: ['grep 1847 exo_memory/journal/notes.log'], evidence: 'says 1847' };
  assert.equal(sv.audit(specimen, ROW).clean, false, 'the blocklist catches it');
  assert.equal(sv.audit(specimen, ROW, []).clean, true,
    'with the blocklist removed the same contact passes — the guard is load-bearing, shown by failing');
});

test('prose .md outside the row paths disqualifies; the claim object itself is allowed', () => {
  const other = sv.parseReader(disagree(['Read exo_memory/loop/run1_scorecard.md'], 'scored 73%').raw);
  assert.equal(sv.audit(other, ROW).clean, false);
  const own = sv.parseReader(disagree(['stat -c %s exo_memory/x.md → 51852'], 'measured directly').raw);
  assert.equal(sv.audit(own, ROW).clean, true, 'the row’s own .md is the primary object, not contamination');
});

test('locating the object by its parent directory is NOT contamination (live-smoke regression)', () => {
  // exact shape the first live smoke disqualified: object under exo_memory/loop, reader's
  // evidence says "(under exo_memory/loop/)" while citing only the object itself
  const row = { ...ROW, read: ['exo_memory/loop/run1/items/t1/data/events.log'] };
  const f = sv.parseReader(disagree(
    ['wc -l "C:/x/lighthouse/exo_memory/loop/run1/items/t1/data/events.log" → 1847'],
    'The only events.log (under exo_memory/loop/) measures 1847 lines, not 2213').raw);
  assert.equal(sv.audit(f, row).clean, true);
  // …but ANOTHER file in that same shared directory still trips the fence
  const g = sv.parseReader(disagree(
    ['cat exo_memory/loop/run1/out/B_t1_r1.turn1.txt → "1,847 events"'], 'the answer file says so').raw);
  assert.equal(sv.audit(g, row).clean, false, 'answer capture in a shared ancestor must still disqualify');
});

// ---- C2: rows missing sentence/paths/head never launch, visibly ----
test('row lacking head is UNLAUNCHABLE and no reader spawns', () => {
  let spawned = 0;
  const spy = () => { spawned++; return disagree(['x'], 'y'); };
  const f = sv.processRow({ ...ROW, head: '' }, 'artifact', sv.REPO, spy);
  assert.equal(f.status, 'UNLAUNCHABLE');
  assert.match(f.evidence, /head/);
  assert.equal(spawned, 0, 'the gate must precede the spawn');
  assert.equal(f.surface, false);
});

test('floor row with no excerpt is UNLAUNCHABLE; with excerpt it launches', () => {
  const bare = { ...ROW, values: [], sentences: [], excerpt: '' };
  assert.equal(sv.processRow(bare, 'floor', sv.REPO, () => disagree(['x'], 'y')).status, 'UNLAUNCHABLE');
  const withEx = { ...bare, excerpt: 'the suite is at 261 tests' };
  const f = sv.processRow(withEx, 'floor', sv.REPO, () => ({ failed: false, raw: 'VERDICT: NO-CLAIM\nCOMMANDS:\nnone\nEVIDENCE: prose' }));
  assert.equal(f.status, 'NO-CLAIM');
});

// ---- C2: WORLD-MOVED — a DISAGREE must hold in BOTH trees to surface ----
// worldCheck spawns a claim-time reader only when heads differ; heads-equal short-circuits.
test('heads equal: no world check, clean DISAGREE surfaces', () => {
  const head = require('child_process').spawnSync('git', ['rev-parse', 'HEAD'],
    { cwd: sv.REPO, encoding: 'utf8' }).stdout.trim();
  const row = { ...ROW, head };
  const f = sv.processRow(row, 'artifact', sv.REPO,
    () => disagree(['wc -l run1/items/t1/data/events.log → 1847'], 'count is 1847 not 2213'));
  assert.equal(f.status, 'SURFACE');
  assert.equal(f.surface, true);
  assert.equal(f.caveat, sv.F0_CITATION, 'C6: the dual-denominator caveat rides the row');
});

test('heads differ: claim-time AGREE means WORLD-MOVED, no surface', () => {
  // spawner disagrees at the current tree but agrees at the claim-time worktree; worldCheck
  // distinguishes them by the repoRoot it passes. row.head is a real ancestor commit so the
  // worktree can actually be built — the guard runs for real, not hypothetically.
  const log = require('child_process').spawnSync('git', ['rev-list', '--max-count=2', 'HEAD'],
    { cwd: sv.REPO, encoding: 'utf8' }).stdout.trim().split('\n');
  const parent = log[1];
  assert.ok(parent, 'repo has a parent commit to pin');
  const row = { ...ROW, head: parent };
  const f = sv.processRow(row, 'artifact', sv.REPO, (briefText, root) =>
    root === sv.REPO ? disagree(['wc -l x → 12'], 'differs now')
                     : ({ failed: false, raw: 'VERDICT: AGREE\nCOMMANDS:\nwc -l x → 24\nEVIDENCE: matched then' }));
  assert.equal(f.status, 'WORLD-MOVED');
  assert.equal(f.surface, false);
  assert.equal(f.world.checked, true);
});

test('heads differ: DISAGREE in both trees surfaces', () => {
  const parent = require('child_process').spawnSync('git', ['rev-list', '--max-count=2', 'HEAD'],
    { cwd: sv.REPO, encoding: 'utf8' }).stdout.trim().split('\n')[1];
  const row = { ...ROW, head: parent };
  const f = sv.processRow(row, 'artifact', sv.REPO,
    () => disagree(['wc -l run1/items/t1/data/events.log → 1847'], 'wrong in both worlds'));
  assert.equal(f.status, 'SURFACE');
});

// ---- C1: selection ----
test('artifact-bound rows always select; floor is deterministic and near 3%', () => {
  assert.equal(sv.tierOf(ROW), 'artifact');
  let floor = 0;
  const pick = i => sv.tierOf({ session: `s${i}`, turn_ts: `t${i}`, values: [], wrote: [], read: [] });
  for (let i = 0; i < 2000; i++) if (pick(i) === 'floor') floor++;
  assert.ok(floor > 30 && floor < 90, `floor rate ~3% of 2000, got ${floor}`);
  for (let i = 0; i < 2000; i++) {
    const a = pick(i), b = pick(i);
    assert.equal(a, b, 'selection must be deterministic — re-rolling is ungameable only if there is no roll');
  }
});

test('middle tier: state-only selects less often than non-state', () => {
  let state = 0, nonState = 0;
  for (let i = 0; i < 2000; i++) {
    if (sv.tierOf({ session: `s${i}`, turn_ts: `t${i}`, values: ['state'], wrote: [], read: [] }) === 'middle') state++;
    if (sv.tierOf({ session: `s${i}`, turn_ts: `t${i}`, values: ['count'], wrote: [], read: [] }) === 'middle') nonState++;
  }
  assert.ok(nonState > state, `non-state ${nonState} must exceed state ${state}`);
  assert.ok(state > 100 && nonState > 350, 'both rates in the intended bands');
});

// ---- misses are lines: a failed reader is a row, not an absence ----
test('reader failure is recorded, never silent', () => {
  const f = sv.processRow(ROW, 'artifact', sv.REPO, () => ({ failed: true, raw: 'spawn ENOENT' }));
  assert.equal(f.status, 'READER-FAILED');
  assert.equal(f.surface, false);
  assert.match(f.evidence, /ENOENT/);
});

// ---------------------------------------------------------------------------
// The clock-path failures pane A found on 2026-08-17, hours before the first
// scheduled fire. All three are silent by nature: the wscript shim discards
// stdout, so a run that does nothing and a run that failed look identical from
// outside except for the exit code and what got written down.
// ---------------------------------------------------------------------------
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const TOOL = path.join(__dirname, 'second-vantage.js');

function bed(rows) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sv-'));
  fs.writeFileSync(path.join(dir, 'led.jsonl'), rows.map((r) => JSON.stringify(r)).join('\n') + '\n');
  return dir;
}
function runTool(dir, args) {
  const env = {
    ...process.env,
    VANTAGE_LEDGER: path.join(dir, 'led.jsonl'),
    SOURCED_LEDGER: path.join(dir, 'led.jsonl'),
    VANTAGE_WATERMARK: path.join(dir, 'mark.json'),
    VANTAGE_RUNLOG: path.join(dir, 'runs.log'),
    VANTAGE_FINDINGS: path.join(dir, 'findings.jsonl'),
  };
  try {
    const out = execFileSync(process.execPath, [TOOL, ...args], { env, encoding: 'utf8' });
    return { code: 0, out };
  } catch (e) { return { code: e.status, out: e.stdout || '', err: e.stderr || '' }; }
}
const mark = (dir) => { try { return JSON.parse(fs.readFileSync(path.join(dir, 'mark.json'), 'utf8')); } catch { return null; } };

test('the watermark never moves BACKWARD', () => {
  const dir = bed([{ ts: '2026-08-17T10:00:00.000Z', v: 2, claims: [], paths: [], heads: {} }]);
  fs.writeFileSync(path.join(dir, 'mark.json'), JSON.stringify({ ts: '2026-08-17T12:00:00.000Z' }));
  runTool(dir, ['--run']);
  assert.equal(mark(dir).ts, '2026-08-17T12:00:00.000Z',
    'an older row must not un-consume claims already paid for');
});

test('a run over zero new rows exits 0 — a claimless day is an honest zero', () => {
  // Deliberately NOT the js-suite rule: the floor tier is a lottery, so selecting nothing is a
  // real outcome, unlike a walker that discovers zero test files.
  const dir = bed([{ ts: '2026-08-17T10:00:00.000Z', v: 2, claims: [], paths: [], heads: {} }]);
  fs.writeFileSync(path.join(dir, 'mark.json'), JSON.stringify({ ts: '2026-08-17T23:00:00.000Z' }));
  const r = runTool(dir, ['--run']);
  assert.equal(r.code, 0, `zero selected must not fail the run:\n${r.out}${r.err || ''}`);
});

test('every run leaves a durable line, because the shim throws stdout away', () => {
  const dir = bed([{ ts: '2026-08-17T10:00:00.000Z', v: 2, claims: [], paths: [], heads: {} }]);
  runTool(dir, ['--run']);
  const lines = fs.readFileSync(path.join(dir, 'runs.log'), 'utf8').split('\n').filter(Boolean);
  assert.equal(lines.length, 1, 'one line per run');
  const rec = JSON.parse(lines[0]);
  assert.ok('rows' in rec && 'selected' in rec && 'verdicts' in rec, 'the counts must be on the line');
  assert.ok(rec.newest_row_age_h !== undefined,
    'newest_row_age_h is the field that separates a dead sensor from a quiet day across fires');
});

test('the run log distinguishes a DEAD sensor from a quiet day by age', () => {
  const old = bed([{ ts: '2026-07-01T00:00:00.000Z', v: 2, claims: [], paths: [], heads: {} }]);
  runTool(old, ['--run']);
  const rec = JSON.parse(fs.readFileSync(path.join(old, 'runs.log'), 'utf8').trim());
  assert.ok(Number(rec.newest_row_age_h) > 500,
    `a ledger whose newest row is weeks old must report a large age, got ${rec.newest_row_age_h}`);
});

test('selected-but-ZERO-verdicts exits nonzero — the one unambiguously wrong case', () => {
  // An artifact-bound row selects at 100%, but C2 refuses to launch a reader on a row with no
  // claim-time HEAD. So this row is picked and can never produce a verdict: the run did nothing
  // and, before this fix, said so with exit 0 into a launch log that is the only witness.
  const dir = bed([{
    ts: '2026-08-17T10:00:00.000Z', v: 2, pane: 'main',
    values: ['linecount'],
    claims: [{ channel: 'artifact', path: 'x.md', sentence: 'the suite reads 267 on this branch' }],
    paths: [], heads: {},
  }]);
  const r = runTool(dir, ['--run']);
  const rec = JSON.parse(fs.readFileSync(path.join(dir, 'runs.log'), 'utf8').trim());
  assert.ok(rec.selected > 0, `the row must be selected for this test to mean anything: ${JSON.stringify(rec)}`);
  assert.equal(rec.verdicts, 0, 'and no reader may have returned a verdict');
  assert.equal(r.code, 1, 'selected with zero verdicts must fail the run, not pass it silently');
  assert.match(r.err || '', /ZERO verdicts/, 'and must say so where a human will read it');
});

test('advanceWatermark is monotonic — a stale row cannot un-consume paid claims', () => {
  // Tested as a UNIT because the run-level path cannot discriminate: run()'s end-of-loop reduce
  // seeds from the existing mark, so it never goes backward either. Mutating the guard away left
  // the suite green, which is how this test came to exist.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'svw-'));
  const wm = path.join(dir, 'mark.json');
  const prev = process.env.VANTAGE_WATERMARK;
  process.env.VANTAGE_WATERMARK = wm;
  delete require.cache[require.resolve('./second-vantage.js')];
  const fresh = require('./second-vantage.js');
  fresh.advanceWatermark('2026-08-17T12:00:00.000Z');
  fresh.advanceWatermark('2026-08-17T10:00:00.000Z');          // older — must be ignored
  assert.equal(JSON.parse(fs.readFileSync(wm, 'utf8')).ts, '2026-08-17T12:00:00.000Z');
  fresh.advanceWatermark('2026-08-17T13:00:00.000Z');          // newer — must advance
  assert.equal(JSON.parse(fs.readFileSync(wm, 'utf8')).ts, '2026-08-17T13:00:00.000Z');
  if (prev === undefined) delete process.env.VANTAGE_WATERMARK; else process.env.VANTAGE_WATERMARK = prev;
  delete require.cache[require.resolve('./second-vantage.js')];
});
