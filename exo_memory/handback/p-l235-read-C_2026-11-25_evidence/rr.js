// Runs the branch's rereadsAfterCuts (required from the branch's own file, via a worktree-free copy that keeps its require of ../hooks) on a transcript and prints every re-read entry.
const path = require('path');
const R = require(path.join(process.argv[2], 'consonance/tools/usage-ledger.js'));
const fs = require('fs');
for (const f of process.argv.slice(3)) {
  for (const r of R.rereadsAfterCuts(fs.readFileSync(f, 'utf8').split('\n'))) {
    console.log(path.basename(f), 'cut', r.at, '| first lap', r.firstLap, '| calls', r.calls, '| read before', r.before, '| re-read', r.reread.length);
    for (const p of r.reread) console.log('   ', JSON.stringify(p).slice(0, 110));
  }
}
