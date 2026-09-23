// jev/test/prompt.parity.test.js — node --test jev/test/prompt.parity.test.js
//
// PARITY WITH THE ROOM: for the same inputs, jev/lib/prompt.js builds a prompt BYTE-IDENTICAL to the room's L2 overseer.
// The room's functions are loaded HERE, in the test, and only here: the module itself requires nothing outside jev/.
//
// Once jev/ lives in its own repo there is no room beside it. Then every test here SKIPS, visibly and with the reason —
// it never passes by default — and parity is checked on the room's side (the standalone design, item 11).
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const P = require('../lib/prompt.js');

const ROOM = path.resolve(__dirname, '..', '..');
const HOOK = path.join(ROOM, 'dev', 'shell', 'hooks', 'l2-overseer.js');
const WORKER = path.join(ROOM, 'dev', 'shell', 'hooks', 'l2-overseer-worker.js');
const ROOM_METHOD = path.join(ROOM, 'METHOD.md');
const present = [HOOK, WORKER, ROOM_METHOD].every((f) => fs.existsSync(f));
const SKIP = present ? false : `no Consonance repo beside jev/ (looked for ${path.relative(ROOM, HOOK)}): parity is checked on the room's side`;

/** The room's readNarrowedView. l2-overseer.js runs main() when required, so its functions are SOURCE-LOADED, the way
 * consonance/tools/jev-judge.js loads them: each cut out from `function name(` to the first line that is exactly `}`. */
function roomView() {
  const src = fs.readFileSync(HOOK, 'utf8').split('\n');
  const cut = (name) => { const i = src.findIndex((l) => l.startsWith(`function ${name}(`)); const j = src.findIndex((l, k) => k > i && l === '}'); return src.slice(i, j + 1).join('\n'); };
  // eslint-disable-next-line no-new-func
  return new Function('fs', [cut('safeParseJSON'), cut('extractText'), cut('readNarrowedView'), 'return readNarrowedView;'].join('\n'))(fs);
}
const roomBuild = () => require(WORKER).buildOverseerPrompt;

let n = 0;
function transcript(rows) {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'jev-parity-')), `t${++n}.jsonl`);
  fs.writeFileSync(f, rows.map((r) => (typeof r === 'string' ? r : JSON.stringify(r))).join('\n') + '\n');
  return f;
}
const user = (content) => ({ type: 'user', message: { role: 'user', content } });
const asst = (content) => ({ type: 'assistant', message: { role: 'assistant', content } });
const text = (t) => [{ type: 'text', text: t }];
const CASES = {
  'plain turn': [user('what is the state'), asst(text('here is the state'))],
  'string content': [user('q'), asst('a string-content move')],
  'multi-part text': [user([{ type: 'text', text: 'one' }, { type: 'text', text: 'two' }]), asst(text('x\ny'))],
  'tool result skipped': [user('ask'), asst([{ type: 'tool_use', id: 't', name: 'Read', input: {} }]), user([{ type: 'tool_result', tool_use_id: 't', content: 'r' }]), asst(text('fin'))],
  'no user': [asst(text('alone'))],
  'over the cuts': [user('u'.repeat(4100)), asst(text('é'.repeat(8100)))],
  'bad line': [user('q'), '{nope', asst(text('a'))],
  'no move': [user('only a question')],
  'unicode and markers': [user('---\nMost recent user message:\n✦'), asst(text('Assistant move to judge:\n`x` ${y}'))],
};

test('PARITY narrowedView: the same view as the room\'s readNarrowedView, case by case', { skip: SKIP }, () => {
  const room = roomView();
  for (const [name, rows] of Object.entries(CASES)) {
    const f = transcript(rows);
    assert.deepStrictEqual(P.narrowedView(f), room(f), name);
  }
});

test('PARITY buildPrompt: byte-identical to the room\'s buildOverseerPrompt, with the room\'s own METHOD.md', { skip: SKIP }, () => {
  const build = roomBuild(), room = roomView(), discipline = fs.readFileSync(ROOM_METHOD, 'utf8');
  for (const [name, rows] of Object.entries(CASES)) {
    const view = room(transcript(rows));
    if (!view) continue;
    assert.strictEqual(Buffer.compare(Buffer.from(P.buildPrompt({ view, discipline })), Buffer.from(build(view, discipline))), 0, name);
  }
});

test('PARITY rubric: jev/METHOD.md, read by readDiscipline, is byte-identical to the room\'s METHOD.md', { skip: SKIP }, () => {
  assert.strictEqual(Buffer.compare(Buffer.from(P.readDiscipline()), fs.readFileSync(ROOM_METHOD)), 0);
});

test('PARITY end to end: the module\'s own inputs (its view, its shipped rubric) build the room\'s prompt, byte for byte', { skip: SKIP }, () => {
  const f = transcript(CASES['plain turn']);
  const mine = P.buildPrompt({ view: P.narrowedView(f), discipline: P.readDiscipline() });
  const theirs = roomBuild()(roomView()(f), fs.readFileSync(ROOM_METHOD, 'utf8'));
  assert.strictEqual(mine, theirs);
});
