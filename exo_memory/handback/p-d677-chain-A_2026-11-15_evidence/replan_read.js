// D677 (the replan's two causes, read on today's traces): around a place's lowest speed, every 0.1 s from 1.5 s before to 0.5 s after:
// the hunter's speed, its line's kink (degrees its line's next point lies off its heading), whether it replanned (next_plan changed), how far
// its aim moved at that replan, and the player's distance.   node replan_read.js <prefix> <x> <z>
const fs = require('fs');
const [prefix, xs, zs] = process.argv.slice(2);
const px = +xs, pz = +zs;
const ch = fs.readFileSync(prefix + '_chasers.csv', 'utf8').trim().split(/\r?\n/).slice(1).map((l) => l.split(','))
  .filter((r) => r[2] === 'hunter').map((r) => ({ t: +r[0], x: +r[4], z: +r[6], v: +r[7], ax: +r[8], az: +r[9], np: +r[10], off: +r[11], want: +r[12], left: +r[13], leg: +r[14], sl: +r[15], gait: +r[16] }));
const pl = fs.readFileSync(prefix + '_player.csv', 'utf8').trim().split(/\r?\n/).slice(1).map((l) => l.split(',')).map((r) => ({ t: +r[0], x: +r[1], z: +r[3] }));
const near = ch.filter((r) => Math.hypot(r.x - px, r.z - pz) <= 2.5 && r.v > 0);
if (!near.length) { console.log('not passed'); process.exit(0); }
const low = near.reduce((b, r) => (r.v < b.v ? r : b));
console.log(`${prefix.split(/[\\/]/).pop()} at (${px}, ${pz}): lowest ${low.v.toFixed(2)} m/s at ${low.t.toFixed(2)} s`);
let prev = null;
for (const r of ch) {
  if (r.t < low.t - 1.5 || r.t > low.t + 0.5) { prev = r; continue; }
  const replanned = prev && r.np !== prev.np;
  const moved = replanned ? Math.hypot(r.ax - prev.ax, r.az - prev.az) : 0;
  if (Math.round(r.t * 100) % 10 === 0 || replanned) {
    const p = pl.reduce((b, q) => (Math.abs(q.t - r.t) < Math.abs(b.t - r.t) ? q : b));
    console.log(`  ${r.t.toFixed(2)} s ${r.v.toFixed(2)} m/s kink ${(r.off * 180 / Math.PI).toFixed(0).padStart(4)} deg${replanned ? `  REPLAN, aim moved ${moved.toFixed(2)} m to (${r.ax.toFixed(1)}, ${r.az.toFixed(1)})` : ''}  player ${Math.hypot(p.x - r.x, p.z - r.z).toFixed(1)} m; plan asks ${r.want.toFixed(2)}, line left ${r.left.toFixed(1)} m, next point ${r.leg.toFixed(2)} m${r.sl ? ', SLIDING' : ''} gait ${r.gait}`);
  }
  prev = r;
}
