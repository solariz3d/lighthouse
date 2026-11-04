// big-transcript.test.js — pane-status.js, usage.js and offramp-check.js on a transcript LONGER THAN V8'S STRING LIMIT (D630).
//
// Six of the eight seat transcripts are past 512 MB. `fs.readFileSync(file, 'utf8')` of a file over 0x1fffffe8 bytes (536,870,888)
// throws ERR_STRING_TOO_LONG: pane-status died on it (:96), offramp-check died on it (:72), and usage caught the throw and went on
// (:114), so it printed a table without that seat's file in it, silently short. The fix streams each file a line at a time through
// sourced.js eachLine (D273, the same limit, already tested), and usage refuses to print anything when a file cannot be read.
//
// THE FILE. One synthetic transcript, built once in the scratch root (G: on this machine, scratch.js) and removed in `after`:
//   a user turn and an assistant response at the START (so a reader that only keeps the tail is caught too),
//   ~540 MB of 1 MB filler lines (`progress` rows, which no tool counts),
//   at the END a user turn, an assistant turn offering an end ("or call it a night?"), and a last assistant turn with text and no tool.
//
//   node --test consonance/tools/big-transcript.test.js     (about half a minute; it writes and reads 541 MB)
'use strict';

const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const LIMIT = 0x1fffffe8;   // V8's maximum string length on 64-bit, in UTF-16 units; one per byte for ASCII
const PANE = 'bbbbbbbb-2222-4000-8000-00000000big1';
const LAST_TEXT = 'the last word of a very long session';

const root = require('./scratch.js').mkdtemp('bigtx-');
const projects = path.join(root, 'projects');
const dir = path.join(projects, 'C--somewhere-sibling-big');
const file = path.join(dir, `${PANE}.jsonl`);

const asst = (id, ts, text, tool) => ({
  type: 'assistant', timestamp: ts, isSidechain: false,
  message: { id, model: 'claude-opus-5', role: 'assistant', usage: { input_tokens: 10, output_tokens: 20, cache_creation_input_tokens: 30, cache_read_input_tokens: 40 },
    content: [...(text ? [{ type: 'text', text }] : []), ...(tool ? [{ type: 'tool_use', id: 't1', name: 'Bash', input: {} }] : [])] },
});
const user = (ts, text) => ({ type: 'user', timestamp: ts, isSidechain: false, message: { role: 'user', content: text } });

test.before(() => {
  fs.mkdirSync(dir, { recursive: true });
  const fd = fs.openSync(file, 'w');
  try {
    const w = (o) => fs.writeSync(fd, JSON.stringify(o) + '\n');
    w(user('2026-11-03T10:00:00.000Z', 'start'));
    w(asst('msg_first', '2026-11-03T10:00:01.000Z', 'first', false));
    const pad = Buffer.from(JSON.stringify({ type: 'progress', pad: 'x'.repeat(1 << 20) }) + '\n');
    let size = fs.fstatSync(fd).size;
    while (size < LIMIT + 4 * (1 << 20)) { fs.writeSync(fd, pad); size += pad.length; }
    w(user('2026-11-03T12:00:00.000Z', 'carry on'));
    w(asst('msg_offer', '2026-11-03T12:00:01.000Z', 'That is done. Shall we do the next one, or call it a night?', false));
    w(asst('msg_last', '2026-11-03T12:00:02.000Z', LAST_TEXT, false));
  } finally { fs.closeSync(fd); }
  assert.ok(fs.statSync(file).size > LIMIT, 'the control: the file is past the string limit');
});
test.after(() => { fs.rmSync(root, { recursive: true, force: true }); });

test('the control: reading the synthetic transcript whole as one string throws ERR_STRING_TOO_LONG', () => {
  assert.throws(() => fs.readFileSync(file, 'utf8'), (e) => e.code === 'ERR_STRING_TOO_LONG');
});

test('pane-status reports the last turn of a transcript past the string limit instead of crashing', () => {
  const roster = path.join(root, 'panes.json');
  fs.writeFileSync(roster, JSON.stringify([{ pane: PANE }]));
  const r = spawnSync(process.execPath, [path.join(__dirname, 'pane-status.js'), '--full'], {
    env: { ...process.env, CLAUDE_PROJECTS: projects, PANES_JSON: roster, LETTERS_JSON: path.join(root, 'none.json'), PANE_SETTLED_MS: '0' },
    encoding: 'utf8', windowsHide: true, timeout: 5 * 60 * 1000,
  });
  assert.strictEqual(r.status, 0, `pane-status exited ${r.status}: ${(r.stderr || '').slice(0, 400)}`);
  assert.match(r.stdout, new RegExp(`done\\?\\s+quiet .* ${LAST_TEXT.length} chars`), r.stdout.slice(0, 400));
  assert.ok(r.stdout.includes(LAST_TEXT), 'and it printed that last turn');
});

// The forward read keeps what the backward scan meant: the newest assistant record with text is the last turn, and a tool_use in it or
// in any assistant record after it means the turn is still going. Small files, so these run in a moment.
test('pane-status, read forward: a tool after the last text is WORKING; a tool in the text record is WORKING; text with nothing after is done?', () => {
  const small = require('./scratch.js').mkdtemp('bigtx-small-');
  const roster = path.join(small, 'panes.json'); fs.writeFileSync(roster, JSON.stringify([{ pane: PANE }]));
  const run = (rows) => {
    const d = path.join(small, 'projects', 'C--x'); fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, `${PANE}.jsonl`), rows.map((o) => JSON.stringify(o)).join('\n') + '\n');
    const r = spawnSync(process.execPath, [path.join(__dirname, 'pane-status.js')], { env: { ...process.env, CLAUDE_PROJECTS: path.join(small, 'projects'), PANES_JSON: roster, LETTERS_JSON: path.join(small, 'none.json'), PANE_SETTLED_MS: '0' }, encoding: 'utf8', windowsHide: true });
    assert.strictEqual(r.status, 0, r.stderr); return r.stdout;
  };
  try {
    assert.match(run([asst('a', 't', 'older text', false), asst('b', 't', 'newest text', false), asst('c', 't', null, true)]), /WORKING .*\n\s+newest text/);
    assert.match(run([asst('a', 't', 'older text', false), asst('b', 't', 'newest text', true)]), /WORKING .*\n\s+newest text/);
    assert.match(run([asst('a', 't', 'older', true), asst('b', 't', 'newest text', false)]), /done\? .*\n\s+newest text/);
  } finally { fs.rmSync(small, { recursive: true, force: true }); }
});

test('usage counts every response in a transcript past the string limit, the first and the last', () => {
  const U = require('./usage.js');
  const { responses } = U.readResponses(projects, 0);
  assert.deepStrictEqual([...responses.keys()].sort(), ['msg_first', 'msg_last', 'msg_offer']);
});

test('usage refuses to return a short count when a transcript cannot be read: it throws, naming the file', () => {
  const U = require('./usage.js');
  const open = fs.openSync;
  fs.openSync = function (p, ...rest) { if (path.resolve(String(p)) === path.resolve(file)) { const e = new Error('EIO: i/o error, open'); e.code = 'EIO'; throw e; } return open.call(this, p, ...rest); };
  try {
    assert.throws(() => U.readResponses(projects, 0), (e) => e.message.includes(file) && /EIO/.test(e.message));
  } finally { fs.openSync = open; }
});

test('usage refuses to return a short count when a transcript cannot be stat\'d either: it throws, naming the file', () => {
  const U = require('./usage.js');
  const stat = fs.statSync;
  fs.statSync = function (p, ...rest) { if (path.resolve(String(p)) === path.resolve(file)) { const e = new Error('EACCES: permission denied, stat'); e.code = 'EACCES'; throw e; } return stat.call(this, p, ...rest); };
  try {
    assert.throws(() => U.readResponses(projects, 0), (e) => e.message.includes(file) && /EACCES/.test(e.message));
  } finally { fs.statSync = stat; }
});

test('usage.js on the command line prints no table and exits non-zero when a transcript cannot be read', () => {
  const preload = path.join(root, 'eio.js');
  fs.writeFileSync(preload, `const fs = require('fs'), path = require('path'); const o = fs.openSync;
fs.openSync = function (p, ...r) { if (path.resolve(String(p)) === ${JSON.stringify(path.resolve(file))}) { const e = new Error('EIO: i/o error, open'); e.code = 'EIO'; throw e; } return o.call(this, p, ...r); };`);
  const home = path.join(root, 'home'); fs.mkdirSync(home, { recursive: true });
  fs.writeFileSync(path.join(home, '.consonance.json'), JSON.stringify({ data_dir: root, instances_dir: root, ambient_tz: 'America/Regina' }));
  const r = spawnSync(process.execPath, ['-r', preload, path.join(__dirname, 'usage.js'), '--projects', projects], {
    env: { ...process.env, USERPROFILE: home, HOME: home }, encoding: 'utf8', windowsHide: true, timeout: 5 * 60 * 1000,
  });
  assert.notStrictEqual(r.status, 0, `usage exited 0 and printed:\n${(r.stdout || '').slice(0, 400)}`);
  assert.strictEqual((r.stdout || '').trim(), '', 'no table at all');
  assert.ok((r.stderr || '').includes(file), `the error names the file: ${(r.stderr || '').slice(0, 400)}`);
});

test('offramp-check scans a transcript past the string limit and finds the offer at its end', () => {
  const { scan } = require('./offramp-check.js');
  const r = scan(file);
  assert.strictEqual(r.assistantTurns, 3, 'every assistant turn, the first and the last two');
  assert.strictEqual(r.hits.length, 1);
  assert.strictEqual(r.hits[0].matched.toLowerCase(), 'or call it a night');
});
