const T = process.argv[2] + '/';
const D = require(T + 'src/core/document.js'), { extend } = require(T + 'src/core/extend.js'), A = require(T + 'src/core/adapter.js');
const { buildMesh } = require(T + 'src/geom/mesh.js');
let d = extend(D.createDoc('x'), { length: 60, family: 'bowl' });
d = extend(d, { length: 200, transition: 40, targets: { c: 90 } });
const { segments, path } = A.toPath(d), mesh = buildMesh(path, segments);
const startS = []; let acc = 0; segments.forEach((g) => { startS.push(acc); acc += g.length; });
for (const c of mesh.cells.filter((c) => c.seam)) {
  const g = c.piece, sg = segments[g], pg = segments[g - 1];
  console.log('seam at piece', g, 's', startS[g].toFixed(1), 'id', pg && pg.id, '->', sg.id, '| blend prev', pg && pg.blend ? JSON.stringify({ s0: +pg.blend.s0.toFixed(4), length: +pg.blend.length.toFixed(4) }) : null, '| blend this', sg.blend ? JSON.stringify({ s0: +sg.blend.s0.toFixed(4), length: +sg.blend.length.toFixed(4) }) : null);
}
// c(s) at the cup piece's ends
const P = d.pieces[1]; console.log('c ctrl', P.channels.c.map((x) => +x.toFixed(3)).join(' '));
console.log('n cup segments with blend', segments.filter((g) => g.id === 'p2' && g.blend).length, 'without', segments.filter((g) => g.id === 'p2' && !g.blend).length);
