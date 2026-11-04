const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d188-wt/test/core_cup.test.js'; let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
function rep(a, b) { if (s.split(a).length !== 2) throw new Error('anchor ' + a.slice(0, 80)); s = s.replace(a, () => b); }
rep("//   1b  along a ramp the wall follows c on the ROAD (the mesh's own rows): within c's range over ±2 m, steps ≤ 1°, no seam zip inside a piece",
    "//   1b  along a ramp the wall follows c on the ROAD (the mesh's own rows): the rows land on c(s) (0.05°) and never change faster than c itself, no seam zip inside a piece\n//       (D190 round 3, N1: the seal's literal \"≤ 1° between rows\" is RETIRED: on a steep ramp it is c's own change over one 0.5 m path sample, 1.0087° on half-pipe 15.5 → 150 over 100 m)");
rep("test(`row 1b: a ${family} cup ramp to 90° over 100 m has steps of at most 1.0° between rows (the seal's literal bound, where the path's 0.5 m spacing allows it)`, () => {",
    "test(`row 1b: a ${family} cup ramp to 90° over 100 m never changes faster than c between rows, and no row is outside c's range`, () => {");
rep("assert.ok(got.step <= 1.0 && got.outside === 0, `${JSON.stringify(opts)}: step ${got.step}°, outside ${got.outside}`);",
    "assert.ok(got.stepOver <= 0 && got.outside === 0, `${JSON.stringify(opts)}: over c's slope by ${got.stepOver}° (largest step ${got.step}°), outside ${got.outside}`);");
rep("    if (!tail && trans === 100 && !(family === 'bowl' && target === 150)) assert.ok(got.step <= 1.0, `steps between rows ${got.step} deg (the literal bound on a 100 m ramp)`);\n",
    "    assert.ok(got.stepOver <= 0, `the wall changes faster than c by ${got.stepOver} deg between rows (the largest step ${got.step} deg)`);   // the standard: never faster than c itself\n");
rep("assert.ok(got.step > 1.0 && got.stepOver > 1.0 && got.seams > 0,", "assert.ok(got.stepOver > 1.0 && got.seams > 0,");
if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s); console.log('ok');
