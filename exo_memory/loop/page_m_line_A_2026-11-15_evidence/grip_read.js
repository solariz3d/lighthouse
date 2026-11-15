// SCRATCH (seat A, D677, never committed): read 1 of the ring for section 2 (git-blob 82cb7b9e): the registered grip arms 1.3, 1.6 and 2.0 beside
// 1.0 and today's law, on the arcs as they stand (3a5898d's law), with replans. Two rows: the stand-in's three bends (run_bend, which replans), and
// the ten routes plus route 0's mouth and route 2's chicane (a walker that replans every 120 ticks; the routes row's own one-plan walk printed too).
// Removed by writing the committed line_tests.cpp and feel_tests.cpp back.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const add = (f, row) => {
  const s = fs.readFileSync(W + f, 'utf8');
  const nl = s.includes('\r\n') ? '\r\n' : '\n';
  fs.writeFileSync(W + f, s.replace(/\s*$/, '') + nl + row.split('\n').join(nl));
};
add('chase/tests/line_tests.cpp', `
DZ_TEST(diag_grip_bends) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena arena(p);
  for (const EBend& e : kEBends) {
    const BendRun t = run_bend(arena, e.door, e.bend, e.target, SpeedModel{});
    std::printf("    %s degrees, today's law: exit tick %d, %.3f s between the gates, lowest %.2f m/s, contacts %u\\n", e.name, t.exit_tick,
                static_cast<double>(t.secs), static_cast<double>(t.lowest), t.contacts);
    for (const char* g : {"1.0", "1.3", "1.6", "2.0"}) {
      SpeedModel m;
      DZ_CHECK(set_speed(m, std::string("root_law=1;line_arcs=1;grip_mu=") + g).empty());
      const BendRun r = run_bend(arena, e.door, e.bend, e.target, m);
      std::printf("    %s degrees, the arcs at grip %s: exit tick %d, %.3f s between the gates, lowest %.2f m/s, contacts %u, head-on %u\\n", e.name, g,
                  r.exit_tick, static_cast<double>(r.secs), static_cast<double>(r.lowest), r.contacts, r.head_on);
    }
  }
}
`);
add('chase/tests/feel_tests.cpp', `
namespace {
struct GripRun {
  float secs = 0.0f, lowest = 1e9f, gate_s = -1.0f;
  int   contacts = 0, exit_tick = -1;
  bool  arrived = false;
};
// a walker that replans every 120 ticks, as the chase does; gates 2 m round \`corner\` when one is given
GripRun grip_walk(Arena& arena, Vec3 from, Vec3 to, const SpeedModel& m, const Vec3* corner) {
  nav::Query query(arena.nav());
  Chaser     c;
  c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, m.ref_speed, 1.0f, m);
  c.body.root_law = static_cast<int>(m.root_law), c.body.corner_feel = static_cast<int>(m.corner_feel), c.body.line_arcs = static_cast<int>(m.line_arcs);
  GripRun r;
  if (!place(c, query, from, 0.0f) || !plan_to(c, query, to)) return r;
  int   in = -1, t = 0;
  float closest = 1e9f;
  for (t = 0; t < 240 * 120 && !c.arrived; ++t) {
    if (t > 0 && t % 120 == 0 && c.gait == Gait::Mesh) plan_to(c, query, to);
    const float was = c.speed;
    step(c, query);
    r.contacts += c.touched && was > 0.3f ? 1 : 0;
    if (corner) {
      const float d = length(flat(c.pos - *corner));
      closest = std::min(closest, d);
      if (in < 0 && d <= 2.0f) in = t;
      if (in >= 0 && r.exit_tick < 0 && d > 2.0f && d > closest + 0.01f) r.exit_tick = t, r.gate_s = static_cast<float>(t - in) / 240.0f;
      if (in >= 0 && r.exit_tick < 0) r.lowest = std::min(r.lowest, c.speed);
    }
  }
  r.secs = static_cast<float>(t) / 240.0f;
  r.arrived = c.arrived;
  return r;
}
}  // namespace
DZ_TEST(diag_grip_routes_and_mouths) {
  Arena&     arena = plain_apartment_arena();
  nav::Query query(arena.nav());
  const auto rs = corner_routes(10);
  struct Arm { std::string name; SpeedModel m; };
  std::vector<Arm> arms{{"today's law", SpeedModel{}}};
  for (const char* g : {"1.0", "1.3", "1.6", "2.0"}) {
    SpeedModel m;
    DZ_CHECK(set_speed(m, std::string("root_law=1;line_arcs=1;grip_mu=") + g).empty());
    arms.push_back({std::string("the arcs at grip ") + g, m});
  }
  for (const Arm& a : arms) {
    float total = 0.0f, one = 0.0f;
    int   contacts = 0, short_of = 0;
    for (size_t i = 0; i < rs.size(); ++i) {
      const GripRun r = grip_walk(arena, rs[i].first, rs[i].second, a.m, nullptr);
      total += r.secs, contacts += r.contacts, short_of += r.arrived ? 0 : 1;
      one += static_cast<float>(walk(arena, rs[i].first, rs[i].second, a.m).pos.size()) / 240.0f;
    }
    std::printf("    the ten routes, %s: with replans %.2f s, contacts %d, not to the end %d; the routes row's one-plan walk %.2f s\\n", a.name.c_str(),
                static_cast<double>(total), contacts, short_of, static_cast<double>(one));
  }
  // the two mouths, from the route's own string point about 20 m before, to a target past it
  struct Mouth { const char* name; size_t route; Vec3 start, corner, target; };
  const Mouth mouths[] = {{"route 0's mouth", 0, {-35.99f, 0, -62.54f}, {-16.84f, 0, -62.69f}, {-16.50f, 0, -70.50f}},
                          {"route 2's chicane", 2, {17.81f, 0, -66.49f}, {39.29f, 0, -63.39f}, {41.51f, 0, -47.84f}}};
  Chaser probe;
  probe.body = make_body(archetype(Kind::Hunter).limits, 8.0f, 1.0f, SpeedModel{});
  const nav::Profile prof = profile_of(probe.body, "hunter");
  for (const Mouth& mo : mouths) {
    nav::Path st;
    query.find_path(rs[mo.route].first, rs[mo.route].second, prof, st);
    Vec3 start = mo.start, target = mo.target;
    for (const auto& q : st.points) {
      if (length(flat(q.pos - mo.start)) < 0.05f) start = q.pos;
      if (length(flat(q.pos - mo.target)) < 0.05f) target = q.pos;
    }
    const Vec3 corner{mo.corner.x, start.y, mo.corner.z};
    for (const Arm& a : arms) {
      const GripRun r = grip_walk(arena, start, target, a.m, &corner);
      std::printf("    %s, %s: %.3f s between the gates, lowest %.2f m/s, exit tick %d, contacts %d, %s in %.2f s\\n", mo.name, a.name.c_str(),
                  static_cast<double>(r.gate_s), static_cast<double>(r.lowest), r.exit_tick, r.contacts, r.arrived ? "to the end" : "NOT to the end",
                  static_cast<double>(r.secs));
    }
  }
}
`);
console.log('grip rows added');
