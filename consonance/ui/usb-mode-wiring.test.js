// usb-mode-wiring.test.js — run with: node usb-mode-wiring.test.js
//
// D273, THE USB MODE (the keeper, 2026-10-08 17:16: "it should be an option in the settings that should be enabled first"). The setting lives in
// ~/.consonance.json as `usb_mode` (main.rs Config; its rows are main.rs `usb_mode_tests`), and the Settings tab is how a person turns it on. A
// setting is wired in three places — the checkbox in index.html, load() reading it, persist() writing it back — and one missing makes a toggle
// that looks right and does nothing, or one that silently turns itself OFF on the next save. Checked in the text, as librarian-wiring.test.js does.
'use strict';
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); console.log('  ok   ' + name); pass++; }
  catch (e) { console.log('  FAIL ' + name + '\n       ' + e.message); fail++; }
};

t('the Settings tab has the checkbox, named as the keeper asked, with its one-line note on what a drive needs', () => {
  assert.match(html, /<input type="checkbox" id="usbmode"[^>]*\/> Move seats between computers with a USB drive<\/label>/);
  assert.match(html, /Off unless you turn it on\./);
  assert.match(html, /consonance-transfer/, 'the note does not say what a drive needs');
});

/** The two lines of load() and persist() that carry the setting, run against a fake checkbox: the wiring's behaviour, not only its names. */
const lineOf = (re) => { const m = app.split('\n').find((l) => re.test(l)); if (!m) throw new Error(`no line matching ${re}`); return m; };
function run(line, state, checked) {
  const box = { checked };
  const ctx = { state, $: (sel) => (sel === '#usbmode' ? box : null) };
  vm.createContext(ctx); vm.runInContext(line, ctx);
  return { state: ctx.state, box };
}

t('load(): the box is ticked only when the config says true (absent, false or a string leave it OFF)', () => {
  const line = lineOf(/\$\('#usbmode'\)\.checked = state\.usb_mode/);
  assert.strictEqual(run(line, { usb_mode: true }, false).box.checked, true);
  for (const s of [{}, { usb_mode: false }, { usb_mode: 'true' }]) assert.strictEqual(run(line, s, true).box.checked, false, JSON.stringify(s));
});

t('persist(): the box is written back to the config as a boolean, so a save keeps it (and an unticked box saves false)', () => {
  const line = lineOf(/state\.usb_mode = !!\$\('#usbmode'\)\.checked/);
  assert.strictEqual(run(line, { data_dir: 'x' }, true).state.usb_mode, true);
  assert.strictEqual(run(line, { usb_mode: true }, false).state.usb_mode, false);
  assert.ok(/state\.usb_mode = [^\n]*\n\s*await invoke\('save_config', \{ cfg: state \}\);/.test(app), 'the setting is not written before the save');
});

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
