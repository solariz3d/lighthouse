const { spawnSync } = require('child_process'), path = require('path'), fs = require('fs');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'A D251 handle precision real window' });
const S = path.resolve(__dirname, '..');
const r = spawnSync(process.execPath, [path.join(__dirname, 'precision_window.js'), path.join(S, 'ui', 'target', 'debug', 't180-track-builder.exe'), path.join(__dirname, 'win')], { encoding: 'utf8', maxBuffer: 1 << 26 });
fs.writeFileSync(path.join(__dirname, 'win_out.txt'), `exit ${r.status}\n${r.stdout || ''}\n${r.stderr || ''}`);
console.log('exit', r.status);
