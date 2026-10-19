// second.js: holds the heavy-run lock's other slot (the "not in a git tree" bucket) for a timing session, until its parent ends
process.chdir(require('os').tmpdir());
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 't180 A D404 timing session (second slot)' });
console.log('HELD');
const ppid = process.ppid; setInterval(() => { try { process.kill(ppid, 0); } catch (e) { process.exit(0); } }, 2000);
