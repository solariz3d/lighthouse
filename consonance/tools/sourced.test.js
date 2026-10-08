// The two directions, and the one that would quietly retire this tool.
//
// A counter that stops counting reports a clean session and looks identical to good behaviour.
// That failure has shipped three times this week wearing a green result — a build that embedded
// nothing, a wiring whose before and after were byte-identical, a watcher that exited on its
// first recoverable error. So the assertions below care most about the tool NOT going quiet.
//
//   node consonance/tools/sourced.test.js
'use strict';

const assert = require('assert');
const test = require('node:test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { scan, VALUE_PATTERNS, READING_TOOLS } = require('./sourced.js');

function transcript(turns) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sourced-'));
  const f = path.join(dir, 't.jsonl');
  const lines = [];
  for (const t of turns) {
    const content = [{ type: 'text', text: t.text }];
    for (const name of (t.tools || [])) content.push({ type: 'tool_use', name, id: 'x', input: {} });
    lines.push(JSON.stringify({ type: 'assistant', timestamp: '2026-07-29T00:00:00Z',
                                message: { content } }));
    lines.push(JSON.stringify({ type: 'user', timestamp: '2026-07-29T00:00:01Z',
                                message: { content: 'ok' } }));
  }
  fs.writeFileSync(f, lines.join('\n'));
  return f;
}

test('a value claim with no read is counted unsourced', () => {
  const f = transcript([{ text: 'The MCP server is on port 49948.', tools: [] }]);
  const r = scan(f);
  assert.strictEqual(r.total, 1);
  assert.strictEqual(r.unsourced, 1);
});

test('the same claim WITH a read in the same turn is sourced', () => {
  const f = transcript([{ text: 'The MCP server is on port 49948.', tools: ['Bash'] }]);
  assert.strictEqual(scan(f).sourced, 1);
});

test('Write and Edit do NOT count as consulting a source', () => {
  // The distinction the whole file rests on: producing is not verifying. A turn that only
  // writes has confirmed nothing, and scoring it sourced would make the number flattering.
  const f = transcript([{ text: 'The binary was built 2026-07-29 05:57.', tools: ['Write', 'Edit'] }]);
  const r = scan(f);
  assert.strictEqual(r.unsourced, 1, 'writing is not reading');
  assert.ok(!READING_TOOLS.has('Write') && !READING_TOOLS.has('Edit'));
});

test('prose without an asserted value is not counted at all', () => {
  // Guards against inflation: if ordinary sentences scored, the denominator would swamp the
  // signal and the rate would drift toward meaningless.
  const f = transcript([{ text: 'That framing seems right, and the mechanism is legible.', tools: [] }]);
  assert.strictEqual(scan(f).total, 0);
});

test('every declared pattern actually matches something — no dead detector', () => {
  // The quiet failure: a regex that never fires makes the tool report a clean session while
  // measuring nothing. Each pattern is pinned against a line drawn from a real miss this week.
  const samples = {
    port: 'the MCP server was on port 49948',
    count: 'the ico holds 10 images',
    timestamp: 'the binary was built 2026-07-29 05:57',
    state: 'the watcher is still armed',
    version: 'PIL available: 12.2.0',
    linecount: 'muscle_map.md is 1465 lines',
  };
  for (const p of VALUE_PATTERNS) {
    assert.ok(samples[p.name], `pattern ${p.name} has no sample — add one or delete the pattern`);
    assert.ok(p.re.test(samples[p.name]), `pattern ${p.name} matched nothing: dead detector`);
  }
});

test('a missing ~/.claude/projects exits 2 with a message, not an uncaught ENOENT', () => {
  // newestMain() used to readdirSync(PROJECTS) unguarded, so on any box without ~/.claude/projects
  // the tool crashed before reaching the "no transcript found" handler written for exactly that
  // case. Point HOME/USERPROFILE at an empty dir (os.homedir() reads these) and run with no --file.
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'sourced-nohome-'));
  const env = { ...process.env, USERPROFILE: home, HOME: home };
  let code = 0, stderr = '';
  try {
    execFileSync(process.execPath, [path.join(__dirname, 'sourced.js')],
      { env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    code = e.status;
    stderr = String(e.stderr || '');
  }
  assert.strictEqual(code, 2, 'the designed "no transcript" exit code, not a crash (1) or success (0)');
  assert.match(stderr, /no transcript found/, 'and the designed message');
  fs.rmSync(home, { recursive: true, force: true });
});

test('a real transcript produces a non-zero denominator', () => {
  // The end-to-end version of the same worry. If this ever reports 0 claims over a live
  // session, the tool has gone silent and the silence reads as a perfect score.
  const { scan: s, } = require('./sourced.js');
  const projects = path.join(os.homedir(), '.claude', 'projects');
  if (!fs.existsSync(projects)) return;
  let found = null;
  for (const d of fs.readdirSync(projects)) {
    const f = path.join(projects, d, '0c0c0c0a-0000-4000-8000-000000000a01.jsonl');
    if (fs.existsSync(f)) { found = f; break; }
  }
  if (!found) return;                       // other machine
  const r = s(found);
  assert.ok(r.total > 0, 'zero value-claims over a live session means the scanner died silently');
});

// D273 (devreds): the reader no longer holds a transcript as ONE string. The live chair session passed V8's string limit (0x1fffffe8 = 536,870,888 bytes; it was
// 539,727,123) and the row above died with ERR_STRING_TOO_LONG on exactly the sessions this tool exists to measure. The rows below prove the chunked reader on
// small files, where a whole-file read is still possible to compare against: every chunk size, including ones that cut a multi-byte character and a line in half.
function wholeFileTurns(file) {   // the previous implementation, kept here as the oracle
  const out = []; let pending = null;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (!line.trim()) continue;
    let r; try { r = JSON.parse(line); } catch { continue; }
    if (r.type === 'user') { if (pending) out.push(pending); pending = null; continue; }
    if (r.type !== 'assistant') continue;
    const c = (r.message || {}).content; if (!Array.isArray(c)) continue;
    if (!pending) pending = { ts: r.timestamp, text: '', tools: [] };
    for (const b of c) { if (b.type === 'text') pending.text += '\n' + b.text; if (b.type === 'tool_use') pending.tools.push(b.name); }
  }
  if (pending) out.push(pending); return out;
}
const scratchFile = (bytes) => { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sourced-chunk-')), f = path.join(dir, 't.jsonl'); fs.writeFileSync(f, bytes); return { f, done: () => fs.rmSync(dir, { recursive: true, force: true }) }; };

test('turns() agrees with a whole-file read at every chunk size, including sizes that split a multi-byte character, a line, and a CRLF', () => {
  const { turns } = require('./sourced.js');
  const rec = (o) => JSON.stringify(o);
  const lines = [
    rec({ type: 'user', message: { content: 'go' } }),
    rec({ type: 'assistant', timestamp: 't1', message: { content: [{ type: 'text', text: 'the port 4242 is é — “quoted” 🙂 live' }, { type: 'tool_use', name: 'Bash' }] } }),
    '',
    'this line is not JSON at all',
    rec({ type: 'assistant', timestamp: 't2', message: { content: [{ type: 'text', text: 'x'.repeat(5000) + ' holds 12 files' }] } }),
    rec({ type: 'user', message: { content: 'next' } }),
    rec({ type: 'assistant', timestamp: 't3', message: { content: [{ type: 'text', text: 'last v1.2.3 line, no newline after it' }] } }),
  ];
  const body = lines.map((l, i) => l + (i % 2 ? '\r\n' : '\n')).join('').replace(/\r?\n$/, '');   // mixed endings, none after the last line
  const t = scratchFile(body);
  try {
    const want = wholeFileTurns(t.f);
    assert.strictEqual(want.length, 2, 'the oracle sees two turns: the first merges the two assistant records before the next user record');
    assert.ok(want[0].text.includes('🙂') && want[0].text.includes('é'), 'and its multi-byte text survived');
    const sizes = [...Array.from({ length: 48 }, (_, i) => i + 1), 63, 64, 65, 127, 128, 129, 4096, 1 << 20];   // every small size: some cut a multi-byte character, some leave stale bytes after a short last read
    for (const chunk of sizes) assert.deepStrictEqual(require('./sourced.js').turns(t.f, chunk), want, 'chunk ' + chunk);
    assert.deepStrictEqual(turns(t.f), want, 'and the default chunk size');
  } finally { t.done(); }
});

test('an empty file, a file of blank lines, and a single line longer than the chunk all read without throwing', () => {
  const { turns, eachLine } = require('./sourced.js');
  const a = scratchFile(''), b = scratchFile('\n\n  \n'), long = 'y'.repeat(100000), c = scratchFile(JSON.stringify({ type: 'assistant', timestamp: 'tl', message: { content: [{ type: 'text', text: long + ' port 8080' }] } }));
  try {
    assert.deepStrictEqual(turns(a.f, 16), []); assert.deepStrictEqual(turns(b.f, 16), []);
    const got = turns(c.f, 4096); assert.strictEqual(got.length, 1); assert.ok(got[0].text.length > 100000, 'a 100 KB line crossing 25 chunks arrives whole');
    const seen = []; eachLine(c.f, (l) => seen.push(l.length), 4096); assert.strictEqual(seen.length, 1, 'one line, handed over once');
  } finally { a.done(); b.done(); c.done(); }
});

test('eachLine() hands over exactly the lines of the file: no phantom empty line from the stale bytes after a short last read, none after a final newline', () => {
  const { eachLine } = require('./sourced.js');
  const lines = (text, chunk) => { const t = scratchFile(text); try { const got = []; eachLine(t.f, (l) => got.push(l), chunk); return got; } finally { t.done(); } };
  // chunk 5: the second read leaves 'bbb\n' behind the one byte the last read returns, so a search of the whole buffer would find a newline that is not in the file
  assert.deepStrictEqual(lines('aaaa\nbbbb\nc', 5), ['aaaa', 'bbbb', 'c']);
  assert.deepStrictEqual(lines('aaaa\nbbbb\n', 5), ['aaaa', 'bbbb']);
  assert.deepStrictEqual(lines('aaaa\nbbbb\nc', 4096), ['aaaa', 'bbbb', 'c']);
  assert.deepStrictEqual(lines('', 5), []);
});
