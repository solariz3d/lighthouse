// m3e_ledge (a scratch tool, D677, pane A; NOT for landing, untracked; READ ONLY): plays his run again to the hunter's drop (item 225) and reads
// what is solid at that ledge: (1) a height profile across the drop (the first solid met casting down from 8 m, every 5 cm along the drop's line and
// 0.5 m either side), (2) horizontal casts from the ledge toward the landing at heights 0.05 to 2.5 m above the upper floor, (3) the way down
// with drops allowed (the hunter's profile) and without (walk only), from the link's foot to its landing.
//   m3e_ledge <run.txt>
#include <cmath>
#include <cstdio>
#include <filesystem>
#include <string>
#include <vector>

#include "core/det_math.h"
#include "game/world/run_record.h"
#include "game/world/world_app.h"
#include "nav/nav.h"

using namespace dz;
using namespace dz::game;
namespace fs = std::filesystem;

int main(int argc, char** argv) {
  if (argc < 2) return 2;
  RunRecord record;
  if (std::string err = read_run(argv[1], record); !err.empty()) {
    std::fprintf(stderr, "%s\n", err.c_str());
    return 1;
  }
  WorldApp app((fs::temp_directory_path() / "dz_m3e_ledge_no_files").string(), true, record.seed);
  if (!app.apply_params(record.params)) return 1;
  app.apply_speed(record.speed);
  WorldSettings w = record.world;
  w.seed = static_cast<float>(record.seed);
  w.level = static_cast<float>(record.level);
  app.apply_world_settings(w);
  app.set_seed(record.seed);
  app.set_level(record.level);
  const chase::Difficulty own = app.difficulty();
  for (size_t d = 0; d < static_cast<size_t>(chase::kDialCount); ++d) {
    const chase::DialCurve& c = record.difficulty.curves[d];
    const chase::DialCurve& o = own.curves[d];
    if (c.start != o.start || c.per_minute != o.per_minute || c.limit != o.limit) app.set_curve(d, c.start, c.per_minute, c.limit);
  }
  app.play_record(record.inputs.ticks);
  uint32_t seen = 0;
  for (uint64_t frame = 0; frame < (record.inputs.ticks.size() + 2400) * 5; ++frame) {
    app.advance(1'000'000);
    const chase::StreamedChase* sc = app.chase();
    if (!sc) continue;
    seen = sc->run().tick();
    if (seen >= 35760) break;
  }
  const chase::StreamedChase* sc = app.chase();
  if (!sc) return 1;
  std::printf("at tick %u\n", seen);
  const Vec3 A = {-67.50f, 3.50f, -484.50f}, B = {-70.50f, 0.00f, -484.50f};

  // (1) the height profile: the first solid met casting down from 8 m.
  for (const float dz : {-0.5f, 0.0f, 0.5f}) {
    std::printf("height profile at z %.2f (x: top of the first solid from above; '-' none down to -1 m):\n", A.z + dz);
    std::string line;
    for (float x = -66.5f; x >= -71.5f; x -= 0.05f) {
      const Vec3 from{x, 8.0f, A.z + dz};
      const Vec3 delta{0.0f, -9.0f, 0.0f};
      float      f = 1.0f;
      char       buf[48];
      if (app.world().raycast(from, delta, &f)) std::snprintf(buf, sizeof buf, "  %.2f:%.2f", x, from.y + delta.y * f);
      else std::snprintf(buf, sizeof buf, "  %.2f:-", x);
      line += buf;
    }
    std::printf("%s\n", line.c_str());
  }
  // The ceiling over the ledge: the first solid met casting up from 0.2 m above the upper floor.
  for (float x = -67.0f; x >= -70.5f; x -= 0.25f) {
    float f = 1.0f;
    const Vec3 from{x, A.y + 0.2f, A.z};
    if (app.world().raycast(from, {0.0f, 6.0f, 0.0f}, &f)) std::printf("  above x %.2f: solid at y %.2f\n", x, from.y + 6.0f * f);
    else std::printf("  above x %.2f: nothing within 6 m\n", x);
  }
  // (2) horizontal casts from 0.5 m behind the ledge's foot toward the landing, at heights above the upper floor.
  for (const float h : {0.05f, 0.3f, 0.6f, 0.9f, 1.0f, 1.2f, 1.5f, 1.8f, 2.1f, 2.5f}) {
    const Vec3 from{A.x + 0.5f, A.y + h, A.z};
    const Vec3 delta{-4.0f, 0.0f, 0.0f};
    float      f = 1.0f;
    if (app.world().raycast(from, delta, &f)) std::printf("  across at %.2f m up: solid at x %.2f (%.2f m past the foot)\n", h, from.x + delta.x * f, A.x - (from.x + delta.x * f));
    else std::printf("  across at %.2f m up: clear for 4 m\n", h);
  }
  // (3) the way down: with drops (the hunter) and walk only.
  const nav::World& navw = sc->nav();
  nav::Query        query(navw, 65536, 65536);
  for (const nav::Profile* p : {&nav::kHunter, &nav::kWalker}) {
    nav::Path path;
    query.find_path(A, B, *p, path);
    std::printf("way down, %s: found %d partial %d, %.1f m, %.1f s, %zu points:", p->name, path.found ? 1 : 0, path.partial ? 1 : 0, path.length, path.seconds,
                path.points.size());
    for (const nav::PathPoint& q : path.points) std::printf(" (%.1f %.1f %.1f %s)", q.pos.x, q.pos.y, q.pos.z, nav::move_name(q.move));
    std::printf("\n");
  }
  return 0;
}
