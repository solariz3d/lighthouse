const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d188-wt/test/core_cup_mutation.test.js'; let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const a = "  { id: 'M48 (R3)"; if (s.split(a).length !== 2) throw new Error('anchor');
s = s.replace(a, () => "  { id: 'M50 (R3) a cup followed by a legacy piece inside the track is not faded (only the lap seam is)', file: 'seam', pattern: 'R3', edits: [[C + 'adapter.js', 'nextP && nextP.type === \'road\' && !nextP.cup ? legacyFirst(nextP) : seam', 'false ? 0 : seam']] },\n" + a);
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s);
