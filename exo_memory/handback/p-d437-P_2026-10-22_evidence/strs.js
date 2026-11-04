// strs.js (D437, P): every printable string of a minidump that matches a pattern, with its byte offset. read-only.   node strs.js <dmp> <regex>
const fs = require('fs'); const b = fs.readFileSync(process.argv[2]); const re = new RegExp(process.argv[3], 'i'); let st = -1;
for (let i = 0; i <= b.length; i++) { const c = i < b.length ? b[i] : 0; const ok = c >= 32 && c < 127; if (ok && st < 0) st = i; if (!ok && st >= 0) { if (i - st >= 6) { const s = b.toString('latin1', st, i); if (re.test(s)) console.log('@' + st, s.slice(0, 400)); } st = -1; } }
