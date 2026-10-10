const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d188-wt/src/validate/index.js'; let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const a = "  'jump-gap-not-forward': 'ARCHITECTURE.md:72"; if (s.split(a).length !== 2) throw new Error('anchor');
s = s.replace(a, () => "  'joint-step': 'FINDINGS.md:110 (a step in the road mesh is a gap: the D190 round-3 ruling (c) reds a lap seam or a cup joint that steps more than 1 mm)',\n" + a);
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s);
