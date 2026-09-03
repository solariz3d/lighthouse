'use strict';
// baton-wake-stop.test.js — the hook end to end, against a FAKE data dir.
//
// The tool's own suite proves the question is answered correctly. This proves the three things
// only the hook can get wrong, and each one is a way the room has actually been hurt before:
//   1. it BLOCKS when a baton is orphaned (otherwise the line reaches the transcript, i.e. the
//      keeper, i.e. the relay that was asleep — the defect rebuilt);
//   2. it blocks AT MOST ONCE per hand-off, so it cannot spin a seat at 3 a.m.;
//   3. it is silent on install, so its first act is not to fire on five days of history.
//
// It runs the real hook as a child process with CONSONANCE_DATA pointed at a temp dir, so nothing
// here touches the room's live ledgers — the shared-checkout hazard the 2026-08-26 commit-rule
// amendment names.

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HOOK = path.join(__dirname, 'baton-wake-stop.js');
let pass = 0; const fails = [];
function t(name, fn) {
  try { fn(); pass++; } catch (e) { fails.push(`${name}: ${e.message}`); }
}

function mkdir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'batonwake-'));
}

const PANES = [
  { pane: '0c0c0c0b-0000-4000-8000-00000000115b', cwd: 'C:\\Consonance\\instances\\librarian' },
];

/* A hand-off written NOW, so it lands after the baseline stop the harness records. */
function seed(dir, { note = 'map filed at exo_memory/librarian/2026-09-03.desktop.md', board = [] } = {}) {
  const at = Date.now();
  fs.writeFileSync(path.join(dir, 'lap.jsonl'),
    JSON.stringify({ lap: 'D005', stage: 'open', at: at - 5000 }) + '\n'
    + JSON.stringify({ lap: 'D005', stage: 'chain', chain: 'map', holder: 'librarian', at, note }) + '\n');
  fs.writeFileSync(path.join(dir, 'board.jsonl'), board.map((b) => JSON.stringify(b)).join('\n') + (board.length ? '\n' : ''));
  fs.writeFileSync(path.join(dir, 'panes.json'), JSON.stringify(PANES));
  return at;
}

/* Run the hook as the CHAIR seat (cwd basename `main`), which is the seat that hands to librarian. */
function runHook(dir, ev, cwdName = 'main') {
  const cwd = path.join(dir, 'instances', cwdName);
  fs.mkdirSync(cwd, { recursive: true });
  const r = spawnSync(process.execPath, [HOOK], {
    cwd, input: JSON.stringify(ev || {}), encoding: 'utf8',
    env: Object.assign({}, process.env, { CONSONANCE_DATA: dir }),
  });
  let out = null;
  try { out = r.stdout && r.stdout.trim() ? JSON.parse(r.stdout) : null; } catch (_) { out = null; }
  return { status: r.status, out, stdout: r.stdout, stderr: r.stderr };
}

// ── 1 · SILENT ON INSTALL, THEN BLOCKS ─────────────────────────────────────────────────────────

t('the FIRST stop is silent and writes only a baseline — it cannot fire on history', () => {
  const dir = mkdir();
  seed(dir);
  const r = runHook(dir, {});
  assert.strictEqual(r.status, 0, 'always exit 0');
  assert.strictEqual(r.out, null, 'no decision on the very first stop');
  const state = fs.readFileSync(path.join(dir, 'baton_wake.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
  assert.strictEqual(state.length, 1);
  assert.strictEqual(state[0].kind, 'stop');
});

t('BLOCKS on the stop after a hand-off, and the reason carries the FACT', () => {
  const dir = mkdir();
  seed(dir);                       // rows exist
  runHook(dir, {});                // baseline
  // a NEW hand-off lands after that baseline
  fs.appendFileSync(path.join(dir, 'lap.jsonl'),
    JSON.stringify({ lap: 'D005', stage: 'chain', chain: 'map', holder: 'librarian', at: Date.now() + 5, note: 'map filed at exo_memory/librarian/2026-09-03.desktop.md' }) + '\n');
  const r = runHook(dir, {});
  assert.ok(r.out, 'expected a decision');
  assert.strictEqual(r.out.decision, 'block');
  assert.ok(/D005/.test(r.out.reason), 'the lap is a fact');
  assert.ok(/librarian/.test(r.out.reason), 'the holder is a fact');
  assert.ok(/exo_memory\/librarian\/2026-09-03\.desktop\.md/.test(r.out.reason),
    'THE TRAP: the row note — where the map was written — must ride the channel, not a category');
  assert.ok(/ring BEFORE the row/.test(r.out.reason), 'the repair is named');
});

// ── 2 · THE WEDGE GUARDS ───────────────────────────────────────────────────────────────────────

t('stop_hook_active short-circuits — a block can never immediately re-block', () => {
  const dir = mkdir();
  seed(dir);
  runHook(dir, {});
  fs.appendFileSync(path.join(dir, 'lap.jsonl'),
    JSON.stringify({ lap: 'D005', stage: 'chain', chain: 'map', holder: 'librarian', at: Date.now() + 5, note: 'x' }) + '\n');
  const r = runHook(dir, { stop_hook_active: true });
  assert.strictEqual(r.out, null, 'no decision while continuing from a block');
});

t('ONCE PER HAND-OFF: the same orphaned row never blocks twice', () => {
  const dir = mkdir();
  seed(dir);
  runHook(dir, {});
  const at = Date.now() + 5;
  fs.appendFileSync(path.join(dir, 'lap.jsonl'),
    JSON.stringify({ lap: 'D005', stage: 'chain', chain: 'map', holder: 'librarian', at, note: 'x' }) + '\n');
  const first = runHook(dir, {});
  assert.ok(first.out && first.out.decision === 'block', 'first fires');
  const second = runHook(dir, {});
  assert.strictEqual(second.out, null, 'a seat that ignores the line stops normally next turn');
  const third = runHook(dir, {});
  assert.strictEqual(third.out, null, 'and forever after, for this row');
});

/* AND THE GUARD MUST BE ARMED, not merely honoured. Second survivor from the same mutation run:
 * with the `fired` append deleted the suite stayed green, because the isolation test below writes
 * the marker by hand. A guard that is never armed is the absent-guard-reads-as-passing-guard
 * collapse — so this asserts the ARTIFACT the hook leaves behind, which is the only evidence that
 * the guard would engage on a real machine. */
t('a block ARMS the guard — the fired marker is written with the row key', () => {
  const dir = mkdir();
  seed(dir);
  runHook(dir, {});
  const at = Date.now() + 5;
  fs.appendFileSync(path.join(dir, 'lap.jsonl'),
    JSON.stringify({ lap: 'D005', stage: 'chain', chain: 'map', holder: 'librarian', at, note: 'x' }) + '\n');
  assert.ok(runHook(dir, {}).out, 'precondition: it blocked');
  const state = fs.readFileSync(path.join(dir, 'baton_wake.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
  const marker = state.find((r) => r.kind === 'fired');
  assert.ok(marker, 'a block with no marker is a guard that can never engage');
  assert.strictEqual(marker.key, `D005|librarian|${at}`, 'keyed on the row, so a LATER hand-off still fires');
});

/* THE GUARD IN ISOLATION, and this test exists because the one above passed WITHOUT it.
 *
 * `mutate` on the hook removed the `fired.has(key)` line and the suite stayed green: the second
 * call was already silent because the first call's own baseline `stop` row had advanced `since`
 * past the row. The behaviour was right and the attribution was wrong — a test passing for the
 * wrong reason, which is the failure mode this room keeps catching by mutation rather than by
 * reading.
 *
 * So this reproduces the one state where the guard is the ONLY thing standing: the baseline write
 * failed (it is appended inside a swallowed try, exactly so a disk error cannot break a turn), so
 * `since` is stale and the turn boundary lets the row through a second time. Without the guard
 * that is an unbounded re-block on every Stop — the 3 a.m. spin. */
t('the once-guard ALONE stops a re-block when the baseline row is missing', () => {
  const dir = mkdir();
  const at = seed(dir);
  const pane = path.join(dir, 'instances', 'main');
  fs.mkdirSync(pane, { recursive: true });
  // A stale baseline (older than the row) plus a `fired` marker for this exact row: the turn
  // boundary does NOT silence this, so only the guard can.
  fs.writeFileSync(path.join(dir, 'baton_wake.jsonl'),
    JSON.stringify({ kind: 'stop', pane, station: 'chair', at: at - 1000 }) + '\n'
    + JSON.stringify({ kind: 'fired', pane, station: 'chair', at, key: `D005|librarian|${at}` }) + '\n');
  assert.strictEqual(runHook(dir, {}).out, null, 'the guard must hold on its own');
});

t('and without that marker the same stale state DOES fire — proving the test above is not vacuous', () => {
  const dir = mkdir();
  const at = seed(dir);
  const pane = path.join(dir, 'instances', 'main');
  fs.mkdirSync(pane, { recursive: true });
  fs.writeFileSync(path.join(dir, 'baton_wake.jsonl'),
    JSON.stringify({ kind: 'stop', pane, station: 'chair', at: at - 1000 }) + '\n');
  const r = runHook(dir, {});
  assert.ok(r.out && r.out.decision === 'block', 'same state minus the marker must block');
});

/* AND `since` IS PER-PANE, which the shared ledger makes easy to get wrong. Third survivor from
 * the mutation run: dropping the pane filter left the suite green, and on this machine that is a
 * live defect rather than a theoretical one — five or more panes append to one `baton_wake.jsonl`,
 * so ANY other seat stopping after the row would advance the outgoing seat's baseline past it and
 * swallow the block. The busier the room, the more reliably the instrument goes quiet. */
t('another seat stopping does NOT silence this seat — since is per-pane', () => {
  const dir = mkdir();
  const at = seed(dir);
  const mine = path.join(dir, 'instances', 'main');
  const theirs = path.join(dir, 'instances', 'sibling-other');
  fs.mkdirSync(mine, { recursive: true });
  fs.writeFileSync(path.join(dir, 'baton_wake.jsonl'),
    JSON.stringify({ kind: 'stop', pane: mine, station: 'chair', at: at - 1000 }) + '\n'
    // a DIFFERENT pane stops after the row landed — must not count as my baseline
    + JSON.stringify({ kind: 'stop', pane: theirs, station: 'panes', at: at + 1000 }) + '\n');
  const r = runHook(dir, {});
  assert.ok(r.out && r.out.decision === 'block',
    "another pane's stop must not advance this pane's turn boundary");
});

// ── 3 · IT STAYS QUIET WHEN IT SHOULD ──────────────────────────────────────────────────────────

t('SILENT when the holder was actually rung', () => {
  const dir = mkdir();
  seed(dir);
  runHook(dir, {});
  const at = Date.now() + 5;
  fs.appendFileSync(path.join(dir, 'lap.jsonl'),
    JSON.stringify({ lap: 'D005', stage: 'chain', chain: 'map', holder: 'librarian', at, note: 'x' }) + '\n');
  fs.appendFileSync(path.join(dir, 'board.jsonl'),
    JSON.stringify({ ts: at + 1, text: 'QUEUED -> 0c0c0c0b (1 waiting, prompt not idle): D005 MAP filed' }) + '\n');
  assert.strictEqual(runHook(dir, {}).out, null);
});

t('SILENT when this seat IS the holder', () => {
  const dir = mkdir();
  seed(dir);
  runHook(dir, {}, 'librarian');
  fs.appendFileSync(path.join(dir, 'lap.jsonl'),
    JSON.stringify({ lap: 'D005', stage: 'chain', chain: 'map', holder: 'librarian', at: Date.now() + 5, note: 'x' }) + '\n');
  assert.strictEqual(runHook(dir, {}, 'librarian').out, null);
});

t('SILENT when the lap is filed', () => {
  const dir = mkdir();
  seed(dir);
  runHook(dir, {});
  const at = Date.now() + 5;
  fs.appendFileSync(path.join(dir, 'lap.jsonl'),
    JSON.stringify({ lap: 'D005', stage: 'chain', chain: 'map', holder: 'librarian', at, note: 'x' }) + '\n'
    + JSON.stringify({ lap: 'D005', stage: 'chain', chain: 'filed', holder: 'chair', at: at + 1 }) + '\n');
  assert.strictEqual(runHook(dir, {}).out, null);
});

// ── 4 · IT MUST NEVER TAKE THE TURN DOWN ───────────────────────────────────────────────────────

t('a missing data dir is silence and exit 0, never a crash', () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'bwcwd-'));
  const r = spawnSync(process.execPath, [HOOK], {
    cwd, input: '{}', encoding: 'utf8',
    env: Object.assign({}, process.env, { CONSONANCE_DATA: path.join(cwd, 'does-not-exist') }),
  });
  assert.strictEqual(r.status, 0);
  assert.strictEqual(r.stdout.trim(), '');
});

t('garbage on stdin is silence and exit 0', () => {
  const dir = mkdir();
  seed(dir);
  const cwd = path.join(dir, 'instances', 'main');
  fs.mkdirSync(cwd, { recursive: true });
  const r = spawnSync(process.execPath, [HOOK], {
    cwd, input: 'not json at all', encoding: 'utf8',
    env: Object.assign({}, process.env, { CONSONANCE_DATA: dir }),
  });
  assert.strictEqual(r.status, 0);
});

t('corrupt ledger lines do not take the turn down', () => {
  const dir = mkdir();
  seed(dir);
  fs.appendFileSync(path.join(dir, 'lap.jsonl'), '{ this is not json\n');
  fs.appendFileSync(path.join(dir, 'board.jsonl'), 'neither is this\n');
  const r = runHook(dir, {});
  assert.strictEqual(r.status, 0);
});

console.log(`baton-wake-stop: ${pass} passed, ${fails.length} failed`);
for (const f of fails) console.log('  FAIL ' + f);
process.exit(fails.length ? 1 : 0);
