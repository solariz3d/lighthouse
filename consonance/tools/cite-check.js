// CITE-CHECK — a figure ships with the command that reproduces it, or it does not ship.
//
// WHY IT EXISTS. The compression step between a command's output and the sentence about it is
// this room's least guarded surface and its most used (BOOT, the curated-auditor amendment). The
// known-caught list as of 2026-08-15: the ferry 97.2% denominator-birthday error; "234
// assertions" quoted for weeks across three units 2-18x apart; a rematch scorecard saying two
// survivors over data showing three; "~43 KB" for a 50,514-byte file, written INSIDE the document
// proposing the fix for hand-made numbers; "five instances, you caught all five" — asserted,
// never counted, real figure 12. Every one was a figure in prose with no command beside it.
//
// THE FORMAT, already live in the repo (branch_evidence.md): a figure followed on the same line
// by a parenthesized backticked command —
//
//     BOOT is **50,514 bytes** (`stat -c %s exo_memory/BOOT.md`)
//
// TWO MODES, deliberately separate:
//
//   node consonance/tools/cite-check.js <file.md>          LINT: which figures carry a command?
//   node consonance/tools/cite-check.js <file.md> --run    VERIFY: re-run each cited command and
//                                                          check the figure appears in its output
//
// LINT is Tier 2: a rate with a denominator, line numbers, no verdict. An uncited figure is a
// FACT about the document, not an accusation — plenty of prose numbers need no command.
// VERIFY is Tier 1: per citation it returns GREEN (figure in output), RED (command ran, figure
// absent), or NOT-RUN (command could not execute). NOT-RUN is never a green and never a catch —
// the classification discipline is guard-census's, inherited.
//
// THE HONEST BOUNDS, stated up front:
//   1. It guards only formatted figures. A figure written outside the format is invisible to it
//      — the same bound gen-brief has (it guards the generator's output, not hand edits).
//   2. A GREEN means the figure appears in the command's CURRENT output — not that the command
//      answers the question the sentence asks. `find -newermt` ran clean on 2026-08-15 and could
//      not distinguish the two hypotheses it was quoted for. Before trusting a diagnostic, state
//      what the opposite result would have looked like; no checker sees that for you.
//   3. Claim-class: the FORMAT is class-agnostic — any claim a command settles can carry one.
//      The LINT is figures-only, deliberately: the state-claim class measured ~50% metaphor
//      ("the argument is clean") on a 18-hit sample of the Main transcript, 2026-08-15, and a
//      lint at 50% precision is a nag, not an instrument.
//
// VERIFY runs the cited commands. They are shell commands from a document you are asking to
// re-derive — read the doc before --run on a file you did not write.
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// A figure asserted with a unit or as a ratio — deliberately narrow (sourced.js's lesson: prose
// full of numbers is not the target, an ASSERTED figure is). sourced.js is the authority on the
// spirit of this list; this one is for documents rather than transcripts.
const FIGURE_RE = /\b\d[\d,]*(?:\.\d+)?\s*(?:%|percent|bytes?|KB|MB|GB|lines?|files?|tests?|turns?|commits?|instances?|panes?|entries?|tokens?|assertions?|sites?|cases?|runs?|red|green|min(?:utes)?\b|hours?|ms\b)|\b\d[\d,]*(?:\.\d+)?\s+of\s+\d[\d,]*\b/gi;

// A citation: (`command`) on the same line. The backticks are the boundary; an optional
// "cmd:"-style label inside the parens is tolerated.
const CITE_RE = /\(\s*(?:cmd:\s*)?`([^`]+)`\s*\)/g;

const num = s => (s.match(/\d[\d,]*(?:\.\d+)?/) || [''])[0].replace(/,/g, '');

// A citation covers its PARAGRAPH (blank-line-delimited block), not just its line — prose wraps,
// and the room's commands sit at the end of sentences that span lines. Found by running the lint
// on this tool's own deliverable: 20 "uncited" lines, most with the command one line away.
// Verify still prefers same-line figures (tightest pairing) and falls back to the block's.
function scanFile(text) {
  const lines = text.split(/\r?\n/);
  const rows = [];
  let inFence = false;                                      // fenced blocks are output, not prose claims
  let block = 0;
  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) { inFence = !inFence; return; }
    if (!line.trim()) { block++; return; }
    const cites = [...line.matchAll(CITE_RE)].map(m => m[1]);
    const stripped = line.replace(CITE_RE, ' ');            // figures inside a citation are args, not claims
    const inCode = inFence || /^\s{4,}/.test(line);
    const figures = inCode ? [] : [...stripped.matchAll(FIGURE_RE)].map(m => m[0].trim());
    if (figures.length || cites.length) rows.push({ n: i + 1, block, line, figures, cites });
  });
  const citedBlocks = new Set(rows.filter(r => r.cites.length).map(r => r.block));
  rows.forEach(r => { r.blockCited = citedBlocks.has(r.block); });
  return rows;
}

function findBash() {
  for (const p of [
    process.env.CITE_BASH,
    'C:\\Program Files\\Git\\bin\\bash.exe',
    'C:\\Program Files\\Git\\usr\\bin\\bash.exe',
    '/bin/bash', '/usr/bin/bash',
  ]) if (p && fs.existsSync(p)) return p;
  return null;
}

// GREEN / RED / NOT-RUN, never conflated. A non-zero exit that still printed output is judged by
// content and the exit code reported beside it — grep -c exits 1 on zero matches and that zero
// may be exactly the figure claimed.
function verify(cmd, figures, cwd) {
  const bash = findBash();
  const r = bash
    ? spawnSync(bash, ['-c', cmd], { cwd, encoding: 'utf8', timeout: 30000 })
    : spawnSync(cmd, { cwd, encoding: 'utf8', timeout: 30000, shell: true });
  if (r.error || r.stdout == null) return { verdict: 'NOT-RUN', detail: String(r.error || 'no output') };
  const out = (r.stdout + '\n' + (r.stderr || '')).replace(/,(?=\d)/g, '');
  const missing = figures.map(num).filter(Boolean)
    .filter(f => !new RegExp(`(?:^|[^\\d.])${f.replace('.', '\\.')}(?:[^\\d]|$)`).test(out));
  if (r.status !== 0 && missing.length) return { verdict: 'NOT-RUN', detail: `exit ${r.status}: ${out.trim().slice(0, 120)}` };
  return missing.length
    ? { verdict: 'RED', detail: `figure(s) ${missing.join(', ')} not in output: ${out.trim().slice(0, 120)}` }
    : { verdict: 'GREEN', detail: out.trim().slice(0, 80) };
}

function main(argv) {
  const file = argv.find(a => !a.startsWith('--'));
  const run = argv.includes('--run');
  const ci = argv.indexOf('--cwd');
  const cwd = ci >= 0 ? argv[ci + 1] : path.resolve(__dirname, '..', '..');
  if (!file || !fs.existsSync(file)) { console.error('usage: cite-check.js <file.md> [--run] [--cwd <repo>]'); return 2; }

  const rows = scanFile(fs.readFileSync(file, 'utf8'));
  const cited = rows.filter(r => r.figures.length && r.blockCited);
  const uncited = rows.filter(r => r.figures.length && !r.blockCited);
  const total = cited.length + uncited.length;

  console.log(`cite-check — ${path.basename(file)}`);
  console.log(`  ${total} figure-bearing lines · ${cited.length} in a paragraph with a command · ${uncited.length} not\n`);
  if (uncited.length) {
    console.log('  uncited (a fact about the line, not an accusation):');
    for (const r of uncited.slice(0, 20))
      console.log(`    L${String(r.n).padStart(4)}  ${r.figures.slice(0, 3).join(' · ')}  —  ${r.line.replace(/\s+/g, ' ').trim().slice(0, 70)}`);
    if (uncited.length > 20) console.log(`    … ${uncited.length - 20} more`);
  }

  let failed = 0;
  if (run) {
    console.log('\n  verify (GREEN figure-in-output / RED ran-but-absent / NOT-RUN could-not-execute):');
    for (const r of rows.filter(x => x.cites.length)) for (const cmd of r.cites) {
      const figures = r.figures.length ? r.figures
        : rows.filter(x => x.block === r.block && x.figures.length).flatMap(x => x.figures);
      const v = verify(cmd, figures, cwd);
      if (v.verdict !== 'GREEN') failed++;
      console.log(`    L${String(r.n).padStart(4)}  ${v.verdict.padEnd(7)} \`${cmd.slice(0, 60)}\``);
      if (v.verdict !== 'GREEN') console.log(`           ${v.detail}`);
    }
    console.log(`\n  A GREEN means the figure appears in the command's current output — not that the`);
    console.log(`  command can distinguish the hypotheses the sentence is about (find-newermt, 2026-08-15).`);
  }
  return run && failed ? 1 : 0;
}

module.exports = { scanFile, verify, FIGURE_RE, CITE_RE };

if (require.main === module) process.exit(main(process.argv.slice(2)));
