// D677 M-line, red first for item 2 (the page's "What keeps the 90's arc", five lines): two rows in chase/tests/line_tests.cpp.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const L = 'chase/tests/line_tests.cpp';
const s = fs.readFileSync(W + L, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const row = `
// The floor in every shrink (item 2, line 1): pane E's plan made 12.9 m from the 90 ran to a target that had moved 3.36 m past the bend
// ((-11.28, -30.18)); the bend's cluster holds arcs from 1 to 6 m there, but line 4 shrank it against that end with a fixed 0.3 m floor, at which a
// cluster has no centre, and it went to the solve. Here, in the stand-in, the same start and target: an arc is laid at the 90 (its centre within
// 4 m of the bend) and nothing is sent to the solve.
DZ_TEST(mline_arcs_a_cluster_shrunk_against_a_near_target_keeps_an_arc) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena  arena(p);
  nav::Query   query(arena.nav());
  const EBend& e = kEBends[2];
  SpeedModel   b;
  DZ_CHECK(set_speed(b, "root_law=1;line_arcs=1").empty());
  Chaser probe;
  probe.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
  probe.body.root_law = 1, probe.body.line_arcs = 1;
  const nav::Profile prof = profile_of(probe.body, "hunter");
  nav::Path          str;
  DZ_CHECK(query.find_path(Vec3{-24.38f, e.door.y, -25.98f}, Vec3{-11.28f, e.door.y, -30.18f}, prof, str));
  ArcReport rep;
  root_arcs(str, query, prof, &rep);
  std::printf("    the string:");
  for (const nav::PathPoint& q : str.points) std::printf(" (%.2f %.2f)", static_cast<double>(q.pos.x), static_cast<double>(q.pos.z));
  std::printf("\\n    arcs %zu:", rep.arc_radius.size());
  int at_the_90 = 0;
  for (size_t i = 0; i < rep.arc_radius.size(); ++i) {
    std::printf(" [r %.2f centre (%.2f %.2f)]", static_cast<double>(rep.arc_radius[i]), static_cast<double>(rep.arc_centre[i].x), static_cast<double>(rep.arc_centre[i].z));
    at_the_90 += length(flat(rep.arc_centre[i] - e.bend)) <= 4.0f ? 1 : 0;
  }
  std::printf("; runs to the solve %d\\n", rep.fallback_runs);
  DZ_CHECK(at_the_90 >= 1);
  DZ_CHECK(rep.fallback_runs == 0);
}

// The line kept over the shared way (item 2, lines 2 to 4): with a replan every 120 ticks and a target that moves, as pane E's does, to 3.36 m past
// the 90 ((-11.28, -30.18)) from the third replan on, every point of the line within 5 m of the bend stays within 5 cm of the first plan's at
// every plan until the body is within 2 m of the bend.
DZ_TEST(mline_arcs_with_replans_and_a_moving_target_the_90s_line_stays) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena  arena(p);
  nav::Query   query(arena.nav());
  const EBend& e = kEBends[2];
  SpeedModel   b;
  DZ_CHECK(set_speed(b, "root_law=1;line_arcs=1").empty());
  Chaser c;
  c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
  c.body.root_law = 1, c.body.line_arcs = 1;
  DZ_CHECK(place(c, query, e.door, heading_of(e.target - e.door)));
  DZ_CHECK(plan_to(c, query, e.target));
  const std::vector<nav::PathPoint> first = c.path.points;
  const auto off_first = [&](Vec3 q) {
    float bd = 1e9f;
    for (size_t i = 0; i + 1 < first.size(); ++i) {
      const Vec3  a = flat(first[i].pos), d = flat(first[i + 1].pos) - a, w = flat(q) - a;
      const float l2 = dot(d, d), t = l2 > 1e-8f ? std::max(0.0f, std::min(1.0f, dot(w, d) / l2)) : 0.0f;
      bd = std::min(bd, length(w - d * t));
    }
    return bd;
  };
  const Vec3 moved_to{-11.28f, e.target.y, -30.18f};
  float      moved = 0.0f;
  bool       near = false;
  for (int t = 1; t < 240 * 30 && !c.arrived && !near; ++t) {
    if (t % 120 == 0 && c.gait == Gait::Mesh) {
      plan_to(c, query, t >= 360 ? moved_to : e.target);
      float worst = 0.0f;
      int   n = 0;
      for (const nav::PathPoint& q : c.path.points)
        if (length(flat(q.pos - e.bend)) <= 5.0f) worst = std::max(worst, off_first(q.pos)), ++n;
      moved = std::max(moved, worst);
      std::printf("    plan at tick %d (target %s): the body %.2f m from the bend; its line within 5 m of the bend (%d points) at most %.2f m from the first plan's\\n",
                  t, t >= 360 ? "moved" : "first", static_cast<double>(length(flat(c.pos - e.bend))), n, static_cast<double>(worst));
    }
    step(c, query);
    near = length(flat(c.pos - e.bend)) <= 2.0f;
  }
  std::printf("    the line within 5 m of the bend moved at most %.2f m\\n", static_cast<double>(moved));
  DZ_CHECK(moved <= 0.05f);
}
`.split('\n').join(nl);
fs.writeFileSync(W + L, s.replace(/\s*$/, '') + nl + row);
console.log('keep red added');
