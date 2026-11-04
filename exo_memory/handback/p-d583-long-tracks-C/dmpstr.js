// dmpstr.js <dmp> [regex]: ASCII and UTF-16LE strings of 8+ chars from a minidump, filtered by regex, counted. Read-only.
'use strict';
const fs = require('fs');
const [, , F, RX = 'heap|Mark-Compact|Scavenge|oom|allocation|limit|ptype|process-type|type=|Error|btoa|invoke|export|stage'] = process.argv;
const b = fs.readFileSync(F), re = new RegExp(RX, 'i'), seen = new Map();
const add = (s) => { if (re.test(s)) seen.set(s, (seen.get(s) || 0) + 1); };
let cur = '';
for (let i = 0; i < b.length; i++) { const c = b[i]; if (c >= 32 && c < 127) cur += String.fromCharCode(c); else { if (cur.length >= 8) add(cur); cur = ''; } }
cur = '';
for (let i = 0; i + 1 < b.length; i += 2) { const c = b[i] | (b[i + 1] << 8); if (c >= 32 && c < 127) cur += String.fromCharCode(c); else { if (cur.length >= 8) add(cur); cur = ''; } }
for (const [s, n] of [...seen].sort((a, z) => z[1] - a[1]).slice(0, 80)) console.log(String(n).padStart(4), s.slice(0, 240));
