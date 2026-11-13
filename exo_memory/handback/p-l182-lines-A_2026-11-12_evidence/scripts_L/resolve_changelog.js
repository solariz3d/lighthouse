// Keep both sides of the one conflict in CHANGELOG.md (main's new entry, then Lap R's), a blank line between.
const fs = require('fs');
const f = 'C:/Users/zackn/Downloads/dreamzone-3-a-l197/CHANGELOG.md';
let s = fs.readFileSync(f, 'utf8');
const crlf = s.includes('\r\n');
const lines = s.split(/\r?\n/);
const out = [];
let n = 0;
for (const line of lines) {
  if (line.startsWith('<<<<<<< ')) { n++; continue; }
  if (line === '=======') { out.push(''); n++; continue; }
  if (line.startsWith('>>>>>>> ')) { n++; continue; }
  out.push(line);
}
if (n !== 3) throw new Error('expected 3 markers, found ' + n);
fs.writeFileSync(f, out.join(crlf ? '\r\n' : '\n'));
console.log('resolved: 3 markers removed');
