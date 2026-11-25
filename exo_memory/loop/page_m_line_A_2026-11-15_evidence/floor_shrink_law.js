// D677 M-line, item 2 line 1: the floor in every shrink: the least radius at which a bend's centre exists (2a51143's floor, until now in
// arc_widest only) also floors line 1's S pair and line 4's end shrink. chase/chaser.cpp only. Either line ending.
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m1-dz3/chase/chaser.cpp';
let s = fs.readFileSync(f, 'utf8');
const rep = (a0, b0) => {
  for (const e of ['\r\n', '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    s = s.replace(a, () => b);
    return;
  }
  throw new Error('anchor not found once: ' + a0.slice(0, 80));
};
rep(`// The common tangent from a to b, as travelled (points have radius 0); false when there is none.`,
`// The least radius, no more than hi, at which the bend's centre exists (the floor; the ruling at the ring for the cluster and the charge): kArcMin
// for one corner; for a cluster the circle less the room must hold every corner, which a small radius cannot. -1 when none up to hi does.
float arc_least(ArcEl e, float hi) {
  if (arc_place(e, kArcMin)) return kArcMin;
  if (!arc_place(e, hi)) return -1.0f;
  float bad = kArcMin, good = hi;
  for (int it = 0; it < 12; ++it) {
    const float mid = 0.5f * (bad + good);
    if (arc_place(e, mid)) good = mid;
    else bad = mid;
  }
  return good;
}

// The common tangent from a to b, as travelled (points have radius 0); false when there is none.`);
rep(`  // The floor (the ruling at the ring for the cluster and the charge): the least radius at which the bend's centre exists, found first. For one
  // corner that is kArcMin; for a cluster the circle less the room must hold every corner, which a small radius cannot.
  float lo = kArcMin;
  if (!arc_place(e, lo)) {
    if (!arc_place(e, hi)) return false;
    float bad = lo, good = hi;
    for (int it = 0; it < 12; ++it) {
      const float mid = 0.5f * (bad + good);
      if (arc_place(e, mid)) good = mid;
      else bad = mid;
    }
    lo = good;
  }
  if (!arc_judge(e, lo, query, profile)) return false;`,
`  // The floor (the ruling at the ring for the cluster and the charge): the least radius at which the bend's centre exists, found first.
  float lo = arc_least(e, hi);
  if (lo < 0.0f) return false;
  if (!arc_judge(e, lo, query, profile)) return false;`);
rep(`      const float ra = A.r, rb = B.r, least = std::max(kArcMin / ra, kArcMin / rb);`,
`      // the floor in this shrink too (item 2, line 1): each bend's own least radius, not kArcMin
      const float la = arc_least(A, A.r), lb = arc_least(B, B.r);
      const float ra = A.r, rb = B.r, least = la < 0.0f || lb < 0.0f ? 2.0f : std::max(la / ra, lb / rb);`);
rep(`    const float  r0 = bend.r;
    float        lo = kArcMin, hi = r0;`,
`    const float  r0 = bend.r;
    const float  floor_r = arc_least(bend, r0);  // the floor in this shrink too (item 2, line 1): the bend's own least radius, not kArcMin
    float        lo = floor_r, hi = r0;`);
rep(`    if (r0 <= kArcMin * 1.001f || !fits(kArcMin)) {
      arc_unmerge(els, bi);
      continue;
    }`,
`    if (floor_r < 0.0f || r0 <= floor_r * 1.001f || !fits(floor_r)) {
      arc_unmerge(els, bi);
      continue;
    }`);
fs.writeFileSync(f, s);
console.log('floor in every shrink applied');
