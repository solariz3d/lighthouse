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
  // P-DIVERGED: the table rows, parsed from the rendered HTML once per render, with radios and the repair box the
  // test can flip — so routing by verdict (D-5) and the re-check on change (D-6) run through stick.js itself.
  let rowsFor = null;
  const listeners = {};
  const parseRows = (html) => [...html.matchAll(/<tr data-sid="([^"]*)" data-exported="([^"]*)" data-verdict="([^"]*)">([\s\S]*?)<\/tr>/g)]
    .map(([, sid, exported, verdict, inner]) => {
      const radios = [...inner.matchAll(/<input type="radio" name="[^"]*" value="(take|keep)"\s*(checked)?>/g)]
        .map(([, value, checked]) => ({ value, checked: !!checked }));
      const repair = /class="stick-repair"/.test(inner) ? { checked: false } : null;
      return {
        dataset: { sid, exported, verdict },
        radios,
        repair,
        querySelector(sel) {
          if (sel === 'input[type=radio]:checked') return radios.find((r) => r.checked) || null;
          if (sel === '.stick-repair') return repair;
          return null;
        },
      };
    });
  const body = {
    _html: '',
    set innerHTML(v) { this._html = v; buttons.clear(); rowsFor = null; },
    get innerHTML() { return this._html; },
    querySelector(sel) {
      if (!buttons.has(sel)) {
        // A button's starting `disabled` is read from the rendered HTML. The first version of this stub always said
        // false, so "Carry is available" passed on a window that had rendered it disabled — found by the D-1 tests
        // passing before the code they test existed.
        const id = sel.startsWith('#') ? sel.slice(1) : null;
        const tag = id && this._html.match(new RegExp(`<button id="${id}"([^>]*)>`));
        buttons.set(sel, { onclick: null, innerHTML: '', disabled: !!(tag && /\bdisabled\b/.test(tag[1])) });
      }
      return buttons.get(sel);
    },
    querySelectorAll(sel) {
      if (sel === 'tr[data-sid]') { if (!rowsFor) rowsFor = parseRows(this._html); return rowsFor; }
      return [];
    },
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn); },
    fire(type) { for (const fn of listeners[type] || []) fn({ type }); },
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
  // take_stick joined the command at P-DIVERGED §2.6; the list is the command's signature, so it moves with it.
  assert.deepStrictEqual(Object.keys(call.args).sort(), ['folder', 'keep', 'repair', 'retire_far', 'take_stick'], 'the confirm does not send the arguments the command reads');
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

// ── P-DIVERGED (L058, third use): the door for a fork ─────────────────────────────────────────────────────────

const FORK = 'aaaaaaaa-1111-4111-8111-111111111111';
const OTHER = 'bbbbbbbb-2222-4222-8222-222222222222';
const forkRow = row({ seat: 'pane a', sid: FORK, kind: 'pane', verdict: 'DIVERGED', reason: null, carries: false, stops: true,
  bytes: 121, ownBytes: 139, exportedFrom: 'D', exportedAt: '2026-09-14T13:11:00.693Z' });
const otherRow = row({ seat: 'pane b', sid: OTHER, kind: 'pane', verdict: 'REFUSED', reason: 'OTHER_CONVERSATION', carries: false, stops: true,
  exportedAt: '2026-09-14T13:11:00.693Z' });
const forkOffer = { take_offered: true, default: 'none', why: 'two futures', kept: false };
const rehearsalWith = (rows, offers) => ({ folder: FOLDER, quiet: false, offers, verify: { code: 0 },
  import: { code: 1, machine: 'L', rows }, export: { code: 1, rows: [] } });

test('D-4: a DIVERGED row preselects neither choice, and Carry waits until the keeper chooses', async () => {
  const r = await run({ stick_state: oneFolder, stick_rehearse: rehearsalWith([forkRow], { [FORK]: forkOffer }) });
  const tr = r.body.querySelectorAll('tr[data-sid]')[0];
  assert.deepStrictEqual(tr.radios.map((x) => x.checked), [false, false], 'a choice between two lineages was preselected');
  assert.strictEqual(r.buttons.get('#stick-carry').disabled, true, 'Carry is available before the fork has a choice');
});

test('D-6: choosing on the DIVERGED row makes Carry available, re-checked on change and not only at render', async () => {
  const r = await run({ stick_state: oneFolder, stick_rehearse: rehearsalWith([forkRow], { [FORK]: forkOffer }) });
  const carry = r.buttons.get('#stick-carry') || r.body.querySelector('#stick-carry');
  const before = carry.disabled;
  r.body.querySelectorAll('tr[data-sid]')[0].radios.find((x) => x.value === 'take').checked = true;
  r.body.fire('change');
  // Both halves are the one claim: the CHANGE is what makes Carry available. Checking only "after" passed on a
  // window that enabled Carry at render, before any choice existed.
  assert.deepStrictEqual([before, carry.disabled], [true, false], 'Carry did not wait for the choice, or did not follow it');
});

test('D-5: TAKE is routed by verdict — a fork as take_stick, another conversation as retire_far', async () => {
  const r = await run({
    stick_state: oneFolder,
    stick_rehearse: rehearsalWith([forkRow, otherRow], { [FORK]: forkOffer, [OTHER]: { take_offered: true, default: 'take', why: 'x', kept: false } }),
    stick_start_applier: () => new Error('stop here'),
  });
  r.body.querySelectorAll('tr[data-sid]')[0].radios.find((x) => x.value === 'take').checked = true;
  r.body.fire('change');
  await r.buttons.get('#stick-carry').onclick();
  const args = r.calls.find((c) => c.cmd === 'stick_start_applier').args;
  assert.strictEqual(JSON.stringify({ take_stick: args.take_stick, retire_far: args.retire_far }), JSON.stringify({ take_stick: [FORK], retire_far: [OTHER] }));
});

test('D-1: a seat whose ledger still needs healing (ALREADY_APPLIED) makes Carry available', async () => {
  const healed = row({ verdict: 'ALREADY_APPLIED', carries: false, stops: false });
  const r = await run({ stick_state: oneFolder, stick_rehearse: rehearsalWith([healed], {}) });
  assert.strictEqual(r.buttons.get('#stick-carry').disabled, false, 'the heal cannot be started from the window');
});

test('D-1: APPLIED_AND_GREW makes Carry available too', async () => {
  const grown = row({ verdict: 'APPLIED_AND_GREW', carries: false, stops: false });
  const r = await run({ stick_state: oneFolder, stick_rehearse: rehearsalWith([grown], {}) });
  assert.strictEqual(r.buttons.get('#stick-carry').disabled, false);
});

test("§2.5: a DIVERGED row shows both byte counts and both machines", async () => {
  const r = await run({ stick_state: oneFolder, stick_rehearse: rehearsalWith([forkRow], { [FORK]: forkOffer }) });
  const html = r.body.innerHTML;
  assert.ok(html.includes('139') && html.includes('121') && html.includes('D') && /\bL\b/.test(html), 'a count or a machine is missing from the fork row');
});

test('§2.6: KEEP on a DIVERGED row is recorded as a keep for this carry when the keeper continues', async () => {
  const r = await run({
    stick_state: oneFolder,
    stick_rehearse: rehearsalWith([forkRow], { [FORK]: forkOffer }),
    stick_release: { read_only: false, retired: [] },
  });
  r.body.querySelectorAll('tr[data-sid]')[0].radios.find((x) => x.value === 'keep').checked = true;
  await r.buttons.get('#stick-continue').onclick();
  const keep = r.calls.find((c) => c.cmd === 'stick_release').args.keep;
  // JSON, not deepStrictEqual: the array was built inside the vm's realm, so its prototype is not this realm's.
  assert.strictEqual(JSON.stringify(keep), JSON.stringify([{ sid: FORK, exported_at: '2026-09-14T13:11:00.693Z' }]));
});

// ── P-NUL-REPAIRS (2), D067: the last transfer's WHY and OUTCOME reach the screen ──────────────────────────────────
// renderResult printed the exit code, the per-seat rows and the time, and never `why` or `outcome`. So a transfer
// refused because a windowless Consonance was holding it — whose `why` names that pid and the command that ends it
// (dev/stick-apply.js, APP_RUNNING) — showed the keeper "exit 2 (could not run)" over an EMPTY table, and the one
// sentence that said what to do was written to disk and read by nobody.
const refused = {
  code: 2, outcome: 'APP_RUNNING', rows: [], at: '2026-09-16T14:52:00Z',
  why: 'Consonance (pid 4242) had no window for 30 s — it is not the app you can see. End that process (taskkill /PID 4242 /F), then start the transfer again.',
};
const resultOnly = (result) => ({ held: true, stick: 'none', result });

test('D067: a refused transfer shows its WHY — the pid and the command — inside the last-transfer section', async () => {
  const r = await run({ stick_state: resultOnly(refused), stick_ack_result: null, stick_release: { read_only: false, retired: [] } });
  const html = r.body.innerHTML;
  // The SHAPE, not the token: the reason must sit inside the section that describes the last transfer, so a copy of
  // the pid printed somewhere else on the page (or in a later section) does not satisfy it.
  const section = html.match(/<section><h3>The last transfer[\s\S]*?<\/section>/);
  assert.ok(section, 'no last-transfer section rendered');
  assert.ok(section[0].includes('pid 4242') && section[0].includes('taskkill /PID 4242 /F'),
    `the refusal reason never reached the screen:\n${section[0]}`);
});

test('D067: the OUTCOME is shown, so APP_RUNNING is told apart from a crash that shares no exit code', async () => {
  const r = await run({ stick_state: resultOnly(refused), stick_ack_result: null, stick_release: { read_only: false, retired: [] } });
  const section = r.body.innerHTML.match(/<section><h3>The last transfer[\s\S]*?<\/section>/)[0];
  assert.ok(section.includes('APP_RUNNING'), `the outcome is missing from the section:\n${section}`);
});

test('D067: WHY is ESCAPED — a result file cannot put markup on the keeper\'s screen', async () => {
  const hostile = { ...refused, why: '<img src=x onerror=alert(1)> & <b>bold</b>', outcome: '<i>X</i>' };
  const r = await run({ stick_state: resultOnly(hostile), stick_ack_result: null, stick_release: { read_only: false, retired: [] } });
  const html = r.body.innerHTML;
  assert.ok(!html.includes('<img') && !html.includes('<b>bold') && !html.includes('<i>X'), 'raw markup from the result file was rendered');
  assert.ok(html.includes('&lt;img') && html.includes('&amp;'), 'the reason was dropped instead of escaped');
});

test('D067: an OLDER result with no why and no outcome renders neither — no empty line, no "null", no "undefined"', async () => {
  const older = { code: 0, rows: [], at: '2026-09-12T18:00:00Z' };
  const r = await run({ stick_state: resultOnly(older), stick_ack_result: null, stick_release: { read_only: false, retired: [] } });
  const section = r.body.innerHTML.match(/<section><h3>The last transfer[\s\S]*?<\/section>/)[0];
  assert.ok(!/null|undefined/.test(section), `a missing field printed as a word:\n${section}`);
  assert.ok(!/<p[^>]*>\s*<\/p>/.test(section) && !/Outcome/.test(section), `an empty reason or outcome line was rendered:\n${section}`);
});

Promise.all(pending).then(() => {
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
});
