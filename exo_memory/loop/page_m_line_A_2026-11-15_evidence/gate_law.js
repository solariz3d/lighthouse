// D677 M-line, the gate's fix (registered in the page: "After the third try ... 1. the gate"): a judge's half-legs sampled every 0.5 m, the arc at
// 0.25 m. chase/chaser.cpp only. Either line ending.
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
rep(`constexpr float kArcRoom = 0.2f, kArcNeed = 0.18f, kArcMin = 0.3f, kArcMax = 60.0f, kArcStep = 0.25f, kArcFar = 12.0f;`,
`constexpr float kArcRoom = 0.2f, kArcNeed = 0.18f, kArcMin = 0.3f, kArcMax = 60.0f, kArcStep = 0.25f, kArcFar = 12.0f;
// The gate (the ruling at the third try's ring, item 1; registered in the page before code): a judge reads the half-legs beside an arc every
// kArcLegStep, the arc itself every kArcStep. Most of a plan's cost was the half-legs' room samples (the 90: about 48 of a judge's 55).
constexpr float kArcLegStep = 0.5f;`);
rep(`void arc_straight(std::vector<Vec3>& out, Vec3 from, Vec3 to) {
  const int n = std::max(1, static_cast<int>(std::ceil(length(flat(to - from)) / kArcStep)));`,
`void arc_straight(std::vector<Vec3>& out, Vec3 from, Vec3 to, float step = kArcStep) {
  const int n = std::max(1, static_cast<int>(std::ceil(length(flat(to - from)) / step)));`);
rep(`  std::vector<Vec3> pts{tin - e.u * e.half_in};
  arc_straight(pts, pts.back(), tin);
  if (!arc_sweep(pts, e, tin, tout)) return false;
  arc_straight(pts, tout, tout + e.v * e.half_out);`,
`  std::vector<Vec3> pts{tin - e.u * e.half_in};
  arc_straight(pts, pts.back(), tin, kArcLegStep);
  if (!arc_sweep(pts, e, tin, tout)) return false;
  arc_straight(pts, tout, tout + e.v * e.half_out, kArcLegStep);`);
fs.writeFileSync(f, s);
console.log('gate fix applied');
