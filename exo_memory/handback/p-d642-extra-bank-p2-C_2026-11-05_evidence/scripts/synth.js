// synth.js <repo>: a 1,000 m second piece whose bank rises 0 -> 88.45 straight through its end (a linear ramp of its control points, as his save's p2 nearly is): does
// laying any next piece change the placed track, so the preview refuses the ghost?
'use strict';
const path = require('path'), R = process.argv[2], req = (p) => require(path.join(R, p));
const { createCoreShell } = req('app/core/coreshell.js'), D = req('src/core/document.js'), TM = req('app/preview/trackmodel.js');
(async () => {
  for (const endRate of [0, 1]) {
    const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s.extend({ length: 1000, family: 'bowl' }); s.extend({ length: 1000, targets: {} });
    const doc = s.getState().history.present, P = doc.pieces[1], n = P.channels.phi.length, PHI = 88.45 * Math.PI / 180;
    // endRate 1: the control points rise evenly to the last (still rolling at the end); 0: the last two held (at rest, as an eased ramp ends)
    const phi = Array.from({ length: n }, (_, i) => (i < 2 ? 0 : PHI * Math.min(1, endRate ? (i - 1) / (n - 2) : (i - 1) / (n - 4))));   // the first two held: the joint meets with slope 0
    const json = D.serialize({ ...doc, pieces: [doc.pieces[0], { ...P, channels: { ...P.channels, phi } }] });
    const s2 = await createCoreShell({ storage: { openDoc: async () => json, listDocs: async () => ['eq-x'] }, brushFn: null, autosaveMs: 0 }); await s2.open('x');
    const st = s2.getState(), tm = TM.createTrackModel(); tm.update({ segments: st.resolved.segments, closed: false, start: st.resolved.start });
    let r; try { tm.ghostFor(s2.candidate({ length: 100, targets: {} })); r = 'ghost OK'; } catch (e) { r = `ghost REFUSED: ${e.message}`; }
    const P2 = st.history.present.pieces[1], rate = (D.channelAt(P2, 'phi', P2.length).v - D.channelAt(P2, 'phi', P2.length - 2).v) / 2;
    console.log(`end ${endRate ? 'still rolling' : 'at rest'} (rate ${rate.toExponential(2)} rad/m): ${r}`);
  }
})().catch((e) => { console.log('ERR', e.stack || e); process.exit(1); });
