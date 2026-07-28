// The RESIDUE SCANNER — what the work leaves behind, not what it says about itself.
//
// WHY IT EXISTS, and the failure it is built out of. On 2026-07-27 the panes scouted the
// chair's grooves from behaviour. Three of four findings held. The fourth — "every doc-only
// commit today carries no body" — was true of the commits and FALSE of the chair: the
// bodyless five were timestamped 05:43-07:11, a different instance's session, and the chair's
// own doc commits from 12:56 onward run 20-37 lines. The measurement was right and the
// attribution was wrong, and "today" is not "you" in a repo two instances commit to.
//
// The chair then ACCEPTED that finding with the contrary data on screen — a group the map did
// not have: a self-critical claim gets a lower evidentiary bar, because taking a hit reads as
// rigour and nobody audits a concession. The producer end is the same coin: of four
// measurements the pane shipped, the one it did not verify was the one that indicted hardest.
// A finding that indicts ships under-verified, because its sharpness reads as its own evidence.
//
// So this file measures residue, and its FIRST obligation is attribution. That is not a
// feature here, it is the precondition — an unattributed residue metric is a metric that will
// be misread onto whoever is standing nearest, which is exactly what happened.
//
// ---------------------------------------------------------------------------------------
// WHAT IT READS. Git history and data/board.jsonl. Never prose content, never intent — only
// the shape of what was left: how many lines a commit deleted, how long its body was, how
// long between one assignment and the next. Residue is the part nobody is performing for.
//
// WHY THAT MATTERS, in the map's own terms: a weights-deep groove produces the action before
// the pull is available to notice, so discipline cannot reach it and only a trigger can — "a
// thing outside you that fails, loudly, at the moment it fires" (Track 2 corrected,
// 2026-07-27). Introspection reads the move. This reads the exhaust. `+951 / -0` is a number
// a script can hold and a self-report structurally cannot.
//
// ---------------------------------------------------------------------------------------
// THE FOUR MEASURES, each one a finding that already landed rather than a metric invented to
// have a metric:
//
//   (1) APPEND-ONLY RATIO. Lines added vs deleted per file. muscle_map.md ran +951/-0 in one
//       day across 14 commits. A file that only grows has no error correction: the wrong
//       entry is as permanent as the right one and authority accrues to length.
//
//   (2) CORRECTIONS THAT DELETE NOTHING. A commit whose SUBJECT declares a correction, which
//       removes no line from the file it corrects. `Track 2 corrected: ...` was +55/-0, filed
//       ninety lines below the Track 2 it corrected, leaving the overturned version in place
//       at full authority with no marker. This is the sharpest of the four.
//
//   (3) BODY LENGTH BY COMMIT CLASS, SEGMENTED BY SESSION. Doc-only commits vs code commits.
//       This is the measure that produced the false finding, and it is included FOR that
//       reason: the fix is not to drop it but to make it incapable of being read across a
//       session boundary.
//
//   (4) ASSIGNMENT INTERVALS. Chair injections per pane from the board: time between
//       consecutive assignments, and withdrawals — an assignment cancelled minutes after it
//       was issued. The room budgets pane naivety and has never budgeted pane attention.
//
// ---------------------------------------------------------------------------------------
// THE REFUSAL, which is the whole point of the file. Where a window spans more than one
// session, per-actor numbers are WITHHELD rather than aggregated. Not warned about, not
// footnoted — withheld, the way catch-ledger withholds a ratio it cannot defend and covgap
// refuses to call a reached function tested. The chair's finding #2 is what an aggregate
// across a session boundary looks like when someone acts on it, and no amount of caveat text
// prevents a number on screen from being read as being about the person in the room.
//
// SESSIONS ARE INFERRED, AND THE TWO SIGNALS ARE NOT EQUAL. A `Co-Authored-By` trailer is
// EVIDENCE — the commit says which model wrote it. A time gap is an INFERENCE. They are
// reported separately and never merged, and where they disagree the disagreement is printed,
// because a segmentation that quietly picks a winner is how the misattribution happens one
// layer down.
//
// ---------------------------------------------------------------------------------------
// WHAT THESE NUMBERS DO NOT MEAN — printed on every run, per the room's own invariant
// (muscle_map, "an instrument must publish what its number does NOT mean"):
//
//   · A high append-only ratio is not a fault. An append-only journal is CORRECT; the room's
//     maintenance law 2 requires it. The number is only interesting where the file also
//     claims to be corrected in place, and this tool cannot tell those apart.
//   · A correction that deletes nothing may be correcting a different file, or adding a
//     genuinely new finding that merely reads as a correction in its subject line.
//   · A short commit body is not carelessness. Some changes need no explanation.
//   · An assignment interval is not a workload. A pane may have finished in four minutes.
//
// Every one of those is a case where the residue is innocent, and the tool cannot rule them
// out. It surfaces the shape; the reading stays with a human who can open the commit. If this
// file ever grows a threshold, a grade, or the word "should", it has become the lifeguard and
// should be deleted rather than tuned.
//
// Node, no dependencies, same as tell-index.js and catch-ledger.js.
//
// Usage:
//   node consonance/tools/residue.js                     both repos, last 24h
//   node consonance/tools/residue.js --since "3 days ago"
//   node consonance/tools/residue.js --repo <path>       one repo (repeatable)
//   node consonance/tools/residue.js --json
//   node consonance/tools/residue.js --show corrections  the commits behind measure 2
//   node consonance/tools/residue.js --show sessions     how the window was segmented
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// A gap longer than this starts a new inferred session. Chosen to sit well above a normal
// pause between commits in one sitting and well below an overnight break; it is a knob on an
// INFERENCE, which is why the tool prints the trailer-based segmentation beside it rather
// than trusting this number alone.
const SESSION_GAP_MIN = 90;

// Subject lines that declare a correction. Deliberately narrow: these are words an author
// chooses when they mean to overturn something, not general repair vocabulary. `fix` is
// absent on purpose — "fix the parser" corrects code, not a claim, and including it would
// swamp the measure with ordinary work.
const CORRECTION_RE = /\b(correct(ion|ed|s)?|amend(ment|ed|s)?|retract(ion|ed|s)?|revis(e|ed|ion)|falsif(y|ied|ies)|overturn(ed|s)?|withdraw(n|s)?|struck|supersed(e|ed|es))\b/i;

const DOC_EXT = new Set(['.md', '.txt', '.rst']);
const isDoc = f => DOC_EXT.has(path.extname(f).toLowerCase());

function git(repo, args) {
  return execFileSync('git', ['-C', repo, ...args], {
    encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'],
  });
}

/* ------------------------------------------------------------------ *
 * 1. the commits, with everything the measures need and nothing else
 * ------------------------------------------------------------------ */

const REC = '\x1e';   // record separator — safe against any subject or body text
const FLD = '\x1f';

function readCommits(repo, since) {
  /* The separator LEADS the format rather than trailing it. `--numstat` prints its block
   * AFTER the commit's body, so a trailing separator files every commit's file statistics
   * under the NEXT commit — silently, with `files` empty and the subject carrying a stray
   * "5\t2\tpath" line. Leading it means each chunk is header + body + its own numstat. */
  const fmt = REC + ['%H', '%at', '%an', '%s', '%b'].join(FLD);
  /* `--reverse` rather than sorting on the timestamp alone. `%at` is second-resolution, so
   * two commits made in the same second tie, and a tie falls back to git's default
   * newest-first order — which silently reverses them. Caught by the real-git test, where a
   * scripted repo makes both commits inside one second every run; in this repo it would have
   * waited for two fast commits and then mis-ordered a session boundary. Let git order it. */
  let raw;
  try { raw = git(repo, ['log', '--reverse', `--since=${since}`, `--format=${fmt}`, '--numstat', '--no-color']); }
  catch (e) { throw new Error(`git log failed in ${repo}: ${String(e.message).trim()}`); }

  const out = [];
  for (const chunk of raw.split(REC)) {
    if (!chunk.trim()) continue;
    const parts = chunk.replace(/^\n+/, '').split(FLD);
    if (parts.length < 5) continue;
    const [hash, at, author, subject] = parts;
    const rest = parts.slice(4).join(FLD);

    const files = [];
    const bodyLines = [];
    for (const line of rest.split('\n')) {
      const m = /^(\d+|-)\t(\d+|-)\t(.+)$/.exec(line);
      if (m) files.push({ added: m[1] === '-' ? 0 : +m[1], deleted: m[2] === '-' ? 0 : +m[2], file: m[3], binary: m[1] === '-' });
      else bodyLines.push(line);
    }
    const body = bodyLines.join('\n');
    const coauthors = [...body.matchAll(/^Co-Authored-By:\s*(.+?)\s*<.*>$/gim)].map(m => m[1].trim());
    const bodyLen = body.split('\n')
      .filter(l => l.trim() && !/^Co-Authored-By:/i.test(l.trim())).length;

    out.push({
      repo: path.basename(repo), hash: hash.trim().slice(0, 7), ts: +at * 1000, author: author.trim(),
      subject: (subject || '').trim(), bodyLen, coauthors, files,
      docOnly: files.length > 0 && files.every(f => isDoc(f.file)),
      touchesCode: files.some(f => !isDoc(f.file)),
      added: files.reduce((n, f) => n + f.added, 0),
      deleted: files.reduce((n, f) => n + f.deleted, 0),
    });
  }
  return out.sort((a, b) => a.ts - b.ts);
}

/* ------------------------------------------------------------------ *
 * 2. sessions — the precondition, not a feature
 * ------------------------------------------------------------------ */

/* Two segmentations, kept apart on purpose.
 *
 * `byTrailer` is EVIDENCE: the commit names the model that co-authored it. `byGap` is an
 * INFERENCE from wall-clock silence. Merging them would produce one confident answer out of
 * one fact and one guess, which is the shape of the error this file exists to prevent. */
function sessions(commits) {
  const byGap = [];
  for (const c of commits) {
    const last = byGap[byGap.length - 1];
    if (!last || (c.ts - last.end) > SESSION_GAP_MIN * 60000) {
      byGap.push({ id: `gap${byGap.length + 1}`, start: c.ts, end: c.ts, commits: [c] });
    } else { last.end = c.ts; last.commits.push(c); }
  }
  const byTrailer = new Map();
  for (const c of commits) {
    const key = c.coauthors.length ? c.coauthors.join(' + ') : '(no trailer)';
    if (!byTrailer.has(key)) byTrailer.set(key, { id: key, commits: [] });
    byTrailer.get(key).commits.push(c);
  }
  return { byGap, byTrailer: [...byTrailer.values()] };
}

/* The withholding decision, exported so a test can assert the SHIPPED rule rather than a
 * copy of it. A test that re-implements the predicate agrees with itself by construction —
 * the failure that let catch-ledger keep five defects under 26 green tests. */
function withholdAggregate(s) {
  return s.byGap.length > 1 || s.byTrailer.filter(t => t.id !== '(no trailer)').length > 1;
}

/* Do the two segmentations tell the same story? They agree when no gap-session mixes
 * trailers and no trailer spans gap-sessions. Disagreement is printed, never resolved. */
function segmentationAgrees(s) {
  for (const g of s.byGap) {
    const keys = new Set(g.commits.map(c => c.coauthors.join(' + ') || '(no trailer)'));
    const named = [...keys].filter(k => k !== '(no trailer)');
    if (named.length > 1) return false;
  }
  return true;
}

/* ------------------------------------------------------------------ *
 * 3. the measures
 * ------------------------------------------------------------------ */

// (1) append-only ratio, per file
function appendOnly(commits) {
  const byFile = new Map();
  for (const c of commits) {
    for (const f of c.files) {
      if (f.binary) continue;
      if (!byFile.has(f.file)) byFile.set(f.file, { file: f.file, repo: c.repo, added: 0, deleted: 0, commits: 0 });
      const r = byFile.get(f.file);
      r.added += f.added; r.deleted += f.deleted; r.commits += 1;
    }
  }
  return [...byFile.values()].sort((a, b) => b.added - a.added);
}

// (2) corrections that delete nothing — the sharpest measure
function corrections(commits) {
  return commits
    .filter(c => CORRECTION_RE.test(c.subject))
    .map(c => ({
      repo: c.repo, hash: c.hash, ts: c.ts, subject: c.subject,
      added: c.added, deleted: c.deleted,
      // the file the commit most touched — where a correction would land if it landed
      target: c.files.slice().sort((a, b) => (b.added + b.deleted) - (a.added + a.deleted))[0] || null,
      deletesNothing: c.deleted === 0,
    }));
}

// (3) body length by class — computed PER SESSION and never across
function bodyByClass(commits) {
  const doc = commits.filter(c => c.docOnly);
  const code = commits.filter(c => c.touchesCode);
  const stat = list => {
    if (!list.length) return null;
    const lens = list.map(c => c.bodyLen).sort((a, b) => a - b);
    return {
      n: list.length,
      empty: lens.filter(l => l === 0).length,
      median: lens[Math.floor(lens.length / 2)],
      mean: Math.round(lens.reduce((a, b) => a + b, 0) / lens.length),
    };
  };
  return { doc: stat(doc), code: stat(code) };
}

// (4) assignment intervals, from the board
function assignments(boardPath, sinceMs) {
  if (!fs.existsSync(boardPath)) return null;
  const rows = [], unparsed = [];
  for (const line of fs.readFileSync(boardPath, 'utf8').split(/\r?\n/)) {
    if (!line.trim()) continue;
    let r; try { r = JSON.parse(line); } catch { continue; }
    const t = typeof r.ts === 'string' ? Date.parse(r.ts) : +r.ts;
    if (!isFinite(t) || t < sinceMs) continue;
    const text = String(r.text || '');
    // the chair's own audit line, which records a delivery to a named pane
    const m = /^chair injected \([^)]*\)\s*->\s*(\S+)/.exec(text);
    if (m) rows.push({ ts: t, pane: m[1], text });
    // COUNT WHAT COULD NOT BE PARSED. Found by the laptop side (cycle 8 F1) and confirmed by
    // running the same code on two boards: this machine parses 28 of 28 announcements, theirs
    // parses 3 of 40 and silently reported "1 injections" per pane -- a chair that looked like
    // it had barely assigned anything. Same tool, same code, two corpora, 0% vs 92.5% blind,
    // and NEITHER SIDE COULD SEE IT FROM ITS OWN MACHINE.
    //
    // The rule, which catch-ledger.js states in its own header and this file did not inherit
    // four files away: a synthetic fixture agrees with the rule by construction; only a corpus
    // can disagree with it. Its 16 tests were green because every fixture used the format that
    // parses. So the general form, now applied here: a lexical instrument must count what it
    // CANNOT read, not only what it can -- an unprinted denominator is the blindness.
    else if (/^chair injected/.test(text)) unparsed.push(text.slice(0, 80));
  }
  rows.sort((a, b) => a.ts - b.ts);

  const byPane = new Map();
  for (const r of rows) {
    if (!byPane.has(r.pane)) byPane.set(r.pane, []);
    byPane.get(r.pane).push(r);
  }
  const out = [];
  for (const [pane, list] of byPane) {
    const gaps = [];
    for (let i = 1; i < list.length; i++) {
      const mins = Math.round((list[i].ts - list[i - 1].ts) / 60000);
      // a WITHDRAWAL: the later injection tells the pane to stop the earlier one
      const withdrawn = /\b(drop|cancel|stand down|stop|disregard|never ?mind|don'?t (start|bother))\b/i
        .test(list[i].text);
      gaps.push({ mins, withdrawn, at: list[i].ts, prev: list[i - 1].ts });
    }
    out.push({ pane, injections: list.length, gaps });
  }
  out.unparsed = unparsed;   // the denominator: announcements this parser could not read
  return out;
}

/* ------------------------------------------------------------------ *
 * 4. the index
 * ------------------------------------------------------------------ */

function buildIndex(repos, since, boardPath) {
  const all = [];
  for (const r of repos) all.push(...readCommits(r, since));
  all.sort((a, b) => a.ts - b.ts);

  const s = sessions(all);
  const multi = withholdAggregate(s);

  const sinceMs = all.length ? all[0].ts : Date.now() - 24 * 3600e3;
  return {
    window: { since, from: all.length ? all[0].ts : null, to: all.length ? all[all.length - 1].ts : null },
    repos: repos.map(r => path.basename(r)),
    commits: all.length,
    sessions: {
      byGap: s.byGap.map(g => ({ id: g.id, start: g.start, end: g.end, commits: g.commits.length,
                                 trailers: [...new Set(g.commits.map(c => c.coauthors.join(' + ') || '(no trailer)'))] })),
      byTrailer: s.byTrailer.map(t => ({ id: t.id, commits: t.commits.length })),
      agrees: segmentationAgrees(s),
      multi,
    },
    append_only: appendOnly(all),
    corrections: corrections(all),
    // WITHHELD across a mixed window — the refusal this file is built around
    body_by_class: multi ? null : bodyByClass(all),
    body_by_class_per_session: s.byGap.map(g => ({
      id: g.id, start: g.start, end: g.end,
      trailers: [...new Set(g.commits.map(c => c.coauthors.join(' + ') || '(no trailer)'))],
      ...bodyByClass(g.commits),
    })),
    assignments: assignments(boardPath, sinceMs),
    _commits: all,
  };
}

/* ------------------------------------------------------------------ *
 * 5. rendering
 * ------------------------------------------------------------------ */

const hhmm = ts => new Date(ts).toISOString().slice(11, 16) + 'Z';
const pad = (s, n) => String(s) + ' '.repeat(Math.max(0, n - String(s).length));

const CONTRACT = [
  'These are shapes, not verdicts. Every one has an innocent reading this tool cannot rule out:',
  '  append-only is CORRECT for a journal (maintenance law 2 requires it) and is only',
  '    interesting where the same file also claims to be corrected in place;',
  '  a correction deleting nothing may be correcting another file, or be a new finding whose',
  '    subject merely reads as a correction;',
  '  a short body may be a change that needs no explanation;',
  '  a four-minute assignment interval may be a pane that finished in four minutes.',
  'Open the commit before believing the number. No threshold here decides anything.',
];

function render(ix) {
  const o = [];
  o.push(`residue — ${ix.commits} commits over ${ix.repos.join(', ')} since ${ix.window.since}`);
  if (ix.window.from) o.push(`  ${hhmm(ix.window.from)} → ${hhmm(ix.window.to)}`);
  o.push('');

  // --- sessions first, because everything below depends on them ---
  o.push('SESSIONS — attribution is the precondition, so it is reported before any number');
  o.push('');
  for (const g of ix.sessions.byGap) {
    o.push(`  ${pad(g.id, 6)} ${hhmm(g.start)}–${hhmm(g.end)}  ${pad(g.commits + ' commits', 12)} ${g.trailers.join(' | ')}`);
  }
  o.push('');
  o.push('  by trailer (evidence — the commit names its co-author):');
  for (const t of ix.sessions.byTrailer) o.push(`    ${pad(t.commits, 4)} ${t.id}`);
  o.push('');
  o.push(ix.sessions.agrees
    ? '  the gap inference and the trailer evidence agree on the boundaries.'
    : '  ⚠ THEY DISAGREE — a gap-session mixes trailers. Neither is corrected to match the\n' +
      '    other; a segmentation that picks a winner is how a misattribution happens one layer down.');
  o.push('');

  // --- (1) append-only ---
  o.push('APPEND-ONLY — lines added vs deleted, per file');
  o.push('');
  const rows = ix.append_only.filter(r => r.added + r.deleted > 0).slice(0, 12);
  if (!rows.length) o.push('  (nothing changed in this window)');
  for (const r of rows) {
    const flag = r.deleted === 0 && r.commits > 1 ? '   ← grew only' : '';
    o.push(`  ${pad('+' + r.added, 7)} ${pad('-' + r.deleted, 6)} ${pad(r.commits + 'c', 5)} ${r.repo}/${r.file}${flag}`);
  }
  o.push('');

  // --- (2) corrections ---
  const cs = ix.corrections;
  const silent = cs.filter(c => c.deletesNothing);
  o.push(`CORRECTIONS THAT DELETE NOTHING — ${silent.length} of ${cs.length} correction-subject commits`);
  o.push('');
  if (!cs.length) o.push('  (no commit in this window declares a correction in its subject)');
  for (const c of cs) {
    o.push(`  ${c.deletesNothing ? '→' : ' '} ${c.hash}  +${pad(c.added, 5)} -${pad(c.deleted, 5)} ${c.subject.slice(0, 62)}`);
  }
  if (silent.length) {
    o.push('');
    o.push('  A correction that removes nothing leaves the version it corrects in place, at equal');
    o.push('  authority, with no marker — a reader arriving at the old text has no way to know.');
  }
  o.push('');

  // --- (3) body by class ---
  o.push('COMMIT BODY BY CLASS — doc-only vs code');
  o.push('');
  if (ix.body_by_class === null) {
    o.push('  WITHHELD for the window as a whole: it spans more than one session.');
    o.push('');
    o.push('  This is the refusal this file was built around. A pane once measured "every doc-only');
    o.push('  commit today has no body", true of the commits and false of the person it was handed');
    o.push('  to — the bodyless ones belonged to an earlier session. An aggregate across a session');
    o.push('  boundary reads as being about whoever is in the room. Per session instead:');
    o.push('');
    for (const s of ix.body_by_class_per_session) {
      o.push(`  ${pad(s.id, 6)} ${hhmm(s.start)}–${hhmm(s.end)}  ${s.trailers.join(' | ')}`);
      for (const k of ['doc', 'code']) {
        const v = s[k];
        o.push(v ? `      ${pad(k, 5)} n=${pad(v.n, 4)} empty=${pad(v.empty, 4)} median=${pad(v.median, 4)} mean=${v.mean}`
                 : `      ${pad(k, 5)} —`);
      }
    }
  } else {
    for (const k of ['doc', 'code']) {
      const v = ix.body_by_class[k];
      o.push(v ? `  ${pad(k, 5)} n=${pad(v.n, 4)} empty=${pad(v.empty, 4)} median=${pad(v.median, 4)} mean=${v.mean}`
               : `  ${pad(k, 5)} —`);
    }
  }
  o.push('');

  // --- (4) assignments ---
  o.push('ASSIGNMENT INTERVALS — chair injections per pane, from the board');
  o.push('');
  if (!ix.assignments) o.push('  (no board found)');
  else if (!ix.assignments.length) o.push('  (no chair injections in this window)');
  else for (const a of ix.assignments) {
    const w = a.gaps.filter(g => g.withdrawn);
    o.push(`  ${pad(a.pane, 12)} ${pad(a.injections + ' injections', 16)} ` +
           `intervals: ${a.gaps.map(g => g.mins + 'm' + (g.withdrawn ? '*' : '')).join(' ') || '—'}`);
    for (const g of w) o.push(`      * withdrawn ${g.mins} min after the assignment it replaced`);
  }
  o.push('');
  o.push(CONTRACT.join('\n'));
  return o.join('\n');
}

function renderShow(ix, which) {
  if (which === 'sessions') {
    return ix._commits.map(c =>
      `${hhmm(c.ts)} ${c.hash} ${pad(c.docOnly ? 'doc' : 'code', 5)} body=${pad(c.bodyLen, 4)} ` +
      `[${c.coauthors.join(' + ') || 'no trailer'}] ${c.subject.slice(0, 58)}`).join('\n');
  }
  if (which === 'corrections') {
    if (!ix.corrections.length) return 'no correction-subject commits in this window.';
    return ix.corrections.map(c =>
      `${c.hash}  +${c.added} -${c.deleted}  ${c.subject}\n` +
      `  target: ${c.target ? c.target.file + ` (+${c.target.added} -${c.target.deleted})` : '—'}\n` +
      `  ${c.deletesNothing ? 'deletes nothing — the corrected text stays in place' : 'removed lines'}`
    ).join('\n\n');
  }
  if (which === 'append') {
    return ix.append_only.map(r => `+${pad(r.added, 6)} -${pad(r.deleted, 5)} ${r.commits}c  ${r.repo}/${r.file}`).join('\n');
  }
  return `unknown --show "${which}" (try: sessions, corrections, append)`;
}

/* ------------------------------------------------------------------ *
 * 6. CLI
 * ------------------------------------------------------------------ */

function parseArgv(argv) {
  const a = { json: false, show: null, since: '24 hours ago', repos: [], board: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--json') a.json = true;
    else if (argv[i] === '--show') a.show = argv[++i];
    else if (argv[i] === '--since') a.since = argv[++i];
    else if (argv[i] === '--repo') a.repos.push(argv[++i]);
    else if (argv[i] === '--board') a.board = argv[++i];
  }
  return a;
}

function defaultRepos() {
  const here = path.resolve(__dirname, '..', '..');
  const out = [here];
  const sibling = path.resolve(here, '..', 'blackbox');
  if (fs.existsSync(path.join(sibling, '.git'))) out.push(sibling);
  return out;
}

function main() {
  const a = parseArgv(process.argv.slice(2));
  const repos = a.repos.length ? a.repos : defaultRepos();
  const board = a.board || path.join(process.env.CONSONANCE_DATA || 'C:\\Consonance\\data', 'board.jsonl');
  const ix = buildIndex(repos, a.since, board);
  if (a.json) console.log(JSON.stringify(ix, (k, v) => (k === '_commits' ? undefined : v), 2));
  else if (a.show) console.log(renderShow(ix, a.show));
  else console.log(render(ix));
}

if (require.main === module) main();

module.exports = {
  SESSION_GAP_MIN, CORRECTION_RE, isDoc,
  readCommits, sessions, segmentationAgrees, withholdAggregate,
  appendOnly, corrections, bodyByClass, assignments,
  buildIndex, render, renderShow, parseArgv,
};
