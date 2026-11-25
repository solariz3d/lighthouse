// SCRATCH (seat A, D677, pane E's staging tree only, never committed): the near hooks taken back out of run.cpp, and the plan print measuring the
// registered line: at every plan, every point of the hunter's own line (a.body.path) within 5 m of the 90's apex against the first plan's line.
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m3c-e22/chase/run.cpp';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const rep = (a0, b0) => {
  const a = a0.split('\n').join(nl), b = b0.split('\n').join(nl);
  if (s.split(a).length - 1 !== 1) throw new Error('anchor not found once: ' + a0.slice(0, 80));
  s = s.replace(a, () => b);
};
rep(`}  // namespace dz::chase
extern bool dz_arc_diag;  // SCRATCH (seat A, D677)
namespace dz::chase {
void Run::replan(Agent& a, Vec3 target) {`, `void Run::replan(Agent& a, Vec3 target) {`);
rep(`      std::printf("STRING tick %u:", static_cast<unsigned>(tick_));
      for (const nav::PathPoint& q : str.points) std::printf(" (%.2f %.2f)", static_cast<double>(q.pos.x), static_cast<double>(q.pos.z));
      std::printf("\\n");
      dz_arc_diag = dist > 7.0f && dist < 14.0f;
      root_arcs(str, *query_, prof, &rep);
      dz_arc_diag = false;`,
`      root_arcs(str, *query_, prof, &rep);
      // the registered line: the hunter's own line within 5 m of the apex, against the first plan's
      static std::vector<Vec3> first_line;
      if (first_line.empty())
        for (const nav::PathPoint& q : a.body.path.points) first_line.push_back(q.pos);
      float worst = 0.0f;
      int   n_near = 0;
      for (const nav::PathPoint& q : a.body.path.points) {
        if (length(flat(q.pos - apex)) > 5.0f) continue;
        float bd = 1e9f;
        for (size_t i = 0; i + 1 < first_line.size(); ++i) {
          const Vec3  aa = flat(first_line[i]), d = flat(first_line[i + 1]) - aa, w = flat(q.pos) - aa;
          const float l2 = dot(d, d), t = l2 > 1e-8f ? std::max(0.0f, std::min(1.0f, dot(w, d) / l2)) : 0.0f;
          bd = std::min(bd, length(w - d * t));
        }
        worst = std::max(worst, bd), ++n_near;
      }
      std::printf("KEEP tick %u: %.2f m from the apex; the hunter's own line within 5 m of the apex (%d points) at most %.2f m from the first plan's; kept plans %d\\n",
                  static_cast<unsigned>(tick_), static_cast<double>(dist), n_near, static_cast<double>(worst), a.body.kept_plans);`);
fs.writeFileSync(f, s);
console.log('E keep hook');
