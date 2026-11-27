// redactcopy.js (pane B, L258): copy named files from the scratch folder into the hand-back's evidence folder, with private paths written as placeholders:
// the scratch folder <scratch>, the Downloads folder <Downloads>, any other home path <home>; ANSI colour codes taken out. Both slash forms and JSON's escaped
// backslashes. usage: node redactcopy.js <scratch dir> <evidence dir> <file>...  (a file may be dir/name; it lands as dir-name)
'use strict';
const fs = require('fs'), path = require('path');
const [src, dst, ...files] = process.argv.slice(2);
fs.mkdirSync(dst, { recursive: true });
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const forms = (p) => { const b = p.replace(/\//g, '\\'), f = p.replace(/\\/g, '/'); return [b.replace(/\\/g, '\\\\'), b, f, f.replace(/^C:/i, '/c')]; };
const pairs = [
  ...forms(path.resolve(src)).map((x) => [x, '<scratch>']),
  ...forms('<temp>').map((x) => [x, '<temp>']),
  ...forms('<Downloads>').map((x) => [x, '<Downloads>']),
  ...forms('<home>').map((x) => [x, '<home>']),
];
for (const f of files) {
  let t = fs.readFileSync(path.join(src, f), 'utf8').replace(/\x1b\[[0-9;]*m/g, '');
  for (const [from, to] of pairs) t = t.replace(new RegExp(esc(from), 'gi'), to);
  const out = path.join(dst, f.replace(/[\\/]/g, '-'));
  fs.writeFileSync(out, t);
}
console.log(`copied ${files.length} files`);
