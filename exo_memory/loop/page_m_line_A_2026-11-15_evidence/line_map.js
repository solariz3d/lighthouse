// SCRATCH (seat A, D677 M-line): a map of the walkable mesh around pane E's 22 degree bend, and today's string path, in the throwaway tree a-m3d.
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m3d/chase/tests/feel_tests.cpp';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const row = `
// SCRATCH (D677 M-line): the walkable mesh (the hunter's profile) around E's 22 degree bend, '#' off the mesh, '.' on it (the nearest mesh point
// within 2 cm across), 0.25 m cells; and today's string path from the door to the target.
DZ_TEST(mline_scratch_map_of_the_22_degree_bend) {
  ArenaParams p;
  p.gen.seed = 1;
  const Arena arena(p);
  nav::Query  query(arena.nav());
  Chaser      c;
  c.id = 1, c.kind = Kind::Hunter, c.body = make_body(archetype(Kind::Hunter).limits, 8.0f, 1.0f, SpeedModel{});
  const nav::Profile prof = profile_of(c.body, "hunter");
  const float y = 10.54f;
  std::printf("    x from -82.0 (left) to -66.0 by 0.25; z from 50.0 (top) down to 35.0 by 0.25\\n");
  for (float z = 50.0f; z >= 35.0f - 1e-3f; z -= 0.25f) {
    std::string line;
    for (float x = -82.0f; x <= -66.0f + 1e-3f; x += 0.25f) {
      const nav::Nearest n = query.nearest({x, y, z}, prof, {0.02f, 0.6f, 0.02f});
      line += n.found ? '.' : '#';
    }
    std::printf("    %6.2f %s\\n", z, line.c_str());
  }
  if (place(c, query, {-57.24f, 10.54f, 39.45f}, 0.0f) && plan_to(c, query, {-86.37f, 10.54f, 46.13f})) {
    std::printf("    today's string path:");
    for (const nav::PathPoint& q : c.path.points) std::printf(" (%.2f %.2f)", q.pos.x, q.pos.z);
    std::printf("\\n");
  }
}
`.split('\n').join(nl);
s = s.replace(/\s*$/, '') + nl + row;
fs.writeFileSync(f, s);
console.log('map row added to a-m3d');
