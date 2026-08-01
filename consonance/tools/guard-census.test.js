/* guard-census.test.js
 *
 * The tool this tests exists to count guards that have never been shown to fail. So every
 * assertion below was written against a version of the blanker that FAILED it, and the
 * failure is recorded in the case's own name. That is the trigger form the census measures,
 * applied to the census — the alternative is an instrument whose own correctness is the one
 * thing it takes on faith.
 *
 * Run: node guard-census.test.js
 */
"use strict";
const assert = require("assert");
const path = require("path");
const { blankJs, blankRust, jsSites, rustSites, resolveSites, onlyScript, mutants } = require("./guard-census.js");

let n = 0;
const t = (name, fn) => { fn(); n++; console.log("  ok   " + name); };

/* ---- the blanker: what must vanish ---- */

t("a line comment's contents are blanked and its newline kept", () => {
  const s = blankJs("a();// ok(1)\nb();");
  assert.ok(!/ok\(/.test(s), "mention inside a comment survived");
  assert.equal(s.split("\n").length, 2);
});

t("a block comment spanning lines keeps every newline, so line numbers do not move", () => {
  const src = "x;\n/* ok(1)\n   ok(2)\n*/\ny;";
  const s = blankJs(src);
  assert.equal(s.split("\n").length, src.split("\n").length);
  assert.ok(!/ok\(/.test(s));
});

t("a string literal's contents are blanked", () => {
  assert.ok(!/ok\(/.test(blankJs('log("ok(3)");')));
});

/* THE ONE THAT CAUGHT THE FIRST VERSION. It blanked from the first `${` to the end of the
 * file, so every call site after the first template literal disappeared and 18 of 44
 * blackbox test files were reported as having zero assertions. */
t("code AFTER a template literal survives — the defect that reported 18 real tests as empty", () => {
  const src = 'const f = (c,m) => { console.log(`  ${c ? "y" : "N"} - ${m}`); };\nok(1, "first");\nok(2, "second");';
  const s = blankJs(src);
  assert.equal((s.match(/ok\(/g) || []).length, 2, "call sites after a template were swallowed");
});

t("a template hole is code and keeps its contents; the surrounding text does not", () => {
  const s = blankJs("`text ${ok(1)} more text`");
  assert.ok(/ok\(1\)/.test(s), "the hole's code was blanked");
  assert.ok(!/text/.test(s), "the template's literal text survived");
});

t("nested templates through a hole close in the right order", () => {
  const s = blankJs("`a ${ `b ${ ok(1) } c` } d`; ok(2);");
  assert.equal((s.match(/ok\(/g) || []).length, 2);
  assert.ok(!/[abcd]/.test(s.replace(/ok\(\d\)/g, "")), "template text leaked");
});

/* Regex literals: a quote inside one is not a string. Without the regex rule the apostrophe
 * below opens a string that runs to the next quote and eats the call site after it. */
t("a quote inside a regex literal does not open a string", () => {
  const s = blankJs("const r = /['\"]/g;\nok(1, \"after\");");
  assert.equal((s.match(/ok\(/g) || []).length, 1, "a regex-quoted char swallowed the next site");
});

t("division is not mistaken for a regex", () => {
  const s = blankJs("const q = a / b; ok(1);\nconst z = c / d;");
  assert.equal((s.match(/ok\(/g) || []).length, 1);
});

/* ---- rust ---- */

t("a raw string's contents are blanked, delimiters and all", () => {
  assert.ok(!/assert!/.test(blankRust('let s = r#"assert!(x)"#;')));
});

/* THE RUST TWIN of the regex case, and it cost two real tests. `'"'` is a char literal; read
 * as a string opener its quote runs to the next one in the file. */
t("a char literal holding a quote does not open a string", () => {
  const s = blankRust("let q = '\"'; #[test]\nfn a() { assert!(x); }");
  assert.ok(/#\[test\]/.test(s), "a char-literal quote swallowed the following #[test]");
  assert.ok(/assert!/.test(s));
});

t("a lifetime is not mistaken for an unterminated char literal", () => {
  const s = blankRust("fn f<'a>(x: &'a str) { assert!(x.len() > 0); }");
  assert.ok(/assert!/.test(s), "a lifetime blanked live code");
});

t("nested block comments close correctly (rust allows them, C does not)", () => {
  const s = blankRust("/* a /* b */ c */ assert!(x);");
  assert.ok(/assert!/.test(s), "the nested comment ate live code");
});

/* THE SECOND ONE THAT CAUGHT A REAL VERSION: arch_test.rs is an integration test, so the
 * whole file is the test crate and it carries no #[cfg(test)]. Requiring the attribute
 * reported the eight guards that cycle 9 actually attacked as zero. */
t("an integration test under tests/ counts its assertions with no #[cfg(test)] present", () => {
  const f = path.join("C:/Users/nname/Desktop/lighthouse/consonance/src-tauri", "tests", "arch_test.rs");
  const r = rustSites(f);
  assert.ok(r.sites.length >= 8, `arch_test.rs reported ${r.sites.length} sites`);
  assert.equal(r.tests, 8, `found ${r.tests} #[test] fns; cargo runs 8`);
  const named = new Set(r.sites.map(s => s.test));
  assert.ok(named.has("no_serialized_struct_carries_a_rank_field_without_an_exemption"),
            "the one guard this room has ever seen fire was not attributed to its test");
});

t("an assertion in production code is not counted as a guard the suite runs", () => {
  const tmp = path.join(require("os").tmpdir(), "census_prod.rs");
  require("fs").writeFileSync(tmp, "fn live() { assert!(x); }\n#[cfg(test)]\nmod tests {\n#[test]\nfn a() { assert_eq!(1,1); }\n}\n");
  const r = rustSites(tmp);
  assert.equal(r.sites.length, 1, "the production assert! was counted");
  assert.equal(r.sites[0].test, "a");
});

/* ---- js site attribution ---- */

t("a helper is found by what its body does, not by being called ok", () => {
  const tmp = path.join(require("os").tmpdir(), "census_helper.js");
  require("fs").writeFileSync(tmp, 'let fails=0;\nfunction verify(cond,msg){ if(!cond){ console.log("FAIL "+msg); fails++; } }\nverify(1,"a");\nverify(2,"b");\n');
  const r = jsSites(tmp);
  assert.ok(r.helpers.includes("verify"), "helper named something other than ok was missed");
  assert.equal(r.sites.length, 2);
});

t("a file with no failure path at all reports zero sites rather than passing silently", () => {
  const tmp = path.join(require("os").tmpdir(), "census_reporter.js");
  require("fs").writeFileSync(tmp, 'console.log("a number: " + 42);\n');
  assert.equal(jsSites(tmp).sites.length, 0);
});

/* ---- site resolution: the attribution that looked precise and was not ---- */

/* THE THIRD DEFECT THIS FILE RECORDS. The first resolver took the topmost non-hook frame,
 * which is the HELPER'S declaration — one identical line number for every guard in a file. */
t("the site is the CALLER, not the helper's declaration line", () => {
  const out = '@@FAILEV ' + JSON.stringify({ msg: "  FAIL something", frames: ["C:/x/test_a.js:9", "C:/x/test_a.js:120"] });
  const r = resolveSites(out, new Set(["test_a.js:120"]));   // 9 is the helper, 120 is the site
  assert.deepEqual(r.fired, ["test_a.js:120"]);
});

t("the closing tally is recognised as a summary, not counted as a thirteenth guard", () => {
  const out = '@@FAILEV ' + JSON.stringify({ msg: "3 FAILURE(S)", frames: ["C:/x/test_a.js:200"] });
  const r = resolveSites(out, new Set(["test_a.js:120"]));
  assert.equal(r.fired.length, 0);
  assert.equal(r.summaries, 1);
  assert.equal(r.unresolved, 0, "the end-of-run tally was counted as an unattributed guard");
});

t("a FAIL that resolves to no known site is reported unresolved, never guessed at", () => {
  const out = '@@FAILEV ' + JSON.stringify({ msg: "  FAIL elsewhere", frames: ["C:/x/other.js:4"] });
  const r = resolveSites(out, new Set(["test_a.js:120"]));
  assert.equal(r.fired.length, 0);
  assert.equal(r.unresolved, 1);
});

/* ---- the html source that the mutation universe left out ---- */

t("only <script> contents are mutable, and offsets do not move", () => {
  const html = '<p>count 12 things</p>\n<script>\nconst n = 34;\n</script>\n<p>and 56</p>';
  const kept = onlyScript(html);
  assert.equal(kept.length, html.length, "offsets shifted — every mutation site would be wrong");
  assert.ok(/34/.test(kept), "script content was blanked");
  assert.ok(!/12/.test(kept) && !/56/.test(kept), "markup text stayed mutable");
});

t("a mutation offset taken from blanked text still names the real bytes", () => {
  const html = '<p>12</p><script>const n = 34;</script>';
  const mus = mutants(onlyScript(html), "js").filter(m => m.from === "34");
  assert.equal(mus.length, 1, "the only mutable number was not found");
  assert.equal(html.slice(mus[0].at, mus[0].at + mus[0].len), "34", "the offset does not hold what it claims");
});

/* ---- referent extraction: the third instance of the one lexing bug ---- */

t("a quote inside a regex does not become a referent — the defect that produced \" +\\r\\n   \"", () => {
  const { codeStrings } = require("./guard-census.js");
  const src = 'const q = /["\']/g;\nok(src.includes("const CELL_BUDGET = 2000000"), "present");';
  const lits = codeStrings(src).map(s => s.text);
  assert.ok(lits.includes("const CELL_BUDGET = 2000000"), "the real referent was lost");
  assert.ok(!lits.some(s => /^\s*\+/.test(s)), "a concatenation artifact came back as a referent");
});

t("a rule quoted in a COMMENT is a mention, not a referent", () => {
  const { codeStrings } = require("./guard-census.js");
  const lits = codeStrings('/* the rule is "const X = 1" */\nok(src.includes("const Y = 2"), "m");').map(s => s.text);
  assert.ok(!lits.includes("const X = 1"));
  assert.ok(lits.includes("const Y = 2"));
});

/* ---- node:test frames arrive coloured ---- */

t("an ANSI-coloured stack frame still resolves to its site", () => {
  const { toolFrames } = require("./guard-census.js");
  const out = "      at TestContext.<anonymous> \x1b[90m(C:\\a\\b\\\x1b[39mgroove.test.js:287:10\x1b[90m)\x1b[39m";
  assert.deepEqual(toolFrames(out, new Set(["groove.test.js:287"])), ["groove.test.js:287"]);
});

t("a coloured frame at a line that is NOT a site is still not attributed", () => {
  const { toolFrames } = require("./guard-census.js");
  const out = "\x1b[39mgroove.test.js:999:1\x1b[90m";
  assert.deepEqual(toolFrames(out, new Set(["groove.test.js:287"])), []);
});

console.log(`\n${n} passed`);
