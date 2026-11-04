// zlib-only PDF text extractor (no PDF tool installed): inflate each stream, keep the (...) string operands.
const fs = require('fs'), z = require('zlib');
const b = fs.readFileSync(process.argv[2]); const out = []; let i = 0;
while ((i = b.indexOf('stream', i)) >= 0) {
  let s = i + 6; if (b[s] === 13) s++; if (b[s] === 10) s++;
  const e = b.indexOf('endstream', s); if (e < 0) break;
  try {
    const t = z.inflateSync(b.slice(s, e)).toString('latin1');
    const m = t.match(/\((?:[^()\\]|\\.)*\)/g) || [];
    const txt = m.map((x) => x.slice(1, -1)).join('');
    if (txt.length > 20) out.push(txt);
  } catch (x) {}
  i = e + 9;
}
const all = out.join('\n'); fs.writeFileSync(process.argv[3], all); console.log(all.length);
for (const k of process.argv.slice(4)) { let j = -1, c = 0; while ((j = all.indexOf(k, j + 1)) >= 0 && c < 5) { console.log('--', k, ':', all.slice(Math.max(0, j - 250), j + 350).replace(/\s+/g, ' ')); c++; } }
