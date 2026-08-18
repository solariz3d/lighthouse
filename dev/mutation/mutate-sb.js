// Mutation harness for state-block.js. Each mutant must turn the suite RED; a mutant that
// leaves it green means that guard is measuring nothing.
const fs = require('fs');
const { execFileSync } = require('child_process');
const P = 'C:/Consonance/lighthouse/consonance/tools/state-block.js';
const T = 'C:/Consonance/lighthouse/consonance/tools/state-block.test.js';
const orig = fs.readFileSync(P, 'utf8');

const run = () => {
  try { execFileSync(process.execPath, [T], { stdio: 'ignore' }); return 0; }
  catch (e) { return e.status || 1; }
};

const mutants = [
  ['silent truncation (Around\u2019s registered falsifier)',
   (s) => s.replace(/const marker = '\\n\[state-block TRUNCATED[\s\S]*?';/, "const marker = '';")],
  ['a section drops its check command (condition a)',
   (s) => s.replace("return { title: 'repo', cmd: 'git log -1 --format=\"%h %s\"; git status --short', lines };",
                    "return { title: 'repo', cmd: '', lines };")],
  ['failure is omitted instead of reported',
   (s) => s.replace("lines.push('FAILED: git log did not run here');", "lines.push('');")],
  ['museum clause 1 breached — the block characterises the reader',
   (s) => s.replace("const parts = ['[state-block: machine-generated,",
                    "const parts = ['You are the one who built these.', '[state-block: machine-generated,")],
  ['an invisible control byte returns to the source',
   (s) => s.replace("const MARK = '@@';", "const MARK = '@@';" + String.fromCharCode(0))],
];

console.log('baseline: exit=' + run());
for (const [name, fn] of mutants) {
  const mutated = fn(orig);
  if (mutated === orig) { console.log('  NOT APPLIED  ' + name); continue; }
  fs.writeFileSync(P, mutated);
  const code = run();
  console.log('  ' + (code !== 0 ? 'KILLED ' : 'SURVIVED') + '  exit=' + code + '  ' + name);
  fs.writeFileSync(P, orig);
}
console.log('restored: exit=' + run());
