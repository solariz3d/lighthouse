'use strict';
// D434 (O): shot-closer.js for each closer document, one after another, under the heavy-run lock (a browser). node shots-locked.js
const path = require('path'), { spawnSync } = require('child_process');
const HR = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
HR.hold({ cmd: 't180 O D434 headless shots of the closer (chrome, muted)', maxWaitMs: 60 * 60 * 1000 });
for (const doc of (process.argv[2] || 'before,bank75,bank100').split(',')) {   // the documents to shoot, from tracks/shots-input/
  const r = spawnSync(process.execPath, [path.join(__dirname, 'shot-closer.js'), '24450,26100,26700', doc], { encoding: 'utf8', windowsHide: true, timeout: 15 * 60 * 1000 });
  console.log(`== ${doc} exit ${r.status}\n${(r.stdout || '').trim()}\n${(r.stderr || '').trim().slice(-400)}`);
}
