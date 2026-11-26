// along.js <tree> <patch dir> <n...>: the road's extent AHEAD of and BEHIND the start along its forward axis (to 40 m, 0.1 m steps, kept while the road under
// each step is within 0.3 m of the last), against its extent across; through the tree's own groundUnder. Names never printed.
const fs = require('fs'), path = require('path');
const [TREE, PATCH, ...NS] = process.argv.slice(2);
const { decodeRoad, groundUnder } = require(path.join(path.resolve(TREE), 'src/reference/road.js'));
for (const n of NS) {
  const b = fs.readFileSync(path.join(PATCH, `${n}.road`)), road = decodeRoad(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)), s = road.meta.start;
  if (!s) { console.log(`layout ${n}: no start`); continue; }
  const [x, y, z] = s.pos, g = groundUnder(road.batches, s.pos), fl = Math.hypot(s.T[0], s.T[2]), f = [s.T[0] / fl, s.T[2] / fl], l = [-f[1], f[0]];
  const reach = (d) => { let prev = g, got = 0; for (let k = 1; k <= 400; k++) { const h = groundUnder(road.batches, [x + d[0] * k * 0.1, prev + 0.5, z + d[1] * k * 0.1], 1.5); if (h === null || Math.abs(h - prev) > 0.3) break; prev = h; got = k * 0.1; } return +got.toFixed(1); };
  console.log(`layout ${n}: ahead ${reach(f)} m, behind ${reach([-f[0], -f[1]])} m, left ${reach(l)} m, right ${reach([-l[0], -l[1]])} m; T.y ${s.T[1].toFixed(3)}`);
}
