// cost623.js: a heavy-run slot, BelowNormal, then cost617.js with the given arguments (hidden; its output to stdout)
'use strict';
require('./winhide.js');
const cp = require('child_process'), path = require('path');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'A D617 export cost on his track copies (t180 d617-a), hidden, BelowNormal; not a timing session' });
if (/acs\.exe/i.test(cp.execFileSync('tasklist', ['/FI', 'IMAGENAME eq acs.exe', '/NH'], { encoding: 'utf8', windowsHide: true }))) { console.log('acs.exe up: not started'); process.exit(2); }
const ch = cp.spawn(process.execPath, ['--max-old-space-size=8192', path.join(__dirname, 'cost617.js'), ...process.argv.slice(2)], { stdio: 'inherit', windowsHide: true });
try { cp.execFileSync('powershell', ['-NoProfile', '-Command', `(Get-Process -Id ${ch.pid}).PriorityClass = 'BelowNormal'`], { windowsHide: true }); } catch {}
ch.on('exit', (c) => process.exit(c));
