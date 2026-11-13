// Keep both sides of every conflict in the given file (HEAD's lines, then the other side's), markers removed. usage: node resolve_both.js <file>
const fs = require('fs');
const f = process.argv[2];
let s = fs.readFileSync(f, 'utf8');
const crlf = s.includes('\r\n');
const out = [];
let n = 0, open = false;
for (const line of s.split(/\r?\n/)) {
  if (line.startsWith('<<<<<<< ')) { n++; open = true; continue; }
  if (line === '=======' && open) { continue; }
  if (line.startsWith('>>>>>>> ')) { open = false; continue; }
  out.push(line);
}
if (n === 0) throw new Error('no conflict markers found in ' + f);
fs.writeFileSync(f, out.join(crlf ? '\r\n' : '\n'));
console.log(f + ': ' + n + ' conflict(s) resolved by keeping both sides');
