'use strict';
const path = require('path'), crypto = require('crypto'); const T = path.resolve(process.argv[2]);
const D = require(path.join(T, 'src/core/document.js')), { extend } = require(path.join(T, 'src/core/extend.js'));
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const run = (steps) => steps.reduce((d, a) => extend(d, a), D.createDoc('t'));
const GOLDEN_CASES = [
  [{ length: 100, family: 'bowl' }, { length: 100, targets: { w: 12 } }],
  [{ length: 100, family: 'half-pipe', first: { w: 24 } }, { length: 60, transition: 20, targets: { w: 12, phi: 0.3 } }],
  [{ length: 120 }, { length: 80, transition: 40, targets: { kh: 0.005, kv: 0.01 } }, { length: 50, targets: { phi: 0.2 } }],
  [{ length: 100, first: { c: 60 } }, { length: 40, transition: 20, targets: { c: 150 } }, { length: 100, transition: 100, targets: { c: 0 } }],
  [{ length: 45, family: 'flat', first: { w: 20 } }, { length: 45, transition: 45, targets: { w: 8, r: 2 } }],
  [{ length: 100, family: 'bowl' }, { length: 100, transition: undefined, targets: { w: 20 }, knotM: 10 }],
];
console.log(GOLDEN_CASES.map((c) => sha(D.serialize(run(c)))).join(' '));
