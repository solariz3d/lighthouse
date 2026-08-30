// dispatch-gate.test.js — the pure core in both directions, and the hook as the harness runs it:
// JSON on stdin, exit code and stdout observed.
// Run: node --test consonance/hooks/dispatch-gate.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  findCitation, findCitationDetail, DISPATCH_VERBS, classifyLedger, TEST_SIGNATURE,
} = require('./dispatch-gate.js');

const HOOK = path.join(__dirname, 'dispatch-gate.js');

// fixtures for the injected lookups — no repo, no git, so both directions are pinnable
const exists = (p) => p === 'exo_memory/librarian/2026-08-24.md' || p === 'consonance/src-tauri/src/main.rs';
const shaOk = (s) => s === '3d33713' || s === '0a7ac2b';

// ── THE LEDGER LEAK, AND THE ONE LINE THAT CLOSES IT ────────────────────────────────────────────
//
// Until 2026-08-30 this function spawned the hook with the AMBIENT environment. `CONSONANCE_DATA`
// was unset, so the hook's `dataDir()` fell through to `~/.consonance.json` and every run of this
// suite appended FOUR rows to the LIVE ledger at C:/Consonance/data/dispatch-gate.jsonl.
//
// 468 of 604 rows — 77% of the ledger — were written by this file. The room then quoted the result
// as "the most direct evidence a focal cue does something" (the cited rate rising 10.8% -> 25.3%);
// the trend was the ratio of test runs to real dispatches per day. The suite was measuring itself.
//
// `LEDGER` below is the fix, and it is one line. Its proof is not this comment: the last test in
// this file COPIES this source, DELETES the CONSONANCE_DATA line, runs the copy against a sandboxed
// home, and requires the rows to reappear. Without that mutation there is only an assertion that
// the leak is closed.
const LEDGER = fs.mkdtempSync(path.join(os.tmpdir(), 'dispatch-gate-ledger-'));

function runHook(payload, envOverrides) {
  const r = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    env: Object.assign({}, process.env, { CONSONANCE_DATA: LEDGER }, envOverrides || {}),
  });
  return { status: r.status, stdout: (r.stdout || '').trim() };
}

function decision(out) {
  if (!out) return null;
  return JSON.parse(out).hookSpecificOutput.permissionDecision;
}

// ── the pure core ────────────────────────────────────────────────────────────

test('a dispatch citing a real commit routes an object', () => {
  assert.strictEqual(findCitation('landed as 3d33713, read the message', exists, shaOk), 'sha');
});

test('a dispatch citing a repo path routes an object', () => {
  assert.strictEqual(
    findCitation('the packets are at exo_memory/librarian/2026-08-24.md', exists, shaOk), 'path');
});

// the house citation format is path:line — if that did not count, every correctly-cited dispatch
// in this repo's history would be asked about, and the gate would be trained past within a night
test('the path:line citation format counts', () => {
  assert.strictEqual(findCitation('see consonance/src-tauri/src/main.rs:4818', exists, shaOk), 'path');
});

test('prose with no citation is caught, however long and however confident', () => {
  const essay = 'Your intake puts THE SHELF before THE ROOM it indexes, and the test asserts the '
    + 'opposite ordering. I did not fix it because burying a red inside my commit is how a red sits '
    + 'unwatched. It is on the table.';
  assert.strictEqual(findCitation(essay, exists, shaOk), null);
});

// the exact 2026-08-24 failure, as a fixture: fluent, specific, technically detailed, and citing
// nothing that can be opened
test('a sha-shaped string that does not resolve is not a citation', () => {
  assert.strictEqual(findCitation('fixed in d4e8f21', exists, shaOk), null,
    'an invented sha was handed over as a citation once already — it must not satisfy this gate');
});

test('a path-shaped string that does not exist is not a citation', () => {
  assert.strictEqual(findCitation('see exo_memory/loop/does_not_exist.md', exists, shaOk), null);
});

test('the interrupt carve-out is explicit and lands in the text the receiver reads', () => {
  assert.strictEqual(findCitation('[interrupt] stop, you are about to clobber the branch', exists, shaOk),
    'interrupt');
});

test('empty and non-string text never throw', () => {
  assert.strictEqual(findCitation('', exists, shaOk), null);
  assert.strictEqual(findCitation(undefined, exists, shaOk), null);
  assert.strictEqual(findCitation(null, exists, shaOk), null);
});

// ── the hook as the harness runs it ──────────────────────────────────────────

test('an uncited dispatch is ASKED, not blocked', () => {
  const out = runHook({ tool_name: 'mcp__consonance__chair_inject',
    tool_input: { target: 'LIB', text: 'a confident paragraph citing nothing at all' } });
  assert.strictEqual(out.status, 0, 'the hook must never fail the turn');
  assert.strictEqual(decision(out.stdout), 'ask');
});

test('the question names the cost rather than reciting a rule', () => {
  const out = runHook({ tool_name: 'mcp__consonance__chair_inject',
    tool_input: { target: 'LIB', text: 'no citation here' } });
  const why = JSON.parse(out.stdout).hookSpecificOutput.permissionDecisionReason;
  assert.ok(/un-revisable/.test(why), 'it must say why it cannot be taken back');
  assert.ok(/wrong ruling/.test(why), 'and name the measured consequence');
  assert.ok(/\[interrupt\]/.test(why), 'and tell the reader how to proceed deliberately');
});

test("the librarian's verb is gated too, and the question addresses the right seat", () => {
  const out = runHook({ tool_name: 'mcp__consonance__call_chair',
    tool_input: { text: 'plan is ready, pull it' } });
  assert.strictEqual(decision(out.stdout), 'ask');
  assert.ok(/the orchestrator/.test(JSON.parse(out.stdout).hookSpecificOutput.permissionDecisionReason));
});

test('every other tool passes untouched — this gate has exactly two verbs', () => {
  for (const verb of ['Bash', 'Edit', 'mcp__consonance__post_board', 'mcp__consonance__raise_pull']) {
    const out = runHook({ tool_name: verb, tool_input: { text: 'no citation' } });
    assert.strictEqual(out.stdout, '', `${verb} must not be gated`);
    assert.strictEqual(out.status, 0);
  }
  assert.strictEqual(DISPATCH_VERBS.size, 2);
});

// raise_pull is the human-gated path; gating it too would put two questions in front of one act
test('raise_pull is deliberately not a dispatch verb', () => {
  assert.ok(!DISPATCH_VERBS.has('mcp__consonance__raise_pull'));
});

test('malformed stdin fails OPEN — a gate that breaks a dispatch is worse than none', () => {
  const r = spawnSync(process.execPath, [HOOK], { input: 'not json at all', encoding: 'utf8' });
  assert.strictEqual(r.status, 0);
  assert.strictEqual((r.stdout || '').trim(), '');
});

test('a payload with no tool_input fails OPEN', () => {
  const out = runHook({ tool_name: 'mcp__consonance__chair_inject' });
  assert.strictEqual(out.status, 0);
  assert.strictEqual(decision(out.stdout), 'ask',
    'no text is no citation — it asks, but it must not crash');
});

// ── the join keys the outcome column needs ──────────────────────────────────────────────────────

test('findCitationDetail returns the token, and findCitation still returns only the kind', () => {
  const d = findCitationDetail('landed as 3d33713, read the message', exists, shaOk);
  assert.deepStrictEqual(d, { kind: 'sha', token: '3d33713' });
  assert.strictEqual(findCitation('landed as 3d33713, read the message', exists, shaOk), 'sha',
    'the old contract must not move — other seats split transcripts with this by name');
  assert.deepStrictEqual(
    findCitationDetail('see consonance/src-tauri/src/main.rs:4818', exists, shaOk),
    { kind: 'path', token: 'consonance/src-tauri/src/main.rs' },
    'the :line suffix is stripped so the token is openable');
  assert.deepStrictEqual(findCitationDetail('nothing here', exists, shaOk), { kind: null, token: null });
  assert.deepStrictEqual(findCitationDetail('[interrupt] stop', exists, shaOk),
                         { kind: 'interrupt', token: null });
});

test('a gated dispatch records the target and the citation, and NEVER the token or the text', () => {
  runHook({ tool_name: 'mcp__consonance__chair_inject',
            tool_input: { target: 'B', token: 'SECRET-CHAIR-TOKEN', text: 'uncited prose' } });
  const raw = fs.readFileSync(path.join(LEDGER, 'dispatch-gate.jsonl'), 'utf8');
  assert.ok(!raw.includes('SECRET-CHAIR-TOKEN'), 'the chair token reached the ledger');
  assert.ok(!raw.includes('uncited prose'), 'the dispatch text reached the ledger');
  const rows = raw.split('\n').filter(Boolean);
  const last = JSON.parse(rows[rows.length - 1]);
  assert.strictEqual(last.target, 'B');
  assert.strictEqual(last.citation, null);
});

// ── the classifier that decides what gets quarantined ───────────────────────────────────────────

const T0 = Date.parse('2026-08-30T10:00:00.000Z');
const at = (ms, o) => Object.assign({ ts: new Date(T0 + ms).toISOString() }, o);
const testRun = (base, stepMs) => TEST_SIGNATURE.map((s, k) =>
  at(base + k * (stepMs === undefined ? 100 : stepMs),
     { verb: s.verb, outcome: s.outcome, cited: null, chars: s.chars }));
const realRow = (ms, cited) =>
  at(ms, { verb: 'mcp__consonance__chair_inject', outcome: 'allowed', cited, chars: 2000 });

test('a test run is quarantined whole, and real rows around it are kept', () => {
  const rows = [realRow(0, 'sha'), ...testRun(1000), realRow(9000, 'path'),
                ...testRun(20000), realRow(40000, 'sha')];
  const c = classifyLedger(rows);
  assert.strictEqual(c.runs.length, 2);
  assert.strictEqual(c.quarantine.length, 8);
  assert.strictEqual(c.keep.length, 3);
  assert.strictEqual(c.keep.length + c.quarantine.length, rows.length,
    'the partition must be exhaustive or the report describes a set nobody measured');
  assert.ok(c.keep.every((r) => r.outcome === 'allowed'));
});

test('the values alone are not enough — a quadruple spread over minutes is KEPT, and reported', () => {
  const c = classifyLedger(testRun(0, 60000));
  assert.strictEqual(c.quarantine.length, 0, 'a slow quadruple must never be quarantined');
  assert.strictEqual(c.keep.length, 4);
  assert.strictEqual(c.nearMisses.length, 1, 'and it must be printed, not silently kept');
});

test('a partial test run is left in place and reported as an orphan', () => {
  const rows = [realRow(0, 'sha'), ...testRun(1000).slice(0, 3)];
  const c = classifyLedger(rows);
  assert.strictEqual(c.quarantine.length, 0, 'three of four rows is not a run');
  assert.strictEqual(c.orphans.length, 3, 'the leftovers must be visible, not swallowed');
});

test('a real uncited dispatch that happens to be 43 chars is NOT quarantined on its own', () => {
  const rows = [at(0, { verb: 'mcp__consonance__chair_inject', outcome: 'asked', cited: null, chars: 43 }),
                realRow(5000, 'sha')];
  const c = classifyLedger(rows);
  assert.strictEqual(c.quarantine.length, 0);
  assert.strictEqual(c.orphans.length, 1, 'it is flagged for a human, never moved by the machine');
});

// ── THE PROOF: remove the CONSONANCE_DATA line and the rows come back ───────────────────────────
//
// The bar the packet set, and the only thing that distinguishes a closed leak from a claim that the
// leak is closed. The suite is copied, the fix is deleted from the copy, and both are run against a
// sandboxed home whose .consonance.json points at a sentinel directory — exactly the fallback path
// that caused the pollution. Unmutated: the sentinel stays empty. Mutated: it fills.

test('MUTATION — deleting the CONSONANCE_DATA line makes the ledger rows reappear', () => {
  if (process.env.DG_MUTANT) return;                    // the copy must not re-enter this test

  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'dg-sandbox-'));
  const home = path.join(sandbox, 'home');
  const sentinel = path.join(sandbox, 'data');
  fs.mkdirSync(home); fs.mkdirSync(sentinel);
  fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({
    data_dir: sentinel,
    room_path: path.join(__dirname, '..', '..', 'exo_memory', 'BOOT.md'),
  }));

  const hookAbs = JSON.stringify(path.join(__dirname, 'dispatch-gate.js'));
  const src = fs.readFileSync(__filename, 'utf8');
  const abs = (s) => s
    .replace(/'\.\/dispatch-gate\.js'/g, hookAbs)
    .replace(/path\.join\(__dirname, 'dispatch-gate\.js'\)/g, hookAbs);

  const FIX = /\n\s*env: Object\.assign\(\{\}, process\.env, \{ CONSONANCE_DATA: LEDGER \}, envOverrides \|\| \{\}\),/;
  assert.ok(FIX.test(src),
    'NOT APPLIED: the fix line was not found, so this mutation proves nothing about it');
  const mutated = abs(src.replace(FIX, ''));
  assert.notStrictEqual(mutated, abs(src), 'NOT APPLIED: the substitution was a no-op');

  const env = Object.assign({}, process.env, { DG_MUTANT: '1', HOME: home, USERPROFILE: home });
  delete env.CONSONANCE_DATA;
  delete env.FERRY_REPO;

  const clean = path.join(sandbox, 'clean.test.js');
  const dirty = path.join(sandbox, 'dirty.test.js');
  fs.writeFileSync(clean, abs(src));
  fs.writeFileSync(dirty, mutated);
  const ledger = path.join(sentinel, 'dispatch-gate.jsonl');
  const count = () => (fs.existsSync(ledger)
    ? fs.readFileSync(ledger, 'utf8').split('\n').filter(Boolean).length : 0);

  // Run the copies PLAINLY, not under `--test`. A mutation harness must be able to say why a
  // mutant produced nothing, and `node --test` reports a file that failed to LOAD identically to a
  // file whose assertions ran and passed — which is this repo's own SILENT-vs-green failure class,
  // rebuilt inside the instrument meant to prove the fix. Run plainly and keep the output.
  const run = (f) => spawnSync(process.execPath, [f], { encoding: 'utf8', env });
  const tail = (r) => ((r.stderr || '') + (r.stdout || '')).trim().split('\n').slice(0, 6).join(' | ');

  const rc = run(clean);
  const afterClean = count();
  const rd = run(dirty);
  const afterDirty = count();

  // A clean copy that CRASHED also writes zero rows, and would pass the next assertion for the
  // worst possible reason. This is the first version of this test's actual defect: it ran the
  // copies under `node --test`, where a file that never loaded is reported the same as a green one,
  // and it read the mutant's silence as "the leak is closed". Require the clean copy to have RUN.
  assert.strictEqual(rc.status, 0,
    'THE CONTROL ARM DID NOT RUN (exit ' + rc.status + '), so its zero rows mean nothing.\n  ' +
    tail(rc));
  assert.strictEqual(afterClean, 0,
    'THE FIX IS NOT LOAD-BEARING: the unmutated suite still wrote ' + afterClean + ' row(s) to the ' +
    'fallback ledger. Every other assertion about the leak being closed is void.\n  clean said: ' +
    tail(rc));
  assert.ok(afterDirty > 0,
    'THE MUTATION DID NOT REPRODUCE THE LEAK (' + afterDirty + ' rows), so this test proves NOTHING ' +
    'about the fix — treat it as NOT APPLIED and find out why before trusting the quarantine.\n' +
    '  mutant exit ' + rd.status + ' said: ' + tail(rd));

  try { fs.rmSync(sandbox, { recursive: true, force: true }); } catch (_) {}
});

// ── MUTATION on the classifier, because this is the code that MOVES DATA ────────────────────────
//
// The packet named one mutation (delete the CONSONANCE_DATA line) and that is the test above. This
// is the other half: `classifyLedger` decides which rows leave the live ledger, so every guard in it
// is broken here and required to turn something red. Reported as applied / caught / NOT APPLIED,
// and a NOT APPLIED mutant proves nothing about the guard it was aimed at.

test('MUTATION — every guard in the classifier is load-bearing', () => {
  const src = fs.readFileSync(path.join(__dirname, 'dispatch-gate.js'), 'utf8');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dg-mut-'));

  const slowRun = TEST_SIGNATURE.map((s, k) => ({
    ts: new Date(T0 + k * 60000).toISOString(),
    verb: s.verb, outcome: s.outcome, cited: null, chars: s.chars,
  }));
  const citedLikeTest = TEST_SIGNATURE.map((s, k) => ({
    ts: new Date(T0 + k * 100).toISOString(),
    verb: s.verb, outcome: s.outcome, cited: 'sha', chars: s.chars,
  }));
  const partial = [realRow(0, 'sha')].concat(testRun(1000).slice(0, 3));

  const MUTANTS = [
    { // without the clock, a quadruple spread over an hour is moved out of the live ledger
      id: 'classifier/burst-window-ignored',
      find: '    if (!(span >= 0 && span <= limit)) {',
      replace: '    if (false) {',
      probe: (m) => m.classifyLedger(slowRun).quarantine.length > 0,
    },
    { // without the cited check, four REAL cited dispatches of those lengths would be quarantined
      id: 'classifier/cited-field-not-checked',
      find: "         (row.cited === null || row.cited === undefined) && row.chars === s.chars;",
      replace: '         row.chars === s.chars;',
      probe: (m) => m.classifyLedger(citedLikeTest).quarantine.length > 0,
    },
    { // order is what makes the signature specific; matching any position makes it a value filter
      id: 'classifier/signature-order-ignored',
      find: '    if (![0, 1, 2, 3].every((k) => matchesSignature(rows[i + k], k))) continue;',
      replace: '    if (![0, 1, 2, 3].every((k) => TEST_SIGNATURE.some((_, j) => matchesSignature(rows[i + k], j)))) continue;',
      probe: (m) => {
        const shuffled = [slowRun[1], slowRun[0], slowRun[3], slowRun[2]]
          .map((r, k) => Object.assign({}, r, { ts: new Date(T0 + k * 100).toISOString() }));
        return m.classifyLedger(shuffled).quarantine.length > 0;
      },
    },
    { // leftovers must stay visible; a silent orphan is pollution nobody can find again
      id: 'classifier/orphans-not-reported',
      find: '  const orphans = keep.filter((r) => r.outcome === \'asked\' && !r.cited &&\n                                     TEST_SIGNATURE.some((s) => s.chars === r.chars));',
      replace: '  const orphans = [];',
      probe: (m) => m.classifyLedger(partial).orphans.length === 0,
    },
  ];

  let applied = 0, caught = 0, notApplied = 0;
  const survivors = [], skipped = [];
  for (const mut of MUTANTS) {
    // the probe must be clean on healthy code, or its catch would mean nothing
    assert.strictEqual(mut.probe(require('./dispatch-gate.js')), false,
      'BROKEN PROBE: ' + mut.id + ' fires on the unmutated classifier');
    const n = src.split(mut.find).length - 1;
    if (n !== 1) { notApplied++; skipped.push(mut.id + ' (' + (n === 0 ? 'not found' : n + ' occurrences') + ')'); continue; }
    const f = path.join(dir, mut.id.replace(/[^a-z0-9]/gi, '_') + '.js');
    fs.writeFileSync(f, src.replace(mut.find, mut.replace));
    applied++;
    let got;
    try { got = mut.probe(require(f)); } catch (_) { got = true; }
    if (got) caught++; else survivors.push(mut.id);
  }
  console.log('    MUTATION (classifier): applied ' + applied + ' / caught ' + caught +
              ' / NOT APPLIED ' + notApplied);
  for (const s of skipped) console.log('      NOT APPLIED — proves nothing: ' + s);
  for (const s of survivors) console.log('      SURVIVED: ' + s);
  assert.strictEqual(survivors.length, 0, 'survivors: ' + survivors.join(', '));
  assert.strictEqual(notApplied, 0, 'not applied: ' + skipped.join(', '));
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_) {}
});
