// SCRATCH (seat A, D677): a hand line through pane E's 90 degree bend in the stand-in, as the judge of the place (the ruling at the ring for the
// side, item 1). On a-mline 4b03985. A reading row, never committed.  add|remove
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m1-dz3/chase/tests/line_tests.cpp';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const marker = '// DIAG-A hand90 begin';
if (process.argv[2] === 'remove') {
  const a = s.indexOf(nl + marker);
  if (a < 0) throw new Error('not present');
  fs.writeFileSync(f, s.slice(0, a) + nl);
  console.log('hand90 removed');
  process.exit(0);
}
const row = `${marker}
DZ_TEST(diag_hand90_a_hand_line_through_the_90_degree_bend) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena  arena(p);
  nav::Query   query(arena.nav());
  const EBend& e = kEBends[2];
  // By hand from the map (r90.txt): the corridor's north side, a right arc of R tangent to it and to the south corridor's east side (room 0.2 m
  // from the mesh's edges at z -24.4 and x -9.5), then straights through the small room and down the west corridor to the target.
  for (const float r : {5.0f, 6.0f, 6.5f}) {
    const float y = e.bend.y;
    const Vec3  s1{-9.7f - r, y, -24.6f};
    std::vector<Vec3> pts{e.door};
    straight_to(pts, s1);
    float h = 1.5707963f;  // east
    arc(pts, h, r, 1.5707963f);  // a right turn, east to south
    straight_to(pts, Vec3{-10.6f, y, -31.6f});
    straight_to(pts, Vec3{-13.4f, y, -31.9f});
    straight_to(pts, Vec3{-13.4f, y, -33.4f});
    straight_to(pts, e.target);
    Chaser probe;
    probe.body = make_body(archetype(Kind::Hunter).limits, 8.0f, 1.0f, SpeedModel{});
    const nav::Profile prof = profile_of(probe.body, "hunter");
    int off = 0;
    for (const Vec3& q : pts) off += query.nearest(q, prof, {0.02f, 0.6f, 0.02f}).found ? 0 : 1;
    SpeedModel b;
    DZ_CHECK(set_speed(b, "root_law=1").empty());
    Chaser c;
    c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
    c.body.root_law = 1;
    DZ_CHECK(place(c, query, e.door, heading_of(s1 - e.door)));
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
    std::vector<float> speed;
    std::vector<Vec3>  at;
    uint32_t           touched = 0;
    for (int t = 0; t < 240 * 30 && !c.arrived; ++t) {
      step(c, query);
      speed.push_back(c.speed), at.push_back(c.pos);
      touched += c.touched;
    }
    int   in = -1, out = -1;
    float lowest = 1e9f, closest = 1e9f;
    for (size_t t = 0; t < at.size(); ++t) {
      const float d = length(flat(at[t] - e.bend));
      closest = std::min(closest, d);
      if (in < 0 && d <= 2.0f) in = static_cast<int>(t);
      if (in >= 0 && out < 0 && d > 2.0f && d > closest + 0.01f) out = static_cast<int>(t);
      if (in >= 0 && out < 0) lowest = std::min(lowest, speed[t]);
    }
    std::printf("    hand line R %.1f m: %zu samples, %d off the mesh; %s; entry %.2f, lowest %.2f m/s, %.3f s between the gates (passed %.2f m); exit tick %d;"
                " contacts %u (today's law here 0.846 s)\\n",
                static_cast<double>(r), pts.size(), off, c.arrived ? "to the end" : "NOT to the end", in >= 0 ? static_cast<double>(speed[static_cast<size_t>(in)]) : -1.0,
                static_cast<double>(lowest < 1e8f ? lowest : -1.0f), in >= 0 && out >= 0 ? static_cast<double>(out - in) / 240.0 : -1.0,
                static_cast<double>(closest), out, touched);
  }
}
`;
s = s.replace(/\s*$/, '') + nl + row.split('\n').join(nl);
fs.writeFileSync(f, s);
console.log('hand90 added');
