// jev/test/prompt.parity.test.js — node --test jev/test/prompt.parity.test.js
//
// PARITY WITH THE ROOM: for the same inputs, jev/lib/prompt.js builds a prompt IDENTICAL to the room's L2 overseer — byte
// for byte once line endings are set aside (below; until D123 this compared raw bytes and failed on a CRLF checkout).
// The room's functions are loaded HERE, in the test, and only here: the module itself requires nothing outside jev/.
//
// Once jev/ lives in its own repo there is no room beside it. Then every test here SKIPS, visibly and with the reason —
// it never passes by default — and parity is checked on the room's side (the standalone design, item 11).
//
// LINE ENDINGS ARE NOT CONTENT (D123, pane A). On D, `core.autocrlf=true` checked the room's METHOD.md out CRLF and two of
// these tests read 113/2 on bytes that git itself calls identical (the librarian, jev_batch2_plan_2026-09-23.md). So every
// comparison here normalises CRLF → LF on BOTH sides, and nothing else: a changed word still fails, and a test below pins
// both — a CRLF copy of the room passes, a one-word change to the same copy does not.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const P = require('../lib/prompt.js');

const REAL_ROOM = path.resolve(__dirname, '..', '..');
const HOOK_REL = path.join('dev', 'shell', 'hooks', 'l2-overseer.js');
const WORKER_REL = path.join('dev', 'shell', 'hooks', 'l2-overseer-worker.js');
const METHOD_REL = 'METHOD.md';
const present = [HOOK_REL, WORKER_REL, METHOD_REL].every((f) => fs.existsSync(path.join(REAL_ROOM, f)));
const SKIP = present ? false : `no Consonance repo beside jev/ (looked for ${HOOK_REL}): parity is checked on the room's side`;

/** The one normalisation: CRLF → LF. Nothing else is touched, so any other difference is still a difference. */
const lf = (s) => (s == null ? s : String(s).replace(/\r\n/g, '\n'));

/** The room's readNarrowedView, from the hook at `room`. l2-overseer.js runs main() when required, so its functions are
 * SOURCE-LOADED, the way consonance/tools/jev-judge.js loads them: each cut out from `function name(` to the first line
 * that is exactly `}`. The source is read line-ending-normalised, or a CRLF hook would leave every closing line `}\r`. */
function roomView(room) {
  const src = lf(fs.readFileSync(path.join(room, HOOK_REL), 'utf8')).split('\n');
  const cut = (name) => { const i = src.findIndex((l) => l.startsWith(`function ${name}(`)); const j = src.findIndex((l, k) => k > i && l === '}'); return src.slice(i, j + 1).join('\n'); };
  // eslint-disable-next-line no-new-func
  return new Function('fs', [cut('safeParseJSON'), cut('extractText'), cut('readNarrowedView'), 'return readNarrowedView;'].join('\n'))(fs);
}
const roomBuild = (room) => require(path.join(room, WORKER_REL)).buildOverseerPrompt;
const roomMethod = (room) => fs.readFileSync(path.join(room, METHOD_REL), 'utf8');

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

// THE FOUR COMPARISONS, each against a room at `room`, each returning the names that DIFFER (empty = parity).
function viewDiffs(room) {
  const r = roomView(room);
  return Object.entries(CASES).filter(([, rows]) => { const f = transcript(rows); return lf(JSON.stringify(P.narrowedView(f))) !== lf(JSON.stringify(r(f))); }).map(([k]) => k);
}
function buildDiffs(room) {
  const build = roomBuild(room), view = roomView(room), discipline = roomMethod(room), out = [];
  for (const [name, rows] of Object.entries(CASES)) {
    const v = view(transcript(rows));
    if (v && lf(P.buildPrompt({ view: v, discipline })) !== lf(build(v, discipline))) out.push(name);
  }
  return out;
}
const rubricDiffs = (room) => (lf(P.readDiscipline()) === lf(roomMethod(room)) ? [] : ['rubric']);
function endToEndDiffs(room) {
  const f = transcript(CASES['plain turn']);
  return lf(P.buildPrompt({ view: P.narrowedView(f), discipline: P.readDiscipline() })) === lf(roomBuild(room)(roomView(room)(f), roomMethod(room))) ? [] : ['end to end'];
}

test('PARITY narrowedView: the same view as the room\'s readNarrowedView, case by case', { skip: SKIP }, () => {
  assert.deepStrictEqual(viewDiffs(REAL_ROOM), []);
});

test('PARITY buildPrompt: the same prompt as the room\'s buildOverseerPrompt, with the room\'s own METHOD.md', { skip: SKIP }, () => {
  assert.deepStrictEqual(buildDiffs(REAL_ROOM), []);
});

test('PARITY rubric: jev/METHOD.md, read by readDiscipline, is the room\'s METHOD.md', { skip: SKIP }, () => {
  assert.deepStrictEqual(rubricDiffs(REAL_ROOM), []);
});

test('PARITY end to end: the module\'s own inputs (its view, its shipped rubric) build the room\'s prompt', { skip: SKIP }, () => {
  assert.deepStrictEqual(endToEndDiffs(REAL_ROOM), []);
});

// ── D123: a COPY of the room, so its line endings and its words can be changed without touching the real one ─────────
function roomCopy({ crlf = false, edit = null } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-parity-room-'));
  for (const rel of [HOOK_REL, WORKER_REL, METHOD_REL]) {
    let s = lf(fs.readFileSync(path.join(REAL_ROOM, rel), 'utf8'));
    if (edit && edit.rel === rel) {
      if (!s.includes(edit.from)) throw new Error(`the test's edit target is gone from ${rel}: ${edit.from}`);
      s = s.replace(edit.from, edit.to);
    }
    if (crlf) s = s.replace(/\n/g, '\r\n');
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), s);
  }
  return root;
}
const all = (room) => [...viewDiffs(room), ...buildDiffs(room), ...rubricDiffs(room), ...endToEndDiffs(room)];

test('D123: a CRLF checkout of the room still reads as parity — line endings are not content', { skip: SKIP }, () => {
  const room = roomCopy({ crlf: true });
  assert.ok(fs.readFileSync(path.join(room, METHOD_REL), 'utf8').includes('\r\n'), 'the copy must really be CRLF');
  assert.deepStrictEqual(all(room), []);
});

test('D123: one changed word in the room\'s METHOD.md still FAILS parity, CRLF or not', { skip: SKIP }, () => {
  for (const crlf of [false, true]) {
    const room = roomCopy({ crlf, edit: { rel: METHOD_REL, from: 'Three principles, then the one test.', to: 'Three principles, then the two tests.' } });
    const d = all(room);
    assert.ok(d.includes('rubric') && d.includes('end to end'), `crlf=${crlf}: a changed word passed: ${JSON.stringify(d)}`);
  }
});

test('D123: one changed word in the room\'s prompt template still FAILS parity, CRLF or not', { skip: SKIP }, () => {
  for (const crlf of [false, true]) {
    const room = roomCopy({ crlf, edit: { rel: WORKER_REL, from: 'judging a single assistant move for drift.', to: 'judging a single assistant turn for drift.' } });
    const d = buildDiffs(room);
    assert.ok(d.length > 0, `crlf=${crlf}: a changed template word passed`);
  }
});

test('D123: the normalisation is line endings ONLY — one extra space in the room\'s METHOD.md still fails, CRLF or not', { skip: SKIP }, () => {
  for (const crlf of [false, true]) {
    const room = roomCopy({ crlf, edit: { rel: METHOD_REL, from: 'Three principles, then the one test.', to: 'Three principles,  then the one test.' } });
    assert.ok(rubricDiffs(room).includes('rubric'), `crlf=${crlf}: a whitespace change inside a line passed as parity`);
  }
});
