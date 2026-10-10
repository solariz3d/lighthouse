const fs = require('fs'), f = 'C:/Users/nname/Desktop/a-d195-wt/test/core_chord.test.js'; let s = fs.readFileSync(f, 'utf8');
function rep(a, b) { if (s.split(a).length !== 2) throw new Error('anchor: ' + a.slice(0, 70)); s = s.replace(a, () => b); }
rep("  assert.ok(!res.red.some((x) => x.reason === 'joint-step'), 'a chord is not a joint step'); assert.ok(res.red.every((x) => x.reason !== 'steep-without-raycast'));",
    "  assert.ok(!res.red.some((x) => x.reason === 'joint-step'), 'a chord is not a joint step'); assert.ok(res.red.every((x) => x.reason !== 'steep-without-raycast'));\n  const js = PF.jointSteps(segments, false); assert.ok(js.length > 0 && js.every((x) => x.m <= 1e-3), `the chord joints are inspected (${js.length}) and none steps more than 1 mm`);");
fs.writeFileSync(f, s);
