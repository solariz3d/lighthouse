// resolve4.js <worktree>: D582, the d577-e (E's sweep) merge: three conflicts, the FEATURE side's code with the SWEEP's comment wording. Each block is
// replaced by text written out here whole; the feature side's code tokens are checked to be kept (codeOf = the line with its trailing // comment cut).
'use strict';
const fs = require('fs'), path = require('path');
const wt = process.argv[2];
const re = /<<<<<<< [^\r\n]*\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> [^\r\n]*\r?\n/g;
const codeOf = (block) => block.split(/\r?\n/).map((l) => l.replace(/\s*\/\/.*$/, '').trimEnd()).filter(Boolean).join('\n');
const R = {
  'src/core/extend.js': [
    "  // a shaped width at start is laid as the cross-section's are, in three quarters of its ramp (8 subdivisions), so F's 20 m rise is 20 m as laid",
    "  const sub = shortRamps.some((ch) => C2_CHANNELS.has(ch) || (ch === 'w' && shapeOf(ch))) ? RAMP_KNOTS_C2 : RAMP_KNOTS;   // the short-ramp subdivisions, 8 when a cross-section channel ramps short",
    "  // extra knots only where a ramp is short; a piece with a bank, cup or edge target has at least three interior knots, so c2Ends has a free point at each end and one is left for the shape",
  ],
  'src/export/acready.js': [
    "const MERGE_CLASSES = Object.freeze([{ re: /^(1(?:ROAD|GRIP\\d{3})_APRON_)/ }, { re: /^(APRONSIDE_)/ }, { re: /^(1ROAD_CATCH_)/ }, { re: /^(1(?:ROAD|GRIP\\d{3})_)(?!PIT)/ }, { re: /^(UNDERSKIN_)/ }]);   // the edge apron (apron.js), its physics top under either surface prefix and its scenery side, are classes of their own, before the road's, so they never join a road chunk. The catch under the road (catch.js) is first of the rest: a class of its own, so it never renumbers the road's chunks   // group 1 is the chunk's name prefix (its surface key)",
  ],
  'src/export/fromwords.js': [
    "const { withApron, APRON_WIDTH_M } = require('./apron.js');   // the edge apron (src/export/apron.js)",
    "const { withCatch, catchCells, rangesOfAmber, CATCH_OFFSET_M } = require('./catch.js');   // a physical catch under the road (src/export/catch.js)",
  ],
};
for (const [f, lines] of Object.entries(R)) {
  const p = path.join(wt, f), s = fs.readFileSync(p, 'utf8'), EOL = s.includes('\r\n') ? '\r\n' : '\n'; let n = 0;
  const out = s.replace(re, (m, ours) => {
    n++;
    const mine = lines.join(EOL) + EOL;
    if (codeOf(mine) !== codeOf(ours)) throw new Error(`${f}: the resolution's code is not the feature side's\n${codeOf(mine)}\n---\n${codeOf(ours)}`);
    return mine;
  });
  if (n !== 1) throw new Error(`${f}: ${n} blocks`);
  fs.writeFileSync(p, out); console.log(`${f}: resolved, code = the feature side's`);
}
