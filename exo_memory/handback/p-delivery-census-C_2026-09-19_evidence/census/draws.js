// Read-only: the last N composer draws before a delivery's first render, raw, SGR shown as {codes}.
// usage: node draws.js <pane-log-basename> <needle words> <back bytes> <n>
const fs = require('fs');
const [file, needle, back, n] = process.argv.slice(2);
const s = fs.readFileSync('C:/Consonance/data/captures/' + file).toString('latin1');
const esc = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const re = new RegExp(needle.split(' ').map(esc).join('(?: |\\x1b\\[1C)+'));
const m = re.exec(s);
if (!m) { console.log('NOT FOUND: ' + needle); process.exit(0); }
const B = +back;
const win = s.slice(m.index - B, m.index);
const idx = []; let i = -1;
while ((i = win.indexOf('\xe2\x9d\xaf', i + 1)) >= 0) idx.push(i);
console.log(`==== ${file.slice(0, 8)} "${needle}" render @${m.index}; composer draws in the ${B} B before: ${idx.length}`);
for (const p of idx.slice(-n)) {
  const t = Buffer.from(win.slice(p, p + 240), 'latin1').toString('utf8').replace(/\x1b\[1C/g, ' ')
    .replace(/\x1b\[([0-9;]*)m/g, (a, c) => '{' + (c || 0) + '}').replace(/\x1b/g, '^[').replace(/[\r\n]/g, '|');
  console.log(`  (${p - B}) ${t}`);
}
