// D677 M-line, the third try (registration_third_try.md): (a) over-relaxed passes with a stop, (b) the line over the first 30 m only, (2) the throat
// the two ways do not share. Either line ending; each anchor once.
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

// (a) fewer passes
rep(`constexpr float kBendStep = 0.25f, kBendRoom = 0.2f, kBendWide = 6.0f;
constexpr int   kBendPasses = 600;`,
`constexpr float kBendStep = 0.25f, kBendRoom = 0.2f, kBendWide = 6.0f;
constexpr int   kBendPasses = 200;      // the third try (registration_third_try.md): at most, with over-relaxation and a stop
constexpr float kBendOver = 1.8f;       // the over-relaxation factor
constexpr float kBendSettled = 0.001f;  // metres: a pass in which no offset moves more than this ends the passes
constexpr float kBendHorizon = 30.0f;   // metres of path the line is made over; the rest stays the string (replanned every 0.5 s)`);
rep(`  std::vector<Vec3> p = q;
  for (int pass = 0; pass < kBendPasses; ++pass)
    for (size_t i = 1; i + 1 < n; ++i) {
      if (length(nrm[i]) < 0.5f) continue;
      const Vec3  t = i >= 2 && i + 2 < n ? (p[i - 1] * 4.0f + p[i + 1] * 4.0f - p[i - 2] - p[i + 2]) * (1.0f / 6.0f) : (p[i - 1] + p[i + 1]) * 0.5f;
      const float a = std::min(hi[i], std::max(lo[i], dot(flat(t - q[i]), nrm[i])));
      p[i] = q[i] + nrm[i] * a;
    }
  q = p;`,
`  std::vector<Vec3>  p = q;
  std::vector<float> off(n, 0.0f);
  for (int pass = 0; pass < kBendPasses; ++pass) {
    float moved = 0.0f;
    for (size_t i = 1; i + 1 < n; ++i) {
      if (length(nrm[i]) < 0.5f) continue;
      const Vec3  t = i >= 2 && i + 2 < n ? (p[i - 1] * 4.0f + p[i + 1] * 4.0f - p[i - 2] - p[i + 2]) * (1.0f / 6.0f) : (p[i - 1] + p[i + 1]) * 0.5f;
      const float want = dot(flat(t - q[i]), nrm[i]);
      const float a = std::min(hi[i], std::max(lo[i], off[i] + kBendOver * (want - off[i])));
      moved = std::max(moved, std::fabs(a - off[i]));
      off[i] = a;
      p[i] = q[i] + nrm[i] * a;
    }
    if (moved < kBendSettled) break;
  }
  q = p;`);

// (b) the horizon
rep(`  nav::Path line = string;
  line.points.clear();
  line.length = 0.0f;
  size_t i = 0;
  while (i < pts.size()) {
    if (i + 1 < pts.size() && pts[i].move == nav::Move::Walk) {
      size_t j = i;
      while (j + 1 < pts.size() && pts[j].move == nav::Move::Walk) ++j;  // [i, j]: a walked stretch (pts[j] may begin a link, or end the path)`,
`  nav::Path line = string;
  line.points.clear();
  line.length = 0.0f;
  std::vector<float> cum(pts.size(), 0.0f);  // metres of path to each point (the line is made over the first kBendHorizon only)
  for (size_t k = 1; k < pts.size(); ++k) cum[k] = cum[k - 1] + length(flat(pts[k].pos - pts[k - 1].pos));
  size_t i = 0;
  while (i < pts.size()) {
    if (i + 1 < pts.size() && pts[i].move == nav::Move::Walk && cum[i] < kBendHorizon) {
      size_t j = i;
      while (j + 1 < pts.size() && pts[j].move == nav::Move::Walk && (j == i || cum[j] < kBendHorizon)) ++j;  // [i, j]: a walked stretch`);

// (2) the throat the two ways do not share
rep(`std::vector<nav::PolyRef> narrowest_throat(const nav::Path& string, const nav::Query& query, const nav::Profile& profile, Vec3& at) {
  std::vector<nav::PolyRef> out;`,
`struct Throat {
  std::vector<nav::PolyRef> refs;
  Vec3                      at;
  float                     width = 0.0f;
};
// The throats on the string within kThroatAhead: up to kThroats, narrowest first, each at least 1 m of path from the others.
constexpr int kThroats = 3;
std::vector<Throat> throats(const nav::Path& string, const nav::Query& query, const nav::Profile& profile) {
  std::vector<Throat> out;
  const auto&         pts = string.points;
  std::vector<Vec3>   q;
  std::vector<float>  w, sq;
  float               s = 0.0f;
  for (size_t i = 0; i + 1 < pts.size() && s < kThroatAhead; ++i) {
    if (pts[i].move != nav::Move::Walk) continue;
    const Vec3  d = flat(pts[i + 1].pos - pts[i].pos);
    const float l = length(d);
    if (l < 1e-4f) continue;
    const Vec3 nm{-d.z / l, 0.0f, d.x / l};
    for (float u = 0.0f; u < l && s + u < kThroatAhead; u += kBendStep) {
      const Vec3 x = pts[i].pos + (pts[i + 1].pos - pts[i].pos) * (u / l);
      q.push_back(x), sq.push_back(s + u);
      w.push_back(query.open_along(x, nm, kBendWide, profile) + query.open_along(x, nm * -1.0f, kBendWide, profile));
    }
    s += l;
  }
  std::vector<size_t> order;
  for (size_t i = 0; i < w.size(); ++i)
    if (w[i] < kThroatWide) order.push_back(i);
  std::stable_sort(order.begin(), order.end(), [&](size_t a, size_t b) { return w[a] < w[b]; });
  std::vector<size_t> picked;
  for (const size_t k : order) {
    bool near = false;
    for (const size_t m : picked) near = near || std::fabs(sq[k] - sq[m]) < 1.0f;
    if (near) continue;
    picked.push_back(k);
    Throat t;
    t.at = q[k], t.width = w[k];
    for (size_t i = 0; i < q.size(); ++i) {
      if (length(flat(q[i] - q[k])) > kThroatSpan) continue;
      const nav::Nearest m = query.nearest(q[i], profile, {0.05f, 0.6f, 0.05f});
      if (m.found && std::find(t.refs.begin(), t.refs.end(), m.ref) == t.refs.end()) t.refs.push_back(m.ref);
    }
    out.push_back(std::move(t));
    if (static_cast<int>(out.size()) >= kThroats) break;
  }
  return out;
}

std::vector<nav::PolyRef> narrowest_throat(const nav::Path& string, const nav::Query& query, const nav::Profile& profile, Vec3& at) {
  std::vector<nav::PolyRef> out;`);
rep(`    if (!kept) {
      Vec3                            at;
      const std::vector<nav::PolyRef> throat = narrowest_throat(c.path, query, prof, at);
      nav::Path                       other;
      if (!throat.empty() && query.find_path_avoiding(c.pos, target, prof, throat, other) && !other.partial && !other.points.empty() &&
          !path_uses(other, throat)) {`,
`    if (!kept) {
      // The third try (registration_third_try.md): the throat that decides is the narrowest the two ways do NOT share: the first, narrowest
      // first, whose avoiding search finds a way that does not pass it. A throat both ways pass gives no way round and is skipped.
      Vec3                      at;
      std::vector<nav::PolyRef> throat;
      nav::Path                 other;
      bool                      found_other = false;
      for (const Throat& t : throats(c.path, query, prof)) {
        if (query.find_path_avoiding(c.pos, target, prof, t.refs, other) && !other.partial && !other.points.empty() && !path_uses(other, t.refs)) {
          throat = t.refs, at = t.at, found_other = true;
          break;
        }
      }
      if (found_other) {`);
fs.writeFileSync(f, s);
console.log('third try applied');
{
  let t = fs.readFileSync(f, 'utf8');
  const nl = t.includes('\r\n') ? '\r\n' : '\n';
  const start = t.indexOf('std::vector<nav::PolyRef> narrowest_throat(const nav::Path& string');
  if (start < 0 || t.indexOf('std::vector<nav::PolyRef> narrowest_throat(', start + 1) >= 0) throw new Error('narrowest_throat not found once');
  const end = t.indexOf(nl + '}' + nl, start) + (nl + '}' + nl).length;
  // the function only: the comment above the constants stays with them (it names kThroatAhead and the throat's polygons, still used by throats())
  const cstart = start;
  const body = t.slice(cstart, end);
  if (t.split('narrowest_throat(').length - 1 !== 1) throw new Error('narrowest_throat still called');
  t = t.slice(0, cstart) + t.slice(end);
  fs.writeFileSync(f, t);
  console.log('narrowest_throat removed (' + body.split(nl).length + ' lines)');
}
