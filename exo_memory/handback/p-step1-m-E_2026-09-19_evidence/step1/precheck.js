// precheck.js — the parts of score-step1.mjs that need no model: the positive-control cut, and R8f's version table.
// Helpers and the P2 lists are taken FROM THE FILE'S TEXT (not retyped), then run against git.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
const src = fs.readFileSync(path.join(REPO, 'dev/diversity/score-step1.mjs'), 'utf8');
const cut = (a, b) => { const i = src.indexOf(a), j = src.indexOf(b, i); if (i < 0 || j < 0) throw new Error('slice ' + a); return src.slice(i, j); };
const helpers = cut('function firstSectionBounds', 'const neg = await');
const lists = cut('const PACKETS = [', 'const finalPacket');
const RUN = '1e944ac';
const git = (sha, rel) => execFileSync('git', ['-C', REPO, 'show', `${sha}:${rel}`], { encoding: 'utf8', maxBuffer: 64 << 20 });
const gitTry = (sha, rel) => { try { return git(sha, rel); } catch { return null; } };
const parentOf = (sha) => execFileSync('git', ['-C', REPO, 'rev-parse', '--short', `${sha}^`], { encoding: 'utf8' }).trim();
const firstAdd = (rel) => execFileSync('git', ['-C', REPO, 'log', '--diff-filter=A', '--format=%h', '--', rel], { encoding: 'utf8' }).trim().split('\n').pop();
const { firstSectionRemoved, firstSectionLines, PACKETS, HB } = new Function('path', helpers + lists + '\nreturn { firstSectionRemoved, firstSectionLines, PACKETS, HB };')(path);

// 1. the generalised cut reproduces the committed P1 positive control on the leave packet @ed73e76
const ANCHOR = git('ed73e76', 'exo_memory/loop/packet_leave_window_2026-09-14.md');
const lines = ANCHOR.split('\n');
const s0 = lines.findIndex((l) => l.startsWith('## 0 ')), s1 = lines.findIndex((l) => l.startsWith('## 1 '));
const nearCopy = [...lines.slice(0, s0), ...lines.slice(s1)].join('\n');
console.log('P1 control reproduced by the general cut:', firstSectionRemoved(ANCHOR) === nearCopy, ' lines', firstSectionLines(ANCHOR), 'vs', `${s0 + 1}-${s1}`);

// 2. per row: parent, own packet present?, the removed section, other packets present at the parent
let n = 0, noOthers = [];
for (const own of PACKETS) {
  const ownName = path.basename(own, '.md');
  for (const hb of HB[ownName]) {
    const rel = `exo_memory/handback/${hb}.md`, add = firstAdd(rel), parent = parentOf(add);
    let ownText = gitTry(parent, own), where = 'parent';
    if (ownText == null) { ownText = git(add, own); where = 'FIRST-ADD (absent at parent)'; }
    const present = PACKETS.filter((p) => p !== own && gitTry(parent, p) != null).length;
    if (!present) noOthers.push(hb);
    n++;
    console.log(`${String(n).padStart(2)} ${hb.padEnd(34)} parent ${parent} own@${where.padEnd(6)} cut ${String(firstSectionLines(ownText)).padEnd(7)} others@parent ${present}/7  neg ${ownName === 'packet_harness_and_lib_2026-09-15' ? 'p-leave-E' : 'p-harness-E'}`);
  }
}
console.log(`\n${n} rows; no other packet at the parent: ${noOthers.length} — ${noOthers.join(', ')}`);
