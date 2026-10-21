'use strict';
// D421 landing (O): every mutation anchor in src/core/sculpt.js, from every harness (loaded with node:test stubbed, so none runs), counted in the tree's file.
// Both shapes: { file, from } and { edits: [[path, from, to], ...] }. An anchor must occur exactly once.   cwd = the t180 tree:  node sculpt-anchors.js
const fs = require('fs'), path = require('path'), Module = require('module');
const stub = Object.assign(() => {}, { describe() {}, it() {}, before() {}, after() {}, beforeEach() {}, afterEach() {}, test() {}, skip() {}, todo() {}, mock: {} });
const target = fs.readFileSync('src/core/sculpt.js', 'utf8').replace(/\r\n/g, '\n');
const files = [...fs.readdirSync('test').map((f) => `test/${f}`), ...fs.readdirSync('app/test').map((f) => `app/test/${f}`)].filter((f) => /\.js$/.test(f) && /MUTATIONS|MUTANTS/.test(fs.readFileSync(f, 'utf8')));
let n = 0, bad = 0; const per = {};
for (const h of files) {
  const file = path.resolve(h), src = fs.readFileSync(file, 'utf8'), name = (src.match(/const (\w*(?:MUTATIONS|MUTANTS)\w*)\s*=\s*\[/) || [])[1]; if (!name) continue;
  const req = Module.createRequire(file), m = new Module(file, module); m.filename = file; m.paths = Module._nodeModulePaths(path.dirname(file));
  m.require = (id) => (id === 'node:test' || id === 'test' ? stub : req(id));
  let list; try { m._compile(src + `\n;module.exports.__M = ${name};`, file); list = m.exports.__M; } catch (e) { console.log(`${h}: could not load (${e.message.slice(0, 80)})`); continue; }
  for (const mu of list || []) {
    const pairs = mu.edits ? mu.edits.map(([p, from]) => [p, from]) : [[mu.file, mu.from]];
    for (const [p, from] of pairs) if (typeof p === 'string' && /sculpt\.js$/.test(p) && /core/.test(p + (mu.file || '')) || p === 'sculpt.js') {
      const c = target.split(String(from).replace(/\r\n/g, '\n')).length - 1; n++; per[h] = (per[h] || 0) + 1; if (c !== 1) { bad++; console.log(`${h} ${mu.id}: ${c} occurrences`); }
    }
  }
}
console.log(JSON.stringify({ anchors_in_sculpt_js: n, per_harness: per, not_exactly_once: bad }));
