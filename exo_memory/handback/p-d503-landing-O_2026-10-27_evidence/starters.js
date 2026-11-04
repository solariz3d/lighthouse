// starters.js (D503, O): chrome-mute row 3's own scan, at a given tree: how many test files start a page, and which never title it.
'use strict';
const fs = require('fs'), path = require('path'), REPO = process.argv[2];
const walk = (dir, out) => { for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); if (e.isDirectory()) walk(p, out); else if (/\.(c|m)?js$/.test(e.name)) out.push(p); } return out; };
const code = (t) => t.split(/\r?\n/).filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
const s = [];
for (const d of ['app/test', 'test']) for (const f of walk(path.join(REPO, d), [])) {
  if (f.endsWith('chrome-mute.test.js')) continue;
  const t = fs.readFileSync(f, 'utf8');
  if (/--remote-debugging-port=|\blaunchChrome\(/.test(code(t))) s.push({ file: path.relative(REPO, f).split(path.sep).join('/'), titled: /zz-headless-test/.test(code(t)) });
}
console.log(`${s.length} starters, ${s.filter((x) => !x.titled).length} untitled`); for (const x of s) console.log(`  ${x.titled ? 'titled  ' : 'UNTITLED'} ${x.file}`);
