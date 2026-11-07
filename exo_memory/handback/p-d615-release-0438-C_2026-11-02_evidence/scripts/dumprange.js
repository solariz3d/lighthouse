// dumprange.js <from> <to> <outdir>: for each commit of from..to, its message and the lines its own diff adds; then the net diff's added lines.
// Prints counts, and credential-prefix hits (patterns built split, counts only). Run in the tree.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const [, , A, B, OUT] = process.argv;
const git = (a) => cp.execFileSync('git', a, { encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 30 });
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const added = (patch) => patch.split('\n').filter((l) => l.startsWith('+') && !l.startsWith('+++')).map((l) => l.slice(1)).join('\n');
const shas = git(['rev-list', '--reverse', `${A}..${B}`]).trim().split('\n');
let addN = 0;
shas.forEach((s, i) => {
  fs.writeFileSync(path.join(OUT, `msg-${i + 1}-${s.slice(0, 7)}.txt`), git(['log', '-1', '--format=%B', s]));
  const a = added(git(['show', '--format=', '--no-color', '--text', s])); addN += a ? a.split('\n').length : 0;
  fs.writeFileSync(path.join(OUT, `added-${i + 1}-${s.slice(0, 7)}.txt`), a);
});
const net = added(git(['diff', '--no-color', '--text', A, B]));
fs.writeFileSync(path.join(OUT, 'net-added.txt'), net);
const stat = git(['diff', '--shortstat', A, B]).trim();
console.log(`${shas.length} commits; ${addN} lines added across the commits' own diffs; net: ${stat}`);
const P = [['gh', 'p_'], ['github', '_pat_'], ['sk', '-ant-'], ['AK', 'IA'], ['xox', 'b-'], ['-----BEGIN ', 'PRIVATE'], ['AI', 'za']].map((x) => x.join(''));
for (const f of fs.readdirSync(OUT)) {
  const t = fs.readFileSync(path.join(OUT, f), 'utf8'); const n = P.map((p) => t.split(p).length - 1);
  if (n.some((x) => x)) console.log(`  credential prefix hits in ${f}: ${n.join('/')}`);
}
console.log('credential prefixes checked: ' + P.length + ' patterns over ' + fs.readdirSync(OUT).length + ' files');
