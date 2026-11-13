// L182f: the exploit search takes the difficulty level (it was fixed at level 1). Default stays 1: nothing changes unless --level is given. CRLF-aware, anchors exactly once.
const fs = require('fs');
const WT = 'C:/Users/zackn/Downloads/dreamzone-3-a-l182h/chase/';
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
function patch(file, edits) {
  let s = fs.readFileSync(WT + file, 'utf8');
  const crlf = s.includes(CR + LF);
  s = s.split(CR + LF).join(LF);
  for (const [from, to] of edits) {
    const n = s.split(from).length - 1;
    if (n !== 1) throw new Error(file + ': anchor count ' + n + ' for: ' + from.slice(0, 70));
    s = s.replace(from, () => to);
  }
  if (crlf) s = s.split(LF).join(CR + LF);
  if (!process.argv.includes('--check')) fs.writeFileSync(WT + file, s);
}
patch('room.h', [
  ['RoomRun play_cell(const RoomSet& rooms, const SpeedModel& model, const EvaderCell& cell, int phase, float max_seconds = 60.0f);',
   '// `level` is the difficulty level of the hunter (0 to 3; the game ships 3, brutal, only: his ruling frontdoor_onboarding-2); 1 was the first registration\'s.\nRoomRun play_cell(const RoomSet& rooms, const SpeedModel& model, const EvaderCell& cell, int phase, float max_seconds = 60.0f, int level = 1);'],
]);
patch('room.cpp', [
  ['RoomRun play_cell(const RoomSet& rooms, const SpeedModel& model, const EvaderCell& cell, int phase, float max_seconds) {',
   'RoomRun play_cell(const RoomSet& rooms, const SpeedModel& model, const EvaderCell& cell, int phase, float max_seconds, int level) {'],
  ['  rp.difficulty = difficulty_level(1);', '  rp.difficulty = difficulty_level(level);'],
]);
patch('tools/dz-chase/main.cpp', [
  ['      jobs[k].out = play_cell(rooms, sm, cells[jobs[k].cell], jobs[k].phase);',
   '      jobs[k].out = play_cell(rooms, sm, cells[jobs[k].cell], jobs[k].phase, 60.0f, level);'],
  ['  const std::vector<EvaderCell> cells = evader_cells();\n  struct Job {',
   '  const std::vector<EvaderCell> cells = evader_cells();\n  const int                     level = o.levels.empty() ? 1 : o.levels[0];   // --level N (default 1, the first registration\'s)\n  struct Job {'],
  ['  std::printf("exploit search: 6 start phases a cell, up to 60 s a run, the hunter in at a corner with no head start; speed model: %s',
   '  std::printf("exploit search: level %d (%s), 6 start phases a cell, up to 60 s a run, the hunter in at a corner with no head start; speed model: %s'],
  ['o.speed_text.empty() ? "default" : o.speed_text.c_str());\n  std::printf("%-13s %6s %10s',
   'level, difficulty_level(level).level_name, o.speed_text.empty() ? "default" : o.speed_text.c_str());\n  std::printf("%-13s %6s %10s'],
]);
console.log('room level patch ' + (process.argv.includes('--check') ? 'anchors ok (nothing written)' : 'applied'));
