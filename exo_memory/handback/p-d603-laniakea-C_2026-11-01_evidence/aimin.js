// aimin.js <repo> <fast_lane.ai>...: per file, the point count, the smallest horizontal part of the stored forward (|fwd x up|), how many points fall
// within 6° of vertical, and the camber range. Reads only.
const fs = require('fs'), path = require('path'); const { readAiLine } = require(path.resolve(process.argv[2]) + '/src/export/ailine.js');
for (const f of process.argv.slice(3)) {
  const l = readAiLine(fs.readFileSync(f)); let min = 9, at = -1, near = 0, cmin = 9, cmax = -9;
  l.extra.forEach((e, i) => { const h = Math.hypot(e.fx, e.fz); if (h < min) { min = h; at = i; } if (h < Math.sin(6 * Math.PI / 180)) near++; cmin = Math.min(cmin, e.camber); cmax = Math.max(cmax, e.camber); });
  console.log(`${path.basename(path.dirname(path.dirname(f)))}: points ${l.points.length}, min |fwd x up| ${min.toFixed(6)} at ${at}, within 6° of vertical ${near}, camber ${cmin.toFixed(3)}..${cmax.toFixed(3)}`);
}
