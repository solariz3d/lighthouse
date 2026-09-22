// state-sync.test.js — run with: node state-sync.test.js
//
// WHAT THIS FILE IS ACTUALLY GUARDING. The tool it tests decides whether the desktop starts on a
// whole state set or a half one, and the failure it exists to prevent is not a crash — it is a
// SET THAT PASSES ITS OWN CHECK AND ARRIVES WRONG. So the tests that matter here are the negative
// ones: a path that would not come back stable must ABORT the push; a file missing at the far end
// must be NAMED, not counted; a verified set that never reached the data dir must not read as
// installed. If those go green for the wrong reason this file is decoration.
//
// EVERY TEST RUNS AGAINST A FIXTURE — its own data dir, its own manifest, its own bare remote and
// clone. Nothing here reads C:\Consonance\data or C:\Consonance\state, and this file must pass
// identically on a machine that has neither. Same law as state-manifest.test.js and for the same
// measured reason: a suite whose universe is the one directory it was written against is green by
// construction on everything nobody thought of.
//
// THE ONE THING IT CANNOT TEST IN-PROCESS, said here rather than left as a hole: that reading a
// file does not make the APP'S OWN WRITE fail (`CopyFileW` -> EBUSY -> `let _ = fs::write` throws
// the row away). That is a two-process race and it was measured with a two-process instrument;
// the numbers are in the header of state-sync.js and in the hand-back. What this file tests is
// that the tool USES the stable read and refuses when the read will not settle.

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawn } = require('child_process');

// THE TWO SEAMS, AND THEY BELONG TO THE MUTATION HARNESS (P-HARNESS, pane A, 2026-09-15). `state-sync.mutants.js`
// writes each mutant into a COPY beside the real file and points this suite at it, so no run, killed or not, ever
// writes a tracked source (a kill on this machine runs no handler, L059 §1). Unset, nothing changes.
//
// MEASURED LOAD PATHS, because a copy only one path sees is a mutant the other path never ran:
//   state-sync.js      require(TOOL) · the spawned `node TOOL` CLI (run()) · the source text read by the
//                      "borrowed, not copied" test — all three through TOOL, so STATE_SYNC_UNDER_TEST covers them.
//   state-manifest.js  require(MANIFEST) (the classErrorsFor / VALID_ARRIVAL tests) · the spawned `node MANIFEST`
//                      CLI — both through MANIFEST, so STATE_MANIFEST_UNDER_TEST covers them —
//                      AND state-sync.js's own `require('./state-manifest.js')`, which no pointer in this file
//                      reaches (rewriting it in the state-sync copy would fail the "borrowed, not copied" text check
//                      below, a false kill). A manifest mutant witnessed ONLY through that third path reads SURVIVED,
//                      never killed; the harness says so.
// Each copy must sit in THIS directory: both tools resolve their siblings and REPO relative to themselves.
function underTest(envName, file) {
  const u = process.env[envName];
  if (!u) return path.join(__dirname, file);
  const p = path.resolve(u);
  if (path.dirname(p) !== __dirname || !fs.existsSync(p)) {
    throw new Error(`${envName} must name an existing file in ${__dirname}; got ${u}`);
  }
  return p;
}
const TOOL = underTest('STATE_SYNC_UNDER_TEST', 'state-sync.js');
const MANIFEST = underTest('STATE_MANIFEST_UNDER_TEST', 'state-manifest.js');
const M = require(TOOL);
let pass = 0, fail = 0;

function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e && e.message}`); fail++; }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'statesync-'));
let seq = 0;

const MIN_MANIFEST = {
  version: 99,
  rules: [
    { glob: 'board.jsonl', class: 'TRAVELS', why: 'the record' },
    { glob: 'letters.json', class: 'TRAVELS', why: 'naming' },
    { glob: 'captures/*.txt', class: 'TRAVELS', why: 'the warm-resume carriers' },
    { glob: 'captures', class: 'TRAVELS', why: 'holds them' },
    { glob: 'captures/*.log', class: 'STAYS', why: 'ore' },
    { glob: 'field.json', class: 'REGENERATES', why: 'a frame', regenerated_by: 'cochlea', regenerated_when: 'every frame' },
    // state-sync.js's own outputs. The live manifest rules these too; the first run of this suite
    // caught their absence here as UNPLACED, which is the checker doing exactly its job on the
    // tool that writes them.
    { glob: 'state-sync.status.json', class: 'STAYS', why: 'per-machine as-of view' },
    { glob: 'state-sync.push.json', class: 'STAYS', why: 'the receipt of THIS machine\'s last push' },
    { glob: 'sync-completion.json', class: 'STAYS', why: 'did THIS machine verify' },
    { glob: 'attic', class: 'STAYS', why: 'holds displaced bytes' },
    { glob: 'attic/pre-sync-*', class: 'STAYS', why: 'one backup per install' },
    { glob: 'attic/pre-sync-*/**', class: 'STAYS', why: 'its contents' },
  ],
  forbidden: [{ glob: 'install_id*', why: 'both machines would share an identity' }],
};

/** A whole world: data dir, manifest, a bare "remote", and a clone of it. */
function world(files, manifestOverride) {
  const dir = path.join(tmp, 'case' + (++seq));
  const data = path.join(dir, 'data');
  fs.mkdirSync(data, { recursive: true });
  for (const [rel, body] of Object.entries(files || {})) {
    const p = path.join(data, rel.split('/').join(path.sep));
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body);
  }
  const manPath = path.join(dir, 'manifest.json');
  fs.writeFileSync(manPath, JSON.stringify(manifestOverride || MIN_MANIFEST, null, 2));

  const bare = path.join(dir, 'remote.git');
  execFileSync('git', ['init', '--bare', '-q', '-b', 'main', bare]);
  const state = path.join(dir, 'state');
  execFileSync('git', ['clone', '-q', bare, state]);
  for (const [k, v] of [['user.email', 't@t'], ['user.name', 't']]) execFileSync('git', ['-C', state, 'config', k, v]);
  return { dir, data, state, bare, manPath };
}

function run(w, args, extraEnv) {
  const env = {
    ...process.env,
    CONSONANCE_DATA: w.data,
    CONSONANCE_STATE: w.state,
    STATE_MANIFEST: w.manPath,
    CONSONANCE_MACHINE: (extraEnv && extraEnv.CONSONANCE_MACHINE) || 'TESTL',
    ...(extraEnv || {}),
  };
  try {
    const out = execFileSync(process.execPath, [TOOL, ...args], { encoding: 'utf8', env, stdio: ['ignore', 'pipe', 'pipe'] });
    return { code: 0, out, err: '' };
  } catch (e) {
    return { code: e.status === undefined ? -1 : e.status, out: String(e.stdout || ''), err: String(e.stderr || '') };
  }
}

const both = (r) => r.out + r.err;

/** `git log --oneline`, or '' when the repo has no commits — which exits 1, not 0. */
function log(repo) {
  try { return execFileSync('git', ['-C', repo, 'log', '--oneline'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
  catch (_) { return ''; }
}

// ═══ the stable read — the gate the whole transport rests on ═══════════════════════════════

test('stableRead returns the bytes of a file that has been quiet, on the first attempt', () => {
  // The mtime is backdated rather than left at "now". Without that this test is a race with
  // SETTLE_MS and it FLAKED between 1 and 2 attempts on the first real run — an assertion whose
  // answer depends on how fast the machine is is not an assertion.
  const w = world({ 'board.jsonl': '{"a":1}\n' });
  const p = path.join(w.data, 'board.jsonl');
  const old = new Date(Date.now() - 10 * M.SETTLE_MS);
  fs.utimesSync(p, old, old);
  const r = M.stableRead(p);
  assert.strictEqual(r.buf.toString(), '{"a":1}\n');
  assert.strictEqual(r.attempts, 1);
});

test('a file written THIS INSTANT is not certified until it is SETTLE_MS old', () => {
  // The other half, stated rather than left implicit: the gate is not free on a fresh write, and
  // that cost is the whole mechanism. A push right after a turn pays it once per busy file.
  //
  // THE ASSERTION IS AGAINST THE FILE'S OWN MTIME, NOT AGAINST A STOPWATCH. The first version
  // measured elapsed wall-clock from a t0 taken before the call, and it FAILED ON A LOADED TREE
  // (the librarian's desk, 33/1) — because the tool sleeps only the REMAINDER of the window, so
  // any delay between stamping the file and entering stableRead comes straight off the measured
  // wait. The property that actually matters has nothing to do with how long we waited: it is
  // that the bytes were not accepted until the file had been quiet for SETTLE_MS. That is what
  // this checks, and a loaded machine can only ever make it MORE true.
  const w = world({ 'board.jsonl': 'just written\n' });
  const p = path.join(w.data, 'board.jsonl');
  const now = new Date();
  fs.utimesSync(p, now, now);
  const r = M.stableRead(p);
  assert.strictEqual(r.buf.toString(), 'just written\n');
  assert.ok(r.attempts >= 2, 'a just-written file cannot be certified on the first look: ' + r.attempts);
  const ageAtReturn = Date.now() - fs.statSync(p).mtimeMs;
  assert.ok(ageAtReturn >= M.SETTLE_MS,
    `accepted while the file was only ${Math.round(ageAtReturn)}ms old; the gate is ${M.SETTLE_MS}ms`);
});

test('stableRead returns null, never a torn buffer, for a file that will not settle', () => {
  // A "file" that changes on every stat/read: exactly what fs::write's truncate-then-write looks
  // like from outside. The requirement is not that it succeed — it is that it NEVER hand back a
  // partial answer, because a truncated capture is a valid file at the destination.
  const w = world({});
  const p = path.join(w.data, 'churn.txt');
  const realStat = fs.statSync, realRead = fs.readFileSync;
  let n = 0;
  fs.writeFileSync(p, 'x');
  fs.statSync = (q, ...rest) => {
    if (String(q) === p) { n++; return { size: n, mtimeMs: n * 1000 }; }
    return realStat(q, ...rest);
  };
  try {
    const r = M.stableRead(p, 5);
    assert.strictEqual(r.buf, null, 'a churning file must refuse, not return a prefix');
    assert.strictEqual(r.attempts, 5);
  } finally { fs.statSync = realStat; fs.readFileSync = realRead; }
});

test('stableRead names FUTURE_MTIME and stops, rather than burning every attempt on it', () => {
  // A survivor of the first mutation pass exposed this: with the future-mtime branch deleted, a
  // future file is STILL refused (a negative age is under the settle window) so nothing went red.
  // The branch's real value is that it refuses ONCE with a name instead of sleeping eight times
  // for a file no amount of waiting can age — so that is what this asserts.
  const w = world({ 'board.jsonl': 'x\n' });
  const p = path.join(w.data, 'board.jsonl');
  const soon = new Date(Date.now() + 3600 * 1000);
  fs.utimesSync(p, soon, soon);
  const t0 = Date.now();
  const r = M.stableRead(p, 8);
  assert.strictEqual(r.buf, null);
  assert.strictEqual(r.err, 'FUTURE_MTIME', 'the refusal must be NAMED: ' + r.err);
  assert.strictEqual(r.attempts, 1, 'it must stop at once, not sleep through all 8: ' + r.attempts);
  assert.ok(Date.now() - t0 < M.SETTLE_MS, 'it must not have waited at all');
});

test('stableRead refuses a same-length rewrite: mtime is compared, not just size', () => {
  // The other first-pass survivor. Deleting the mtime comparison left every test green, because
  // nothing exercised a file whose LENGTH is unchanged across the read — which is exactly what a
  // capture stitch of equal size looks like, and exactly the case the size check cannot see.
  const w = world({});
  const p = path.join(w.data, 'samelen.txt');
  fs.writeFileSync(p, 'aaaa');
  const old = new Date(Date.now() - 10 * M.SETTLE_MS);
  fs.utimesSync(p, old, old);
  const realStat = fs.statSync;
  let n = 0;
  fs.statSync = (q, ...rest) => {
    const s = realStat(q, ...rest);
    if (String(q) === p) { n++; return { ...s, size: 4, mtimeMs: old.getTime() - n }; }
    return s;
  };
  try {
    const r = M.stableRead(p, 3);
    assert.strictEqual(r.buf, null, 'same size, different mtime, must refuse');
  } finally { fs.statSync = realStat; }
});

test('stableRead refuses a SHORT read even when both reads agree with each other', () => {
  // The last first-pass survivor. Both reads returning the SAME short buffer defeats the
  // buffer-to-buffer comparison and every stat-to-stat comparison — the stats are consistent,
  // the reads are consistent, and the file is still not all there. Only comparing the BUFFER
  // against the STAT catches it, which is why that check is its own line and not folded in.
  const w = world({});
  const p = path.join(w.data, 'short.txt');
  fs.writeFileSync(p, 'the whole thing');
  const old = new Date(Date.now() - 10 * M.SETTLE_MS);
  fs.utimesSync(p, old, old);
  const realRead = fs.readFileSync;
  fs.readFileSync = (q, ...rest) => (String(q) === p ? Buffer.from('the whole') : realRead(q, ...rest));
  try {
    const r = M.stableRead(p, 3);
    assert.strictEqual(r.buf, null, 'a buffer shorter than its own stat must refuse');
  } finally { fs.readFileSync = realRead; }
});

test('stableRead refuses a file that is truncated between the two reads', () => {
  // The measured case: fs::write truncates first, so a read can come back EMPTY and agree with
  // its own stat. Only comparing two reads catches it.
  const w = world({});
  const p = path.join(w.data, 'trunc.txt');
  fs.writeFileSync(p, 'full contents here');
  const realRead = fs.readFileSync;
  let calls = 0;
  fs.readFileSync = (q, ...rest) => {
    if (String(q) === p) { calls++; return calls % 2 === 1 ? Buffer.from('full contents here') : Buffer.alloc(0); }
    return realRead(q, ...rest);
  };
  try {
    const r = M.stableRead(p, 3);
    assert.strictEqual(r.buf, null, 'two reads disagreeing must refuse');
  } finally { fs.readFileSync = realRead; }
});

test('a real second process rewriting a file cannot make stableRead hand back a torn one', () => {
  // The only end-to-end version available in-process: spawn a writer that truncate-rewrites the
  // file continuously, then read it many times and assert that EVERY accepted buffer is one of
  // the two whole contents. An accepted empty or mixed buffer fails.
  const w = world({});
  const p = path.join(w.data, 'raced.txt');
  const A = 'A'.repeat(200000), B = 'B'.repeat(200000);
  fs.writeFileSync(p, A);
  const script = `const fs=require('fs');const p=${JSON.stringify(p)};const A='A'.repeat(200000),B='B'.repeat(200000);` +
    `const end=Date.now()+2500;let n=0;while(Date.now()<end){try{fs.writeFileSync(p,n%2?A:B)}catch(e){}n++}`;
  const child = spawn(process.execPath, ['-e', script], { stdio: 'ignore' });
  const end = Date.now() + 2000;
  let accepted = 0, refused = 0, bad = 0;
  while (Date.now() < end) {
    const r = M.stableRead(p, 4);
    if (!r.buf) { refused++; continue; }
    accepted++;
    const s = r.buf.toString();
    if (s !== A && s !== B) bad++;
  }
  try { child.kill(); } catch (_) { /* already gone */ }
  assert.strictEqual(bad, 0, `${bad} torn buffer(s) were accepted out of ${accepted} (refused ${refused})`);
  assert.ok(accepted + refused > 0, 'the loop never ran');
});

// ═══ push — every refusal, by name ════════════════════════════════════════════════════════

test('push REFUSES and names a path no rule covers', () => {
  const w = world({ 'board.jsonl': 'x\n', 'a-path-nobody-ruled.json': '{}' });
  const r = run(w, ['--push']);
  assert.strictEqual(r.code, 1);
  assert.ok(both(r).includes('a-path-nobody-ruled.json'), 'must name the path: ' + both(r));
  assert.ok(both(r).includes('by accident'), 'must say why an unplaced path matters');
});

test('push REFUSES when a forbidden path is present, and quotes its reason', () => {
  const w = world({ 'board.jsonl': 'x\n', 'install_id': 'abc' });
  const r = run(w, ['--push']);
  assert.strictEqual(r.code, 1);
  assert.ok(both(r).includes('FORBIDDEN PATH PRESENT'));
  assert.ok(both(r).includes('share an identity'), 'the manifest\'s own reason must reach the operator');
});

test('push REFUSES a file over the 100 MB cap BEFORE touching git', () => {
  const w = world({});
  // A sparse file: the cap check reads sizes, never bytes, so this costs no disk.
  const p = path.join(w.data, 'board.jsonl');
  const fd = fs.openSync(p, 'w');
  fs.ftruncateSync(fd, M.FILE_CAP + 1);
  fs.closeSync(fd);
  const r = run(w, ['--push']);
  assert.strictEqual(r.code, 1, both(r));
  assert.ok(both(r).includes('100 MB PER-FILE HARD LIMIT'), both(r));
  assert.ok(both(r).includes('board.jsonl'));
  assert.strictEqual(log(w.state), '', 'git must not have been touched');
});

test('push REFUSES the WHOLE set when one path will not settle — no partial push', () => {
  // A file whose mtime is in the FUTURE can never be SETTLE_MS old, so the quiescence gate can
  // never certify it: the deterministic stand-in for a pane that is writing without pause. The
  // requirement is that board.jsonl does NOT get pushed on its own.
  const w = world({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  const soon = new Date(Date.now() + 3600 * 1000);
  fs.utimesSync(path.join(w.data, 'captures', 'A.txt'), soon, soon);
  const r = run(w, ['--push']);
  assert.strictEqual(r.code, 1, both(r));
  assert.ok(both(r).includes('would not come back STABLE'), both(r));
  assert.ok(both(r).includes('captures/A.txt'));
  assert.ok(both(r).includes('Nothing was pushed'));
  assert.strictEqual(log(w.state), '', 'a refused set must leave no commit');
});

test('push REFUSES on a manifest class error and classifies nothing', () => {
  const w = world({ 'board.jsonl': 'x\n' }, {
    version: 1,
    rules: [{ glob: 'board.jsonl', class: 'REGENERATES', why: 'no writer named' }],
  });
  const r = run(w, ['--push']);
  assert.strictEqual(r.code, 1);
  assert.ok(both(r).includes('CLASS ERROR'));
  assert.ok(both(r).includes('nothing is pushed'));
});

test('push --dry-run writes nothing and commits nothing', () => {
  const w = world({ 'board.jsonl': 'x\n', 'letters.json': '{}' });
  const r = run(w, ['--push', '--dry-run']);
  assert.strictEqual(r.code, 0, both(r));
  assert.ok(both(r).includes('nothing written'));
  assert.ok(!fs.existsSync(path.join(w.state, 'data')), 'the tree must be untouched');
  assert.ok(!fs.existsSync(path.join(w.state, M.INDEX_NAME)));
});

test('push --no-remote commits by named path and writes the index and the machine row', () => {
  const w = world({ 'board.jsonl': 'row1\nrow2\n', 'letters.json': '{"a":"A"}', 'captures/A.txt': 'tail', 'captures/A.log': 'ore', 'field.json': '{}' });
  const r = run(w, ['--push', '--no-remote']);
  assert.strictEqual(r.code, 0, both(r));
  const idx = JSON.parse(fs.readFileSync(path.join(w.state, M.INDEX_NAME), 'utf8'));
  const names = idx.files.map((f) => f.path).sort();
  assert.deepStrictEqual(names, ['board.jsonl', 'captures/A.txt', 'letters.json'], 'only TRAVELS files: ' + names);
  assert.ok(fs.existsSync(path.join(w.state, 'machines', 'TESTL.json')));
  assert.ok(!fs.existsSync(path.join(w.state, 'data', 'captures', 'A.log')), 'STAYS must not travel');
  assert.ok(!fs.existsSync(path.join(w.state, 'data', 'field.json')), 'REGENERATES must not travel');
  assert.strictEqual(log(w.bare), '', '--no-remote must not reach the remote');
});

test('push records a sha256 per file that matches the bytes it copied', () => {
  const w = world({ 'board.jsonl': 'row1\nrow2\n' });
  run(w, ['--push', '--no-remote']);
  const idx = JSON.parse(fs.readFileSync(path.join(w.state, M.INDEX_NAME), 'utf8'));
  const e = idx.files.find((f) => f.path === 'board.jsonl');
  assert.strictEqual(e.sha256, M.sha256(fs.readFileSync(path.join(w.data, 'board.jsonl'))));
  assert.strictEqual(e.bytes, fs.statSync(path.join(w.data, 'board.jsonl')).size);
});

test('a second push with nothing changed makes no commit and says so', () => {
  const w = world({ 'board.jsonl': 'row\n' });
  run(w, ['--push', '--no-remote']);
  const before = execFileSync('git', ['-C', w.state, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const r = run(w, ['--push', '--no-remote']);
  assert.strictEqual(r.code, 0, both(r));
  assert.ok(both(r).includes('nothing changed'), both(r));
  const after = execFileSync('git', ['-C', w.state, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  assert.strictEqual(before, after);
});

test('push writes .gitattributes with `* -text` — the CRLF landmine', () => {
  const w = world({ 'board.jsonl': 'row\n' });
  run(w, ['--push', '--no-remote']);
  const ga = fs.readFileSync(path.join(w.state, '.gitattributes'), 'utf8');
  assert.ok(/^\* -text$/m.test(ga), ga);
});

test('LF SURVIVES a real commit-and-checkout round trip under core.autocrlf=true', () => {
  // The integration test the .gitattributes rule exists for. Without it git rewrites every LF to
  // CRLF on checkout and the sha256 index goes red at the far end for a reason that has nothing
  // to do with a missing path — which is the least actionable failure available at 8am.
  const w = world({ 'board.jsonl': 'a\nb\nc\n' });
  execFileSync('git', ['-C', w.state, 'config', 'core.autocrlf', 'true']);
  const r = run(w, ['--push']);       // push to the bare remote; privacy check will refuse a non-github remote
  assert.ok(r.code === 0 || r.code === 1, both(r));
  // whatever the remote outcome, the commit is local: force a hard re-checkout of the tree
  fs.rmSync(path.join(w.state, 'data'), { recursive: true, force: true });
  execFileSync('git', ['-C', w.state, 'checkout', 'HEAD', '--', 'data']);
  const back = fs.readFileSync(path.join(w.state, 'data', 'board.jsonl'));
  assert.strictEqual(back.toString(), 'a\nb\nc\n', 'CRLF conversion leaked in: ' + JSON.stringify(back.toString()));
});

// ═══ the privacy gate — fails closed ══════════════════════════════════════════════════════

test('push to a non-github remote REFUSES rather than assuming it is private', () => {
  const w = world({ 'board.jsonl': 'row\n' });
  const r = run(w, ['--push']);
  assert.strictEqual(r.code, 1, both(r));
  assert.ok(both(r).includes('could not confirm'), both(r));
  assert.ok(both(r).includes('is private'), both(r));
  assert.ok(both(r).includes('The commit is made and is safe locally'), 'must say what state it left behind');
});

test('remotePrivacy on a tree with no origin is unknown, not private', () => {
  const dir = path.join(tmp, 'noorigin' + (++seq));
  fs.mkdirSync(dir, { recursive: true });
  execFileSync('git', ['init', '-q', dir]);
  const p = M.remotePrivacy(dir);
  assert.strictEqual(p.state, 'unknown');
  assert.notStrictEqual(p.state, 'private');
});

// ═══ verify — every failure names the path, the side, and what was expected ═══════════════

function pushed(files) {
  const w = world(files);
  const r = run(w, ['--push', '--no-remote']);
  assert.strictEqual(r.code, 0, both(r));
  return w;
}

test('verify says COMPLETE on a whole tree', () => {
  const w = pushed({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  const r = run(w, ['--verify']);
  assert.strictEqual(r.code, 0, both(r));
  assert.ok(both(r).includes('COMPLETE'));
  assert.ok(/2 of 2 files/.test(both(r)), both(r));
});

test('verify names an ABSENT file, its path, its location and its expected size', () => {
  const w = pushed({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  fs.rmSync(path.join(w.state, 'data', 'captures', 'A.txt'));
  const r = run(w, ['--verify']);
  assert.strictEqual(r.code, 1);
  const t = both(r);
  assert.ok(t.includes('ABSENT'), t);
  assert.ok(t.includes('captures/A.txt'), t);
  assert.ok(t.includes('4 bytes'), 'must say what was expected: ' + t);
  assert.ok(t.includes('INCOMPLETE'), t);
  assert.ok(t.includes('must not start on this set'), 'must say what it means for the launcher');
});

test('verify distinguishes a SHORT arrival from a longer one, in words', () => {
  const w = pushed({ 'board.jsonl': 'row1\nrow2\n' });
  fs.writeFileSync(path.join(w.state, 'data', 'board.jsonl'), 'row1\n');
  const r = run(w, ['--verify']);
  assert.strictEqual(r.code, 1);
  assert.ok(both(r).includes('SIZE'), both(r));
  assert.ok(both(r).includes('truncated arrival'), both(r));
  assert.ok(both(r).includes('expected: 10 bytes'), both(r));
  assert.ok(both(r).includes('found:    5 bytes'), both(r));
});

test('verify catches right-length-wrong-bytes and points at the CRLF cause', () => {
  const w = pushed({ 'board.jsonl': 'abcd\n' });
  fs.writeFileSync(path.join(w.state, 'data', 'board.jsonl'), 'abce\n');
  const r = run(w, ['--verify']);
  assert.strictEqual(r.code, 1);
  assert.ok(both(r).includes('CONTENT'), both(r));
  assert.ok(both(r).includes('-text'), 'the note must name the likeliest cause: ' + both(r));
});

test('verify with no index refuses with a specific sentence, not a crash', () => {
  const w = world({ 'board.jsonl': 'row\n' });
  const r = run(w, ['--verify']);
  assert.strictEqual(r.code, 1);
  assert.ok(both(r).includes('nothing has ever been pushed'), both(r));
});

test('verify reports a stray the index does not claim', () => {
  const w = pushed({ 'board.jsonl': 'row\n' });
  const s = path.join(w.state, 'data', 'ghost.jsonl');
  fs.writeFileSync(s, 'left over from an older set\n');
  const r = run(w, ['--verify']);
  assert.strictEqual(r.code, 0, 'a stray is a report, not a failure of completeness');
  assert.ok(both(r).includes('ghost.jsonl'), both(r));
  assert.ok(both(r).includes('does not claim'), both(r));
});

// ═══ pull — what the launcher reads ═══════════════════════════════════════════════════════

/** Two clones of one bare remote: L pushes, D pulls. The real shape. */
function twoMachines(files) {
  const w = pushed(files);
  execFileSync('git', ['-C', w.state, 'push', '-q', '-u', 'origin', 'main']);
  const d = path.join(w.dir, 'stateD');
  execFileSync('git', ['clone', '-q', w.bare, d]);
  for (const [k, v] of [['user.email', 't@t'], ['user.name', 't']]) execFileSync('git', ['-C', d, 'config', k, v]);
  const dataD = path.join(w.dir, 'dataD');
  fs.mkdirSync(dataD, { recursive: true });
  return { ...w, stateD: d, dataD };
}

function runD(w, args) {
  return run({ ...w, state: w.stateD, data: w.dataD }, args, { CONSONANCE_MACHINE: 'TESTD' });
}

test('pull verifies and writes sync-completion.json with installed:false', () => {
  const w = twoMachines({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  const r = runD(w, ['--pull']);
  assert.strictEqual(r.code, 0, both(r));
  const c = JSON.parse(fs.readFileSync(path.join(w.dataD, M.COMPLETION_NAME), 'utf8'));
  assert.strictEqual(c.verified, true);
  assert.strictEqual(c.installed, false, 'a verified set that never reached the data dir is NOT installed');
  assert.strictEqual(c.machine, 'TESTD', 'the record is about the machine that pulled');
  assert.strictEqual(c.pushed_by, 'TESTL');
  assert.ok(both(r).includes('VERIFIED BUT NOT INSTALLED'), both(r));
});

test('pull --install writes the files into the data dir and flips installed', () => {
  const w = twoMachines({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  const r = runD(w, ['--pull', '--install']);
  assert.strictEqual(r.code, 0, both(r));
  assert.strictEqual(fs.readFileSync(path.join(w.dataD, 'board.jsonl'), 'utf8'), 'row\n');
  assert.strictEqual(fs.readFileSync(path.join(w.dataD, 'captures', 'A.txt'), 'utf8'), 'tail');
  const c = JSON.parse(fs.readFileSync(path.join(w.dataD, M.COMPLETION_NAME), 'utf8'));
  assert.strictEqual(c.installed, true);
  assert.strictEqual(c.installed_into, w.dataD);
});

test('install KEEPS what it displaces, under attic/pre-sync-*', () => {
  const w = twoMachines({ 'board.jsonl': 'from L\n' });
  fs.writeFileSync(path.join(w.dataD, 'board.jsonl'), "D's own rows\n");
  const r = runD(w, ['--pull', '--install']);
  assert.strictEqual(r.code, 0, both(r));
  assert.strictEqual(fs.readFileSync(path.join(w.dataD, 'board.jsonl'), 'utf8'), 'from L\n');
  const attic = path.join(w.dataD, 'attic');
  const dirs = fs.readdirSync(attic).filter((n) => n.startsWith('pre-sync-'));
  assert.strictEqual(dirs.length, 1, 'exactly one backup dir: ' + dirs.join(','));
  assert.strictEqual(fs.readFileSync(path.join(attic, dirs[0], 'board.jsonl'), 'utf8'), "D's own rows\n",
    'the displaced bytes must survive — a bad sync has to be reversible where it landed');
});

test('install does not touch a file that is already identical', () => {
  const w = twoMachines({ 'board.jsonl': 'same\n' });
  fs.writeFileSync(path.join(w.dataD, 'board.jsonl'), 'same\n');
  const before = fs.statSync(path.join(w.dataD, 'board.jsonl')).mtimeMs;
  const r = runD(w, ['--pull', '--install']);
  assert.strictEqual(r.code, 0, both(r));
  assert.strictEqual(fs.statSync(path.join(w.dataD, 'board.jsonl')).mtimeMs, before, 'identical file must not be rewritten');
  assert.ok(!fs.existsSync(path.join(w.dataD, 'attic')), 'nothing was displaced, so no backup dir');
});

// ═══ the reconciliation — P-INSTALL-NAMES (L055) ══════════════════════════════════════════
//
// WHAT THESE ARE MEASURING, stated once. `installTree` returns how many times it called
// writeFileSync. That is a claim about THIS PROCESS, and on 2026-09-09 it printed
// `installed 46 file(s)` over a set of 47 and named none of them; the launch reported success
// and a seat woke from a tail that was not there. The reconciliation may take nothing from the
// install. It walks the INDEX — the thing the caller holds — and asks the DATA DIR.

/** A machine D that has pulled and installed: the reconciliation's actual subject. */
function installedD(files) {
  const w = twoMachines(files);
  const r = runD(w, ['--pull', '--install']);
  assert.strictEqual(r.code, 0, both(r));
  return w;
}

/** verifyTree's answer for D's state tree — the same input cmdPull hands the reconciliation. */
const verifiedD = (w) => M.verifyTree(w.stateD);

/**
 * gc_captures(), in one line: a second process that takes the file away under the install.
 *
 * IT SIGNALS BEFORE IT IS TRUSTED (D083, B's `handback/p-six-reds-B_2026-09-19.md` §3). The old version was spawned and
 * the install started at once; under load the child's Node start took longer than the whole install-and-verify, the file
 * was never taken, the product correctly said `installed: true`, and these tests went red for a premise that never
 * happened — 19 of 24 runs in B's load recipe, 15 of 24 in C's re-run. Now the child writes `ready` only after its loop
 * has run one unlink pass, and deleter() does not return until that file exists. A child that never signals FAILS the
 * test by name rather than letting it pass or fail on a race.
 */
function deleter(target) {
  const ready = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'deleter-')), 'ready');
  // 120 s is a SAFETY bound, not the window: the caller kills the child the moment the install returns. The old 6 s
  // WAS the window, and under load the pull reached its write after it had closed (D083, C's re-run).
  const script = `const fs=require('fs');const p=${JSON.stringify(target)};const end=Date.now()+120000;let told=false;`
    + `while(Date.now()<end){try{fs.unlinkSync(p)}catch(e){}`
    + `if(!told){fs.writeFileSync(${JSON.stringify(ready)},String(process.pid));told=true;}}`;
  const child = spawn(process.execPath, ['-e', script], { stdio: 'ignore' });
  // gc_captures RUNS concurrently with the install; a loop starved of CPU behind other work does not model it, and under
  // load it missed the few-ms window between the install's write and its reconcile (D083: premise held, file survived).
  try { os.setPriority(child.pid, os.constants.priority.PRIORITY_HIGH); } catch (_) { /* not permitted: the premise check below still speaks */ }
  const nap = new Int32Array(new SharedArrayBuffer(4));
  const deadline = Date.now() + 30000;
  while (!fs.existsSync(ready)) {
    if (Date.now() > deadline) { try { child.kill(); } catch (_) { /* gone */ } throw new Error(`the deleter never signalled ready in 30 s (${ready}) — the test's premise did not start`); }
    Atomics.wait(nap, 0, 0, 5);                                     // sleep 5 ms without spinning: the child needs the CPU
  }
  return child;
}

test('reconcileInstall reports the whole set present when the data dir holds it', () => {
  const w = installedD({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  const rec = M.reconcileInstall(w.dataD, verifiedD(w));
  assert.strictEqual(rec.ok, true, JSON.stringify(rec.missing));
  assert.strictEqual(rec.claimed, 2);
  assert.strictEqual(rec.present, 2);
  assert.deepStrictEqual(rec.missing, []);
});

test('reconcileInstall NAMES BY PATH a file the data dir does not hold — a count names nothing', () => {
  const w = installedD({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  fs.unlinkSync(path.join(w.dataD, 'captures', 'A.txt'));
  const rec = M.reconcileInstall(w.dataD, verifiedD(w));
  assert.strictEqual(rec.ok, false);
  assert.strictEqual(rec.missing.length, 1);
  assert.strictEqual(rec.missing[0].path, 'captures/A.txt', 'the PATH is the deliverable');
  assert.strictEqual(rec.missing[0].kind, 'ABSENT');
  assert.strictEqual(rec.present, 1);
  assert.ok(rec.missing[0].where.includes(w.dataD), 'it says where it looked, on THIS machine');
});

test('reconcileInstall reads the destination, so an install that reported success cannot cover for it', () => {
  // The install's own count is 2-and-correct here. The data dir is not. If the reconciliation
  // took the count, this would pass green — which is exactly the morning being fixed.
  const w = installedD({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  fs.unlinkSync(path.join(w.dataD, 'board.jsonl'));
  const rec = M.reconcileInstall(w.dataD, verifiedD(w));
  assert.strictEqual(rec.ok, false, 'the destination is short and only the destination can say so');
  assert.strictEqual(rec.missing[0].path, 'board.jsonl');
});

test('reconcileInstall distinguishes a SHORT file at the destination from an absent one', () => {
  const w = installedD({ 'board.jsonl': 'row one\nrow two\n' });
  fs.writeFileSync(path.join(w.dataD, 'board.jsonl'), 'row one\n');
  const rec = M.reconcileInstall(w.dataD, verifiedD(w));
  assert.strictEqual(rec.missing.length, 1);
  assert.strictEqual(rec.missing[0].kind, 'SIZE');
  assert.ok(rec.missing[0].found.includes('8 bytes'), rec.missing[0].found);
  assert.ok(rec.missing[0].note.includes('SHORT'), rec.missing[0].note);
});

test('reconcileInstall catches right-length-wrong-bytes at the destination', () => {
  const w = installedD({ 'board.jsonl': 'row\n' });
  fs.writeFileSync(path.join(w.dataD, 'board.jsonl'), 'ROW\n');
  const rec = M.reconcileInstall(w.dataD, verifiedD(w));
  assert.strictEqual(rec.missing.length, 1);
  assert.strictEqual(rec.missing[0].kind, 'CONTENT');
  assert.ok(rec.missing[0].expected.startsWith('sha256 '), rec.missing[0].expected);
});

test('reconcileInstall names a directory standing where a file should be, rather than crashing', () => {
  const w = installedD({ 'board.jsonl': 'row\n' });
  fs.unlinkSync(path.join(w.dataD, 'board.jsonl'));
  fs.mkdirSync(path.join(w.dataD, 'board.jsonl'));
  const rec = M.reconcileInstall(w.dataD, verifiedD(w));
  assert.strictEqual(rec.missing.length, 1);
  assert.strictEqual(rec.missing[0].kind, 'ABSENT');
  assert.ok(rec.missing[0].found.includes('directory'), rec.missing[0].found);
});

test('installTree accounts for EVERY index file: wrote + skipped is the whole set', () => {
  // `installed 46 file(s)` was unreadable because the run never said what the 47th was. It was
  // either written, or skipped as already-identical — and the record could not tell you which,
  // so a benign skip and a file that never arrived printed the same number.
  const w = twoMachines({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail', 'letters.json': '{}' });
  fs.mkdirSync(path.join(w.dataD, 'captures'), { recursive: true });
  fs.writeFileSync(path.join(w.dataD, 'captures', 'A.txt'), 'tail'); // already identical
  execFileSync('git', ['-C', w.stateD, 'fetch', '-q', 'origin']);
  execFileSync('git', ['-C', w.stateD, 'merge', '-q', '--ff-only', 'origin/main']);
  const v = M.verifyTree(w.stateD);
  const r = M.installTree(w.dataD, w.stateD, v);
  assert.strictEqual(r.wrote, 2);
  assert.strictEqual(r.skipped, 1, 'the already-identical file is COUNTED, not silently dropped');
  assert.strictEqual(r.wrote + r.skipped, v.index.files.length, 'every claimed file is accounted for');
});

test('--pull --install prints RECONCILED with a count it read from the data dir, and records it', () => {
  const w = twoMachines({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  const r = runD(w, ['--pull', '--install']);
  assert.strictEqual(r.code, 0, both(r));
  assert.ok(/RECONCILED — 2 of 2/.test(both(r)), both(r));
  assert.ok(/already identical/.test(both(r)), 'the skip count is printed so the arithmetic closes');
  const c = JSON.parse(fs.readFileSync(path.join(w.dataD, M.COMPLETION_NAME), 'utf8'));
  assert.strictEqual(c.reconciled, true);
  assert.strictEqual(c.reconciled_files, 2);
  assert.deepStrictEqual(c.missing, []);
});

test('--pull --install EXITS NON-ZERO and names the path when the data dir loses a file under it', () => {
  // THE ONLY WAY TO BE SHORT, and it is the incident. `installTree` converges: every index file
  // is written or skipped-as-identical, so a run that does not throw always leaves the whole set
  // on disk. A shortfall therefore takes ANOTHER PROCESS — which is what happened at 14:59:06Z on
  // 2026-09-09, when gc_captures() renamed the librarian's tail away 0.17 s before this tool
  // wrote `installed: true`. This second process IS gc_captures.
  const w = twoMachines({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  const child = deleter(path.join(w.dataD, 'captures', 'A.txt'));
  let r, alive;
  try { r = runD(w, ['--pull', '--install']); alive = child.exitCode === null && child.signalCode === null; }
  finally { try { child.kill(); } catch (_) { /* already gone */ } }
  assert.ok(alive, 'PREMISE: the deleter must still be running when the install returns, or nothing was taken away');
  assert.strictEqual(r.code, 1, 'a set that did not land must not exit 0: ' + both(r));
  assert.ok(both(r).includes('SHORTFALL'), both(r));
  assert.ok(both(r).includes('captures/A.txt'), 'THE PATH, not the count: ' + both(r));
  assert.ok(both(r).includes('ABSENT'), both(r));
});

test('a shortfall records installed:false and the missing paths, so the launcher reads a refusal', () => {
  const w = twoMachines({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  const child = deleter(path.join(w.dataD, 'captures', 'A.txt'));
  let alive;
  try { runD(w, ['--pull', '--install']); alive = child.exitCode === null && child.signalCode === null; }
  finally { try { child.kill(); } catch (_) { /* already gone */ } }
  assert.ok(alive, 'PREMISE: the deleter must still be running when the install returns, or nothing was taken away');
  const c = JSON.parse(fs.readFileSync(path.join(w.dataD, M.COMPLETION_NAME), 'utf8'));
  assert.strictEqual(c.verified, true, 'the TREE was whole — that claim stands and is not withdrawn');
  assert.strictEqual(c.installed, false, "C's schema: installed means the set reached the data dir");
  assert.strictEqual(c.reconciled, false);
  assert.strictEqual(c.stage, 'install');
  assert.deepStrictEqual(c.missing.map((m) => m.path), ['captures/A.txt']);
  assert.ok(c.why.includes('captures/A.txt'), 'the reason carries the path to the board row: ' + c.why);
});

test('pull REFUSES a non-fast-forward and records the stage it stopped at', () => {
  const w = twoMachines({ 'board.jsonl': 'row\n' });
  // D commits something of its own, so its history diverges from the remote's next commit
  fs.writeFileSync(path.join(w.stateD, 'local.txt'), 'D was here\n');
  execFileSync('git', ['-C', w.stateD, 'add', '--', 'local.txt']);
  execFileSync('git', ['-C', w.stateD, 'commit', '-q', '-m', 'D', '--', 'local.txt']);
  fs.writeFileSync(path.join(w.data, 'board.jsonl'), 'row\nrow2\n');
  run(w, ['--push', '--no-remote']);
  execFileSync('git', ['-C', w.state, 'push', '-q', 'origin', 'main']);
  const r = runD(w, ['--pull']);
  assert.strictEqual(r.code, 1, both(r));
  assert.ok(both(r).includes('NOT A FAST-FORWARD'), both(r));
  const c = JSON.parse(fs.readFileSync(path.join(w.dataD, M.COMPLETION_NAME), 'utf8'));
  assert.strictEqual(c.verified, false);
  assert.strictEqual(c.stage, 'fast-forward');
});

test('a pull whose tree fails verification writes verified:false and names the failures', () => {
  const w = twoMachines({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  runD(w, ['--pull']);
  fs.rmSync(path.join(w.stateD, 'data', 'captures', 'A.txt'));
  const r = runD(w, ['--pull']);
  assert.strictEqual(r.code, 1, both(r));
  const c = JSON.parse(fs.readFileSync(path.join(w.dataD, M.COMPLETION_NAME), 'utf8'));
  assert.strictEqual(c.verified, false);
  assert.strictEqual(c.stage, 'verify');
  assert.strictEqual(c.failures.length, 1);
  assert.strictEqual(c.failures[0].path, 'captures/A.txt');
  assert.strictEqual(c.failures[0].kind, 'ABSENT');
});

// ═══ the in-sync line ═════════════════════════════════════════════════════════════════════

test('machineHeads gives one commit hash per machine that has pushed', () => {
  const w = twoMachines({ 'board.jsonl': 'row\n' });
  runD(w, ['--pull']);
  fs.writeFileSync(path.join(w.dataD, 'board.jsonl'), 'row\nD\n');
  // D pushes its own row so both machines appear in the log
  run({ ...w, state: w.stateD, data: w.dataD }, ['--push', '--no-remote'], { CONSONANCE_MACHINE: 'TESTD' });
  const heads = M.machineHeads(w.stateD);
  const tags = heads.map((h) => h.machine).sort();
  assert.deepStrictEqual(tags, ['TESTD', 'TESTL']);
  for (const h of heads) assert.ok(/^[0-9a-f]{7,}$/.test(h.commit || ''), `${h.machine} has no commit: ${h.commit}`);
  assert.notStrictEqual(heads[0].commit, heads[1].commit, 'two machines, two commits');
});

test('state-sync.status.json is written on the machine that ran the sync, naming itself', () => {
  const w = twoMachines({ 'board.jsonl': 'row\n' });
  runD(w, ['--pull']);
  const st = JSON.parse(fs.readFileSync(path.join(w.dataD, M.STATUS_NAME), 'utf8'));
  assert.strictEqual(st.this_machine, 'TESTD');
  assert.ok(st.machines.some((m) => m.machine === 'TESTL' && m.commit));
  assert.ok(/AS OF THIS MACHINE/.test(st.limit), 'the file must carry its own limit');
});

// ═══ the classifier is BORROWED, not copied ═══════════════════════════════════════════════

test('state-sync classifies with the manifest module, so the two cannot drift apart', () => {
  const src = fs.readFileSync(TOOL, 'utf8');
  assert.ok(src.includes("require('./state-manifest.js')"), 'must reuse the manifest module');
  assert.ok(!/function globToRe/.test(src), 'a second copy of the glob semantics is how a transport and its checker disagree while both read green');
});

test('state-manifest.js still runs as a CLI after being made requirable', () => {
  const w = world({ 'board.jsonl': 'x\n' });
  const r = execFileSync(process.execPath, [MANIFEST], {
    encoding: 'utf8', env: { ...process.env, CONSONANCE_DATA: w.data, STATE_MANIFEST: w.manPath },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  assert.ok(r.includes('TRAVELS ='), r);
});

// ═══ the receipt — what a CALLER can gate on ═══════════════════════════════════════════════
//
// The exit code cannot carry this. 0 comes back from pushed, nothing-changed, --dry-run and
// --no-remote; 1 comes back from eight refusals of which exactly one is worth retrying. A caller
// that has to tell those apart either reads this tool's prose — a relayed answer — or reads a
// receipt. These tests are about the receipt being SPECIFIC, because a receipt that says only
// "failed" leaves the caller exactly where the exit code did.

const receipt = (w) => JSON.parse(fs.readFileSync(path.join(w.data, M.RECEIPT_NAME), 'utf8'));

test('the receipt names the pid of the process that wrote it, inside its run id', () => {
  const w = world({ 'board.jsonl': 'x\n' });
  run(w, ['--push', '--no-remote']);
  const r = receipt(w);
  assert.strictEqual(typeof r.pid, 'number');
  assert.ok(r.run_id.startsWith(r.pid + '-'), 'run_id must carry the pid: ' + r.run_id);
  assert.ok(Date.parse(r.at) > 0, 'and a timestamp');
});

test('a committed-but-unpushed set is LOCAL_ONLY, not PUSHED', () => {
  const w = world({ 'board.jsonl': 'x\n' });
  const rr = run(w, ['--push', '--no-remote']);
  assert.strictEqual(rr.code, 0, both(rr));
  assert.strictEqual(receipt(w).outcome, 'LOCAL_ONLY');
});

test('a second push with nothing changed is NOTHING_CHANGED — the other exit-0', () => {
  const w = world({ 'board.jsonl': 'x\n' });
  run(w, ['--push', '--no-remote']);
  run(w, ['--push', '--no-remote']);
  assert.strictEqual(receipt(w).outcome, 'NOTHING_CHANGED');
});

test('an unsettled path is DEFERRED_UNSETTLED and NAMES the paths, so a caller can retry that one case', () => {
  const w = world({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  const soon = new Date(Date.now() + 3600 * 1000);
  fs.utimesSync(path.join(w.data, 'captures', 'A.txt'), soon, soon);
  run(w, ['--push', '--no-remote']);
  const r = receipt(w);
  assert.strictEqual(r.outcome, 'DEFERRED_UNSETTLED');
  assert.deepStrictEqual(r.paths, ['captures/A.txt']);
});

test('an unplaced path is REFUSED_UNPLACED, which is NOT retryable and must not read like the one that is', () => {
  const w = world({ 'board.jsonl': 'x\n', 'a-path-nobody-ruled.json': '{}' });
  run(w, ['--push', '--no-remote']);
  const r = receipt(w);
  assert.strictEqual(r.outcome, 'REFUSED_UNPLACED');
  assert.deepStrictEqual(r.paths, ['a-path-nobody-ruled.json']);
});

test('a refused-because-unverifiable remote is REFUSED_PRIVACY and carries the reading', () => {
  const w = world({ 'board.jsonl': 'x\n' });
  const rr = run(w, ['--push']);
  assert.strictEqual(rr.code, 1, both(rr));
  const r = receipt(w);
  assert.strictEqual(r.outcome, 'REFUSED_PRIVACY');
  assert.strictEqual(r.privacy.state, 'unknown', 'a local-path remote is not a private github repo');
});

test('--dry-run is DRY_RUN in the receipt, so a caller cannot mistake a rehearsal for a close', () => {
  const w = world({ 'board.jsonl': 'x\n' });
  run(w, ['--push', '--dry-run']);
  assert.strictEqual(receipt(w).outcome, 'DRY_RUN');
});

const manifestMod = require(MANIFEST);

// ═══ the arriving roster — D056-1 ═════════════════════════════════════════════════════════
//
// TWO ASSERTION CLASSES, AND THEY DO NOT INVERT INTO EACH OTHER. The librarian's §6(3) said so
// and it is right: "the travelling set contains panes.json" is a STATIC claim about the manifest,
// answerable with no disk and no install; "installTree never writes a cwd that does not resolve
// here" is a DYNAMIC claim about behaviour and needs a fixture whose arriving cwds cannot resolve.
// Writing the second as a negation of the first is how a suite comes to assert nothing twice.
//
// THE MEASURED CASE, which every dynamic test below is shaped from: the migrate landed a roster
// of 4 rows, 0 of 4 cwds resolving, over a local roster of 5 rows, 5 of 5 resolving — and the two
// id sets are DISJOINT, so nothing the destination held could supply a cwd for anything that
// arrived. Every row had to be minted. That is the first-sync case and it is the hard one.

const ROSTER_MANIFEST = JSON.parse(JSON.stringify(MIN_MANIFEST));
ROSTER_MANIFEST.rules.unshift({
  glob: 'panes.json', class: 'TRAVELS', on_arrival: 'roster-cwds',
  why: 'the kept roster — ids and labels adopted, cwds re-resolved on arrival',
});
ROSTER_MANIFEST.out_of_root = [{
  ref: 'panes.json:cwd', points_at: 'instances_dir/sibling-<id>', class: 'UNDECIDED',
  decided_by: 'a test fixture', handled_by: 'roster-cwds',
}];

/** A world whose manifest travels the roster, plus an instances root for this machine. */
function rosterWorld(files, rows) {
  const w = world({ ...(files || {}), 'panes.json': JSON.stringify(rows || [], null, 2) }, ROSTER_MANIFEST);
  w.instances = path.join(w.dir, 'instances');
  fs.mkdirSync(w.instances, { recursive: true });
  return w;
}

/** L pushes `rows`; D arrives holding `localRows`, whose dirs exist here and L's do not. */
function twoRosters(lRows, localRows) {
  const w = rosterWorld({ 'board.jsonl': 'row\n' }, lRows);
  const pr = run(w, ['--push', '--no-remote']);
  assert.strictEqual(pr.code, 0, both(pr));
  execFileSync('git', ['-C', w.state, 'push', '-q', '-u', 'origin', 'main']);
  const d = path.join(w.dir, 'stateD');
  execFileSync('git', ['clone', '-q', w.bare, d]);
  for (const [k, v] of [['user.email', 't@t'], ['user.name', 't']]) execFileSync('git', ['-C', d, 'config', k, v]);
  const dataD = path.join(w.dir, 'dataD');
  fs.mkdirSync(dataD, { recursive: true });
  const instD = path.join(w.dir, 'instancesD');
  fs.mkdirSync(instD, { recursive: true });
  // D's own roster, and its dirs REALLY EXIST — the 5-of-5 control from the attic
  for (const r of localRows || []) fs.mkdirSync(r.cwd, { recursive: true });
  if (localRows) fs.writeFileSync(path.join(dataD, 'panes.json'), JSON.stringify(localRows, null, 2));
  return { ...w, stateD: d, dataD, instD };
}

const runRoster = (w, args) =>
  run({ ...w, state: w.stateD, data: w.dataD }, args,
    { CONSONANCE_MACHINE: 'TESTD', CONSONANCE_INSTANCES: w.instD });

const roster = (dir) => JSON.parse(fs.readFileSync(path.join(dir, 'panes.json'), 'utf8'));
const L_ROWS = [
  { pane: '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f', cwd: 'C:\\Consonance\\instances\\sibling-3d57124e', label: '✦ brief' },
  { pane: '0845a868-38f2-4cc2-b45a-431e0c088fb1', cwd: 'C:\\Consonance\\instances\\sibling-0845a868', label: '✦ Around' },
];

// ── STATIC: claims about the manifest, no disk, no install ──────────────────────────────────

test('the travelling set CONTAINS panes.json — the ruling is (C) adopt, and a silent flip to STAYS is caught here', () => {
  const m = M.loadManifest();
  assert.deepStrictEqual(m.errors, [], 'the shipped manifest must have no class errors: ' + m.errors.join('; '));
  const r = m.rules.find((r) => r.glob === 'panes.json');
  assert.ok(r, 'panes.json has no rule at all');
  assert.strictEqual(r.class, 'TRAVELS',
    'one_house_two_machines_idea:48 — the laptop\'s seats become the seats on both machines');
});

test('panes.json names an arrival transform, and state-sync implements the one it names', () => {
  const r = M.loadManifest().rules.find((r) => r.glob === 'panes.json');
  assert.strictEqual(r.on_arrival, 'roster-cwds');
  assert.ok(M.ARRIVAL_TRANSFORMS[r.on_arrival], 'the manifest names a transform nothing implements');
  assert.strictEqual(r.precondition, undefined,
    'a precondition is prose. D055-B-02 passed and missed; the condition must be a transform that runs');
});

test('NO rule anywhere carries a `precondition` — a condition that cannot fail reads as clearance', () => {
  const withPrecondition = M.loadManifest().rules.filter((r) => r.precondition);
  assert.deepStrictEqual(withPrecondition.map((r) => r.glob), [],
    'these carry prose where a mechanism is required');
});

test('a rule naming an UNIMPLEMENTED transform is a CLASS ERROR, not a comment', () => {
  const bad = { rules: [{ glob: 'x', class: 'TRAVELS', on_arrival: 'no-such-transform', why: 'x' }] };
  const errs = manifestMod.classErrorsFor(bad);
  assert.ok(errs.some((e) => /no-such-transform/.test(e) && /not implemented/.test(e)), JSON.stringify(errs));
});

test('an arrival transform on a rule that does not TRAVEL is a class error — a transform nothing runs', () => {
  const bad = { rules: [{ glob: 'x', class: 'STAYS', on_arrival: 'roster-cwds', why: 'x' }] };
  const errs = manifestMod.classErrorsFor(bad);
  assert.ok(errs.some((e) => /STAYS/.test(e) && /on_arrival/.test(e)), JSON.stringify(errs));
});

test('a transformed rule must declare what it points at OUTSIDE the root, in the fourth state', () => {
  // B's §0.7 criterion, made mechanical: panes.json is the only TRAVELS file pointing outside its
  // own transported tree, and the thing it points at is classified nowhere. Now it must be.
  const bad = { rules: [{ glob: 'panes.json', class: 'TRAVELS', on_arrival: 'roster-cwds', why: 'x' }] };
  assert.ok(manifestMod.classErrorsFor(bad).some((e) => /out_of_root/.test(e)),
    'a transform with no declared out-of-root target must fail');
  const undecidedNoDecider = {
    rules: [{ glob: 'panes.json', class: 'TRAVELS', on_arrival: 'roster-cwds', why: 'x' }],
    out_of_root: [{ ref: 'panes.json:cwd', points_at: 'i/s', class: 'UNDECIDED', handled_by: 'roster-cwds' }],
  };
  assert.ok(manifestMod.classErrorsFor(undecidedNoDecider).some((e) => /decided_by/.test(e)),
    'UNDECIDED with no decider is just an omission — §5\'s own words');
});

test('the shipped manifest declares its out-of-root target and it is UNDECIDED with a decider', () => {
  const man = M.loadManifest().man;
  const e = (man.out_of_root || []).find((e) => e.ref === 'panes.json:cwd');
  assert.ok(e, 'panes.json:cwd points outside data_dir and must say so');
  assert.strictEqual(e.class, 'UNDECIDED');
  assert.ok(e.decided_by && e.decided_by.length > 20, 'and here is what would decide it');
});

test('state-sync and the manifest module agree on which transforms exist', () => {
  assert.deepStrictEqual(Object.keys(M.ARRIVAL_TRANSFORMS).sort(), [...manifestMod.VALID_ARRIVAL].sort(),
    'two lists that can drift are one list nobody checks');
});

// ── DYNAMIC: claims about installTree's behaviour at a real destination ─────────────────────

test('installTree NEVER writes a cwd that does not resolve here — 0 of 2 arrive resolvable, 2 of 2 land resolvable', () => {
  const w = twoRosters(L_ROWS, null);
  // THE PRECONDITION IS ABOUT THE FIXTURE, NOT ABOUT THIS MACHINE'S DISK — and the first version
  // of this line got that wrong. It asserted `!fs.existsSync(r.cwd)` on the real
  // `C:\Consonance\instances\...` strings, so the test's verdict depended on what happened to be
  // on the live desktop; it went red the moment something outside this suite created one of those
  // directories. That is precisely the failure this file's own header warns about — a suite whose
  // universe is the one machine it was written on. The real strings stay as INPUT because they are
  // the measured shape of the migrate, and the transform never reuses an arriving cwd anyway; the
  // property being asserted is that none of them resolves under the destination's own root.
  for (const r of L_ROWS) {
    assert.ok(!M.underRoot(r.cwd, w.instD),
      'precondition: an arriving cwd must not already sit under this machine\'s instances root');
  }
  const res = runRoster(w, ['--pull', '--install']);
  assert.strictEqual(res.code, 0, both(res));
  const out = roster(w.dataD);
  assert.strictEqual(out.length, 2);
  for (const row of out) {
    assert.ok(fs.existsSync(row.cwd), `cwd does not resolve at the destination: ${row.cwd}`);
    assert.ok(fs.statSync(row.cwd).isDirectory(), row.cwd);
    assert.ok(row.cwd.startsWith(w.instD), `outside this machine's instances root: ${row.cwd}`);
  }
});

test('the ids and labels are ADOPTED verbatim; only the cwd is re-resolved', () => {
  const w = twoRosters(L_ROWS, null);
  runRoster(w, ['--pull', '--install']);
  const out = roster(w.dataD);
  assert.deepStrictEqual(out.map((r) => r.pane), L_ROWS.map((r) => r.pane), 'the ids key the capture tails');
  assert.deepStrictEqual(out.map((r) => r.label), L_ROWS.map((r) => r.label));
  for (const row of out) assert.ok(!row.cwd.includes('sibling-3d57124e'), 'a foreign cwd survived: ' + row.cwd);
});

test('a pane id the destination HAS seen keeps the local dir it already had', () => {
  const w = twoRosters(L_ROWS, null);
  const mine = path.join(w.instD, 'sibling-alreadyhere');
  fs.mkdirSync(mine, { recursive: true });
  fs.writeFileSync(path.join(w.dataD, 'panes.json'),
    JSON.stringify([{ pane: L_ROWS[0].pane, cwd: mine, label: 'local label' }], null, 2));
  runRoster(w, ['--pull', '--install']);
  const out = roster(w.dataD);
  const kept = out.find((r) => r.pane === L_ROWS[0].pane);
  assert.strictEqual(kept.cwd, mine, 'the destination\'s own record of which local dir held this id');
  assert.strictEqual(kept.label, L_ROWS[0].label, 'the LABEL is adopted from the source, the cwd is not');
});

test('a pane id never seen here is minted a fresh local dir, and the directory EXISTS', () => {
  const w = twoRosters(L_ROWS, null);
  runRoster(w, ['--pull', '--install']);
  for (const row of roster(w.dataD)) {
    assert.ok(fs.existsSync(row.cwd), row.cwd);
    assert.ok(/[\\/]sibling-/.test(row.cwd), 'minted dirs are siblings so role_for_kept resumes them as committee');
  }
});

test('the transform is IDEMPOTENT — a second install mints nothing and moves nothing', () => {
  const w = twoRosters(L_ROWS, null);
  runRoster(w, ['--pull', '--install']);
  const first = roster(w.dataD);
  const dirsAfterFirst = fs.readdirSync(w.instD).sort();
  const r2 = runRoster(w, ['--pull', '--install']);
  assert.strictEqual(r2.code, 0, both(r2));
  assert.deepStrictEqual(roster(w.dataD), first, 'a re-install must converge, not re-mint');
  assert.deepStrictEqual(fs.readdirSync(w.instD).sort(), dirsAfterFirst, 'no orphan dirs on the second run');
});

test('the arrived set REPLACES — a destination-only row is retired, not unioned', () => {
  // The ruling, and it is deliberate: one_house_two_machines_idea:48. Replacement converges where
  // union doubles the roster every round trip. The retired row's tail is still in captures/archive,
  // which is what "revivable" means. Asserted so a later union cannot arrive unnoticed.
  const localOnly = { pane: '46d3d352-36af-4947-9c40-78515a92c0c0', cwd: null, label: '✦ mine' };
  const w = twoRosters(L_ROWS, null);
  localOnly.cwd = path.join(w.instD, 'sibling-46d3d352');
  fs.mkdirSync(localOnly.cwd, { recursive: true });
  fs.writeFileSync(path.join(w.dataD, 'panes.json'), JSON.stringify([localOnly], null, 2));
  runRoster(w, ['--pull', '--install']);
  const ids = roster(w.dataD).map((r) => r.pane);
  assert.deepStrictEqual(ids, L_ROWS.map((r) => r.pane), 'replacement, not union: ' + JSON.stringify(ids));
});

test('every row carries a `home` naming where the seat was born', () => {
  const w = twoRosters(L_ROWS, null);
  runRoster(w, ['--pull', '--install']);
  for (const row of roster(w.dataD)) {
    assert.strictEqual(row.home, 'TESTL', 'these seats were born on L and the row should say so');
  }
});

test('a transformed file is NOT reported as a shortfall just because its bytes differ from the index', () => {
  // The reconciliation added in L055 hashes the destination against the index. A transformed file
  // is SUPPOSED to differ, so without this the roster would fail reconciliation on every install.
  const w = twoRosters(L_ROWS, null);
  const res = runRoster(w, ['--pull', '--install']);
  assert.strictEqual(res.code, 0, both(res));
  assert.ok(/RECONCILED/.test(both(res)), both(res));
  const c = JSON.parse(fs.readFileSync(path.join(w.dataD, M.COMPLETION_NAME), 'utf8'));
  assert.strictEqual(c.reconciled, true);
  assert.deepStrictEqual(c.missing, []);
});

test('a transformed file whose POSTCONDITION fails is a shortfall, named by path', () => {
  // Reconciliation of a transformed path is not a sha compare — it re-derives the property at the
  // destination. Break the property and it must still be caught, or the transform is unguarded.
  const w = twoRosters(L_ROWS, null);
  runRoster(w, ['--pull', '--install']);
  const out = roster(w.dataD);
  fs.rmSync(out[0].cwd, { recursive: true, force: true }); // the dir the roster promises
  const v = M.verifyTree(w.stateD);
  const rec = M.reconcileInstall(w.dataD, v, { instances: w.instD, state: w.stateD });
  assert.strictEqual(rec.ok, false, 'a roster naming a dir that is gone must not reconcile');
  const m = rec.missing.find((m) => m.path === 'panes.json');
  assert.ok(m, JSON.stringify(rec.missing));
  assert.strictEqual(m.kind, 'TRANSFORM');
  assert.ok(m.found.includes(out[0].cwd), 'it names the cwd that does not resolve: ' + m.found);
});


// ── the four the mutation pass found unwatched ──────────────────────────────────────────────
// Each of these exists because a mutant SURVIVED: the behaviour was implemented, argued for in a
// comment, and guarded by nothing. Three are postconditions I wrote and never tested; the fourth
// is the checker guard that is the whole point of the packet, where I had tested that the shipped
// manifest is clean — a fact about today's file — instead of testing that a dirty one is REFUSED.

test('the checker REFUSES a rule carrying a `precondition` — the guard, not just today\'s clean manifest', () => {
  const bad = { rules: [{ glob: 'x', class: 'TRAVELS', why: 'x', precondition: 'both machines resolve the same instances_dir' }] };
  const errs = manifestMod.classErrorsFor(bad);
  assert.ok(errs.some((e) => /precondition/.test(e) && /CANNOT FAIL/.test(e)),
    'a condition written as prose must be refused by the checker: ' + JSON.stringify(errs));
});

test('the postcondition catches a destination roster that WILL NOT PARSE — read_kept() reads that as zero panes', () => {
  // E's F1, and the reason this check is first in rosterVerify. An unparseable roster is not a
  // broken roster to main.rs — `from_str().ok().unwrap_or_default()` makes it an EMPTY one, and
  // gc_captures() builds its keep-set from that call. Garbling this file archives the whole house.
  const w = twoRosters(L_ROWS, null);
  assert.strictEqual(runRoster(w, ['--pull', '--install']).code, 0);
  fs.writeFileSync(path.join(w.dataD, 'panes.json'), '[{"pane": broken');
  const rec = M.reconcileInstall(w.dataD, M.verifyTree(w.stateD), { instances: w.instD, state: w.stateD });
  assert.strictEqual(rec.ok, false, 'an unparseable roster must not reconcile');
  const m = rec.missing.find((m) => m.path === 'panes.json');
  assert.ok(m && m.kind === 'TRANSFORM', JSON.stringify(rec.missing));
  assert.ok(/ZERO kept panes/.test(m.found), 'the report must say what it costs: ' + m.found);
});

test('the postcondition catches a destination roster whose ids are not the arriving set', () => {
  const w = twoRosters(L_ROWS, null);
  assert.strictEqual(runRoster(w, ['--pull', '--install']).code, 0);
  const out = roster(w.dataD);
  out.pop(); // one adopted seat silently dropped, the rest still perfectly valid
  fs.writeFileSync(path.join(w.dataD, 'panes.json'), JSON.stringify(out, null, 2));
  const rec = M.reconcileInstall(w.dataD, M.verifyTree(w.stateD), { instances: w.instD, state: w.stateD });
  const m = rec.missing.find((m) => m.path === 'panes.json');
  assert.ok(m && /adopted ids are not the arriving set/.test(m.found), JSON.stringify(rec.missing));
});

test('a transform that REFUSES stops the install, says so, and writes no roster', () => {
  const w = twoRosters([{ pane: '', cwd: 'C:\\elsewhere\\sibling-x', label: '✦ nameless' }], null);
  const r = runRoster(w, ['--pull', '--install']);
  assert.notStrictEqual(r.code, 0, 'a roster the transform refuses must not be installed: ' + both(r));
  assert.ok(both(r).includes('INSTALL REFUSED'), 'a refusal that prints nothing is a bare exit code: ' + both(r));
  assert.ok(both(r).includes('panes.json'), both(r));
  assert.ok(!fs.existsSync(path.join(w.dataD, 'panes.json')),
    'no roster may be written when the transform refused to produce one');
  const c = JSON.parse(fs.readFileSync(path.join(w.dataD, M.COMPLETION_NAME), 'utf8'));
  assert.strictEqual(c.installed, false);
  assert.ok(c.why.includes('panes.json'), c.why);
});
// ── L065 (pane E): no machine path as the state dir's default, and nobody resolves one they do not need ──
//
// portable-paths flagged :141 REVIEW: with nothing declared, stateDir() returned one machine's literal state
// path — right on the box that wrote it, somebody else's disk on the next. L062 R-C1 proved the refusal on a
// scratch copy and HELD it, because six reconcileInstall tests resolved the state dir eagerly through
// arrivalCtx while never reading it. These run in a child with an EMPTY home (no ~/.consonance.json) and no
// CONSONANCE_* variables, so the machine's own config cannot answer for the code.
function l065Env(home, extra = {}) {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) if (!/^CONSONANCE_/i.test(k)) env[k] = v;
  env.USERPROFILE = home; env.HOME = home;
  return { ...env, ...extra };
}
function l065Child(home, body, extra) {
  const out = execFileSync(process.execPath, ['-e',
    `const s=require(${JSON.stringify(TOOL)});try{console.log(JSON.stringify({ok:(${body})}))}catch(e){console.log(JSON.stringify({threw:e.message}))}`],
    { encoding: 'utf8', env: l065Env(home, extra) });
  return JSON.parse(out.trim().split('\n').pop());
}
function l065Home(fn) {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'l065-home-'));
  try { return fn(home); } finally { fs.rmSync(home, { recursive: true, force: true }); }
}

test('L065: nothing declared -> stateDir() REFUSES and names state_dir, never a guessed drive path', () => {
  l065Home((home) => {
    const r = l065Child(home, 's.stateDir()');
    assert.ok(r.threw, 'with no env and no config stateDir() must refuse, not return a path: ' + JSON.stringify(r));
    assert.ok(/no state dir declared/.test(r.threw), 'the refusal must say nothing was declared: ' + r.threw);
    assert.ok(/state_dir/.test(r.threw), 'the refusal must name the setting that fixes it: ' + r.threw);
  });
});

test('L065: ~/.consonance.json state_dir resolves, and CONSONANCE_STATE wins over it', () => {
  l065Home((home) => {
    fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({ state_dir: path.join(home, 'cfg') }));
    assert.strictEqual(l065Child(home, 's.stateDir()').ok, path.join(home, 'cfg'));
    assert.strictEqual(l065Child(home, 's.stateDir()', { CONSONANCE_STATE: path.join(home, 'env') }).ok,
      path.join(home, 'env'));
  });
});

test('L065: an ordinary install reconciles with NO state dir declared — only a transformed path needs one', () => {
  l065Home((home) => {
    const data = path.join(home, 'data'); fs.mkdirSync(data);
    const body = 'an ordinary file with no arrival transform\n';
    fs.writeFileSync(path.join(data, 'plain.txt'), body);
    const sha = require('crypto').createHash('sha256').update(body).digest('hex');
    const v = { index: { files: [{ path: 'plain.txt', bytes: Buffer.byteLength(body), sha256: sha }] } };
    const r = l065Child(home, `s.reconcileInstall(${JSON.stringify(data)}, ${JSON.stringify(v)}, { instances: ${JSON.stringify(home)} }).missing`);
    assert.ok(!r.threw, 'reconcileInstall must not resolve a state dir it never reads: ' + r.threw);
    assert.deepStrictEqual(r.ok, [], 'the whole set is present, so nothing is missing: ' + JSON.stringify(r.ok));
  });
});

// ═══ L070 — an append-only TRAVELS file installs as a FILE-LEVEL FAST-FORWARD, or not at all ════════════════
//
// C's L069 diagnosis (`handback/p-l069-ledger-C_2026-09-21.md`, 5b6cffc): every L launch MIGRATEs, the install REPLACED
// L's 488-row lap.jsonl with the state set's 419 — a strict prefix of it — and L's 69 rows of 09-20 went to the attic.
// L058 now exists in five generations. The keeper, 06:34: never replace; fast-forward, or refuse and name the rows.

const FF_MANIFEST = {
  ...MIN_MANIFEST,
  rules: [{ glob: 'lap.jsonl', class: 'TRAVELS', install: 'fast-forward', why: 'the lap ledger, two writers' },
    ...MIN_MANIFEST.rules],
};
const rows = (...ids) => ids.map((i) => `{"lap":"${i}"}\n`).join('');

/** L publishes `incoming` as lap.jsonl; D already holds `local` (or nothing, if null); D pulls with --install. */
function ffPull(incoming, local, manifest) {
  // letters.json sorts AFTER lap.jsonl in the index, board.jsonl before it — so a refusal that stopped the install
  // would leave letters.json unwritten (mutant #3, first run: with only board.jsonl, a `break` survived).
  const w = world({ 'lap.jsonl': incoming, 'board.jsonl': 'row\n', 'letters.json': '{"A":"x"}' }, manifest || FF_MANIFEST);
  const p = run(w, ['--push', '--no-remote']);
  assert.strictEqual(p.code, 0, both(p));
  execFileSync('git', ['-C', w.state, 'push', '-q', '-u', 'origin', 'main']);
  const stateD = path.join(w.dir, 'stateD');
  execFileSync('git', ['clone', '-q', w.bare, stateD]);
  const dataD = path.join(w.dir, 'dataD');
  fs.mkdirSync(dataD, { recursive: true });
  if (local !== null) fs.writeFileSync(path.join(dataD, 'lap.jsonl'), local);
  const W = { ...w, stateD, dataD };
  const r = runD(W, ['--pull', '--install']);
  const lap = () => fs.readFileSync(path.join(dataD, 'lap.jsonl'), 'utf8');
  const completion = () => JSON.parse(fs.readFileSync(path.join(dataD, M.COMPLETION_NAME), 'utf8'));
  return { W, r, lap, completion };
}

test('L070: a LONGER local ledger and a shorter incoming one — REFUSED, local rows intact, the rows named', () => {
  const local = rows('L054', 'L058', 'L059');
  const { r, lap } = ffPull(rows('L054'), local);
  assert.notStrictEqual(r.code, 0, 'an install that would drop rows must not exit 0: ' + both(r));
  assert.strictEqual(lap(), local, 'the local ledger is not replaced');
  for (const id of ['L058', 'L059']) assert.ok(both(r).includes(`"lap":"${id}"`), `the row that would be lost must be named: ${id}\n${both(r)}`);
});

test('L070: the refused ledger is recorded — installed:false, and the refused file named in the completion record', () => {
  const { completion } = ffPull(rows('L054'), rows('L054', 'L058'));
  const c = completion();
  assert.strictEqual(c.installed, false);
  assert.deepStrictEqual((c.refused || []).map((x) => [x.path, x.kind, x.local_only_lines]), [['lap.jsonl', 'LOCAL-AHEAD', [2]]],
    'the record must name the file it refused, why, and which local lines: ' + JSON.stringify(c));
});

test('L070: an incoming ledger that EXTENDS the local one row for row is installed', () => {
  const incoming = rows('L054', 'L058', 'L059');
  const { r, lap } = ffPull(incoming, rows('L054'));
  assert.strictEqual(r.code, 0, both(r));
  assert.strictEqual(lap(), incoming);
});

test('L070: DIVERGED ledgers — each side has a row the other lacks — REFUSED, local intact, the local-only row named', () => {
  const local = rows('L054', 'L058');
  const { r, lap } = ffPull(rows('L054', 'D089'), local);
  assert.notStrictEqual(r.code, 0, both(r));
  assert.strictEqual(lap(), local);
  assert.ok(both(r).includes('"lap":"L058"'), both(r));
});

test('L070: a byte-prefix that is NOT a row prefix (a torn last row) is diverged, not a fast-forward', () => {
  const local = '{"lap":"L054"}\n{"lap":"L05';
  const { r, lap } = ffPull(rows('L054', 'L058'), local);
  assert.notStrictEqual(r.code, 0, 'row for row, not byte for byte: ' + both(r));
  assert.strictEqual(lap(), local);
});

// ── L070 REBUILD (2026-09-22, on L): STOP BEFORE WRITE ─────────────────────────────────────────────────────────────
// The first build SKIPPED a refused file and installed the rest, and the launch then printed "the data dir was not
// promoted" (sync_launch.rs:257-264) over a data dir that mostly WAS — A's correction, handback/p-l070-fastforward-A-
// correction_2026-09-21.md (ead6e8d), observed on L tonight. Its test "the other files of the same install still land"
// asserted the withdrawn behaviour and is REPLACED by its inverse below.

test('L070 rebuild: one refused ledger refuses the WHOLE install — no other file of the set is written', () => {
  const { W } = ffPull(rows('L054'), rows('L054', 'L058'));
  for (const f of ['board.jsonl', 'letters.json']) {
    assert.ok(!fs.existsSync(path.join(W.dataD, f)), `${f} was written although the install was refused`);
  }
});

test('L070 rebuild: a refused install makes no attic backup — nothing was displaced because nothing was written', () => {
  const { W } = ffPull(rows('L054'), rows('L054', 'L058'));
  assert.ok(!fs.existsSync(path.join(W.dataD, 'attic')), 'an attic copy means a file was about to be overwritten');
});

test('L070 rebuild: the refusal SAYS nothing was written — the text the launch relays is true', () => {
  const { r } = ffPull(rows('L054'), rows('L054', 'L058'));
  assert.match(both(r), /NOTHING WAS WRITTEN/, both(r));
  assert.doesNotMatch(both(r), /are in place/, 'the skip-not-stop sentence must not survive the rebuild: ' + both(r));
});

test('L070 rebuild: a DIVERGED ledger refuses the whole install too', () => {
  const { W, r } = ffPull(rows('L054', 'D089'), rows('L054', 'L058'));
  assert.notStrictEqual(r.code, 0, both(r));
  assert.ok(!fs.existsSync(path.join(W.dataD, 'board.jsonl')), 'nothing else lands on a diverged ledger either');
});

test('L070 rebuild: a prefix-extension installs the WHOLE set, ledger included', () => {
  const incoming = rows('L054', 'L058');
  const { W, r, lap } = ffPull(incoming, rows('L054'));
  assert.strictEqual(r.code, 0, both(r));
  assert.strictEqual(lap(), incoming);
  assert.strictEqual(fs.readFileSync(path.join(W.dataD, 'board.jsonl'), 'utf8'), 'row\n');
  assert.strictEqual(fs.readFileSync(path.join(W.dataD, 'letters.json'), 'utf8'), '{"A":"x"}');
});

test('L070 rebuild: a ledger that GROWS between the scan and its write is refused, never overwritten', () => {
  // The one partial install the rebuild still allows is a genuine race, and it must stop and say so. The app appending
  // to lap.jsonl mid-install is simulated by an arrival transform on an EARLIER file that appends to the local ledger.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'l070-race-'));
  const DATA = path.join(dir, 'data'), STATE = path.join(dir, 'state');
  fs.mkdirSync(path.join(STATE, 'data'), { recursive: true }); fs.mkdirSync(DATA, { recursive: true });
  fs.writeFileSync(path.join(STATE, 'data', 'a-first.txt'), 'x');
  fs.writeFileSync(path.join(STATE, 'data', 'lap.jsonl'), rows('L054', 'L058'));
  fs.writeFileSync(path.join(DATA, 'lap.jsonl'), rows('L054'));
  M.ARRIVAL_TRANSFORMS['l070-poke'] = {
    apply: (buf) => { fs.appendFileSync(path.join(DATA, 'lap.jsonl'), rows('L059')); return { buf }; },
    verify: () => ({ ok: true }),
  };
  try {
    const rules = [{ glob: 'a-first.txt', re: /^a-first\.txt$/, class: 'TRAVELS', on_arrival: 'l070-poke', why: 't' },
      { glob: 'lap.jsonl', re: /^lap\.jsonl$/, class: 'TRAVELS', install: 'fast-forward', why: 't' }];
    const v = { index: { files: [{ path: 'a-first.txt' }, { path: 'lap.jsonl' }] } };
    const r = M.installTree(DATA, STATE, v, { rules, instances: dir, state: STATE });
    assert.strictEqual(r.rc, 1, 'a ledger that changed under the install must refuse: ' + JSON.stringify(r));
    assert.strictEqual(fs.readFileSync(path.join(DATA, 'lap.jsonl'), 'utf8'), rows('L054', 'L059'), 'the row written mid-install survives');
    assert.match(r.why, /changed/i, 'the refusal says the file changed during the install: ' + r.why);
  } finally { delete M.ARRIVAL_TRANSFORMS['l070-poke']; }
});

test('L070: no local ledger at all — the incoming one is installed (control)', () => {
  const { r, lap } = ffPull(rows('L054'), null);
  assert.strictEqual(r.code, 0, both(r));
  assert.strictEqual(lap(), rows('L054'));
});

test('L070: an identical local ledger is skipped, not refused (control)', () => {
  const { r } = ffPull(rows('L054'), rows('L054'));
  assert.strictEqual(r.code, 0, both(r));
});

test('L070: an unknown install mode REFUSES the file rather than falling back to replacement', () => {
  const man = { ...FF_MANIFEST, rules: [{ ...FF_MANIFEST.rules[0], install: 'union' }, ...MIN_MANIFEST.rules] };
  const local = rows('L054', 'L058');
  const { r, lap } = ffPull(rows('L054'), local, man);
  assert.notStrictEqual(r.code, 0, both(r));
  assert.strictEqual(lap(), local);
});

test('L070: a file with NO install mode is still replaced as before (the change is scoped to what declares it)', () => {
  const man = { ...FF_MANIFEST, rules: [{ glob: 'lap.jsonl', class: 'TRAVELS', why: 'x' }, ...MIN_MANIFEST.rules] };
  const { r, lap } = ffPull(rows('L054'), rows('L054', 'L058'), man);
  assert.strictEqual(r.code, 0, both(r));
  assert.strictEqual(lap(), rows('L054'));
});

test('L070: the SHIPPED manifest declares lap.jsonl and board.jsonl as fast-forward installs', () => {
  const man = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'state-manifest.json'), 'utf8'));
  for (const g of ['lap.jsonl', 'board.jsonl']) {
    const r = man.rules.find((x) => x.glob === g);
    assert.strictEqual(r && r.install, 'fast-forward', `${g} must install as a fast-forward`);
  }
});

// ═══ L074 — the nine other append-only ledgers, through the SHIPPED manifest ═══════════════════════════════════════
// Behaviour, not shape: each marked file is pulled with a LONGER local copy, and the install must refuse and keep it.
// dispatch-gate.jsonl, which is NOT marked (its quarantine rewrites it), must still be replaced as before.

const SHIPPED_MANIFEST = () => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'state-manifest.json'), 'utf8').replace(/^﻿/, ''));

/** L publishes `incoming` as `file`; D holds `local`; D pulls with --install under the SHIPPED manifest. */
function pullOne(file, incoming, local) {
  const w = world({ [file]: incoming }, SHIPPED_MANIFEST());
  const p = run(w, ['--push', '--no-remote']);
  assert.strictEqual(p.code, 0, both(p));
  execFileSync('git', ['-C', w.state, 'push', '-q', '-u', 'origin', 'main']);
  const stateD = path.join(w.dir, 'stateD');
  execFileSync('git', ['clone', '-q', w.bare, stateD]);
  const dataD = path.join(w.dir, 'dataD');
  const dst = path.join(dataD, file.split('/').join(path.sep));
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.writeFileSync(dst, local);
  const r = runD({ ...w, stateD, dataD }, ['--pull', '--install']);
  return { r, read: () => fs.readFileSync(dst, 'utf8') };
}

for (const f of ['precompact.jsonl', 'sessionstart-state.jsonl', 'sourced_ledger.jsonl', 'carrier-drift.jsonl', 'ferry.jsonl',
  'read_ledger.jsonl', 'return_ledger.jsonl', 'vantage_findings.jsonl', 'resonance/atoms.jsonl']) {
  test(`L074: ${f} — a LONGER local copy is refused and kept, never replaced`, () => {
    const local = rows('a', 'b');
    const { r, read } = pullOne(f, rows('a'), local);
    assert.notStrictEqual(r.code, 0, both(r));
    assert.strictEqual(read(), local, `${f} was replaced`);
  });
}

test('L074: dispatch-gate.jsonl (NOT marked — its quarantine rewrites it) is REPLACED on install as before, never refused', () => {
  const { r, read } = pullOne('dispatch-gate.jsonl', rows('a'), rows('a', 'b'));
  assert.strictEqual(r.code, 0, both(r));
  assert.strictEqual(read(), rows('a'), 'an unmarked file installs by replacement, with its old copy in the attic');
});

// ── D114 · UNION AT LAUNCH ───────────────────────────────────────────────────────────────────────
// Built to exo_memory/loop/union_at_launch_2026-09-22.md (E, D113, amended after A's §-ATTACK).
// These sit ABOVE the summary on purpose: this runner exits at its own report, and tests below it never run (L071).

const jl = (...objs) => objs.map((o) => JSON.stringify(o) + '\n').join('');
const at = (n) => `2026-09-2${n}T00:00:00.000Z`;

test('D114 the switch: ONLY the exact value `on` turns it on — unset, unknown and unparseable are today\'s behaviour', () => {
  assert.strictEqual(M.unionAtLaunchOn({ CONSONANCE_UNION_AT_LAUNCH: 'on' }), true);
  assert.strictEqual(M.unionAtLaunchOn({ CONSONANCE_UNION_AT_LAUNCH: ' ON ' }), true, 'case and space are not a decision');
  for (const v of [undefined, '', 'off', '1', 'true', 'yes', 'ON!', 'maybe']) {
    assert.strictEqual(M.unionAtLaunchOn({ CONSONANCE_UNION_AT_LAUNCH: v }), false, `"${v}" must be off`);
  }
});

test('D114 PHASE 2(a) is a COUNT, not a SET: a duplicate the arriving copy holds twice and this machine holds once FAILS', () => {
  // A's FATAL-1, measured on D: board.jsonl carries 7,514 duplicate rows. A presence test passes here while a row is
  // dropped, which is why this is the one multiset guarantee the ARRIVING copy ever gets.
  const r = { lap: 'L1', at: at(1) };
  const j = M.phase2(jl(r), jl(r, r), 'at');
  assert.strictEqual(j.ok, false, 'a set test would have passed this');
  assert.strictEqual(j.kind, 'COUNT-SHORT');
  assert.strictEqual(j.local, 1);
  assert.strictEqual(j.arriving, 2);
  assert.match(j.why, /a union cannot add/, '§10b: unioning again changes nothing, so it must say so');
});

test('D114 PHASE 2(a) passes when this machine holds at least as many of every row', () => {
  const a = { lap: 'L1', at: at(1) }, b = { lap: 'L2', at: at(2) };
  assert.strictEqual(M.phase2(jl(a, a, b), jl(a, a), 'at').ok, true);
  assert.strictEqual(M.phase2(jl(a, b), jl(a, b), 'at').ok, true);
});

test('D114 PHASE 2(b): a keyless line the arriving copy holds and this machine does not REFUSES, naming the line', () => {
  // A's FATAL-2. A fused line has no key at all, so no count can see it; 257 arrive on D today.
  const a = { lap: 'L1', at: at(1) };
  const j = M.phase2(jl(a), jl(a) + '{"lap":"L2"}{"lap":"L3"}\n', 'at');
  assert.strictEqual(j.ok, false);
  assert.strictEqual(j.kind, 'KEYLESS-ARRIVING');
  assert.deepStrictEqual(j.lines, [2], 'the line number is what a person reads');
});

test('D114 PHASE 2(b): a keyless line this machine ALREADY holds is not a refusal (invalidNotInLive is what matters)', () => {
  const a = { lap: 'L1', at: at(1) };
  const fused = '{"lap":"L2"}{"lap":"L3"}\n';
  assert.strictEqual(M.phase2(jl(a) + fused, jl(a) + fused, 'at').ok, true);
});

test('D114 §7.3: ANY row with no parseable time refuses the file — a threshold against a measured zero is a guess', () => {
  const good = { lap: 'L1', at: at(1) };
  assert.strictEqual(M.timeParseRefusal(jl(good), jl(good), 'at'), null);
  assert.match(M.timeParseRefusal(jl(good, { lap: 'L2' }), jl(good), 'at'), /1 row\(s\) of the local copy/);
  assert.match(M.timeParseRefusal(jl(good), jl(good, { lap: 'L2' }), 'at'), /1 row\(s\) of the arriving copy/);
});

test('D114 §4: a `started` receipt with no `finished` refuses the whole install and names the backup', () => {
  const d = fs.mkdtempSync(path.join(tmp, 'dangle-'));
  const rp = path.join(d, 'union_receipts.jsonl');
  fs.writeFileSync(rp, jl(
    { state: 'started', file: 'lap.jsonl', stamp: 'S1', backup: 'lap.jsonl.pre-union-S1', at: at(1) },
    { state: 'finished', file: 'lap.jsonl', stamp: 'S1' },
    { state: 'started', file: 'board.jsonl', stamp: 'S2', backup: 'board.jsonl.pre-union-S2', at: at(2) },
  ));
  const dang = M.danglingUnions(d, rp);
  assert.strictEqual(dang.length, 1, 'the finished one is not dangling');
  assert.strictEqual(dang[0].file, 'board.jsonl');
  assert.strictEqual(M.danglingUnions(d, path.join(d, 'nope.jsonl')).length, 0, 'no receipts file is not a dangling union');
});

test('D114 countsByKey counts ROWS per key, so two identical rows are two', () => {
  const { parseJsonl } = require(path.join(path.dirname(TOOL), 'ledger-union.js'));
  const a = { lap: 'L1', at: at(1) };
  const m = M.countsByKey(parseJsonl(jl(a, a, { lap: 'L2', at: at(2) })).rows);
  assert.deepStrictEqual([...m.values()].sort(), [1, 2]);
});

/** The whole path, end to end: L publishes lap.jsonl, D holds a diverged copy, D pulls with --install. */
function unionPull({ incoming, local, env }) {
  const w = world({ 'lap.jsonl': incoming, 'letters.json': '{"A":"x"}' }, SHIPPED_MANIFEST());
  const p = run(w, ['--push', '--no-remote']);
  assert.strictEqual(p.code, 0, both(p));
  execFileSync('git', ['-C', w.state, 'push', '-q', '-u', 'origin', 'main']);
  const stateD = path.join(w.dir, 'stateD');
  execFileSync('git', ['clone', '-q', w.bare, stateD]);
  const dataD = path.join(w.dir, 'dataD');
  const dst = path.join(dataD, 'lap.jsonl');
  fs.mkdirSync(dataD, { recursive: true });
  fs.writeFileSync(dst, local);
  const r = run({ ...w, state: stateD, data: dataD }, ['--pull', '--install'],
    { CONSONANCE_MACHINE: 'TESTD', ...(env || {}) });
  const comp = () => { try { return JSON.parse(fs.readFileSync(path.join(dataD, M.COMPLETION_NAME), 'utf8')); } catch (_) { return null; } };
  const receipts = () => { try { return fs.readFileSync(path.join(dataD, 'union_receipts.jsonl'), 'utf8').split('\n').filter(Boolean).map(JSON.parse); } catch (_) { return []; } };
  return { r, dataD, read: () => fs.readFileSync(dst, 'utf8'), comp, receipts };
}

const A = { lap: 'L1', at: at(1) }, B = { lap: 'L2', at: at(2) }, C = { lap: 'L3', at: at(3) };

test('D114 END TO END: with the switch ON a diverged ledger is MERGED, the install proceeds, and nothing is replaced', () => {
  const u = unionPull({ incoming: jl(A, B), local: jl(A, C), env: { CONSONANCE_UNION_AT_LAUNCH: 'on' } });
  assert.strictEqual(u.r.code, 0, both(u.r));
  const after = u.read();
  for (const row of [A, B, C]) assert.ok(after.includes(JSON.stringify(row)), `${JSON.stringify(row)} is missing after the union`);
  assert.ok(fs.readdirSync(u.dataD).some((f) => f.startsWith('lap.jsonl.pre-union-')), 'the original must be kept beside it');
  const c = u.comp();
  assert.strictEqual(c.union.merged.length, 1, JSON.stringify(c.union));
  assert.strictEqual(c.union.merged[0].action, 'INSTALLED-BY-UNION', 'a merged file is never reported as installed');
  assert.ok(c.union.merged[0].distinct_rows_added >= 1, 'the count carries its unit in its name');
});

test('D114 END TO END: the same case with the switch OFF refuses exactly as today, and writes nothing', () => {
  const u = unionPull({ incoming: jl(A, B), local: jl(A, C) });
  assert.notStrictEqual(u.r.code, 0, both(u.r));
  assert.strictEqual(u.read(), jl(A, C), 'the live file must be untouched');
  assert.ok(!fs.readdirSync(u.dataD).some((f) => f.startsWith('lap.jsonl.pre-union-')), 'no union may have run');
});

test('D114 END TO END: the receipt is written, started before finished, with its units in the field names', () => {
  const u = unionPull({ incoming: jl(A, B), local: jl(A, C), env: { CONSONANCE_UNION_AT_LAUNCH: 'on' } });
  const rs = u.receipts();
  assert.strictEqual(rs.length, 2, JSON.stringify(rs));
  assert.strictEqual(rs[0].state, 'started', 'the started line goes BEFORE the freeze (§4) or the crash window is silent');
  assert.strictEqual(rs[1].state, 'finished');
  assert.strictEqual(rs[1].trigger, 'launch');
  for (const k of ['distinct_rows_added', 'lines_caught_up', 'lines_reconciled', 'final_lines', 'backup_lines', 'backup_bytes',
    'invalid_live', 'invalid_arriving', 'invalid_not_in_live']) assert.ok(k in rs[1], `the receipt lacks ${k}`);
  assert.strictEqual(rs[1].verified, true);
});

test('D114 END TO END: PHASE 2 fails on an arriving duplicate, so the install is REFUSED and says what was merged', () => {
  // The union runs and verifies, and the file is STILL short a copy — §10b, and the refusal must not pretend otherwise.
  const u = unionPull({ incoming: jl(A, A, B), local: jl(A, C), env: { CONSONANCE_UNION_AT_LAUNCH: 'on' } });
  assert.notStrictEqual(u.r.code, 0, both(u.r));
  assert.match(both(u.r), /no file of the state set was installed/i);
  assert.match(both(u.r), /a union cannot add/, 'the reason must be the count, not a verdict');
});

test('D114 END TO END: a dangling `started` receipt refuses the install before anything is read', () => {
  const u = unionPull({ incoming: jl(A, B), local: jl(A, C), env: { CONSONANCE_UNION_AT_LAUNCH: 'on' } });
  assert.strictEqual(u.r.code, 0, 'setup: the first pull merges');
  fs.appendFileSync(path.join(u.dataD, 'union_receipts.jsonl'),
    JSON.stringify({ state: 'started', file: 'lap.jsonl', stamp: 'CRASH', backup: 'lap.jsonl.pre-union-CRASH', at: at(9) }) + '\n');
  const again = run({ ...u, state: path.join(path.dirname(u.dataD), 'stateD'), data: u.dataD, manPath: undefined },
    ['--pull', '--install'], { CONSONANCE_MACHINE: 'TESTD', CONSONANCE_UNION_AT_LAUNCH: 'on', STATE_MANIFEST: undefined });
  assert.notStrictEqual(again.code, 0, both(again));
  assert.match(both(again), /a previous union did not finish|did not finish/i);
});

test('D114 an UNVERIFIED union is never merged, whatever PHASE 2 says (it survived its first mutant run untested)', () => {
  const bad = { verified: false, missingLines: 3, missingRows: 1, backup: 'lap.jsonl.pre-union-S' };
  const v = M.unionVerdict(bad, { ok: true });
  assert.strictEqual(v.ok, false, 'the tool\'s own verify is the first gate');
  assert.strictEqual(v.stage, 'verify');
  assert.match(v.why, /3 missing line\(s\) and 1 missing row\(s\)/);
  assert.match(v.why, /pre-union/, 'and it must say where the original is');
  // and a verified union still has to pass PHASE 2
  assert.strictEqual(M.unionVerdict({ verified: true }, { ok: false, kind: 'COUNT-SHORT', why: 'short' }).stage, 'phase2');
  assert.strictEqual(M.unionVerdict({ verified: true }, { ok: true }).ok, true);
});

console.log('');
console.log(`state-sync.test.js: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
