const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d188-wt/test/core_cup_seam.test.js'; let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const i = s.indexOf("test('R3 (c): validation reds a lap seam"), j = s.indexOf("test('R3 (c): a legacy"); if (i < 0 || j < 0) throw new Error('anchors');
s = s.slice(0, i) + `test('R3 (c): validation reds a lap seam whose curve steps more than 1 mm (drawn with the local scheme, which has no reverse morph: the panel would otherwise read "0 red · lap proved" over the cliff), and does not red the same lap drawn by default', () => {
  const rg = closed(lap('half-pipe', 24, 90).d); assert.equal(rg.converged, true);
  const bad = A.toPath(rg.doc, { cupRuns: false }), res = V.validate(bad.path, bad.segments, { designSpeed: 100 });
  const red = res.red.filter((x) => x.reason === 'joint-step'); assert.ok(red.length > 0, \`no joint-step red: \${JSON.stringify(res.red.map((x) => x.reason))}\`);
  assert.ok(red.some((x) => x.s === 0), 'the red is at the lap seam (s = 0)');
  const ok = A.toPath(rg.doc), res2 = V.validate(ok.path, ok.segments, { designSpeed: 100 });
  assert.ok(!res2.red.some((x) => x.reason === 'joint-step'), 'a matched seam is not red');
});
test('R3 (c): the panel has words for the joint-step red (labels reasonText)', () => {
  const L = require('../app/validate-ui/labels.js'); assert.ok(!/no description yet/.test(L.reasonText('joint-step', { seamP90Deg: 5 })), 'reasonText has no line for joint-step');
});
` + s.slice(j);
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s);
