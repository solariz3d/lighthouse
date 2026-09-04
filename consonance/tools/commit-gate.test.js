// commit-gate.test.js — fixtures for the mechanism, tonight's real incident as the bar.
// Run:  node --test consonance/tools/commit-gate.test.js
//
// THE BAR, stated before any of it was written (packet §4): a commit of
// consonance/ui/chain-indicator.js while E holds it and no hand-back exists must be REFUSED,
// NAMING E; and the same commit after E's hand-back is filed and newer than the dispatch must be
// ALLOWED. Everything else here exists to stop that pair from passing for the wrong reason.
//
// NOTHING IN THIS FILE TOUCHES THE LIVE CHECKOUT. B, C and E are live and dirty in corpus-age.*,
// lap-row.js and chain-indicator.* right now, and a test that staged or committed in the shared
// tree to prove a point about capturing other seats' work would be the joke writing itself. Every
// case builds its own tree, and the two `git add` cases build their own REPOSITORY.
//
// The one read of the real tree is parsePacket against a real committed packet — the shape this
// tool depends on has to be the shape the room actually writes, and a hand-typed fixture proves
// only that the regex matches the fixture.
'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const G = require('./commit-gate.js');
const REPO = path.resolve(__dirname, '..', '..');

const dirs = [];
function tmp(tag) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), `commit-gate-${tag}-`));
  dirs.push(d);
  return d;
}
process.on('exit', () => {
  for (const d of dirs) { try { fs.rmSync(d, { recursive: true, force: true }); } catch (e) { /* best effort */ } }
});

const DISPATCH_AT = 1788353583433;   // e6215a8's dispatch row, so the freshness bar is a real one

// A tree with a dispatched lap and one packet addressed to E. `handbackAge` is milliseconds
// relative to the dispatch: negative = a STALE hand-back from an earlier lap, positive = filed
// after this lap's dispatch, null = not filed at all.
function fixture({ lap = 'L033', dispatched = true, handbackAge = null, packet = true } = {}) {
  const root = tmp('tree');
  const repo = path.join(root, 'repo');
  const data = path.join(root, 'data');
  fs.mkdirSync(path.join(repo, 'exo_memory', 'loop'), { recursive: true });
  fs.mkdirSync(path.join(repo, 'exo_memory', 'handback'), { recursive: true });
  fs.mkdirSync(data, { recursive: true });

  fs.writeFileSync(path.join(data, 'lap.jsonl'),
    JSON.stringify({ lap, stage: 'open', at: DISPATCH_AT - 60000 }) + '\n' +
    JSON.stringify({ lap, stage: 'chain', chain: dispatched ? 'dispatched' : 'closed', at: DISPATCH_AT }) + '\n');

  if (packet) {
    fs.writeFileSync(path.join(repo, 'exo_memory', 'loop', 'packet_aura_arrow_2026-09-02.md'),
      `# P-AURA-ARROW — the arrow. ${lap}.\n\n` +
      '**To ECHO, 2026-09-02. From the LIBRARIAN.**\n\n' +
      '## 3 · WHAT YOU OWN\n\n' +
      '    consonance/ui/chain-indicator.js\n' +
      '    consonance/ui/chain-indicator.test.js   (the tests for it)\n' +
      '    exo_memory/handback/p-aura-arrow_2026-09-02.md\n\n' +
      '**Do not commit.**\n\n' +
      '## 8 · HAND-BACK\n\n' +
      'Write `exo_memory/handback/p-aura-arrow_2026-09-02.md`, then call_librarian.\n');
  }
  if (handbackAge !== null) {
    const hb = path.join(repo, 'exo_memory', 'handback', 'p-aura-arrow_2026-09-02.md');
    fs.writeFileSync(hb, '# P-AURA-ARROW hand-back.\n');
    const when = (DISPATCH_AT + handbackAge) / 1000;
    fs.utimesSync(hb, when, when);
  }
  return { repo, data };
}

// ── THE BAR ───────────────────────────────────────────────────────────────────────────────

test("BAR 1a — E's file, no hand-back: REFUSED, and the refusal names E", () => {
  const { repo, data } = fixture();
  const r = G.check({ repo, dataDir: data, paths: ['consonance/ui/chain-indicator.js'] });
  assert.strictEqual(r.verdict, 'REFUSE');
  assert.strictEqual(r.refusals.length, 1);
  assert.strictEqual(r.refusals[0].holder, 'E', 'the holder must be named, not merely implied');
  assert.match(G.report(r), /pane E/, 'the printed refusal is the product — it has to say who');
  assert.match(G.report(r), /chain-indicator\.js/, 'and which path');
});

test('BAR 1b — the same file after the hand-back is filed: ALLOWED', () => {
  const { repo, data } = fixture({ handbackAge: +60000 });
  const r = G.check({ repo, dataDir: data, paths: ['consonance/ui/chain-indicator.js'] });
  assert.strictEqual(r.verdict, 'ALLOW', 'the hand-back is the release');
});

// THE ASSERTION MUTANT 3 KILLS. Without the freshness comparison, this hand-back — written
// before this lap's dispatch, for earlier work — would release a file that is in flight NOW.
test('BAR 3 — a hand-back OLDER than the dispatch releases nothing', () => {
  const { repo, data } = fixture({ handbackAge: -60000 });
  const r = G.check({ repo, dataDir: data, paths: ['consonance/ui/chain-indicator.js'] });
  assert.strictEqual(r.verdict, 'REFUSE',
    'a stale hand-back from a previous lap must not release a file dirty in this one');
  assert.strictEqual(r.refusals[0].holder, 'E');
});

// THE ASSERTION MUTANT 4 KILLS: refusing has to cost the commit, not decorate it.
test('BAR 4 — a refusal is a refusal, not a warning', () => {
  const { repo, data } = fixture();
  const r = G.check({ repo, dataDir: data, paths: ['consonance/ui/chain-indicator.js'] });
  assert.strictEqual(r.verdict, 'REFUSE');
  assert.notStrictEqual(r.verdict, 'WARN');
  assert.ok(r.refusals.length > 0, 'a verdict with no named path cannot stop anything');
});

test('BAR 5 — the chair still lands a packet or a ledger row in one step', () => {
  const { repo, data } = fixture();
  const r = G.check({
    repo, dataDir: data,
    paths: ['exo_memory/loop/packet_commit_gate_2026-09-02.md', 'exo_memory/ledger/LEDGER.md'],
  });
  assert.strictEqual(r.verdict, 'ALLOW',
    'no pane owns these; a gate that deadlocks the chair is disabled before morning');
});

// ── BAR 2: both `git add` forms, in a REAL repository that is not this one ─────────────────

function realRepo() {
  const { repo, data } = fixture();
  const git = (...a) => execFileSync('git', a, { cwd: repo, encoding: 'utf8' });
  git('init', '-q');
  git('config', 'user.email', 'gate@test');
  git('config', 'user.name', 'gate');
  fs.mkdirSync(path.join(repo, 'consonance', 'ui'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'consonance', 'ui', 'chain-indicator.js'), 'base\n');
  git('add', '.');
  git('commit', '-qm', 'base');
  fs.appendFileSync(path.join(repo, 'consonance', 'ui', 'chain-indicator.js'), "E's in-flight edit\n");
  return { repo, data, git };
}

test("BAR 2 — `git add -A` stages E's file and the gate refuses it", () => {
  const { repo, data, git } = realRepo();
  git('add', '-A');
  const staged = G.stagedPaths(repo);
  assert.ok(staged.includes('consonance/ui/chain-indicator.js'), staged.join(','));
  const r = G.check({ repo, dataDir: data, paths: staged });
  assert.strictEqual(r.verdict, 'REFUSE');
  assert.strictEqual(r.refusals[0].holder, 'E');
});

test('BAR 2 — the NAMED-PATH form is refused identically; better manners, same capture', () => {
  const { repo, data, git } = realRepo();
  git('add', 'consonance/ui/chain-indicator.js');
  const staged = G.stagedPaths(repo);
  const r = G.check({ repo, dataDir: data, paths: staged });
  assert.strictEqual(r.verdict, 'REFUSE',
    'this is the form the chair would reach for next, believing it safe');
  assert.strictEqual(r.refusals[0].holder, 'E');
});

// ── failing closed, and the one place it must not ─────────────────────────────────────────

test('a dispatched lap with no parseable packet REFUSES everything', () => {
  const { repo, data } = fixture({ packet: false });
  const r = G.check({ repo, dataDir: data, paths: ['consonance/ui/chain-indicator.js'] });
  assert.strictEqual(r.verdict, 'REFUSE');
  assert.match(r.reason, /failing closed/);
  assert.strictEqual(r.refusals[0].holder, null, 'an underivable holder is named as underivable');
});

test('an unreadable lap.jsonl fails closed rather than waving the commit through', () => {
  const { repo } = fixture();
  const r = G.check({ repo, dataDir: path.join(repo, 'nope'), paths: ['anything.js'] });
  assert.strictEqual(r.verdict, 'REFUSE');
  assert.match(r.reason, /failing closed/);
});

test('with no lap dispatched the gate is inactive and says so', () => {
  const { repo, data } = fixture({ dispatched: false });
  const r = G.check({ repo, dataDir: data, paths: ['consonance/ui/chain-indicator.js'] });
  assert.strictEqual(r.verdict, 'ALLOW');
  assert.match(r.reason, /nothing is in flight/);
});

test("a packet from ANOTHER lap holds nothing in this one", () => {
  const { repo, data } = fixture({ lap: 'L033' });
  // the packet says L033; the ledger has moved on to L034
  fs.writeFileSync(path.join(data, 'lap.jsonl'),
    JSON.stringify({ lap: 'L034', stage: 'chain', chain: 'dispatched', at: DISPATCH_AT }) + '\n');
  const r = G.check({ repo, dataDir: data, paths: ['consonance/ui/chain-indicator.js'] });
  assert.strictEqual(r.verdict, 'REFUSE', 'no L034 packet parses, so it fails closed');
  assert.match(r.reason, /no packet naming it/);
});

// ── the parser, against the shape the room actually writes ────────────────────────────────

test('parsePacket reads a REAL packet: addressee, owned paths, hand-back', () => {
  const p = path.join(REPO, 'exo_memory', 'loop', 'packet_map_resolver_2026-09-02.md');
  const parsed = G.parsePacket(fs.readFileSync(p, 'utf8'));
  assert.strictEqual(parsed.letter, 'A', 'addressed "To ALPHA"');
  assert.ok(parsed.owned.includes('consonance/src-tauri/src/main.rs'),
    `owned block not read: ${JSON.stringify(parsed.owned)}`);
  assert.ok(parsed.owned.includes('exo_memory/map/A.md'));
  assert.strictEqual(parsed.handback, 'exo_memory/handback/p-map-resolver_2026-09-02.md');
});

test('a trailing slash owns the directory; a bare name owns only itself', () => {
  assert.ok(G.ownsPath(['consonance/hooks/'], 'consonance/hooks/dream-watch.js'));
  assert.ok(!G.ownsPath(['consonance/hooks/'], 'consonance/tools/dream-watch.js'));
  assert.ok(G.ownsPath(['a/b.js'], 'a/b.js'));
  assert.ok(!G.ownsPath(['a/b.js'], 'a/b.js.bak'), 'prefix matching on a file would over-refuse');
});

// A REAL DEFECT IN A REAL PACKET, not a hypothetical: the L033 watcher-liveness packet claims
// `src/bin/harvest_replay.rs`, relative to consonance/src-tauri/, while every staged path is
// relative to the repo root. Exact matching alone hands that file over.
test('a packet path written relative to a subdirectory still matches the staged path', () => {
  assert.ok(G.ownsPath(['src/bin/harvest_replay.rs'],
    'consonance/src-tauri/src/bin/harvest_replay.rs'),
  'the packets do not all write repo-relative paths, and the gate does not get to blame them');
});

test('a live packet that claims NO paths fails closed and names itself', () => {
  const { repo, data } = fixture();
  // the shape three of tonight's real packets have: no WHAT YOU OWN block at all
  fs.writeFileSync(path.join(repo, 'exo_memory', 'loop', 'packet_silent_2026-09-02.md'),
    '# P-SILENT — L033.\n\n**To BRAVO.**\n\nHand back to `exo_memory/handback/p-silent_2026-09-02.md`.\n');
  const r = G.check({ repo, dataDir: data, paths: ['consonance/tools/anything.js'] });
  assert.strictEqual(r.verdict, 'REFUSE');
  assert.match(r.reason, /claim no paths/);
  assert.match(r.reason, /packet_silent/, 'the refusal has to name the packet to be fixable');
});

// ── THE INCIDENT ITSELF, replayed against the REAL packets ────────────────────────────────
//
// Real ownership data from the live checkout's own L033 packets; only the CLOCK is synthetic,
// because the hand-backs that have since been filed would (correctly) release these files now.
// This is the closest thing to a measurement of "would the gate have stopped e6215a8" that can be
// taken without a time machine, and it is the number that decides whether the tool earns its file.
test("REPLAY — e6215a8's four captured paths, against tonight's real packets", () => {
  const root = tmp('replay');
  const data = path.join(root, 'data');
  fs.mkdirSync(data, { recursive: true });
  // dispatched, clock set to the 06:52:19 dispatch, so no later hand-back exists yet
  fs.writeFileSync(path.join(data, 'lap.jsonl'),
    JSON.stringify({ lap: 'L033', stage: 'chain', chain: 'dispatched', at: Date.now() + 3600e3 }) + '\n');

  const captured = [
    'consonance/src-tauri/src/main.rs',
    'consonance/ui/chain-indicator.js',
    'consonance/ui/chain-indicator.test.js',
    'exo_memory/map/A.md',
  ];
  const r = G.check({ repo: REPO, dataDir: data, paths: captured });
  assert.strictEqual(r.verdict, 'REFUSE', 'the gate must stop the commit that started this packet');
  assert.deepStrictEqual(r.refusals.map((f) => f.path).sort(), captured.slice().sort(),
    'ALL FOUR captured paths must be named, not just the ones that are easy to derive');
  const holders = new Set(r.refusals.map((f) => f.holder));
  assert.ok(holders.has('A') && holders.has('E'), `holders named: ${[...holders].join(',')}`);
});

// The gate's own liveness. This asserts the FUNCTION, not the repo's state — the repo is
// deliberately unarmed and a test that demanded otherwise would go red on every fresh clone.
test('armed() reports NOT ARMED when no pre-commit hook runs the gate', () => {
  const root = tmp('armed');
  const repo = path.join(root, 'repo');
  fs.mkdirSync(path.join(repo, '.git', 'hooks'), { recursive: true });
  assert.strictEqual(G.armed(repo).armed, false, 'no hook at all');

  fs.writeFileSync(path.join(repo, '.git', 'hooks', 'pre-commit'), '#!/bin/sh\nexit 0\n');
  const a = G.armed(repo);
  assert.strictEqual(a.armed, false, 'a pre-commit hook that does not run the gate is not the gate');
  assert.match(a.why, /does not run commit-gate/);

  fs.writeFileSync(path.join(repo, '.git', 'hooks', 'pre-commit'),
    '#!/bin/sh\nexec node "$root/consonance/tools/commit-gate.js" --staged\n');
  assert.strictEqual(G.armed(repo).armed, true);
});

// The hook the installation actually points at has to exist and has to call the tool. A versioned
// hook file that drifted from the tool's name would arm nothing and say nothing.
test('the shipped githooks/pre-commit runs commit-gate.js', () => {
  const body = fs.readFileSync(path.join(REPO, 'consonance', 'githooks', 'pre-commit'), 'utf8');
  assert.match(body, /commit-gate\.js/);
  assert.match(body, /^#!/, 'a hook without a shebang is a hook git will not run');
});

// ── the data dir is RESOLVED, and unresolved refuses rather than guessing ──────────────────
//
// This file shipped with `C:/Consonance/data` as the default and portable-paths caught it. The
// bug was not cosmetic: on a second machine the gate would read no ledger, find no open lap, and
// ALLOW EVERY COMMIT while printing green.
test('the tool carries no hardcoded machine path', () => {
  const src = fs.readFileSync(path.join(__dirname, 'commit-gate.js'), 'utf8');
  const code = src.split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  assert.ok(!/[A-Za-z]:[\/]Consonance/.test(code),
    'a drive-letter path in the gate resolves to one machine and waves commits through on every other');
});

test('an unresolvable data dir REFUSES; it does not fall back to a guess', () => {
  const env = { ...process.env };
  delete env.CONSONANCE_DATA;
  env.HOME = tmp('nohome');
  env.USERPROFILE = env.HOME;          // os.homedir() reads USERPROFILE on Windows
  // execFileSync THROWS on a non-zero exit, and a non-zero exit is exactly what this asserts:
  // refusing has to cost the commit. So the throw is the pass condition, read off e.status.
  let out = null;
  let status = 0;
  try {
    out = execFileSync(process.execPath,
      [path.join(__dirname, 'commit-gate.js'), '--repo', REPO, '--paths', 'some/file.js'],
      { env, encoding: 'utf8', cwd: REPO });
  } catch (e) { out = e.stdout; status = e.status; }
  assert.strictEqual(status, 1, 'an unresolved data dir must fail the commit, not warn about it');
  assert.match(out, /REFUSED — the data dir could not be resolved/,
    'degrade loudly means degrade to refuse, not to a default that reads as green');
});

// ── THE ANCHOR (2026-09-04, landing L's proof from p-live-red_2026-09-03.md §2b) ────────────────
//
// RED FOR 27 HOURS AND THEN FOR TWO MORE LAPS. `e8ee98d` prepended a PARKED notice to
// `exo_memory/loop/packet_watcher_liveness_2026-09-02.md` that QUOTES the phrase `WHAT YOU OWN`
// inside a blockquote at line 12. `findIndex` takes the FIRST match; line 13 starts with `>`,
// which is column zero, so the block ended before it began. The real block is at line 118. Owned
// paths parsed to zero, the gate hit its own "a live packet that claims no paths is a parse
// failure" branch, and REFUSED EVERY PATH IN THE LAP with holder `null`.
//
// L bisected it, proved the one-line repair in a worktree with a control, and correctly did not
// apply it because `commit-gate.js` was not L's file. The worktree is gone (`git worktree list`
// shows only the main checkout), so the proof did not survive the seat that made it — which is the
// answer to why a one-line fix with a named owner sat unlanded for two laps.
//
// VERIFIED AGAINST CURRENT HEAD BEFORE LANDING, because a two-lap-old fix is a claim about a tree
// that has moved:
//
//     grep -h "WHAT YOU OWN" exo_memory/loop/packet_*.md              -> 18 occurrences
//     grep -hE "^#+.*WHAT YOU OWN" exo_memory/loop/packet_*.md        -> 17
//     the one that does not match: the blockquote at watcher_liveness:12
//
// Perfect discrimination on the live corpus: every real ownership block is a `## N · WHAT YOU OWN`
// heading, and the only non-heading occurrence is the one that must be skipped.

test('ANCHOR: a packet that QUOTES the phrase before its real block still parses the real block', () => {
  // The failure, reduced to its shape. Written and run RED before the anchor existed.
  const text = [
    '# Packet L999',
    '',
    '> **A PARKED packet still holds its `WHAT YOU OWN` claim**, so it blocked the landing of',
    '> anyone else\'s work.',
    '',
    'Some prose.',
    '',
    '## 7 · WHAT YOU OWN',
    '',
    '    consonance/tools/commit-gate.js',
    '    consonance/tools/commit-gate.test.js',
    '',
    'exo_memory/handback/p-fake_2026-09-04.md',
  ].join('\n');
  const p = G.parsePacket(text);
  assert.deepStrictEqual(p.owned, ['consonance/tools/commit-gate.js', 'consonance/tools/commit-gate.test.js'],
    'the first MENTION of the phrase is not the block; the first HEADING is');
});

test('ANCHOR: the real packet that caused the outage parses its 7 owned paths', () => {
  // Not a model of the break — the file itself, at HEAD. `e8ee98d` is still in the tree.
  const f = path.join(REPO, 'exo_memory', 'loop', 'packet_watcher_liveness_2026-09-02.md');
  const p = G.parsePacket(fs.readFileSync(f, 'utf8'));
  assert.ok(p.owned.length > 0,
    'this exact file parsed to ZERO owned paths for 27 hours and refused an entire lap');
  assert.ok(p.owned.some((o) => o.includes('harvest_replay')),
    `the real block at :118 must be the one read; got ${JSON.stringify(p.owned)}`);
});

test('ANCHOR: a quote AFTER the block does not truncate it either', () => {
  const text = [
    '## 3 · WHAT YOU OWN',
    '',
    '    consonance/tools/js-suite.js',
    '',
    '> a later note mentioning WHAT YOU OWN in passing',
  ].join('\n');
  assert.deepStrictEqual(G.parsePacket(text).owned, ['consonance/tools/js-suite.js']);
});

test('ANCHOR: with two real headings the FIRST block wins, not the last', () => {
  /* THIS TEST EXISTS BECAUSE THE ONE ABOVE WAS VACUOUS. Mutation SURVIVED "take the LAST match
   * instead of the first" — the cheaper repair L's fix rules out — and the test written to catch it
   * could not, because its later mention is a BLOCKQUOTE and a blockquote is not a heading, so
   * first and last match are the same line under the anchored regex. A control that cannot fail is
   * not a control. The later mention has to be a heading for the two readings to differ at all. */
  const text = [
    '## 3 · WHAT YOU OWN',
    '',
    '    consonance/tools/commit-gate.js',
    '',
    '## 9 · WHAT YOU OWN (addendum, restated)',
    '',
    '    exo_memory/loop/somewhere-else.md',
  ].join('\n');
  assert.deepStrictEqual(G.parsePacket(text).owned, ['consonance/tools/commit-gate.js'],
    'first-match is the shipped reading and a restated section must not replace the real one');
});

test('ANCHOR: a heading QUOTED inside a blockquote is still not the block', () => {
  /* The second survivor: dropping the `^` from the heading anchor. The originally observed quote
   * carried no `#`, so every test above still passed without the column-zero requirement — but a
   * PARKED notice that quotes the packet's own SECTION HEADING (`> ## 7 · WHAT YOU OWN`) is the
   * realistic form, and it reintroduces the outage exactly. The `^` is load-bearing and now says so. */
  const text = [
    '> **PARKED.** The section it claims reads:',
    '> ## 7 · WHAT YOU OWN',
    '>     consonance/tools/NOT-THIS-ONE.js',
    '',
    '## 7 · WHAT YOU OWN',
    '',
    '    consonance/tools/commit-gate.js',
  ].join('\n');
  assert.deepStrictEqual(G.parsePacket(text).owned, ['consonance/tools/commit-gate.js']);
});

// ── THE DIAGNOSTIC, and why it is not scope creep ───────────────────────────────────────────────
//
// The anchor makes the parser STRICTER. A packet whose ownership block is not a markdown heading —
// `**WHAT YOU OWN**`, say — now lands in the same fail-closed branch, with the same message L had
// to bisect 27 hours to decode: "live packet(s) claim no paths". A stricter parser with an
// undiagnostic failure is how this recurs under a different trigger. The refusal now says WHICH of
// the two happened, which turns the bisect into a sentence.

test('DIAGNOSTIC: "no heading found" and "heading found, block empty" are different refusals', () => {
  const noHeading = G.parsePacket([
    '# Packet L999',
    '**WHAT YOU OWN**',
    '',
    '    consonance/tools/js-suite.js',
  ].join('\n'));
  assert.strictEqual(noHeading.owned.length, 0, 'the anchor requires a heading; this is the cost of it');
  assert.match(String(noHeading.why || ''), /heading/i,
    'a packet that mentions the phrase but never as a heading must SAY so');
  assert.ok(/1/.test(String(noHeading.why || '')), 'and say how many times it was mentioned');

  const emptyBlock = G.parsePacket(['## 4 · WHAT YOU OWN', '', 'not indented, so not a path'].join('\n'));
  assert.strictEqual(emptyBlock.owned.length, 0);
  assert.match(String(emptyBlock.why || ''), /empty|no path/i,
    'a heading with nothing under it is a different failure from no heading at all');
  assert.notStrictEqual(emptyBlock.why, noHeading.why, 'two causes must not produce one message');

  const fine = G.parsePacket(['## 4 · WHAT YOU OWN', '', '    a/b.js'].join('\n'));
  assert.strictEqual(fine.why, null, 'a packet that parsed carries no complaint');
});

test('DIAGNOSTIC: the fail-closed refusal carries the parse cause, not just the packet name', () => {
  const root = tmp('diag');
  const data = path.join(root, 'data');
  const repo = path.join(root, 'repo');
  fs.mkdirSync(data, { recursive: true });
  fs.mkdirSync(path.join(repo, 'exo_memory', 'loop'), { recursive: true });
  fs.writeFileSync(path.join(data, 'lap.jsonl'),
    JSON.stringify({ lap: 'L999', stage: 'chain', chain: 'dispatched', at: Date.now() }) + '\n');
  fs.writeFileSync(path.join(repo, 'exo_memory', 'loop', 'packet_broken_2026-09-04.md'),
    ['# L999', '**WHAT YOU OWN**', '', '    a/b.js'].join('\n'));

  const r = G.check({ repo, dataDir: data, paths: ['a/b.js'] });
  assert.strictEqual(r.verdict, 'REFUSE');
  assert.match(r.reason, /packet_broken_2026-09-04\.md/, 'the packet is still named');
  assert.match(r.reason, /heading/i,
    'and the CAUSE rides with it — otherwise the next seat bisects for 27 hours as L did');
});
