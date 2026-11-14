// The fix, both options behind SCRATCH switches (DZ_OPT1, DZ_OPT2) for the measurement; the chosen form is hard-coded after.
module.exports = [
  {
    file: 'chase/run.cpp',
    old: `    if (told) {
      const float  ang = hash_unit(draw(0x48a1u, a.body.id)) * 2.0f * kPi;
      const float  rad = dark ? 0.0f : std::sqrt(hash_unit(draw(0x48a2u, a.body.id))) * std::max(dials_.hunter_error_m, 0.0f);
      Vec3         where = player_nav_;
      nav::Nearest n = query_->nearest(player_nav_ + Vec3{det_sin(ang) * rad, 0, det_cos(ang) * rad}, kAny, {0.5f, 1.0f, 0.5f});
      if (n.found) where = n.pos;
      k.push(now, where, player_vel_);
    }`,
    new: `    if (told) {
      static const bool opt1 = std::getenv("DZ_OPT1") != nullptr;   // SCRATCH switch (never committed)
      Vec3              where = player_nav_;
      // Option 1: a rough point is one within a walk of the player, never across a wall; the first draw is the draw as it always was.
      for (int attempt = 0; attempt < (opt1 ? 4 : 1); ++attempt) {
        const float  ang = hash_unit(draw(0x48a1u + static_cast<uint32_t>(attempt) * 2u, a.body.id)) * 2.0f * kPi;
        const float  rad = dark ? 0.0f : std::sqrt(hash_unit(draw(0x48a2u + static_cast<uint32_t>(attempt) * 2u, a.body.id))) * std::max(dials_.hunter_error_m, 0.0f);
        nav::Nearest n = query_->nearest(player_nav_ + Vec3{det_sin(ang) * rad, 0, det_cos(ang) * rad}, kAny, {0.5f, 1.0f, 0.5f});
        if (!n.found) continue;
        if (opt1 && !dark) {
          nav::Path walk;
          if (!query_->find_path(n.pos, player_nav_, profile_of(a.body.body, "hunter"), walk) || walk.partial ||
              walk.length > 1.5f * std::max(dials_.hunter_error_m, 0.0f) + 1.5f)
            continue;
        }
        where = n.pos;
        break;
      }
      k.push(now, where, player_vel_);
    }
    // Option 2, the guarantee (his item 65): a hunter that is within its error's radius of where it was sent, and does not see the player,
    // knows exactly.
    {
      static const bool opt2 = std::getenv("DZ_OPT2") != nullptr;   // SCRATCH switch (never committed)
      if (opt2 && !dark && a.mode == Mode::Pursue && !a.contact && a.has_aim && (tick_ + a.body.id * 5u) % kSenseTicks == 0 &&
          length(flat(a.body.pos - a.aim)) <= std::max(dials_.hunter_error_m, 0.0f) && std::fabs(a.body.pos.y - a.aim.y) < 1.5f)
        k.push(now, player_nav_, player_vel_);
    }`,
  },
];
