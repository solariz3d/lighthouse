'use strict';
// D421 shell cut (O): shellprof.js on rows 2, 3, 4a and 4b of one tree, each in a fresh process, with BOTH heavy-run slots held (a timed row). One JSON line per row.
//   node shellrun.js <tree> <out.jsonl> [label]
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const HR = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const [TREE, OUT, LABEL = 'shell rows'] = process.argv.slice(2), WAIT = 2 * 60 * 60 * 1000;
HR.hold({ cmd: `t180 O D421 shell cut: ${LABEL} (timed, node)`, maxWaitMs: WAIT });
const env2 = { ...process.env }; delete env2[HR.TOKEN_ENV];
const h2 = HR.acquire({ cmd: `t180 O D421 shell cut: ${LABEL} (second slot)`, env: env2, tree: HR.NON_GIT_TREE, maxWaitMs: WAIT });
process.on('exit', () => h2.release());
const lines = [];
for (const row of ['2', '3', '4a', '4b']) {
  const r = spawnSync(process.execPath, [path.join(__dirname, 'shellprof.js'), TREE, row], { encoding: 'utf8', windowsHide: true });
  if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
  lines.push(r.stdout.trim()); console.log(r.stdout.trim());
}
fs.writeFileSync(OUT, lines.join('\n') + '\n');
