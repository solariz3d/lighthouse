// second.js: holds the heavy-run lock's other slot (the "not in a git tree" bucket) for a timing session.
// It lives exactly as long as its parent AND removes its lock file when it goes: it exits (so heavy-run.js's exit handler deletes the file) the moment its stdin closes, which a parent
// that ends, is killed, or crashes does by the operating system; a parent that wants it gone calls sec.stdin.end() and waits for its 'exit'. (Before, the parent called sec.kill():
// on Windows a hard kill runs no exit handler, and the slot's file outlived its holder: B, C and E each took it over as stale.)
process.chdir(require('os').tmpdir());
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 't180 A D407 timing session (second slot)' });
console.log('HELD');
const go = () => process.exit(0);
process.stdin.on('end', go); process.stdin.on('close', go); process.stdin.on('error', go); process.stdin.resume();
const ppid = process.ppid; setInterval(() => { try { process.kill(ppid, 0); } catch (e) { go(); } }, 2000);   // and the old check, for a parent whose pipe somehow stays open
