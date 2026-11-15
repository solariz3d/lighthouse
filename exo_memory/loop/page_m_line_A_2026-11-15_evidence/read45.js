// SCRATCH (seat A, D677): the 45 degree bend's stop, tick by tick, on a-mline cb9049c. A reading row, never committed.   node read45.js add|remove
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m1-dz3/chase/tests/line_tests.cpp';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const marker = '// DIAG-A read45 begin';
if (process.argv[2] === 'remove') {
  const a = s.indexOf(nl + marker);
  if (a < 0) throw new Error('not present');
  s = s.slice(0, a) + nl;
  fs.writeFileSync(f, s);
  console.log('read45 removed');
  process.exit(0);
}
const row = `${marker}
DZ_TEST(diag_read45_the_45_degree_bend_tick_by_tick) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena  arena(p);
  nav::Query   query(arena.nav());
  const EBend& e = kEBends[1];
  SpeedModel   b;
  DZ_CHECK(set_speed(b, "root_law=1").empty());
  Chaser c;
  c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
  c.body.root_law = 1;
  DZ_CHECK(place(c, query, e.door, heading_of(e.target - e.door)));
  DZ_CHECK(plan_to(c, query, e.target));
  const nav::Profile prof = profile_of(c.body, "hunter");
  struct Row { int t; Vec3 pos; float speed, heading, want, aim, slide, dpath, rad, room; int branch, touched, brake; size_t leg; };
  std::vector<Row> rows;
  for (int t = 0; t < 240 * 30 && !c.arrived; ++t) {
    step(c, query);
    Row r{};
    r.t = t, r.pos = c.pos, r.speed = c.speed, r.heading = c.heading * 57.29578f, r.want = c.plan_want, r.aim = c.aim_dir * 57.29578f;
    r.slide = length(c.slide), r.branch = c.branch, r.touched = c.touched, r.brake = c.slide_brake, r.leg = c.leg;
    // the line near the body: the nearest point, and the radius through it and the points 2 either side; the room either side there
    const auto& pts = c.path.points;
    size_t best = 0;
    float  bd = 1e30f;
    for (size_t i = 0; i < pts.size(); ++i) {
      const float d = length(flat(pts[i].pos - c.pos));
      if (d < bd) bd = d, best = i;
    }
    r.dpath = bd, r.rad = -1.0f, r.room = -1.0f;
    if (best >= 2 && best + 2 < pts.size()) {
      const Vec3  a = pts[best - 2].pos, m = pts[best].pos, q = pts[best + 2].pos;
      const float ab = length(flat(m - a)), bc = length(flat(q - m)), ca = length(flat(q - a));
      const float cr = std::fabs((m.x - a.x) * (q.z - a.z) - (m.z - a.z) * (q.x - a.x));
      r.rad = cr > 1e-6f ? (ab * bc * ca) / (2.0f * cr) : 999.0f;
      const Vec3 d = flat(q - a);
      if (length(d) > 1e-4f) {
        const Vec3 n{-d.z / length(d), 0.0f, d.x / length(d)};
        r.room = std::min(query.open_along(m, n, 6.0f, prof), query.open_along(m, n * -1.0f, 6.0f, prof));
      }
    }
    rows.push_back(r);
  }
  size_t low = 0;
  for (size_t i = 0; i < rows.size(); ++i)
    if (length(flat(rows[i].pos - e.bend)) < 6.0f && rows[i].speed < rows[low].speed) low = i;
  std::printf("    lowest %.3f m/s at tick %d (%.2f %.2f); %zu ticks walked; path points %zu\\n", static_cast<double>(rows[low].speed), rows[low].t,
              static_cast<double>(rows[low].pos.x), static_cast<double>(rows[low].pos.z), rows.size(), c.path.points.size());
  const size_t from = low > 60 ? low - 60 : 0, to = std::min(rows.size(), low + 61);
  for (size_t i = from; i < to; i += (i + 8 < low || i > low + 8) ? 3 : 1) {
    const Row& r = rows[i];
    std::printf("    t %4d pos %7.2f %7.2f speed %5.2f want %5.2f heading %7.1f aim %7.1f branch %d touched %d slide %.2f brake %d leg %zu dpath %.2f"
                " line radius %.2f room %.2f\\n",
                r.t, static_cast<double>(r.pos.x), static_cast<double>(r.pos.z), static_cast<double>(r.speed), static_cast<double>(r.want),
                static_cast<double>(r.heading), static_cast<double>(r.aim), r.branch, r.touched, static_cast<double>(r.slide), r.brake, r.leg,
                static_cast<double>(r.dpath), static_cast<double>(r.rad), static_cast<double>(r.room));
  }
}
`;
s = s.replace(/\s*$/, '') + nl + row.split('\n').join(nl);
fs.writeFileSync(f, s);
console.log('read45 added');
