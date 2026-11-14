
  // D675: in overtime, every chaser is drawn. The dark one (Kind::Dark, A's D673) came with no figure: kFigureSlots held
  // seven entries for eight kinds, so the stage skipped it and the thing that ends a ten-minute run was invisible
  // (3 poses, 2 drawn, in pane C's capture on b08f25e). From the stage's own count: a run with a three-second timer and the
  // player standing at the door, one second into overtime, on the repository's own files (read only), so the models are
  // the game's. First, before this test's own stage exists, as the stages of its bursts are.
  {
    WorldApp ot(options.config_dir, true, seed);
    WorldSettings w = ot.world_settings();
    w.run_length_s = 3.0f;
    ot.apply_world_settings(w);
    ot.resume();
    std::unique_ptr<WorldStage> st = WorldStage::create(nullptr, 640, 360, true, &err);
    std::vector<ChaserPose> poses;
    std::string seen = st ? std::string() : "no stage: " + err;
    float dark_at = -1.0f;
    for (int i = 0; st && i < 360 * 20 && ot.phase() != RunPhase::Ended; ++i) {
      ot.advance(kFrameNs);
      const chase::StreamedChase* sc = ot.chase();
      if (!sc || !sc->run().overtime()) continue;
      ot.chaser_poses(poses);
      const bool dark = std::any_of(poses.begin(), poses.end(), [](const ChaserPose& p) { return p.kind == chase::Kind::Dark; });
      if (dark && dark_at < 0.0f) dark_at = sc->run().seconds();
      if (dark && sc->run().seconds() >= dark_at + 1.0f) break;
    }
    FrameStats stats;
    stats.frame_ms = 1000.0 / 360.0;
    if (st && dark_at >= 0.0f && !st->draw(ot, kFrameSeconds, stats)) seen = "the frame failed: " + st->renderer().LastError();
    ot.chaser_poses(poses);   // the poses the frame drew from
    std::string kinds;
    bool undrawable = false;
    for (const ChaserPose& p : poses) {
      const size_t k = static_cast<size_t>(p.kind);
      const int slots = k < kFigureSlots.size() ? kFigureSlots[k] : 0;
      const bool model = p.kind == chase::Kind::Hunter && st && st->hunter_drawn();
      if (!model && slots == 0) undrawable = true;
      kinds += format("%s%s (%s, %d box slots)", kinds.empty() ? "" : ", ", chase::kind_name(p.kind), model ? "the hunter's model" : "no model", slots);
    }
    const size_t drawn = st ? st->figures_drawn() : 0;
    check(st && dark_at >= 0.0f && !poses.empty() && drawn == poses.size() && !undrawable && seen.empty(),
          "in overtime every chaser pose has a drawn figure, the dark one too",
          format("the dark one first posed at %.2f s of a 3 s timer; %zu poses, %zu drawn: %s%s", static_cast<double>(dark_at), poses.size(), drawn,
                 kinds.empty() ? "none" : kinds.c_str(), seen.empty() ? "" : ("; " + seen).c_str()));
  }
