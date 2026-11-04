'use strict';
// D175 (pane E): mutation pass over src/doc/phrasebook.js ON A COPY, under the heavy-run lock (the 16:5x test-load rule),
// every node --test at --test-concurrency=4. One exact-string replacement per mutant (exactly one match, else NOT
// APPLIED), restored in a finally. One progress line per mutant.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
if (!process.env.DRY) require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E: D175 phrasebook mutation pass (on a copy)' });
const LIVE = 'C:/Users/nname/Desktop/t180-track-builder', COPY = path.join(__dirname, 'mcopy');
fs.rmSync(COPY, { recursive: true, force: true });
for (const d of ['src', 'tools', 'test', 'docs']) fs.cpSync(path.join(LIVE, d), path.join(COPY, d), { recursive: true });
const F = 'src/doc/phrasebook.js', TESTS = ['test/phrasebook.test.js'];
const M = [
  ['sakura: the tight at 90°, not 30°', "['tight', 30]", "['tight', 90]"],
  ['sakura: flat, not half-pipe', "({ word, dir: 'L', font: 'half-pipe', tempo: 'standard', handles: angled(word, deg, 'standard') })", "({ word, dir: 'L', font: 'flat', tempo: 'standard', handles: angled(word, deg, 'standard') })"],
  ['sakura: straight into tight (order broken)', "[['sweep', 10], ['turn', 20], ['tight', 30]", "[['sweep', 10], ['tight', 30], ['turn', 20]"],
  ['angled: length without the ease', 'length: (deg * DEG * WORDS[word].R * T.scale) / (1 - T.ease)', 'length: (deg * DEG * WORDS[word].R * T.scale)'],
  ['hairpin: flat font', "words: ['turn', 'tight', 'turn'].map((word) => ({ word, dir: 'L', font: 'bowl',", "words: ['turn', 'tight', 'turn'].map((word) => ({ word, dir: 'L', font: 'flat',"],
  ['hairpin: straight into tight', "words: ['turn', 'tight', 'turn'].map(", "words: ['straight', 'tight', 'turn'].map("],
  ['S: both turns left', "{ word: 'turn', dir: 'R', font: 'bowl', tempo: 'serpents' }", "{ word: 'turn', dir: 'L', font: 'bowl', tempo: 'serpents' }"],
  ['S: standard tempo', "words: [{ word: 'turn', dir: 'L', font: 'bowl', tempo: 'serpents' }", "words: [{ word: 'turn', dir: 'L', font: 'bowl', tempo: 'standard' }"],
  ['spiral: no climb', "{ word: 'turn', dir: 'L', font: 'bowl', tempo: 'standard', handles: { climb: 6 * DEG } },", "{ word: 'turn', dir: 'L', font: 'bowl', tempo: 'standard' },"],
  ['spiral: never back to level', "handles: { climb: -6 * DEG } },", '},'],
  ['spiral: opens straight into tight', "{ word: 'turn', dir: 'L', font: 'bowl', tempo: 'standard', handles: { climb: 6 * DEG } },", "{ word: 'tight', dir: 'L', font: 'bowl', tempo: 'standard', handles: { climb: 6 * DEG } },"],
  ['items: handles dropped', "...(w.handles ? { handles: w.handles } : {})", ''],
  ['placePhrase: word by word (many undo steps)', 'function placePhrase(doc, name) { return appendPhrase(doc, name, items(find(name))); }', "function placePhrase(doc, name) { return items(find(name)).reduce((d, it) => require('./document.js').appendWord(d, it.word, it.opts), doc); }"],
  ['pieces: handle overrides lost', 'handles: { ...d.handles, ...(w.handles || {}) }', 'handles: d.handles'],
  ['pieces: one id for all', "id: `b-phrase-${p.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`", "id: 'b-phrase'"],
  ['pieces: not built-in', "author: 't180-track-builder', builtin: true, kind: 'phrase',", "author: 't180-track-builder', builtin: false, kind: 'phrase',"],
  ['find: unknown phrase not refused', "if (!p) throw new DocError('NO_SUCH_PHRASE'", "if (false) throw new DocError('NO_SUCH_PHRASE'"],
  ['a source misquoted', 'FINDINGS.md:14 "The dominant form is a **bowl**', 'FINDINGS.md:14 "The dominant form is a bowl'],
];
const orig = fs.readFileSync(path.join(COPY, F), 'utf8');
let applied = 0, caught = 0, notApplied = 0; const rows = [];
for (const [name, from, to] of M) {
  const n = orig.split(from).length - 1;
  if (process.env.DRY) { if (n !== 1) console.log(`DRY: ${n} matches  ${name}`); continue; }
  if (n !== 1) { notApplied++; rows.push(`NOT APPLIED (${n} matches)  ${name}`); console.log(`[${applied + notApplied}/${M.length}] ${rows[rows.length - 1]}`); continue; }
  try {
    fs.writeFileSync(path.join(COPY, F), orig.replace(from, to));
    const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', ...TESTS], { cwd: COPY, encoding: 'utf8', timeout: 900000 });
    applied++; const failed = r.status !== 0; if (failed) caught++;
    rows.push(`${failed ? 'caught  ' : 'SURVIVED'}  ${name}`); console.log(`[${applied + notApplied}/${M.length}] ${rows[rows.length - 1]}`);
  } finally { fs.writeFileSync(path.join(COPY, F), orig); }
}
if (process.env.DRY) { console.log(`DRY done: ${M.length} mutants checked`); process.exit(0); }
const same = fs.readFileSync(path.join(COPY, F), 'utf8') === fs.readFileSync(path.join(LIVE, F), 'utf8');
console.log(`\napplied ${applied} / caught ${caught} / NOT APPLIED ${notApplied} (of ${M.length}); copy restored equal to the live file: ${same ? 'yes' : 'NO'}`);
