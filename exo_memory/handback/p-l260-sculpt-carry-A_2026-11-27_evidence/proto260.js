// proto260.js: D's case remade on L. usage (in a builder tree): node proto260.js
'use strict';
const path = require('path'), T = process.cwd();
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const D = require(path.join(T, 'src/core/document.js')), HD = require(path.join(T, 'app/core/handles.js'));
const DEG = Math.PI / 180;
(async () => {
  for (const [a, b, by] of [[-340, -392, -10], [340, 392, 10], [0, 350, 20], [0, -350, -20]]) {
    const s = await createCoreShell({ autosaveMs: 0 });
    s.extend({ length: 100, family: 'bowl' }); if (a) s.extend({ length: 600, targets: { phi: a * DEG } }); else s.extend({ length: 300 }); s.extend({ length: 150, targets: { phi: b * DEG } });
    s.setSculpt(true); s.selectPiece(2); const b0 = s.sculptInfo().values.phi;
    const steps = []; s.beginSculpt({ channel: 'phi' }); for (let k = 1; k <= 20; k++) { s.sculptTo((by * k / 20) * DEG); steps.push(+s.sculptInfo().values.phi.toFixed(2)); } s.endSculpt();
    console.log(`piece ${a} -> ${b}: middle ${b0.toFixed(3)}, by ${by}: ${s.sculptInfo().values.phi.toFixed(3)}, label "${HD.format('bank', s.sculptInfo().values.phi)}", msg ${s.getState().message}; steps ${steps.join(' ')}`);
  }
  for (const by of [370, 300, -370]) { const s = await createCoreShell({ autosaveMs: 0 }); s.extend({ length: 300, family: 'bowl' }); s.beginBrush({ mode: 'rate', channel: 'phi', s0: 150, r: 100 }); s.brushTo(by * DEG); s.endBrush(); console.log(`brush by ${by}: centre ${(D.channelAt(s.getState().history.present.pieces[0], 'phi', 150).v / DEG).toFixed(3)}`); }
})().catch((e) => { console.error(e); process.exit(1); });
