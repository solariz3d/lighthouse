#!/usr/bin/env node
/* memory-sweep.test.js — and the first test is the privacy guard, not a happy path.
 *
 * THE CANARY TEST IS THE POINT. `memory-sweep.js` may read private per-seat memory and may emit
 * only paths and counts. That contract is worth nothing as a comment, so a fixture file carries a
 * distinctive string that appears nowhere else, and the test fails if that string reaches stdout
 * in ANY output mode. Add a `--verbose` or a context flag and this test goes red, which is the
 * intended relationship between the two files.
 *
 *   node consonance/tools/memory-sweep.test.js
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const TOOL = path.join(__dirname, 'memory-sweep.js');
const M = require('./memory-sweep.js');

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); console.log('  ok   ' + name); pass++; }
  catch (e) { console.log('  FAIL ' + name + '\n       ' + (e && e.message)); fail++; }
}

/* A fixture tree shaped exactly like ~/.claude/projects: <project>/memory/*.md, flat. */
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'memsweep-'));
const CANARY = 'CANARY-e7f1a9-private-prose-must-never-surface';

function w(project, file, body) {
  const d = path.join(TMP, project, 'memory');
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, file), body);
}

// a pane's memory carrying the retirement, with the canary in the same sentence as a hit
w('C--Consonance-instances-sibling-zzz', 'note.md',
  'The lifeguard reads from outside. ' + CANARY + ' It is the dive buddy in it with you.\n');
// a keeper project with a different count
w('C--Users-zackn-OneDrive-Desktop-fixture', 'deck.md',
  'lifeguard lifeguard in the water\n');
// clean file — must be scanned and must not appear in findings
w('C--Users-zackn-OneDrive-Desktop-fixture', 'clean.md', 'nothing registered here at all\n');
// non-.md must be SKIPPED and COUNTED as skipped, never silently absent
fs.writeFileSync(path.join(TMP, 'C--Users-zackn-OneDrive-Desktop-fixture', 'memory', 'notes.txt'), 'lifeguard\n');
// a subdirectory under memory/ must be counted as skipped, never descended
fs.mkdirSync(path.join(TMP, 'C--Users-zackn-OneDrive-Desktop-fixture', 'memory', 'sub'), { recursive: true });
fs.writeFileSync(path.join(TMP, 'C--Users-zackn-OneDrive-Desktop-fixture', 'memory', 'sub', 'deep.md'), 'lifeguard\n');
// a project dir with NO memory/ — in the project count, not in the memory count
fs.mkdirSync(path.join(TMP, 'C--Consonance-instances-nomem'), { recursive: true });
// a project dir with an EMPTY memory/ — in the memory count, contributing zero files
fs.mkdirSync(path.join(TMP, 'C--Consonance-instances-empty', 'memory'), { recursive: true });

/* The tool declares NO wordings — every pattern comes from the registry, so the fixture registry
 * is what the tests drive. Two entries: one word-bounded (the boundary test reads its pattern
 * back out of the loaded registry, never restating it) and one free-form. */
const REG = path.join(TMP, 'registry.json');
fs.writeFileSync(REG, JSON.stringify({
  withdrawals: [
    {
      id: 'test-retirement', claim: 'a test retirement', correct_form: 'the corrected form',
      pattern: '\\bdive[- ]buddy\\b|\\blifeguard\\b|\\bin the water\\b|\\bdivers?\\b|\\bthe dock\\b',
    },
    {
      id: 'test-withdrawal', claim: 'a test claim', correct_form: 'the corrected form',
      pattern: 'only\\s+(?:\\w+\\s+){0,2}decorrelated',
    },
  ],
}));
w('C--Consonance-instances-sibling-zzz', 'withdrawn.md',
  'it says the only genuinely decorrelated reader is the keeper\n');

// ── THE GUARD ────────────────────────────────────────────────────────────────────────────────

t('CANARY: no matched prose reaches stdout in text mode', () => {
  const out = execFileSync(process.execPath, [TOOL, '--root', TMP, '--registry', REG], { encoding: 'utf8' });
  assert.ok(out.indexOf(CANARY) === -1, 'the canary string appeared in text output');
  assert.ok(out.indexOf('It is the dive buddy in it with you') === -1, 'source prose appeared in output');
});

t('CANARY: no matched prose reaches stdout in --json mode', () => {
  const out = execFileSync(process.execPath, [TOOL, '--root', TMP, '--registry', REG, '--json'], { encoding: 'utf8' });
  assert.ok(out.indexOf(CANARY) === -1, 'the canary string appeared in JSON output');
});

/* MUTATION-DRIVEN. The two tests above passed while a `--verbose` that dumps whole files was
 * spliced into the tool (M1, 2026-08-25) — they only ever ran the flags they knew about, so they
 * asserted a property of the invocation rather than of the tool. NO FLAG MAY PRODUCE CONTENT, so
 * the guard has to try the flags an author would plausibly add, and a bare invocation too. */
t('CANARY: no flag anyone is likely to add can produce content', () => {
  const flagSets = [
    [], ['--verbose'], ['-v'], ['--context'], ['--show'], ['--lines'], ['--text'], ['--debug'],
    ['--json', '--verbose'], ['--verbose', '--json'], ['--all'], ['--full'],
  ];
  for (const flags of flagSets) {
    let out;
    try {
      out = execFileSync(process.execPath, [TOOL, '--root', TMP, '--registry', REG, ...flags],
        { encoding: 'utf8' });
    } catch (e) {
      out = String((e && e.stdout) || '') + String((e && e.stderr) || '');
    }
    assert.ok(out.indexOf(CANARY) === -1,
      'the canary surfaced under flags: ' + (flags.length ? flags.join(' ') : '(none)'));
  }
});

/* MUTATION-DRIVEN (M2). Swapping a count for the matched substring in a finding row left the
 * suite green once the earlier per-term assertions were removed — the canary happened not to sit
 * inside a match. The contract is not "the canary specifically"; it is COUNTS ONLY, so assert the
 * TYPE of every reported value, in both output modes. A string in this position is a leak whether
 * or not this fixture's canary is in it. */
t('every reported per-term value is a NUMBER, in the module and in --json', () => {
  const r = M.sweep(TMP, REG);
  assert.ok(r.findings.length > 0, 'the fixture produces findings to check');
  for (const f of r.findings) {
    assert.strictEqual(typeof f.hits, 'number', 'hits is a count');
    for (const [term, v] of Object.entries(f.byTerm)) {
      assert.strictEqual(typeof v, 'number', 'byTerm[' + term + '] is a count, not text');
    }
  }
  const out = JSON.parse(
    execFileSync(process.execPath, [TOOL, '--root', TMP, '--registry', REG, '--json'], { encoding: 'utf8' }));
  for (const f of out.findings) {
    assert.strictEqual(typeof f.hits, 'number');
    for (const v of Object.values(f.by_term)) assert.strictEqual(typeof v, 'number');
  }
});

t('countOnly returns an integer and never the matched text', () => {
  const n = M.countOnly('lifeguard and lifeguard again', /\blifeguard\b/gi);
  assert.strictEqual(n, 2);
  assert.strictEqual(typeof n, 'number');
});

t('countOnly cannot spin on a zero-width pattern', () => {
  const n = M.countOnly('abc', /(?:)/g);
  assert.ok(Number.isFinite(n), 'returned a finite count');
});

// ── THE UNIVERSE ─────────────────────────────────────────────────────────────────────────────

t('universe counts every project dir, including ones with no memory/', () => {
  const u = M.enumerate(TMP);
  assert.strictEqual(u.projectDirs, 4, 'four project dirs in the fixture');
  assert.strictEqual(u.withMemoryDir, 3, 'three of them have a memory/');
});

t('an EMPTY memory dir is in the denominator, not outside it', () => {
  const u = M.enumerate(TMP);
  const projectsWithFiles = new Set(u.files.map(f => f.project)).size;
  assert.strictEqual(projectsWithFiles, 2, 'only two projects hold .md files');
  assert.strictEqual(u.withMemoryDir - projectsWithFiles, 1, 'one memory dir is empty and counted');
});

t('non-.md entries and subdirectories are COUNTED as skipped, never silently absent', () => {
  const u = M.enumerate(TMP);
  assert.strictEqual(u.skipped, 2, 'notes.txt and the sub/ directory');
  assert.ok(u.files.every(f => f.file !== 'deep.md'), 'never descended into sub/');
});

t('the universe line is printed on every run, hits or no hits', () => {
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'memsweep-empty-'));
  const out = execFileSync(process.execPath, [TOOL, '--root', empty, '--registry', REG], { encoding: 'utf8' });
  assert.ok(/UNIVERSE\s+0 project dirs seen/.test(out), 'universe printed on an empty tree');
  assert.ok(/no occurrence/.test(out), 'and the no-hit line');
  fs.rmSync(empty, { recursive: true, force: true });
});

t('an ABSENT root is reported, not reported as clean', () => {
  const out = execFileSync(process.execPath,
    [TOOL, '--root', path.join(TMP, 'no-such-root'), '--registry', REG], { encoding: 'utf8' });
  assert.ok(/ABSENT — nothing was swept/.test(out), 'absent root is announced');
});

// ── THE SWEEP ────────────────────────────────────────────────────────────────────────────────

t('finds the registered retirement and reports a count', () => {
  const r = M.sweep(TMP, REG);
  const deck = r.findings.find(f => f.file === 'deck.md' && f.set === 'test-retirement');
  assert.ok(deck, 'deck.md found');
  assert.strictEqual(deck.hits, 3, 'lifeguard x2 + in the water x1');
});

/* THE COUPLING TEST. The tool must carry no wordings of its own: adding a private lexicon back
 * would make it a second authority, which is what the first draft did and what double-counted
 * 8 files into 11. An empty registry must therefore sweep for NOTHING. */
t('the tool declares no wordings — an empty registry sweeps for nothing', () => {
  const emptyReg = path.join(TMP, 'empty-registry.json');
  fs.writeFileSync(emptyReg, JSON.stringify({ withdrawals: [] }));
  const r = M.sweep(TMP, emptyReg);
  assert.strictEqual(r.sets.length, 0, 'no wording sets without a registry');
  assert.strictEqual(r.findings.length, 0, 'and therefore no findings');
  assert.strictEqual(r.registry.ok, false, 'an empty registry is not a healthy registry');
  assert.ok(/no usable withdrawal patterns/.test(r.registry.reason));
});

t('an empty registry reports NOT-RUN rather than a green', () => {
  const emptyReg = path.join(TMP, 'empty-registry.json');
  const out = M.render(M.sweep(TMP, emptyReg));
  assert.ok(/REGISTRY NOT USABLE/.test(out));
  assert.ok(/NOT-RUN wearing a green/.test(out), 'the clean report is explicitly disqualified');
});

t('a clean file is scanned and produces no finding', () => {
  const r = M.sweep(TMP, REG);
  assert.ok(r.universe.files.some(f => f.file === 'clean.md'), 'clean.md was scanned');
  assert.ok(!r.findings.some(f => f.file === 'clean.md'), 'and produced no finding');
});

t('registered withdrawals are swept live from the registry', () => {
  const r = M.sweep(TMP, REG);
  assert.ok(r.findings.some(f => f.set === 'test-withdrawal' && f.file === 'withdrawn.md'),
    'the registry pattern fired');
});

t('an unreadable registry is REPORTED, never silently swept as nothing', () => {
  const r = M.sweep(TMP, path.join(TMP, 'no-registry.json'));
  assert.strictEqual(r.registry.ok, false);
  const out = M.render(r);
  assert.ok(/REGISTRY NOT USABLE/.test(out), 'the failure is announced in the output');
  assert.ok(/NOT-RUN wearing a green/.test(out), 'and the clean report is disqualified');
});

/* MUTATION-DRIVEN, AND IT IS THE ONE THAT MATTERS MOST. This test used to restate the patterns as
 * literals, so it stayed green while the lexicon in the tool lost its word boundaries (M6,
 * 2026-08-25) — it checked a regex the test had written, not the one that ships. It now pulls the
 * pattern back out of the LOADED registry, which is the only place patterns live.
 *
 * The stake is measured, not hypothetical: on the real CH-5 surface an unbounded `diver` matches
 * inside `diverge`/`divergent` and turns 8 carrying files into 11. */
t('word boundaries survive the round trip through the registry — diverge/dockside do not fire', () => {
  const reg = M.loadWithdrawals(REG);
  assert.strictEqual(reg.ok, true, 'fixture registry loads');
  const set = reg.withdrawals.find(w => w.id === 'test-retirement');
  assert.ok(set, 'the retirement set survived loading');
  const re = set.terms[0].pattern;
  assert.strictEqual(M.countOnly('diverge divergent diversity divest', re), 0, 'diverg* is not a diver');
  assert.strictEqual(M.countOnly('dockside the docking', re), 0, 'dockside is not the dock');
  assert.strictEqual(M.countOnly('lifeguarding happens offshore', re), 0, 'lifeguarding is not lifeguard');
  // and it still matches what it is for
  assert.strictEqual(M.countOnly('a diver and two divers', re), 2);
  assert.strictEqual(M.countOnly('back to the dock with a lifeguard', re), 2);
});

// ── GUARD 2: ROUTING ─────────────────────────────────────────────────────────────────────────

t('a pane project routes to that pane; anything else routes as a keeper project', () => {
  assert.deepStrictEqual(M.owningSeat('C--Consonance-instances-sibling-zzz'),
    { kind: 'pane', label: 'sibling-zzz' });
  assert.deepStrictEqual(M.owningSeat('C--Users-zackn-OneDrive-Desktop-fixture'),
    { kind: 'keeper-project', label: 'C--Users-zackn-OneDrive-Desktop-fixture' });
});

t('the output routes every finding to an owner', () => {
  const out = M.render(M.sweep(TMP, REG));
  assert.ok(/route to pane:sibling-zzz/.test(out));
  assert.ok(/route to keeper-project:/.test(out));
  assert.ok(/USE vs MENTION is NOT decided here/.test(out), 'guard 1 consequence is stated in output');
});

fs.rmSync(TMP, { recursive: true, force: true });
console.log('\n  ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
