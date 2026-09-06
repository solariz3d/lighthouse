#!/usr/bin/env node
// Stop hook — the READY half of the ready stamp. The turn ended; say so.
//
// The whole contract, and why it is not another screen heuristic, is in lib/ready.js. This file is
// deliberately ten lines: the two hooks differ by ONE boolean, and two copies of the writing logic
// would drift apart, which is the thing maintenance law #2 is about.
if (process.env.CONSONANCE_DREAM) process.exit(0);
const path = require('path');
const os = require('os');
// CONSONANCE_DATA first — the same seam every other hook uses, so dream-gate.test.js's synthetic
// payloads land in its scratch dir instead of the real ~/.claude/shell.
const SHELL_DIR = process.env.CONSONANCE_DATA || path.join(os.homedir(), '.claude', 'shell');

try {
  const ready = require(path.join(SHELL_DIR, 'lib', 'ready.js'));
  ready.stamp(true, ready.payload());
} catch (e) {
  // never block session teardown
}
process.stdout.write('{}');
