const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d188-wt/test/core_cup.test.js'; let s = fs.readFileSync(f, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) throw new Error('anchor: ' + a.slice(0, 70)); s = s.replace(a, () => b); };
rep("function rampCheck(d, segments, pi) {", "function rampCheck(d, segments, pi, slopeFactor = 1) {   // slopeFactor 1.5: inside a chord segment the mesh's smoothstep weight peaks at 1.5x the segment's mean slope");
rep("stepOver = Math.max(stepOver, d - (slope * (r.s - p.s) + 0.05));", "stepOver = Math.max(stepOver, d - (slopeFactor * slope * (r.s - p.s) + 0.05));");
rep("  const segs = A.toSegments(d), got = rampCheck(d, segs, 1);", "  const segs = A.toSegments(d), got = rampCheck(d, segs, 1, 1.5);");
fs.writeFileSync(f, s); console.log('patched');
