// D677 M-line (registration_side_and_least_bending.md): the least-bending line and the side chosen by the line's time. Either line ending.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const edit = (f, a0, b0) => {
  let s = fs.readFileSync(W + f, 'utf8');
  for (const e of ['\r\n', '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    fs.writeFileSync(W + f, s.replace(a, () => b));
    return;
  }
  throw new Error(f + ': anchor not found once: ' + a0.slice(0, 70));
};

edit('chase/chaser.h', `  Vec3    wall_n;
  uint8_t slide_brake = 0;
};`,
`  Vec3    wall_n;
  uint8_t slide_brake = 0;
  // M-line (registration_side_and_least_bending.md): the polygons whose avoiding holds the side of a solid the line chose, and where that solid
  // is (a replan keeps the side while a search avoiding them still reaches the goal; forgotten 25 m on). Not hashed: re-made at every plan.
  std::vector<nav::PolyRef> side_avoid;
  Vec3                      side_at;
};`);

edit('chase/chaser.cpp', `// M-line, red first for the least-bending line (lighthouse exo_memory/loop/page_m_line_A_2026-11-15_evidence/
// registration_side_and_least_bending.md): a stub that returns the string unchanged. The arc fitter of eb577fc is removed (not kept, by ruling).
nav::Path root_line(const nav::Path& string, const nav::Query&, const nav::Profile&) { return string; }

bool plan_to(Chaser& c, const nav::Query& query, Vec3 target) {
  if (c.gait != Gait::Mesh) return false;
  nav::Path p;
  if (!query.find_path(c.pos, target, profile_now(c), p) || p.points.empty()) return false;
  c.path = std::move(p);
  if (c.body.line_clearance > 0) widen_corners(c.path, query, profile_now(c), c.body.line_clearance);
  if (c.body.root_law == 1) c.path = root_line(c.path, query, profile_now(c));  // M-line`,
`// M-line (registered: lighthouse exo_memory/loop/page_m_line_A_2026-11-15_evidence/registration_side_and_least_bending.md; the ruling at the stop,
// item 2): the least-bending line. Each walked stretch of the string is resampled every kBendStep; each sample keeps its normal and its free width
// either side at its own place, and its sideways offset is moved, pass after pass, to where the squared second difference with its neighbours is
// least, clamped inside its width less min(kBendRoom, half the width). Theirs and ours: the page's "Ruling item 3" and the registration.
namespace {
constexpr float kBendStep = 0.25f, kBendRoom = 0.2f, kBendWide = 6.0f;
constexpr int   kBendPasses = 600;

void bend_least(std::vector<Vec3>& q, const nav::Query& query, const nav::Profile& profile) {
  const size_t n = q.size();
  if (n < 3) return;
  std::vector<Vec3>  nrm(n);
  std::vector<float> lo(n, 0.0f), hi(n, 0.0f);
  for (size_t i = 1; i + 1 < n; ++i) {
    const Vec3  d = flat(q[i + 1] - q[i - 1]);
    const float l = length(d);
    if (l < 1e-5f) continue;
    nrm[i] = Vec3{-d.z / l, 0.0f, d.x / l};
    const float left = query.open_along(q[i], nrm[i], kBendWide, profile), right = query.open_along(q[i], nrm[i] * -1.0f, kBendWide, profile);
    const float room = std::min(kBendRoom, 0.5f * (left + right));
    lo[i] = -right + room, hi[i] = left - room;
    if (lo[i] > hi[i]) lo[i] = hi[i] = 0.5f * (left - right);
  }
  std::vector<Vec3> p = q;
  for (int pass = 0; pass < kBendPasses; ++pass)
    for (size_t i = 1; i + 1 < n; ++i) {
      if (length(nrm[i]) < 0.5f) continue;
      const Vec3  t = i >= 2 && i + 2 < n ? (p[i - 1] * 4.0f + p[i + 1] * 4.0f - p[i - 2] - p[i + 2]) * (1.0f / 6.0f) : (p[i - 1] + p[i + 1]) * 0.5f;
      const float a = std::min(hi[i], std::max(lo[i], dot(flat(t - q[i]), nrm[i])));
      p[i] = q[i] + nrm[i] * a;
    }
  q = p;
}

void bend_resample(const std::vector<nav::PathPoint>& pts, size_t a, size_t b, std::vector<Vec3>& out) {
  out.clear();
  out.push_back(pts[a].pos);
  for (size_t i = a; i < b; ++i) {
    const Vec3  from = pts[i].pos, to = pts[i + 1].pos;
    const float len = length(flat(to - from));
    const int   k = std::max(1, static_cast<int>(std::ceil(len / kBendStep)));
    for (int j = 1; j <= k; ++j) out.push_back(from + (to - from) * (static_cast<float>(j) / static_cast<float>(k)));
  }
}
}  // namespace

nav::Path root_line(const nav::Path& string, const nav::Query& query, const nav::Profile& profile) {
  const std::vector<nav::PathPoint>& pts = string.points;
  if (pts.size() < 2) return string;
  nav::Path line = string;
  line.points.clear();
  line.length = 0.0f;
  size_t i = 0;
  while (i < pts.size()) {
    if (i + 1 < pts.size() && pts[i].move == nav::Move::Walk) {
      size_t j = i;
      while (j + 1 < pts.size() && pts[j].move == nav::Move::Walk) ++j;  // [i, j]: a walked stretch (pts[j] may begin a link, or end the path)
      std::vector<Vec3> q;
      bend_resample(pts, i, j, q);
      bend_least(q, query, profile);
      line.points.push_back(pts[i]);
      for (size_t k = 1; k + 1 < q.size(); ++k) {
        nav::PathPoint w;
        w.pos = q[k];
        w.move = nav::Move::Walk;
        line.points.push_back(w);
      }
      if (j + 1 >= pts.size()) {
        line.points.push_back(pts[j]);
        break;
      }
      i = j;
      continue;
    }
    line.points.push_back(pts[i]);
    ++i;
  }
  for (size_t k = 0; k + 1 < line.points.size(); ++k) {
    if (line.points[k].move == nav::Move::Walk) line.points[k].length = length(flat(line.points[k + 1].pos - line.points[k].pos));
    line.length += line.points[k].length;
  }
  if (!line.points.empty()) line.points.back().length = 0.0f;
  return line;
}

namespace {
// M-line: the time the root takes along a line: v = min(top, sqrt(mu g / kappa)) on its own curvature (three points kSpan apart), then braking
// before and gaining after at the kind's limits; a link counts as the profile's own seconds for it.
float line_seconds(const nav::Path& line, const Body& b, float v0) {
  const auto&  pts = line.points;
  const size_t n = pts.size();
  if (n < 2) return 0.0f;
  const float mu_g = std::max(b.grip_mu, 0.05f) * 9.81f, brake = std::min(b.brake, mu_g), top = std::max(b.top, 0.1f);
  std::vector<float> v(n, top), ds(n, 0.0f);
  for (size_t i = 0; i + 1 < n; ++i) ds[i] = length(flat(pts[i + 1].pos - pts[i].pos));
  for (size_t i = 2; i + 2 < n; ++i) {
    if (pts[i].move != nav::Move::Walk) continue;
    const Vec3  a = pts[i - 2].pos, m = pts[i].pos, c = pts[i + 2].pos;
    const float ab = length(flat(m - a)), bc = length(flat(c - m)), ca = length(flat(c - a));
    const float cr = std::fabs((m.x - a.x) * (c.z - a.z) - (m.z - a.z) * (c.x - a.x));
    const float kappa = ab * bc * ca > 1e-6f ? 2.0f * cr / (ab * bc * ca) : 0.0f;
    if (kappa > 1e-6f) v[i] = std::min(top, std::sqrt(mu_g / kappa));
  }
  v[0] = std::min(v[0], std::max(v0, 0.5f));
  for (size_t i = n - 1; i-- > 0;) v[i] = std::min(v[i], std::sqrt(v[i + 1] * v[i + 1] + 2.0f * brake * ds[i]));
  for (size_t i = 1; i < n; ++i) v[i] = std::min(v[i], std::sqrt(v[i - 1] * v[i - 1] + 2.0f * b.accel * ds[i - 1]));
  float t = 0.0f;
  for (size_t i = 0; i + 1 < n; ++i) t += pts[i].move == nav::Move::Walk ? ds[i] / std::max(0.5f * (v[i] + v[i + 1]), 0.3f) : 1.0f;
  return t;
}

// M-line: the narrowest throat on the string within kThroatAhead of path: the polygons under its samples within kThroatSpan of the narrowest point,
// when the free width there is under kThroatWide. Empty when there is none.
constexpr float kThroatAhead = 25.0f, kThroatWide = 1.0f, kThroatSpan = 0.5f;
std::vector<nav::PolyRef> narrowest_throat(const nav::Path& string, const nav::Query& query, const nav::Profile& profile, Vec3& at) {
  std::vector<nav::PolyRef> out;
  const auto& pts = string.points;
  std::vector<Vec3>  q;
  std::vector<float> w;
  float              s = 0.0f;
  for (size_t i = 0; i + 1 < pts.size() && s < kThroatAhead; ++i) {
    if (pts[i].move != nav::Move::Walk) continue;
    const Vec3  d = flat(pts[i + 1].pos - pts[i].pos);
    const float l = length(d);
    if (l < 1e-4f) continue;
    const Vec3 nm{-d.z / l, 0.0f, d.x / l};
    for (float u = 0.0f; u < l && s + u < kThroatAhead; u += kBendStep) {
      const Vec3 x = pts[i].pos + (pts[i + 1].pos - pts[i].pos) * (u / l);
      q.push_back(x);
      w.push_back(query.open_along(x, nm, kBendWide, profile) + query.open_along(x, nm * -1.0f, kBendWide, profile));
    }
    s += l;
  }
  size_t best = 0;
  for (size_t i = 1; i < w.size(); ++i)
    if (w[i] < w[best]) best = i;
  if (w.empty() || w[best] >= kThroatWide) return out;
  at = q[best];
  for (size_t i = 0; i < q.size(); ++i) {
    if (length(flat(q[i] - q[best])) > kThroatSpan) continue;
    const nav::Nearest m = query.nearest(q[i], profile, {0.05f, 0.6f, 0.05f});
    if (m.found && std::find(out.begin(), out.end(), m.ref) == out.end()) out.push_back(m.ref);
  }
  return out;
}

bool path_uses(const nav::Path& p, const std::vector<nav::PolyRef>& refs) {
  for (const nav::PolyRef r : p.corridor)
    if (std::find(refs.begin(), refs.end(), r) != refs.end()) return true;
  return false;
}
}  // namespace

bool plan_to(Chaser& c, const nav::Query& query, Vec3 target) {
  if (c.gait != Gait::Mesh) return false;
  const nav::Profile prof = profile_now(c);
  nav::Path          p;
  bool               kept = false;
  if (c.body.root_law == 1 && !c.side_avoid.empty()) {
    // M-line: the side chosen before is kept while a search avoiding the other side still reaches the goal, until 25 m past where it was chosen.
    if (length(flat(c.pos - c.side_at)) < kThroatAhead && query.find_path_avoiding(c.pos, target, prof, c.side_avoid, p) && !p.partial &&
        !p.points.empty() && !path_uses(p, c.side_avoid))
      kept = true;
    else
      c.side_avoid.clear();
  }
  if (!kept && (!query.find_path(c.pos, target, prof, p) || p.points.empty())) return false;
  c.path = std::move(p);
  if (c.body.line_clearance > 0) widen_corners(c.path, query, prof, c.body.line_clearance);
  if (c.body.root_law == 1) {
    // M-line: the least-bending line; where the string passes a throat under 1 m, the way round it too, and the faster line is taken.
    nav::Path line = root_line(c.path, query, prof);
    if (!kept) {
      Vec3                            at;
      const std::vector<nav::PolyRef> throat = narrowest_throat(c.path, query, prof, at);
      nav::Path                       other;
      if (!throat.empty() && query.find_path_avoiding(c.pos, target, prof, throat, other) && !other.partial && !other.points.empty() &&
          !path_uses(other, throat)) {
        nav::Path other_line = root_line(other, query, prof);
        if (line_seconds(other_line, c.body, c.speed) < line_seconds(line, c.body, c.speed)) {
          line = std::move(other_line);
          c.side_avoid = throat;  // the way round the throat is faster: the throat is avoided while that holds
        } else {
          c.side_avoid.clear();  // the throat's side holds: avoid the other way's own polygons near it
          for (const nav::PolyRef r : other.corridor)
            if (std::find(c.path.corridor.begin(), c.path.corridor.end(), r) == c.path.corridor.end() && c.side_avoid.size() < 32)
              c.side_avoid.push_back(r);
        }
        c.side_at = at;
      }
    }
    c.path = std::move(line);
  }`);
console.log('side and least-bending law applied');
