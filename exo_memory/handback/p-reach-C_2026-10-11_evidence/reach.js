#!/usr/bin/env node
// D294 part 2 (pane C): REACH, re-measured. MEASURE ONLY -- reads, never writes outside --out.
//
// THE 08-22 METHOD, recovered from the chair's transcript
// (~/.claude/projects/C--Consonance-instances-main/0c0c0c0a-0000-4000-8000-000000000a01.jsonl,
// rows 25383/25387 at 2026-08-22T11:21Z and row 26378 at 13:00Z; journal/2026-08-22.md:420-423, :631-636):
//   corpus     = for every directory directly under exo_memory: `cat <dir>/*.md | wc -l` (top level of
//                the dir only), plus `cat *.md | wc -l` at exo_memory's root. That is: newline count of
//                every .md exactly one level deep, plus the root's.
//   in context = BOOT.md lines + `node consonance/tools/state-block.js | wc -l` (121 + 42 = 163 then).
//   reachable  = journal + research + spread + 150 (a hand estimate for "2 named root files",
//                SELF_TRACE.md and the_living_wave.md) + cards (added at 13:00 for SOURCE.md's triggers).
//   unpointed  = corpus - reachable.
// The pointer set was classified BY HAND, per directory, from what BOOT and the trigger table named.
// This script re-runs it mechanically with that same directory set, and separately with the 150 replaced
// by the two files' measured lines -- the second is NOT the 08-22 method and is labelled so.
//
// Third Place: exo_memory/third_place/ is excluded from every count here and its transcripts are not
// scanned (standing rule: never read Third Place content). The corpus below is therefore an undercount
// of exo_memory by exactly that directory.
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');
const readline = require('readline');

function arg(name, dflt) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : dflt;
}
const REPO = arg('--repo');
const SHELF = arg('--shelf');
const PROJECTS = arg('--projects', path.join(os.homedir(), '.claude', 'projects'));
const DAYS = Number(arg('--days', '14'));
const OLD_SHA = arg('--old', '797bb1fa');
const OUT = arg('--out');
if (!REPO || !SHELF || !OUT) {
  console.error('usage: reach.js --repo <lighthouse checkout> --shelf <librarian CLAUDE.md> --out <dir> [--projects d] [--days 14] [--old sha] [--no-scan]');
  process.exit(2);
}
const EXCLUDED_DIRS = new Set(['third_place']);
const nl = (buf) => { let n = 0; for (const b of buf) if (b === 10) n++; return n; };
const pct = (a, b) => (a / b * 100).toFixed(2) + '%';

// ---- the 08-22 method on a tree given as a list of {rel, lines} -----------------------------------
function oldMethod(files, inContext, opts = {}) {
  const per = {};
  for (const f of files) {
    const parts = f.rel.split('/');
    let key;
    if (parts.length === 1) key = 'root';
    else if (parts.length === 2) key = parts[0];
    else continue; // deeper than one level: `cat dir/*.md` never saw it
    if (EXCLUDED_DIRS.has(key)) continue;
    if (opts.dirs && key !== 'root' && !opts.dirs.includes(key)) continue;
    per[key] = (per[key] || 0) + f.lines;
  }
  const total = Object.values(per).reduce((a, b) => a + b, 0);
  const named = opts.namedRoot === undefined ? 150 : opts.namedRoot;
  const reach = (per.journal || 0) + (per.research || 0) + (per.spread || 0) + named + (per.cards || 0);
  return {
    per, total, inContext,
    inContextPct: pct(inContext, total),
    reachable: reach, reachablePct: pct(reach, total),
    unpointed: total - reach, unpointedPct: pct(total - reach, total),
  };
}

// ---- today's tree, from disk ------------------------------------------------------------------
const EXO = path.join(REPO, 'exo_memory');
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
const blockOut = cp.execFileSync(process.execPath, [path.join(REPO, 'consonance/tools/state-block.js')], { cwd: REPO, encoding: 'utf8' });
const blockLines = nl(Buffer.from(blockOut));
const linesOf = (rel) => (today.find((f) => f.rel === rel) || { lines: 0 }).lines;
const namedMeasured = linesOf('SELF_TRACE.md') + linesOf('the_living_wave.md');

// ---- the 08-22 tree, from git, as a check that the method is the one recovered ------------------
function gitTree(sha) {
  const ls = cp.execFileSync('git', ['-C', REPO, 'ls-tree', '-r', '-z', sha, 'exo_memory/'], { maxBuffer: 1 << 28 })
    .toString('utf8').split('\0').filter(Boolean)
    .map((l) => { const [meta, p] = l.split('\t'); return { blob: meta.split(' ')[2], p }; })
    .filter((x) => x.p.endsWith('.md'));
  const out = [];
  for (const x of ls) {
    const buf = cp.execFileSync('git', ['-C', REPO, 'cat-file', 'blob', x.blob], { maxBuffer: 1 << 28 });
    out.push({ rel: x.p.slice('exo_memory/'.length), lines: nl(buf) });
  }
  return out;
}
const old = gitTree(OLD_SHA);
const OLD_DIRS = ['cards', 'record', 'spread', 'research', 'map', 'memory', 'journal', 'loop', 'attic'];
const oldNamed = old.filter((f) => f.rel === 'SELF_TRACE.md' || f.rel === 'the_living_wave.md').reduce((a, f) => a + f.lines, 0);

const R = {};
R.check_0822_tree = oldMethod(old, 121 + 42, { dirs: OLD_DIRS });
R.check_0822_tree.note = `git tree ${OLD_SHA} : the 08-22 live corpus included uncommitted files, so this need not equal 26,265 exactly`;
R.check_0822_tree.namedRootMeasured = oldNamed;
R.today_same_method_all_dirs = oldMethod(today, bootLines + blockLines);
R.today_same_method_0822_dirs = oldMethod(today, bootLines + blockLines, { dirs: OLD_DIRS });
R.today_named_root_measured = oldMethod(today, bootLines + blockLines, { namedRoot: namedMeasured });
R.wake = { bootLines, stateBlockLines: blockLines, namedRootMeasured: namedMeasured };

// ---- the librarian's shelf (a different seat and a different unit: NOT the 08-22 method) --------
const shelfText = fs.readFileSync(SHELF, 'utf8');
const shelfLines = shelfText.split(/\r?\n/);
const iNot = shelfLines.findIndex((l) => l.startsWith('## NOT CARRIED'));
const iWin = shelfLines.findIndex((l, i) => i > iNot && l.startsWith('THE INDEX IS WINDOWED'));
const indexed = shelfLines.slice(iNot, iWin).filter((l) => l.startsWith('- ')).map((l) => l.slice(2).split('  (')[0]);
const carried = shelfLines.slice(iWin).filter((l) => /^## [^ ]+\.md$/.test(l)).map((l) => l.slice(3));
const header = shelfLines.find((l) => /file\(s\) carried in full/.test(l));
const dropHdr = shelfLines.find((l) => /index-tier entries .* dropped by the index window/.test(l));
const shelfMtime = fs.statSync(SHELF).mtimeMs;
// The walk's index tier: map/, journal/, loop/, recursive, attic/ skipped, run artifacts excluded by name.
const indexTier = today.filter((f) => /^(map|journal|loop)\//.test(f.rel) && !/(^|\/)attic\//.test(f.rel)
  && !f.rel.startsWith('loop/run1/items/') && !f.rel.startsWith('loop/run2/cells/'));
const indexedSet = new Set(indexed);
const notListed = indexTier.filter((f) => !indexedSet.has(f.rel));
// A file not listed is DROPPED only if it existed when the shelf was assembled; newer files were not walked.
const dropped = notListed.filter((f) => f.mtime <= shelfMtime);
const newerThanShelf = notListed.filter((f) => f.mtime > shelfMtime);
const corpusAll = today.reduce((a, f) => a + f.lines, 0);
const carriedSet = new Set(carried);
const carriedLines = today.filter((f) => carriedSet.has(f.rel)).reduce((a, f) => a + f.lines, 0);
const indexedLines = today.filter((f) => indexedSet.has(f.rel)).reduce((a, f) => a + f.lines, 0);
const droppedLines = dropped.reduce((a, f) => a + f.lines, 0);
R.librarian_shelf = {
  NOT_COMPARABLE: 'librarian wake, recursive corpus, carried/indexed by file; the 08-22 figures used a fresh instance, top-level files and hand-classified directories',
  shelf: SHELF, shelfMtime: new Date(shelfMtime).toISOString(), header, dropHdr,
  carriedFiles: carried.length, indexedFiles: indexed.length,
  indexedMissingOnDisk: indexed.filter((r) => !today.some((f) => f.rel === r)),
  corpusRecursiveLines: corpusAll, corpusRecursiveFiles: today.length,
  inContextLines: bootLines + carriedLines, inContextPct: pct(bootLines + carriedLines, corpusAll),
  indexedLines, reachablePct: pct(bootLines + carriedLines + indexedLines, corpusAll),
  droppedFiles: dropped.length, droppedLines, droppedPct: pct(droppedLines, corpusAll),
  unpointedPct: pct(corpusAll - bootLines - carriedLines - indexedLines, corpusAll),
  notListedNewerThanShelf: newerThanShelf.map((f) => f.rel),
};
const unpointedByTop = {};
for (const f of today) {
  if (f.rel === 'BOOT.md' || carriedSet.has(f.rel) || indexedSet.has(f.rel)) continue;
  const k = f.rel.includes('/') ? f.rel.split('/')[0] + '/' : '(root)';
  unpointedByTop[k] = (unpointedByTop[k] || 0) + f.lines;
}
R.librarian_shelf.unpointedLinesByTop = unpointedByTop;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'dropped.txt'), dropped.map((f) => f.rel).sort().join('\n') + '\n');

// ---- were the dropped files opened in the last DAYS days? ---------------------------------------
// read_ledger.jsonl does not record opens (2 "register" rows), so this reads Claude Code transcripts:
// a Read tool_use whose file_path ends in exo_memory/<rel> is OPENED; a Bash/PowerShell/Grep/Glob
// input naming exo_memory/<rel> or the bare <rel> is NAMED (looser: a grep over a dir is not a read).
async function scan() {
  const since = Date.now() - DAYS * 86400e3;
  const byRel = new Map(dropped.map((f) => [f.rel.toLowerCase(), { opened: 0, named: 0 }]));
  const rels = [...byRel.keys()];
  const files = [];
  (function w(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (/third-place/i.test(e.name)) continue; w(p); }
      else if (e.name.endsWith('.jsonl') && fs.statSync(p).mtimeMs >= since) files.push(p);
    }
  })(PROJECTS);
  let toolUses = 0;
  for (const f of files) {
    const rl = readline.createInterface({ input: fs.createReadStream(f), crlfDelay: Infinity });
    for await (const line of rl) {
      if (!line.includes('"tool_use"')) continue;
      let o; try { o = JSON.parse(line); } catch { continue; }
      if (!o.timestamp || Date.parse(o.timestamp) < since) continue;
      const c = o.message && o.message.content; if (!Array.isArray(c)) continue;
      for (const b of c) {
        if (b.type !== 'tool_use' || !b.input) continue;
        toolUses++;
        if (b.name === 'Read' && typeof b.input.file_path === 'string') {
          const fp = b.input.file_path.replace(/\\/g, '/').toLowerCase();
          const i = fp.indexOf('exo_memory/');
          if (i >= 0) { const hit = byRel.get(fp.slice(i + 11)); if (hit) hit.opened++; }
        } else if (['Bash', 'PowerShell', 'Grep', 'Glob'].includes(b.name)) {
          const s = JSON.stringify(b.input).replace(/\\\\/g, '/').toLowerCase();
          if (!s.includes('exo_memory') && !/(loop|journal|map)\//.test(s)) continue;
          for (const r of rels) if (s.includes(r)) byRel.get(r).named++;
        }
      }
    }
  }
  const opened = [...byRel].filter(([, v]) => v.opened > 0);
  const named = [...byRel].filter(([, v]) => v.named > 0);
  const either = [...byRel].filter(([, v]) => v.opened + v.named > 0);
  return {
    days: DAYS, since: new Date(since).toISOString(), transcriptsScanned: files.length, toolUses,
    dropped: dropped.length,
    opened: opened.length, openedPct: pct(opened.length, dropped.length),
    named: named.length, eitherPct: pct(either.length, dropped.length),
    openedList: opened.map(([r, v]) => `${r}\t${v.opened}\t${v.named}`),
    namedOnlyList: named.filter(([, v]) => !v.opened).map(([r, v]) => `${r}\t0\t${v.named}`),
  };
}

(async () => {
  if (!process.argv.includes('--no-scan')) R.dropped_opened = await scan();
  fs.writeFileSync(path.join(OUT, 'reach.json'), JSON.stringify(R, null, 2) + '\n');
  console.log(JSON.stringify(R, (k, v) => (k === 'openedList' || k === 'namedOnlyList' || k === 'notListedNewerThanShelf') && v.length > 40 ? v.slice(0, 40).concat([`... ${v.length} total`]) : v, 2));
})();
