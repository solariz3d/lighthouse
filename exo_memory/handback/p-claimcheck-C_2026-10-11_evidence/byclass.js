// D305 part 4: refusals split by claim class (figure / state), the split B's §5 narrowing uses. Read-only over A's frozen lists.
//   node byclass.js <lists dir> [v1|all]
// For right and week it rebuilds the turns with the harness's own exported loader (turnsByMessageId) and runs the adapter; census turns need E's
// turn.js per unit, so census is taken from the adapter's flags through the harness CLI (report files), not here.
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = 'G:/worktrees/c-d305-wt';
const R = require(path.join(ROOT, 'consonance/tools/claim-replay.js'));
const A = require(path.join(ROOT, 'consonance/tools/claim-check-adapter.js'));
const lists = process.argv[2], vias = A.VIA_SETS[process.argv[3] === 'v1' ? 'v1' : 'all'];
const PROJECTS = path.join(os.homedir(), '.claude', 'projects');
for (const [g, file, key] of [['right', 'right-claims.json', 'messages'], ['week', 'week-replies.json', 'replies']]) {
  const items = JSON.parse(fs.readFileSync(path.join(lists, file), 'utf8'))[key];
  const byFile = {}; for (const x of items) (byFile[x.transcript] = byFile[x.transcript] || new Map()).set(x.messageId, x);
  const got = new Map(); for (const [rel, w] of Object.entries(byFile)) for (const [id, t] of R.turnsByMessageId(path.join(PROJECTS, rel), w)) got.set(id, t);
  const c = { n: 0, any: 0, figureOnly: 0, stateOnly: 0, both: 0, wouldRefuseFigureClass: 0, wouldRefuseStateClass: 0, figKinds: {}, needs: {} };
  for (const x of items) {
    const t = got.get(x.messageId); if (!t) continue; c.n++;
    const r = A.checkTurn(t, vias); if (r.verdict !== 'refuse') continue; c.any++;
    const fig = r.flagged.filter((f) => f.kind === 'figure'), st = r.flagged.filter((f) => f.kind === 'state');
    if (fig.length && st.length) c.both++; else if (fig.length) c.figureOnly++; else c.stateOnly++;
    if (fig.length) c.wouldRefuseFigureClass++; if (st.length) c.wouldRefuseStateClass++;
    for (const f of fig) c.figKinds[f.need] = (c.figKinds[f.need] || 0) + 1;
    for (const f of st) c.needs[f.need] = (c.needs[f.need] || 0) + 1;
  }
  console.log(g, JSON.stringify(c));
}
