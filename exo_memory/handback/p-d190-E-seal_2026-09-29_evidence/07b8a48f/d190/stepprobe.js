// D190 row 1 probe (pane E): the adapter emits ONE profile per 2 m segment, evaluated at the segment's middle, with blend: null, so
// consecutive segments whose cup differs meet at a zipped STEP (src/geom/mesh.js SEAMS). How far does the left wall's tip jump
// at that step, for a cup ramp made by Extend's Bloss blend (max slope 1.5·Δc/transition)? Bowl and half-pipe, w = 31 m.
const T = __dirname + '/t/', Prof = require(T + 'src/geom/profile.js'), { FLOORS, AT } = require(T + 'src/geom/fonts.js');
const DEG = Math.PI / 180;
const cup = (fam, w, c) => { const F = FLOORS[fam], E = F[3], side = AT.map((f, i) => [f * w / 2, c * F[i] / E * DEG]);
  return Prof.normalize({ u: [...side.slice().reverse().map(([x]) => -x), 0, ...side.map(([x]) => x)], psi: [...side.slice().reverse().map(([, p]) => p), 0, ...side.map(([, p]) => p)] }); };
for (const fam of ['bowl', 'half-pipe']) for (const [c0, c1, tr] of [[15.5, 90, 100], [15.5, 90, 40], [15.5, 150, 40]]) {
  const slope = 1.5 * (c1 - c0) / tr, cm = (c0 + c1) / 2, step = slope * 2;   // the steepest point of the blend, one 2 m segment apart
  const a = Prof.offsetAt(cup(fam, 31, cm - step / 2), 15.5), b = Prof.offsetAt(cup(fam, 31, cm + step / 2), 15.5);
  console.log(JSON.stringify({ fam, from: c0, to: c1, transition_m: tr, max_dc_ds_deg_per_m: +slope.toFixed(3), edge_step_deg: +step.toFixed(3), tip_jump_m: +Math.hypot(a[0] - b[0], a[1] - b[1]).toFixed(3) }));
}
