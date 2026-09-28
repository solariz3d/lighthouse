// D185 registration (pane B): the THEORY for test 5 (Water), computed BEFORE any D185 water code exists.
// It integrates the skill's own particle law, references/06_surfaces.md §7 (a frictionless particle on a graph y = f(x, z), up +y):
//   q = g + f_xx ẋ² + 2 f_xz ẋż + f_zz ż²,  D = 1 + f_x² + f_z²,  ẍ = −f_x q / D,  z̈ = −f_z q / D,  N/m = q / √D  (N < 0: lift-off)
// on a FLAT BANKED CIRCLE: the cone f(x, z) = tanθ · (√(x² + z²) − R), i.e. a flat (no-dish) road tilted by θ, rising outward.
// Independent of the water code by construction: a different form (the graph ODE in x, z) and a different integrator (fixed-step
// RK4 at dt = 1e-4 s), so agreement between the two is evidence, not an echo.
//   node water_theory.js > water_theory.json
'use strict';
const g = 9.81, R = 500, W = 30;                                   // centre radius (m), road width along the surface (m)
function run({ theta, v, d0, maxS }) {
  const t = Math.tan(theta), c = Math.cos(theta);
  const f = (x, z) => t * (Math.hypot(x, z) - R);
  const acc = (x, z, vx, vz) => {
    const r = Math.hypot(x, z), fx = t * x / r, fz = t * z / r, fxx = t * z * z / r ** 3, fzz = t * x * x / r ** 3, fxz = -t * x * z / r ** 3;
    const q = g + fxx * vx * vx + 2 * fxz * vx * vz + fzz * vz * vz, D = 1 + fx * fx + fz * fz;
    return { ax: -fx * q / D, az: -fz * q / D, N: q / Math.sqrt(D) };
  };
  // start: lateral offset d0 along the surface (outward +), velocity tangent to the circle through that point, speed v
  let x = R + d0 * c, z = 0, vx = 0, vz = v;
  const E0 = 0.5 * v * v + g * f(x, z);
  const dt = 1e-4; let phi = 0, lastAng = 0, dMin = d0, dMax = d0, Nmin = Infinity, Emax = 0, spill = null;
  for (let i = 0; ; i++) {
    const k1 = acc(x, z, vx, vz);
    const x2 = x + vx * dt / 2, z2 = z + vz * dt / 2, vx2 = vx + k1.ax * dt / 2, vz2 = vz + k1.az * dt / 2, k2 = acc(x2, z2, vx2, vz2);
    const x3 = x + vx2 * dt / 2, z3 = z + vz2 * dt / 2, vx3 = vx + k2.ax * dt / 2, vz3 = vz + k2.az * dt / 2, k3 = acc(x3, z3, vx3, vz3);
    const x4 = x + vx3 * dt, z4 = z + vz3 * dt, vx4 = vx + k3.ax * dt, vz4 = vz + k3.az * dt, k4 = acc(x4, z4, vx4, vz4);
    x += dt * (vx + 2 * vx2 + 2 * vx3 + vx4) / 6; z += dt * (vz + 2 * vz2 + 2 * vz3 + vz4) / 6;
    vx += dt * (k1.ax + 2 * k2.ax + 2 * k3.ax + k4.ax) / 6; vz += dt * (k1.az + 2 * k2.az + 2 * k3.az + k4.az) / 6;
    const ang = Math.atan2(z, x); let da = ang - lastAng; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI; phi += da; lastAng = ang;
    const d = (Math.hypot(x, z) - R) / c, s = R * phi, N = acc(x, z, vx, vz).N;
    // the particle's speed in 3-D includes the vertical component along the surface: ẏ = f_x ẋ + f_z ż
    const r = Math.hypot(x, z), vy = t * (x * vx + z * vz) / r, E = 0.5 * (vx * vx + vy * vy + vz * vz) + g * f(x, z);
    dMin = Math.min(dMin, d); dMax = Math.max(dMax, d); Nmin = Math.min(Nmin, N); Emax = Math.max(Emax, Math.abs(E - E0) / Math.abs(E0));
    if (Math.abs(d) > W / 2 && !spill) { spill = { side: d > 0 ? 'outer' : 'inner', stationM: +s.toFixed(2), timeS: +(i * dt).toFixed(3) }; break; }
    if (s >= maxS) break;
  }
  return { d0, dMin: +dMin.toFixed(4), dMax: +dMax.toFixed(4), NminOverG: +(Nmin / g).toFixed(4), energyMaxRelDrift: +Emax.toExponential(2), spill };
}
const lap = 2 * Math.PI * R, offsets = [-14, -7, 0, 7, 14];
const thA = 45 * Math.PI / 180, vA = Math.sqrt(g * R * Math.tan(thA));          // the balance speed, derived from §7 (see the registration)
const thB = 10 * Math.PI / 180, vB = vA;                                          // the SAME speed on a bank too shallow for it
// closed-form estimate for the too-shallow case, from §7's initial lateral acceleration along the surface (constant-acceleration)
const aLat = (vB * vB / R) * Math.cos(thB) - g * Math.sin(thB), tSpill = Math.sqrt(2 * (W / 2) / aLat);
const out = {
  law: 'references/06_surfaces.md §7, on f(x,z) = tanθ·(√(x²+z²) − R)', g, R, widthM: W, lapM: +lap.toFixed(3), integrator: 'RK4, dt 1e-4 s',
  A_balanced: { thetaDeg: 45, v: +vA.toFixed(4), vKmh: +(vA * 3.6).toFixed(1), particles: offsets.map((d0) => run({ theta: thA, v: vA, d0, maxS: lap })) },
  B_tooShallow: { thetaDeg: 10, v: +vB.toFixed(4), closedForm: { aLat: +aLat.toFixed(4), tSpillS: +tSpill.toFixed(4), stationM: +(vB * tSpill).toFixed(2) },
    particles: offsets.map((d0) => run({ theta: thB, v: vB, d0, maxS: lap })) },
};
process.stdout.write(JSON.stringify(out, null, 1) + '\n');
