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

test('a dangling citation is rewritten so the PROSE survives', () => {
  const { body, n } = G.dedangle('// found on 2026-08-17, see exo_memory/journal/2026-08-17.md:1209\n');
  assert.ok(n > 0, 'nothing was rewritten');
  assert.doesNotMatch(body, /exo_memory\/journal\/2026/, 'the dead pointer survived');
  assert.match(body, /the record, 2026-08-17/, 'the rewrite lost the date the reader needs');
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
