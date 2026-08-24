// carrier-drift.test.js — synthetic fixtures for the mechanism, the REAL historical tree for the
// bar. Run: node --test consonance/tools/carrier-drift.test.js
//
// The bar this file has to clear, stated before any of it was written: RED on the historical
// state, GREEN at HEAD, and the difference has to be caused by the thing the tool claims to
// detect rather than by the fixture being different in some other way. So the two tree tests
// below are built from git at 21d5453^ and at HEAD, not from hand-typed strings — a hand-typed
// "historical state" proves the regex works and nothing else.
//
// The last test in the file is the one that matters most and it is a comparison, not an
// assertion about this tool: the propagation sweep the room actually registered
// (loop/handoff_2026-08-23.md:114) run against the pre-fix tree does NOT return
// loop/lap_2026-08-23.md, and this tool does. If that ever stops being true, either the history
// changed or this tool stopped earning its existence.
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const CD = require('./carrier-drift.js');
const REPO = path.resolve(__dirname, '..', '..');
const PREFIX = '21d5453^';   // the commit before the TRAINING/BOOT/lap marking pass

// ── fixture plumbing ─────────────────────────────────────────────────────────────────────
const dirs = [];
function tmpTree(files) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'carrier-drift-'));
  dirs.push(d);
  for (const [rel, body] of Object.entries(files)) {
    const p = path.join(d, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body);
  }
  return d;
}
test.after(() => { for (const d of dirs) fs.rmSync(d, { recursive: true, force: true }); });

const PATTERN = 'only\\s+(?:\\w+\\s+){0,2}decorrelated';
const MARKER = 'WITHDRAWN 2026-08-16';
function reg(sites, over = {}) {
  return { withdrawals: [Object.assign({
    id: 'w1', claim: 'c', withdrawn_at: 'journal/x.md:1', correct_form: 'least-correlated',
    pattern: PATTERN, marker: MARKER, sites,
  }, over)] };
}
const kinds = (res) => res.findings.map((f) => f.kind);

// ── collapse ─────────────────────────────────────────────────────────────────────────────
test('collapse: a phrase broken over a line break becomes one span, mapped to its first line', () => {
  const { text, lineOf } = CD.collapse('alpha\nthe keeper remains the only\ngenuinely decorrelated reader\n');
  assert.match(text, /the only genuinely decorrelated reader/);
  const at = text.indexOf('only genuinely');
  assert.strictEqual(lineOf[at], 2, 'the match reports the line the phrase STARTS on');
});

test('collapse: CRLF is normalised, so a Windows-checkout file is not a different corpus', () => {
  const a = CD.collapse('the only\r\ndecorrelated reader');
  assert.strictEqual(a.text, 'the only decorrelated reader');
});

// ── the mechanism ────────────────────────────────────────────────────────────────────────
test('an unaccounted assertion in a carrier is RED, with the file and line', () => {
  const root = tmpTree({ 'exo_memory/CARD.md': 'x\nthe human remains the only decorrelated instrument.\n' });
  const res = CD.scan({ root, registry: reg([]) });
  assert.strictEqual(res.red, true);
  const f = res.findings.find((x) => x.kind === 'UNACCOUNTED');
  assert.ok(f, 'expected UNACCOUNTED, got ' + JSON.stringify(kinds(res)));
  assert.strictEqual(f.file, 'exo_memory/CARD.md');
  assert.strictEqual(f.line, 2);
});

test('the same wording in a TRACE is GREEN — a journal recording June is a true record of June', () => {
  const root = tmpTree({ 'exo_memory/journal/2026-06-01.md': 'the only decorrelated instrument\n' });
  const res = CD.scan({ root, registry: reg([]) });
  assert.strictEqual(res.red, false);
  assert.strictEqual(res.counts.traces, 1);
  assert.strictEqual(res.counts.carriers, 0);
});

test('an accounted, marked assertion is GREEN', () => {
  const root = tmpTree({
    'exo_memory/CARD.md': 'the human remains the only decorrelated instrument.\n\n' +
      '> **WITHDRAWN 2026-08-16** correct form: least-correlated.\n',
  });
  const res = CD.scan({ root, registry: reg([
    { file: 'exo_memory/CARD.md', anchor: 'remains the only decorrelated instrument', kind: 'marked', why: 'struck in place' },
  ]) });
  assert.strictEqual(res.red, false, JSON.stringify(res.findings));
});

test('MUTATION, the propagation failure itself: delete the marker and the same file goes RED', () => {
  // one byte-level edit away from the test above — the strike removed, the claim left standing
  const root = tmpTree({ 'exo_memory/CARD.md': 'the human remains the only decorrelated instrument.\n' });
  const res = CD.scan({ root, registry: reg([
    { file: 'exo_memory/CARD.md', anchor: 'remains the only decorrelated instrument', kind: 'marked', why: 'struck in place' },
  ]) });
  assert.strictEqual(res.red, true);
  assert.ok(kinds(res).includes('UNMARKED-CARRIER'), JSON.stringify(kinds(res)));
});

test('MUTATION, the re-assertion: a SECOND occurrence in an already-marked file is RED', () => {
  // the case a file-scoped rule cannot see, and the case that actually happened on 2026-08-23
  const root = tmpTree({
    'exo_memory/CARD.md': 'the human remains the only decorrelated instrument.\n\n' +
      '> **WITHDRAWN 2026-08-16** correct form: least-correlated.\n\n' +
      'and anyway the keeper is the only decorrelated reader here.\n',
  });
  const res = CD.scan({ root, registry: reg([
    { file: 'exo_memory/CARD.md', anchor: 'remains the only decorrelated instrument', kind: 'marked', why: 'struck in place' },
  ]) });
  assert.strictEqual(res.red, true, 'a marked file must not be green forever');
  const f = res.findings.find((x) => x.kind === 'UNACCOUNTED');
  assert.ok(f);
  assert.strictEqual(f.line, 5);
});

test('an acknowledged site with no "see" is RED — an exemption with no destination is a silencer', () => {
  const root = tmpTree({ 'exo_memory/CARD.md': 'the only decorrelated reader\n> **WITHDRAWN 2026-08-16**\n' });
  const res = CD.scan({ root, registry: reg([
    { file: 'exo_memory/CARD.md', anchor: 'the only decorrelated reader', kind: 'acknowledged', why: 'trace' },
  ]) });
  assert.strictEqual(res.red, true);
  assert.ok(kinds(res).includes('BAD-ACK'), JSON.stringify(kinds(res)));
});

test('an acknowledged site in a file with no marker is RED', () => {
  const root = tmpTree({ 'exo_memory/CARD.md': 'the only decorrelated reader\n' });
  const res = CD.scan({ root, registry: reg([
    { file: 'exo_memory/CARD.md', anchor: 'the only decorrelated reader', kind: 'acknowledged', why: 'trace', see: 'the amendment above' },
  ]) });
  assert.strictEqual(res.red, true);
  assert.ok(kinds(res).includes('UNMARKED-CARRIER'), JSON.stringify(kinds(res)));
});

test('an anchor that does not contain the withdrawn wording is RED — it excuses nothing', () => {
  const root = tmpTree({ 'exo_memory/CARD.md': 'the only decorrelated reader\n' });
  const res = CD.scan({ root, registry: reg([
    { file: 'exo_memory/CARD.md', anchor: 'the only', kind: 'mention', why: 'nope' },
  ]) });
  assert.ok(kinds(res).includes('BAD-ANCHOR'), JSON.stringify(kinds(res)));
  assert.strictEqual(res.red, true);
});

test('an anchor matching twice is RED — it cannot say WHICH occurrence it accounts for', () => {
  const root = tmpTree({ 'exo_memory/CARD.md': 'the only decorrelated reader\nthe only decorrelated reader\n' });
  const res = CD.scan({ root, registry: reg([
    { file: 'exo_memory/CARD.md', anchor: 'the only decorrelated reader', kind: 'mention', why: 'x' },
  ]) });
  assert.ok(kinds(res).includes('AMBIGUOUS-SITE'), JSON.stringify(kinds(res)));
  assert.strictEqual(res.red, true);
});

test('an anchor that no longer appears is RED — a rotted census excuses by inertia', () => {
  const root = tmpTree({ 'exo_memory/CARD.md': 'the only decorrelated reader\n' });
  const res = CD.scan({ root, registry: reg([
    { file: 'exo_memory/CARD.md', anchor: 'the only decorrelated INSTRUMENT here', kind: 'mention', why: 'x' },
  ]) });
  assert.ok(kinds(res).includes('STALE-SITE'), JSON.stringify(kinds(res)));
});

test('a site naming a file outside the corpus is RED', () => {
  const root = tmpTree({ 'exo_memory/CARD.md': 'nothing here\n' });
  const res = CD.scan({ root, registry: reg([
    { file: 'exo_memory/GONE.md', anchor: 'the only decorrelated reader', kind: 'mention', why: 'x' },
  ]) });
  assert.ok(kinds(res).includes('MISSING-FILE'), JSON.stringify(kinds(res)));
});

test('properly removing the wording goes RED as STALE-SITE until the registry is pruned', () => {
  // the good outcome, and it still costs an edit: the census must stay accurate or it starts
  // excusing files by inertia. Named here so the friction is a decision rather than a surprise.
  const root = tmpTree({ 'exo_memory/CARD.md': 'the keeper is the least-correlated reader.\n' });
  const res = CD.scan({ root, registry: reg([
    { file: 'exo_memory/CARD.md', anchor: 'the only decorrelated reader', kind: 'marked', why: 'x' },
  ]) });
  assert.deepStrictEqual(kinds(res), ['STALE-SITE']);
  assert.match(res.findings[0].detail, /should be DELETED/);
});

test('an EMPTY registry is RED — an unarmed instrument is not a green tree', () => {
  const root = tmpTree({ 'exo_memory/CARD.md': 'the only decorrelated reader\n' });
  const res = CD.scan({ root, registry: { withdrawals: [] } });
  assert.strictEqual(res.red, true);
  assert.ok(kinds(res).includes('EMPTY-REGISTRY'));
});

// ── the wrapped case, which is the whole reason matching is collapsed ─────────────────────
test('a wrapped, reworded assertion is caught, and a line-based fixed-string scan misses it', () => {
  const body = 'Less-correlated, not decorrelated - and the keeper remains the only\n' +
               'genuinely decorrelated reader. The case data cuts the other way too.\n';
  const root = tmpTree({ 'exo_memory/loop/lap.md': body });

  const lineBased = body.split('\n').filter((l) => l.includes('only decorrelated'));
  assert.strictEqual(lineBased.length, 0, 'precondition: the registered grep finds nothing here');

  const res = CD.scan({ root, registry: reg([]) });
  const f = res.findings.find((x) => x.kind === 'UNACCOUNTED');
  assert.ok(f, 'the collapsed scan must find what the line scan cannot');
  assert.strictEqual(f.line, 1);
});

// ── the real trees ───────────────────────────────────────────────────────────────────────
/** Materialise every .md in a git tree into `dest`. One ls-tree, one cat-file --batch. */
function treeAt(rev, dest) {
  let names;
  try {
    names = execFileSync('git', ['-C', REPO, 'ls-tree', '-r', '--name-only', rev],
      { encoding: 'utf8', maxBuffer: 1 << 26 })
      .split('\n').map((s) => s.trim()).filter((s) => s.toLowerCase().endsWith('.md'));
  } catch (e) {
    throw new Error(`cannot read ${rev} from ${REPO} — a shallow clone cannot run the historical ` +
      `half of this suite, and skipping it would leave the bar unmeasured: ${e.message}`);
  }
  if (names.length < 50) throw new Error(`${rev} yielded only ${names.length} markdown files — the ` +
    'fixture is broken and every assertion over it would be vacuous');
  const input = names.map((n) => rev + ':' + n).join('\n') + '\n';
  const out = execFileSync('git', ['-C', REPO, 'cat-file', '--batch'], { input, maxBuffer: 1 << 28 });
  let off = 0;
  for (const name of names) {
    const nl = out.indexOf(0x0a, off);
    const parts = out.slice(off, nl).toString('utf8').split(' ');
    if (parts[1] === 'missing') { off = nl + 1; continue; }
    const size = Number(parts[2]);
    const p = path.join(dest, name);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, out.slice(nl + 1, nl + 1 + size));
    off = nl + 1 + size + 1;
  }
  return names.length;
}

const liveRegistry = () => JSON.parse(fs.readFileSync(CD.REGISTRY, 'utf8'));

test('THE BAR, half one: the shipped registry is GREEN against the working tree', () => {
  const res = CD.scan({ root: REPO, registry: liveRegistry() });
  assert.strictEqual(res.red, false, CD.report(res));
  const w = res.withdrawals[0];
  assert.strictEqual(w.occurrences, w.accounted, 'every occurrence accounted for');
  assert.ok(w.occurrences >= 15, `only ${w.occurrences} occurrences found — the pattern has rotted`);
});

test('THE BAR, half two: the same registry is RED against the tree at ' + PREFIX, () => {
  const root = tmpTree({});
  treeAt(PREFIX, root);
  const res = CD.scan({ root, registry: liveRegistry() });
  assert.strictEqual(res.red, true, 'the historical state must fail');

  const unmarked = res.findings.filter((f) => f.kind === 'UNMARKED-CARRIER').map((f) => f.file);
  assert.ok(unmarked.includes('exo_memory/TRAINING.md'),
    'the packet\'s named fixture must be named: ' + JSON.stringify(res.findings.map((f) => [f.kind, f.file])));
  assert.ok(unmarked.includes('exo_memory/loop/lap_2026-08-23.md'),
    'the re-assertion must be named');
  assert.ok(unmarked.includes('exo_memory/BOOT.md'),
    'BOOT\'s pointer was unmarked at this rev and must be named');
});

test('THE COMPARISON: the registered sweep misses the carrier this tool finds', () => {
  // loop/handoff_2026-08-23.md:114 registers the room's own propagation sweep as
  //     grep -rl "only decorrelated" exo_memory/ | grep -v journal/
  // Run against the pre-fix tree it returns four files. The re-assertion the whole pass was named
  // after — loop/lap_2026-08-23.md:22 — is not one of them, because the phrase wraps a line break
  // and takes an extra word. This is the measurement that justifies collapsed matching, kept as a
  // test so it cannot quietly stop being true.
  const swept = execFileSync('git', ['-C', REPO, 'grep', '-l', 'only decorrelated', PREFIX, '--', 'exo_memory/'],
    { encoding: 'utf8', maxBuffer: 1 << 24 })
    .split('\n').map((s) => s.replace(PREFIX + ':', '').trim())
    .filter((s) => s && !s.startsWith('exo_memory/journal/'));

  assert.ok(!swept.includes('exo_memory/loop/lap_2026-08-23.md'),
    'the registered sweep unexpectedly finds it — this tool\'s headline reason is gone: ' + JSON.stringify(swept));

  // and the file was there to be found: it is not absent, it is invisible to that sweep
  const size = execFileSync('git', ['-C', REPO, 'cat-file', '-s', PREFIX + ':exo_memory/loop/lap_2026-08-23.md'],
    { encoding: 'utf8' }).trim();
  assert.ok(Number(size) > 0, 'the file must exist at ' + PREFIX + ' for the miss to mean anything');

  const root = tmpTree({});
  treeAt(PREFIX, root);
  const res = CD.scan({ root, registry: liveRegistry() });
  assert.ok(res.findings.some((f) => f.file === 'exo_memory/loop/lap_2026-08-23.md'),
    'this tool must find what the sweep missed');
});
