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
  for (const f of G.collect()) {
    const m = /^exo_memory\/([^/]+)/.exec(f.from);
    if (m) reached.add(m[1]);
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
  const ok = G.build(out, { allowDirty: true });
  assert.ok(!ok.refused, '--allow-dirty did not lift the refusal: ' + ok.refused);
  assert.match(fs.readFileSync(path.join(out, 'exo_memory', 'CUTOFF.md'), 'utf8'),
    reallyDirty ? /THIS PROVENANCE IS NOT EARNED/ : /Generated from the private record at commit/,
    'the written CUTOFF does not describe the state it was generated in');
  if (ok.staging) { try { fs.rmSync(ok.staging, { recursive: true, force: true }); } catch (_) {} }
  fs.rmSync(out, { recursive: true, force: true });
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
    'MEMORY.md',                                  // the index, filtered by reindex()
    'frozen-is-not-dead.md',
    'split-the-work-with-the-panes.md',
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
  assert.ok(r.linkTargets.includes('frozen-is-not-dead'),
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
