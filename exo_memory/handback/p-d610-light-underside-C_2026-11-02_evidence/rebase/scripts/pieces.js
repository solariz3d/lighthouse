// pieces.js <tree> <doc> [sFrom]: the export (TEX=1 textured) with a copy of the tree's lighthull.js that logs, for every light piece ending after sFrom, its cells'
// s range, its rows and the rows its mesh reaches (by its vertices' uv row), and the cells dropped into it
'use strict';
const fs = require('fs'), path = require('path'), Module = require('module'), T = path.resolve(process.argv[2]) + '/', SFROM = Number(process.argv[4] || 0);
const LH = require.resolve(T + 'src/export/lighthull.js');
let src = fs.readFileSync(LH, 'utf8');
const a = '    if (!lm) continue;';
if (src.split(a).length !== 2) throw new Error('anchor');
src = src.replace(a, a + `
    if (st[st.length - 1].cell.s1 > ${SFROM}) { const P = lm.mesh.positions; const lastRow = rows[rows.length - 1].P, firstRow = rows[0].P;
      const d = (p, row) => Math.min(...row.map((x) => Math.hypot(x[0] - p[0], x[1] - p[1], x[2] - p[2])));
      let toLast = Infinity, toFirst = Infinity; for (let i = 0; i < P.length; i += 3) { const p = [P[i], P[i + 1], P[i + 2]]; toLast = Math.min(toLast, d(p, lastRow)); toFirst = Math.min(toFirst, d(p, firstRow)); }
      console.log('PIECE cells', st.length, 's', st[0].cell.s0.toFixed(1), '..', st[st.length - 1].cell.s1.toFixed(1), 'rows', rows.length, 'mesh verts', P.length / 3, 'nearest to first row', toFirst.toFixed(3), 'to last row', toLast.toFixed(3), 'jumps', jump.filter(Boolean).length, 'cols', cur.length, 'of', rows[0].P.length); }`);
const m = new Module(LH, null); m.filename = LH; m.paths = Module._nodeModulePaths(path.dirname(LH)); m._compile(src, LH); m.loaded = true; require.cache[LH] = m;
const D = require(T + 'src/core/document.js'), AD = require(T + 'src/core/adapter.js'), FW = require(T + 'src/export/fromwords.js'), { startLayout } = require(T + 'app/core/coreshell.js');
const doc = D.parse(fs.readFileSync(process.argv[3], 'utf8')), segs = AD.toSegments(doc), lift = (q) => AD.offsetPath(doc, segs, q);
const start = { pos: doc.start.pos.slice(), theta: doc.start.heading, p: doc.start.pitch };
const textures = process.env.TEX ? require(T + 'app/core/textures.js').createCoreTextures({ segments: () => segs, closed: () => !!doc.closed, edge: true }).current() : undefined;
const ex = FW.buildFromSegments(segs, { name: 'x', via: 'test', liftPath: lift, start }, { markers: startLayout(segs, lift, start, { open: !doc.closed }), test: true, textures, mergeMeshes: false });
console.log('path end', ex.path.lengthM, 'last samples', ex.path.samples.slice(-4).map((q) => q.s.toFixed(1)).join('/'));
