// D677 M-line: the side priced in the one search (the page's five lines, after the third try's ruling). Either line ending; anchors once.
const fs = require('fs');
const W = 'G:/consonance-scratch/a-m1-dz3/';
const load = (f) => fs.readFileSync(W + f, 'utf8');
const rep = (f, a0, b0) => {
  let s = load(f);
  for (const e of ['\r\n', '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    fs.writeFileSync(W + f, s.replace(a, () => b));
    return;
  }
  throw new Error(f + ': anchor not found once: ' + a0.slice(0, 80));
};

// nav.h: the squeeze on the profile (zero, off, for today's law); find_path_avoiding goes.
rep('nav/nav.h', `struct Profile {
  const char* name = "";
  uint16_t    may = kMayWalk;
  Speeds      speeds;
};`,
`struct Profile {
  const char* name = "";
  uint16_t    may = kMayWalk;
  Speeds      speeds;
  // M-line (lighthouse exo_memory/loop/page_m_line_A_2026-11-15.md, the side in five lines): a body with grip pays, at each opening narrower than
  // kSqueezeWide it crosses, the time it loses slowing to what the opening allows and gaining back, as metres at speeds.walk. Zero: off (today's law).
  float squeeze_mu_g = 0.0f, squeeze_brake = 0.0f, squeeze_accel = 0.0f;
};`);
rep('nav/nav.h', `  // M-line (lighthouse exo_memory/loop/page_m_line_A_2026-11-15_evidence/registration_side_and_least_bending.md): the same search with the polygons
  // in \`avoid\` priced as if 1000 times as long, so it finds the way round them when there is one (and goes through them only when there is none).
  bool find_path_avoiding(Vec3 a, Vec3 b, const Profile& profile, const std::vector<PolyRef>& avoid, Path& path) const;`, '');

// world.cpp: the filter prices the squeeze; the avoid list and find_path_avoiding go.
rep('nav/world.cpp', `  CostFilter(const World::Impl& world, const Profile& profile, const std::vector<PolyRef>* avoid = nullptr)
      : world_(world), speeds_(profile.speeds), avoid_(avoid) {`,
`  CostFilter(const World::Impl& world, const Profile& profile) : world_(world), speeds_(profile.speeds) {
    mu_g_ = profile.squeeze_mu_g, brake_ = std::min(profile.squeeze_brake, profile.squeeze_mu_g), accel_ = profile.squeeze_accel;`);
rep('nav/world.cpp', `  float getCost(const float* pa, const float* pb, const dtPolyRef, const dtMeshTile*, const dtPoly*, const dtPolyRef cur,
                const dtMeshTile* tile, const dtPoly* poly, const dtPolyRef, const dtMeshTile*, const dtPoly*) const override {
    const float d0 = dtVdist(pa, pb);
    // M-line: a polygon to avoid costs 1000 times as much (the straight distance to the goal still never overestimates, so the search stays exact).
    const float d = avoid_ && std::find(avoid_->begin(), avoid_->end(), static_cast<PolyRef>(cur)) != avoid_->end() ? d0 * 1000.0f : d0;`,
`  float getCost(const float* pa, const float* pb, const dtPolyRef, const dtMeshTile*, const dtPoly*, const dtPolyRef,
                const dtMeshTile* tile, const dtPoly* poly, const dtPolyRef next, const dtMeshTile*, const dtPoly*) const override {
    const float d = dtVdist(pa, pb) + squeeze(tile, poly, next);`);
rep('nav/world.cpp', `  const World::Impl& world_;
  Speeds             speeds_;
  float              stairs_ = 1.0f;
  const std::vector<PolyRef>* avoid_ = nullptr;
};`,
`  // M-line (the page's five lines): crossing from this polygon into \`next\` through a shared edge narrower than kSqueezeWide costs a body with grip
  // (v - v_w)^2 (1/(2b) + 1/(2a)) / v seconds, written as metres at v, with v_w = min(v, sqrt(mu g max(w, 0.1))). Detour's getCost is the cost
  // across this polygon to its portal into \`next\` (DetourNavMeshQuery.h), and this polygon's link to \`next\` names that edge. Only ever added,
  // so the straight distance to the goal still never overestimates and the search stays exact. Off (zero) for today's law.
  float squeeze(const dtMeshTile* tile, const dtPoly* poly, const dtPolyRef next) const {
    if (mu_g_ <= 0.0f || !next || !tile || !poly || poly->getType() == DT_POLYTYPE_OFFMESH_CONNECTION) return 0.0f;
    for (unsigned int k = poly->firstLink; k != DT_NULL_LINK; k = tile->links[k].next) {
      const dtLink& l = tile->links[k];
      if (l.ref != next) continue;
      const float* va = &tile->verts[poly->verts[l.edge] * 3];
      const float* vb = &tile->verts[poly->verts[(l.edge + 1) % poly->vertCount] * 3];
      float        w = std::sqrt((vb[0] - va[0]) * (vb[0] - va[0]) + (vb[2] - va[2]) * (vb[2] - va[2]));
      if (l.side != 0xff) w *= static_cast<float>(l.bmax - l.bmin) / 255.0f;  // at a tile's border the portal is part of the edge
      if (w >= kSqueezeWide) return 0.0f;
      const float v = std::max(speeds_.walk, 0.1f), vw = std::min(v, std::sqrt(mu_g_ * std::max(w, 0.1f)));
      const float b = std::max(brake_, 0.1f), a = std::max(accel_, 0.1f);
      return (v - vw) * (v - vw) * (0.5f / b + 0.5f / a);  // seconds lost, times v, divided by v
    }
    return 0.0f;
  }

  static constexpr float kSqueezeWide = 1.0f;
  const World::Impl& world_;
  Speeds             speeds_;
  float              stairs_ = 1.0f;
  float              mu_g_ = 0.0f, brake_ = 0.0f, accel_ = 0.0f;
};`);
rep('nav/world.cpp', `  dtStatus solve(dtNavMeshQuery* q, Vec3 a, Vec3 b, const Profile& profile, Vec3 reach, Path& path, bool want_corridor, int depth = 0,
                 const std::vector<PolyRef>* avoid = nullptr) {
    const dtStatus status = search(q, a, b, profile, reach, path, want_corridor, avoid);`,
`  dtStatus solve(dtNavMeshQuery* q, Vec3 a, Vec3 b, const Profile& profile, Vec3 reach, Path& path, bool want_corridor, int depth = 0) {
    const dtStatus status = search(q, a, b, profile, reach, path, want_corridor);`);
rep('nav/world.cpp', `      solve(q, a, b, lesser, reach, other, want_corridor, depth + 1, avoid);`, `      solve(q, a, b, lesser, reach, other, want_corridor, depth + 1);`);
rep('nav/world.cpp', `  dtStatus search(dtNavMeshQuery* q, Vec3 a, Vec3 b, const Profile& profile, Vec3 reach, Path& path, bool want_corridor,
                  const std::vector<PolyRef>* avoid = nullptr) {`,
`  dtStatus search(dtNavMeshQuery* q, Vec3 a, Vec3 b, const Profile& profile, Vec3 reach, Path& path, bool want_corridor) {`);
rep('nav/world.cpp', `    const CostFilter filter(world.impl(), profile, avoid);`, `    const CostFilter filter(world.impl(), profile);`);
rep('nav/world.cpp', `

bool Query::find_path_avoiding(Vec3 a, Vec3 b, const Profile& profile, const std::vector<PolyRef>& avoid, Path& path) const {
  impl_->solve(impl_->full, a, b, profile, {1.0f, 1.0f, 1.0f}, path, true, 0, &avoid);
  return path.found;
}`, '');

// chaser.h: the side's state goes.
rep('chase/chaser.h', `  // M-line (registration_side_and_least_bending.md): the polygons whose avoiding holds the side of a solid the line chose, and where that solid
  // is (a replan keeps the side while a search avoiding them still reaches the goal; forgotten 25 m on). Not hashed: re-made at every plan.
  std::vector<nav::PolyRef> side_avoid;
  Vec3                      side_at;
`, '');

// chaser.cpp: profile_of sets the squeeze for a body on the root; the throat comparison goes.
rep('chase/chaser.cpp', `  p.speeds.drop_seconds = body.drop_s + body.drop_recover_s;
  p.speeds.climb_seconds = body.climb_s;
  return p;`,
`  p.speeds.drop_seconds = body.drop_s + body.drop_recover_s;
  p.speeds.climb_seconds = body.climb_s;
  if (body.root_law == 1) {  // M-line: a body on the root pays for the openings it squeezes through (nav::Profile); today's law does not
    p.squeeze_mu_g = std::max(body.grip_mu, 0.05f) * kGravity;
    p.squeeze_brake = body.brake;
    p.squeeze_accel = body.accel;
  }
  return p;`);
{
  let s = load('chase/chaser.cpp');
  const a = s.indexOf('// M-line: the time the root takes along a line');
  const nsOpen = s.lastIndexOf('namespace {', a);
  const plan = s.indexOf('bool plan_to(Chaser& c, const nav::Query& query, Vec3 target) {', a);
  if (a < 0 || nsOpen < 0 || plan < 0 || a - nsOpen > 20) throw new Error('side helpers block not found');
  s = s.slice(0, nsOpen) + s.slice(plan);
  fs.writeFileSync(W + 'chase/chaser.cpp', s);
}
rep('chase/chaser.cpp', `  const nav::Profile prof = profile_now(c);
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
  }`,
`  const nav::Profile prof = profile_now(c);
  nav::Path          p;
  // M-line: for a body on the root the one search already prices the openings it squeezes through (profile_of), so the side of a solid is
  // chosen by it; then the least-bending line through what it returns.
  if (!query.find_path(c.pos, target, prof, p) || p.points.empty()) return false;
  c.path = std::move(p);
  if (c.body.line_clearance > 0) widen_corners(c.path, query, prof, c.body.line_clearance);
  if (c.body.root_law == 1) c.path = root_line(c.path, query, prof);`);
console.log('squeeze law applied');
