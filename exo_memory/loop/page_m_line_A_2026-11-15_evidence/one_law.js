// D677 M-line: the slide's steering as one law (registration_slide_one_law.md), and the grip falsifier's measure restated by name. Either line ending.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const rep = (f, a0, b0) => {
  let s = fs.readFileSync(W + f, 'utf8');
  for (const e of ['\r\n', '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    fs.writeFileSync(W + f, s.replace(a, () => b));
    return;
  }
  throw new Error(f + ': anchor not found once: ' + a0.slice(0, 80));
};
rep('chase/chaser.cpp', `    if (sliding_on && going) {
      // M3c, corrected at its collation (registered: lighthouse exo_memory/handback/p-m3c-m3b-A_2026-11-15_evidence/registration_m3c_fix2.md): the aim
      // does not wait. The velocity turns toward the aim at the full rate the root law allows at the speed it has now, after this tick's gain
      // (min(turn_slow, mu g / max(v, kRootWalk))), never past the aim. Turned into an edge, it meets it on the next step and is put along it again.
      const float vdir = det_atan2(c.slide.x, c.slide.z);
      const Vec3  u{det_sin(vdir), 0.0f, det_cos(vdir)};
      const Vec3  a{det_sin(c.aim_dir), 0.0f, det_cos(c.aim_dir)};
      const float along = dot(a, u);
      const Vec3  side = a - u * along;
      if (along < 0.0f && length(side) > 1e-4f && length(c.wall_n) > 0.5f && dot(side, c.wall_n) < 0.0f) {
        // M3c's brake (registered: lighthouse exo_memory/handback/p-m3c-m3b-A_2026-11-15_evidence/registration_m3c_brake.md): the aim is behind along the
        // wall and the turn toward it is into the wall, which refuses it. The body spends its grip on braking, min(brake, mu g), with no turn; at rest
        // its velocity takes the wall's other way and it leaves that way, its speed growing only by the root law's acceleration from the next tick.
        const float dec = std::min(now.brake, std::max(now.grip_mu, 0.05f) * kGravity) * kDt;
        c.speed = std::max(0.0f, speed_before - dec);
        c.acc_fwd = (c.speed - speed_before) / kDt;
        c.slide_brake = 1;
        if (c.speed <= 0.0f) {
          c.slide = u * -1.0f;
          c.slide_brake = 2;
        }
      } else {
        const float w_max = std::min(now.turn_slow, std::max(now.grip_mu, 0.05f) * kGravity / std::max(c.speed, kRootWalk));
        const float nd = wrap_pi(vdir + clampf(wrap_pi(c.aim_dir - vdir), -w_max * kDt, w_max * kDt));
        const float m = length(c.slide);
        c.slide = Vec3{det_sin(nd) * m, 0.0f, det_cos(nd) * m};
      }
    }`,
`    if (sliding_on) {
      // The slide's steering as one law (registered: lighthouse exo_memory/loop/page_m_line_A_2026-11-15_evidence/registration_slide_one_law.md; the
      // ruling at the ring for the side): the velocity changes by no more than mu g dt, straight along (wanted - current), wanted = the aim x the
      // plan's speed (zero when not going), the part into the wall at the last contact refused. Braking is what it does when the aim is behind,
      // turning when the aim is to the side; at rest with the aim behind the velocity grows straight toward the aim.
      const float len = length(c.slide);
      const Vec3  v = c.slide * (speed_before / len);
      const Vec3  aim{det_sin(c.aim_dir), 0.0f, det_cos(c.aim_dir)};
      Vec3        dv = aim * (going ? want : 0.0f) - v;
      if (length(c.wall_n) > 0.5f && dot(dv, c.wall_n) < 0.0f) dv = dv - c.wall_n * dot(dv, c.wall_n);
      const float dl = length(dv);
      const float can = std::max(now.grip_mu, 0.05f) * kGravity * kDt;
      const Vec3  vn = dl > 1e-6f ? v + dv * (std::min(dl, can) / dl) : v;
      c.slide_brake = dot(aim, v) < 0.0f ? 1 : 0;  // a row reads it: the aim behind
      c.speed = length(vn);
      c.acc_fwd = (c.speed - speed_before) / kDt;
      c.slide = c.speed > 1e-4f ? vn : aim * 1e-3f;  // at rest it points at the aim, so the next tick grows toward it
    }`);
rep('chase/tests/feel_tests.cpp', `      w.slide_grip = std::max(w.slide_grip, std::fabs(d) * 240.0f * c.speed / (std::max(c.body.grip_mu, 0.05f) * 9.81f));`,
`      // The grip falsifier's measure, RESTATED by name with the slide's one law (registration_slide_one_law.md; the bar unchanged): the velocity's
      // change in the tick, |after - before| x 240 / (mu g), which the turn angle times the speed stood in for (and misread at a flip through rest).
      (void)d;
      const Vec3 vbefore = slide_was * (speed_was / length(slide_was)), vafter = c.slide * (c.speed / length(c.slide));
      w.slide_grip = std::max(w.slide_grip, length(vafter - vbefore) * 240.0f / (std::max(c.body.grip_mu, 0.05f) * 9.81f));`);
console.log('one law applied');
