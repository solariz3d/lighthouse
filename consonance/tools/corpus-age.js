#!/usr/bin/env node
/* corpus-age — is the corpus outgrowing the seat that has to hold it, and what should age out?
 *
 * WHY THIS EXISTS. BOOT maintenance law 3 says: "Curate below capacity. Crowding shrinks the recall
 * basins until even a clean cue misses. Don't hoard. Raw archive lives in attic/." That law has run
 * EXACTLY ZERO TIMES -- `attic/` has not been touched since 2026-06-24, the day it was created,
 * while `loop/` added 65 files in August alone. A discipline with no instrument does not happen;
 * the ferry backlog sat at 167 for weeks on the same principle.
 *
 * WHAT IT REPORTS, and the first number is the point: the corpus measured against the librarian's
 * carry budget. That is the capacity question law 3 is actually about. The file list is secondary.
 *
 * WHAT IT WILL NOT DO: move anything. It PROPOSES, with a reason per file, and `--apply` is a
 * separate deliberate act that writes a manifest and moves to attic/ -- never deletes. An
 * instrument that silently relocated 44 files in this repo would be the worst thing in it.
 *
 * THE LIMIT IT CANNOT SEE, stated because it changes how the output should be read: "referenced"
 * means the filename appears somewhere outside its own directory. A file can be load-bearing
 * without ever being NAMED -- the branch-layer experiment is journaled as a finding without any
 * journal entry citing its preregistration by filename. So an unreferenced file is a CANDIDATE for
 * review, never a verdict. The tool measures reference and age because it can; it does not claim
 * the finding survived elsewhere, because it cannot check that.
 *
 * Run:  node consonance/tools/corpus-age.js [--dir loop] [--days 30] [--all] [--json]
 *       node consonance/tools/corpus-age.js --apply <file> [<file>...]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const EXO = path.join(REPO, 'exo_memory');
const ATTIC = path.join(EXO, 'attic');

/* Matches corpus_shelf()'s default in src-tauri/src/main.rs. If these drift, the headline is a
 * lie -- so the number is repeated here with the reason rather than silently duplicated. */
const BUDGET_BYTES = 2_200_000;

/* What the librarian actually carries. attic/ is excluded by law 3 in both places. */
const CARRIED = ['', 'cards', 'record', 'memory', 'librarian', 'map', 'spread', 'research', 'journal', 'loop'];

const sh = (cmd, args) => {
  try { return execFileSync(cmd, args, { cwd: REPO, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); }
  catch (_) { return null; }
};

/* Mirrors collect_md() in src-tauri/src/main.rs: named directories are walked RECURSIVELY,
 * the root of exo_memory is not, and attic/ is skipped by name at any depth (law 3).
 *
 * It was a flat readdir until 2026-08-23, exactly like the shelf, and both missed the same 12 .md
 * files nested under exo_memory/ -- including a compaction-survival PREREG. A capacity gauge that
 * cannot see part of the corpus under-reports pressure while looking authoritative. */
function mdFiles(dir) {
  const d = dir ? path.join(EXO, dir) : EXO;
  const out = [];
  const walk = (cur, recurse) => {
    let entries;
    try { entries = fs.readdirSync(cur, { withFileTypes: true }); } catch (_) { return; }
    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) {
        if (!recurse || e.name === 'attic') continue;
        walk(full, true);
      } else if (e.isFile() && e.name.endsWith('.md')) {
        out.push({ dir, name: e.name, full, size: fs.statSync(full).size,
                   rel: path.relative(EXO, full).split(path.sep).join('/') });
      }
    }
  };
  walk(d, Boolean(dir));
  return out;
}

function corpusSize() {
  let bytes = 0, files = 0;
  for (const d of CARRIED) for (const f of mdFiles(d)) { bytes += f.size; files++; }
  return { bytes, files };
}

/* One pass over everything that is NOT the directory under review, so a file referencing itself
 * or its neighbours does not count as reach. */
function referenceBlob(skipDir) {
  const listed = sh('git', ['ls-files', '*.md', '*.js', '*.rs', '*.ps1']);
  if (listed === null) return null;
  const prefix = 'exo_memory/' + skipDir + '/';
  let blob = '';
  for (const rel of listed.split('\n').filter(Boolean)) {
    if (skipDir && rel.startsWith(prefix)) continue;
    try { blob += fs.readFileSync(path.join(REPO, rel), 'utf8'); } catch (_) {}
  }
  return blob;
}

function ageDays(rel) {
  const out = sh('git', ['log', '-1', '--format=%ad', '--date=format:%s', '--', rel]);
  if (!out || !out.trim()) return null;
  const then = parseInt(out.trim(), 10);
  if (!Number.isFinite(then)) return null;
  return Math.floor((Date.now() / 1000 - then) / 86400);
}

function review(dir, minDays) {
  const blob = referenceBlob(dir);
  if (blob === null) return { failed: 'git ls-files did not run here' };
  const rows = [];
  for (const f of mdFiles(dir)) {
    const base = f.name.replace(/\.md$/, '');
    /* rel comes from the walk, not from joining dir+name: a nested file joined that way yields
     * a path that does not exist, git log returns nothing, days is null, stale is false, and the
     * file is silently never proposed. Wrong quietly, which is the worst way to be wrong here. */
    const rel = 'exo_memory/' + f.rel;
    /* A generic basename (README.md, NOTES.md, STATUS.md) matches somewhere in almost any repo,
     * so nested files under run1/ and 2026-08-18/ read as referenced on the basename alone. That
     * errs toward NOT proposing, which is the safe direction, but it makes the 'referenced' count
     * an overcount for those files. Match the relative path too -- that is how a nested file
     * would actually be cited. */
    const referenced = blob.includes(f.rel) || blob.includes(f.name) || blob.includes(base);
    const days = ageDays(rel);
    const stale = days !== null && days >= minDays;
    rows.push({ ...f, rel, referenced, days, propose: !referenced && stale });
  }
  return { rows };
}

function apply(files) {
  fs.mkdirSync(ATTIC, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const manifest = path.join(ATTIC, `MOVED-${stamp}.md`);
  const lines = [];
  let moved = 0;
  for (const rel of files) {
    const src = path.join(REPO, rel);
    if (!fs.existsSync(src)) { console.error('  SKIP (absent): ' + rel); continue; }
    const dest = path.join(ATTIC, path.basename(rel));
    if (fs.existsSync(dest)) { console.error('  SKIP (name taken in attic): ' + rel); continue; }
    fs.renameSync(src, dest);
    lines.push(`- \`${rel}\` -> \`attic/${path.basename(rel)}\``);
    moved++;
    console.log('  moved: ' + rel);
  }
  if (!moved) { console.log('  nothing moved.'); return 0; }
  /* The manifest is the point of --apply being separate: law 3 says PRESERVED, and a move with no
   * record of where a file came from is a deletion with extra steps. */
  const head = fs.existsSync(manifest) ? '' :
    `# Moved to attic ${stamp}\n\nPer BOOT maintenance law 3 — preserved, never a daily cue.\n` +
    `Proposed by \`corpus-age.js\`, confirmed by hand. Nothing here was deleted.\n\n`;
  fs.appendFileSync(manifest, head + lines.join('\n') + '\n');
  console.log('  manifest: exo_memory/attic/' + path.basename(manifest));
  return moved;
}

function main() {
  const args = process.argv.slice(2);
  const ai = args.indexOf('--apply');
  if (ai >= 0) {
    const files = args.slice(ai + 1).filter((a) => !a.startsWith('--'));
    if (!files.length) { console.error('--apply needs at least one path'); process.exit(2); }
    console.log('\nmoving to attic/ (preserved, never deleted):');
    process.exit(apply(files) ? 0 : 1);
  }

  const dir = args.includes('--dir') ? args[args.indexOf('--dir') + 1] : 'loop';
  const minDays = args.includes('--days') ? parseInt(args[args.indexOf('--days') + 1], 10) : 30;
  const json = args.includes('--json');
  const all = args.includes('--all');

  const size = corpusSize();
  const pct = (size.bytes / BUDGET_BYTES) * 100;
  const r = review(dir, minDays);
  if (r.failed) { console.error('corpus-age: ' + r.failed); process.exit(2); }

  const proposed = r.rows.filter((x) => x.propose);
  const freed = proposed.reduce((a, x) => a + x.size, 0);

  if (json) { console.log(JSON.stringify({ size, budget: BUDGET_BYTES, pct, dir, minDays, rows: r.rows }, null, 2)); return; }

  console.log('');
  console.log('CAPACITY — the question law 3 is actually about');
  console.log('  corpus carried by the librarian : ' + size.files + ' files, ' + size.bytes.toLocaleString() + ' bytes');
  console.log('  carry budget                    : ' + BUDGET_BYTES.toLocaleString() + ' bytes');
  console.log('  used                            : ' + pct.toFixed(1) + '%');
  console.log('');
  console.log('REVIEW — ' + dir + '/, unreferenced and older than ' + minDays + ' days');
  console.log('  files            : ' + r.rows.length);
  console.log('  referenced       : ' + r.rows.filter((x) => x.referenced).length);
  console.log('  PROPOSED         : ' + proposed.length + '  (' + freed.toLocaleString() + ' bytes, ' +
    (freed / BUDGET_BYTES * 100).toFixed(1) + '% of budget)');
  console.log('');
  if (!proposed.length) { console.log('  nothing proposed.'); }
  else {
    const show = all ? proposed : proposed.slice(0, 15);
    if (show.length < proposed.length) console.log('  (first ' + show.length + ' of ' + proposed.length + '; --all for the rest)');
    for (const x of show) console.log('  ' + String(x.days).padStart(3) + 'd  ' + String(x.size).padStart(7) + 'b  ' + x.rel);
    console.log('');
    console.log('  These are CANDIDATES, not a verdict. "Unreferenced" means the filename appears');
    console.log('  nowhere outside its own directory — a file can be load-bearing without being');
    console.log('  named, so read the list before acting on it.');
    console.log('');
    console.log('  To archive (moves to attic/, writes a manifest, deletes nothing):');
    console.log('    node consonance/tools/corpus-age.js --apply ' + proposed[0].rel + ' ...');
  }
  console.log('');
}

if (require.main === module) main();
module.exports = { corpusSize, review, mdFiles, BUDGET_BYTES };
