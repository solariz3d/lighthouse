    {   // where in the stride the marker point's peak falls: the time to that foot's next landing (its ankle slowed under
        // 0.5 m/s), and the stride (landing to landing)
      const Vec3 A0 = rest[static_cast<size_t>(Joint::AnkleR)], T0 = rest[static_cast<size_t>(Joint::ToeR)];
      const Vec3 u0 = normalize_or(T0 - A0, Vec3{0, 0, 1}), n0 = cross(Vec3{1, 0, 0}, u0), m{0.0f, -0.044f, 0.195f};
      const float al = dot(m, u0), be = dot(m, n0);
      for (int sd = 0; sd < 2; ++sd) {
        const Joint aj = sd ? Joint::AnkleR : Joint::AnkleL, tj = sd ? Joint::ToeR : Joint::ToeL;
        std::vector<Vec3> pt;
        for (const BodyPose& q : poses) {
          const Vec3 u = normalize_or(q[tj] - q[aj], Vec3{0, 0, 1});
          pt.push_back(q[aj] + u * al + cross(Vec3{1, 0, 0}, u) * be);
        }
        const auto sp = [&](const std::vector<Vec3>& p, size_t i) { return length(p[i + 1] - p[i - 1]) / (2.0f * kDt); };
        std::vector<Vec3> ank;
        for (const BodyPose& q : poses) ank.push_back(q[aj]);
        std::vector<size_t> lands;
        for (size_t i = 481; i + 1 < poses.size(); ++i)
          if (sp(ank, i) < 0.5f && sp(ank, i - 1) >= 0.5f) lands.push_back(i);
        if (lands.size() < 3) { std::printf("    %s: under three landings\n", sd ? "R" : "L"); continue; }
        // the peak in each stride between two landings
        std::string row;
        for (size_t k = 0; k + 1 < lands.size() && k < 3; ++k) {
          size_t best = lands[k];
          for (size_t i = lands[k]; i < lands[k + 1]; ++i) if (sp(pt, i) > sp(pt, best)) best = i;
          const float stride = static_cast<float>(lands[k + 1] - lands[k]) * kDt;
          char buf[200];
          std::snprintf(buf, sizeof buf, " stride %.0f ms, peak %.2f m/s at %.0f%% of it, %.0f ms before the landing;", static_cast<double>(stride * 1000),
                        static_cast<double>(sp(pt, best)), 100.0 * static_cast<double>(best - lands[k]) / static_cast<double>(lands[k + 1] - lands[k]),
                        static_cast<double>(lands[k + 1] - best) * kDt * 1000.0);
          row += buf;
        }
        std::printf("    held %.2f m/s, %s foot:%s\n", static_cast<double>(v), sd ? "right" : "left", row.c_str());
      }
    }
