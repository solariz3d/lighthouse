const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d188-wt/src/core/adapter.js'; let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const a = "    const tail = seam && pi === lastRoad && P.cup ? legacyFirst(doc.pieces[firstRoad]) : null;   // the lap's end is a cup that meets the legacy START\n";
if (s.split(a).length !== 2) throw new Error('anchor');
s = s.replace(a, () => "    // a cup piece followed by a LEGACY road piece (a file can hold one; Extend never makes one) fades into that piece's first profile, and so does the\n    // lap's last cup piece into the legacy START: the last metres of the cup are the reverse morph (tailZone)\n    const nextP = doc.pieces[pi + 1];\n    const tail = !P.cup || !cupRuns ? null : nextP && nextP.type === 'road' && !nextP.cup ? legacyFirst(nextP) : seam && pi === lastRoad ? legacyFirst(doc.pieces[firstRoad]) : null;\n");
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s);
