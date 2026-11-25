// probe_place: D677 (his item 251), a scratch tool, never committed. For each point given, builds the world of `seed` as the replay
// does (a WorldApp with no files), stands the player in the point's chunk so it streams in, and casts rays at waist height (1.0 m over
// the point) in 24 directions out to 6 m against the world (the same probe the game's lean reads walls with). Prints, per point, the
// distance to a wall each way, the narrowest width across (a direction and its opposite), and the directions open past 6 m.
//   probe_place <seed> <x> <y> <z> [<x> <y> <z> ...]
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <filesystem>
#include <string>
#include <vector>

#include "game/world/world_app.h"
#include "world/coords.h"

using namespace dz;
using namespace dz::game;

int main(int argc, char** argv) {
  if (argc < 5 || (argc - 2) % 3 != 0) {
    std::fprintf(stderr, "usage: probe_place <seed> <x> <y> <z> [...]\n");
    return 2;
  }
  const uint32_t seed = static_cast<uint32_t>(std::atoi(argv[1]));
  namespace fs = std::filesystem;
  const std::string dir = (fs::temp_directory_path() / "dz_probe_place_no_files").string();
  for (int a = 2; a + 2 < argc; a += 3) {
    const Vec3 p{static_cast<float>(std::atof(argv[a])), static_cast<float>(std::atof(argv[a + 1])), static_cast<float>(std::atof(argv[a + 2]))};
    WorldApp app(dir, true, seed);
    app.resume();
    if (!app.teleport(world::chunk_of(p))) {
      std::printf("(%.2f, %.2f, %.2f): could not stand in its chunk\n", static_cast<double>(p.x), static_cast<double>(p.y), static_cast<double>(p.z));
      continue;
    }
    for (int i = 0; i < 125; ++i) app.advance(4'000'000LL);   // half a second, so the chunk is in
    const WallProbe wall = app.wall_probe();
    const Vec3      from = p + Vec3{0.0f, 1.0f, 0.0f};
    constexpr int   kDirs = 24;
    constexpr float kMax = 6.0f;
    float d[kDirs];
    std::string open;
    for (int k = 0; k < kDirs; ++k) {
      const float h = 2.0f * 3.14159265f * static_cast<float>(k) / kDirs;   // a heading: 0 is +Z, + toward +X
      const Vec3  delta{std::sin(h) * kMax, 0.0f, std::cos(h) * kMax};
      float       f = 1.0f;
      d[k] = wall(from, delta, &f) ? f * kMax : kMax;
      if (d[k] >= kMax) open += " " + std::to_string(k * 360 / kDirs);
    }
    float narrow = 1e9f;
    int   at = 0;
    for (int k = 0; k < kDirs / 2; ++k)
      if (d[k] + d[k + kDirs / 2] < narrow) narrow = d[k] + d[k + kDirs / 2], at = k;
    std::printf("(%.2f, %.2f, %.2f): narrowest across %.2f m (headings %d and %d); open past %.0f m at headings:%s\n  each way (heading:m):",
                static_cast<double>(p.x), static_cast<double>(p.y), static_cast<double>(p.z), static_cast<double>(narrow), at * 360 / kDirs,
                (at + kDirs / 2) * 360 / kDirs, static_cast<double>(kMax), open.empty() ? " none" : open.c_str());
    for (int k = 0; k < kDirs; ++k) std::printf(" %d:%.2f", k * 360 / kDirs, static_cast<double>(d[k]));
    std::printf("\n");
  }
  return 0;
}
