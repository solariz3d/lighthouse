// D677 M3c brake (registration_m3c_brake.md), the red commit: Chaser::wall_n and slide_brake, the wall's side noted at both contacts (not yet used
// by the law), check 2 amended by name, and the new row. Each anchor once, tried with either line ending.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const edit = (f, pairs) => {
  let s = fs.readFileSync(W + f, 'utf8');
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
    if (!done) throw new Error(`${f}: anchor not found exactly once: ${a0.slice(0, 80)}`);
  }
  fs.writeFileSync(W + f, s);
};

edit('chase/chaser.h', [[
`  float aim_dir = 0;
};`,
`  float aim_dir = 0;
  // M3c's brake (registration_m3c_brake.md): the outward side of the wall at the last contact (flat, unit; zero before any), and what the last root
  // step did along a wall with the aim behind it (0 nothing, 1 braked, 2 came to rest and turned about). Rows read slide_brake.
  Vec3    wall_n;
  uint8_t slide_brake = 0;
};`]]);

edit('chase/chaser.cpp', [
[`void step(Chaser& c, const nav::Query& query, bool hold, const Collision* world) {`,
`// M3c's brake (registration_m3c_brake.md): at a contact, the wall's outward side: the part of the attempted step the edge refused, reversed and made
// unit. Met square, that is the whole step; too grazing to read one (under a millimetre a metre), the last one is kept.
void note_wall(Chaser& c, Vec3 travel, Vec3 allowed, float len) {
  const Vec3 t = flat(travel);
  if (len <= 1e-6f) {
    const float l = length(t);
    if (l > 1e-6f) c.wall_n = t * (-1.0f / l);
    return;
  }
  const Vec3  e = allowed * (1.0f / len);
  const Vec3  perp = t - e * dot(t, e);
  const float pl = length(perp);
  if (pl > 1e-3f) c.wall_n = perp * (-1.0f / pl);
}

void step(Chaser& c, const nav::Query& query, bool hold, const Collision* world) {`],
[`        c.touched = 1, c.touch_cos = cos_edge, c.touch_along_before = along, c.touch_along_after = kept;
        if (len > 1e-6f && kept > 1e-4f) {
          c.slide = allowed * (kept / len);`,
`        c.touched = 1, c.touch_cos = cos_edge, c.touch_along_before = along, c.touch_along_after = kept;
        note_wall(c, travel, allowed, len);
        if (len > 1e-6f && kept > 1e-4f) {
          c.slide = allowed * (kept / len);`],
[`    c.touched = 1, c.touch_cos = cos_edge, c.touch_along_before = along, c.touch_along_after = kept;
    if (len > 1e-6f && kept > 1e-4f) {
      c.pos = m.pos;`,
`    c.touched = 1, c.touch_cos = cos_edge, c.touch_along_before = along, c.touch_along_after = kept;
    note_wall(c, travel, slid, len);
    if (len > 1e-6f && kept > 1e-4f) {
      c.pos = m.pos;`],
[`    c.aim_dir = wrap_pi(c.heading + err);  // M3c's slide check reads it (not hashed)`,
`    c.aim_dir = wrap_pi(c.heading + err);  // M3c's slide check reads it (not hashed)
    c.slide_brake = 0;`],
]);

edit('chase/tests/feel_tests.cpp', [
[`  int                far_ticks = 0, far_under = 0, far_capped = 0;`,
`  int                far_ticks = 0, far_under = 0, far_capped = 0;
  // M3c's brake (registration_m3c_brake.md): sliding ticks with no new contact, the aim behind along the wall and the turn toward it into the wall;
  // of them, those that did not brake by 0.9 of min(brake, mu g) a second (and were not at rest); and ticks where the velocity's direction moved more
  // than 90 degrees with its speed above 0.05 m/s before and after (turned about by hand).
  int                behind_ticks = 0, behind_unbraked = 0, about_by_hand = 0;`],
[`    const Vec3     slide_was = c.slide;
    step(c, query);`,
`    const Vec3     slide_was = c.slide;
    const float    speed_was = c.speed;
    step(c, query);
    if (c.body.root_law == 1 && c.gait == Gait::Mesh && length(slide_was) > 1e-4f && !c.touched) {
      const Vec3  u = slide_was * (1.0f / length(slide_was));
      const Vec3  a{det_sin(c.aim_dir), 0.0f, det_cos(c.aim_dir)};
      const float along = dot(a, u);
      const Vec3  l = a - u * along;
      if (along < 0.0f && length(l) > 1e-4f && length(c.wall_n) > 0.5f && dot(l, c.wall_n) < 0.0f) {
        const float dec = std::min(c.body.brake, std::max(c.body.grip_mu, 0.05f) * 9.81f) / 240.0f;
        ++w.behind_ticks;
        w.behind_unbraked += (c.speed <= speed_was - 0.9f * dec || speed_was <= 0.9f * dec) ? 0 : 1;
      }
      if (length(c.slide) > 1e-4f && speed_was > 0.05f && c.speed > 0.05f) {
        float d = det_atan2(c.slide.x, c.slide.z) - det_atan2(u.x, u.z);
        while (d > kPi) d -= 2.0f * kPi;
        while (d < -kPi) d += 2.0f * kPi;
        w.about_by_hand += std::fabs(d) > 0.5f * kPi ? 1 : 0;
      }
    }`],
[`    if (c.body.root_law == 1 && c.gait == Gait::Mesh && length(slide_was) > 1e-4f && length(c.slide) > 1e-4f && !c.touched) {
      const float vb = det_atan2(slide_was.x, slide_was.z), va = det_atan2(c.slide.x, c.slide.z);`,
`    // Check 2, amended by name (registration_m3c_brake.md): a tick where the wall refuses the turn and the body brakes is not a turning tick.
    if (c.body.root_law == 1 && c.gait == Gait::Mesh && length(slide_was) > 1e-4f && length(c.slide) > 1e-4f && !c.touched && !c.slide_brake) {
      const float vb = det_atan2(slide_was.x, slide_was.z), va = det_atan2(c.slide.x, c.slide.z);`],
]);

let s = fs.readFileSync(W + 'chase/tests/feel_tests.cpp', 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const row = `
// M3c's brake, ruled at the collation of the fall (lighthouse exo_memory/loop/packet_m3c_m3b_A_2026-11-15.md, item 4; registered in
// p-m3c-m3b-A_2026-11-15_evidence/registration_m3c_brake.md): along a wall with the aim behind and the turn toward it into the wall, the body spends its
// grip on braking (by 0.9 of min(brake, mu g) a tick, or it is at rest) and leaves the other way; never turned about by hand. The ten corner routes
// and the three scripted bends, both ways. A row that sees no such tick is red.
DZ_TEST(m3c_along_a_wall_with_the_aim_behind_the_body_brakes_at_its_grip_and_leaves_the_other_way) {
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
    int behind = 0, unbraked = 0, about = 0;
    const auto add = [&](const Walk& w) { behind += w.behind_ticks, unbraked += w.behind_unbraked, about += w.about_by_hand; };
    for (size_t i = 0; i < rs.size(); ++i) add(walk(plain_apartment_arena(), rs[i].first, rs[i].second, arm.model));
    for (const Bend& b : bends) add(walk(bends_arena, b.door, b.target, arm.model));
    std::printf("    %-9s: %d sliding ticks with the aim behind along the wall and the turn into it; not braking %d; turned about by hand %d\\n", arm.name,
                behind, unbraked, about);
    DZ_CHECK(behind > 0);
    DZ_CHECK(unbraked == 0);
    DZ_CHECK(about == 0);
  }
}
`.split('\n').join(nl);
s = s.replace(/\s*$/, '') + nl + row;
fs.writeFileSync(W + 'chase/tests/feel_tests.cpp', s);
console.log('brake rows and fields added');
