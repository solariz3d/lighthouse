// SCRATCH (seat A, D677): the passes check (the ruling at the ring for the two reads): bend_least at 1x, 100x and 1000x its passes on the 90 degree
// bend. Never committed.   node passes_check.js add|remove
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const cf = W + 'chase/chaser.cpp', tf = W + 'chase/tests/line_tests.cpp';
const swap = (f, a0, b0) => {
  let s = fs.readFileSync(f, 'utf8');
  for (const e of ['\r\n', '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    fs.writeFileSync(f, s.replace(a, () => b));
    return;
  }
  throw new Error(f + ': anchor not found once: ' + a0.slice(0, 60));
};
const law0 = `constexpr int   kBendPasses = 600;`;
const law1 = `}  // namespace
int g_bend_passes = 600;  // DIAG-A passes check, never committed
namespace {`;
const use0 = `  for (int pass = 0; pass < kBendPasses; ++pass)`;
const use1 = `  for (int pass = 0; pass < g_bend_passes; ++pass)  // DIAG-A`;
const marker = '// DIAG-A passes begin';
if (process.argv[2] === 'remove') {
  swap(cf, law1, law0);
  swap(cf, use1, use0);
  let t = fs.readFileSync(tf, 'utf8');
  const nl = t.includes('\r\n') ? '\r\n' : '\n';
  const a = t.indexOf(nl + marker);
  if (a < 0) throw new Error('row not present');
  fs.writeFileSync(tf, t.slice(0, a) + nl);
  console.log('passes check removed');
  process.exit(0);
}
swap(cf, law0, law1);
swap(cf, use0, use1);
let t = fs.readFileSync(tf, 'utf8');
const nl = t.includes('\r\n') ? '\r\n' : '\n';
t = t.replace(/\s*$/, '') + nl + `${marker}
namespace dz::chase { extern int g_bend_passes; }
DZ_TEST(diag_passes_the_90_degree_bend_at_more_passes) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena  arena(p);
  nav::Query   query(arena.nav());
  const EBend& e = kEBends[2];
  SpeedModel   b;
  DZ_CHECK(set_speed(b, "root_law=1").empty());
  Chaser probe;
  probe.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
  probe.body.root_law = 1;
  const nav::Profile prof = profile_of(probe.body, "hunter");
  nav::Path          str;
  query.find_path(e.door, e.target, prof, str);
  for (const int passes : {600, 60000, 600000}) {
    g_bend_passes = passes;
    const auto      t0 = std::chrono::steady_clock::now();
    const nav::Path line = root_line(str, query, prof);
    const double    us = std::chrono::duration<double, std::micro>(std::chrono::steady_clock::now() - t0).count();
    const auto&     pts = line.points;
    float           rmin = 1e9f, offmax = 0.0f;
    for (size_t i = 2; i + 2 < pts.size(); ++i) {
      if (length(flat(pts[i].pos - e.bend)) > 3.0f) continue;
      const Vec3  a = pts[i - 2].pos, m = pts[i].pos, q = pts[i + 2].pos;
      const float ab = length(flat(m - a)), bc = length(flat(q - m)), ca = length(flat(q - a));
      const float cr = std::fabs((m.x - a.x) * (q.z - a.z) - (m.z - a.z) * (q.x - a.x));
      if (cr > 1e-6f) rmin = std::min(rmin, (ab * bc * ca) / (2.0f * cr));
    }
    for (const nav::PathPoint& q : pts) {  // the greatest distance from the string
      float best = 1e9f;
      for (size_t k = 0; k + 1 < str.points.size(); ++k) {
        const Vec3  s0 = str.points[k].pos, s1 = str.points[k + 1].pos, ab = flat(s1 - s0);
        const float l2 = dot(ab, ab);
        const float u = l2 > 1e-8f ? std::min(1.0f, std::max(0.0f, dot(flat(q.pos - s0), ab) / l2)) : 0.0f;
        best = std::min(best, length(flat(q.pos - (s0 + (s1 - s0) * u))));
      }
      offmax = std::max(offmax, best);
    }
    const BendRun r = run_bend(arena, e.door, e.bend, e.target, b);
    std::printf("    passes %d: the line in %.0f us; the corner's least radius within 3 m %.2f m; the greatest offset from the string %.2f m; the bend %.3f s,"
                " lowest %.2f m/s, exit gate at tick %d (today's law 0.846 s, tick 871)\\n", passes, us, static_cast<double>(rmin), static_cast<double>(offmax),
                static_cast<double>(r.secs), static_cast<double>(r.lowest), r.exit_tick);
  }
  g_bend_passes = 600;
}
`.split('\n').join(nl);
fs.writeFileSync(tf, t);
console.log('passes check added');
