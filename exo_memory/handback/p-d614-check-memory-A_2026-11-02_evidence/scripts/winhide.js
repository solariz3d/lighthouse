// winhide.js (O, 2026-11-02, the chair 05:02: an acs check flashed a cmd window on the keeper's screen): required first by every scratch script that starts a
// process. Every child_process call gets windowsHide: true unless it says otherwise, so no child ever opens a console window or takes focus.
'use strict';
const cp = require('child_process');
if (!cp.__winhide) {
  const isOpts = (x) => x && typeof x === 'object' && !Array.isArray(x);
  for (const f of ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync', 'fork']) {
    const orig = cp[f];
    cp[f] = function (...a) {
      const cb = typeof a[a.length - 1] === 'function' ? a.pop() : null;
      if (isOpts(a[a.length - 1]) && a.length > 1) a[a.length - 1] = { windowsHide: true, ...a[a.length - 1] };
      else a.push({ windowsHide: true });
      if (cb) a.push(cb);
      return orig.apply(this, a);
    };
  }
  Object.defineProperty(cp, '__winhide', { value: true });
}
