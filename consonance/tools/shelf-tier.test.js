/* shelf-tier.test.js — the librarian carries the SYSTEM and indexes the RECORD.
 *
 * WHAT THIS GUARDS, and it was measured rather than argued. On 2026-08-24 the seat came out of a
 * compaction at 909,787 tokens against a 1M window — ~90k left to think in, half of the previous
 * night's ~189k, because 2,458 lines had been written into exo_memory in a single day. The corpus
 * was eating the seat that holds it.
 *
 *     SYSTEM   53 files    632,817 bytes   ~270k tokens   BOOT, cards, record/, memory/,
 *                                                          spread/, research/, the seat's notes
 *     RECORD  115 files  1,501,353 bytes   ~642k tokens   journal/, loop/, map/ — 70.3% of the
 *                                                          corpus, and the half that grows nightly
 *
 * Carrying the system alone leaves ~730k to work in. The record is not lost — it is INDEXED, which
 * is what "cite, do not recollect" asked for all along.
 *
 * AND IT IS LAW 3 RATHER THAN A TUNING KNOB: "crowding shrinks the recall basins until even a clean
 * cue misses." On 2026-08-23 this seat missed a methodology recorded in SEVEN files while carrying
 * all seven.
 *
 * Run: node consonance/tools/shelf-tier.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const REPO = path.resolve(__dirname, '..', '..');
const MAIN_RS = path.join(REPO, 'consonance', 'src-tauri', 'src', 'main.rs');
const { mdFiles } = require('./corpus-age.js');

const SYSTEM = ['', 'cards', 'record', 'memory', 'librarian', 'spread', 'research'];
const RECORD = ['journal', 'loop', 'map'];

function order() {
  const src = fs.readFileSync(MAIN_RS, 'utf8');
  const m = src.match(/let order: \[\(&str, bool, bool\); (\d+)\] = \[([\s\S]*?)\];/);
  assert.ok(m, 'corpus_shelf order[] is not a 3-tuple — the carry tier is gone');
  const entries = [...m[2].matchAll(/\(\s*"([^"]*)"\s*,\s*(true|false)\s*,\s*(true|false)\s*\)/g)]
    .map((x) => ({ dir: x[1], newestFirst: x[2] === 'true', carry: x[3] === 'true' }));
  return { declared: parseInt(m[1], 10), entries, src };
}

test('every SYSTEM directory is carried', () => {
  const { entries } = order();
  for (const d of SYSTEM) {
    const e = entries.find((x) => x.dir === d);
    assert.ok(e, 'the shelf no longer lists "' + (d || '(root)') + '"');
    assert.strictEqual(e.carry, true,
      '"' + (d || '(root)') + '" is the system and must be carried, not indexed');
  }
});

test('every RECORD directory is INDEXED, not carried', () => {
  const { entries } = order();
  for (const d of RECORD) {
    const e = entries.find((x) => x.dir === d);
    assert.ok(e, 'the shelf no longer lists "' + d + '" at all — indexed is not the same as absent');
    assert.strictEqual(e.carry, false,
      '"' + d + '" is dated record and must be indexed; carrying it is what cost the seat 640k tokens');
  }
});

test('the record is INDEXED rather than DROPPED — the seat must still be able to cite it', () => {
  // Indexing is the whole point: a path the seat can open. Removing the directory instead would
  // make the record unreachable, which is a different and worse thing than not carrying it.
  const { entries } = order();
  const dirs = new Set(entries.map((e) => e.dir));
  for (const d of RECORD) assert.ok(dirs.has(d), d + ' was removed from the shelf rather than indexed');
});

test('the carry tier gates BEFORE the budget, not after', () => {
  // A record file must be indexed even when there is room. If the budget is the only gate, the
  // split silently stops applying the moment the corpus shrinks.
  const src = fs.readFileSync(MAIN_RS, 'utf8');
  assert.match(src, /if carry && spent \+ body\.len\(\) <= budget/,
    'the carry flag is not the first gate — room is not a reason to hold the record');
});

test('the header does not tell the seat the budget ran out', () => {
  // The old wording said "The budget ran out before these", now false for most of the list. A shelf
  // that misdescribes its own tiers teaches the seat that an indexed file is a casualty rather than
  // a design — the "0 indexed by path" failure in reverse.
  const src = fs.readFileSync(MAIN_RS, 'utf8');
  assert.doesNotMatch(src, /The budget ran out before these/,
    'the shelf still blames the budget for a deliberate tier');
  assert.match(src, /indexed on purpose/, 'the header must say the indexing is deliberate');
});

test('the declared arity matches the entries — a silent no-op is possible otherwise', () => {
  const { declared, entries } = order();
  assert.strictEqual(entries.length, declared,
    'order[] declares ' + declared + ' entries and contains ' + entries.length);
});

test("the librarian's own notes stay carried and newest-first", () => {
  // The seat's restore point. Indexing it would mean waking without its own ledger.
  const { entries } = order();
  const e = entries.find((x) => x.dir === 'librarian');
  assert.ok(e && e.carry && e.newestFirst,
    "librarian must be (newest-first, carried): it is the seat's own restore point");
});

test('the split is worth making — RECORD really is the larger half', () => {
  // If this ever inverts, the tier is costing reach and buying nothing, and should be revisited.
  const sum = (dirs) => dirs.reduce((a, d) => a + mdFiles(d).reduce((b, f) => b + f.size, 0), 0);
  const sys = sum(SYSTEM), rec = sum(RECORD);
  assert.ok(sys > 0 && rec > 0, 'one half measured zero — the fixture is broken');
  assert.ok(rec > sys,
    'the record (' + rec.toLocaleString() + ') is no longer larger than the system (' +
    sys.toLocaleString() + '); the split may no longer be worth its cost in reach');
});
