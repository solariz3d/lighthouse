// D677 M-line, red first (the ruling at the ring for the two reads, git-blob 1a5b2e86, items 1 and 2): the stand-in's bends rows replan every half
// second as the chase does (run_bend amended by name), and a row for section 2's registered line: with replans, the arcs' line at the 90's apex is
// the same at every plan from the door to the bend, and the 90's lowest no less than the one-plan 4.29 m/s. chase/tests/line_tests.cpp only.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const L = 'chase/tests/line_tests.cpp';
let s = fs.readFileSync(W + L, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const rep = (a0, b0) => {
  const a = a0.split('\n').join(nl), b = b0.split('\n').join(nl);
  if (s.split(a).length - 1 !== 1) throw new Error('anchor not found once: ' + a0.slice(0, 80));
  s = s.replace(a, () => b);
};
rep(`// A body on the root planned from pane E's door to its target (no replans), stepped to the end; the gates as the scripted bends row's.`,
`// A body on the root planned from pane E's door to its target, stepped to the end; the gates as the scripted bends row's. AMENDED by name at the ring
// for the two reads (lighthouse packet_m_line_A_2026-11-15.md, git-blob 1a5b2e86, item 1): it replans to the target every 120 ticks (half a
// second), as the chase does and as the side row already did; before, it planned once from the door, which no chase does, so every bend figure
// read through it was a hunter that never replans. The path kept in the result is the first plan's.`);
rep(`  for (int t = 0; t < 240 * 30 && !c.arrived; ++t) {
    const float was = c.speed;
    step(c, query);
    speed.push_back(c.speed), at.push_back(c.pos);
    r.contacts += c.touched && was > 0.3f ? 1u : 0u;
  }`,
`  for (int t = 0; t < 240 * 30 && !c.arrived; ++t) {
    if (t > 0 && t % 120 == 0 && c.gait == Gait::Mesh) plan_to(c, query, target);
    const float was = c.speed;
    step(c, query);
    speed.push_back(c.speed), at.push_back(c.pos);
    r.contacts += c.touched && was > 0.3f ? 1u : 0u;
  }`);
const row = `
// Section 2's line (the page's section 2, registered 07:59; the ring for the two reads, item 2): on the arcs with a replan every 120 ticks, at every
// plan from pane E's 90 degree door until the body is within 2 m of the bend, the line's point nearest the bend stays where the first plan put it
// (every point of the line within 5 m of the bend within 5 cm of the first plan's line: the same arc there), and the body's lowest between the bend's 2 m gates is no less than the one-plan 4.29 m/s (2a51143, planned
// once). Printed for each plan: its tick, the body's distance from the bend, the line's point nearest the bend and how far it moved.
DZ_TEST(mline_arcs_with_replans_the_90s_line_at_the_bend_is_the_same_at_every_plan) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena  arena(p);
  nav::Query   query(arena.nav());
  const EBend& e = kEBends[2];
  SpeedModel   b;
  DZ_CHECK(set_speed(b, "root_law=1;line_arcs=1").empty());
  Chaser c;
  c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, b.ref_speed, 1.0f, b);
  c.body.root_law = 1, c.body.line_arcs = 1;
  DZ_CHECK(place(c, query, e.door, heading_of(e.target - e.door)));
  DZ_CHECK(plan_to(c, query, e.target));
  // the farthest any point of a plan's line within 5 m of the bend lies from the first plan's line: the same arc there gives about zero
  const std::vector<nav::PathPoint> first = c.path.points;
  const auto off_first = [&](Vec3 q) {
    float bd = 1e9f;
    for (size_t i = 0; i + 1 < first.size(); ++i) {
      const Vec3  a = flat(first[i].pos), d = flat(first[i + 1].pos) - a, w = flat(q) - a;
      const float l2 = dot(d, d), t = l2 > 1e-8f ? std::max(0.0f, std::min(1.0f, dot(w, d) / l2)) : 0.0f;
      bd = std::min(bd, length(w - d * t));
    }
    return bd;
  };
  const auto apart = [&](const nav::Path& path, int& n) {
    float worst = 0.0f;
    n = 0;
    for (const nav::PathPoint& q : path.points)
      if (length(flat(q.pos - e.bend)) <= 5.0f) worst = std::max(worst, off_first(q.pos)), ++n;
    return worst;
  };
  float moved = 0.0f, lowest = 1e9f, closest = 1e9f;
  int   plans = 1;
  bool  near = false, out = false;
  std::printf("    plan at tick 0: the body %.2f m from the bend\\n", static_cast<double>(length(flat(c.pos - e.bend))));
  for (int t = 1; t < 240 * 30 && !c.arrived; ++t) {
    if (t % 120 == 0 && c.gait == Gait::Mesh) {
      plan_to(c, query, e.target);
      if (!near) {
        int         n = 0;
        const float a = apart(c.path, n);
        moved = std::max(moved, a), ++plans;
        std::printf("    plan at tick %d: the body %.2f m from the bend; its line within 5 m of the bend (%d points) lies at most %.2f m from the first plan's\\n",
                    t, static_cast<double>(length(flat(c.pos - e.bend))), n, static_cast<double>(a));
      }
    }
    step(c, query);
    const float d = length(flat(c.pos - e.bend));
    closest = std::min(closest, d);
    if (d <= 2.0f) near = true;
    if (near && !out && d > 2.0f && d > closest + 0.01f) out = true;
    if (near && !out) lowest = std::min(lowest, c.speed);
  }
  std::printf("    %d plans before the bend; its line within 5 m of the bend lay at most %.2f m from the first plan's; the lowest between the 2 m gates %.2f m/s (the one-plan figure 4.29)\\n",
              plans, static_cast<double>(moved), static_cast<double>(lowest));
  DZ_CHECK(near);
  DZ_CHECK(moved <= 0.05f);
  DZ_CHECK(lowest >= 4.29f);
}
`;
s = s.replace(/\s*$/, '') + nl + row.split('\n').join(nl);
fs.writeFileSync(W + L, s);
console.log('replan red applied');
