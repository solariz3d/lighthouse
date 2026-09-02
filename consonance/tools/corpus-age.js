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
 * WHOLE intake cap, split into the tiers the binary carries and the tiers it only indexes. That is
 * the capacity question law 3 is actually about. The file list is secondary.
 *
 * WHAT IT DELIBERATELY DOES NOT REPORT: a percentage of the delivered body budget. That budget
 * stopped being a constant on 2026-09-02 and is computed per run inside the binary; this tool names
 * the command that prints it rather than duplicating a number it cannot check. See intakeCap().
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

const MAIN_RS = path.join(REPO, 'consonance', 'src-tauri', 'src', 'main.rs');

/* THERE IS NO CARRY BUDGET CONSTANT ANY MORE, and this file printed one for 20 hours after it
 * stopped existing. Until 2026-09-02 02:02 (`c2afec6`) the shelf's bound was `librarian_budget()`,
 * default 2,200,000 bytes, and this tool duplicated that number as `BUDGET_BYTES` with a test
 * guarding the pair. That function is gone on purpose: the delivered budget is now computed inside
 * `librarian_shelf()` as `cap - headroom - head - floor`, PER RUN, from two terms this tool cannot
 * measure without running the binary. So the duplication has no second side, the guard that policed
 * it is deleted rather than re-pointed, and the percentage it fed is gone with it.
 *
 * WHAT REPLACES IT is the one bound that IS a live constant in the binary: the whole intake cap,
 * read out of main.rs at run time rather than retyped here. The bodies get strictly less than this
 * -- the head and the index are spent first -- so a corpus already many times the WHOLE cap is a
 * capacity statement that needs no estimate of the split. Where the split matters, the binary
 * prints it, and the command is named in the output instead of guessed at here. */
function intakeCap(srcPath = MAIN_RS) {
  const src = fs.readFileSync(srcPath, 'utf8');
  const lim = src.match(/const LIBRARIAN_INTAKE_LIMIT: usize = ([A-Za-z0-9_]+);/);
  if (!lim) throw new Error('LIBRARIAN_INTAKE_LIMIT not found in main.rs — refusing to print a capacity number with no anchor in the binary');
  if (/^\d/.test(lim[1])) return parseInt(lim[1].replace(/_/g, ''), 10);
  const via = src.match(new RegExp('const ' + lim[1] + ': usize = (\\d[\\d_]*);'));
  if (!via) throw new Error('LIBRARIAN_INTAKE_LIMIT is defined as ' + lim[1] + ', which has no numeric definition in main.rs');
  return parseInt(via[1].replace(/_/g, ''), 10);
}

/* THE THREE SETS, mirroring `order` in corpus_shelf_at(). Duplicated here WITH a test that reads
 * the flags out of main.rs, because unlike the budget this duplication still has two sides.
 *
 * The split is not cosmetic and this file had it wrong for nine days. `8e18d5d` (2026-08-24 01:56)
 * made map/, journal/ and loop/ INDEXED-NEVER-CARRIED, and this tool went on counting all three
 * into a figure it labelled "corpus carried by the librarian" -- the record tiers, which are most
 * of the mass and all of the growth. */
const CARRY_TIERS = ['cards', '', 'record', 'memory', 'librarian', 'spread', 'research'];
const INDEX_TIERS = ['map', 'journal', 'loop'];

/* Excluded BY NAME in the binary since c2afec6 -- bulk run artifacts that cost more index than the
 * shelf spends on bodies. They are on disk and are not in the shelf at all, so a capacity gauge
 * that counts them is reporting pressure the seat does not feel. */
const EXCLUDED_PREFIXES = ['loop/run1/items/', 'loop/run2/cells/'];

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

/* The corpus, split the way the binary splits it. `bytes`/`files` stay the accounted total --
 * everything the shelf walk actually sees -- so they exclude attic/ (law 3) and the run artifacts
 * the binary drops by name. */
function corpusSize() {
  const tally = (dirs) => {
    let bytes = 0, files = 0, exBytes = 0, exFiles = 0;
    for (const d of dirs) for (const f of mdFiles(d)) {
      if (EXCLUDED_PREFIXES.some((p) => f.rel.startsWith(p))) { exBytes += f.size; exFiles++; continue; }
      bytes += f.size; files++;
    }
    return { bytes, files, exBytes, exFiles };
  };
  const carried = tally(CARRY_TIERS);
  const indexed = tally(INDEX_TIERS);
  return {
    bytes: carried.bytes + indexed.bytes,
    files: carried.files + indexed.files,
    carried: { bytes: carried.bytes, files: carried.files },
    indexed: { bytes: indexed.bytes, files: indexed.files },
    excluded: { bytes: carried.exBytes + indexed.exBytes, files: carried.exFiles + indexed.exFiles },
  };
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
  const cap = intakeCap();          /* throws rather than fall back to a made-up number */
  const overCap = size.carried.bytes / cap;
  const r = review(dir, minDays);
  if (r.failed) { console.error('corpus-age: ' + r.failed); process.exit(2); }

  const proposed = r.rows.filter((x) => x.propose);
  const freed = proposed.reduce((a, x) => a + x.size, 0);

  if (json) { console.log(JSON.stringify({ size, intakeCap: cap, overCap, dir, minDays, rows: r.rows }, null, 2)); return; }

  console.log('');
  console.log('CAPACITY — the question law 3 is actually about');
  console.log('  carried tiers (bodies)   : ' + size.carried.files + ' files, ' + size.carried.bytes.toLocaleString() + ' bytes');
  console.log('  indexed tiers (paths)    : ' + size.indexed.files + ' files, ' + size.indexed.bytes.toLocaleString() + ' bytes');
  console.log('  excluded by name         : ' + size.excluded.files + ' files, ' + size.excluded.bytes.toLocaleString() + ' bytes  (run artifacts; not in the shelf at all)');
  console.log('  the WHOLE intake cap     : ' + cap.toLocaleString() + ' bytes  (LIBRARIAN_INTAKE_LIMIT, read from main.rs)');
  console.log('  carried tiers vs that cap: ' + overCap.toFixed(1) + '× — and the bodies get only what is left');
  console.log('                             after the head and the index, so this is an UPPER bound on the fit.');
  console.log('');
  console.log('  THE DELIVERED BODY BUDGET IS NOT KNOWABLE FROM HERE. It is computed per run inside');
  console.log('  librarian_shelf() as cap − headroom − head − floor; the head and the floor are');
  console.log('  measured by walking the corpus, not by a constant this tool could copy. The binary');
  console.log('  prints the real split on every run of:');
  console.log('    cargo test --bin consonance shelf_tests -- --nocapture');
  console.log('');
  console.log('REVIEW — ' + dir + '/, unreferenced and older than ' + minDays + ' days');
  console.log('  files            : ' + r.rows.length);
  console.log('  referenced       : ' + r.rows.filter((x) => x.referenced).length);
  console.log('  PROPOSED         : ' + proposed.length + '  (' + freed.toLocaleString() + ' bytes)');
  if (INDEX_TIERS.includes(dir)) {
    console.log('                     ' + dir + '/ is an INDEXED tier: archiving frees one index line per');
    console.log('                     file off the floor, not body budget. The bytes above are not bodies.');
  }
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
module.exports = { corpusSize, review, mdFiles, intakeCap, CARRY_TIERS, INDEX_TIERS, EXCLUDED_PREFIXES, MAIN_RS };
