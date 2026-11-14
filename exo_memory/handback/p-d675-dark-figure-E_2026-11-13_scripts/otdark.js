// otdark.js <worktree> [undo]: TEMPORARY, never committed (pane E, D675 the Dark's capture, after C's ot.js). In
// dz-world --capture-frame: O's saved seed run into overtime; 5 s after the Dark is first posed, a camera follows it from
// 4 m behind along its travel over the last half second (standing on its own trail where a wall is in the way, by the
// world's own ray, both ways), 3 s drawn to warm, then 288 frames written at 144 a second. Prints, for the first frame
// kept, its mean brightness and where the Dark is; for every frame, whether the camera sees it unblocked.
const fs = require('fs');
process.chdir(process.argv[2]);
const N = '\r\n';
const f = 'game/world/offscreen_frame.cpp';
const a = '  // 1 and 2: a flee run that outlasts a short timer and is saved in overtime. The first such seed of 1 to 12.' + N;
const b = String.raw`  {   // TEMPORARY (pane E, D675 the Dark's capture): never committed.
    const int64_t kFilmNs = 1'000'000'000 / 144;
    for (int64_t seed = 1; seed <= 12 && rc == 0; ++seed) {
      WorldApp app(options.config_dir, true, seed);
      const chase::Outcome o = start_timed(app, chase::Policy::Flee, 1, kShortTimer);
      if (!o.saved) continue;
      std::unique_ptr<WorldStage> stage = make_stage();
      if (!stage) return 1;
      stage->hud = false;
      std::vector<ChaserPose> poses;
      float first_dark = -1.0f;
      for (int i = 0; i < 360 * 400 && app.phase() != RunPhase::Results; ++i) {
        app.advance(kFrameNs);
        const chase::StreamedChase* sc = app.chase();
        if (!sc) continue;
        app.chaser_poses(poses);
        bool d = false;
        for (const ChaserPose& p : poses) d = d || p.kind == chase::Kind::Dark;
        if (d && first_dark < 0.0f) first_dark = sc->run().seconds();
        if (first_dark >= 0.0f && sc->run().seconds() >= first_dark + 5.0f) break;
      }
      std::vector<Vec3> trail;
      int kept = 0, unblocked = 0, on_trail = 0, gone_at = -1;
      for (int fr = 0; fr < 432 + 288 && rc == 0 && app.phase() != RunPhase::Results; ++fr) {
        app.advance(kFilmNs);
        app.chaser_poses(poses);
        const ChaserPose* dk = nullptr;
        for (const ChaserPose& p : poses) if (p.kind == chase::Kind::Dark) dk = &p;
        if (!dk) { gone_at = fr; break; }
        trail.push_back(dk->pos);
        const Vec3 back = trail.size() > 72 ? trail[trail.size() - 73] : trail.front();
        Vec3 along{dk->pos.x - back.x, 0.0f, dk->pos.z - back.z};
        along = normalize_or(along, Vec3{std::sin(dk->heading), 0.0f, std::cos(dk->heading)});
        const Vec3 target{dk->pos.x, dk->pos.y + 1.0f, dk->pos.z};
        const auto sees = [&](Vec3 from) { return !app.world().raycast(from, target - from) && !app.world().raycast(target, from - target); };
        Camera c;
        c.position = Vec3{dk->pos.x - along.x * 4.0f, dk->pos.y + 1.9f, dk->pos.z - along.z * 4.0f};
        bool clear = sees(c.position);
        if (!clear) {
          for (size_t j = trail.size(); j-- > 0;) {
            const Vec3 at{trail[j].x, trail[j].y + 1.9f, trail[j].z};
            const float dx = dk->pos.x - trail[j].x, dz2 = dk->pos.z - trail[j].z;
            if (std::sqrt(dx * dx + dz2 * dz2) < 3.0f) continue;
            if (sees(at)) { c.position = at; clear = true; ++on_trail; break; }
          }
        }
        c.forward = normalize_or(Vec3{target.x - c.position.x, target.y - c.position.y, target.z - c.position.z}, along);
        c.up = Vec3{0, 1, 0};
        c.fovYDegrees = 55.0f;
        stage->staged_camera = c;
        stage->staged_view = true;
        if (!stage->draw(app, 1.0f / 144.0f, stats)) { rc = 1; break; }
        if (fr < 432) continue;
        unblocked += clear ? 1 : 0;
        std::string why;
        const std::string path = out_dir + "/" + format("dark_film_%03d.png", kept);
        if (!stage->renderer().ReadFrame(img, false, &why) || !dz::WritePng(path.c_str(), img.rgba8.data(), img.width, img.height, img.width * 4)) {
          std::fprintf(stderr, "capture %s FAILED: %s\n", path.c_str(), why.c_str());
          rc = 1;
          break;
        }
        if (kept == 0) {
          double sum = 0;
          for (size_t px = 0; px + 3 < img.rgba8.size(); px += 4) sum += (img.rgba8[px] + img.rgba8[px + 1] + img.rgba8[px + 2]) / 3.0;
          const Vec3 me = app.player().position;
          std::printf("dark-capture: seed %lld, the timer %.0f s, the Dark first posed at %.2f s; filming from %.2f s; the first kept frame's mean"
                      " brightness %.1f of 255; the Dark %.2f m from the player; the stage drew %zu figures of %zu poses\n",
                      static_cast<long long>(seed), static_cast<double>(kShortTimer), static_cast<double>(first_dark),
                      static_cast<double>(app.chase()->run().seconds()), sum / static_cast<double>(img.rgba8.size() / 4),
                      static_cast<double>(std::sqrt((dk->pos.x - me.x) * (dk->pos.x - me.x) + (dk->pos.z - me.z) * (dk->pos.z - me.z))),
                      stage->figures_drawn(), poses.size());
        }
        ++kept;
      }
      std::printf("dark-capture: %d frames kept at 144 a second; the camera saw the Dark unblocked in %d of them (%d from its trail); %s\n", kept,
                  unblocked, on_trail, gone_at >= 0 ? format("the Dark was gone at frame %d", gone_at).c_str() : "the Dark out throughout");
      return rc;
    }
    std::fprintf(stderr, "dark-capture: no seed saved\n");
    return 1;
  }
`.replace(/\n/g, N);
let s = fs.readFileSync(f, 'utf8');
const [from, to] = process.argv[3] === 'undo' ? [b + a, a] : [a, b + a];
if (s.split(from).length !== 2) throw new Error('anchor');
fs.writeFileSync(f, s.replace(from, () => to));
console.log(process.argv[3] === 'undo' ? 'removed' : 'added');
