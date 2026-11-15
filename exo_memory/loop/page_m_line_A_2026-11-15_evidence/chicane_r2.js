// SCRATCH (seat A, D677, never committed): route 2's mouth is a chicane (the map r2_map.txt): the east-west corridor (z -66.5 and south, to x 35.5),
// a 2 m gap north at x 33.5 to 35.5, a room 2 m deep (z -63.5 to -65.5), the corridor north at x 39.5 to 41.5. A hand line through the openings'
// middles: a polyline A..E whose corners are filleted with the largest radius each corner's legs allow, under a cap; caps 0.5 to 2.5 m. Each hand
// line checked on the mesh; today's law and the arcs from the same start beside it. Removed by writing the committed feel_tests.cpp back.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const L = 'chase/tests/feel_tests.cpp';
const s = fs.readFileSync(W + L, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const row = `
DZ_TEST(diag_chicane_route_2) {
  Arena&     arena = plain_apartment_arena();
  nav::Query query(arena.nav());
  const auto rs = corner_routes(10);
  Chaser     probe;
  probe.body = make_body(archetype(Kind::Hunter).limits, 8.0f, 1.0f, SpeedModel{});
  const nav::Profile prof = profile_of(probe.body, "hunter");
  nav::Path          st;
  query.find_path(rs[2].first, rs[2].second, prof, st);
  Vec3 start = st.points.front().pos, target = st.points.back().pos;
  for (const auto& q : st.points) {
    if (length(flat(q.pos - Vec3{17.81f, 0, -66.49f})) < 0.05f) start = q.pos;
    if (length(flat(q.pos - Vec3{41.51f, 0, -47.84f})) < 0.05f) target = q.pos;
  }
  const float y = start.y;
  const Vec3  corner{39.29f, y, -63.39f};
  SpeedModel  b;
  DZ_CHECK(set_speed(b, "root_law=1;line_arcs=1").empty());
  for (const auto& arm : {std::make_pair("today   ", SpeedModel{}), std::make_pair("the arcs", b)}) {
    const Walk w = walk(arena, start, target, arm.second);
    int        in = -1, out = -1, contacts = 0;
    float      closest = 1e9f, lowest = 1e9f;
    for (size_t t = 0; t < w.pos.size(); ++t) {
      const float d = length(flat(w.pos[t] - corner));
      closest = std::min(closest, d);
      if (in < 0 && d <= 2.0f) in = static_cast<int>(t);
      if (in >= 0 && out < 0 && d > 2.0f && d > closest + 0.01f) out = static_cast<int>(t);
      if (in >= 0 && out < 0) lowest = std::min(lowest, w.speed[t]);
    }
    for (size_t t = 1; t < w.touched.size(); ++t) contacts += w.touched[t] && w.speed[t - 1] > 0.3f ? 1 : 0;
    std::printf("    route 2's chicane, %s: %.3f s between the gates, lowest %.2f m/s, exit tick %d, contacts %d, to the corridor's top in %.2f s\\n", arm.first,
                in >= 0 && out >= 0 ? static_cast<double>(out - in) / 240.0 : -1.0, static_cast<double>(lowest), out, contacts, static_cast<double>(w.pos.size()) / 240.0);
  }
  const std::vector<Vec3> poly{start, {19.0f, y, -67.3f}, {34.5f, y, -67.3f}, {34.5f, y, -64.5f}, {40.5f, y, -64.5f}, {40.5f, y, -55.0f}, target};
  for (const float cap : {0.5f, 1.0f, 1.5f, 2.0f, 2.5f}) {
    std::vector<Vec3> pts{poly.front()};
    std::vector<float> radii;
    const auto straight = [&](Vec3 to) {
      const Vec3 from = pts.back();
      const int  n = std::max(1, static_cast<int>(std::ceil(length(flat(to - from)) / 0.25f)));
      for (int i = 1; i <= n; ++i) pts.push_back(from + (to - from) * (static_cast<float>(i) / static_cast<float>(n)));
    };
    for (size_t i = 1; i + 1 < poly.size(); ++i) {
      const Vec3  din = flat(poly[i] - poly[i - 1]), dout = flat(poly[i + 1] - poly[i]);
      const float li = length(din), lo = length(dout);
      const Vec3  u = din * (1.0f / li), v = dout * (1.0f / lo);
      const float th = std::acos(std::max(-1.0f, std::min(1.0f, dot(u, v))));
      if (th < 0.01f) {
        straight(poly[i]);
        continue;
      }
      const float half_in = i == 1 ? li : 0.5f * li, half_out = i + 2 == poly.size() ? lo : 0.5f * lo;
      const float R = std::min(cap, std::min(half_in, half_out) / std::tan(0.5f * th));
      radii.push_back(R);
      const float tl = R * std::tan(0.5f * th);
      const Vec3  t0 = poly[i] - u * tl, t1 = poly[i] + v * tl;
      straight(Vec3{t0.x, y, t0.z});
      const float cr = u.x * v.z - u.z * v.x, k = cr > 0.0f ? 1.0f : -1.0f;
      const Vec3  c = t0 + Vec3{-u.z, 0.0f, u.x} * (k * R);
      const float a0 = std::atan2(t0.z - c.z, t0.x - c.x);
      const int   n = std::max(2, static_cast<int>(std::ceil(R * th / 0.25f)));
      for (int j = 1; j <= n; ++j) {
        const float a = a0 + k * th * static_cast<float>(j) / static_cast<float>(n);
        pts.push_back(Vec3{c.x + R * std::cos(a), y, c.z + R * std::sin(a)});
      }
      (void)t1;
    }
    straight(poly.back());
    int  off = 0;
    Vec3 first_off{};
    for (const Vec3& q : pts) {
      const bool on = query.nearest(q, prof, {0.02f, 0.6f, 0.02f}).found;
      if (!on && !off) first_off = q;
      off += on ? 0 : 1;
    }
    SpeedModel bb;
    DZ_CHECK(set_speed(bb, "root_law=1").empty());
    Chaser c;
    c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, bb.ref_speed, 1.0f, bb);
    c.body.root_law = 1;
    if (!place(c, query, start, std::atan2(pts[1].x - pts[0].x, pts[1].z - pts[0].z))) continue;
    nav::Path path;
    path.found = true;
    for (size_t i = 0; i < pts.size(); ++i) {
      nav::PathPoint q;
      q.pos = i == 0 ? c.pos : pts[i];
      q.move = nav::Move::Walk;
      q.length = i + 1 < pts.size() ? length(flat(pts[i + 1] - pts[i])) : 0.0f;
      path.points.push_back(q);
      path.length += q.length;
    }
    c.path = path;
    c.rooms = corner_rooms(c.path, query, profile_of(c.body, "hunter"));
    c.takeoff.clear();
    c.leg = 0, c.has_path = true, c.arrived = false;
    int   in = -1, out = -1, contacts = 0;
    float closest = 1e9f, lowest = 1e9f;
    std::vector<Vec3>  at;
    std::vector<float> sp;
    for (int t = 0; t < 240 * 30 && !c.arrived; ++t) {
      const float was = c.speed;
      step(c, query);
      at.push_back(c.pos), sp.push_back(c.speed);
      contacts += c.touched && was > 0.3f ? 1 : 0;
    }
    for (size_t t = 0; t < at.size(); ++t) {
      const float d = length(flat(at[t] - corner));
      closest = std::min(closest, d);
      if (in < 0 && d <= 2.0f) in = static_cast<int>(t);
      if (in >= 0 && out < 0 && d > 2.0f && d > closest + 0.01f) out = static_cast<int>(t);
      if (in >= 0 && out < 0) lowest = std::min(lowest, sp[t]);
    }
    std::printf("    route 2's chicane, hand line cap %.1f m (fillets", static_cast<double>(cap));
    for (const float r : radii) std::printf(" %.2f", static_cast<double>(r));
    std::printf(" m): %zu points, %d off the mesh (the first at (%.2f %.2f)); %.3f s between the gates, lowest %.2f m/s, exit tick %d, contacts %d, %s in %.2f s\\n",
                pts.size(), off, static_cast<double>(first_off.x), static_cast<double>(first_off.z),
                in >= 0 && out >= 0 ? static_cast<double>(out - in) / 240.0 : -1.0, static_cast<double>(lowest), out, contacts,
                c.arrived ? "to the corridor's top" : "NOT to the end", static_cast<double>(at.size()) / 240.0);
  }
}
`.split('\n').join(nl);
fs.writeFileSync(W + L, s.replace(/\s*$/, '') + nl + row);
console.log('chicane added');
