// D190 row 6 probe (pane E): bank 30 + cup 60, cup-then-roll. A straight level segment rolled 30° (+ = left side up) carrying a
// half-pipe-shaped cup profile with edge ψ = 60°; each edge's surface angle to gravity = acos(n·up), n = L·nl + U·nu (profile.js).
const T = __dirname + '/t/', { buildPath } = require(T + 'src/geom/path.js'), Prof = require(T + 'src/geom/profile.js'), { FLOORS, AT } = require(T + 'src/geom/fonts.js');
const DEG = Math.PI / 180;
const cup = (fam, w, cl, cr) => { const F = FLOORS[fam], E = F[3], L = AT.map((f, i) => [f * w / 2, cl * F[i] / E * DEG]), Rr = AT.map((f, i) => [f * w / 2, cr * F[i] / E * DEG]);
  return Prof.normalize({ u: [...Rr.slice().reverse().map(([x]) => -x), 0, ...L.map(([x]) => x)], psi: [...Rr.slice().reverse().map(([, p]) => p), 0, ...L.map(([, p]) => p)] }); };
const run = (label, phi, P) => {
  const seg = { id: 'x', word: 'core', part: 'body', kind: 'road', length: 20, k0: 0, k1: 0, kp0: 0, kp1: 0, roll0: phi * DEG, roll1: phi * DEG, heartline: 0, profile: P, blend: null, speed: null };
  const p = buildPath([seg], { step: 0.5, closed: false }), m = p.samples[20];
  const ang = (u) => { const [nl, nu] = Prof.normalAt(P, u), n = [0, 1, 2].map((k) => m.L[k] * nl + m.U[k] * nu); return Math.acos(Math.max(-1, Math.min(1, n[1]))) / DEG; };
  const w = P.u[P.u.length - 1];
  console.log(JSON.stringify({ label, bankG_deg: +(m.bankG / DEG).toFixed(6), left_edge_deg: +ang(w).toFixed(6), centre_deg: +ang(0).toFixed(6), right_edge_deg: +ang(-w).toFixed(6) }));
};
for (const fam of Object.keys(FLOORS)) run(`cup-then-roll ${fam} (bank 30, cup 60)`, 30, cup(fam, 30, 60, 60));
run('bank 0, cup 60 (control: symmetric)', 0, cup('bowl', 30, 60, 60));
run('bank 30, cup 0 (control: the roll alone)', 30, cup('bowl', 30, 0, 0));
run('PLANTED roll-then-cup: psi in the world frame (left c-phi, right c+phi)', 30, cup('bowl', 30, 60 - 30, 60 + 30));
run('PLANTED cup ignores bank (roll not applied)', 0, cup('bowl', 30, 60, 60));
