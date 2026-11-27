// read_t2.js (pane C, L259): run the room's copy of read_track.cjs (p-verify-B_2026-10-10 evidence, ff428) on the scratch copy of [T2],
// READ_PROFILE=1 as the skill's read.cjs does, no hints (the skill's defaults), and write the read to t2.read.json here. Local only.
'use strict';
const path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
const here = __dirname, t0 = Date.now();
const r = spawnSync(process.execPath, [path.join(here, 'tools', 'read_track.cjs'), path.join(here, 't2'), '0', '0'],
  { encoding: 'utf8', maxBuffer: 1 << 29, env: { ...process.env, READ_PROFILE: '1' } });
fs.writeFileSync(path.join(here, 't2.read.stderr.txt'), r.stderr || '');
if (r.status !== 0) { console.error('read_track exited', r.status); process.exit(r.status || 1); }
fs.writeFileSync(path.join(here, 't2.read.json'), r.stdout);
const j = JSON.parse(r.stdout);
console.log(`read: ${j.stations.length} stations, end ${JSON.stringify(j.end)}, ${((Date.now() - t0) / 1000).toFixed(1)} s`);
