// D677 (his item 251): where the hunter's speed falls near zero in his replayed runs.   node find_stops.js <prefix> [low m/s]
// A stop: the hunter's speed below `low` (default 0.5) after it has run above 3 m/s, while it pursues. For each: when, where, how fast
// it came in and left, its turn across the stop (its heading 0.6 s before against 0.6 s after, from its own track), and the player's
// distance. Reads the dump's CSVs only.
const fs = require('fs');
const [prefix, lowArg] = process.argv.slice(2);
const low = Number(lowArg || 0.5);
const rows = fs.readFileSync(prefix + '_chasers.csv', 'utf8').trim().split(/\r?\n/).slice(1).map((l) => l.split(','));
const h = rows.filter((r) => r[2] === 'hunter').map((r) => ({ t: +r[0], mode: r[3], x: +r[4], y: +r[5], z: +r[6], v: +r[7] }));
const pl = fs.readFileSync(prefix + '_player.csv', 'utf8').trim().split(/\r?\n/).slice(1).map((l) => l.split(',')).map((r) => ({ t: +r[0], x: +r[1], y: +r[2], z: +r[3], v: +r[6] }));
const at = (arr, t) => arr.reduce((b, r) => (Math.abs(r.t - t) < Math.abs(b.t - t) ? r : b), arr[0]);
const heading = (a, b) => Math.atan2(b.x - a.x, b.z - a.z);
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
let ran = false, i = 0, found = 0;
console.log(`${prefix.split(/[\\/]/).pop()}: hunter samples ${h.length}, ${h[0]?.t}..${h[h.length - 1]?.t} s`);
while (i < h.length) {
  if (h[i].v > 3) ran = true;
  if (ran && h[i].v < low && h[i].mode === 'pursue') {
    let j = i;
    while (j + 1 < h.length && h[j + 1].v < low) ++j;
    let k = i, lowest = h[i];
    for (let m = i; m <= j; ++m) if (h[m].v < lowest.v) lowest = h[m];
    const before = at(h, h[i].t - 0.6), after = at(h, h[j].t + 0.6), inBefore = at(h, h[i].t - 1.2), outAfter = at(h, h[j].t + 1.2);
    const hin = heading(inBefore, before), hout = heading(after, outAfter);
    const p = at(pl, lowest.t);
    const into = h.slice(Math.max(0, i - 50), i).reduce((m, r) => Math.max(m, r.v), 0);
    console.log(`  stop ${++found}: ${h[i].t.toFixed(2)}..${h[j].t.toFixed(2)} s (${(h[j].t - h[i].t + 0.02).toFixed(2)} s under ${low}), lowest ${lowest.v.toFixed(2)} m/s at (${lowest.x.toFixed(2)}, ${lowest.y.toFixed(2)}, ${lowest.z.toFixed(2)}); ran ${into.toFixed(2)} m/s in the second before; turn across it ${(wrap(hout - hin) * 180 / Math.PI).toFixed(0)} deg (in ${(hin * 180 / Math.PI).toFixed(0)}, out ${(hout * 180 / Math.PI).toFixed(0)}); the player ${Math.hypot(p.x - lowest.x, p.z - lowest.z).toFixed(1)} m away (dy ${(p.y - lowest.y).toFixed(2)}) at ${p.v.toFixed(2)} m/s`);
    ran = false, i = j + 1;
    continue;
  }
  ++i;
}
if (!found) console.log('  no stop under ' + low + ' m/s after running');
// The slowest moment while pursuing after the first run, for reference.
const purs = h.filter((r, n) => r.mode === 'pursue' && h.slice(0, n).some((q) => q.v > 3));
const min = purs.reduce((b, r) => (r.v < b.v ? r : b), purs[0] || { v: NaN, t: NaN });
console.log(`  slowest while pursuing (after first running): ${min.v.toFixed(2)} m/s at ${min.t} s`);
