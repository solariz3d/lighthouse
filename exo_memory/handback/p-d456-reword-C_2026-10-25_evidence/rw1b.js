// rw1b.js (C, D456 part 1b): reword every remaining "keeper" in the pub-0.4.19 working tree to "the user", in place, byte-safe
// (read and written as latin1, so CRLF and UTF-8 bytes pass through untouched). The two STOP sites are left as they are:
// a code identifier and a string the app shows. Prints per-file counts; refuses a line no rule clears.
//   node rw1b.js <worktree>
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const wt = process.argv[2];
const RULES = [
  [/\bthe keeper's\b/g, "the user's"], [/\bThe keeper's\b/g, "The user's"], [/\bTHE KEEPER'S\b/g, "THE USER'S"],
  [/\bthe keeper(?=\\'s|\\x27s)/g, 'the user'],                    // inside a quoted string: the keeper\'s, the keeper\x27s
  [/\bthe keeper\b/g, 'the user'], [/\bThe keeper\b/g, 'The user'], [/\bTHE KEEPER\b/g, 'THE USER'],
  [/\(keeper\b/g, '(the user'],                                     // "(keeper, 2026-09-27)", "(keeper: …"
  [/\bkeeper(?![A-Za-z])/g, 'user'],                                // a line wrapped after "the", "No keeper track", 'keeper' as test data, keeper-note.txt
];
const reword = (l) => { let o = l; for (const [re, to] of RULES) o = o.replace(re, to); return o; };
// STOP: [path, a substring that marks the line]; these lines are not touched and are listed for the librarian
const STOP = [['src/validate/index.js', "'landing-misses-zone':"], ['test/core_tube_open.test.js', 'keeperTrack']];
const isStop = (f, l) => STOP.some(([p, s]) => p === f && l.includes(s));
const files = spawnSync('git', ['-C', wt, 'grep', '-l', '-i', 'keeper'], { encoding: 'utf8' }).stdout.split(/\r?\n/).filter(Boolean);
let lines = 0, stopped = 0, bad = 0;
for (const f of files) {
  const p = path.join(wt, f), src = fs.readFileSync(p).toString('latin1');
  let n = 0;
  const out = src.split('\n').map((l) => {
    if (!/keeper/i.test(l)) return l;
    if (isStop(f, l)) { stopped++; console.log(`STOP ${f}: ${l.trim().slice(0, 140)}`); return l; }
    const o = reword(l);
    if (/keeper/i.test(o)) { bad++; console.log(`NO RULE ${f}: ${l.trim().slice(0, 160)}`); return l; }
    n++; return o;
  }).join('\n');
  if (n) { fs.writeFileSync(p, Buffer.from(out, 'latin1')); lines += n; }
}
console.log(`files ${files.length}; lines reworded ${lines}; stopped ${stopped}; with no rule ${bad}`);
module.exports = { reword, RULES };
process.exit(bad ? 1 : 0);
