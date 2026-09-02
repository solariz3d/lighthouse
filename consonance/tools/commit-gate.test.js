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
