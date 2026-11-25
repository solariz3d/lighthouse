// trace225 (a scratch tool, D676, pane A; NOT for landing, untracked): read only. Plays a kept run again headless, as dz-world --replay-run does, and prints
// every tick from FROM to TO seconds: the player and each chaser (id, kind, mode, position, speed), and every chase event in the replayed window.
//   trace225 <run.txt> <from_s> <to_s>
#include <cstdio>
#include <cstdlib>
#include <string>

#include "game/world/run_record.h"

using namespace dz;
using namespace dz::game;

int main(int argc, char** argv) {
  if (argc < 4) {
    std::fprintf(stderr, "usage: trace225 <run.txt> <from_s> <to_s>\n");
    return 2;
  }
  RunRecord rec;
  if (std::string err = read_run(argv[1], rec); !err.empty()) {
    std::fprintf(stderr, "read failed: %s\n", err.c_str());
    return 1;
  }
  const float from = static_cast<float>(std::atof(argv[2])), to = static_cast<float>(std::atof(argv[3]));
  // The window is counted back from the end of the run; make it reach back past `from`.
  const ReplayResult probe = replay_run(rec, 1.0f, 100.0f);
  const float        total = static_cast<float>(probe.ticks) / 240.0f;
  const ReplayResult r = replay_run(rec, total - from + 1.0f, 1.0f / 240.0f);
  std::printf("run %s: build %.7s, %u ticks (%.2f s), replay %s, error '%s'\n", argv[1], rec.build.c_str(), r.ticks, static_cast<double>(total),
              r.same ? "SAME as the record" : "DIFFERENT from the record", r.error.c_str());
  for (const ReplayMoment& m : r.moments) {
    const float s = static_cast<float>(m.tick) / 240.0f;
    if (s < from || s > to) continue;
    std::printf("t %8.4f  player (%7.2f %6.2f %7.2f) %5.2f m/s state %d |", static_cast<double>(s), static_cast<double>(m.player.x), static_cast<double>(m.player.y),
                static_cast<double>(m.player.z), static_cast<double>(m.player_speed), static_cast<int>(m.state));
    for (const ReplayMoment::Chaser& c : m.chasers)
      std::printf(" #%u %s mode %d (%7.2f %6.2f %7.2f) %5.2f |", c.id, chase::kind_name(c.kind), static_cast<int>(c.mode), static_cast<double>(c.pos.x),
                  static_cast<double>(c.pos.y), static_cast<double>(c.pos.z), static_cast<double>(c.speed));
    std::printf("\n");
  }
  std::printf("events in the replayed window:\n");
  for (const chase::Event& e : r.events) std::printf("  t %8.4f  %s\n", static_cast<double>(e.tick) / 240.0, chase::to_text(e).c_str());
  return 0;
}
