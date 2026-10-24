// strs.js <file> <regex>: UTF-16LE and ASCII strings in a binary that match the regex. Read-only.
const fs = require('fs'); const b = fs.readFileSync(process.argv[2]); const re = new RegExp(process.argv[3], 'i'); const out = new Set();
const u = b.toString('utf16le'); for (const m of u.matchAll(/[\x20-\x7e]{6,}/g)) if (re.test(m[0])) out.add('W ' + m[0]);
const u2 = b.subarray(1).toString('utf16le'); for (const m of u2.matchAll(/[\x20-\x7e]{6,}/g)) if (re.test(m[0])) out.add('W ' + m[0]);
const a = b.toString('latin1'); for (const m of a.matchAll(/[\x20-\x7e]{6,}/g)) if (re.test(m[0])) out.add('A ' + m[0]);
console.log([...out].slice(0, 60).join('\n'));
