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

const TOOL = path.join(__dirname, 'state-sync.js');
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

/** gc_captures(), in one line: a second process that takes the file away under the install. */
function deleter(target) {
  const script = `const fs=require('fs');const p=${JSON.stringify(target)};const end=Date.now()+6000;`
    + `while(Date.now()<end){try{fs.unlinkSync(p)}catch(e){}}`;
  return spawn(process.execPath, ['-e', script], { stdio: 'ignore' });
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
  let r;
  try { r = runD(w, ['--pull', '--install']); }
  finally { try { child.kill(); } catch (_) { /* already gone */ } }
  assert.strictEqual(r.code, 1, 'a set that did not land must not exit 0: ' + both(r));
  assert.ok(both(r).includes('SHORTFALL'), both(r));
  assert.ok(both(r).includes('captures/A.txt'), 'THE PATH, not the count: ' + both(r));
  assert.ok(both(r).includes('ABSENT'), both(r));
});

test('a shortfall records installed:false and the missing paths, so the launcher reads a refusal', () => {
  const w = twoMachines({ 'board.jsonl': 'row\n', 'captures/A.txt': 'tail' });
  const child = deleter(path.join(w.dataD, 'captures', 'A.txt'));
  try { runD(w, ['--pull', '--install']); }
  finally { try { child.kill(); } catch (_) { /* already gone */ } }
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
  const r = execFileSync(process.execPath, [path.join(__dirname, 'state-manifest.js')], {
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

console.log('');
console.log(`state-sync.test.js: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
