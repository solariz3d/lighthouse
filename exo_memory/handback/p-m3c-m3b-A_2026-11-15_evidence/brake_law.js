// D677 M3c's brake law (registration_m3c_brake.md), applied after the red run. Each anchor once, tried with either line ending.
const fs = require('fs');
const W = process.argv[2] || 'G:/consonance-scratch/a-m1-dz3/';
const f = W + 'chase/chaser.cpp';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const rep = (a0, b0) => {
  for (const e of [nl, nl === '\n' ? '\r\n' : '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    s = s.replace(a, () => b);
    return;
  }
  throw new Error('anchor not found exactly once: ' + a0.slice(0, 80));
};
rep(`      const float vdir = det_atan2(c.slide.x, c.slide.z);
      const float w_max = std::min(now.turn_slow, std::max(now.grip_mu, 0.05f) * kGravity / std::max(c.speed, kRootWalk));
      const float nd = wrap_pi(vdir + clampf(wrap_pi(c.aim_dir - vdir), -w_max * kDt, w_max * kDt));
      const float m = length(c.slide);
      c.slide = Vec3{det_sin(nd) * m, 0.0f, det_cos(nd) * m};
    }`,
`      const float vdir = det_atan2(c.slide.x, c.slide.z);
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
    }`);
rep(`  if (c.body.root_law == 1) h.f32(c.slide.x), h.f32(c.slide.z), h.f32(c.fall_v), h.f32(c.fall_vy);  // M3a/M3b: nothing new is hashed off the root`,
`  if (c.body.root_law == 1) h.f32(c.slide.x), h.f32(c.slide.z), h.f32(c.fall_v), h.f32(c.fall_vy), h.f32(c.wall_n.x), h.f32(c.wall_n.z);  // M3a/M3b/M3c's brake: nothing new off the root`);
fs.writeFileSync(f, s);
console.log('brake law applied to ' + f);
