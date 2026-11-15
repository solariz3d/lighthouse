// D677 M-line, item 2 lines 2 to 4: the line kept over the shared way (by polygons), with Apollo's drift gate (opened at source). chase/chaser.h
// (one field) and chase/chaser.cpp. Either line ending.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const edit = (file, pairs) => {
  let s = fs.readFileSync(W + file, 'utf8');
  for (const [a0, b0] of pairs) {
    let done = false;
    for (const e of ['\r\n', '\n']) {
      const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
      if (s.split(a).length - 1 !== 1) continue;
      s = s.replace(a, () => b);
      done = true;
      break;
    }
    if (!done) throw new Error(file + ': anchor not found once: ' + a0.slice(0, 80));
  }
  fs.writeFileSync(W + file, s);
};
edit('chase/chaser.h', [[`  nav::Path path;
  size_t    leg = 0;
  bool      has_path = false;`,
`  nav::Path path;
  size_t    leg = 0;
  bool      has_path = false;
  int       kept_plans = 0;  // M-line item 2: plans in a row that kept the line over the shared way (plan_to; reset by a full plan)`]]);
edit('chase/chaser.cpp', [
  [`bool plan_to(Chaser& c, const nav::Query& query, Vec3 target) {
  if (c.gait != Gait::Mesh) return false;
  const nav::Profile prof = profile_now(c);`,
`namespace {
// Item 2 (lighthouse page_m_line_A_2026-11-15.md, "What keeps the 90's arc", lines 2 to 4): a root body with the arcs on keeps its line over the
// way the new plan shares with the old, by polygons (the library's own corridor splice, DetourPathCorridor.cpp, read at source in the game's
// copy), and lays a new line only beyond it. The drift gate is Apollo's (planning_gflags.cc, opened at source): replan_lateral_distance_threshold
// 0.5 m, and replan_time_threshold 7.0 s counted in plans at the chase's replan every half second. False (a full plan from the body) when there is
// no line to keep, the body has drifted, a link lies ahead on the old line, the new corridor does not start inside the old one, or under two
// polygons are shared.
constexpr float kKeepOff = 0.5f;
constexpr int   kKeepPlans = 14;
bool keep_shared(Chaser& c, const nav::Query& query, Vec3 target, const nav::Profile& prof) {
  const std::vector<nav::PathPoint>& pts = c.path.points;
  const std::vector<nav::PolyRef>&   old = c.path.corridor;
  if (!c.has_path || old.empty() || c.leg + 1 >= pts.size() || c.kept_plans >= kKeepPlans) return false;
  for (size_t k = c.leg; k + 1 < pts.size(); ++k)
    if (pts[k].move != nav::Move::Walk) return false;
  {
    const Vec3  a = flat(pts[c.leg].pos), d = flat(pts[c.leg + 1].pos) - a, w = flat(c.pos) - a;
    const float l2 = dot(d, d), t = l2 > 1e-8f ? std::max(0.0f, std::min(1.0f, dot(w, d) / l2)) : 0.0f;
    if (length(w - d * t) > kKeepOff) return false;
  }
  nav::Path fresh;
  if (!query.find_path(c.pos, target, prof, fresh) || fresh.corridor.empty() || fresh.points.empty()) return false;
  size_t i0 = old.size();
  for (size_t i = 0; i < old.size(); ++i)
    if (old[i] == fresh.corridor.front()) {
      i0 = i;
      break;
    }
  if (i0 == old.size()) return false;
  size_t j = 0;
  while (j < fresh.corridor.size() && i0 + j < old.size() && fresh.corridor[j] == old[i0 + j]) ++j;
  if (j < 2) return false;
  std::vector<nav::PolyRef> shared(fresh.corridor.begin(), fresh.corridor.begin() + static_cast<std::ptrdiff_t>(j));
  std::sort(shared.begin(), shared.end());
  std::vector<nav::PathPoint> kept;
  nav::PathPoint              first = pts[c.leg];
  first.pos = c.pos;
  kept.push_back(first);
  for (size_t k = c.leg + 1; k < pts.size(); ++k) {
    const nav::Nearest n = query.nearest(pts[k].pos, prof, {0.05f, 0.6f, 0.05f});
    if (!n.found || !std::binary_search(shared.begin(), shared.end(), n.ref)) break;
    kept.push_back(pts[k]);
  }
  if (kept.size() < 2) return false;
  nav::Path line = c.path;
  line.points = kept;
  if (j == fresh.corridor.size()) {  // the target moved inside the shared way: the kept line to its point nearest the target, then the target
    size_t best = 0;
    float  bd = 1e9f;
    for (size_t k = 0; k < line.points.size(); ++k) {
      const float d = length(flat(line.points[k].pos - target));
      if (d < bd) bd = d, best = k;
    }
    line.points.resize(best + 1);
    nav::PathPoint end = line.points.back();
    end.pos = target, end.move = nav::Move::Walk;
    line.points.push_back(end);
  } else {
    nav::Path tail;
    if (!query.find_path(kept.back().pos, target, prof, tail) || tail.points.empty()) return false;
    tail = root_arcs(tail, query, prof);
    for (size_t k = 1; k < tail.points.size(); ++k) line.points.push_back(tail.points[k]);
  }
  line.corridor = fresh.corridor;
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
  ++c.kept_plans;
  return true;
}
}  // namespace

bool plan_to(Chaser& c, const nav::Query& query, Vec3 target) {
  if (c.gait != Gait::Mesh) return false;
  const nav::Profile prof = profile_now(c);
  if (c.body.root_law == 1 && c.body.line_arcs == 1 && keep_shared(c, query, target, prof)) return true;  // item 2: the line over the shared way`],
  [`  c.leg = 0;
  c.has_path = true;
  c.arrived = c.path.points.size() < 2;
  return true;
}

// M3c's brake`,
`  c.leg = 0;
  c.has_path = true;
  c.arrived = c.path.points.size() < 2;
  c.kept_plans = 0;
  return true;
}

// M3c's brake`],
]);
console.log('keep applied');
