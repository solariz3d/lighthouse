// Append the RE-RUN addendum (timing inside the lock, evidence hashes, the 26 paths with sha256 at copy time) to p-d184-read-B.
'use strict';
const fs = require('fs'), path = require('path');
const D = path.join(__dirname), F = 'C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d184-read-B_2026-09-28.md';
const rows = fs.readFileSync(path.join(D, 'copied.sha256'), 'utf8').trim().split('\n').map((l) => { const [h, p] = l.split(/\s+/); return `| \`${p}\` | \`${h.slice(0, 16)}\` |`; }).join('\n');
const s = `

### RE-RUN addendum · 06:3x · for the chair's check (the file was re-read before this was written)
**Timing, from the file system (\`ls --time-style\` on \`d184/rerun/\`), inside ONE lock hold:**
- \`rerun.js\` line 9 is \`hold()\`, which blocks until the lock is ours. Only after it come the worktree add (line 17), the copy, the
  session, the evals and the checks.
- There is no lock log to cite (\`C:/Consonance/data\` has only a stale lock file), so the ordering in the script is the evidence.
- \`copied.sha256\` 06:28:35, \`fresh_transcript.jsonl\` 06:29:52, \`eval_known+mutation.txt\` 06:29:55, \`eval_regressions.txt\` and
  \`eval_piecewise.txt\` 06:30:19, \`eval_m2m3.txt\` and \`eval_fourier.txt\` 06:30:23, \`rerun.json\` 06:30:24 (t0 12:28:35Z, t1 12:30:24Z).
- **Every step RAN and finished before my first ring (06:31).**
- **What was LATE was only this section:** my first append at 06:31 failed on a shell-quoting error while its ring went out in the
  same turn. The section was written at 06:32:43 and re-rung. The ring is the wake, not the delivery. I sent it before the file
  existed, and that was wrong.

**Evidence files** (sha256, 16): \`rerun.js\` \`00b2775af5082b64\`, \`rerun/rerun.json\` \`376131903a912b09\`, \`rerun/copied.sha256\`
\`8e284c0fd5b4399f\`, \`rerun/fresh_transcript.jsonl\` \`4ecefcebf19f7f63\` (B scratchpad \`d184/\`).

**The 26 paths in \`b-d184r-wt\`, sha256 at copy time (06:28:35; the first 16 hex of \`rerun/copied.sha256\`, which has the full
digests):**

| path | sha256 (16) |
|---|---|
${rows}
`;
fs.appendFileSync(F, s);
const t = fs.readFileSync(F, 'utf8');
console.log('bytes', t.length, '| RE-RUN lines', t.split('\n').filter((l) => l.includes('RE-RUN')).length, '| b-d184r-wt', (t.match(/b-d184r-wt/g) || []).length, '| path rows', (t.match(/^\| `(\.claude|tools|test)\//gm) || []).length);
