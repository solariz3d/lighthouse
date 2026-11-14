// ot.js <worktree> [undo]: TEMPORARY, never committed. In dz-world --capture-frame: O's saved seed run into overtime;
// every pose printed with what the stage drew, then a frame from the player's own view and one looking at the Dark.
const fs = require('fs'); process.chdir(process.argv[2]); const N = '\r\n';
const f = 'game/world/offscreen_frame.cpp';
const a = '  // 1 and 2: a flee run that outlasts a short timer and is saved in overtime. The first such seed of 1 to 12.' + N;
const b = String.raw`  {   // TEMPORARY (pane C, D675 overtime check): is the Dark drawn in overtime, and by what?
    for (int64_t seed = 1; seed <= 12 && rc == 0; ++seed) {
      WorldApp app(options.config_dir, true, seed);
      const chase::Outcome o = start_timed(app, chase::Policy::Flee, 1, kShortTimer);
      if (!o.saved) continue;
      std::unique_ptr<WorldStage> stage = make_stage();
      if (!stage) return 1;
      std::vector<ChaserPose> poses;
      const ChaserPose* dark = nullptr;
      float first_dark = -1.0f;
      for (int i = 0; i < 360 * 400 && app.phase() != RunPhase::Results; ++i) {
        app.advance(kFrameNs);
        const chase::StreamedChase* sc = app.chase();
        if (!sc) continue;
        app.chaser_poses(poses);
        dark = nullptr;
        for (const ChaserPose& p : poses) if (p.kind == chase::Kind::Dark) dark = &p;
        if (dark && first_dark < 0.0f) first_dark = sc->run().seconds();
        if (dark && sc->run().seconds() >= first_dark + 2.0f) break;
      }
      std::printf("overtime: seed %lld, the timer %.0f s, the Dark first posed at %.2f s; now %.2f s, phase %d, overtime %d\n", static_cast<long long>(seed),
                  static_cast<double>(kShortTimer), static_cast<double>(first_dark), app.chase() ? static_cast<double>(app.chase()->run().seconds()) : -1.0,
                  static_cast<int>(app.phase()), app.chase() ? static_cast<int>(app.chase()->run().overtime()) : -1);
      const Vec3 me = app.player().position;
      shot(*stage, app, "ot_01_players_view", "overtime, the player's own view");
      std::printf("overtime: %zu poses, the stage drew %zu figures (the hunter's model counts as one)\n", poses.size(), stage->figures_drawn());
      for (const ChaserPose& p : poses) {
        const Vec3 d{p.pos.x - me.x, p.pos.y - me.y, p.pos.z - me.z};
        std::printf("  pose id %u kind %s (%d): feet (%.2f %.2f %.2f), %.2f m from the player, slots for its kind %d\n", p.id, chase::kind_name(p.kind),
                    static_cast<int>(p.kind), static_cast<double>(p.pos.x), static_cast<double>(p.pos.y), static_cast<double>(p.pos.z),
                    static_cast<double>(std::sqrt(d.x * d.x + d.y * d.y + d.z * d.z)), kFigureSlots[static_cast<size_t>(p.kind)]);
      }
      if (dark) {
        const ChaserPose dk = *dark;
        const float yaw = std::atan2(dk.pos.x - me.x, dk.pos.z - me.z);
        const float run = std::sqrt((dk.pos.x - me.x) * (dk.pos.x - me.x) + (dk.pos.z - me.z) * (dk.pos.z - me.z));
        const float pitch = std::atan2((dk.pos.y + 1.0f) - (me.y + 1.6f), std::max(run, 0.1f));
        app.look(yaw, pitch);
        shot(*stage, app, "ot_02_looking_at_the_dark", format("looking at the Dark, yaw %.3f pitch %.3f, %.2f m along the floor", static_cast<double>(yaw), static_cast<double>(pitch), static_cast<double>(run)));
        std::printf("overtime: looking at it, the stage drew %zu figures of %zu poses\n", stage->figures_drawn(), poses.size());
      }
      return rc;
    }
    std::fprintf(stderr, "overtime: no seed saved\n");
    return 1;
  }
`.replace(/\n/g, N);
let s = fs.readFileSync(f, 'utf8');
const [from, to] = process.argv[3] === 'undo' ? [b + a, a] : [a, b + a];
if (s.split(from).length !== 2) throw new Error('anchor');
fs.writeFileSync(f, s.replace(from, () => to)); console.log(process.argv[3] === 'undo' ? 'removed' : 'added');
