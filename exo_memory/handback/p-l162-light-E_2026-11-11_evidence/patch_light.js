// patch_light.js <worktree>: pane E, L162 commit 2 — more light, in pools. Changes every seed's lamps (a new world).
'use strict';
const fs = require('fs'), path = require('path');
const W = process.argv[2];
const edit = (rel, a, b) => {
  const f = path.join(W, rel); let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${rel}: anchor found ${n} times: ${a.slice(0, 60)}`);
  s = s.replace(a, b); if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s); console.log('edited', rel);
};

// a new salt, appended after the last one so no other decision's hash moves
edit('gen/src/gen_impl.h',
  '  kSaltVoid,  // + axis, two values\n};',
  `  kSaltVoid,  // + axis, two values
  kSaltLitField = kSaltVoid + 2,  // L162: where light pools; after the void's two so that no earlier salt moves
};`);

// the apartment: the first biome, brighter
edit('gen/src/biome.cpp',
  "  // LayoutRules, TemplateSet and MovementCharacter defaults are the apartment's.\n  apt.kit = kit_palette(0, {1.0f, 0.86f, 0.62f});",
  `  // LayoutRules, TemplateSet and MovementCharacter defaults are the apartment's, except its lamps: where runs begin is
  // lit more than the default (L162, item 36: "the first biome and on average more places should be lit").
  apt.layout.lamps = 1.4f;
  apt.kit = kit_palette(0, {1.0f, 0.86f, 0.62f});`);

// the lit-region field
edit('gen/src/emit.cpp',
  'constexpr float kNone = 1e9f;  // "no ceiling here": open to the storey above\n',
  `constexpr float kNone = 1e9f;  // "no ceiling here": open to the storey above

// WHERE LIGHT POOLS (L162, item 36: more light on average, and darker stretches still). Value noise over cells on a lattice
// kLitSpan cells across, a fresh one on every storey, read as a multiplier on a cell's lamp chance: kLitDark in the
// darkest stretches, up to kLitDark + kLitPool where it pools. The lattice bunches values round the middle, so the mean is a
// little over 1. A reprieve's lamp (part of its tell) and a light well's are not touched.
constexpr float kLitSpan = 6.0f;   // cells: 18 m, about half a chunk
constexpr float kLitDark = 0.15f;  // the multiplier in a dark stretch
constexpr float kLitPool = 1.95f;  // added at the heart of a pool
float lit_field(uint32_t seed, int x, int y, int z) {
  const float fx = static_cast<float>(x) / kLitSpan, fz = static_cast<float>(z) / kLitSpan;
  const int   ix = static_cast<int>(std::floor(fx)), iz = static_cast<int>(std::floor(fz));
  auto        smooth = [](float t) { return t * t * (3.0f - 2.0f * t); };
  const float tx = smooth(fx - static_cast<float>(ix)), tz = smooth(fz - static_cast<float>(iz));
  float       v = 0;
  for (int c = 0; c < 4; ++c) {
    const int   dx = c & 1, dz = (c >> 1) & 1;
    const float w = (dx ? tx : 1 - tx) * (dz ? tz : 1 - tz);
    v += w * unit(hash3(seed, kSaltLitField, ix + dx, y, iz + dz));
  }
  const float t = clamp01((v - 0.25f) / 0.5f);
  return kLitDark + kLitPool * smooth(t);
}
`);

edit('gen/src/emit.cpp',
  '          if (unit(hash3(seed, kSaltLamp, x, y, z)) < p.dials.lamp_density * b.layout.lamps * weight) {',
  `          const bool  fixed_lamp = c.kind == CellKind::Reprieve || c.kind == CellKind::Well;  // a tell, and always lit
          const float pool = fixed_lamp ? 1.0f : lit_field(seed, x, y, z);
          if (unit(hash3(seed, kSaltLamp, x, y, z)) < p.dials.lamp_density * b.layout.lamps * weight * pool) {`);
