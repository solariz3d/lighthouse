// D677 M-line (registration_side_and_least_bending.md): nav::Query::find_path_avoiding, the same exact search with chosen polygons priced 1000 times
// as long. find_path is unchanged (no list). Either line ending; each anchor once.
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
edit('nav/nav.h', `  bool find_path(Vec3 a, Vec3 b, const Profile& profile, Path& path) const;`,
`  bool find_path(Vec3 a, Vec3 b, const Profile& profile, Path& path) const;
  // M-line (lighthouse exo_memory/loop/page_m_line_A_2026-11-15_evidence/registration_side_and_least_bending.md): the same search with the polygons
  // in \`avoid\` priced as if 1000 times as long, so it finds the way round them when there is one (and goes through them only when there is none).
  bool find_path_avoiding(Vec3 a, Vec3 b, const Profile& profile, const std::vector<PolyRef>& avoid, Path& path) const;`);
edit('nav/world.cpp', `  CostFilter(const World::Impl& world, const Profile& profile) : world_(world), speeds_(profile.speeds) {`,
`  CostFilter(const World::Impl& world, const Profile& profile, const std::vector<PolyRef>* avoid = nullptr)
      : world_(world), speeds_(profile.speeds), avoid_(avoid) {`);
edit('nav/world.cpp', `  float getCost(const float* pa, const float* pb, const dtPolyRef, const dtMeshTile*, const dtPoly*, const dtPolyRef,
                const dtMeshTile* tile, const dtPoly* poly, const dtPolyRef, const dtMeshTile*, const dtPoly*) const override {
    const float d = dtVdist(pa, pb);`,
`  float getCost(const float* pa, const float* pb, const dtPolyRef, const dtMeshTile*, const dtPoly*, const dtPolyRef cur,
                const dtMeshTile* tile, const dtPoly* poly, const dtPolyRef, const dtMeshTile*, const dtPoly*) const override {
    const float d0 = dtVdist(pa, pb);
    // M-line: a polygon to avoid costs 1000 times as much (the straight distance to the goal still never overestimates, so the search stays exact).
    const float d = avoid_ && std::find(avoid_->begin(), avoid_->end(), static_cast<PolyRef>(cur)) != avoid_->end() ? d0 * 1000.0f : d0;`);
edit('nav/world.cpp', `  const World::Impl& world_;
  Speeds             speeds_;
  float              stairs_ = 1.0f;
};`,
`  const World::Impl& world_;
  Speeds             speeds_;
  float              stairs_ = 1.0f;
  const std::vector<PolyRef>* avoid_ = nullptr;
};`);
edit('nav/world.cpp', `  dtStatus solve(dtNavMeshQuery* q, Vec3 a, Vec3 b, const Profile& profile, Vec3 reach, Path& path, bool want_corridor, int depth = 0) {
    const dtStatus status = search(q, a, b, profile, reach, path, want_corridor);`,
`  dtStatus solve(dtNavMeshQuery* q, Vec3 a, Vec3 b, const Profile& profile, Vec3 reach, Path& path, bool want_corridor, int depth = 0,
                 const std::vector<PolyRef>* avoid = nullptr) {
    const dtStatus status = search(q, a, b, profile, reach, path, want_corridor, avoid);`);
edit('nav/world.cpp', `      solve(q, a, b, lesser, reach, other, want_corridor, depth + 1);`,
`      solve(q, a, b, lesser, reach, other, want_corridor, depth + 1, avoid);`);
edit('nav/world.cpp', `  dtStatus search(dtNavMeshQuery* q, Vec3 a, Vec3 b, const Profile& profile, Vec3 reach, Path& path, bool want_corridor) {`,
`  dtStatus search(dtNavMeshQuery* q, Vec3 a, Vec3 b, const Profile& profile, Vec3 reach, Path& path, bool want_corridor,
                  const std::vector<PolyRef>* avoid = nullptr) {`);
edit('nav/world.cpp', `    const CostFilter filter(world.impl(), profile);
    const float      ext[3] = {reach.x, reach.y, reach.z};`,
`    const CostFilter filter(world.impl(), profile, avoid);
    const float      ext[3] = {reach.x, reach.y, reach.z};`);
edit('nav/world.cpp', `bool Query::find_path(Vec3 a, Vec3 b, const Profile& profile, Path& path) const {
  impl_->solve(impl_->full, a, b, profile, {1.0f, 1.0f, 1.0f}, path, true);
  return path.found;
}`,
`bool Query::find_path(Vec3 a, Vec3 b, const Profile& profile, Path& path) const {
  impl_->solve(impl_->full, a, b, profile, {1.0f, 1.0f, 1.0f}, path, true);
  return path.found;
}

bool Query::find_path_avoiding(Vec3 a, Vec3 b, const Profile& profile, const std::vector<PolyRef>& avoid, Path& path) const {
  impl_->solve(impl_->full, a, b, profile, {1.0f, 1.0f, 1.0f}, path, true, 0, &avoid);
  return path.found;
}`);
console.log('nav avoid applied');
