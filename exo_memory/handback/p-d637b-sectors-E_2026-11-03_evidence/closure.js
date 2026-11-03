// every test file (test/, app/test/) whose static require graph reaches a touched source, and every mutation harness whose inner test file is one of them
// (a harness copies src/ and runs another file, so it reaches the code only through that file). node closure.js <root> <touched...>
const fs = require('fs'), path = require('path'), R = path.resolve(process.argv[2]), touched = new Set(process.argv.slice(3).map((f) => path.resolve(R, f)));
const reqs = (f) => { let src; try { src = fs.readFileSync(f, 'utf8'); } catch (e) { if (e.code === 'ENOENT') return []; throw e; }
  const out = []; for (const m of src.matchAll(/require\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*\)/g)) { let p = path.resolve(path.dirname(f), m[1]); for (const c of [p, p + '.js', path.join(p, 'index.js')]) if (fs.existsSync(c) && fs.statSync(c).isFile()) { out.push(c); break; } } return out; };
const memo = new Map(); const reaches = (f, seen = new Set()) => { if (memo.has(f)) return memo.get(f); if (touched.has(f)) return true; if (seen.has(f)) return false; seen.add(f); const r = reqs(f).some((g) => reaches(g, seen)); if (!seen.size || true) memo.set(f, r); return r; };
const tests = []; for (const d of ['test', 'app/test']) for (const n of fs.readdirSync(path.join(R, d))) if (n.endsWith('.test.js')) tests.push(path.join(R, d, n));
const direct = new Set(tests.filter((f) => reaches(f)));
const inner = (f) => { const src = fs.readFileSync(f, 'utf8'), names = new Set(); for (const m of src.matchAll(/['"]([\w.-]+\.test\.js)['"]/g)) if (path.basename(f) !== m[1]) names.add(m[1]); return [...names]; };
const harness = tests.filter((f) => /mutation|mutant/.test(path.basename(f)) || /MUTANTS\s*=/.test(fs.readFileSync(f, 'utf8')));
const viaInner = harness.filter((f) => !direct.has(f) && inner(f).some((n) => [...direct].some((d) => path.basename(d) === n)));
const rel = (f) => path.relative(R, f).split(path.sep).join('/');
const all = [...new Set([...direct, ...viaInner])].map(rel).sort();
fs.writeFileSync(path.join(__dirname, 'closure-files.txt'), all.join('\n') + '\n');
const harnessAll = harness.filter((f) => all.includes(rel(f))).map(rel).sort();
fs.writeFileSync(path.join(__dirname, 'closure-harnesses.txt'), harnessAll.join('\n') + '\n');
console.log(`test files ${tests.length}; reach a touched source directly ${direct.size}; harnesses reaching it only through their inner file ${viaInner.length}; total ${all.length}; of them mutation harnesses ${harnessAll.length}`);
