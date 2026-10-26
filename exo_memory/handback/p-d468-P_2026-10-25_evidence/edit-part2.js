'use strict';
const fs = require('fs'); const W = 'C:/Users/nname/Downloads/t180-wt-p468/';
function edit(file, oldS, newS) { const p = W + file; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n'; oldS = oldS.split('\n').join(EOL); newS = newS.split('\n').join(EOL); const n = s.split(oldS).length - 1; if (n !== 1) throw new Error(`${file}: anchor ${n}`); fs.writeFileSync(p, s.replace(oldS, newS)); console.log('edited', file); }
const step = process.argv[2];
if (step === 'row') edit('test/core_xsec.test.js',
`test('EXTEND: the transition map takes e, s and t like the others, and the at-start \`first\` carries them on an empty track', () => {`,
`// D468 part 2 (P's D466 §4): the clamp on the fit's ringing (D406) also moved the joint's own two control points, the head's value and slope continued, when the
// head's edge was still sloping at a limit of its asked range: a file whose edge ends at −10° still falling at 0.5 °/m could not be extended to 0 (or at all), the
// clamp lifted P₁ to −10, and appendPiece refused with the document's raw JOINT error. The generator never lays such a tail (every ramp ends flat), a file or a cut can.
test("EXTEND: the clamp on the ringing leaves the joint's own two points alone (D468): a tail still falling at −10° extends to 0 C1 with it, and one still rising at the cap is refused by name (BAD_EDGE), never with the document's JOINT error", () => {
  const tail = (e0, slope) => {   // a hand-built file: the edge laid to e0 over 120 m, then its second-last control point moved so the end slope is \`slope\` °/m
    const d = extend(extend(start(), { length: 100 }), { length: 120, targets: { e: e0 } }), j = JSON.parse(JSON.stringify(d)), P = j.pieces[j.pieces.length - 1], n = P.channels.e.length, h = P.length - P.knots[P.knots.length - 1];
    P.channels.e[n - 2] = +(e0 - (slope * h) / 3).toFixed(6); P.channels.er[n - 2] = P.channels.e[n - 2]; return D.checkDoc(j);
  };
  const fall = tail(-10, -0.5); assert.ok(Math.abs(D.pieceEnd(last(fall)).e.m + 0.5) < 1e-6, 'control: the tail falls at 0.5 °/m');
  for (const o of [{ length: 100, targets: { e: 0 } }, { length: 100, targets: { e: -5 } }, { length: 100 }]) {
    const d = extend(fall, o), P = last(d), h = P.knots[0];
    assert.ok(Math.abs(P.channels.e[0] + 10) < 1e-9 && Math.abs(P.channels.e[1] - (-10 - (0.5 * h) / 3)) < 1e-5, \`\${JSON.stringify(o)}: the piece continues the tail's value and slope (e₀ \${P.channels.e[0]}, e₁ \${P.channels.e[1]})\`);
    assert.ok(P.channels.e.slice(2).every((v) => v >= -10 - 1e-9 && v <= 0 + 1e-9), \`\${JSON.stringify(o)}: the fitted points stay in the asked range [−10, 0]: \${Math.min(...P.channels.e.slice(2))} to \${Math.max(...P.channels.e.slice(2))}\`);
    assert.doesNotThrow(() => D.checkDoc(d));
  }
  assert.ok(Math.abs(last(extend(fall, { length: 100, targets: { e: -20 } })).channels.e[1] - (-10 - (0.5 * 20) / 3)) < 1e-5, 'control: a target below the tail continued it before too');
  const rise = tail(134, 0.5);   // a bowl's cap for e is 150 − 15.5 = 134.5: the tail's own slope carries past it in the first span, which only a refusal by name can say
  throwsCode(() => extend(rise, { length: 100, targets: { e: 134.5 } }), 'BAD_EDGE', /past/); throwsCode(() => extend(rise, { length: 100 }), 'BAD_EDGE', /past/);
});
test('EXTEND: the transition map takes e, s and t like the others, and the at-start \`first\` carries them on an empty track', () => {`);
if (step === 'src') {
  edit('src/core/extend.js',
`      C[ch] = C[ch].map((x, i) => Math.min(hi(i), Math.max(Math.max(lo, floor(i)), x)));`,
`      // D468 (P's D466 §4): the joint's own two points, the head's value and slope continued, are the head's and not the fit's: a tail still sloping at a limit
      // took P₁ past lo or hi, the clamp moved it, and the piece was refused with the document's raw JOINT error. They are left to checkDoc, which refuses a point
      // past the cap or under the floor BY NAME (a tail still rising at the cap cannot be continued inside it: BAD_EDGE, as it should be)
      C[ch] = C[ch].map((x, i) => (held && i < 2 ? x : Math.min(hi(i), Math.max(Math.max(lo, floor(i)), x))));`);
  edit('test/core_xsec_mutation.test.js',
`edits: [[C + 'extend.js', 'C[ch] = C[ch].map((x, i) => Math.min(hi(i), Math.max(Math.max(lo, floor(i)), x)));', 'C[ch] = C[ch];']] },`,
`edits: [[C + 'extend.js', 'C[ch] = C[ch].map((x, i) => (held && i < 2 ? x : Math.min(hi(i), Math.max(Math.max(lo, floor(i)), x))));', 'C[ch] = C[ch];']] },   // D468: the line gained the joint's exemption; the mutant still removes the whole clamp
  { id: 'KE2-8 the clamp moves the joint\'s own two points too (the D406 form)', file: 'core', pattern: 'ringing', edits: [[C + 'extend.js', 'C[ch] = C[ch].map((x, i) => (held && i < 2 ? x : Math.min(hi(i), Math.max(Math.max(lo, floor(i)), x))));', 'C[ch] = C[ch].map((x, i) => Math.min(hi(i), Math.max(Math.max(lo, floor(i)), x)));']] },`);
}
