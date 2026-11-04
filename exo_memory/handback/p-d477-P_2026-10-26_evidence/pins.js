'use strict';
// D477: the digests to pin (a4bfe52's output): bankLapWith over the close()-closed public laps, and closejob's own press (runCloseBest) on the open ones that converge.
// T=<tree> node pins.js
const os = require('os'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), crypto = require('crypto');
const T = process.env.T || 'C:/Users/nname/Downloads/t180-wt-e473', r = (f) => require(path.join(T, f));
const D = r('src/core/document.js'), { extend } = r('src/core/extend.js'), { extendTurnBy } = r('src/core/turnby.js'), { close } = r('src/core/close.js');
const CJ = r('app/core/closejob.js'), F = r('src/core/finish.js');
const DEG = Math.PI / 180, R = 180, Q = (Math.PI * R) / 2, QQ = (300 * Math.PI) / 2;
const sha = (d) => crypto.createHash('sha256').update(D.serialize(d)).digest('hex');
function flatOpen() {
  let d = extend(D.createDoc('flat closer'), { length: 300, family: 'bowl' });
  for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } });
  return extend(d, { length: 60, transition: 40, targets: { kh: 0 } });
}
function loopOpen() {
  let d = extend(D.createDoc('looped'), { length: 100, family: 'bowl' }); d = extendTurnBy(d, { length: QQ }, 90 * DEG); d = extend(d, { length: 100 });
  d = extendTurnBy(d, { length: 700, climbDeg: 360 }, 30 * DEG); d = extend(d, { length: 100 }); d = extendTurnBy(d, { length: QQ }, 60 * DEG); d = extend(d, { length: 200 });
  d = extendTurnBy(d, { length: QQ }, 90 * DEG); d = extend(d, { length: 100 }); return extendTurnBy(d, { length: QQ }, 90 * DEG);
}
function t10Open(loopM, loopDeg) {
  let d = extend(D.createDoc('t10 shape'), { length: 200, family: 'bowl' });
  d = extend(d, { length: 100, transition: 40, targets: { phi: 30 * DEG } });
  d = extend(d, { length: QQ, transition: 40, targets: { kh: 1 / 300 } });
  d = extend(d, { length: 100, transition: 40, targets: { phi: 0, kh: 0 } });
  d = extendTurnBy(d, { length: loopM, climbDeg: 360 }, loopDeg * DEG);
  d = extend(d, { length: 100 }); d = extendTurnBy(d, { length: QQ }, (140 - loopDeg) * DEG); d = extend(d, { length: 200 });
  d = extendTurnBy(d, { length: QQ }, 90 * DEG); d = extend(d, { length: 100 }); return extendTurnBy(d, { length: QQ }, 90 * DEG);
}
const LAPS = { flat: flatOpen, loop: loopOpen, t10a: () => t10Open(600, 40), t10b: () => t10Open(700, 25) };
for (const [name, mk] of Object.entries(LAPS)) {
  const open = mk(), c = close(open, { edited: [open.pieces.length - 1] }); if (!c.converged) throw new Error(c.report);
  const t0 = Date.now(), b = F.bankLapWith(c.doc);
  console.log(`${name}: lap ${sha(c.doc)}  bankLapWith ${sha(b.doc)}  (${Date.now() - t0} ms)`);
  if (process.env.BEST) { const t1 = Date.now(), best = CJ.runCloseBest({ doc: open }); console.log(`  runCloseBest ${Date.now() - t1} ms converged ${best.converged} ${best.converged ? sha(best.doc) : (best.report || '').slice(0, 160)}`); }
}
