// relcommit.js (D485, pane E): the 0.4.23 release commit's edits. The two entries d1e93dd and cf0102c added auto-merged into the released [0.4.22]
// section (their branches predate it); they move, verbatim, into a new [0.4.23] section under Fixed, so 0.4.22's section is again byte-equal to v0.4.22's.
// docs/RELEASE.md's two lines; the README's installer lines, section list, commit count and release count. Each edit must match exactly once.
'use strict';
const fs = require('fs'), { execFileSync } = require('child_process'), W = 'C:/Users/nname/Downloads/t180-wt-e485/';
const [date, commits] = process.argv.slice(2);
if (!/^\d{4}-\d\d-\d\d$/.test(date) || !/^\d+$/.test(commits)) throw new Error('usage: relcommit.js <YYYY-MM-DD> <commits after this commit>');
function edit(rel, fn) {
  const raw = fs.readFileSync(W + rel, 'utf8'), crlf = raw.includes('\r\n');
  const s = fn(raw.split('\r\n').join('\n'));
  fs.writeFileSync(W + rel, crlf ? s.split('\n').join('\r\n') : s); console.log('edited', rel);
}
const once = (s, a, b) => { if (s.split(a).length !== 2) throw new Error(`not exactly one of ${JSON.stringify(a.slice(0, 70))}`); return s.replace(a, () => b); };
const ENTRIES = ['- **Stretching a piece with an edge typed on an empty track keeps up with a 144 Hz screen.**', '- **Dragging a piece with an edge typed no longer slows every frame.**'];
edit('CHANGELOG.md', (s) => {
  const lines = s.split('\n'), moved = [];
  for (const head of ENTRIES) {
    const i = lines.findIndex((l) => l.startsWith(head)); if (i < 0 || lines.filter((l) => l.startsWith(head)).length !== 1) throw new Error('entry not found once: ' + head);
    moved.push(lines[i]); lines.splice(i, 1);
  }
  let t = lines.join('\n');
  t = once(t, '## [Unreleased]\n\n## [0.4.22]', `## [Unreleased]\n\n## [0.4.23] - ${date}\n\n### Fixed\n${moved.join('\n')}\n\n## [0.4.22]`);
  // 0.4.22's section must now read exactly as at v0.4.22
  const sec = (x, v) => { const a = x.indexOf(`## [${v}]`), b = x.indexOf('\n## [', a + 1); return x.slice(a, b); };
  const tag = execFileSync('git', ['show', 'v0.4.22:CHANGELOG.md'], { cwd: W, encoding: 'utf8' }).split('\r\n').join('\n');
  if (sec(t, '0.4.22') !== sec(tag, '0.4.22')) throw new Error('the [0.4.22] section is not as v0.4.22 has it');
  console.log('[0.4.22] section equal to v0.4.22: yes; moved', moved.length);
  return t;
});
edit('docs/RELEASE.md', (s) => once(once(s, '# Release: T-180 Track Builder 0.4.22', '# Release: T-180 Track Builder 0.4.23'), 'T-180 Track Builder_0.4.22_x64-setup.exe', 'T-180 Track Builder_0.4.23_x64-setup.exe'));
edit('README.md', (s) => {
  s = once(s, '**So far:** 554 commits since 27 September 2026, and 21 releases.', `**So far:** ${commits} commits since 27 September 2026, and 22 releases.`);
  s = once(s, '**The current installer is 0.4.22** (2026-10-27), `T-180.Track.Builder_0.4.22_x64-setup.exe`, from the', `**The current installer is 0.4.23** (${date}), \`T-180.Track.Builder_0.4.23_x64-setup.exe\`, from the`);
  s = once(s, '[v0.4.22 release](https://github.com/solariz3d/t180-track-builder/releases/tag/v0.4.22).', '[v0.4.23 release](https://github.com/solariz3d/t180-track-builder/releases/tag/v0.4.23).');
  s = once(s, '`[0.4.22]`, `[0.4.21]`,', '`[0.4.23]`, `[0.4.22]`, `[0.4.21]`,');
  return once(s, 'from its first commit to twenty-one releases in four weeks', 'from its first commit to twenty-two releases in four weeks');
});
