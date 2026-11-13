/* The bullets-agreement test (Lap W, spec 00_lap_w_spec.md:288 and :491; the landing pane's, by pane H's and pane R's hand-backs).
 *
 * The room's bullets live twice: in precompact-preserve.js's ROOM_BULLETS (what the hook asks a compaction summary to carry first) and in
 * the "# Compact instructions" section of the librarian's brief, LIBRARIAN.md (what the seat's CLAUDE.md tells the summariser). If the
 * two drift apart, the summariser is told two different lists and nothing says so. Red until both halves of Lap W are on one tree.
 *
 * Run: node --test consonance/hooks/compact-bullets-agree.test.js
 */
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const { ROOM_BULLETS } = require('./precompact-preserve.js');
const BRIEF = path.join(__dirname, '..', 'src-tauri', 'brief', 'LIBRARIAN.md');

// The section runs from its own heading to the next heading of any level (or the end of the file): the brief's next part,
// "## Your notes are your restore point", has "- " lines of its own that are not room bullets.
function compactSection(text) {
  const lines = text.replace(/^﻿/, '').split(/\r?\n/);
  const starts = lines.reduce((a, l, i) => (l === '# Compact instructions' ? a.concat(i) : a), []);
  if (starts.length !== 1) return { count: starts.length, lines: [] };
  const rest = lines.slice(starts[0] + 1);
  const end = rest.findIndex((l) => /^#{1,6} /.test(l));
  return { count: 1, lines: end < 0 ? rest : rest.slice(0, end) };
}

test('the hook exports five room bullets, each a non-empty "- " line', () => {
  assert.ok(Array.isArray(ROOM_BULLETS), 'ROOM_BULLETS is not exported as an array');
  assert.strictEqual(ROOM_BULLETS.length, 5);
  for (const b of ROOM_BULLETS) assert.match(b, /^- \S/);
});

test('LIBRARIAN.md has exactly one "# Compact instructions" section', () => {
  assert.strictEqual(compactSection(fs.readFileSync(BRIEF, 'utf8')).count, 1);
});

test('every one of the hook\'s room bullets is a whole line of that section, byte for byte, in the hook\'s order', () => {
  const { lines } = compactSection(fs.readFileSync(BRIEF, 'utf8'));
  const at = ROOM_BULLETS.map((b) => lines.indexOf(b));
  const missing = ROOM_BULLETS.filter((b, i) => at[i] < 0);
  assert.deepStrictEqual(missing, [], `bullets in the hook but not in LIBRARIAN.md's section: ${JSON.stringify(missing)}`);
  assert.deepStrictEqual(at, [...at].sort((x, y) => x - y), 'the section carries the bullets in a different order from the hook');
});

test('the section carries no room bullet the hook does not (its "- " lines are exactly the hook\'s)', () => {
  const { lines } = compactSection(fs.readFileSync(BRIEF, 'utf8'));
  const extra = lines.filter((l) => /^- /.test(l) && !ROOM_BULLETS.includes(l));
  assert.deepStrictEqual(extra, [], `bullets in LIBRARIAN.md's section but not in the hook: ${JSON.stringify(extra)}`);
});

test('the comparison is not vacuous: a section missing one bullet is read as missing it', () => {
  const full = ['# Compact instructions', '', ...ROOM_BULLETS, '', '# Next'].join('\n');
  const short = full.replace(ROOM_BULLETS[2] + '\n', '');
  assert.strictEqual(compactSection(full).lines.filter((l) => ROOM_BULLETS.includes(l)).length, 5);
  assert.strictEqual(compactSection(short).lines.filter((l) => ROOM_BULLETS.includes(l)).length, 4);
});
