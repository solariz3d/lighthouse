// L156 move check: node check.js <worktree>. Against git show 7f4241b:<timing file>: (1) each moved block is byte-equal, once, in the new file and absent from the
// timing file; (2) every line of each output, less the L156 header lines, is the original's in the original's order (nothing rewritten, only cut); (3) every assert line of
// the original is in exactly one of the two outputs; (4) the titles each timing file keeps.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process'), blocks = require('./blocks.js');
const W = process.argv[2];
const PAIRS = [['sculpt-frame', 'sculpt-release-exact'], ['drag-frame', 'drag-release-exact'], ['release-frame', 'release-ghost-arrives'], ['preview-lod-frame', 'preview-lod-share'], ['core-extra-bank-drag-cost', 'core-extra-bank-laid']];
const rd = (f) => fs.readFileSync(path.join(W, f), 'utf8').replace(/\r\n/g, '\n').split('\n');
const subseq = (a, b) => { let j = 0; for (const l of a) { while (j < b.length && b[j] !== l) j++; if (j === b.length) return l; j++; } return null; };
let bad = 0;
for (const [src, dst] of PAIRS) {
  const sp = `app/test/${src}.test.js`, dp = `app/test/${dst}.test.js`;
  const orig = execFileSync('git', ['show', `7f4241b:${sp}`], { cwd: W, encoding: 'utf8' }).replace(/\r\n/g, '\n').split('\n');
  const s = rd(sp), d = rd(dp);
  // the one declared amendment: preview-lod-frame row 4 gets row 3's overhead line (and a comment), since row 3 had put the camera there
  const ADDED = src === 'preview-lod-frame' ? ['// AMENDED (L156): row 3 moved', "  await ev(\"document.dispatchEvent(new CustomEvent('t180-camera', { detail: { mode: 'overhead' } }));"] : [];
  const added = s.filter((l) => ADDED.some((a) => l.startsWith(a)));
  if (added.length) console.log(`${sp}: declared added lines (${added.length}): ${added.map((l) => l.trim().slice(0, 90)).join(' | ')}`);
  const sBody = s.filter((l) => !l.startsWith('// L156:') && !added.includes(l)), dBody = d.slice(4);
  const ob = blocks(orig), db = blocks(d), sb = blocks(s);
  const text = (ls, b) => ls.slice(b.start, b.end + 1).join('\n');
  const dTexts = db.map((b) => text(d, b));
  for (const b of db) {
    const t = text(d, b), inOrig = ob.filter((o) => text(orig, o) === t).length, inSrc = s.join('\n').includes(t);
    console.log(`${dst}: "${b.title.slice(0, 60)}" byte-equal in 7f4241b:${src}: ${inOrig === 1 ? 'yes' : 'NO'} (${t.split('\n').length} lines); still in ${src}: ${inSrc ? 'YES' : 'no'}`);
    if (inOrig !== 1 || inSrc) bad++;
  }
  for (const [name, body] of [[sp, sBody], [dp, dBody]]) { const miss = subseq(body, orig); console.log(`${name}: every line is 7f4241b's, in order: ${miss === null ? 'yes' : `NO, first foreign line: ${miss}`}`); if (miss !== null) bad++; }
  // assert lines inside test rows; the harness's own helper asserts are copied to both files by design (check 2 covers them)
  const asserts = (ls) => { const bs = blocks(ls); return ls.filter((l, k) => /\bassert\./.test(l) && bs.some((b) => k >= b.start && k <= b.end)); };
  const oa = asserts(orig), sa = asserts(s), da = asserts(d);
  const lost = oa.filter((l) => (sa.filter((x) => x === l).length + da.filter((x) => x === l).length) < oa.filter((x) => x === l).length);
  const both = oa.filter((l) => sa.includes(l) && da.includes(l));
  console.log(`${src}: assert lines 7f4241b ${oa.length} = kept ${sa.length} + moved ${da.length}; lost ${lost.length}; in both ${both.length}${both.length ? ' (' + [...new Set(both)].map((x) => x.trim().slice(0, 50)).join(' | ') + ')' : ''}`);
  if (lost.length || oa.length !== sa.length + da.length) bad++;
  console.log(`${src} keeps: ${sb.map((b) => b.title.slice(0, 110)).join('\n    ') ? '\n    ' + sb.map((b) => b.title.slice(0, 110)).join('\n    ') : '(none)'}`);
}
console.log(bad ? `FAILED: ${bad}` : 'ALL CHECKS PASS'); process.exit(bad ? 1 : 0);
