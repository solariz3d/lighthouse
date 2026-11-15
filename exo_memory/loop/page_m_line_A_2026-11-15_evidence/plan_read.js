// SCRATCH (seat A, D677, pane E's staging tree only, never committed): read 1 of the ruling after the third try (git-blob a69b4210). At every
// replan of a root hunter within 30 m of pane E's 90 degree apex: the tick, the body's distance from the apex, its speed and heading, where the
// plan's stretch starts, and the arcs laid (radius, centre), merges and runs to the solve, from root_arcs's report on the plan's own string.
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m3c-e22/chase/run.cpp';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const a0 = `  if (!plan_to(a.body, *query_, target)) ++cost_.paths_failed;`;
if (s.split(a0).length !== 2) throw new Error('anchor');
const b0 = `  if (!plan_to(a.body, *query_, target)) ++cost_.paths_failed;
  if (std::getenv("DZ_PLAN_READ") && a.body.kind == Kind::Hunter && a.body.body.root_law == 1) {  // SCRATCH (seat A, D677): read 1, never committed
    static int shown = 0;
    const Vec3  apex{-11.54f, a.body.pos.y, -26.84f};
    const float dist = length(flat(a.body.pos - apex));
    if (dist < 30.0f && shown < 80) {
      ++shown;
      const nav::Profile prof = profile_of(a.body.body, "hunter");
      nav::Path          str;
      query_->find_path(a.body.pos, target, prof, str);
      ArcReport rep;
      root_arcs(str, *query_, prof, &rep);
      std::printf("PLAN tick %u: body (%.2f %.2f) %.2f m from the 90's apex, speed %.2f, heading %.1f deg; the stretch starts (%.2f %.2f); string %zu points;"
                  " arcs %d, merged %d, S pairs %d, runs to the solve %d:", static_cast<unsigned>(tick_), static_cast<double>(a.body.pos.x),
                  static_cast<double>(a.body.pos.z), static_cast<double>(dist), static_cast<double>(a.body.speed),
                  static_cast<double>(a.body.heading * 57.29578f), static_cast<double>(str.points.empty() ? 0.0f : str.points.front().pos.x),
                  static_cast<double>(str.points.empty() ? 0.0f : str.points.front().pos.z), str.points.size(), rep.arcs, rep.merged, rep.s_pairs,
                  rep.fallback_runs);
      for (size_t i = 0; i < rep.arc_radius.size(); ++i)
        std::printf(" [r %.2f centre (%.2f %.2f) %.2f m from the hand line's]", static_cast<double>(rep.arc_radius[i]), static_cast<double>(rep.arc_centre[i].x),
                    static_cast<double>(rep.arc_centre[i].z), static_cast<double>(length(flat(rep.arc_centre[i] - Vec3{-15.70f, 0.0f, -30.60f}))));
      for (size_t i = 0; i < rep.solve_at.size(); ++i)
        std::printf(" [solve at (%.2f %.2f)]", static_cast<double>(rep.solve_at[i].x), static_cast<double>(rep.solve_at[i].z));
      std::printf("\\n");
    }
  }`.split('\n').join(nl);
s = s.replace(a0, () => b0);
fs.writeFileSync(f, s);
console.log('plan read added to the E tree');
