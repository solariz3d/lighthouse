// rewrite.js <repo> <dir>: the first, mechanical pass of the D578 sweep, IN COMMENT SPANS ONLY (jsscan.comments): the regular forms of a decision number,
// a seat's name and a room path are removed; the reasoning around them is left. What it cannot rewrite cleanly is listed (file:line) for a hand pass.
// Code is never touched: each file is rebuilt from its code slices verbatim and its comments transformed.
'use strict';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { comments } = require('./jsscan.js');
const [, , repo, dir] = process.argv;
const files = execFileSync('git', ['-C', repo, 'ls-files', dir], { encoding: 'utf8' }).trim().split('\n').filter((f) => /\.c?js$/.test(f));
const DN = String.raw`D\d{2,4}[a-z]?(?: (?:part|item|row) \d+[a-z]?| §\d+| R\d+| round-\d+)?`;   // a decision number and its sub-reference
const rules = [
  // a parenthesis that holds only decision numbers: "(D459)", "(D459, D460)", "(D459 R3)"
  [new RegExp(String.raw` ?\((?:${DN})(?:(?:, | and |; |\/)(?:${DN}))*\)`, 'g'), ''],
  // one at the front of a parenthesis or after "; ": "(D459, the user" -> "(the user", "(D459; the user" -> "(the user"
  [new RegExp(String.raw`\((?:${DN})(?:'s)?(?:, |; | )`, 'g'), '('],
  // one at the end of a parenthesis: "…, D459)" -> "…)"
  [new RegExp(String.raw`(?:, |; )(?:${DN})\)`, 'g'), ')'],
  // "D459: " opening a comment line: "// D459: the bank" -> "// the bank"
  [new RegExp(String.raw`(^|\/\/ ?|\/\*\*? ?|\* )(?:${DN})(?:, ${DN})*: `, 'gm'), '$1'],
  // " since D432" and " until D170"
  [new RegExp(String.raw` (?:since|until|from|after|before) (?:${DN})\b`, 'gi'), ''],
  // seat names as authors of a module: "C's buildPath", "A's resolve", "A's core", "pane C's", "seat A,"
  [/\b[A-Z]'s (buildPath|resolve|core|BVH|rigid re-placement|paths|own hook|contract)\b/g, '$1'],
  [/ ?\((?:pane|seat) [A-Z](?:, [^)]*)?\)/g, ''],
  // room paths in parentheses: "(exo_memory/…)" and "(docs/research/… §n)"
  [/ ?\((?:exo_memory|docs\/research)\/[^)]*\)/g, ''],
  // second pass (app/core): a decision number with its part, then ": " or ", ", anywhere in a comment: "// D519 Part 2: under" -> "// under", "pure: D425 part 4, THE" -> "pure: THE"
  [new RegExp(String.raw`\b(?:${DN})(?: [Pp]art \d+)?(?:: |, )(?=[A-Za-z"(])`, 'g'), ''],
  // "(D251: the same" -> "(the same", "(D330: 0.01" -> "(0.01"
  [new RegExp(String.raw`\((?:${DN})(?: [Pp]art \d+)?: `, 'g'), '('],
  // a comment that opens on a decision number and a parenthesis: "// D509 (2026-10-28, the user" -> "// (2026-10-28, the user"
  [new RegExp(String.raw`(\/\/ ?|\* |\/\*\*? ?)(?:${DN})(?: [Pp]art \d+)? \(`, 'g'), '$1('],
  // a parenthesis that is only a seat's design, review, look, profile or measure note (with its room path): "(P's design, exo_memory/… §1-§5)" -> ""
  [/ ?\([A-Z]'s (?:design|review|look|profile|measure|score|catch|survey|seal)\b[^()]*\)/g, ''],
];
const left = [];
let changedFiles = 0, changedComments = 0;
const PTR = /\bD\d{2,4}[a-z]?\b|exo_memory\/|docs\/research\/|\bpane [A-Z]\b|\bseat [A-Z]\b|librarian|\bthe chair\b|keeper|sibling-|\b[A-Z]'s\b|\bp-d\d+/;
for (const f of files) {
  const p = path.join(repo, f), src = fs.readFileSync(p, 'utf8'); let out = '', at = 0, n = 0;
  for (const c of comments(src)) {
    out += src.slice(at, c.start); let t = src.slice(c.start, c.end); const t0 = t;
    for (const [re, to] of rules) t = t.replace(re, to);
    if (t !== t0) n++;
    out += t; at = c.end;
  }
  out += src.slice(at);
  if (out !== src) { fs.writeFileSync(p, out); changedFiles++; changedComments += n; }
  // what is left for the hand pass: comment text only
  const lines = out.split('\n'); const lineOf = (i) => out.slice(0, i).split('\n').length;
  for (const c of comments(out)) { const t = out.slice(c.start, c.end); if (PTR.test(t)) { const parts = t.split('\n'); parts.forEach((l, k) => { if (PTR.test(l)) left.push(`${f}:${lineOf(c.start) + k}`); }); } }
}
console.log(`${dir}: ${files.length} files, ${changedFiles} changed, ${changedComments} comments rewritten; left for the hand pass: ${left.length} lines`);
fs.writeFileSync(path.join(__dirname, `left-${dir.replace(/\//g, '_')}.txt`), left.join('\n') + '\n');
