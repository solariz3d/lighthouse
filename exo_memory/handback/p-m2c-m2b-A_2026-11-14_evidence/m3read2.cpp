// m3read2 (a scratch tool, D677, pane A; NOT for landing, untracked; READ ONLY): plays his run again as replay_run does, and at the hunter's drop (item 225)
// asks the simulation's own collision what solid lies within 0.3 m of the straight line from the drop's start to its landing, and along the path the hunter
// actually took (its feet, and 1 m up), tick by tick.
//   m3read2 <run.txt>
#include <cmath>
#include <cstdio>
#include <filesystem>
#include <string>
#include <vector>

#include "game/world/run_record.h"
#include "game/world/world_app.h"

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
  WorldApp app((fs::temp_directory_path() / "dz_m3read2_no_files").string(), true, record.seed);
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

  // The drop as the trace read it (lighthouse exo_memory/handback/p-m2-speed-plan-A_2026-11-14.md, item 225): from tick 35762 (149.0083 s) for 217 ticks.
  const uint32_t first = 35760, last = 35762 + 217 + 2;
  std::vector<Vec3> path;
  bool              tube_done = false;
  uint32_t          seen = 0;
  for (uint64_t frame = 0; frame < (record.inputs.ticks.size() + 2400) * 5; ++frame) {
    app.advance(1'000'000);
    const chase::StreamedChase* sc = app.chase();
    if (!sc) continue;
    const chase::Run& run = sc->run();
    const uint32_t    tick = run.tick();
    if (tick == seen) continue;
    seen = tick;
    if (tick < first) continue;
    for (const chase::Agent& a : run.agents())
      if (a.body.id == 1) path.push_back(a.body.pos);
    if (!tube_done) {
      tube_done = true;
      const Vec3 A = {-67.64f, 3.54f, -484.27f}, B = {-70.50f, 0.04f, -484.50f};
      const Vec3 d = B - A;
      const float L = length(d);
      const Vec3 u = d * (1.0f / L);
      // Two directions across the line.
      Vec3 s1 = Vec3{-u.z, 0.0f, u.x};
      s1 = s1 * (1.0f / length(s1));
      const Vec3 s2 = Vec3{u.y * s1.z - u.z * s1.y, u.z * s1.x - u.x * s1.z, u.x * s1.y - u.y * s1.x};
      std::printf("at tick %u (%.4f s): the straight line from (%.2f %.2f %.2f) to (%.2f %.2f %.2f), %.2f m\n", tick, tick / 240.0, A.x, A.y, A.z, B.x, B.y,
                  B.z, L);
      int hits = 0;
      for (int ring = 0; ring <= 8; ++ring) {
        Vec3 off{};
        if (ring > 0) {
          const float a = static_cast<float>(ring - 1) * 0.7853982f;
          off = s1 * (0.3f * std::cos(a)) + s2 * (0.3f * std::sin(a));
        }
        for (int dir = 0; dir < 2; ++dir) {
          const Vec3 from = dir == 0 ? A + off : B + off;
          const Vec3 delta = dir == 0 ? d : d * -1.0f;
          float      f = 1.0f;
          if (app.world().raycast(from, delta, &f)) {
            const Vec3 at = from + delta * f;
            std::printf("  line %d (%s, offset %.2f m): SOLID at %.3f of the way, (%.2f %.2f %.2f)\n", ring, dir == 0 ? "down" : "up", ring ? 0.3 : 0.0, f, at.x,
                        at.y, at.z);
            ++hits;
          }
        }
      }
      std::printf("  %d of 18 lines met a solid\n", hits);
    }
    if (tick >= last) break;
  }
  // The path it actually took, tick to tick: its feet, and 1 m up.
  int feet = 0, chest = 0;
  for (size_t i = 1; i < path.size(); ++i) {
    for (const float up : {0.05f, 1.0f}) {
      const Vec3 a = path[i - 1] + Vec3{0, up, 0}, b = path[i] + Vec3{0, up, 0};
      float      f = 1.0f;
      if (length(b - a) > 1e-5f && app.world().raycast(a, b - a, &f)) {
        const Vec3 at = a + (b - a) * f;
        std::printf("  path tick %zu (+%.2f m): SOLID at (%.2f %.2f %.2f)\n", i, up, at.x, at.y, at.z);
        (up < 0.5f ? feet : chest) += 1;
      }
    }
  }
  std::printf("the path: %zu ticks read; segments meeting a solid at the feet %d, 1 m up %d\n", path.size(), feet, chest);
  if (!path.empty()) std::printf("path from (%.2f %.2f %.2f) to (%.2f %.2f %.2f)\n", path.front().x, path.front().y, path.front().z, path.back().x, path.back().y, path.back().z);
  return 0;
}
