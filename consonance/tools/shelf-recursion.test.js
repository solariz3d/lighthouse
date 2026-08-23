/* shelf-recursion.test.js — the shelf must see the whole corpus, including nested files.
 *
 * WHAT THIS PREVENTS, because it already happened and no test caught it. Until 2026-08-23 both
 * `corpus_shelf()` (src-tauri/src/main.rs) and `corpus-age.js` used a FLAT directory read. 12 `.md`
 * files nested under `exo_memory/` were therefore neither carried nor indexed:
 *
 *     loop/2026-08-18/README.md                        loop/run1/RECOVERY.md
 *     loop/2026-08-18/archaeology/PREREG.md            loop/run1/armG_checks.md
 *     loop/2026-08-18/archaeology/FINDINGS.md          loop/run1/items/t1..t6/*.md
 *     loop/2026-08-18/suggestion-probe/REGISTRATION.md
 *
 * THE FAILURE IS THE HEADER, not the omission. The shelf printed "148 file(s) carried in full; 0
 * indexed by path" — and "0 indexed" is exactly what a COMPLETE shelf looks like. There was no
 * signal at all. A preregistration and a registration were among the missing, so the seat whose
 * one job is fidelity would have answered "there is no such registration" from a shelf that had
 * silently never opened the directory. Found by the librarian reading main.rs, not by any guard.
 *
 * Run: node consonance/tools/shelf-recursion.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const REPO = path.resolve(__dirname, '..', '..');
const EXO = path.join(REPO, 'exo_memory');
const MAIN_RS = path.join(REPO, 'consonance', 'src-tauri', 'src', 'main.rs');
const { mdFiles, corpusSize } = require('./corpus-age.js');

/** Every .md under exo_memory at depth >= 3, excluding attic — the set that used to be invisible. */
function nestedMd() {
  const out = [];
  const walk = (dir, depth) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (e.name === 'attic') continue;
        walk(path.join(dir, e.name), depth + 1);
      } else if (e.isFile() && e.name.endsWith('.md') && depth >= 2) {
        out.push(path.relative(EXO, path.join(dir, e.name)).split(path.sep).join('/'));
      }
    }
  };
  walk(EXO, 0);
  return out;
}

test('the fixture is real — there ARE nested .md files, or this whole suite proves nothing', () => {
  assert.ok(nestedMd().length > 0,
    'no nested .md files exist; these tests would pass vacuously and must not be trusted');
});

test('corpus_shelf() walks named directories recursively', () => {
  const src = fs.readFileSync(MAIN_RS, 'utf8');
  assert.match(src, /fn collect_md\(/, 'the recursive collector is gone');
  assert.match(src, /collect_md\(&d, !dir\.is_empty\(\), &mut files\)/,
    'corpus_shelf no longer calls the recursive collector — it is back to a flat read');
  assert.doesNotMatch(src, /let Ok\(rd\) = fs::read_dir\(&d\) else \{ continue \};[\s\S]{0,120}rd\.flatten\(\)\.map/,
    'corpus_shelf still contains the flat read_dir that missed 12 files');
});

test('the root of exo_memory is deliberately NOT recursed', () => {
  // Recursing the root would pull every listed directory in a second time and drag attic/ with it.
  const src = fs.readFileSync(MAIN_RS, 'utf8');
  assert.match(src, /collect_md\(&d, !dir\.is_empty\(\)/,
    'the root must be walked flat; recursing it double-counts the whole corpus');
});

test('attic/ is skipped by name at any depth, not merely by being unlisted', () => {
  const src = fs.readFileSync(MAIN_RS, 'utf8');
  assert.match(src, /== Some\("attic"\) \{ continue; \}/,
    'law 3 exclusion depends only on attic being unlisted — one recursive caller away from breaking');
  // and the tool agrees
  assert.strictEqual(mdFiles('loop').filter((f) => f.rel.includes('attic/')).length, 0,
    'the tool walked into attic/');
});

test('corpus-age.js sees every nested file — the count that used to be short by 12', () => {
  const seen = new Set(mdFiles('loop').map((f) => f.rel));
  const missing = nestedMd().filter((r) => r.startsWith('loop/') && !seen.has(r));
  assert.deepStrictEqual(missing, [],
    'nested files invisible to the capacity gauge: ' + missing.join(', '));
});

test('every walked file carries a rel that resolves to a real path', () => {
  // The silent-wrongness case: a nested file whose rel was built by joining dir+name yields a path
  // that does not exist, so `git log` returns nothing, days is null, stale is false, and the file
  // can never be proposed. It reads as "reviewed and kept".
  for (const f of mdFiles('loop')) {
    assert.ok(fs.existsSync(path.join(EXO, f.rel)),
      'rel does not resolve to a real file: ' + f.rel);
  }
});

test('a nested registration is reachable — the concrete thing that was lost', () => {
  const seen = new Set(mdFiles('loop').map((f) => f.rel));
  for (const r of ['loop/2026-08-18/archaeology/PREREG.md',
                   'loop/2026-08-18/suggestion-probe/REGISTRATION.md']) {
    if (fs.existsSync(path.join(EXO, r))) {
      assert.ok(seen.has(r), r + ' exists on disk but the corpus walk does not see it');
    }
  }
});

test('the corpus total is non-zero and counts more than the flat read did', () => {
  const size = corpusSize();
  assert.ok(size.files > 0 && size.bytes > 0, 'corpusSize() returned nothing');
  // The flat read reported 151 files on 2026-08-23 immediately before this fix. Pinning the
  // DIRECTION rather than the number, since the corpus grows: it must never be fewer than the
  // top-level count alone.
  const flat = fs.readdirSync(path.join(EXO, 'loop')).filter((f) => f.endsWith('.md')).length;
  const walked = mdFiles('loop').length;
  assert.ok(walked >= flat, 'the walk returned fewer files than a flat read of the same directory');
});

test('the shelf header cannot claim completeness it has not checked', () => {
  // "0 indexed by path" is what a complete shelf looks like AND what a shelf that never opened a
  // subdirectory looks like. The two must not be indistinguishable again.
  const src = fs.readFileSync(MAIN_RS, 'utf8');
  const usesGit = (() => {
    try { execFileSync('git', ['ls-files', 'exo_memory'], { cwd: REPO, encoding: 'utf8' }); return true; }
    catch (_) { return false; }
  })();
  assert.ok(usesGit, 'git unavailable; cannot cross-check the corpus set');
  const tracked = execFileSync('git', ['ls-files', 'exo_memory/loop'], { cwd: REPO, encoding: 'utf8' })
    .split('\n').filter((l) => l.endsWith('.md') && !l.includes('/attic/'))
    .map((l) => l.replace('exo_memory/', ''));
  const seen = new Set(mdFiles('loop').map((f) => f.rel));
  const unseen = tracked.filter((r) => !seen.has(r));
  assert.deepStrictEqual(unseen, [],
    'git tracks files under loop/ that the corpus walk does not return: ' + unseen.join(', '));
  assert.ok(src.includes('collect_md'), 'sanity: main.rs no longer has the collector');
});

test("review()'s OWN rel resolves — not just the walk's", () => {
  // The mutation that survived the first harness run: the walk carried a correct rel while
  // review() rebuilt its own by joining dir+name. For a nested file that yields a path which does
  // not exist -> git log returns nothing -> days is null -> stale is false -> never proposed. The
  // file reads as "reviewed and kept" forever. Testing the walk was not testing the consumer.
  const { review } = require('./corpus-age.js');
  const rows = review('loop', 0).rows;
  assert.ok(rows.length > 0, 'fixture broken: review() returned no rows');
  const nested = rows.filter((r) => (r.rel.match(/\//g) || []).length > 2);
  assert.ok(nested.length > 0, 'fixture broken: no nested rows, so this proves nothing');
  for (const r of rows) {
    assert.ok(fs.existsSync(path.join(REPO, r.rel)),
      "review() produced a rel that resolves to nothing: " + r.rel);
  }
  // and the age lookup must actually return something for a nested file
  assert.ok(nested.some((r) => r.days !== null),
    'every nested row has days=null — the age lookup is being fed unresolvable paths');
});

test('the walk refuses a nested attic/ directory, proven against a real one', () => {
  // attic/ sits at exo_memory/attic and the root is never recursed, so the by-name guard is
  // unreachable with today's layout -- which is exactly why a source-only assertion would rot.
  // Create a nested attic, walk, and require it excluded. Removed whether or not this passes.
  const probe = path.join(EXO, 'loop', 'attic');
  const file = path.join(probe, 'PROBE.md');
  let made = false;
  try {
    if (!fs.existsSync(probe)) { fs.mkdirSync(probe, { recursive: true }); made = true; }
    fs.writeFileSync(file, '# probe\n');
    const hits = mdFiles('loop').filter((f) => f.rel.includes('attic/'));
    assert.deepStrictEqual(hits.map((h) => h.rel), [],
      'the walk entered a nested attic/ — law 3 is not enforced by name');
  } finally {
    try { fs.unlinkSync(file); } catch (_) {}
    if (made) { try { fs.rmdirSync(probe); } catch (_) {} }
  }
});
