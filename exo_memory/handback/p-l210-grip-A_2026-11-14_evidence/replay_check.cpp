// replay_check (a scratch tool, L210, pane A; NOT for landing, untracked): plays every kept run in a folder again, headless, and says for each whether
// both fingerprints came out the record's. For packet L210's R2: the count that replay the same on main and on the branch with the dials off.
//   replay_check <runs_folder>
#include <algorithm>
#include <cstdio>
#include <string>
#include <vector>

#include "game/world/run_record.h"

using namespace dz::game;

int main(int argc, char** argv) {
  if (argc < 2) {
    std::fprintf(stderr, "usage: replay_check <runs_folder>\n");
    return 2;
  }
  std::vector<std::string> runs = list_runs(argv[1]);
  int same = 0, differ = 0, failed = 0;
  for (const std::string& path : runs) {
    RunRecord rec;
    if (std::string err = read_run(path, rec); !err.empty()) {
      std::printf("%-28s READ FAILED: %s\n", path.substr(path.find_last_of("/\\") + 1).c_str(), err.c_str());
      ++failed;
      continue;
    }
    const ReplayResult r = replay_run(rec, 1.0f, 100.0f);
    const bool ok = r.error.empty() && r.same;
    std::printf("%-28s build %.7s ticks %6u %s%s\n", path.substr(path.find_last_of("/\\") + 1).c_str(), rec.build.c_str(), r.ticks, ok ? "SAME" : "DIFFERENT",
                r.error.empty() ? "" : (" (" + r.error + ")").c_str());
    (ok ? same : differ) += 1;
  }
  std::printf("replay_check: %zu runs, %d same, %d different, %d unreadable\n", runs.size(), same, differ, failed);
  return 0;
}
