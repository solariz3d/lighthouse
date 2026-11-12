// framepatch.js <worktree>: D673's game half that needs A's interface (RunParams::run_length_s, Run::overtime(),
// overtime_seconds(), saved(), kept_score(), Kind::Dark): the timer passed to the chase, the one notice at the timer,
// the result's saved/won/kept/overtime/bonus, the record's Saved end and kept score, the replay's Saved end, and the two
// endings on screen.
const { edit } = require('C:/Users/nname/AppData/Local/Temp/claude/2b46c68187c81881/0845a868-38f2-4cc2-b45a-431e0c088fb1/scratchpad/d651/edit.js');
process.chdir(process.argv[2]);

edit('game/world/world_app.h', [
  ['  bool           counted = false;          // it could set a best: a person at the keys, the level\'s own dials, nothing frozen\n  bool           best = false;             // and it did\n  float          best_before = 0;          // the level\'s best time before it (0: there was none)\n};',
   `  bool           counted = false;          // it could set a best: a person at the keys, the level's own dials, nothing frozen
  bool           best = false;             // and it did
  float          best_before = 0;          // the level's best time before it (0: there was none)
  // D673, the run's frame. A run caught (or fallen) in overtime, after the timer, was saved by the Absolute: it is won,
  // and keeps its points. A run caught before the timer is lost and keeps none. outcome.score is every point either way.
  float          run_length_s = 0;         // the timer it was played with (0: none)
  bool           saved = false;
  bool           won = false;              // a saved run is a won run; a best it sets is marked so
  float          kept = 0;                 // the points kept: outcome.score when saved, 0 when lost
  float          overtime_s = 0;           // how long it lasted in overtime
  float          overtime_bonus = 0;       // the part of outcome.score earned in overtime (item 53)
};`],
  ['  bool run_dials_changed_ = false;', '  bool run_dials_changed_ = false;\n  bool overtime_told_ = false;   // the one notice at the timer was given (D673)'],
]);

edit('game/world/world_app.cpp', [
  ['  cp.run.sprint_speed = params_.sprint_speed;\n  chase_ = std::make_unique<chase::StreamedChase>(*streamer_, *world_, cp);',
   '  cp.run.sprint_speed = params_.sprint_speed;\n  cp.run.run_length_s = world_settings_.run_length_s;   // D673: the timer (0: none)\n  chase_ = std::make_unique<chase::StreamedChase>(*streamer_, *world_, cp);'],
  ['  run_dials_changed_ = false;\n  run_difficulty_ = difficulty_;', '  run_dials_changed_ = false;\n  overtime_told_ = false;\n  run_difficulty_ = difficulty_;'],
  ['  result_.counted = run_counted_;\n  result_.best_before = best_[static_cast<size_t>(level_)];',
   `  result_.counted = run_counted_;
  // D673: saved (won, every point kept) or lost (none kept); the overtime bonus is what the run earned past the timer.
  result_.run_length_s = world_settings_.run_length_s;
  result_.saved = run.saved();
  result_.won = result_.saved;
  result_.kept = static_cast<float>(run.kept_score());
  result_.overtime_s = run.overtime() ? run.overtime_seconds() : 0.0f;
  if (run.overtime()) {
    const uint32_t timer = static_cast<uint32_t>(std::lround(static_cast<double>(world_settings_.run_length_s) * 240.0));
    result_.overtime_bonus = static_cast<float>(std::max(0.0, run.score() - chase::score_at(timer)));
  }
  result_.best_before = best_[static_cast<size_t>(level_)];`],
  ['  keep_run(result_.outcome.fell ? RunEnd::Void : RunEnd::Caught);', '  keep_run(result_.saved ? RunEnd::Saved : result_.outcome.fell ? RunEnd::Void : RunEnd::Caught);'],
  ['  r.end = end;\n  r.seconds = run.seconds();\n  if (end == RunEnd::Caught) {',
   '  r.end = end;\n  r.seconds = run.seconds();\n  r.kept_score = static_cast<float>(run.kept_score());\n  if (end == RunEnd::Caught || end == RunEnd::Saved) {'],
  ['    pose_before_.swap(pose_now_);\n    chase_->after_step();\n    gather_poses(pose_now_);',
   `    pose_before_.swap(pose_now_);
    chase_->after_step();
    gather_poses(pose_now_);
    // D673: the timer. One notice; the world's own change (the others leaving, the dark one coming) does the rest. Its
    // words are placeholders until he names the dark one. Whether a countdown is shown is his call, not built.
    if (!overtime_told_ && chase_->run().overtime()) {
      overtime_told_ = true;
      notify("The time is up. They are leaving. Something else is coming.");
    }`],
]);

edit('game/world/run_record.cpp', [
  ['    out.end = app.result().outcome.fell ? RunEnd::Void : RunEnd::Caught;',
   '    out.end = app.result().saved ? RunEnd::Saved : app.result().outcome.fell ? RunEnd::Void : RunEnd::Caught;'],
]);

edit('game/world/hud.cpp', [
  ['    case RunPhase::Ended:   return "caught";', '    case RunPhase::Ended:   return "ended";   // caught, or (D673) saved'],
  [`// The run's end: a cut to dark, held, and then the card over it.
void draw_end(const WorldApp& app, const Screen& scr) {
  const RunPhase phase = app.phase();
  if (phase != RunPhase::Ended && phase != RunPhase::Results) return;
  const float dark = static_cast<float>(std::clamp(app.seconds_since_catch() / 0.08, 0.0, 1.0));
  scr.dl->AddRectFilled(ImVec2(0, 0), ImVec2(scr.w, scr.h), IM_COL32(0, 0, 0, static_cast<int>(dark * (phase == RunPhase::Results ? 236.0f : 255.0f))));
}`,
   `// The run's end, then the card over it. Lost: a cut to dark, held. Saved (D673): the screen goes to white light
// instead, over a breath rather than a cut (a placeholder for the Absolute's save), and the card sits on the light.
void draw_end(const WorldApp& app, const Screen& scr) {
  const RunPhase phase = app.phase();
  if (phase != RunPhase::Ended && phase != RunPhase::Results) return;
  if (app.result().saved) {
    const float light = static_cast<float>(std::clamp(app.seconds_since_catch() / 0.6, 0.0, 1.0));
    scr.dl->AddRectFilled(ImVec2(0, 0), ImVec2(scr.w, scr.h), IM_COL32(255, 252, 244, static_cast<int>(light * 255.0f)));
    return;
  }
  const float dark = static_cast<float>(std::clamp(app.seconds_since_catch() / 0.08, 0.0, 1.0));
  scr.dl->AddRectFilled(ImVec2(0, 0), ImVec2(scr.w, scr.h), IM_COL32(0, 0, 0, static_cast<int>(dark * (phase == RunPhase::Results ? 236.0f : 255.0f))));
}`],
  [`  if (o.fell) ImGui::Text("Fell into the void");
  else ImGui::Text("Caught by the %s", chase::kind_name(o.by));
  ImGui::PopFont();
  if (o.in_dead_end) ImGui::TextDisabled(o.dead_end_had_way_out ? "in a dead end that had a way out" : "in a dead end");
  ImGui::Spacing();
  ImGui::PushFont(nullptr, base * 1.35f);
  ImGui::Text("%s survived      %.0f points", clock_text(static_cast<double>(o.seconds)).c_str(), o.score);
  ImGui::PopFont();`,
   `  // D673: the two endings. The names of the two gods on screen are placeholders until he names the dark one.
  if (r.saved) ImGui::Text("Saved");
  else if (o.fell) ImGui::Text("Fell into the void");
  else ImGui::Text("Caught by the %s", chase::kind_name(o.by));
  ImGui::PopFont();
  if (r.saved) ImGui::TextDisabled("the Absolute took you back");
  else if (o.in_dead_end) ImGui::TextDisabled(o.dead_end_had_way_out ? "in a dead end that had a way out" : "in a dead end");
  ImGui::Spacing();
  ImGui::PushFont(nullptr, base * 1.35f);
  if (r.saved) {
    ImGui::Text("%s survived      %.0f points kept", clock_text(static_cast<double>(o.seconds)).c_str(), r.kept);
    ImGui::PopFont();
    ImGui::Text("%s in overtime      +%.0f overtime bonus", clock_text(static_cast<double>(r.overtime_s)).c_str(), r.overtime_bonus);
  } else {
    ImGui::Text("%s survived      %.0f points", clock_text(static_cast<double>(o.seconds)).c_str(), o.score);
    ImGui::PopFont();
    if (r.run_length_s > 0.0f) ImGui::TextDisabled("caught before the time ran out: none of them are kept");
  }`],
  [`  if (r.best) {
    if (r.best_before > 0.0f) ImGui::TextColored(ImVec4(0.55f, 0.95f, 0.65f, 1.0f), "the longest run at this level (it was %s)", clock_text(static_cast<double>(r.best_before)).c_str());`,
   `  if (r.best) {
    if (r.won) ImGui::TextColored(ImVec4(0.55f, 0.95f, 0.65f, 1.0f), "a won run");
    if (r.best_before > 0.0f) ImGui::TextColored(ImVec4(0.55f, 0.95f, 0.65f, 1.0f), "the longest run at this level (it was %s)", clock_text(static_cast<double>(r.best_before)).c_str());`],
]);
console.log('frame patch applied');
