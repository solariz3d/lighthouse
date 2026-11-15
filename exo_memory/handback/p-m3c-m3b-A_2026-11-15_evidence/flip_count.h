// flip_count.h (SCRATCH, seat A, D677 M3d; never committed): the count registered in lighthouse
// exo_memory/handback/p-m3c-m3b-A_2026-11-15_evidence/registration_m3d_count.md. At a replan: for each point p of the old path within 3 m of path
// ahead of the body (every 0.25 m), the nearest point q on the new path; where the mesh is not open from p toward q (short by more than 5 cm) a
// solid lies between the paths; a flip when that solid is within 0.5 / 1.0 / 2.0 m of the body. One flip at most per replan.
#pragma once
#include <cmath>
#include <cstdio>
#include <vector>

#include "nav/nav.h"

namespace dz::chase::m3d {

struct Tally {
  long replans = 0, compared = 0, flips05 = 0, flips10 = 0, flips20 = 0;
  int  printed = 0;
};
inline Tally& tally() {
  static Tally t;
  return t;
}

inline Vec3 flat3(Vec3 v) { return Vec3{v.x, 0.0f, v.z}; }

inline Vec3 nearest_on(const std::vector<nav::PathPoint>& pts, Vec3 p) {
  Vec3  best = pts.front().pos;
  float bd = 1e30f;
  for (size_t i = 0; i + 1 < pts.size(); ++i) {
    const Vec3  a = pts[i].pos, b = pts[i + 1].pos;
    const Vec3  ab = flat3(b - a);
    const float l2 = dot(ab, ab);
    const float t = l2 > 1e-8f ? std::fmin(1.0f, std::fmax(0.0f, dot(flat3(p - a), ab) / l2)) : 0.0f;
    const Vec3  c = a + (b - a) * t;
    const Vec3  d = flat3(p - c);
    const float dd = dot(d, d);
    if (dd < bd) bd = dd, best = c;
  }
  return best;
}

// The old path's points ahead of the body: from the body's projection on its nearest segment, every 0.25 m, up to 3 m of path.
inline std::vector<Vec3> ahead(const std::vector<nav::PathPoint>& pts, Vec3 body) {
  std::vector<Vec3> out;
  if (pts.size() < 2) return out;
  size_t seg = 0;
  float  bd = 1e30f, bt = 0.0f;
  for (size_t i = 0; i + 1 < pts.size(); ++i) {
    const Vec3  ab = flat3(pts[i + 1].pos - pts[i].pos);
    const float l2 = dot(ab, ab);
    const float t = l2 > 1e-8f ? std::fmin(1.0f, std::fmax(0.0f, dot(flat3(body - pts[i].pos), ab) / l2)) : 0.0f;
    const Vec3  d = flat3(body - (pts[i].pos + (pts[i + 1].pos - pts[i].pos) * t));
    if (dot(d, d) < bd) bd = dot(d, d), seg = i, bt = t;
  }
  float  s = 0.0f;
  Vec3   at = pts[seg].pos + (pts[seg + 1].pos - pts[seg].pos) * bt;
  size_t i = seg;
  while (s <= 3.0f && i + 1 < pts.size()) {
    out.push_back(at);
    const Vec3  to = pts[i + 1].pos;
    const float left = length(flat3(to - at));
    if (left <= 0.25f) {
      s += left;
      at = to;
      ++i;
      continue;
    }
    at = at + (to - at) * (0.25f / left);
    s += 0.25f;
  }
  return out;
}

inline void report(const char* who) {
  const Tally& t = tally();
  std::printf("M3D %s: replans %ld (compared %ld); flips with the solid within 0.5 m %ld, 1.0 m %ld, 2.0 m %ld\n", who, t.replans, t.compared, t.flips05,
              t.flips10, t.flips20);
}

inline void check(const nav::Query& q, const nav::Profile& prof, Vec3 body, const nav::Path& old_path, const nav::Path& new_path, uint32_t tick,
                  const char* who) {
  Tally& t = tally();  // first, so the tally outlives the printer below (statics end in the reverse order they began)
  static const struct AtExit { ~AtExit() { report("at exit"); } } at_exit;  // the sweep and the films print the tally when they end
  (void)at_exit;
  ++t.replans;
  if (!old_path.found || !new_path.found || old_path.points.size() < 2 || new_path.points.size() < 2) return;
  ++t.compared;
  float best = 1e30f;
  Vec3  bp{}, bs{};
  for (const Vec3& p : ahead(old_path.points, body)) {
    const Vec3  qn = nearest_on(new_path.points, p);
    const Vec3  d = flat3(qn - p);
    const float dist = length(d);
    if (dist < 0.05f) continue;
    const float open = q.open_along(p, d, dist, prof);
    if (open >= dist - 0.05f) continue;
    const Vec3  solid = p + d * (open / dist);
    const float from_body = length(flat3(solid - body));
    if (from_body < best) best = from_body, bp = p, bs = solid;
  }
  t.flips05 += best <= 0.5f, t.flips10 += best <= 1.0f, t.flips20 += best <= 2.0f;
  if (best <= 1.0f && t.printed < 6) {
    ++t.printed;
    std::printf("M3D flip %s tick %u: body (%.2f %.2f) old point (%.2f %.2f) solid (%.2f %.2f) %.2f m from the body\n", who, tick, body.x, body.z, bp.x,
                bp.z, bs.x, bs.z, best);
  }
}

inline void reset() { tally() = Tally{}; }

}  // namespace dz::chase::m3d
