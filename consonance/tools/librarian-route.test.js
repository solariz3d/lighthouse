// librarian-route.test.js - deterministic fixtures; the integration cases build their own repo.
// Run: node --test consonance/tools/librarian-route.test.js
//
// EVERY REGRESSION TEST HERE IS A DEFECT THIS TOOL ACTUALLY SHIPPED during its first run over the
// record, not a hypothetical. They are marked REGRESSION and name what went wrong, because a test
// whose reason is gone gets deleted by the next person who finds it inconvenient.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const {
  figuresIn, commandsIn, capability, scanBody, compose, CLAIM_TERMS,
} = require('./librarian-route.js');

const TOOL = path.join(__dirname, 'librarian-route.js');
const NODE = process.execPath;

const claimTerms = line => CLAIM_TERMS.filter(([, re]) => re.test(line)).map(([n]) => n);

// ---------------------------------------------------------------- figures

test('figure: a count noun the document-tuned list does not carry is still a figure', () => {
  // The exact miss: cite-check's FIGURE_RE has no "preregistrations", so "24" was invisible and
  // the wrong count shipped.
  assert.deepStrictEqual(figuresIn('24 preregistrations in loop/, no alarm on any.'), ['24 preregistrations']);
});

test('figure: a spelled-out count is a figure when it counts something', () => {
  // "Three defects in no journal" - the source section lists four, and no digit appears.
  assert.deepStrictEqual(figuresIn('wire_run. Three defects in no journal.'), ['Three defects']);
});

test('figure: a spelled-out number with nothing countable after it is not a figure', () => {
  // The bound on the rule above: an unrestricted word-number rule flags ordinary prose.
  assert.deepStrictEqual(figuresIn('one of the two reasons it was abandoned'), []);
});

test('figure: the label form is a figure - "applied 6 / caught 4"', () => {
  const f = figuresIn('First run: applied 6 / caught 4 / SURVIVED 2.');
  assert.ok(f.includes('applied 6'), `expected applied 6 in ${JSON.stringify(f)}`);
  assert.ok(f.includes('caught 4'), `expected caught 4 in ${JSON.stringify(f)}`);
});

test('figure: dates, times, shas, file:line and versions are never figures', () => {
  // HONEST NOTE, because a vacuous assertion is worse than a missing one: this case passes with
  // the masking REMOVED. None of these shapes matches a figure pattern anyway, so the assertion
  // records intent rather than guarding it, and the mutation harness reports it as such. The
  // masking that IS load-bearing is the next test.
  assert.deepStrictEqual(figuresIn('On 2026-08-23 at 05:11, b20fed5 changed main.rs:6724 in v1.2.3'), []);
});

test('figure: a slash date is masked, and a ratio that looks like one is NOT', () => {
  // The only masking measured to change an outcome. Its bound is the second assertion: the short
  // form "8/23" is shape-identical to "43/44", so masking it would delete real figures - the
  // mask covers the four-digit form only, which cannot be a ratio.
  assert.deepStrictEqual(figuresIn('the 2026/08/23 run found 3 defects'), ['3 defects']);
  assert.deepStrictEqual(figuresIn('js-suite 43/44 green'), ['43/44']);
});

test('figure: a 7-digit number is a figure, not a sha - the mask needs a letter', () => {
  assert.deepStrictEqual(figuresIn('the ledger holds 1234567 entries'), ['1234567 entries']);
});

test('figure: a figure inside a backticked citation is an argument, not a claim', () => {
  const scan = scanBody('checked (`head -c 4096 file.md`) yesterday');
  assert.strictEqual(scan.figures.length, 0);
});

// ---------------------------------------------------------------- commands

test('REGRESSION command: prose beginning with a binary name is not a command', () => {
  // SHIPPED DEFECT: "found by one grep per file" parsed as `grep per file`, which then CITED two
  // figures on neighbouring lines. A false command LAUNDERS an uncited figure into a cited one -
  // the one direction this tool must never fail in.
  assert.deepStrictEqual(commandsIn('all 45 land in one of four states, found by one grep per file'), []);
});

test('REGRESSION command: quoted arguments are part of the command, not its boundary', () => {
  // SHIPPED DEFECT: the quote exclusion truncated this to `find exo_memory/loop -name`, which
  // --verify then reported NOT-RUN ("missing argument to -name") - the parser manufacturing the
  // one verdict that carries no information.
  const cmds = commandsIn("     find exo_memory/loop -name '*.md' | grep -icE 'prereg|registration'  ->  25");
  assert.deepStrictEqual(cmds, ["find exo_memory/loop -name '*.md' | grep -icE 'prereg|registration'"]);
});

test('command: a result appended with an arrow is not part of the command', () => {
  assert.deepStrictEqual(commandsIn('  node consonance/tools/corpus-age.js  ->  164 files'),
    ['node consonance/tools/corpus-age.js']);
});

test('command: prose after a comma is not part of the command', () => {
  assert.deepStrictEqual(commandsIn('Gates by exit code: cargo check 0, js-suite 44 green of 45'),
    ['cargo check 0']);
});

test('command: a subcommand with no flag or path still counts', () => {
  assert.deepStrictEqual(commandsIn('re-derived with git show -s HEAD'), ['git show -s HEAD']);
});

// ---------------------------------------------------------------- citation scope

test('scope: a command on the line above cites the figure', () => {
  const scan = scanBody('    node consonance/tools/js-suite.js\n    43 green of 44\n');
  assert.strictEqual(scan.figures[0].cited, true);
  assert.strictEqual(scan.figures[0].commandAt, 1);
});

test('scope: a command three lines away does not cite the figure', () => {
  const scan = scanBody('node consonance/tools/js-suite.js\n\nsome prose here\n\nand then 43 green of 44\n');
  const fig = scan.figures.find(f => f.text.includes('43'));
  assert.strictEqual(fig.cited, false);
});

test('scope: a command heading an indented block cites the whole block', () => {
  const scan = scanBody('  node consonance/tools/corpus-age.js\n  164 files carried\n  90.1% of budget\n');
  assert.ok(scan.figures.length >= 2);
  assert.ok(scan.figures.every(f => f.cited), 'every figure in the command\'s own output block is cited');
});

test('REGRESSION scope: a compile gate cites nothing - it produces no measurement', () => {
  // SHIPPED DEFECT: "cargo check 0, js-suite 44 green of 45" read as a CITED suite figure, so the
  // suite number was laundered by a command that never runs an assertion.
  const scan = scanBody('Gates by exit code: cargo check 0, js-suite 44 green of 45 exit 0');
  const fig = scan.figures.find(f => f.text.includes('44'));
  assert.strictEqual(fig.cited, false, 'cargo check must not cite a suite figure');
  assert.strictEqual(fig.command, 'cargo check 0', 'the command is still reported, just not counted as citing');
});

test('scope: grep DOES cite a figure - it counts, even though it cannot show code ran', () => {
  // The other half of the distinction. Treating grep as non-deriving would have flagged
  // `find ... | grep -icE ... -> 25`, one of the few properly cited figures in the record.
  const scan = scanBody("  find exo_memory/loop -name '*.md' | grep -icE 'prereg' \n  25 registrations\n");
  assert.ok(scan.figures.some(f => f.cited), 'a counting command cites its count');
});

// ---------------------------------------------------------------- capability

test('capability: cargo check cannot back a behavioural claim', () => {
  const c = capability('js-suite 44 green, cargo check 0', 'cargo check 0');
  assert.strictEqual(c.verdict, 'WEAK GATE');
  assert.match(c.detail, /TYPE-CHECKS/);
});

test('capability: no command in scope is reported as such, not as adequate', () => {
  assert.strictEqual(capability('the compaction test came back clean', null).verdict, 'NO COMMAND');
});

test('capability: a byte-identity claim needs a hash or a compare', () => {
  assert.strictEqual(capability('the briefs are byte-identical', 'node consonance/tools/open-items.js').verdict, 'MISMATCH');
  assert.strictEqual(capability('the briefs are byte-identical', 'md5sum brief/SEED.md').verdict, 'UNJUDGED');
});

test('capability: an unlisted command is UNJUDGED, never "adequate"', () => {
  const c = capability('45 green', 'node consonance/tools/js-suite.js');
  assert.strictEqual(c.verdict, 'UNJUDGED');
  assert.match(c.detail, /not a finding that it is adequate/);
});

// ---------------------------------------------------------------- claim vocabulary

test('claim: a method claim about where the figures came from is a verification claim', () => {
  // "Every figure below was read from the source file, not from the librarian's summary of it"
  // opened an entry in which three figures came from the summary.
  assert.ok(claimTerms('Three filed here, each read from the source rather than from the summary of it')
    .includes('method claim'));
});

test('claim: ordinary prose is not a verification claim', () => {
  assert.deepStrictEqual(claimTerms('The dominant class is not privacy, it is dangling pointers.'), []);
});

// ---------------------------------------------------------------- compose

test('compose: silence when there is nothing specific to ask', () => {
  const scan = scanBody('  node consonance/tools/corpus-age.js\n  164 files carried\n');
  const out = compose('a subject', scan, {});
  assert.strictEqual(out.dispatch, false);
  assert.strictEqual(out.text, '', 'stdout must be empty so a channel that fires every time is not created');
  assert.match(out.quiet, /No dispatch composed/);
});

test('compose: an uncited figure breaks silence and is quoted with its line', () => {
  const scan = scanBody('subject line\n\n24 preregistrations in loop/, no alarm on any.\n');
  const out = compose('subject line', scan, {});
  assert.strictEqual(out.dispatch, true);
  assert.match(out.text, /24 preregistrations/);
  assert.match(out.text, /L\s*3/);
});

test('compose: a RED verdict breaks silence even when every figure is cited', () => {
  const scan = scanBody('  node consonance/tools/corpus-age.js\n  151 files carried\n');
  const key = `${scan.figures[0].line}:${scan.figures[0].text}`;
  const out = compose('s', scan, { verdicts: { [key]: { verdict: 'RED', detail: 'figure(s) 151 not in output: 164' } } });
  assert.strictEqual(out.dispatch, true, 'a citation that does not resolve is the highest-yield class');
  assert.match(out.text, /RED/);
});

test('compose: a NOT-RUN verdict does NOT break silence - it carries no information', () => {
  const scan = scanBody('  node consonance/tools/corpus-age.js\n  151 files carried\n');
  const key = `${scan.figures[0].line}:${scan.figures[0].text}`;
  const out = compose('s', scan, { verdicts: { [key]: { verdict: 'NOT-RUN', detail: 'no such binary' } } });
  assert.strictEqual(out.dispatch, false);
});

test('compose: caps announce what they suppressed - no silent truncation', () => {
  const body = 'subject\n\n' + Array.from({ length: 20 }, (_, i) => `finding ${i}: ${i + 3} defects found`).join('\n');
  const out = compose('subject', scanBody(body), { max: 3 });
  assert.match(out.text, /further uncited figure\(s\) not listed - a cap, not an absence/);
});

test('compose: the historical caveat appears only when verdicts were actually run', () => {
  const scan = scanBody('  node consonance/tools/corpus-age.js\n  151 files carried\n');
  const key = `${scan.figures[0].line}:${scan.figures[0].text}`;
  const red = { [key]: { verdict: 'RED', detail: 'x' } };
  assert.match(compose('s', scan, { verdicts: red, historical: true }).text, /AS IT IS NOW/);
  const noVerify = compose('s', scanBody('subject\n\n24 preregistrations here\n'), { historical: true });
  assert.doesNotMatch(noVerify.text, /AS IT IS NOW/);
});

// ---------------------------------------------------------------- cli

function run(args, opts = {}) {
  try {
    const stdout = execFileSync(NODE, [TOOL, ...args], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts });
    return { code: 0, stdout };
  } catch (e) {
    return { code: e.status, stdout: e.stdout || '', stderr: e.stderr || '' };
  }
}

test('cli: --staged refuses rather than falling back to .git/COMMIT_EDITMSG', () => {
  // Before a commit that file holds the PREVIOUS message, so a fallback would lint the wrong
  // object and return a clean verdict about it. A pre-flight refusal is cheaper than a false green.
  const r = run(['--staged', '--message', path.join(os.tmpdir(), 'definitely-not-here-xyzzy.txt')]);
  assert.strictEqual(r.code, 2);
  assert.match(r.stderr, /no such message file/);
});

test('cli: --staged reads a message file and reports its figures', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lr-'));
  const f = path.join(tmp, 'msg.txt');
  fs.writeFileSync(f, 'subject here\n\nthere are 24 preregistrations in loop/\n');
  const r = run(['--staged', '--message', f]);
  assert.strictEqual(r.code, 0);
  assert.match(r.stdout, /24 preregistrations/);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('cli: an unknown sha is an error, never an empty clean report', () => {
  const r = run(['definitelynotasha999']);
  assert.strictEqual(r.code, 2);
});

test('cli integration: a real commit with an uncited figure exits 0 and quotes it', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lr-repo-'));
  const g = a => execFileSync('git', ['-C', tmp, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8' });
  g(['init', '-q']);
  fs.writeFileSync(path.join(tmp, 'f.txt'), 'x');
  g(['add', 'f.txt']);
  g(['commit', '-q', '-m', 'a subject\n\nthe run found 7 defects and nothing was cited\n']);
  const r = run([, '--repo', tmp].filter(Boolean));
  assert.strictEqual(r.code, 0);
  assert.match(r.stdout, /7 defects/);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('cli integration: a commit with nothing to ask prints NOTHING to stdout and exits 3', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lr-repo2-'));
  const g = a => execFileSync('git', ['-C', tmp, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8' });
  g(['init', '-q']);
  fs.writeFileSync(path.join(tmp, 'f.txt'), 'x');
  g(['add', 'f.txt']);
  g(['commit', '-q', '-m', 'a subject with no measurement in it\n\njust prose about a rename.\n']);
  const r = run([, '--repo', tmp].filter(Boolean));
  assert.strictEqual(r.code, 3);
  assert.strictEqual(r.stdout, '', 'silence means an empty stdout, not a short report');
  fs.rmSync(tmp, { recursive: true, force: true });
});
