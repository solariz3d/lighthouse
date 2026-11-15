// SCRATCH (seat A, D677, never committed): read 2 of the ruling after the third try (git-blob a69b4210): the corridor mouths of routes 0 and 2 in
// the stand-in (plain_apartment_arena). From a start on the route's own string about 20 m before the mouth, to a target past it: today's law, the
// arcs (way (b), line_arcs 1), and hand lines (straight, one arc of radius R ending on the corridor's centre line heading along it, straight on),
// each R checked on the mesh. Printed: the time between 2 m gates round the mouth's corner, the lowest speed there, the exit tick from the
// start, contacts, every hand-line point off the mesh; and the arcs laid on the arcs' plan. Removed by writing the committed feel_tests.cpp back.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const L = 'chase/tests/feel_tests.cpp';
const s = fs.readFileSync(W + L, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const row = `
// SCRATCH (D677, never committed): the corridor mouths, with hand lines as the judge of the place.
namespace {
struct MouthRun {
  bool  arrived = false;
  float secs = -1.0f, lowest = -1.0f;
  int   exit_tick = -1, contacts = 0, ticks = 0;
};
MouthRun mouth_gates(const std::vector<Vec3>& at, const std::vector<float>& speed, const std::vector<uint8_t>& touched, Vec3 corner) {
  MouthRun r;
  int      in = -1, out = -1;
  float    closest = 1e9f, lowest = 1e9f;
  for (size_t t = 0; t < at.size(); ++t) {
    const float d = length(flat(at[t] - corner));
    closest = std::min(closest, d);
    if (in < 0 && d <= 2.0f) in = static_cast<int>(t);
    if (in >= 0 && out < 0 && d > 2.0f && d > closest + 0.01f) out = static_cast<int>(t);
    if (in >= 0 && out < 0) lowest = std::min(lowest, speed[t]);
  }
  for (size_t t = 1; t < touched.size(); ++t) r.contacts += touched[t] && speed[t - 1] > 0.3f ? 1 : 0;
  if (in >= 0 && out >= 0) r.secs = static_cast<float>(out - in) / 240.0f, r.lowest = lowest, r.exit_tick = out;
  r.ticks = static_cast<int>(at.size());
  return r;
}
}  // namespace
DZ_TEST(diag_mouths_with_hand_lines) {
  Arena&     arena = plain_apartment_arena();
  nav::Query query(arena.nav());
  SpeedModel b;
  DZ_CHECK(set_speed(b, "root_law=1;line_arcs=1").empty());
  struct Mouth {
    const char* name;
    size_t      route;
    Vec3        start, corner, target;  // x and z; the heights are the route's own string's
    Vec3        end;   // where the hand line's arc ends: the corridor's centre line, heading along it
    Vec3        in;    // the heading into the arc (unit)
    Vec3        out;   // the heading out of it (unit)
  };
  const Mouth  mouths[] = {
      // route 0: east along the room's south side, then south through the doorway into the corridor (mesh free about x -16.66 to -16.16 at z -62.84)
      {"route 0, its last bend", 0, {-35.99f, 0, -62.54f}, {-16.84f, 0, -62.69f}, {-16.50f, 0, -70.50f}, {-16.41f, 0, -62.60f}, {1, 0, 0}, {0, 0, -1}},
      // route 2: east along the open floor, then north into the corridor (mesh free about x 39.64 to 41.39 above z -63.3)
      {"route 2, its corridor mouth", 2, {17.81f, 0, -66.49f}, {39.29f, 0, -63.39f}, {41.51f, 0, -47.84f}, {40.50f, 0, -63.30f}, {1, 0, 0}, {0, 0, 1}},
  };
  const auto rs = corner_routes(10);
  for (const Mouth& mo : mouths) {
    // the start and the target: the route's own string's points nearest the given x and z (their heights with them)
    Vec3 start = mo.start, target = mo.target;
    {
      Chaser probe;
      probe.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, SpeedModel{});
      const nav::Profile prof = profile_of(probe.body, "hunter");
      nav::Path          st;
      query.find_path(rs[mo.route].first, rs[mo.route].second, prof, st);
      float bs = 1e9f, bt = 1e9f;
      for (const auto& q : st.points) {
        const float ds = length(flat(q.pos - mo.start)), dt = length(flat(q.pos - mo.target));
        if (ds < bs) bs = ds, start = q.pos;
        if (dt < bt) bt = dt, target = q.pos;
      }
      std::printf("    %s: the route's string from (%.2f %.2f %.2f) to (%.2f %.2f %.2f); start (%.2f %.2f %.2f) (%.2f m off the given), target (%.2f %.2f %.2f)"
                  " (%.2f m off)\\n", mo.name, static_cast<double>(rs[mo.route].first.x), static_cast<double>(rs[mo.route].first.y),
                  static_cast<double>(rs[mo.route].first.z), static_cast<double>(rs[mo.route].second.x), static_cast<double>(rs[mo.route].second.y),
                  static_cast<double>(rs[mo.route].second.z), static_cast<double>(start.x), static_cast<double>(start.y), static_cast<double>(start.z),
                  static_cast<double>(bs), static_cast<double>(target.x), static_cast<double>(target.y), static_cast<double>(target.z), static_cast<double>(bt));
    }
    const Vec3 corner{mo.corner.x, start.y, mo.corner.z};
    // today's law and the arcs, walked from the start
    for (const auto& arm : {std::make_pair("today   ", SpeedModel{}), std::make_pair("the arcs", b)}) {
      const Walk     w = walk(arena, start, target, arm.second);
      const MouthRun r = mouth_gates(w.pos, w.speed, w.touched, corner);
      std::printf("    %s, %s: %.3f s between the gates, lowest %.2f m/s, exit tick %d, contacts %d, %s in %.2f s\\n", mo.name, arm.first,
                  static_cast<double>(r.secs), static_cast<double>(r.lowest), r.exit_tick, r.contacts, w.short_by < 0.5f ? "to the end" : "NOT to the end",
                  static_cast<double>(w.pos.size()) / 240.0);
    }
    {
      Chaser probe;
      probe.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
      probe.body.root_law = 1, probe.body.line_arcs = 1;
      const nav::Profile prof = profile_of(probe.body, "hunter");
      nav::Path          str;
      query.find_path(start, target, prof, str);
      ArcReport rep;
      root_arcs(str, query, prof, &rep);
      std::printf("      the arcs' plan from the start: %zu arcs", rep.arc_radius.size());
      for (size_t i = 0; i < rep.arc_radius.size(); ++i)
        std::printf(" [r %.2f centre (%.2f %.2f)]", static_cast<double>(rep.arc_radius[i]), static_cast<double>(rep.arc_centre[i].x),
                    static_cast<double>(rep.arc_centre[i].z));
      std::printf(", merged %d, runs to the solve %d\\n", rep.merged, rep.fallback_runs);
    }
    // the hand lines: straight from the start to the arc's start, the arc (centre = end - left(out) * R * turn sense), straight on to the target
    for (const float R : {1.0f, 1.5f, 2.0f, 2.5f, 2.8f, 3.0f, 3.5f, 4.0f}) {
      const float cr = mo.in.x * mo.out.z - mo.in.z * mo.out.x;  // + counter-clockwise in (x, z)
      const Vec3  left_out{-mo.out.z, 0.0f, mo.out.x}, left_in{-mo.in.z, 0.0f, mo.in.x};
      const float k = cr > 0.0f ? 1.0f : -1.0f;
      const Vec3  centre = mo.end + left_out * (k * R);
      const Vec3  a0 = centre - left_in * (k * R);  // the arc's start: heading mo.in there
      std::vector<Vec3> pts{start};
      const auto straight = [&](Vec3 to) {
        const Vec3  from = pts.back();
        const int   n = std::max(1, static_cast<int>(std::ceil(length(flat(to - from)) / 0.25f)));
        for (int i = 1; i <= n; ++i) pts.push_back(from + (to - from) * (static_cast<float>(i) / static_cast<float>(n)));
      };
      if (mo.route == 2) straight(Vec3{start.x + 0.75f, start.y, start.z + 0.30f});  // off the floor's south edge, which the string runs along
      straight(Vec3{a0.x, start.y, a0.z});
      const float ang0 = std::atan2(a0.z - centre.z, a0.x - centre.x), ang1 = std::atan2(mo.end.z - centre.z, mo.end.x - centre.x);
      float       sweep = (ang1 - ang0) * k;
      while (sweep < 0.0f) sweep += 6.2831853f;
      const int n = std::max(2, static_cast<int>(std::ceil(R * sweep / 0.25f)));
      for (int i = 1; i <= n; ++i) {
        const float a = ang0 + k * sweep * static_cast<float>(i) / static_cast<float>(n);
        pts.push_back(Vec3{centre.x + R * std::cos(a), start.y, centre.z + R * std::sin(a)});
      }
      straight(Vec3{mo.end.x + mo.out.x * 2.0f, start.y, mo.end.z + mo.out.z * 2.0f});
      straight(target);
      Chaser probe;
      probe.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, SpeedModel{});
      const nav::Profile prof = profile_of(probe.body, "hunter");
      int off = 0;
      Vec3 first_off{};
      for (const Vec3& q : pts) { const bool on = query.nearest(q, prof, {0.02f, 0.6f, 0.02f}).found; if (!on && !off) first_off = q; off += on ? 0 : 1; }
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
      std::vector<float>   speed;
      std::vector<Vec3>    at;
      std::vector<uint8_t> touched;
      for (int t = 0; t < 240 * 30 && !c.arrived; ++t) {
        step(c, query);
        speed.push_back(c.speed), at.push_back(c.pos), touched.push_back(c.touched ? 1 : 0);
      }
      const MouthRun r = mouth_gates(at, speed, touched, corner);
      std::printf("    %s, hand line R %.1f m (centre (%.2f %.2f)): %zu points, %d off the mesh (the first at (%.2f %.2f)); %.3f s between the gates, lowest %.2f m/s, exit tick %d,"
                  " contacts %d, %s in %.2f s\\n",
                  mo.name, static_cast<double>(R), static_cast<double>(centre.x), static_cast<double>(centre.z), pts.size(), off, static_cast<double>(first_off.x), static_cast<double>(first_off.z), static_cast<double>(r.secs),
                  static_cast<double>(r.lowest), r.exit_tick, r.contacts, c.arrived ? "to the end" : "NOT to the end", static_cast<double>(at.size()) / 240.0);
    }
  }
}
`.split('\n').join(nl);
fs.writeFileSync(W + L, s.replace(/\s*$/, '') + nl + row);
console.log('mouth read added');
