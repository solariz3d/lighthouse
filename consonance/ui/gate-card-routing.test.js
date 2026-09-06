// gate-card-routing.test.js — run with: node gate-card-routing.test.js
//
// P-LIB-CHANNEL piece 3 (2026-09-06, pane E). A gate card must render IN THE TAB OF THE SEAT IT
// IS FOR. It never has: `#gatecards` lives inside `<section id="terminal">`, so a pull aimed at
// the orchestrator surfaced in the pane grid. The keeper, 04:32: *"you'd think it would appear in
// the orch tab."* Thirty-nine hands waited on a click in one night.
//
// WHY THIS FILE DOES NOT DO WHAT THE OTHER UI TESTS DO. `librarian-wiring.test.js` checks that a
// NAME exists on both sides of a boundary, which is right for the defect it was written for. It is
// the wrong instrument here: the defect being fixed is a card that was correctly created, given
// correct content, and appended to the wrong parent. Every name involved was already present on
// both sides. A test that reads the source for `target_pane` would have gone green over the whole
// class — which is the thing this seat keeps finding (a letter registered where a label was
// expected; `var()` in an SVG presentation attribute, every test green).
//
// So the two functions are EXTRACTED FROM term.js AND RUN, against a DOM small enough to hold in
// the head. term.js cannot be `require`d — it wires live handlers at load — so the region between
// two stable markers is lifted and evaluated. If either function is renamed or moved out of that
// region this file fails loudly at extraction rather than silently testing nothing.
'use strict';
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const term = fs.readFileSync(path.join(__dirname, 'term.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'app.css'), 'utf8');

let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); console.log('  ok   ' + name); pass++; }
  catch (e) { console.log('  FAIL ' + name + '\n       ' + e.message); fail++; }
};

// ---------------------------------------------------------------- the smallest DOM that can lie
//
// It has to be able to LIE — that is the whole requirement. A stub that returns the right answer
// for everything tests the stub. This one models only what the two functions touch: parentage
// (so `closest` can walk), class lists, `querySelector` for one class, `querySelectorAll` for
// another, `insertBefore`, `appendChild`, `dataset`, and title get/set/remove.
function makeEl(tag, opts) {
  const o = opts || {};
  const el = {
    tagName: tag,
    id: o.id || '',
    className: o.className || '',
    dataset: o.dataset || {},
    parent: null,
    children: [],
    _title: o.title,
  };
  el.classList = {
    contains: (c) => el.className.split(/\s+/).includes(c),
    add: (c) => { if (!el.classList.contains(c)) el.className = (el.className + ' ' + c).trim(); },
    remove: (c) => { el.className = el.className.split(/\s+/).filter((x) => x && x !== c).join(' '); },
    toggle: (c, on) => { on ? el.classList.add(c) : el.classList.remove(c); },
  };
  Object.defineProperty(el, 'title', {
    get() { return el._title === undefined ? '' : el._title; },
    set(v) { el._title = v; },
  });
  el.getAttribute = (k) => (k === 'title' ? (el._title === undefined ? null : el._title) : null);
  el.removeAttribute = (k) => { if (k === 'title') delete el._title; };
  el.appendChild = (c) => { c.parent = el; el.children.push(c); return c; };
  el.insertBefore = (c, ref) => {
    c.parent = el;
    const i = ref ? el.children.indexOf(ref) : -1;
    if (i < 0) el.children.unshift(c); else el.children.splice(i, 0, c);
    return c;
  };
  el.remove = () => {
    if (!el.parent) return;
    el.parent.children = el.parent.children.filter((x) => x !== el);
    el.parent = null;
  };
  el.closest = (sel) => {
    // only the selector the code under test uses
    assert.strictEqual(sel, 'section.tab', 'the stub models one closest() selector');
    let n = el;
    while (n) {
      if (n.tagName === 'section' && n.classList.contains('tab')) return n;
      n = n.parent;
    }
    return null;
  };
  const walk = (n, out, cls) => {
    for (const c of n.children) {
      if (c.classList.contains(cls)) out.push(c);
      walk(c, out, cls);
    }
    return out;
  };
  el.querySelector = (sel) => {
    assert.ok(sel.startsWith('.'), 'the stub models class selectors here');
    return walk(el, [], sel.slice(1))[0] || null;
  };
  el.querySelectorAll = (sel) => {
    assert.ok(sel.startsWith('.'), 'the stub models class selectors here');
    return walk(el, [], sel.slice(1));
  };
  el.firstChild = null;
  Object.defineProperty(el, 'firstChild', { get: () => el.children[0] || null });
  for (const c of o.children || []) el.appendChild(c);
  return el;
}

// The app's real shape, cut down: a terminal tab holding the pane grid and the shipped card
// stack, and two seat tabs each holding one housed pane — plus the tab bar.
function buildApp() {
  const gatecards = makeEl('div', { id: 'gatecards', className: 'gatecards' });
  const panesGrid = makeEl('div', { id: 'panes' });
  const terminal = makeEl('section', { id: 'terminal', className: 'tab active', children: [gatecards, panesGrid] });

  const mainPane = makeEl('div', { id: 'mainpane' });
  const mainTab = makeEl('section', { id: 'main', className: 'tab seat', children: [mainPane] });

  const libPane = makeEl('div', { id: 'librarianpane' });
  const libTab = makeEl('section', { id: 'librarian', className: 'tab seat', children: [libPane] });

  // The two tab buttons that matter, one of which SHIPS WITH A TITLE — that is not decoration,
  // it is the assertion in `the_shipped_tab_title_survives_a_badge_cycle` below.
  const btnMain = makeEl('button', { dataset: { tab: 'main' } });
  const btnLib = makeEl('button', { dataset: { tab: 'librarian' }, title: 'the seat that holds the room so the others do not have to' });
  const btnTerm = makeEl('button', { dataset: { tab: 'terminal' } });
  const tabs = makeEl('nav', { id: 'tabs', className: 'tabs', children: [btnTerm, btnMain, btnLib] });

  const body = makeEl('body', { children: [tabs, terminal, mainTab, libTab] });

  const document = {
    getElementById: (id) => {
      const find = (n) => {
        if (n.id === id) return n;
        for (const c of n.children) { const r = find(c); if (r) return r; }
        return null;
      };
      return find(body);
    },
    createElement: (tag) => makeEl(tag),
    querySelector: (sel) => {
      const m = /^\.tabs button\[data-tab="(.+)"\]$/.exec(sel);
      assert.ok(m, 'the stub models one document-level selector, got: ' + sel);
      return tabs.children.find((b) => b.dataset.tab === m[1]) || null;
    },
  };

  // pane id -> { el }, exactly the shape term.js keeps
  const panes = new Map([
    ['MAIN-SID', { el: mainPane }],
    ['LIB-SID', { el: libPane }],
    ['PANE-E', { el: panesGrid.appendChild(makeEl('div', { className: 'pane' })) }],
  ]);

  return { document, panes, gatecards, terminal, mainTab, libTab, btnMain, btnLib, btnTerm };
}

// ---------------------------------------------------------------- lift the code under test
const START = 'function gateCardHost(';
const END = 'function ensureListeners()';
function loadUnderTest(app) {
  const i = term.indexOf(START);
  const j = term.indexOf(END);
  assert.ok(i > 0, 'gateCardHost is gone from term.js — this test is pointed at nothing');
  assert.ok(j > i, 'gateCardHost must sit above ensureListeners, which CALLS it at load');
  const src = term.slice(i, j);
  assert.ok(src.includes('function refreshGateBadge('), 'refreshGateBadge left the tested region');
  // eslint-disable-next-line no-new-func
  return new Function('panes', 'document', src + '\nreturn { gateCardHost, refreshGateBadge };')(app.panes, app.document);
}

const card = () => makeEl('div', { className: 'gatecard' });

// ---------------------------------------------------------------- the routing
t('THE DEFECT, as an assertion: a card for the orchestrator does not land in the terminal stack', () => {
  const app = buildApp();
  const { gateCardHost } = loadUnderTest(app);
  const host = gateCardHost('MAIN-SID');
  assert.notStrictEqual(host, app.gatecards, 'the card went to #gatecards — this IS the 39');
  assert.strictEqual(host.closest('section.tab'), app.mainTab, 'a card for Main belongs in the Main tab');
});

t('and for the librarian, in the librarian tab', () => {
  const app = buildApp();
  const { gateCardHost } = loadUnderTest(app);
  assert.strictEqual(gateCardHost('LIB-SID').closest('section.tab'), app.libTab);
});

t('a committee pane lives in the terminal tab, so its card stays in the shipped stack', () => {
  const app = buildApp();
  const { gateCardHost } = loadUnderTest(app);
  assert.strictEqual(gateCardHost('PANE-E'), app.gatecards,
    'panes are IN the terminal tab; routing there must be the existing container, not a new one');
});

t('THIS CAN MOVE A CARD AND NEVER LOSE ONE — every unknown falls back to the shipped stack', () => {
  const app = buildApp();
  const { gateCardHost } = loadUnderTest(app);
  for (const bad of ['', null, undefined, 'no-such-pane', 'MAIN']) {
    assert.strictEqual(gateCardHost(bad), app.gatecards,
      'unresolved target ' + JSON.stringify(bad) + ' must fall back, not vanish');
  }
});

t('the seat container is created once and reused — two cards, one stack', () => {
  const app = buildApp();
  const { gateCardHost } = loadUnderTest(app);
  const a = gateCardHost('MAIN-SID');
  a.appendChild(card());
  const b = gateCardHost('MAIN-SID');
  assert.strictEqual(a, b, 'a second card built a second container');
  b.appendChild(card());
  assert.strictEqual(app.mainTab.querySelectorAll('.gatecard').length, 2);
  assert.strictEqual(app.mainTab.querySelectorAll('.gatecards').length, 1);
});

// ---------------------------------------------------------------- the badge
//
// Without this half, piece 3 is a LATERAL move: a card correctly filed in a tab nobody is looking
// at is exactly as unread as the card in the terminal tab was.
t('the target tab says it is holding an undecided pull, and says how many', () => {
  const app = buildApp();
  const { gateCardHost, refreshGateBadge } = loadUnderTest(app);
  const host = gateCardHost('MAIN-SID');
  assert.ok(!app.btnMain.classList.contains('gcpending'), 'clean before');
  host.appendChild(card());
  refreshGateBadge(host);
  assert.ok(app.btnMain.classList.contains('gcpending'), 'the tab must say a decision is waiting');
  assert.match(app.btnMain.title, /1 pull waiting/);
  host.appendChild(card());
  refreshGateBadge(host);
  assert.match(app.btnMain.title, /2 pulls waiting/, 'the count must be real, not a boolean in words');
});

t('and it clears when the last card is decided — the mark tracks the container, not an event', () => {
  const app = buildApp();
  const { gateCardHost, refreshGateBadge } = loadUnderTest(app);
  const host = gateCardHost('MAIN-SID');
  const c1 = host.appendChild(card());
  const c2 = host.appendChild(card());
  refreshGateBadge(host);
  c1.remove(); refreshGateBadge(host);
  assert.ok(app.btnMain.classList.contains('gcpending'), 'one card left — still pending');
  c2.remove(); refreshGateBadge(host);
  assert.ok(!app.btnMain.classList.contains('gcpending'), 'no cards left — the mark must go');
});

t('THE SHIPPED TAB TITLE SURVIVES A BADGE CYCLE — a naive removeAttribute erases it forever', () => {
  // Found while writing this: the Librarian and Third Place buttons carry a title that TEACHES
  // the seat, and the first decided card would have deleted it permanently.
  const app = buildApp();
  const { gateCardHost, refreshGateBadge } = loadUnderTest(app);
  const shipped = app.btnLib.title;
  assert.ok(shipped.length > 10, 'fixture: the librarian button ships with a real title');
  const host = gateCardHost('LIB-SID');
  const c = host.appendChild(card());
  refreshGateBadge(host);
  assert.match(app.btnLib.title, /1 pull waiting/, 'the badge borrows the tooltip');
  c.remove(); refreshGateBadge(host);
  assert.strictEqual(app.btnLib.title, shipped, 'and gives it back');
});

t('a tab with no button does not throw — the terminal stack has one, a future tab may not', () => {
  const app = buildApp();
  const { gateCardHost, refreshGateBadge } = loadUnderTest(app);
  app.btnTerm.dataset.tab = 'something-else'; // the button for #terminal is now missing
  const host = gateCardHost('PANE-E');
  host.appendChild(card());
  refreshGateBadge(host); // must not throw
});

// ---------------------------------------------------------------- the boundary the DOM cannot see
t('the card carries a RESOLVED pane and the UI never re-resolves it', () => {
  const gate = fs.readFileSync(path.join(__dirname, '..', 'src-tauri', 'src', 'gate.rs'), 'utf8');
  const main = fs.readFileSync(path.join(__dirname, '..', 'src-tauri', 'src', 'main.rs'), 'utf8');
  assert.match(gate, /pub target_pane: String/, 'GateCard must carry the resolved target');
  assert.match(main, /target_pane: resolved/, 'the pull consumer must fill it from resolve_pane');
  assert.match(term, /gateCardHost\(c\.target_pane\)/, 'the UI must route on the resolved id');
  assert.ok(!/candidates\(|startsWith\('M'\)/.test(term),
    'no second resolver in JavaScript — resolve_from is the one resolver, and two drift');
});

t('the stack is keyed by CLASS, or the seat container inherits no styling at all', () => {
  // The exact 2026-08-22 defect, one floor up: #main/#mainpane were IDs, the Librarian tab
  // inherited none of them, and the parts that were classes worked while the parts that were IDs
  // did not. No JS test can see this; it is a rule name.
  assert.match(css, /^\.gatecards \{/m, '.gatecards must be a class rule');
  assert.ok(!/^#gatecards[ {]/m.test(css), 'the ID rule must be gone, not duplicated');
  assert.match(html, /id="gatecards" class="gatecards"/, 'the shipped stack must carry the class');
});

t('the seat tabs are positioned, or an absolute card stack escapes to the viewport', () => {
  assert.match(css, /\.tab\.seat \{[^}]*position: relative/, 'seat tabs need the anchor #terminal has');
  assert.match(css, /#terminal \{[^}]*position: relative/, 'and the terminal tab keeps its own');
});

// CANARY REMOVED after the handshake completed: with `assert.fail` here js-suite listed this file
// under FAILED (77 discovered, 3 failed); without it, 2. So the file is genuinely discovered and
// genuinely run, and its greens are greens. The first attempt appended the canary BELOW
// `process.exit` and it never fired — the handshake caught its own dead-code mistake, which is the
// argument for doing it at all.
console.log('\n  ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);

