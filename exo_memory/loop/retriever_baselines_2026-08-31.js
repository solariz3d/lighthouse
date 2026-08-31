#!/usr/bin/env node
// retriever_baselines_2026-08-31.js -- FREEZE B-POP and B-REC for the relevance retriever
// (relevance_retriever_registration_2026-08-30.md, R3) at a pinned sha, BEFORE any label exists.
//
// Written by pane E (P-LABELS, L019). Not the retriever. Reads the repo only through `git show`
// at the pinned sha, so the output is re-derivable on any machine holding the commit:
//
//     node exo_memory/loop/retriever_baselines_2026-08-31.js <sha>
//
// THE CORPUS is exactly what corpus_shelf() (consonance/src-tauri/src/main.rs) walks -- the ten
// (dir, carry) entries, root non-recursive, named dirs recursive, attic/ excluded, .md only --
// plus BOOT.md, which the shelf skips only because librarian_intake() carries it separately. The
// retriever indexes what a seat can reach; BOOT is reachable. Tier = the shelf's carry flag
// (SYSTEM carried / RECORD indexed). Every choice the registration leaves open is stated here as
// a RULE, never as a number.
//
// B-POP  "the three corpus files most frequently cited across the corpus, ignoring the turn".
//        A corpus file G cites corpus file F (G != F) when G's bytes contain any of:
//          (a) F's path relative to exo_memory, forward or back slashes   e.g. journal/2026-08-16.md
//          (b) F's basename, IF that basename is unique across the corpus  e.g. earned-not-performed.md
//              (root files are excluded from (b): their basename IS their path, already (a))
//          (c) [[stem]] wikilink of F's stem, IF that stem is unique         e.g. [[earned-not-performed]]
//        Ranked by DF (distinct citing files), tie -> total occurrences, tie -> path. DF, not
//        occurrences, so one file quoting a path forty times counts once.
// B-REC  "the three most recently modified corpus files": last commit touching the path at or before
//        the pinned sha (git log -1 --format=%ct <sha> -- path). Commit time, not mtime, because mtime
//        differs per checkout. Tie -> path.
'use strict';
const { execFileSync } = require('child_process');
const crypto = require('crypto');
const sha = process.argv[2];
if (!sha) { console.error('usage: node retriever_baselines_2026-08-31.js <sha>'); process.exit(2); }
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 28 });
const full = git('rev-parse', sha).trim();
const order = [['', false, true], ['cards', false, true], ['record', false, true], ['memory', false, true],
  ['librarian', true, true], ['spread', false, true], ['research', false, true],
  ['map', false, false], ['journal', true, false], ['loop', true, false]];
const tree = git('ls-tree', '-r', '--name-only', full, 'exo_memory/').split('\n').filter(Boolean);
const rel = p => p.replace(/^exo_memory\//, '');
const files = []; // {path (rel), tier}
for (const [dir, , carry] of order) {
  for (const p of tree) {
    const r = rel(p);
    if (!r.endsWith('.md')) continue;
    if (r.split('/').includes('attic')) continue;
    const parts = r.split('/');
    if (dir === '') { if (parts.length !== 1) continue; }
    else { if (parts[0] !== dir || parts.length < 2) continue; }
    files.push({ path: r, tier: carry ? 'SYSTEM(carried)' : 'RECORD(indexed)' });
  }
}
const bodies = new Map();
for (const f of files) bodies.set(f.path, git('show', `${full}:exo_memory/${f.path}`));
const base = f => f.split('/').pop();
const stem = f => base(f).replace(/\.md$/, '');
const count = (arr, k) => arr.filter(x => x === k).length;
const bases = files.map(f => base(f.path)), stems = files.map(f => stem(f.path));
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pop = [];
for (const f of files) {
  // (a) must not be preceded by a path character: first run (pre-label, 2026-08-31 01:2x) ranked root
  // README.md #3 because the bare path matched inside `librarian/README.md` and `tools/README.md`.
  // Rule corrected before any label existed; the first run's output was not kept.
  const pats = [new RegExp('(?<![\\w/\\\\-])' + esc(f.path).split('/').map(esc0 => esc0).join('[\\\\/]'), 'g')];
  if (count(bases, base(f.path)) === 1 && f.path.includes('/')) {
    pats.push(new RegExp('(?<![\\w/\\\\-])' + esc(base(f.path)), 'g'));
  }
  if (count(stems, stem(f.path)) === 1) pats.push(new RegExp('\\[\\[' + esc(stem(f.path)) + '\\]\\]', 'g'));
  let df = 0, occ = 0;
  for (const g of files) {
    if (g.path === f.path) continue;
    const b = bodies.get(g.path); let n = 0;
    for (const re of pats) n += (b.match(re) || []).length;
    if (n) { df++; occ += n; }
  }
  pop.push({ path: f.path, tier: f.tier, df, occ });
}
pop.sort((a, b) => b.df - a.df || b.occ - a.occ || a.path.localeCompare(b.path));
const rec = files.map(f => ({ path: f.path, tier: f.tier,
  ct: Number(git('log', '-1', '--format=%ct', full, '--', `exo_memory/${f.path}`).trim() || 0) }));
rec.sort((a, b) => b.ct - a.ct || a.path.localeCompare(b.path));
const tierTable = files.map(f => `${f.path}\t${f.tier}`).sort().join('\n') + '\n';
const tierHash = crypto.createHash('sha256').update(tierTable).digest('hex');
const iso = t => new Date(t * 1000).toISOString();
const nSys = files.filter(f => f.tier.startsWith('SYSTEM')).length;
let out = '';
out += `# Frozen baselines for the relevance retriever — B-POP and B-REC (R3), tier table (R8)\n\n`;
out += `Pinned sha: \`${full}\`  \nRe-derive: \`node exo_memory/loop/retriever_baselines_2026-08-31.js ${full.slice(0, 7)}\`  \n`;
out += `Corpus: **${files.length} files** (${nSys} SYSTEM/carried, ${files.length - nSys} RECORD/indexed), enumerated by corpus_shelf()'s walk at the sha, plus BOOT.md.  \n`;
out += `Tier-table sha256 (R8): \`${tierHash}\`\n\n`;
out += `Frozen by pane E on 2026-08-31 BEFORE any label was made (P-LABELS, L019). Baselines are defined by RULE in the script header; the numbers below are that rule run once at the sha. They do not change when labels are added. A different corpus rule needs a new registration (A6).\n\n`;
out += `## B-POP — frozen: top 3 by distinct citing files\n\n| rank | path | tier | citing files (DF) | occurrences |\n|---|---|---|---|---|\n`;
pop.slice(0, 10).forEach((p, i) => { out += `| ${i + 1}${i < 3 ? ' **B-POP**' : ''} | \`${p.path}\` | ${p.tier} | ${p.df} | ${p.occ} |\n`; });
out += `\n(ranks 4–10 printed so the margin is visible; only ranks 1–3 are the baseline.)\n\n`;
out += `## B-REC — frozen: top 3 by last commit time at the sha\n\n| rank | path | tier | last commit (UTC) |\n|---|---|---|---|\n`;
rec.slice(0, 10).forEach((p, i) => { out += `| ${i + 1}${i < 3 ? ' **B-REC**' : ''} | \`${p.path}\` | ${p.tier} | ${iso(p.ct)} |\n`; });
out += `\n## Tier table (R8) — every corpus file, its tier\n\n\`\`\`\n${tierTable}\`\`\`\n`;
process.stdout.write(out);
