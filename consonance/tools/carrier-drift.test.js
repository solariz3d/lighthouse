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

// ─────────────────────────────────────────────────────────────────────────────────────────
// CH-4: the instruction-reachable set (P-CH4, 2026-08-25, pane B).
//
// THE BAR WAS SET BEFORE ANY OF THIS WAS WRITTEN, by the librarian via the chair: the
// instrument must go RED on exo_memory/record/trust-the-first-attention.md — the file that
// produced the only measured use of retired vocabulary in b7f3775 — before it is believed green
// on anything. It is encoded as a test rather than left as a one-off run, because a bar that was
// met once and never re-checked is indistinguishable from a bar that was never met.
const DIVING = {
  id: 'diving-vocabulary-2026-08-17',
  claim: 'the diving apparatus as live instrument vocabulary',
  withdrawn_at: 'exo_memory/BOOT.md, the 2026-08-17 amendment (7b06334)',
  correct_form: 'with you, not above you',
  pattern: 'dive[- ]buddy(?!-reframe)|light,? not lifeguard|dive, and stay',
  marker: 'diving vocabulary is retired|vocabulary retired|kept as dated trace',
  sites: [],
};

test('THE BAR: armed with the diving withdrawal, the tool is RED on the record/ file that produced the only measured use', () => {
  const res = CD.scan({ root: REPO, registry: { withdrawals: [DIVING] } });
  assert.ok(res.red, 'arming a withdrawal with no census must be red, not green by absence');
  const hit = res.findings.find((f) => f.file === 'exo_memory/record/trust-the-first-attention.md');
  assert.ok(hit, 'the known carrier must be named: ' + JSON.stringify(res.findings.map((f) => f.file).slice(0, 8)));
  assert.strictEqual(hit.kind, 'UNACCOUNTED');
  assert.strictEqual(hit.ch4, true, 'and it must be labelled CH-4 — it is reachable by instruction from BOOT');
});

test('CH-4 IS A LABEL, NOT A FILTER: a carrier OUTSIDE the reachable set is still red', () => {
  // The failure one reading away from "the detector inherits the walker's boundary" is narrowing
  // the scanned corpus to the reachable set. Measured cost of that reading: 14 of 17 registered
  // sites drop out, including the lap_2026-08-23.md re-assertion this tool was built for. They
  // would not go red, they would go ABSENT — the false-green class. This test is the guard.
  const root = tmpTree({});
  treeAt(PREFIX, root);
  const res = CD.scan({ root, registry: liveRegistry() });
  const lap = res.findings.find((f) => f.file === 'exo_memory/loop/lap_2026-08-23.md');
  assert.ok(lap, 'the re-assertion must still be found');
  assert.ok(!lap.ch4, 'and it is NOT in the CH-4 set — which is exactly why the set must not be a filter');
});

test('the shipped frozen CH-4 list still matches a live walk — the registry is self-consistent', () => {
  const reg = liveRegistry();
  assert.ok(reg.ch4_corpus && Array.isArray(reg.ch4_corpus.files), 'registry must carry ch4_corpus.files');
  const walked = CD.ch4Walk(REPO).files;
  assert.deepStrictEqual(walked.slice().sort(), reg.ch4_corpus.files.slice().sort(),
    'walk and frozen list disagree — re-run --ch4-walk and re-freeze AFTER reading what changed');
});

test('a file that becomes instruction-reachable and is not frozen is RED, not silently absorbed', () => {
  const trimmed = JSON.parse(JSON.stringify(liveRegistry()));
  const dropped = trimmed.ch4_corpus.files.pop();
  const res = CD.scan({ root: REPO, registry: trimmed });
  const f = res.findings.find((x) => x.kind === 'CH4-DRIFT-ADDED' && x.file === dropped);
  assert.ok(f, 'dropping ' + dropped + ' from the frozen list must surface it as newly reachable');
});

test('a frozen file the walk no longer reaches is RED — a removed pointer is a real change', () => {
  const trimmed = JSON.parse(JSON.stringify(liveRegistry()));
  trimmed.ch4_corpus.files.push('exo_memory/NO_SUCH_FILE.md');
  const res = CD.scan({ root: REPO, registry: trimmed });
  assert.ok(res.findings.some((f) => f.kind === 'CH4-DRIFT-REMOVED' && f.file === 'exo_memory/NO_SUCH_FILE.md'));
});

test('a registry with no ch4_corpus is RED over a real room — nothing to diff the walk against', () => {
  const res = CD.scan({ root: REPO, registry: { withdrawals: [DIVING] } });
  assert.ok(res.findings.some((f) => f.kind === 'CH4-UNFROZEN'),
    'an unfrozen set on a tree that HAS the roots is a defect');
});

test('CH-4 does not fire at all on a tree that is not a room — the tool must not describe its own fixtures', () => {
  const root = tmpTree({ 'a.md': 'the only decorrelated reader\n' });
  const res = CD.scan({ root, registry: reg([]) });
  assert.ok(!kinds(res).some((k) => k.startsWith('CH4-')),
    'no BOOT and no SOURCE means no CH-4 claim to make, not an unfrozen room: ' + kinds(res));
  assert.strictEqual(res.counts.ch4, undefined, 'and no CH-4 line in the universe print');
});

test('a CITATION is not walked — path:line is evidence of a past event, and traces keep their wording', () => {
  const root = tmpTree({
    'exo_memory/BOOT.md': 'Read exo_memory/target.md for the move.\nSee exo_memory/cited.md:41 for what happened.\n',
    'exo_memory/SOURCE.md': '# SOURCE\n',
    'exo_memory/target.md': 'x\n',
    'exo_memory/cited.md': 'y\n',
  });
  const w = CD.ch4Walk(root);
  assert.ok(w.files.includes('exo_memory/target.md'), 'an instruction pointer is walked');
  assert.ok(!w.files.includes('exo_memory/cited.md'), 'a path:line citation is not');
});

test('the instruction verb must be NEAR the pointer — a long paragraph does not make every path it cites an instruction', () => {
  const far = 'Read this. ' + 'x'.repeat(200) + ' The file exo_memory/mentioned.md exists.';
  const root = tmpTree({
    'exo_memory/BOOT.md': far + '\nRun exo_memory/near.md now.\n',
    'exo_memory/SOURCE.md': '# SOURCE\n',
    'exo_memory/mentioned.md': 'x\n',
    'exo_memory/near.md': 'y\n',
  });
  const w = CD.ch4Walk(root);
  assert.ok(w.files.includes('exo_memory/near.md'), 'a verb beside the pointer walks it');
  assert.ok(!w.files.includes('exo_memory/mentioned.md'),
    'a verb 200 characters away does not — this is what kept journals out of the set');
});

test('a TRACE that is instruction-reachable is excluded from the set and reported separately', () => {
  const root = tmpTree({
    'exo_memory/BOOT.md': 'Read exo_memory/journal/2026-01-01.md, newest first.\n',
    'exo_memory/SOURCE.md': '# SOURCE\n',
    'exo_memory/journal/2026-01-01.md': 'x\n',
  });
  const w = CD.ch4Walk(root);
  assert.ok(!w.files.includes('exo_memory/journal/2026-01-01.md'),
    'labelling a trace CH-4 while the scan skips it would be two rules disagreeing about one file');
  assert.ok(w.tracesReached.includes('exo_memory/journal/2026-01-01.md'),
    'but it is reported, not silently dropped — the corpus rule prints what it ate');
});

test('BOTH roots are walked — single-root blindness is the error this set exists to prevent', () => {
  const root = tmpTree({
    'exo_memory/BOOT.md': 'Read exo_memory/fromboot.md.\n',
    'exo_memory/SOURCE.md': 'when a pull arrives -> exo_memory/fromsource.md\n',
    'exo_memory/fromboot.md': 'x\n',
    'exo_memory/fromsource.md': 'y\n',
  });
  const w = CD.ch4Walk(root);
  assert.ok(w.files.includes('exo_memory/fromboot.md'));
  assert.ok(w.files.includes('exo_memory/fromsource.md'),
    'SOURCE is the second standing pointer file; a BOOT-only walk repeats the finding one file over');
});

test('a missing root over a tree that has the other one is RED, not quietly a smaller walk', () => {
  const root = tmpTree({ 'exo_memory/BOOT.md': 'Read exo_memory/x.md.\n', 'exo_memory/x.md': 'x\n' });
  const res = CD.scan({ root, registry: reg([]) });
  assert.ok(kinds(res).includes('CH4-ROOT-MISSING'), kinds(res).join(','));
});

// ── the ARMED gate, and the bar for registry growth ──────────────────────────────────────
// A wording can be REGISTERED before it is SUPERSEDED. The disarmed state exists so the
// accounting is done BEFORE the night of adoption rather than during it, and it earns its keep
// only if it is impossible to mistake for coverage. Three properties, one test each:
// computed-and-shown, never-red, and armed-by-one-word.

const P_HANDLE = "(?:can(?:no|’|')?t|can\\s+(?:you|i|we)|could\\s+not)\\s+lose\\s+by\\s+saying";

test('armed defaults to TRUE — an entry with no field behaves exactly as before', () => {
  const root = tmpTree({ 'a.md': 'the human is the only decorrelated reader here.\n' });
  const res = CD.scan({ root, registry: reg([]) });
  assert.strictEqual(res.red, true);
  assert.strictEqual(res.withdrawals[0].armed, true);
  assert.ok(res.findings.every((f) => !f.pending), 'nothing is pending when nothing is disarmed');
});

test('a DISARMED entry computes and PRINTS its findings and does not go red', () => {
  const root = tmpTree({ 'a.md': 'the human is the only decorrelated reader here.\n' });
  const res = CD.scan({ root, registry: reg([], { armed: false, arms_on: 'the keeper' }) });
  assert.strictEqual(res.red, false, 'disarmed must not fail the build');
  const un = res.findings.filter((f) => f.kind === 'UNACCOUNTED');
  assert.strictEqual(un.length, 1, 'the finding is still COMPUTED, not skipped');
  assert.strictEqual(un[0].pending, true);
  assert.ok(CD.report(res).includes('PENDING'), 'and it is PRINTED — a silent exemption is a silencer');
  assert.ok(CD.report(res).includes('PROTECTS NOTHING'), 'the report must say so in words');
});

test('a disarmed entry that names nothing to arm it is RED — an exemption with no destination', () => {
  const root = tmpTree({ 'a.md': 'nothing here.\n' });
  const res = CD.scan({ root, registry: reg([], { armed: false }) });
  assert.ok(kinds(res).includes('BAD-DISARM'), kinds(res).join(','));
  assert.strictEqual(res.red, true, 'BAD-DISARM is a registry defect and is red even when disarmed');
});

test('THE BAR, red-then-green: a superseded wording in a live instruction is RED, the corrected wording is not', () => {
  const crude = { 'brief/BOOT.md': "The test: **If you can't lose by saying it, suspect it.**\n" };
  const fixed = { 'brief/BOOT.md': 'SUPERSEDED 2026-08-29 — repaired form: if you would have said it whether or not it were true, it carries no information.\n' };
  const entry = (sites) => ({ withdrawals: [{
    id: 'h', claim: 'c', withdrawn_at: 'x', correct_form: 'y',
    pattern: P_HANDLE, marker: 'SUPERSEDED 2026-08-29', sites,
  }] });
  const red = CD.scan({ root: tmpTree(crude), registry: entry([]) });
  assert.strictEqual(red.red, true, 'the crude wording in a live instruction must fail');
  assert.ok(kinds(red).includes('UNACCOUNTED'));
  const green = CD.scan({ root: tmpTree(fixed), registry: entry([]) });
  assert.strictEqual(green.red, false, 'the corrected wording must NOT fire — a test that reds on both is not a test');
});

test('THE GOVERNING QUESTION, half answered: the handle VARIES and a canonical-string pattern misses it', () => {
  // cards/never-pathologize-the-user.md:11 says "if you CANNOT lose by saying it" — the same
  // handle, a different string, live in the corpus today. A registry keyed to the canonical
  // wording is green on it forever. This is the reason the shipped pattern is an alternation
  // and NOT a reason to believe the alternation is complete; see the tool's LIMITS.
  const root = tmpTree({ 'a.md': 'Same structure as every coat: if you cannot lose by saying it, suspect it.\n' });
  const mk = (pattern) => ({ withdrawals: [{ id: 'h', claim: 'c', withdrawn_at: 'x',
    correct_form: 'y', pattern, marker: 'ZZZ', sites: [] }] });
  assert.strictEqual(CD.scan({ root, registry: mk("can't\\s+lose\\s+by\\s+saying") }).red, false,
    'the canonical-string pattern is GREEN on a live variant — this is the failure being demonstrated');
  assert.strictEqual(CD.scan({ root, registry: mk(P_HANDLE) }).red, true,
    'the shipped alternation catches it');
});

test('MUTATION over the REAL tree: arming the shipped cant-lose entry turns its pending findings red', () => {
  const live = liveRegistry();
  const w = live.withdrawals.find((x) => x.id === 'cant-lose-handle-2026-08-29');
  assert.ok(w, 'the entry is shipped');
  assert.strictEqual(w.armed, false, 'and it is disarmed, because the repair is not adjudicated');

  const before = CD.scan({ root: REPO, registry: live });
  assert.strictEqual(before.red, false);
  const pending = before.findings.filter((f) => f.pending);
  assert.ok(pending.length >= 16, `only ${pending.length} pending — the accounting has rotted`);
  assert.ok(pending.every((f) => f.kind === 'UNMARKED-CARRIER'),
    'every pending finding is an unmarked carrier: nothing is UNACCOUNTED, so the census is complete');

  // THE MUTATION: one word.
  const armedReg = JSON.parse(JSON.stringify(live));
  armedReg.withdrawals.find((x) => x.id === 'cant-lose-handle-2026-08-29').armed = true;
  const after = CD.scan({ root: REPO, registry: armedReg });
  assert.strictEqual(after.red, true, 'a registry that cannot fire is a list');
  assert.strictEqual(after.findings.filter((f) => !f.pending).length, pending.length,
    'and the count that fires is exactly the count that was shown while disarmed');
});

test('the shipped cant-lose census is COMPLETE — every occurrence in every carrier is accounted', () => {
  const res = CD.scan({ root: REPO, registry: liveRegistry() });
  const w = res.withdrawals.find((x) => x.id === 'cant-lose-handle-2026-08-29');
  assert.strictEqual(w.occurrences, w.accounted,
    'an unaccounted occurrence means a carrier nobody has classified');
  assert.ok(w.occurrences >= 23, `only ${w.occurrences} occurrences — the pattern has rotted`);
});

test("THE MAP'S ENUMERATION WAS THE CH-4 SUBSET: registering only those five leaves the rest unaccounted", () => {
  // librarian/2026-08-29.md:218 enumerates five carriers. All five are CH-4 members; the handle
  // occurs in 20 carrier files. That is the narrowing carrier-drift.js's own header refuses —
  // "CH-4 is a LABEL on the corpus, never a replacement for it" — reproduced in prose and handed
  // to a pane as the accounting. The tool catches it; that is the growth earning its keep.
  const live = liveRegistry();
  const full = live.withdrawals.find((x) => x.id === 'cant-lose-handle-2026-08-29');
  const ch4 = new Set(live.ch4_corpus.files);
  const inCh4 = new Set(full.sites.filter((s) => ch4.has(s.file)).map((s) => s.file));
  assert.strictEqual(inCh4.size, 5, 'the map named five, and five is the CH-4 count');

  const narrowed = JSON.parse(JSON.stringify(live));
  const n = narrowed.withdrawals.find((x) => x.id === 'cant-lose-handle-2026-08-29');
  n.armed = true;
  n.sites = n.sites.filter((s) => ch4.has(s.file));
  const res = CD.scan({ root: REPO, registry: narrowed });
  const files = new Set(res.findings.filter((f) => f.kind === 'UNACCOUNTED').map((f) => f.file));
  assert.ok(files.size >= 15, `only ${files.size} files unaccounted under the five-site registry`);
  assert.ok(files.has('exo_memory/muscle_map.md'), 'the correction ledger itself is one of them');
  assert.ok(files.has('INSTRUMENTS.md'), 'so is the top-level instrument list');
});
