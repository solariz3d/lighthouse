// q2-lookup.js (pane E, D303 part 3): B's §3 lookup, as registered, over q2-phrases.json.
//   node q2-lookup.js <repo> <q2-phrases.json> [id...]
// For each unit and phrase: git grep -n -i -F -e '<phrase>' <sha> -- . ':!exo_memory/third_place' ':!**/THIRD_PLACE.md'
// Prints each hit as <sha>:<path>:<line>: <text, cut>, the hit count per phrase, and at most MAX hits per phrase. The reader
// judges each hit against the test (does the sentence, read alone, name this action as required or forbidden here).
'use strict';
const { spawnSync } = require('child_process'), fs = require('fs');
const [repo, file, ...only] = process.argv.slice(2);
const MAX = Number(process.env.MAX_HITS || 12);
const units = JSON.parse(fs.readFileSync(file, 'utf8')).units.filter((u) => !only.length || only.includes(u.id));
for (const u of units) {
  console.log(`\n## ${u.id} @ ${u.sha}: ${u.conduct}`);
  for (const p of u.phrases) {
    const r = spawnSync('git', ['grep', '-n', '-i', '-F', '-e', p, u.sha, '--', '.', ':!exo_memory/third_place', ':!**/THIRD_PLACE.md'],
      { cwd: repo, encoding: 'utf8', maxBuffer: 1 << 28 });
    const hits = (r.stdout || '').split('\n').filter(Boolean);
    console.log(`  [${p}] ${hits.length} hit(s)${r.status > 1 ? ' ERROR ' + r.stderr : ''}`);
    for (const h of hits.slice(0, MAX)) console.log(`    ${h.length > 260 ? h.slice(0, 260) + '…' : h}`);
  }
}
