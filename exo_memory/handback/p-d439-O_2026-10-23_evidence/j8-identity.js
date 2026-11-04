'use strict';
// D439 (d) (O): is cupHome's joint slope rule (J8) still the identity its comment claims? Each lap is finished twice by the tree, as it is and with the rule
// removed (d438-mutants.js J8's edit, applied to finish.js and restored, also on exit), and the two closed laps are compared: the largest difference of any cup
// control point, and whether the serialized documents are byte-equal. Under the heavy-run lock.   node j8-identity.js <tree>
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const TREE = path.resolve(process.argv[2]), FILE = path.join(TREE, 'src/core/finish.js');
require(path.join(__dirname, '..', '..', '..', 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'd439 J8 identity (finish.js mutated: do not read this tree meanwhile)', tree: TREE });
const FROM = 'B[0] = A[na - 1]; B[1] = B[0] + (hB / hA) * (A[na - 1] - A[na - 2]); } });\n  return D.checkDoc({ ...laid,', TO = '} });\n  return D.checkDoc({ ...laid,';
const src = fs.readFileSync(FILE, 'utf8'); process.on('exit', () => fs.writeFileSync(FILE, src));
const run = `const path = require('path'), fs = require('fs'), T = ${JSON.stringify(TREE)}, D = require(path.join(T, 'src/core/document.js')), F = require(path.join(T, 'src/core/finish.js'));
const { extend } = require(path.join(T, 'src/core/extend.js')), { extendTurnBy } = require(path.join(T, 'src/core/turnby.js'));
const b = (t, tail, roll, cup) => { let d = D.createDoc('x'); d = extend(d, { length: 1000, family: 'bowl', first: { c: 10 } }); d = extendTurnBy(d, { length: 1500, targets: { kv: 0 } }, t * Math.PI / 180); return extend(d, { length: tail, targets: { c: cup, phi: roll * Math.PI / 180 } }); };
const laps = { tt10: () => D.parse(fs.readFileSync(path.join(T, 'fixtures-d431/testtrack10-open.t180track'), 'utf8')), test10: () => D.parse(fs.readFileSync(path.join(T, 'fixtures-d431/test10-open.t180track'), 'utf8')),
  row5: () => b(180, 300, 40, 35), row6: () => b(150, 300, 54, 35), row7: () => b(180, 300, 40, 120), p700r54: () => b(180, 700, 54, 35), p1200r10: () => b(180, 1200, 10, 35) };
const out = {}; for (const [k, f] of Object.entries(laps)) { const r = F.finishToStart(f()); out[k] = { text: D.serialize(r.doc), c: r.doc.pieces.map((P) => (P.cup ? P.channels.c : [])) }; }
process.stdout.write(JSON.stringify(out));`;
const once = () => JSON.parse(spawnSync(process.execPath, ['-e', run], { encoding: 'utf8', maxBuffer: 1 << 28 }).stdout);
const as = once();
const norm = src.replace(/\r\n/g, '\n'); if (norm.split(FROM).length !== 2) { console.log('NOT APPLIED: the rule was not found'); process.exit(2); }
fs.writeFileSync(FILE, norm.replace(FROM, TO)); const without = once(); fs.writeFileSync(FILE, src);
for (const k of Object.keys(as)) {
  let worst = 0; as[k].c.forEach((cs, p) => cs.forEach((v, i) => { worst = Math.max(worst, Math.abs(v - without[k].c[p][i])); }));
  console.log(`${k.padEnd(9)} largest cup control-point difference with the rule removed: ${worst.toExponential(2)}°; documents byte-equal: ${as[k].text === without[k].text}`);
}
