// LAP 4: the mutants again (after b2's bar and the step-back row), then the touched rows on 15b1306's export (src, test, tools, app) for their red, then on the tip
const { spawnSync } = require('child_process'), H = __dirname, fs = require('fs'), path = require('path');
const B = 'G:/consonance-scratch/o-smooth-work/tmp/base15b', T = 'G:/consonance-scratch/o-smooth-t180';
const FILES = ['test/core_bank_flow_lap4.test.js', 'test/core_bank_flow_room_search.test.js', 'app/test/core-bank-flow-panel.test.js', 'test/core_bank_flow_drawn.test.js', 'test/core_bank_flow.test.js'];
const go = (name, args, cwd = H) => { const r = spawnSync(process.execPath, args, { cwd, encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28 }); const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''); fs.writeFileSync(H + '/' + name, out); return out; };
console.log(go('mut_lap4_out.txt', [H + '/mut_lap4.js']));
// the tip's row files over 15b1306 (the pins and the panel pins with them), then put back
const saved = FILES.concat(['test/core_bank_flow_lap4.pins.json']).map((f) => [f, fs.existsSync(path.join(B, f)) ? fs.readFileSync(path.join(B, f)) : null]);
for (const [f] of saved) fs.copyFileSync(path.join(T, f), path.join(B, f));
const red = go('rows_lap4_red_final.txt', ['--test', ...FILES], B);
for (const [f, b] of saved) { if (b === null) fs.rmSync(path.join(B, f)); else fs.writeFileSync(path.join(B, f), b); }
console.log('== 15b1306\n' + red.split('\n').filter((l) => /^[✔✖] .+\(\d|^ℹ (pass|fail)/.test(l) && !/\.test\.js/.test(l)).join('\n'));
console.log('== tip\n' + go('rows_lap4_green_final.txt', ['--test', ...FILES], T).split('\n').filter((l) => /^[✔✖] .+\(\d|^ℹ (pass|fail)/.test(l) && !/\.test\.js/.test(l)).join('\n'));
