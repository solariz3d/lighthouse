// SCRATCH (seat A, D677): pane E's 90 degree bend in the stand-in, mapped as the 22 was, with the string, the line, and the body tick by tick near
// the apex (the line's radius and room at it, the plan's speed, the body's). On a-mline 4b03985. A reading row, never committed.  add|remove
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m1-dz3/chase/tests/line_tests.cpp';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const marker = '// DIAG-A read90 begin';
if (process.argv[2] === 'remove') {
  const a = s.indexOf(nl + marker);
  if (a < 0) throw new Error('not present');
  fs.writeFileSync(f, s.slice(0, a) + nl);
  console.log('read90 removed');
  process.exit(0);
}
const row = `${marker}
DZ_TEST(diag_read90_the_90_degree_bend_mapped) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena  arena(p);
  nav::Query   query(arena.nav());
  const EBend& e = kEBends[2];
  Chaser       probe;
  probe.body = make_body(archetype(Kind::Hunter).limits, 8.0f, 1.0f, SpeedModel{});
  const nav::Profile prof = profile_of(probe.body, "hunter");
  const float y = e.bend.y;
  std::printf("    x from -24.0 (left) to -4.0 by 0.25; z from -18.0 (top) down to -38.0 by 0.25; '#' off the mesh\\n");
  for (float z = -18.0f; z >= -38.0f - 1e-3f; z -= 0.25f) {
    std::string line;
    for (float x = -24.0f; x <= -4.0f + 1e-3f; x += 0.25f) line += query.nearest({x, y, z}, prof, {0.02f, 0.6f, 0.02f}).found ? '.' : '#';
    std::printf("    %6.2f %s\\n", static_cast<double>(z), line.c_str());
  }
  {
    nav::Path str;
    query.find_path(e.door, e.target, prof, str);
    std::printf("    today's string:");
    for (const nav::PathPoint& q : str.points) std::printf(" (%.2f %.2f)", static_cast<double>(q.pos.x), static_cast<double>(q.pos.z));
    std::printf("\\n");
  }
  SpeedModel b;
  DZ_CHECK(set_speed(b, "root_law=1").empty());
  Chaser c;
  c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
  c.body.root_law = 1;
  DZ_CHECK(place(c, query, e.door, heading_of(e.target - e.door)));
  DZ_CHECK(plan_to(c, query, e.target));
  const nav::Profile rprof = profile_of(c.body, "hunter");
  const auto&        pts = c.path.points;
  std::printf("    the line (%zu points), within 8 m of the bend's point:", pts.size());
  for (const nav::PathPoint& q : pts)
    if (length(flat(q.pos - e.bend)) < 8.0f) std::printf(" (%.2f %.2f)", static_cast<double>(q.pos.x), static_cast<double>(q.pos.z));
  std::printf("\\n");
  for (int t = 0; t < 240 * 30 && !c.arrived; ++t) {
    step(c, query);
    if (length(flat(c.pos - e.bend)) > 6.0f || t % 4 != 0) continue;
    size_t best = 0;
    float  bd = 1e30f;
    for (size_t i = 0; i < pts.size(); ++i) {
      const float d = length(flat(pts[i].pos - c.pos));
      if (d < bd) bd = d, best = i;
    }
    float rad = -1.0f, room = -1.0f;
    if (best >= 2 && best + 2 < pts.size()) {
      const Vec3  a = pts[best - 2].pos, m = pts[best].pos, q = pts[best + 2].pos;
      const float ab = length(flat(m - a)), bc = length(flat(q - m)), ca = length(flat(q - a));
      const float cr = std::fabs((m.x - a.x) * (q.z - a.z) - (m.z - a.z) * (q.x - a.x));
      rad = cr > 1e-6f ? (ab * bc * ca) / (2.0f * cr) : 999.0f;
      const Vec3 d = flat(q - a);
      if (length(d) > 1e-4f) {
        const Vec3 n{-d.z / length(d), 0.0f, d.x / length(d)};
        room = std::min(query.open_along(m, n, 6.0f, rprof), query.open_along(m, n * -1.0f, 6.0f, rprof));
      }
    }
    std::printf("    t %4d pos %7.2f %7.2f speed %5.2f want %5.2f heading %7.1f off the line %.2f line radius %6.2f room %.2f touched %d slide %.2f\\n", t,
                static_cast<double>(c.pos.x), static_cast<double>(c.pos.z), static_cast<double>(c.speed), static_cast<double>(c.plan_want),
                static_cast<double>(c.heading * 57.29578f), static_cast<double>(bd), static_cast<double>(rad), static_cast<double>(room), c.touched,
                static_cast<double>(length(c.slide)));
  }
}
`;
s = s.replace(/\s*$/, '') + nl + row.split('\n').join(nl);
fs.writeFileSync(f, s);
console.log('read90 added');
