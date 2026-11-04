'use strict';
const T = process.argv[2]; const D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js');
const tryX = (name, d, o) => { try { const r = extend(d, o); const P = r.pieces[r.pieces.length - 1]; console.log(name, '-> accepted; e pts', P.channels.e.map((v) => +v.toFixed(3)).join(' ')); return r; } catch (e) { console.log(name, '-> REFUSED', e.code, e.message.slice(0, 120)); return null; } };
const base = extend(D.createDoc('t'), { length: 100 });
for (const o of [{ length: 120, targets: { e: -20 } }, { length: 120, transition: 60, targets: { e: -20 } }, { length: 40, transition: 20, targets: { e: -20 } }]) {
  const d = extend(base, o); const E = D.pieceEnd(d.pieces[1]).e; console.log('head laid by', JSON.stringify(o), 'ends e', E.v, 'slope', E.m);
  tryX('  then e 0 over 100', d, { length: 100, targets: { e: 0 } });
  const c = extend(d, { length: 50 }); const E2 = D.pieceEnd(c.pieces[2]).e; console.log('  a continuing piece (no target) ends e', E2.v, 'slope', E2.m, 'pts', c.pieces[2].channels.e.map((v) => +v.toFixed(4)).join(' '));
  tryX('  then e 0 over 100', c, { length: 100, targets: { e: 0 } });
}
// the hand-built tail (a file): e -10 falling at -0.5 deg/m at its end
let d = extend(base, { length: 120, targets: { e: -10 } }); const j = JSON.parse(JSON.stringify(d)), P = j.pieces[1], n = P.channels.e.length, h = P.length - P.knots[P.knots.length - 1];
P.channels.e[n - 2] = +(-10 + (0.5 * h) / 3).toFixed(6); P.channels.er[n - 2] = P.channels.e[n - 2]; d = D.checkDoc(j); console.log('hand-built tail ends', D.pieceEnd(d.pieces[1]).e);
tryX('  file tail, then e 0', d, { length: 100, targets: { e: 0 } }); tryX('  file tail, then e -5', d, { length: 100, targets: { e: -5 } }); tryX('  file tail, then e -20', d, { length: 100, targets: { e: -20 } }); tryX('  file tail, then no target', d, { length: 100 });
// and the POSITIVE mirror: e +10 rising at +0.5 at the cap? a legacy bowl's cap is 134.5; e 134 rising
d = extend(base, { length: 120, targets: { e: 134 } }); const j2 = JSON.parse(JSON.stringify(d)), P2 = j2.pieces[1]; P2.channels.e[n - 2] = +(134 - (0.5 * h) / 3).toFixed(6); P2.channels.er[n - 2] = P2.channels.e[n - 2]; d = D.checkDoc(j2); console.log('rising tail at 134 ends', D.pieceEnd(d.pieces[1]).e);
tryX('  rising tail near cap, then e 134.5', d, { length: 100, targets: { e: 134.5 } }); tryX('  rising tail near cap, then e 100', d, { length: 100, targets: { e: 100 } }); tryX('  rising tail near cap, then no target', d, { length: 100 });
