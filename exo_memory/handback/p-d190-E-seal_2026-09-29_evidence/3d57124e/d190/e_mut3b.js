const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d188-wt/test/core_cup_mutation.test.js'; let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const i = s.indexOf("  { id: 'M43 (R3)"), j = s.indexOf("  { id: 'M44 (R3)"); if (i < 0 || j < 0) throw new Error('anchors');
s = s.slice(0, i) + "  { id: 'M43 (R3) the reverse morph carries no difference (the legacy shape is dropped)', file: 'seam', pattern: 'R3', edits: [[C + 'adapter.js', 'u: cw.u.map((x, i) => x + m * du[i]), psi: cw.psi.map((x, i) => x + m * dpsi[i])', 'u: cw.u, psi: cw.psi']] },\n" + s.slice(j);
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s);
