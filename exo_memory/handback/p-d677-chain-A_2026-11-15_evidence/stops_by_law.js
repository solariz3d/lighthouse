// D677 (his item 251): at each of his stop places, the hunter's lowest speed while within 2.5 m of it (pursuing, after it first ran),
// under each law; and, over the whole run, how many dips under 1.0 and 1.5 m/s, and the slowest. Reads the dumps' CSVs only.
//   node stops_by_law.js <dir> <run tag> <x,z;x,z;...>
const fs = require('fs');
const [dir, tag, placesArg] = process.argv.slice(2);
const places = placesArg.split(';').map((p) => p.split(',').map(Number));
const laws = ['today', 'g13', 'g16', 'g20'];
const hunter = (law) => {
  const rows = fs.readFileSync(`${dir}/${tag}_${law}_chasers.csv`, 'utf8').trim().split(/\r?\n/).slice(1).map((l) => l.split(','));
  const h = rows.filter((r) => r[2] === 'hunter').map((r) => ({ t: +r[0], mode: r[3], x: +r[4], z: +r[6], v: +r[7] }));
  const first = h.findIndex((r) => r.v > 3);
  return first < 0 ? [] : h.slice(first).filter((r) => r.mode === 'pursue');
};
const dips = (h, low) => { let n = 0, under = false; for (const r of h) { if (r.v < low && !under) ++n; under = r.v < low; } return n; };
const out = {};
for (const law of laws) {
  const h = hunter(law);
  out[law] = {
    at: places.map(([x, z]) => { const near = h.filter((r) => Math.hypot(r.x - x, r.z - z) <= 2.5); return near.length ? Math.min(...near.map((r) => r.v)) : null; }),
    d10: dips(h, 1.0), d15: dips(h, 1.5), slowest: h.length ? Math.min(...h.map((r) => r.v)) : NaN, end: h.length ? h[h.length - 1].t : NaN,
  };
}
console.log(`${tag}: the hunter's lowest speed within 2.5 m of each place (m/s; - = not passed)`);
console.log('  place            ' + laws.map((l) => l.padStart(7)).join(''));
places.forEach(([x, z], i) => console.log(`  (${x.toFixed(2)}, ${z.toFixed(2)})`.padEnd(19) + laws.map((l) => (out[l].at[i] == null ? '-' : out[l].at[i].toFixed(2)).padStart(7)).join('')));
console.log('  dips < 1.0      ' + laws.map((l) => String(out[l].d10).padStart(7)).join(''));
console.log('  dips < 1.5      ' + laws.map((l) => String(out[l].d15).padStart(7)).join(''));
console.log('  slowest         ' + laws.map((l) => out[l].slowest.toFixed(2).padStart(7)).join(''));
console.log('  last pursue t   ' + laws.map((l) => out[l].end.toFixed(1).padStart(7)).join(''));
