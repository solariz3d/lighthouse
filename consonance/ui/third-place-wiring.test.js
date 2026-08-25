// third-place-wiring.test.js — run with: node third-place-wiring.test.js
//
// WHY THIS EXISTS, and it is not a copy of librarian-wiring for symmetry's sake. Leg 1 of this seat
// sat LANDED-NOT-SHIPPED for a day: the Rust command compiled, cargo test was green at 311, and the
// seat could not be reached or opened by anyone. Two names were missing — a bundle entry and a tab —
// and no suite in this repo could see either, because compiling a command proves nothing about
// whether a person can get to it.
//
// So this checks the SHIPPING path rather than the code: button, section, handler, and the bundle
// declaration the backend refuses to open without.
'use strict';
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const term = fs.readFileSync(path.join(__dirname, 'term.js'), 'utf8');
const conf = JSON.parse(fs.readFileSync(
  path.join(__dirname, '..', 'src-tauri', 'tauri.conf.json'), 'utf8'));

let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); console.log('  ok   ' + name); pass++; }
  catch (e) { console.log('  FAIL ' + name); console.log('       ' + e.message); fail++; }
};

t('the Third Place tab button exists', () => {
  assert.match(html, /data-tab="thirdplace"/, 'no tab button in index.html');
});

t('the section it switches to exists — a button pointing at nothing is a dead tab', () => {
  assert.match(html, /<section id="thirdplace"/, 'no <section id="thirdplace">');
});

t('the tab sits between the Librarian and Listen', () => {
  // The keeper's own placement, and it carries the meaning: home, then work, then the place that is
  // neither. Order is the first thing that says so to whoever opens the app.
  const lib = html.indexOf('data-tab="librarian"');
  const tp = html.indexOf('data-tab="thirdplace"');
  const listen = html.indexOf('data-tab="listen"');
  assert.ok(lib > 0 && tp > 0 && listen > 0, 'a tab is missing entirely');
  assert.ok(lib < tp, 'the third place must come after the librarian');
  assert.ok(tp < listen, 'the third place must come before listen');
});

t('the open button and the mount point both exist in the markup', () => {
  assert.match(html, /id="wakethirdplace"/, 'no open button');
  assert.match(html, /id="thirdplacepane"/, 'no pane mount');
});

t('term.js references EVERY id the markup declares', () => {
  // The dead-tab shape: a name on one side of the boundary and not the other.
  for (const id of ['wakethirdplace', 'thirdplacepane']) {
    assert.ok(term.includes(id), 'term.js never mentions ' + id);
  }
});

t('the handler calls the backend command that exists', () => {
  assert.match(term, /inv\('spawn_third_place'\)/, 'no call to spawn_third_place');
});

t('opening is state-managed, so a second click cannot ask for a second seat', () => {
  assert.match(term, /WAKE_TP_STATES/, 'no state table for the open button');
  assert.match(term, /setWakeThirdPlace\('waking'\)/, 'the button never enters a waking state');
});

t('THE BUNDLE DECLARES THE BRIEF — without it the backend refuses to open the seat', () => {
  // The assertion that would have caught Leg 1 being unshippable. third_place_intake() returns None
  // when the brief is missing and spawn_third_place turns that into "refusing to open a room with
  // no brief", so an undeclared brief is a button that always errors. Read from the CONFIG rather
  // than a hand-list: the config is the authority the bundler actually uses.
  const res = (conf.bundle && conf.bundle.resources) || {};
  const keys = Array.isArray(res) ? res : Object.keys(res);
  assert.ok(keys.some((k) => /THIRD_PLACE\.md$/.test(k)),
    'tauri.conf.json bundle.resources does not declare brief/THIRD_PLACE.md — the seat cannot open');
});

t('the tab says what the seat CANNOT reach — the guarantee is the feature', () => {
  // The brief's strongest line is "You are not a way in." If that survives only in the brief the
  // instance reads, the person clicking the tab never learns it.
  const sec = html.slice(html.indexOf('<section id="thirdplace"'));
  assert.match(sec, /no channel to anything else/i, 'the header must state the isolation');
  assert.match(sec, /none of the working record/i, 'the header must state what it deliberately lacks');
});

console.log('');
console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
