'use strict';
// heavy-suite.js (pane E): the t180 FULL suite under the heavy-run lock (the chair's 16:5x rule, after "WHY IS CONSONANCE
// SO LAGGY": one full-suite run at a time, every node --test at --test-concurrency=4).
//   node heavy-suite.js [out.tap]      waits for the lock (heavy-run.js: polls, fails loudly after 30 min), then runs
//                                      test/*.test.js and app/test/*.test.js, TAP to out.tap, and prints the counts
const fs = require('fs');
const { spawnSync } = require('child_process');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E: t180 full suite (test + app/test)' });
const REPO = 'C:/Users/nname/Desktop/t180-track-builder', out = process.argv[2];
const counts = (tap) => ['tests', 'pass', 'fail', 'todo'].map((k) => { const m = tap.match(new RegExp(`^# ${k} (\\d+)$`, 'm')); return `${k} ${m ? m[1] : '?'}`; }).join(' · ');
let status = 0;
for (const glob of ['test/*.test.js', 'app/test/*.test.js']) {
  const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', '--test-reporter=tap', glob], { cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 28 });
  const tap = (r.stdout || '') + (r.stderr || '');
  if (out) fs.writeFileSync(`${out}.${glob.startsWith('app') ? 'app' : 'repo'}.tap`, tap);
  const fails = tap.split('\n').filter((l) => /^not ok/.test(l) && !/# TODO/.test(l));
  console.log(`${glob}: ${counts(tap)}${fails.length ? `\n  ${fails.join('\n  ')}` : ''}`);
  if (r.status) status = r.status;
}
process.exit(status);
