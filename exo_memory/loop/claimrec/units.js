'use strict';
// claimrec/units.js — split a reply into numbered UNITS by the rules of E's registration §4
// (loop/claim_recognition_registration_2026-09-27.md, "THE COST — flagged share, with the splitting rule fixed").
// The coder packet numbers units with this, and COST (flagged units / total units) is counted over the same units.
//
//   node units.js <reply file>        prints "U<n>: <unit text>" per unit
//
// Rules, in the registration's order:
//   1 every fenced code block (``` ... ```) is ONE unit;
//   2 every markdown table row is one unit (|---| separator rows dropped);
//   3 every heading line (#...) is one unit;
//   4 list items (-, *, +, n.) start a new unit;
//   5 the remaining text, and each list item, is split into sentences after . ! or ? followed by whitespace and then an
//     uppercase letter, a digit, a quote, a backtick, * or (. No split inside a backticked span, after e.g. i.e. vs. etc.
//     cf., or after a single-capital-letter initial;
//   6 a blank line always ends a unit;
//   7 units with no letter or digit are dropped.
const fs = require('fs');

const NO_SPLIT_AFTER = new Set(['e.g', 'i.e', 'vs', 'etc', 'cf']);
const START_NEXT = /[A-Z0-9"'`*(“‘]/;

function splitSentences(text) {
  const out = [];
  let start = 0, inTick = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '`') { inTick = !inTick; continue; }
    if (inTick || (ch !== '.' && ch !== '!' && ch !== '?')) continue;
    let j = i + 1;
    if (j >= text.length || !/\s/.test(text[j])) continue;
    while (j < text.length && /\s/.test(text[j])) j++;
    if (j >= text.length || !START_NEXT.test(text[j])) continue;
    if (ch === '.') {
      const before = text.slice(start, i).match(/(\S+)$/);
      const tok = before ? before[1] : '';
      if (NO_SPLIT_AFTER.has(tok.toLowerCase().replace(/^[("'“‘]+/, ''))) continue;
      if (/^[("'“‘]*[A-Z]$/.test(tok)) continue; // single-capital initial
    }
    out.push(text.slice(start, i + 1));
    start = j;
    i = j - 1;
  }
  out.push(text.slice(start));
  return out.map((s) => s.trim()).filter(Boolean);
}

const isFence = (l) => /^\s*```/.test(l);
const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);
const isTableSep = (l) => /^\s*\|[\s:|-]+\|\s*$/.test(l) && /-/.test(l);
const isHeading = (l) => /^\s{0,3}#{1,6}\s/.test(l);
// §4 rule 4 names `-`, `*`, `+` and `n.` only; `n)` is NOT a list marker (fixed L116, was `\d+[.)]`).
const isListStart = (l) => /^\s*([-*+]|\d+\.)\s+/.test(l);

function units(text) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let block = null; // accumulating paragraph or list item (split into sentences at the end)
  const flush = () => { if (block !== null) { out.push(...splitSentences(block)); block = null; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isFence(line)) { // rule 1: the whole fenced block, fences included, is one unit
      flush();
      const body = [line];
      i++;
      while (i < lines.length && !isFence(lines[i])) body.push(lines[i++]);
      if (i < lines.length) body.push(lines[i]);
      out.push(body.join('\n'));
      continue;
    }
    if (!line.trim()) { flush(); continue; } // rule 6
    if (isTableRow(line)) { flush(); if (!isTableSep(line)) out.push(line.trim()); continue; } // rule 2
    if (isHeading(line)) { flush(); out.push(line.trim()); continue; } // rule 3
    if (isListStart(line)) { flush(); block = line.trim(); continue; } // rule 4
    block = block === null ? line.trim() : `${block} ${line.trim()}`; // continuation joins the open block
  }
  flush();
  // RULING 2 (the librarian, be4b03b, on §4 :122-123): a list marker is part of the item's first unit and never a unit of
  // its own, so a unit consisting only of a marker is merged into the unit that follows it (into the one before it if
  // it is last). Without this, rule 5 splits "2. Third …" into a unit "2." that rule 7 keeps for its digit.
  const merged = [];
  for (let k = 0; k < out.length; k++) {
    if (/^([-*+]|\d+[.)])$/.test(out[k].trim())) {
      if (k + 1 < out.length) { out[k + 1] = `${out[k].trim()} ${out[k + 1]}`; continue; }
      if (merged.length) { merged[merged.length - 1] = `${merged[merged.length - 1]} ${out[k].trim()}`; continue; }
    }
    merged.push(out[k]);
  }
  return merged.filter((u) => /[\p{L}\p{N}]/u.test(u)); // rule 7
}

module.exports = { units, splitSentences };

if (require.main === module) {
  const f = process.argv[2];
  if (!f) { console.error('usage: node units.js <reply file>'); process.exit(2); }
  units(fs.readFileSync(f, 'utf8')).forEach((u, k) => console.log(`U${k + 1}: ${u}`));
}
