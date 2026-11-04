'use strict';
// claimrec/frame.test.js - the chunked frame reader (D277, seat A). node frame.test.js
const test = require('node:test'), assert = require('node:assert'), fs = require('fs'), os = require('os'), path = require('path');
const F = require('./frame.js');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'frame-test-'));
process.on('exit', () => { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (_) { /* best effort */ } });
const write = (name, text) => { const f = path.join(tmp, name); fs.writeFileSync(f, text); return f; };

test('eachLine returns every line and its number for every chunk size, including a split multi-byte character and no final newline', () => {
  const lines = ['plain', 'é — ü', 'emoji 😀 line', '', 'last line with no newline'];
  const f = write('a.txt', lines.join('\n'));
  for (const chunk of [1, 2, 3, 5, 7, 16, 64, 1 << 20]) {
    const got = []; const n = F.eachLine(f, (l, no) => got.push([no, l]), chunk);
    assert.strictEqual(n, 5, `chunk ${chunk}`);
    assert.deepStrictEqual(got, lines.map((l, i) => [i + 1, l]), `chunk ${chunk}`);
  }
});

test('eachLine on an empty file reads zero lines and a file of one newline reads one empty line', () => {
  assert.strictEqual(F.eachLine(write('empty.txt', ''), () => assert.fail('no line expected')), 0);
  const seen = []; assert.strictEqual(F.eachLine(write('nl.txt', '\n'), (l, no) => seen.push([no, l])), 1);
  assert.deepStrictEqual(seen, [[1, '']]);
});

test('a file past the V8 string limit is read whole, where the sealed readFileSync would throw', () => {
  const f = path.join(tmp, 'big.jsonl'); const row = Buffer.from('{"type":"x","pad":"' + 'a'.repeat(1024 * 1024 - 40) + '"}\n');
  const fd = fs.openSync(f, 'w'); const copies = Math.ceil((536870888 + 4 * 1024 * 1024) / row.length);
  for (let i = 0; i < copies; i++) fs.writeSync(fd, row); fs.closeSync(fd);
  assert.ok(fs.statSync(f).size > 536870888, 'the file is over the limit');
  assert.throws(() => fs.readFileSync(f, 'utf8'), 'the sealed whole-file read fails on it (this is the premise)');
  let n = 0; assert.strictEqual(F.eachLine(f, () => { n++; }), copies); assert.strictEqual(n, copies);
  fs.unlinkSync(f);
});

// ---- the membership rule, on a synthetic transcript ----
const asst = (id, ts, content) => JSON.stringify({ type: 'assistant', timestamp: ts, message: { id, content } });
const text = (n) => ({ type: 'text', text: 'x'.repeat(n) });
const mkTranscript = (rows) => write('t' + Math.random().toString(36).slice(2) + '.jsonl', rows.join('\n') + '\n');

test('a message is in the frame at 200 characters of claim text and out at 199', () => {
  const f = mkTranscript([asst('m199', '2026-09-14T01:00:00Z', [text(199)]), asst('m200', '2026-09-14T02:00:00Z', [text(200)])]);
  const r = F.readSeat('A', { file: f }); const ids = F.frameMembers(r, 0, Infinity).map((m) => m.id);
  assert.deepStrictEqual(ids, ['m200']);
});

test('Write content, Edit new_string, MultiEdit new_strings and Bash heredoc bodies count; a Bash command with no heredoc counts for nothing', () => {
  const h = (b) => `cat > f <<'EOF'\n${b}\nEOF`;
  const f = mkTranscript([
    asst('w', '2026-09-14T01:00:00Z', [{ type: 'tool_use', name: 'Write', input: { content: 'x'.repeat(200) } }]),
    asst('e', '2026-09-14T01:01:00Z', [{ type: 'tool_use', name: 'Edit', input: { new_string: 'x'.repeat(200), old_string: 'y'.repeat(900) } }]),
    asst('me', '2026-09-14T01:02:00Z', [{ type: 'tool_use', name: 'MultiEdit', input: { edits: [{ new_string: 'x'.repeat(100) }, { new_string: 'x'.repeat(100) }] } }]),
    asst('bh', '2026-09-14T01:03:00Z', [{ type: 'tool_use', name: 'Bash', input: { command: h('x'.repeat(200)) } }]),
    asst('bn', '2026-09-14T01:04:00Z', [{ type: 'tool_use', name: 'Bash', input: { command: 'git commit -m "' + 'x'.repeat(500) + '"' } }]),
    asst('th', '2026-09-14T01:05:00Z', [{ type: 'thinking', thinking: 'x'.repeat(900) }]),
  ]);
  const ids = F.frameMembers(F.readSeat('A', { file: f }), 0, Infinity).map((m) => m.id).sort();
  assert.deepStrictEqual(ids, ['bh', 'e', 'me', 'w']);
});

test('rows of one message.id add up (a message is 1-4 rows) and the first row sets its timestamp; the window is [from, to)', () => {
  const f = mkTranscript([asst('m', '2026-09-14T23:59:59Z', [text(120)]), asst('m', '2026-09-15T00:00:05Z', [text(120)]), asst('z', '2026-09-15T00:00:00Z', [text(300)])]);
  const r = F.readSeat('A', { file: f });
  assert.deepStrictEqual(F.frameMembers(r, Date.parse('2026-09-14T00:00:00Z'), Date.parse('2026-09-15T00:00:00Z')).map((m) => m.id), ['m'], 'm starts before the end of the window');
  assert.deepStrictEqual(F.frameMembers(r, Date.parse('2026-09-15T00:00:00Z'), Date.parse('2026-09-16T00:00:00Z')).map((m) => m.id), ['z'], 'the start is inclusive, and m began a day earlier');
  assert.deepStrictEqual(r.messages.get('m').lines, [1, 2], 'row line numbers are kept');
});

test('the machine is the nearest preceding hook-attachment path, ? before any', () => {
  const att = (who) => JSON.stringify({ type: 'attachment', attachment: { command: 'C:\\Users\\' + who + '\\.claude\\hooks\\x.js' } }).replace(/\\\\/g, '\\\\');
  const f = mkTranscript([asst('q', '2026-09-14T01:00:00Z', [text(300)]), att('zackn'), asst('l', '2026-09-14T02:00:00Z', [text(300)]), att('nname'), asst('d', '2026-09-14T03:00:00Z', [text(300)])]);
  const by = Object.fromEntries(F.frameMembers(F.readSeat('A', { file: f }), 0, Infinity).map((m) => [m.id, m.machine]));
  assert.deepStrictEqual(by, { q: '?', l: 'L', d: 'D' });
});

test('a real prompt is a non-meta, non-sidechain user row with text; a tool_result-only row is not one', () => {
  const u = (extra) => JSON.stringify({ type: 'user', ...extra });
  const rows = [
    u({ message: { role: 'user', content: 'do the thing' } }), // 1 yes
    u({ message: { role: 'user', content: [{ type: 'tool_result', content: 'ok' }] } }), // 2 no
    u({ message: { role: 'user', content: [{ type: 'text', text: 'second' }] } }), // 3 yes
    u({ isMeta: true, message: { role: 'user', content: 'meta' } }), // 4 no
    u({ isSidechain: true, message: { role: 'user', content: 'side' } }), // 5 no
    u({ message: { role: 'user', content: '   ' } }), // 6 no
    asst('m', '2026-09-14T01:00:00Z', [text(10)]),
  ];
  assert.deepStrictEqual(F.readSeat('A', { file: mkTranscript(rows) }).prompts, [1, 3]);
});

test('a missing transcript is reported as missing, not as an empty seat', () => {
  const r = F.readSeat('A', { file: path.join(tmp, 'does-not-exist.jsonl') });
  assert.strictEqual(r.missing, true);
});

// ---- the reproduction: all 60 cells of the registration's section 11 table, on the real transcripts ----
test('REAL DATA: the chunked reader reproduces all 60 cells (6 seats x 10 days, 09-14 to 09-23) of the registration section 11 table, chair included', (t) => {
  const absent = Object.keys(F.SEATS).filter((s) => !fs.existsSync(F.seatFile(s)));
  if (absent.length) return t.skip(`seat transcripts not on this machine: ${absent.join(', ')} (this row needs all six, under ~/.claude/projects)`);
  const md = fs.readFileSync(path.join(__dirname, '..', 'claim_base_rate_registration_2026-09-27.md'), 'utf8');
  const sealed = {};
  for (const l of md.split('\n')) { const m = /^(2026-09-\d\d)\s+(.*)$/.exec(l); if (m && /\dL\/\d+D/.test(m[2])) sealed[m[1]] = m[2].trim().split(/\s+/); }
  const days = Object.keys(sealed).sort(); assert.strictEqual(days.length, 10, 'the registration table has ten days');
  const seats = Object.keys(F.SEATS); const got = {};
  for (const s of seats) got[s] = F.dayCounts(F.readSeat(s));
  let compared = 0; const diffs = [];
  for (const d of days) {
    sealed[d].forEach((cell, i) => {
      const c = got[seats[i]]; const L = c[d + ' L'] || 0, D = c[d + ' D'] || 0, Q = c[d + ' ?'] || 0;
      const mine = `${L}L/${D}D${Q ? '/' + Q + '?' : ''}`; compared++;
      if (mine !== cell) diffs.push(`${d} ${seats[i]}: sealed ${cell}, mine ${mine}`);
    });
  }
  assert.strictEqual(compared, 60);
  assert.deepStrictEqual(diffs, [], 'cells that differ from the sealed table');
});
