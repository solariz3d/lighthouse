'use strict';
// redact.js — R8b's blind, frozen as code (loop/anchor_similarity_registration_DRAFT_2026-09-15.md §8.9 STEP 0,
// §8.10 K6, K6 CORRECTED at 5a62cd9). Before a scorer sees a hand-back, this removes what names the seat or the arm.
// It is code for the reason s40-strip.js is: prose leaves more than one reading, and a scorer's blind that differs by
// reader is no blind. Its sha256, and arm-words.txt's, are recorded at step 0; a change to either is a new registration.
//
//   usage     node dev/diversity/redact.js <file> [--words <arm-words file>] [--letters B,E]  -> redacted text on stdout
//             default word list: arm-words.txt beside this file
//
//   removes, each replaced by the ONE token TOKEN (so the kind of thing removed is not told):
//     packet    a packet filename, with any directory in front of it: [dir/]packet_<anything>
//     shas      K6 corrected: "<hex>…<hex>" whole (4+ hex each side), then 7–64 hex holding at least one letter a–f AND
//               one digit, any case. A pure-digit run is a FIGURE and is never removed; "defaced" has no digit.
//     §n        "§", an optional space or tab, and the run of word characters, dots and dashes after it
//     letters   [pane:X] · pane:X · pane X · X pane · X's (straight or curly) — for every capital X, A to Z;
//               and two forms these texts carry that K6 does not name: a hand-back filename's letter
//               (p-leave-read-B_2026-09-14.md) and a map file's (map/K.md), a ruling owner "(E)", and a letter
//               before "(pane" ("B (pane 12fb81f6)", p-leave-read-B_2026-09-14.md:3)
//     bare      with --letters only: a standalone capital for each seat letter named (the arm letters recorded at step
//               3b). Never A or I (English words); never a byte unit "190 B", a ruling id "D-2", a drive "E:", "B.md"
//     callsigns every NATO callsign, ALPHA … ZULU, in capitals or Title case (lower-case "echo" and "delta" are code
//               and English, and stay)
//     words     every entry on the arm-word list, whole-word, any case
//
//   keeps: every line. No pattern crosses a line break and no line is removed, so a label's cited LINE NUMBER in the
//   redacted text is the line number in the original.

const fs = require('fs');
const path = require('path');

const TOKEN = '[redacted]';
const NATO = ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'GOLF', 'HOTEL', 'INDIA', 'JULIETT', 'JULIET', 'KILO',
  'LIMA', 'MIKE', 'NOVEMBER', 'OSCAR', 'PAPA', 'QUEBEC', 'ROMEO', 'SIERRA', 'TANGO', 'UNIFORM', 'VICTOR', 'WHISKEY',
  'WHISKY', 'XRAY', 'X-RAY', 'YANKEE', 'ZULU'];
const title = (c) => c[0] + c.slice(1).toLowerCase();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const longestFirst = (xs) => [...xs].sort((a, b) => b.length - a.length).map(esc).join('|');

/** The patterns, in the ORDER they apply. Order matters twice: the abbreviated sha before the plain one (or "…6509"
 *  would survive after its head was taken), and packet filenames before the word list (or "packet_" would be split). */
function patterns(words, letters) {
  letters = letters || [];
  if (letters.some((L) => L === 'A' || L === 'I')) throw new Error('--letters cannot take A and I: they are English words, so a bare one is not a seat');
  if (letters.some((L) => !/^[A-Z]$/.test(L))) throw new Error(`--letters takes single capitals, got ${letters.join(',')}`);
  return [
    /(?:[\w.-]+\/)*packet_[\w.-]+/g,
    /\b[0-9a-f]{4,}…[0-9a-f]{4,}\b/gi,
    /\b(?=[0-9a-f]*[a-f])(?=[0-9a-f]*[0-9])[0-9a-f]{7,64}\b/gi,
    /§[ \t]?[\w.–-]*/g,
    /\[[Pp]ane:[A-Z]\]/g,
    /\b[Pp]ane:[A-Z]\b/g,
    /\b[Pp]ane[ \t][A-Z]\b/g,
    /\b[A-Z][ \t]pane\b/g,
    /\b[A-Z]['’]s\b/g,
    /\b[A-Z](?=[ \t]\([Pp]ane\b)/g,
    /(?<=-)[A-Z](?=_\d{4}-\d{2}-\d{2})/g,
    /(?<=\bmap\/)[A-Z](?=\.md\b)/g,
    /\([A-Z]\)/g,
    new RegExp(`(?<![\\w-])(?:${longestFirst([...NATO, ...NATO.map(title)])})(?![\\w-])`, 'g'),
    ...(words.length ? [new RegExp(`(?<![\\w-])(?:${longestFirst(words)})(?![\\w-])`, 'gi')] : []),
    // Bare letters, ONLY for the seats named. Not a byte unit ("190 B"), a ruling id ("D-2"), a drive ("E:"), a file
    // ("B.md") or a letter inside a word.
    ...(letters.length ? [new RegExp(`(?<![\\w\\-/.])(?<!\\d[ \\t])(?:${letters.join('|')})(?![\\w\\-'\\u2019:]|\\.\\w)`, 'g')] : []),
  ];
}

/** The entries of an arm-word file: non-blank, non-comment lines, each "word # reason". */
function parseWords(text) {
  return text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => l.split(' # ')[0].trim());
}

/** Every match of every pattern in `text` — [] means nothing named by the blind survives. */
function leaks(text, words, letters) {
  const found = [];
  for (const re of patterns(words, letters)) for (const m of text.matchAll(re)) found.push(m[0]);
  return found;
}

/** Redact line by line, so no removal can ever join, split or drop a line. */
function redact(text, opts) {
  const words = (opts && opts.words) || [];
  const res = patterns(words, opts && opts.letters);
  return text.split('\n').map((line) => res.reduce((l, re) => l.replace(re, TOKEN), line)).join('\n');
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const flag = (name) => { const i = args.indexOf(name); return i < 0 ? null : { i, v: args[i + 1] }; };
  const wf = flag('--words'), lf = flag('--letters');
  const taken = new Set([wf, lf].filter(Boolean).flatMap((f) => [f.i, f.i + 1]));
  const files = args.filter((_, i) => !taken.has(i));
  if (files.length !== 1 || (wf && !wf.v) || (lf && !lf.v)) {
    process.stderr.write('usage: node dev/diversity/redact.js <file> [--words <arm-words file>] [--letters B,E]\n');
    process.exit(2);
  }
  const words = parseWords(fs.readFileSync(wf ? wf.v : path.join(__dirname, 'arm-words.txt'), 'utf8'));
  const letters = lf ? lf.v.split(',').map((x) => x.trim()).filter(Boolean) : [];
  try {
    process.stdout.write(redact(fs.readFileSync(files[0], 'utf8'), { words, letters }));
  } catch (e) {
    process.stderr.write(`${e.message}\n`);
    process.exit(2);
  }
}

module.exports = { TOKEN, NATO, parseWords, leaks, redact, patterns };
