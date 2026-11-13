// L182g: the reactive shuttle joins the exploit search's family (registered in lighthouse p-l182-lines-A_2026-11-12.md, last section, before this code).
// CRLF-aware, every anchor exactly once. --check: anchors only.
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
  ['enum class Evader { Shuttle, Circle, FigureEight, DoorDance, StairJuke };', 'enum class Evader { Shuttle, Circle, FigureEight, DoorDance, StairJuke, ReactiveShuttle };'],
  ['//   StairJuke: not built (there is no stair arena yet): swept as "not swept"\n',
   '//   StairJuke: not built (there is no stair arena yet): swept as "not swept"\n//   ReactiveShuttle (L182g): a = the lane, b = the distance in metres at which the hunter closing makes him reverse (not a clock: what a person does)\n'],
  ['// The registered grids (chase/SPEED_MODEL.md, "L182c"): 12 shuttle, 16 circle, 8 figure-eight, 8 door dance and 8 stair juke cells.',
   '// The registered grids (chase/SPEED_MODEL.md, "L182c"): 12 shuttle, 16 circle, 8 figure-eight, 8 door dance and 8 stair juke cells; and L182g\'s 12 reactive-shuttle cells.'],
]);

patch('room.cpp', [
  ['    case Evader::StairJuke: return "stair-juke";\n', '    case Evader::StairJuke: return "stair-juke";\n    case Evader::ReactiveShuttle: return "react-shuttle";\n'],
  ['    case Evader::StairJuke: std::snprintf(buf, sizeof buf, "stair-juke side %.0f speed %.0f", static_cast<double>(a), static_cast<double>(speed)); break;\n',
   '    case Evader::StairJuke: std::snprintf(buf, sizeof buf, "stair-juke side %.0f speed %.0f", static_cast<double>(a), static_cast<double>(speed)); break;\n    case Evader::ReactiveShuttle: std::snprintf(buf, sizeof buf, "react-shuttle lane %.1f reverse at %.0f m speed %.0f", static_cast<double>(a), static_cast<double>(b), static_cast<double>(speed)); break;\n'],
  ['    for (float speed : {6.0f, 8.0f}) out.push_back({Evader::StairJuke, side, 0.0f, speed, 1});\n  return out;',
   '    for (float speed : {6.0f, 8.0f}) out.push_back({Evader::StairJuke, side, 0.0f, speed, 1});\n  for (float lane : {3.0f, 6.0f, 9.0f})   // L182g: the reactive shuttle\n    for (float near_m : {3.0f, 5.0f})\n      for (float speed : {6.0f, 8.0f}) out.push_back({Evader::ReactiveShuttle, lane, near_m, speed, 1});\n  return out;'],
  ['    case Evader::Shuttle:\n    case Evader::Circle:\n    case Evader::FigureEight: return &square;',
   '    case Evader::Shuttle:\n    case Evader::ReactiveShuttle:\n    case Evader::Circle:\n    case Evader::FigureEight: return &square;'],
  ['  if (cell.kind == Evader::Shuttle) {\n    pos = {c.x + (static_cast<float>(phase) - 2.5f) * 1.2f, 0.0f, room.lo.z + cell.a};',
   '  float prev_dist = 1e9f;  // reactive shuttle: how far the hunter was a tick ago, and the ticks before he may reverse again\n  int   cool = 0;\n  if (cell.kind == Evader::Shuttle || cell.kind == Evader::ReactiveShuttle) {\n    pos = {c.x + (static_cast<float>(phase) - 2.5f) * 1.2f, 0.0f, room.lo.z + cell.a};'],
  ['      case Evader::Circle: {\n        const Vec3  from_c = flat(pos - c);',
   '      case Evader::ReactiveShuttle: {\n        // Along the lane between the walls, and back the other way when the hunter is within `b` metres and closing (0.6 s before he may do it again).\n        if (pos.x > room.lo.x + room.side - 1.0f) dir_x = -1.0f;\n        if (pos.x < room.lo.x + 1.0f) dir_x = 1.0f;\n        if (cool > 0) --cool;\n        if (const Agent* h = run.hunter(); h && h->mode != Mode::Waiting) {\n          const float dist = length(flat(h->body.pos - pos));\n          if (cool == 0 && dist < cell.b && dist < prev_dist - 1e-4f) dir_x = -dir_x, cool = 144;\n          prev_dist = dist;\n        }\n        wish = {dir_x, 0, 0};\n        break;\n      }\n      case Evader::Circle: {\n        const Vec3  from_c = flat(pos - c);'],
]);

patch('tools/dz-chase/main.cpp', [
  ['  for (Evader e : {Evader::Shuttle, Evader::Circle, Evader::FigureEight, Evader::DoorDance, Evader::StairJuke}) {',
   '  for (Evader e : {Evader::Shuttle, Evader::ReactiveShuttle, Evader::Circle, Evader::FigureEight, Evader::DoorDance, Evader::StairJuke}) {'],
]);

patch('tests/room_tests.cpp', [
  ['n[5] = {};', 'n[6] = {};'],
  ['  DZ_CHECK(n[0] == 12 && n[1] == 16 && n[2] == 8 && n[3] == 8 && n[4] == 8);',
   '  // AMENDED BY NAME (L182g, registered in lighthouse p-l182-lines-A_2026-11-12.md before this code): the family gained the reactive shuttle, 12 cells (kind 5).\n  DZ_CHECK(n[0] == 12 && n[1] == 16 && n[2] == 8 && n[3] == 8 && n[4] == 8 && n[5] == 12);'],
]);
console.log('reactive shuttle patch ' + (process.argv.includes('--check') ? 'anchors ok (nothing written)' : 'applied'));
