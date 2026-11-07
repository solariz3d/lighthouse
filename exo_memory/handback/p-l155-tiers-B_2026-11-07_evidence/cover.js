const fs = require('fs'), path = require('path'), T = require(path.resolve('scripts/test-touched.cjs'));
const files = process.argv.slice(2), RE = /require\(\s*path\.(?:join|resolve)\(([^()]*)\)\s*\)/g;
let all = 0, ok = 0, filesAny = 0, filesAll = 0; const miss = [];
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8'), b = T.bases(f, text); let n = 0, k = 0;
  for (const m of text.matchAll(RE)) { n++; const p = T.built(m[1], b); if (p !== null && fs.existsSync(p)) k++; else miss.push(`${f}: require(path…(${m[1]}))`); }
  all += n; ok += k; if (k) filesAny++; if (k === n) filesAll++;
}
console.log(`${files.length} files; built-path requires ${all}, followed to an existing file ${ok}; files with at least one followed ${filesAny}, with all followed ${filesAll}`);
for (const m of miss) console.log('  not followed: ' + m);
