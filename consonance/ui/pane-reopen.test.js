// pane-reopen.test.js — run with: node pane-reopen.test.js (the js-suite finds it by name).
//
// D143 (pane A, 2026-09-25). After the keeper's ↻ on a crashed Main, the pane rendered GARBLED: the new claude drew
// over the dead one's screen at the wrong width. Two causes in term.js: nothing reset the xterm, and fitPane sends
// pty_resize only when the fitted size differs from the last one SENT — which after a reopen it does not, so the new
// PTY (born at 34x120) never learned its size. This lifts the REAL functions out of term.js and drives them with stubs:
// both reopen paths — ↻ (reopenPane) and the backend's one automatic reopen (onPaneExit 'reopening' then
// onPaneReopened) — must reset the terminal and send the size even when the size did not change.
'use strict';
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const term = fs.readFileSync(path.join(__dirname, 'term.js'), 'utf8');

let pass = 0, fail = 0;
const queue = [];
const t = (name, fn) => queue.push([name, fn]);

function region(start, end) {
  const i = term.indexOf(start), j = term.indexOf(end, i);
  assert.ok(i >= 0 && j > i, `term.js: "${start}" … "${end}" not found — this test is pointed at nothing`);
  return term.slice(i, j);
}

/** A pane shaped like term.js's panes Map entry, with a terminal that records what was done to it. */
function makePane(role, rows = 40, cols = 200) {
  const calls = [];
  const classes = new Set();
  const head = { children: [], querySelector: (sel) => (sel === '.preopen' ? head.children.find((c) => c.className === 'preopen') || null : null),
    insertBefore: (el) => { head.children.push(el); } };
  const el = {
    classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c), contains: (c) => classes.has(c) },
    querySelector: (sel) => (sel === '.phead' ? head : sel === '.preopen' ? head.querySelector('.preopen') : null),
  };
  // a removed ↻ leaves the header
  const origQ = head.querySelector;
  head.querySelector = (sel) => { const b = origQ(sel); if (b && !b.remove) b.remove = () => { head.children = head.children.filter((c) => c !== b); }; return b; };
  return {
    calls, classes, head,
    p: {
      role, cwd: 'C:/seat', el, sentRows: rows, sentCols: cols,
      term: { rows, cols, reset: () => calls.push('reset'), write: (s) => calls.push('write:' + s), focus: () => {} },
      fit: { fit: () => {} },
    },
  };
}

function load(pane, id, { reopenFails = false } = {}) {
  const log = [];
  const panes = new Map([[id, pane.p]]);
  const inv = async (cmd, args) => {
    log.push(cmd === 'pty_resize' ? `pty_resize ${args.rows}x${args.cols}` : cmd);
    if (cmd === 'pty_reopen') { pane.calls.push('pty_reopen'); if (reopenFails) throw new Error('refused'); }
  };
  const wakes = [];
  const document = { createElement: () => ({ className: '', title: '', textContent: '', onclick: null }) };
  const src = region('function fitPane(', 'function fitAll(') + '\n' + region('function markDead(', 'function renderResonance(');
  // eslint-disable-next-line no-new-func
  const fns = new Function('panes', 'inv', 'setStatus', 'setSeatWake', 'setTimeout', 'document',
    src + '\nreturn { reopenPane, onPaneExit, onPaneReopened, fitPane };')(
    panes, inv, () => {}, (role, state) => wakes.push(state), (f) => f(), document);
  return { ...fns, log, wakes };
}

t('↻ with UNCHANGED dims still sends the new PTY its size — the garble\'s second cause', async () => {
  const pane = makePane('main');
  const app = load(pane, 'M');
  await app.reopenPane('M');
  assert.deepStrictEqual(app.log, ['pty_reopen', 'pty_resize 40x200'], 'the reopened PTY was never told its size: ' + app.log.join(', '));
});

t('↻ resets the terminal BEFORE the new process can write — the garble\'s first cause', async () => {
  const pane = makePane('main');
  const app = load(pane, 'M');
  await app.reopenPane('M');
  const r = pane.calls.indexOf('reset'), o = pane.calls.indexOf('pty_reopen');
  assert.ok(r >= 0, 'the xterm was never reset');
  assert.ok(r < o, 'the reset came after the new process was started: ' + pane.calls.join(', '));
});

t('the AUTOMATIC reopen does the same: reset on "reopening", the size sent on "reopened"', () => {
  const pane = makePane('librarian');
  const app = load(pane, 'LIB');
  app.onPaneExit({ pane: 'LIB', action: 'reopening' });
  assert.ok(pane.calls.includes('reset'), 'the automatic reopen did not reset the terminal');
  app.onPaneReopened('LIB');
  assert.deepStrictEqual(app.log, ['pty_resize 40x200'], 'the automatically reopened PTY was never told its size');
});

t('a seat never reads "awake" over an exited child; only a landed reopen makes it awake', () => {
  for (const action of ['prompt', 'exited_again', 'reopen_failed']) {
    const app = load(makePane('main'), 'M');
    app.onPaneExit({ pane: 'M', action });
    assert.deepStrictEqual(app.wakes, ['exited'], `${action} set ${app.wakes}`);
  }
  const app = load(makePane('main'), 'M');
  app.onPaneExit({ pane: 'M', action: 'reopening' });
  assert.deepStrictEqual(app.wakes, ['reopening']);
  app.onPaneReopened('M');
  assert.deepStrictEqual(app.wakes, ['reopening', 'awake']);
});

t('a failed automatic reopen puts the pane back to dead, with its ↻', () => {
  const pane = makePane('main');
  const app = load(pane, 'M');
  app.onPaneExit({ pane: 'M', action: 'reopening' });
  assert.ok(!pane.classes.has('dead'));
  app.onPaneExit({ pane: 'M', action: 'reopen_failed' });
  assert.ok(pane.classes.has('dead'), 'not marked dead');
  assert.ok(pane.head.children.some((c) => c.className === 'preopen'), 'no ↻ to retry with');
});

t('a failed ↻ also leaves the pane dead with its ↻, not looking alive', async () => {
  const pane = makePane('committee');
  const app = load(pane, 'P', { reopenFails: true });
  await app.reopenPane('P');
  assert.ok(pane.classes.has('dead') && pane.head.children.some((c) => c.className === 'preopen'));
  assert.ok(!app.wakes.includes('awake'), 'a failed reopen set a seat awake');
});

(async () => {
  for (const [name, fn] of queue) {
    try { await fn(); console.log('  ok   ' + name); pass++; }
    catch (e) { console.log('  FAIL ' + name); console.log('       ' + e.message); fail++; }
  }
  console.log('');
  console.log(pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
