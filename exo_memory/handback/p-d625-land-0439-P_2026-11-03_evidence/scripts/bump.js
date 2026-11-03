// bump.js (after C's D615 bump.js): 0.4.38 -> 0.4.39 in the landing tree (cwd), each edit required exactly once; line endings kept.
// CHANGELOG: [Unreleased] becomes [0.4.39] - 2026-11-03 under an empty [Unreleased]; the merge's double blank line before [0.4.38] goes.
'use strict';
const fs = require('fs');
function ed(f, pairs) {
  let s = fs.readFileSync(f, 'utf8'); const crlf = s.includes('\r\n'), n = (x) => (crlf ? x.replace(/\r?\n/g, '\r\n') : x);
  for (const [a0, b0] of pairs) { const a = n(a0), b = n(b0), k = s.split(a).length - 1; if (k !== 1) throw new Error(`${f}: ${k} of ${JSON.stringify(a0.slice(0, 60))}`); s = s.replace(a, () => b); }
  fs.writeFileSync(f, s); console.log('bumped ' + f);
}
ed('src-tauri/Cargo.toml', [['version = "0.4.38"', 'version = "0.4.39"']]);
ed('src-tauri/tauri.conf.json', [['"version": "0.4.38",', '"version": "0.4.39",']]);
ed('src-tauri/Cargo.lock', [['name = "t180-track-builder"\nversion = "0.4.38"', 'name = "t180-track-builder"\nversion = "0.4.39"']]);
ed('CHANGELOG.md', [['## [Unreleased]\n', '## [Unreleased]\n\n## [0.4.39] - 2026-11-03\n'], ['\n\n\n## [0.4.38] - 2026-11-02\n', '\n\n## [0.4.38] - 2026-11-02\n']]);
ed('README.md', [
  ['**The current installer is 0.4.38** (2026-11-02), `T-180.Track.Builder_0.4.38_x64-setup.exe`, from the', '**The current installer is 0.4.39** (2026-11-03), `T-180.Track.Builder_0.4.39_x64-setup.exe`, from the'],
  ['[v0.4.38 release](https://github.com/solariz3d/t180-track-builder/releases/tag/v0.4.38).', '[v0.4.39 release](https://github.com/solariz3d/t180-track-builder/releases/tag/v0.4.39).'],
  ['`[0.4.38]`, `[0.4.37]`,', '`[0.4.39]`, `[0.4.38]`, `[0.4.37]`,'],
]);
