// SCRATCH (seat A, D677): the 166 untaken drops by kind, a read with the ledge reader's casts, in the throwaway tree a-m3d only.
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m3d/chase/tests/fall_tests.cpp';
let s = fs.readFileSync(f, 'utf8');
const nl = s.includes('\r\n') ? '\r\n' : '\n';
const row = `
// SCRATCH (D677): every drop a root body does not come down from (never free, not put back), read as at his ledge: from 0.5 m behind the link's foot
// toward its landing, the arena's own collision cast flat at heights above the foot; the lowest clear height, and whether it is clear at all by 2.5 m.
DZ_TEST(m3e_scratch_the_untaken_drops_by_kind) {
  const float heights[] = {0.05f, 0.3f, 0.6f, 0.9f, 1.0f, 1.1f, 1.2f, 1.4f, 1.6f, 1.8f, 2.1f, 2.5f};
  int untaken = 0, low_wall = 0, high_wall = 0, no_opening = 0, clear_at_feet = 0;
  int by_clear[12] = {};
  const Limits limits = archetype(Kind::Hunter).limits;
  for (uint32_t seed = 1; seed <= 12; ++seed) {
    ArenaParams p;
    p.gen.seed = seed;
    const Arena                 arena(p);
    nav::Query                  query(arena.nav());
    std::vector<nav::TileCoord> tiles;
    arena.nav().for_each_poly([&](const nav::World::Poly& poly) {
      if (std::find(tiles.begin(), tiles.end(), poly.tile) == tiles.end()) tiles.push_back(poly.tile);
    });
    for (const nav::TileCoord& t : tiles) {
      const nav::TileData* d = arena.nav().tile(t);
      if (!d) continue;
      for (const nav::Link& l : d->links) {
        if (l.move != nav::Move::Drop) continue;
        const DropRun r = take_drop(arena, query, l, limits);
        if (!r.taken || r.put_back || r.seconds_down != 0.0f) continue;
        ++untaken;
        const Vec3  span = flat(l.to - l.from);
        const float sl = length(span);
        if (sl < 1e-4f) continue;
        const Vec3 u = span * (1.0f / sl);
        int        first_clear = -1;
        for (int k = 0; k < 12; ++k) {
          const Vec3 from = l.from - u * 0.5f + Vec3{0.0f, heights[k], 0.0f};
          float      fr = 1.0f;
          if (!arena.cast(from, u * (sl + 0.5f), fr)) {
            first_clear = k;
            break;
          }
        }
        if (first_clear == 0) ++clear_at_feet;
        else if (first_clear < 0) ++no_opening;
        else if (heights[first_clear] <= 1.2f) ++low_wall;
        else ++high_wall;
        if (first_clear >= 0) ++by_clear[first_clear];
      }
    }
  }
  std::printf("    untaken drops %d: a low wall (clear at 1.2 m or lower) %d; a higher wall with an opening above (clear by 2.5 m) %d; no opening by 2.5 m %d;"
              " clear even at the feet %d\\n", untaken, low_wall, high_wall, no_opening, clear_at_feet);
  std::printf("    the lowest clear height:");
  for (int k = 0; k < 12; ++k) std::printf(" %.2f m: %d;", heights[k], by_clear[k]);
  std::printf("\\n");
}
`.split('\n').join(nl);
s = s.replace(/\s*$/, '') + nl + row;
fs.writeFileSync(f, s);
console.log('kinds row added to a-m3d');
