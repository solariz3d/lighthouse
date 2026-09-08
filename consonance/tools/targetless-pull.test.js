// JS-SUITE: EXPECTED-RED
// targetless-pull.test.js — a pull addressed to NO PANE ON PURPOSE must say so, and must not
// share a footprint with a pull whose address was LOST.
//
// DECLARED RED ON PURPOSE, AND THE MARKER IS A LINE COMMENT FOR A MEASURED REASON. The fix lives
// in main.rs (C holds it this lap) and mcp.rs, so this file is born failing. js-suite treats an
// expected-red going GREEN as itself a failure, which is what forces someone back here to delete
// the exemption once the patch is folded. The marker is `//` at column 0 rather than ` * ` inside
// a block comment because the runner's regex is /^\s*(\/\/|#)\s*JS-SUITE:\s*EXPECTED-RED/ — a
// block-comment marker is INERT and the file enters as an undeclared hard red (js-suite.js:41-54,
// pane B 2026-09-03). I found that by running the runner's regex, not by re-reading it.
//
// -- THE RECEIPT -------------------------------------------------------------------------------
//
// 2026-07-27T07:20:26Z, on the board: `chair approved + no target to deliver to (from forming -> )`
// The keeper clicked Approve and nothing moved. Card 0cadecf7 at 07:19:14Z carried real content
// ("Registration != observation ..."), so the click was spent on a pull that could never deliver,
// and the board sentence does not say whether anything was supposed to.
//
// -- WHY A NAME AND NOT A GUARD ----------------------------------------------------------------
//
// A targetless pull is LEGITIMATE and has two by-design producers:
//   1. `raise_from_forming` (main.rs) — the app raising its own hand; the CARD is the delivery.
//   2. `raise_pull` with `target` omitted — the verb documents it as "who you want to engage,
//      IF ANY" (mcp.rs, RaisePullArgs.target).
// And at least one illegitimate producer is on record: the board carries one literal
// `no live pane matches '<target>'` — a caller who passed the placeholder.
//
// The defect is that `target: target.unwrap_or_default()` COLLAPSES absent (deliberate) and
// present-but-blank (lost) into the same `""`, and `deliver_pull` then reports both with one
// sentence. So the fix names the deliberate case; it drops, blocks and suppresses nothing.
//
// Run: node consonance/tools/targetless-pull.test.js
'use strict';

const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const REPO = path.resolve(__dirname, '..', '..');
const SOURCES = ['consonance/src-tauri/src/main.rs', 'consonance/src-tauri/src/mcp.rs'];
const read = (p) => fs.readFileSync(path.join(REPO, p), 'utf8').replace(/\r\n/g, '\n');

const EMPTY_LITERAL = /^(String::new\(\)|String::default\(\)|""\.to_string\(\)|""\.into\(\)|String::from\(""\))$/;

/** Drop `#[cfg(test)] mod ... { ... }` regions.
 *
 *  THE BOUNDARY IS A COLUMN-0 `}` AND NOT A BRACE COUNT. Counting braces reads the `{}` inside
 *  string literals — `format!("{f}")`, JSON fixtures — and closes the module early, which is how
 *  my first source-walk on 2026-09-06 reported `fn main` writing into a pane. Do not count what
 *  strings can contain. */
function stripTestModules(src) {
  const lines = src.split('\n');
  const out = [];
  let skipping = false;
  for (const line of lines) {
    if (!skipping && /^\s*#\[cfg\(test\)\]/.test(line)) { skipping = true; out.push(''); continue; }
    if (skipping) {
      out.push('');
      if (/^\}/.test(line)) skipping = false;
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

/** THE UNIVERSE IS DERIVED FROM THE SOURCE, NEVER LISTED.
 *
 *  On 2026-09-06 I wrote an oracle that iterated four hand-written names and it was green over a
 *  live defect, because a list-driven test cannot fail on the site nobody listed — which is the
 *  only site that was ever going to be wrong. Pane A found that one. So this walks every
 *  `PullRequest {` literal in the file and reads the `target:` field out of each. */
function pullSites(src, file) {
  const clean = stripTestModules(src);
  const lines = clean.split('\n');
  const sites = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/(^|[^A-Za-z_])PullRequest\s*\{/.test(lines[i])) continue;
    // The DEFINITION is not a construction. My first walk counted `pub struct PullRequest {` and
    // the floor test above caught it — which is the whole reason that test is a positive control
    // and not decoration.
    if (/\b(struct|enum|impl|trait)\s+PullRequest\b/.test(lines[i])) continue;
    let target = null;
    for (let j = i; j < Math.min(i + 40, lines.length); j++) {
      const m = /^\s*target:\s*(.+?),\s*$/.exec(lines[j]);
      if (m) { target = m[1].trim(); break; }
      if (j > i && /^\s*\}/.test(lines[j])) break;   // left the literal without finding one
    }
    sites.push({ file, line: i + 1, target });
  }
  return sites;
}

function allSites() {
  return SOURCES.flatMap((f) => pullSites(read(f), f));
}

/* --------------------------------------------------------------- the walk is measuring something */

test('the walk finds every PullRequest construction site, and there is more than one', () => {
  const sites = allSites();
  // A FLOOR, NOT A LIST. The universe stays derived; this only refuses a walk that found nothing
  // and reported green — the positive control my 09-06 oracle did not have.
  assert.ok(sites.length >= 2, `expected >= 2 PullRequest sites, found ${sites.length}`);
  for (const s of sites) {
    assert.notStrictEqual(s.target, null,
      `${s.file}:${s.line} constructs a PullRequest with no target: field the walk could read`);
  }
});

test('the walk catches a construction site nobody listed', () => {
  // The mutant my 09-06 oracle structurally could not fail on: a NEW site, invented here, in a
  // function no rule names. If this walk were list-driven it would return zero and pass.
  const synthetic = [
    'fn some_future_caller(pulls: &Sender<mcp::PullRequest>) {',
    '    let _ = pulls.send(mcp::PullRequest {',
    '        from: "somewhere".to_string(),',
    '        seat: String::new(),',
    '        target: String::new(),',
    '        kind: "novel".to_string(),',
    '        intensity: 0.7,',
    '        why: "...".to_string(),',
    '    });',
    '}',
  ].join('\n');
  const found = pullSites(synthetic, '<synthetic>');
  assert.strictEqual(found.length, 1, 'the walk did not see an unlisted construction site');
  assert.ok(EMPTY_LITERAL.test(found[0].target), 'the walk read the wrong field');
});

test('test modules are skipped, and the boundary is not a brace count', () => {
  const withFixture = [
    'fn real(pulls: &S) { let _ = pulls.send(mcp::PullRequest {',
    '    target: mcp::UNADDRESSED.to_string(),',
    '}); }',
    '#[cfg(test)]',
    'mod tests {',
    '    fn f() { let s = format!("{ a fixture brace }"); }',
    '    fn g() { let _ = mcp::PullRequest { target: String::new(), }; }',
    '}',
  ].join('\n');
  const found = pullSites(withFixture, '<fixture>');
  assert.strictEqual(found.length, 1, 'a PullRequest inside #[cfg(test)] was counted as live');
  assert.strictEqual(found[0].target, 'mcp::UNADDRESSED.to_string()');
});

/* ------------------------------------------------------------------------- red until C folds */

test('no live PullRequest is constructed with a bare empty target', () => {
  const bad = allSites().filter((s) => s.target && EMPTY_LITERAL.test(s.target));
  assert.deepStrictEqual(bad, [],
    'an empty-literal target cannot be told apart from an address that was LOST — ' +
    'name it with mcp::UNADDRESSED instead:\n' +
    bad.map((s) => `  ${s.file}:${s.line}  target: ${s.target}`).join('\n'));
});

test('raise_from_forming names its unaddressed pull', () => {
  const src = read('consonance/src-tauri/src/main.rs');
  const at = src.indexOf('fn raise_from_forming');
  assert.notStrictEqual(at, -1, 'raise_from_forming is gone — this test is measuring nothing');
  const body = src.slice(at, at + 2600);
  assert.match(body, /UNADDRESSED/,
    'raise_from_forming still writes a bare empty target; the app raising its own hand is the ' +
    'by-design case and must be the one that SAYS so');
});

test('raise_pull stops collapsing an absent target into a blank one', () => {
  const src = read('consonance/src-tauri/src/mcp.rs');
  assert.doesNotMatch(src, /target:\s*target\.unwrap_or_default\(\)/,
    'unwrap_or_default() makes `target` omitted (deliberate) and `target: ""` (lost) the same ' +
    'value — the collapse this patch exists to undo');
  assert.match(src, /target:\s*target_or_unaddressed\(target\),/,
    'the replacement is a NAMED single-line helper on purpose: the walk above reads `target:` ' +
    'off one line, so a multi-line match expression here would make this whole file blind');
});

test('the name lives beside PullRequest, and it is exported', () => {
  const src = read('consonance/src-tauri/src/mcp.rs');
  assert.match(src, /pub const UNADDRESSED: &str/,
    'the name has to live beside PullRequest, not at a call site');
  assert.match(src, /pub fn target_or_unaddressed\(/,
    'the un-collapsing belongs at the boundary that does the collapsing');
});
