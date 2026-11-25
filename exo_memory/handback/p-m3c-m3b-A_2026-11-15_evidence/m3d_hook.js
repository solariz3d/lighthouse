// SCRATCH (seat A, D677 M3d): the count's hook in Run::replan and a routes row, in a throwaway tree only.   node m3d_hook.js <tree/>
const fs = require('fs');
const W = process.argv[2];
const H = 'C:/Users/nname/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d676/flip_count.h';
const edit = (f, a0, b0) => {
  let s = fs.readFileSync(W + f, 'utf8');
  for (const e of ['\r\n', '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    fs.writeFileSync(W + f, s.replace(a, () => b));
    return;
  }
  throw new Error(f + ': anchor not found once: ' + a0.slice(0, 60));
};
edit('chase/run.cpp', `#include "chase/run.h"
`, `#include "chase/run.h"
#include "${H}"  // SCRATCH M3d
`);
edit('chase/run.cpp', `void Run::replan(Agent& a, Vec3 target) {
  ++cost_.paths;
  --plans_left_;
  if (!plan_to(a.body, *query_, target)) ++cost_.paths_failed;`,
`void Run::replan(Agent& a, Vec3 target) {
  ++cost_.paths;
  --plans_left_;
  const nav::Path m3d_old = a.body.path;  // SCRATCH M3d
  const Vec3      m3d_body = a.body.pos;  // SCRATCH M3d
  if (!plan_to(a.body, *query_, target)) ++cost_.paths_failed;
  if (a.body.kind == Kind::Hunter && a.body.has_path) m3d::check(*query_, profile_of(a.body.body, "hunter"), m3d_body, m3d_old, a.body.path, tick_, "run");  // SCRATCH M3d`);
let t = fs.readFileSync(W + 'chase/tests/feel_tests.cpp', 'utf8');
const nl = t.includes('\r\n') ? '\r\n' : '\n';
t = t.replace(/\s*$/, '') + nl + `
#include "${H}"  // SCRATCH M3d
// SCRATCH M3d: the ten corner routes walked to their fixed target with a replan to it every 120 ticks (the run's 0.5 s), every arm.
DZ_TEST(m3d_scratch_count_on_the_routes) {
  const auto rs = corner_routes(10);
  for (const Arm& arm : arms()) {
    m3d::reset();
    for (size_t i = 0; i < rs.size(); ++i) {
      nav::Query query(plain_apartment_arena().nav());
      Chaser     c;
      c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, arm.model.ref_speed, 1.0f, arm.model);
      c.body.root_law = static_cast<int>(arm.model.root_law);
      c.body.corner_feel = static_cast<int>(arm.model.corner_feel);
      if (!place(c, query, rs[i].first, 0.0f) || !plan_to(c, query, rs[i].second)) continue;
      for (int t = 0; t < 240 * 120 && !c.arrived; ++t) {
        if (t > 0 && t % 120 == 0 && c.gait == Gait::Mesh) {
          const nav::Path old = c.path;
          const Vec3      body = c.pos;
          if (plan_to(c, query, rs[i].second) && c.has_path) m3d::check(query, profile_of(c.body, "hunter"), body, old, c.path, static_cast<uint32_t>(t), arm.name);
        }
        step(c, query);
      }
    }
    m3d::report(arm.name);
  }
}
`.split('\n').join(nl);
fs.writeFileSync(W + 'chase/tests/feel_tests.cpp', t);
console.log('M3d scratch hook and routes row in ' + W);
