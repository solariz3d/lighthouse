const fs = require('fs');
const root = 'C:/Users/zackn/Downloads/dreamzone-3-a-l182h/chase/';
const CR = String.fromCharCode(13), LF = String.fromCharCode(10), BS = String.fromCharCode(92);
function patch(file, pairs) {
  let s = fs.readFileSync(root + file, 'utf8');
  const crlf = s.includes(CR + LF);
  s = s.split(CR + LF).join(LF);
  for (const [a, b] of pairs) {
    const n = s.split(a).length - 1;
    if (n !== 1) throw new Error(file + ': expected 1 match, got ' + n + ' for: ' + a.slice(0, 80));
    s = s.replace(a, () => b);
  }
  if (crlf) s = s.split(LF).join(CR + LF);
  fs.writeFileSync(root + file, s);
}

patch('CMakeLists.txt', [[
  `    slosh.cpp
  )`,
  `    slosh.cpp
    room.cpp
  )`]]);

const cmd = [
'// ---------------------------------------------------------------------------------------------------------------',
'// room: his item 178\'s test case (chase/room.h): 24 runs of a scripted wall-to-wall player and 24 of a circle-strafer in a square room, against the real hunter.',
'//   dz-chase room [--speed "name=value;..."] [--csv PREFIX] [--threads N]',
'// ---------------------------------------------------------------------------------------------------------------',
'int cmd_room(const Options& o) {',
'  SpeedModel sm;',
'  if (!make_speed(o, sm)) return 2;',
'  const Room room = make_room();',
'  if (!room.ok) {',
'    std::fprintf(stderr, "dz-chase: the room did not build' + BS + 'n");',
'    return 2;',
'  }',
'  struct Job {',
'    RoomBot bot;',
'    int     variant, phase;',
'    RoomRun out;',
'  };',
'  std::vector<Job> jobs;',
'  for (RoomBot b : {RoomBot::WallToWall, RoomBot::CircleStrafe})',
'    for (int v = 0; v < kRoomVariants; ++v)',
'      for (int p = 0; p < kRoomPhases; ++p) jobs.push_back({b, v, p, {}});',
'  std::atomic<size_t> next{0};',
'  auto                work = [&] {',
'    for (;;) {',
'      const size_t k = next.fetch_add(1);',
'      if (k >= jobs.size()) return;',
'      jobs[k].out = play_room(room, sm, jobs[k].bot, jobs[k].variant, jobs[k].phase);',
'    }',
'  };',
'  const int                threads = o.threads > 0 ? o.threads : 2;',
'  std::vector<std::thread> pool;',
'  for (int i = 0; i < threads; ++i) pool.emplace_back(work);',
'  for (std::thread& t : pool) t.join();',
'  std::printf("room (12 m square, the hunter in at a corner, no head start, 60 s a run); speed model: %s' + BS + 'n", o.speed_text.empty() ? "default" : o.speed_text.c_str());',
'  std::printf("%-14s %6s %9s %12s %10s %8s' + BS + 'n", "player", "runs", "caught", "median s", "wall hits", "stalls");',
'  for (RoomBot b : {RoomBot::WallToWall, RoomBot::CircleStrafe}) {',
'    std::vector<float> secs;',
'    int                runs = 0, caught = 0;',
'    uint32_t           hits = 0, stalls = 0;',
'    for (const Job& j : jobs) {',
'      if (j.bot != b) continue;',
'      ++runs, caught += j.out.caught ? 1 : 0, hits += j.out.wall_hits, stalls += j.out.stalls;',
'      secs.push_back(j.out.caught ? j.out.seconds : 60.0f);  // a run not caught counts as the whole of it',
'    }',
'    std::printf("%-14s %6d %6d/%-2d %12.1f %10u %8u' + BS + 'n", room_bot_name(b), runs, caught, runs, pct(secs, 0.5), hits, stalls);',
'  }',
'  if (!o.csv.empty()) {',
'    FILE* f = std::fopen((o.csv + "_room.csv").c_str(), "w");',
'    if (!f) return 2;',
'    std::fprintf(f, "bot,variant,phase,caught,seconds,wall_hits,stalls' + BS + 'n");',
'    for (const Job& j : jobs)',
'      std::fprintf(f, "%s,%d,%d,%d,%.3f,%u,%u' + BS + 'n", room_bot_name(j.bot), j.variant, j.phase, j.out.caught ? 1 : 0, static_cast<double>(j.out.seconds), j.out.wall_hits, j.out.stalls);',
'    std::fclose(f);',
'  }',
'  return 0;',
'}',
''].join(LF);

patch('tools/dz-chase/main.cpp', [[
  `#include "chase/slosh.h"`,
  `#include "chase/room.h"
#include "chase/slosh.h"`], [
  `}  // namespace

int main(int argc, char** argv) {`,
  cmd + LF + `}  // namespace

int main(int argc, char** argv) {`], [
  `    if (o.command == "compare") return cmd_compare(o);`,
  `    if (o.command == "compare") return cmd_compare(o);
    if (o.command == "room") return cmd_room(o);`]]);
console.log('hawk patched 2');
