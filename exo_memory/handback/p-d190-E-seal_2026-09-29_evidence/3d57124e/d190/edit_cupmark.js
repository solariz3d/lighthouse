const fs = require('fs'), WT = 'C:/Users/nname/Desktop/a-d188-wt';
function edit(file, pairs) {
  let s = fs.readFileSync(WT + '/' + file, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(file + ': anchor not unique/found: ' + a.slice(0, 90)); s = s.replace(a, () => b); }
  if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(WT + '/' + file, s); console.log('edited', file, crlf ? '(CRLF)' : '(LF)');
}
edit('src/geom/profile.js', [[
  "module.exports = { normalize, psiAt, offsetAt, normalAt, samplesAcross, maxPsi, spanOf, blend, blendSamples, usOf, smoothstep, atSegment };",
  "/**\n * The cross-section a READER of a segment (not the mesh) takes at distance d into it: the blend evaluated for a CUP segment (`seg.cup`), the\n * segment's own profile for every other. A word document's font-transition blends have always been ignored by the readers (they judge the\n * target font for the whole word); D190 does not change that, so the paused piece builder's validation, layout and export read as before.\n */\nfunction readAt(seg, d) { return seg.cup ? atSegment(seg, d) : normalize(seg.profile); }\n\nmodule.exports = { normalize, psiAt, offsetAt, normalAt, samplesAcross, maxPsi, spanOf, blend, blendSamples, usOf, smoothstep, atSegment, readAt };"]]);
edit('src/markers/layout.js', [[
  "const floorOf = (x) => Math.min(floorHalf(Prof.atSegment(x, 0)), floorHalf(Prof.atSegment(x, x.length / 2)), floorHalf(Prof.atSegment(x, x.length)));\n      const hw = Math.min(floorOf(g), prev ? floorHalf(Prof.atSegment(prev, prev.length)) : Infinity);",
  "const floorOf = (x) => Math.min(floorHalf(Prof.readAt(x, 0)), floorHalf(Prof.readAt(x, x.length / 2)), floorHalf(Prof.readAt(x, x.length)));\n      const hw = Math.min(floorOf(g), prev ? floorHalf(Prof.readAt(prev, prev.length)) : Infinity);"]]);
edit('src/validate/index.js', [[
  "const constAt = (p) => { const g = segments[p.seg]; return g.blend ? constOf(P.atSegment(g, p.s - segS0[p.seg])) : segConst(p.seg); };",
  "const constAt = (p) => { const g = segments[p.seg]; return g.cup && g.blend ? constOf(P.atSegment(g, p.s - segS0[p.seg])) : segConst(p.seg); };   // only a cup's blend: a word's font transition is judged at its target, as before"]]);
edit('src/export/fromwords.js', [[
  "const P = Prof.atSegment(g, sm.s - segS0[sm.seg]), r = P.u[0]", "const P = Prof.readAt(g, sm.s - segS0[sm.seg]), r = P.u[0]"]]);
edit('app/core/coreshell.js', [[
  "return (m) => { const g = segments[m.seg]; return g.blend ? Prof.atSegment(g, m.s - starts[m.seg]) : g.profile; };", "return (m) => { const g = segments[m.seg]; return g.cup && g.blend ? Prof.atSegment(g, m.s - starts[m.seg]) : g.profile; };"]]);
edit('app/preview/preview.js', [[
  "const { normalize, spanOf, atSegment } = require('../../src/geom/profile.js');", "const { normalize, spanOf, readAt } = require('../../src/geom/profile.js');"],
  ["return spanOf(atSegment(segments[i], segments[i].length));", "return spanOf(readAt(segments[i], segments[i].length));"]]);
edit('src/core/adapter.js', [[
  "blend: cup ? cup[j].blend : null, speed: null });", "blend: cup ? cup[j].blend : null, speed: null, ...(cup ? { cup: true } : {}) });"]]);
