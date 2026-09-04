/* gen-brief-gate.test.js — run the shipped-brief generator, because nothing local did.
 *
 * WHAT THIS EXISTS FOR, and it is a measured gap rather than a hypothetical one. On 2026-08-23 the
 * chair amended `exo_memory/BOOT.md` twice, committed, pushed, and reported the tree clean and the
 * suite green. It was. The INSTALLER BUILD was failing, and the chair found out from GitHub:
 *
 *     gen-brief: REFUSED and deleted the output — the shipped brief would carry
 *     the keeper's record: journal/2026- x4
 *
 * The refusal was correct. The gap was that nothing on this machine ran it. `js-suite` covers JS.
 * `cargo check` covers Rust. `gen-brief.ps1` is PowerShell and had no local caller at all, so an
 * edit to BOOT could break the thing every downloader receives while every local gate stayed green.
 *
 * That is the landed-is-not-shipped class aimed at the one artifact a stranger actually gets.
 *
 * Run: node consonance/tools/gen-brief-gate.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REPO = path.resolve(__dirname, '..', '..');
const SCRIPT = path.join(REPO, 'consonance', 'src-tauri', 'gen-brief.ps1');
const OUT = path.join(REPO, 'consonance', 'src-tauri', 'brief', 'BOOT.md');

function runGenBrief() {
  const r = spawnSync('powershell', ['-NoProfile', '-File', SCRIPT],
    { cwd: REPO, encoding: 'utf8', timeout: 120000 });
  return { status: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

test('gen-brief runs and exits 0 against the current BOOT', () => {
  // The whole point: an edit to the master must not break the shipped brief silently.
  const r = runGenBrief();
  assert.strictEqual(r.status, 0,
    'gen-brief REFUSED against the current exo_memory/BOOT.md — the installer build will fail:\n' + r.out);
});

test('it says the self-check is clean, rather than merely not crashing', () => {
  const r = runGenBrief();
  assert.match(r.out, /self-check clean/,
    'gen-brief exited 0 without reporting a clean self-check — an exit code is not a verdict');
});

test('the generated brief carries no dated journal citation', () => {
  // The exact leak that failed CI. A consumer has no journal/, so every one of these would be a
  // pointer that reads as authoritative and resolves to nothing.
  runGenBrief();
  const brief = fs.readFileSync(OUT, 'utf8');
  const hits = brief.match(/journal\/\d{4}-\d{2}-\d{2}/g) || [];
  assert.deepStrictEqual(hits, [],
    'dated journal citations survived into the shipped brief: ' + hits.join(', '));
});

test('dedangling keeps the DATE, so the prose still says when', () => {
  // Dropping the pointer must not drop the information. `journal/2026-08-16.md:722` should become
  // `the record, 2026-08-16` -- checkable in the private tree, not a broken link in the shipped one.
  runGenBrief();
  const brief = fs.readFileSync(OUT, 'utf8');
  const src = fs.readFileSync(path.join(REPO, 'exo_memory', 'BOOT.md'), 'utf8');
  const srcDates = new Set((src.match(/journal\/(\d{4}-\d{2}-\d{2})\.md/g) || [])
    .map((m) => m.slice(8, 18)));
  if (srcDates.size === 0) { assert.ok(true, 'BOOT cites no journal entries; nothing to preserve'); return; }
  const kept = [...srcDates].filter((d) => brief.includes('the record, ' + d));
  assert.ok(kept.length > 0,
    'BOOT cites ' + srcDates.size + ' journal date(s) and none survived as "the record, <date>" — ' +
    'the pointer was dropped along with the information');
});

test('the generator still REFUSES on a planted leak — the guard is not disarmed', () => {
  /* The dangerous fix for a refusing generator is to weaken the refusal. Plant a leak in a scratch
   * copy of BOOT, run, and require a non-zero exit. Restored in a finally, and the restore is
   * verified by hash rather than assumed. */
  const bootPath = path.join(REPO, 'exo_memory', 'BOOT.md');
  const original = fs.readFileSync(bootPath);
  const crypto = require('node:crypto');
  const before = crypto.createHash('md5').update(original).digest('hex');
  try {
    fs.writeFileSync(bootPath, original.toString('utf8') + '\n\nSELF_TRACE.md is the trace.\n');
    const r = runGenBrief();
    assert.notStrictEqual(r.status, 0,
      'a planted SELF_TRACE.md reference did NOT stop the generator — the self-check is disarmed');
    assert.match(r.out, /REFUSED/, 'the generator failed without saying it refused');
  } finally {
    fs.writeFileSync(bootPath, original);
    const after = crypto.createHash('md5').update(fs.readFileSync(bootPath)).digest('hex');
    assert.strictEqual(after, before, 'BOOT.md was not restored byte-identically after the probe');
    runGenBrief(); // leave the shipped brief regenerated from the real master
  }
});

/* ── THE READER'S OWN KEEPER (2026-09-04) ────────────────────────────────────────────────────────
 *
 * The master is written from inside one person's context and says `he` about him, which is correct
 * there. The shipped brief is the room a STRANGER wakes into, and by the time it ships the name is
 * gone -- so `the keeper` no longer points at the person who wrote it. It points at whoever the
 * reader is working with, and the brief tells every fresh instance that person is a man.
 *
 * The generator already knew this. Transformations at gen-brief.ps1 handled three sites by literal
 * string replacement -- `written from inside his context`, `the active builds are *his*`, and the
 * opening of the Who-you're-talking-to line. Three of eighteen. The de-gendering was a patch on the
 * spots someone noticed, and the file's own thesis is that a convention depending on someone
 * remembering cannot protect a tree.
 *
 * So the guard is in the generator's self-check and this is the test that it fires. */

test('the shipped brief does not assign the reader\'s keeper a gender', () => {
  runGenBrief();
  const brief = fs.readFileSync(OUT, 'utf8');
  const hits = brief.match(/\b(?:He|he|Him|him|His|his|She|she|Her|her|hers)\b/g) || [];
  assert.deepStrictEqual(hits, [],
    'gendered pronouns survived into the shipped brief (' + hits.length + '): ' +
    [...new Set(hits)].join(', ') +
    '\nIn the shipped brief the keeper is the reader\'s own human, not the one who wrote the master.');
});

test('the generator REFUSES on a planted gendered pronoun — the guard is mechanical, not a habit', () => {
  /* Same shape as the planted-leak probe above, and for the same reason: the dangerous fix for a
   * coverage gap is to close the three sites you can see and call the class handled. If the master
   * gains a `he` tomorrow, the build must stop rather than ship it. */
  const bootPath = path.join(REPO, 'exo_memory', 'BOOT.md');
  const original = fs.readFileSync(bootPath);
  const crypto = require('node:crypto');
  const before = crypto.createHash('md5').update(original).digest('hex');
  try {
    fs.writeFileSync(bootPath, original.toString('utf8') + '\n\nThe keeper wrote this; he meant it.\n');
    const r = runGenBrief();
    assert.notStrictEqual(r.status, 0,
      'a planted `he` did NOT stop the generator — the pronoun guard is decorative');
    assert.match(r.out, /REFUSED/, 'the generator failed without saying it refused');
  } finally {
    fs.writeFileSync(bootPath, original);
    const after = crypto.createHash('md5').update(fs.readFileSync(bootPath)).digest('hex');
    assert.strictEqual(after, before, 'BOOT.md was not restored byte-identically after the probe');
    runGenBrief(); // leave the shipped brief regenerated from the real master
  }
});
