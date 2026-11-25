// SCRATCH (seat A, D677, never committed): the gate at each grip (the ring for item 2, item 4): one plan_to for one root chaser with the arcs, over
// pane E's three bends, five plans each, at grip 1.0, 1.3, 1.6 and 2.0. Removed by writing the committed line_tests.cpp back.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const L = 'chase/tests/line_tests.cpp';
const s = fs.readFileSync(W + L, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const row = `
DZ_TEST(diag_gate_by_grip) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena arena(p);
  nav::Query  query(arena.nav());
  for (const char* g : {"1.0", "1.3", "1.6", "2.0"}) {
    SpeedModel b;
    DZ_CHECK(set_speed(b, std::string("root_law=1;line_arcs=1;grip_mu=") + g).empty());
    double total = 0.0, worst = 0.0;
    int    n = 0;
    for (const EBend& e : kEBends) {
      Chaser c;
      c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
      c.body.root_law = 1, c.body.line_arcs = 1;
      if (!place(c, query, e.door, heading_of(e.target - e.door))) continue;
      for (int k = 0; k < 5; ++k) {
        const auto t0 = std::chrono::steady_clock::now();
        plan_to(c, query, e.target);
        const double us = std::chrono::duration<double, std::micro>(std::chrono::steady_clock::now() - t0).count();
        total += us, worst = std::max(worst, us), ++n;
      }
    }
    std::printf("    grip %s: one plan_to with the arcs, %d plans, mean %.0f us, largest %.0f us\\n", g, n, n ? total / n : 0.0, worst);
  }
}
`.split('\n').join(nl);
fs.writeFileSync(W + L, s.replace(/\s*$/, '') + nl + row);
console.log('gate by grip added');
