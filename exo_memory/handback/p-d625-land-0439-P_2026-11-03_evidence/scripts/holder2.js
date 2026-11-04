// holder2.js <parentPid> <cmd> <readyFile> <stopFile>: hold the OTHER heavy-run slot for the parent's run, so no heavy run anywhere runs beside it
// (the order: one heavy run on the machine, memory ran low earlier). Runs from a cwd outside git (its own tree bucket). Releases on stop, or when the parent is gone.
'use strict';
const fs = require('fs');
const [ppid, cmd, ready, stop] = process.argv.slice(2);
const h = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd });
fs.writeFileSync(ready, JSON.stringify({ pid: process.pid, slot: h.slot, file: h.file, at: new Date().toISOString() }));
const alive = (p) => { try { process.kill(p, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
setInterval(() => { if (fs.existsSync(stop) || !alive(Number(ppid))) process.exit(0); }, 2000);
