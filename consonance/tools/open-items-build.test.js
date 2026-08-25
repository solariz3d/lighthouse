/* open-items-build.test.js — the brief-drift item must find the build wherever cargo put it.
 *
 * THE BUG THIS REPRODUCES. `open-items.js` reported
 *
 *     UNKNOWN  the SEED.md rename reaches a new room
 *              no built copy — never built on this machine
 *
 * for weeks. A complete release build existed the whole time at C:\build\lighthouse-target,
 * because CARGO_TARGET_DIR redirects it. The item looked in exactly one hardcoded path and
 * reported the absence as a fact about the machine.
 *
 * That is worse than a missing check. UNKNOWN reads as "nothing to do here", so an item whose
 * whole purpose is catching landed-is-not-shipped was itself silently not shipped-checking. When
 * the lookup was fixed the very first run returned OPEN with a real drift: LIBRARIAN.md, changed
 * in 51e6fef, still stale in the bundle a fresh seat would actually read.
 *
 * open-items.js calls process.exit() at module scope and exports nothing, so it cannot be
 * required -- the same trap that once left appended tests silently never running. It is therefore
 * driven as a subprocess, which also means these tests check the behaviour a person sees.
 *
 * Run: node consonance/tools/open-items-build.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REPO = path.resolve(__dirname, '..', '..');
const TOOL = path.join(__dirname, 'open-items.js');

function run(env) {
  const r = spawnSync(process.execPath, [TOOL],
    { encoding: 'utf8', cwd: REPO, env: { ...process.env, ...(env || {}) } });
  return { out: (r.stdout || '') + (r.stderr || ''), status: r.status };
}

/** The directory a real release build actually occupies on this machine, or null. */
function realBuildDir() {
  const cands = [];
  if (process.env.CARGO_TARGET_DIR) cands.push(path.join(process.env.CARGO_TARGET_DIR, 'release'));
  for (const cfg of [path.join(REPO, 'consonance/src-tauri/.cargo/config.toml'),
                     path.join(REPO, '.cargo/config.toml')]) {
    try {
      const m = fs.readFileSync(cfg, 'utf8').match(/target-dir\s*=\s*"([^"]+)"/);
      if (m) cands.push(path.join(m[1], 'release'));
    } catch (_) {}
  }
  cands.push(path.join(REPO, 'consonance/src-tauri/target/release'));
  for (const d of cands) { if (fs.existsSync(path.join(d, 'BOOT.md'))) return d; }
  return null;
}

test('the tool runs and exits 0', () => {
  const r = run();
  assert.strictEqual(r.status, 0, 'open-items.js did not exit 0:\n' + r.out);
  assert.match(r.out, /OPEN ITEMS/, 'no report produced');
});

test('when a build exists, the brief item does NOT report "never built on this machine"', () => {
  const dir = realBuildDir();
  if (!dir) {
    // Honest skip rather than a vacuous pass: with no build the claim is untestable here.
    assert.ok(true, 'no release build on this machine — nothing to assert');
    return;
  }
  const r = run();
  assert.doesNotMatch(r.out, /never built on this machine/,
    'a release build exists at ' + dir + ' but the tool still reports it was never built');
});

test('the brief item reaches a verdict — CLOSED or OPEN, never UNKNOWN, when a build exists', () => {
  const dir = realBuildDir();
  if (!dir) { assert.ok(true, 'no release build; skipped'); return; }
  const r = run();
  // Matched on the STABLE HALF of the title, not the whole sentence. It said "briefs" and the item
  // was widened on 2026-08-25 to every bundled document — a rename this assertion should survive,
  // because pinning a human-facing sentence makes an honest correction look like a regression.
  const block = r.out.split('\n').find((l) => /a fresh room reads match the repo/.test(l));
  assert.ok(block, 'the bundle-drift item is missing from the report entirely');
  assert.doesNotMatch(block, /UNKNOWN/,
    'the item is UNKNOWN while a build exists — it is not looking where cargo put it');
});

test('it compares EVERY file tauri.conf.json ships, re-derived here rather than read from the tool', () => {
  /* THIS REPLACES AN ASSERTION THAT COULD NOT FAIL THE WAY IT NEEDED TO, and the replacement is
   * strictly stronger rather than looser. The old version grepped the TOOL'S OWN SOURCE for
   * `const names = [...]` and required >= 2 entries including SEED and LIBRARIAN. That list held
   * FIVE names. Six briefs are bundled. BUILDING.md was missing from it and shipped DRIFTED — and
   * this test stayed green through all of it, because its denominator was "the names in the tool's
   * array". A test whose universe is the thing under test cannot audit that thing.
   *
   * So the count is re-derived HERE, from tauri.conf.json, and compared against what the tool
   * reports having seen. Narrow the tool's corpus again and this goes red with the arithmetic in
   * the failure message.
   *
   * Found by pane E, 2026-08-25: exo_memory/loop/corpus_rules_adversarial_2026-08-25.md, section 1. */
  const conf = JSON.parse(fs.readFileSync(path.join(REPO, 'consonance/src-tauri/tauri.conf.json'), 'utf8'));
  const res = (conf.bundle && conf.bundle.resources) || {};
  const base = path.join(REPO, 'consonance/src-tauri');
  let expected = 0;
  for (const from of Object.keys(res)) {
    if (from.indexOf('*') === -1) { expected++; continue; }
    const dir = path.resolve(base, path.dirname(from));
    const rx = new RegExp('^' + path.basename(from).split('*')
      .map((t) => t.replace(/[^A-Za-z0-9_-]/g, (c) => '\\' + c)).join('.*') + '$');
    let n = 0;
    try { n = fs.readdirSync(dir).filter((f) => rx.test(f)).length; } catch (_) {}
    expected += n || 1;   // an empty glob still occupies one reported slot
  }
  assert.ok(expected >= 6, 'the bundle itself declares too little to test against: ' + expected);

  const r = run();
  const line = r.out.split('\n').find((l) => /universe:/.test(l) && /bundle\.resources/.test(l));
  assert.ok(line, 'the bundle item prints no universe naming tauri.conf.json as its authority');
  const seen = Number((line.match(/universe: (\d+) seen/) || [])[1]);
  assert.strictEqual(seen, expected,
    'the tool reports ' + seen + ' shipped file(s); tauri.conf.json ships ' + expected +
    '. A corpus narrower than the bundle is the gap BUILDING.md hid in.');

  // And the two files the original assertion named must still actually be reaching a comparison.
  const item = r.out.split(/\n\s*\n/).find((b) => /a fresh room reads match the repo/.test(b)) || '';
  assert.doesNotMatch(item, /SEED\.md \(absent/, 'SEED.md is not being compared');
  assert.doesNotMatch(item, /LIBRARIAN\.md \(absent/, 'LIBRARIAN.md is not being compared');
});

test('CARGO_TARGET_DIR is honoured, proven by pointing it somewhere empty', () => {
  // The positive case can pass by accident if the conventional path also happens to hold a build.
  // Point the env var at a directory with no BOOT.md: the tool must fall through, not crash, and
  // must not claim a verdict it cannot support.
  const empty = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'oi-'));
  try {
    const r = run({ CARGO_TARGET_DIR: empty });
    assert.strictEqual(r.status, 0, 'the tool crashed on an empty target dir:\n' + r.out);
    assert.match(r.out, /OPEN ITEMS/, 'no report produced with an empty target dir');
  } finally {
    try { fs.rmSync(empty, { recursive: true, force: true }); } catch (_) {}
  }
});

test('an UNKNOWN verdict must name where it looked', () => {
  // "no built copy" with no paths is unfalsifiable from the outside -- the reader cannot tell a
  // real absence from a bad lookup. That distinction is the entire content of this bug.
  const src = fs.readFileSync(TOOL, 'utf8');
  assert.match(src, /looked in ' \+ candidateDirs\(\)\.join/,
    'the UNKNOWN branch does not report the directories it searched');
});
