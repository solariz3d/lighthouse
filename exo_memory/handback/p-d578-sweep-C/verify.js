// verify.js <repo> <baseRev> <dir>: for every .js file under <dir> that differs between <baseRev> and the working tree, the comment-stripped code
// (jsscan.strip) before and after, compared byte for byte. Prints one line per file: EQUAL or DIFFERS (and the first differing code line), and a total.
// --control: first proves the check on each file: a one-character code change in a copy must read DIFFERS, a comment-only change EQUAL.
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process'), crypto = require('crypto');
const { strip, comments } = require('./jsscan.js');
const [, , repo, base, dir, flag] = process.argv;
const git = (...a) => execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', maxBuffer: 1 << 28 });
const files = git('diff', '--name-only', base, '--', dir).trim().split('\n').filter((f) => f.endsWith('.js'));
let equal = 0, differ = 0, ctrlBad = 0;
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
for (const f of files) {
  const before = git('show', `${base}:${f}`), after = fs.readFileSync(path.join(repo, f), 'utf8');
  const a = strip(before), b = strip(after);
  if (a === b) { equal++; console.log(`EQUAL    ${f}  code ${sha(a)}  comments ${comments(before).length} -> ${comments(after).length}`); }
  else { differ++; const la = a.split('\n'), lb = b.split('\n'); let k = 0; while (la[k] === lb[k]) k++; console.log(`DIFFERS  ${f}  first at code line ${k + 1}:\n   - ${la[k]}\n   + ${lb[k]}`); }
  if (flag === '--control') {
    // a code change: the first code character that is a digit or a letter after the first comment, nudged; a comment change: one letter in the first comment
    const cs = comments(after), c0 = cs[0];
    const codeAt = (() => { let s = 0; for (const c of cs) { for (let j = s; j < c.start; j++) if (/[A-Za-z0-9]/.test(after[j])) return j; s = c.end; } for (let j = s; j < after.length; j++) if (/[A-Za-z0-9]/.test(after[j])) return j; return -1; })();
    const mut = after.slice(0, codeAt) + (after[codeAt] === 'x' ? 'y' : 'x') + after.slice(codeAt + 1);
    const cmt = c0 ? after.slice(0, c0.end - 1) + (after[c0.end - 1] === 'q' ? 'r' : 'q') + after.slice(c0.end) : null;
    const okCode = strip(mut) !== b, okCmt = cmt === null || strip(cmt) === b;
    if (!okCode || !okCmt) ctrlBad++;
    console.log(`   control: code change ${okCode ? 'DIFFERS (seen)' : 'NOT SEEN'}; comment change ${okCmt ? 'EQUAL' : 'DIFFERS (wrong)'}`);
  }
}
console.log(`${dir}: ${files.length} changed .js file(s): EQUAL ${equal}, DIFFERS ${differ}${flag === '--control' ? `; controls failing ${ctrlBad}` : ''}`);
process.exit(differ || ctrlBad ? 1 : 0);
