// patch_light_v2.js <worktree>: pane E, L162, on top of v1 (uncommitted). After v1's captures showed seed 2's spawn corridor
// losing its lamp: the field's floor and top become per-biome layout numbers, and the apartment's floor x lamps = 1.0, so
// the first biome never loses a lamp it had and only gains them in pools.
'use strict';
const fs = require('fs'), path = require('path');
const W = process.argv[2];
const edit = (rel, a, b) => {
  const f = path.join(W, rel); let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
  const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${rel}: anchor found ${n} times: ${a.slice(0, 60)}`);
  s = s.replace(a, b); if (crlf) s = s.replace(/\n/g, '\r\n'); fs.writeFileSync(f, s); console.log('edited', rel);
};

edit('gen/src/gen.h',
  '  float loops = 1.0f, dead_ends = 1.0f, vertical = 1.0f, big_spaces = 1.0f, lamps = 1.0f, reprieves = 1.0f;\n',
  `  float loops = 1.0f, dead_ends = 1.0f, vertical = 1.0f, big_spaces = 1.0f, lamps = 1.0f, reprieves = 1.0f;
  // Where light pools (L162): the lit-region field multiplies a cell's lamp chance from lamp_dark (the darkest stretch) up
  // to lamp_bright (the heart of a pool). With lamp_dark x lamps >= 1 a biome never loses a lamp it had before the field.
  float lamp_dark = 0.15f, lamp_bright = 2.1f;
`);

edit('gen/src/biome.cpp',
  '  apt.layout.lamps = 1.4f;\n',
  `  // Its field is shallow: lamp_dark x lamps = 1.0, so no apartment cell has a lower chance of a lamp than before L162, and
  // pools only add (the spawn corridor never goes dark because of the field).
  apt.layout.lamps = 1.25f;
  apt.layout.lamp_dark = 0.8f;
  apt.layout.lamp_bright = 1.6f;
`);

edit('gen/src/emit.cpp',
  `// WHERE LIGHT POOLS (L162, item 36: more light on average, and darker stretches still). Value noise over cells on a lattice
// kLitSpan cells across, a fresh one on every storey, read as a multiplier on a cell's lamp chance: kLitDark in the
// darkest stretches, up to kLitDark + kLitPool where it pools. The lattice bunches values round the middle, so the mean is a
// little over 1. A reprieve's lamp (part of its tell) and a light well's are not touched.
constexpr float kLitSpan = 6.0f;   // cells: 18 m, about half a chunk
constexpr float kLitDark = 0.15f;  // the multiplier in a dark stretch
constexpr float kLitPool = 1.95f;  // added at the heart of a pool
float lit_field(uint32_t seed, int x, int y, int z) {`,
  `// WHERE LIGHT POOLS (L162, item 36: more light on average, and darker stretches still). Value noise over cells on a lattice
// kLitSpan cells across, a fresh one on every storey, eased to 0 (the darkest stretch) .. 1 (the heart of a pool). The
// biome reads it as a multiplier on a cell's lamp chance, from layout.lamp_dark to layout.lamp_bright. A reprieve's lamp
// (part of its tell) and a light well's are not touched.
constexpr float kLitSpan = 6.0f;   // cells: 18 m, about half a chunk
float lit_field(uint32_t seed, int x, int y, int z) {`);
edit('gen/src/emit.cpp',
  `  const float t = clamp01((v - 0.25f) / 0.5f);
  return kLitDark + kLitPool * smooth(t);
}`,
  `  return smooth(clamp01((v - 0.25f) / 0.5f));
}`);
edit('gen/src/emit.cpp',
  `          const Biome& b = p.biomes[c.biome];
          const bool  fixed_lamp = c.kind == CellKind::Reprieve || c.kind == CellKind::Well;  // a tell, and always lit
          const float pool = fixed_lamp ? 1.0f : lit_field(seed, x, y, z);`,
  `          const Biome& b = p.biomes[c.biome];
          const bool  fixed_lamp = c.kind == CellKind::Reprieve || c.kind == CellKind::Well;  // a tell, and always lit
          const float pool = fixed_lamp ? 1.0f : b.layout.lamp_dark + (b.layout.lamp_bright - b.layout.lamp_dark) * lit_field(seed, x, y, z);`);
