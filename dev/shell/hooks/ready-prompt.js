#!/usr/bin/env node
// UserPromptSubmit hook — the WORKING half of the ready stamp. A turn is beginning; say so.
//
// The whole contract is in lib/ready.js. Ten lines here on purpose: the two hooks differ by one
// boolean, and two copies of the writing logic would drift apart.
//
// This half is the one that closes the window. Without it a pane would stamp itself ready at the
// end of its first turn and never say otherwise, and the gate would deliver into every turn after
// that — a worse splice than the one the bound leaves open, arriving faster.
if (process.env.CONSONANCE_DREAM) process.exit(0);
const path = require('path');
const os = require('os');
// D098: its own seam, not CONSONANCE_DATA - under the leaked app env this require() looked for lib/ready.js
// in the data dir, failed into the catch below, and the pane silently stopped stamping. The stamp's
// LOCATION was never this variable: lib/ready.js writes to CONSONANCE_READY_DIR, which the app sets.
const SHELL_DIR = process.env.CONSONANCE_SHELL_DIR || path.join(os.homedir(), '.claude', 'shell');

try {
  const ready = require(path.join(SHELL_DIR, 'lib', 'ready.js'));
  ready.stamp(false, ready.payload());
} catch (e) {
  // never block a turn from starting
}
// UserPromptSubmit may inject context; this hook injects none.
process.stdout.write('{}');
