// --lean-film for dz-world --capture-lean (pane E, 2026-11-13, the chair's 20:46:06Z ruling on the re-film): the follow
// camera only, the eased pass the game draws, every drawn frame (144 a second), a 3 s warm-up so the first frame is lit,
// and each stretch's first frame's brightness printed. Applied by exact anchors. node leanfilm.js <worktree>
const fs = require('fs');
const path = require('path');
const wt = process.argv[2];
const edit = (rel, pairs) => {
  const p = path.join(wt, rel);
  let s = fs.readFileSync(p, 'utf8');
  const crlf = s.includes('\r\n');
  s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) {
    const n = s.split(a).length - 1;
    if (n !== 1) throw new Error(rel + ': anchor x' + n + ': ' + a.slice(0, 70));
    s = s.replace(a, () => b);
  }
  fs.writeFileSync(p, crlf ? s.replace(/\n/g, '\r\n') : s);
  console.log('edited ' + rel);
};
edit('game/world/modes.h', [['  bool     uncapped = false;\n', `  bool     uncapped = false;
  bool     lean_film = false;   // --lean-film: --capture-lean's eased follow pass only, every frame, lit from the first
`]]);
edit('game/world/main.cpp', [['    else if (a == "--lean-run") { if (!need(i, 1)) return 2; lean_run = argv[++i]; }\n',
  `    else if (a == "--lean-run") { if (!need(i, 1)) return 2; lean_run = argv[++i]; }
    else if (a == "--lean-film") options.lean_film = true;
`]]);
edit('game/world/offscreen_models.cpp', [
  ['  for (int pass = 0; pass < 4; ++pass) {\n    const bool eased = pass % 2 == 1, behind = pass >= 2;\n',
   `  // --lean-film (pane E, 2026-11-13, his item 216 and the chair's ruling): the eased follow pass only (what the game
  // draws), every drawn frame, drawn from 3 s before each stretch so the picture's light has settled before the first
  // frame is kept.
  const size_t warm = options.lean_film ? 432 : 72;
  for (int pass = options.lean_film ? 1 : 0; pass < (options.lean_film ? 2 : 4); ++pass) {
    const bool eased = pass % 2 == 1, behind = pass >= 2;
`],
  ['        if (i + 72 < s.from || i >= s.from + span) continue;\n', '        if (i + warm < s.from || i >= s.from + span) continue;\n'],
  ['        if (i < s.from || (i - s.from) % 12 != 0) continue;\n', '        if (i < s.from || (!options.lean_film && (i - s.from) % 12 != 0)) continue;\n'],
  [`        const std::string path = out_dir + "/" + format("lean_%s_%s_%s_%02d.png", s.name, eased ? "eased" : "chase", behind ? "behind" : "follow",
                                                         static_cast<int>((i - s.from) / 12));
`, `        const std::string path =
            options.lean_film ? out_dir + "/" + format("film_%s_%03d.png", s.name, static_cast<int>(i - s.from))
                              : out_dir + "/" + format("lean_%s_%s_%s_%02d.png", s.name, eased ? "eased" : "chase", behind ? "behind" : "follow",
                                                       static_cast<int>((i - s.from) / 12));
        if (options.lean_film && i == s.from) {   // the first frame kept: how lit it is (mean of R, G, B, 0 to 255)
          double sum = 0;
          for (size_t px = 0; px + 3 < img.rgba8.size(); px += 4) sum += (img.rgba8[px] + img.rgba8[px + 1] + img.rgba8[px + 2]) / 3.0;
          std::printf("capture-lean: --lean-film, the %s's first frame: mean brightness %.1f of 255\\n", s.name, sum / static_cast<double>(img.rgba8.size() / 4));
        }
`],
]);
console.log('applied');
