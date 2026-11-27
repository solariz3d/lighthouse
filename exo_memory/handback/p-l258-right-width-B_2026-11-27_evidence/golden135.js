// golden135.js (pane B, L258): core_extend.test.js's L135 7 golden hashes against this tree's extend, with and without each piece's in-memory wd.
// usage: node golden135.js <tree>
'use strict';
const path = require('path'), crypto = require('crypto'), T = process.argv[2];
const src = require('fs').readFileSync(path.join(T, 'test/core_extend.test.js'), 'utf8');
const sha = (d) => crypto.createHash('sha256').update(JSON.stringify(d)).digest('hex');
// the test file's own helpers and table, evaluated as the test does (its requires resolve against the test folder)
const Module = require('module'), m = new Module(path.join(T, 'test/core_extend.test.js'));
m.filename = path.join(T, 'test/core_extend.test.js'); m.paths = Module._nodeModulePaths(path.join(T, 'test'));
const stub = src.replace(/^test\(/gm, 'void (').replace(/require\('node:test'\)/, '(() => () => {})');
m._compile(stub + '\nmodule.exports = { GOLDEN_135 };', m.filename);
const strip = (d) => { const c = JSON.parse(JSON.stringify(d)); let wds = 0, nonzero = 0; for (const p of c.pieces || []) if (p.channels && 'wd' in p.channels) { wds++; if (JSON.stringify(p.channels.wd).match(/[1-9]/)) nonzero++; delete p.channels.wd; } return { c, wds, nonzero }; };
for (const [what, make, want] of m.exports.GOLDEN_135) {
  const d = make(), s = strip(d);
  console.log(`${what}: as is ${sha(d) === want ? 'SAME' : 'differs'}; wd stripped ${sha(s.c) === want ? 'SAME' : 'differs'} (pieces with wd ${s.wds}, any non-zero ${s.nonzero})`);
}
