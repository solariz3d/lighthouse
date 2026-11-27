// reach.js (pane B, L264): which test files EXECUTE a given code file, by L262's definition (pane P's tset2.js, restated): require() calls whose argument is a string
// literal starting ./ or ../, followed transitively. (A spawning harness's named *.test.js files are not followed here; the harnesses are listed apart.) Also lists the
// mutation harnesses whose text NAMES the file. usage: node reach.js <tree> <code file, relative> [--list]
'use strict';
const fs = require('fs'), path = require('path');
const [tree, target, flag] = process.argv.slice(2), T = path.resolve(tree), goal = path.join(T, target);
const reqRe = /require\(\s*(['"])(\.{1,2}\/[^'"]+)\1\s*\)/g, memo = new Map();
const resolve = (from, spec) => { const b = path.resolve(path.dirname(from), spec); for (const c of [b, b + '.js', b + '.cjs', path.join(b, 'index.js')]) if (fs.existsSync(c) && fs.statSync(c).isFile()) return c; return null; };
function reaches(file, seen = new Set()) {
  if (file === goal) return true; if (seen.has(file)) return false; seen.add(file);
  let t; try { t = fs.readFileSync(file, 'utf8'); } catch (e) { return false; }
  for (const m of t.matchAll(reqRe)) { const r = resolve(file, m[2]); if (r && reaches(r, seen)) return true; }
  return false;
}
const tests = ['test', 'app/test'].flatMap((d) => fs.readdirSync(path.join(T, d)).filter((f) => f.endsWith('.test.js')).map((f) => path.join(T, d, f)));
const hit = tests.filter((f) => reaches(f)), rel = (f) => path.relative(T, f).replace(/\\/g, '/');
const harn = tests.filter((f) => /mutation/.test(path.basename(f)) && fs.readFileSync(f, 'utf8').includes(target.replace(/^src\//, '').split('/').slice(-2).join('/')));
console.log(`test files ${tests.length}; executing ${target}: ${hit.length}; mutation harnesses naming it: ${harn.length}`);
if (flag === '--list') { console.log('executes:\n  ' + hit.map(rel).join('\n  ')); console.log('harnesses naming it:\n  ' + harn.map(rel).join('\n  ')); }
