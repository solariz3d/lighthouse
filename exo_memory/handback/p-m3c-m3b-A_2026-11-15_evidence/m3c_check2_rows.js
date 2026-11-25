// D677 M3c, the re-registered slide check (registration_m3c_fix2.md): Chaser::aim_dir (diagnostic), the walk's record, and the row.
// Each anchor once, tried with either line ending (the working files can be mixed).
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const edit = (f, pairs) => {
  let s = fs.readFileSync(f, 'utf8');
  const nl = s.includes('\r\n') ? '\r\n' : '\n';
  for (const [a0, b0] of pairs) {
    let done = false;
    for (const e of [nl, nl === '\n' ? '\r\n' : '\n']) {
      const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
      if (s.split(a).length - 1 !== 1) continue;
      s = s.replace(a, () => b);
      done = true;
      break;
    }
    if (!done) throw new Error(`${f}: anchor not found exactly once: ${a0.slice(0, 70)}`);
  }
  fs.writeFileSync(f, s);
};

edit(W + 'chase/chaser.h', [[
`  uint8_t branch = 0;
};`,
`  uint8_t branch = 0;
  // M3c's slide check (registration_m3c_fix2.md): the direction of the aim the last root step read, before a slide took the heading's error. Read by
  // rows only; not hashed.
  float aim_dir = 0;
};`]]);

edit(W + 'chase/chaser.cpp', [[
`    const float before = c.heading;
    if (length(c.slide) > 1e-4f) {`,
`    const float before = c.heading;
    c.aim_dir = wrap_pi(c.heading + err);  // M3c's slide check reads it (not hashed)
    if (length(c.slide) > 1e-4f) {`]]);

edit(W + 'chase/tests/feel_tests.cpp', [
[`  float              slide_grip = 0;  // M3c's fix: the largest turn of its sliding velocity in a tick with no new contact, as a share of its grip
};`,
`  float              slide_grip = 0;  // M3c's fix: the largest turn of its sliding velocity in a tick with no new contact, as a share of its grip
  // M3c's slide check (registration_m3c_fix2.md): sliding ticks with no new contact and the velocity more than 20 degrees off the aim; of them, those
  // turning toward the aim at under 0.9 of the root law's allowed rate at the speed after the tick, and those where the body's own turn cap binds.
  int                far_ticks = 0, far_under = 0, far_capped = 0;
  float              far_worst = 1e9f, far_worst_grip = 1e9f;  // the least share of the allowed rate, and of pure grip
};`],
[`    if (length(slide_was) > 1e-4f && length(c.slide) > 1e-4f && !c.touched) {`,
`    if (c.body.root_law == 1 && c.gait == Gait::Mesh && length(slide_was) > 1e-4f && length(c.slide) > 1e-4f && !c.touched) {
      const float vb = det_atan2(slide_was.x, slide_was.z), va = det_atan2(c.slide.x, c.slide.z);
      float       off = c.aim_dir - vb, d = va - vb;
      while (off > kPi) off -= 2.0f * kPi;
      while (off < -kPi) off += 2.0f * kPi;
      while (d > kPi) d -= 2.0f * kPi;
      while (d < -kPi) d += 2.0f * kPi;
      if (std::fabs(off) > 20.0f * kPi / 180.0f) {
        const float g = std::max(c.body.grip_mu, 0.05f) * 9.81f;
        const float allow = std::min(c.body.turn_slow, g / std::max(c.speed, 0.5f));
        const float toward = (off > 0.0f ? d : -d) * 240.0f;
        ++w.far_ticks;
        w.far_under += toward < 0.9f * allow ? 1 : 0;
        w.far_capped += c.body.turn_slow < g / std::max(c.speed, 0.5f) ? 1 : 0;
        w.far_worst = std::min(w.far_worst, toward / allow);
        w.far_worst_grip = std::min(w.far_worst_grip, toward * c.speed / g);
      }
    }
    if (length(slide_was) > 1e-4f && length(c.slide) > 1e-4f && !c.touched) {`],
]);

// The row, after the snapped-contact row (the file's last).
let s = fs.readFileSync(W + 'chase/tests/feel_tests.cpp', 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const row = `
// M3c's slide check, re-registered at the collation of M3c (lighthouse exo_memory/loop/packet_m3c_m3b_A_2026-11-15.md, ruling item 2; read as in
// p-m3c-m3b-A_2026-11-15_evidence/registration_m3c_fix2.md): in every slide of every bend read, on each tick the velocity is more than 20 degrees off
// the aim, it turns toward the aim at no less than 0.9 of what its grip allows at its speed (the root law's own rate: min(turn_slow, mu g / max(v, 0.5)),
// v after the tick's gain). The ten corner routes and the three scripted bends, both ways. A row that finds no such tick is red.
DZ_TEST(m3c_far_off_the_aim_a_sliding_velocity_turns_toward_it_at_its_grip) {
  const auto rs = corner_routes(10);
  DZ_CHECK(rs.size() >= 6);
  ArenaParams p;
  p.gen.seed = 1;
  const Arena bends_arena(p);
  struct Bend { const char* name; Vec3 door, target; };
  const Bend bends[] = {{"22", {-57.24f, 10.54f, 39.45f}, {-86.37f, 10.54f, 46.13f}},
                        {"45", {-3.54f, 10.54f, 77.51f}, {-32.19f, 10.54f, 84.65f}},
                        {"90", {-32.91f, 10.54f, -26.24f}, {-13.29f, 10.54f, -34.04f}}};
  for (const Arm& arm : arms()) {
    if (arm.model.root_law == 0.0f) continue;
    int   ticks = 0, under = 0, capped = 0;
    float worst = 1e9f, worst_grip = 1e9f;
    const auto add = [&](const Walk& w) {
      ticks += w.far_ticks, under += w.far_under, capped += w.far_capped;
      worst = std::min(worst, w.far_worst), worst_grip = std::min(worst_grip, w.far_worst_grip);
    };
    for (size_t i = 0; i < rs.size(); ++i) add(walk(plain_apartment_arena(), rs[i].first, rs[i].second, arm.model));
    for (const Bend& b : bends) add(walk(bends_arena, b.door, b.target, arm.model));
    std::printf("    %-9s: %d sliding ticks over 20 degrees off the aim; under 0.9 of the allowed rate %d (least %.3f of it, %.3f of pure grip); the body's"
                " own turn cap binding on %d of them\\n",
                arm.name, ticks, under, static_cast<double>(ticks ? worst : 0.0f), static_cast<double>(ticks ? worst_grip : 0.0f), capped);
    DZ_CHECK(ticks > 0);
    DZ_CHECK(under == 0);
  }
}
`.split('\n').join(nl);
s = s.replace(/\s*$/, '') + nl + row;
fs.writeFileSync(W + 'chase/tests/feel_tests.cpp', s);
console.log('check 2 rows added');
