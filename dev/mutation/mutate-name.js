const fs = require('fs');
const { execFileSync } = require('child_process');
const P = 'C:/Consonance/lighthouse/consonance/tools/state-block.js';
const T = 'C:/Consonance/lighthouse/consonance/tools/state-block.test.js';
const orig = fs.readFileSync(P, 'utf8');
const run = () => { try { execFileSync(process.execPath, [T], { stdio: 'ignore' }); return 0; } catch (e) { return e.status || 1; } };

const mutants = [
  ['a hardcoded name replaces the config lookup (the bestowal-by-literal failure)',
   (s) => s.replace("const nm = typeof cfg.chair_name === 'string' ? cfg.chair_name.trim() : '';",
                    "const nm = 'Chrysos';")],
  ['an absent field manufactures a name to fill the blank',
   (s) => s.replace("  if (!nm) {\n    return {", "  if (false) {\n    return {")],
  ['the line stops disclaiming that it is the authority',
   (s) => s.replace("'this line is a pointer to that record, not the authority for it',", "'',")],
  ['a broken config reads as merely unnamed instead of FAILED',
   (s) => s.replace("catch (e) { return { title: 'name', cmd: 'type %USERPROFILE%\\\\.consonance.json', lines: ['FAILED: ' + cfgPath + ' unreadable (' + (e.code || 'error') + ')'] }; }",
                    "catch (e) { cfg = {}; }")],
];

console.log('baseline: exit=' + run());
for (const [name, fn] of mutants) {
  const m = fn(orig);
  if (m === orig) { console.log('  NOT APPLIED  ' + name); continue; }
  fs.writeFileSync(P, m);
  const code = run();
  console.log('  ' + (code !== 0 ? 'KILLED  ' : 'SURVIVED') + ' exit=' + code + '  ' + name);
  fs.writeFileSync(P, orig);
}
console.log('restored: exit=' + run());
