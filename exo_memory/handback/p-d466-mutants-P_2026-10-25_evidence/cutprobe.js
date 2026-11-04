// cutprobe.js <tree>: can a user reach a LIVE edge tail (a piece whose e is still sloping at its end) through Finish and a cut, and is extend from it then refused with a raw JOINT?
'use strict';
const T = process.argv[2]; const D = require(T + '/src/core/document.js'), { extend } = require(T + '/src/core/extend.js'), F = require(T + '/src/core/finish.js'), PC = require(T + '/src/core/piece.js');
const TURN = 1 / 150;
function lap(eTarget) {
  let d = extend(D.createDoc('cut'), { length: 200 });
  d = extend(d, { length: 150, transition: 50, targets: { kh: TURN } }); d = extend(d, { length: 100, targets: { kh: 0 } });
  d = extend(d, { length: 200, targets: { e: eTarget, er: -eTarget } });
  d = extend(d, { length: 150, transition: 50, targets: { kh: TURN } }); d = extend(d, { length: 100, targets: { kh: 0 } });
  d = extend(d, { length: 120, targets: { e: 0, er: 0 } });
  return d;
}
let found = 0, tried = 0, refusedJoint = 0;
for (const eT of [-20, -29, 20, 60]) {
  let closed; try { closed = F.finishToStart(lap(eT)).doc; } catch (e) { console.log('finish refused', eT, e.code); continue; }
  const live = closed.pieces.map((P, k) => ({ k, id: P.id, e: D.pieceEnd(P).e, er: D.pieceEnd(P).er })).filter((x) => Math.abs(x.e.m) > 1e-9 || Math.abs(x.er.m) > 1e-9);
  console.log(`lap e ${eT}: closed with ${closed.pieces.length} pieces; pieces whose edge is live at the end:`, live.map((x) => `${x.id} e ${x.e.v.toFixed(3)}/${x.e.m.toFixed(4)} er ${x.er.v.toFixed(3)}/${x.er.m.toFixed(4)}`).join('; ') || 'none');
  for (const x of live) {
    // cut so that piece x is the open end: take out the piece after it
    const after = (x.k + 1) % closed.pieces.length; let cut; try { cut = PC.cutRun(closed, after, after).doc; } catch (e) { console.log('  cut refused at', after, e.code); continue; }
    const lastP = cut.pieces[cut.pieces.length - 1]; if (lastP.id !== x.id) { console.log('  cut left', lastP.id, 'last, not', x.id); continue; }
    found++;
    for (const o of [{ length: 100, targets: { e: 0, er: 0 } }, { length: 100 }, { length: 100, targets: { e: 10 } }, { length: 100, targets: { e: -30 } }]) {
      tried++; try { extend(cut, o); console.log(`  extend ${JSON.stringify(o)} from ${x.id}: accepted`); } catch (e) { if (e.code === 'JOINT') refusedJoint++; console.log(`  extend ${JSON.stringify(o)} from ${x.id}: REFUSED ${e.code}: ${e.message.slice(0, 110)}`); }
    }
  }
}
console.log(`live tails reached by cut: ${found}; extends tried ${tried}, refused JOINT ${refusedJoint}`);
