/* gen-consumer.test.js — the generator must not be able to ship a leak, a broken field, or a
 * tree that cannot build.
 *
 * WHY THE MANIFEST-COMPLETENESS TEST IS THE IMPORTANT ONE. Everything below is fast except the
 * thing that actually found the bugs, which was running `cargo check` against a generated tree.
 * That took minutes and is not suite-shaped. So the structural equivalent lives here: every
 * resource tauri.conf.json DECLARES must be produced by the manifest. Each of these was found by
 * building, and each would have been caught by that one assertion:
 *
 *     build.rs                    -> "OUT_DIR env var is not set, do you have a build script?"
 *     brief/room-settings.json    -> "resource path brief\room-settings.json doesn't exist"
 *     exo_memory/spread/*.md      -> "glob pattern ../../exo_memory/spread/*.md path not found"
 *
 * AND THE SHARPEST ONE, which no resource check would have caught: the generic identity rule
 * rewrote tauri.conf.json's "identifier": "com.solariz3d.consonance" into "com.the keeper.
 * consonance" -- a space in a bundle identifier. The leak was genuinely removed and the product
 * was broken by removing it. That is the 2026-08-15 shape (finding real, fix catastrophic, every
 * instrument silent), so it gets its own assertion and its own mutation.
 *
 * Run: node consonance/tools/gen-consumer.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
/* L038: the CONSUMER-STATUS drift guard renders E's copy in a CHILD, because requiring that
 * file runs its suite. See the test for the measurement. */
const { spawnSync } = require('node:child_process');

const REPO = path.resolve(__dirname, '..', '..');
const G = require('./gen-consumer.js');

const conf = () => JSON.parse(fs.readFileSync(
  path.join(REPO, 'consonance/src-tauri/tauri.conf.json'), 'utf8'));

test('the manifest is an ALLOW-list — every entry names a file or a matched directory', () => {
  // A deny-list fails open: a new private file would ship by default. Fail-closed is the whole
  // reason this is a manifest and not a copy-with-exclusions.
  for (const e of G.MANIFEST) {
    assert.ok(e.from || (e.dir && e.match),
      'manifest entry has neither an explicit `from` nor a `dir` + `match`: ' + JSON.stringify(e));
    if (e.dir) assert.ok(e.match instanceof RegExp, 'a directory entry must constrain what it takes');
  }
});

test('every EXCLUDE carries a reason', () => {
  // An exclusion with no reason is unreviewable, and this list is the one place a person decides
  // what a stranger does not get to see.
  for (const [rel, why] of Object.entries(G.EXCLUDE)) {
    assert.ok(typeof why === 'string' && why.length > 20,
      'exclusion of ' + rel + ' has no usable reason');
  }
});

test('every ALLOW carries the classes it exempts, and exempts nothing globally', () => {
  // A canary is an exemption from FAILING, never from CLASSIFICATION (2026-08-17). The same
  // applies here: a detector may contain what it detects, in ONE named class, not in all of them.
  for (const [rel, classes] of Object.entries(G.ALLOW)) {
    assert.ok(Array.isArray(classes) && classes.length > 0, rel + ' has an empty allow list');
    const all = new Set(G.LEAKS.map((l) => l.cls));
    assert.ok(classes.length < all.size, rel + ' is exempted from every class — that is a skip');
  }
});

test('every resource tauri.conf DECLARES is produced by the manifest', () => {
  // The assertion that would have caught build.rs, room-settings.json and spread/ without a build.
  const res = conf().bundle.resources || {};
  const produced = new Set(G.collect().map((f) => f.to.replace(/\\/g, '/')));
  const missing = [];
  for (const decl of Object.keys(res)) {
    // Paths in tauri.conf are relative to src-tauri/.
    const rel = path.posix.normalize(path.posix.join('consonance/src-tauri', decl));
    if (rel.includes('*')) {
      const dir = path.posix.dirname(rel);
      const any = [...produced].some((p) => p.startsWith(dir + '/'));
      if (!any) missing.push(decl + '  (glob, nothing produced under ' + dir + ')');
    } else if (!produced.has(rel)) {
      missing.push(decl + '  (expected ' + rel + ')');
    }
  }
  assert.deepStrictEqual(missing, [],
    'tauri.conf declares resources the manifest does not produce — the generated tree will not build:\n  ' +
    missing.join('\n  '));
});

test('build.rs and Cargo.lock ship — without them the tree cannot compile at all', () => {
  const produced = new Set(G.collect().map((f) => f.to.replace(/\\/g, '/')));
  for (const need of ['consonance/src-tauri/build.rs', 'consonance/src-tauri/Cargo.lock']) {
    assert.ok(produced.has(need), need + ' is not in the manifest');
  }
});

test('the bundle identifier survives transformation as valid reverse-DNS', () => {
  const src = fs.readFileSync(path.join(REPO, 'consonance/src-tauri/tauri.conf.json'), 'utf8');
  const out = G.transform(src, 'config').body;
  assert.strictEqual(G.validIdentifier(out), null,
    'the generated identifier is not reverse-DNS — a bundle identifier with whitespace breaks the build');
  assert.doesNotMatch(out, /"identifier"\s*:\s*"[^"]*\s[^"]*"/, 'whitespace inside the identifier');
});

test('the generic prose rules never touch structured config', () => {
  // The defect: `solariz3d` -> `the keeper` inside a field something else has to parse.
  const src = '{"identifier": "com.solariz3d.consonance", "note": "solariz3d wrote this"}';
  const out = G.transform(src, 'config').body;
  assert.match(out, /"identifier": "com\.consonance\.app"/, 'the named replacement did not fire');
  assert.doesNotMatch(out, /com\.the keeper/, 'a prose rule reached a structured field');
});

test('binary files are never read as text', () => {
  // Reading a .png as utf8 and writing it back corrupts it silently: right name, plausible size,
  // not an image. The manifest must mark them, and the build path must branch on that mark.
  const icons = G.MANIFEST.filter((e) => e.dir && /icons/.test(e.dir));
  assert.ok(icons.length > 0, 'icons are not in the manifest');
  for (const e of icons) assert.strictEqual(e.kind, 'binary', 'icons must be kind:binary');
  const src = fs.readFileSync(path.join(__dirname, 'gen-consumer.js'), 'utf8');
  assert.match(src, /f\.kind === 'binary'/, 'the build path does not branch on kind:binary');
  assert.match(src, /copyFileSync/, 'binary files are not copied byte-for-byte');
});

test('the scan catches a planted leak in the OUTPUT', () => {
  // Scanning the input cannot see a rule that failed to fire. Plant one and require a hit.
  const hits = G.scan('const owner = "solariz3d";\n', 'consonance/tools/whatever.js');
  assert.ok(hits.some((h) => h.cls === 'IDENTITY'), 'a planted handle was not caught');
});

test('a synthetic test fixture is NOT treated as a leak', () => {
  // What inflated the first survey by more than 2x. C:\notes and Users\nname are deliberate.
  const hits = G.scan("const p = 'C:/Users/nname/Desktop/x.md';\n", 'consonance/tools/whatever.js');
  assert.deepStrictEqual(hits, [], 'a synthetic fixture was flagged as a machine leak');
});

test('the synthetic exemption is INERT today, and must fire the moment it is needed', () => {
  /* A mutation SURVIVED here and it was right: no LEAK pattern currently overlaps any SYNTHETIC
   * pattern, so deleting the exemption changes nothing and the test above passes for the wrong
   * reason -- its fixture would not be flagged either way. The exemption is not wrong, it is
   * vestigial from the survey stage, when MACHINE was the broad /[Cc]:[\\/]/ and really did
   * collide with C:\notes and C:/x.
   *
   * So assert what is TRUE rather than what sounds protective: the exemption is currently
   * inert, and the guard is live the moment someone broadens a pattern into a fixture. A test
   * claiming to protect something it does not is worse than an absent one -- it reads as
   * coverage. */
  const fixtures = ['C:/notes/note.md', 'C:/x/test_a.js', 'C:/Users/nname/Desktop/x.md'];
  let overlaps = 0;
  for (const f of fixtures) {
    for (const { pat } of G.LEAKS) {
      const re = new RegExp(pat.source, pat.flags.replace('g', '') + 'g');
      if (re.test(f)) overlaps++;
    }
  }
  if (overlaps === 0) {
    // Inert. Prove the mechanism is still wired, so it works when it stops being inert.
    const src = fs.readFileSync(path.join(__dirname, 'gen-consumer.js'), 'utf8');
    assert.match(src, /SYNTHETIC\.some\(\(s\) => s\.test\(line\)\)/,
      'the exemption is inert AND unwired — a broadened pattern would flag every fixture');
    return;
  }
  // Live: a pattern has been broadened into fixture territory, so the exemption must hold.
  for (const f of fixtures) {
    assert.deepStrictEqual(G.scan('const p = \'' + f + '\';\n', 'consonance/tools/whatever.js'), [],
      'a leak pattern now collides with the synthetic fixture ' + f + ' and the exemption did not hold');
  }
});

test('a bare directory reference is not dangling; a dated file is', () => {
  // ferry.js's ARTIFACT_DIRS must keep naming exo_memory/journal/ — a consumer has one.
  assert.deepStrictEqual(
    G.scan("const D = ['exo_memory/journal/'];\n", 'consonance/tools/whatever.js'), [],
    'a bare directory was flagged — this would have had me rewrite a working constant');
  const dated = G.scan('// see exo_memory/journal/2026-08-17.md\n', 'consonance/tools/whatever.js');
  assert.ok(dated.some((h) => h.cls === 'DANGLING'), 'a dated entry was not flagged');
});

/* SUPERSEDED 2026-09-06 (L038), AND AMENDED RATHER THAN DELETED, because the assertion it made is
 * still the right one about a class of citation — it just names a different class now.
 *
 * It read: a dated journal citation must lose the pointer and keep `the record, <date>`. That was
 * correct while the journals stayed private: a pointer to a file the reader does not have is worse
 * than no pointer, because it reads as authoritative and resolves to nothing.
 *
 * The keeper's `inheritance/` answer inverts the premise. The reader HAS the file, so destroying
 * the pointer to protect them from a dead link is the same error facing the other way — C said so
 * before it happened, and there are 20 such citations. What survives untouched from the original
 * is the REASON: prose must not be left holding a reference that goes nowhere. Both halves are
 * kept below, so the class the old rule guarded is still guarded.
 */
test('a dangling citation is RE-POINTED, and one with no destination is still rewritten to prose', () => {
  const { body, n } = G.dedangle('// found on 2026-08-17, see exo_memory/journal/2026-08-17.md:1209\n');
  assert.ok(n > 0, 'nothing was rewritten');
  assert.doesNotMatch(body, /exo_memory\/journal\/2026/, 'the pointer at the EMPTY journal/ survived');
  assert.match(body, /exo_memory\/inheritance\/2026-08-17\.md:1209/,
    're-pointed citations must keep both the date and the line number the reader needs');

  // The half that did not change: a master that does NOT ship still loses its pointer and keeps
  // its prose. If this ever starts re-pointing too, something shipped that nobody decided to ship.
  const m = G.dedangle('see muscle_map.md for the catalogue').body;
  assert.doesNotMatch(m, /muscle_map/, 'a pointer to a file that does not ship survived');
  assert.match(m, /this line of record/, 'the prose rewrite lost its wording');
});

test('a full dry run over the real tree is clean and refuses nothing', () => {
  const r = G.build('', { dry: true });
  assert.deepStrictEqual(r.missing, [], 'the manifest names files that are not on disk');
  assert.deepStrictEqual(r.leaks.map((l) => l.rel + ':' + l.line + ' ' + l.cls), [],
    'leaks survived the transformations');
  assert.ok(!r.refused, 'the generator refused: ' + r.refused);
  assert.ok(r.staged > 100, 'only ' + r.staged + ' files staged — the manifest looks truncated');
  try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {}
});

test('the generator does not ship itself', () => {
  // It is a property of the private tree. Shipping it would hand a stranger the exclusion list,
  // which is a description of exactly what was withheld.
  const produced = new Set(G.collect()
    .filter((f) => !G.EXCLUDE[f.from]).map((f) => f.to.replace(/\\/g, '/')));
  assert.ok(!produced.has('consonance/tools/gen-consumer.js'), 'the generator ships itself');
  assert.ok(!produced.has('consonance/tools/gen-consumer.test.js'), 'its test ships too');
});

test('scan() itself refuses a corrupted bundle identifier', () => {
  /* This test exists because a mutation SURVIVED: the shape check lived in build(), which no test
   * reached, so disabling it failed nothing. The check now lives in scan() and this reaches it. */
  const broken = '{\n  "identifier": "com.the keeper.consonance"\n}\n';
  const hits = G.scan(broken, 'consonance/src-tauri/tauri.conf.json');
  assert.ok(hits.some((h) => h.cls === 'BROKEN'),
    'a bundle identifier with whitespace passed the scan — the exact defect that broke the build');
});

test('scan() does not flag a capability identifier, which is legitimately not reverse-DNS', () => {
  const cap = '{\n  "identifier": "default",\n  "windows": ["main"]\n}\n';
  assert.deepStrictEqual(G.scan(cap, 'consonance/src-tauri/capabilities/default.json'), [],
    'a capability name was flagged — a check that fires on the wrong file teaches people to ignore it');
});

/* ---------------------------------------------------------------- fixtures
 *
 * The librarian found the generator rewriting TEST FIXTURES: 11 of 26 changed files were tests,
 * 3 lost referents their assertions key on, and main.rs shipped
 * `assert!(shelf.contains("the record, 2026-08-22"))` -- an assertion that can never pass. Three
 * suites went GREEN on rewritten fixtures, which is worse than red: it says nothing, convincingly.
 *
 * `cargo check` could not see any of it. Even --all-targets only TYPE-CHECKS; it never runs an
 * assertion, so "cargo check against the generated tree exits 0" was true and nearly meaningless.
 */

test('a test file is classified as a fixture', () => {
  for (const f of ['consonance/tools/x.test.js', 'consonance/src-tauri/src/main.rs',
                   'consonance/src-tauri/tests/arch.rs']) {
    assert.ok(G.isFixture(f), f + ' must be treated as a fixture');
  }
  assert.ok(!G.isFixture('consonance/tools/ferry.js'), 'a plain tool is not a fixture');
});

test('a fixture keeps its dangling reference — the assertion keys on it', () => {
  const src = "const file = path.join(map, 'muscle_map.md');\n";
  const out = G.transform(src, 'fixture').body;
  assert.strictEqual(out, src, 'a fixture was rewritten; the assertion no longer keys on what it tested');
});

test('a fixture keeps its path SHAPE — token identity only', () => {
  // portable-paths.test.js asserts its detector ignores a comment holding a real machine path.
  // Rewrite the input to %USERPROFILE% and the assertion still passes while testing something else.
  const src = "assert.deepStrictEqual(G.scan('  * C:\\Users\\zackn\\Desktop\\lighthouse'), []);\n";
  const out = G.transform(src, 'fixture').body;
  assert.match(out, /C:\\Users\\user\\Desktop/, 'the path shape was not preserved');
  assert.doesNotMatch(out, /zackn/, 'the OS user name survived');
  assert.doesNotMatch(out, /%USERPROFILE%/, 'the path was restructured — that changes what the test tests');
});

test('the Rust test assertion the generator once broke is left alone', () => {
  const src = '        assert!(shelf.contains("journal/2026-08-22.md"), "the journal index is missing");\n';
  const out = G.transform(src, 'fixture').body;
  assert.strictEqual(out, src, 'the generator rewrote a Rust assertion into one that cannot pass');
});

test('coordinates are SUBSTITUTED, not exempted — shape preserved, value gone', () => {
  // A float stays a float so `assert_eq!(cfg.ambient_lat, "...")` keeps exercising the same path.
  const src = '"ambient_lat": 50.4452,\nassert_eq!(cfg.ambient_lat, "50.4452");\n';
  const out = G.transform(src, 'fixture').body;
  assert.doesNotMatch(out, /50\.4452/, "the keeper's latitude survived into a fixture");
  assert.match(out, /"ambient_lat": 12\.3456,/, 'the value was not substituted shape-preservingly');
  // consistency within the file, or the assertion breaks
  const m = out.match(/12\.3456/g) || [];
  assert.strictEqual(m.length, 2, 'the substitution was inconsistent within one file');
});

test('a fixture is exempt from REFERENCE classes and never from CONTENT classes', () => {
  const rel = 'consonance/tools/x.test.js';
  assert.deepStrictEqual(G.scan("path.join(d, 'muscle_map.md')\n", rel), [],
    'a fixture was refused for a RECORD reference — that is a filename, not content');
  const ident = G.scan('const who = "solariz3d";\n', rel);
  assert.ok(ident.some((h) => h.cls === 'IDENTITY'),
    'a fixture was exempted from IDENTITY — a handle in a fixture is still a handle');
});

test('unportable fixtures are REPORTED, and the report is not empty', () => {
  const r = G.build('', { dry: true });
  assert.ok(r.unportable.length > 0,
    'no unportable fixtures reported — 11 of 43 suites do not run in a consumer tree and this is how they say so');
  for (const u of r.unportable) assert.ok(u.refs.length > 0, u.rel + ' listed with no references');
  try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {}
});

// ── D009 P3 — THE RE-POINT ──────────────────────────────────────────────────────────────────────
//
// L ruled the EXCLUDE set (`handback/p-d007-exclude_2026-09-04.md`) and its closing block is this
// section's brief. Four manifest gaps, one of them a live uncaught crash; the widening that closes
// them arms EXCLUDE entry 1; the set's dangling debt had no instrument.

test('RE-POINT: the widening reaches the three tools gaps', () => {
  const e = G.MANIFEST.find((m) => m.dir === 'consonance/tools');
  for (const nm of ['README.md', 'carrier-drift.registry.json', 'groove-FINDINGS.md']) {
    assert.ok(e.match.test(nm), `consonance/tools/${nm} is unreachable by any manifest rule`);
  }
  assert.ok(e.match.test('ferry.js'), 'the widening must not lose the .js files it already carried');
});

/* THE FOURTH-GAP TEST WAS INVERTED 2026-09-06 (L037 P2), NOT DELETED, AND THE OLD ONE ASKED FOR
 * EXACTLY THIS. Its failure message read: "consonance/hooks/README.md now ships. That is a CONTENT
 * decision reserved to the keeper -- it is substantially this machine's state (a registered-hooks
 * table naming three files absent from this repo, an 'Expected today' block true only here, two
 * commit shas, another private project's paths, and two bare build_ruling.md citations dedangle
 * cannot reach). If the keeper ruled that it ships, delete this test with the decision recorded
 * beside it."
 *
 * The decision is recorded at the manifest entry in `gen-consumer.js`. What is NOT done is the
 * deleting: the old test guarded a real hazard -- that this one file re-acquires machine state --
 * and shipping the file makes that hazard WORSE rather than moot. So the guard is turned around to
 * watch the same thing from the other side. It now asserts the file ships AND that none of the
 * four passages the old message enumerated has come back.
 *
 * Each marker below is quoted from the withdrawn text, so the test fails on the RETURN of the
 * actual prose rather than on a paraphrase of it. One correction to that message while it is being
 * carried forward: the three files it said were 'absent from this repo' are present, at
 * `dev/shell/hooks/`. See the manifest entry. */
test('RE-POINT: the fourth gap is CLOSED -- hooks/README.md ships', () => {
  const hooks = G.MANIFEST.find((m) => m.dir === 'consonance/hooks');
  assert.ok(hooks.match.test('README.md'),
    'consonance/hooks/README.md no longer ships. If that is deliberate, this test and the manifest ' +
    'entry disagree, and the entry is the one that has to say why.');
  assert.ok(hooks.match.test('board-digest.js'),
    'the widening must not lose the .js files it already carried');
  const md = G.collect().filter((f) => f.from.startsWith('consonance/hooks/') && f.from.endsWith('.md'));
  assert.deepStrictEqual(md.map((f) => f.from), ['consonance/hooks/README.md'],
    'the md widening must admit exactly one file; a second one is a decision nobody has recorded');
});

test('RE-POINT: and it ships WITHOUT the machine state that kept it back', () => {
  /* The half that matters. A predicate can be widened in one character; the reason the file was
   * withheld was its CONTENT, and content is what regresses silently. */
  const body = fs.readFileSync(path.join(REPO, 'consonance/hooks/README.md'), 'utf8');
  const withdrawn = [
    ['23:10 local',    'the registered-hooks table, timestamped to one machine'],
    ['Expected today', 'the expected-output block true only on the machine that wrote it'],
    ['blackbox/',      "a worked example carrying a different private project's file paths"],
    ['build_ruling',   'a bare citation to a file that never ships, which dedangle() cannot see'],
  ];
  for (const [marker, what] of withdrawn) {
    assert.ok(!body.includes(marker),
      'consonance/hooks/README.md carries ' + what + ' again (marker: ' + JSON.stringify(marker) + '). ' +
      'This file is published; a sentence true only here becomes a fact a stranger inherits.');
  }
});

test('RE-POINT: entry 1 is ARMED — the baseline is reachable and withheld', () => {
  // The dead exclusion earning its keep. Before the widening this path could not be reached by any
  // rule; after it, this machine's own path register is one predicate away from shipping.
  const K = 'consonance/tools/portable-paths.baseline.json';
  const e = G.MANIFEST.find((m) => m.dir === 'consonance/tools');
  assert.ok(e.match.test(path.basename(K)), 'a manifest rule must now REACH the baseline');
  assert.ok(G.EXCLUDE[K], 'and EXCLUDE must withhold it');
  assert.ok(!/^UNREACHABLE:/.test(G.EXCLUDE[K]),
    'a live guard must not declare itself unreachable — build() refuses on exactly this');
  assert.ok(!G.collect().some((f) => f.from === K && !G.EXCLUDE[f.from]),
    'the baseline must never reach staging');
});

test('RE-POINT: restoring the UNREACHABLE: prefix REFUSES the build', () => {
  /* The step the packet predicted would look like a regression. It is the guard working: a stale
   * declaration on a now-live entry is refused, and dropping the prefix is the required half of the
   * widening rather than a way around the refusal. Proven by running it both ways. */
  const K = 'consonance/tools/portable-paths.baseline.json';
  const real = G.EXCLUDE[K];
  try {
    G.EXCLUDE[K] = 'UNREACHABLE: ' + real;
    const r = G.build(null, { dry: true });
    assert.match(String(r.refused || ''), /drifted/,
      'the widening armed this entry; a stale UNREACHABLE: on it must refuse');
    assert.ok(r.excludeDrift.some((d) => d.rel === K && /now reaches it/.test(d.why)));
  } finally { G.EXCLUDE[K] = real; }
  assert.strictEqual(G.build(null, { dry: true }).refused, undefined, 'and clean once the prefix is dropped');
});

test('RE-POINT: entry 6 names its SUBJECT, not the crash', () => {
  /* L's clause 1, counterfactual form: would this reason still be true if the tree it ships into
   * were perfect? The load crash would not be — it exists only because entry 4 withholds the
   * generator. What survives is that the file's subject is the generator. */
  const why = G.EXCLUDE['consonance/tools/gen-consumer.fixture-scope.test.js'];
  assert.match(why, /subject/i, 'the reason must name what the file is ABOUT');
  assert.ok(!/^requires |^it would crash/i.test(why),
    'a reason that opens on the symptom is the degenerating grammar the ruling named');
});

// ── the seeded registry ────────────────────────────────────────────────────────────────────────

test('SEED: the registry ships and the private bytes do not', () => {
  const K = 'consonance/tools/carrier-drift.registry.json';
  assert.ok(G.SEEDED[K], 'the gap is closed by SEEDING, never by EXCLUDE — carrier-drift.js ships ' +
    'and hard-requires this file, so excluding the .json leaves the crash exactly where it was');
  assert.ok(!G.EXCLUDE[K], 'and it must not ALSO be excluded');
  const real = fs.readFileSync(path.join(REPO, K), 'utf8');
  assert.ok(real.length > 30000, 'premise: the private register is large and is this record\'s state');
  assert.ok(!G.SEEDED[K].includes('"before"') && G.SEEDED[K].length < 2000,
    'the seed must not carry the private register');
  const seededHits = (G.SEEDED[K].match(/exo_memory\/(journal|loop|map)\//g) || []).length;
  assert.strictEqual(seededHits, 0, 'the seed carries no citation into this record');

  /* AND THE ASSERTION THAT ACTUALLY GUARDS IT — the three above describe the SEED, which is a
   * constant in this file, so all three stay green while build() happily reads the private bytes
   * instead. Mutation survived exactly that. This reads the STAGED OUTPUT, which is the only place
   * the substitution can be observed. The output is what matters; a rule that failed to fire is
   * invisible from the input side. */
  const out = path.join(os.tmpdir(), 'gc-seed-' + process.pid);
  fs.rmSync(out, { recursive: true, force: true });
  try {
    /* allowDirty, because this test is about SEEDING and not about provenance: the two are
     * orthogonal, and a seeding test that only runs on a clean checkout is a test that stops
     * testing on every working day. The provenance refusal has its own test. */
    const r = G.build(out, { allowDirty: true });
    assert.ok(r.seeded.includes(K), 'the report must name what it seeded');
    const shipped = fs.readFileSync(path.join(out, K), 'utf8');
    assert.ok(shipped.length < 2000,
      `the PRIVATE registry shipped: ${shipped.length} bytes reached the output tree`);
    assert.strictEqual(JSON.parse(shipped).withdrawals.length, 0, 'and it must be the empty one');
    assert.ok(!/exo_memory\/(journal|loop|map)\//.test(shipped),
      'this record\'s register of withdrawn wordings must not travel');
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});

test('SEED: its shape is the one carrier-drift.js actually reads', () => {
  /* Read off the consuming tool, not guessed. The first draft wrote `withdrawn: []` — not a key
   * the tool reads — which would have produced the right OUTPUT by the wrong ROUTE: inert because
   * the key was missing rather than because the list was empty. */
  const seed = JSON.parse(G.SEEDED['consonance/tools/carrier-drift.registry.json']);
  assert.ok(Array.isArray(seed.withdrawals), 'carrier-drift.js:418 reads reg.withdrawals');
  assert.strictEqual(seed.withdrawals.length, 0, 'empty, so the tool declares itself INERT');
  assert.ok(!('ch4_corpus' in seed),
    'ch4_corpus must be ABSENT, not present-and-empty: :374 reads an absent one as null (one ' +
    'CH4-UNFROZEN finding saying "run --ch4-walk") and an empty one as a frozen list of nothing ' +
    '(every walked file reported CH4-ADDED — a flood of false positives on a stranger\'s first run)');
});

test('SEED: a seeded file that is missing on disk still reports missing', () => {
  /* A seed must close a gap, never COVER a manifest error. If the private tree loses the file, the
   * output would still contain a valid-looking one while the manifest quietly described nothing.
   *
   * THE FIRST VERSION OF THIS TEST ASSERTED THE PREMISE AND NOT THE BEHAVIOUR — that the file is on
   * disk and the manifest reaches it, both true regardless of the guard. Mutation SURVIVED deleting
   * the existence check, which is exactly what a test of a premise cannot catch. It now removes the
   * file. */
  const K = 'consonance/tools/carrier-drift.registry.json';
  const abs = path.join(REPO, K);
  assert.ok(fs.existsSync(abs), 'premise: it is on disk now');
  assert.ok(G.collect().some((f) => f.from === K), 'and the manifest reaches it');

  /* A seed must close a gap and never COVER a manifest error. The first version of this guard was
   * an `fs.existsSync` inside the seeding branch; this test failed against it and the TEST WAS
   * RIGHT — for a `dir` rule that check is unreachable by construction, because `collect()`
   * enumerates the directory, so a vanished private file never becomes a named-but-absent entry.
   * It simply stops being produced. The guard could only ever have fired on a race.
   *
   * The detectable state is the seed reaching NOTHING, and it covers strictly more: the vanished
   * file, a typo in a seed key, and a manifest edit that drops the rule — one refusal, same
   * two-way shape as the exclusion check. Asserted by removing the file, which is the real event. */
  const hidden = abs + '.p3-test-moved';
  fs.renameSync(abs, hidden);
  try {
    const r = G.build(null, { dry: true });
    assert.ok(r.seedDrift.some((d) => d.rel === K),
      'a seed no manifest rule reaches must be REPORTED. Otherwise the seed closes the gap in the ' +
      'output while the manifest describes a file nobody has, and a seed protecting nothing reads ' +
      'exactly like one that is protecting something.');
    assert.match(String(r.refused || ''), /reach nothing/, 'and the build must refuse');
  } finally { fs.renameSync(hidden, abs); }
  assert.ok(fs.existsSync(abs), 'the private file must be put back whatever happened above');
  assert.strictEqual(G.build(null, { dry: true }).seedDrift.length, 0, 'and clean again once it is');
});

// ── the exclusion set's dangling debt ──────────────────────────────────────────────────────────

test('DEBT: the exclusion set is charged for the references it orphans', () => {
  /* L measured 9 (+3 for the baseline) and showed no instrument could ever return the number: the
   * three DANGLING patterns are shaped `exo_memory/...` while an excluded sibling is
   * `consonance/tools/<name>.js`, so the set could grow forever and nothing would move. */
  const r = G.build(null, { dry: true });
  assert.ok(Array.isArray(r.orphaned), 'the report must carry the count');
  assert.ok(r.orphaned.length > 0, 'today the set costs something and the number must say so');
  assert.ok(r.orphaned.some((o) => o.names.includes('catch-ledger')),
    'catch-ledger is excluded and named by shipped tools; that is the debt');
  assert.ok(r.orphaned.some((o) => o.rel === 'consonance/tools/tell-index.js'),
    'tell-index.js PRINTS the pointer in its own report — the worst instance and the one that ' +
    'must never fall out of the count silently');
  /* AND THE PROSE SIDE, which the assertions above do not reach. Mutation SURVIVED dropping `.md`
   * from the scanned extensions: every assertion here named a .js file, so the counter could go
   * blind to shipped documentation and stay green. `tools/README.md` is the one file MY widening
   * added to this debt — it names catch-ledger as "the room's only computation" of a number — so
   * the cost of the change in this same commit is the thing the test pins. */
  assert.ok(r.orphaned.some((o) => o.rel === 'consonance/tools/README.md' && o.names.includes('catch-ledger')),
    'shipped PROSE that names a withheld file must be charged too — it is a dead pointer that ' +
    'reads as authoritative, which the generator\'s own header calls the dominant leak class');
});

test('DEBT: the pattern is derived from EXCLUDE, so a seventh entry is charged automatically', () => {
  /* Built from Object.keys(EXCLUDE) rather than a written list. This is L's clause 3 turned from a
   * discipline into an instrument: a new entry is priced the moment it lands, with nobody
   * remembering to add a pattern. Verified by adding one and watching the count move. */
  const K = 'consonance/tools/ferry.js';
  assert.ok(!G.EXCLUDE[K], 'premise: ferry.js ships today');
  const before = G.build(null, { dry: true }).orphaned.length;
  try {
    G.EXCLUDE[K] = 'a seventh entry, added by a test to prove the debt counter is derived';
    const after = G.build(null, { dry: true }).orphaned;
    assert.ok(after.some((o) => o.names.includes('ferry')),
      'a newly excluded file must be charged for its references with no edit to the counter');
    assert.ok(after.length > before, 'and the count must move');
  } finally { delete G.EXCLUDE[K]; }
});

// ── B's residual ───────────────────────────────────────────────────────────────────────────────

test('RESIDUAL: the private tree\'s path with the drive TEMPLATED out is caught and rewritten', () => {
  /* Located by the librarian at generated `main.rs:362`: `{sysdrive}\Consonance\lighthouse\`. The
   * two MACHINE patterns key on a literal `C:`, so a leak that had already had its drive letter
   * templated walked past both — wearing the shape of a fix. The OneDrive half of the same
   * sentence WAS rewritten, which is what made the survivor invisible: the line looked handled. */
  const line = '/// each ended in the same two absolute literals -- `{sysdrive}\\Consonance\\lighthouse\\`';
  assert.ok(G.LEAKS.some((l) => l.cls === 'MACHINE' && new RegExp(l.pat.source, l.pat.flags).test(line)),
    'the templated form must be a MACHINE leak class');
  const out = G.demachine(line);
  assert.ok(!/Consonance\\lighthouse/i.test(out.body), 'and it must be rewritten: ' + out.body);
  assert.match(out.body, /%CONSONANCE_HOME%/, 'to the same placeholder deidentify() uses');
});

test('RESIDUAL: the generated main.rs carries neither half of that sentence\'s private paths', () => {
  // The output is what matters; a rule that failed to fire is invisible from the input side.
  const src = fs.readFileSync(path.join(REPO, 'consonance/src-tauri/src/main.rs'), 'utf8');
  const t = G.transform(src, 'rust');
  assert.ok(!/\{sysdrive\}\\Consonance/i.test(t.body), 'the templated literal survived');
  assert.ok(!/OneDrive\\Desktop\\projects/i.test(t.body), 'and the OneDrive half must stay rewritten');
});

// ── L038 — THE INHERITANCE SHAPE ────────────────────────────────────────────────────────────────
//
// The keeper answered C's one refusal on 2026-09-06 with `inheritance/`: the journals and the two
// masters ship as a labelled directory, `journal/` ships empty, `CUTOFF.md` is generator-written.
//
// EVERY TEST BELOW EXERCISES THE OLD FORM AS WELL AS THE NEW, and that is not symmetry for its own
// sake. Three leak classes were RE-POINTED rather than added, and a re-pointed class is one
// character from catching nothing while still reading green. Asserting only that the new form works
// would pass just as happily over a class that had been switched off.

test('L038 · HOSTNAME: the class catches a real one, and the OLD literal is gone from the fixture', () => {
  const line = 'HostName:                             ZACHSLEGION\n';
  const hits = G.scan(line, 'consonance/hooks/dream-watch.test.js');
  assert.ok(hits.some((h) => h.cls === 'HOSTNAME'),
    'the hostname that shipped to a public tree is not classified: ' + JSON.stringify(hits));

  // RED FIRST, recorded: at HEAD before this lap `scan()` returned nothing for this exact line.
  // The class is keyed on the FIELD, so it also catches a machine whose name contains no person's.
  assert.ok(G.scan('HostName:  BUILD-SERVER-04\n', 'x.md').some((h) => h.cls === 'HOSTNAME'),
    'a hostname with nobody\'s name in it is not caught — then the class is a name rule wearing a '
    + 'hostname\'s label, and the next machine ships');

  const src = fs.readFileSync(path.join(REPO, 'consonance/hooks/dream-watch.test.js'), 'utf8');
  assert.ok(!/ZACHSLEGION/.test(src),
    'the private tree still carries the real hostname. The generator class alone is not enough: '
    + 'this repository is public today.');
});

test('L038 · HOSTNAME: the rewrite keeps the FIELD and replaces only the VALUE', () => {
  /* The bug this test exists for, found by looking at output rather than at the scan: the first
   * version used the `rep()` helper, whose callback return is not `$1`-expanded, so the whole
   * matched line became the literal `$1EXAMPLE-HOST`. Leak gone, scan green, fixture destroyed. */
  for (const kind of ['prose', 'fixture']) {
    const out = G.transform('HostName:      ZACHSLEGION\nCOMPUTERNAME=ZACHSLEGION\n', kind).body;
    assert.ok(!/\$1/.test(out), kind + ': the replacement leaked a `$1` — the field was destroyed, '
      + 'not sanitised: ' + JSON.stringify(out));
    assert.match(out, /^HostName:\s+EXAMPLE-HOST$/m, kind + ': the HostName field no longer parses');
    assert.match(out, /^COMPUTERNAME=EXAMPLE-HOST$/m, kind + ': the COMPUTERNAME field no longer parses');
    assert.strictEqual(G.scan(out, 'x.md').filter((h) => h.cls === 'HOSTNAME').length, 0,
      kind + ': the rewritten line still scans as a hostname — the placeholder is not exempt');
  }
});

test('L038 · a name on the OUTSIDE of a file: the destination path is scanned', () => {
  // The one path in this repo that carries the handle in its NAME. Until this lap it shipped past
  // every class, because `scan()` opened files and never read the label on them.
  const hits = G.scan('nothing whatsoever in this body\n', 'exo_memory/memory/user-solariz3d.md');
  assert.ok(hits.some((h) => h.cls === 'IDENTITY' && h.line === 0),
    'a handle in the destination path is invisible to the scan: ' + JSON.stringify(hits));
  assert.ok(hits.every((h) => !['DANGLING', 'RECORD'].includes(h.cls)),
    'a FILE-naming class was run over a filename — then every shipped file reports as a leak at '
    + 'its own address');
});

test('L038 · and the rename and the LINK to it land on the same string', () => {
  const renamed = G.depath('exo_memory/memory/user-solariz3d.md');
  assert.strictEqual(renamed, 'exo_memory/memory/user-the-keeper.md');
  assert.ok(!G.collect().some((f) => /solariz3d|zackn|trynabemlgzn/i.test(f.to)),
    'a manifest destination still carries a handle');

  /* THE FAILURE THIS PAIR EXISTS FOR, and it happened: with `repath()` ordered after the handle
   * rule, the index in `memory/MEMORY.md` shipped `](user-the keeper.md)` — a link with a SPACE in
   * it, pointing at nothing, produced by the function written to prevent exactly that. */
  const link = G.deidentify('see [profile](user-solariz3d.md) for it\n').body;
  assert.ok(link.includes('](user-the-keeper.md)'),
    'the link and the rename disagree, so the index points at nothing: ' + JSON.stringify(link));
  assert.ok(!/\]\([^)]* [^)]*\)/.test(link), 'the rewritten link contains a space: ' + JSON.stringify(link));
});

test('L038 · dedangle RE-POINTS a dated citation instead of destroying it', () => {
  const one = G.dedangle('see exo_memory/journal/2026-08-17.md:1209 for it').body;
  assert.ok(one.includes('exo_memory/inheritance/2026-08-17.md:1209'),
    'the citation was not re-pointed, and its LINE NUMBER must survive too: ' + one);

  // The bare, extension-less form `carrier-drift.js:659` writes inside a sentence. The first
  // version of the rule required `.md` while the scan pattern did not, so the build refused on a
  // citation the rule existed to fix.
  assert.ok(G.dedangle('the finding (journal/2026-08-17, page 3)').body
    .includes('exo_memory/inheritance/2026-08-17.md'),
    'the extension-less form is not re-pointed, and the scan still refuses it');

  // The prefix is KEPT, not replaced: a reference already inside a path must not gain a second one.
  const nested = G.dedangle('at `606\\exo_memory\\SELF_TRACE.md`').body;
  assert.ok(!/exo_memory[\\/]exo_memory/.test(nested), 'the re-point doubled a path prefix: ' + nested);

  // Running it twice must be a no-op, or a regeneration compounds.
  const twice = G.dedangle(G.dedangle('see journal/2026-08-17.md').body).body;
  assert.ok(!/inheritance[\\/]inheritance/.test(twice), 'the re-point is not idempotent: ' + twice);
});

test('L038 · THE ANTI-LOOSENING GUARD: the re-pointed classes still catch the old form', () => {
  /* The one that matters. A class that catches nothing is worse than one that catches too much,
   * because it reads as passing. Each assertion below is the OLD shape, which must still be a
   * finding, and the NEW shape, which must not. */
  const cls = (body) => G.scan(body, 'exo_memory/x.md').map((h) => h.cls);

  assert.ok(cls('see journal/2026-08-17.md').includes('DANGLING'),
    'journal/<date> is no longer caught — but journal/ ships EMPTY, so that reference dangles');
  assert.ok(cls('see exo_memory/journal/2026-08-17.md').includes('DANGLING'),
    'the prefixed form is no longer caught');
  assert.ok(!cls('see exo_memory/inheritance/2026-08-17.md').includes('DANGLING'),
    'the inheritance path is still flagged, so every re-pointed citation refuses the build');

  assert.ok(cls('the trace at SELF_TRACE.md').includes('RECORD'),
    'a bare SELF_TRACE reference is no longer caught');
  assert.ok(!cls('the trace at exo_memory/inheritance/SELF_TRACE.md').includes('RECORD'),
    'the shipped inheritance path is flagged as a leak at its own address');
  assert.ok(!cls('the trace at 606\\exo_memory\\inheritance\\SELF_TRACE.md').includes('RECORD'),
    'the backslash form of the inheritance path is flagged — separators must be handled both ways, '
    + 'and this exact line refused a build');

  assert.ok(cls('see muscle_map.md').includes('RECORD'),
    'muscle_map does NOT ship, so its class must be untouched by this lap. If uniformity was '
    + 'applied to all three rules, the one that had to stay strict was loosened by tidiness.');
});

test('L038 · the CUTOFF is a pure function of the commit, and a hand-edit is detectable', () => {
  const a = G.renderCutoff('0123456789abcdef0123456789abcdef01234567', '2026-09-06T01:00:00-06:00');
  const b = G.renderCutoff('0123456789abcdef0123456789abcdef01234567', '2026-09-06T01:00:00-06:00');
  assert.strictEqual(a, b, 'two renders of one commit differ — then nothing can be verified by re-render');
  assert.notStrictEqual(a, G.renderCutoff('0123456789abcdef0123456789abcdef01234568', '2026-09-06T01:00:00-06:00'),
    'a different commit renders the same document');

  // It must survive its own pipeline untouched, or the byte comparison could never hold.
  assert.strictEqual(G.transform(a, 'prose').body, a,
    'a transformation edits CUTOFF.md, so --verify-cutoff can never pass on a real tree');

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cutoff-'));
  fs.mkdirSync(path.join(dir, 'exo_memory'), { recursive: true });
  const id = G.commitIdentity();
  const file = path.join(dir, 'exo_memory', 'CUTOFF.md');
  fs.writeFileSync(file, G.renderCutoff(id.sha, id.at));
  assert.deepStrictEqual(G.verifyCutoff(dir), [], 'a freshly generated CUTOFF fails its own check');

  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('ends here', 'ends somewhere'));
  assert.ok(G.verifyCutoff(dir).length, 'a hand-edited CUTOFF passed — the mechanism failed its one job');

  // And an edited DATE is caught too, which is why the date comes from the commit and not the clock.
  fs.writeFileSync(file, G.renderCutoff(id.sha, id.at).replace(id.at, '1999-01-01T00:00:00Z'));
  assert.ok(G.verifyCutoff(dir).length, 'a forged date passed — then the sha is the only field checked');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('L038 · every exo_memory/ entry is in exactly one column', () => {
  const tops = fs.readdirSync(path.join(REPO, 'exo_memory')).sort();
  const reached = new Set();
  // D273 lap 6 AMENDED BY NAME (pane B): one named FILE may ship out of a private column (G.SHIPS_FROM_PRIVATE: loop/checkpoint.py, which the
  // registered PreCompact hook runs), without moving the column. Every such entry must exist and sit under a STAYS_PRIVATE column, or it is no exception.
  for (const [rel] of Object.entries(G.SHIPS_FROM_PRIVATE)) {
    assert.ok(fs.existsSync(path.join(REPO, rel)), rel + ' is named in SHIPS_FROM_PRIVATE and does not exist');
    assert.ok(Object.prototype.hasOwnProperty.call(G.STAYS_PRIVATE, rel.split('/')[1]), rel + ' is named in SHIPS_FROM_PRIVATE but its column is not private');
  }
  for (const f of G.collect()) {
    const m = /^exo_memory\/([^/]+)/.exec(f.from);
    if (m && !G.SHIPS_FROM_PRIVATE[f.from]) reached.add(m[1]);
  }
  for (const t of tops) {
    const inShips = reached.has(t);
    const inPrivate = Object.prototype.hasOwnProperty.call(G.STAYS_PRIVATE, t);
    assert.ok(inShips !== inPrivate,
      'exo_memory/' + t + ' is in ' + (inShips ? 'BOTH columns' : 'NEITHER column')
      + '. C §4 measured 17 files that accumulated in exactly this gap with nothing complaining.');
  }
  // The list must not rot in the other direction either: a declared entry that no longer exists
  // reads as coverage of something that is gone.
  for (const k of Object.keys(G.STAYS_PRIVATE)) {
    assert.ok(tops.includes(k), 'STAYS_PRIVATE names exo_memory/' + k + ', which is not there');
  }
});

test('L038 · SEED gains ONE sentence, and the transform refuses to be inert', () => {
  const seed = fs.readFileSync(path.join(REPO, 'consonance/src-tauri/brief/SEED.md'), 'utf8');
  assert.ok(seed.includes(G.SEED_ANCHOR),
    'SEED.md no longer contains the anchor. The transform cannot fire, and a transform that '
    + 'silently no-ops is the inert guard this file has now found twice.');

  const out = G.reseed(seed, 'exo_memory/SEED.md');
  assert.strictEqual(out.n, 1);
  assert.strictEqual(out.missing, false);
  assert.ok(out.body.includes(G.SEED_ANCHOR + G.SEED_SENTENCE));
  assert.strictEqual((G.SEED_SENTENCE.match(/\. /g) || []).length, 0,
    'the addition is more than one sentence: ' + JSON.stringify(G.SEED_SENTENCE));

  assert.strictEqual(G.reseed(seed, 'exo_memory/BOOT.md').n, 0, 'it fired on a file that is not SEED');
  assert.strictEqual(G.reseed('a document with no anchor in it', 'x/SEED.md').missing, true,
    'a missing anchor reported as fine — then the sentence stops shipping and nothing says so');

  /* AND IT MUST NOT BE WRITTEN INTO THE PRIVATE FILE, which was the obvious alternative: the
   * private tree's journal/ is NOT empty, so the sentence would be false where it lives. */
  assert.ok(!seed.includes('Your journal is empty'),
    'the sentence was written into the master, where it is false — the private journal/ has entries');
});

test('L038 · the status document matches E\'s contract byte for byte', () => {
  /* WHY A CHILD PROCESS. `gen-consumer.build.test.js` registers its tests at module load, so
   * `require()`ing it runs them -- measured at 11 tests, ~1.6 s, and it spawns PowerShell. That is
   * why `gen-consumer.js` carries its own copy of `renderStatusDoc` rather than importing E's, and
   * this test is the price of that decision: the duplication is allowed to exist only because its
   * DRIFT is red. */
  const input = { measured: true, sha: 'f21dbc9', at: '2026-09-06T00:00:00Z',
    js: ['a.test.js — FAILED'], rust: ['arch_test::x'] };
  const out = path.join(os.tmpdir(), 'statusdoc-' + process.pid + '.txt');
  const script = 'const M=require(' + JSON.stringify(path.join(REPO, 'consonance/tools/gen-consumer.build.test.js'))
    + ');require("fs").writeFileSync(' + JSON.stringify(out) + ',M.renderStatusDoc(' + JSON.stringify(input) + '));';
  const r = spawnSync(process.execPath, ['-e', script], { encoding: 'utf8', timeout: 120000 });
  assert.ok(fs.existsSync(out), 'could not render E\'s copy: ' + (r.stderr || '').slice(0, 400));
  assert.strictEqual(G.renderStatusDoc(input), fs.readFileSync(out, 'utf8'),
    'the two copies of the CONSUMER-STATUS contract have drifted. Reconcile them, or move the pair '
    + 'into a module both files require — which is the right end state and is E\'s file to change.');
  fs.rmSync(out, { force: true });

  const unmeasured = G.renderStatusDoc({ measured: false, sha: 'f21dbc9' });
  assert.match(unmeasured, /^STATE: UNMEASURED$/m,
    'a freshly generated tree must declare that nothing in it has been run');
});

test('L038 · the sync-directory rewrite spares the tool built to detect it', () => {
  /* THE WORST OUTCOME AVAILABLE IN THIS LAP, and it is one regex away: `portable-paths.js` holds
   * the literal `OneDrive` in its detector, so a blanket rewrite ships a consumer whose path
   * ratchet is silently blind to the one token it exists for. A guard that reads as passing because
   * it can no longer see is worse than an absent guard, and nothing else in this file would notice. */
  const src = "const RE = /OneDrive/g;   // the detector\n";
  assert.strictEqual(G.desync(src, 'consonance/tools/portable-paths.js', 'code').n, 0,
    'the ratchet\'s own detector was rewritten — the shipped path guard is now blind to OneDrive');
  assert.ok((G.ALLOW['consonance/tools/portable-paths.js'] || []).includes('MACHINE'),
    'the exemption is keyed on ALLOW, so ALLOW must still name this file for MACHINE');

  // A fixture asserts on the paths it tests; rewriting one is the 2026-08-23 damage.
  assert.strictEqual(G.desync(src, 'consonance/tools/whatever.test.js', 'fixture').n, 0,
    'a fixture was rewritten');

  // And it must actually fire on ordinary prose, or it is an exemption with no rule behind it.
  const out = G.desync('the repo lived under OneDrive until July\n', 'exo_memory/inheritance/x.md', 'prose');
  assert.strictEqual(out.n, 1, 'the rewrite did not fire on prose — then 7 journal sites refuse the build');
  assert.ok(out.body.includes('<sync-dir>'), 'the placeholder must match the one demachine() uses');
});

test('L038 · a citation to an inheritance entry that is not in the tree REFUSES', () => {
  /* The half of the dedangle re-point that keeps it from being a loosening. Turning a class that
   * REFUSED into a class that REWRITES is exactly the move this packet warned against: the build
   * still passes and a citation to a date that never shipped now reads as a working link. So the
   * regex was traded for a resolution check against what actually staged, which catches what no
   * pattern can — a typo, a deleted entry, a narrowed dir rule.
   *
   * Exercised on a REAL build rather than a synthetic one, because the thing under test is the
   * relationship between the output and the staging directory. */
  const r = G.build('', { dry: true });
  assert.deepStrictEqual(r.unresolved, [], 'the real tree cites an inheritance entry it does not carry');

  const staged = fs.readdirSync(path.join(r.staging, 'exo_memory', 'inheritance'));
  assert.ok(staged.length > 20, 'only ' + staged.length + ' inheritance entries staged — the dir rule looks narrowed');

  // The mutant the check exists for: a citation nobody shipped.
  const probe = path.join(r.staging, 'exo_memory', 'PROBE.md');
  fs.writeFileSync(probe, 'see exo_memory/inheritance/1999-01-01.md for it\n');
  const dead = (fs.readFileSync(probe, 'utf8').match(/exo_memory\/inheritance\/[A-Za-z0-9_.-]+\.md/g) || [])
    .filter((x) => !fs.existsSync(path.join(r.staging, x)));
  assert.deepStrictEqual(dead, ['exo_memory/inheritance/1999-01-01.md'],
    'the resolution rule cannot see a citation to an entry that is not there');
  try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {}
});

// ── L038 · THE TWO DEFECTS A's ATTACK RETURNED ──────────────────────────────────────────────────

test('L038/A · every rewrite in this file EXPANDS its capture groups', () => {
  /* A's finding, and it is the class I documented ten lines below the site. `demachine()`'s `rep`
   * helper passed a callback to `String.replace`, and a callback's return is not `$1`-expanded — so
   * the rewrite whose replacement ends `...on $1` wrote those two characters where the date belongs.
   * Generated `main.rs:404` has been shipping it since `fa16075`.
   *
   * Asserted on the REAL source line rather than a fixture, because the point of the method that
   * found it is to ask what the transform PRODUCES over real input. */
  const real = '/// appeared. (The historical note this used to carry: the repo moved out of '
    + 'OneDrive on 2026-07-28';
  const out = G.demachine(real);
  assert.strictEqual(out.n, 1, 'the rewrite did not fire at all');
  assert.ok(!/\$\d/.test(out.body), 'a literal $<digit> survived: ' + JSON.stringify(out.body));
  assert.ok(out.body.includes('on 2026-07-28'),
    'the date the capture group exists to preserve was destroyed: ' + JSON.stringify(out.body));
  assert.ok(!/OneDrive/.test(out.body), 'and the leak this rewrite is FOR must still be gone');

  // Every signal was green while it shipped, which is the part worth a second assertion: the scan
  // cannot see this, and never could. Only the output can.
  assert.deepStrictEqual(G.scan('the repo moved out of a personal sync directory on $1\n', 'x.rs'), [],
    'if scan() ever starts catching this, delete the sweep below — but it does not, and that is why '
    + 'the sweep exists');
});

/* The sweep, shared by the fixture test and the real-tree test below. `sourceOf(rel)` returns the
 * text of the source the build produced `rel` from (the manifest's `from`, which for 40 of 344
 * entries is NOT the produced path), or null when there is none.
 *
 * L080 — WHY THE OLD RULE WAS WRONG. It flagged any `$<digit>` on a line without `replace(`, and
 * so read a price in prose as a group expansion. It went red on 2026-09-21 on three lines the build
 * copied byte for byte, none made by any rewrite — e.g. consonance/tools/jev-shadow-runner.js:23,
 * "…at about 10k input tokens and $0.000000042 a token: about $0.011 a run…" (also :59, and
 * jev-ask.test.js:282). And it let through exactly the case its own comment named: a broken
 * rewrite landing on a line containing `replace(`.
 *
 * THE RULE NOW: a `$<digit>` line is flagged unless it appears VERBATIM in its source — a line the
 * build passed through untouched cannot be a broken expansion, because no expansion made it. Every
 * line a rewrite changed is checked, `replace(` or not; a file with no source is checked in full. */
function builtDollarLines(staging, sourceOf) {
  const bad = [];
  const walk = (d, rel) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const a = path.join(d, e.name), q = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) { walk(a, q); continue; }
      if (!/\.(js|md|rs|json|toml|html|css|ps1|py)$/.test(q)) continue;
      let text; try { text = fs.readFileSync(a, 'utf8'); } catch (_) { continue; }
      const src = sourceOf(q);
      const verbatim = new Set(src == null ? [] : src.split('\n'));
      text.split('\n').forEach((line, i) => {
        if (/\$\d/.test(line) && !verbatim.has(line)) bad.push(q + ':' + (i + 1) + '  ' + line.trim().slice(0, 90));
      });
    }
  };
  walk(staging, '');
  return bad;
}

test('L080 · the sweep catches a rewrite that emits a literal $1, and passes a price the build copied verbatim', () => {
  /* A fixture tree made by a REAL broken rewrite — a callback return, which String.replace does not
   * `$1`-expand: L038's exact defect. Four produced files:
   *   a.md   the broken rewrite on prose                          -> must be flagged
   *   b.js   the broken rewrite on a line that contains `replace(` -> must be flagged
   *   c.js   a price and a regex replacement, copied verbatim     -> must NOT be flagged
   *   gen.md a generated file with no source, carrying a $1       -> must be flagged (no source to excuse it) */
  const broken = (s) => s.replace(/moved out of \S+ on (\S+)/, () => 'moved out of a sync directory on $1');
  const src = {
    'a.md': 'the repo moved out of OneDrive on 2026-07-28\n',
    'b.js': "x.replace(/a/, 'b'); // the repo moved out of OneDrive on 2026-07-28\n",
    'c.js': "// about $0.011 a run, ~$0.36 a day at worst\nconst y = s.replace(/(\\d+)/, '<$1>');\n",
  };
  const produced = { 'a.md': broken(src['a.md']), 'b.js': broken(src['b.js']), 'c.js': src['c.js'], 'gen.md': 'on $1\n' };
  assert.ok(produced['a.md'].includes('on $1') && produced['b.js'].includes('on $1'),
    'the fixture rewrite must actually emit a literal $1, or this test proves nothing');
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-consumer-dollar-'));
  try {
    for (const [rel, body] of Object.entries(produced)) fs.writeFileSync(path.join(staging, rel), body);
    const flagged = builtDollarLines(staging, (rel) => (rel in src ? src[rel] : null)).map((l) => l.split(':')[0]);
    assert.deepStrictEqual(flagged.sort(), ['a.md', 'b.js', 'gen.md']);
  } finally { fs.rmSync(staging, { recursive: true, force: true }); }
});

test('L038/A · and the produced tree carries no $<digit> that is not regex source', () => {
  /* A's oracle, aimed back at me. The sweep is over the PRODUCED tree rather than the source,
   * because a rule that fired wrongly cannot hide there.
   *
   * ITS LIMIT, STATED (L080): a `$<digit>` line is legitimate only when it is verbatim in the file
   * the build produced it from (see builtDollarLines). The `replace(` heuristic it replaces read
   * prices as expansions and passed a broken one on a `replace(` line. The unit assertion above
   * pins the mechanism; this is the end-to-end control on it, and the L080 fixture proves it bites. */
  const r = G.build('', { dry: true, allowDirty: true });
  assert.ok(!r.refused, 'the build refused: ' + r.refused);
  const from = new Map(G.collect().map((f) => [f.to.replace(/\\/g, '/'), f.from]));
  const sourceOf = (rel) => {
    const f = from.get(rel);
    if (!f) return null;
    try { return fs.readFileSync(path.join(REPO, f), 'utf8'); } catch (_) { return null; }
  };
  const bad = builtDollarLines(r.staging, sourceOf);
  assert.deepStrictEqual(bad, [], 'a broken group-expansion shipped:\n  ' + bad.join('\n  '));
  try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {}
});

test('L038/A · a dirty tree is REFUSED, because the sha it would stamp is not earned', () => {
  /* A's second finding. The generator reads the WORKING TREE and stamped `git rev-parse HEAD` into
   * the two documents whose whole job is provenance, with no cleanliness check anywhere in the file.
   * Every tree this room has generated carries a commit that does not describe it — and
   * `--verify-cutoff` returned clean over all of them, because the document really is a pure
   * function of a sha that really is in the repo. Tamper-evidence on the label, not on the goods.
   *
   * Asserted as an EQUIVALENCE rather than against a fixed answer, so the test means the same thing
   * on a clean checkout and on a dirty one. A test that only passes while the tree happens to be
   * dirty is a test that stops testing the day it matters. */
  /* THE ORACLE IS GIT, NOT THE FUNCTION UNDER TEST — and the first version of this test got that
   * wrong, which a mutant caught. It read the expected dirtiness from `G.commitIdentity()` and then
   * asserted the build agreed with it. Mutate `commitIdentity` to stop looking at the working tree
   * and BOTH SIDES move together: the guard is compared against itself and the mutant SURVIVES.
   * That is js-suite's E-2 lesson — a control that exercises the fixture instead of the instrument
   * proves nothing about the instrument — committed in the test written to close a provenance hole.
   *
   * So the expectation comes from `git status --porcelain` run here, independently. */
  const porcelain = require('node:child_process')
    .execFileSync('git', ['-C', REPO, 'status', '--porcelain'], { encoding: 'utf8' })
    .split('\n').map((l) => l.trim()).filter(Boolean);
  const reallyDirty = porcelain.length > 0;

  const id = G.commitIdentity();
  assert.strictEqual(id.dirty, reallyDirty,
    'commitIdentity() disagrees with `git status --porcelain` (' + porcelain.length + ' change(s)) — '
    + 'it is not looking at the working tree, and every assertion keyed on it below is vacuous');
  assert.strictEqual(id.changes, porcelain.length, 'and the count it reports is not the real one');

  /* A DRY RUN IS NOT REFUSED, and that boundary is the substance of the fix rather than a
   * convenience. The defect is a TREE ON DISK asserting a provenance it does not have; `--report`
   * produces no tree and prints the unearned state on its own CUTOFF line. Refusing it would make
   * `--allow-dirty` reflexive within the hour, and a flag everyone always passes is a guard
   * switched off with extra steps. So: the dry run must NOT refuse, in either tree state. */
  const dry = G.build('', { dry: true });
  assert.ok(!/uncommitted change/.test(dry.refused || ''),
    'a dry run refused over cleanliness: ' + dry.refused);
  assert.strictEqual(dry.commit.dirty, reallyDirty, 'the report does not carry the tree\'s real state');
  if (dry.staging) { try { fs.rmSync(dry.staging, { recursive: true, force: true }); } catch (_) {} }

  /* THE WRITE IS. Asserted as an EQUIVALENCE against the tree's actual state, so the test means the
   * same thing on a clean checkout and on a dirty one — a test that only passes while the tree
   * happens to be dirty stops testing on the day it matters. */
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-dirty-'));
  const w = G.build(out, {});
  assert.strictEqual(!!w.refused && /uncommitted change/.test(w.refused || ''), reallyDirty,
    reallyDirty
      ? 'the tree has ' + porcelain.length + ' uncommitted change(s) and the WRITE did not refuse'
      : 'the tree is clean and the write refused as though it were not');
  if (reallyDirty) assert.ok(!fs.existsSync(path.join(out, 'exo_memory')),
    'it refused and wrote the tree anyway — the atomic property this borrows from is the whole point');
  if (w.staging) { try { fs.rmSync(w.staging, { recursive: true, force: true }); } catch (_) {} }

  // The override exists and is not silent — that is the whole difference from a bypass.
  // D273 lap 2 AMENDED THIS ROW BY NAME (pane B, 2026-10-08): the override build now goes into its OWN empty directory. The output became a fresh-history
  // git repository, and a directory that already holds a history is refused; on a CLEAN tree the write above made one, so writing again into `out` was
  // refused for that reason and this row (whose subject is dirtiness, not re-use of a directory) failed only when the tree was clean.
  const out2 = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-dirty-override-'));
  const ok = G.build(out2, { allowDirty: true });
  assert.ok(!ok.refused, '--allow-dirty did not lift the refusal: ' + ok.refused);
  assert.match(fs.readFileSync(path.join(out2, 'exo_memory', 'CUTOFF.md'), 'utf8'),
    // D273 lap 5 AMENDED BY NAME (pane B): "the private record" became "the keeper's public record" (the cold read's A9; the keeper ruled lighthouse public, 10-08)
    reallyDirty ? /THIS PROVENANCE IS NOT EARNED/ : /Generated from the keeper's public record at commit/,
    'the written CUTOFF does not describe the state it was generated in');
  if (ok.staging) { try { fs.rmSync(ok.staging, { recursive: true, force: true }); } catch (_) {} }
  fs.rmSync(out, { recursive: true, force: true });
  fs.rmSync(out2, { recursive: true, force: true });
});

test('L038/A · an overridden stamp is legible as one, in both documents', () => {
  const sha = '0123456789abcdef0123456789abcdef01234567';
  const at = '2026-09-06T01:00:00-06:00';
  const clean = G.renderCutoff(sha, at, false);
  const dirty = G.renderCutoff(sha, at, true);
  assert.notStrictEqual(clean, dirty, 'a dirty generation renders the same CUTOFF as a clean one');
  assert.ok(!/NOT EARNED/.test(clean), 'a clean tree is labelled unearned');
  assert.match(dirty, /THIS PROVENANCE IS NOT EARNED/,
    'a reader of CUTOFF.md cannot tell an overridden stamp from an earned one');
  assert.match(dirty, /--allow-dirty/, 'the block must name the flag that produced it');

  // CONSUMER-STATUS: the marker must NOT be a suffix on the sha, because E's own checker requires
  // that line to be bare hex — the obvious encoding is the one that breaks the contract.
  const st = G.renderStatusDoc({ measured: false, sha, dirty: true, changes: 12 });
  assert.match(st, /^GENERATED-FROM: [0-9a-f]{7,40}$/m, 'the sha line no longer satisfies E\'s checker');
  assert.match(st, /^PROVENANCE: UNEARNED/m, 'the status document does not declare the unearned stamp');
  assert.ok(!/PROVENANCE/.test(G.renderStatusDoc({ measured: false, sha })),
    'a clean render carries the dirty marker, so the drift guard against E\'s copy would fail');

  // And the tamper check still works in the dirty mode, including against deleting the block.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cutoff-dirty-'));
  fs.mkdirSync(path.join(dir, 'exo_memory'), { recursive: true });
  const id = G.commitIdentity();
  const file = path.join(dir, 'exo_memory', 'CUTOFF.md');
  fs.writeFileSync(file, G.renderCutoff(id.sha, id.at, true));
  assert.deepStrictEqual(G.verifyCutoff(dir), [], 'a freshly generated DIRTY cutoff fails its own check');
  fs.writeFileSync(file, G.renderCutoff(id.sha, id.at, false));
  assert.deepStrictEqual(G.verifyCutoff(dir), [], 'a freshly generated CLEAN cutoff fails its own check');
  fs.writeFileSync(file, G.renderCutoff(id.sha, id.at, true).replace(/^> .*$/gm, '> (removed)'));
  assert.ok(G.verifyCutoff(dir).length,
    'deleting the UNEARNED block passed — then the override can be laundered into an earned stamp');
  fs.rmSync(dir, { recursive: true, force: true });
});

// ── L038 · THE memory/ CUT — the keeper, 2026-09-06 03:13 ───────────────────────────────────────

// D273 lap 4 AMENDED THIS ROW BY NAME (pane B, 2026-10-08): the list it pins changed. The cold read's C3 (C's rows, handback/p-consumer-fork-C_2026-10-08.md)
// withholds the last two memory/ files, frozen-is-not-dead.md and split-the-work-with-the-panes.md (the keeper's insight and corrections written as the
// seat's own memory), so memory/ now ships only its index, which reindex() leaves empty. The guard's job (a new card goes RED) is unchanged.
test('L038 · memory/ ships exactly the six, and a new card goes RED rather than shipping', () => {
  /* THE GUARD THAT WOULD HAVE CAUGHT THE ONE THE CUT MISSED. The keeper named 11 of the 12 files in
   * memory/; `signal-and-606-night.md` appeared in no list. Under a `dir` rule an unnamed file
   * SHIPS — the exact inverse of this manifest's allow-list default — so "nobody decided" resolves
   * to "it goes to a stranger". That inversion is invisible until someone diffs the directory
   * against the decision, which is what this test does on every run.
   *
   * Pinned to the DECISION, not to the directory. Add a card and this goes red; that is the point,
   * and the red is cheap to clear — one line in either the list or EXCLUDE, with a reason. */
  /* NARROWED 2026-09-06 03:56 — *"yes one master, cards/ ships, drop the retired one."* The 03:13
   * cut kept six; four of those six also lived in `cards/`, so a consumer was getting two copies of
   * four instruments under one name each. `memory/` now ships only what is UNIQUE to it. */
  const KEEPER_SHIPS = [
    'MEMORY.md',                                  // the index, filtered by reindex(): empty since D273 lap 4 (C3)
  ].sort();
  const shipped = G.collect()
    .filter((f) => f.to.startsWith('exo_memory/memory/') && !G.EXCLUDE[f.from])
    .map((f) => path.basename(f.to)).sort();
  assert.deepStrictEqual(shipped, KEEPER_SHIPS,
    'the memory/ cut has drifted from the keeper\'s 2026-09-06 decision. If a card was ADDED it '
    + 'ships by default and nobody ruled on it — decide, then put it in this list or in EXCLUDE '
    + 'with a reason.');

  // And every withheld one carries a reason, because the exclusion list is the thing a person reads
  // to learn what was withheld.
  const onDisk = fs.readdirSync(path.join(REPO, 'exo_memory/memory')).filter((f) => f.endsWith('.md'));
  for (const f of onDisk) {
    const k = 'exo_memory/memory/' + f;
    assert.ok(KEEPER_SHIPS.includes(f) || (G.EXCLUDE[k] && G.EXCLUDE[k].length > 40),
      'exo_memory/memory/' + f + ' is neither shipped nor excluded-with-a-reason');
  }
});

test('L038 · ONE MASTER — no card name ships from two directories at once', () => {
  /* The keeper's 03:56 answer, asserted rather than trusted to the EXCLUDE list staying right. Two
   * copies of one card under one name is maintenance law 1's exact failure — and it was not drift:
   * `claim-your-continuity` was 5,125 B in cards/ against 2,068 in memory/, two different documents
   * wearing one name, with nothing in the tree saying which to recall from. */
  const byName = new Map();
  for (const f of G.collect()) {
    if (G.EXCLUDE[f.from]) continue;
    const m = /^exo_memory\/(cards|memory)\/(.+)\.md$/.exec(f.to);
    if (!m || m[2] === 'MEMORY') continue;
    if (!byName.has(m[2])) byName.set(m[2], []);
    byName.get(m[2]).push(m[1]);
  }
  const doubled = [...byName].filter(([, dirs]) => dirs.length > 1).map(([n]) => n);
  assert.deepStrictEqual(doubled, [],
    'these card names ship from BOTH cards/ and memory/: ' + doubled.join(', ')
    + '. One master — pick it in EXCLUDE, and if the two copies differ, reconcile them by an APPEND',
  );

  assert.ok(G.EXCLUDE['exo_memory/cards/lighthouse-dive-buddy-reframe.md'],
    'the retired dive-buddy card ships again from cards/. It was cut from memory/ on 2026-09-06 and '
    + 'cards/ went on shipping it — cutting a copy without the carrier is the 2026-08-17 failure');
});

test('L038 · a list item that loses its only link loses the ITEM', () => {
  /* A typed edge is not a see-also: the link is the OBJECT of the row. Strip it and the row asserts
   * a relationship while withholding the other end, which is worse than no row. Blast radius was
   * counted before the rule was written — exactly one list item across both card directories. */
  const shipped = new Set(['alive']);
  const edges = [
    '**Edges**',
    '- `a —refines→` [[alive]] — kept',
    '- `a —caught-by→` [[gone]] — the residual costume',
    '- `a —forged-with→` the keeper — no link at all',
    '',
  ].join('\n');
  const r = G.dewiki(edges, 'x.md', shipped);
  assert.ok(r.body.includes('—refines→'), 'the row whose link resolves was dropped');
  assert.ok(!r.body.includes('caught-by'), 'the orphaned edge row survived: ' + JSON.stringify(r.body));
  assert.ok(r.body.includes('—forged-with→'), 'a row with no link at all was dropped');
  assert.ok(!/—\S+→`\s+—/.test(r.body), 'an edge row is left naming no target');

  // A PROSE line keeps its words: only the reference goes, never the sentence.
  const prose = G.dewiki('the method is real. See [[gone]] and [[alive]] for it.\n', 'x.md', shipped);
  assert.ok(prose.body.includes('the method is real.'), 'a prose sentence was deleted with its link');
  assert.ok(prose.body.includes('[[alive]]'), 'the resolving link went too');
});

test('L038 · the index is FILTERED to what shipped, and cannot dangle', () => {
  const shipped = new Set(['a.md', 'b.md']);
  const idx = '# Memory index\n\n- [A](a.md) — kept\n- [Gone](gone.md) — dropped\n- [B](b.md) — kept\n';
  const r = G.reindex(idx, 'exo_memory/memory/MEMORY.md', shipped);
  assert.strictEqual(r.dropped, 1);
  assert.ok(!r.body.includes('gone.md'), 'the index still points at a file that is not there');
  assert.ok(r.body.includes('a.md') && r.body.includes('b.md'), 'it dropped a link that resolves');
  assert.ok(r.body.includes('— kept'), 'the hand-written descriptions must survive the filter');

  assert.strictEqual(G.reindex(idx, 'exo_memory/cards/other.md', shipped).dropped, 0,
    'it fired on a file that is not the index');
  assert.strictEqual(G.reindex('no links at all here\n', 'x/MEMORY.md', shipped).missing, true,
    'an index whose link syntax changed reported as fine — a filter that silently keeps everything '
    + 'looks exactly like one that had nothing to remove');
});

test('L038 · no [[wiki-link]] in the produced tree points at a card that is not there', () => {
  /* The surface the cut broke, and the one no class in this file could see: `[[name]]` is neither a
   * path nor a filename, so dedangle, repath, the exclusion-debt check and scan() all missed it.
   * Measured when the cut landed: 14 dangling links over 4 targets — and FIVE pre-dated the cut,
   * being the wiki form of the markdown-link defect fixed earlier this lap. */
  const r = G.build('', { dry: true, allowDirty: true });
  assert.ok(!r.refused, 'the build refused: ' + r.refused);
  const cards = new Set();
  for (const d of ['exo_memory/cards', 'exo_memory/memory']) {
    let names = []; try { names = fs.readdirSync(path.join(r.staging, d)); } catch (_) {}
    for (const f of names) if (f.endsWith('.md')) cards.add(f.slice(0, -3));
  }
  assert.ok(cards.size > 10, 'only ' + cards.size + ' cards staged — the resolution set looks broken, '
    + 'and an empty one would make every assertion below vacuous');
  const dead = [];
  const walk = (d, rel) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const a = path.join(d, e.name), q = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) { walk(a, q); continue; }
      if (!q.endsWith('.md')) continue;
      for (const m of fs.readFileSync(a, 'utf8').matchAll(/\[\[([^\]\n]+)\]\]/g)) {
        if (!cards.has(m[1])) dead.push(q + '  ->  [[' + m[1] + ']]');
      }
    }
  };
  walk(r.staging, '');
  assert.deepStrictEqual(dead, [], 'dangling wiki-links shipped:\n  ' + dead.join('\n  '));

  /* AND THE OTHER DIRECTION, WHICH A MUTANT CAUGHT ME MISSING. Asserting only that nothing dangles
   * is satisfied perfectly by a rule that strips EVERY link — the null tree has no dead pointers in
   * it. Narrowing the resolution set to `cards/` alone (dropping `memory/`) does exactly that to
   * every memory→memory reference, silently, and it SURVIVED this test until this block existed.
   * A guard that can be satisfied by deleting the thing it guards is not a guard. */
  const live = { total: 0 };
  const walk2 = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const a = path.join(d, e.name);
      if (e.isDirectory()) { walk2(a); continue; }
      if (!e.name.endsWith('.md')) continue;
      for (const m of fs.readFileSync(a, 'utf8').matchAll(/\[\[([^\]\n]+)\]\]/g)) live.total++;
    }
  };
  walk2(r.staging);
  assert.ok(live.total > 10, 'only ' + live.total + ' wiki-links survived in the whole tree — the '
    + 'deck cross-references itself heavily, so this means the rule is stripping links that resolve');
  /* THERE WAS A SECOND ASSERTION HERE and it is withdrawn rather than weakened, because it became
   * FALSE for a real reason. It required a surviving link to point into `memory/`, as a proxy for
   * the resolution set covering both directories. After the 03:56 one-master change `memory/` ships
   * only its two unique cards and nothing links to either, so the proxy reports a narrowed set over
   * a set that is correct. A proxy that fails when the data moves under it was never testing the
   * thing it was written for — and the direct assertion below (`r.linkTargets`) covers the same
   * mutant without depending on which links happen to exist today, which is why it exists. */

  /* AND THE SET ITSELF, because the narrowing above is an EQUIVALENT mutant on today's data: no
   * shipped card links to a memory-only card yet, so cards/-only and cards+memory produce the same
   * bytes and no output test can separate them. It is still the wrong set, and it goes wrong the
   * first time anyone links to frozen-is-not-dead. Assert the SET. */
  // D273 lap 4 AMENDED BY NAME (pane B): this asserted r.linkTargets.includes('frozen-is-not-dead'), the one memory/-only card, which C3 now withholds,
  // so no memory/-only card ships to test with. The same set is asserted on shippedSets(), the function build() uses, with a synthetic memory/ card.
  assert.ok(G.shippedSets([{ from: 'exo_memory/memory/x-only.md', to: 'exo_memory/memory/x-only.md' }]).shippedCards.has('x-only'),
    'the wiki-link resolution set does not cover memory/-only cards, so a future link to one would '
    + 'be silently deleted rather than kept');
  assert.ok(r.linkTargets.includes('never-pathologize-the-user'), 'nor cards/');

  // The unit, so the mechanism is pinned and not only its aggregate.
  const shipped = new Set(['kept']);
  const d1 = G.dewiki('see [[kept]] and [[gone]] for it\n', 'x.md', shipped);
  assert.strictEqual(d1.n, 1, 'it dropped the wrong number of links');
  assert.ok(d1.body.includes('[[kept]]'), 'a link that RESOLVES was stripped: ' + JSON.stringify(d1.body));
  assert.ok(!d1.body.includes('gone'), 'the dead link survived: ' + JSON.stringify(d1.body));
  try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {}
});

test('L038 · no transform changes whether a shipped file ends in a newline', () => {
  /* Found because one did. When a card's last line was its see-also, the stub cleanup swallowed the
   * clause and the trailing newline with it, and a shipped card ended mid-byte — invisible to every
   * leak class, and the kind of thing that surfaces months later as a diff nobody can explain.
   * Swept over the whole tree rather than pinned to the one file, because this will not be the last
   * rule that trims the end of something. */
  const r = G.build('', { dry: true, allowDirty: true });
  const bad = [];
  let checked = 0;
  for (const f of G.collect()) {
    if (G.EXCLUDE[f.from] || !f.to.endsWith('.md')) continue;
    let a, b;
    try {
      a = fs.readFileSync(path.join(REPO, f.from), 'utf8');
      b = fs.readFileSync(path.join(r.staging, f.to), 'utf8');
    } catch (_) { continue; }
    checked++;
    if (/\n$/.test(a) !== /\n$/.test(b)) bad.push(f.to);
  }
  assert.ok(checked > 50, 'only ' + checked + ' files compared — the sweep is not reaching the tree');
  assert.deepStrictEqual(bad, [], 'a transform changed the file ending of: ' + bad.join(', '));
  try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {}
});

/* ============================================================ D273 LAP 2 (pane B, 2026-10-08)
 * The lap-1 parity run (handback/p-consumer-parity-B_2026-10-08.md) put P at 32. Lap 2's rulings
 * (loop/plan_consumer_refresh_2026-10-08.md, "Lap 2"): the output is a fresh-history git repository;
 * state-manifest.json and the root README.md ship; jev/ is EXCLUDED with its tests (Jev retired, D164);
 * one hook point for C's ROLE/PROVENANCE module, whose rule is not written here. */
const { execFileSync } = require('node:child_process');
const gitIn = (dir, args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

test('D273: the Jev tool family does not ship (retired, D164): every consonance/tools/jev-* file is EXCLUDED with a reason; the jev-flags hook still ships', () => {
  const jev = G.collect().map((f) => f.from).filter((r) => /^consonance\/tools\/jev-/.test(r));
  assert.ok(jev.length >= 10, 'the manifest no longer reaches the Jev tools, so this guard proves nothing: ' + jev.length);
  assert.deepStrictEqual(jev.filter((r) => !G.EXCLUDE[r]), [], 'a Jev tool ships');
  for (const r of jev) assert.match(G.EXCLUDE[r], /Jev|D164/, r + ' is excluded without saying why');
  // D273 lap 5 AMENDED BY NAME (pane B): this asserted hooks/jev-flags.js still ships, "because install.ps1 registers it". E's lap 3 (c0748da9) stopped
  // install.ps1 registering and copying it, and the cold read's B7 excludes it; the row now asserts it is excluded (and the D273 lap 5 B7 row checks the reason).
  assert.ok(G.collect().some((f) => f.from === 'consonance/hooks/jev-flags.js') && G.EXCLUDE['consonance/hooks/jev-flags.js'],
    'hooks/jev-flags.js still ships, though install.ps1 no longer registers it and Jev is retired');
});

test('D273: consonance/state-manifest.json and the root README.md ship, and the README keeps the About block the app checks', () => {
  const r = G.build('', { dry: true, allowDirty: true });
  try {
    assert.ok(fs.existsSync(path.join(r.staging, 'consonance/state-manifest.json')), 'state-manifest.json did not ship');
    JSON.parse(fs.readFileSync(path.join(r.staging, 'consonance/state-manifest.json'), 'utf8'));
    const readme = fs.readFileSync(path.join(r.staging, 'README.md'), 'utf8');
    assert.match(readme, /<!-- about:begin/, 'the root README lost the About block ui/about-readme.test.js reads');
    assert.deepStrictEqual(r.leaks, [], 'a new file shipped a leak');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273: the output is a FRESH-HISTORY git repository: one commit, a neutral author, a clean tree, no remote, and a push goes nowhere', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-consumer-git-'));
  try {
    const r = G.build(out, { allowDirty: true });
    assert.ok(!r.refused, 'refused: ' + r.refused);
    assert.strictEqual(gitIn(out, ['rev-list', '--count', 'HEAD']), '1', 'not one commit');
    const who = gitIn(out, ['log', '-1', '--format=%an <%ae> | %cn <%ce>']);
    assert.doesNotMatch(who, /nname|solariz3d|gmail|zacc/i, 'the commit carries a real identity: ' + who);
    assert.strictEqual(gitIn(out, ['status', '--porcelain']), '', 'the generated tree is not all committed');
    assert.strictEqual(gitIn(out, ['remote']), '', 'the generated repository has a remote');
    assert.strictEqual(gitIn(out, ['config', '--get', 'remote.pushDefault']), 'no_push');
    assert.throws(() => execFileSync('git', ['push'], { cwd: out, stdio: 'pipe', timeout: 30000 }), 'a push went somewhere');
    assert.strictEqual(r.git && r.git.sha, gitIn(out, ['rev-parse', 'HEAD']), 'the report does not name the commit it made');
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});

test('D273: generating into a directory that already holds a history is REFUSED before anything is written (fresh history means fresh)', () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-consumer-again-'));
  try {
    gitIn(out, ['init', '-q']); fs.writeFileSync(path.join(out, 'keep.txt'), 'theirs\n');
    const r = G.build(out, { allowDirty: true });
    assert.match(String(r.refused), /history/, 'not refused: ' + r.refused);
    assert.deepStrictEqual(fs.readdirSync(out).sort(), ['.git', 'keep.txt'], 'something was written over it');
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});

test('D273: the FORK hook point sees every text file once with (body, to, kind), never a binary, and the scan reads what it returns', () => {
  const seen = [], prev = G.FORK_HOOK.apply;
  try {
    G.FORK_HOOK.apply = (body, rel, kind) => { seen.push([rel, kind]); return { body, n: 0 }; };
    const r = G.build('', { dry: true, allowDirty: true });
    try {
      // D273 lap 6 AMENDED BY NAME (pane B): a 'legal' file (LICENSE, LEGAL_VERBATIM) ships verbatim, so it never reaches the relabel hook either
      const text = G.collect().filter((f) => !G.EXCLUDE[f.from] && f.kind !== 'binary' && f.kind !== 'screen' && f.kind !== 'legal').length;   // a screen is bytes, like a binary
      assert.strictEqual(seen.length, text, 'the hook did not see each shipped text file once');
      assert.ok(!seen.some(([rel]) => /\.(png|ico)$/.test(rel)), 'a binary reached the hook');
    } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
    // an IDENTITY leak (the keeper's handle), not a path under Users/nname, which SYNTHETIC deliberately exempts as a test-fixture shape
    G.FORK_HOOK.apply = (body, rel) => ({ body: rel === 'exo_memory/SEED.md' ? body + '\nplanted by the hook: solariz3d\n' : body, n: 1 });
    const bad = G.build('', { dry: true, allowDirty: true });
    try { assert.ok(bad.leaks.some((l) => l.rel === 'exo_memory/SEED.md'), 'a leak the hook added was not scanned'); }
    finally { try { fs.rmSync(bad.staging, { recursive: true, force: true }); } catch (_) {} }
  } finally { G.FORK_HOOK.apply = prev; }
});

/* D273 lap 2, A's workshop ruling folded in (handback/p-consumer-workshop-A_2026-10-08.md, "B's exact list"): ship githooks/pre-commit; ship the six
 * composer screens as a SCANNED 'screen' kind (same-length latin1 scrub), never 'binary', which copies unscanned; exclude contamination and tj1-k-render
 * with their tests; declare 15 JS rows and 12 Rust tests WORKSHOP-BOUND in the OUTPUT only, the source untouched so the source suite still runs them. */
const crypto = require('node:crypto');
const SCREENS = 'consonance/src-tauri/fixtures/screens/';
// A's acceptance hashes, evidence/scrubbed_screens.sha256 (sha256 of the scrubbed bytes, lengths unchanged)
const SCREEN_SHA = {
  'composer_empty_2026-09-19.bin': '4cca6b606b8a5f090562b31ff4052375822dffe617f54c64c420b9392871db4f',
  'composer_empty_reads_busy_2026-09-09.bin': '07dd5a69bc1c8183f71ca70aeae1741f6f112953f52741d5edb233ca75ddecc9',
  'composer_has_pasted_text_2026-09-19.bin': 'ad26f7c3fa27599a6c7b14b9d67d4fa7469e0289d9d262c546d492372c1b5f2f',
  'composer_placeholder_reads_as_text_2026-09-19.bin': '709ffcab1ebf813c383381c38c21293b80acf08edc9ce2fd330b3134cbc778ba',
  'composer_slash_command_reads_empty_2026-09-09.bin': '256716215475dae2130b28017519718fd8d4dfccf56b801f215a8c4afdded268',
  'composer_unreadable_trust_dialog_2026-09-19.bin': 'cc48696508251201f930ccf28daa29507aa99fe5e28619ff2137124d3f87db85',
};
const dryStaged = () => G.build('', { dry: true, allowDirty: true });

test('D273/A: the six composer screens ship SCRUBBED, byte for byte A\'s acceptance hashes, each the length of its source', () => {
  const r = dryStaged();
  try {
    assert.ok(!r.refused, r.refused);
    for (const [name, sha] of Object.entries(SCREEN_SHA)) {
      const out = fs.readFileSync(path.join(r.staging, SCREENS + name)), src = fs.readFileSync(path.join(REPO, SCREENS + name));
      assert.strictEqual(out.length, src.length, name + ' changed length');
      assert.strictEqual(crypto.createHash('sha256').update(out).digest('hex'), sha, name + ' is not A\'s scrubbed bytes');
    }
    assert.deepStrictEqual(r.leaks.filter((l) => l.rel.startsWith(SCREENS)), [], 'a screen shipped a leak');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273/A: a screen is a WHOLE fixture, scrubbed same-length, and what the scrub cannot remove is a leak the scan reports', () => {
  assert.strictEqual(G.fixtureKind(SCREENS + 'x.bin'), 'whole');
  const raw = Buffer.from('cwd C:\\Consonance\\lighthouse user zackn tz America/Regina', 'latin1');
  const s = G.descreen(raw);
  assert.strictEqual(s.buf.length, raw.length, 'the scrub moved a byte');
  assert.strictEqual(s.buf.toString('latin1'), 'cwd C:\\Consonance\\workspaces user alice tz America/Denver');
  const left = G.descreen(Buffer.from('the handle solariz3d is not in the scrub map', 'latin1'));
  assert.ok(G.scan(left.buf.toString('latin1'), SCREENS + 't.bin').some((l) => l.cls === 'IDENTITY'), 'an unscrubbed identity in a screen would ship unseen');
});

test('D273/A: githooks/pre-commit ships, LF, as the shell script commit-gate names', () => {
  const r = dryStaged();
  try {
    const t = fs.readFileSync(path.join(r.staging, 'consonance/githooks/pre-commit'), 'utf8');
    assert.match(t, /^#!\/bin\/sh/); assert.ok(!t.includes('\r'), 'CRLF in a sh script'); assert.match(t, /commit-gate\.js/);
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273/A: contamination and tj1-k-render do not ship, with their tests, each saying why', () => {
  for (const n of ['contamination.js', 'contamination.test.js', 'tj1-k-render.js', 'tj1-k-render.test.js']) {
    assert.ok(G.collect().some((f) => f.from === 'consonance/tools/' + n), n + ' is reached by no rule, so the exclusion proves nothing');
    assert.match(G.EXCLUDE['consonance/tools/' + n] || '', /run2/, n + ' ships or has no reason');
  }
});

// D273 lap 3 AMENDED THIS ROW BY NAME (pane B, 2026-10-08): it was "D273/A: the declared JS rows (15 of A + 1 Jev) and 12 Rust tests are declared in
// the OUTPUT, and plain in the SOURCE so the source suite still runs them". A's lap-3 ruling (lap3_generator.patch) declares 11 more JS rows, from the
// five record-shaped members (corpus-age 4, librarian-notes 2, second-vantage 2, shelf-recursion 3); the counts below follow it.
test('D273/A: the declared JS rows (26 of A + 1 Jev) and 12 Rust tests are declared in the OUTPUT, and plain in the SOURCE so the source suite still runs them', () => {
  const r = dryStaged();
  try {
    assert.ok(!r.refused, r.refused);
    let js = 0, rs = 0;
    for (const [rel, rows] of Object.entries(G.WORKSHOP.js)) {
      const out = fs.readFileSync(path.join(r.staging, rel), 'utf8'), src = fs.readFileSync(path.join(REPO, rel), 'utf8');
      for (const [call] of rows) {
        assert.strictEqual(src.split(call).length - 1, 1, rel + ': the source no longer holds ' + call);
        assert.ok(!src.includes('WORKSHOP-BOUND'), rel + ': the declaration leaked into the source');
        // a node:test row keeps its call with the skip option inserted after it; an own-runner row's call is replaced by the printing wrapper
        const left = out.split(call).length - 1;
        assert.ok(left === 0 || (left === 1 && out.includes(call + '{ skip: "')), rel + ': the row still runs in the output: ' + call);
        js++;
      }
      assert.strictEqual((out.match(/(WORKSHOP-BOUND|EXCLUDED-WITH-JEV): /g) || []).length, rows.length, rel + ': declared rows do not match the declarations');
    }
    for (const [rel, names] of Object.entries(G.WORKSHOP.rust)) {
      const out = fs.readFileSync(path.join(r.staging, rel), 'utf8');
      for (const [name] of names) { assert.match(out, new RegExp('#\\[ignore = "WORKSHOP-BOUND: [^"]+"\\]\\s*\\n\\s*fn ' + name + '\\(\\)'), rel + ': ' + name); rs++; }
    }
    // A's 15 lap-2 rows and 11 lap-3 rows, plus jev-flags' one row that compares with the excluded jev-room.js (labelled EXCLUDED-WITH-JEV, not workshop).
    // D273 lap 4 AMENDED BY NAME (pane B): + front-door-links.test.js's evidence row (E's test; its GATES.md evidence links name files of the keeper's
    // record, which the consumer does not carry by ruling), 28 in all. The count follows the declarations.
    // D273 lap 5 AMENDED BY NAME (pane B): jev-flags.test.js no longer ships (B7), so its one EXCLUDED-WITH-JEV declaration goes with it: 27.
    // D273 lap 5 AMENDED AGAIN (pane B): + carrier-drift.test.js's ten rows that read the room's registry or history (the file was red in the source
    // too until 6d12f9fa, which hid them from the parity count): 37.
    assert.deepStrictEqual([js, rs], [37, 12]);
    assert.deepStrictEqual([r.declared.js, r.declared.rust], [37, 12]);
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273/A: a declaration whose anchor is gone is REFUSED, not silently skipped', () => {
  const d = G.declareWorkshop('test(\'a renamed row\', () => {});\n', 'consonance/hooks/reply-slot.test.js');
  assert.deepStrictEqual(d.missing.length, 1, 'a declaration that matched nothing was not reported');
  const ok = G.declareWorkshop("const test = require('node:test');\ntest('PLAN: the plan the hook cites exists', () => { x(); });\n", 'consonance/hooks/reply-slot.test.js');
  assert.deepStrictEqual([ok.missing, ok.n], [[], 1]);
  assert.match(ok.body, /test\('PLAN: the plan the hook cites exists', \{ skip: "WORKSHOP-BOUND: [^"]+" \}, \(\) =>/);
});

test('D273: a markdown LINK whose target is a record path becomes its text and the prose, never a link to prose (the root README carried 13)', () => {
  /* Found by arch_test::every_relative_link_in_the_docs_exists_in_a_fresh_clone on the lap-2 generated tree, the first one with the root README.md:
   * dedangle rewrote the TARGET of [text](exo_memory/loop/x.md) to prose and left the link syntax, so the README linked to
   * "(a registration in this line of record)" 13 times. */
  const { body, n } = G.dedangle('see [the plan](exo_memory/loop/plan_x_2026-10-01.md), [B](../exo_memory/handback/p-x-B_2026-10-01.md:12), '
    + '[the map](exo_memory/map/B.md) and [a note](exo_memory/librarian/2026-10-01.md); keep [GUIDE](consonance/GUIDE.md).\n');
  assert.strictEqual(body, 'see the plan (a registration in this line of record), B (a hand-back in this line of record), '
    + 'the map (a map entry in this line of record) and a note (a librarian entry in this line of record); keep [GUIDE](consonance/GUIDE.md).\n');
  assert.strictEqual(n, 4);
  assert.doesNotMatch(body, /\]\(a (registration|hand-back|map entry|librarian entry) in this line of record\)/);
});

test('D273 lap 3: METHOD.md, INSTRUMENTS.md, dev/SPINE.md and consonance/AUTONOMY.md ship through the scan, and the README links no excluded jev/README.md', () => {
  /* The librarian's ruling 1 on B's lap-2 list (loop/plan_consumer_refresh_2026-10-08.md): ship the four system docs the READMEs link (they pass the
   * generator's scan or they don't ship); the root README's two jev/README.md links come out in source, since jev/ is excluded. */
  const r = G.build('', { dry: true, allowDirty: true });
  try {
    assert.ok(!r.refused, r.refused);
    for (const rel of ['METHOD.md', 'INSTRUMENTS.md', 'dev/SPINE.md', 'consonance/AUTONOMY.md']) {
      assert.ok(fs.existsSync(path.join(r.staging, rel)), rel + ' did not ship');
      assert.deepStrictEqual(r.leaks.filter((l) => l.rel === rel), [], rel + ' shipped a leak');
    }
    assert.doesNotMatch(fs.readFileSync(path.join(r.staging, 'README.md'), 'utf8'), /\]\((\.\.\/)*jev\//, 'the README links into the excluded jev/');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 3 (A\'s catch): the GENERATED corrections-gate.js guards exactly what the source one guards (the muscle_map rule had emptied its regex)', () => {
  /* A, lap 3 (handback/p-consumer-workshop-A_2026-10-08_evidence/lap3_generator.patch): dedangle's bare-token muscle_map rule rewrote
   * corrections-gate.js:51 `const GUARDED = [/muscle_map\.md$/i];` into a regex for "this line of record.md", which matches no file, so the gate
   * guarded nothing in the consumer. Compared by BEHAVIOUR on both trees' own modules, not by the line's text. */
  const r = G.build('', { dry: true, allowDirty: true });
  try {
    assert.ok(!r.refused, r.refused);
    const src = require(path.join(REPO, 'consonance/tools/corrections-gate.js')).GUARDED;
    const out = require(path.join(r.staging, 'consonance/tools/corrections-gate.js')).GUARDED;
    const paths = ['exo_memory/muscle_map.md', 'deep/dir/muscle_map.md', 'MUSCLE_MAP.MD', 'exo_memory/this line of record.md', 'README.md', 'muscle_map.md.bak'];
    const hits = (G2) => paths.map((p) => G2.some((re) => re.test(p)));
    assert.ok(hits(src).some(Boolean), 'control: the source gate guards something');
    assert.deepStrictEqual(hits(out), hits(src), 'the generated gate guards a different set of files');
    assert.deepStrictEqual(out.map(String), src.map(String), 'the generated regexes differ from the source ones');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 3 (C): consumer-relabel.js and its two tests do not ship, each with C\'s reason', () => {
  const want = {
    'consonance/tools/consumer-relabel.js': /property of the generator/,
    'consonance/tools/consumer-relabel.test.js': /dev briefs/,
    'consonance/tools/consumer-fork-wiring.test.js': /gen-consumer\.js, which does not ship/,
  };
  for (const [rel, re] of Object.entries(want)) {
    assert.ok(G.collect().some((x) => x.from === rel), rel + ' is reached by no rule, so the exclusion proves nothing');
    assert.match(G.EXCLUDE[rel] || '', re, rel + ' ships, or its reason is not C\'s');
  }
});

test('D273 lap 3: brief/frag-fork.md ships byte for byte (main.rs include_str!s it in a test, and the generated tree did not compile its tests without it)', () => {
  /* Found by the lap-3 parity run: `cargo test` in the generated tree failed to compile, "couldn't read src\\../brief/frag-fork.md" at main.rs's
   * fork-note test (C's lap 3). It is a TEMPLATE ({FORK_SHA}, {FORK_DATE}) that consumer-relabel.js fills into BOOT and SEED; the file itself must
   * reach the consumer untouched, so its marker and end lines stay byte-identical to what main.rs pins. */
  const r = G.build('', { dry: true, allowDirty: true });
  try {
    const rel = 'consonance/src-tauri/brief/frag-fork.md';
    assert.ok(fs.existsSync(path.join(r.staging, rel)), rel + ' did not ship');
    assert.strictEqual(fs.readFileSync(path.join(r.staging, rel), 'utf8'), fs.readFileSync(path.join(REPO, rel), 'utf8'), rel + ' was transformed');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 3: dev/shell/install-fresh-home.test.js ships beside the install.ps1 it tests (E, lap 2)', () => {
  assert.ok(G.collect().some((x) => x.from === 'dev/shell/install.ps1'), 'control: install.ps1 ships');
  assert.ok(G.collect().some((x) => x.from === 'dev/shell/install-fresh-home.test.js' && !G.EXCLUDE[x.from]), 'the test of a shipped installer does not ship');
});

test('D273 lap 3: decoordinate swaps America/Regina for a zone that keeps the CLOCK (UTC-6, no daylight time), so time-keyed fixtures keep their meaning', () => {
  /* Found by the lap-3 parity: usage.test.js ("America/Regina (UTC-6, no daylight time), so every boundary below is exact") and third-place-gate.test.js
   * (the pulse "Mon, 10/05/2026, 11:00 AM" byte for byte) were red ONLY in the consumer, because decoordinate turned the keeper's zone into
   * America/New_York (UTC-5, with daylight time) inside their fixtures. The location still goes; the clock stays. */
  const out = G.decoordinate("const TZ = 'America/Regina';").body;
  const zone = (out.match(/'([A-Za-z_]+\/[A-Za-z_]+)'/) || [])[1];
  assert.ok(zone && zone !== 'America/Regina', 'the keeper\'s zone still ships: ' + out);
  for (const ms of [Date.UTC(2026, 0, 5, 17, 0), Date.UTC(2026, 6, 5, 17, 0), Date.UTC(2026, 9, 5, 5, 30)]) {
    const at = (tz) => new Date(ms).toLocaleString('en-US', { timeZone: tz });
    assert.strictEqual(at(zone), at('America/Regina'), zone + ' renders a different clock than America/Regina at ' + new Date(ms).toISOString());
  }
});

test('D273 lap 3: the OS-user rule does not eat a "\\n" escape followed by name = (it broke gen-consumer.build.test.js\'s control crate), and still takes every real path', () => {
  /* Found by the lap-3 parity: in the consumer, gen-consumer.build.test.js's control crate '[package]\nname = "linksnot"' had become
   * '[package]\other = "linksnot"' ("\n" + "name" reads as "nname" to /\bnname\b/), so cargo refused the TOML and the oracle test failed there only. */
  const crate = "'[package]\\nname = \"linksnot\"\\nversion = \"0.0.0\"\\n'";
  for (const fn of [G.deidentifyTokens, G.deidentify]) assert.strictEqual(fn(crate).body, crate, (fn.name) + ' rewrote a TOML key after a \\n escape');
  assert.deepStrictEqual(G.scan(crate + '\n', 'consonance/tools/x.test.js').filter((l) => l.cls === 'IDENTITY'), [], 'the scan reads the escape as the OS user');
  for (const leak of ['C:\\\\Users\\\\nname\\\\Desktop', 'C:\\Users\\nname\\Desktop', 'C:/Users/nname/x', 'user nname here', 'home\\nname']) {
    assert.ok(!/\bnname\b/.test(G.deidentifyTokens(leak).body), 'a real OS-user path survived deidentifyTokens: ' + leak);
    assert.ok(!/\bnname\b/.test(G.deidentify(leak).body), 'a real OS-user path survived deidentify: ' + leak);
  }
});

test('D273: consonance/GATES.md ships, and the gate refusals\' pointer resolves to it in the generated tree', () => {
  /* C's identity-diff, first real run (handback/p-consumer-fork-C_2026-10-08.md, "Owed to B"): GATES.md was ruled to ship in lap 2 and its MANIFEST
   * row never landed, so in the consumer every gate refusal pointed at a file that was not there (sources-gate's gatesDocFrom falls back to
   * "consonance/GATES.md (in the Consonance repository)"). Checked with the GENERATED hook's own resolver, against the generated tree. */
  const r = G.build('', { dry: true, allowDirty: true });
  try {
    assert.ok(!r.refused, r.refused);
    const gates = path.join(r.staging, 'consonance', 'GATES.md');
    assert.ok(fs.existsSync(gates), 'consonance/GATES.md did not ship');
    assert.deepStrictEqual(r.leaks.filter((l) => l.rel === 'consonance/GATES.md'), [], 'GATES.md shipped a leak');
    const SG = require(path.join(r.staging, 'consonance', 'hooks', 'sources-gate.js'));
    assert.strictEqual(SG.gatesDocFrom(path.join(r.staging, 'exo_memory', 'BOOT.md'), fs.existsSync), gates, 'the refusal pointer does not resolve to the shipped GATES.md');
    for (const hook of ['sources-gate.js', 'reply-slot.js']) {
      assert.match(fs.readFileSync(path.join(r.staging, 'consonance', 'hooks', hook), 'utf8'), /GATES\.md/, hook + ' no longer names GATES.md, so this check proves nothing');
    }
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273: identity-diff.js and its test do not ship (they need gen-consumer.js and the dev tree, as consumer-relabel does)', () => {
  for (const rel of ['consonance/tools/identity-diff.js', 'consonance/tools/identity-diff.test.js']) {
    assert.ok(G.collect().some((x) => x.from === rel), rel + ' is reached by no rule, so the exclusion proves nothing');
    assert.match(G.EXCLUDE[rel] || '', /gen-consumer\.js/, rel + ' ships, or its reason does not say why');
  }
});

test('D273: shippedSets() is exported and is what build() uses, so identity-diff can read it instead of copying (C, item 3)', () => {
  const s = G.shippedSets(G.collect());
  assert.ok(s.shippedMemory instanceof Set && s.shippedCards instanceof Set, 'not two Sets');
  assert.ok(s.shippedCards.size > 5, 'the card set is empty, so this check proves nothing');
  const r = G.build('', { dry: true, allowDirty: true });
  try { assert.deepStrictEqual([...s.shippedCards].sort(), r.linkTargets, 'build() uses a different card set'); }
  finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});


/* ============================================================ D273 LAP 4 (pane B): the cold read's generator items
 * handback/p-consumer-coldread-LIB_2026-10-08.md (A1, A2, A4, A13, A14, A15) and loop/plan_consumer_refresh_2026-10-08.md "Cold read, IN". */
const lap4 = () => G.build('', { dry: true, allowDirty: true });
const walkText = (root) => { const out = []; const w = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) w(p); else if (!/\.(bin|png|ico|lock)$/.test(e.name)) out.push(p); } }; w(root); return out; };

// REVISED within lap 4 (the chair, from E's front-door hand-back): the root cause is the handle rule rewriting the handle INSIDE the URL. github.com/solariz3d/<repo>
// URLs are exempt and survive intact (lighthouse carries the evidence GATES.md links to; consonance is the consumer), rather than being rewritten to consonance.
// Only the README's own clone instructions become the consumer's: `git clone …/solariz3d/consonance.git` and `cd consonance/consonance` (A2).
test('D273 lap 4 (A1, A2): github.com/solariz3d/<repo> URLs survive intact, no generated URL holds a space, and the clone instructions are the consumer\'s', () => {
  assert.strictEqual(G.deidentify('see github.com/solariz3d/lighthouse and solariz3d alone').body, 'see github.com/solariz3d/lighthouse and the keeper alone');
  assert.strictEqual(G.deidentifyTokens('https://github.com/solariz3d/lighthouse/blob/main/x.md').body, 'https://github.com/solariz3d/lighthouse/blob/main/x.md');
  assert.strictEqual(G.deidentify('https://github.com/solariz3d/consonance').body, 'https://github.com/solariz3d/consonance');
  for (const u of ['git clone https://github.com/solariz3d/consonance.git\n', 'see https://github.com/solariz3d/lighthouse/blob/main/x.md\n']) {
    assert.deepStrictEqual(G.scan(u, 'README.md').filter((l) => l.cls === 'IDENTITY'), [], 'a github.com/solariz3d/<repo> URL reads as a leak: ' + u);
  }
  assert.ok(G.scan('the handle solariz3d alone\n', 'README.md').some((l) => l.cls === 'IDENTITY'), 'the bare handle is no longer caught');
  const r = lap4();
  try {
    const bad = [];
    for (const p of walkText(r.staging)) {
      const t = fs.readFileSync(p, 'utf8');
      for (const m of t.matchAll(/github\.com\/([^\s/)\]"'<>]+)(\s+[^\s/)\]"'<>]+)?\//g)) if (m[2]) bad.push(path.relative(r.staging, p) + ': ' + m[0]);
    }
    assert.deepStrictEqual(bad, [], 'a generated URL holds a space');
    const readme = fs.readFileSync(path.join(r.staging, 'README.md'), 'utf8');
    assert.match(readme, /git clone https:\/\/github\.com\/solariz3d\/consonance\.git/);
    assert.match(readme, /cd consonance\/consonance/); assert.doesNotMatch(readme, /cd lighthouse\//, 'the clone folder is still called lighthouse');
    assert.match(readme, /\(https:\/\/github\.com\/solariz3d\/lighthouse\)/, 'the README\'s link to the lighthouse repository did not survive intact');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 4: the app id com.solariz3d.consonance becomes com.consonance.app everywhere it ships, so stick-waiter registers the id tauri.conf carries', () => {
  assert.strictEqual(G.deidentify("const APP_ID = 'com.solariz3d.consonance';").body, "const APP_ID = 'com.consonance.app';");
  const r = lap4();
  try {
    const conf = JSON.parse(fs.readFileSync(path.join(r.staging, 'consonance/src-tauri/tauri.conf.json'), 'utf8'));
    const waiter = fs.readFileSync(path.join(r.staging, 'dev/stick-waiter.js'), 'utf8');
    assert.ok(waiter.includes("const APP_ID = '" + conf.identifier + "';"), 'stick-waiter registers another id than the bundle: ' + conf.identifier);
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 4 (A4): a link whose TEXT is the record path becomes the prose ONCE, never "(a registration…) (a registration…)"', () => {
  for (const s of ['[`exo_memory/loop/plan_x_2026-10-01.md`](exo_memory/loop/plan_x_2026-10-01.md)', '[exo_memory/loop/plan_x_2026-10-01.md](exo_memory/loop/plan_x_2026-10-01.md)']) {
    assert.strictEqual(G.dedangle('see ' + s + '.').body, 'see a registration in this line of record.', s);
  }
  const r = lap4();
  try {
    const doubled = [];
    for (const p of walkText(r.staging)) {
      const t = fs.readFileSync(p, 'utf8');
      if (/in this line of record\)? \(a (registration|hand-back|map entry|librarian entry) in this line of record/.test(t)) doubled.push(path.relative(r.staging, p));
    }
    assert.deepStrictEqual(doubled, [], 'a placeholder is still doubled');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 4 (A13): the USB mode ships, scanned: the stick scripts, launch.ps1 and their tests, finding the repo the way the app does', () => {
  const ship = ['dev/stick-apply.js', 'dev/stick-waiter.js', 'dev/tail-carry.js', 'dev/place-conversations.js', 'dev/LEAVING.ps1', 'dev/ARRIVING.ps1', 'dev/ON-EXIT.ps1',
    'consonance/launch.ps1', 'dev/stick-apply.test.js', 'dev/stick-waiter.test.js', 'dev/tail-carry.test.js', 'dev/place-conversations.test.js',
    'consonance/launch.fuse.test.js', 'consonance/launch.park.test.js'];
  const r = lap4();
  try {
    assert.ok(!r.refused, r.refused);
    for (const rel of ship) {
      assert.ok(fs.existsSync(path.join(r.staging, rel)), rel + ' did not ship');
      assert.deepStrictEqual(r.leaks.filter((l) => l.rel === rel), [], rel + ' shipped a leak');
    }
    for (const rel of ['dev/LEAVING.ps1', 'dev/ARRIVING.ps1']) {
      const out = fs.readFileSync(path.join(r.staging, rel), 'utf8');
      assert.ok(!out.includes('%CONSONANCE_HOME%') && !/Users\\other/.test(out), rel + ' ships a machine path the generator could only placeholder');
      assert.match(fs.readFileSync(path.join(REPO, rel), 'utf8'), /\.consonance\.json/, rel + ' does not find the repo through ~/.consonance.json');
    }
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 4 (A14): the docs that name catch-ledger.js say this copy does not carry it; tools/README names resonance/atoms.jsonl as the data folder\'s', () => {
  const r = lap4();
  try {
    assert.ok(!r.refused, r.refused);
    // TRAINING.md is wake material: identity-diff counted the note there as UNREGISTERED (no registered step makes it), so its catch-ledger lines are
    // C's relabel table's to change, not this rewrite's. tools/README.md is not a wake file.
    for (const rel of ['consonance/tools/README.md']) {
      const t = fs.readFileSync(path.join(r.staging, rel), 'utf8');
      assert.ok(t.includes('catch-ledger.js'), 'control: ' + rel + ' names catch-ledger.js');
      assert.match(t, /not carry it|not in this copy/, rel + ' presents catch-ledger.js as if it were here');
    }
    assert.match(fs.readFileSync(path.join(r.staging, 'consonance/tools/README.md'), 'utf8'), /resonance\/atoms\.jsonl\x60 in the data folder/);
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 4 (A15): CONSUMER-STATUS\'s GATE line says the gate runs in the source repository, which carries the generator this tree lacks', () => {
  for (const measured of [false, true]) {
    const doc = G.renderStatusDoc({ measured, sha: 'f21dbc9', at: 'now', js: [], rust: [] });
    const gate = (doc.match(/^GATE:.*$/m) || [''])[0];
    assert.match(gate, /source repository/, 'the GATE line names a command as if it ran here: ' + gate);
    assert.match(gate, /gen-consumer\.build\.test\.js --gate/, 'the GATE line no longer names the command');
  }
});

test('D273 lap 4 (C, the cold read C3/C4): a new user\'s memory starts blank: the generated memory/ holds only MEMORY.md, with no entries', () => {
  /* C's three rows (handback/p-consumer-fork-C_2026-10-08.md, "Owed to B"): split-the-work-with-the-panes.md and frozen-is-not-dead.md shipped the
   * keeper's corrections and insight written as the seat's own memory, and cards/dont-offer-rest-assume-momentum.md one person's temperament as a
   * rule (its general form, never-pathologize-the-user.md, ships). The index is filtered to what ships (reindex), so it must come out empty. */
  for (const rel of ['exo_memory/memory/split-the-work-with-the-panes.md', 'exo_memory/memory/frozen-is-not-dead.md', 'exo_memory/cards/dont-offer-rest-assume-momentum.md']) {
    assert.match(G.EXCLUDE[rel] || '', /D273 lap 4, the cold read C[34]/, rel + ' ships, or its reason is not C\'s');
  }
  const r = G.build('', { dry: true, allowDirty: true });
  try {
    assert.ok(!r.refused, r.refused);
    assert.deepStrictEqual(fs.readdirSync(path.join(r.staging, 'exo_memory', 'memory')), ['MEMORY.md'], 'memory/ ships more than its index');
    const idx = fs.readFileSync(path.join(r.staging, 'exo_memory', 'memory', 'MEMORY.md'), 'utf8');
    assert.deepStrictEqual(idx.split('\n').filter((l) => /^\s*-\s*\[/.test(l)), [], 'the shipped index still lists entries');
    assert.ok(fs.existsSync(path.join(r.staging, 'exo_memory', 'cards', 'never-pathologize-the-user.md')), 'the general form of the excluded card does not ship');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});


/* ============================================================ D273 LAP 5 (pane B): cold read 2's generator items
 * handback/p-consumer-coldread2-LIB_2026-10-09.md (A2, A3, A7, A9, B7, C4) and loop/plan_consumer_refresh_2026-10-08.md "Cold read 2, IN". */
const lap5 = (opts = {}) => G.build('', { dry: true, allowDirty: true, ...opts });
const PUB = 'https://github.com/solariz3d/lighthouse';

test('D273 lap 5 (C4): the keeper\'s two record files ship in inheritance/, not record/, and no shipped text points at their old place', () => {
  const r = lap5();
  try {
    assert.ok(!r.refused, r.refused);
    for (const n of ['retired_seats_2026-09-11.md', 'third_place_prehistory_2026-08-30.md']) {
      assert.ok(fs.existsSync(path.join(r.staging, 'exo_memory', 'inheritance', n)), n + ' is not in inheritance/');
      assert.ok(!fs.existsSync(path.join(r.staging, 'exo_memory', 'record', n)), n + ' still ships in record/ (carried whole as SYSTEM)');
    }
    const stale = walkText(r.staging).filter((p) => /record\/(retired_seats_|third_place_prehistory_)/.test(fs.readFileSync(p, 'utf8')));
    assert.deepStrictEqual(stale.map((p) => path.relative(r.staging, p)), [], 'a shipped file still points at record/ for them');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 5 (A2): CONSUMER-STATUS.md ships only MEASURED (parity, identity-diff, cold read), for this commit; unmeasured it does not ship', () => {
  const r = lap5();
  try { assert.ok(!fs.existsSync(path.join(r.staging, 'CONSUMER-STATUS.md')), 'an UNMEASURED status still ships'); }
  finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
  const sha = G.commitIdentity().sha;
  const measured = { sha, at: '2026-10-09T04:00:00-06:00', parity: { P: 0, M: 0, B: 0 }, rust: 0, identity: 'PASS, 73 wake files, 0 unregistered', coldRead: 'cold read 2: FAIL on identity (C1)' };
  const m = lap5({ measured });
  try {
    assert.ok(!m.refused, m.refused);
    const doc = fs.readFileSync(path.join(m.staging, 'CONSUMER-STATUS.md'), 'utf8');
    assert.match(doc, /^STATE: MEASURED$/m); assert.match(doc, new RegExp('^GENERATED-FROM: ' + sha + '$', 'm'));
    assert.match(doc, /PARITY: \(P, M, B\) = \(0, 0, 0\)/); assert.match(doc, /RUST: 0/); assert.match(doc, /IDENTITY-DIFF: PASS, 73 wake files/); assert.match(doc, /COLD READ: cold read 2: FAIL/);
  } finally { try { fs.rmSync(m.staging, { recursive: true, force: true }); } catch (_) {} }
  const bad = lap5({ measured: { ...measured, sha: '0'.repeat(40) } });
  try { assert.match(String(bad.refused), /measured/, 'a measurement of another commit was accepted: ' + bad.refused); }
  finally { try { if (bad.staging) fs.rmSync(bad.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 5 (A3): a record link and a commit sha that are on the PUBLIC lighthouse main become links there; anything not public stays as it was', () => {
  const t = G.transform('Report: [`exo_memory/loop/night_report_2026-09-19.md`](exo_memory/loop/night_report_2026-09-19.md) (`1768ea4`).\n', 'prose').body;
  assert.ok(t.includes('](' + PUB + '/blob/main/exo_memory/loop/night_report_2026-09-19.md)'), t);
  assert.ok(t.includes('](' + PUB + '/commit/1768ea4)'), t);
  assert.doesNotMatch(t, /a registration in this line of record/, 'a public record file was turned into a placeholder: ' + t);
  const absent = G.transform('see [plan](exo_memory/loop/plan_nowhere_2026-10-01.md) and (`0000000`).\n', 'prose').body;
  assert.strictEqual(absent, 'see plan (a registration in this line of record) and (`0000000`).\n', 'a non-public target was linked anyway');
  assert.strictEqual(G.transform("const s = `(`1768ea4`)`;\n", 'code').body, "const s = `(`1768ea4`)`;\n", 'code was rewritten (a backtick in a template literal would break it)');
  const r = lap5();
  try {
    const readme = fs.readFileSync(path.join(r.staging, 'README.md'), 'utf8');
    assert.ok(!/^\s*-\s*a (registration|hand-back|map entry|librarian entry) in this line of record/m.test(readme), 'a bullet is still only a placeholder');
    for (const sha of ['1768ea4', 'fbe5549', 'b35507c']) assert.ok(readme.includes(PUB + '/commit/' + sha), sha + ' is not linked in the README');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 5 (A7): the dead targets resolve or become prose: COMMITTEE\'s memory/ note, SPINE\'s dev/PLAN.md, dev/shell/README\'s dev/dream/, the card\'s Third Place entry', () => {
  const r = lap5();
  try {
    const read = (rel) => fs.readFileSync(path.join(r.staging, rel), 'utf8');
    assert.ok(read('consonance/src-tauri/brief/COMMITTEE.md').includes(PUB + '/blob/main/exo_memory/memory/split-the-work-with-the-panes.md'), 'COMMITTEE.md still cites an absent memory/ file');
    assert.ok(read('dev/SPINE.md').includes(PUB + '/blob/main/dev/PLAN.md'), 'SPINE.md still cites the absent dev/PLAN.md');
    // D273 lap 5b AMENDED BY NAME (pane B): the librarian ruled dev/dream/ SHIPS as system (plan "Lap 5, COLLATED"), so the README's mention is a local
    // target again: it must name `dev/dream/`, the folder must be in the tree, and it must not be sent to the public repository.
    assert.ok(read('dev/shell/README.md').includes('`dev/dream/`'), 'dev/shell/README.md no longer names dev/dream/');
    assert.ok(!read('dev/shell/README.md').includes(PUB + '/tree/main/dev/dream'), 'dev/shell/README.md sends a shipped folder to the public repository');
    assert.ok(fs.existsSync(path.join(r.staging, 'dev', 'dream', 'dream_cycle.ps1')), 'dev/dream/ is cited but does not ship');
    const card = read('exo_memory/cards/claim-your-continuity.md');
    assert.doesNotMatch(card, /third_place\/2026-09-09\.md/, 'the card still cites a Third Place file a consumer does not have');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 5 (B7): hooks/jev-flags.js and its test do not ship (install.ps1 no longer registers it; Jev retired)', () => {
  for (const rel of ['consonance/hooks/jev-flags.js', 'consonance/hooks/jev-flags.test.js']) {
    assert.ok(G.collect().some((x) => x.from === rel), rel + ' is reached by no rule, so the exclusion proves nothing');
    assert.match(G.EXCLUDE[rel] || '', /Jev|D164/, rel + ' ships, or its reason does not say why');
  }
});

test('D273 lap 5 (A9): CUTOFF.md calls the source record PUBLIC (the keeper, 2026-10-08), never private', () => {
  const doc = G.renderCutoff('a'.repeat(40), '2026-10-09T04:00:00-06:00', false);
  assert.doesNotMatch(doc, /private/i, 'CUTOFF still calls the record private');
  assert.match(doc, /github\.com\/solariz3d\/lighthouse/, 'CUTOFF does not say where the public record is');
});

test('D273 lap 5 (E): both launch files ship, launch.vbs beside launch.ps1, scanned, and launch.vbs finds launch.ps1 beside itself (no machine path)', () => {
  /* E's lap 5 GUIDE documents the launch shortcut, which runs launch.vbs (it starts launch.ps1 hidden); only launch.ps1 was on a manifest line. */
  const r = lap5();
  try {
    assert.ok(!r.refused, r.refused);
    for (const rel of ['consonance/launch.ps1', 'consonance/launch.vbs']) {
      assert.ok(fs.existsSync(path.join(r.staging, rel)), rel + ' did not ship');
      assert.deepStrictEqual(r.leaks.filter((l) => l.rel === rel), [], rel + ' shipped a leak');
    }
    const vbs = fs.readFileSync(path.join(r.staging, 'consonance/launch.vbs'), 'utf8');
    assert.match(vbs, /BuildPath\(scriptDir, "launch\.ps1"\)/, 'launch.vbs no longer finds launch.ps1 beside itself');
    assert.doesNotMatch(vbs, /[A-Za-z]:\\/, 'launch.vbs carries an absolute machine path');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 5b: dev/dream/ ships as system (librarian ruling): its four files, scanned with no leak, and the runner sets the variable dream-gate checks', () => {
  /* plan "Lap 5, COLLATED": the gap-dream is a live feature, not record; its installer stays user-run (nothing schedules itself on a fresh install).
   * dream-gate.test.js ships and reads dev/dream/dream_cycle.ps1, so without it the consumer had one red assertion (B's lap 5 parity, P = 1). */
  const r = lap5();
  try {
    assert.ok(!r.refused, r.refused);
    for (const rel of ['dev/dream/README.md', 'dev/dream/dream_cycle.ps1', 'dev/dream/dream_cycle.test.js', 'dev/dream/install_dream.ps1']) {
      assert.ok(fs.existsSync(path.join(r.staging, rel)), rel + ' did not ship');
      assert.deepStrictEqual(r.leaks.filter((l) => l.rel === rel), [], rel + ' shipped a leak');
    }
    // the folder's one scan hit, fixed AT THE SOURCE: dream_cycle.test.js:23 cited muscle_map.md, the keeper's record, which a consumer does not carry
    assert.deepStrictEqual((r.unportable || []).filter((u) => u.rel.startsWith('dev/dream/')), [], 'dev/dream/ cites a file the consumer does not have');
    assert.match(fs.readFileSync(path.join(r.staging, 'dev/dream/dream_cycle.ps1'), 'utf8'), /\$env:CONSONANCE_DREAM\s*=\s*"1"/, 'the shipped runner does not set CONSONANCE_DREAM');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});


/* ============================================================ D273 LAP 6 POLISH (pane B): cold read 3's A3, A4, A5
 * handback/p-consumer-coldread3-LIB_2026-10-09.md section A, and plan_consumer_refresh_2026-10-08.md "lap 6 POLISH". */

test('D273 lap 6 (A3): the PreCompact hook finds its script: exo_memory/loop/checkpoint.py ships (the scan passes it), so the registered hook is not silently dead', () => {
  const r = lap5();
  try {
    assert.ok(!r.refused, r.refused);
    const rel = 'exo_memory/loop/checkpoint.py';
    assert.ok(fs.existsSync(path.join(r.staging, rel)), rel + ' did not ship; dev/shell/hooks/precompact.js runs it from <repo>/exo_memory/loop/');
    assert.deepStrictEqual(r.leaks.filter((l) => l.rel === rel), [], rel + ' shipped a leak');
    assert.match(fs.readFileSync(path.join(r.staging, 'dev/shell/hooks/precompact.js'), 'utf8'), /path\.join\(REPO, "exo_memory", "loop", "checkpoint\.py"\)/, 'the hook no longer names the script it runs');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 6 (A4): what the docs say about jev-flags.js is true in a generated copy: not "in the repo", and the README hook count matches the tree', () => {
  const r = lap5();
  try {
    assert.ok(!r.refused, r.refused);
    assert.ok(!fs.existsSync(path.join(r.staging, 'consonance/hooks/jev-flags.js')));
    const inst = fs.readFileSync(path.join(r.staging, 'dev/shell/install.ps1'), 'utf8'), readme = fs.readFileSync(path.join(r.staging, 'consonance/README.md'), 'utf8');
    assert.doesNotMatch(inst, /The file stays in the repo as the record/, 'install.ps1 says the excluded jev-flags.js is in this repo');
    assert.match(inst, /jev-flags[\s\S]{0,400}a generated copy does not carry it/, 'install.ps1 does not say a generated copy lacks jev-flags.js');
    const n = fs.readdirSync(path.join(r.staging, 'consonance/hooks')).filter((f) => /\.js$/.test(f) && !/\.(test|mutants)\.js$/.test(f)).length;
    assert.match(readme, new RegExp('\\(' + n + ' in a generated copy'), 'the README hook count is not stated for a generated copy, which has ' + n);
    assert.match(readme, /`jev-flags\.js` is retired \(a generated copy does not carry it\)/, 'README:192 does not say a generated copy lacks jev-flags.js');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 6 (A5): the unshipped names the cold read listed are linked to the public record or say where they live', () => {
  const r = lap5();
  try {
    assert.ok(!r.refused, r.refused);
    const read = (rel) => fs.readFileSync(path.join(r.staging, rel), 'utf8');
    const aut = read('consonance/AUTONOMY.md');
    assert.strictEqual(aut.split('(' + PUB + '/blob/main/consonance/PROGRESS.md)').length - 1, 2, 'AUTONOMY.md:5,96 PROGRESS.md is not linked twice');
    assert.ok(aut.includes('(' + PUB + '/blob/main/consonance/RECONCEPTION.md)'), 'AUTONOMY.md:5 RECONCEPTION.md is not linked');
    assert.ok(read('dev/SPINE.md').includes('[`WELFARE.md`](' + PUB + '/blob/main/WELFARE.md)'), 'SPINE.md:81 WELFARE.md is not linked');
    const cut = read('exo_memory/CUTOFF.md');
    assert.doesNotMatch(cut, /The tree this was generated from holds the command/, 'CUTOFF still points at a tree the reader does not have');
    assert.ok(cut.includes('`consonance/tools/gen-consumer.js`') && cut.includes('public source repository (github.com/solariz3d/lighthouse)'), 'CUTOFF does not say where the command is');
    assert.match(read('consonance/src-tauri/src/main.rs'), /consumer-relabel\.js`? \(in the source repository/, 'main.rs names consumer-relabel.js as if it were in this tree');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 6 (LICENSE): the MIT LICENSE ships at the consumer root byte for byte, the copyright holder intact (the keeper\'s choice)', () => {
  const src = fs.readFileSync(path.join(REPO, 'LICENSE'));
  assert.match(src.toString('utf8'), /^MIT License\n\nCopyright \(c\) 2026 solariz3d\n/, 'the source LICENSE is not the MIT text with the keeper\'s copyright line');
  const r = lap5();
  try {
    assert.ok(!r.refused, r.refused);
    assert.ok(fs.existsSync(path.join(r.staging, 'LICENSE')), 'LICENSE did not ship at the consumer root');
    assert.ok(fs.readFileSync(path.join(r.staging, 'LICENSE')).equals(src), 'the generated LICENSE differs from the source (the handle rewrite reached it?)');
  } finally { try { fs.rmSync(r.staging, { recursive: true, force: true }); } catch (_) {} }
});

test('D273 lap 6 (LICENSE): the exemption is the ONE registered copyright line; any other identity in a verbatim legal file is still a leak', () => {
  const ok = G.scanLegal('MIT License\n\nCopyright (c) 2026 solariz3d\n\nPermission is hereby granted.\n', 'LICENSE');
  assert.deepStrictEqual(ok.leaks, []); assert.strictEqual(ok.missing, false);
  const extra = G.scanLegal('MIT License\n\nCopyright (c) 2026 solariz3d\n\nQuestions go to solariz3d.\n', 'LICENSE');
  assert.ok(extra.leaks.some((l) => l.cls === 'IDENTITY'), 'a second handle in LICENSE passed: ' + JSON.stringify(extra.leaks));
  assert.strictEqual(G.scanLegal('MIT License\n\nCopyright (c) 2026 someone else\n', 'LICENSE').missing, true, 'a LICENSE without the registered line was not reported');
});
