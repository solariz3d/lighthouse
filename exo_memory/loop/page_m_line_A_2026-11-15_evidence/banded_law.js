// D677 M-line: the least-bending line by a direct banded solve (registration_banded_solve.md). Replaces bend_least's passes. Either line ending.
const fs = require('fs');
const f = 'G:/consonance-scratch/a-m1-dz3/chase/chaser.cpp';
let s = fs.readFileSync(f, 'utf8');
const rep = (a0, b0) => {
  for (const e of ['\r\n', '\n']) {
    const a = a0.split('\n').join(e), b = b0.split('\n').join(e);
    if (s.split(a).length - 1 !== 1) continue;
    s = s.replace(a, () => b);
    return;
  }
  throw new Error('anchor not found once: ' + a0.slice(0, 80));
};
rep(`constexpr int   kBendPasses = 600;`, `constexpr int   kBendRounds = 20;  // the banded solve's rounds for the bounds (registration_banded_solve.md), times the effort`);
rep(`  std::vector<Vec3> p = q;
  for (int pass = 0; pass < kBendPasses * std::max(effort, 1); ++pass)
    for (size_t i = 1; i + 1 < n; ++i) {
      if (length(nrm[i]) < 0.5f) continue;
      const Vec3  t = i >= 2 && i + 2 < n ? (p[i - 1] * 4.0f + p[i + 1] * 4.0f - p[i - 2] - p[i + 2]) * (1.0f / 6.0f) : (p[i - 1] + p[i + 1]) * 0.5f;
      const float a = std::min(hi[i], std::max(lo[i], dot(flat(t - q[i]), nrm[i])));
      p[i] = q[i] + nrm[i] * a;
    }
  q = p;`,
`  // The direct banded solve (registration_banded_solve.md; the ruling at the ring for the two reads): with p_i = q_i + a_i n_i, the energy is the
  // sum of |p_(i-1) - 2 p_i + p_(i+1)|^2; its normal equations in a are symmetric with five entries a row, solved by a banded Cholesky. Offsets
  // with no normal (and the ends) are held at 0; offsets past their bounds are held there and the rest solved again, up to kBendRounds x effort.
  std::vector<double> a(n, 0.0), d0(n), d1(n), d2(n), rhs(n), l0(n), l1(n), l2(n), y(n);
  std::vector<int8_t> held(n, 0);  // 0 free, -1 held at lo, +1 held at hi, 2 held at 0
  for (size_t i = 0; i < n; ++i)
    if (i == 0 || i + 1 == n || length(nrm[i]) < 0.5f) held[i] = 2;
  const auto nd = [&](size_t j, size_t k) { return static_cast<double>(dot(nrm[j], nrm[k])); };
  for (int round = 0; round < kBendRounds * std::max(effort, 1); ++round) {
    std::fill(d0.begin(), d0.end(), 0.0), std::fill(d1.begin(), d1.end(), 0.0), std::fill(d2.begin(), d2.end(), 0.0), std::fill(rhs.begin(), rhs.end(), 0.0);
    for (size_t i = 1; i + 1 < n; ++i) {  // the energy's row i: w = (1, -2, 1) on (i-1, i, i+1)
      const Vec3   c = flat(q[i - 1] - q[i] * 2.0f + q[i + 1]);
      const size_t ix[3] = {i - 1, i, i + 1};
      const double w[3] = {1.0, -2.0, 1.0};
      for (int u = 0; u < 3; ++u) {
        rhs[ix[u]] -= w[u] * static_cast<double>(dot(nrm[ix[u]], c));
        for (int v = u; v < 3; ++v) {
          const double val = w[u] * w[v] * nd(ix[u], ix[v]);
          if (v == u) d0[ix[u]] += val;
          else if (v == u + 1) d1[ix[u]] += val;
          else d2[ix[u]] += val;
        }
      }
    }
    for (size_t i = 0; i < n; ++i) {  // held offsets: their value to the right-hand side, their row and column an identity
      if (!held[i]) continue;
      const double v = held[i] == -1 ? lo[i] : held[i] == 1 ? hi[i] : 0.0;
      if (i >= 1) rhs[i - 1] -= d1[i - 1] * v, d1[i - 1] = 0.0;
      if (i >= 2) rhs[i - 2] -= d2[i - 2] * v, d2[i - 2] = 0.0;
      if (i + 1 < n) rhs[i + 1] -= d1[i] * v;
      if (i + 2 < n) rhs[i + 2] -= d2[i] * v;
      d1[i] = 0.0, d2[i] = 0.0, d0[i] = 1.0, rhs[i] = v;
    }
    for (size_t i = 0; i < n; ++i) {  // banded Cholesky: L has a diagonal and two below it
      l2[i] = i >= 2 ? d2[i - 2] / l0[i - 2] : 0.0;
      l1[i] = i >= 1 ? (d1[i - 1] - (i >= 2 ? l2[i] * l1[i - 1] : 0.0)) / l0[i - 1] : 0.0;
      l0[i] = std::sqrt(std::max(d0[i] + 1e-6 - l1[i] * l1[i] - l2[i] * l2[i], 1e-12));
    }
    for (size_t i = 0; i < n; ++i) y[i] = (rhs[i] - (i >= 1 ? l1[i] * y[i - 1] : 0.0) - (i >= 2 ? l2[i] * y[i - 2] : 0.0)) / l0[i];
    for (size_t k = n; k-- > 0;) a[k] = (y[k] - (k + 1 < n ? l1[k + 1] * a[k + 1] : 0.0) - (k + 2 < n ? l2[k + 2] * a[k + 2] : 0.0)) / l0[k];
    bool past = false;
    for (size_t i = 0; i < n; ++i) {
      if (held[i]) continue;
      if (a[i] < lo[i] - 1e-5) held[i] = -1, past = true;
      else if (a[i] > hi[i] + 1e-5) held[i] = 1, past = true;
    }
    if (!past) break;
  }
  for (size_t i = 0; i < n; ++i) {
    const float off = held[i] == -1 ? lo[i] : held[i] == 1 ? hi[i] : held[i] == 2 ? 0.0f : static_cast<float>(a[i]);
    q[i] = q[i] + nrm[i] * std::min(hi[i], std::max(lo[i], off));
  }`);
fs.writeFileSync(f, s);
console.log('banded solve applied');
