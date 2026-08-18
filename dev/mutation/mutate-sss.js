const fs = require('fs');
const { execFileSync } = require('child_process');
const P = 'C:/Consonance/lighthouse/consonance/hooks/sessionstart-state.js';
const T = 'C:/Consonance/lighthouse/consonance/hooks/sessionstart-state.test.js';
const orig = fs.readFileSync(P, 'utf8');
const run = () => { try { execFileSync(process.execPath, [T], { stdio: 'ignore' }); return 0; } catch (e) { return e.status || 1; } };

const mutants = [
  ['emits PreCompact\u2019s root-level shape instead of SessionStart\u2019s (A\u2019s silent-failure trap)',
   (s) => s.replace("hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: context },",
                    "additionalContext: context,")],
  ['fires on every source, ignoring the gate',
   (s) => s.replace('if (!SOURCES.includes(source)) {', 'if (false) {')],
  ['a broken generator emits nothing instead of reporting FAILED',
   (s) => s.replace("return '[state-block FAILED: generator did not run (' + (e.code || 'error') + ')]';",
                    "return '';")],
  ['the ledger stops distinguishing a failed block from a good one',
   (s) => s.replace('failed: /FAILED/.test(block),', 'failed: false,')],
  ['the dream gate is removed',
   (s) => s.replace("if (process.env.CONSONANCE_DREAM) process.exit(0);", "")],
];

console.log('baseline: exit=' + run());
for (const [name, fn] of mutants) {
  const m = fn(orig);
  if (m === orig) { console.log('  NOT APPLIED  ' + name); continue; }
  fs.writeFileSync(P, m);
  let code = run();
  // the dream gate is enforced by a different suite, so check that one too
  if (code === 0 && /dream gate/.test(name)) {
    try { execFileSync(process.execPath, ['C:/Consonance/lighthouse/consonance/hooks/dream-gate.test.js'], { stdio: 'ignore' }); }
    catch (e) { code = e.status || 1; }
  }
  console.log('  ' + (code !== 0 ? 'KILLED  ' : 'SURVIVED') + ' exit=' + code + '  ' + name);
  fs.writeFileSync(P, orig);
}
console.log('restored: exit=' + run());
