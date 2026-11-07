// wvrun.js <steps> <build>...: holds a heavy-run slot, then for each build (old, stub, new under G:\...\builds) runs wv583.js (C's D583 harness: the app on
// its own hidden desktop, windows on the user's desktop enumerated and required to be 0, every isolate's JS heap each second) on a copy of his ELYSIUM, one
// at a time, acs.exe checked before each. Each run's work folder and log go to G:\Consonance-tools\scratch-A-d614\wv-<build>.
'use strict';
require('./winhide.js');
const fs = require('fs'), path = require('path'), cp = require('child_process');
const [, , STEPS, ...BUILDS] = process.argv, G = 'G:/Consonance-tools/scratch-A-d614';
const acs = () => /acs\.exe/i.test(cp.execFileSync('tasklist', ['/FI', 'IMAGENAME eq acs.exe', '/NH'], { encoding: 'utf8' }));
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'A D614 the built app on ELYSIUM, hidden desktop, heap per isolate (not a timing session)' });
for (const b of BUILDS) {
  if (acs()) { console.log(`${b}: acs.exe is running, not started`); continue; }
  const W = path.join(G, `wv-${b}`); fs.rmSync(W, { recursive: true, force: true }); fs.mkdirSync(W, { recursive: true });
  const track = path.join(W, 'eq-ELYSIUM.t180track'); fs.copyFileSync('G:/Consonance-tools/scratch-A-d609/his/elysium.t180track', track);
  const t0 = Date.now();
  const r = cp.spawnSync(process.execPath, [path.join(__dirname, 'wv583.js'), path.join(G, 'builds', b, 't180-track-builder.exe'), W, track, STEPS], { encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 26, timeout: 50 * 60 * 1000 });
  fs.writeFileSync(path.join(G, `wv-${b}.log`), (r.stdout || '') + (r.stderr || ''));
  console.log(`== ${b}: exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
  console.log((r.stdout || '').split('\n').filter((l) => !/^  [0-9]|open loop/.test(l)).join('\n').slice(0, 4000));
}
