// ed.js: edit(file, [[old, new], ...]) over the LF form of a CRLF working file, written back as CRLF
const fs = require('fs');
module.exports = (file, pairs) => {
  const raw = fs.readFileSync(file, 'utf8'), crlf = raw.includes('\r\n'); let s = raw.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { if (!s.includes(a)) throw new Error(file + ': missing ' + a.slice(0, 80)); s = s.split(a).join(b); }
  fs.writeFileSync(file, crlf ? s.replace(/\n/g, '\r\n') : s);
};
