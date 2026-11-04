// rows.js — D090 mutant rows for dev/shell/lib/ready.js, in the tracked harness's format
// (consonance/tools/mutant-harness.js). Used for its GATES (--audit): shape, dirty source, anchors.
// Scoring through it needs the scorer to exist in a worktree of HEAD, and dev/shell/lib/ready.test.js
// is untracked this lap, so the kills are run by scratchpad/ready/mutants.js instead — stated in the hand-back.
// A deleted line is written as a comment-out, because the harness's shape gate (R3) refuses an empty replacement.
const OUT = '    // removed by a mutant\n';
module.exports = {
  label: 'd090-ready',
  repo: 'C:/Users/nname/Desktop/lighthouse',
  rel: 'dev/shell/lib/ready.js',
  score: { cmd: 'node', args: ['dev/shell/lib/ready.test.js'], cwd: '.' },
  rows: [
    ['the overseer guard is gone', "    if (process.env.CLAUDE_OVERSEER_RUN === '1') return;\n", OUT],
    ['the overseer guard tests the wrong value', "process.env.CLAUDE_OVERSEER_RUN === '1'", "process.env.CLAUDE_OVERSEER_RUN === '0'"],
    ['the overseer guard tests the wrong variable', "process.env.CLAUDE_OVERSEER_RUN === '1'", "process.env.CLAUDE_OVERSEER_RUN_X === '1'"],
    ['the dream guard is gone', '    if (process.env.CONSONANCE_DREAM) return;\n', OUT],
    ['the pane-id shape check is gone', '    if (!/^[A-Za-z0-9_-]{1,128}$/.test(pane)) return;\n', OUT],
    ['ready is no longer strictly true', 'ready: ready === true,', 'ready: !!ready,'],
    ['the event label is inverted', "event: ready ? 'stop' : 'prompt',", "event: ready ? 'prompt' : 'stop',"],
    ['the missing-variable guard is gone', '    if (!dir || !pane) return;\n', OUT],
  ],
};
