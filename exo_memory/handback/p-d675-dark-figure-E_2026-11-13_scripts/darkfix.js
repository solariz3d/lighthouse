// The Dark's figure (D675 item 3, pane E): a second model figure from hunter.glb, posed for the first Kind::Dark pose
// as the hunter is, with its own stride phase. Each anchor exactly once. node darkfix.js <worktree>
const fs = require('fs');
const path = require('path');
const wt = process.argv[2];
const edit = (rel, pairs) => {
  const p = path.join(wt, rel);
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) {
    const n = s.split(a).length - 1;
    if (n !== 1) throw new Error(rel + ': anchor x' + n + ': ' + a.slice(0, 70));
    s = s.replace(a, () => b);
  }
  fs.writeFileSync(p, crlf ? s.replace(/\n/g, '\r\n') : s);
  console.log('edited ' + rel);
};
edit('game/world/stage.h', [
  ['  ModelFigure kid_, hunter_;\n  float hunter_phase_ = 0.0f;\n',
   '  ModelFigure kid_, hunter_;\n  float hunter_phase_ = 0.0f;\n' +
   '  // D675 (pane E): the Dark (Kind::Dark, the one that comes in overtime) drawn in the hunter\'s shape, as A\'s design words\n' +
   '  // it: a model figure of its own from hunter.glb, with its own stride. Its look and name are the keeper\'s; nothing here\n' +
   '  // is designed.\n' +
   '  ModelFigure dark_;\n  float dark_phase_ = 0.0f;\n'],
]);
edit('game/world/stage.cpp', [
  ['  bool hunter_out = false;\n  for (const dz::game::ChaserPose& p : poses_) {\n',
   '  bool hunter_out = false, dark_out = false;\n  for (const dz::game::ChaserPose& p : poses_) {\n'],
  ['    if (k >= used.size() || used[k] >= dz::game::kFigureSlots[k]) {\n',
   '    // D675: the first Dark, in the hunter\'s shape: the hunter\'s model again, posed by the same gait with its own stride.\n' +
   '    if (dark_.on && !dark_out && p.kind == dz::chase::Kind::Dark) {\n' +
   '      dark_out = true;\n' +
   '      dark_phase_ += p.speed * last_dt_ * dz::game::gait_phase_per_metre(dark_.rest, p.speed);\n' +
   '      dark_phase_ = std::fmod(dark_phase_, 6.2831853f);\n' +
   '      dz::game::GaitMotion motion;\n' +
   '      motion.lean = p.lean;\n' +
   '      motion.pitch = p.pitch;\n' +
   '      motion.follow = p.follow;\n' +
   '      motion.look = p.look - p.heading;\n' +
   '      if (app.feet_on_floor()) motion.floor = [&app](dz::Vec3 at, float* y) { return app.floor_below(at, y); };\n' +
   '      pose_model(dark_, dark_.rig.palette_floats(dz::game::gait_pose(dark_.rest, p.pos, p.heading, p.speed, dark_phase_, motion)));\n' +
   '      dark_.away = false;\n' +
   '      ++figures_drawn_;\n' +
   '      continue;\n' +
   '    }\n' +
   '    if (k >= used.size() || used[k] >= dz::game::kFigureSlots[k]) {\n'],
  ['  if (hunter_.on && !hunter_out && !hunter_.away) {\n    pose_model(hunter_, away_palette(hunter_.rig.joints()));\n    hunter_.away = true;\n  }\n',
   '  if (hunter_.on && !hunter_out && !hunter_.away) {\n    pose_model(hunter_, away_palette(hunter_.rig.joints()));\n    hunter_.away = true;\n  }\n' +
   '  if (dark_.on && !dark_out && !dark_.away) {\n    pose_model(dark_, away_palette(dark_.rig.joints()));\n    dark_.away = true;\n  }\n'],
  ['  take("hunter", kHunterKit, false, hunter_);\n  if (kid_.on || hunter_.on) {\n',
   '  take("hunter", kHunterKit, false, hunter_);\n' +
   '  // D675: the Dark in the hunter\'s shape: the same model and its kit, loaded again so it can be posed apart.\n' +
   '  if (hunter_.on) take("hunter", kHunterKit, false, dark_);\n' +
   '  if (kid_.on || hunter_.on) {\n'],
  ['      kid_ = ModelFigure{};\n      hunter_ = ModelFigure{};\n      upload_figures(nullptr);\n',
   '      kid_ = ModelFigure{};\n      hunter_ = ModelFigure{};\n      dark_ = ModelFigure{};\n      upload_figures(nullptr);\n'],
]);
// Addition 1 (the chair, 23:51Z): the Dark's cost while away, from the stage's own counts.
edit('game/world/stage.h', [
  ['  const std::array<int, dz::game::kChaserKinds>& undrawn() const { return undrawn_; }\n',
   '  const std::array<int, dz::game::kChaserKinds>& undrawn() const { return undrawn_; }\n' +
   '  // D675 Addition 1: since the stage was made, the frames in which the Dark\'s model was posed by the gait, and the times\n' +
   '  // its palette was set at all (posed or put away). While no Dark is out, neither should grow.\n' +
   '  size_t dark_posed() const { return dark_posed_; }\n' +
   '  size_t dark_palettes() const { return dark_palettes_; }\n'],
  ['  ModelFigure dark_;\n  float dark_phase_ = 0.0f;\n',
   '  ModelFigure dark_;\n  float dark_phase_ = 0.0f;\n  size_t dark_posed_ = 0, dark_palettes_ = 0;\n'],
]);
edit('game/world/stage.cpp', [
  ['      dark_.away = false;\n      ++figures_drawn_;\n',
   '      dark_.away = false;\n      ++dark_posed_;\n      ++dark_palettes_;\n      ++figures_drawn_;\n'],
  ['    pose_model(dark_, away_palette(dark_.rig.joints()));\n    dark_.away = true;\n',
   '    pose_model(dark_, away_palette(dark_.rig.joints()));\n    dark_.away = true;\n    ++dark_palettes_;\n'],
]);
edit('game/world/selftest_run.cpp', [
  ['    int      ot_frames = 0, dark_frames = 0;\n',
   '    int      ot_frames = 0, dark_frames = 0;\n' +
   '    // Addition 1: the frames before the timer, every 24th drawn: the Dark\'s model neither posed nor its palette set more\n' +
   '    // than once (its first put-away).\n' +
   '    int    pre_frames = 0, pre_dark_poses = 0;\n' +
   '    size_t posed_at_start = 0, palettes_at_start = 0, posed_pre = 0, palettes_pre = 0;\n'],
  ['      app.play_record(o.inputs);\n      for (int f = 0; f < 360 * 400',
   '      app.play_record(o.inputs);\n      posed_at_start = stage.dark_posed();\n      palettes_at_start = stage.dark_palettes();\n      for (int f = 0; f < 360 * 400'],
  ['        const chase::StreamedChase* sc = app.chase();\n        if (!sc || !sc->run().overtime() || f % 12 != 0) continue;\n',
   '        const chase::StreamedChase* sc = app.chase();\n' +
   '        if (sc && !sc->run().overtime() && f % 24 == 0) {\n' +
   '          draw();\n' +
   '          ++pre_frames;\n' +
   '          std::vector<ChaserPose> pre;\n' +
   '          app.chaser_poses(pre);\n' +
   '          for (const ChaserPose& p : pre) pre_dark_poses += p.kind == chase::Kind::Dark ? 1 : 0;\n' +
   '          posed_pre = stage.dark_posed() - posed_at_start;\n' +
   '          palettes_pre = stage.dark_palettes() - palettes_at_start;\n' +
   '        }\n' +
   '        if (!sc || !sc->run().overtime() || f % 12 != 0) continue;\n'],
  ['    app.apply_world_settings(before);\n    int         total = 0;\n',
   '    app.apply_world_settings(before);\n' +
   '    check(drew && saved_seed != 0 && pre_frames > 100 && pre_dark_poses == 0 && posed_pre == 0 && palettes_pre <= 1,\n' +
   '          "while no Dark is out, the stage neither poses nor draws the Dark\'s model",\n' +
   '          format("seed %u: %d frames before the timer drawn, %d Dark poses given in them; the Dark\'s model posed %zu times and its"\n' +
   '                 " palette set %zu times there", saved_seed, pre_frames, pre_dark_poses, posed_pre, palettes_pre));\n' +
   '    int         total = 0;\n'],
]);
