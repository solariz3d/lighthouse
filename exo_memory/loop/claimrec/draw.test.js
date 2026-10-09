'use strict';
// claimrec/draw.test.js - the L119 sample: draw, extract, assign (D277, seat A). node draw.test.js
const test = require('node:test'), assert = require('node:assert'), fs = require('fs'), os = require('os'), path = require('path'), crypto = require('crypto');
const D = require('./draw.js'), F = require('./frame.js');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'draw-test-'));
process.on('exit', () => { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch (_) { /* best effort */ } });
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

// ---- the sealed rules, against vectors computed independently (openssl-style, by hand) ----
test('orderKey is sha256("L119|" + message.id), and the draw is ascending by it whatever order the input comes in', () => {
  assert.strictEqual(D.orderKey('abc'), 'c0b1c4fb78e728053e2d6da2f7093d8caf3aec8f04e4c5e4c90fad67237f9662');
  const items = ['msg_b', 'msg_a', 'msg_c'].map((id) => ({ id }));
  assert.deepStrictEqual(D.drawOrder(items, 3).map((x) => x.id), ['msg_a', 'msg_c', 'msg_b']);
  assert.deepStrictEqual(D.drawOrder([...items].reverse(), 3).map((x) => x.id), ['msg_a', 'msg_c', 'msg_b']);
  assert.deepStrictEqual(D.drawOrder(items, 2).map((x) => x.id), ['msg_a', 'msg_c'], 'M cuts the ordered list');
});

test('claimId is message.id|n', () => assert.strictEqual(D.claimId('msg_X', 7), 'msg_X|7'));

test('capK keeps the K statements first in sha256(id|n) order, returned by n; fewer than K keeps all; none keeps none', () => {
  const st = [5, 1, 4, 2, 3].map((n) => ({ n, text: 's' + n }));
  assert.deepStrictEqual(D.capK('msg_X', st).map((s) => s.n), [2, 3, 5], 'hash order is 5,2,3,4,1');
  assert.deepStrictEqual(D.capK('msg_X', [...st].reverse()).map((s) => s.n), [2, 3, 5], 'input order does not matter');
  assert.deepStrictEqual(D.capK('msg_X', st.slice(0, 2)).map((s) => s.n).sort(), [1, 5].sort(), 'two statements keep both');
  assert.deepStrictEqual(D.capK('msg_X', []), []);
});

test('assignment: B and C never see their own seat; the others split by parity of the first byte; the overlap is the second byte < 64 and only for librarian, chair, A, E', () => {
  // m|1: b0 182 (even -> B) b1 243; m|2: b0 9 (odd -> C) b1 72; m|3: b0 56 (even -> B) b1 6 (overlap); m|4: b0 227 -> C; m|6: b0 186 -> B, b1 64 (the boundary: NOT overlap)
  assert.deepStrictEqual(D.verifiersFor('librarian', 'm|1'), ['B']);
  assert.deepStrictEqual(D.verifiersFor('librarian', 'm|2'), ['C']);
  assert.deepStrictEqual(D.verifiersFor('librarian', 'm|3'), ['B', 'C']);
  assert.deepStrictEqual(D.verifiersFor('chair', 'm|4'), ['C']);
  assert.deepStrictEqual(D.verifiersFor('E', 'm|6'), ['B'], 'second byte 64 is not < 64');
  assert.deepStrictEqual(D.verifiersFor('B', 'm|1'), ['C']); assert.deepStrictEqual(D.verifiersFor('B', 'm|3'), ['C'], 'a B claim is never in the overlap');
  assert.deepStrictEqual(D.verifiersFor('C', 'm|2'), ['B']); assert.deepStrictEqual(D.verifiersFor('C', 'm|3'), ['B']);
});

test('assignment over 4,000 synthetic claims: about a quarter overlap, an even B/C split, and no B or C seat in the overlap', () => {
  let overlap = 0, b = 0, c = 0; const N = 4000;
  for (let i = 0; i < N; i++) { const v = D.verifiersFor(['librarian', 'chair', 'A', 'E'][i % 4], `msg_${i}|${1 + (i % 3)}`); if (v.length === 2) overlap++; else if (v[0] === 'B') b++; else c++; }
  assert.ok(overlap / N > 0.22 && overlap / N < 0.28, `overlap ${overlap / N}`);
  assert.ok(Math.abs(b - c) / (b + c) < 0.08, `split ${b}/${c}`);
  for (let i = 0; i < 2000; i++) { assert.strictEqual(D.verifiersFor('B', `x${i}|1`).length, 1); assert.strictEqual(D.verifiersFor('C', `x${i}|1`).length, 1); }
});

// ---- the guard ----
test('the re-measure window refuses to be drawn one millisecond before it closes, and runs at the closing instant; the original window is never refused', () => {
  const w = D.WINDOWS.remeasure, t = Date.parse(w.closes);
  assert.throws(() => D.guard(w, t - 1), /closes at 2026-10-10T11:55:00Z/);
  assert.doesNotThrow(() => D.guard(w, t));
  assert.doesNotThrow(() => D.guard(D.WINDOWS.original, 0));
});

test('the registered re-measure window is 2026-10-03T11:55:00Z to 2026-10-10T11:55:00Z, seven days (05:55 Regina local)', () => {
  const w = D.WINDOWS.remeasure; assert.strictEqual(Date.parse(w.to) - Date.parse(w.from), 7 * 86400e3);
  assert.strictEqual(w.from, '2026-10-03T11:55:00Z');
});

// ---- turns and exclusions ----
test('a turn is [the real prompt at or before the line, the next real prompt)', () => {
  assert.deepStrictEqual(D.turnSpan([5, 20, 40], 25), { start: 20, end: 40 });
  assert.deepStrictEqual(D.turnSpan([5, 20, 40], 20), { start: 20, end: 40 }, 'a line on a prompt belongs to that prompt\'s turn');
  assert.deepStrictEqual(D.turnSpan([5, 20, 40], 41), { start: 40, end: Infinity });
  assert.deepStrictEqual(D.turnSpan([5, 20, 40], 2), { start: 0, end: 5 }, 'before any prompt');
});

// ---- extraction, in the L115 format ----
const row = (uuid, content) => ({ uuid, message: { content } });
test('extractReply: [label] lines, one blank line between parts, thinking and non-writing tools left out, CRLF -> LF', () => {
  const out = D.extractReply([
    row('u1', [{ type: 'thinking', thinking: 'secret' }, { type: 'text', text: 'hello\r\nworld' }]),
    row('u2', [{ type: 'tool_use', name: 'Write', input: { content: 'file body', file_path: 'p' } }]),
    row('u3', [{ type: 'tool_use', name: 'Edit', input: { new_string: 'new', old_string: 'old' } }, { type: 'tool_use', name: 'MultiEdit', input: { edits: [{ new_string: 'e1' }, { new_string: 'e2' }] } }]),
    row('u4', [{ type: 'tool_use', name: 'Bash', input: { command: "cat > f <<'EOF'\nbody line\nEOF" } }, { type: 'tool_use', name: 'Bash', input: { command: 'git commit -m "a long message that is not a claim here"' } }, { type: 'tool_use', name: 'Read', input: { file_path: 'x' } }]),
  ]);
  assert.strictEqual(out, ['[text]\nhello\nworld', '[written through Write]\nfile body', '[written through Edit]\nnew', '[written through MultiEdit]\ne1', '[written through MultiEdit]\ne2', '[written through Bash]\nbody line'].join('\n\n'));
});

test('extractReply keeps a duplicated uuid once', () => {
  const r = row('same', [{ type: 'text', text: 'once' }]);
  assert.strictEqual(D.extractReply([r, r, row('other', [{ type: 'text', text: 'twice' }])]), '[text]\nonce\n\n[text]\ntwice');
});

test('echo and printf strings redirected with > or >> are written text; an echo with no redirect is not', () => {
  assert.deepStrictEqual(D.echoWritten(`echo "the fact is 12" > notes.txt`), ['the fact is 12']);
  assert.deepStrictEqual(D.echoWritten(`printf 'a b c' >> log.txt`), ['a b c']);
  assert.deepStrictEqual(D.echoWritten(`echo "printed only"`), []);
});

// ---- the whole thing, on a synthetic set of six seat transcripts ----
function mkRoot(perSeat) {
  const root = fs.mkdtempSync(path.join(tmp, 'root-'));
  for (const [seat, [dir, sid]] of Object.entries(F.SEATS)) {
    fs.mkdirSync(path.join(root, dir), { recursive: true }); const rows = [];
    rows.push(JSON.stringify({ type: 'user', message: { role: 'user', content: 'first prompt' } }));
    for (let i = 0; i < perSeat; i++) {
      rows.push(JSON.stringify({ type: 'assistant', timestamp: new Date(Date.parse('2026-10-05T00:00:00Z') + i * 60000).toISOString(), uuid: `${seat}-u${i}`, message: { id: `msg_${seat}_${i}`, content: [{ type: 'text', text: `${seat} message ${i} `.padEnd(260, 'x') }] } }));
      if (i % 10 === 9) rows.push(JSON.stringify({ type: 'user', message: { role: 'user', content: 'next prompt' } }));
    }
    fs.writeFileSync(path.join(root, dir, sid + '.jsonl'), rows.join('\n') + '\n');
  }
  return root;
}
const WIN = { name: 'synthetic', from: '2026-10-05T00:00:00Z', to: '2026-10-06T00:00:00Z', expectFrame: null, expectExcluded: null, closes: null };

test('draw: takes the first 100 in order-key order across seats, writes one reply per id, ids sorted by order key, turn lines recorded, no id twice', () => {
  const root = mkRoot(40); const b = D.build(WIN, { root }); assert.strictEqual(b.frameTotal, 240);
  const out = path.join(tmp, 'out1'); const meta = D.writeDraw(b, out);
  assert.strictEqual(meta.length, 100); assert.strictEqual(new Set(meta.map((m) => m.id)).size, 100);
  const ids = fs.readFileSync(path.join(out, 'key', 'drawn_ids.txt'), 'utf8').split('\n').filter(Boolean);
  assert.deepStrictEqual(ids, [...ids].sort((x, y) => (D.orderKey(x) < D.orderKey(y) ? -1 : 1)));
  const all = D.drawOrder(b.items, 240).map((x) => x.id); assert.deepStrictEqual(ids, all.slice(0, 100), 'the draw is the first 100 of the full ordering');
  assert.strictEqual(fs.readdirSync(path.join(out, 'replies')).length, 100);
  const m0 = meta[0]; assert.match(fs.readFileSync(path.join(out, 'replies', m0.id + '.txt'), 'utf8'), /^\[text\]\n/);
  assert.ok(m0.turnStartLine >= 1 && (m0.nextPromptLine === null || m0.nextPromptLine > m0.lines[0]));
});

test('draw refuses with fewer than M eligible messages', () => {
  const root = mkRoot(10); const b = D.build(WIN, { root });
  assert.throws(() => D.writeDraw(b, path.join(tmp, 'out2')), /only 60 eligible/);
});

test('a cited line removes every frame message of its turn and no other', () => {
  const root = mkRoot(40); const cited = [{ seat: 'A', line: 4 }]; // seat A's line 4 is message 2 (line 1 is the first prompt, lines 2-11 are messages 0-9, line 12 is the next prompt): the turn is [1, 12)
  const b = D.build(WIN, { root, cited });
  assert.strictEqual(b.per.A.excluded, 10, 'the ten messages on lines 2-11, the first turn'); assert.strictEqual(b.excludedTotal, 10);
  assert.ok(!b.items.some((x) => x.seat === 'A' && x.lines[0] <= 11)); assert.strictEqual(b.items.filter((x) => x.seat === 'A').length, 30, 'the other three turns stay'); assert.strictEqual(b.items.filter((x) => x.seat === 'B').length, 40);
});

test('the original window refuses a frame that is not the sealed 5,023', () => {
  const root = mkRoot(5); assert.throws(() => D.build({ ...D.WINDOWS.original, from: '2026-10-05T00:00:00Z', to: '2026-10-06T00:00:00Z' }, { root }), /frame is 30, sealed 5023/);
});

test('assign: three claims per message by the cap, B gets none of its own, the overlap is on both files, claim ids are id|n, and the private index lists every claim once', () => {
  const root = mkRoot(40); const out = path.join(tmp, 'out3'); const meta = D.writeDraw(D.build(WIN, { root }), out);
  const packets = {}; for (const m of meta) packets[m.id] = { id: m.id, statements: [1, 2, 3, 4, 5, 6].map((n) => ({ n, text: `stmt ${n} of ${m.id}`, quotes: [] })) };
  packets[meta[0].id].statements = packets[meta[0].id].statements.slice(0, 2); // fewer than K
  const claims = D.buildClaims(meta, packets); D.writeAssign(claims, out);
  assert.strictEqual(claims.length, 99 * 3 + 2);
  assert.ok(claims.every((c) => c.claimId === `${c.messageId}|${c.statement.split(' ')[1]}`));
  const load = (v) => JSON.parse(fs.readFileSync(path.join(out, 'verify', v, 'claims.json'), 'utf8')).claims;
  const B = load('B'), C = load('C');
  assert.ok(B.every((c) => c.seat !== 'B') && C.every((c) => c.seat !== 'C'), 'no verifier sees its own seat');
  const both = new Set(B.map((c) => c.claimId).filter((id) => C.some((c) => c.claimId === id)));
  assert.strictEqual(both.size, claims.filter((c) => c.to.length === 2).length);
  assert.ok(![...both].some((id) => /^msg_(B|C)_/.test(id)), 'the overlap holds no B or C claims');
  assert.strictEqual(B.length + C.length - both.size, claims.length, 'every claim is on at least one file, none lost');
  assert.ok(!('to' in B[0]), 'the verifier file does not say who else sees a claim');
  const idx = JSON.parse(fs.readFileSync(path.join(out, 'key', 'claims_all.json'), 'utf8')); assert.strictEqual(idx.length, claims.length);
  assert.deepStrictEqual(Object.keys(B[0]).sort(), ['claimId', 'lines', 'messageId', 'nextPromptLine', 'seat', 'statement', 'transcript', 'ts', 'turnStartLine'].sort());
});

// ---- REAL DATA: the rebuilt draw reproduces L119's, byte for byte ----
test('REAL DATA: the original window, drawn with the 24 cited turns, reproduces L119: frame 5,023, 43 excluded (20 librarian, 23 B), eligible 4,980, the seat split 31/17/14/14/14/10, and drawn_ids.txt sha256 23282ca2…', (t) => {
  const absent = Object.keys(F.SEATS).filter((s) => !fs.existsSync(F.seatFile(s)));
  if (absent.length) return t.skip(`seat transcripts not on this machine: ${absent.join(', ')}`);
  const cited = D.citedFromLocated(path.join(__dirname, 'located24.cited.json'));
  let b; try { b = D.build(D.WINDOWS.original, { cited }); } catch (e) { if (/frame is \d+, sealed 5023/.test(e.message)) return t.skip(`this machine's transcripts do not hold the L119 frame: ${e.message}`); throw e; }
  assert.strictEqual(b.frameTotal, 5023); assert.strictEqual(b.excludedTotal, 43);
  assert.strictEqual(b.per.librarian.excluded, 20); assert.strictEqual(b.per.B.excluded, 23); assert.strictEqual(b.items.length, 4980);
  const out = path.join(tmp, 'orig'); const meta = D.writeDraw(b, out);
  const bySeat = {}; for (const m of meta) bySeat[m.seat] = (bySeat[m.seat] || 0) + 1;
  assert.deepStrictEqual(bySeat, { librarian: 31, C: 17, A: 14, chair: 14, E: 14, B: 10 });
  assert.strictEqual(sha(fs.readFileSync(path.join(out, 'key', 'drawn_ids.txt'))), '23282ca2a1578fa25db5810cd6c801179aae1d618210beaca66cb7a0b4054a45');
  const sizes = fs.readdirSync(path.join(out, 'replies')).map((f) => fs.statSync(path.join(out, 'replies', f)).size);
  assert.strictEqual(sizes.length, 100); assert.ok(sizes.every((n) => n > 0), '100 files, 0 empty (as L119 recorded)');
});
