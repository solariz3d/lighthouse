'use strict';
// D438 build (O), from D434's: shot-closer.js for each closer document at its own stations, one after another, under the heavy-run lock (a browser, headless,
// --mute-audio).   node shots-locked.js <doc>=<s>,<s>,... [<doc>=...]   (docs from tracks/shots-input/, private)
const path = require('path'), { spawnSync } = require('child_process');
const HR = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
HR.hold({ cmd: 't180 O D438 headless shots of the closer joints and seam (chrome, muted)', maxWaitMs: 60 * 60 * 1000 });
for (const arg of process.argv.slice(2)) {
  const [doc, stations] = arg.split('=');
  const r = spawnSync(process.execPath, [path.join(__dirname, 'shot-closer.js'), stations, doc], { encoding: 'utf8', windowsHide: true, timeout: 15 * 60 * 1000 });
  console.log(`== ${doc} at ${stations}: exit ${r.status}\n${(r.stdout || '').trim()}\n${(r.stderr || '').trim().slice(-400)}`);
}
