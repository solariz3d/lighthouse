const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d195-wt/src/core/adapter.js'; let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const a = "//   toSegments(doc, { segM = 2, designKmh, cupRuns = true }) -> src/geom segments (each carries its profile, and a cup's a blend)\n"; if (s.split(a).length !== 2) throw new Error('anchor');
s = s.replace(a, () => "//   toSegments(doc, { segM = 2, designKmh, cupRuns = true }) -> src/geom segments (each carries its profile; a cup's, and a legacy segment whose\n//                                               width or r changes (D196, a CHORD, `chord: true`), also a blend: see legacySeg)\n");
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s);
