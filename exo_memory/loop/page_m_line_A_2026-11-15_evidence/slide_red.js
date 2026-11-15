// D677 M-line: the slide law's red row (the ruling at the ring for the side, packet git-blob 4742072e, item 2). Check 2 and the brake row RESTATED by
// name; a unit row from the base's 45 degree tick 773. Either line ending; each anchor once.
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m1-dz3/chase/tests/feel_tests.cpp';
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
rep(`    if (c.body.root_law == 1 && c.gait == Gait::Mesh && length(slide_was) > 1e-4f && !c.touched) {
      const Vec3  u = slide_was * (1.0f / length(slide_was));
      const Vec3  a{det_sin(c.aim_dir), 0.0f, det_cos(c.aim_dir)};
      const float along = dot(a, u);
      const Vec3  l = a - u * along;
      if (along < 0.0f && length(l) > 1e-4f && length(c.wall_n) > 0.5f && dot(l, c.wall_n) < 0.0f) {
        const float dec = std::min(c.body.brake, std::max(c.body.grip_mu, 0.05f) * 9.81f) / 240.0f;
        ++w.behind_ticks;
        w.behind_unbraked += (c.speed <= speed_was - 0.9f * dec || speed_was <= 0.9f * dec) ? 0 : 1;
      }
      if (length(c.slide) > 1e-4f && speed_was > 0.05f && c.speed > 0.05f) {`,
`    if (c.body.root_law == 1 && c.gait == Gait::Mesh && length(slide_was) > 1e-4f && !c.touched) {
      const Vec3 u = slide_was * (1.0f / length(slide_was));
      // Check 2 and the brake row, RESTATED by name at the ring for the side (lighthouse exo_memory/loop/packet_m_line_A_2026-11-15.md, git-blob
      // 4742072e, item 2; the 03:28 turning check withdrawn by name there): while sliding and off the aim by more than 20 degrees, the acceleration is
      // no less than 0.9 of what grip allows and points along (the wanted velocity less the current one), less what the wall refuses. A tick with the
      // aim behind (more than 90 degrees off) is a brake-row tick as well.
      const Vec3  aim{det_sin(c.aim_dir), 0.0f, det_cos(c.aim_dir)};
      const float cosoff = dot(aim, u);
      if (cosoff < det_cos(20.0f * kPi / 180.0f)) {
        const float g = std::max(c.body.grip_mu, 0.05f) * 9.81f;
        const Vec3  vb = u * speed_was;
        const Vec3  ua = length(c.slide) > 1e-4f ? c.slide * (1.0f / length(c.slide)) : Vec3{det_sin(c.heading), 0.0f, det_cos(c.heading)};
        const Vec3  va = ua * c.speed;
        Vec3        dv = aim * (c.plan_want > 0.0f ? c.plan_want : c.body.top) - vb;
        if (length(c.wall_n) > 0.5f && dot(dv, c.wall_n) < 0.0f) dv = dv - c.wall_n * dot(dv, c.wall_n);
        const float dl = length(dv);
        const float can = std::min(g, dl * 240.0f);
        const float along = dl > 1e-4f ? dot((va - vb) * 240.0f, dv * (1.0f / dl)) : 0.0f;
        const bool  short_of = can > 1e-3f && along < 0.9f * can;
        ++w.far_ticks;
        w.far_under += short_of ? 1 : 0;
        if (can > 1e-3f) w.far_worst = std::min(w.far_worst, along / can), w.far_worst_grip = std::min(w.far_worst_grip, along / g);
        if (cosoff < 0.0f) ++w.behind_ticks, w.behind_unbraked += short_of ? 1 : 0;
      }
      if (length(c.slide) > 1e-4f && speed_was > 0.05f && c.speed > 0.05f) {`);
rep(`    // Check 2, amended by name (registration_m3c_brake.md): a tick where the wall refuses the turn and the body brakes is not a turning tick.
    if (c.body.root_law == 1 && c.gait == Gait::Mesh && length(slide_was) > 1e-4f && length(c.slide) > 1e-4f && !c.touched && !c.slide_brake) {
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
`, ``);
// the rows' prints say what they now read
rep(`    std::printf("    %-9s: %d sliding ticks over 20 degrees off the aim; under 0.9 of the allowed rate %d (least %.3f of it, %.3f of pure grip); the body's"
                " own turn cap binding on %d of them\\n",`,
`    std::printf("    %-9s: %d sliding ticks over 20 degrees off the aim; with the acceleration along (wanted - current) under 0.9 of grip %d (least %.3f of"
                " what grip allows there, %.3f of grip); (the turn-cap count is no longer read: %d)\\n",`);
rep(`    std::printf("    %-9s: %d sliding ticks with the aim behind along the wall and the turn into it; not braking %d; turned about by hand %d\\n", arm.name,`,
`    std::printf("    %-9s: %d sliding ticks with the aim behind; with the acceleration along (wanted - current) under 0.9 of grip %d; turned about by hand %d\\n",
                arm.name,`);
let t = s;
const nl = t.includes('\r\n') ? '\r\n' : '\n';
t = t.replace(/\s*$/, '') + nl + `
// The slide law's red row (the ring for the side, item 2): the base's 45 degree bend at tick 773 (r45b.txt), set up as it stood: a body on the root
// at (-25.81, 77.65), its slide along the wall at -128.7 degrees and 2.72 m/s, the wall's outward side (0.62, -0.78), its aim about +58 degrees
// (a path straight to a point 6 m that way). Stepped 90 ticks, the restated check on every sliding tick off the aim: the acceleration along (wanted
// - current) no less than 0.9 of what grip allows.
DZ_TEST(m3c_from_the_45_degree_bends_tick_773_a_slide_with_the_aim_behind_accelerates_toward_the_wanted_velocity) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena arena(p);
  nav::Query  query(arena.nav());
  SpeedModel  b;
  DZ_CHECK(set_speed(b, "root_law=1").empty());
  Chaser c;
  c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
  c.body.root_law = 1;
  const float rad = kPi / 180.0f;
  DZ_CHECK(place(c, query, {-25.81f, 10.54f, 77.65f}, -65.3f * rad));
  const Vec3 aim_to = c.pos + Vec3{det_sin(58.0f * rad), 0.0f, det_cos(58.0f * rad)} * 6.0f;
  nav::PathPoint a0, a1;
  a0.pos = c.pos, a0.move = nav::Move::Walk, a0.length = 6.0f;
  a1.pos = aim_to, a1.move = nav::Move::Walk;
  c.path = {};
  c.path.found = true;
  c.path.points = {a0, a1};
  c.leg = 0, c.has_path = true, c.arrived = false;
  c.speed = 2.72f;
  c.slide = Vec3{det_sin(-128.7f * rad), 0.0f, det_cos(-128.7f * rad)} * 2.72f;
  c.wall_n = Vec3{0.62f, 0.0f, -0.78f};
  const float g = std::max(c.body.grip_mu, 0.05f) * 9.81f;
  int ticks = 0, under = 0;
  float least = 1e9f;
  for (int t = 0; t < 90; ++t) {
    const Vec3  slide_was = c.slide;
    const float speed_was = c.speed;
    step(c, query);
    if (length(slide_was) < 1e-4f || c.touched) continue;
    const Vec3 u = slide_was * (1.0f / length(slide_was));
    const Vec3 aim{det_sin(c.aim_dir), 0.0f, det_cos(c.aim_dir)};
    if (dot(aim, u) >= det_cos(20.0f * rad)) continue;
    const Vec3 vb = u * speed_was;
    const Vec3 ua = length(c.slide) > 1e-4f ? c.slide * (1.0f / length(c.slide)) : Vec3{det_sin(c.heading), 0.0f, det_cos(c.heading)};
    Vec3       dv = aim * (c.plan_want > 0.0f ? c.plan_want : c.body.top) - vb;
    if (dot(dv, c.wall_n) < 0.0f) dv = dv - c.wall_n * dot(dv, c.wall_n);
    const float dl = length(dv), can = std::min(g, dl * 240.0f);
    const float along = dl > 1e-4f ? dot((ua * c.speed - vb) * 240.0f, dv * (1.0f / dl)) : 0.0f;
    ++ticks;
    if (can > 1e-3f) {
      under += along < 0.9f * can ? 1 : 0;
      least = std::min(least, along / can);
    }
  }
  std::printf("    from tick 773's state: %d sliding ticks off the aim; with the acceleration along (wanted - current) under 0.9 of what grip allows %d"
              " (least %.3f of it)\\n", ticks, under, static_cast<double>(ticks ? least : 0.0f));
  DZ_CHECK(ticks > 0);
  DZ_CHECK(under == 0);
}
`.split('\n').join(nl);
fs.writeFileSync(f, t);
console.log('slide red rows applied');
