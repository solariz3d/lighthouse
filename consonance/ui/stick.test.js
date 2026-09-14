// stick.test.js — run with: node stick.test.js
//
// The setup window for the transfer (L059, pane E), run for real: the actual stick.js in a vm, against a
// stub DOM and a stub `inv`. It pins what the keeper sees and what the window does, not how it is
// spelled: a launch that did not hold opens nothing; a live applier offers only Close; the window shows
// BOTH first timestamps per seat and says "unknown" rather than guessing; a quiet rehearsal releases the
// seats on its own; a transfer that could not start leaves the window open with the reason.

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

const SRC = fs.readFileSync(path.join(__dirname, 'stick.js'), 'utf8');
const term = fs.readFileSync(path.join(__dirname, 'term.js'), 'utf8');
const escapeSrc = term.match(/function escapeHtml\(s\) \{[^\n]*\}/)[0];

/** Run stick.js once. `answers` maps a command name to a value, or to a function (args) => value. */
async function run(answers) {
  const calls = [];
  const buttons = new Map();
  const body = {
    _html: '',
    set innerHTML(v) { this._html = v; buttons.clear(); },
    get innerHTML() { return this._html; },
    querySelector(sel) {
      if (!buttons.has(sel)) buttons.set(sel, { onclick: null, innerHTML: '', disabled: false });
      return buttons.get(sel);
    },
    querySelectorAll() { return []; },
  };
  const root = { hidden: true, querySelector: () => body };
  const ctx = {
    document: { getElementById: (id) => (id === 'stick-setup' ? root : null) },
    restored: 0,
    status: '',
  };
  ctx.inv = async (cmd, args) => {
    calls.push({ cmd, args });
    const a = answers[cmd];
    if (a === undefined) throw new Error(`unexpected command ${cmd}`);
    const v = typeof a === 'function' ? a(args) : a;
    if (v instanceof Error) throw v.message;
    return v;
  };
  ctx.setStatus = (t) => { ctx.status = t; };
  ctx.restoreKeptPanes = async () => { ctx.restored++; };
  vm.createContext(ctx);
  vm.runInContext(escapeSrc, ctx);
  vm.runInContext(SRC, ctx);
  for (let i = 0; i < 20; i++) await new Promise((r) => setImmediate(r));
  return { calls, body, root, ctx, buttons, settle: async () => { for (let i = 0; i < 20; i++) await new Promise((r) => setImmediate(r)); } };
}

const FOLDER = 'D:\\consonance-L-20260911';
const oneFolder = { held: true, stick: 'one', folders: [{ folder: FOLDER, layout: 'older' }], handshake: { state: 'absent' }, result: null, applier_on_disk: true };
const row = (o) => Object.assign({ seat: 'librarian', sid: '0c0c0c0b-0000-4000-8000-00000000115b', kind: 'fixed', verdict: 'FULL', reason: null, why: null, carries: true, stops: false, bytes: 1200, localFirstTimestamp: null, carriedFirstTimestamp: null, exportedAt: '2026-09-12T18:00:00Z' }, o);

console.log('ui/stick');

test('a launch that did not hold the seats opens nothing and reads nothing', async () => {
  const r = await run({ stick_state: { held: false, stick: 'none', folders: [], handshake: { state: 'absent' } } });
  assert.strictEqual(r.root.hidden, true, 'the window opened on a launch that held nothing');
  assert.deepStrictEqual(r.calls.map((c) => c.cmd), ['stick_state'], 'a launch with nothing held reached further than one read');
});

test('a live applier offers only Close, and starts no rehearsal', async () => {
  const r = await run({ stick_state: Object.assign({}, oneFolder, { handshake: { state: 'live', pid: 4242, stick: FOLDER } }), stick_close_app: null });
  assert.strictEqual(r.root.hidden, false);
  assert.match(r.body.innerHTML, /waiting for this window to close/);
  assert.ok(!r.calls.some((c) => c.cmd === 'stick_rehearse'), 'a rehearsal ran while an applier waited');
  assert.ok(!/stick-carry/.test(r.body.innerHTML), 'a Carry button is offered while an applier already waits');
  await r.buttons.get('#stick-close').onclick();
  assert.ok(r.calls.some((c) => c.cmd === 'stick_close_app'));
});

test("the window shows BOTH first timestamps per seat, and 'unknown' where one is not recorded", async () => {
  const reh = {
    folder: FOLDER, quiet: false, offers: {},
    verify: { code: 0, layout: 'older' },
    import: { code: 0, rows: [row({ localFirstTimestamp: '2026-09-14T06:29:17.726Z', carriedFirstTimestamp: null })] },
    export: { code: 0, rows: [] },
  };
  const r = await run({ stick_state: oneFolder, stick_rehearse: reh });
  assert.match(r.body.innerHTML, /2026-09-14T06:29:17\.726Z/, "this machine's conversation's first timestamp is not shown");
  assert.match(r.body.innerHTML, /stick-unknown">unknown</, "a missing carried timestamp is not shown as unknown");
  assert.match(r.body.innerHTML, /older stick layout/, 'the older layout is not named');
});

test("an OTHER_CONVERSATION seat offers take and keep with the rule's default and its reason", async () => {
  const sid = '0c0c0c0b-0000-4000-8000-00000000115b';
  const reh = {
    folder: FOLDER, quiet: false,
    offers: { [sid]: { take_offered: true, default: 'keep', why: 'it may be somebody\'s lineage', kept: false } },
    verify: { code: 0, layout: 'manifest' },
    import: { code: 1, rows: [row({ verdict: 'REFUSED', reason: 'OTHER_CONVERSATION', carries: false, stops: true })] },
    export: { code: 0, rows: [] },
  };
  const r = await run({ stick_state: oneFolder, stick_rehearse: reh });
  const html = r.body.innerHTML;
  assert.match(html, /value="take" >/, 'take is preselected against the rule');
  assert.match(html, /value="keep" checked>/, "the rule's KEEP default is not preselected");
  assert.match(html, /somebody&#39;s lineage/, 'the reason is not shown (or not escaped)');
});

test('a quiet rehearsal releases the seats on its own and closes', async () => {
  const reh = { folder: FOLDER, quiet: true, offers: {}, verify: { code: 0 }, import: { code: 0, rows: [] }, export: { code: 0, rows: [] } };
  const r = await run({ stick_state: oneFolder, stick_rehearse: reh, stick_release: { read_only: false, retired: [] } });
  assert.ok(r.calls.some((c) => c.cmd === 'stick_release'), 'the seats were not released');
  assert.strictEqual(r.root.hidden, true, 'the window stayed open with nothing to show');
  assert.strictEqual(r.ctx.restored, 1, 'the kept panes were not restored after release');
});

test('a transfer that could not start leaves the window open with the reason, and restores nothing', async () => {
  const reh = { folder: FOLDER, quiet: false, offers: {}, verify: { code: 0 }, import: { code: 0, rows: [row()] }, export: { code: 0, rows: [] } };
  const r = await run({
    stick_state: oneFolder, stick_rehearse: reh,
    stick_start_applier: () => new Error('the transfer could not start: no handshake from the applier within 10 s.'),
  });
  await r.buttons.get('#stick-carry').onclick();
  await r.settle();
  assert.strictEqual(r.root.hidden, false, 'the window closed on a transfer that never started');
  assert.match(r.buttons.get('#stick-msg').innerHTML, /could not start/, 'the reason is not shown');
  assert.strictEqual(r.ctx.restored, 0, 'seats were woken while the transfer was still unresolved');
  const call = r.calls.find((c) => c.cmd === 'stick_start_applier');
  assert.deepStrictEqual(Object.keys(call.args).sort(), ['folder', 'keep', 'repair', 'retire_far'], 'the confirm does not send the arguments the command reads');
});

test('a seat name from the stick is escaped, not rendered', async () => {
  const reh = { folder: FOLDER, quiet: false, offers: {}, verify: { code: 0 }, import: { code: 0, rows: [row({ seat: '<img src=x onerror=alert(1)>' })] }, export: { code: 0, rows: [] } };
  const r = await run({ stick_state: oneFolder, stick_rehearse: reh });
  assert.ok(!r.body.innerHTML.includes('<img'), 'a seat name reached the page as markup');
});

test('the stick being behind this machine is said before the seats wake', async () => {
  const reh = { folder: FOLDER, quiet: false, offers: {}, verify: { code: 0 }, import: { code: 0, rows: [] }, export: { code: 0, rows: [{ seat: 'main', carries: true }] } };
  const r = await run({ stick_state: oneFolder, stick_rehearse: reh });
  assert.match(r.body.innerHTML, /does not have your last session/);
  assert.ok(!r.calls.some((c) => c.cmd === 'stick_release'), 'the seats woke before the keeper saw the stick was behind');
});

Promise.all(pending).then(() => {
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
});
