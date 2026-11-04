// vfy0419.js: D456 part 1, the checks on the reword, read-only. Reads the sha-map rw0419.js wrote.
//   node vfy0419.js <sha-map> [tip-to-diff]     (tip-to-diff defaults to the map's new tip; pass another to run the
//                                                tip-diff filter on it, e.g. a planted bad commit, the negative control)
// 1 topology: every new commit's parents are the old commit's parents, mapped
// 2 every commit object minus tree/parent lines and its message is byte-identical (author, committer, dates)
// 3 messages: only keeper lines differ, each new line = reword(old line)
// 4 per commit, the trees differ only in blobs whose differing lines are keeper lines reworded, same line count
// 5 the tip diff c965f5e..tip: changed lines, the comment-and-doc filter, and what survives it
'use strict';
const fs = require('fs'), os = require('os'), { spawnSync } = require('child_process');
try { os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (_) {}
const { reword } = require('./rw0419.js');
const repo = 'C:/Users/nname/Downloads/t180-track-builder';
const run = (args) => { const r = spawnSync('git', ['-C', repo, '--no-optional-locks', ...args], { maxBuffer: 1 << 30, windowsHide: true }); if (r.status !== 0) throw new Error(`git ${args.join(' ')}: ${r.stderr}`); return r.stdout.toString('latin1'); };
const KEEPER = /keeper/i;
const rows = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter((l) => /^[0-9a-f]{40} /.test(l)).map((l) => l.split(' '));
const map = new Map(rows.map(([o, n]) => [o, n]));
const oldTip = rows[rows.length - 1][0], newTip = rows[rows.length - 1][1];
const diffTip = process.argv[3] || newTip;
let fail = 0; const chk = (ok, m) => { if (!ok) { fail++; console.log('FAIL', m); } };
const split = (raw) => { const cut = raw.indexOf('\n\n'); return { head: raw.slice(0, cut).split('\n'), body: raw.slice(cut + 2) }; };
const lineDiffOk = (a, b) => { const x = a.split('\n'), y = b.split('\n'); if (x.length !== y.length) return `line count ${x.length} -> ${y.length}`; for (let i = 0; i < x.length; i++) if (x[i] !== y[i] && !(KEEPER.test(x[i]) && reword(x[i]) === y[i])) return `line ${i + 1}`; return null; };

let msgLines = 0, blobPairs = 0;
if (diffTip === newTip) {
  for (const [o, n] of rows) {
    const A = split(run(['cat-file', 'commit', o])), B = split(run(['cat-file', 'commit', n]));
    const pa = A.head.filter((l) => l.startsWith('parent ')).map((l) => l.slice(7)), pb = B.head.filter((l) => l.startsWith('parent ')).map((l) => l.slice(7));
    chk(JSON.stringify(pa.map((p) => map.get(p) || p)) === JSON.stringify(pb), `${o.slice(0, 8)} parents`);
    const strip = (h) => h.filter((l) => !/^(tree|parent) /.test(l)).join('\n');
    chk(strip(A.head) === strip(B.head), `${o.slice(0, 8)} author/committer/dates`);
    const md = lineDiffOk(A.body, B.body); chk(!md, `${o.slice(0, 8)} message ${md}`);
    msgLines += A.body.split('\n').filter((l, i) => l !== B.body.split('\n')[i]).length;
    const d = run(['diff-tree', '-r', '--no-renames', `${o}^{tree}`, `${n}^{tree}`]).trim();
    for (const l of d ? d.split('\n') : []) {
      const m = l.match(/^:(\d+) (\d+) ([0-9a-f]+) ([0-9a-f]+) (\w)\t(.*)$/);
      if (!m || m[5] !== 'M' || m[1] !== m[2]) { chk(false, `${o.slice(0, 8)} tree entry ${l}`); continue; }
      blobPairs++;
      const bd = lineDiffOk(run(['cat-file', 'blob', m[3]]), run(['cat-file', 'blob', m[4]])); chk(!bd, `${o.slice(0, 8)} ${m[6]} ${bd}`);
    }
  }
  console.log(`1-4: ${rows.length} commits checked; message lines changed ${msgLines}; blob pairs checked ${blobPairs}`);
}

// 5 the tip diff, and the comment-and-doc filter
const patch = run(['diff', '--no-color', '--no-renames', '-U0', oldTip, diffTip]);
let file = null, minus = [], plus = []; const pairs = [];
const flush = () => { for (let i = 0; i < Math.max(minus.length, plus.length); i++) pairs.push({ file, a: minus[i], b: plus[i] }); minus = []; plus = []; };
for (const l of patch.split('\n')) {
  if (l.startsWith('diff --git')) { flush(); continue; }
  if (l.startsWith('+++ ')) { file = l.slice(6); continue; }
  if (l.startsWith('--- ') || l.startsWith('index ')) continue;
  if (l.startsWith('@@')) { flush(); continue; }
  if (l.startsWith('-')) minus.push(l.slice(1)); else if (l.startsWith('+')) plus.push(l.slice(1));
}
flush();
const files = new Set(pairs.map((p) => p.file));
// what is left of a line once its comment is dropped: .md is all doc; a .js line that is a comment line ("//", "/*", "*") is
// nothing; otherwise the text before a trailing "//" comment (a "//" that sits outside any quote)
const code = (f, l) => {
  if (l === undefined) return '\u0000missing';
  if (/\.md$/.test(f)) return '';
  if (/^\s*(\/\/|\/\*|\*)/.test(l)) return '';
  let q = null;
  for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '\\') i++; else if (c === q) q = null; } else if (c === "'" || c === '"' || c === '`') q = c; else if (c === '/' && l[i + 1] === '/') return l.slice(0, i); }
  return l;
};
const left = pairs.filter((p) => code(p.file, p.a) !== code(p.file, p.b));
console.log(`5: git diff ${oldTip.slice(0, 7)} ${diffTip.slice(0, 7)}: ${files.size} files, ${pairs.length} changed line pairs (${pairs.filter((p) => /\.md$/.test(p.file)).length} in .md, ${pairs.filter((p) => !/\.md$/.test(p.file)).length} in code files)`);
console.log(`   every pair a keeper line reworded: ${pairs.every((p) => p.a !== undefined && p.b !== undefined && KEEPER.test(p.a) && reword(p.a) === p.b)}`);
console.log(`   left after dropping comment and doc lines: ${left.length}`);
for (const p of left) console.log(`   LEFT ${p.file}\n     - ${p.a}\n     + ${p.b}`);
console.log(fail ? `CHECKS FAILED: ${fail}` : 'ALL CHECKS PASS (1-4)');
process.exit(fail ? 1 : 0);
