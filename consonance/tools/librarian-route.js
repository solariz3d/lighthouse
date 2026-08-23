#!/usr/bin/env node
// librarian-route.js - extract the CLAIMS from a commit message, because that is what the
// consumer of this tool said it would read.
//
// WHY THIS EXISTS, and it is a measured failure rather than a convenience.
//
// The Librarian seat holds the whole corpus and its job is fidelity: cite, never recollect. It was
// used ONCE in six hours and eight commits, and the keeper caught that, not the chair. The cause is
// not capability - the chair holds `chair_inject` and can reach the seat any turn. The cause is
// that nothing composes WHAT to send.
//
// A REMINDER WILL NOT FIX IT, and this repo has the number: 171 artifact commits have never been
// ferried to anyone (`node consonance/tools/ferry.js --due | tail -1`). Saying it louder is not
// the repair.
//
// THAT SENTENCE ARRIVED IN THIS BRIEF WITH TWO ERRORS ATTACHED, AND THEY ARE THE POINT. It was
// handed to this pane as "ferry.js prints a routing reminder on every single message and has been
// ignored 171 times (`node consonance/tools/ferry.js --report`)". Pane E refuted it and this pane
// re-derived all of it before writing this line:
//   - `--report` does not print 171. It prints 200 / 106 unmeasured / 94 in window / 25 ferried /
//     69 missed / 73.4%. The command cited does not produce the figure cited.
//   - 171 is `--due`'s count of artifact commits never ferried. Nothing anywhere counts reminder
//     impressions, so "ignored 171 times" is not a measurement of anything.
//   - It does not print on every message and never prints in a pane at all: ferry-watch.js:40
//     exits unless `.chair-token` is in cwd, which is true of instances/main/ and of no sibling
//     (verified by `ls`).
// And the same defect is IN the hook: ferry-watch.js:111 prints its backlog with
// "(node consonance/tools/ferry.js --report)" beside it - a citation that does not resolve, in the
// instrument that emits the number. (Its own backlog is a THIRD denominator: commits older than
// FRESH_HOURS=6 never ferried, 171 today, equal to --due only because nothing in the last six
// hours is unferried.)
//
// A CITATION THAT DOES NOT RESOLVE READS AS VERIFIED, which is worse than an uncited number, and
// it is why class 3 below exists.
//
// AND A DIFF SUMMARISER WOULD HAVE BEEN THE SAME FAILURE IN A NEW FILE. That was the original
// design and the seat killed it, in its own words (exo_memory/librarian/2026-08-23.md, Q1):
//
//     "A composer that hands me a sha + diffstat is a reminder, and I would be reading a diff
//      looking for something. A composer worth reading does one mechanical thing: run cite-check
//      lint over the commit BODY and hand me the figures that have no command beside them, plus
//      the sentences that claim verification. That is better than hand-written, because
//      hand-written dispatches carried the chair's own uncited figures into my lap."
//
// So this is not a diff tool. It reads the commit MESSAGE and extracts two classes:
//
//   1. FIGURES WITH NO COMMAND. The standing rule since 2026-08-02 is that every number in prose
//      must re-derive from one run of a visible instrument. Known-wrong in one night, all
//      published: "24 preregistrations" (real count 25), "52.2% clean" (withdrawn - mixed units,
//      no script), "151 files / 88.7%".
//   2. VERIFICATION CLAIMS. A sentence asserting a check passed - green, byte-identical, exits 0,
//      re-derived, verified, clean. For each: what command is in scope, and IS THAT COMMAND
//      CAPABLE OF THE CLAIM. `cargo check` cited as a test gate is the exact failure: it
//      type-checks and never runs an assertion, so "exits 0" was true and meant much less than it
//      sounded (b20fed5). "Every figure below was read from the source file" is the other shape -
//      a verification claim no command anywhere could settle, and it was false.
//   3. CITED PAIRS, the class the ferry error taught. A figure WITH a command beside it is not
//      thereby true: the pair may not resolve. Every such pair is printed together so one run
//      settles it, and `--verify` actually runs them through cite-check's engine and returns
//      GREEN / RED / NOT-RUN. Without --verify the pairs are listed but do not on their own break
//      silence, because unrun pairs are a fact about the message rather than a finding.
//
// SILENCE IS THE CORRECT OUTPUT when both lists are empty. A channel that fires every time becomes
// one people learn to skip, which is the ferry's whole story. Nothing goes to stdout in that case.
//
// WHAT IS REUSED, AND WHAT COULD NOT BE. cite-check.js is the repo's authority on this format and
// is required here rather than reimplemented: CITE_RE (the `(`cmd`)` convention) and FIGURE_RE (the
// figure vocabulary) both come from it, and its verify() is what --verify calls. Measured against
// the five known failures, cite-check ALONE catches one of five, for three reasons, each of which
// is a real difference between a markdown document and a commit body:
//
//   a. Its FIGURE_RE has a unit list built for documents. "24 preregistrations" carries no unit on
//      that list, so the figure is invisible. EXTRA_FIGURE_RE adds the room's own count nouns and
//      the applied/caught label form.
//   b. It treats a 4-space indent as CODE, deliberately - in a document, indented text is output.
//      In a commit body the indented block IS the result table: "52.2% clean" sits inside one, and
//      cite-check skips it. This tool reads indented lines as claims.
//   c. Its citation scope is the PARAGRAPH. In a commit body one command at the top of a block
//      would launder every figure below it. Scope here is tighter (see CITED_WINDOW).
//
// It also does not do class 2 at all, and says so in its own header: figures only, because the
// state-claim class measured ~50% metaphor on a transcript. Restricted to commit bodies and to a
// named verification vocabulary, that objection is weaker - and class 2 is where the room's
// expensive errors were.
//
// Usage:
//   node consonance/tools/librarian-route.js                    HEAD
//   node consonance/tools/librarian-route.js <sha>              one commit
//   node consonance/tools/librarian-route.js --staged           BEFORE the commit; message on
//                                                               stdin, or --message <file>
//   [--repo <path>] [--verify] [--max N]
//
// --staged MATTERS MORE THAN THE DEFAULT, and the seat's reason is the strongest one available:
// commit messages are the least-checked prose in the repo and the class that survives compaction
// best (shas 72%), so an uncited figure in a body propagates further than one in a journal. Read
// after the fact, the bad figure is already pushed.
//
// --staged REFUSES rather than falling back to .git/COMMIT_EDITMSG. Before a commit that file
// holds the PREVIOUS message, so the fallback would lint the wrong object and return a clean
// verdict about it - "green while measuring the wrong object", which this repo has now shipped
// three times (the process-path staleness check, the pre-test suite number, the cargo check gate).
// A pre-flight refusal is cheaper than a false green.
//
// THE BOUNDS, stated because a tool that hides them is the thing it is guarding against:
//   1. It reads the MESSAGE. It cannot tell a true figure from a false one - only whether the
//      message hands a reader a way to check. Everything it emits is a QUESTION, never a verdict.
//   2. A command is recognised by its leading binary. A command described in words is not
//      detected and its figure is reported uncited. That is the deliberate direction to be wrong
//      in: over-asking costs a question, under-asking costs the check.
//   3. The capability table (WEAK_GATES) is a list of known-weak gates, not a proof of adequacy. A
//      command absent from it is UNJUDGED, never "adequate".
//   4. It cannot see a figure that was never written down, and it says nothing about the diff.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// The shared authority on this format. Reused rather than reimplemented so the two instruments
// cannot drift into disagreeing about the same line.
const { FIGURE_RE, CITE_RE, verify } = require('./cite-check.js');

const REPO = process.env.LIBRARIAN_ROUTE_REPO || path.resolve(__dirname, '..', '..');

// ---------------------------------------------------------------- figures

// Additive to cite-check's FIGURE_RE. Every entry here is a shape that appeared in a real commit
// body this week and that the document-tuned list does not carry.
const COUNT_NOUNS = 'preregistrations?|registrations?|defects?|findings?|catches|hits?|mutants?|mutations?|rows?|items?|claims?|corrections?|figures?|paths?|references?|citations?|checks?|gates?|hooks?|suites?|seats?|dirs?|directories|candidates?|survivors?|arms?|trials?|subjects?';
const LABELS = 'applied|caught|survived|not applied|staged|excluded|dangling|identity|machine|withheld|surfaced|opened|carried|indexed|compared';

// SPELLED-OUT COUNTS, restricted to a countable noun. "Three defects in no journal" is a figure
// and was wrong - the source section lists four - and no digit appears in the sentence. Restricted
// because an unrestricted word-number rule flags ordinary prose ("one of the two reasons").
// "one" is EXCLUDED, measured rather than assumed: across the seven commit bodies it produced 3
// of 90 figures and all three were ordinary English ("the one file the consumer version is built
// on"), never a count anyone would re-derive. The cost is that a genuine "one defect" is missed,
// which is the direction that costs a question rather than a check.
const WORD_NUM = 'two|three|four|five|six|seven|eight|nine|ten|eleven|twelve';
const COUNTABLE = `${COUNT_NOUNS}|files?|tests?|commits?|lines?|panes?|instances?|entries?|assertions?|sites?|cases?`;

const EXTRA_FIGURE_RE = new RegExp([
  `\\b\\d[\\d,]*(?:\\.\\d+)?\\s*(?:${COUNT_NOUNS})\\b`,
  `\\b(?:${LABELS})\\s+\\d[\\d,]*\\b`,
  `\\b\\d[\\d,]*\\s*\\/\\s*\\d[\\d,]*\\b`,          // 290 / 0, 43/44
  `\\b\\d+(?:\\.\\d+)?x\\b`,                        // 2x
  `\\b(?:${WORD_NUM})\\s+(?:${COUNTABLE})\\b`,
].join('|'), 'gi');

// Masked before matching so a date, a time, a sha, a file:line or a version never reads as a
// measurement. Length-preserving, so offsets into the original line stay valid.
const MASKS = [
  /https?:\/\/\S+/g,
  /\b\d{4}-\d{2}-\d{2}\b/g,
  // SLASH DATES, four-digit year only. The short form "8/23" is shape-identical to the ratio
  // "43/44" and masking it would eat real figures - a guard against a speculative date that
  // deletes a measured class is a worse trade than the gap. The four-digit form cannot be a ratio.
  /\b\d{4}\/\d{1,2}\/\d{1,2}\b/g,
  /\b\d{1,2}:\d{2}(?::\d{2})?\b/g,
  /[\w./\\-]+\.[A-Za-z]{1,6}:\d+(?:-\d+)?/g,
  /\bv?\d+\.\d+\.\d+\b/g,
  /\b(?=[0-9a-f]*[a-f])[0-9a-f]{7,40}\b/g,          // sha; must contain a letter, so 1234567 stays a figure
];
function maskLine(line) {
  let out = String(line);
  for (const re of MASKS) out = out.replace(re, m => 'x'.repeat(m.length));
  return out;
}

/** Non-overlapping figures on one line, longest-first where two patterns collide. */
function figuresIn(line) {
  const masked = maskLine(line);
  const hits = [];
  for (const re of [FIGURE_RE, EXTRA_FIGURE_RE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(masked)) !== null) {
      if (!m[0].length) { re.lastIndex++; continue; }
      hits.push({ start: m.index, end: m.index + m[0].length });
    }
  }
  hits.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  const kept = [];
  for (const h of hits) {
    if (kept.some(k => h.start < k.end && k.start < h.end)) continue;
    kept.push(h);
  }
  return kept.sort((a, b) => a.start - b.start).map(h => line.slice(h.start, h.end).trim());
}

// ---------------------------------------------------------------- commands

// A command is recognised by its leading binary (bound 2). Both forms the room writes are
// accepted: the documented `(`cmd`)` citation and the bare command a commit body indents above its
// own output.
const BINARIES = 'node|cargo|npm|npx|git|python|pwsh|powershell|bash|rg|grep|stat|wc|find|sed|awk|jq|md5sum|sha1sum|sha256sum|cmp|diff|fc|ls|dotnet|make';
// QUOTES ARE PART OF THE COMMAND, not a boundary. The first version excluded them and truncated
// `find exo_memory/loop -name '*.md' | grep -icE 'prereg'` to `find exo_memory/loop -name`, which
// --verify then reported as NOT-RUN ("missing argument to -name"). A truncated command produces a
// NOT-RUN, and a NOT-RUN is indistinguishable from a command that genuinely cannot run - so the
// parser was manufacturing the one verdict that means "no information".
const BARE_CMD_RE = new RegExp(`(?:^|[\\s\`("*_>|])((?:${BINARIES})\\s+[^\\n\`]{2,200})`, 'gi');

// A command written in a commit body is followed by its RESULT ("find ... -> 12") or by more
// prose ("cargo check 0, js-suite 44 green"). Both are cut here, so the command text is the
// command rather than the sentence it sits in.
const trimCommand = s => {
  let c = String(s)
    .split(/\s+(?:->|-->|=>|→)\s+/)[0]
    .split(/,\s/)[0]
    .split(/;\s/)[0]
    .trim().replace(/[.,;]+$/, '');
  // A bare command written inside parentheses keeps the closer it never opened.
  while (c.endsWith(')') && !c.includes('(')) c = c.slice(0, -1).trim();
  return c;
};

// A LEADING BINARY IS NOT ENOUGH, and this was a real defect in this file's first run over the
// record: "found by one grep per file" parsed as the command `grep per file`, and it then CITED
// two figures on the neighbouring lines. A false command is worse than a missed one - it launders
// an uncited figure into a cited one, which is the exact direction this tool must not fail in.
// So a candidate must also look like a command: a flag, a path, or a known subcommand.
const SUBCOMMANDS = /^(?:cargo|git|npm|npx|dotnet|make)\s+(?:check|build|test|run|status|diff|log|show|ls-tree|rev-list|install|clean)\b/i;
const looksLikeCommand = (cmd) => {
  const rest = cmd.replace(new RegExp(`^(?:${BINARIES})\\s+`, 'i'), '');
  if (/(?:^|\s)-{1,2}[A-Za-z]/.test(rest)) return true;                 // a flag
  if (/[\w-]+[/\\][\w.-]+|\.[A-Za-z]{1,5}\b/.test(rest)) return true;   // a path or an extension
  return SUBCOMMANDS.test(cmd);                                          // cargo check, git show
};

function commandsIn(line) {
  const out = [];
  for (const re of [CITE_RE, BARE_CMD_RE]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(String(line))) !== null) {
      const cmd = trimCommand(m[1] || '');
      if (cmd && looksLikeCommand(cmd) && !out.includes(cmd)) out.push(cmd);
    }
  }
  return out;
}

// SCOPE. A command covers its own line, the line before and the line after - tighter than
// cite-check's paragraph rule, and deliberately: in a commit body one command at the top of a
// block would otherwise launder every figure below it, which is exactly how "52.2% clean" reads as
// cited when nothing produced it.
const CITED_WINDOW = 1;

// The one widening: a command on the FIRST line of a contiguous indented block heads its own
// output, so the whole block counts as cited. That is what an indented result table under its
// command actually is, and refusing it would flag every line of real output.
function indentedBlockOf(lines, i) {
  const indented = n => n >= 0 && n < lines.length && /^\s{2,}\S/.test(lines[n]);
  if (!indented(i)) return null;
  let start = i;
  while (indented(start - 1)) start--;
  let end = i;
  while (indented(end + 1)) end++;
  return { start, end };
}

// ---------------------------------------------------------------- verification claims

// The vocabulary the seat named, plus the two forms the room writes its gates in. Kept deliberately
// short: a wide list is a nag, and the state-claim class is ~50% metaphor when unrestricted.
const CLAIM_TERMS = [
  ['green', /\bgreen\b/i],
  ['byte-identical', /\bbyte[- ](?:identical|for-byte)\b|\bidentical\b/i],
  ['exits 0', /\bexits? (?:0|zero)\b|\bexit code\b|\bby exit code\b/i],
  ['re-derived', /\bre-?deriv\w*\b|\breproduc\w*\b/i],
  ['verified', /\bverified\b|\bverif(?:y|ies)\b/i],
  ['clean', /\bclean\b/i],
  ['caught N of N', /\bcaught \d+\b|\bapplied \d+\b|\bNOT APPLIED \d+\b/],
  ['passes', /\bpass(?:es|ed)\b|\bpassing\b/i],
  ['matches', /\bmatch(?:es|ing|ed)\b/i],
  ['confirmed', /\bconfirm(?:ed|s)\b/i],
  // METHOD CLAIM - an assertion about where the figures came from, not about the code. "Every
  // figure below was read from the source file, not from the librarian's summary of it" opened an
  // entry in which three figures came from the summary. It is the structurally unauditable class:
  // a limitation is losable exactly when its subject is OUTSIDE the speaker (coat_preregistration,
  // 2026-08-03), and a claim about one's own care has the speaker as its only witness.
  ['method claim', /\b(?:every|each|all)\b[^.]{0,70}\b(?:read|derived|re-?derived|taken|checked|counted)\b[^.]{0,50}\bfrom\b|\b(?:rather than|not)\s+from\s+(?:the\s+|a\s+|its\s+|my\s+)?\w*\s*summary\b/i],
];

// KNOWN-WEAK GATES. A command here cannot support a behavioural claim. Absence from this table is
// UNJUDGED, never adequate (bound 3). Every entry is a failure this repo actually shipped or a
// property of the tool that is not in dispute.
//
// TWO KINDS, and conflating them was a real defect in this file's first run. `deriving: false`
// means the command produces NO MEASUREMENT AT ALL - it compiles or it enumerates - so a figure
// standing beside it is not cited by it, and `cargo check 0, js-suite 44 green of 45` was
// silently laundering the suite figure. A grep is the other kind: it cannot show that code RAN,
// but it counts perfectly well, and treating it as non-deriving would have flagged
// `find ... | grep -icE ... -> 25`, which is one of the few properly cited figures in the record.
const WEAK_GATES = [
  {
    match: /\bcargo\s+check\b/i, deriving: false,
    verdict: 'cargo check TYPE-CHECKS and never runs an assertion - --all-targets does not change that. ' +
      'It was cited as the gate over a generated tree in which a Rust assertion had been rewritten into a form that can never pass (b20fed5).',
  },
  { match: /\bcargo\s+build\b|\bnpm\s+run\s+build\b/i, deriving: false, verdict: 'a build compiles; it runs no assertion.' },
  { match: /--list\b|--dry-run\b|\s-n\s/, deriving: false, verdict: 'this flag ENUMERATES what would run and runs none of it.' },
  { match: /\bnode\s+(?:--check|-c)\b/, deriving: false, verdict: 'node --check parses; it does not execute.' },
  { match: /\bgit\s+(?:status|diff)\b|^ls\b/, deriving: true, verdict: 'this reports repository or filesystem STATE, not the behaviour the sentence claims.' },
  { match: /\bgrep\b/, deriving: true, verdict: 'grep finds a string in a source file. Support cannot be inferred from position (2026-08-16) - presence of the code is not execution of it. It counts; it does not run.' },
];

/** The compile/enumerate class only: these produce no measurement, so they cite no figure. */
const nonDeriving = cmd => !!cmd && WEAK_GATES.some(g => g.deriving === false && g.match.test(cmd));

const HASHERS = /\bmd5sum|sha\d*sum|\bcmp\b|\bdiff\b|\bfc\b|\bgit\s+diff\b|md5|hash/i;

/** Is the command in scope capable of the claim it is standing under? */
function capability(claimText, cmd) {
  if (!cmd) return { verdict: 'NO COMMAND', detail: 'nothing runnable in scope. What single run distinguishes this sentence from its opposite? If no run can, it is an assertion about the author\'s own care and nobody else can check it.' };
  for (const g of WEAK_GATES) if (g.match.test(cmd)) return { verdict: 'WEAK GATE', detail: g.verdict };
  if (/\bbyte[- ](?:identical|for-byte)\b|\bidentical\b/i.test(claimText) && !HASHERS.test(cmd)) {
    return { verdict: 'MISMATCH', detail: 'a byte-identity claim needs a hash or a compare (md5sum / cmp / diff), and this command is neither.' };
  }
  return { verdict: 'UNJUDGED', detail: 'not on the known-weak list. That is not a finding that it is adequate - only that this tool has no entry for it.' };
}

// ---------------------------------------------------------------- the scan

/**
 * scanBody(message) -> { lines, figures: [...], claims: [...] }
 * Pure: no repo, no filesystem. Everything the dispatch prints comes from here.
 */
function scanBody(message) {
  const lines = String(message).split(/\r?\n/);
  const cmds = lines.map(commandsIn);

  // Returns the command AND the line it came from - a claim on L58 backed by a command on L57 is
  // still a real pairing, but the reader has to be told where to look or the report reads as
  // though the sentence carried its own citation.
  const inScope = (i) => {
    for (let d = 0; d <= CITED_WINDOW; d++) {
      for (const j of [i - d, i + d]) {
        if (j >= 0 && j < lines.length && cmds[j].length) return { cmd: cmds[j][0], at: j + 1 };
      }
    }
    const block = indentedBlockOf(lines, i);
    if (block && cmds[block.start].length) return { cmd: cmds[block.start][0], at: block.start + 1 };
    return null;
  };

  const figures = [];
  const claims = [];
  lines.forEach((line, i) => {
    if (!line.trim()) return;
    const scope = inScope(i);
    const cmd = scope ? scope.cmd : null;
    const stripped = line.replace(CITE_RE, ' ');          // a figure inside a citation is an argument
    for (const f of figuresIn(stripped)) {
      // A compile-or-enumerate gate produces no measurement, so it cites nothing. Without this,
      // "cargo check 0, js-suite 44 green of 45" reads as a cited suite figure.
      figures.push({
        text: f, line: i + 1, context: line.trim(),
        cited: !!cmd && !nonDeriving(cmd), command: cmd, commandAt: scope ? scope.at : null,
      });
    }
    const terms = CLAIM_TERMS.filter(([, re]) => re.test(line)).map(([name]) => name);
    if (terms.length) {
      claims.push({
        terms, line: i + 1, context: line.trim(), command: cmd, commandAt: scope ? scope.at : null,
        capability: capability(line, cmd),
      });
    }
  });
  return { lines, figures, claims };
}

// ---------------------------------------------------------------- composing

function compose(subject, scan, opts = {}) {
  const max = opts.max || 8;
  const label = opts.label || 'the staged message';
  const uncited = scan.figures.filter(f => !f.cited);
  const pairs = scan.figures.filter(f => f.cited);
  // A claim already backed by an unjudged command is not silence-worthy on its own; the ones worth
  // a reader's time are the ones with no command or a command that cannot support them.
  const claims = scan.claims.filter(c => c.capability.verdict !== 'UNJUDGED');
  const unjudged = scan.claims.filter(c => c.capability.verdict === 'UNJUDGED');
  // Verdicts arrive already run (opts.verdicts, keyed by figure line+text) when --verify was
  // passed. A RED is a CATCH and breaks silence on its own; an unrun pair never does.
  const verdictOf = f => (opts.verdicts || {})[`${f.line}:${f.text}`] || null;
  const reds = pairs.filter(f => (verdictOf(f) || {}).verdict === 'RED');

  if (!uncited.length && !claims.length && !reds.length) {
    return {
      dispatch: false,
      text: '',
      quiet: `librarian-route: nothing to ask about ${label} - ${scan.figures.length} figure(s), ${pairs.length} with a command in scope; ` +
        `${unjudged.length} verification claim(s), none on the known-weak list` +
        `${opts.verdicts ? '; 0 cited pair(s) failed to resolve' : ''}. No dispatch composed.`,
    };
  }

  const L = [];
  L.push(`[chair] Librarian - claim-check on ${label}${subject ? `: "${subject}"` : ''}`);
  L.push(`Composed by consonance/tools/librarian-route.js over the commit MESSAGE only. It has not read the diff,`);
  L.push(`and it cannot tell a true figure from a false one - only whether the message hands you a way to check.`);
  L.push(`Everything below is a question. Re-derive what you can and say plainly what cannot be derived at all.`);
  L.push('');

  L.push(`FIGURES WITH NO COMMAND - ${uncited.length} of ${scan.figures.length}`);
  if (!uncited.length) L.push('  none: every figure in the message has a command in scope.');
  for (const f of uncited.slice(0, max)) {
    L.push(`  L${String(f.line).padStart(3)}  "${f.text}"`);
    L.push(`        ${f.context.replace(/\s+/g, ' ').slice(0, 140)}`);
  }
  if (uncited.length > max) L.push(`  ... ${uncited.length - max} further uncited figure(s) not listed - a cap, not an absence.`);
  L.push('');

  L.push(`VERIFICATION CLAIMS - ${claims.length} worth checking of ${scan.claims.length} found`);
  if (!claims.length) L.push('  none: every verification claim carries a command not on the known-weak list.');
  for (const c of claims.slice(0, max)) {
    L.push(`  L${String(c.line).padStart(3)}  [${c.terms.join(', ')}]  ${c.capability.verdict}`);
    L.push(`        ${c.context.replace(/\s+/g, ' ').slice(0, 140)}`);
    if (c.command) L.push(`        command in scope (L${c.commandAt}): ${c.command.slice(0, 110)}`);
    L.push(`        ${c.capability.detail}`);
  }
  if (claims.length > max) L.push(`  ... ${claims.length - max} further claim(s) not listed - a cap, not an absence.`);
  if (unjudged.length) {
    L.push(`  (${unjudged.length} claim(s) carry a command with no entry in the weak-gate table. UNJUDGED, not adequate.)`);
  }
  L.push('');

  // CLASS 3. A citation that does not resolve reads as verified, which is worse than an uncited
  // number - the brief that commissioned this tool carried exactly that error, six times.
  L.push(`CITED PAIRS - ${pairs.length}, each checkable in one run${opts.verdicts ? '' : ' (not run: pass --verify)'}`);
  if (!pairs.length) L.push('  none: no figure in the message has a deriving command in scope.');
  for (const f of pairs.slice(0, max)) {
    const v = verdictOf(f);
    L.push(`  L${String(f.line).padStart(3)}  ${v ? v.verdict.padEnd(8) : ''}"${f.text}"   <-  ${f.command.slice(0, 100)}`);
    if (v && v.verdict !== 'GREEN') L.push(`        ${String(v.detail).replace(/\s+/g, ' ').slice(0, 150)}`);
  }
  if (pairs.length > max) L.push(`  ... ${pairs.length - max} further pair(s) not listed - a cap, not an absence.`);
  if (reds.length) L.push(`  ${reds.length} pair(s) RED: the command ran and the figure is not in its output.`);
  // THE BOUND THAT MAKES THE REDS READABLE. Verification runs against the tree as it is NOW. On a
  // historical commit a figure was true of a different tree, so a RED there is usually DRIFT and
  // not a defect - the first run of this said RED on "151 files -> 164 files", which is a
  // before/after pair whose "before" is simply gone. --staged is where a RED means something,
  // because there the message and the tree are the same object.
  if (opts.verdicts && opts.historical) {
    L.push('  Verified against the tree AS IT IS NOW, not as it was at this commit. A RED on a historical');
    L.push('  figure is usually drift; --staged is where a RED is a finding, because message and tree agree.');
  }
  L.push('');

  L.push('WHAT THIS DOES NOT COVER: the diff, the code, and the truth of any figure. A command absent from');
  L.push('the weak-gate table is unjudged rather than sound, and a command written in words rather than');
  L.push('typed is invisible to it - so an uncited figure here may still have been derived somewhere.');
  if (!opts.verdicts) L.push('The cited pairs above were NOT run, so "cited" here means a command is present, never that it resolves.');
  return { dispatch: true, text: L.join('\n'), quiet: null };
}

// ---------------------------------------------------------------- input

function git(args, repo) {
  return execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function readStdin() {
  try { return fs.readFileSync(0, 'utf8'); } catch { return ''; }
}

function main(argv) {
  const at = f => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
  const repo = at('--repo') || REPO;
  const max = Number(at("--max")) || 8;
  const doVerify = argv.includes('--verify');
  const flagged = new Set(['--repo', '--max', '--message', '--staged', '--verify']);
  const positional = argv.filter((a, i) => !a.startsWith('--') && !flagged.has(argv[i - 1]));

  let message, subject, label;
  if (argv.includes('--staged')) {
    const file = at('--message');
    if (file) {
      if (!fs.existsSync(file)) { console.error(`librarian-route: no such message file: ${file}`); return 2; }
      message = fs.readFileSync(file, 'utf8');
      label = `the staged message (${path.basename(file)})`;
    } else if (!process.stdin.isTTY) {
      message = readStdin();
      label = 'the staged message (stdin)';
    } else {
      // The refusal, and its reason. See the header: .git/COMMIT_EDITMSG holds the PREVIOUS
      // message before a commit, so a fallback would lint the wrong object and pass.
      console.error('librarian-route --staged: the message must be supplied, on stdin or with --message <file>.');
      console.error('  It deliberately does NOT read .git/COMMIT_EDITMSG: before a commit that file holds the');
      console.error('  PREVIOUS message, so the fallback would lint the wrong object and return a clean verdict.');
      console.error('  e.g.   node consonance/tools/librarian-route.js --staged --message msg.txt');
      return 2;
    }
    if (!message.trim()) { console.error('librarian-route: empty message'); return 2; }
    subject = message.split(/\r?\n/)[0].trim();
  } else {
    const sha = positional[0] || 'HEAD';
    try {
      const raw = git(['show', '-s', '--format=%H%x1f%h%x1f%s%x1f%B', sha], repo).split('\x1f');
      subject = raw[2].trim();
      message = raw[3];
      label = raw[1].trim();
    } catch (e) {
      console.error(`librarian-route: ${String(e.message).split('\n')[0]}`);
      return 2;
    }
  }

  const scan = scanBody(message);

  // --verify runs BEFORE compose, not after, so a pair that fails to resolve can break silence
  // rather than being appended to a dispatch that had already decided there was nothing to say.
  // Opt-in because these are shell commands lifted out of a message: cite-check's own header says
  // read the document before running its citations, and a commit body is no different.
  let verdicts = null;
  if (doVerify) {
    verdicts = {};
    // Grouped by command: one run settles every figure standing on it. The first version ran
    // corpus-age.js four times for four figures on one line - 15s for six pairs, most of it the
    // same command re-executed.
    const byCmd = new Map();
    for (const f of scan.figures.filter(x => x.cited).slice(0, max)) {
      if (!byCmd.has(f.command)) byCmd.set(f.command, []);
      byCmd.get(f.command).push(f);
    }
    for (const [cmd, figs] of byCmd) {
      // One run for the whole group first. A GREEN there means NO figure in the group was missing,
      // so it settles all of them exactly. Anything else has to be attributed figure by figure,
      // because the group verdict cannot say which member failed - and guessing that from the
      // detail string would be an inference where a re-run is available.
      const group = verify(cmd, figs.map(f => f.text), repo);
      if (group.verdict === 'GREEN') { for (const f of figs) verdicts[`${f.line}:${f.text}`] = group; continue; }
      for (const f of figs) verdicts[`${f.line}:${f.text}`] = figs.length === 1 ? group : verify(cmd, [f.text], repo);
    }
  }

  const out = compose(subject, scan, { max, label, verdicts, historical: !argv.includes("--staged") });
  if (!out.dispatch) { console.error(out.quiet); return 3; }
  console.log(out.text);
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = {
  figuresIn, commandsIn, maskLine, indentedBlockOf, capability, scanBody, compose, main,
  CLAIM_TERMS, WEAK_GATES, EXTRA_FIGURE_RE, CITED_WINDOW,
};
