// rows.js — D091 mutants for consonance/tools/ask.js, for the tracked harness
// (consonance/tools/mutant-harness.js). Every row attacks the NEW behaviour: the widened heading,
// the unreadable-heading rule, the no-absorption rule, and the fence exemption that keeps the
// documented template harmless. Deletions are written as comment-outs because the harness's shape
// gate (R3) refuses an empty replacement, and no row's replacement may occur elsewhere in the file
// (its dirty-source gate).
const SCORE = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-07b8a48f/a2122153-a37e-41a6-a86f-534267ec0565/scratchpad/askmut/score.js';
module.exports = {
  label: 'd091-ask-unreadable',
  repo: 'C:/Users/nname/Desktop/lighthouse',
  rel: 'consonance/tools/ask.js',
  score: { cmd: 'node', args: [SCORE], cwd: 'consonance/tools' },
  rows: [
    ['the title group goes back to [^,]+ — the original defect',
      'const HEAD_RE = /^###\\s+(ASK-\\d+)\\s+—\\s+(.+),\\s+asked\\s+(\\d{4}-\\d{2}-\\d{2})\\s*$/;',
      'const HEAD_RE = /^###\\s+(ASK-\\d+)\\s+—\\s+([^,]+),\\s+asked\\s+(\\d{4}-\\d{2}-\\d{2})\\s*$/;'],
    ['an unparsable heading is ignored again (the guard never fires)',
      '    const bad = raw.match(ASK_HEAD_RE);',
      '    const bad = null;   // mutant: the heading rule never fires'],
    ['the unparsable heading does not close the block above it (absorption returns)',
      '      push();\n      unreadable.push({ id:',
      '      unreadable.push({ id:'],
    ['the fence is not tracked, so the documented template reads as an unreadable ask',
      '    if (FENCE_RE.test(raw)) { inFence = !inFence; continue; }',
      '    if (false) { inFence = !inFence; continue; }   // mutant: fences untracked'],
    ['fenced lines are parsed anyway',
      '    if (inFence) continue;',
      '    if (false) continue;   // mutant: fenced content parsed'],
    ['the unreadable row loses the id it could have carried',
      "unreadable.push({ id: /^ASK-\\d+$/.test(bad[1]) ? bad[1] : null,",
      'unreadable.push({ id: null,'],
    ['the heading rule catches ANY ### heading, not only ASK ones',
      'const ASK_HEAD_RE = /^###\\s+(ASK-\\S*)/;',
      'const ASK_HEAD_RE = /^###\\s+(\\S*)/;'],
    ['the reason stops saying it was the heading',
      'reason: `unparsable heading: ${raw.trim()}`',
      'reason: `unparsable: ${raw.trim()}`'],
  ],
};
