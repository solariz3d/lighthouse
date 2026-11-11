// patch_measure.js <worktree>: pane E, L162 commit 1 — the lit share, measured. Changes no generation.
'use strict';
const fs = require('fs'), path = require('path');
const W = process.argv[2];
const edit = (rel, a, b) => {
  const f = path.join(W, rel); let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${rel}: anchor found ${n} times: ${a.slice(0, 60)}`);
  s = s.replace(a, b); if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s); console.log('edited', rel);
};

edit('gen/src/measure.h',
  '  float vertical_links_per_chunk = 0;  // stairs + shafts\n};',
  `  float vertical_links_per_chunk = 0;  // stairs + shafts
  // How much of the floor a lamp reaches (L162). A walkable cell counts as lit when a lamp hangs within kLampReach of its
  // centre, horizontally, on the same storey. Walls are not considered, so this is an upper bound on what is lit.
  // lit_share is over all cells; per chunk it is lit cells / cells, and its spread (standard deviation over chunks of at
  // least 20 cells) says whether light comes evenly or in pools; dark_chunk_share is the share of those chunks under 0.35.
  float lit_share = 0, lit_share_chunk_std = 0, dark_chunk_share = 0;
};
// A lamp's reach: sqrt(peak / cutoff) for a lamp of colour peak 1 at the renderer's default cutoff of 0.02
// (render/src/renderer.cpp, the static lights' range).
inline constexpr float kLampReach = 7.0710678f;`);

edit('gen/src/measure.cpp',
  '  if (sum.walk_cells > 0) m.lamps_per_100_cells = 100.0f * static_cast<float>(sum.lamps) / static_cast<float>(sum.walk_cells);\n  return m;',
  `  if (sum.walk_cells > 0) m.lamps_per_100_cells = 100.0f * static_cast<float>(sum.lamps) / static_cast<float>(sum.walk_cells);

  // ---- the lit share (L162): lamps by storey on a grid of kLampReach squares, then every cell node against the nine
  // squares round it. A lamp hangs under its storey's ceiling and a node sits at its storey's floor, so both are filed by
  // the storey they belong to.
  {
    auto storey_of_lamp = [](float y) { return static_cast<int>(std::floor(y / kStorey)); };
    auto storey_of_floor = [](float y) { return static_cast<int>(std::floor((y + 0.5f) / kStorey)); };
    auto sq = [](float v) { return static_cast<int>(std::floor(v / kLampReach)); };
    auto key = [](int a, int b, int c) {
      return (static_cast<uint64_t>(static_cast<uint32_t>(a) & 0x1fffffu) << 42) |
             (static_cast<uint64_t>(static_cast<uint32_t>(b) & 0x1fffffu) << 21) | static_cast<uint64_t>(static_cast<uint32_t>(c) & 0x1fffffu);
    };
    std::unordered_map<uint64_t, std::vector<Vec3>> lamps;
    for (const Chunk& c : chunks)
      for (const Light& l : c.scene.lights) {
        const Vec3 p{l.position.x + static_cast<float>(c.scene.origin[0]), l.position.y + static_cast<float>(c.scene.origin[1]),
                     l.position.z + static_cast<float>(c.scene.origin[2])};
        lamps[key(sq(p.x), storey_of_lamp(p.y), sq(p.z))].push_back(p);
      }
    int cells_all = 0, lit_all = 0, chunks_counted = 0, dark = 0;
    std::vector<float> shares;
    for (const Chunk& c : chunks) {
      int cells = 0, lit = 0;
      for (const WalkNode& node : c.graph.nodes) {
        if (node.id.slot != 0) continue;  // a cell, not a node along a stair
        ++cells;
        const int s = storey_of_floor(node.pos.y), gx = sq(node.pos.x), gz = sq(node.pos.z);
        bool hit = false;
        for (int dz = -1; dz <= 1 && !hit; ++dz)
          for (int dx = -1; dx <= 1 && !hit; ++dx) {
            const auto it = lamps.find(key(gx + dx, s, gz + dz));
            if (it == lamps.end()) continue;
            for (const Vec3& p : it->second) {
              const float ex = p.x - node.pos.x, ez = p.z - node.pos.z;
              if (ex * ex + ez * ez <= kLampReach * kLampReach) { hit = true; break; }
            }
          }
        lit += hit;
      }
      cells_all += cells, lit_all += lit;
      if (cells >= 20) {
        const float share = static_cast<float>(lit) / static_cast<float>(cells);
        shares.push_back(share);
        ++chunks_counted;
        dark += share < 0.35f;
      }
    }
    if (cells_all > 0) m.lit_share = static_cast<float>(lit_all) / static_cast<float>(cells_all);
    if (chunks_counted > 0) {
      float mean = 0;
      for (float v : shares) mean += v;
      mean /= static_cast<float>(chunks_counted);
      float var = 0;
      for (float v : shares) var += (v - mean) * (v - mean);
      m.lit_share_chunk_std = std::sqrt(var / static_cast<float>(chunks_counted));
      m.dark_chunk_share = static_cast<float>(dark) / static_cast<float>(chunks_counted);
    }
  }
  return m;`);

edit('gen/tools/dz-gen/main.cpp',
  '{"ms per chunk", {}}, {"storey agreement", {}}, {"corridor sightline m", {}}, {"doorways per corridor cell", {}},\n                {"open share", {}}};',
  `{"ms per chunk", {}}, {"storey agreement", {}}, {"corridor sightline m", {}}, {"doorways per corridor cell", {}},
                {"open share", {}}, {"lit share", {}}, {"lit share spread", {}}, {"dark chunk share", {}}};`);
edit('gen/tools/dz-gen/main.cpp',
  '                              ps.mean_sightline_m, ps.doors_per_corridor_cell, ps.open_share};',
  `                              ps.mean_sightline_m, ps.doors_per_corridor_cell, ps.open_share, m.lit_share,
                              m.lit_share_chunk_std, m.dark_chunk_share};`);
