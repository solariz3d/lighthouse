// Build the 0.2.0 CHANGELOG from HEAD's (never the stale working copy): the release heading, room words removed, lines
// that 0.2.0 makes untrue corrected, and the entries for work landing with 0.2.0 that HEAD does not have yet.
const fs = require('fs'), path = require('path');
let s = fs.readFileSync(path.join(__dirname, 'CHANGELOG.head.md'), 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) throw new Error('miss/dup: ' + a.slice(0, 70)); s = s.replace(a, () => b); };

// the release
rep(`All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The project has no releases yet; everything below is under
**Unreleased**.

## [Unreleased]
`, `All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.2.0] - 2026-09-27

The first release: a Windows installer for the track builder (see \`docs/RELEASE.md\`). A track is written in words,
built from its open end in a 3D preview, checked against measured T-180 limits while it is built, and exported as a
complete Assetto Corsa track folder. Nothing in it has been driven in the game yet. Version 0.1.0 was only the app's
version string; it was never released.
`);

// plain words: no internal work-split names
rep('Three packets\n  build to one shared scene shape', 'Three parts\n  build to one shared scene shape');
for (const [a, b] of [['(packet A).', '.'], ['(packet C). It builds', 'It builds'], ['(packet E). These are', 'These are'], ['(packet E) writes', 'writes'],
  ['(packet E) glues', 'glues'], ['(packet A, milestone 2). It generates', '(milestone 2). It generates'], ['(packet C, milestone 3, first half). It writes', '(milestone 3, first half). It writes'],
  ['loudly instead of being skipped (found by B\'s read of T1, fixed by A).', 'loudly instead of being skipped.']]) rep(a, b);

// lines 0.2.0 makes untrue
rep(' Each resolves, builds and validates with no red at its default tempo, and each quotes the FINDINGS and ARCHITECTURE\n  lines it comes from. Not yet in the palette.',
  ' Each resolves, builds and validates with no red at its default tempo, and each quotes the FINDINGS and ARCHITECTURE\n  lines it comes from. They are in the palette (below).');
rep('- A texture panel (`app/texture/`), built and tested headless; not yet mounted in the page.', '- A texture panel (`app/texture/`), in the side panel under the sculpt handles.');
rep('The editor panel is built and tested headless; not yet\n  mounted in the page.', 'The editor opens from each slot\'s "Make…" button in\n  the texture panel.');
rep('- Texture tools in `src/texture/`, not yet used by the mesh, the preview or the export:', '- Texture tools in `src/texture/`, used by the preview and the export (the mesh\'s own UVs are still mapped by centreline distance):');

// work landing with 0.2.0 that HEAD does not carry yet
rep(`  any are left. See \`docs/RELEASE.md\`. The installer is not code-signed, so SmartScreen warns.
`, `  any are left. See \`docs/RELEASE.md\`. The installer is not code-signed, so SmartScreen warns.
- The 3D preview draws the track with Assetto Corsa's own shaders (\`ksPerPixel\`, \`ksPerPixelNM\`, \`ksMultilayer\`, ported
  from Content Manager's Custom Showroom under the Ms-PL, whose licence is in \`app/preview/\`) and exactly the materials
  and textures the export writes, under one stated reference light (14:00 sun). L switches to a colour per placed word.
- A guided first track for new users: five short, skippable steps (place a few pieces, sculpt one handle, close the
  loop, read the colours, export). The guide only shows the moves; the user makes them. It opens once, on first run,
  which it remembers in the app's own data folder, and "Show the guide" brings it back. It sets the starting font and
  tempo, each with its source, and points at the starter phrases.
- The export writes the texture set the preview draws: a word whose floor slot holds a texture (an image or a made
  one) is exported in that slot's material, with its DDS embedded; an untextured track's kn5 is unchanged. "Install to
  AC" carries it too.
`);
rep(`- The app mutation harness copies \`tools/\` as well as \`src/\`, so the export's kn5 read-back works in its temp copies.
`, `- The app mutation harness copies \`tools/\` as well as \`src/\`, so the export's kn5 read-back works in its temp copies.
- **In the app's real window, placing any word did nothing.** The shell called the browser's \`setTimeout\` as a method of
  another object, which WebView2 refuses ("Illegal invocation") and Node allows, so every headless test passed. It was
  in the app from the first autosave onward; a test now makes the timers as strict as a browser's.
- A jump taken off a road that had climbed past vertical produced a flight that turned the pitch through vertical, so
  the car would have flown backwards, and validation then threw on a negative gap. Such a jump is now refused by name
  (\`JUMP_PAST_VERTICAL\`), at the take-off and anywhere in its flight, so the edit that would make one changes nothing.
  Found by the soak at 10,000 operations.
- A refused edit returns nothing, as every other refused action does, so the sculpt handles see the refusal.
- The first jump a new user placed was red straight away: its landing ramp was sized for 300 km/h while the track is
  checked at the design speed (460 km/h by default). The ramp is now sized for the design speed (41 m at 460 km/h
  instead of 19 m), and on a track still being built it follows the design-speed slider. A closed loop keeps its ramps.
  Below 290 km/h the default 12 m jump cannot be cleared at all, and it says so.
- A success ("loop closed…", "exported…") was shown in red, as an alert, like a refusal. It is now a plain status line.
`);
fs.writeFileSync(path.join(__dirname, 'CHANGELOG.new.md'), s);
console.log('lines', s.split('\n').length);
