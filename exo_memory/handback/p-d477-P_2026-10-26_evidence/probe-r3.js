'use strict';
// D477 probe: press 1 byte-equal between a4bfe52 (OLD, E's tree) and d477-p (NEW); press 2 on NEW changes nothing; press 2 on OLD for the record.
// node probe.js [lap names...]   (laps: flat loop t10 test10 tt10)
const os = require('os'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const OLD = 'C:/Users/nname/Downloads/t180-wt-p477', NEW = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-372c8abc/fbf98f8e-29da-4fb2-8610-c038d6372249/scratchpad/d477/tree-r3';
const r = (T, f) => require(path.join(T, f));
const D = r(NEW, 'src/core/document.js'), { extend } = r(NEW, 'src/core/extend.js'), { extendTurnBy } = r(NEW, 'src/core/turnby.js'), { close } = r(NEW, 'src/core/close.js');
const DEG = Math.PI / 180, R = 180, Q = (Math.PI * R) / 2, QQ = (300 * Math.PI) / 2;
const sha = (d) => crypto.createHash('sha256').update(D.serialize(d)).digest('hex').slice(0, 16);
function flatLap() {
  let d = extend(D.createDoc('flat closer'), { length: 300, family: 'bowl' });
  for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } });
  d = extend(d, { length: 60, transition: 40, targets: { kh: 0 } });
  const c = close(d, { edited: [d.pieces.length - 1] }); if (!c.converged) throw new Error(c.report); return c.doc;
}
function loopLap() {
  let d = extend(D.createDoc('looped'), { length: 100, family: 'bowl' }); d = extendTurnBy(d, { length: QQ }, 90 * DEG); d = extend(d, { length: 100 });
  d = extendTurnBy(d, { length: 700, climbDeg: 360 }, 30 * DEG); d = extend(d, { length: 100 }); d = extendTurnBy(d, { length: QQ }, 60 * DEG); d = extend(d, { length: 200 });
  d = extendTurnBy(d, { length: QQ }, 90 * DEG); d = extend(d, { length: 100 }); d = extendTurnBy(d, { length: QQ }, 90 * DEG);
  const c = close(d, { edited: [d.pieces.length - 1] }); if (!c.converged) throw new Error(c.report); return c.doc;
}
/** TEST 10's shape in public words: his own 30° bank over 100 m into a corner he banked himself, a loop that turns (stored kh under 1/600) beside it, upright corners. */
function t10Lap(loopM = 600, loopDeg = 40) {
  let d = extend(D.createDoc('t10 shape'), { length: 200, family: 'bowl' });
  d = extend(d, { length: 100, transition: 40, targets: { phi: 30 * DEG } });
  d = extend(d, { length: QQ, transition: 40, targets: { kh: 1 / 300 } });
  d = extend(d, { length: 100, transition: 40, targets: { phi: 0, kh: 0 } });
  d = extendTurnBy(d, { length: loopM, climbDeg: 360 }, loopDeg * DEG);
  d = extend(d, { length: 100 }); d = extendTurnBy(d, { length: QQ }, (140 - loopDeg) * DEG); d = extend(d, { length: 200 });
  d = extendTurnBy(d, { length: QQ }, 90 * DEG); d = extend(d, { length: 100 }); d = extendTurnBy(d, { length: QQ }, 90 * DEG);
  const c = close(d, { edited: [d.pieces.length - 1] }); if (!c.converged) throw new Error(c.report); return c.doc;
}
function fixture(name) { return D.parse(fs.readFileSync(path.join(NEW, 'fixtures-d431', name), 'utf8')); }
const LAPS = { flat: flatLap, loop: loopLap, t10: () => t10Lap(), test10: () => fixture('test10-open.t180track'), tt10: () => fixture('testtrack10-open.t180track') };
const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(LAPS);
const phiDiff = (a, b) => a.pieces.map((P, i) => [P.id, Math.max(...P.channels.phi.map((x, j) => Math.abs(x - b.pieces[i].channels.phi[j]))) / DEG]).filter(([, m]) => m > 1e-9);
for (const name of want) {
  const t0 = Date.now(); let lap = LAPS[name]();
  let how = 'close()';
  if (!lap.closed) {   // the private fixtures are OPEN: closejob's own press closes them (the single press that must stay byte-equal)
    const CJ = r(NEW, 'app/core/closejob.js'), res = CJ.runCloseBest({ doc: lap }); if (!res.converged) throw new Error(`${name}: ${res.report}`);
    const CJo = r(OLD, 'app/core/closejob.js'), reso = CJo.runCloseBest({ doc: lap });
    console.log(`${name}: closejob's press OLD ${sha(reso.doc)} NEW ${sha(res.doc)} ${sha(reso.doc) === sha(res.doc) ? 'BYTE-EQUAL' : 'DIFFER ' + JSON.stringify(phiDiff(res.doc, reso.doc))} (${Date.now() - t0} ms)`);
    console.log(`  report NEW: ${res.report.slice(0, 300)}`);
    lap = res.doc; how = 'closejob';
  }
  const Fo = r(OLD, 'src/core/finish.js'), Fn = r(NEW, 'src/core/finish.js');
  const o1 = Fo.bankLapWith(lap), n1 = Fn.bankLapWith(lap);
  const maxkh = lap.pieces.filter((P) => P.type === 'road').map((P) => [P.id, Math.max(...P.channels.kh.map(Math.abs))]);
  console.log(`${name} (${how}, ${lap.pieces.length} pieces): press 1 OLD ${sha(o1.doc)} NEW ${sha(n1.doc)} ${sha(o1.doc) === sha(n1.doc) ? 'BYTE-EQUAL' : 'DIFFER ' + JSON.stringify(phiDiff(n1.doc, o1.doc))}; level ${JSON.stringify(n1.level)} (OLD ${JSON.stringify(o1.level)}); changed ${o1.doc === lap ? 'nothing' : phiDiff(o1.doc, lap).map(([id, m]) => `${id} ${m.toFixed(2)}°`).join(' ')}`);
  const o2 = Fo.bankLapWith(o1.doc), n2 = Fn.bankLapWith(n1.doc);
  console.log(`  press 2 OLD: ${o2.doc === o1.doc ? 'same doc' : 'CHANGED ' + phiDiff(o2.doc, o1.doc).map(([id, m]) => `${id} +${m.toFixed(3)}°`).join(' ')}; NEW: ${n2.doc === n1.doc ? 'same doc' : 'CHANGED ' + phiDiff(n2.doc, n1.doc).map(([id, m]) => `${id} +${m.toFixed(4)}°`).join(' ')}`);
  const n3 = Fn.bankLapWith(n2.doc); if (n3.doc !== n2.doc) console.log(`  press 3 NEW CHANGED ${JSON.stringify(phiDiff(n3.doc, n2.doc))}`);
  console.log(`  stored max|kh| ${maxkh.filter(([, k]) => k > 1e-4).map(([id, k]) => `${id} ${k.toExponential(2)}`).join(' ')}; ${Date.now() - t0} ms`);
}
