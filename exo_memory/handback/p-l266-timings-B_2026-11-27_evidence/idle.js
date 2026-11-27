// idle.js (pane B, L266): holds a heavy-run slot and does nothing, at idle priority, so sculpt-frame's timed rows see both slots held (their own rule). It looks for
// the done file every 2 s and exits when it appears, or after <max minutes> whatever happens.   usage: node idle.js <done file> <max minutes>
'use strict';
const fs = require('fs'), os = require('os');
try { os.setPriority(0, os.constants.priority.PRIORITY_LOW); } catch (e) { /* */ }
const [flag, maxMin] = process.argv.slice(2), t0 = Date.now();
const iv = setInterval(() => { if (fs.existsSync(flag) || Date.now() - t0 > Number(maxMin) * 60000) { clearInterval(iv); console.log(`idle.js: let go after ${Math.round((Date.now() - t0) / 1000)} s (${fs.existsSync(flag) ? 'done file' : 'max time'})`); process.exit(0); } }, 2000);
