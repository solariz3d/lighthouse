// SCRATCH (seat A, D677): the solve's two prints (the 90's least radius over the whole bend; the plan's speed beside the body's at the slowest tick)
// and a dump of check 2's red ticks. Never committed.   node diag_solve.js add|remove
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const lt = W + 'chase/tests/line_tests.cpp', ft = W + 'chase/tests/feel_tests.cpp';
const marker = '// DIAG-A solve begin';
const dumpA = `        if (can > 1e-3f) w.far_worst = std::min(w.far_worst, along / can), w.far_worst_grip = std::min(w.far_worst_grip, along / g);`;
const dumpB = dumpA + `
        if (can > 1e-3f && along < -0.5f * can)  // DIAG-A solve
          std::printf("DIAG red tick %zu: pos (%.2f %.2f) speed %.3f -> %.3f vb (%.3f %.3f) va (%.3f %.3f) aim %.1f want %.2f dv (%.3f %.3f) wall_n (%.2f %.2f)"
                      " touched %d branch %d gait %d along %.3f can %.3f\\n", w.speed.size(), static_cast<double>(c.pos.x), static_cast<double>(c.pos.z),
                      static_cast<double>(speed_was), static_cast<double>(c.speed), static_cast<double>(vb.x), static_cast<double>(vb.z), static_cast<double>(va.x),
                      static_cast<double>(va.z), static_cast<double>(c.aim_dir * 57.29578f), static_cast<double>(c.plan_want), static_cast<double>(dv.x),
                      static_cast<double>(dv.z), static_cast<double>(c.wall_n.x), static_cast<double>(c.wall_n.z), c.touched, c.branch, static_cast<int>(c.gait),
                      static_cast<double>(along), static_cast<double>(can));  // DIAG-A solve`;
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
if (process.argv[2] === 'remove') {
  swap(ft, dumpB, dumpA);
  let t = fs.readFileSync(lt, 'utf8');
  const nl = t.includes('\r\n') ? '\r\n' : '\n';
  const a = t.indexOf(nl + marker);
  if (a < 0) throw new Error('row not present');
  fs.writeFileSync(lt, t.slice(0, a) + nl);
  console.log('diag removed');
  process.exit(0);
}
swap(ft, dumpA, dumpB);
let t = fs.readFileSync(lt, 'utf8');
const nl = t.includes('\r\n') ? '\r\n' : '\n';
t = t.replace(/\s*$/, '') + nl + `${marker}
DZ_TEST(diag_solve_the_90s_least_radius_and_the_slowest_tick) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena  arena(p);
  nav::Query   query(arena.nav());
  for (const EBend& e : kEBends) {
    SpeedModel b;
    DZ_CHECK(set_speed(b, "root_law=1").empty());
    Chaser c;
    c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
    c.body.root_law = 1;
    DZ_CHECK(place(c, query, e.door, heading_of(e.target - e.door)));
    DZ_CHECK(plan_to(c, query, e.target));
    const auto& pts = c.path.points;
    float rmin = 1e9f;
    Vec3  rat{};
    for (size_t i = 2; i + 2 < pts.size(); ++i) {
      const Vec3  a = pts[i - 2].pos, m = pts[i].pos, q = pts[i + 2].pos;
      const float ab = length(flat(m - a)), bc = length(flat(q - m)), ca = length(flat(q - a));
      const float cr = std::fabs((m.x - a.x) * (q.z - a.z) - (m.z - a.z) * (q.x - a.x));
      if (cr > 1e-6f && (ab * bc * ca) / (2.0f * cr) < rmin) rmin = (ab * bc * ca) / (2.0f * cr), rat = m;
    }
    float slow = 1e9f, slow_want = 0.0f;
    Vec3  slow_at{};
    int   slow_t = -1;
    for (int t = 0; t < 240 * 30 && !c.arrived; ++t) {
      step(c, query);
      if (length(flat(c.pos - e.bend)) < 6.0f && c.speed < slow) slow = c.speed, slow_want = c.plan_want, slow_at = c.pos, slow_t = t;
    }
    std::printf("    %s degrees: the line's least radius over the whole path %.2f m at (%.2f %.2f) (%.2f m from the bend's point); the slowest tick within 6 m"
                " of the bend %d at (%.2f %.2f): the body %.2f m/s, the plan %.2f m/s\\n", e.name, static_cast<double>(rmin), static_cast<double>(rat.x),
                static_cast<double>(rat.z), static_cast<double>(length(flat(rat - e.bend))), slow_t, static_cast<double>(slow_at.x), static_cast<double>(slow_at.z),
                static_cast<double>(slow), static_cast<double>(slow_want));
  }
}
`.split('\n').join(nl);
fs.writeFileSync(lt, t);
console.log('diag added');
