const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d195-wt/test/core_cup_mutation.test.js'; let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
function rep(a, b) { if (s.split(a).length !== 2) throw new Error('anchor: ' + a.slice(0, 80)); s = s.replace(a, () => b); }
rep("'const profile = cup ? cup[j].profile : profileAt(P.family, mid.w, mid.r);', 'const profile = profileAt(P.family, mid.w, mid.r);'", "'profile = cup ? cup[j].profile : L.profile;', 'profile = profileAt(P.family, mid.w, mid.r);'");
rep("'blend: cup ? cup[j].blend : null', 'blend: null'", "'blend: cup ? cup[j].blend : L.blend', 'blend: null'");
rep("'return g.cup && g.blend ? constOf(P.atSegment(g, p.s - segS0[p.seg])) : segConst(p.seg); };'", "'return P.readsBlend(g) && g.blend ? constOf(P.atSegment(g, p.s - segS0[p.seg])) : segConst(p.seg); };'");
rep("'return (m) => { const g = segments[m.seg]; return g.cup && g.blend ? Prof.atSegment(g, m.s - starts[m.seg]) : g.profile; };'", "'return (m) => { const g = segments[m.seg]; return Prof.readsBlend(g) && g.blend ? Prof.atSegment(g, m.s - starts[m.seg]) : g.profile; };'");
rep("'return seg.cup ? atSegment(seg, d) : normalize(seg.profile);', 'return atSegment(seg, d);'", "'return readsBlend(seg) ? atSegment(seg, d) : normalize(seg.profile);', 'return atSegment(seg, d);'");
rep("'...(cup ? { cup: true } : {})', ''", "'...(cup ? { cup: true } : L.chord ? { chord: true } : {})', '...(cup ? {} : L.chord ? { chord: true } : {})'");
rep("': profileAt(P.family, mid.w, mid.r);   // a legacy piece', ': cupProfile(P.family, mid.w, mid.c);   // a legacy piece'", "'cup[j].profile : L.profile;   // a legacy piece', 'cup[j].profile : cupProfile(P.family, mid.w, mid.c);   // a legacy piece'");
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s); console.log('ok');
