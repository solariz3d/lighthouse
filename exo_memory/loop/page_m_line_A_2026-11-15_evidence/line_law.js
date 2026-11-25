// D677 M-line: root_line for real (registration_line_from_corridor.md). Replaces the stub. One anchor, either line ending.
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m1-dz3/chase/chaser.cpp';
let s = fs.readFileSync(f, 'utf8');
const stub = `// M-line, red first: a stub that returns the string unchanged (registration_line_from_corridor.md).
nav::Path root_line(const nav::Path& string, const nav::Query&, const nav::Profile&) { return string; }`;
const real = `// M-line (registered: lighthouse exo_memory/loop/page_m_line_A_2026-11-15_evidence/registration_line_from_corridor.md; the page's section 2): the line
// a body on the root follows, made from the string Detour gives. Each corner of a walked stretch gets a circle whose apex is the corner moved
// kLineRoom off the inner wall, its tangent there the bisector of the two legs; consecutive circles (and the stretch's ends, as circles of radius
// 0) are joined by their common tangent. Each radius is the largest that keeps its stretch of the line on the mesh with kLineRoom either side,
// tried from kLineRmax down and refined, over three passes. Links and stairs keep their points. Theirs and ours: the page's "Ruling item 3".
namespace {
constexpr float kLineStep = 0.25f, kLineRoom = 0.2f, kLineRmax = 60.0f, kLineRmin = 0.3f;

struct LineCircle {
  Vec3  c;          // centre (for radius 0, the point itself)
  float r = 0.0f;   // radius
  int   k = 1;      // +1 turns counter-clockwise in (x, z) (from +x toward +z), -1 clockwise
  Vec3  apex, bis;  // the corner's apex and the legs' bisector there (for a corner circle)
};

Vec3 line_left(Vec3 d) { return Vec3{-d.z, 0.0f, d.x}; }

// The common tangent from circle a to circle b, as travelled: the points it leaves a and meets b. False when there is none.
bool line_tangent(const LineCircle& a, const LineCircle& b, Vec3& ta, Vec3& tb) {
  const float du = b.c.x - a.c.x, dv = b.c.z - a.c.z, d2 = du * du + dv * dv;
  const float q = static_cast<float>(b.k) * b.r - static_cast<float>(a.k) * a.r;
  if (d2 <= q * q + 1e-6f) return false;
  const float l = std::sqrt(d2 - q * q);
  const Vec3  dir{(du * l + dv * q) / d2, 0.0f, (dv * l - du * q) / d2};
  ta = a.c - line_left(dir) * (static_cast<float>(a.k) * a.r);
  tb = b.c - line_left(dir) * (static_cast<float>(b.k) * b.r);
  ta.y = a.c.y, tb.y = b.c.y;
  return true;
}

void line_straight(std::vector<Vec3>& out, Vec3 from, Vec3 to) {
  const float len = length(flat(to - from));
  const int   n = std::max(1, static_cast<int>(std::ceil(len / kLineStep)));
  for (int i = 1; i <= n; ++i) out.push_back(from + (to - from) * (static_cast<float>(i) / static_cast<float>(n)));
}

// Around circle c from p to q in its sense; false when the sweep is more than a half turn (the tangents crossed).
bool line_arc(std::vector<Vec3>& out, const LineCircle& c, Vec3 p, Vec3 q) {
  const float a0 = det_atan2(p.z - c.c.z, p.x - c.c.x), a1 = det_atan2(q.z - c.c.z, q.x - c.c.x);
  float       sweep = (a1 - a0) * static_cast<float>(c.k);
  while (sweep < 0.0f) sweep += 2.0f * kPi;
  while (sweep >= 2.0f * kPi) sweep -= 2.0f * kPi;
  if (sweep > kPi) return false;
  const int n = std::max(1, static_cast<int>(std::ceil(c.r * sweep / kLineStep)));
  for (int i = 1; i <= n; ++i) {
    const float a = a0 + static_cast<float>(c.k) * sweep * static_cast<float>(i) / static_cast<float>(n);
    out.push_back(Vec3{c.c.x + c.r * det_cos(a), p.y + (q.y - p.y) * static_cast<float>(i) / static_cast<float>(n), c.c.z + c.r * det_sin(a)});
  }
  return true;
}

void line_set_radius(LineCircle& c, float r) {
  c.r = r;
  c.c = c.apex + line_left(c.bis) * (static_cast<float>(c.k) * r);
  c.c.y = c.apex.y;
}

// The line through circles [lo, hi] (inclusive), from circle lo's tangent-out to circle hi's tangent-in; false when it cannot be drawn.
bool line_build(const std::vector<LineCircle>& cs, size_t lo, size_t hi, std::vector<Vec3>& out) {
  out.clear();
  Vec3 prev_out{};
  for (size_t i = lo; i < hi; ++i) {
    Vec3 ta, tb;
    if (!line_tangent(cs[i], cs[i + 1], ta, tb)) return false;
    if (i == lo) out.push_back(ta);
    else if (!line_arc(out, cs[i], prev_out, ta)) return false;
    line_straight(out, ta, tb);
    prev_out = tb;
  }
  return true;
}

bool line_clear(const std::vector<Vec3>& pts, const nav::Query& query, const nav::Profile& profile) {
  for (size_t i = 0; i + 1 < pts.size(); ++i) {
    const Vec3  d = flat(pts[i + 1] - pts[i]);
    const float l = length(d);
    if (!query.nearest(pts[i], profile, {0.02f, 0.6f, 0.02f}).found) return false;
    if (l < 1e-4f) continue;
    const Vec3 n = line_left(d * (1.0f / l));
    if (query.open_along(pts[i], n, kLineRoom, profile) < kLineRoom - 0.02f) return false;
    if (query.open_along(pts[i], n * -1.0f, kLineRoom, profile) < kLineRoom - 0.02f) return false;
  }
  return true;
}

// One walked stretch of the string, points [a, b], to a line.
void line_stretch(const std::vector<nav::PathPoint>& pts, size_t a, size_t b, const nav::Query& query, const nav::Profile& profile,
                  std::vector<Vec3>& out) {
  std::vector<LineCircle> cs;
  LineCircle              s;
  s.c = s.apex = pts[a].pos;
  cs.push_back(s);
  for (size_t i = a + 1; i < b; ++i) {
    const Vec3  din = flat(pts[i].pos - cs.back().apex), dout = flat(pts[i + 1].pos - pts[i].pos);
    const float li = length(din), lo = length(dout);
    if (li < 1e-3f || lo < 1e-3f) continue;
    const Vec3  u = din * (1.0f / li), v = dout * (1.0f / lo);
    const float cr = u.x * v.z - u.z * v.x;
    if (std::fabs(cr) < 0.01f && dot(u, v) > 0.0f) continue;  // under about half a degree: no corner
    LineCircle c;
    c.k = cr > 0.0f ? 1 : -1;
    const Vec3 bis = u + v;
    c.bis = length(bis) > 1e-4f ? bis * (1.0f / length(bis)) : u;
    c.apex = pts[i].pos - line_left(c.bis) * (static_cast<float>(c.k) * kLineRoom);
    c.apex.y = pts[i].pos.y;
    line_set_radius(c, kLineRmin);
    cs.push_back(c);
  }
  LineCircle e;
  e.c = e.apex = pts[b].pos;
  cs.push_back(e);
  std::vector<Vec3> trial;
  for (int pass = 0; pass < 3; ++pass)
    for (size_t i = 1; i + 1 < cs.size(); ++i) {
      const size_t lo = i - 1, hi = std::min(cs.size() - 1, i + 1);
      float        best = -1.0f, above = kLineRmax;
      for (float r = kLineRmax; r >= kLineRmin * 0.999f; r *= 0.66f) {
        line_set_radius(cs[i], r);
        if (line_build(cs, lo, hi, trial) && line_clear(trial, query, profile)) {
          best = r;
          break;
        }
        above = r;
      }
      if (best < 0.0f) {
        line_set_radius(cs[i], kLineRmin);  // no radius keeps the room here (a doorway narrower than the room): the smallest
        continue;
      }
      for (int it = 0; it < 5 && above > best * 1.0001f; ++it) {  // refine between the last that failed and the first that held
        const float mid = 0.5f * (best + above);
        line_set_radius(cs[i], mid);
        if (line_build(cs, lo, hi, trial) && line_clear(trial, query, profile)) best = mid;
        else above = mid;
      }
      line_set_radius(cs[i], best);
    }
  if (!line_build(cs, 0, cs.size() - 1, out)) {
    out.clear();
    for (size_t i = a; i <= b; ++i) out.push_back(pts[i].pos);  // it cannot be drawn: the string's own points
  }
}
}  // namespace

nav::Path root_line(const nav::Path& string, const nav::Query& query, const nav::Profile& profile) {
  const std::vector<nav::PathPoint>& pts = string.points;
  if (pts.size() < 3) return string;
  nav::Path line = string;
  line.points.clear();
  line.length = 0.0f;
  size_t i = 0;
  while (i < pts.size()) {
    if (i + 1 < pts.size() && pts[i].move == nav::Move::Walk) {
      size_t j = i;
      while (j + 1 < pts.size() && pts[j].move == nav::Move::Walk) ++j;  // [i, j]: a walked stretch (the last point may begin a link)
      std::vector<Vec3> drawn;
      line_stretch(pts, i, j, query, profile, drawn);
      nav::PathPoint first = pts[i];
      line.points.push_back(first);
      for (size_t k = 0; k + 1 < drawn.size(); ++k) {
        nav::PathPoint q;
        q.pos = drawn[k];
        q.move = nav::Move::Walk;
        if (k > 0 || length(flat(drawn[k] - first.pos)) > 1e-3f) line.points.push_back(q);
      }
      i = j;  // pts[j] is added as the next stretch's first point, or as a link's foot or the end
      if (j + 1 >= pts.size()) {
        line.points.push_back(pts[j]);
        break;
      }
      continue;
    }
    line.points.push_back(pts[i]);
    ++i;
  }
  for (size_t k = 0; k + 1 < line.points.size(); ++k) {
    const nav::PathPoint& nx = line.points[k + 1];
    line.points[k].length = line.points[k].move == nav::Move::Walk ? length(flat(nx.pos - line.points[k].pos)) : line.points[k].length;
    line.length += line.points[k].length;
  }
  if (!line.points.empty()) line.points.back().length = 0.0f;
  return line;
}`;
let done = false;
for (const e of ['\r\n', '\n']) {
  const a = stub.split('\n').join(e), b = real.split('\n').join(e);
  if (s.split(a).length - 1 !== 1) continue;
  s = s.replace(a, () => b);
  done = true;
  break;
}
if (!done) throw new Error('stub not found once');
fs.writeFileSync(f, s);
console.log('root_line applied');
