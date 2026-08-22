// librarian-wiring.test.js — run with: node librarian-wiring.test.js
//
// WHY THIS EXISTS. A tab is wired in THREE places -- the button in index.html, the section it
// switches to, and the handler in term.js -- and a change that lands in two of them looks correct
// in the diff and produces a dead tab in the app. That is the same shape as scripts-load.test.js's
// defect: every instrument green while the window is blank, because nothing loads the frontend.
//
// This does not need a browser for the class of defect involved. The failure is a NAME that exists
// on one side of the boundary and not the other, and names are checkable in the text.
'use strict';
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const term = fs.readFileSync(path.join(__dirname, 'term.js'), 'utf8');

let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); console.log('  ok   ' + name); pass++; }
  catch (e) { console.log('  FAIL ' + name + '\n       ' + e.message); fail++; }
};

t('the Librarian tab button exists', () => {
  assert.match(html, /data-tab="librarian"/, 'no tab button in index.html');
});

t('the section it switches to exists — a button pointing at nothing is a dead tab', () => {
  assert.match(html, /<section id="librarian"/, 'no <section id="librarian">');
});

t('the tab sits between the Orchestrator and Listen', () => {
  // Placement is not cosmetic here: the librarian works alongside the orchestrator, and the order
  // is the first thing that says so to whoever opens the app.
  const main = html.indexOf('data-tab="main"');
  const lib = html.indexOf('data-tab="librarian"');
  const listen = html.indexOf('data-tab="listen"');
  assert.ok(main > 0 && lib > 0 && listen > 0, 'a tab is missing entirely');
  assert.ok(main < lib, 'librarian must come after the orchestrator');
  assert.ok(lib < listen, 'librarian must come before listen');
});

t('the wake button and the mount point both exist in the markup', () => {
  assert.match(html, /id="wakelibrarian"/, 'no wake button');
  assert.match(html, /id="librarianpane"/, 'no mount point for the pane');
});

t('term.js references EVERY id the markup declares', () => {
  // The actual failure mode: rename one side, and the tab is dead with no error anywhere.
  for (const id of ['wakelibrarian', 'librarianpane', 'librarian']) {
    assert.ok(term.includes(id), 'term.js never mentions "' + id + '"');
  }
});

t('the handler calls the backend command that exists', () => {
  assert.match(term, /inv\('spawn_librarian'\)/, "term.js must invoke 'spawn_librarian'");
});

t('the header says what the seat does NOT do — that is the load-bearing half', () => {
  // A librarian that starts working is just an expensive pane. The tab says so where a user reads
  // it, not only in the brief the instance reads.
  const sec = html.slice(html.indexOf('<section id="librarian"'));
  assert.match(sec, /does no work/i, 'the header must say it does no work');
  assert.match(sec, /cites rather than recalls/i, 'the header must state the citation rule');
});

t('waking is state-managed, so a second click cannot ask for a second librarian', () => {
  assert.match(term, /WAKE_LIB_STATES/, 'no state table for the wake button');
  assert.match(term, /setWakeLibrarian\('waking'\)/, 'the button must disable while waking');
});

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
