// count.js (pane E, D307 part 2): figures with and without an as-of, per carrier sample. MEASURE ONLY.
//   node count.js samples/*.txt        -> one table row per file, and per block with --blocks
// A sample file holds blocks separated by lines starting "--- " (the separator line is metadata written by the surveyor,
// never counted). Inside a block:
//   FIGURES  every digit run (thousands separators joined, decimals and a trailing % kept) that is NOT itself an anchor or a
//            label: dates, clock times, shas, ISO stamps, ledger/lap/unit ids (D303, L085, W027, H0752, #63), section signs
//            (§4), path:line refs (:353), version-like x.y.z, digits inside a path or file name, and list/heading ordinals.
//   ANCHOR   for each figure, the best anchor found on ITS OWN LINE, else on the block's FIRST content line (its header):
//            time  = an ISO date-time, or a clock time on a line that also has a date ("10/12/2026, 12:52 AM");
//            sha   = a 7-40 hex string with a letter and a digit (says WHICH state, not when);
//            day   = a date with no time (2026-10-10, "Oct 10");
//            none  = nothing that says when the figure was true.
//   A relative age ("37h", "14s", "idle 15m", "as of 30h ago") counts as a figure; its anchor is the line's or header's like
//   any other, because a relative age is only as good as the stamp it is relative to.
// The rules are heuristics, stated so the counts can be re-derived and argued with; they are not a parser of meaning.
'use strict';
const fs = require('fs');
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const perBlock = process.argv.includes('--blocks');

const ISO = /\b20\d\d-\d\d-\d\d[T ]\d\d:\d\d(?::\d\d(?:\.\d+)?)?Z?\b/g;
const DATE = /\b20\d\d-\d\d-\d\d\b|\b\d{1,2}\/\d{1,2}\/20\d\d\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}\b/g;
const CLOCK = /\b\d{1,2}:\d\d(?::\d\d)?(?:\s?[AP]M)?\b/g;
const SHA = /\b(?=[0-9a-f]*[a-f])(?=[0-9a-f]*\d)[0-9a-f]{7,64}\b/g;
// a path is removed before an anchor is looked for: an instance folder (sibling-5bf9d657) looks like a sha and says nothing
// about when
const PATHLIKE = /[\w.~:-]*[\\/][\w.\\/~-]*|\b(?:sibling|instances)-[0-9a-f]{8}\b/g;
const LABELS = [ISO, DATE, CLOCK, SHA,
  /\b[DLWHT]\d{2,4}\b/g, /#\d+/g, /§\s?\d+(?:\.\d+)*/g, /:\d+(?:-\d+)?\b/g, /\bv?\d+\.\d+\.\d+\b/g,
  /[\w.~-]*[\\/][\w.\\/~-]*\d[\w.\\/~-]*/g, /[\w-]+\d[\w-]*\.(?:md|js|json|jsonl|rs|txt|tsv)\b/g,
  /^\s*(?:#+|\d+\.|-)\s*\d*/g];
const FIG = /\d[\d,]*(?:\.\d+)?%?/g;

function anchorOf(raw) {
  const line = raw.replace(PATHLIKE, ' ');
  if (line.match(ISO) || (line.match(DATE) && line.match(CLOCK))) return 'time';
  if (line.match(SHA)) return 'sha';
  if (line.match(DATE)) return 'day';
  return 'none';
}
const RANK = { time: 3, sha: 2, day: 1, none: 0 };

function figuresIn(line) {
  let masked = line;
  for (const re of LABELS) masked = masked.replace(re, (m) => ' '.repeat(m.length));
  return (masked.match(FIG) || []).filter((f) => /\d/.test(f));
}

const rows = [];
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8').replace(/\r/g, '');
  const blocks = [];
  let cur = null;
  for (const line of text.split('\n')) {
    if (line.startsWith('--- ')) { cur = { label: line.slice(4, 90), lines: [] }; blocks.push(cur); continue; }
    if (!cur) { cur = { label: '(no separator)', lines: [] }; blocks.push(cur); }
    cur.lines.push(line);
  }
  const tot = { time: 0, sha: 0, day: 0, none: 0 };
  for (const b of blocks) {
    const header = b.lines.find((l) => l.trim()) || '';
    const ha0 = anchorOf(header);
    let section = 'none';   // the nearest preceding markdown heading anchors the lines under it (a digest's day, a map entry)
    const bt = { time: 0, sha: 0, day: 0, none: 0 };
    for (const l of b.lines) {
      if (/^\s*#{1,6}\s/.test(l)) section = anchorOf(l);
      const ha = RANK[section] > RANK[ha0] ? section : ha0;
      const la = anchorOf(l);
      const a = RANK[la] >= RANK[ha] ? la : ha;
      for (const _ of figuresIn(l)) { bt[a]++; tot[a]++; }
    }
    if (perBlock) rows.push(`  ${f} | ${b.label} | time ${bt.time} · sha ${bt.sha} · day ${bt.day} · none ${bt.none}`);
  }
  const n = tot.time + tot.sha + tot.day + tot.none;
  rows.push(`${f} | figures ${n} | with an as-of: time ${tot.time}, sha ${tot.sha}, day ${tot.day} | WITHOUT: ${tot.none} (${n ? (100 * tot.none / n).toFixed(0) : 0}%)`);
}
console.log(rows.join('\n'));
