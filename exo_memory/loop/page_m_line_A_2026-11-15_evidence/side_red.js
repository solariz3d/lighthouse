// D677 M-line, the red commit for the side and the least-bending line (registration_side_and_least_bending.md): eb577fc's arc fitter removed
// (root_line back to a stub, the string), the room row amended by name, and the new rows. Either line ending.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const read = (f) => fs.readFileSync(W + f, 'utf8');
const edit = (f, a0, b0) => {
  let s = read(f);
  for (const e of ['\r\n', '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    fs.writeFileSync(W + f, s.replace(a, () => b));
    return;
  }
  throw new Error(f + ': anchor not found once: ' + a0.slice(0, 70));
};

// 1. chaser.cpp: the arc fitter out, the stub back.
{
  let s = read('chase/chaser.cpp');
  const start = s.indexOf('// M-line (registered: lighthouse exo_memory/loop/page_m_line_A_2026-11-15_evidence/registration_line_from_corridor.md; the page');
  const endMark = 'line.points.back().length = 0.0f;';
  const e0 = s.indexOf(endMark, start);
  if (start < 0 || e0 < 0) throw new Error('arc fitter not found');
  const close = s.indexOf('return line;', e0);
  const end = s.indexOf('}', close) + 1;
  const nl = s.includes('\r\n') ? '\r\n' : '\n';
  const stub = ['// M-line, red first for the least-bending line (lighthouse exo_memory/loop/page_m_line_A_2026-11-15_evidence/',
    '// registration_side_and_least_bending.md): a stub that returns the string unchanged. The arc fitter of eb577fc is removed (not kept, by ruling).',
    'nav::Path root_line(const nav::Path& string, const nav::Query&, const nav::Profile&) { return string; }'].join(nl);
  s = s.slice(0, start) + stub + s.slice(end);
  fs.writeFileSync(W + 'chase/chaser.cpp', s);
}

// 2. line_tests.cpp: the room row amended by name; the bends row prints the string's and the hand line's times; two new rows.
edit('chase/tests/line_tests.cpp',
`// The line itself: on each bend's plan, consecutive points no more than 0.3 m apart on its walked stretches, and every point on the mesh with
// at least 0.18 m of room either side (0.2 m registered, 2 cm for the mesh's own answer).`,
`// The line itself: on each bend's plan, consecutive points no more than 0.3 m apart on its walked stretches, and every point on the mesh with
// at least min(0.18 m, half the free width there) of room either side. AMENDED by name at the ruling on the stop (packet item 2: "the room from the
// walls is taken only where there is width for it"; registration_side_and_least_bending.md): before, 0.18 m everywhere, which a doorway narrower
// than the room cannot give.`);
edit('chase/tests/line_tests.cpp',
`      if (query.open_along(pts[i].pos, n, 0.2f, prof) < 0.18f || query.open_along(pts[i].pos, n * -1.0f, 0.2f, prof) < 0.18f) ++tight;`,
`      const float l = query.open_along(pts[i].pos, n, 6.0f, prof), r = query.open_along(pts[i].pos, n * -1.0f, 6.0f, prof);
      const float need = std::min(0.18f, 0.5f * (l + r) - 0.02f);
      if (l < need || r < need) ++tight;`);
edit('chase/tests/line_tests.cpp',
`                  " prediction (%.2f s, %.1f m/s) %s\\n",`,
`                  " prediction (%.2f s, %.1f m/s) %s; the string (4d0105b, way (b)) %s; the hand line (22 degrees) 0.321 s\\n",`);
edit('chase/tests/line_tests.cpp',
`                  static_cast<double>(e.pred_v), r.secs >= 0.0f && r.secs <= e.pred_s && r.lowest >= e.pred_v ? "met" : "NOT met");`,
`                  static_cast<double>(e.pred_v), r.secs >= 0.0f && r.secs <= e.pred_s && r.lowest >= e.pred_v ? "met" : "NOT met",
                  e.name[0] == '2' ? "1.029 s, 1.78" : e.name[0] == '4' ? "2.179 s, 0.22" : "1.079 s, 1.80");`);

let s = read('chase/tests/line_tests.cpp');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
s = s.replace(/\s*$/, '') + nl + `
// The side at pane E's 22 degree bend, at replans (registration_side_and_least_bending.md): walked with a replan to the target every 120 ticks
// (the run's 0.5 s), the body crosses z 42 within the open 2 m gap (x -74.6 to -72.4) and never comes within 0.3 m of the doorway at x -75
// ((-75.0, 40.5)). Registered: the open side taken, and not left.
DZ_TEST(mline_at_e_22_degree_bend_the_open_side_is_taken_and_not_left_at_a_replan) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena arena(p);
  nav::Query  query(arena.nav());
  const EBend& e = kEBends[0];
  SpeedModel b;
  DZ_CHECK(set_speed(b, "root_law=1").empty());
  Chaser c;
  c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
  c.body.root_law = 1;
  DZ_CHECK(place(c, query, e.door, heading_of(e.target - e.door)));
  DZ_CHECK(plan_to(c, query, e.target));
  int   replans = 0, gap_cross = 0, near_door = 0;
  Vec3  prev = c.pos;
  for (int t = 1; t < 240 * 30 && !c.arrived; ++t) {
    if (t % 120 == 0 && c.gait == Gait::Mesh) replans += plan_to(c, query, e.target) ? 1 : 0;
    step(c, query);
    if (prev.z < 42.0f && c.pos.z >= 42.0f) gap_cross += (c.pos.x >= -74.6f && c.pos.x <= -72.4f) ? 1 : 0;
    near_door += length(flat(c.pos - Vec3{-75.0f, c.pos.y, 40.5f})) < 0.3f ? 1 : 0;
    prev = c.pos;
  }
  std::printf("    replans %d; crossings of z 42 within the open gap %d; ticks within 0.3 m of the doorway at x -75 %d; arrived %s\\n", replans, gap_cross,
              near_door, c.arrived ? "yes" : "no");
  DZ_CHECK(c.arrived);
  DZ_CHECK(gap_cross >= 1);
  DZ_CHECK(near_door == 0);
}

// The cost (ruling item 4, printed and not gated): the wall-clock time of one plan_to for one root chaser, over pane E's three bends and the ten
// corner routes' starts, mean and largest.
DZ_TEST(mline_the_cost_of_one_line_at_one_replan_is_printed) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena arena(p);
  nav::Query  query(arena.nav());
  SpeedModel b;
  DZ_CHECK(set_speed(b, "root_law=1").empty());
  double total = 0.0, worst = 0.0;
  int    n = 0;
  for (const EBend& e : kEBends) {
    Chaser c;
    c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
    c.body.root_law = 1;
    if (!place(c, query, e.door, heading_of(e.target - e.door))) continue;
    for (int k = 0; k < 5; ++k) {
      const auto t0 = std::chrono::steady_clock::now();
      plan_to(c, query, e.target);
      const double us = std::chrono::duration<double, std::micro>(std::chrono::steady_clock::now() - t0).count();
      total += us, worst = std::max(worst, us), ++n;
    }
  }
  std::printf("    one plan_to for one root chaser: %d plans, mean %.0f us, largest %.0f us (made for every chaser every 0.5 s)\\n", n,
              n ? total / n : 0.0, worst);
  DZ_CHECK(n > 0);
}
`.split('\n').join(nl);
if (!s.includes('#include <chrono>')) s = s.replace('#include "chase/tests/chase_test_util.h"', '#include <chrono>' + nl + nl + '#include "chase/tests/chase_test_util.h"');
fs.writeFileSync(W + 'chase/tests/line_tests.cpp', s);
console.log('side red commit applied');
