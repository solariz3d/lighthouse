// leave.test.js — run with: node leave.test.js
//
// The close window (P-LEAVE, pane E), run for real: the actual leave.js in a vm, against a stub DOM, a stub `inv` and a
// stub event bus that delivers the payloads Rust's `leave_run` emits. It pins what the keeper sees: nothing until the
// save starts; "don't unplug" while it runs, with no way out; DONE says the stick can come out and names the folder;
// NOT DONE names every reason; and the Close button exists only when Rust says the result is written.

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let pass = 0, fail = 0;
const pending = [];
function test(name, fn) {
  pending.push(Promise.resolve().then(fn).then(
    () => { console.log(`  ok   ${name}`); pass++; },
    (e) => { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; },
  ));
}

const SRC = fs.readFileSync(path.join(__dirname, 'leave.js'), 'utf8');
const term = fs.readFileSync(path.join(__dirname, 'term.js'), 'utf8');
const escapeSrc = term.match(/function escapeHtml\(s\) \{[^\n]*\}/)[0];

function load(answers) {
  const calls = [];
  const handlers = {};
  const els = new Map();
  const body = {
    _html: '',
    set innerHTML(v) { this._html = v; els.clear(); },
    get innerHTML() { return this._html; },
    querySelector(sel) {
      const id = sel.startsWith('#') ? sel.slice(1) : null;
      if (!id || !new RegExp(`id="${id}"`).test(this._html)) return null;
      if (!els.has(sel)) els.set(sel, { onclick: null, innerHTML: '' });
      return els.get(sel);
    },
  };
  const root = { hidden: true, querySelector: () => body };
  const ctx = {
    document: { getElementById: (id) => (id === 'leave' ? root : null) },
    window: { __TAURI__: { event: { listen: (name, fn) => { handlers[name] = fn; } } } },
  };
  ctx.inv = async (cmd, args) => {
    calls.push({ cmd, args });
    const a = (answers || {})[cmd];
    if (a instanceof Error) throw a.message;
    return a;
  };
  vm.createContext(ctx);
  vm.runInContext(escapeSrc, ctx);
  vm.runInContext(SRC, ctx);
  const emit = (payload) => handlers.leave({ payload });
  const text = () => body.innerHTML + [...els.values()].map((e) => e.innerHTML).join('');
  return { root, body, calls, emit, els, text, listening: () => typeof handlers.leave === 'function' };
}

const FOLDER = 'D:\\consonance-L-20260911';
const DONE = { outcome: 'DONE', stick: FOLDER, code: 0, why: null, rows: [] };
const NOT_DONE = {
  outcome: 'NOT_DONE', stick: FOLDER, code: 1,
  why: 'pane a (aaaaaaaa) stopped: UNIMPORTED_TAIL — the stick still carries an unimported tail from D; 1 seat had not ended when the save began, so what it writes next is not on the stick: 0c0c0c0b-0000-4000-8000-00000000115b',
  rows: [{ seat: 'pane a', sid: 'aaaaaaaa-1111-4111-8111-111111111111', verdict: 'REFUSED', reason: 'UNIMPORTED_TAIL', why: 'the stick still carries an unimported tail from D', stops: true }],
};

console.log('ui/leave');

test('nothing shows until the close has something to say', () => {
  const r = load();
  assert.ok(r.listening(), 'leave.js does not listen for the leave event');
  assert.strictEqual(r.root.hidden, true);
});

test('a second close before any Leave screen shows nothing — it may still be a no-stick close', () => {
  const r = load();
  r.emit({ phase: 'busy' });
  assert.strictEqual(r.root.hidden, true);
});

test("while the save runs the screen says don't unplug, names the folder, and offers no way out", () => {
  const r = load();
  r.emit({ phase: 'saving', folder: FOLDER });
  assert.deepStrictEqual([r.root.hidden, /don't unplug/.test(r.text()), r.text().includes(FOLDER), /<button/.test(r.body.innerHTML)], [false, true, true, false]);
});

test('a second close while the save runs says it is still running', () => {
  const r = load();
  r.emit({ phase: 'saving', folder: FOLDER });
  r.emit({ phase: 'busy' });
  assert.match(r.text(), /still running/);
});

test('DONE says the stick can come out, with the folder, and the button closes through leave_exit', async () => {
  const r = load({ leave_exit: null });
  r.emit({ phase: 'result', result: DONE, write_error: null, can_exit: true });
  assert.ok(/you can unplug it now/.test(r.text()) && r.text().includes(FOLDER), r.text());
  await r.body.querySelector('#leave-close').onclick();
  assert.strictEqual(JSON.stringify(r.calls.map((c) => c.cmd)), JSON.stringify(['leave_exit']));
});

test('NOT DONE names every reason and the seat that stopped, and never says unplug', () => {
  const r = load();
  r.emit({ phase: 'result', result: NOT_DONE, write_error: null, can_exit: true });
  const t = r.text();
  assert.deepStrictEqual([/NOT DONE/.test(t), t.includes('UNIMPORTED_TAIL'), t.includes('0c0c0c0b-0000-4000-8000-00000000115b'), /unplug it now/.test(t)], [true, true, true, false]);
});

test('with the result not yet written there is no Close button, and the write error is shown', () => {
  const r = load();
  r.emit({ phase: 'result', result: DONE, write_error: 'could not write stick-leave.result.json (access denied)', can_exit: false });
  assert.deepStrictEqual([r.body.querySelector('#leave-close'), /access denied/.test(r.text())], [null, true]);
});

test('a refused close from the button stays on the screen with the reason', async () => {
  const r = load({ leave_exit: new Error('the save to the stick is still running') });
  r.emit({ phase: 'result', result: DONE, write_error: null, can_exit: true });
  await r.body.querySelector('#leave-close').onclick();
  assert.match(r.text(), /still running/);
});

test('seat names and reasons are escaped, never markup', () => {
  const r = load();
  const evil = Object.assign({}, NOT_DONE, { why: '<img src=x onerror=alert(1)>', rows: [{ seat: '<b>x</b>', reason: 'R', why: 'w', stops: true }] });
  r.emit({ phase: 'result', result: evil, write_error: null, can_exit: true });
  assert.ok(!/<img|<b>x/.test(r.body.innerHTML), r.body.innerHTML);
});

Promise.all(pending).then(() => {
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
});
