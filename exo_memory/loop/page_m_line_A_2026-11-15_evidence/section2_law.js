// D677 M-line, section 2 built (the page's section 2, registered 07:59; the ring for the two reads, item 2; five lines filed before code): with the
// arcs on, the line within the body's braking distance is kept across plans and only the part beyond it is planned again. chase/chaser.cpp only.
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m1-dz3/chase/chaser.cpp';
let s = fs.readFileSync(f, 'utf8');
const rep = (a0, b0) => {
  for (const e of ['\r\n', '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    s = s.replace(a, () => b);
    return;
  }
  throw new Error('anchor not found once: ' + a0.slice(0, 80));
};
rep(`bool plan_to(Chaser& c, const nav::Query& query, Vec3 target) {
  if (c.gait != Gait::Mesh) return false;
  const nav::Profile prof = profile_now(c);`,
`namespace {
// Section 2 (lighthouse page_m_line_A_2026-11-15.md, section 2 and "Section 2, built"): a root body with the arcs on keeps its current line from
// itself to the point a braking distance ahead along it, v^2 / (2 min(brake, grip_mu g)), and plans again only beyond that point. A new plan never
// takes the other side of a solid within that distance, since that stretch is the old line. False (plan from the body, as before) when nothing is
// worth keeping, the body is more than kKeepOff off its line, a link lies inside the kept stretch, the old line ends inside it, or there is no way
// on from the keep point (the old side is no longer a way).
constexpr float kKeepOff = 0.5f;
bool keep_and_plan(Chaser& c, const nav::Query& query, Vec3 target, const nav::Profile& prof) {
  const std::vector<nav::PathPoint>& pts = c.path.points;
  if (!c.has_path || c.leg + 1 >= pts.size()) return false;
  const float decel = std::min(c.body.brake, c.body.grip_mu * 9.81f);
  const float keep = decel > 0.0f ? c.speed * c.speed / (2.0f * decel) : 0.0f;
  if (keep < kArcStep) return false;
  {
    const Vec3  a = flat(pts[c.leg].pos), d = flat(pts[c.leg + 1].pos) - a, w = flat(c.pos) - a;
    const float l2 = dot(d, d), t = l2 > 1e-8f ? std::max(0.0f, std::min(1.0f, dot(w, d) / l2)) : 0.0f;
    if (length(w - d * t) > kKeepOff) return false;
  }
  std::vector<nav::PathPoint> kept;
  nav::PathPoint              first = pts[c.leg];
  first.pos = c.pos;
  kept.push_back(first);
  Vec3  at = c.pos, keep_at{};
  float run = 0.0f;
  bool  reached = false;
  for (size_t k = c.leg + 1; k < pts.size(); ++k) {
    if (pts[k - 1].move != nav::Move::Walk) return false;
    const float l = length(flat(pts[k].pos - at));
    if (run + l >= keep) {
      keep_at = at + (pts[k].pos - at) * (l > 1e-6f ? (keep - run) / l : 0.0f);
      reached = true;
      break;
    }
    run += l, at = pts[k].pos;
    kept.push_back(pts[k]);
  }
  if (!reached) return false;
  nav::Path fresh;
  if (!query.find_path(keep_at, target, prof, fresh) || fresh.points.empty()) return false;
  fresh = root_arcs(fresh, query, prof);
  nav::Path line = c.path;
  line.points = kept;
  for (const nav::PathPoint& q : fresh.points) line.points.push_back(q);
  line.length = 0.0f;
  for (size_t k = 0; k + 1 < line.points.size(); ++k) {
    if (line.points[k].move == nav::Move::Walk) line.points[k].length = length(flat(line.points[k + 1].pos - line.points[k].pos));
    line.length += line.points[k].length;
  }
  line.points.back().length = 0.0f;
  c.path = std::move(line);
  c.rooms = corner_rooms(c.path, query, profile_now(c));
  c.takeoff = drop_takeoffs(c.path, query, profile_now(c), c.body);
  c.leg = 0;
  c.has_path = true;
  c.arrived = c.path.points.size() < 2;
  return true;
}
}  // namespace

bool plan_to(Chaser& c, const nav::Query& query, Vec3 target) {
  if (c.gait != Gait::Mesh) return false;
  const nav::Profile prof = profile_now(c);
  if (c.body.root_law == 1 && c.body.line_arcs == 1 && keep_and_plan(c, query, target, prof)) return true;  // section 2`);
fs.writeFileSync(f, s);
console.log('section 2 applied');
