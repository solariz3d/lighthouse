// place-conversations.test.js — run with: node dev/place-conversations.test.js
//
// WHAT THIS FILE IS ACTUALLY GUARDING. The command it tests copies conversations — the first thing
// in this room that touches a conversation rather than a file about one. The failure it exists to
// prevent is not a crash. It is A PLACEMENT THAT REPORTS SUCCESS WHILE SOMETHING WAS LOST: a
// source that moved, a retired transcript written over by the next retirement, a stranger's
// session swept up because the code looked at a directory instead of at a session id.
//
// So the tests that matter here are the REFUSALS and the NON-EFFECTS. "It copied the file" is the
// easy half and proves almost nothing; "it retired nothing it was not asked to, it left the
// strangers alone, it did not touch the original, and it wrote NOTHING at all on the dry run" is
// the half that can actually go wrong.
//
// EVERY TEST RUNS AGAINST A FIXTURE — its own projects root, its own roster, its own home slug.
// Nothing here reads ~/.claude/projects or C:\Consonance\data, and this file must pass identically
// on a machine that has neither. `appRunning` is injected in every module-level test for the same
// reason: no test may depend on whether the keeper has Consonance open.
//
// THE ONE TEST THAT READS THE REAL REPOSITORY is the encode_cwd carrier test, and it is the point:
// that function is a SECOND COPY of a rule that lives in Rust, and this test runs the Rust file's
// own assertions against the JS. If they drift, this goes red rather than four conversations being
// placed in four directories nothing will ever look in.

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const TOOL = path.join(__dirname, 'place-conversations.js');
const P = require(TOOL);

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e && e.message}`); fail++; }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'place-'));
let seq = 0;

/** A jsonl transcript with real-shaped records, so timespan has something true to read. */
function transcript(sid, cwd, stamps) {
  const head = [
    { type: 'last-prompt', leafUuid: 'x', sessionId: sid },
    { type: 'mode', mode: 'normal', sessionId: sid },
  ];
  const body = stamps.map((ts, i) => ({
    type: i % 2 ? 'assistant' : 'user', sessionId: sid, cwd, timestamp: ts, uuid: `u${i}`,
  }));
  return head.concat(body).map((o) => JSON.stringify(o)).join('\n') + '\n';
}

/**
 * A whole world: a projects root with a home slug holding the sources, per-pane slugs, a roster.
 * `panes` is [{sid, cwd, label}]; `place` puts extra files into a pane's own slug.
 */
function world(panes, opts) {
  opts = opts || {};
  const dir = path.join(tmp, 'case' + (++seq));
  const homeCwd = path.join(dir, 'home');
  const projectsRoot = path.join(dir, 'projects');
  const enc = P.encodeCwd;
  fs.mkdirSync(path.join(projectsRoot, enc(homeCwd)), { recursive: true });

  for (const p of panes) {
    if (p.noSource) continue;
    fs.writeFileSync(
      path.join(projectsRoot, enc(homeCwd), `${p.sid}.jsonl`),
      p.body !== undefined ? p.body : transcript(p.sid, 'C:\\Users\\nname', ['2026-09-09T14:59:19.013Z', '2026-09-09T17:06:33.328Z']),
    );
  }
  for (const [rel, body] of Object.entries(opts.place || {})) {
    const [sid, name] = rel.split('|');
    const pane = panes.find((p) => p.sid === sid);
    const d = path.join(projectsRoot, enc(pane.cwd));
    fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, name), body);
  }

  const panesPath = path.join(dir, 'panes.json');
  fs.writeFileSync(panesPath, JSON.stringify(panes.map((p) => ({ pane: p.sid, cwd: p.cwd, label: p.label || 'x' })), null, 2));
  return { dir, homeCwd, projectsRoot, panesPath };
}

/** Every file under a root, with size + mtime + sha — the "nothing moved" instrument. */
function snapshot(root) {
  const out = {};
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else { const s = fs.statSync(p); out[p] = `${s.size}|${s.mtimeMs}|${P.sha256(fs.readFileSync(p))}`; }
    }
  };
  walk(root);
  return out;
}

const quiet = () => [];
function runIn(w, extra) {
  const lines = [];
  const r = P.run(Object.assign({
    out: (s) => lines.push(s),
    appRunning: false,
    projectsRoot: w.projectsRoot,
    homeCwd: w.homeCwd,
    panesPath: w.panesPath,
  }, extra || {}));
  r.lines = lines;
  r.text = lines.join('\n');
  return r;
}

const SID_A = '6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f';
const SID_B = '12fb81f6-f4c0-4ef8-aad8-f0cdce091925';

console.log('place-conversations.test.js');

// ── the carrier test: the JS copy of encode_cwd against the Rust file's own vectors ──

test('encodeCwd satisfies main.rs\'s own encode_cwd test vectors', () => {
  const rs = path.join(__dirname, '..', 'consonance', 'src-tauri', 'src', 'main.rs');
  assert.ok(fs.existsSync(rs), `main.rs not found at ${rs} — this test cannot measure anything`);
  const src = fs.readFileSync(rs, 'utf8');
  const re = /assert_eq!\(\s*encode_cwd\("((?:[^"\\]|\\.)*)"\)\s*,\s*"((?:[^"\\]|\\.)*)"/g;
  const un = (s) => s.replace(/\\(.)/g, '$1');
  let m, n = 0;
  while ((m = re.exec(src))) {
    n++;
    assert.strictEqual(P.encodeCwd(un(m[1])), un(m[2]), `encode_cwd(${m[1]})`);
  }
  // A GREEN RUN OVER ZERO VECTORS IS THE BUG — js-suite's own rule, applied here.
  assert.ok(n >= 3, `found only ${n} encode_cwd vectors in main.rs; this test proved nothing`);
});

test('encodeCwd maps every non-alphanumeric to a dash, including the ones a regex class forgets', () => {
  assert.strictEqual(P.encodeCwd('C:\\a b.c_d'), 'C--a-b-c-d');
  assert.strictEqual(P.encodeCwd('é1'), '-1');
});

// ── the refusals ──

test('REFUSES while Consonance is running, and writes nothing', () => {
  const w = world([{ sid: SID_A, cwd: path.join(tmp, 'paneA') }]);
  const before = snapshot(w.projectsRoot);
  const r = runIn(w, { appRunning: true });
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.code, 1);
  assert.match(r.text, /REFUSED — Consonance is running/);
  assert.deepStrictEqual(snapshot(w.projectsRoot), before);
});

test('REFUSES when it cannot tell whether the app is running', () => {
  const w = world([{ sid: SID_A, cwd: path.join(tmp, 'paneA2') }]);
  const r = runIn(w, { appRunning: null });
  assert.strictEqual(r.ok, false);
  assert.match(r.text, /cannot tell whether Consonance is running/);
});

test('a DRY RUN while the app is running proceeds, writes nothing, and says its reading is stale', () => {
  const w = world([{ sid: SID_A, cwd: path.join(tmp, 'paneA3') }]);
  const before = snapshot(w.projectsRoot);
  const r = runIn(w, { appRunning: true, dryRun: true });
  assert.strictEqual(r.ok, true, r.text);
  assert.match(r.text, /CONSONANCE IS RUNNING/);
  assert.match(r.text, /not a state that will hold/);
  assert.match(r.text, /A live run refuses outright/);
  assert.deepStrictEqual(snapshot(w.projectsRoot), before);
});

test('a dry run that cannot tell whether the app is up says so and still rehearses', () => {
  const w = world([{ sid: SID_A, cwd: path.join(tmp, 'paneA4') }]);
  const r = runIn(w, { appRunning: null, dryRun: true });
  assert.strictEqual(r.ok, true, r.text);
  assert.match(r.text, /could not tell whether Consonance is running/);
});

test('a live run points at the dry run rather than just refusing', () => {
  const w = world([{ sid: SID_A, cwd: path.join(tmp, 'paneA5') }]);
  const r = runIn(w, { appRunning: true });
  assert.match(r.text, /--dry-run/);
});

test('REFUSES the WHOLE run when one source is missing — no other pane is placed', () => {
  const a = { sid: SID_A, cwd: path.join(tmp, 'p3a') };
  const b = { sid: SID_B, cwd: path.join(tmp, 'p3b'), noSource: true };
  const w = world([a, b]);
  const before = snapshot(w.projectsRoot);
  const r = runIn(w);
  assert.strictEqual(r.ok, false);
  assert.match(r.text, /a source conversation is missing/);
  assert.match(r.text, new RegExp(SID_B));
  assert.deepStrictEqual(snapshot(w.projectsRoot), before, 'the pane whose source WAS present must not have been placed');
});

test('REFUSES a source that will not settle, and names it', () => {
  const w = world([{ sid: SID_A, cwd: path.join(tmp, 'p4a') }]);
  const src = path.join(w.projectsRoot, P.encodeCwd(w.homeCwd), `${SID_A}.jsonl`);
  // A FUTURE mtime, not a timed writer: stableRead refuses a file it cannot reason about, and the
  // assertion is about a STATE rather than about winning a race on a loaded machine.
  const future = new Date(Date.now() + 60_000);
  fs.utimesSync(src, future, future);
  const before = snapshot(w.projectsRoot);
  const r = runIn(w);
  assert.strictEqual(r.ok, false);
  assert.match(r.text, /would not settle/);
  assert.match(r.text, new RegExp(SID_A));
  assert.deepStrictEqual(snapshot(w.projectsRoot), before);
});

test('exits 2 with no roster', () => {
  const w = world([{ sid: SID_A, cwd: path.join(tmp, 'p5a') }]);
  const r = runIn(w, { panesPath: path.join(w.dir, 'nope.json') });
  assert.strictEqual(r.code, 2);
  assert.match(r.text, /no roster at/);
});

test('exits 2 when --pane names a sid that is not in the roster', () => {
  const w = world([{ sid: SID_A, cwd: path.join(tmp, 'p6a') }]);
  const r = runIn(w, { only: ['nope'] });
  assert.strictEqual(r.code, 2);
  assert.match(r.text, /not in the roster: nope/);
});

// ── the dry run ──

test('the dry run prints the full plan and writes NOTHING', () => {
  const a = { sid: SID_A, cwd: path.join(tmp, 'p7a') };
  const b = { sid: SID_B, cwd: path.join(tmp, 'p7b') };
  const w = world([a, b], { place: { [`${SID_A}|${SID_A}.jsonl`]: 'in the way\n' } });
  const before = snapshot(w.projectsRoot);
  const r = runIn(w, { dryRun: true });
  assert.strictEqual(r.ok, true);
  assert.deepStrictEqual(snapshot(w.projectsRoot), before, 'a dry run must leave every byte and every mtime alone');
  assert.match(r.text, /DRY RUN/);
  assert.match(r.text, /retire YES/);
  assert.match(r.text, /retire nothing/);
  assert.match(r.text, /sha256 [0-9a-f]{64}/);
  assert.match(r.text, /2026-09-09T14:59:19\.013Z → 2026-09-09T17:06:33\.328Z/);
});

test('the dry run reports the launch table as the state BEFORE the placement, and says so', () => {
  const w = world([{ sid: SID_A, cwd: path.join(tmp, 'p8a') }]);
  const r = runIn(w, { dryRun: true });
  assert.match(r.text, /fresh /, 'nothing is placed yet, so the launch row must not claim RESUME');
  assert.match(r.text, /this is the state before any placement/);
});

// ── the placement ──

test('places the conversation and verifies it by reading it back', () => {
  const a = { sid: SID_A, cwd: path.join(tmp, 'p9a') };
  const w = world([a]);
  const src = path.join(w.projectsRoot, P.encodeCwd(w.homeCwd), `${SID_A}.jsonl`);
  const srcSha = P.sha256(fs.readFileSync(src));
  const r = runIn(w);
  assert.strictEqual(r.ok, true, r.text);
  const dest = path.join(w.projectsRoot, P.encodeCwd(a.cwd), `${SID_A}.jsonl`);
  assert.ok(fs.existsSync(dest));
  assert.strictEqual(P.sha256(fs.readFileSync(dest)), srcSha);
  assert.match(r.text, /sha256 [0-9a-f]{64}  MATCHES source/);
  assert.match(r.text, /span .* MATCHES source/);
  assert.match(r.text, /source byte-identical after the copy/);
});

test('the ORIGINAL is byte-identical after the run', () => {
  const a = { sid: SID_A, cwd: path.join(tmp, 'p10a') };
  const w = world([a]);
  const src = path.join(w.projectsRoot, P.encodeCwd(w.homeCwd), `${SID_A}.jsonl`);
  const before = fs.statSync(src);
  const sha = P.sha256(fs.readFileSync(src));
  runIn(w);
  const after = fs.statSync(src);
  assert.strictEqual(P.sha256(fs.readFileSync(src)), sha);
  assert.strictEqual(after.size, before.size);
  assert.strictEqual(after.mtimeMs, before.mtimeMs, 'the source was not even touched');
});

test('the launch table reads RESUME for every pane after a live run', () => {
  const w = world([{ sid: SID_A, cwd: path.join(tmp, 'p11a') }, { sid: SID_B, cwd: path.join(tmp, 'p11b') }]);
  const r = runIn(w);
  assert.strictEqual((r.text.match(/RESUME/g) || []).length, 2);
  assert.doesNotMatch(r.text, /fresh /);
});

// ── the retirement, which is where history gets destroyed if it is done wrong ──

test('a transcript in the way is RETIRED to a stamped path, never deleted or overwritten', () => {
  const a = { sid: SID_A, cwd: path.join(tmp, 'p12a') };
  const w = world([a], { place: { [`${SID_A}|${SID_A}.jsonl`]: 'the live thread\n' } });
  const r = runIn(w);
  assert.strictEqual(r.ok, true, r.text);
  const d = path.join(w.projectsRoot, P.encodeCwd(a.cwd));
  const retired = fs.readdirSync(d).filter((f) => f.includes('.retired-'));
  assert.strictEqual(retired.length, 1, `expected one retired file, found ${retired.join(', ')}`);
  assert.strictEqual(fs.readFileSync(path.join(d, retired[0]), 'utf8'), 'the live thread\n', 'the retired transcript must survive intact');
  assert.match(retired[0], /\.jsonl\.retired-\d{8}T\d{6}Z/);
  assert.ok(!retired[0].endsWith('.jsonl'), 'a retired transcript must not stay a .jsonl in a project dir the vendor lists');
  assert.match(r.text, /retired  /);
});

test('an existing .jsonl.orphaned beside the destination is NOT touched by the retirement', () => {
  const a = { sid: SID_A, cwd: path.join(tmp, 'p13a') };
  const w = world([a], {
    place: {
      [`${SID_A}|${SID_A}.jsonl`]: 'the live thread\n',
      [`${SID_A}|${SID_A}.jsonl.orphaned`]: 'an EARLIER life of this seat\n',
    },
  });
  runIn(w);
  const d = path.join(w.projectsRoot, P.encodeCwd(a.cwd));
  assert.strictEqual(fs.readFileSync(path.join(d, `${SID_A}.jsonl.orphaned`), 'utf8'), 'an EARLIER life of this seat\n');
});

test('retiredPath never returns a name that already exists — the 835-836 scar', () => {
  const dest = path.join(tmp, 'x', 'y.jsonl');
  const now = Date.parse('2026-09-12T08:15:00.000Z');
  const taken = new Set([`${dest}.retired-20260912T081500Z`, `${dest}.retired-20260912T081500Z-2`]);
  const p = P.retiredPath(dest, now, (q) => taken.has(q));
  assert.strictEqual(p, `${dest}.retired-20260912T081500Z-3`);
});

test('two retirements inside the same second do not collide', () => {
  const a = { sid: SID_A, cwd: path.join(tmp, 'p15a') };
  const w = world([a], { place: { [`${SID_A}|${SID_A}.jsonl`]: 'first\n' } });
  const now = Date.parse('2026-09-12T08:15:00.000Z');
  runIn(w, { now });
  // put something in the way again and re-run with the SAME clock
  fs.writeFileSync(path.join(w.projectsRoot, P.encodeCwd(a.cwd), `${SID_A}.jsonl`), 'second\n');
  runIn(w, { now });
  const d = path.join(w.projectsRoot, P.encodeCwd(a.cwd));
  const retired = fs.readdirSync(d).filter((f) => f.includes('.retired-')).sort();
  assert.strictEqual(retired.length, 2, retired.join(', '));
  const bodies = retired.map((f) => fs.readFileSync(path.join(d, f), 'utf8')).sort();
  assert.deepStrictEqual(bodies, ['first\n', 'second\n'], 'neither retirement may be written over by the other');
});

// ── the ordering that makes the whole thing safe: verify the copy BEFORE retiring anything ──

test('a copy that does not match its source costs NOTHING — no retirement, no placement, no litter', () => {
  const a = { sid: SID_A, cwd: path.join(tmp, 'p12b') };
  const w = world([a], { place: { [`${SID_A}|${SID_A}.jsonl`]: 'the live thread\n' } });
  const d = path.join(w.projectsRoot, P.encodeCwd(a.cwd));
  const dest = path.join(d, `${SID_A}.jsonl`);
  // A row whose recorded sha/bytes do not describe its buffer: exactly what a source changing
  // between the read and the write would produce.
  const res = P.apply({
    sid: SID_A, dest, src: path.join(w.projectsRoot, P.encodeCwd(w.homeCwd), `${SID_A}.jsonl`),
    srcBuf: Buffer.from('a copy that went wrong\n'), srcBytes: 99999, srcSha: 'f'.repeat(64),
    srcSpan: { first: null, last: null, records: 0 },
  }, Date.now());
  assert.strictEqual(res.ok, false);
  assert.match(res.why, /nothing was retired and nothing was placed/);
  assert.strictEqual(fs.readFileSync(dest, 'utf8'), 'the live thread\n', 'the transcript that was there must still be there');
  const litter = fs.readdirSync(d).filter((f) => f.includes('.retired-') || f.includes('.placing-'));
  assert.deepStrictEqual(litter, [], `left behind: ${litter.join(', ')}`);
});

test('a source that changes between the read and the verification is REPORTED, not passed over', () => {
  const a = { sid: SID_A, cwd: path.join(tmp, 'p12c') };
  const w = world([a]);
  const p = P.plan({ projectsRoot: w.projectsRoot, homeCwd: w.homeCwd, panesPath: w.panesPath });
  assert.strictEqual(p.ok, true);
  const row = p.rows[0];
  fs.writeFileSync(row.src, 'somebody appended to the original while we worked\n');
  const res = P.apply(row, Date.now());
  assert.strictEqual(res.okSha, true, 'the copy itself is fine — it came from the buffer');
  assert.strictEqual(res.okSource, false, 'the ORIGINAL moved, and that must not read as success');
  assert.strictEqual(res.ok, false);
});

// ── the read-back verification, pointed at files that are deliberately wrong ──
//
// These exist because the mutation pass found the read-back unwatched: `okSha`, `okBytes` and
// `okSpan` could each be replaced by `true` with the whole suite still green, since `apply` verifies
// the copy before it commits and therefore never produces a bad placed file for a test to catch.
// A verification nothing can exercise is a printed reassurance, so it is exercised directly.

const ROW = (buf) => ({ srcBytes: buf.length, srcSha: P.sha256(buf), srcSpan: P.timespan(buf) });

test('verifyPlaced flags a placed file whose CONTENT differs at the same byte count', () => {
  const good = transcript(SID_A, 'x', ['2026-09-09T14:59:19.013Z', '2026-09-10T07:46:58.005Z']);
  const same = good.replace('2026-09-10T07:46:58.005Z', '2026-09-10T07:46:58.006Z'); // same length
  const f = path.join(tmp, 'v1.jsonl');
  fs.writeFileSync(f, same);
  const v = P.verifyPlaced(f, ROW(Buffer.from(good)));
  assert.strictEqual(v.okBytes, true, 'the byte count really is identical — that is the point');
  assert.strictEqual(v.okSha, false);
});

test('verifyPlaced flags a TRUNCATED placed file by byte count as well as by hash', () => {
  const good = transcript(SID_A, 'x', ['2026-09-09T14:59:19.013Z', '2026-09-10T07:46:58.005Z']);
  const f = path.join(tmp, 'v2.jsonl');
  fs.writeFileSync(f, good.slice(0, 80));
  const v = P.verifyPlaced(f, ROW(Buffer.from(good)));
  assert.strictEqual(v.okBytes, false);
  assert.strictEqual(v.okSha, false);
  assert.strictEqual(v.placedBytes, 80);
});

test('verifyPlaced flags a placed file whose first/last timestamps are not the source\'s', () => {
  const good = transcript(SID_A, 'x', ['2026-09-09T14:59:19.013Z', '2026-09-10T07:46:58.005Z']);
  const other = transcript(SID_A, 'x', ['2026-09-11T08:06:05.596Z', '2026-09-11T08:36:09.661Z']);
  const f = path.join(tmp, 'v3.jsonl');
  fs.writeFileSync(f, other);
  const v = P.verifyPlaced(f, ROW(Buffer.from(good)));
  assert.strictEqual(v.okSpan, false);
  assert.strictEqual(v.placedSpan.first, '2026-09-11T08:06:05.596Z');
  assert.strictEqual(v.placedSpan.last, '2026-09-11T08:36:09.661Z');
});

test('verifyPlaced passes a file that IS the source, and reports all three readings', () => {
  const good = transcript(SID_A, 'x', ['2026-09-09T14:59:19.013Z', '2026-09-10T07:46:58.005Z']);
  const f = path.join(tmp, 'v4.jsonl');
  fs.writeFileSync(f, good);
  const v = P.verifyPlaced(f, ROW(Buffer.from(good)));
  assert.deepStrictEqual([v.okSha, v.okBytes, v.okSpan], [true, true, true]);
  assert.strictEqual(v.placedSha, P.sha256(Buffer.from(good)));
});

test('a placement that does not verify fails the RUN and exits 1, rather than being printed past', () => {
  const w = world([{ sid: SID_A, cwd: path.join(tmp, 'p18a') }]);
  const r = runIn(w, {
    // the one injected seam, and the only way to reach this branch: `apply` is built so that a
    // placement it commits to has already been verified.
    apply: () => ({ ok: false, retired: null, placedBytes: 1, placedSha: 'x', placedSpan: { first: null, last: null }, okSha: false, okBytes: false, okSpan: false, okSource: true }),
  });
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.code, 1);
  assert.match(r.text, /1 pane\(s\) did not verify/);
  assert.match(r.text, /DIFFERS FROM SOURCE/);
});

// ── the unit is the sid, never the directory ──

test('strangers in the pane\'s own slug are left completely alone', () => {
  const a = { sid: SID_A, cwd: path.join(tmp, 'p16a') };
  const w = world([a], {
    place: {
      [`${SID_A}|424576d0-8b0a-4405-bd14-fdbfac1861a7.jsonl`]: 'a scratch session that is not the pane\'s\n',
      [`${SID_A}|60cfafdc-b8d0-41a8-b41f-f4a97befa022.jsonl`]: 'another one\n',
    },
  });
  const d = path.join(w.projectsRoot, P.encodeCwd(a.cwd));
  const strangers = snapshot(d);
  runIn(w);
  for (const [p, v] of Object.entries(strangers)) {
    const s = fs.statSync(p);
    assert.strictEqual(`${s.size}|${s.mtimeMs}|${P.sha256(fs.readFileSync(p))}`, v, `${p} was touched`);
  }
});

test('--pane places only the named pane and leaves the other exactly as it was', () => {
  const a = { sid: SID_A, cwd: path.join(tmp, 'p17a') };
  const b = { sid: SID_B, cwd: path.join(tmp, 'p17b') };
  const w = world([a, b]);
  const r = runIn(w, { only: [SID_B] });
  assert.strictEqual(r.ok, true, r.text);
  assert.ok(fs.existsSync(path.join(w.projectsRoot, P.encodeCwd(b.cwd), `${SID_B}.jsonl`)));
  assert.ok(!fs.existsSync(path.join(w.projectsRoot, P.encodeCwd(a.cwd))), 'the unselected pane must not even get a directory');
  assert.doesNotMatch(r.text, new RegExp(SID_A));
});

test('a pane whose cwd IS the home directory is SKIPPED, not copied onto itself', () => {
  const dir = path.join(tmp, 'same');
  const projectsRoot = path.join(dir, 'projects');
  const homeCwd = path.join(dir, 'home');
  fs.mkdirSync(path.join(projectsRoot, P.encodeCwd(homeCwd)), { recursive: true });
  const src = path.join(projectsRoot, P.encodeCwd(homeCwd), `${SID_A}.jsonl`);
  fs.writeFileSync(src, transcript(SID_A, homeCwd, ['2026-09-09T14:59:19.013Z']));
  const panesPath = path.join(dir, 'panes.json');
  fs.writeFileSync(panesPath, JSON.stringify([{ pane: SID_A, cwd: homeCwd, label: 'x' }]));
  const sha = P.sha256(fs.readFileSync(src));
  const lines = [];
  const r = P.run({ out: (s) => lines.push(s), appRunning: false, projectsRoot, homeCwd, panesPath });
  assert.strictEqual(r.ok, true, lines.join('\n'));
  assert.match(lines.join('\n'), /SKIP/);
  assert.strictEqual(P.sha256(fs.readFileSync(src)), sha);
});

// ── the readers ──

test('timespan reads the first and last timestamp out of the bytes, skipping headers with none', () => {
  const t = transcript(SID_A, 'x', ['2026-09-09T14:59:19.013Z', '2026-09-10T07:46:58.005Z']);
  const s = P.timespan(t);
  assert.strictEqual(s.first, '2026-09-09T14:59:19.013Z');
  assert.strictEqual(s.last, '2026-09-10T07:46:58.005Z');
  assert.strictEqual(s.records, 4);
});

test('timespan survives a torn last line rather than throwing', () => {
  const s = P.timespan('{"timestamp":"2026-09-09T14:59:19.013Z"}\n{"timestamp":"2026-09-');
  assert.strictEqual(s.first, '2026-09-09T14:59:19.013Z');
  assert.strictEqual(s.last, '2026-09-09T14:59:19.013Z');
  assert.strictEqual(s.records, 2);
});

test('paneJsonl builds <projects>/<encoded cwd>/<sid>.jsonl and nothing else', () => {
  const p = P.paneJsonl('R', 'C:\\Consonance\\instances\\main', SID_A);
  assert.strictEqual(p, path.join('R', 'C--Consonance-instances-main', `${SID_A}.jsonl`));
});

// ── the wiring, with nothing injected ──

test('the CLI rejects an unknown argument rather than guessing', () => {
  let code = 0;
  try { execFileSync(process.execPath, [TOOL, '--yolo'], { encoding: 'utf8', stdio: 'pipe' }); }
  catch (e) { code = e.status; }
  assert.strictEqual(code, 2);
});

test('the CLI --help says how to run it and exits 0', () => {
  const out = execFileSync(process.execPath, [TOOL, '--help'], { encoding: 'utf8' });
  assert.match(out, /--dry-run/);
  assert.match(out, /--pane <sid>/);
});

console.log(`\n  ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
