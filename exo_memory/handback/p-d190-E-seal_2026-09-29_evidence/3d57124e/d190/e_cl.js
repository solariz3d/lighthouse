const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d188-wt/CHANGELOG.md'; let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const a = "stands the left wall vertical). Tracks made before this open and render exactly as they did: a cup is only there when you set one."; if (s.split(a).length !== 2) throw new Error('anchor');
s = s.replace(a, () => a + "\n  Closing a lap whose cup meets an uncupped start holds the cup at the start's edge and fades it into the start's shape over the last 10 m,\n  or refuses by name if it cannot; the validation panel reds any cup joint or lap seam that steps more than 1 mm.");
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s);
