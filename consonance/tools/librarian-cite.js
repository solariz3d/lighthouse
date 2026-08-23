#!/usr/bin/env node
// librarian-cite.js — the return edge: librarian -> panes. A CITATION RESOLVER, not a notes reader.
//
// WHY IT IS SHAPED THIS WAY, and the shape was corrected before a line was written.
//
// The first brief said: read the librarian's notes and hand the relevant parts to a pane. Asked
// whether its own notes were the right source, the seat said they are not:
//
//   "exo_memory/librarian/*.md is a summary of THIS SEAT, not of the corpus; handing it to a pane
//    as content is the copy-of-a-copy law 1 forbids. What the notes DO carry that is law-1-safe:
//    path:line pairs. The return edge should extract those, re-open each line from the master at
//    brief time, and hand the pane the quoted line with its path -- never my sentence about it."
//
// Measured rather than argued, over the two notes that existed at build time and the seat's own
// board replies (pane 0c0c0c0b-...115b):
//
//   43 distinct path:line citations in the seat's REPLIES
//   22 in its NOTES -- 22 of the replies' 43 (51.2%) never reached the notes
//    1 in the notes and not in the replies, and it is an inbound CORRECTION the seat recorded
//      against itself (journal/2026-08-23.md:210-213)
//
// So the notes are a faithful but LOSSY index: nothing invented, roughly half the addresses
// dropped. That is still the right thing to point a tool at -- the notes are the only tier that
// is committed, tracked, and survives the instance; board.jsonl and the transcript are richer and
// live outside the repo, which is the exact property exo_memory/librarian/README.md was written
// to fix one layer down. The notes buy durability at the cost of about half the addresses. This
// tool treats them strictly as an INDEX and never as content.
//
// THE LOAD-BEARING PART IS DRIFT. A line number is a pointer into a file this room appends to
// constantly (maintenance law 2), so drift is the normal case, and a stale citation is worse than
// none: it reads as authoritative and resolves to the wrong line, silently. The detector does not
// guess. It uses git:
//
//   1. `git blame` the NOTE line carrying the citation -> the commit where that line was written.
//   2. `git show <sha>:<master>` -> the master AS IT WAS THEN. Line N there is what was cited.
//   3. Compare that text to line N now. Same -> VERIFIED. Moved -> locate it. Gone -> refuse.
//
// STATUSES. The classification discipline is guard-census's and cite-check's, inherited: a thing
// that could not be checked is never counted as a thing that passed.
//
//   VERIFIED        baseline recovered; the line still says what it said. Carried.
//   MOVED           baseline recovered; the text now sits at exactly one other line. Carried,
//                   with the corrected number and the shift shown.
//   FRESH           the note line is not committed yet, so no baseline exists. The citation was
//                   written against the current tree. Carried, LABELLED -- a weaker guarantee
//                   than VERIFIED, and it must not read as one.
//   GONE            baseline recovered; the cited text is nowhere in the file now. REFUSED.
//   AMBIGUOUS-MOVE  the cited text now appears at more than one line. REFUSED.
//   PAST-EOF        the line number is past the end of the file now. REFUSED.
//   BASELINE-EOF    the line number was ALREADY past the end when it was written. REFUSED.
//   EMPTY-ANCHOR    the cited line is blank, so it cannot anchor a move. REFUSED.
//   AMBIGUOUS-PATH  a bare basename matching more than one tracked file. REFUSED -- guessing here
//                   is how a citation resolves confidently to the wrong file.
//   NO-FILE         the path does not exist at HEAD. REFUSED.
//   NO-BASELINE     the master did not exist at the note's commit. REFUSED.
//
// SILENCE IS A VALID AND USUALLY CORRECT OUTPUT (brief/LIBRARIAN.md:89-95). No match prints
// nothing on stdout and one line on stderr. The channel this one sits beside died of volume.
//
// WHAT THIS TOOL DELIBERATELY DOES NOT DO: it does not score the librarian. `--log` appends an
// uninterpreted row of what was emitted, the way `ferry.js --record` does; there is no `--report`
// here on purpose. A channel that scores the seat whose output it carries is that seat scoring
// itself, relocated one hop -- and it would look external while not being.
//
// Usage:
//   node consonance/tools/librarian-cite.js <topic-or-path>
//   node consonance/tools/librarian-cite.js <topic> --json
//   node consonance/tools/librarian-cite.js <topic> --log <pane>   append an emission row
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = process.env.LIBRARIAN_CITE_REPO || path.resolve(__dirname, '..', '..');
const NOTES_DIR = path.join(REPO, 'exo_memory', 'librarian');
// Derived from the repo location rather than written as a literal: a drive-letter default is the
// class portable-paths.js exists to stop, and it landed three times in four days.
const DATA = process.env.CONSONANCE_DATA || path.resolve(REPO, '..', 'data');
const LEDGER = path.join(DATA, 'librarian_cite.jsonl');

// A citation: a filename with a source extension, immediately followed by :<line> or :<line>-<line>.
// Deliberately strict -- `\S+\.md:\d+` is the form the seat itself named as greppable, and widening
// it to bare numbers would swallow prose.
const CITE_RE = /([A-Za-z0-9_.\/-]+\.(?:md|js|rs|ps1|json|toml|py))\s*:\s*(\d+)(?:\s*-\s*(\d+))?/g;

const splitLines = (s) => s.split(/\r?\n/);       // every read goes through this: CRLF-safe.
const git = (args, opts) => execFileSync('git', args,
  { cwd: REPO, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...opts });

/** Tracked files, indexed by basename. Tracked-only on purpose: node_modules and target/ would
 *  make almost every bare basename ambiguous and turn a real refusal into noise. */
let _index = null;
function trackedIndex(force) {
  if (_index && !force) return _index;
  _index = { all: new Set(), byBase: new Map() };
  for (const p of git(['ls-files']).split('\n').filter(Boolean)) {
    _index.all.add(p);
    const b = p.split('/').pop();
    if (!_index.byBase.has(b)) _index.byBase.set(b, []);
    _index.byBase.get(b).push(p);
  }
  return _index;
}

/** The seat's dated notes, newest first by filename.
 *
 *  Filename order, not heading order, and the difference is real: 2026-08-22.md carries a
 *  top-level `# 2026-08-23` section at line 93, so one day's notes are split across two files.
 *  The block's own heading date is reported alongside the filename precisely so that mismatch
 *  stays visible instead of being silently averaged away. */
function noteFiles() {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs.readdirSync(NOTES_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .sort().reverse()
    .map((f) => path.join(NOTES_DIR, f));
}

/** One note file -> blocks, split at every markdown heading. A block is the unit a topic matches
 *  against, so a citation is only surfaced together with the heading it was filed under. */
function blocks(file) {
  const rel = path.relative(REPO, file).replace(/\\/g, '/');
  const lines = splitLines(fs.readFileSync(file, 'utf8'));
  const fileDate = (path.basename(file).match(/^(\d{4}-\d{2}-\d{2})/) || [])[1] || null;
  let headingDate = fileDate;
  const out = [];
  let cur = null;
  lines.forEach((text, i) => {
    const h = text.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const d = h[2].match(/(\d{4}-\d{2}-\d{2})/);
      if (h[1].length === 1 && d) headingDate = d[1];
      cur = { file: rel, startLine: i + 1, heading: h[2].trim(), lines: [], fileDate, headingDate };
      out.push(cur);
    } else if (!cur) {
      cur = { file: rel, startLine: 1, heading: '(preamble)', lines: [], fileDate, headingDate };
      out.push(cur);
    }
    cur.lines.push({ n: i + 1, text });
  });
  return out;
}

/** Citations inside a block, each carrying the note line it was written on -- that line is what
 *  git blame is asked about, so the baseline is the master as of the moment THIS citation landed,
 *  not as of the last time anything in the note file changed. */
function extractCites(block) {
  const out = [];
  for (const { n, text } of block.lines) {
    CITE_RE.lastIndex = 0;
    let m;
    while ((m = CITE_RE.exec(text))) {
      const line = parseInt(m[2], 10);
      const endLine = m[3] ? parseInt(m[3], 10) : line;
      out.push({
        raw: m[0],
        cited: m[1],
        line,
        endLine,
        span: Math.max(0, endLine - line),
        noteFile: block.file,
        noteLine: n,
        noteHeading: block.heading,
        noteDate: block.headingDate,
      });
    }
  }
  return out;
}

/** A cited path -> a repo-relative tracked path, or a refusal.
 *
 *  The seat writes paths three ways: repo-relative (consonance/tools/ferry.js), relative to
 *  exo_memory (journal/2026-08-22.md, loop/coat_preregistration.md), and bare (muscle_map.md,
 *  main.rs). The first two are unambiguous lookups. The third is a guess, and it is allowed only
 *  when exactly one tracked file carries that basename -- README.md:23 names a dozen files and is
 *  refused rather than resolved to whichever one happens to sort first. */
function resolvePath(cited) {
  const idx = trackedIndex();
  const norm = String(cited).replace(/\\/g, '/').replace(/^\.\//, '');
  // A direct hit is only trusted when the citation actually carries a DIRECTORY. A bare
  // `README.md:23` that happens to match the repo-root README is the dangerous case, not the easy
  // one: the seat's own board replies use `README.md:23` and `README.md:119` for the hooks and
  // tools READMEs, and a root-level exact match would have resolved both, confidently, to the
  // wrong file. Bare names go through the ambiguity check like everything else.
  if (norm.includes('/')) {
    for (const cand of [norm, 'exo_memory/' + norm]) {
      if (idx.all.has(cand)) return { ok: true, repoPath: cand, how: 'direct' };
    }
  }
  const hits = idx.byBase.get(norm.split('/').pop()) || [];
  const narrowed = norm.includes('/') ? hits.filter((h) => h.endsWith('/' + norm)) : hits;
  const use = narrowed.length ? narrowed : hits;
  if (use.length === 1) return { ok: true, repoPath: use[0], how: 'basename' };
  if (use.length > 1) {
    return { ok: false, status: 'AMBIGUOUS-PATH', candidates: use.slice(0, 6),
      detail: use.length + ' tracked files carry that basename; the note gives no directory' };
  }
  return { ok: false, status: 'NO-FILE', detail: 'no tracked file at HEAD' };
}

/** The commit that introduced a given line of a note file, or null if it is not committed yet.
 *  Null is not a failure -- the seat writes and the chair commits (brief/COMMITTEE.md), so a note
 *  written this hour is legitimately uncommitted. That is the FRESH case, and it is labelled. */
function blameSha(noteRel, noteLine) {
  let out;
  try {
    out = git(['blame', '-L', noteLine + ',' + noteLine, '--porcelain', '--', noteRel],
      { stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
  const sha = (out.split('\n')[0] || '').split(' ')[0];
  if (!sha || /^0+$/.test(sha)) return null;      // an all-zero sha is git for "not committed yet"
  return sha;
}

function showAt(sha, repoPath) {
  try {
    return git(['show', sha + ':' + repoPath], { stdio: ['ignore', 'pipe', 'ignore'] });
  } catch { return null; }
}

/** The whole point of the tool. Returns a record whose `carry` flag says whether it may be handed
 *  to a pane; nothing with carry=false is ever emitted as a citation. */
function resolveCite(cite) {
  const p = resolvePath(cite.cited);
  if (!p.ok) {
    return { ...cite, carry: false, status: p.status, detail: p.detail, candidates: p.candidates };
  }
  const repoPath = p.repoPath;
  const abs = path.join(REPO, repoPath);
  if (!fs.existsSync(abs)) {
    return { ...cite, repoPath, carry: false, status: 'NO-FILE',
      detail: 'tracked by git but absent from the working tree' };
  }
  const curLines = splitLines(fs.readFileSync(abs, 'utf8'));
  const sha = blameSha(cite.noteFile, cite.noteLine);

  if (!sha) {
    // FRESH: no baseline, so drift cannot be checked -- only that the line exists at all.
    if (cite.line > curLines.length) {
      return { ...cite, repoPath, carry: false, status: 'PAST-EOF',
        detail: 'line ' + cite.line + ' but the file has ' + curLines.length };
    }
    return { ...cite, repoPath, carry: true, status: 'FRESH', at: cite.line,
      text: curLines.slice(cite.line - 1, cite.line + cite.span).join('\n'),
      detail: 'the note line is uncommitted, so there is no baseline to check drift against' };
  }

  const old = showAt(sha, repoPath);
  if (old === null) {
    return { ...cite, repoPath, carry: false, status: 'NO-BASELINE', sha,
      detail: 'the master did not exist at ' + sha.slice(0, 7) + ', where the citation was written' };
  }
  const oldLines = splitLines(old);
  if (cite.line > oldLines.length) {
    return { ...cite, repoPath, carry: false, status: 'BASELINE-EOF', sha,
      detail: 'line ' + cite.line + ' was already past EOF (' + oldLines.length + ') when written' };
  }
  const anchor = oldLines[cite.line - 1];
  if (anchor.trim() === '') {
    return { ...cite, repoPath, carry: false, status: 'EMPTY-ANCHOR', sha,
      detail: 'the cited line was blank, so nothing can anchor it through a move' };
  }

  if (cite.line <= curLines.length && curLines[cite.line - 1] === anchor) {
    return { ...cite, repoPath, carry: true, status: 'VERIFIED', sha, at: cite.line,
      text: curLines.slice(cite.line - 1, cite.line + cite.span).join('\n') };
  }

  const at = [];
  for (let i = 0; i < curLines.length; i++) if (curLines[i] === anchor) at.push(i + 1);
  if (at.length === 1) {
    return { ...cite, repoPath, carry: true, status: 'MOVED', sha, at: at[0], movedFrom: cite.line,
      text: curLines.slice(at[0] - 1, at[0] + cite.span).join('\n'),
      detail: 'line ' + cite.line + ' -> ' + at[0] + ' since ' + sha.slice(0, 7) };
  }
  if (at.length > 1) {
    return { ...cite, repoPath, carry: false, status: 'AMBIGUOUS-MOVE', sha,
      detail: 'the cited text now appears at ' + at.length + ' lines (' + at.slice(0, 5).join(', ') + ')' };
  }
  if (cite.line > curLines.length) {
    return { ...cite, repoPath, carry: false, status: 'PAST-EOF', sha,
      detail: 'line ' + cite.line + ' but the file has ' + curLines.length + ', and the text is gone' };
  }
  return { ...cite, repoPath, carry: false, status: 'GONE', sha,
    detail: 'the cited text is nowhere in the file now' };
}

/** Topic match. Every whitespace-separated token must appear somewhere in the block -- its text or
 *  one of its citation paths -- so `librarian shelf` narrows instead of widening. Path-shaped
 *  topics work for free, because the citation paths are part of the haystack. */
function matches(topic, block, cites) {
  const hay = (block.heading + '\n' + block.lines.map((l) => l.text).join('\n') + '\n' +
    cites.map((c) => c.cited).join('\n')).toLowerCase();
  return String(topic).toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
}

function collect(topic) {
  const carried = [];
  const refused = [];
  let blocksMatched = 0;
  const seen = new Set();
  for (const f of noteFiles()) {
    // NEWEST WINS, and "newest" has to mean the newest OCCURRENCE, not the first one encountered.
    // Files are walked newest-first, but within one file the later append is the fresher citation
    // and it carries the fresher baseline — using the earlier one would report MOVED for an
    // address the seat re-cited correctly an hour ago. So the winner per address inside a file is
    // the highest note line; across files, the newest file still wins outright.
    const winners = new Map();
    for (const b of blocks(f)) {
      const cites = extractCites(b);
      if (!matches(topic, b, cites)) continue;
      blocksMatched++;
      for (const c of cites) winners.set(c.cited + ':' + c.line + '-' + c.endLine, c);
    }
    for (const [key, c] of winners) {
      if (seen.has(key)) continue;
      seen.add(key);
      const r = resolveCite(c);
      (r.carry ? carried : refused).push(r);
    }
  }
  return { topic, carried, refused, blocksMatched };
}

function render(res) {
  const n = (s) => res.carried.filter((c) => c.status === s).length;
  const L = [];
  L.push('# librarian citations for "' + res.topic + '"');
  L.push('# ' + res.carried.length + ' carried (' + n('VERIFIED') + ' verified, ' + n('MOVED') +
    ' moved, ' + n('FRESH') + ' fresh) · ' + res.refused.length + ' refused · ' +
    res.blocksMatched + ' note block(s) matched');
  L.push('# index: exo_memory/librarian/*.md — every line below is read from the MASTER, not from the note');
  L.push('');
  for (const c of res.carried) {
    let tag = c.status;
    if (c.status === 'VERIFIED') tag += ' @ ' + c.sha.slice(0, 7);
    if (c.status === 'MOVED') tag += ' ' + c.movedFrom + '->' + c.at + ' @ ' + c.sha.slice(0, 7);
    if (c.status === 'FRESH') tag += ' — no baseline, note line uncommitted';
    const range = c.span ? c.at + '-' + (c.at + c.span) : String(c.at);
    L.push(c.repoPath + ':' + range + '   [' + tag + ']');
    for (const t of splitLines(c.text)) L.push('    ' + t);
    L.push('    ^ indexed by ' + c.noteFile + ':' + c.noteLine + '  "' + c.noteHeading + '"');
    L.push('');
  }
  if (res.refused.length) {
    L.push('REFUSED (' + res.refused.length + ') — not carried. A stale citation reads as');
    L.push('authoritative and resolves to nothing, which is worse than no citation at all.');
    for (const c of res.refused) {
      L.push('  ' + c.raw + '  ' + c.status + ' — ' + c.detail);
      L.push('      cited at ' + c.noteFile + ':' + c.noteLine);
    }
    L.push('');
  }
  return L.join('\n');
}

/** Data, not a verdict. There is no --report in this file on purpose; see the header. */
function logEmission(res, pane, now) {
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  const row = {
    ts: now, topic: res.topic, pane,
    carried: res.carried.map((c) => ({ path: c.repoPath, line: c.at, status: c.status })),
    refused: res.refused.map((c) => ({ raw: c.raw, status: c.status })),
  };
  fs.appendFileSync(LEDGER, JSON.stringify(row) + '\n');
  return row;
}

function main(argv) {
  const args = argv.slice(2);
  const json = args.includes('--json');
  const logAt = args.indexOf('--log');
  const pane = logAt >= 0 ? args[logAt + 1] : null;
  const topic = args
    .filter((a, i) => !a.startsWith('--') && !(logAt >= 0 && i === logAt + 1))
    .join(' ').trim();
  if (!topic) {
    process.stderr.write('usage: node consonance/tools/librarian-cite.js <topic-or-path> ' +
      '[--json] [--log <pane>]\n');
    return 2;
  }
  if (logAt >= 0 && (!pane || pane.startsWith('--'))) {
    process.stderr.write('--log needs a pane name\n');
    return 2;
  }
  const res = collect(topic);
  if (pane) logEmission(res, pane, Date.now());

  // SILENCE IS A VALID TURN. Nothing carried and nothing refused means the notes hold no address
  // for this topic; saying so on stderr keeps stdout paste-clean and keeps the channel quiet.
  if (!res.carried.length && !res.refused.length) {
    process.stderr.write('no citation for "' + topic + '" in ' + noteFiles().length +
      ' note file(s) — nothing surfaced\n');
    return 0;
  }
  process.stdout.write((json ? JSON.stringify(res, null, 2) : render(res)) + '\n');
  return 0;
}

module.exports = { noteFiles, blocks, extractCites, resolvePath, resolveCite, matches, collect,
  render, logEmission, splitLines, trackedIndex, CITE_RE, LEDGER, REPO, NOTES_DIR };

if (require.main === module) process.exit(main(process.argv));
