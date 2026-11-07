// lapprobe.js <tree>: the four-quarter-turn laps the tests build through the shell (straight, 4 x Q at R 180, 60 m, Close), each variant: is any step refused?
'use strict';
const path = require('path'), T = process.argv[2];
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const R = 180, Q = Math.PI * R / 2;
const V = {
  'bowl 600 (export-isolated)': { length: 600, family: 'bowl' },
  'bowl 300 (share-install, preview-speed)': { length: 300, family: 'bowl' },
  'tube w31 t360 300 (core_segcache, sculpt-frame tube360)': { length: 300, first: { w: 31, t: 360 } },
  'tube w31 t280 300 (sculpt-frame tube280)': { length: 300, first: { w: 31, t: 280 } },
};
(async () => {
  for (const [name, first] of Object.entries(V)) {
    const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }), msgs = [];
    s.extend(first); msgs.push(s.getState().message);
    for (let i = 0; i < 4; i++) { s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); msgs.push(s.getState().message); }
    s.extend({ length: 60, transition: 40, targets: { kh: 0 } }); msgs.push(s.getState().message);
    const refused = msgs.filter((m) => m && /PASS_CLEARANCE/.test(m));
    s.close();
    console.log(name, '| refused steps', refused.length, '| closed', !!s.getState().history.present.closed, refused.length ? '| ' + refused[0].slice(0, 120) : '');
  }
  process.exit(0);
})();
