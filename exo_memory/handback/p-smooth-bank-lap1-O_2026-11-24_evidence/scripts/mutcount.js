// mutcount.js <run.txt>: per harness, how many of its MUTANTS table's ids ran, were caught, failed
const fs = require('fs'), T = 'G:/consonance-scratch/o-smooth-t180/test/';
const out = fs.readFileSync(process.argv[2], 'utf8').replace(/\x1b\[[0-9;]*m/g, '');
for (const f of ['core_ramp_mutation.test.js', 'core_bank_flow_mutation.test.js']) {
  const t = fs.readFileSync(T + f, 'utf8').replace(/\r\n/g, '\n');
  const X = 'x', B = 'x', P = 'x';   // the table's file-name constants (their values do not matter for the ids)
  const M = eval(t.slice(t.indexOf('const MUTANTS = [') + 16, t.indexOf('const FILES')).trim().replace(/;$/, ''));
  const ran = M.filter((m) => out.includes(' mutant ' + m.id + ':')), ok = M.filter((m) => out.includes('✔ mutant ' + m.id + ':'));
  console.log(f, 'table', M.length, 'ran', ran.length, 'caught', ok.length, 'not run', M.filter((m) => !ran.includes(m)).map((m) => m.id.slice(0, 40)));
}
