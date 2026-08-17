// seed-status.test.js - run with: node seed-status.test.js
//
// The load-bearing property is the ABSORBING STATE: KeptYours-with-nothing-recorded is a one-way
// door, because the only exit is Current and a stale file cannot reach it alone. Three real files
// sat in it, one for six weeks, and the only notice was a plog line nobody reads.
//
// The fingerprint is mirrored from main.rs:391 rather than approximated, so it is pinned here
// against hand-computed vectors: a tool whose hash disagrees with the seeder's would confidently
// report decisions the seeder will never make — worse than no tool at all.

const assert = require('assert');
const ss = require('./seed-status.js');

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

// ---- the decision table, mirroring main.rs:486 branch for branch ----

t('absent locally installs', () => {
  assert.strictEqual(ss.seedDecision('A', null, null), 'Installed');
});

t('identical content is Current — the only self-service exit from stuck', () => {
  assert.strictEqual(ss.seedDecision('A', 'A', null), 'Current');
});

t('our own untouched output upgrades', () => {
  assert.strictEqual(ss.seedDecision('NEW', 'OLD', 'OLD'), 'Upgraded');
});

t('an edited file stands — recorded hash does not match local', () => {
  assert.strictEqual(ss.seedDecision('NEW', 'EDITED', 'SHIPPED'), 'KeptYours');
});

t('THE ABSORBING STATE: stale and unrecorded stays KeptYours', () => {
  // main.rs:3420 asserts this same case. It is correct — the seeder genuinely cannot tell an edit
  // from a pre-manifest install — and it is also a one-way door, which is the thing to surface.
  assert.strictEqual(ss.seedDecision('BUNDLED', 'STALE', null), 'KeptYours');
});

t('and re-running it changes nothing — that is what makes it absorbing', () => {
  // Nothing about a KeptYours outcome writes a hash, so the next run sees the identical inputs.
  let decision = ss.seedDecision('BUNDLED', 'STALE', null);
  for (let i = 0; i < 5; i++) decision = ss.seedDecision('BUNDLED', 'STALE', null);
  assert.strictEqual(decision, 'KeptYours', 'five runs later, still held, still unrecorded');
});

// ---- the fingerprint, pinned against the Rust it mirrors ----

t('the fingerprint collapses \\r\\n to \\n, so CRLF alone is not a difference', () => {
  // This is why a Windows-checkout copy is not treated as an edit — and the reason the live
  // BOOT.md read as byte-different while being content-identical to its July seed.
  assert.strictEqual(
    ss.contentFingerprint(Buffer.from('a\r\nb\r\n')),
    ss.contentFingerprint(Buffer.from('a\nb\n')),
  );
});

t('a lone \\r still counts as a byte', () => {
  // The Rust carries this case explicitly; dropping it would make old-Mac line endings vanish
  // from the hash and two genuinely different files compare equal.
  assert.notStrictEqual(
    ss.contentFingerprint(Buffer.from('a\rb')),
    ss.contentFingerprint(Buffer.from('ab')),
  );
});

t('different content gives different fingerprints', () => {
  assert.notStrictEqual(
    ss.contentFingerprint(Buffer.from('the suite reads 267')),
    ss.contentFingerprint(Buffer.from('the suite reads 261')),
  );
});

t('the empty input is the FNV-1a offset basis, unchanged', () => {
  // 0xcbf29ce484222325 — the same constant main.rs starts from. If this drifts, every comparison
  // silently shifts and the tool reports a repo-wide difference that does not exist.
  assert.strictEqual(ss.contentFingerprint(Buffer.from('')), '14695981039346656037');
});

// ---- the scan reports rather than guesses ----

t('scan returns a decision and a stuck flag for every bundled file', () => {
  const rows = ss.scan();
  assert.ok(rows.length > 0, 'the bundled set must not be empty — a clean sheet over nothing is the bug');
  for (const r of rows) {
    assert.ok(typeof r.key === 'string' && r.key.length, 'every row names its file');
    assert.ok(['Installed', 'Current', 'Upgraded', 'KeptYours'].includes(r.decision), `bad decision ${r.decision}`);
    assert.strictEqual(typeof r.stuck, 'boolean');
    if (r.stuck) assert.strictEqual(r.decision, 'KeptYours', 'only KeptYours can be stuck');
  }
});

// ---- the stuck flag itself, driven through a real data dir ----
// Added after a mutation exposed it as untested: blinding `stuck` to false left the suite green,
// which is the same "asserted able to fail, never shown to fail" shape this repo keeps finding.

const fs = require('fs');
const os = require('os');
const path = require('path');

t('a stale, unrecorded file is reported STUCK', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'seedstat-'));
  fs.mkdirSync(path.join(dir, 'cards'), { recursive: true });
  const repoCard = path.resolve(__dirname, '..', '..', 'exo_memory', 'cards', 'verify-before-claiming.md');
  // Content that is NOT the bundle, with no manifest entry: exactly the absorbing state.
  fs.writeFileSync(path.join(dir, 'cards', 'verify-before-claiming.md'), 'a stale local copy\n');
  const prev = process.env.CONSONANCE_DATA_DIR;
  process.env.CONSONANCE_DATA_DIR = dir;
  delete require.cache[require.resolve('./seed-status.js')];
  const fresh = require('./seed-status.js');
  const rows = fresh.scan();
  if (prev === undefined) delete process.env.CONSONANCE_DATA_DIR; else process.env.CONSONANCE_DATA_DIR = prev;
  delete require.cache[require.resolve('./seed-status.js')];

  assert.ok(fs.existsSync(repoCard), 'the fixture needs a real bundled card to compare against');
  const row = rows.find((r) => r.key === 'cards/verify-before-claiming.md');
  assert.ok(row, 'the file must appear in the scan');
  assert.strictEqual(row.decision, 'KeptYours');
  assert.strictEqual(row.stuck, true, 'stale + unrecorded is the absorbing state and must be flagged');
});

t('a file matching the bundle is NOT stuck — the exit exists', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'seedstat2-'));
  fs.mkdirSync(path.join(dir, 'cards'), { recursive: true });
  const src = path.resolve(__dirname, '..', '..', 'exo_memory', 'cards', 'verify-before-claiming.md');
  fs.copyFileSync(src, path.join(dir, 'cards', 'verify-before-claiming.md'));
  const prev = process.env.CONSONANCE_DATA_DIR;
  process.env.CONSONANCE_DATA_DIR = dir;
  delete require.cache[require.resolve('./seed-status.js')];
  const fresh = require('./seed-status.js');
  const rows = fresh.scan();
  if (prev === undefined) delete process.env.CONSONANCE_DATA_DIR; else process.env.CONSONANCE_DATA_DIR = prev;
  delete require.cache[require.resolve('./seed-status.js')];

  const row = rows.find((r) => r.key === 'cards/verify-before-claiming.md');
  assert.strictEqual(row.decision, 'Current', 'identical content is the one self-service exit');
  assert.strictEqual(row.stuck, false);
});

console.log(`\nseed-status: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
