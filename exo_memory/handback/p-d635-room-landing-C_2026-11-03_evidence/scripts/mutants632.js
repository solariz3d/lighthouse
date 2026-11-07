// D632 mutants for second-vantage.js: every new guard, removed or bent one at a time; scored by score.js (node --test).
const R = String.raw;
const pat = (re, name) => [`M ${name}`, `  ${re},\n`, `  /\\bX${name.replace(/\W/g, '')}X\\b/i,\n`];
module.exports = {
  label: 'd632-vantage',
  repo: 'C:/Users/nname/Desktop/worktrees/lh-d635-c',
  rel: 'consonance/tools/second-vantage.js',
  score: { cmd: process.execPath, args: [__dirname + '/score.js'], cwd: '.' },
  rows: [
    ['M1 live skip removed', 'if (sentences.every(liveState)) {', 'if (false) {'],
    ['M2 skip on ANY live sentence', 'if (sentences.every(liveState)) {', 'if (sentences.some(liveState)) {'],
    ['M3 reader stays in this repo', '  repoRoot = repo.root;\n', '  repoRoot = repoRoot;\n'],
    ["M4 world check keeps this repo's head", '  row = { ...row, head: repo.head };', '  row = { ...row };'],
    ['M5 claim paths ignored', "if (hit) { root = hit; by = 'path'; break; }", "if (false) { root = hit; by = 'path'; break; }"],
    ['M6 named commits ignored', 'if (best > 0 && score[0] < best) {', 'if (false) {'],
    ['M7 hasCommit inverted', "{ cwd: root, encoding: 'utf8', windowsHide: true }).status === 0;", "{ cwd: root, encoding: 'utf8', windowsHide: true }).status !== 0;"],
    ['M8 brief drops the claim time', "${row.turn_ts || 'an unrecorded time'}", 'an unrecorded time'],
    ['M9 brief drops the claim head', "with the repository at ${row.head || 'an unrecorded head'}", 'with the repository at an unrecorded head'],
    ['M10 VANTAGE_REPOS ignored', 'if (env.VANTAGE_REPOS) return', 'if (false) return'],
    ['M11 config key ignored', '.vantage_repos;', '.vantage_repos_x;'],
    pat(R`/\b(?:is|are|was|were|still|now)\b[^.]{0,40}\brunning\b/i`, 'running'),
    pat(R`/\bunder the lock\b/i`, 'lock'),
    pat(R`/\barmed\b/i`, 'armed'),
    pat(R`/\binstall(?:ed|ing|s)?\b/i`, 'install'),
    pat(R`/\b(?:vendor|claude|cli|runs)\b[^.]{0,30}\bv?\d+\.\d+\.\d{2,}\b/i`, 'version'),
    [`M disk`, R`  /\b\d[\d.,]*\s?[KMGT]i?B\b/,` + '\n', R`  /\bXdiskX\b/,` + '\n'],
    pat(R`/\b(?:now|right now|currently|at the moment|so far)\b/i`, 'now'),
    pat(R`/\b(?:tree|worktree|checkout)\b[^.]{0,25}\b(?:clean|dirty)\b/i`, 'tree clean'),
    pat(R`/\b(?:clean|dirty)\b[^.]{0,25}\b(?:tree|worktree|checkout|HEAD)\b/i`, 'clean tree'),
    pat(R`/\b(?:WMI|shutdown|MT\/s)\b/i`, 'hardware'),
    pat(R`/\bclaude doctor\b/i`, 'doctor'),
  ],
};
