// cite-check.test.js — deterministic fixtures, no repo state touched.
// Run: node --test consonance/tools/cite-check.test.js
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { scanFile, verify } = require('./cite-check.js');

const NODE = process.execPath;

test('lint: an uncited figure is found with its line number', () => {
  const rows = scanFile('intro line\nThe suite has 267 tests passing.\n');
  const uncited = rows.filter(r => r.figures.length && !r.cites.length);
  assert.strictEqual(uncited.length, 1);
  assert.strictEqual(uncited[0].n, 2);
  assert.match(uncited[0].figures[0], /267 tests/);
});

test('lint: a cited figure is not reported uncited', () => {
  const rows = scanFile('BOOT is **50,514 bytes** (`stat -c %s exo_memory/BOOT.md`)\n');
  const uncited = rows.filter(r => r.figures.length && !r.cites.length);
  assert.strictEqual(uncited.length, 0);
  const cited = rows.filter(r => r.figures.length && r.cites.length);
  assert.strictEqual(cited.length, 1);
  assert.strictEqual(cited[0].cites[0], 'stat -c %s exo_memory/BOOT.md');
});

test('lint: figures inside the citation parens are arguments, not claims', () => {
  const rows = scanFile('checked (`head -c 4096 bytes file.md`) yesterday\n');
  // "4096 bytes" sits inside the backticked command — stripping the citation must remove it
  assert.strictEqual(rows.filter(r => r.figures.length).length, 0);
});

test('lint: a citation covers its paragraph — wrapped prose is not nagged', () => {
  const rows = scanFile('The base rate is 110 of 137 value-turns\n(`node tools/sourced.js`).\n\nBut 42 tests elsewhere are uncovered.\n');
  const withFig = rows.filter(r => r.figures.length);
  assert.strictEqual(withFig.length, 2);
  assert.strictEqual(withFig[0].blockCited, true);    // command one line below, same paragraph
  assert.strictEqual(withFig[1].blockCited, false);   // different paragraph
});

test('lint: code blocks are output, not prose claims', () => {
  const rows = scanFile('```\n  12 instances total\n```\n');
  assert.strictEqual(rows.filter(r => r.figures.length).length, 0);
});

test('verify: GREEN when the figure appears in output', () => {
  const v = verify(`"${NODE}" -e "console.log(42)"`, ['42 tests'], os.tmpdir());
  assert.strictEqual(v.verdict, 'GREEN');
});

test('verify: RED when the command runs but the figure is absent', () => {
  const v = verify(`"${NODE}" -e "console.log(42)"`, ['43 tests'], os.tmpdir());
  assert.strictEqual(v.verdict, 'RED');
});

test('verify: comma-grouped figures match ungrouped output', () => {
  const v = verify(`"${NODE}" -e "console.log(50514)"`, ['50,514 bytes'], os.tmpdir());
  assert.strictEqual(v.verdict, 'GREEN');
});

test('verify: a figure embedded in a longer number does not match', () => {
  // claimed 80.0, output 180.0 — boundary check must hold
  const v = verify(`"${NODE}" -e "console.log(180.0)"`, ['80.0%'], os.tmpdir());
  assert.strictEqual(v.verdict, 'RED');
});

test('verify: NOT-RUN when the command cannot execute — never a green, never a catch', () => {
  const v = verify('definitely-not-a-real-binary-xyzzy --flag', ['7 tests'], os.tmpdir());
  assert.strictEqual(v.verdict, 'NOT-RUN');
});

test('mutation: the shipped ~43 KB error goes RED against the real byte count', () => {
  // the exact class this tool exists for: figure recalled, not measured
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cite-'));
  const f = path.join(tmp, 'boot-stub.txt');
  fs.writeFileSync(f, 'x'.repeat(50514));
  const cmd = `"${NODE}" -e "console.log(require('fs').statSync('boot-stub.txt').size)"`;
  assert.strictEqual(verify(cmd, ['43 KB'], tmp).verdict, 'RED');
  assert.strictEqual(verify(cmd, ['50,514 bytes'], tmp).verdict, 'GREEN');
  fs.rmSync(tmp, { recursive: true, force: true });
});

// ── L043 · the indented false-green ───────────────────────────────────────────────────────────
// Written RED against the shipped tool: scanFile dropped every line matching /^\s{4,}/ before the
// figure scan, so a wrong figure inside an indented block verified GREEN. The strip conflated two
// things markdown itself cannot separate — an indented CODE block and this room's indented PROSE
// (bars blocks, power tables, shelf figures). See the hand-back for why the fence strip stays and
// this one goes.

test('lint: an indented figure is scanned, not dropped', () => {
  const rows = scanFile('intro\n\n    The suite has 267 tests passing.\n');
  const withFig = rows.filter(r => r.figures.length);
  assert.strictEqual(withFig.length, 1);
  assert.match(withFig[0].figures[0], /267 tests/);
});

test('lint: an indented figure line is FLAGGED indented — the guard cannot tell prose from code', () => {
  const rows = scanFile('    12 instances total\nnot indented: 12 instances total\n');
  const withFig = rows.filter(r => r.figures.length);
  assert.strictEqual(withFig.length, 2);
  assert.strictEqual(withFig[0].indented, true);
  assert.strictEqual(withFig[1].indented, false);
});

test('lint: a FENCED block is still output, not a prose claim (the strip that stays)', () => {
  const rows = scanFile('```\n    12 instances total\n```\n');
  assert.strictEqual(rows.filter(r => r.figures.length).length, 0);
});

test('verify: a citation with NO figure to check is VOID — never GREEN', () => {
  const v = verify(`"${NODE}" -e "console.log(42)"`, [], os.tmpdir());
  assert.strictEqual(v.verdict, 'VOID');
});

test('verify: VOID is not a green even when the command succeeds and prints numbers', () => {
  const v = verify(`"${NODE}" -e "console.log(1,2,3)"`, ['not-a-figure'], os.tmpdir());
  assert.strictEqual(v.verdict, 'VOID');
});

test('END TO END: the same wrong figure goes RED indented and RED unindented', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cite-indent-'));
  const f = path.join(tmp, 'fixture.md');
  const cmd = '`node -e "console.log(42)"`';
  fs.writeFileSync(f,
    '# fixture\n\n' +
    '    The suite has 999 tests passing (' + cmd + ').\n\n' +
    'Unindented: the suite has 999 tests passing (' + cmd + ').\n');
  const r = require('child_process').spawnSync(NODE,
    [path.join(__dirname, 'cite-check.js'), f, '--run', '--cwd', tmp],
    { encoding: 'utf8' });
  // count the VERDICT COLUMN only — the legend line above the table also contains the word RED,
  // and matching /RED/ over the whole of stdout passes on one real red plus the legend.
  const reds = (r.stdout.match(/^\s+L\s*\d+\s+RED\b/gm) || []).length;
  assert.strictEqual(reds, 2, 'both citations must go RED — got:\n' + r.stdout);
  assert.strictEqual(r.status, 1);
  fs.rmSync(tmp, { recursive: true, force: true });
});
