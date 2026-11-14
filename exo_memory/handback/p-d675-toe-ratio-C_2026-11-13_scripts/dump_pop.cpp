
// TEMPORARY (pane C, D675, the pop's clip), never committed: the drawn hunter's joints on its own rest (hunter.glb), held at
// 9.47 and at 11 m/s for 2 s, the feet kept at the origin (a treadmill: stick.js draws z across the frame), the phase advanced as the stage advances it, one line a tick: section,
// tick, speed, then x y z of every joint, into zz_joints.txt in the working folder (stick.js's input).
#include <fstream>
DZ_TEST(zz_dump_pop_joints) {
  std::ofstream f("zz_joints.txt");
  DZ_CHECK(static_cast<bool>(f));
  const auto& rest = hunter_rest();
  for (const auto& [sec, v] : {std::pair<const char*, float>{"s947", 9.47f}, std::pair<const char*, float>{"s11", 11.0f}}) {
    float phase = 0.0f;
    for (int i = 0; i < 240 * 3; ++i) {
      phase = std::fmod(phase + v * kDt * gait_phase_per_metre(rest, v), 6.2831853f);
      const BodyPose p = gait_pose(rest, {0.0f, 0.0f, 0.0f}, 0.0f, v, phase);
      if (i < 240) continue;   // the first second left out, as the rows do
      f << sec << " " << (i - 240) << " " << v;
      for (int j = 0; j < kJointCount; ++j) {
        const Vec3 q = p[static_cast<Joint>(j)];
        f << " " << q.x << " " << q.y << " " << q.z;
      }
      f << "\n";
    }
  }
}
