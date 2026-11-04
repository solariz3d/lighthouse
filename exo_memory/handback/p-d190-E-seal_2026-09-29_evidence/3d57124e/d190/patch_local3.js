const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d188-wt/test/core_cup.test.js'; let lines = fs.readFileSync(f, 'utf8').split('\n');
const idx = (pre) => { const i = lines.findIndex((l) => l.startsWith(pre)); if (i < 0) throw new Error('no line: ' + pre); return i; };
lines[idx("test('the cupLocal option keeps segment.profile LOCAL")] = "test('the cupLocal option keeps segment.profile LOCAL (its edge is c at the end of the segment within 0.05 deg), and the default does NOT (its profile is the widest of the run, the target of the blend): the readers evaluate the blend (test/core_cup_readers.test.js)', () => {";
// R1: B's cases (a piece as long as its transition: the ramp is a pure smoothstep) within 0.05 deg; the same ramps with a held tail (the fit rings, and 150 clamps) within 0.1 deg
let i = lines.findIndex((l) => l.startsWith("for (const [family, target, trans, len] of [['bowl', 90, 40, 200]"));
if (i < 0) throw new Error('R1 loop'); let e = i; while (!lines[e].startsWith('}')) e++;
lines.splice(i, e - i + 1,
"for (const [family, target, trans] of [['bowl', 90, 40], ['bowl', 150, 40], ['half-pipe', 150, 40], ['bowl', 90, 100], ['half-pipe', 150, 100]]) for (const tail of [0, 160]) {",
"  test(`R1 (B score): a ${family} cup ramp to ${target} deg over ${trans} m${tail ? ' with a held tail' : ''} lands on c(s) at EVERY row: the edge is within ${tail ? 0.1 : 0.05} deg of c (it was off by up to 0.95 deg on the local scheme)`, () => {`,",
"    let d = extend(D.createDoc('r'), { length: 60, family }); d = extend(d, { length: trans + tail, transition: trans, targets: { c: target } });",
"    const got = rampCheck(d, A.toSegments(d), 1), tol = tail ? 0.1 : 0.05;",
"    assert.ok(got.worstOff <= tol, `the edge is off c(s) by ${got.worstOff} deg at its worst row (the tip by about ${(got.worstOff * Math.PI / 180 * 15.5 * 1000).toFixed(1)} mm)`);",
"    assert.equal(got.seams, 0, `${got.seams} seam zips inside the cup piece`);",
"    if (!tail && trans === 100 && !(family === 'bowl' && target === 150)) assert.ok(got.step <= 1.0, `steps between rows ${got.step} deg (the literal bound on a 100 m ramp)`);",
"  });",
"}");
fs.writeFileSync(f, lines.join('\n')); console.log('patched');
