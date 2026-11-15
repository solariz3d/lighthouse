// SCRATCH (seat A, D677, never committed): item 3 of the ring for the two reads (git-blob 1a5b2e86): route 0's mouth, where the arcs' arc meets
// the doorway. From route 0's string point (-35.99, -62.54) to its end, way (b) with the arcs and replans every 120 ticks: the arcs laid on the
// first plan (radius, centre, tangent points); the doorway's free mesh across each 0.25 m row from z -62.25 to -63.75 beside where the line and the
// body cross that row; every contact (tick, place, speed, heading, the wall's outward side); and a map: '#' off the mesh, '.' on it, 'o' the first
// plan's line, 'b' the body, 'X' a contact, 'S' the string. Removed by writing the committed feel_tests.cpp back.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const L = 'chase/tests/feel_tests.cpp';
const s = fs.readFileSync(W + L, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const row = `
DZ_TEST(diag_route_0_mouth) {
  Arena&     arena = plain_apartment_arena();
  nav::Query query(arena.nav());
  const auto rs = corner_routes(10);
  SpeedModel b;
  DZ_CHECK(set_speed(b, "root_law=1;line_arcs=1").empty());
  Chaser c;
  c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
  c.body.root_law = 1, c.body.line_arcs = 1;
  const nav::Profile prof = profile_of(c.body, "hunter");
  nav::Path          st;
  query.find_path(rs[0].first, rs[0].second, prof, st);
  Vec3 start = st.points.front().pos;
  for (const auto& q : st.points)
    if (length(flat(q.pos - Vec3{-35.99f, 0, -62.54f})) < 0.05f) start = q.pos;
  const Vec3 target = rs[0].second;
  DZ_CHECK(place(c, query, start, std::atan2(1.0f, 0.0f)));
  DZ_CHECK(plan_to(c, query, target));
  const nav::Path line = c.path;
  {
    nav::Path s2;
    query.find_path(start, target, prof, s2);
    ArcReport rep;
    root_arcs(s2, query, prof, &rep);
    std::printf("    the string from the start:");
    for (const auto& q : s2.points) std::printf(" (%.2f %.2f)", static_cast<double>(q.pos.x), static_cast<double>(q.pos.z));
    std::printf("\\n    the arcs on it: %zu laid", rep.arc_radius.size());
    for (size_t i = 0; i < rep.arc_radius.size(); ++i)
      std::printf(" [r %.2f centre (%.2f %.2f)]", static_cast<double>(rep.arc_radius[i]), static_cast<double>(rep.arc_centre[i].x),
                  static_cast<double>(rep.arc_centre[i].z));
    std::printf("; merged %d; runs to the solve %d\\n", rep.merged, rep.fallback_runs);
    for (size_t i = 0; i < rep.bend_turn.size(); ++i)
      std::printf("      bend %zu: (%.2f %.2f) to (%.2f %.2f), turn %.1f degrees\\n", i, static_cast<double>(rep.bend_first[i].x), static_cast<double>(rep.bend_first[i].z),
                  static_cast<double>(rep.bend_last[i].x), static_cast<double>(rep.bend_last[i].z), static_cast<double>(rep.bend_turn[i] * 57.29578f));
  }
  std::vector<Vec3>    at;
  std::vector<float>   sp;
  std::vector<uint8_t> hit;
  for (int t = 0; t < 240 * 20 && !c.arrived; ++t) {
    if (t > 0 && t % 120 == 0 && c.gait == Gait::Mesh) plan_to(c, query, target);
    const float was = c.speed;
    step(c, query);
    at.push_back(c.pos), sp.push_back(c.speed);
    const bool contact = c.touched && was > 0.3f;
    hit.push_back(contact ? 1 : 0);
    if (contact)
      std::printf("    contact at tick %d at (%.2f %.2f): speed %.2f -> %.2f, heading %.1f degrees, the wall's outward side (%.2f %.2f)\\n", t,
                  static_cast<double>(c.pos.x), static_cast<double>(c.pos.z), static_cast<double>(was), static_cast<double>(c.speed),
                  static_cast<double>(c.heading * 57.29578f), static_cast<double>(c.wall_n.x), static_cast<double>(c.wall_n.z));
  }
  float lowest = 1e9f;
  int   low_t = -1;
  for (size_t t = 0; t < at.size(); ++t)
    if (length(flat(at[t] - Vec3{-16.84f, 0, -62.69f})) < 2.0f && sp[t] < lowest) lowest = sp[t], low_t = static_cast<int>(t);
  std::printf("    to the end: %s in %.2f s; lowest within 2 m of the mouth %.2f m/s at tick %d (%.2f %.2f)\\n", c.arrived ? "yes" : "no",
              static_cast<double>(at.size()) / 240.0, static_cast<double>(lowest), low_t, low_t >= 0 ? static_cast<double>(at[static_cast<size_t>(low_t)].x) : 0.0,
              low_t >= 0 ? static_cast<double>(at[static_cast<size_t>(low_t)].z) : 0.0);
  // the doorway: each row's free mesh near x -16.5, beside where the first plan's line and the body cross it
  const float y = start.y;
  for (float z = -62.25f; z >= -63.75f - 1e-3f; z -= 0.25f) {
    float lo = 1e9f, hi = -1e9f;
    for (float x = -18.5f; x <= -14.5f + 1e-3f; x += 0.05f)
      if (query.nearest({x, y, z}, prof, {0.02f, 0.6f, 0.02f}).found) lo = std::min(lo, x), hi = std::max(hi, x);
    float lx = 1e9f, bx = 1e9f;
    for (size_t i = 0; i + 1 < line.points.size(); ++i) {
      const Vec3 a = line.points[i].pos, d = line.points[i + 1].pos - a;
      if ((a.z - z) * (a.z + d.z - z) <= 0.0f && std::fabs(d.z) > 1e-6f) {
        lx = a.x + d.x * ((z - a.z) / d.z);
        break;
      }
    }
    for (size_t t = 0; t + 1 < at.size(); ++t)
      if ((at[t].z - z) * (at[t + 1].z - z) <= 0.0f && std::fabs(at[t + 1].z - at[t].z) > 1e-6f) {
        bx = at[t].x + (at[t + 1].x - at[t].x) * ((z - at[t].z) / (at[t + 1].z - at[t].z));
        break;
      }
    std::printf("    z %.2f: free mesh x %.2f to %.2f (in x -18.5 to -14.5, every 5 cm); the line crosses at x %.2f, the body at x %.2f\\n", static_cast<double>(z),
                static_cast<double>(lo), static_cast<double>(hi), static_cast<double>(lx), static_cast<double>(bx));
  }
  const float x0 = -21.0f, z0 = -60.0f;
  const int   n = 41;
  std::vector<std::string> map(static_cast<size_t>(n), std::string(static_cast<size_t>(n), ' '));
  for (int r = 0; r < n; ++r)
    for (int col = 0; col < n; ++col)
      map[static_cast<size_t>(r)][static_cast<size_t>(col)] =
          query.nearest({x0 + 0.25f * static_cast<float>(col), y, z0 - 0.25f * static_cast<float>(r)}, prof, {0.02f, 0.6f, 0.02f}).found ? '.' : '#';
  const auto put = [&](Vec3 q, char ch) {
    const int col = static_cast<int>(std::lround((q.x - x0) / 0.25f)), r = static_cast<int>(std::lround((z0 - q.z) / 0.25f));
    if (col < 0 || r < 0 || col >= n || r >= n) return;
    map[static_cast<size_t>(r)][static_cast<size_t>(col)] = ch;
  };
  for (const auto& q : line.points) put(q.pos, 'o');
  for (size_t t = 0; t < at.size(); ++t) put(at[t], hit[t] ? 'X' : 'b');
  for (const auto& q : st.points) put(q.pos, 'S');
  std::printf("    x from %.2f (left) by 0.25; z from %.2f (top) down by 0.25\\n", static_cast<double>(x0), static_cast<double>(z0));
  for (int r = 0; r < n; ++r) std::printf("    %7.2f %s\\n", static_cast<double>(z0 - 0.25f * static_cast<float>(r)), map[static_cast<size_t>(r)].c_str());
}
`.split('\n').join(nl);
fs.writeFileSync(W + L, s.replace(/\s*$/, '') + nl + row);
console.log('route 0 mouth read added');
