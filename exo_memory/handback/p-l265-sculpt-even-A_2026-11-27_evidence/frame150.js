// frame150.js: the held rim's section offset on the base at stations on the lead, the turn and the exit (why E5's lambda read 7.3838 at s 150)
const path = require('path'), T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), SC = require(path.join(T, 'src/core/sculpt.js')), TB = require(path.join(T, 'src/core/turnby.js')), G = require(path.join(T, 'src/geom/index.js')), ZG = require(path.join(T, 'app/core/zonegrab.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js')), { extendOptions } = require(path.join(T, 'app/core/panel.js'));
(async () => {
  let b = D.createDoc('even');
  for (const p of [{ length: 200, turn: 0 }, { length: 60, turn: 30 }, { length: 60, turn: 30 }, { length: 60, turn: 30 }, { length: 60, turn: 30 }, { length: 150, turn: 0 }]) b = TB.extendCorner(b, extendOptions({ length: p.length, turn: p.turn, climb: 0, bank: 0, width: 12, turnAs: 'corner' }));
  const sh = await createCoreShell({}); sh.commitDoc(b); const rs = sh.getState().resolved, pth = G.buildPath(rs.segments, { step: 1, closed: false, ...(rs.start ? { start: rs.start } : {}) });
  console.log('pieces cup/edge:', b.pieces.map((P) => JSON.stringify({ cup: P.cup, edge: P.edge, c: P.channels.c ? P.channels.c.slice(0, 3) : null, e: P.channels.e ? P.channels.e.slice(0, 2) : null })).join(' | '));
  for (const s of [100, 150, 180, 190, 199, 201, 210, 320, 430, 450, 490]) { const f = ZG.frameAt(pth, rs.segments, s, -1); console.log(s, 'w', f.w.toFixed(4), 'oF', f.oF.map((x) => x.toFixed(4)).join(','), 'oP', f.oP.map((x) => x.toFixed(4)).join(','), 'cos', f.cos.toFixed(4), 'sin', f.sin.toFixed(4), 'section u', f.section.u[0].toFixed(3), f.section.u[f.section.u.length - 1].toFixed(3)); }
})();
