
// TEMPORARY (pane C, D675 toe ratio), never committed: the hunter's fastest toe over the body's speed at that tick.
namespace {
struct ToePeak {
  float toe = 0, body = 0, pelvis_h = 0, t = 0;
  int   side = -1;
};
// Central difference over a run of poses at 240 Hz, from tick `from`; `speed_at` gives the body's speed at a tick.
template <class F>
ToePeak toe_peak(const std::vector<BodyPose>& p, int from, F speed_at) {
  ToePeak best;
  for (int i = std::max(from, 1); i + 1 < static_cast<int>(p.size()); ++i) {
    for (int s = 0; s < 2; ++s) {
      const Joint j = s ? Joint::ToeR : Joint::ToeL;
      const float v = length(p[static_cast<size_t>(i + 1)][j] - p[static_cast<size_t>(i - 1)][j]) / (2.0f * kDt);
      if (v > best.toe) {
        Vec3 dp = p[static_cast<size_t>(i + 1)][Joint::Pelvis] - p[static_cast<size_t>(i - 1)][Joint::Pelvis];
        dp.y = 0.0f;
        best = {v, speed_at(i), length(dp) / (2.0f * kDt), static_cast<float>(i) * kDt, s};
      }
    }
  }
  return best;
}
}  // namespace

DZ_TEST(zz_probe_toe_ratio) {
  const auto& rest = hunter_rest();
  // 1. The runner's four speeds, held, in a straight line, the phase advanced as the stage advances it.
  for (float v : {3.53f, 5.19f, 6.97f, 9.47f}) {
    std::vector<BodyPose> poses;
    float phase = 0.0f;
    Vec3  pos{0, 0, 0};
    for (int i = 0; i < 240 * 6; ++i) {
      pos.z += v * kDt;
      phase = std::fmod(phase + v * kDt * gait_phase_per_metre(rest, v), 6.2831853f);
      poses.push_back(gait_pose(rest, pos, 0.0f, v, phase));
    }
    const ToePeak k = toe_peak(poses, 240 * 2, [&](int) { return v; });
    std::printf("    held %.2f m/s: fastest toe %.2f m/s (%s, at %.3f s), the body %.2f m/s, ratio %.3f; the pelvis then %.2f m/s along the floor (ratio to it %.3f)\n",
                static_cast<double>(v), static_cast<double>(k.toe), k.side ? "ToeR" : "ToeL", static_cast<double>(k.t), static_cast<double>(k.body),
                static_cast<double>(k.toe / k.body), static_cast<double>(k.pelvis_h), static_cast<double>(k.toe / k.pelvis_h));
  }
  // 2. E's scripted chase (R4.5's drive), the body's speed taken at the tick of the peak.
  {
    const std::vector<BodyPose> poses = scripted_poses();
    std::vector<float> speed;
    Drive d;
    for (size_t i = 0; i < poses.size(); ++i) d.step(), speed.push_back(d.speed);
    const ToePeak k = toe_peak(poses, 1, [&](int i) { return speed[static_cast<size_t>(i)]; });
    std::printf("    the scripted chase: fastest toe %.2f m/s (%s, at %.3f s), the body then %.2f m/s, ratio %.3f; the pelvis %.2f m/s along the floor\n",
                static_cast<double>(k.toe), k.side ? "ToeR" : "ToeL", static_cast<double>(k.t), static_cast<double>(k.body), static_cast<double>(k.toe / k.body),
                static_cast<double>(k.pelvis_h));
    // And the most toe over body speed at any tick where the body goes 3 m/s or more.
    float most = 0, at_t = 0, at_v = 0;
    for (size_t i = 1; i + 1 < poses.size(); ++i) {
      if (speed[i] < 3.0f) continue;
      for (Joint j : {Joint::ToeL, Joint::ToeR}) {
        const float v = length(poses[i + 1][j] - poses[i - 1][j]) / (2.0f * kDt);
        if (v / speed[i] > most) most = v / speed[i], at_t = static_cast<float>(i) * kDt, at_v = speed[i];
      }
    }
    std::printf("    the scripted chase, at 3 m/s or more: the most toe over body speed %.3f, at %.3f s, body %.2f m/s\n", static_cast<double>(most),
                static_cast<double>(at_t), static_cast<double>(at_v));
  }
  // 3. Where the toe joint sits on the hunter's foot, standing.
  {
    model::Model m;
    std::string  why;
    DZ_CHECK(model::load(std::string(DZ_CONTENT_DIR) + "/models/hunter.glb", m, &why));
    const auto head = [&](const char* b) { const Xform& w = m.skin.joints[static_cast<size_t>(m.skin.find(b))].rest_world; return Vec3{w[3], w[7], w[11]}; };
    const Vec3 ft = head("foot_r"), ball = head("ball_r"), toe = rest[static_cast<size_t>(Joint::ToeR)];
    float floor = 1e9f;
    for (const auto& me : m.meshes) for (const Vec3& v : me.positions) floor = std::min(floor, v.y);
    float tip = -1e9f;   // the foremost vertex of the mesh near the right foot (within 0.25 m of the ankle, below it)
    for (const auto& me : m.meshes) for (const Vec3& v : me.positions)
      if (std::fabs(v.x - ft.x) < 0.15f && v.y < ft.y && std::fabs(v.z - ft.z) < 0.4f) tip = std::max(tip, v.z);
    std::printf("    the right foot, standing (metres; +z forward, floor %.3f): ankle (foot_r) y %.3f z %.3f; ball_r y %.3f z %.3f; the toe joint y %.3f z %.3f; the mesh's foremost point at the foot z %.3f\n",
                static_cast<double>(floor), static_cast<double>(ft.y - floor), static_cast<double>(ft.z), static_cast<double>(ball.y - floor),
                static_cast<double>(ball.z), static_cast<double>(toe.y - floor), static_cast<double>(toe.z), static_cast<double>(tip));
    std::printf("    so the toe joint is %.3f m ahead of the ankle, %.3f m ahead of the ball, %.3f m from the mesh's tip, %.3f m above the floor; ankle to tip %.3f m\n",
                static_cast<double>(toe.z - ft.z), static_cast<double>(toe.z - ball.z), static_cast<double>(tip - toe.z), static_cast<double>(toe.y - floor),
                static_cast<double>(tip - ft.z));
  }
}
