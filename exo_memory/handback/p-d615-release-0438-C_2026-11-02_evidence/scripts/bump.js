// bump.js: 0.4.37 -> 0.4.38 in the landing tree (cwd), each edit required exactly once; line endings kept
'use strict';
const fs = require('fs');
function ed(f, pairs) {
  let s = fs.readFileSync(f, 'utf8');
  for (const [a, b] of pairs) { const k = s.split(a).length - 1; if (k !== 1) throw new Error(`${f}: ${k} of ${JSON.stringify(a.slice(0, 60))}`); s = s.replace(a, () => b); }
  fs.writeFileSync(f, s); console.log('bumped ' + f);
}
ed('src-tauri/Cargo.toml', [['version = "0.4.37"', 'version = "0.4.38"']]);
ed('src-tauri/tauri.conf.json', [['"version": "0.4.37",', '"version": "0.4.38",']]);
{ // Cargo.lock: only the app's own package entry
  const f = 'src-tauri/Cargo.lock'; let s = fs.readFileSync(f, 'utf8');
  const re = /(name = "t180-track-builder"\r?\nversion = ")0\.4\.37(")/; if (!re.test(s)) throw new Error('lock entry');
  fs.writeFileSync(f, s.replace(re, '$10.4.38$2')); console.log('bumped ' + f);
}
ed('CHANGELOG.md', [['## [Unreleased]\n', '## [Unreleased]\n\n## [0.4.38] - 2026-11-02\n'.replace(/\n/g, fs.readFileSync('CHANGELOG.md', 'utf8').includes('\r\n') ? '\r\n' : '\n')]].map(([a, b]) => [fs.readFileSync('CHANGELOG.md', 'utf8').includes('\r\n') ? a.replace(/\n/g, '\r\n') : a, b]));
ed('README.md', [
  ['**The current installer is 0.4.37** (2026-11-02), `T-180.Track.Builder_0.4.37_x64-setup.exe`, from the', '**The current installer is 0.4.38** (2026-11-02), `T-180.Track.Builder_0.4.38_x64-setup.exe`, from the'],
  ['[v0.4.37 release](https://github.com/solariz3d/t180-track-builder/releases/tag/v0.4.37).', '[v0.4.38 release](https://github.com/solariz3d/t180-track-builder/releases/tag/v0.4.38).'],
  ['`[0.4.37]`, `[0.4.36]`,', '`[0.4.38]`, `[0.4.37]`, `[0.4.36]`,'],
]);
