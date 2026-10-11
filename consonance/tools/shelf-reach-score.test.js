// shelf-reach-score.test.js — the F1–F3 scorer (D297 part 3). Fixture dumps and fixture transcripts only; nothing real is read.
// Run: node --test consonance/tools/shelf-reach-score.test.js
'use strict';
const test = require('node:test');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const S = require('./shelf-reach-score.js');
const CLI = path.join(__dirname, 'shelf-reach-score.js');

const BS = String.fromCharCode(92);
const W0 = Date.parse('2026-09-01T00:00:00Z');
const at = (days) => new Date(W0 + days * 864e5).toISOString();

const dirs = [];
function tmp(prefix) { const d = require('./scratch.js').mkdtemp(prefix); dirs.push(d); return d; }
test.after(() => { for (const d of dirs) fs.rmSync(d, { recursive: true, force: true }); });

function dump(entries, window) {
  return ['# header', '## Some card', '- not an index line', '## NOT CARRIED -- open these by path', '', 'Dated record.', ''].concat(
    entries.map((e) => '- ' + e + '  (12 lines)  A title ...'),
    ['- a stray bullet without the lines marker', '', window === false ? '' : 'THE INDEX IS WINDOWED -- 5 older entries are NOT listed above.', '- loop/after-the-window.md  (3 lines)  must not be read', '']
  ).join('\n');
}
// today's shelf: 4 index-tier entries + 1 card-ish entry; the W0 shelf adds 3 record entries and 2 hand-backs
const BASE = dump(['map/a.md', 'journal/j1.md', 'loop/l1.md', 'loop/l2.md', 'cards/c.md']);
const AFTER = dump(['map/a.md', 'journal/j1.md', 'loop/l1.md', 'loop/l2.md', 'cards/c.md', 'loop/new1.md', 'journal/new2.md', 'map/new3.md', 'handback/h1.md', 'handback/h2.md']);

const read = (file, ts, extra = {}) => JSON.stringify({ type: 'assistant', timestamp: ts, ...extra, message: { content: [{ type: 'tool_use', id: 'x', name: 'Read', input: { file_path: file } }] } });
function projects(layout) {
  const root = tmp('srs-proj-');
  for (const [rel, lines] of Object.entries(layout)) {
    const p = path.join(root, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, lines.join('\n') + '\n');
  }
  return root;
}
const LIB = 'C--Consonance-instances-librarian';
const P = (rel) => 'C:' + BS + 'Users' + BS + 'x' + BS + 'lighthouse' + BS + 'exo_memory' + BS + rel.split('/').join(BS);

test('parseEntries: the NOT CARRIED section only, up to the window line, lower-cased, stray bullets skipped', () => {
  const e = S.parseEntries(dump(['Map/A.md', 'loop/l1.md']));
  assert.deepStrictEqual(e, ['map/a.md', 'loop/l1.md']);
});
test('parseEntries: no section, or an empty one, is an empty list, and a missing window line reads to the end', () => {
  assert.deepStrictEqual(S.parseEntries('# nothing here'), []);
  assert.deepStrictEqual(S.parseEntries(''), []);
  assert.deepStrictEqual(S.parseEntries('## NOT CARRIED\n- a/b.md  (1 lines)  t\n'), ['a/b.md']);
});

test('lists: NEW is after minus base, OLD is base\'s index tier only, HB is the new hand-backs', () => {
  const L = S.lists(S.parseEntries(BASE), S.parseEntries(AFTER));
  assert.deepStrictEqual(L.new.sort(), ['handback/h1.md', 'handback/h2.md', 'journal/new2.md', 'loop/new1.md', 'map/new3.md']);
  assert.deepStrictEqual(L.old.sort(), ['journal/j1.md', 'loop/l1.md', 'loop/l2.md', 'map/a.md']);
  assert.deepStrictEqual(L.hb.sort(), ['handback/h1.md', 'handback/h2.md']);
});

test('CONTROL: a librarian Read of a NEW entry inside the window is counted, with either slash and any case', async () => {
  const root = projects({ [LIB + '/s.jsonl']: [
    read(P('loop/NEW1.md'), at(1)),
    read('/c/x/exo_memory/journal/new2.md', at(2)),
    read(P('map/new3.md'), at(3)),
    read(P('map/new3.md'), at(4)),
  ] });
  const r = await S.scanOpens(root, W0, W0 + 14 * 864e5);
  assert.strictEqual(r.files, 1);
  assert.strictEqual(r.reads.get('loop/new1.md'), 1);
  assert.strictEqual(r.reads.get('journal/new2.md'), 1);
  assert.strictEqual(r.reads.get('map/new3.md'), 2);
});

test('the timestamp must be >= W0 and inside the 14-day window', async () => {
  const root = projects({ [LIB + '/s.jsonl']: [
    read(P('loop/new1.md'), at(-0.001)),       // just before W0
    read(P('journal/new2.md'), at(0)),         // exactly W0: counts
    read(P('map/new3.md'), at(14.5)),          // after the window
  ] });
  const r = await S.scanOpens(root, W0, W0 + 14 * 864e5);
  assert.strictEqual(r.reads.get('loop/new1.md'), undefined);
  assert.strictEqual(r.reads.get('journal/new2.md'), 1);
  assert.strictEqual(r.reads.get('map/new3.md'), undefined);
});

test('only librarian transcripts count: other seats and the Third Place are never scanned', async () => {
  const root = projects({
    [LIB + '/s.jsonl']: [read(P('loop/new1.md'), at(1))],
    ['C--Consonance-instances-main/s.jsonl']: [read(P('journal/new2.md'), at(1))],
    ['C--Consonance-instances-third-place/s.jsonl']: [read(P('map/new3.md'), at(1))],
    [LIB + '/third-place/s.jsonl']: [read(P('handback/h1.md'), at(1))],
    ['C--Consonance-instances-librarian-third-place/s.jsonl']: [read(P('handback/h2.md'), at(1))],
  });
  const r = await S.scanOpens(root, W0, W0 + 14 * 864e5);
  assert.deepStrictEqual([...r.reads.keys()], ['loop/new1.md']);
  assert.strictEqual(r.files, 1);
});

test('only Read tool_use counts: a Grep, a plain mention, a path outside exo_memory/, and a torn line are ignored', async () => {
  const grep = JSON.stringify({ timestamp: at(1), message: { content: [{ type: 'tool_use', name: 'Read', input: { file_path: 'C:/elsewhere/none.md' } }, { type: 'tool_use', name: 'Grep', input: { file_path: P('loop/new1.md') } }] } });
  const text = JSON.stringify({ timestamp: at(1), message: { content: [{ type: 'text', text: '"Read" ' + P('loop/new1.md') }] } });
  const root = projects({ [LIB + '/s.jsonl']: [grep, text, read('C:' + BS + 'other' + BS + 'loop' + BS + 'new1.md', at(1)), '{"Read" torn', read(P('journal/new2.md'), at(1))] });
  const r = await S.scanOpens(root, W0, W0 + 14 * 864e5);
  assert.deepStrictEqual([...r.reads.entries()], [['journal/new2.md', 1]]);
});

test('a transcript last written before W0 is skipped whole; a missing projects dir is an empty scan', async () => {
  const root = projects({ [LIB + '/old.jsonl']: [read(P('loop/new1.md'), at(1))] });
  const old = new Date(W0 - 864e5);
  fs.utimesSync(path.join(root, LIB, 'old.jsonl'), old, old);
  const r = await S.scanOpens(root, W0, W0 + 14 * 864e5);
  assert.strictEqual(r.files, 0);
  assert.strictEqual((await S.scanOpens(path.join(root, 'nope'), W0, W0 + 1)).files, 0);
});

const L = () => S.lists(S.parseEntries(BASE), S.parseEntries(AFTER));
const R = (o) => new Map(Object.entries(o));

test('F1: 0 NEW opens fires, 1-2 is undecided and NOT rounded up, 3 is "helped"', () => {
  assert.match(S.score(L(), R({})).f1.verdict, /^FIRES/);
  assert.match(S.score(L(), R({ 'loop/new1.md': 1, 'map/new3.md': 1 })).f1.verdict, /^undecided/);
  assert.match(S.score(L(), R({ 'loop/new1.md': 1, 'map/new3.md': 1, 'journal/new2.md': 1 })).f1.verdict, /^helped/);
});
test('F1 counts DISTINCT entries: three Reads of one NEW entry is still 1 open, not 3', () => {
  const s = S.score(L(), R({ 'loop/new1.md': 3 }));
  assert.strictEqual(s.f1.opened, 1);
  assert.strictEqual(s.f1.reads, 3);
  assert.match(s.f1.verdict, /^undecided/);
});
test('F2: the OLD open rate against 4.1%; exactly on the bar is no cost, below fires', () => {
  const four = S.lists(['loop/a.md', 'loop/b.md', 'loop/c.md', 'loop/d.md'], ['loop/a.md']);
  assert.strictEqual(S.score(four, R({})).f2.rate, 0);
  assert.match(S.score(four, R({})).f2.verdict, /^FIRES/);
  const s = S.score(four, R({ 'loop/a.md': 1 }));
  assert.strictEqual(s.f2.rate, 0.25);
  assert.match(s.f2.verdict, /^no measured cost/);
  const big = S.lists(Array.from({ length: 100 }, (_, i) => 'loop/e' + i + '.md'), []);
  const reads = (n) => R(Object.fromEntries(Array.from({ length: n }, (_, i) => ['loop/e' + i + '.md', 1])));
  assert.match(S.score(big, reads(4)).f2.verdict, /^FIRES/, '4% is below 4.1%');
  assert.match(S.score(big, reads(5)).f2.verdict, /^no measured cost/, '5% is at or above');
});
test('F2 ignores opens of NEW entries and F1 ignores opens of OLD ones', () => {
  const s = S.score(L(), R({ 'map/a.md': 5, 'loop/new1.md': 1 }));
  assert.strictEqual(s.f2.opened, 1);
  assert.strictEqual(s.f1.opened, 1);
});
test('F3: 0 newly listed hand-backs opened fires, 1+ reports the count; a record entry opened is not a hand-back', () => {
  assert.match(S.score(L(), R({ 'loop/new1.md': 1 })).f3.verdict, /^FIRES/);
  const s = S.score(L(), R({ 'handback/h1.md': 2, 'handback/h2.md': 1, 'handback/not-listed.md': 4 }));
  assert.strictEqual(s.f3.verdict, 'reports 2');
  assert.strictEqual(s.f3.reads, 3);
});
test('replay mode prints counts and NO verdict', () => {
  const s = S.score(L(), R({ 'loop/new1.md': 1 }), { replay: true });
  assert.strictEqual(s.f1.verdict, null);
  assert.strictEqual(s.f2.verdict, null);
  assert.strictEqual(s.f3.verdict, null);
  assert.strictEqual(s.f1.opened, 1);
  const txt = S.report(s, { replay: true, since: 'a', until: 'b', files: 1 });
  assert.match(txt, /BASELINE REPLAY — NOT A RESULT/);
  assert.ok(!/FIRES|helped|undecided|no measured cost/.test(txt), txt);
});

function cli(args, root) {
  const base = path.join(tmp('srs-dump-'), 'b.md'), after = path.join(path.dirname(base), 'a.md');
  fs.writeFileSync(base, BASE); fs.writeFileSync(after, AFTER);
  return spawnSync(process.execPath, [CLI, '--base', base, '--after', after, '--projects', root, ...args], { encoding: 'utf8', timeout: 30000 });
}
test('CLI: end to end on a fixture transcript, with the verdicts printed', () => {
  const root = projects({ [LIB + '/s.jsonl']: [read(P('loop/new1.md'), at(1)), read(P('handback/h1.md'), at(2)), read(P('map/a.md'), at(3))] });
  const r = cli(['--since', at(0)], root);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.match(r.stdout, /F1 {2}NEW entries opened: {2}2 of 5 distinct \(2 Reads\) -> undecided/);
  assert.match(r.stdout, /F2 {2}OLD entries opened: {2}1 of 4 = 25.00%.*no measured cost/);
  assert.match(r.stdout, /F3 {2}hand-backs opened: {3}1 of 2 distinct \(1 Reads\) -> reports 1/);
});
test('CLI: --replay-days prints a baseline with no verdict; --json is parseable', () => {
  const recent = new Date(Date.now() - 864e5).toISOString();
  const root = projects({ [LIB + '/s.jsonl']: [read(P('loop/new1.md'), recent)] });
  const r = cli(['--replay-days', '14'], root);
  assert.strictEqual(r.status, 0, r.stderr);
  assert.match(r.stdout, /BASELINE REPLAY/);
  assert.ok(!/FIRES|helped|undecided/.test(r.stdout));
  const j = JSON.parse(cli(['--replay-days', '14', '--json'], root).stdout);
  assert.strictEqual(j.f1.opened, 1);
  assert.strictEqual(j.f1.verdict, null);
});
test('CLI: bad input exits 2 and says why (no dumps, no window, an empty dump, a backwards window)', () => {
  const root = projects({});
  assert.strictEqual(spawnSync(process.execPath, [CLI], { encoding: 'utf8' }).status, 2);
  assert.strictEqual(cli([], root).status, 2, 'no --since');
  assert.strictEqual(cli(['--since', at(0), '--until', at(-1)], root).status, 2);
  const d = tmp('srs-empty-'); fs.writeFileSync(path.join(d, 'e.md'), '# nothing'); fs.writeFileSync(path.join(d, 'a.md'), AFTER);
  const r = spawnSync(process.execPath, [CLI, '--base', path.join(d, 'e.md'), '--after', path.join(d, 'a.md'), '--since', at(0)], { encoding: 'utf8' });
  assert.strictEqual(r.status, 2);
  assert.match(r.stderr, /no index entries/);
});

test('F2 BOUNDARY: 41 of 1000 is exactly the 4.1% bar and is no cost; 40 of 1000 fires', () => {
  const big = S.lists(Array.from({ length: 1000 }, (_, i) => 'loop/e' + i + '.md'), []);
  const reads = (n) => R(Object.fromEntries(Array.from({ length: n }, (_, i) => ['loop/e' + i + '.md', 1])));
  assert.match(S.score(big, reads(41)).f2.verdict, /^no measured cost/);
  assert.match(S.score(big, reads(40)).f2.verdict, /^FIRES/);
});
