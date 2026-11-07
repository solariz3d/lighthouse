// refusallog.js: preloaded with NODE_OPTIONS=--require; wraps app/core/coreshell.js's createCoreShell so every shell method call that leaves a NEW
// PASS_CLEARANCE message appends one line to $REFUSAL_LOG: the test file, the method, and the first caller line inside a test file. Changes nothing else.
'use strict';
const Module = require('module'), fs = require('fs'), path = require('path');
const LOG = process.env.REFUSAL_LOG;
const load = Module._load;
Module._load = function (req, parent, isMain) {
  const m = load.apply(this, arguments);
  if (!LOG || !m || typeof m.createCoreShell !== 'function' || m.__refusalWrapped) return m;
  const make = m.createCoreShell;
  m.createCoreShell = async function (...a) {
    const s = await make.apply(this, a);
    for (const k of Object.keys(s)) {
      if (typeof s[k] !== 'function' || k === 'getState') continue;
      const f = s[k];
      s[k] = function (...b) {
        const before = s.getState().message, r = f.apply(this, b);
        const note = () => { const after = s.getState().message; if (after && after !== before && /^PASS_CLEARANCE/.test(after)) {
          const at = (new Error().stack.split('\n').find((l) => /[\\/]test[\\/][^\\/]+\.test\.js/.test(l) && !/refusallog/.test(l)) || '?').trim();
          fs.appendFileSync(LOG, `${k}\t${at}\t${after.slice(0, 110)}\n`);
        } };
        if (r && typeof r.then === 'function') r.then(note, () => {}); else note();
        return r;
      };
    }
    return s;
  };
  m.__refusalWrapped = true;
  return m;
};
