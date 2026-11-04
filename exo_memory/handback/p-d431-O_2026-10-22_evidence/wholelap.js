'use strict';
// D431 (O): the WHOLE-LAP close (no window) must be unchanged by D431. For several open laps, close(doc, { edited }) on one tree: a sha256 of the closed document's
// bytes (D.serialize). Run on the base and the fix and compare the lines.   node wholelap.js <tree>
const TREE = process.argv[2], fs = require('fs'), path = require('path'), crypto = require('crypto');
const D = require(`${TREE}/src/core/document.js`), C = require(`${TREE}/src/core/close.js`), { extend } = require(`${TREE}/src/core/extend.js`);
const R = 180, Q = (Math.PI * R) / 2;
const lap = (last) => { let d = extend(D.createDoc('w'), { length: 300, family: 'bowl' }); for (let i = 0; i < 4; i++) d = extend(d, { length: Q, transition: 40, targets: { kh: 1 / R } }); return extend(d, { length: last, transition: Math.min(40, last), targets: { kh: 0 } }); };
const U10 = JSON.parse(fs.readFileSync(path.join(__dirname, 'test10', 'eq-TEST 10.t180undo'), 'utf8'));
const F1 = D.parse(fs.readFileSync(path.join(TREE, 'test', 'fixtures', 'F1-bowl-default-lap-closed.core2.json'), 'utf8'));
const cases = [['far lap 200, edited last', lap(200), undefined], ['far lap 30, edited first', lap(30), [0]], ['F1 opened', D.checkDoc({ ...F1, closed: false }), undefined], ['TEST 10 past[21], edited last 3', D.parse(U10.past[21]), [17, 18, 19]]];
for (const [name, doc, edited] of cases) {
  try { const r = C.close(doc, edited ? { edited } : {}); console.log(JSON.stringify({ case: name, converged: r.converged, sha256: crypto.createHash('sha256').update(D.serialize(r.doc)).digest('hex').slice(0, 16) })); }
  catch (e) { console.log(JSON.stringify({ case: name, refused: e.code })); }
}
