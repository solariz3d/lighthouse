// SCRATCH (seat A, D677): the 45 degree bend, back to where the slide's value was set (the ruling at the third try's ring, item 3), on the base law
// 3f0cf4f (= cb9049c's chaser.cpp). A reading row, never committed.   node read45b.js add|remove
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m1-dz3/chase/tests/line_tests.cpp';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const marker = '// DIAG-A read45b begin';
if (process.argv[2] === 'remove') {
  const a = s.indexOf(nl + marker);
  if (a < 0) throw new Error('not present');
  fs.writeFileSync(f, s.slice(0, a) + nl);
  console.log('read45b removed');
  process.exit(0);
}
const row = `${marker}
DZ_TEST(diag_read45b_where_the_slide_was_set) {
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
  struct Row { int t; Vec3 pos, slide, wall; float speed, heading, aim, cosv; int branch, touched, brake; };
  std::vector<Row> rows;
  for (int t = 0; t < 240 * 30 && !c.arrived; ++t) {
    const Vec3 was = c.slide;
    step(c, query);
    Row r{};
    r.t = t, r.pos = c.pos, r.slide = c.slide, r.wall = c.wall_n, r.speed = c.speed, r.heading = c.heading * 57.29578f, r.aim = c.aim_dir * 57.29578f;
    r.branch = c.branch, r.touched = c.touched, r.brake = c.slide_brake, r.cosv = c.touch_cos;
    (void)was;
    rows.push_back(r);
  }
  size_t low = 0;
  for (size_t i = 0; i < rows.size(); ++i)
    if (length(flat(rows[i].pos - e.bend)) < 6.0f && rows[i].speed < rows[low].speed) low = i;
  size_t set = low;  // the last tick before the stop where the slide was set by a contact (touched), or began
  while (set > 0 && !(rows[set].touched && length(rows[set].slide) > 1e-4f)) --set;
  std::printf("    lowest %.3f m/s at tick %d; the slide's value was last set by a contact at tick %d\\n", static_cast<double>(rows[low].speed), rows[low].t,
              rows[set].t);
  const size_t from = set > 12 ? set - 12 : 0, to = std::min(rows.size(), set + 50);
  for (size_t i = from; i < to; ++i) {
    const Row&  r = rows[i];
    const float sd = length(r.slide) > 1e-4f ? std::atan2(r.slide.x, r.slide.z) * 57.29578f : 0.0f;
    std::printf("    t %4d pos %7.2f %7.2f speed %5.2f heading %7.1f slide_dir %7.1f |slide| %.2f aim %6.1f touched %d cos %.3f branch %d brake %d"
                " wall_n (%.2f %.2f)\\n",
                r.t, static_cast<double>(r.pos.x), static_cast<double>(r.pos.z), static_cast<double>(r.speed), static_cast<double>(r.heading),
                static_cast<double>(sd), static_cast<double>(length(r.slide)), static_cast<double>(r.aim), r.touched, static_cast<double>(r.cosv), r.branch,
                r.brake, static_cast<double>(r.wall.x), static_cast<double>(r.wall.z));
  }
}
`;
s = s.replace(/\s*$/, '') + nl + row.split('\n').join(nl);
fs.writeFileSync(f, s);
console.log('read45b added');
