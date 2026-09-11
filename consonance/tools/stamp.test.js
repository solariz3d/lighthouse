/* stamp.test.js — the time on a master entry is READ from the clock, never typed.
 *
 * WHAT THIS PREVENTS, because it happened twice in one hour (librarian/2026-09-11.md, 02:25 and
 * 02:38): the seat typed "02:55" on an entry whose commit landed 02:21:26, then "02:40" on one that
 * landed 02:37:11. A stamp is a number in prose, and the room's rule for numbers in prose is one
 * run of a visible instrument. "Read `date` from here" is a resolution, not a mechanism; this is
 * the mechanism. The tool reads the clock in the same call that appends, and it REFUSES text that
 * arrives already carrying a leading stamp, because that is exactly the failure it exists to catch.
 *
 * RED FIRST: this file was written before stamp.js existed and run once against the missing
 * module (MODULE_NOT_FOUND) before a line of the tool was written.
 *
 * Run: node --test consonance/tools/stamp.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { hhmm, compose, typedStamp, append } = require('./stamp.js');

const TOOL = path.join(__dirname, 'stamp.js');
const at = (h, m) => new Date(2026, 8, 11, h, m, 11);
const tmpfile = (body) => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'stamp-')), '2026-09-11.md');
  fs.writeFileSync(f, body);
  return f;
};

test('hhmm reads the clock it is given, zero-padded, local time', () => {
  assert.strictEqual(hhmm(at(2, 37)), '02:37');
  assert.strictEqual(hhmm(at(14, 5)), '14:05');
});

test('a master entry is a level-two heading with the stamp and an em-dash', () => {
  assert.strictEqual(compose('master', '02:37', 'D058 collated'), '\n## 02:37 — D058 collated\n');
});

test('a map line is a bullet with the stamp', () => {
  assert.strictEqual(compose('map', '02:37', 'D058 collated'), '- 02:37 D058 collated\n');
});

test('text that arrives already carrying a leading stamp is recognised as typed', () => {
  assert.strictEqual(typedStamp('02:40 — D058 collated'), true);
  assert.strictEqual(typedStamp('## 02:40 D058 collated'), true);
  assert.strictEqual(typedStamp('- 2:40 collated'), true);
  assert.strictEqual(typedStamp('D058 collated at 02:40 (fa10f61)'), false, 'a time mid-sentence is prose, not a stamp');
  assert.strictEqual(typedStamp('the 09-06 set is 4 files'), false);
});

test('append writes one entry stamped from the clock and returns the line', () => {
  const f = tmpfile('# head\n');
  const line = append(f, 'master', 'D058 collated', at(2, 37));
  assert.strictEqual(line, '\n## 02:37 — D058 collated\n');
  assert.strictEqual(fs.readFileSync(f, 'utf8'), '# head\n\n## 02:37 — D058 collated\n');
});

test('a typed leading stamp is REFUSED and nothing is written', () => {
  const f = tmpfile('# head\n');
  assert.throws(() => append(f, 'master', '02:55 — the map amended', at(2, 21)), /typed stamp/);
  assert.strictEqual(fs.readFileSync(f, 'utf8'), '# head\n');
});

test('a missing file is refused rather than created — a master is never born by accident', () => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'stamp-')), 'absent.md');
  assert.throws(() => append(f, 'master', 'x', at(2, 21)), /does not exist/);
  assert.strictEqual(fs.existsSync(f), false);
});

test('empty text is refused', () => {
  const f = tmpfile('# head\n');
  assert.throws(() => append(f, 'map', '   ', at(2, 21)), /empty/);
  assert.strictEqual(fs.readFileSync(f, 'utf8'), '# head\n');
});

test('CLI: the stamp written is the clock at the call, to the minute', () => {
  const f = tmpfile('# head\n');
  const before = hhmm(new Date());
  const out = execFileSync(process.execPath, [TOOL, f, '--text', 'from the cli'], { encoding: 'utf8' });
  const after = hhmm(new Date());
  const m = fs.readFileSync(f, 'utf8').match(/^## (\d\d:\d\d) — from the cli$/m);
  assert.ok(m, 'entry present');
  assert.ok(m[1] === before || m[1] === after, `stamp ${m[1]} is the clock (${before}..${after})`);
  assert.match(out, /## \d\d:\d\d — from the cli/);
});

test('CLI: stdin carries the text when --text is absent, and --map picks the bullet shape', () => {
  const f = tmpfile('# map\n');
  const r = spawnSync(process.execPath, [TOOL, f, '--map'], { input: "it's a line with an apostrophe\n", encoding: 'utf8' });
  assert.strictEqual(r.status, 0, r.stderr);
  assert.match(fs.readFileSync(f, 'utf8'), /^- \d\d:\d\d it's a line with an apostrophe\n$/m);
});

test('CLI: a typed stamp exits 2 with nothing written', () => {
  const f = tmpfile('# head\n');
  const r = spawnSync(process.execPath, [TOOL, f, '--text', '02:40 — D058 collated'], { encoding: 'utf8' });
  assert.strictEqual(r.status, 2);
  assert.match(r.stderr, /typed stamp/);
  assert.strictEqual(fs.readFileSync(f, 'utf8'), '# head\n');
});
