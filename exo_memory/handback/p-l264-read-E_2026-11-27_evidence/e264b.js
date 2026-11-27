// e264b.js (pane E, L264 read): two callers e264.js could not reach: a JUMP from B's brushed head (its take-off laid by extend, then the landing), and FINISH
// (finish.js finishToStart: Turn by, a straight and a roll, all laid by extend with no width typed) from the cut test's lap left open and brushed at its head.
// One tree. usage: node e264b.js <tree>
'use strict';
const path = require('path'), crypto = require('crypto');
const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const TB = require(path.join(T, 'src/core/turnby.js')), J = require(path.join(T, 'src/core/jump.js')), F = require(path.join(T, 'src/core/finish.js'));
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const h = (x) => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex').slice(0, 12);
const noW = (P) => { if (!P.channels) return P; const { w, ...channels } = P.channels; return { ...P, channels }; };
const doc = (s) => s.getState().history.present;
const plain = () => extend(extend(D.createDoc('e264'), { length: 120, first: { w: 19.1 }, targets: { kh: 0 } }), { length: 300, transition: 60, targets: { kh: 1 / 400, phi: 8 * Math.PI / 180 } });
async function brushed(d0, d = 5, r = 20, delta = 1.37) { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(d0); const L = doc(s).pieces.reduce((a, P) => a + (P.length || 0), 0); s.beginBrush({ mode: 'rate', channel: 'w', s0: L - d, r }); s.brushTo(delta); s.endBrush(); return doc(s); }
const wOf = (P) => (P.type === 'road' ? { start: +D.channelValue(P, 'w', 0).toFixed(4), end: D.pieceEnd(P).w } : { type: P.type });
(async () => {
  // a jump: take-off of 50 m with nothing typed, the landing 40 m on, 100 m long
  { const d0 = await brushed(plain()); let out;
    try { const d1 = J.jumpHere(d0, { length: 50 }, { landing: { forward: 40 }, landingM: 100 }); const add = d1.pieces.slice(d0.pieces.length);
      out = { added: add.map((P) => P.type), widths: add.map(wOf), joint: D.jointProblem(D.pieceEnd(d0.pieces.at(-1)), add[0], D.kindOf(d0.pieces.at(-1))), allNoW: h(add.map(noW)), placedSame: h(d1.pieces.slice(0, d0.pieces.length)) === h(d0.pieces) };
    } catch (e) { out = { refused: `${e.code || e.name}: ${String(e.message).slice(0, 140)}` }; }
    console.log(JSON.stringify({ case: 'jump from the brushed head (take-off 50 m as shown, landing 100 m)', head: D.endState(d0).w, ...out })); }
  // finish from the open lap brushed at its head
  { const R = 180, Q = (Math.PI * R) / 2; let d = TB.extendCorner(D.createDoc('lap'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = TB.extendCorner(d, { length: Q, transition: 40, targets: { kh: 1 / R } });
    d = TB.extendCorner(d, { length: 60, transition: 40, targets: { kh: 0 } });
    for (const [label, d0] of [['unbrushed', d], ['brushed at its head', await brushed(d)]]) {
      let out; try { const r = F.finishToStart(d0), d1 = r.doc, add = d1.pieces.slice(d0.pieces.length);
        out = { closed: !!d1.closed, added: add.length, widths: add.map(wOf), startW: +D.channelValue(d1.pieces[0], 'w', 0).toFixed(4), allNoW: h(add.map(noW)), all: h(d1.pieces), placedSame: h(d1.pieces.slice(0, d0.pieces.length)) === h(d0.pieces), note: String(r.note || r.report || '').slice(0, 120) };
      } catch (e) { out = { refused: `${e.code || e.name}: ${String(e.message).slice(0, 140)}` }; }
      console.log(JSON.stringify({ case: `finish from the open lap, ${label}`, head: D.endState(d0).w, ...out }));
    }
  }
})().catch((e) => { console.error('e264b failed:', e); process.exit(1); });
