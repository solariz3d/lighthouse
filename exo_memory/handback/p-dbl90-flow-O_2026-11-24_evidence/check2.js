// check.js: the builder's checker on each saved attempt: red and amber inside the shape (measured d). usage: node check.js <tree> <out dir>
require('os').setPriority(process.pid, require('os').constants.priority.PRIORITY_BELOW_NORMAL);
const path = require('path'), [tree, dir] = process.argv.slice(2), R = (p) => require(path.join(tree, p));
const D = R('src/core/document.js'), A = R('src/core/adapter.js'), V = R('src/validate/index.js'), LEAD = 300;
for (const a of require(path.resolve(dir, 'docs.json'))) {
  const doc = a.doc;   // the saved object as it is (check2: no text round-trip)
  const { segments, path: P } = A.toPath(doc, { step: 0.5 }), v = V.validate(P, segments, {});
  const pick = (list) => (list || []).filter((x) => x.s1 >= LEAD - 4 && x.s0 <= LEAD + 384).map((x) => `${x.reason} ${Math.round(340 + x.s0 - LEAD)}..${Math.round(340 + x.s1 - LEAD)} worst ${+x.worst.toFixed(3)}`);
  console.log(`${a.name}: red [${pick(v.red).join('; ')}] amber [${pick(v.amber).join('; ')}]`);
}
