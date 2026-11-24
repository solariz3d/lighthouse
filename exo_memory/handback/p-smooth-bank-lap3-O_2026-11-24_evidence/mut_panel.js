// LAP 3's panel mutants: each one edit to app/core/panel.js in a copy of the tip's app/ and src/, then the flow panel rows run on it. A mutant is caught when a row fails.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const T = 'G:/consonance-scratch/o-smooth-t180', W = 'G:/consonance-scratch/o-smooth-work/tmp/mut-panel';
const MUT = [
  ['P1 the box is ticked when its option is left out', 'bankFlow = false, bankAt = null }) {', 'bankFlow = true, bankAt = null }) {'],
  ['P2 an at left behind with the box unticked still flows', 'const flow = !!bankFlow && b !== null;', 'const flow = (!!bankFlow || num(bankAt) !== null) && b !== null;'],
  ['P3 the bank rows are sent as changes as well as through', "if (targets[ch] === undefined || (flow && ch === 'phi')) continue;", 'if (targets[ch] === undefined) continue;'],
  ['P4 the bank rows are dropped when unticked', "if (targets[ch] === undefined || (flow && ch === 'phi')) continue;", "if (targets[ch] === undefined || ch === 'phi') continue;"],
  ['P5 a run of blank ats is spread one place early', 'out[i] = near2(a + ((b - a) * (i - k + 1)) / m);', 'out[i] = near2(a + ((b - a) * (i - k)) / m);'],
  ['P6 a typed first at is ignored for the early ramp', 'const at0 = num(bankAt) !== null ? num(bankAt) : Number.isFinite(transition.phi) ? transition.phi : null;', 'const at0 = Number.isFinite(transition.phi) ? transition.phi : null;'],
  ['P7 a mark\'s target is sent in degrees', 'out.through = { phi: items.map((x, k) => ({ at: ats[k + 1], target: x.then * DEG })) };', 'out.through = { phi: items.map((x, k) => ({ at: ats[k + 1], target: x.then })) };'],
  ['P8 Undo does not give the box back', "if (m.flow !== undefined) { bankFlow.checked = !!m.flow; bankAtF.value = m.bankAt; showFlow(); }", ''],
  ['P9 the panel does not send the box', 'bankFlow: flowOn(), bankAt: bankAtF.value });', 'bankAt: bankAtF.value });'],
  ['P10 the panel rewrites a core refusal', "msg.textContent = ghostSaid = `no preview of this piece: ${why}`;", "msg.textContent = ghostSaid = `no preview of this piece: ${String(why).split(':')[0]}`;"],
];
const src = fs.readFileSync(path.join(T, 'app/core/panel.js'), 'utf8');
let caught = 0;
for (const [id, a, b] of MUT) {
  fs.rmSync(W, { recursive: true, force: true });
  for (const d of ['app', 'src', 'tools']) fs.cpSync(path.join(T, d), path.join(W, d), { recursive: true });
  if (src.split(a).length !== 2) { console.log('NOT APPLIED', id); continue; }
  fs.writeFileSync(path.join(W, 'app/core/panel.js'), src.replace(a, () => b));
  const r = spawnSync(process.execPath, ['--test', 'app/test/core-bank-flow-panel.test.js'], { cwd: W, encoding: 'utf8', windowsHide: true, env: { ...process.env, TMP: 'G:/consonance-scratch/o-smooth-work/tmp', TEMP: 'G:/consonance-scratch/o-smooth-work/tmp' } });
  const out = (r.stdout + r.stderr).replace(/\x1b\[[0-9;]*m/g, ''), red = [...out.matchAll(/^✖ (row \d)/gm)].map((m) => m[1]);
  const hit = [...new Set(red)].join(', ');
  const rows = new Set([...out.matchAll(/^[✔✖] (row \d)/gm)].map((m) => m[1])).size;   // each red row is listed again under "failing tests" if (rows !== 5) { console.log('ERROR', id, `(${rows} rows ran)`, out.split('\n').find((l) => /Error/.test(l)) || ''); continue; }
  if (hit) caught++;
  console.log(hit ? 'caught' : 'SURVIVED', id, hit ? `(${hit})` : '');
}
console.log(`${caught} of ${MUT.length} caught`);
