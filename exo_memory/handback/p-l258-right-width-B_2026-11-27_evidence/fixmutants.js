// fixmutants.js (pane B, L258): the seven mutants of the older harnesses whose strings the right-width branch changed (NOT APPLIED in the suite), moved to the
// branch's strings with the same meaning: each still removes or breaks exactly what it did, and leaves the new wd / widthR part as the branch has it.
// Exact replacements in the harness files, each expected once; any other count stops the script before anything is written. usage: node fixmutants.js <tree>
'use strict';
const fs = require('fs'), path = require('path');
const T = process.argv[2];
const NOTE = '   // AMENDED (L258, pane B): the right width (D677 b) changed this string; the mutant is the same';
const edits = [
  ['app/test/core-xsec-mutation.test.js', [
    ["from: 'for (const f of [edge, edgeR, start, tube]) f.oninput', to: 'for (const f of []) f.oninput', caughtBy: 'xsec panel: the edge angle and the edge start each redraw' },   // found",
     "from: 'for (const f of [edge, edgeR, widthR, start, tube]) f.oninput', to: 'for (const f of [widthR]) f.oninput', caughtBy: 'xsec panel: the edge angle and the edge start each redraw' },   // AMENDED (L258, pane B): the right width (D677 b) changed this string; the mutant is the same. Found"]]],
  ['test/core_cup_mutation.test.js', [
    ["edits: [[C + 'document.js', \"CHANNELS.filter((ch) => (!OPTIONAL[ch] || P[OPTIONAL[ch]]) && (ch !== 'er' || isSplit(P))).map(\", 'CHANNELS.map(']] },",
     "edits: [[C + 'document.js', \"CHANNELS.filter((ch) => (!OPTIONAL[ch] || P[OPTIONAL[ch]]) && (ch !== 'er' || isSplit(P)) && (ch !== 'wd' || isWidthSplit(P))).map(\", 'CHANNELS.map(']] }," + NOTE]]],
  ['test/core_xsec_mutation.test.js', [
    ["edits: [[C + 'document.js', \"CHANNELS.filter((ch) => (!OPTIONAL[ch] || P[OPTIONAL[ch]]) && (ch !== 'er' || isSplit(P))).map(\", 'CHANNELS.map(']] },",
     "edits: [[C + 'document.js', \"CHANNELS.filter((ch) => (!OPTIONAL[ch] || P[OPTIONAL[ch]]) && (ch !== 'er' || isSplit(P)) && (ch !== 'wd' || isWidthSplit(P))).map(\", 'CHANNELS.map(']] }," + NOTE]]],
  ['test/core_ramp_mutation.test.js', [
    ["edits: [[X, \"if (!['c', 'e', 'er', 'w'].includes(ch)) throw\", 'if (false) throw']] },",
     "edits: [[X, \"if (!['c', 'e', 'er', 'w', 'wd'].includes(ch)) throw\", 'if (false) throw']] }," + NOTE],
    ["edits: [[P, \"    if (!XS_START.has(ch) && ch !== 'w') continue;\", '    if (!XS_START.has(ch)) continue;']] },",
     "edits: [[P, \"    if (!XS_START.has(ch) && ch !== 'w' && ch !== 'wd') continue;\", \"    if (!XS_START.has(ch) && ch !== 'wd') continue;\"]] }," + NOTE],
    ["edits: [[X, '{ w: 40, c: 26, e: 26, er: 26 }', '{ w: 30, c: 26, e: 26, er: 26 }']] },",
     "edits: [[X, '{ w: 40, c: 26, e: 26, er: 26, wd: 40 }', '{ w: 30, c: 26, e: 26, er: 26, wd: 40 }']] }," + NOTE],
    ["edits: [[X, '{ w: 40, c: 26, e: 26, er: 26 }', '{ w: 40, c: 20, e: 26, er: 26 }']] },",
     "edits: [[X, '{ w: 40, c: 26, e: 26, er: 26, wd: 40 }', '{ w: 40, c: 20, e: 26, er: 26, wd: 40 }']] }," + NOTE]]],
];
const out = [];
for (const [rel, reps] of edits) {
  const p = path.join(T, rel), raw = fs.readFileSync(p, 'utf8'), crlf = raw.includes('\r\n');
  let t = crlf ? raw.replace(/\r\n/g, '\n') : raw;
  for (const [from, to] of reps) {
    const n = t.split(from).length - 1;
    if (n !== 1) { console.error(`STOP ${rel}: found ${n}, want 1: ${from.slice(0, 90)}`); process.exit(9); }
    t = t.split(from).join(to);
  }
  out.push([p, crlf ? t.replace(/\n/g, '\r\n') : t, rel, reps.length]);
}
for (const [p, t, rel, k] of out) { fs.writeFileSync(p, t); console.log(`${rel}: ${k} mutant(s) moved`); }
