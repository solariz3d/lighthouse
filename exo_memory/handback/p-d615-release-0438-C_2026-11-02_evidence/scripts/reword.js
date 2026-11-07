// reword.js: in the tree (cwd), reword lines not on b497c5d: the K-word, room phrases ("C's tube test", "pane X"/"Seat X", "the chair"); prints what it changed
// and, after, every remaining hit on a new line so a person decides the rest. Line endings kept.
'use strict';
const fs = require('fs'), cp = require('child_process');
const K = 'kee' + 'per';
const git = (a) => cp.execFileSync('git', a, { encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 28 });
const files = git(['diff', '--name-only', 'b497c5d']).trim().split('\n').filter(Boolean).concat(git(['ls-files', '--others', '--exclude-standard']).trim().split('\n').filter(Boolean));
const hit = new RegExp(K + '|\\bpane [A-Z]\\b|\\bseat\\b|chair|C\'s tube', 'i');
let tot = 0; const left = [];
for (const f of files) {
  if (!fs.existsSync(f) || /\.(kn5|png|exe|bin)$/.test(f)) continue;
  let oldTxt = ''; try { oldTxt = git(['show', 'b497c5d:' + f]); } catch (e) { /* new file */ }
  const old = new Set(oldTxt.split(/\r?\n/));
  const s = fs.readFileSync(f, 'utf8'), eol = s.includes('\r\n') ? '\r\n' : '\n';
  let n = 0;
  const out = s.split(eol).map((l, i) => { if (old.has(l)) return l;
    const r = l.replace(/C's tube test/g, 'the tube test').replace('"made_at": "pane A, ', '"made_at": "').replace(new RegExp('the ' + K, 'g'), 'the user').replace(new RegExp('The ' + K, 'g'), 'The user')
      .replace(new RegExp('\\b' + K + "'s\\b", 'g'), "the user's");
    if (r !== l) { n++; console.log('  ' + f + ':' + (i + 1) + ' reworded'); }
    if (hit.test(r)) left.push(f + ':' + (i + 1) + ': ' + r.trim().slice(0, 160));
    return r; });
  if (n) { fs.writeFileSync(f, out.join(eol)); tot += n; }
}
console.log('reworded ' + tot + ' line(s); remaining hits on new lines: ' + left.length);
for (const l of left) console.log('  LEFT ' + l);
