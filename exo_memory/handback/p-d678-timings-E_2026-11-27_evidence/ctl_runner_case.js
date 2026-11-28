// ctl_runner_case.js (pane E, D678 N3): one control case of runner678.js's round check, with the boundary stubbed: quiet678.js's lock folder (DATA) is a
// scratch folder holding a made-up heavy-run.hold, his game is "none", and the trees are scratch folders whose app/test/drag-frame.test.js is a fake that
// sleeps and passes. holdage678.js is the real one and reads the scratch hold. No real test runs.
// usage: node ctl_runner_case.js <scratch data dir> <out dir> <N> <label>=<tree> ...
'use strict';
const path = require('path'), Module = require('module');
const [dataDir, out, N, ...pairs] = process.argv.slice(2);
const qp = require.resolve('./quiet678.js'), m = new Module(qp);
m.filename = qp; m.loaded = true;
m.exports = { DATA: dataDir, games: () => ({ ok: true, games: [] }), snapshot: () => ({ busyPct: 0, stub: true }), locks: () => ({}), sleepSync: (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms) };
require.cache[qp] = m;
require('fs').mkdirSync(out, { recursive: true });
process.argv = [process.argv[0], path.join(__dirname, 'runner678.js'), 'df', out, N, ...pairs];
require('./runner678.js');
