// run-preset-wiring.test.js — run with: node run-preset-wiring.test.js
//
// L247, THE RUN PRESET (his words, 2026-11-26 02:50: "there is our setup now which is normal, then in the settings is a turbo preset"). The
// setting lives in ~/.consonance.json as `run_preset` (main.rs Config and seat_launch; its rows are main.rs `run_preset_tests` and
// `config_merge_tests`), and the Settings tab is how he picks it. Wired in three places, as the USB mode is (usb-mode-wiring.test.js): the select
// in index.html, load() reading it, persist() writing it back. Checked in the text, and the two lines run against a fake select.
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

t('the Settings tab has one Run preset row, Normal and Turbo, and says it takes effect at the next relaunch', () => {
  const m = /<select id="runpreset"[^>]*>([\s\S]*?)<\/select>/.exec(html);
  assert.ok(m, 'no select#runpreset');
  const values = [...m[1].matchAll(/<option value="([^"]*)"/g)].map((x) => x[1]);
  assert.deepStrictEqual(values, ['normal', 'turbo'], 'Normal first (the default), then Turbo, and nothing else');
  assert.match(html, /Run preset/);
  assert.match(html, /takes effect at the next relaunch/i);
});

/** The lines of load() and persist() that carry the setting, run against a fake select: the wiring's behaviour, not only its names. */
const lineOf = (re) => { const m = app.split('\n').find((l) => re.test(l)); if (!m) throw new Error(`no line matching ${re}`); return m; };
// a select takes a value it has an option for, and reads '' for one it has not (as the WebView's does)
function run(line, state, value) {
  const sel = { _v: value, get value() { return this._v; }, set value(v) { this._v = ['normal', 'turbo'].includes(v) ? v : ''; } };
  const ctx = { state, $: (q) => (q === '#runpreset' ? sel : null) };
  vm.createContext(ctx); vm.runInContext(line, ctx);
  return { state: ctx.state, sel };
}

t('load(): the select shows the config\'s preset, and Normal when the key is missing or empty', () => {
  const line = lineOf(/\$\('#runpreset'\)\.value = state\.run_preset/);
  assert.strictEqual(run(line, { run_preset: 'turbo' }, 'normal').sel.value, 'turbo');
  assert.strictEqual(run(line, { run_preset: 'normal' }, 'turbo').sel.value, 'normal');
  for (const s of [{}, { run_preset: '' }]) assert.strictEqual(run(line, s, 'turbo').sel.value, 'normal', JSON.stringify(s));
});

t('persist(): the picked preset is written back; a value the select cannot show is left as the config wrote it (never guessed to normal)', () => {
  const line = lineOf(/state\.run_preset = \$\('#runpreset'\)\.value/);
  assert.strictEqual(run(line, { run_preset: 'normal' }, 'turbo').state.run_preset, 'turbo');
  assert.strictEqual(run(line, { run_preset: 'turbo' }, 'normal').state.run_preset, 'normal');
  assert.strictEqual(run(line, { run_preset: 'warp' }, '').state.run_preset, 'warp', 'an unknown value was overwritten');
  assert.ok(app.indexOf("state.run_preset = $('#runpreset')") < app.indexOf("await invoke('save_config', { cfg: state });"), 'the setting is not written before the save');
});

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
