// lapsteps.js <tree>: build export-isolated's pit lap step by step and print each step's message and piece count
'use strict';
const path = require('path'), T = process.argv[2];
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const D = require(path.join(T, 'src/core/document.js'));
(async () => {
  const R = 180, Q = Math.PI * R / 2;
  const s = await createCoreShell({ brushFn: null, autosaveMs: 0 });
  const say = (w) => { const st = s.getState(); console.log(w, 'segs', st.resolved.segments.length, 'closed', !!st.history.present.closed, 'msg', JSON.stringify(st.message)); };
  s.extend({ length: 600, family: 'bowl' }); say('straight');
  for (let i = 0; i < 4; i++) { s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); say('turn' + i); }
  s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); say('60');
  s.close(); say('close');
  s.setPitLane({ ...D.PIT_DEFAULT, side: 'R', leave: { word: 'p1', along: 60 }, rejoin: { word: 'p1', along: 540 } }); say('pit');
  console.log(JSON.stringify(s.getState().resolved.segments.map(g => [g.kind || g.type, +(g.length || 0).toFixed(2)])));
  process.exit(0);
})();
