'use strict';
// D477: the TEST 10-shaped lap for the rows: the loop's stored kh under 1/600 (not `curved`), its would-be bank over ROLL_FREE; the shell pressed twice; closejob's press timed.
const os = require('os'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), crypto = require('crypto');
const T = process.env.T || 'C:/Users/nname/Downloads/t180-wt-p477', r = (f) => require(path.join(T, f));
const D = r('src/core/document.js'), { extend } = r('src/core/extend.js'), { extendTurnBy } = r('src/core/turnby.js'), { close } = r('src/core/close.js');
const { createCoreShell } = r('app/core/coreshell.js'), CJ = r('app/core/closejob.js'), F = r('src/core/finish.js');
const DEG = Math.PI / 180, QQ = (300 * Math.PI) / 2, V = 460 / 3.6, G = 9.81;
const sha = (d) => crypto.createHash('sha256').update(D.serialize(d)).digest('hex');
const [loopM, loopDeg] = [Number(process.argv[2] || 700), Number(process.argv[3] || 25)];
function t10Open() {
  let d = extend(D.createDoc('t10 shape'), { length: 200, family: 'bowl' });
  d = extend(d, { length: 100, transition: 40, targets: { phi: 30 * DEG } });
  d = extend(d, { length: QQ, transition: 40, targets: { kh: 1 / 300 } });
  d = extend(d, { length: 100, transition: 40, targets: { phi: 0, kh: 0 } });
  d = extendTurnBy(d, { length: loopM, climbDeg: 360 }, loopDeg * DEG);
  d = extend(d, { length: 100 }); d = extendTurnBy(d, { length: QQ }, (140 - loopDeg) * DEG); d = extend(d, { length: 200 });
  d = extendTurnBy(d, { length: QQ }, 90 * DEG); d = extend(d, { length: 100 }); d = extendTurnBy(d, { length: QQ }, 90 * DEG);
  return d;
}
(async () => {
  const open = t10Open(), c = close(open, { edited: [open.pieces.length - 1] }); if (!c.converged) throw new Error(c.report);
  const lap = c.doc, loop = lap.pieces[4], kmax = Math.max(...loop.channels.kh.map(Math.abs));
  console.log(`loop ${loop.id}: ${loopDeg}° over ${loopM} m, stored max|kh| ${kmax.toExponential(3)} (1/600 = ${(1 / 600).toExponential(3)}): ${kmax < 1 / 600 ? 'UNDER, not curved' : 'OVER, curved'}; share bank at that kh ${(0.75 * Math.atan((V * V * kmax) / G) / DEG).toFixed(1)}° (V ${(V * 3.6).toFixed(0)} km/h assumed)`);
  const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s.adopt(lap);
  let t0 = Date.now(); await s.bankLap(); console.log(`press 1 (${Date.now() - t0} ms): ${s.getState().message}`);
  const once = s.getState().history.present, depth = s.getState().history.past.length;
  t0 = Date.now(); await s.bankLap(); console.log(`press 2 (${Date.now() - t0} ms): ${s.getState().message}; depth ${depth} → ${s.getState().history.past.length}; same doc ${s.getState().history.present === once}`);
  console.log(`press-1 digest (bankLapWith over close()) ${sha(F.bankLapWith(lap).doc)}; lap digest ${sha(lap)}`);
  t0 = Date.now(); const best = CJ.runCloseBest({ doc: open }); console.log(`runCloseBest on the open lap: ${Date.now() - t0} ms, converged ${best.converged}, digest ${best.converged ? sha(best.doc) : '-'}; report: ${(best.report || '').slice(0, 240)}`);
})();
