// scripts-load.test.js — run with: node scripts-load.test.js
//
// WHY THIS EXISTS. On 2026-08-15 the app shipped with empty panes and no Main, and the keeper had
// to repair it from a terminal. The cause was a one-line XSS fix that added `const escapeHtml` at
// the top level of app.js while term.js already had `function escapeHtml`. These are plain
// <script> tags, not modules, so they share ONE global scope: the second script to parse threw a
// redeclaration SyntaxError and term.js never executed. term.js owns attachPane/makePaneEl/panes,
// so the whole workspace vanished.
//
// Every instrument in the repo was green while this was happening — 267 Rust tests, six JS suites
// — because not one of them loads the frontend. The failure was found by a human looking at a
// blank window.
//
// This models the browser faithfully for the class of defect involved: top-level `let`/`const`/
// `class` bindings collide across separate scripts exactly as they do when concatenated, while
// `var` and `function` are permitted to repeat. So parsing the scripts as one unit reproduces the
// real failure without needing a browser.
//
// It also pins the LOAD ORDER, which is load-bearing: app.js calls term.js's escapeHtml and
// term.js uses nothing of app.js's, so the definition must come first.

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

const UI = __dirname;

/** The app's own scripts, in the order index.html loads them. Vendor bundles are excluded: they
 *  are third-party, unchanged by us, and their size makes a parse failure unattributable. */
function ownScripts() {
  const html = fs.readFileSync(path.join(UI, 'index.html'), 'utf8');
  const srcs = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map(m => m[1]);
  return srcs.filter(s => !s.startsWith('vendor/'));
}

/** Parse sources as one shared global scope and return the SyntaxError message, or null. */
function parseTogether(sources) {
  try {
    new vm.Script(sources.join('\n;\n'));
    return null;
  } catch (e) {
    return e.message;
  }
}

console.log('ui/scripts-load');

test('the app\'s own scripts share a global scope without a redeclaration error', () => {
  const files = ownScripts();
  assert.ok(files.length >= 2, 'expected at least term.js and app.js');
  const err = parseTogether(files.map(f => fs.readFileSync(path.join(UI, f), 'utf8')));
  assert.strictEqual(err, null,
    `scripts collide in the shared global scope: ${err}\n` +
    `       This is the 2026-08-15 failure: the second script never runs, and whatever it owned ` +
    `disappears from the UI with no error shown to the user.`);
});

test('POSITIVE CONTROL: a duplicated top-level const IS caught', () => {
  // Without this the test above passes for a parser that never rejects anything, and the miss
  // rate reads zero forever. This reproduces the exact shape of the shipped defect.
  const err = parseTogether([
    'function escapeHtml(s) { return s; }',            // term.js
    'const escapeHtml = s => s;',                      // app.js, as the XSS fix wrote it
  ]);
  assert.ok(err && /already been declared|already declared/i.test(err),
    `a redeclaration must be reported, got: ${err}`);
});

test('term.js loads BEFORE app.js — app.js depends on it, never the reverse', () => {
  const files = ownScripts();
  const iTerm = files.indexOf('term.js');
  const iApp = files.indexOf('app.js');
  assert.ok(iTerm >= 0 && iApp >= 0, 'both term.js and app.js must be loaded by index.html');
  assert.ok(iTerm < iApp,
    'term.js defines escapeHtml and app.js calls it; with app.js first this works only because ' +
    'every call site happens to be deferred inside a callback, and one top-level call would be a ' +
    'ReferenceError at load — swallowed, because term.js\'s entry point is a bare try/catch.');
});

test('escapeHtml is defined exactly once across the app\'s own scripts', () => {
  // The specific binding that broke. A second definition anywhere is the bug returning by another
  // road, whether or not it happens to be a parse error (two `function` declarations would parse
  // fine and silently pick a winner).
  const decl = /^\s*(?:function|const|let|var|class)\s+escapeHtml\b/gm;
  const total = ownScripts().reduce((n, f) => {
    const src = fs.readFileSync(path.join(UI, f), 'utf8');
    return n + (src.match(decl) || []).length;
  }, 0);
  assert.strictEqual(total, 1, `escapeHtml must be declared once, found ${total}`);
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
