// rule261.js (pane A, L261): the test files that reach app/core/handles.js or app/core/panel.js, the two files this change touches. usage: node rule261.js <tree>
// GRAPH: either file is in the test's static require closure (string-literal require() calls, resolved like Node: as given, .js, .cjs, /index.js);
// SOURCE: the test reads or mutates either file's text (a harness naming 'app/core/handles.js' or 'app/core/panel.js', or a path.join/readFileSync of core + the name).
// Over app/test/*.test.js and test/*.test.js. Prints one relative path a line, then the counts to stderr.
'use strict';
const fs = require('fs'), path = require('path');
const T = path.resolve(process.argv[2]), TARGETS = ['handles.js', 'panel.js'].map((n) => path.join(T, 'app', 'core', n));
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const resolve = (from, spec) => { if (!spec.startsWith('.')) return null; const b = path.resolve(path.dirname(from), spec); for (const c of [b, b + '.js', b + '.cjs', path.join(b, 'index.js')]) { try { if (fs.statSync(c).isFile()) return c; } catch (e) { /* next */ } } return null; };
const deps = new Map();
const depsOf = (f) => { if (deps.has(f)) return deps.get(f); let src = ''; try { src = strip(fs.readFileSync(f, 'utf8')); } catch (e) { /* none */ } const out = []; for (const m of src.matchAll(/require\(\s*(['"`])([^'"`]+)\1\s*\)/g)) { const r = resolve(f, m[2]); if (r) out.push(r); } deps.set(f, out); return out; };
const closure = (f) => { const seen = new Set(), st = [f]; while (st.length) { const x = st.pop(); for (const d of depsOf(x)) if (!seen.has(d)) { seen.add(d); st.push(d); } } return seen; };
const files = ['app/test', 'test'].flatMap((d) => fs.readdirSync(path.join(T, d)).filter((n) => n.endsWith('.test.js')).sort().map((n) => path.join(T, d, n)));
let g = 0, s = 0; const out = [];
for (const f of files) {
  const code = strip(fs.readFileSync(f, 'utf8')), cl = closure(f), graph = TARGETS.some((t) => cl.has(t));
  const source = /['"](app\/)?core\/(handles|panel)\.js['"]/.test(code) || /(readFileSync|path\.join)\([^)]*['"]core['"][^)]*['"](handles|panel)\.js['"]/.test(code);
  if (graph) g++; if (source && !graph) s++;
  if (graph || source) out.push(path.relative(T, f).split(path.sep).join('/'));
}
console.log(out.join('\n')); console.error(`${files.length} test files; ${g} by GRAPH; ${s} more by SOURCE only; ${out.length} in all`);
