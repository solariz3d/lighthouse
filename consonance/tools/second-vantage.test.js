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
