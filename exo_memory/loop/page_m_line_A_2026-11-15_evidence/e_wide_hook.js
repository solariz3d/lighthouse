// SCRATCH (seat A, D677, pane E's staging tree only, never committed): the read of the ring for item 2, item 1 (git-blob 90a7afff). The plan print's
// kept-plans field taken out (the keep is not in 3112032's law); the first root plan's line and each plan's tick recorded in run.cpp; and in
// corner_film.cpp, after the tick read, how far the body's own track runs each side of that first line within 6 m of the bend, and its lowest
// speed there, each with its tick and the plan in force.
const fs = require('fs');
const E = 'G:/consonance-scratch/a-m3c-e22/';
const edit = (file, pairs) => {
  let s = fs.readFileSync(E + file, 'utf8');
  const nl = s.includes('\r\n') ? '\r\n' : '\n';
  for (const [a0, b0] of pairs) {
    const a = a0.split('\n').join(nl), b = b0.split('\n').join(nl);
    if (s.split(a).length - 1 !== 1) throw new Error(file + ': anchor not found once: ' + a0.slice(0, 80));
    s = s.replace(a, () => b);
  }
  fs.writeFileSync(E + file, s);
};
edit('chase/run.cpp', [
  [`      std::printf("KEEP tick %u: %.2f m from the apex; the hunter's own line within 5 m of the apex (%d points) at most %.2f m from the first plan's; kept plans %d\\n",
                  static_cast<unsigned>(tick_), static_cast<double>(dist), n_near, static_cast<double>(worst), a.body.kept_plans);`,
   `      std::printf("KEEP tick %u: %.2f m from the apex; the hunter's own line within 5 m of the apex (%d points) at most %.2f m from the first plan's\\n",
                  static_cast<unsigned>(tick_), static_cast<double>(dist), n_near, static_cast<double>(worst));`],
  [`void Run::replan(Agent& a, Vec3 target) {
  ++cost_.paths;
  --plans_left_;
  if (!plan_to(a.body, *query_, target)) ++cost_.paths_failed;`,
   `}  // namespace dz::chase
std::vector<dz::Vec3> dz_wide_first;   // SCRATCH (seat A, D677): the first root plan's line
std::vector<unsigned> dz_wide_plans;   // SCRATCH: each root plan's tick
namespace dz::chase {
void Run::replan(Agent& a, Vec3 target) {
  ++cost_.paths;
  --plans_left_;
  if (!plan_to(a.body, *query_, target)) ++cost_.paths_failed;
  if (std::getenv("DZ_WIDE_READ") && a.body.kind == Kind::Hunter && a.body.body.root_law == 1) {  // SCRATCH (seat A, D677)
    if (dz_wide_first.empty())
      for (const nav::PathPoint& q : a.body.path.points) dz_wide_first.push_back(q.pos);
    if (dz_wide_plans.empty() || static_cast<unsigned>(tick_) > dz_wide_plans.back()) dz_wide_plans.push_back(static_cast<unsigned>(tick_));
  }`],
]);
edit('game/world/corner_film.cpp', [
  [`    std::printf("TICKREAD lowest %.3f at frame %zu tick %u pos %.2f %.2f %.2f\\n", low, low_at, track[low_at].tick, track[low_at].chase_at.x,
                track[low_at].chase_at.y, track[low_at].chase_at.z);`,
   `    std::printf("TICKREAD lowest %.3f at frame %zu tick %u pos %.2f %.2f %.2f\\n", low, low_at, track[low_at].tick, track[low_at].chase_at.x,
                track[low_at].chase_at.y, track[low_at].chase_at.z);
    if (std::getenv("DZ_WIDE_READ") && !dz_wide_first.empty()) {  // SCRATCH (seat A, D677): how far wide of the first plan's line, within 6 m of the bend
      float  left = 0.0f, right = 0.0f, slow = 1e9f;
      size_t left_at = 0, right_at = 0, slow_at = 0;
      for (size_t i = 0; i < track.size(); ++i) {
        const Vec3 p = track[i].chase_at;
        if (length(flat(p - c.apex)) > 6.0f) continue;
        float bd = 1e9f, side = 0.0f;
        for (size_t k = 0; k + 1 < dz_wide_first.size(); ++k) {
          const Vec3  a = flat(dz_wide_first[k]), d = flat(dz_wide_first[k + 1]) - a, w = flat(p) - a;
          const float l2 = dot(d, d), t = l2 > 1e-8f ? std::max(0.0f, std::min(1.0f, dot(w, d) / l2)) : 0.0f;
          const Vec3  off = w - d * t;
          if (length(off) < bd) bd = length(off), side = d.x * off.z - d.z * off.x;
        }
        if (side > 0.0f && bd > left) left = bd, left_at = i;
        if (side <= 0.0f && bd > right) right = bd, right_at = i;
        if (track[i].chase_speed < slow) slow = track[i].chase_speed, slow_at = i;
      }
      const auto in_force = [&](unsigned tick) {
        unsigned last = 0;
        for (const unsigned t : dz_wide_plans)
          if (t <= tick) last = t;
        return last;
      };
      std::printf("WIDE within 6 m of the bend: the body's track at most %.2f m left of the first plan's line (tick %u, the plan of tick %u) and %.2f m right"
                  " (tick %u, the plan of tick %u); lowest %.2f m/s at tick %u (the plan of tick %u) at (%.2f %.2f); %zu plans\\n",
                  static_cast<double>(left), track[left_at].tick, in_force(track[left_at].tick), static_cast<double>(right), track[right_at].tick,
                  in_force(track[right_at].tick), static_cast<double>(slow), track[slow_at].tick, in_force(track[slow_at].tick),
                  static_cast<double>(track[slow_at].chase_at.x), static_cast<double>(track[slow_at].chase_at.z), dz_wide_plans.size());
    }`],
  [`namespace dzworld {
namespace {`, `extern std::vector<dz::Vec3> dz_wide_first;   // SCRATCH (seat A, D677)
extern std::vector<unsigned> dz_wide_plans;   // SCRATCH
namespace dzworld {
namespace {`],
]);
console.log('E wide hook');
