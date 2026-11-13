// replay_dump (a scratch tool in a scratch worktree at e0184ea; pane A, 2026-11-13; not for landing).
// Plays a run record again headless, on the build that wrote it, and dumps the whole run: one row every `step` seconds for the player and for every chaser,
// and the chase's events. It reads the record's .txt and the .dzr beside it (read_run) and writes only to the prefix it is given.
//   replay_dump <run.txt> <out_prefix> [step_s]
#include <cstdio>
#include <cstdlib>
#include <string>

#include "chase/archetype.h"
#include "chase/run.h"
#include "game/world/run_record.h"
#include "sim/world.h"

using namespace dz;
using namespace dz::game;

int main(int argc, char** argv) {
  if (argc < 3) {
    std::fprintf(stderr, "usage: replay_dump <run.txt> <out_prefix> [step_s]\n");
    return 2;
  }
  RunRecord rec;
  if (std::string err = read_run(argv[1], rec); !err.empty()) {
    std::fprintf(stderr, "read: %s\n", err.c_str());
    return 2;
  }
  const float        step = argc > 3 ? static_cast<float>(std::atof(argv[3])) : 0.1f;
  const ReplayResult r = replay_run(rec, 1000.0f, step);
  std::printf("replay: error='%s' ticks %u sim_hash %016llx chase_hash %016llx same %d seconds %.3f moments %zu events %zu\n", r.error.c_str(), r.ticks,
              static_cast<unsigned long long>(r.sim_hash), static_cast<unsigned long long>(r.chase_hash), r.same ? 1 : 0, static_cast<double>(r.seconds),
              r.moments.size(), r.events.size());
  std::printf("record: sim_hash %016llx chase_hash %016llx, ticks %zu\n", static_cast<unsigned long long>(rec.inputs.final_hash),
              static_cast<unsigned long long>(rec.chase_hash), rec.inputs.ticks.size());
  if (!r.error.empty()) return 1;
  const std::string prefix = argv[2];
  FILE*             fp = std::fopen((prefix + "_player.csv").c_str(), "w");
  FILE*             fc = std::fopen((prefix + "_chasers.csv").c_str(), "w");
  FILE*             fe = std::fopen((prefix + "_events.txt").c_str(), "w");
  if (!fp || !fc || !fe) {
    std::fprintf(stderr, "cannot write %s_*\n", prefix.c_str());
    return 2;
  }
  std::fprintf(fp, "t,x,y,z,yaw,state,speed\n");
  std::fprintf(fc, "t,id,kind,mode,x,y,z,speed\n");
  for (const ReplayMoment& m : r.moments) {
    const double t = static_cast<double>(m.tick) / 240.0;
    std::fprintf(fp, "%.3f,%.3f,%.3f,%.3f,%.4f,%s,%.3f\n", t, static_cast<double>(m.player.x), static_cast<double>(m.player.y), static_cast<double>(m.player.z),
                 static_cast<double>(m.player_yaw), sim::to_string(m.state), static_cast<double>(m.player_speed));
    for (const ReplayMoment::Chaser& c : m.chasers)
      std::fprintf(fc, "%.3f,%u,%s,%s,%.3f,%.3f,%.3f,%.3f\n", t, c.id, chase::kind_name(c.kind), chase::mode_name(c.mode), static_cast<double>(c.pos.x),
                   static_cast<double>(c.pos.y), static_cast<double>(c.pos.z), static_cast<double>(c.speed));
  }
  for (const chase::Event& e : r.events) std::fprintf(fe, "%s\n", chase::to_text(e).c_str());
  std::fclose(fp), std::fclose(fc), std::fclose(fe);
  return 0;
}
