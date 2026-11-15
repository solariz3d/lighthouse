// SCRATCH (seat A, D677): where one plan's time goes, on a-mline cb9049c. A timing row, never committed.   node timeparts.js add|remove
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m1-dz3/chase/tests/line_tests.cpp';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const marker = '// DIAG-A timeparts begin';
if (process.argv[2] === 'remove') {
  const a = s.indexOf(nl + marker);
  if (a < 0) throw new Error('not present');
  fs.writeFileSync(f, s.slice(0, a) + nl);
  console.log('timeparts removed');
  process.exit(0);
}
const row = `${marker}
DZ_TEST(diag_timeparts_where_one_plan_goes) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena arena(p);
  nav::Query  query(arena.nav());
  SpeedModel  b;
  DZ_CHECK(set_speed(b, "root_law=1").empty());
  using clk = std::chrono::steady_clock;
  const auto us = [](clk::time_point a, clk::time_point z) { return std::chrono::duration<double, std::micro>(z - a).count(); };
  for (const EBend& e : kEBends) {
    Chaser c;
    c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
    c.body.root_law = 1;
    if (!place(c, query, e.door, heading_of(e.target - e.door))) continue;
    const nav::Profile prof = profile_of(c.body, "hunter");
    double t_find = 0, t_line = 0, t_widths = 0, t_plan = 0;
    size_t samples = 0;
    for (int k = 0; k < 5; ++k) {
      nav::Path path;
      auto a = clk::now();
      query.find_path(c.pos, e.target, prof, path);
      auto z = clk::now();
      t_find += us(a, z);
      a = clk::now();
      const nav::Path line = root_line(path, query, prof);
      z = clk::now();
      t_line += us(a, z);
      samples = line.points.size();
      a = clk::now();
      for (size_t i = 1; i + 1 < line.points.size(); ++i) {
        const Vec3 d = flat(line.points[i + 1].pos - line.points[i - 1].pos);
        if (length(d) < 1e-5f) continue;
        const Vec3 n{-d.z / length(d), 0.0f, d.x / length(d)};
        (void)query.open_along(line.points[i].pos, n, 6.0f, prof);
        (void)query.open_along(line.points[i].pos, n * -1.0f, 6.0f, prof);
      }
      z = clk::now();
      t_widths += us(a, z);
      a = clk::now();
      plan_to(c, query, e.target);
      z = clk::now();
      t_plan += us(a, z);
    }
    std::printf("    %s degrees: %zu samples; per plan (mean of 5): find_path %.0f us, root_line %.0f us (of it the widths, %zu x 2 open_along, about %.0f us),"
                " the whole plan_to %.0f us\\n", e.name, samples, t_find / 5, t_line / 5, samples, t_widths / 5, t_plan / 5);
  }
}
`;
s = s.replace(/\s*$/, '') + nl + row.split('\n').join(nl);
fs.writeFileSync(f, s);
console.log('timeparts added');
