// probe2.js <tree>: sculpt-tools' curvedNoStraight lap and core-startline-creep's 300+200 lap and core-spawndrag row 5's 30+300 lap: is any step refused?
'use strict';
const path = require('path'), T = process.argv[2];
const { createCoreShell } = require(path.join(T, 'app/core/coreshell.js'));
const R = 180, Q = Math.PI * R / 2;
const V = {
  curvedNoStraight: [[{ length: 300, family: 'bowl', targets: { kh: 1 / 600 } }], { length: 200, transition: 40, targets: { kh: 1 / 600 } }],
  startline: [[{ length: 300, family: 'bowl' }, { length: 200, family: 'bowl' }], { length: 60, transition: 40, targets: { kh: 0 } }],
  spawndrag5: [[{ length: 30, family: 'bowl' }, { length: 300 }], { length: 60, transition: 40, targets: { kh: 0 } }],
};
(async () => {
  for (const [name, [firsts, last]] of Object.entries(V)) {
    const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }), msgs = [];
    for (const f of firsts) { s.extend(f); msgs.push(s.getState().message); }
    for (let i = 0; i < 4; i++) { s.extend({ length: Q, transition: 40, targets: { kh: 1 / R } }); msgs.push(s.getState().message); }
    s.extend(last); msgs.push(s.getState().message);
    console.log(name, 'refused', msgs.filter((m) => m && /PASS_CLEARANCE/.test(m)).length);
  }
  process.exit(0);
})();
