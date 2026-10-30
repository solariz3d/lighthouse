'use strict';
// read-before-edit.test.js — node --test consonance/tools/read-before-edit.test.js. D561: what a pane reads before its first edit in a lap.
// The fixture is a real transcript window (pane C, lap D555, 2026-10-30 22:44–22:50Z), redacted to structure: packet texts keep only
// their lap ids, every command is a stub of the same class (read / write / other), every result is 'x' of the same byte length, and
// paths are neutral. Its counts were read off by hand before this test was written: after the packet, 6 reads returning 37,517 bytes and
// 2 shell writes, then a scratch Write (not an edit), then the first edit, Write MAP.md at 22:46:55. The other tests build transcripts.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const R = require('./read-before-edit.js');

const FIXTURE = path.join(__dirname, 'fixtures', 'read-before-edit_d555-C.jsonl');
const at = (iso) => Date.parse(iso);
const dispatch = (lap, iso, ...to) => ({ lap, stage: 'chain', chain: 'dispatched', holder: 'panes', at: at(iso), to });
const tmp = (t) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'rbe-')); t.after(() => fs.rmSync(d, { recursive: true, force: true })); return d; };
const jsonl = (file, recs) => fs.writeFileSync(file, recs.map((r) => JSON.stringify(r)).join('\n') + '\n');
let n = 0;
const packet = (iso, text) => ({ type: 'user', timestamp: iso, isSidechain: false, message: { content: text } });
const call = (iso, name, input, resultBytes) => { const id = `t${++n}`; return [
  { type: 'assistant', timestamp: iso, isSidechain: false, message: { content: [{ type: 'tool_use', id, name, input }] } },
  { type: 'user', timestamp: iso, isSidechain: false, message: { content: [{ type: 'tool_result', tool_use_id: id, content: 'x'.repeat(resultBytes) }] } }]; };

test('the real D555 window: 6 reads and 37,517 bytes before the first edit, the scratch write not counted as one', async () => {
  const ledgerRows = [dispatch('D553', '2026-10-30T22:37:47Z', 'C'), dispatch('D555', '2026-10-30T22:44:40Z', 'C')];
  const [row] = await R.measure({ laps: ['D555'], ledgerRows, seats: [{ letter: 'C', file: FIXTURE }] });
  assert.equal(row.status, 'MEASURED');
  assert.match(row.packetAt, /^2026-10-30T22:44:36\./, 'the window opens at the packet, 4 s before its ledger row');
  assert.equal(row.reads, 6);
  assert.equal(row.bytes, 37517);
  assert.equal(row.shellWrites, 2);
  assert.equal(row.otherShell, 0);
  assert.equal(row.firstEdit.tool, 'Write');
  assert.match(row.firstEdit.at, /^2026-10-30T22:46:55/);
});

test('a lap with no edit in its window is UNMEASURED with its reason, never 0', async (t) => {
  const d = tmp(t), file = path.join(d, 'p.jsonl');
  jsonl(file, [packet('2026-10-30T10:00:00Z', '[chair:MAIN] D900: read and report'), ...call('2026-10-30T10:00:10Z', 'Read', { file_path: 'C:/repo/a.js' }, 500),
    ...call('2026-10-30T10:01:00Z', 'Write', { file_path: 'C:/repo/exo_memory/handback/h.md' }, 50),   // a hand-back is not the change
    packet('2026-10-30T11:00:00Z', '[chair:MAIN] D901: build it'), ...call('2026-10-30T11:00:10Z', 'Edit', { file_path: 'C:/repo/b.js' }, 50)]);
  const ledgerRows = [dispatch('D900', '2026-10-30T10:00:00Z', 'X'), dispatch('D901', '2026-10-30T11:00:00Z', 'X')];
  const rows = await R.measure({ laps: ['D900', 'D901'], ledgerRows, seats: [{ letter: 'X', file }] });
  const d900 = rows.find((r) => r.lap === 'D900'), d901 = rows.find((r) => r.lap === 'D901');
  assert.equal(d900.status, 'UNMEASURED');
  assert.equal(d900.why, 'no edit in its window (0 shell writes, 0 other shell calls)');
  assert.equal(d901.status, 'MEASURED');
  assert.equal(d901.reads, 0, 'D900\'s read belongs to D900, not to the next lap');
  assert.match(R.table(rows), /D900\s+X\s+UNMEASURED\s+-\s+-/);
  assert.match(R.table(rows), /D900\s+UNMEASURED\s+\(0 of 1 panes measured\)/);
});

test('reading before the packet (the wake) and a compaction summary that names the lap are not counted', async (t) => {
  const d = tmp(t), file = path.join(d, 'p.jsonl');
  jsonl(file, [...call('2026-10-30T09:59:00Z', 'Read', { file_path: 'C:/boot/BOOT.md' }, 9000),
    packet('2026-10-30T10:00:00Z', '[chair:MAIN] D900: go'), ...call('2026-10-30T10:00:05Z', 'Grep', { pattern: 'x' }, 100),
    // the summary names D901, which was just dispatched here too: read as a packet, it would steal D900's window
    { ...packet('2026-10-30T10:00:30Z', 'Summary: D901 D900 D899 …'), isCompactSummary: true },
    ...call('2026-10-30T10:00:40Z', 'Edit', { file_path: 'C:/repo/a.js' }, 10)]);
  const ledgerRows = [dispatch('D899', '2026-10-30T09:50:00Z', 'X'), dispatch('D900', '2026-10-30T10:00:00Z', 'X'), dispatch('D901', '2026-10-30T10:00:20Z', 'X')];
  const [row] = await R.measure({ laps: ['D900'], ledgerRows, seats: [{ letter: 'X', file }] });
  assert.equal(row.status, 'MEASURED');
  assert.equal(row.reads, 1);
  assert.equal(row.bytes, 100);
});

test('a packet naming several laps opens the lap it was dispatched as, not a re-hand from the same ring batch', async (t) => {
  // the real case: O's D544 packet (2026-10-30 00:36:25Z) named D544, D515 and D525; D544 was dispatched at 00:36:30, D525 re-handed at 00:36:34
  const d = tmp(t), file = path.join(d, 'p.jsonl');
  jsonl(file, [packet('2026-10-30T00:36:25Z', '[chair:MAIN] D544: go. (D525 waits; D515 as before)'), ...call('2026-10-30T00:36:40Z', 'Read', { file_path: 'C:/repo/a.js' }, 70),
    ...call('2026-10-30T00:37:00Z', 'Edit', { file_path: 'C:/repo/a.js' }, 10)]);
  const ledgerRows = [{ ...dispatch('D525', '2026-10-30T00:10:00Z', 'O') }, dispatch('D544', '2026-10-30T00:36:30Z', 'O'), { ...dispatch('D525', '2026-10-30T00:36:34Z', 'O'), note: 're-hand' }];
  const rows = await R.measure({ laps: ['D525', 'D544'], ledgerRows, seats: [{ letter: 'O', file }] });
  assert.deepEqual(rows.map((r) => [r.lap, r.status, r.reads]), [['D525', 'UNMEASURED', 0], ['D544', 'MEASURED', 1]]);
});

test('a missing transcript and a packet that never arrives are UNMEASURED, each with its reason', async (t) => {
  const d = tmp(t), file = path.join(d, 'p.jsonl');
  jsonl(file, [packet('2026-10-30T10:00:00Z', 'a keeper message naming nothing'), ...call('2026-10-30T10:00:05Z', 'Edit', { file_path: 'C:/repo/a.js' }, 10)]);
  const ledgerRows = [dispatch('D900', '2026-10-30T10:00:00Z', 'X', 'Y')];
  const rows = await R.measure({ laps: ['D900'], ledgerRows, seats: [{ letter: 'X', file }, { letter: 'Y', file: path.join(d, 'gone.jsonl') }] });
  assert.deepEqual(rows.map((r) => [r.pane, r.status, r.why]), [
    ['X', 'UNMEASURED', 'its packet never appears in the transcript'], ['Y', 'UNMEASURED', 'its transcript is missing']]);
});

test('the shell rule reads a command\'s syntax, not its quoted text', () => {
  assert.ok(R.isShellRead('cd /x && grep -n "a\\|b" f.js | cut -c1-200'), 'a \\| inside a grep pattern is not a pipe');
  assert.ok(!R.isShellRead('node -e "const f=(x)=>x" | wc -l') && !R.isShellWrite('node -e "const f=(x)=>x"'), '=> in a script is not a redirect');
  assert.ok(R.isShellWrite('grep x f > out.txt') && R.isShellWrite('sed -i s/a/b/ f') && R.isShellWrite("cat > f <<'EOF'\nhi\nEOF"));
  assert.ok(R.isShellRead('ls 2>/dev/null; cat f 2>&1 | head'), 'stream redirects are not writes');
});

test('the transcript path is the room\'s own: letters.json and panes.json, the cwd encoded as main.rs does, the Third Place left out', (t) => {
  const d = tmp(t);
  fs.writeFileSync(path.join(d, 'letters.json'), JSON.stringify({ 'aaaa-1': 'C', [R.THIRD_PLACE_SID]: 'N', 'bbbb-2': 'E' }));
  fs.writeFileSync(path.join(d, 'panes.json'), JSON.stringify([{ pane: 'aaaa-1', cwd: 'C:\\Consonance\\instances\\sibling-0845a868' }]));
  const seats = R.seatsFrom(d, 'P');
  assert.deepEqual(seats.map((s) => [s.letter, s.file]), [['C', path.join('P', 'C--Consonance-instances-sibling-0845a868', 'aaaa-1.jsonl')], ['E', null]]);
  assert.equal(R.encodeCwd('C:\\Users\\nname\\Desktop\\brain rot'), 'C--Users-nname-Desktop-brain-rot', 'main.rs encode_cwd\'s own pinned case');
});
