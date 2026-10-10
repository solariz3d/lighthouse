// Score ONE mutant from dev/tail-carry.mutants.js by name, with the harness's own mechanism: a copy in dev/ named
// .tail-carry.mutant-<pid>.js, the suite pointed at it through TAIL_CARRY_UNDER_TEST, a green pre-flight first, the copy
// removed after. The tracked source is never written.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
const DEV = path.join(REPO, 'dev');
const name = process.argv[2];
const src = fs.readFileSync(path.join(DEV, 'tail-carry.mutants.js'), 'utf8');
const TOOL = path.join(DEV, 'tail-carry.js');
const SUITE = path.join(DEV, 'tail-carry.test.js');
const COPY = path.join(DEV, `.tail-carry.mutant-${process.pid}.js`);
// Pull MUTANTS out of the harness without running it.
const start = src.indexOf('const MUTANTS = [');
const end = src.indexOf('\n];', start);
const MUTANTS = eval(src.slice(start + 'const MUTANTS = '.length, end + 3));
const m = MUTANTS.find(([n]) => n === name);
if (!m) { console.log('no such mutant'); process.exit(2); }
const original = fs.readFileSync(TOOL, 'utf8');
const hits = original.split(m[1]).length - 1;
console.log(`anchor matches: ${hits}; replacement already in source: ${original.includes(m[2])}`);
if (hits !== 1 || original.includes(m[2])) process.exit(2);
const red = () => { try { execFileSync(process.execPath, [SUITE], { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', env: { ...process.env, TAIL_CARRY_UNDER_TEST: COPY } }); return { red: false, out: '' }; } catch (e) { return { red: true, out: String(e.stdout) }; } };
try {
  fs.writeFileSync(COPY, original);
  const pre = red();
  console.log(`pre-flight on the unmutated copy: ${pre.red ? 'RED — not scored' : 'green'}`);
  if (pre.red) process.exit(2);
  fs.writeFileSync(COPY, original.replace(m[1], () => m[2]));
  const r = red();
  const fails = r.out.split('\n').filter((l) => l.startsWith('  FAIL')).map((l) => l.slice(7));
  console.log(`${r.red ? 'killed' : 'SURVIVED'}  ${name}${fails.length ? ' — ' + fails.join(' | ') : ''}`);
} finally {
  try { fs.unlinkSync(COPY); } catch (_) {}
  console.log(`tracked source unchanged: ${fs.readFileSync(TOOL, 'utf8') === original}`);
}
