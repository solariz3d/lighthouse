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

// ── D134 (pane E): THE PUBLISH OUTCOME, beside the stick result. The contract is A's `publish_outcome` in main.rs (D133):
// { outcome: PUBLISHED {branch, from, to} | UNCHANGED {at} | CLOSED | REFUSED {code} | TIMED_OUT | FAILED, text }, or null
// on the unattended path. REFUSED's text is close.js's output verbatim, so a divergence refusal is recognised by its
// words; the file and row count are named only when the text carries them (see the hand-back §2 for why it may not).
const PUB_REFUSED_TEXT = "consonance close · D · <data> -> <state>\n\nNOT CLOSED — the state set was not prepared: REFUSED_DIVERGED\n  state-sync exited 1\n  Nothing was published.";
const DIVERGED_WITH_FILES = PUB_REFUSED_TEXT + "\nDIVERGED — 1 travelling append-only file(s) in the state tree hold rows this machine's copy lacks.\n  lap.jsonl  37 row(s) only in the state copy (the first at its line 1204)";
const publishedAt = (publish) => { const r = load(); r.emit({ phase: 'result', result: DONE, publish, write_error: null, can_exit: true }); return r.text(); };

test('PUBLISHED: the CLOSED line names the branch and the sha moved from → to', () => {
  const t = publishedAt({ outcome: 'PUBLISHED', branch: 'main', from: '9486b30', to: '1a2b3c4', text: 'published: main 1a2b3c4 -> origin (was 9486b30)' });
  assert.ok(/CLOSED/.test(t) && !/NOT CLOSED/.test(t) && /9486b30[\s\S]*→[\s\S]*1a2b3c4/.test(t) && t.includes('main'), t);
});

test('REFUSED: NOT CLOSED, with close.js\'s own words shown', () => {
  const t = publishedAt({ outcome: 'REFUSED', code: 1, text: 'NOT CLOSED — the destination is not confirmed private: x reads unknown' });
  assert.ok(/NOT CLOSED/.test(t) && t.includes('not confirmed private'), t);
});

// The three below read the WINDOW'S OWN words, outside the verbatim <pre>: close.js's text carries "NOT CLOSED", the file
// and the count itself, so a test reading the whole screen passes even when the window says none of it (D134 mutants).
const own = (t) => t.replace(/<pre[\s\S]*?<\/pre>/g, '');

test('REFUSED_DIVERGED: says in plain words this machine lacks rows the saved state has, and to union first', () => {
  const t = own(publishedAt({ outcome: 'REFUSED', code: 1, text: PUB_REFUSED_TEXT }));
  assert.ok(/NOT CLOSED/.test(t) && /lacks rows/.test(t) && /Union those rows into this machine first/.test(t), t);
});

test('REFUSED_DIVERGED: names the file and the row count when the outcome carries them', () => {
  const t = own(publishedAt({ outcome: 'REFUSED', code: 1, text: DIVERGED_WITH_FILES }));
  assert.ok(/lap\.jsonl[^<]*<\/code>: 37 row\(s\) this machine does not have/.test(t), t);
});

test('REFUSED: the window itself says NOT CLOSED, even when close.js\'s text does not', () => {
  const t = own(publishedAt({ outcome: 'REFUSED', code: 1, text: 'the push failed, so this machine\'s state is not on the remote' }));
  assert.ok(/NOT CLOSED/.test(t) && !/state is published/.test(t), t);
});

test('REFUSED_DIVERGED without files in the text: says where the list is, and invents no count', () => {
  const t = publishedAt({ outcome: 'REFUSED', code: 1, text: PUB_REFUSED_TEXT });
  assert.ok(/state-sync\.push\.json/.test(t) && !/\d+ row\(s\)/.test(t), t);
});

test('an ordinary refusal is not described as a divergence', () => {
  const t = publishedAt({ outcome: 'REFUSED', code: 1, text: 'NOT CLOSED — the push failed, so this machine\'s state is not on the remote' });
  assert.ok(!/lacks rows/.test(t) && !/union/i.test(t), t);
});

for (const [outcome, word] of [['TIMED_OUT', /did not finish/], ['FAILED', /could not run/]]) {
  test(`${outcome}: NOT CLOSED, never a success line`, () => {
    const t = publishedAt({ outcome, text: 'close.js said something' });
    assert.ok(/NOT CLOSED/.test(t) && word.test(t) && !/state published/.test(t), t);
  });
}

test('UNCHANGED: says nothing new was published and names the sha the remote already holds', () => {
  const t = publishedAt({ outcome: 'UNCHANGED', at: '79e3c01', text: 'nothing to publish: the remote is already at 79e3c01' });
  assert.ok(/nothing new/.test(t) && t.includes('79e3c01') && !/NOT CLOSED/.test(t), t);
});

test('an outcome the window does not know is shown as unknown, never as success', () => {
  const t = publishedAt({ outcome: 'SOMETHING_NEW', text: 'x' });
  assert.ok(/SOMETHING_NEW/.test(t) && !/state published/.test(t) && !/^[\s\S]*<h3>CLOSED/.test(t), t);
});

test('publish null (the unattended path) renders nothing new', () => {
  assert.strictEqual(publishedAt(null), publishedAt(undefined));
  assert.ok(!/CLOSED|publish/i.test(publishedAt(null)), publishedAt(null));
});

test('the publish field ABSENT renders exactly what the window rendered before D134', () => {
  const r = load();
  r.emit({ phase: 'result', result: DONE, write_error: null, can_exit: true });
  assert.ok(!/CLOSED|publish/i.test(r.text()), r.text());
});

test('while publishing: the stick result stays, the publish is said to be running, and there is no Close button', () => {
  const r = load();
  r.emit({ phase: 'publishing', result: DONE });
  const t = r.text();
  assert.deepStrictEqual([/unplug it now/.test(t), /[Pp]ublishing/.test(t), r.body.querySelector('#leave-close')], [true, true, null]);
});

test('publish text is escaped, never markup', () => {
  const t = publishedAt({ outcome: 'REFUSED', code: 1, text: '<img src=x onerror=alert(1)>' });
  assert.ok(!/<img/.test(t), t);
});

Promise.all(pending).then(() => {
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
});
