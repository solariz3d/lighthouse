// m3b_his (a scratch tool, D677, pane A; NOT for landing, untracked): plays his run again as replay_run does to the hunter's drop (item 225), then
// places a hunter body ON THE ROOT at that drop link's foot with the link as its path, steps it with the game's own world as its collision (M3b), and
// casts its path tick to tick as m3read2 did (its feet +5 cm and 1 m up). Registered (registration_m3b2.md): no segment meets a solid.
//   m3b_his <run.txt>
#include <cmath>
#include <cstdio>
#include <filesystem>
#include <string>
#include <vector>

#include "chase/archetype.h"
#include "chase/chaser.h"
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
  WorldApp app((fs::temp_directory_path() / "dz_m3b_his_no_files").string(), true, record.seed);
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

  const uint32_t first = 35760;
  uint32_t       seen = 0;
  for (uint64_t frame = 0; frame < (record.inputs.ticks.size() + 2400) * 5; ++frame) {
    app.advance(1'000'000);
    const chase::StreamedChase* sc = app.chase();
    if (!sc) continue;
    seen = sc->run().tick();
    if (seen >= first) break;
  }
  const chase::StreamedChase* sc = app.chase();
  if (!sc || seen < first) {
    std::printf("never reached tick %u (at %u)\n", first, seen);
    return 1;
  }
  std::printf("at tick %u (%.4f s)\n", seen, seen / 240.0);

  // The drop link whose foot is nearest the one the trace read, (-67.64, 3.54, -484.27).
  const Vec3      A = {-67.64f, 3.54f, -484.27f};
  const nav::World& navw = sc->nav();
  nav::Link        link;
  float            best = 1e30f;
  std::vector<nav::TileCoord> tiles;
  navw.for_each_poly([&](const nav::World::Poly& poly) {
    for (const nav::TileCoord& t : tiles)
      if (t == poly.tile) return;
    tiles.push_back(poly.tile);
  });
  for (const nav::TileCoord& t : tiles) {
    const nav::TileData* d = navw.tile(t);
    if (!d) continue;
    for (const nav::Link& l : d->links) {
      if (l.move != nav::Move::Drop) continue;
      const float e = length(l.from - A);
      if (e < best) best = e, link = l;
    }
  }
  if (best > 1.0f) {
    std::printf("no drop link within 1 m of the trace's foot (nearest %.2f m)\n", best);
    return 1;
  }
  std::printf("the link: from (%.2f %.2f %.2f) to (%.2f %.2f %.2f), %.2f m from the trace's foot\n", link.from.x, link.from.y, link.from.z, link.to.x,
              link.to.y, link.to.z, best);

  nav::Query     query(navw);
  chase::Chaser  c;
  c.id = 99, c.kind = chase::Kind::Hunter;
  c.body = chase::make_body(chase::archetype(chase::Kind::Hunter).limits, 8.0f, 1.0f, chase::SpeedModel{});
  c.body.root_law = 1;
  const Vec3 span = flat(link.to - link.from);
  if (!chase::place(c, query, link.from, det_atan2(span.x, span.z))) {
    std::printf("could not place the body at the link's foot\n");
    return 1;
  }
  nav::PathPoint a, b;
  a.pos = c.pos, a.move = nav::Move::Drop, a.length = link.length;
  b.pos = link.to, b.move = nav::Move::Walk;
  c.path = {};
  c.path.found = true;
  c.path.points = {a, b};
  c.leg = 0, c.has_path = true, c.arrived = false;
  const nav::Profile profile = chase::profile_of(c.body, "hunter");
  c.takeoff = chase::drop_takeoffs(c.path, query, profile, c.body);
  const float takeoff = c.takeoff.empty() ? 0.0f : c.takeoff[0];
  c.speed = std::max(takeoff, 0.5f);
  std::printf("take-off %.3f m/s; drop height %.2f m\n", takeoff, link.from.y - link.to.y);

  std::vector<Vec3> path{c.pos};
  bool on = false, landed = false;
  int  ticks = 0;
  for (int t = 0; t < 240 * 8; ++t) {
    const uint32_t refused = c.drops_refused;
    chase::step(c, query, false, sc);
    path.push_back(c.pos);
    if (c.gait == chase::Gait::Drop) on = true, ++ticks;
    else if (on) {
      landed = true;
      std::printf("off the link after %d ticks: at (%.2f %.2f %.2f), %s; flat speed at landing %.3f; drops refused %u\n", ticks, c.pos.x, c.pos.y, c.pos.z,
                  c.drops_refused != refused ? "PUT BACK" : (c.leg >= 1 ? "at the link's landing" : "elsewhere on the mesh"), c.fall_v, c.drops_refused);
      break;
    }
  }
  if (!landed) std::printf("never left the link (on it: %s, %d ticks)\n", on ? "yes" : "no", ticks);

  int feet = 0, chest = 0;
  for (size_t i = 1; i < path.size(); ++i) {
    for (const float up : {0.05f, 1.0f}) {
      const Vec3 p = path[i - 1] + Vec3{0, up, 0}, q = path[i] + Vec3{0, up, 0};
      float      f = 1.0f;
      if (length(q - p) > 1e-5f && app.world().raycast(p, q - p, &f)) {
        const Vec3 at = p + (q - p) * f;
        std::printf("  path tick %zu (+%.2f m): SOLID at (%.2f %.2f %.2f)\n", i, up, at.x, at.y, at.z);
        (up < 0.5f ? feet : chest) += 1;
      }
    }
  }
  std::printf("the root's path: %zu ticks; segments meeting a solid at the feet %d, 1 m up %d\n", path.size() - 1, feet, chest);
  return 0;
}
