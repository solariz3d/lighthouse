// panelrule.js (pane A, L258): which app test files reach app/core/panel.js, by three stated rules. usage: node panelrule.js <tree> [--list a|b|c|ab|abc]
// (a) DIRECT: the test file has a require() whose string argument resolves to app/core/panel.js
// (b) GRAPH: app/core/panel.js is in the test file's static require closure (string-literal require() calls only, resolved like Node: as given, then .js,
//     then /index.js), across every .js/.cjs under the tree (app/ and src/ and the rest)
// (c) SOURCE: the test file reads or mutates panel.js's text: a mutation table entry file: '[app/]core/panel.js', or a readFileSync/path.join naming core + panel.js
'use strict';
const fs = require('fs'), path = require('path');
const T = path.resolve(process.argv[2]), PANEL = path.join(T, 'app', 'core', 'panel.js');
const want = (process.argv.indexOf('--list') > 0) ? process.argv[process.argv.indexOf('--list') + 1] : null;
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\'"`])\/\/.*$/gm, '$1');
const resolve = (from, spec) => { if (!spec.startsWith('.')) return null; const b = path.resolve(path.dirname(from), spec); for (const c of [b, b + '.js', b + '.cjs', path.join(b, 'index.js')]) { try { if (fs.statSync(c).isFile()) return c; } catch (e) { /* next */ } } return null; };
const deps = new Map();
const depsOf = (f) => { if (deps.has(f)) return deps.get(f); let src = ''; try { src = strip(fs.readFileSync(f, 'utf8')); } catch (e) { /* none */ } const out = []; for (const m of src.matchAll(/require\(\s*(['"`])([^'"`]+)\1\s*\)/g)) { const r = resolve(f, m[2]); if (r) out.push(r); } deps.set(f, out); return out; };
const closure = (f) => { const seen = new Set(), st = [f]; while (st.length) { const x = st.pop(); for (const d of depsOf(x)) if (!seen.has(d)) { seen.add(d); st.push(d); } } return seen; };
const tests = fs.readdirSync(path.join(T, 'app', 'test')).filter((n) => n.endsWith('.test.js')).sort().map((n) => path.join(T, 'app', 'test', n));
const rows = tests.map((f) => { const src = fs.readFileSync(f, 'utf8'), code = strip(src);
  const a = depsOf(f).includes(PANEL), b = closure(f).has(PANEL);
  const c = /file:\s*['"](app\/)?core\/panel\.js['"]/.test(code) || /(readFileSync|path\.join)\([^)]*['"]core['"][^)]*['"]panel\.js['"]/.test(code) || /(readFileSync|path\.join)\([^)]*core\/panel\.js/.test(code) || /const\s+\w+\s*=\s*['"]app\/core\/panel\.js['"]/.test(code);
  return { f: path.basename(f), a, b, c }; });
const n = (k) => rows.filter(k).length;
console.log(`${path.basename(T)} ${require('child_process').execSync('git rev-parse --short=7 HEAD', { cwd: T }).toString().trim()}: ${tests.length} test files`);
console.log(`(a) direct ${n((r) => r.a)}  (b) graph ${n((r) => r.b)}  (c) source ${n((r) => r.c)}  a|c ${n((r) => r.a || r.c)}  b|c ${n((r) => r.b || r.c)}`);
if (want) for (const r of rows) if ((want.includes('a') && r.a) || (want.includes('b') && r.b) || (want.includes('c') && r.c)) console.log(r.f);
