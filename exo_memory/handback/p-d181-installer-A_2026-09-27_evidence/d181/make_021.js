// D181: split CHANGELOG.md into [0.2.1] (what landed after the first 0.2.0 build, i.e. after HEAD e6b4362) and [0.2.0]
// (HEAD's content, room words removed). Every move is an exact, single-match replacement; any miss throws.
const fs = require('fs');
const F = 'C:/Users/nname/Desktop/t180-track-builder/CHANGELOG.md';
let s = fs.readFileSync(F, 'utf8');
const cut = (a) => { if (s.split(a).length !== 2) throw new Error('not exactly once: ' + a.slice(0, 80)); s = s.replace(a, ''); return a; };
const rep = (a, b) => { if (s.split(a).length !== 2) throw new Error('not exactly once: ' + a.slice(0, 80)); s = s.replace(a, () => b); };

// the room-word removal's leftovers
rep('`src/export/scene.js` and `src/export/kn5write.js` .', '`src/export/scene.js` and `src/export/kn5write.js`.');
rep('`scripts/platform_test.js` It builds', '`scripts/platform_test.js`. It builds');
rep('`src/export/markers.js` These are', '`src/export/markers.js`. These are');

// 0.2.0 says what 0.2.0 had (HEAD's wording): the texture tools, panel and editor were not in the page yet
rep('- Texture tools in `src/texture/`, used by the preview and the export (the mesh\'s own UVs are still mapped by centreline distance):',
    '- Texture tools in `src/texture/`, not yet used by the mesh, the preview or the export:');
rep('- A texture panel (`app/texture/`), in the side panel under the sculpt handles.',
    '- A texture panel (`app/texture/`), built and tested headless; not yet mounted in the page.');
rep('  into DDS. Four presets: asphalt, rainbow, lanes, neon-night. The editor opens from each slot\'s "Make…" button in\n  the texture panel.',
    '  into DDS. Four presets: asphalt, rainbow, lanes, neon-night. The editor panel is built and tested headless; not yet\n  mounted in the page.');

// entries that landed after the first 0.2.0 build move to 0.2.1
const addedLook = cut('- The 3D preview draws the track with Assetto Corsa\'s own shaders (`ksPerPixel`, `ksPerPixelNM`, `ksMultilayer`, ported\n  from Content Manager\'s Custom Showroom under the Ms-PL, whose licence is in `app/preview/`) and exactly the materials\n  and textures the export writes, under one stated reference light (14:00 sun). L switches to a colour per placed word.\n');
const addedGuide = cut('- A guided first track for new users: five short, skippable steps (place a few pieces, sculpt one handle, close the\n  loop, read the colours, export). The guide only shows the moves; the user makes them. It opens once, on first run,\n  which it remembers in the app\'s own data folder, and "Show the guide" brings it back. It sets the starting font and\n  tempo, each with its source, and points at the starter phrases.\n');
const addedTex = cut('- The export writes the texture set the preview draws: a word whose floor slot holds a texture (an image or a made\n  one) is exported in that slot\'s material, with its DDS embedded; an untextured track\'s kn5 is unchanged. "Install to\n  AC" carries it too.\n');
const fixedStart = '- **In the app\'s real window, placing any word did nothing.**';
const i = s.indexOf(fixedStart);
if (i < 0 || s.indexOf(fixedStart, i + 1) >= 0) throw new Error('fixed block');
const fixed = s.slice(i); s = s.slice(0, i);
if (!/The Install to AC tooltip read/.test(fixed)) throw new Error('fixed block tail');

const v021 = `## [0.2.1] - 2026-09-27

The first 0.2.0 build could not place a word in its own window (see Fixed). 0.2.1 is the build to install. It also
brings the Assetto Corsa look in the preview, a guided first track, and textures that reach the exported track.

### Added

${addedLook}${addedGuide}- A textures panel in the side panel, under the sculpt handles: pick a road word, then give each of its slots an image
  or a made texture. The texture maker opens from each slot's "Make…" button.
${addedTex}
### Fixed

${fixed.replace(/\n+$/, '')}
`;
rep('## [0.2.0] - 2026-09-27\n', v021 + '\n## [0.2.0] - 2026-09-27\n');
fs.writeFileSync(F, s.replace(/\n+$/, '\n'));
console.log('written');
