// D677 M-line, the red commit for the line from the corridor (registration_line_from_corridor.md): root_line stubbed (the string unchanged),
// called by plan_to for a root body; rows in line_tests.cpp and feel_tests.cpp. Each anchor once, either line ending.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const edit = (f, a0, b0) => {
  let s = fs.readFileSync(W + f, 'utf8');
  for (const e of ['\r\n', '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    fs.writeFileSync(W + f, s.replace(a, () => b));
    return;
  }
  throw new Error(f + ': anchor not found once: ' + a0.slice(0, 70));
};
const append = (f, text) => {
  let s = fs.readFileSync(W + f, 'utf8');
  const nl = s.includes('\r\n') ? '\r\n' : '\n';
  fs.writeFileSync(W + f, s.replace(/\s*$/, '') + nl + text.split('\n').join(nl));
};

edit('chase/chaser.h', `bool plan_to(Chaser& chaser, const nav::Query& query, Vec3 target);`,
`bool plan_to(Chaser& chaser, const nav::Query& query, Vec3 target);
// M-line (lighthouse exo_memory/loop/page_m_line_A_2026-11-15.md): the line a body on the root follows, made from the string Detour gives: at each
// corner the widest arc whose apex keeps room from the corner, the arcs joined by their common tangents, every 0.25 m, on the mesh with room.
nav::Path root_line(const nav::Path& string, const nav::Query& query, const nav::Profile& profile);`);

edit('chase/chaser.cpp', `  c.path = std::move(p);
  if (c.body.line_clearance > 0) widen_corners(c.path, query, profile_now(c), c.body.line_clearance);`,
`  c.path = std::move(p);
  if (c.body.line_clearance > 0) widen_corners(c.path, query, profile_now(c), c.body.line_clearance);
  if (c.body.root_law == 1) c.path = root_line(c.path, query, profile_now(c));  // M-line`);

edit('chase/chaser.cpp', `bool plan_to(Chaser& c, const nav::Query& query, Vec3 target) {`,
`// M-line, red first: a stub that returns the string unchanged (registration_line_from_corridor.md).
nav::Path root_line(const nav::Path& string, const nav::Query&, const nav::Profile&) { return string; }

bool plan_to(Chaser& c, const nav::Query& query, Vec3 target) {`);

append('chase/tests/line_tests.cpp', `
namespace {

struct BendRun {
  bool  arrived = false;
  float secs = -1.0f, lowest = -1.0f, entry = -1.0f, closest = 1e9f;
  uint32_t contacts = 0, head_on = 0;
  nav::Path path;
};

// A body on the root planned from pane E's door to its target (no replans), stepped to the end; the gates as the scripted bends row's.
BendRun run_bend(const Arena& arena, Vec3 door, Vec3 bend, Vec3 target, const SpeedModel& m) {
  BendRun    r;
  nav::Query query(arena.nav());
  Chaser     c;
  c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, m.ref_speed, 1.0f, m);
  c.body.root_law = static_cast<int>(m.root_law);
  c.body.corner_feel = static_cast<int>(m.corner_feel);
  if (!place(c, query, door, heading_of(target - door)) || !plan_to(c, query, target)) return r;
  r.path = c.path;
  std::vector<float> speed;
  std::vector<Vec3>  at;
  const uint32_t     hits0 = c.wall_hits;
  for (int t = 0; t < 240 * 30 && !c.arrived; ++t) {
    const float was = c.speed;
    step(c, query);
    speed.push_back(c.speed), at.push_back(c.pos);
    r.contacts += c.touched && was > 0.3f ? 1u : 0u;
  }
  r.head_on = c.wall_hits - hits0;
  r.arrived = c.arrived;
  int in = -1, out = -1;
  float lowest = 1e9f;
  for (size_t t = 0; t < at.size(); ++t) {
    const float d = length(flat(at[t] - bend));
    r.closest = std::min(r.closest, d);
    if (in < 0 && d <= 2.0f) in = static_cast<int>(t);
    if (in >= 0 && out < 0 && d > 2.0f && d > r.closest + 0.01f) out = static_cast<int>(t);
    if (in >= 0 && out < 0) lowest = std::min(lowest, speed[t]);
  }
  if (in >= 0 && out >= 0) r.secs = static_cast<float>(out - in) / 240.0f, r.lowest = lowest, r.entry = speed[static_cast<size_t>(in)];
  return r;
}

struct EBend { const char* name; Vec3 door, bend, target; float pred_s, pred_v; };
const EBend kEBends[] = {
    {"22", {-57.24f, 10.54f, 39.45f}, {-75.19f, 10.54f, 40.66f}, {-86.37f, 10.54f, 46.13f}, 0.60f, 6.0f},
    {"45", {-3.54f, 10.54f, 77.51f}, {-25.04f, 10.54f, 77.51f}, {-32.19f, 10.54f, 84.65f}, 0.60f, 8.0f},
    {"90", {-32.91f, 10.54f, -26.24f}, {-11.54f, 10.54f, -26.84f}, {-13.29f, 10.54f, -34.04f}, 0.70f, 7.5f},
};

}  // namespace

// The line from the corridor (registration_line_from_corridor.md): pane E's three bends, planned once, both ways; the plan's bar checked (0.889 s
// for the 22 degree bend; never under 1.2 m/s), my registered predictions printed.
DZ_TEST(mline_the_line_from_the_corridor_takes_e_three_bends_within_the_plans_bar) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena arena(p);
  SpeedModel b, a;
  DZ_CHECK(set_speed(b, "root_law=1").empty());
  DZ_CHECK(set_speed(a, "root_law=1;corner_feel=1").empty());
  struct Arm { const char* name; SpeedModel m; };
  for (const EBend& e : kEBends)
    for (const Arm& arm : {Arm{"way (b)", b}, Arm{"way (a)", a}}) {
      const BendRun r = run_bend(arena, e.door, e.bend, e.target, arm.m);
      std::printf("    %s degrees, %-8s: %s; entry %.2f, lowest %.2f m/s, %.3f s between the gates (passed %.2f m from the point); contacts %u, head-on %u;"
                  " prediction (%.2f s, %.1f m/s) %s\\n",
                  e.name, arm.name, r.arrived ? "to the end" : "NOT to the end", static_cast<double>(r.entry), static_cast<double>(r.lowest),
                  static_cast<double>(r.secs), static_cast<double>(r.closest), r.contacts, r.head_on, static_cast<double>(e.pred_s),
                  static_cast<double>(e.pred_v), r.secs >= 0.0f && r.secs <= e.pred_s && r.lowest >= e.pred_v ? "met" : "NOT met");
      DZ_CHECK(r.secs >= 0.0f);
      DZ_CHECK(r.lowest >= 1.2f);
      if (e.name[0] == '2') DZ_CHECK(r.secs <= 0.889f);
    }
}

// The line itself: on each bend's plan, consecutive points no more than 0.3 m apart on its walked stretches, and every point on the mesh with
// at least 0.18 m of room either side (0.2 m registered, 2 cm for the mesh's own answer).
DZ_TEST(mline_the_line_is_dense_and_keeps_its_room_from_the_mesh_edge) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena arena(p);
  nav::Query  query(arena.nav());
  SpeedModel b;
  DZ_CHECK(set_speed(b, "root_law=1").empty());
  Chaser probe;
  probe.body = make_body(archetype(Kind::Hunter).limits, 8.0f, 1.0f, b);
  const nav::Profile prof = profile_of(probe.body, "hunter");
  for (const EBend& e : kEBends) {
    const BendRun r = run_bend(arena, e.door, e.bend, e.target, b);
    const auto&   pts = r.path.points;
    int           gaps = 0, tight = 0;
    for (size_t i = 0; i + 1 < pts.size(); ++i) {
      if (pts[i].move != nav::Move::Walk) continue;
      const Vec3 d = flat(pts[i + 1].pos - pts[i].pos);
      if (length(d) > 0.3f) ++gaps;
      if (length(d) < 1e-4f) continue;
      const Vec3 n{-d.z / length(d), 0.0f, d.x / length(d)};
      if (query.open_along(pts[i].pos, n, 0.2f, prof) < 0.18f || query.open_along(pts[i].pos, n * -1.0f, 0.2f, prof) < 0.18f) ++tight;
    }
    std::printf("    %s degrees: %zu points; legs over 0.3 m %d; points with under 0.18 m of room on a side %d\\n", e.name, pts.size(), gaps, tight);
    DZ_CHECK(pts.size() > 2);
    DZ_CHECK(gaps == 0);
    DZ_CHECK(tight == 0);
  }
}
`);

append('chase/tests/feel_tests.cpp', `
// The line from the corridor (registration_line_from_corridor.md): wall contacts above 0.3 m/s on the ten corner routes, at most 10 an arm on the
// root (my registered prediction), head-on ticks 0; today's printed beside them.
DZ_TEST(mline_on_the_ten_routes_the_root_touches_a_wall_at_most_ten_times_an_arm) {
  const auto rs = corner_routes(10);
  DZ_CHECK(rs.size() >= 6);
  for (const Arm& arm : arms()) {
    int contacts = 0, head_on = 0;
    for (size_t i = 0; i < rs.size(); ++i) {
      const Walk w = walk(plain_apartment_arena(), rs[i].first, rs[i].second, arm.model);
      for (size_t t = 1; t < w.speed.size(); ++t) contacts += w.touched[t] && w.speed[t - 1] > 0.3f ? 1 : 0;
      for (const uint8_t h : w.hit) head_on += h;
    }
    std::printf("    %-9s: wall contacts above 0.3 m/s %d, head-on ticks %d\\n", arm.name, contacts, head_on);
    if (arm.model.root_law == 0.0f) continue;
    DZ_CHECK(contacts <= 10);
    DZ_CHECK(head_on == 0);
  }
}
`);
console.log('line red commit applied');
