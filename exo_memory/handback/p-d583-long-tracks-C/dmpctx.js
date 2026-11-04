// dmpctx.js <dmp> <needle> [span]: printable ASCII and UTF-16LE context around each occurrence of needle in a minidump. Read-only.
'use strict';
const fs = require('fs');
const [, , F, N, SPAN = '600'] = process.argv;
const b = fs.readFileSync(F), span = +SPAN;
const show = (buf, at, wide) => {
  let s = '';
  if (!wide) for (let i = Math.max(0, at - span); i < Math.min(buf.length, at + span); i++) { const c = buf[i]; s += c >= 32 && c < 127 ? String.fromCharCode(c) : '.'; }
  else for (let i = Math.max(0, at - span * 2); i + 1 < Math.min(buf.length, at + span * 2); i += 2) { const c = buf[i] | (buf[i + 1] << 8); s += c >= 32 && c < 127 ? String.fromCharCode(c) : '.'; }
  return s.replace(/\.{4,}/g, ' … ');
};
for (const [wide, needle] of [[false, Buffer.from(N, 'latin1')], [true, Buffer.from(N, 'utf16le')]]) {
  let at = -1, n = 0;
  while ((at = b.indexOf(needle, at + 1)) !== -1 && n < 6) { n++; console.log(`--- ${wide ? 'utf16' : 'ascii'} @${at}\n${show(b, at, wide)}\n`); }
}
