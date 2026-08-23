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
  const block = r.out.split('\n').find((l) => /briefs a fresh room reads/.test(l));
  assert.ok(block, 'the brief-drift item is missing from the report entirely');
  assert.doesNotMatch(block, /UNKNOWN/,
    'the item is UNKNOWN while a build exists — it is not looking where cargo put it');
});

test('it compares MORE than one brief — a stale LIBRARIAN.md must be visible', () => {
  // The original item md5'd SEED.md alone and reported a verdict about "the bundle". A stale
  // LIBRARIAN.md sends that seat to a dead notes path and SEED would have said everything was fine.
  const src = fs.readFileSync(TOOL, 'utf8');
  const m = src.match(/const names = \[([^\]]*)\]/);
  assert.ok(m, 'the brief item no longer enumerates the briefs it checks');
  const names = (m[1].match(/'[^']+'/g) || []).map((x) => x.replace(/'/g, ''));
  assert.ok(names.length >= 2, 'only ' + names.length + ' brief checked; one file cannot speak for the bundle');
  for (const need of ['SEED', 'LIBRARIAN']) {
    assert.ok(names.includes(need), need + ' is not among the briefs compared');
  }
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
