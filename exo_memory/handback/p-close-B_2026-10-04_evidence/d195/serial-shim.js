// serial-shim.js (pane B, D195, after the 04:13 crash): preloaded into EVERY node process via NODE_OPTIONS=--require <this>.
// Rewrites any child-process argument --test-concurrency=<n> to --test-concurrency=1, so a mutation file that spawns
// `node --test --test-concurrency=4 ...` runs its test files one at a time. Tests are NOT edited. Each rewrite is logged
// (pid, original arg) to SERIAL_SHIM_LOG so the effect is checkable.
'use strict';
const cp = require('child_process'), fs = require('fs');
const LOG = process.env.SERIAL_SHIM_LOG;
const fix = (args) => {
  if (!Array.isArray(args)) return args;
  return args.map((a) => {
    if (typeof a === 'string' && /^--test-concurrency=\d+$/.test(a) && a !== '--test-concurrency=1') {
      if (LOG) try { fs.appendFileSync(LOG, `${new Date().toISOString()} pid ${process.pid} ${a} -> --test-concurrency=1\n`); } catch (e) { /* the log is evidence only */ }
      return '--test-concurrency=1';
    }
    return a;
  });
};
for (const k of ['spawnSync', 'spawn', 'execFileSync', 'execFile']) {
  const orig = cp[k];
  cp[k] = function (cmd, args, ...rest) { return orig.call(this, cmd, fix(args), ...rest); };
}
