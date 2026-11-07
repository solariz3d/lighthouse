// vis616.js <body.csv>: the car's DRAWN underside and tyres against its own road, per frame (no collision: drawing only).
//   tyre into road     = 0.395 (model wheel radius, HUB y) - the lowest wheel centre's height over the road
//   underside over road = lowest wheel centre's height - 0.318 (Mach6BodyNonPaint's lowest y 0.077 is 0.318 under the hubs at 0.395) + body travel,
//   body travel = the replay body point's height over the wheel plane minus its lap median (inferred: the median taken as the static ride)
const L = require('fs').readFileSync(process.argv[2], 'utf8').trim().split('\n'), H = L[0].split(','), R = L.slice(1).map((l) => { const c = l.split(','); return Object.fromEntries(H.map((h, i) => [h, c[i]])); }).filter((r) => r.wheelMin !== '');
const hb = R.map((r) => +r.hBodyOverWheels).sort((a, b) => a - b), med = hb[hb.length >> 1];
for (const [lab, f] of [['whole lap', () => true], ['p29 helix', (r) => r.piece === 'p29']]) {
  const S = R.filter(f).map((r) => ({ r, tyre: 0.395 - +r.wheelMin, under: +r.wheelMin - 0.318 + (+r.hBodyOverWheels - med), underRigid: +r.wheelMin - 0.318 }));
  const by = (k, dir) => S.reduce((a, b) => (dir * b[k] > dir * a[k] ? b : a));
  const w = by('under', -1), t = by('tyre', 1);
  console.log(`== ${lab}: ${S.length} frames`);
  console.log(`  tyre into the road: max ${t.tyre.toFixed(3)} m at f${t.r.frame} (lap t ${t.r.lapT} s, ${t.r.kph} km/h, gas ${t.r.gas}, boost ${t.r.boost}); frames over 0.10 m: ${S.filter((x) => x.tyre > 0.10).length}, over 0.15 m: ${S.filter((x) => x.tyre > 0.15).length}`);
  console.log(`  drawn underside below the road: frames ${S.filter((x) => x.under < 0).length} with body travel, ${S.filter((x) => x.underRigid < 0).length} rigid to the wheels; lowest ${w.under.toFixed(3)} m at f${w.r.frame} (lap t ${w.r.lapT} s, ${w.r.kph} km/h, gas ${w.r.gas}, boost ${w.r.boost})`);
  const hi = S.filter((x) => +x.r.kph > 750), lo = S.filter((x) => +x.r.kph < 500), mean = (A, k) => A.reduce((s, x) => s + x[k], 0) / Math.max(1, A.length);
  console.log(`  mean tyre squash: above 750 km/h ${mean(hi, 'tyre').toFixed(3)} m (${hi.length} frames), below 500 km/h ${mean(lo, 'tyre').toFixed(3)} m (${lo.length} frames)`);
}
