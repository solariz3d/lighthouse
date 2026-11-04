// resolve3.js <worktree> <file> <rule>: resolve every conflict block in <file> by a named rule, EOL kept, and print each block's resolution head.
//   theirs-then-ours : theirs' lines, then ours' (a CHANGELOG where theirs adds entries at the end of a section ours continues past)
//   ours-then-theirs : ours' lines, then theirs'
//   map-15-apron     : MAP.md's export line: theirs' line with ours' "including every gate level across within 15°" put into markers.js's parenthesis
'use strict';
const fs = require('fs'), path = require('path');
const [, , wt, file, rule] = process.argv;
const p = path.join(wt, file), s = fs.readFileSync(p, 'utf8'), EOL = s.includes('\r\n') ? '\r\n' : '\n';
const re = /<<<<<<< [^\r\n]*\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> [^\r\n]*\r?\n/g;
let n = 0;
const out = s.replace(re, (m, ours, theirs) => {
  n++;
  if (rule === 'theirs-then-ours') return theirs + (theirs.endsWith(EOL + EOL) ? '' : EOL) + ours;
  if (rule === 'ours-then-theirs') return ours + (ours.endsWith(EOL + EOL) ? '' : EOL) + theirs;
  if (rule === 'map-15-apron') {
    const from = '`markers.js` (`checkMarkers`)', to = '`markers.js` (`checkMarkers`, including every gate level across within 15°)';
    if (!theirs.includes(from) || !ours.includes(to)) throw new Error('MAP shapes changed');
    return theirs.replace(from, to);
  }
  throw new Error('unknown rule ' + rule);
});
if (!n) throw new Error('no conflict blocks in ' + file);
fs.writeFileSync(p, out); console.log(`${file}: ${n} block(s) by ${rule}`);
