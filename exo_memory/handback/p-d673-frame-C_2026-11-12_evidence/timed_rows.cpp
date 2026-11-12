
// ---------------------------------------------------------------- D673: the two endings (on A's interface)

namespace {

// A policy's run with the timer set to `run_length_s`, headless and then through the app (as play_through), and the
// times the timer's notice appeared, counted frame by frame (a rising edge each time it is shown anew).
struct Timed {
  Played played;
  int notices = 0;
};
Timed play_timed(WorldApp& app, chase::Policy policy, int level, float max_seconds, float run_length_s) {
  Timed t;
  WorldSettings w = app.world_settings();
  w.run_length_s = run_length_s;
  app.apply_world_settings(w);
  chase::PlayParams pp;
  pp.policy = policy;
  pp.difficulty = chase::difficulty_level(level);
  app.set_level(level);
  pp.seed = app.seed();
  pp.max_seconds = max_seconds;
  pp.keep_inputs = true;
  pp.run_length_s = run_length_s;   // A's: the headless harness plays the same timer
  t.played.headless = chase::play_streamed(harness_for(app), pp);
  app.play_record(t.played.headless.inputs);
  bool shown = false;
  t.played.ended = run_until(app, max_seconds + 20.0, [&] {
    bool now = false;
    for (const Notice& n : app.notices()) now = now || n.text.find("The time is up") != std::string::npos;
    t.notices += now && !shown;
    shown = now;
    return app.phase() == RunPhase::Ended;
  });
  return t;
}

}  // namespace

// C3: a run caught before the timer is lost and keeps no points, though it earned some (the card shows them, and that
// none are kept); its record keeps none either.
DZ_TEST(a_run_caught_before_the_timer_keeps_no_points) {
  TempDir dir;
  WorldApp app(dir.str(), false, 4);
  app.set_runs_dir((dir.path / "runs").string());
  const Timed t = play_timed(app, chase::Policy::Line, 3, 300.0f, 600.0f);
  DZ_CHECK(t.played.headless.caught && t.played.ended);
  const RunResult& r = app.result();
  std::printf("    caught after %.1f s with %.0f points, %.0f kept\n", static_cast<double>(r.outcome.seconds), r.outcome.score, static_cast<double>(r.kept));
  DZ_CHECK(r.outcome.seconds < 600.0f);
  DZ_CHECK(r.outcome.score > 0.0);
  DZ_CHECK(!r.saved && !r.won);
  DZ_CHECK_NEAR(r.kept, 0.0, 0.0);
  DZ_CHECK_EQ(t.notices, 0);
  RunRecord rec;
  DZ_CHECK(read_run(app.last_run_path(), rec).empty());
  DZ_CHECK(rec.end == RunEnd::Caught);
  DZ_CHECK_NEAR(rec.kept_score, 0.0, 0.0);
  DZ_CHECK_NEAR(rec.world.run_length_s, 600.0, 0.0);
}

// The save: a run that outlasts the timer is caught in overtime by the dark one, saved by the Absolute, won, and keeps
// every point, the overtime bonus with them; its record says saved, and it plays again to the same end. The first of
// seeds 1-8 whose flee run outlasts a 20 s timer is used (the timer is set short here, as world.local.txt would).
DZ_TEST(a_run_caught_in_overtime_is_saved_won_and_keeps_its_points_with_its_bonus) {
  constexpr float kTimer = 20.0f;
  for (int64_t seed = 1; seed <= 8; ++seed) {
    TempDir dir;
    WorldApp app(dir.str(), false, seed);
    app.set_runs_dir((dir.path / "runs").string());
    const Timed t = play_timed(app, chase::Policy::Flee, 1, 300.0f, kTimer);
    if (!t.played.ended || app.result().outcome.seconds <= kTimer) continue;   // caught before the timer: not this seed
    const RunResult& r = app.result();
    std::printf("    seed %lld: %.1f s, %.1f s of it in overtime; %.0f points, %.0f kept, +%.0f overtime bonus; caught by the %s\n",
                static_cast<long long>(seed), static_cast<double>(r.outcome.seconds), static_cast<double>(r.overtime_s), r.outcome.score,
                static_cast<double>(r.kept), static_cast<double>(r.overtime_bonus), chase::kind_name(r.outcome.by));
    DZ_CHECK(r.saved && r.won);
    DZ_CHECK(r.outcome.by == chase::Kind::Dark || r.outcome.fell);   // the dark one, or a void (also a save)
    DZ_CHECK_NEAR(r.kept, r.outcome.score, 0.5);
    DZ_CHECK(r.overtime_s > 0.0f);
    DZ_CHECK(r.overtime_bonus > 0.0f);
    DZ_CHECK_EQ(t.notices, 1);
    RunRecord rec;
    DZ_CHECK(read_run(app.last_run_path(), rec).empty());
    DZ_CHECK(rec.end == RunEnd::Saved);
    DZ_CHECK_NEAR(rec.kept_score, r.kept, 0.5);
    DZ_CHECK_NEAR(rec.world.run_length_s, kTimer, 0.0);
    const ReplayResult again = replay_run(rec);
    DZ_CHECK(again.error.empty() && again.same);
    DZ_CHECK(again.end == RunEnd::Saved);
    return;
  }
  std::printf("    no seed of 1-8 outlasted a %.0f s timer with the flee policy\n", static_cast<double>(kTimer));
  DZ_CHECK(false);
}
