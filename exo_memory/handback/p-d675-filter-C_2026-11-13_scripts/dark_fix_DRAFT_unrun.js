// fix.js <worktree>: the dark one drawn (D675), as A's design words it: in the hunter's shape, a figure of its own from
// the hunter's model; without the model, a box slot of its own in the hunter's box shape. Its look and name stay his:
// nothing new is designed (the hunter's mesh, materials and gait). CRLF kept; each anchor must occur once.
const fs = require('fs'); process.chdir(process.argv[2]); const N = '\r\n';
const edit = (f, pairs) => { let s = fs.readFileSync(f, 'utf8'); for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(f + ': anchor ' + JSON.stringify(a).slice(0, 100)); s = s.replace(a, () => b); } fs.writeFileSync(f, s); };

edit('game/world/figures.h', [
  ['// How many of each kind can be drawn at once: the director\'s most (eight lesser bodies), with room to spare.' + N +
   'inline constexpr std::array<int, kChaserKinds> kFigureSlots = {1, 6, 6, 9, 0, 0, 2};' + N,
   '// How many of each kind can be drawn at once: the director\'s most (eight lesser bodies), with room to spare. In the' + N +
   '// order of chase::Kind: hunter, sprinter, interceptor, pack, charger, stalker, crawler, dark. D675: the dark one\'s' + N +
   '// entry was missing (seven for eight kinds, so it was 0 and nothing drew the thing that ends a run); its one slot is' + N +
   '// the hunter\'s box shape, used only when the hunter\'s model is not there (the stage draws the model in its place).' + N +
   'inline constexpr std::array<int, kChaserKinds> kFigureSlots = {1, 6, 6, 9, 0, 0, 2, 1};' + N],
]);
edit('game/world/figures.cpp', [
  ['    case Kind::Hunter:' + N + '      pair({0.17f, 0.50f, 0.0f}',
   '    case Kind::Hunter:' + N + '    case Kind::Dark:   // D675: in the hunter\'s shape (A\'s D673)' + N + '      pair({0.17f, 0.50f, 0.0f}'],
  ['    case Kind::Hunter:      return material_id(0, static_cast<MaterialRole>(12));' + N,
   '    case Kind::Hunter:' + N + '    case Kind::Dark:        return material_id(0, static_cast<MaterialRole>(12));' + N],
  ['    case Kind::Hunter:      return {0.060f, 0.060f, 0.066f};' + N,
   '    case Kind::Hunter:' + N + '    case Kind::Dark:        return {0.060f, 0.060f, 0.066f};' + N],
]);
edit('game/world/stage.h', [
  ['  bool hunter_drawn() const { return hunter_.on; }' + N,
   '  bool hunter_drawn() const { return hunter_.on; }' + N + '  bool dark_drawn() const { return dark_.on; }   // D675: the dark one, a second figure of the hunter\'s model' + N],
  ['  ModelFigure kid_, hunter_;' + N + '  float hunter_phase_ = 0.0f;' + N,
   '  ModelFigure kid_, hunter_, dark_;   // D675: dark_, the dark one, drawn in the hunter\'s shape from the hunter\'s model' + N +
   '  float hunter_phase_ = 0.0f, dark_phase_ = 0.0f;' + N],
]);
const st = fs.readFileSync('game/world/stage.cpp', 'utf8');
edit('game/world/stage.cpp', [
  // place_figures: the dark one's own figure, posed as the hunter's is.
  ['  bool hunter_out = false;' + N, '  bool hunter_out = false, dark_out = false;' + N],
  ['    if (k >= used.size() || used[k] >= dz::game::kFigureSlots[k]) continue;' + N,
   '    // D675: the dark one (A\'s D673, "in the hunter\'s shape"): a second figure of the hunter\'s model, its own phase, posed' + N +
   '    // by the same gait; its box slot stays put away.' + N +
   '    if (dark_.on && !dark_out && p.kind == dz::chase::Kind::Dark) {' + N +
   '      dark_out = true;' + N +
   '      dark_phase_ = std::fmod(dark_phase_ + p.speed * last_dt_ * dz::game::gait_phase_per_metre(dark_.rest, p.speed), 6.2831853f);' + N +
   '      dz::game::GaitMotion motion;' + N +
   '      motion.lean = p.lean;' + N +
   '      motion.pitch = p.pitch;' + N +
   '      motion.follow = p.follow;' + N +
   '      motion.look = p.look - p.heading;' + N +
   '      if (app.feet_on_floor()) motion.floor = [&app](dz::Vec3 at, float* y) { return app.floor_below(at, y); };' + N +
   '      pose_model(dark_, dark_.rig.palette_floats(dz::game::gait_pose(dark_.rest, p.pos, p.heading, p.speed, dark_phase_, motion)));' + N +
   '      dark_.away = false;' + N +
   '      ++figures_drawn_;' + N +
   '      continue;' + N +
   '    }' + N +
   '    if (k >= used.size() || used[k] >= dz::game::kFigureSlots[k]) continue;' + N],
  ['    pose_model(hunter_, away_palette(hunter_.rig.joints()));' + N + '    hunter_.away = true;' + N + '  }' + N,
   '    pose_model(hunter_, away_palette(hunter_.rig.joints()));' + N + '    hunter_.away = true;' + N + '  }' + N +
   '  if (dark_.on && !dark_out && !dark_.away) {' + N + '    pose_model(dark_, away_palette(dark_.rig.joints()));' + N + '    dark_.away = true;' + N + '  }' + N],
  // load_models: the second figure of the hunter's model, named apart in the note.
  ['  const auto take = [&](const char* name, uint32_t kit, bool kid, ModelFigure& figure) {' + N,
   '  const auto take = [&](const char* name, uint32_t kit, bool kid, ModelFigure& figure, const char* label = nullptr) {' + N +
   '    if (!label) label = name;' + N],
  ['  take("hunter", kHunterKit, false, hunter_);' + N + '  if (kid_.on || hunter_.on) {' + N,
   '  take("hunter", kHunterKit, false, hunter_);' + N +
   '  take("hunter", kHunterKit, false, dark_, "the dark one (hunter.glb)");   // D675: in the hunter\'s shape (A\'s D673)' + N +
   '  if (kid_.on || hunter_.on || dark_.on) {' + N],
  ['      hunter_ = ModelFigure{};' + N + '      upload_figures(nullptr);' + N,
   '      hunter_ = ModelFigure{};' + N + '      dark_ = ModelFigure{};' + N + '      upload_figures(nullptr);' + N],
]);
// take's notes name the label, not the file.
{
  let s = fs.readFileSync('game/world/stage.cpp', 'utf8');
  const from = s.indexOf('  const auto take = [&](const char* name, uint32_t kit, bool kid, ModelFigure& figure, const char* label = nullptr) {');
  const to = s.indexOf('  take("kid", kKidKit, true, kid_);');
  if (from < 0 || to < 0) throw new Error('take body');
  let body = s.slice(from, to);
  const before = body;
  body = body.split('+ name + ": "').join('+ label + ": "');
  if (body === before) throw new Error('no note to relabel');
  s = s.slice(0, from) + body + s.slice(to);
  fs.writeFileSync('game/world/stage.cpp', s);
}
edit('game/world/selftest.cpp', [
  ['      const bool model = p.kind == chase::Kind::Hunter && st && st->hunter_drawn();' + N,
   '      const bool model = st && ((p.kind == chase::Kind::Hunter && st->hunter_drawn()) || (p.kind == chase::Kind::Dark && st->dark_drawn()));' + N],
]);
console.log('the dark one drawn');
