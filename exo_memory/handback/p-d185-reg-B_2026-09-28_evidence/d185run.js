// D185 registration: run the two sealed generators under the heavy-run lock, 4096 MB.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane B: D185 registration generators (gen_tracks, water_theory)' });
const D = 'C:/Users/nname/Desktop/lighthouse/exo_memory/loop/d185';
for (const s of ['gen_tracks', 'water_theory']) {
  const r = spawnSync(process.execPath, ['--max-old-space-size=4096', path.join(D, s + '.js')], { encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.status !== 0) { console.error(s, 'FAILED', r.stderr); process.exit(1); }
  fs.writeFileSync(path.join(D, s + '.json'), r.stdout); console.log(s, 'ok', r.stdout.length, 'bytes');
}
