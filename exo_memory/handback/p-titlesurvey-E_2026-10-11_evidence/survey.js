#!/usr/bin/env node
// D299 part 1 (pane E): survey the candidate SOURCES for an index entry's shown title. MEASURE ONLY: reads the D296 snapshot and the D297 NEW
// strict dump, writes only --out. No legibility judgment anywhere here (that is B's, sealed blind to this output).
// Plan: exo_memory/loop/plan_claim_first_titles_d299_2026-10-11.md, part 1. Hand-back: exo_memory/handback/p-titlesurvey-E_2026-10-11.md.
//
// The shown text of every candidate goes through the SAME cut as today: indexTitle() is main.rs `index_title` (:7599-7615 at 613921a9), so a
// candidate differs from today's only in its SOURCE. Candidate (a) is today's: stripLeadLabel() + indexTitle() are main.rs :7513-7597 ported
// line for line, and the run checks (a) against the title the dump actually printed for every entry (parity).
//   (a) today's title: index_title(strip_lead_label(path, heading)), the D297 baseline
//   (b) the heading's last clause: the text after the LAST " — " or ": " in the heading; a heading with neither is kept whole (counted as no-sep)
//   (c) the body's first sentence: the first line after the heading that is prose (skips blank lines, headings, code fences, tables, rules,
//       comments), leading quote/list markers and ** / __ removed, up to the first . ! ? followed by a space or the line's end
//   (d) the heading minus every word the path already shows (main.rs `path_shows`, B's §3 rule), leading/trailing separators trimmed
//   (e) FIFTH, added from the data and labelled so: the heading after its FIRST " — " or ": " (see E_LABEL below for why)
//
// Run: node survey.js --snap <D296 snapshot> --dump <new3/librarian.strict.md> --sample <label_strip_registration.md> --out <dir>
'use strict';
const fs = require('fs');
const path = require('path');

const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : undefined; };
const SNAP = arg('--snap'), DUMP = arg('--dump'), SAMPLE = arg('--sample'), OUT = arg('--out');
if (!SNAP || !DUMP || !SAMPLE || !OUT) { console.error('usage: survey.js --snap <dir> --dump <strict.md> --sample <registration.md> --out <dir>'); process.exit(2); }

const CAP = 40;   // INDEX_TITLE_CHARS, main.rs:7508
const chars = (s) => Array.from(s);

// ---- main.rs ports -----------------------------------------------------------------------------
function indexTitle(head) {                                    // :7599-7615
  if (head === '') return '(no title)';
  const c = chars(head);
  if (c.length <= CAP) return head;
  const cut = c.slice(0, CAP).join('');
  const i = cut.lastIndexOf(' ');
  let kept = i > 0 ? cut.slice(0, i) : cut;
  kept = kept.replace(/[\s,;:\-—–]+$/u, '');
  return `${kept} ...`;
}
function isLedgerId(w) {                                       // :7579-7588
  if (w.startsWith('P-')) return w.slice(2).split('-').every((p) => p !== '' && /^[A-Z0-9]+$/.test(p));
  const m = /^([A-Z]*)([0-9]*)(.*)$/s.exec(w);
  const caps = m[1].length, digits = m[2].length, tail = m[3];
  return caps >= 1 && caps <= 2 && digits >= 1 && digits <= 4 && (tail === '' || /^[a-z]$/.test(tail));
}
function pathShows(p, word) {                                  // :7592-7597
  const w = word.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
  return w !== '' && p.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).some((t) => t === w || (t.length >= 4 && w.startsWith(t)));
}
function stripLeadLabel(p, head) {                             // :7529-7574
  if (chars(head).length <= CAP) return head;
  const words = head.split(' ');
  let ledger = false, i = 0;
  while (i < words.length) {
    const w = words[i];
    if (w === '—' || w === '–' || w === '·') { if (!ledger) return head; i += 1; break; }
    const core = w.replace(/^\(+/, '').replace(/[,:)]+$/, '');
    const arg2 = words[i + 1] !== undefined ? words[i + 1].replace(/[,:)]+$/, '') : undefined;
    if (isLedgerId(core)) { ledger = true; i += 1; }
    else if (['packet', 'part', 'item', 'step', 'pane', 'lap', 'Lap'].includes(core) && arg2 !== undefined && arg2.length >= 1 && arg2.length <= 3 && /^[A-Za-z0-9]+$/.test(arg2)) i += 2;
    else if (pathShows(p, core)) i += 1;
    else return head;
    if (words[i - 1].endsWith(':')) { if (!ledger) return head; break; }
    if (i === words.length) return head;
  }
  const at = words.slice(0, i).reduce((a, w) => a + w.length + 1, 0);
  const rest = head.slice(Math.min(at, head.length)).trim();
  return rest !== '' ? rest : head;
}
// main.rs :7514: the first line starting "# ", with every leading "# " removed, trimmed. Rust lines() drops a trailing \r.
const linesOf = (body) => body.split('\n').map((l) => l.replace(/\r$/, ''));
function headingOf(body) {
  const ls = linesOf(body);
  const i = ls.findIndex((l) => l.startsWith('# '));
  if (i < 0) return { head: '', at: -1 };
  let h = ls[i]; while (h.startsWith('# ')) h = h.slice(2);
  return { head: h.trim(), at: i };
}

// ---- the candidates ----------------------------------------------------------------------------
function lastClause(head) {
  const a = head.lastIndexOf(' — '), b = head.lastIndexOf(': ');
  if (a < 0 && b < 0) return { text: head, nosep: true };
  const [pos, len] = a > b ? [a, 3] : [b, 2];
  return { text: head.slice(pos + len).trim(), nosep: false };
}
function firstSentence(body, at) {
  const ls = linesOf(body).slice(at + 1);
  let fence = false;
  for (const l0 of ls) {
    const l = l0.trim();
    if (l.startsWith('```')) { fence = !fence; continue; }
    if (fence || l === '' || l.startsWith('#') || l.startsWith('|') || /^(-{3,}|\*{3,}|_{3,})$/.test(l) || l.startsWith('<!--')) continue;
    let s = l.replace(/^(>\s*)+/, '').replace(/^([-*+]|\d+[.)])\s+/, '').replace(/\*\*|__/g, '').trim();
    if (s === '') continue;
    const m = /[.!?](\s|$)/.exec(s);
    return m ? s.slice(0, m.index + 1).trim() : s;
  }
  return '';
}
function headMinusPath(p, head) {
  const kept = head.split(' ').filter((w) => w !== '' && !pathShows(p, w)).join(' ');
  return kept.replace(/^[\s—–·:;,.\-–|()]+/u, '').replace(/[\s—–·:;,\-–|(]+$/u, '').replace(/\s+/g, ' ').trim();
}
// (e), FIFTH, ADDED FROM THE DATA: the first run showed (b)'s LAST clause landing on a trailing stamp in B's 30 (#5 "…, 2026-08-24", #8 "D162
// resumed, pane E, 2026-10-01", #18 a "**NOT FOR LANDING" tail). The mechanical alternative is the text after the FIRST " — " or ": ".
const E_LABEL = 'the heading after its FIRST " — " or ": " (no separator: kept whole)';
function firstClause(head) {
  const a = head.indexOf(' \u2014 '), b = head.indexOf(': ');
  if (a < 0 && b < 0) return head;
  const [pos, len] = a >= 0 && (b < 0 || a < b) ? [a, 3] : [b, 2];
  return head.slice(pos + len).trim();
}
// a STAMP in a clause: a date, a clock time, or a pane/seat/machine attribution; counted for (b) and (e), mechanically, as a fact, not a judgment
const hasStamp = (s) => /\b20\d\d-\d\d-\d\d\b|\b\d\d:\d[\dx]\b|\bpane [A-Z]\b|\bon [DL]\b|\bmachine [DL]\b/.test(s);

// ---- the measures (no legibility judgment) --------------------------------------------------------
const lettersOf = (w) => (w.match(/[A-Za-z]/g) || []).length;
// PATH-RESTATING: the shown text carries no word of 3+ letters that the path does not already show (B's §3 subject-word unit), the cut's " ..." ignored
const restates = (p, shown) => shown === '(no title)' || !shown.replace(/ \.\.\.$/, '').split(/\s+/).some((w) => lettersOf(w) >= 3 && !pathShows(p, w));

// ---- the entries -------------------------------------------------------------------------------
const dump = fs.readFileSync(DUMP, 'utf8').split(/\r?\n/);
const iNot = dump.findIndex((l) => l.startsWith('## NOT CARRIED'));
const iWin = dump.findIndex((l, i) => i > iNot && l.startsWith('THE INDEX IS WINDOWED'));
const entries = dump.slice(iNot, iWin).filter((l) => l.startsWith('- ')).map((l) => {
  const m = /^- (.+?)  \((\d+) lines\)  (.*)$/.exec(l);
  return { label: m[1], lines: Number(m[2]), dumped: m[3] };
});
const isTier = (e) => /^(map|journal|loop|handback)\//.test(e.label);

const rows = entries.map((e) => {
  const body = fs.readFileSync(path.join(SNAP, e.label), 'utf8');
  const { head, at } = headingOf(body);
  const b = lastClause(head), c = at >= 0 ? firstSentence(body, at) : '', d = headMinusPath(e.label, head);
  const src = { a: stripLeadLabel(e.label, head), b: b.text, c, d, e: firstClause(head) };
  const shown = Object.fromEntries(Object.entries(src).map(([k, v]) => [k, indexTitle(v)]));
  return { ...e, tier: isTier(e), head, bodyLines: linesOf(body).length - (body.endsWith('\n') ? 1 : 0), nosep: b.nosep, src, shown };
});

// parity: (a) as ported must equal what the dump printed
const parityMiss = rows.filter((r) => r.shown.a !== r.dumped);
const K = ['a', 'b', 'c', 'd', 'e'];
function counts(set) {
  const o = {};
  for (const k of K) o[k] = {
    empty: set.filter((r) => r.src[k] === '').length,
    pathRestating: set.filter((r) => restates(r.label, r.shown[k])).length,
    overCap: set.filter((r) => chars(r.src[k]).length > CAP).length,
    sameShownAsA: set.filter((r) => r.shown[k] === r.shown.a).length,
  };
  o.b.noSeparatorKeptWhole = set.filter((r) => r.nosep).length;
  o.c.noProseLine = set.filter((r) => r.src.c === '').length;
  o.b.stampInSource = set.filter((r) => !r.nosep && hasStamp(r.src.b)).length;
  o.e.stampInSource = set.filter((r) => !r.nosep && hasStamp(r.src.e)).length;
  return o;
}
const tier = rows.filter((r) => r.tier);

// B's fixed 30, by path, in its order (label_strip_registration §1)
const reg = fs.readFileSync(SAMPLE, 'utf8');
const s1 = reg.slice(reg.indexOf('## 1.'), reg.indexOf('## 2.'));
const sample = [...s1.matchAll(/(\d+) `([^`]+\.md)`/g)].map((m) => ({ n: Number(m[1]), label: m[2] }));
const byLabel = new Map(rows.map((r) => [r.label, r]));

fs.mkdirSync(OUT, { recursive: true });
const esc = (s) => String(s).replace(/\|/g, '\\|');
const md = [
  `# title-source survey (generated by survey.js; no legibility judgment)`, '',
  `- dump: ${DUMP}`, `- snapshot: ${SNAP}`,
  `- entries in the dump's per-file index: ${rows.length}; index tier (map/ journal/ loop/ handback/): ${tier.length}`,
  `- parity, candidate (a) as ported vs the title the dump printed: ${rows.length - parityMiss.length}/${rows.length} equal${parityMiss.length ? ' — MISSES: ' + parityMiss.map((r) => r.label).join(', ') : ''}`,
  `- B's fixed sample: ${sample.length} paths; listed in this dump: ${sample.filter((s) => byLabel.has(s.label)).length}`, '',
  '## Counts over the index tier', '',
  '| candidate | empty | path-restating | over-cap (source > 40 chars, so cut) | shown text same as (a) | other |', '|---|---:|---:|---:|---:|---|',
  ...K.map((k) => { const c = counts(tier)[k]; return `| (${k}) | ${c.empty} | ${c.pathRestating} | ${c.overCap} | ${c.sameShownAsA} | ${k === 'b' ? `no separator, heading kept whole: ${c.noSeparatorKeptWhole}; clause holds a date/time/seat stamp: ${c.stampInSource}` : k === 'c' ? `no prose line after the heading: ${c.noProseLine}` : k === 'e' ? `clause holds a date/time/seat stamp: ${c.stampInSource}` : ''} |`; }), '',
  `(e) is a FIFTH candidate, added from the data: ${E_LABEL}.`, '',
  '## Counts over every entry in the per-file index (incl. root and system files)', '',
  '| candidate | empty | path-restating | over-cap |', '|---|---:|---:|---:|',
  ...K.map((k) => { const c = counts(rows)[k]; return `| (${k}) | ${c.empty} | ${c.pathRestating} | ${c.overCap} |`; }), '',
  "## B's fixed 30: the shown text (40-char cut) per candidate", '',
  '| # | path | (a) today | (b) last clause | (c) first sentence | (d) minus path words | (e) first clause [fifth] |', '|---|---|---|---|---|---|---|',
  ...sample.map((s) => { const r = byLabel.get(s.label); return r ? `| ${s.n} | \`${s.label}\` | ${K.map((k) => esc(r.shown[k])).join(' | ')} |` : `| ${s.n} | \`${s.label}\` | NOT LISTED in this dump | | | | |`; }), '',
];
fs.writeFileSync(path.join(OUT, 'survey.md'), md.join('\n'));
// every entry, every candidate: the source and the shown text, one row each. Committed, so two things are masked in the TEXT columns (the counts
// above are computed before masking): a home path becomes <home>, and one private name, matched by its sha256 so this file does not spell it,
// becomes <withheld>. The snapshot line is the master.
const PRIVATE = new Set(['5b3d7e7a15e0c5ffbdf711e09ccbec4ef2e5c814379eec0610cc470466b977b6']);
const sha = (w) => require('crypto').createHash('sha256').update(w).digest('hex');
const mask = (s) => String(s).replace(/[A-Za-z]:[\\/]+Users[\\/]+[^\\/\s`'")]+/gi, '<home>').replace(/C--Users-[A-Za-z0-9]+/g, 'C--Users-<user>')
  .replace(/[A-Za-z0-9]+/g, (w) => (PRIVATE.has(sha(w.toLowerCase())) ? '<withheld>' : w));
const tsv = ['label\ttier\tlines\tcandidate\tsource_chars\tshown\tsource', ...rows.flatMap((r) => K.map((k) => [r.label, r.tier ? 1 : 0, r.lines, k, chars(r.src[k]).length, mask(r.shown[k]), mask(r.src[k])].map((x) => String(x).replace(/[\t\n]/g, ' ')).join('\t')))].join('\n') + '\n';
fs.writeFileSync(path.join(OUT, 'entries.tsv'), tsv);
console.log(md.join('\n'));
