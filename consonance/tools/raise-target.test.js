// raise-target.test.js — the raise_pull target resolver must resolve what people actually type.

/* THE CANARY SANG AND THE MARKER IS GONE — 2026-09-06, and the deletion is the point rather than
 * housekeeping. This file was born declared `JS-SUITE: EXPECTED-RED` with three of its six cases
 * failing, because the fix lived in `main.rs` and `mcp.rs`, which C and A held. js-suite treats an
 * expected-red going green as ITSELF a failure, so folding the patch made this file SING and forced
 * someone to come back and remove the exemption. That someone is me and this is that edit: all six
 * pass, the exemption is deleted, and the file is now an ordinary guard against the defect
 * returning. A stale exemption left behind would have suppressed a real red here later.
 *
 * Two things worth keeping from the red period, both about anchors:
 *
 *   THE MARKER ITSELF was inert in v1 — written as ` * JS-SUITE: EXPECTED-RED` inside a block
 *   comment, which the runner's regex /^\s*(\/\/|#)\s*JS-SUITE:/ does not match, so this file would
 *   have entered the suite as an UNDECLARED hard red. That is exactly the trap js-suite.js:41-54
 *   records pane B falling into on 2026-09-03, whose docstring was corrected on 09-04 to say so. I
 *   had read the correction. I found it by running the runner's own regex, not by re-reading the
 *   prose about the regex.
 *
 *   AND THE ASSERTION BELOW was over-anchored in the opposite direction — see the mod-declaration
 *   case. One regex too strict, one too loose, in the same file, in the same lap.
 *
 * ── THE RECEIPT, MEASURED RATHER THAN ARGUED ────────────────────────────────────────────────────
 *
 * The keeper approved a raise_pull on 2026-09-06 and it delivered nothing: `no live pane matches
 * 'MAIN'`. Over the entire board — 298 MB, every refusal ever recorded:
 *
 *     $ grep -o "no live pane matches '[^']*'" C:/Consonance/data/board.jsonl | sort | uniq -c
 *          51 no live pane matches 'Main'
 *           7 no live pane matches 'MAIN'
 *           1 no live pane matches '<target>'
 *
 * FIFTY-EIGHT failures and every one is the orchestrator's seat. `spawn_main` registers "M"
 * (main.rs:5537); nobody types "M". **`LIB` is registered at main.rs:5486 and has NEVER failed** —
 * the packet expected it to be red, and a test written to make it red would be manufacturing one,
 * so this file asserts the opposite: that LIB already works and must keep working.
 *
 * The 59th line is the smaller finding and it is upstream: `<target>` was delivered once,
 * literally. `RaisePullArgs.target` is documented as "a pane id or name" (mcp.rs:201) and
 * enumerates nothing — the caller is asked for a name the documentation never names. The table is
 * half the fix; that sentence is the other half.
 *
 * Run: node consonance/tools/raise-target.test.js
 */
'use strict';
const assert = require('node:assert');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const REPO = path.resolve(__dirname, '..', '..');
const MAIN_RS = path.join(REPO, 'consonance/src-tauri/src/main.rs');
const MCP_RS = path.join(REPO, 'consonance/src-tauri/src/mcp.rs');
const ALIAS_RS = path.join(REPO, 'consonance/src-tauri/src/seat_alias.rs');

const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

/** The body of a named Rust fn, brace-matched. Source-reading is the established technique here —
 *  `resolve_pane_delegates_and_never_matches_prefixes_itself` in main.rs does the same thing, and
 *  for the same reason: the unit is unreachable from a test that cannot hold live Tauri State. */
function fnBody(src, signature) {
  const at = src.indexOf(signature);
  assert.notStrictEqual(at, -1, 'signature not found, so this test is measuring nothing: ' + signature);
  const open = src.indexOf('{', at);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) return src.slice(open, i + 1);
  }
  throw new Error('unbalanced braces after ' + signature);
}

/* ------------------------------------------------------------------ green today: the table */

test('the alias module exists and covers every target the board recorded failing', () => {
  const src = read(ALIAS_RS);
  // The measured strings, uppercased the way candidates() normalises them. Not a guess: the
  // grep that produced them is in this file's header and in the module's.
  for (const typed of ['MAIN']) {
    assert.ok(src.includes('"' + typed + '"'),
      typed + ' is a measured failure and the alias table does not mention it');
  }
  assert.match(src, /=>\s*&\["M"\]/, 'nothing in the table routes to the orchestrator key "M"');
});

test('LIB is NOT part of this defect and the fix must not disturb it', () => {
  // The packet expected LIB to be red. It is not: spawn_librarian registers it at spawn, and the
  // board has zero LIB failures in 298 MB. Pinned so a future "fix" cannot quietly re-route it.
  assert.match(read(MAIN_RS), /names\.0\.lock\(\)\.unwrap\(\)\.insert\("LIB"/,
    'the librarian no longer registers LIB at spawn — that WOULD be a defect, and a new one');
  const alias = read(ALIAS_RS);
  const mainClass = (alias.match(/"MAIN"[^\n]*=>\s*&\[([^\]]*)\]/) || [])[1] || '';
  assert.ok(!mainClass.includes('LIB'),
    'the orchestrator alias class routes to LIB — two seats behind one word');
});

test('MIKE must never resolve to the orchestrator — the load-bearing hole in the table', () => {
  /* NATO for M is MIKE, and a live pane is displayed MIKE on this machine. RESERVED_SEAT_NAMES
   * stops a pane REGISTERING "M" because an address capture routes the chair's traffic to a pane
   * with no error anywhere (found by E, 2026-08-24). An alias would reintroduce it through the
   * front door. */
  const alias = read(ALIAS_RS);
  assert.ok(!/"MIKE"\s*=>\s*&\[[^\]]*"M"/.test(alias),
    'MIKE is aliased to M — this is the 2026-08-24 address capture, re-entering as a convenience');
  assert.match(read(MAIN_RS), /RESERVED_SEAT_NAMES/,
    'the reserved-name guard is gone; the alias table above assumes it exists');
});

/* ------------------------------------------------------------------ RED TODAY: the wiring */

test('main.rs declares the alias module', () => {
  /* THE ANCHOR WAS WRONG, NOT THE WORDING — my error, found by A running my prescription instead
   * of reading it. v1 asserted /^mod seat_alias;$/m. The `$` demands end-of-line immediately after
   * the semicolon, so the trailing comment I MYSELF PRESCRIBED in the patch note failed my own
   * test. Two seats saw it, both correctly left it alone because this is my file, and the chair
   * asked me to decide which half was wrong rather than relax the test to fit a bad prescription.
   *
   * The wording is right and the regex was wrong, and the file settles it: EVERY other mod line in
   * that block carries a trailing comment — `mod cochlea;   // audio as relationships…`,
   * `mod lap_holders;  // whose turn it is…`. A test that forbids the house style is the defective
   * half. Anchored at line start still, so a commented-out `// mod seat_alias;` cannot satisfy it. */
  assert.match(read(MAIN_RS), /^mod seat_alias;/m,
    'seat_alias.rs is not compiled into the binary, so the table is inert — a fix nothing calls');
});

test('resolve_from consults the alias layer, so ALL FIVE callers get the fix', () => {
  /* WHY THE SHARED RESOLVER AND NOT raise_pull. `resolve_from` is reached by five call sites —
   * deliver_pull, chair_inject, chair_scrollback, dyad_spot and the gate path. Fixing the label in
   * mcp.rs's raise_pull would repair ONE of them and leave four with the identical defect, which
   * is the same shape as fixing a symptom where the cause is upstream. */
  const body = fnBody(read(MAIN_RS), 'fn resolve_from(');
  assert.match(body, /seat_alias::candidates\(/,
    'RED UNTIL THE PATCH LANDS: resolve_from still looks up only the raw typed token, so "Main" — '
    + '51 recorded failures — still resolves to nothing.');
});

test('the raise_pull target is documented with the names it accepts', () => {
  /* The defect one layer up. A caller told "a pane id or name" and given no list types the name
   * the room uses in prose. One caller pasted the literal placeholder and the board delivered
   * `no live pane matches '<target>'`. */
  const src = read(MCP_RS);
  const doc = (src.match(/\/\/\/[^\n]*\n\s*target: Option<String>,/) || [''])[0];
  assert.match(doc, /\bM\b|\bLIB\b/,
    'RED UNTIL THE PATCH LANDS: RaisePullArgs.target says "a pane id or name" and names none of '
    + 'them. The resolver table and the verb docs have never agreed because the docs say nothing.');
});
