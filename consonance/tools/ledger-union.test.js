// ledger-union.test.js — node --test consonance/tools/ledger-union.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync, spawn } = require('child_process');
const { canon, parseJsonl, union } = require('./ledger-union.js');

const TOOL = path.join(__dirname, 'ledger-union.js');
const J = (...rows) => rows.map((r) => JSON.stringify(r)).join('\n') + '\n';

/* THE STATE PIN (L072). The union now reads the STATE SET's copy too, resolved like state-sync.js (CONSONANCE_STATE,
 * then ~/.consonance.json state_dir). Unpinned, every fixture here would read this machine's REAL state set — L's
 * config declares one — and count its rows. An empty temp dir is a state set holding nothing. No assertion changed. */
process.env.CONSONANCE_STATE = fs.mkdtempSync(path.join(os.tmpdir(), 'lu-emptystate-'));

test('the key is the WHOLE row: field order does not decide identity', () => {
  assert.strictEqual(canon({ lap: 'L1', at: 5, stage: 'open' }), canon({ stage: 'open', at: 5, lap: 'L1' }));
});

test('NO RENAMING: two generations of one lap id with the same stage and time stay TWO rows', () => {
  // the narrow key (lap, stage, at) would collapse these; the whole row must not
  const a = { lap: 'L058', stage: 'open', at: 100, inquiry: 'the 09-14 lap' };
  const b = { lap: 'L058', stage: 'open', at: 100, inquiry: 'the 09-20 lap' };
  const u = union([{ tag: 'LIVE', live: true, text: J(a) }, { tag: 'attic', text: J(b) }], 'at');
  assert.strictEqual(u.rows.length, 2, 'two different laps sharing an id were collapsed into one');
  assert.strictEqual(u.narrowDistinct, 1, 'fixture: the narrow key must see them as one, or this proves nothing');
});

test('a row only an attic copy holds is a row TO ADD; a row both hold is kept once and is not added', () => {
  const shared = { lap: 'L1', stage: 'open', at: 1 };
  const lost = { lap: 'L2', stage: 'open', at: 2 };
  const u = union([{ tag: 'LIVE', live: true, text: J(shared) }, { tag: 'attic', text: J(shared, lost) }], 'at');
  assert.deepStrictEqual(u.added.map((r) => r.obj.lap), ['L2']);
  assert.strictEqual(u.rows.length, 2);
  assert.strictEqual(u.crossSourceDup, 1, 'the shared row must be counted as held by two sources');
});

test('the positive control: identical sources add nothing — the count can be zero', () => {
  const t = J({ lap: 'L1', stage: 'open', at: 1 }, { lap: 'L1', stage: 'map', at: 2 });
  const u = union([{ tag: 'LIVE', live: true, text: t }, { tag: 'attic', text: t }], 'at');
  assert.strictEqual(u.added.length, 0);
});

test('an unparseable line is reported by line number and is never counted as a row', () => {
  const p = parseJsonl('{"lap":"L1","at":1}\n{"lap":"L2",\n{"lap":"L3","at":3}\n');
  assert.strictEqual(p.rows.length, 2);
  assert.deepStrictEqual(p.invalid.map((x) => x.line), [2]);
});

test('an unparseable line the LIVE file also holds is not news; one ONLY an attic copy holds is counted', () => {
  // The only invalid lines that matter to a union are those whose rows the live file cannot already have.
  const fused = '{"a":1}{"b":2}';
  const u = union([
    { tag: 'LIVE', live: true, text: `${fused}\n{"at":1}\n` },
    { tag: 'attic', text: `${fused}\n{"at":1}\n{"c":3}{"d":4}\n` },
  ], 'at');
  const attic = u.perSource.find((s) => s.tag === 'attic');
  assert.strictEqual(attic.invalid.length, 2, 'fixture: the attic copy has two unparseable lines');
  assert.strictEqual(attic.invalidNotInLive, 1, 'only the line the live file lacks is a line whose rows are missing');
  assert.strictEqual(u.invalidNotInLive, 1);
});

test('the proposed union is ordered by time, and rows with no time go LAST', () => {
  const u = union([{ tag: 'LIVE', live: true, text: J({ n: 'late', at: 30 }, { n: 'none' }, { n: 'early', at: 10 }) }], 'at');
  assert.deepStrictEqual(u.rows.map((r) => r.obj.n), ['early', 'late', 'none']);
  assert.strictEqual(u.noTime, 1);
});

// L071 replaced "the CLI has no --write" (L070): the write is now the authorised step. What stays refused is a write that
// did not name its ONE file — both live files are never rewritten by accident.
test('the CLI --write refuses without an explicit single --file', () => {
  const r = spawnSync(process.execPath, [TOOL, '--data', os.tmpdir(), '--write'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 2);
  assert.match(r.stderr, /--write needs --file lap\|board/);
  const both = spawnSync(process.execPath, [TOOL, '--data', os.tmpdir(), '--write', '--file', 'both'], { encoding: 'utf8' });
  assert.strictEqual(both.status, 2);
});

test('the CLI refuses an --out inside the data dir, and writes nothing there', () => {
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'lu-data-'));
  fs.writeFileSync(path.join(data, 'lap.jsonl'), J({ lap: 'L1', at: 1 }));
  const before = fs.readdirSync(data).sort();
  const r = spawnSync(process.execPath, [TOOL, '--data', data, '--out', path.join(data, 'x'), '--file', 'lap'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 2);
  assert.match(r.stderr, /refusing --out inside the data dir/);
  assert.deepStrictEqual(fs.readdirSync(data).sort(), before, 'something was written into the data dir');
});

test('a dry run end to end leaves the live file and every attic copy byte-identical', () => {
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'lu-e2e-'));
  const live = path.join(data, 'lap.jsonl');
  const atticDir = path.join(data, 'attic', 'pre-sync-2026-01-01T00-00-00-000Z');
  fs.mkdirSync(atticDir, { recursive: true });
  const atticFile = path.join(atticDir, 'lap.jsonl');
  fs.writeFileSync(live, J({ lap: 'L1', at: 1 }));
  fs.writeFileSync(atticFile, J({ lap: 'L1', at: 1 }, { lap: 'L2', at: 2 }));
  const b1 = fs.readFileSync(live), b2 = fs.readFileSync(atticFile);
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'lu-out-'));
  const r = spawnSync(process.execPath, [TOOL, '--data', data, '--out', out, '--file', 'lap'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 0, r.stderr);
  assert.match(r.stdout, /ROWS TO ADD to live\s+1/);
  assert.ok(fs.readFileSync(live).equals(b1), 'the live file changed during a dry run');
  assert.ok(fs.readFileSync(atticFile).equals(b2), 'an attic copy changed during a dry run');
});

// ------------------------------------------------------------------ THE WRITE (L071)
// Both live files are appended to while this runs: the app opens board.jsonl per write (main.rs:2127), lap-row.js
// appends lap.jsonl. Each test below puts a writer at one phase of the swap and requires its row in the result.
const { writeUnion } = require('./ledger-union.js');

function writeFixture(liveRows, atticRows, extraLive = '') {
  const data = fs.mkdtempSync(path.join(os.tmpdir(), 'lu-w-'));
  fs.writeFileSync(path.join(data, 'lap.jsonl'), J(...liveRows) + extraLive);
  const atticDir = path.join(data, 'attic', 'pre-sync-2026-01-01T00-00-00-000Z');
  fs.mkdirSync(atticDir, { recursive: true });
  fs.writeFileSync(path.join(atticDir, 'lap.jsonl'), J(...atticRows));
  return { data, live: path.join(data, 'lap.jsonl'), attic: path.join(atticDir, 'lap.jsonl') };
}
const lines = (p) => fs.readFileSync(p, 'utf8').split('\n').filter(Boolean);
const W = (fx, hooks) => writeUnion({ dataDir: fx.data, name: 'lap.jsonl', time: 'at', hooks, settleMs: 20,
  now: () => new Date('2026-09-22T08:00:00.000Z') });

test('WRITE: the live file stays verbatim and in its own order; attic-only rows are interleaved by time', () => {
  const fx = writeFixture([{ n: 'a', at: 10 }, { n: 'c', at: 30 }], [{ n: 'a', at: 10 }, { n: 'b', at: 20 }, { n: 'd', at: 40 }]);
  const r = W(fx);
  assert.deepStrictEqual(lines(fx.live).map((l) => JSON.parse(l).n), ['a', 'b', 'c', 'd']);
  assert.strictEqual(r.added, 2);
  assert.strictEqual(r.verified, true);
});

test('WRITE: the original is kept byte-for-byte BESIDE the live file, and the attic copy is untouched', () => {
  const fx = writeFixture([{ n: 'a', at: 10 }], [{ n: 'b', at: 20 }]);
  const orig = fs.readFileSync(fx.live), atticBefore = fs.readFileSync(fx.attic);
  const r = W(fx);
  assert.strictEqual(path.dirname(r.backup), fx.data);
  assert.ok(fs.readFileSync(r.backup).equals(orig), 'the backup is not the original');
  assert.ok(fs.readFileSync(fx.attic).equals(atticBefore), 'an attic copy changed');
});

test('WRITE: an unparseable (fused) line is kept verbatim, in place — never dropped', () => {
  const fused = '{"n":"x","at":15}{"n":"y","at":16}';
  const fx = writeFixture([{ n: 'a', at: 10 }], [{ n: 'b', at: 20 }], `${fused}\n`);
  W(fx);
  const got = lines(fx.live);
  assert.ok(got.includes(fused), 'the fused line was lost');
  assert.strictEqual(got.indexOf(fused), 1, 'the fused line moved out of its place after "a"');
});

test('WRITE: NO RENAMING — two generations of one id are both written', () => {
  const fx = writeFixture([{ lap: 'L058', stage: 'open', at: 100, inquiry: '09-21' }], [{ lap: 'L058', stage: 'open', at: 50, inquiry: '09-14' }]);
  W(fx);
  assert.deepStrictEqual(lines(fx.live).map((l) => JSON.parse(l).inquiry), ['09-14', '09-21']);
});

for (const [phase, label] of [
  ['afterRead', 'after the live file was read'],
  ['afterTmp', 'after the union was written to the temp file (the catch-up)'],
]) {
  test(`WRITE: a row appended ${label} is in the result`, () => {
    const fx = writeFixture([{ n: 'a', at: 10 }], [{ n: 'b', at: 20 }]);
    W(fx, { [phase]: () => fs.appendFileSync(fx.live, JSON.stringify({ n: 'late', at: 99 }) + '\n') });
    assert.ok(lines(fx.live).some((l) => JSON.parse(l).n === 'late'), 'the concurrent row was lost');
  });
}

test('WRITE: the new file never goes BACKWARDS — at the instant it appears it already holds every row written before the freeze', () => {
  // Without the catch-up those rows would still arrive (the reconcile recovers them from the frozen original), but only
  // after the settle: for that window a reader would see a board missing its newest rows. L071 mutant 1 survived
  // every other test on exactly that difference.
  const fx = writeFixture([{ n: 'a', at: 10 }], [{ n: 'b', at: 20 }]);
  let atLink = null;
  W(fx, {
    afterTmp: () => fs.appendFileSync(fx.live, JSON.stringify({ n: 'before-freeze', at: 99 }) + '\n'),
    afterLink: () => { atLink = lines(fx.live).map((l) => JSON.parse(l).n); },
  });
  assert.ok(atLink.includes('before-freeze'), 'the placed file lacked a row written before the freeze');
});

test('WRITE: a writer that RE-CREATES the live path between freeze and swap loses nothing (the gap)', () => {
  const fx = writeFixture([{ n: 'a', at: 10 }], [{ n: 'b', at: 20 }]);
  const r = W(fx, { afterFreeze: () => fs.appendFileSync(fx.live, JSON.stringify({ n: 'gap', at: 99 }) + '\n') });
  assert.ok(lines(fx.live).some((l) => JSON.parse(l).n === 'gap'), 'the row written into the re-created file was lost');
  assert.strictEqual(r.gaps.length, 1);
});

test('WRITE: a write still in flight into the FROZEN original after the swap is reconciled in', () => {
  const fx = writeFixture([{ n: 'a', at: 10 }], [{ n: 'b', at: 20 }]);
  let backup;
  W(fx, { afterLink: (ctx) => { backup = ctx.backup; fs.appendFileSync(ctx.backup, JSON.stringify({ n: 'inflight', at: 99 }) + '\n'); } });
  assert.ok(lines(fx.live).some((l) => JSON.parse(l).n === 'inflight'), 'the row landing in the frozen file was lost');
  assert.ok(backup && fs.existsSync(backup));
});

test('WRITE: a PARTIAL last line at read time (a writer mid-line) comes through once, intact', () => {
  const fx = writeFixture([{ n: 'a', at: 10 }], [{ n: 'b', at: 20 }], '{"n":"half"');
  W(fx, { afterRead: () => fs.appendFileSync(fx.live, ',"at":99}\n') });
  const got = lines(fx.live).filter((l) => l.includes('half'));
  assert.deepStrictEqual(got, ['{"n":"half","at":99}']);
});

test('WRITE: a writer that DIED mid-line leaves bytes that are carried as a line, never dropped', () => {
  const fx = writeFixture([{ n: 'a', at: 10 }], [{ n: 'b', at: 20 }], '{"n":"dead');
  const r = W(fx);
  assert.ok(lines(fx.live).includes('{"n":"dead'), 'the dead writer\'s bytes were dropped');
  assert.strictEqual(r.partialCarried, 1);
});

test('WRITE: the verification can FAIL — a line lost after the swap is reported, not certified', () => {
  const fx = writeFixture([{ n: 'a', at: 10 }, { n: 'c', at: 30 }], [{ n: 'b', at: 20 }]);
  const r = W(fx, { afterLink: () => fs.writeFileSync(fx.live, JSON.stringify({ n: 'a', at: 10 }) + '\n') });
  assert.strictEqual(r.verified, false);
  assert.ok(r.missingLines > 0 && r.missingRows > 0);
});

test('WRITE: refuses when the backup name is already taken — it never overwrites a record', () => {
  const fx = writeFixture([{ n: 'a', at: 10 }], [{ n: 'b', at: 20 }]);
  W(fx);
  const before = fs.readFileSync(fx.live);
  assert.throws(() => W(fx), /already exists/);
  assert.ok(fs.readFileSync(fx.live).equals(before), 'a refused write changed the live file');
});

test('WRITE: a second write (new stamp) adds nothing — the union is already in', () => {
  const fx = writeFixture([{ n: 'a', at: 10 }], [{ n: 'b', at: 20 }]);
  W(fx);
  const r2 = writeUnion({ dataDir: fx.data, name: 'lap.jsonl', time: 'at', settleMs: 20, now: () => new Date('2026-09-22T09:00:00.000Z') });
  assert.strictEqual(r2.added, 0);
});

// ------------------------------------------------------------------ THE STATE SET AS A SOURCE (L072)
// Under L070's stop-before-write, a launch that meets a DIVERGED ledger refuses and writes nothing — so on the other
// machine no attic copy of this machine's rows ever exists. The only copy is the state set's (<state>/data/<file>).
function stateWorld({ live, state, attic = null }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lu-st-'));
  const data = path.join(root, 'data'), stateDir = path.join(root, 'state');
  fs.mkdirSync(data, { recursive: true });
  fs.mkdirSync(path.join(stateDir, 'data'), { recursive: true });
  fs.writeFileSync(path.join(data, 'lap.jsonl'), J(...live));
  if (state) fs.writeFileSync(path.join(stateDir, 'data', 'lap.jsonl'), J(...state));
  if (attic) {
    const a = path.join(data, 'attic', 'pre-sync-2026-01-01T00-00-00-000Z');
    fs.mkdirSync(a, { recursive: true });
    fs.writeFileSync(path.join(a, 'lap.jsonl'), J(...attic));
  }
  return { root, data, stateDir, live: path.join(data, 'lap.jsonl') };
}
/** Every file under a dir, with its bytes' sha — to prove nothing was written there. */
function treeHash(dir) {
  const out = [];
  for (const rel of fs.readdirSync(dir, { recursive: true }).sort()) {
    const p = path.join(dir, rel);
    out.push(fs.statSync(p).isFile() ? `${rel}:${require('crypto').createHash('sha256').update(fs.readFileSync(p)).digest('hex')}` : rel);
  }
  return out.join('\n');
}
const cliIn = (w, args, extraEnv = {}) => spawnSync(process.execPath, [TOOL, '--data', w.data, ...args],
  { encoding: 'utf8', env: { ...process.env, CONSONANCE_STATE: w.stateDir, ...extraEnv } });

test('STATE: a refused-install world — the other machine\'s rows exist ONLY in the state set, and the union includes them', () => {
  // L's live ledger; D's rows only in the state set (no attic copy: the install refused and wrote nothing).
  const w = stateWorld({ live: [{ lap: 'L001', at: 1 }], state: [{ lap: 'L001', at: 1 }, { lap: 'D090', at: 2 }, { lap: 'D091', at: 3 }] });
  const r = writeUnion({ dataDir: w.data, name: 'lap.jsonl', time: 'at', stateDir: w.stateDir, settleMs: 10, now: () => new Date('2026-09-22T09:00:00.000Z') });
  assert.strictEqual(r.added, 2);
  assert.deepStrictEqual(lines(w.live).map((l) => JSON.parse(l).lap), ['L001', 'D090', 'D091']);
});

test('STATE: the key is still the WHOLE row — a state row equal to a live row (fields reordered) is not added twice', () => {
  const w = stateWorld({ live: [{ lap: 'L001', stage: 'open', at: 1 }], state: [{ at: 1, stage: 'open', lap: 'L001' }] });
  const u = union([
    { tag: 'LIVE', live: true, text: fs.readFileSync(w.live, 'utf8') },
    { tag: 'STATE', text: fs.readFileSync(path.join(w.stateDir, 'data', 'lap.jsonl'), 'utf8') },
  ], 'at');
  assert.strictEqual(u.added.length, 0);
  const r = cliIn(w, ['--file', 'lap']);
  assert.match(r.stdout, /ROWS TO ADD to live\s+0/);
});

test('STATE: NOTHING is written into the state dir — neither by the dry run nor by the write', () => {
  const w = stateWorld({ live: [{ lap: 'L001', at: 1 }], state: [{ lap: 'D090', at: 2 }], attic: [{ lap: 'L000', at: 0 }] });
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'lu-st-out-'));
  const before = treeHash(w.stateDir);
  const dry = cliIn(w, ['--out', out, '--file', 'lap']);
  assert.strictEqual(dry.status, 0, dry.stderr);
  assert.strictEqual(treeHash(w.stateDir), before, 'the dry run wrote into the state dir');
  const wr = cliIn(w, ['--write', '--file', 'lap']);
  assert.strictEqual(wr.status, 0, wr.stderr);
  assert.strictEqual(treeHash(w.stateDir), before, 'the write wrote into the state dir');
  assert.deepStrictEqual(lines(w.live).map((l) => JSON.parse(l).lap), ['L000', 'L001', 'D090']);
});

test('STATE: the dry run NAMES the state source and its row count', () => {
  const w = stateWorld({ live: [{ lap: 'L001', at: 1 }], state: [{ lap: 'D090', at: 2 }, { lap: 'D091', at: 3 }, { lap: 'L001', at: 1 }] });
  const r = cliIn(w, ['--file', 'lap']);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.ok(r.stdout.includes(path.join(w.stateDir, 'data', 'lap.jsonl')), 'the state source path is not named');
  assert.match(r.stdout, /state set copy .*\b3 rows\b.*\b2 not in live\b/);
});

test('STATE: an UNDECLARED state dir refuses loudly (exit 2) — for the dry run and for the write — and writes nothing', () => {
  const w = stateWorld({ live: [{ lap: 'L001', at: 1 }], state: [{ lap: 'D090', at: 2 }] });
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'lu-nohome-'));            // no ~/.consonance.json here
  const env = { CONSONANCE_STATE: '', USERPROFILE: home, HOME: home };
  const liveBefore = fs.readFileSync(w.live);
  for (const args of [['--file', 'lap'], ['--write', '--file', 'lap']]) {
    const r = cliIn(w, args, env);
    assert.strictEqual(r.status, 2, `${args.join(' ')}: ${r.stdout}${r.stderr}`);
    assert.match(r.stderr, /no state dir declared/);
  }
  assert.ok(fs.readFileSync(w.live).equals(liveBefore), 'a refused run changed the live file');
});

test('STATE: a DECLARED state dir that does not exist refuses — reading nothing there would hide the other machine\'s rows', () => {
  const w = stateWorld({ live: [{ lap: 'L001', at: 1 }], state: null });
  const r = cliIn(w, ['--file', 'lap'], { CONSONANCE_STATE: path.join(w.root, 'no-such-state') });
  assert.strictEqual(r.status, 2);
  assert.match(r.stderr, /state dir .*does not exist/);
});

test('STATE: a state set that holds no copy of THIS file is said out loud, and the run goes on', () => {
  const w = stateWorld({ live: [{ lap: 'L001', at: 1 }], state: null });   // the state dir exists; data/lap.jsonl does not
  const r = cliIn(w, ['--file', 'lap']);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.match(r.stdout, /state set copy: NONE at /);
});

test('WRITE: a REAL concurrent writer process appending throughout loses no row', { timeout: 60000 }, async () => {
  const fx = writeFixture(Array.from({ length: 200 }, (_, i) => ({ n: `l${i}`, at: i })), Array.from({ length: 50 }, (_, i) => ({ n: `a${i}`, at: 1000 + i })));
  const script = [
    "const fs = require('fs'); let i = 0; const end = Date.now() + 1500;",
    `const P = ${JSON.stringify(fx.live)};`,
    "(function tick() { if (Date.now() > end) { process.stdout.write(String(i)); return; }",
    "  fs.appendFileSync(P, JSON.stringify({ n: 'w' + i, at: 5000 + i }) + String.fromCharCode(10)); i++; setImmediate(tick); })();",
  ].join('\n');
  const writer = spawn(process.execPath, ['-e', script], { stdio: ['ignore', 'pipe', 'ignore'] });
  let written = '';
  writer.stdout.on('data', (d) => { written += d; });
  await new Promise((r) => setTimeout(r, 200));
  writeUnion({ dataDir: fx.data, name: 'lap.jsonl', time: 'at', settleMs: 400, now: () => new Date('2026-09-22T08:00:00.000Z') });
  await new Promise((r) => writer.on('exit', r));
  const n = Number(written);
  const got = new Set(lines(fx.live).map((l) => JSON.parse(l).n));
  const missing = Array.from({ length: n }, (_, i) => `w${i}`).filter((k) => !got.has(k));
  assert.ok(n > 50, `the writer barely ran (${n} rows) — the test would prove nothing`);
  assert.deepStrictEqual(missing, [], `${missing.length} of ${n} concurrent rows were lost`);
  for (let i = 0; i < 50; i++) assert.ok(got.has(`a${i}`));
});
