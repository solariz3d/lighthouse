// inject-submit.test.js — run with: node inject-submit.test.js (the js-suite finds it by name).
//
// D423 part 2 (pane C, 2026-10-20). term.js's injectAndSend (convene, give to focus, the skeptic: all on the keeper's click) pasted,
// waited 70 ms and pressed Enter once, and nothing checked that the Enter was taken: the race D415 fixed on the Rust side
// (main.rs `deliver`, `submit_step`, `ours_in_box`). This lifts the REAL injectAndSend region out of term.js and drives it with a
// recording pty_write, a clock that only records the waits asked for, and a terminal whose screen is a script of the keys written so
// far. The rules are D415's, read on the screen the pane shows (its xterm buffer):
//   - an EMPTY composer after the Enter is a submit (a dim suggestion is empty: only default-colour cells are typed text)
//   - OUR text still there gets a lone Enter again, up to 3 times, at 200, 300, 600 and 1,200 ms, never a second paste; then NOT SUBMITTED
//   - text that is NOT ours gets no key at all, before the paste (nothing is pasted onto it) and after it
//   - a composer that cannot be read is never called submitted and never gets a retried Enter
'use strict';
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const src = fs.readFileSync(path.join(__dirname, 'term.js'), 'utf8');
let pass = 0, fail = 0;
const queue = [];
const t = (name, fn) => queue.push([name, fn]);

function region(start, end) {
  const i = src.indexOf(start), j = src.indexOf(end, i);
  assert.ok(i >= 0 && j > i, `term.js: "${start}" … "${end}" not found — this test is pointed at nothing`);
  return src.slice(i, j);
}
const INJECT = region('// inject text as a bracketed paste', 'function openConvene(');
const GIVE = region('async function giveToFocus()', 'function dismissCommittee(');

const RULE = '─'.repeat(60);
/** A screen: rows of text; `dim` names rows (by index) whose cells after the marker are a dim suggestion, not typed text. */
const screen = (rows, dim = []) => ({ rows, dim });
const composer = (inBox, more = [], dim = false) => { const rows = ['● some reply', '', RULE, '❯ ' + inBox, ...more, RULE, '  ⏵⏵ bypass permissions on']; return screen(rows, dim ? [3] : []); };
const EMPTY = composer('');

/** An xterm-shaped terminal over a screen: buffer.active.baseY/getLine(y).getCell(x) with getChars/getWidth/isFgDefault, as xterm 5 has them. */
function fakeTerm(get) {
  const rowsN = 12;
  return {
    get rows() { return rowsN; },
    buffer: { get active() {
      const s = get(); const top = Math.max(0, s.rows.length - rowsN);
      return { baseY: top, length: s.rows.length, getLine: (y) => {
        const text = s.rows[y]; if (text === undefined) return undefined;
        const cells = [...text]; const marker = cells.indexOf('❯');
        return { translateToString: () => text, length: cells.length, getCell: (x) => (x >= cells.length ? undefined : {
          getChars: () => (cells[x] === ' ' ? '' : cells[x]), getWidth: () => 1,
          isFgDefault: () => !(s.dim.includes(y) && marker >= 0 && x > marker + 1) } ) };
      } };
    } },
  };
}

/** Run injectAndSend against a script: `script(enters, pasted)` gives the screen after `enters` Enters (pasted: whether the paste went out). */
async function run(text, script, { term = true } = {}) {
  const writes = [], waits = [];
  let enters = 0, pasted = false;
  const inv = (cmd, args) => { if (cmd === 'pty_write') { writes.push(args.data); if (args.data === '\r') enters++; else pasted = true; } return Promise.resolve(); };
  const setTimeout = (fn, ms) => { waits.push(ms); Promise.resolve().then(fn); return 0; };
  const panes = new Map([['p1', { term: term ? fakeTerm(() => script(enters, pasted)) : null }]]);
  const f = new Function('inv', 'setTimeout', 'panes', `${INJECT}; return injectAndSend;`)(inv, setTimeout, panes);
  const out = await f('p1', text);
  return { writes, waits, out, pastes: writes.filter((w) => w.startsWith('\x1b[200~')).length, enters: writes.filter((w) => w === '\r').length };
}
const MSG = 'the committee is asking for a skeptic vantage on this thread';
const MSG3 = 'line one of a message\nline two of it\nline three, the end';

t('our text gone after the first Enter is a submit, with no retry', async () => {
  const r = await run(MSG, (n) => (n === 0 ? composer(MSG) : EMPTY));
  assert.deepStrictEqual([r.pastes, r.enters], [1, 1], JSON.stringify(r.writes));
  assert.strictEqual(r.out && r.out.outcome, 'submitted');
});
t('our text still in the box after the Enter gets ONE more lone Enter, and is a submit when it goes', async () => {
  const r = await run(MSG, (n) => (n < 2 ? composer(MSG) : EMPTY));
  assert.deepStrictEqual([r.pastes, r.enters], [1, 2], JSON.stringify(r.writes));
  assert.strictEqual(r.out && r.out.outcome, 'submitted');
});
t('our text there through every retry: 1 paste, 4 lone Enters, then NOT SUBMITTED; nothing cleared', async () => {
  const r = await run(MSG, () => composer(MSG));
  assert.deepStrictEqual([r.pastes, r.enters], [1, 4], JSON.stringify(r.writes));
  assert.ok(r.writes.every((w) => w === '\r' || w.startsWith('\x1b[200~')), 'no other key is ever written');
  assert.strictEqual(r.out && r.out.outcome, 'not-submitted');
});
t('the waits are the old 70 ms before the Enter, then 200, 300, 600 and 1,200 ms', async () => {
  const r = await run(MSG, () => composer(MSG));
  assert.deepStrictEqual(r.waits, [70, 200, 300, 600, 1200]);
});
t('a collapsed paste of ours ([Pasted text #k +n lines], n = our newlines) is ours and gets the Enter again', async () => {
  const r = await run(MSG3, (n) => (n < 2 ? composer('[Pasted text #3 +2 lines]') : EMPTY));
  assert.deepStrictEqual([r.pastes, r.enters], [1, 2]);
  assert.strictEqual(r.out && r.out.outcome, 'submitted');
});
t('a collapsed paste with another line count is NOT ours: no Enter on it', async () => {
  const r = await run(MSG3, (n, p) => (p ? composer('[Pasted text #3 +5 lines]') : EMPTY));
  assert.deepStrictEqual([r.pastes, r.enters], [1, 1]);
  assert.strictEqual(r.out && r.out.outcome, 'not-ours');
});
t('the keeper\'s text in the box BEFORE the paste: nothing is pasted onto it and no key is pressed', async () => {
  const r = await run(MSG, () => composer('half a sentence the keeper is typing'));
  assert.deepStrictEqual(r.writes, []);
  assert.strictEqual(r.out && r.out.outcome, 'occupied');
});
t('text that is not ours appears after the Enter: no Enter is sent on it', async () => {
  const r = await run(MSG, (n, p) => (!p ? EMPTY : composer('something else entirely, typed meanwhile')));
  assert.deepStrictEqual([r.pastes, r.enters], [1, 1]);
  assert.strictEqual(r.out && r.out.outcome, 'not-ours');
});
t('a dim suggestion alone in the box reads EMPTY, before and after: a submit', async () => {
  const r = await run(MSG, (n, p) => (!p ? composer('try "fix the lint errors"', [], true) : n === 0 ? composer(MSG) : composer('try "fix the lint errors"', [], true)));
  assert.deepStrictEqual([r.pastes, r.enters], [1, 1]);
  assert.strictEqual(r.out && r.out.outcome, 'submitted');
});
t('a composer that cannot be read (no rule above the ❯) is never called submitted and gets no retried Enter', async () => {
  const r = await run(MSG, (n, p) => (!p ? EMPTY : screen(['● a dialog over the box', '❯ ' + MSG, ''])));
  assert.deepStrictEqual([r.pastes, r.enters], [1, 1]);
  assert.strictEqual(r.out && r.out.outcome, 'unknown');
});
t('a pane with no terminal to read: today\'s paste and one Enter, and the outcome is unknown, never submitted', async () => {
  const r = await run(MSG, () => EMPTY, { term: false });
  assert.deepStrictEqual([r.pastes, r.enters], [1, 1]);
  assert.strictEqual(r.out && r.out.outcome, 'unknown');
});
t('give to focus says NOT SUBMITTED, and where, when the Enter was not taken', async () => {
  let status = '';
  const doc = { getElementById: () => ({ classList: { remove() {} } }) };
  const notSentWords = new Function('inv', 'setTimeout', 'panes', `${INJECT}; return notSentWords;`)(() => Promise.resolve(), () => 0, new Map());
  const give = new Function('lastForming', 'focusPaneId', 'injectAndSend', 'formingToText', 'setStatus', 'document', 'notSentWords', `${GIVE}; return giveToFocus;`)(
    {}, 'abcdef1234', () => Promise.resolve({ outcome: 'not-submitted', retries: 3 }), () => 'x', (s) => { status = s; }, doc, notSentWords);
  await give();
  assert.match(status, /NOT SUBMITTED/); assert.match(status, /abcdef12/); assert.match(status, /Enter/);
});

(async () => {
  for (const [name, fn] of queue) {
    try { await fn(); pass++; console.log('ok   ' + name); } catch (e) { fail++; console.log('FAIL ' + name + '\n     ' + String(e && e.message).split('\n').join('\n     ')); }
  }
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
