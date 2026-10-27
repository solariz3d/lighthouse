// relcommit.js (D483, pane E): the release commit's edits, the same shape as 9648a25: the CHANGELOG [0.4.22] heading (dated in UTC),
// docs/RELEASE.md's two lines, the README's installer lines, section list, commit count and release count. Each edit must match exactly once.
'use strict';
const fs = require('fs'), W = 'C:/Users/nname/Downloads/t180-wt-e483/';
const [date, commits] = process.argv.slice(2);
if (!/^\d{4}-\d\d-\d\d$/.test(date) || !/^\d+$/.test(commits)) throw new Error('usage: relcommit.js <YYYY-MM-DD> <commits after this commit>');
function edit(rel, pairs) {
  const raw = fs.readFileSync(W + rel, 'utf8'), crlf = raw.includes('\r\n'); let s = raw.split('\r\n').join('\n');
  for (const [a, b] of pairs) { if (s.split(a).length !== 2) throw new Error(`${rel}: not exactly one of ${JSON.stringify(a.slice(0, 70))}`); s = s.replace(a, () => b); }
  fs.writeFileSync(W + rel, crlf ? s.split('\n').join('\r\n') : s); console.log('edited', rel);
}
edit('CHANGELOG.md', [['## [Unreleased]\n\n### Added', `## [Unreleased]\n\n## [0.4.22] - ${date}\n\n### Added`]]);
edit('docs/RELEASE.md', [
  ['# Release: T-180 Track Builder 0.4.21', '# Release: T-180 Track Builder 0.4.22'],
  ['T-180 Track Builder_0.4.21_x64-setup.exe', 'T-180 Track Builder_0.4.22_x64-setup.exe'],
]);
edit('README.md', [
  ['**So far:** 543 commits since 27 September 2026, and 20 releases.', `**So far:** ${commits} commits since 27 September 2026, and 21 releases.`],
  ['**The current installer is 0.4.21** (2026-10-26), `T-180.Track.Builder_0.4.21_x64-setup.exe`, from the', `**The current installer is 0.4.22** (${date}), \`T-180.Track.Builder_0.4.22_x64-setup.exe\`, from the`],
  ['[v0.4.21 release](https://github.com/solariz3d/t180-track-builder/releases/tag/v0.4.21).', '[v0.4.22 release](https://github.com/solariz3d/t180-track-builder/releases/tag/v0.4.22).'],
  ['`[0.4.21]`, `[0.4.20]`,', '`[0.4.22]`, `[0.4.21]`, `[0.4.20]`,'],
  ['from its first commit to twenty releases in four weeks', 'from its first commit to twenty-one releases in four weeks'],
]);
