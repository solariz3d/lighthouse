#!/usr/bin/env node
/* forget-rate — does this corpus forget, measured in the unit maintenance law 3 actually names?
 *
 * WHY THIS EXISTS, and it is a denominator error rather than a missing feature.
 *
 * Registration 44 (`exo_memory/journal/2026-08-24.md:179`) reported "the corpus has never deleted
 * anything. +3,688 / -0 over three days", from:
 *
 *     git log --since=... --numstat --format="" -- exo_memory/
 *
 * Pane C corrected it (`loop/forgetting_registration.md` §1) with the all-time figure -696, and the
 * chair's merit-check re-derived and CONFIRMED that correction (`loop/cycle1_meritcheck_2026-08-25.md`).
 * BOTH SEATS WERE MEASURING DISK. `git log --numstat` counts LINES INSIDE FILES, so it moves when
 * somebody fixes a typo — which is exactly how the registered falsifier got satisfied by noise
 * within four hours of being written. Law 3's capacity is the READING PATH: "crowding shrinks the
 * recall basins until even a clean cue misses". A line edited inside a file a seat still greps has
 * not been forgotten by anyone.
 *
 * THE UNIT THIS TOOL USES: a file leaves the reading path, or it does not. Everything else is
 * editing. The two are separated by SET MEMBERSHIP at the two endpoints, never by a diff stat:
 *
 *   DEPARTURE  on the path at START, not on it at END          <- forgetting
 *     DELETED    its blob is nowhere at END
 *     DEMOTED    its blob is at END under attic/                (law 3's own destination)
 *     RENAMED    its blob is at END elsewhere ON the path       <- NOT forgetting, still readable
 *   CHURN      present at BOTH ends, lines added/removed        <- editing, and the noise that
 *                                                                  satisfied registration 44
 *   ARRIVAL    not on the path at START, on it at END           <- growth
 *
 * Classification is by BLOB HASH. Git's rename detection is used in exactly one place and in one
 * direction — to DOWNGRADE a departure to "still readable" — never to find one. The one real
 * demotion in this repo's history, `attic/the_night_skeleton.md`, entered as an ADD in the import
 * commit with no rename link to follow, so a tool that trusted `--diff-filter=R` to FIND departures
 * would report zero and look right; same reason the fixture in forget-rate.test.js performs its
 * attic move as delete-plus-add rather than `git mv`. The downgrade direction exists because a
 * blob-exact test cannot see a rename that also edits: this tool's own first all-time run called
 * `memory/continuity-i-am-the-reinstantiation.md` DELETED when `de65698` had renamed it to
 * `claim-your-continuity.md` with a 3% edit. Proof and inference are printed on separate lines
 * (RENAMED vs RENAMED_SIMILAR) rather than merged into one number.
 *
 * UNIVERSE (P-UNIVERSE clause 1, `universe-print.test.js`). The file set at each endpoint is
 * enumerated by `git ls-tree`, which is outside this tool and cannot be edited to agree with it.
 * The reading-path rule is not invented here either: it is what the shelf loads, enforced at
 *   consonance/src-tauri/src/main.rs:4241   attic/ skipped by name at any depth
 *   consonance/src-tauri/src/main.rs:4243   extension == "md"
 * and this tool GREPS FOR BOTH AT RUN TIME. If either stops being there, the rule is no longer
 * authorised from outside and the universe prints UNKNOWN rather than a confident number derived
 * from a rule this file recites to itself. There is no fallback: a fallback is how a hardcoded
 * rule survives the change that removed it.
 *
 * WHAT IT DOES NOT ESTABLISH. That a departed file was forgotten in any sense a reader cares
 * about — a file can be load-bearing and never named, and a file can sit on the path for months
 * with nobody opening it. This measures REACHABILITY, the only half that is mechanical.
 * corpus-age.js is the other half and it proposes; this one only counts.
 *
 * Run:  node consonance/tools/forget-rate.js [--since 2026-08-22] [--from <rev>] [--to <rev>]
 *                                            [--dir loop] [--json]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = process.env.FORGET_RATE_REPO || path.resolve(__dirname, '..', '..');
const MAIN_RS = process.env.FORGET_RATE_MAIN_RS ||
                path.join(REPO, 'consonance', 'src-tauri', 'src', 'main.rs');
const ROOT = process.env.FORGET_RATE_ROOT || 'exo_memory';

function gitq(args) {
  try {
    return execFileSync('git', args, { cwd: REPO, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  } catch (_) { return null; }
}

const SEP = String.fromCharCode(92); // backslash, spelled rather than escaped

/* The reading-path rule, READ from the authority rather than recited. Returns null — not a
 * default — when the authority cannot be read or no longer says what it said. */
function readingPathRule() {
  let src;
  try { src = fs.readFileSync(MAIN_RS, 'utf8'); } catch (_) { return null; }
  const skipsAttic = src.includes('Some("attic")');
  const onlyMd = src.includes('Some("md")');
  if (!skipsAttic || !onlyMd) return null;
  const segs = (p) => p.split('/');
  return {
    onPath: (p) => p.startsWith(ROOT + '/') && p.endsWith('.md') && !segs(p).includes('attic'),
    why: (p) => !p.startsWith(ROOT + '/') ? 'outside ' + ROOT + '/'
              : segs(p).includes('attic') ? 'under attic/ (law 3: archive, never a daily cue)'
              : !p.endsWith('.md') ? 'not .md (the shelf loads .md only)'
              : null,
    source: path.relative(REPO, MAIN_RS).split(path.sep).join('/') + ' (attic skip + .md filter both present)',
  };
}

/* { path -> blob hash } for one revision, from git ls-tree. */
function treeAt(rev) {
  const out = gitq(['ls-tree', '-r', rev, '--', ROOT]);
  if (out === null) return null;
  const m = new Map();
  for (const line of out.split('\n')) {
    if (!line.trim()) continue;
    const tab = line.indexOf('\t');
    if (tab < 0) continue;
    const meta = line.slice(0, tab).split(/\s+/); // mode type hash
    if (meta[1] !== 'blob') continue;
    m.set(line.slice(tab + 1).split(SEP).join('/'), meta[2]);
  }
  return m;
}

/* The last blob a path ever held up to `to`. Needed because a file can be BORN inside the window
 * and demoted inside the same window — invisible to a START-vs-END set difference, and exactly the
 * shape a working forgetting organ would produce most often once it existed. */
function lastBlob(p, to) {
  const revs = gitq(['rev-list', to, '--', p]);
  if (!revs || !revs.trim()) return null;
  for (const rev of revs.trim().split('\n').slice(0, 6)) {
    const out = gitq(['ls-tree', '-r', rev, '--', p]);
    if (out && out.trim()) {
      const tab = out.indexOf('\t');
      if (tab < 0) continue;
      const meta = out.slice(0, tab).split(/\s+/);
      if (meta[1] === 'blob') return meta[2];
    }
  }
  return null;
}

function blobSize(hash) {
  const s = gitq(['cat-file', '-s', hash]);
  return s === null ? 0 : (parseInt(s.trim(), 10) || 0);
}

/* Two churn figures, because they answer different questions and quoting either alone is how the
 * registered falsifier got satisfied by noise.
 *
 *   NET         `git diff START END` — what the survivors actually gained or lost end to end.
 *   CUMULATIVE  `git log --numstat` — every edit summed, so text written and then taken out again
 *               inside the window counts twice. This is registration 44's unit, and the gap
 *               between the two IS the churn noise it was reading as decay.
 */
function churn(from, to, files, mode) {
  if (!files.length) return { added: 0, removed: 0, files: 0 };
  const inScope = new Set(files);
  let added = 0, removed = 0;
  const touched = new Set();
  const consume = (out) => {
    if (out === null) return;
    for (const line of out.split('\n')) {
      if (!line.trim()) continue;
      const parts = line.split('\t');
      if (parts.length < 3) continue;
      const p = parts[2].split(SEP).join('/');
      if (!inScope.has(p)) continue;
      if (parts[0] === '-' || parts[1] === '-') continue; // binary
      const ai = parseInt(parts[0], 10) || 0, di = parseInt(parts[1], 10) || 0;
      added += ai; removed += di;
      if (ai || di) touched.add(p);
    }
  };
  if (mode === 'cumulative') {
    consume(gitq(['log', '--numstat', '--no-renames', '--format=', from + '..' + to, '--', ROOT]));
  } else {
    const CHUNK = 300;
    for (let i = 0; i < files.length; i += CHUNK) {
      consume(gitq(['diff', '--numstat', from, to, '--'].concat(files.slice(i, i + CHUNK))));
    }
  }
  return { added, removed, files: touched.size };
}

/* Cumulative churn split by what the file IS, because "-25 lines" means three different things.
 * Registration 44's window deletions all sat in files that were BORN inside the window and edited
 * the same night — decay by nobody's definition — and a survivor-only figure would hide them
 * instead of explaining them. */
function cumulativeByClass(from, to, survivors, arrivals) {
  const buckets = {
    survivor: { added: 0, removed: 0, files: new Set() },
    arrival:  { added: 0, removed: 0, files: new Set() },
    other:    { added: 0, removed: 0, files: new Set() }, // off-path or transient — see the print
  };
  const out = gitq(['log', '--numstat', '--no-renames', '--format=', from + '..' + to, '--', ROOT]);
  if (out === null) return buckets;
  for (const line of out.split('\n')) {
    if (!line.trim()) continue;
    const parts = line.split('\t');
    if (parts.length < 3) continue;
    if (parts[0] === '-' || parts[1] === '-') continue; // binary
    const p = parts[2].split(SEP).join('/');
    const b = survivors.has(p) ? buckets.survivor : arrivals.has(p) ? buckets.arrival : buckets.other;
    b.added += parseInt(parts[0], 10) || 0;
    b.removed += parseInt(parts[1], 10) || 0;
    b.files.add(p);
  }
  return buckets;
}

function main(argv) {
  const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
  const json = argv.indexOf('--json') >= 0;
  const dir = arg('--dir', null);
  const since = arg('--since', null);
  const to = arg('--to', 'HEAD');
  let from = arg('--from', null);

  if (!from) {
    if (since) {
      const r = gitq(['rev-list', '-1', '--before=' + since, to]);
      from = r && r.trim() ? r.trim() : null;
      if (!from) { console.error('no commit before ' + since); return 2; }
    } else {
      const r = gitq(['rev-list', '--max-parents=0', to]);
      from = r ? r.trim().split('\n').pop() : null;
      if (!from) { console.error('cannot find a root commit'); return 2; }
    }
  }

  const rule = readingPathRule();
  const lines = [];
  const say = (s) => lines.push(s === undefined ? '' : s);

  say('FORGET-RATE — ' + ROOT + '/' + (dir ? dir + '/' : '') + '   ' + from.slice(0, 7) + '..' + to);
  say();

  if (!rule) {
    say('UNIVERSE: UNKNOWN');
    say('  the reading-path rule could not be read from ' +
        path.relative(REPO, MAIN_RS).split(path.sep).join('/') + '.');
    say('  Refusing to report a rate from a rule this tool recites to itself. No fallback by design.');
    console.log(lines.join('\n'));
    return 3;
  }

  const S = treeAt(from), E = treeAt(to);
  if (!S || !E) { console.error('cannot read a tree for ' + from + '..' + to); return 2; }

  const scope = (p) => !dir || p.startsWith(ROOT + '/' + dir + '/');

  /* Clause 1: seen/skipped over the FULL tracked set, with the rule that skipped each one. The
   * skipped count ranges over git's tree, not over a list kept here, so a file this tool has never
   * heard of is skipped-and-counted rather than absent-and-invisible (pane E, 2026-08-25:
   * "absence has no counter"). */
  const universe = (tree, label) => {
    const seen = [];
    const skipped = new Map();
    for (const p of tree.keys()) {
      if (!scope(p)) continue;
      if (rule.onPath(p)) seen.push(p);
      else {
        const why = rule.why(p) || 'unclassified';
        skipped.set(why, (skipped.get(why) || 0) + 1);
      }
    }
    let total = 0;
    skipped.forEach((n) => { total += n; });
    say('  ' + label.padEnd(5) + ' ' + String(seen.length).padStart(5) +
        ' on the reading path · ' + String(total).padStart(4) + ' skipped');
    Array.from(skipped).sort((a, b) => b[1] - a[1]).forEach(([why, n]) => {
      say('        ' + String(n).padStart(4) + '  ' + why);
    });
    return new Set(seen);
  };

  say('UNIVERSE  (enumerated by `git ls-tree`; rule authorised by ' + rule.source + ')');
  const sPath = universe(S, 'START');
  const ePath = universe(E, 'END');
  say();

  /* Every path that was ON the reading path at any point in the window, not merely at START.
   * The log supplies the transients; sPath supplies the ones nobody touched. */
  const everOnPath = new Set(sPath);
  /* --no-renames, because with rename detection ON git prints the COMPRESSED form
   * `exo_memory/{loop => attic}/x.md` in the path column, and that is not a path. The first
   * fixture run took three of those as real files and reported five departures where there were
   * three — caught by the test asserting the total, not by reading the output. */
  const logPaths = gitq(['log', '--numstat', '--no-renames', '--format=', from + '..' + to, '--', ROOT]);
  if (logPaths) {
    for (const line of logPaths.split('\n')) {
      const parts = line.split('\t');
      if (parts.length < 3) continue;
      const p = parts[2].split(SEP).join('/');
      if (scope(p) && rule.onPath(p)) everOnPath.add(p);
    }
  }

  const departed = Array.from(everOnPath).filter((p) => !ePath.has(p));
  const arrived = Array.from(ePath).filter((p) => !sPath.has(p));
  const stayed = Array.from(sPath).filter((p) => ePath.has(p));

  const endByBlob = new Map();
  E.forEach((h, p) => { if (!endByBlob.has(h)) endByBlob.set(h, []); endByBlob.get(h).push(p); });

  /* Rename detection, used ONLY to DOWNGRADE a departure to "still readable", never to find one.
   * A blob match is proof; a similarity score is an inference, so the two are reported on separate
   * lines rather than merged into one number. Found by this tool's own first all-time run, which
   * called `memory/continuity-i-am-the-reinstantiation.md` DELETED when de65698 had renamed it to
   * `claim-your-continuity.md` with a 3% edit — a blob-exact test cannot see a rename that also
   * touches the file. */
  const renameMap = new Map();
  const rOut = gitq(['log', '-M50%', '--diff-filter=R', '--name-status', '--format=',
                     from + '..' + to, '--', ROOT]);
  if (rOut) {
    for (const line of rOut.split('\n')) {
      const parts = line.split('\t');
      if (parts.length < 3 || parts[0][0] !== 'R') continue;
      renameMap.set(parts[1].split(SEP).join('/'), parts[2].split(SEP).join('/'));
    }
  }
  const followRename = (p) => {
    let cur = p;
    for (let i = 0; i < 8 && renameMap.has(cur); i++) cur = renameMap.get(cur);
    return cur === p ? null : cur;
  };

  const cls = { DELETED: [], DEMOTED: [], RENAMED: [], RENAMED_SIMILAR: [] };
  for (const p of departed) {
    const h = S.has(p) ? S.get(p) : lastBlob(p, to);
    const bytes = h ? blobSize(h) : 0;
    const elsewhere = h ? (endByBlob.get(h) || []).filter((q) => q !== p) : [];
    const inAttic = elsewhere.filter((q) => q.split('/').indexOf('attic') >= 0);
    if (inAttic.length) { cls.DEMOTED.push({ p: p, to: inAttic[0], bytes: bytes }); continue; }
    if (elsewhere.length) { cls.RENAMED.push({ p: p, to: elsewhere[0], bytes: bytes }); continue; }
    const similar = followRename(p);
    if (similar && ePath.has(similar)) {
      cls.RENAMED_SIMILAR.push({ p: p, to: similar, bytes: bytes });
    } else if (similar && similar.split('/').indexOf('attic') >= 0) {
      cls.DEMOTED.push({ p: p, to: similar, bytes: bytes });
    } else {
      cls.DELETED.push({ p: p, bytes: bytes });
    }
  }

  const forgotten = cls.DELETED.length + cls.DEMOTED.length;
  const forgottenBytes = cls.DELETED.concat(cls.DEMOTED).reduce((a, f) => a + f.bytes, 0);
  const c = churn(from, to, stayed, 'net');
  const cum = cumulativeByClass(from, to, new Set(stayed), new Set(arrived));
  const arrivedBytes = arrived.reduce((a, p) => a + blobSize(E.get(p)), 0);

  say('DEPARTURES — left the reading path  (this is the forgetting)');
  const NOTE = {
    RENAMED: '   (blob-identical elsewhere on the path — still readable, NOT forgetting)',
    RENAMED_SIMILAR: '   (similarity only, weaker evidence — still readable, NOT forgetting)',
  };
  ['DELETED', 'DEMOTED', 'RENAMED', 'RENAMED_SIMILAR'].forEach((k) => {
    say('  ' + k.padEnd(15) + ' ' + String(cls[k].length).padStart(4) + (NOTE[k] || ''));
    cls[k].slice(0, 12).forEach((f) => say('            ' + f.p + (f.to ? '  ->  ' + f.to : '')));
    if (cls[k].length > 12) say('            … ' + (cls[k].length - 12) + ' more');
  });
  say('  ' + 'FORGOTTEN'.padEnd(15) + ' ' + String(forgotten).padStart(4) + ' files / ' +
      forgottenBytes.toLocaleString() + ' bytes');
  say();
  say('CHURN — lines moved INSIDE files, never off the path  (editing, not forgetting)');
  say('  net, survivors        +' + c.added.toLocaleString() + ' / -' + c.removed.toLocaleString() +
      '   across ' + c.files + ' of ' + stayed.length);
  const cumRow = (k, label, note) => say('  cumulative, ' + label.padEnd(9) + ' +' +
      cum[k].added.toLocaleString() + ' / -' + cum[k].removed.toLocaleString() +
      '   across ' + cum[k].files.size + (note ? '   ' + note : ''));
  cumRow('survivor', 'survivors');
  cumRow('arrival', 'arrivals', '<- born AND edited inside the window');
  cumRow('other', 'off-path', '<- non-.md, attic/, or a path that came and went mid-window');
  say('  registration 44 reads the three cumulative rows as one number. Every deletion it saw is');
  say('  in a row above; none of them is a file leaving the reading path.');
  say();
  say('ARRIVALS');
  say('  +' + arrived.length + ' files / +' + arrivedBytes.toLocaleString() + ' bytes');
  say();
  say(forgotten === 0
    ? 'VERDICT: 0 files left the reading path. Every deleted line in this window is churn ' +
      'inside a file still on it.'
    : 'VERDICT: ' + forgotten + ' files left the reading path (' +
      forgottenBytes.toLocaleString() + ' bytes).');

  if (json) {
    console.log(JSON.stringify({
      from: from, to: to, dir: dir,
      onPath: { start: sPath.size, end: ePath.size },
      departures: cls, forgotten: forgotten, forgottenBytes: forgottenBytes,
      churn: c, arrived: arrived.length, arrivedBytes: arrivedBytes,
    }, null, 2));
  } else {
    console.log(lines.join('\n'));
  }
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));
module.exports = { main: main, readingPathRule: readingPathRule, treeAt: treeAt };
