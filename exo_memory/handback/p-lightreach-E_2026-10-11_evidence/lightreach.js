#!/usr/bin/env node
// D297 part 4 (pane E, ledger D298): what light mode costs in reach. MEASURE ONLY: reads the snapshot and a shelf dump, writes only --out.
// Plan: exo_memory/loop/plan_retrieval_next_d297_2026-10-11.md, part 4. Hand-back: exo_memory/handback/p-lightreach-E_2026-10-11.md.
//
// WHY AN ADAPTER AND NOT reach.js ITSELF. C's reach.js (exo_memory/handback/p-reach-C_2026-10-11_evidence/reach.js) takes the corpus from
// <repo>/exo_memory and also runs git and state-block.js on <repo> for its 08-22 sections. The packet's corpus is the SNAPSHOT
// (G:/consonance-scratch/c-d296/snap, an exo_memory tree, not a repo), and only reach.js's `librarian_shelf` section measures a shelf. So:
//   - walk(), nl() and pct() below are reach.js:43-44 and :72-84, verbatim;
//   - strictShelf() is reach.js:119-159 verbatim, with its inputs passed in instead of read from globals;
//   - lightShelf() is the one addition. The light shelf has no "## NOT CARRIED" per-file index and no "THE INDEX IS WINDOWED" line (reach.js
//     would find iNot = -1 and list nothing); it carries files under "## <rel>.md" headings, as strict does, names a few files by path,
//     and points at DIRECTORIES. It is parsed into the same three sets (carried, named by path, dropped) so the same formulas apply.
// The parity check: run with --form strict on C's own inputs (the main checkout as it stood at 14:5xZ, which C used) and it must print C's
// committed numbers (p-shelfbudget-C_2026-10-11_evidence/reach/new.json). On today's main it differs only by files added since.
//
// Run: node lightreach.js --exo <exo_memory tree> --shelf <dump.md> --form strict|light --out <file.json>
'use strict';
const fs = require('fs');
const path = require('path');

const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : undefined; };
const EXO = arg('--exo'), SHELF = arg('--shelf'), FORM = arg('--form'), OUT = arg('--out');
if (!EXO || !SHELF || !OUT || !['strict', 'light'].includes(FORM)) {
  console.error('usage: lightreach.js --exo <exo_memory tree> --shelf <dump.md> --form strict|light --out <file.json>');
  process.exit(2);
}

// ---- reach.js:42-44 and :72-84, verbatim -------------------------------------------------------
const EXCLUDED_DIRS = new Set(['third_place']);
const nl = (buf) => { let n = 0; for (const b of buf) if (b === 10) n++; return n; };
const pct = (a, b) => (a / b * 100).toFixed(2) + '%';
function walk(d, rel, out) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) {
      if (!rel && EXCLUDED_DIRS.has(e.name)) continue;
      walk(path.join(d, e.name), r, out);
    } else if (e.isFile() && e.name.endsWith('.md')) {
      const p = path.join(d, e.name);
      out.push({ rel: r, lines: nl(fs.readFileSync(p)), mtime: fs.statSync(p).mtimeMs });
    }
  }
  return out;
}

const today = walk(EXO, '', []);
const bootLines = nl(fs.readFileSync(path.join(EXO, 'BOOT.md')));
const shelfText = fs.readFileSync(SHELF, 'utf8');
const shelfLines = shelfText.split(/\r?\n/);
const shelfMtime = fs.statSync(SHELF).mtimeMs;
const corpusAll = today.reduce((a, f) => a + f.lines, 0);
// reach.js:129-130, the walk's index tier (what a file-by-file index would list): map/, journal/, loop/, no attic/, no run artifacts
const indexTier = today.filter((f) => /^(map|journal|loop)\//.test(f.rel) && !/(^|\/)attic\//.test(f.rel)
  && !f.rel.startsWith('loop/run1/items/') && !f.rel.startsWith('loop/run2/cells/'));

// ---- reach.js:119-159, the strict shelf ---------------------------------------------------------
function strictShelf() {
  const iNot = shelfLines.findIndex((l) => l.startsWith('## NOT CARRIED'));
  const iWin = shelfLines.findIndex((l, i) => i > iNot && l.startsWith('THE INDEX IS WINDOWED'));
  const indexed = shelfLines.slice(iNot, iWin).filter((l) => l.startsWith('- ')).map((l) => l.slice(2).split('  (')[0]);
  const carried = shelfLines.slice(iWin).filter((l) => /^## [^ ]+\.md$/.test(l)).map((l) => l.slice(3));
  return { iNot, iWin, indexed, carried,
    header: shelfLines.find((l) => /file\(s\) carried in full/.test(l)),
    dropHdr: shelfLines.find((l) => /index-tier entries .* dropped by the index window/.test(l)),
    // directories the shelf points at by an `ls` command (strict names them in its window note): the second, looser unit
    dirPointers: [...shelfText.matchAll(/ls exo_memory\/([a-z0-9_]+)\//g)].map((m) => m[1]) };
}

// ---- the light shelf: the same three sets, from its own form -------------------------------------
// A path the light shelf prints is absolute (`<checkout>\exo_memory\<rel>`): the part after exo_memory\ is the repo-relative name.
const relOf = (abs) => { const s = abs.replace(/\\/g, '/'); const i = s.lastIndexOf('/exo_memory'); return i < 0 ? null : s.slice(i + '/exo_memory'.length).replace(/^\//, ''); };
function lightShelf() {
  const iShelf = shelfLines.findIndex((l) => l.startsWith('# THE SHELF'));
  const iDir = shelfLines.findIndex((l, i) => i > iShelf && l.startsWith('## BY DIRECTORY'));
  // carried: every "## <rel>.md" heading after the directory list (the same regex as reach.js:124)
  const carried = shelfLines.slice(iDir).filter((l) => /^## [^ ]+\.md$/.test(l)).map((l) => l.slice(3));
  // named by path: a "- `<abs path to one .md>`" bullet between "# THE SHELF" and "## BY DIRECTORY" (today: the notes that did not fit)
  const indexed = shelfLines.slice(iShelf, iDir).map((l) => /^- `([^`]+\.md)`/.exec(l)).filter(Boolean).map((m) => relOf(m[1])).filter((r) => r != null);
  // directories: "- `<abs dir>` -- N .md file(s)" bullets under "## BY DIRECTORY", up to the next heading
  const iEnd = shelfLines.findIndex((l, i) => i > iDir && /^#/.test(l));
  const dirs = shelfLines.slice(iDir, iEnd < 0 ? undefined : iEnd).map((l) => /^- `([^`]+)` -- (\d+) \.md file\(s\)/.exec(l)).filter(Boolean)
    .map((m) => ({ rel: relOf(m[1]), stated: Number(m[2]) }));
  return { iShelf, iDir, indexed, carried, dirs,
    header: shelfLines.find((l) => /file\(s\) carried in full/.test(l)),
    dirPointers: dirs.map((d) => d.rel) };
}

const S = FORM === 'strict' ? strictShelf() : lightShelf();
const indexedSet = new Set(S.indexed), carriedSet = new Set(S.carried);
const carriedLines = today.filter((f) => carriedSet.has(f.rel)).reduce((a, f) => a + f.lines, 0);
const indexedLines = today.filter((f) => indexedSet.has(f.rel)).reduce((a, f) => a + f.lines, 0);
// reach.js:131-135: an index-tier file the shelf does not name, that existed when the shelf was assembled, is DROPPED
const notListed = indexTier.filter((f) => !indexedSet.has(f.rel));
const dropped = notListed.filter((f) => f.mtime <= shelfMtime);
const droppedLines = dropped.reduce((a, f) => a + f.lines, 0);
const unpointedByTop = {};
for (const f of today) {
  if (f.rel === 'BOOT.md' || carriedSet.has(f.rel) || indexedSet.has(f.rel)) continue;
  const k = f.rel.includes('/') ? f.rel.split('/')[0] + '/' : '(root)';
  unpointedByTop[k] = (unpointedByTop[k] || 0) + f.lines;
}
const pointedFiles = today.filter((f) => f.rel === 'BOOT.md' || carriedSet.has(f.rel) || indexedSet.has(f.rel));

// THE SECOND UNIT, labelled so (not in reach.js): a file under a directory the shelf points at, by `ls` or the light directory list.
// "top" = directly in it (what `ls <dir>` prints); "any depth" = anywhere below it. The root ('') counts only its top level, never deeper.
const under = (f, d, deep) => (d === '' ? !f.rel.includes('/') : deep ? f.rel.startsWith(d + '/') : f.rel.startsWith(d + '/') && !f.rel.slice(d.length + 1).includes('/'));
const dirReach = (deep) => {
  const hit = today.filter((f) => f.rel === 'BOOT.md' || carriedSet.has(f.rel) || indexedSet.has(f.rel) || S.dirPointers.some((d) => under(f, d, deep)));
  const lines = hit.reduce((a, f) => a + f.lines, 0);
  return { files: hit.length, lines, reachablePct: pct(lines, corpusAll), unpointedPct: pct(corpusAll - lines, corpusAll) };
};

const R = {
  form: FORM, shelf: SHELF, shelfMtime: new Date(shelfMtime).toISOString(), exo: EXO, header: S.header, dropHdr: S.dropHdr,
  carriedFiles: S.carried.length, indexedFiles: S.indexed.length,
  indexedMissingOnDisk: S.indexed.filter((r) => !today.some((f) => f.rel === r)),
  carriedMissingOnDisk: S.carried.filter((r) => !today.some((f) => f.rel === r)),
  corpusRecursiveLines: corpusAll, corpusRecursiveFiles: today.length,
  // reach.js's unit (by file): in context = BOOT + carried; reachable = that + named by path
  inContextLines: bootLines + carriedLines, inContextPct: pct(bootLines + carriedLines, corpusAll),
  indexedLines, reachablePct: pct(bootLines + carriedLines + indexedLines, corpusAll),
  filesReachableByPath: pointedFiles.length,
  droppedFiles: dropped.length, droppedLines, droppedPct: pct(droppedLines, corpusAll),
  unpointedPct: pct(corpusAll - bootLines - carriedLines - indexedLines, corpusAll),
  unpointedLinesByTop: unpointedByTop,
  SECOND_UNIT: 'not reach.js: also counts a file as reached when the shelf points at its DIRECTORY (strict: `ls exo_memory/<dir>/`; light: the BY DIRECTORY list)',
  dirPointers: S.dirPointers,
  dirStated: S.dirs || null,
  byDirectory_top: dirReach(false),
  byDirectory_anyDepth: dirReach(true),
};
fs.writeFileSync(OUT, JSON.stringify(R, null, 2) + '\n');
console.log(JSON.stringify(R, null, 2));
