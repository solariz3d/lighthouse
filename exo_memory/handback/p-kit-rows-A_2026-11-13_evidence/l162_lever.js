// SCRATCH, NEVER COMMITTED: L162's close-range lever (origin/l162-chase abe8237) applied by hand to 9150ddf, to try it on the two
// recorded cases as the librarian ruled. Its code is abe8237's own (close_pursue, the field, the count), placed where it went then.
module.exports = [
  {
    file: 'chase/speed.h',
    old: `  X(stairs_lift, 1.0f,`,
    new: `  X(close_range, 0.0f, "L162 (scratch): metres; a chaser this close to where it last saw the player, on their storey with a clear line, pursues that position directly (0: off)")  \\
  X(stairs_lift, 1.0f,`,
  },
  {
    file: 'chase/run.h',
    old: `    uint32_t stalls_by[static_cast<int>(Kind::Count)] = {};`,
    new: `    uint32_t stalls_by[static_cast<int>(Kind::Count)] = {};
    uint32_t close_ticks = 0;  // L162 (scratch)`,
  },
  {
    file: 'chase/run.h',
    old: `  void     update_hunter(Agent& a, const sim::PlayerState& player);`,
    new: `  void     update_hunter(Agent& a, const sim::PlayerState& player);
  void     close_pursue(Agent& a, float reaction_s);  // L162 (scratch)`,
  },
  {
    file: 'chase/run.cpp',
    old: `constexpr float kChaserChest = 1.0f;`,
    new: `constexpr float kChaserChest = 1.0f;
constexpr float kCloseLevel = 1.2f;  // L162 (scratch)`,
  },
  {
    file: 'chase/run.cpp',
    old: `  chase::step(a.body, *query_, hold);
  if (a.mode == Mode::Pursue) look_toward(a.body, player_pos_);  // D664: the head turns to you before the body does
}`,
    new: `  if (!hold) close_pursue(a, a.body.kind == Kind::Dark ? 0.0f : dials_.hunter_reaction_s);  // L162 (scratch)
  chase::step(a.body, *query_, hold);
  if (a.mode == Mode::Pursue) look_toward(a.body, player_pos_);  // D664: the head turns to you before the body does
}

// L162 (scratch), abe8237's own.
void Run::close_pursue(Agent& a, float reaction_s) {
  const float range = params_.speed.close_range;
  if (range <= 0 || a.mode != Mode::Pursue || a.body.gait != Gait::Mesh || knowledge_.size() <= static_cast<size_t>(a.group)) return;
  Knowledge::Obs obs;
  if (!knowledge_[static_cast<size_t>(a.group)]->at_or_before(static_cast<int32_t>(tick_) - seconds_to_ticks(reaction_s), obs)) return;
  const Vec3 to = obs.pos - a.body.pos;
  if (length(flat(to)) >= range || std::fabs(to.y) > kCloseLevel || length(flat(to)) < 0.3f) return;
  if (!see(a.body.pos + Vec3{0, kChaserChest, 0}, obs.pos + Vec3{0, kChaserChest, 0})) return;
  nav::PathPoint from, goal;
  from.pos = a.body.pos;
  goal.pos = Vec3{obs.pos.x, a.body.pos.y, obs.pos.z};
  a.body.path = {};
  a.body.path.found = true;
  a.body.path.points = {from, goal};
  a.body.leg = 0;
  a.body.has_path = true;
  a.body.arrived = false;
  ++snags_.close_ticks;
}`,
  },
];
