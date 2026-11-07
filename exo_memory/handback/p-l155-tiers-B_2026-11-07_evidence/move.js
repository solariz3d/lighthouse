// L156 mover: node move.js <worktree>. Cuts the named rows out of each timing file (verbatim) into a new file that is the timing file minus its timed rows.
const fs = require('fs'), path = require('path'), blocks = require('./blocks.js');
const W = process.argv[2];
const PLAN = [
  ['sculpt-frame', 'sculpt-release-exact', [/^row 5:/], 'row 5 (the release is the exact road, bit for bit the shell\'s sculptOnce)'],
  ['drag-frame', 'drag-release-exact', [/^row 5:/], 'row 5 (the release is the exact road: a station every 2 m the moment it is let go)'],
  ['release-frame', 'release-ghost-arrives', [/^row 3:/], 'row 3 (the exact ghost arrives and nothing blinks)'],
  ['preview-lod-frame', 'preview-lod-share', [/^row 3:/], 'row 3 (the preview draws at most 40% of the full mesh\'s triangles)'],
  ['core-extra-bank-drag-cost', 'core-extra-bank-laid', [/laid by the core$/, /^D642 3j:/], 'the two "laid by the core" rows (his p2\'s extra bank reaches −88.45° from 500; 3j, every from the panel keeps is laid)'],
];
for (const [src, dst, pats, what] of PLAN) {
  const sf = path.join(W, 'app/test', `${src}.test.js`), df = path.join(W, 'app/test', `${dst}.test.js`);
  const raw = fs.readFileSync(sf, 'utf8'), lines = raw.replace(/\r\n/g, '\n').split('\n');
  const bs = blocks(lines), move = bs.filter((b) => pats.some((p) => p.test(b.title)));
  if (move.length !== pats.length) throw new Error(`${src}: matched ${move.length} rows for ${pats.length} patterns: ${bs.map((b) => b.title.slice(0, 40)).join(' | ')}`);
  const keep = bs.filter((b) => !move.includes(b));
  const drop = (set) => { const gone = new Set(); for (const b of set) for (let k = b.start; k <= b.end; k++) gone.add(k); return lines.filter((_, k) => !gone.has(k)); };
  const squeeze = (ls) => ls.filter((l, k) => !(l === '' && ls[k - 1] === ''));   // one blank where a cut left two
  const srcOut = squeeze(drop(move)), dstOut = squeeze(drop(keep));
  srcOut.splice(1, 0, `// L156: ${what} moved VERBATIM to app/test/${dst}.test.js, so test-fast runs it: it times nothing. This file keeps only timing rows.`);
  dstOut.unshift(`// ${dst}.test.js: node --test app/test/${dst}.test.js`,
    `// L156 (pane E's proof, p-l155-proof-E: a correctness row inside a timing file ran only where timing runs, and a real red, #40, went unseen): ${what},`,
    `// moved VERBATIM out of app/test/${src}.test.js, a timing file test-fast leaves out, so test-fast runs it. Below this header is ${src}.test.js as it stood at 7f4241b with its`,
    `// timed rows taken out: the harness is copied unchanged (its timing helpers and constants included, some now unused) so the move can be checked line for line.`);
  fs.writeFileSync(sf, srcOut.join('\r\n')); fs.writeFileSync(df, dstOut.join('\r\n'));
  console.log(`${src}: moved ${move.map((b) => b.title.slice(0, 50)).join(' | ')} → ${dst}; kept ${keep.length} rows`);
}
