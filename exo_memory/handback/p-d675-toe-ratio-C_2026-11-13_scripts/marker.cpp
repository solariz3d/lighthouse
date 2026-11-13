    {   // the point where the runner's TOE marker sits: 0.195 m ahead of the ankle centre and 0.044 m below it, standing,
        // carried in the foot's own frame (ankle to toe joint, and its perpendicular about the body's side axis, +x here)
      const Vec3 A0 = rest[static_cast<size_t>(Joint::AnkleR)], T0 = rest[static_cast<size_t>(Joint::ToeR)];
      const Vec3 u0 = normalize(T0 - A0), n0 = cross(Vec3{1, 0, 0}, u0), m{0.0f, -0.044f, 0.195f};
      const float al = dot(m, u0), be = dot(m, n0);
      float most = 0, at = 0;
      std::vector<Vec3> pts[2];
      for (const BodyPose& q : poses) for (int sd = 0; sd < 2; ++sd) {
        const Vec3 A = q[sd ? Joint::AnkleR : Joint::AnkleL], T = q[sd ? Joint::ToeR : Joint::ToeL];
        const Vec3 u = normalize(T - A), n = cross(Vec3{1, 0, 0}, u);
        pts[sd].push_back(A + u * al + n * be);
      }
      for (int sd = 0; sd < 2; ++sd) for (size_t i = 480; i + 1 < pts[sd].size(); ++i) {
        const float sp = length(pts[sd][i + 1] - pts[sd][i - 1]) / (2.0f * kDt);
        if (sp > most) most = sp, at = static_cast<float>(i) * kDt;
      }
      const Vec3 back = A0 + u0 * al + n0 * be - A0;
      std::printf("    held %.2f m/s, at the TOE marker's place on the foot (rest offset from the ankle %.3f up %.3f forward): fastest %.2f m/s at %.3f s, ratio %.3f\n",
                  static_cast<double>(v), static_cast<double>(back.y), static_cast<double>(back.z), static_cast<double>(most), static_cast<double>(at), static_cast<double>(most / v));
    }
