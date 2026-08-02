/* guard-census.js — how many of this room's guards have ever been shown to fail?
 *
 * WHY THIS EXISTS. `muscle_map.md`'s newest root, the quenched check, states a trigger form:
 * *a check may not count as a check until it has been shown to FAIL against its referent.*
 * That is currently asserted as discipline and has never been counted. Discipline that is
 * never counted is the quenched check eating itself — the RULE is check-shaped, so it
 * satisfies the urge that would have produced the measurement.
 *
 * WHAT IT MEASURES, in three stages, each with its own denominator:
 *
 *   inventory   every assertion SITE in a corpus, and every test file that has none.
 *   history     for each test file: does it discriminate the state it was BORN to guard?
 *               (check the source out at the commit before the test appeared, run the test
 *               as it was written, classify the result.) A real historical defect, not a
 *               synthetic one — this is the only arm that can answer "has it ever."
 *   mutation    for the ones history cannot reach: CAN it be made to fail at all? Perturb
 *               the source the guard reads and see whether that guard, by name, fires.
 *
 * THE NEGATIVE CONTROL, and it is the point rather than a caveat. A guard that was RED is
 * not thereby a guard that was demonstrated. Every red is classified before it counts:
 *
 *   TRIGGER-RED    a named assertion fired with its own message at a source line.  COUNTS.
 *   CRASH-RED      an uncaught throw, a compile error, a missing module.       DOES NOT.
 *   ABSENT-RED     the guard fired because its subject did not exist yet — the assertion
 *                  that a function is present, run against a tree predating it. DOES NOT.
 *   NOT-RUN        skipped, filtered out, or never reached.  Reported separately; a skip
 *                  is never folded into either green or red.
 *
 * If a run cannot be classified, it is recorded UNCLASSIFIED and counted against the
 * census, never quietly dropped into the class that makes the number cleaner.
 *
 * WHAT THE ANSWER DOES NOT MEAN — read before quoting a number off this tool.
 *   - `mutation` measures a LOWER BOUND on capability. A guard no mutation fired may still
 *     be capable of firing against a mutation this tool did not generate. Unfired is not
 *     the same as vacuous, and the report never says vacuous.
 *   - `history` measures the birth state only. A guard born green may have gone red on a
 *     later day in somebody's working tree; a red that was fixed before the commit leaves
 *     no trace in git at all. This tool cannot see those and neither can anyone else.
 *   - the assertion SITE is the unit here. Prior measurements in this room counted test
 *     CASES and called them assertions; the two differ by more than 2x in the Rust corpus.
 *     Numbers from the two units are not comparable and are never summed.
 *   - IT MEASURES DEMONSTRATION, NEVER IMPORTANCE. A guard shown firing on something
 *     trivial scores exactly the same as one shown firing on the thing that would ruin the
 *     app. This number is therefore not a safety metric and cannot support a sentence of
 *     the form "we are covered" — every site here counts one, and nothing in the corpus
 *     records what any of them is worth. (Found by an adversarial cross-model audit,
 *     2026-08-02; the limit was real and was not in this block.)
 *   - THE RATE IS OPERATOR-RELATIVE, and a fixed seed plus a published operator list is
 *     Goodhart bait: guards written to catch off-by-ones and boundary flips would raise the
 *     number without raising safety. `--ops wide` holds five operators in reserve for
 *     exactly this reason, and `mutation-*-wide.jsonl` is kept in a separate ledger so the
 *     two rates can never be quietly merged into one.
 *
 * Usage:
 *   node guard-census.js inventory              both corpora, site counts and empties
 *   node guard-census.js history   [--limit N]  birth-discrimination, blackbox
 *   node guard-census.js mutation  [--corpus X] perturb source, record which guards fire
 *   node guard-census.js report                 read the jsonl, print the census
 */
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const OUT = path.join(__dirname, "..", "data", "guard-census");        // small artifacts: jsonl + report
/* Working copies live OUTSIDE the repo. This census makes three 50 MB copies of blackbox and a
 * git worktree; the first run put them under `consonance/data/`, which is not gitignored, in a
 * repo whose README says it is public. Nothing was committed — `git status` caught it — but the
 * default was one `git add -A` away from publishing a mirror of another repo. Scratch belongs
 * in scratch. */
const SCRATCH = path.join(require("os").tmpdir(), "guard-census");
const BLACKBOX = "C:/Users/nname/Desktop/blackbox";
const SRCTAURI = "C:/Users/nname/Desktop/lighthouse/consonance/src-tauri";
const TOOLS = path.join(__dirname);
const CARGO = path.join(process.env.USERPROFILE || "", ".cargo", "bin", "cargo.exe");

/* ---------------------------------------------------------------- lexing ---
 * Comments and string literals are blanked to spaces of equal length before any pattern
 * runs, so `ok(` inside a comment or a message string is not a site and line numbers are
 * untouched. This repo has been bitten four times by lexical checks that could not tell
 * using from mentioning (see covgap.js's header); the difference here is that the blanking
 * is verified — `selftest` asserts the blanker on cases of each kind.
 */
function blankJs(src, collect) {
  const n = src.length;
  const out = src.split("");
  const blank = (a, b) => { for (let k = a; k < b; k++) if (out[k] !== "\n") out[k] = " "; };
  // stack entry 'tmpl' = inside a template literal's string part; 'hole' = inside its ${…},
  // which is CODE and must keep its contents. Explicit stack because templates nest through
  // holes arbitrarily deep, and the first version of this function tried to do it with an
  // inner loop and silently blanked the rest of every file after the first `${…}`.
  const stack = [];
  let i = 0, lastSig = "";                 // last significant char, for the regex/divide call
  const REGEX_PREV = "(,=:[!&|?{};+-*%~^<>";
  const isRegexStart = () => !lastSig || REGEX_PREV.includes(lastSig) ||
    /\b(return|typeof|instanceof|in|of|case|new|delete|void|do|else|yield|await)$/.test(preWord);
  let preWord = "";
  while (i < n) {
    const top = stack.length ? stack[stack.length - 1] : null;
    const c = src[i], d = src[i + 1];
    if (top && top.type === "tmpl") {
      if (c === "\\") { blank(i, i + 2); i += 2; continue; }
      if (c === "`") { blank(i, i + 1); stack.pop(); i++; continue; }
      if (c === "$" && d === "{") { blank(i, i + 2); stack.push({ type: "hole", depth: 1 }); i += 2; continue; }
      blank(i, i + 1); i++; continue;
    }
    if (c === "/" && d === "*") { const e = src.indexOf("*/", i + 2); const end = e < 0 ? n : e + 2; blank(i, end); i = end; continue; }
    if (c === "/" && d === "/") { let e = src.indexOf("\n", i); if (e < 0) e = n; blank(i, e); i = e; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n) { if (src[j] === "\\") { j += 2; continue; } if (src[j] === c || src[j] === "\n") break; j++; }
      if (collect && src[j] === c) collect.push({ at: i + 1, text: src.slice(i + 1, j).replace(/\\(.)/g, "$1"), line: lineOf(src, i) });
      const end = Math.min(j + 1, n); blank(i, end); i = end; lastSig = '"'; preWord = ""; continue;
    }
    if (c === "`") { blank(i, i + 1); stack.push({ type: "tmpl" }); i++; continue; }
    if (c === "/" && isRegexStart()) {                    // regex literal: quotes inside are not strings
      let j = i + 1, cls = false, ok = false;
      while (j < n) {
        const e = src[j];
        if (e === "\\") { j += 2; continue; }
        if (e === "\n") break;
        if (e === "[") cls = true;
        else if (e === "]") cls = false;
        else if (e === "/" && !cls) { ok = true; break; }
        j++;
      }
      if (ok) { while (j + 1 < n && /[a-z]/.test(src[j + 1])) j++; blank(i, j + 1); i = j + 1; lastSig = "/"; preWord = ""; continue; }
    }
    if (top && top.type === "hole") {
      if (c === "{") { top.depth++; }
      else if (c === "}") { top.depth--; if (top.depth === 0) { blank(i, i + 1); stack.pop(); i++; continue; } }
    }
    if (!/\s/.test(c)) { lastSig = c; preWord = /[\w$]/.test(c) ? (preWord + c) : ""; }
    i++;
  }
  return out.join("");
}

function blankRust(src) {
  const out = src.split("");
  let i = 0; const n = src.length;
  const blank = (a, b) => { for (let k = a; k < b; k++) if (out[k] !== "\n") out[k] = " "; };
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === "/" && d === "*") { let depth = 1, j = i + 2; while (j < n && depth > 0) { if (src[j] === "/" && src[j + 1] === "*") { depth++; j += 2; } else if (src[j] === "*" && src[j + 1] === "/") { depth--; j += 2; } else j++; } blank(i, j); i = j; continue; }
    if (c === "/" && d === "/") { let e = src.indexOf("\n", i); if (e < 0) e = n; blank(i, e); i = e; continue; }
    if (c === "r" && (d === '"' || d === "#")) {                       // raw string r"..." / r#"..."#
      let h = 0, j = i + 1; while (src[j] === "#") { h++; j++; }
      if (src[j] === '"') { const close = '"' + "#".repeat(h); const e = src.indexOf(close, j + 1); const end = e < 0 ? n : e + close.length; blank(i, end); i = end; continue; }
    }
    if (c === '"') { let j = i + 1; while (j < n) { if (src[j] === "\\") { j += 2; continue; } if (src[j] === '"') break; j++; } blank(i, Math.min(j + 1, n)); i = j + 1; continue; }
    // A char literal, which is NOT a lifetime. `'"'` is the case that matters: without this
    // rule its quote opens a string that runs to the next one, and in arch_test.rs that ate
    // two of the eight #[test] attributes — an undercount in the file whose guards are the
    // only ones in this repo ever attacked on purpose.
    if (c === "'") {
      let j = i + 1;
      if (src[j] === "\\") { let k = j + 1; while (k < n && src[k] !== "'" && k - j < 8) k++; if (src[k] === "'") { blank(i, k + 1); i = k + 1; continue; } }
      else if (src[j + 1] === "'") { blank(i, j + 2); i = j + 2; continue; }
      i++; continue;                                          // a lifetime: nothing to blank
    }
    i++;
  }
  return out.join("");
}

const lineOf = (src, idx) => src.slice(0, idx).split("\n").length;

/* String literals that are CODE — comments skipped, so a rule quoted in prose is not a
 * referent. This DELEGATES to blankJs's collector rather than walking the source again: the
 * first version was a second scanner, it did not know about regex literals, and `/["']/`
 * opened a string that ran to the next quote and produced ` +\r\n        ` as a "referent."
 * Third instance of that same defect today, twice in code I wrote to avoid it. The rule is
 * not "be careful with quotes" — it is DO NOT WRITE A SECOND LEXER. */
function codeStrings(src) {
  const found = [];
  blankJs(src, found);
  return found;
}

/* ------------------------------------------------------------ inventory ---
 * A SITE is one check that can independently turn its runner red.
 *
 * JS: this repo has no framework, so each test file rolls its own. Three idioms are in use
 * and all three are found by the same rule rather than by a hardcoded name list: a helper
 * is any function whose BODY records a failure (increments a counter, prints FAIL, or exits
 * nonzero), and a site is a call to one. Inline `if (...) { ...; process.exit(1) }` counts
 * as a site of its own. A file with no site of either kind is not a test — it is a
 * reporter, and the census says so rather than counting it as a passing guard.
 */
function jsSites(file) {
  const raw = fs.readFileSync(file, "utf8");
  const src = blankJs(raw);
  const helpers = new Set(), declAt = new Set();
  // function NAME(...) { ...FAIL/fails++/exit... }   and   const NAME = (...) => { ... }
  const declRe = /(?:function\s+([A-Za-z_$][\w$]*)\s*\(|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:function\s*)?\([^)]*\)\s*=>)/g;
  let m;
  while ((m = declRe.exec(src))) {
    const name = m[1] || m[2];
    const open = src.indexOf("{", m.index + m[0].length - 1);
    if (open < 0) continue;
    let depth = 0, j = open;
    for (; j < src.length; j++) { if (src[j] === "{") depth++; else if (src[j] === "}") { depth--; if (!depth) break; } }
    const body = raw.slice(open, j + 1);
    if (/fails?\s*\+\+|failures\s*\+\+|\bFAIL\b|process\.exit\(1\)|throw new/.test(body) && /\b(cond|c|ok|pass)\b|\(!/.test(body)) {
      helpers.add(name);
      declAt.add(lineOf(src, m.index));            // the declaration is not a call site
    }
  }
  const sites = [];
  if (helpers.size) {
    const callRe = new RegExp("(?:^|[^\\w$.])(" + [...helpers].join("|") + ")\\s*\\(", "g");
    while ((m = callRe.exec(src))) {
      const ln = lineOf(src, m.index + m[0].indexOf(m[1]));
      if (declAt.has(ln)) continue;
      sites.push({ line: ln, kind: "helper:" + m[1] });
    }
  }
  // inline exits: a process.exit(1) that is not inside a helper we already counted
  const exitRe = /process\.exit\(\s*1\s*\)/g;
  while ((m = exitRe.exec(src))) {
    const ln = lineOf(src, m.index);
    if (!sites.some(s => Math.abs(s.line - ln) < 3)) sites.push({ line: ln, kind: "inline-exit" });
  }
  // node:assert, used by the tools/ corpus
  const assertRe = /(?:^|[^\w$.])assert(?:\.\w+)?\s*\(/g;
  while ((m = assertRe.exec(src))) sites.push({ line: lineOf(src, m.index), kind: "node-assert" });
  sites.sort((a, b) => a.line - b.line);
  return { file, sites, helpers: [...helpers] };
}

/* Rust: a site is an assertion macro inside a #[cfg(test)] region, attributed to the
 * enclosing #[test] fn. Regions are brace-matched from the module the attribute introduces,
 * so an assertion in production code (there are none today, but there could be) is not
 * counted as a guard the suite runs. */
function rustSites(file) {
  const raw = fs.readFileSync(file, "utf8");
  const src = blankRust(raw);
  const regions = [];
  let m;
  // An integration test under tests/ IS the test crate — the whole file is a test region and
  // carries no #[cfg(test)]. The first version required the attribute and therefore reported
  // arch_test.rs, the one file in this repo whose guards have actually been attacked on
  // purpose, as having zero assertions.
  if (/[\\/]tests[\\/]/.test(file)) regions.push([0, src.length]);
  const cfgRe = /#\[cfg\(test\)\]/g;
  while ((m = cfgRe.exec(src))) {
    const open = src.indexOf("{", m.index);
    if (open < 0) continue;
    let depth = 0, j = open;
    for (; j < src.length; j++) { if (src[j] === "{") depth++; else if (src[j] === "}") { depth--; if (!depth) break; } }
    regions.push([open, j]);
  }
  const inTest = i => regions.some(([a, b]) => i >= a && i <= b);
  // map char offset -> enclosing #[test] fn name
  // Find every #[test], then the NEXT `fn name(` after it. An earlier version bounded the
  // gap at 200 chars and lost two of arch_test.rs's eight tests to their doc comments —
  // an undercount that would have shrunk the census's own denominator.
  const fns = [];
  const tagRe = /#\[test\]/g;
  while ((m = tagRe.exec(src))) {
    const f = /fn\s+([A-Za-z_][\w]*)\s*\(/.exec(src.slice(m.index));
    if (f) fns.push({ at: m.index, name: f[1] });
  }
  const nameAt = i => { let best = null; for (const f of fns) if (f.at <= i) best = f; return best ? best.name : "(file-level helper)"; };
  const sites = [];
  const aRe = /\b(assert!|assert_eq!|assert_ne!|panic!)/g;
  while ((m = aRe.exec(src))) {
    if (!inTest(m.index)) continue;
    sites.push({ line: lineOf(src, m.index), kind: m[1], test: nameAt(m.index) });
  }
  return { file, sites, tests: fns.length };
}

function inventory() {
  const corpora = {};
  // TRACKED test files only. Another instance's uncommitted work-in-progress sits in this
  // repo tonight, and letting it into the denominator would make the census's own numbers
  // move under it between runs.
  const tracked = new Set(run("git", ["-C", BLACKBOX, "ls-files"], BLACKBOX).out.trim().split("\n"));
  const bbFiles = fs.readdirSync(BLACKBOX).filter(n => /^test_.*\.js$/.test(n) && tracked.has(n)).sort();
  corpora.blackbox = bbFiles.map(n => jsSites(path.join(BLACKBOX, n)));
  const rsFiles = [];
  const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== "target") walk(p); } else if (e.name.endsWith(".rs")) rsFiles.push(p); } };
  walk(path.join(SRCTAURI, "src")); walk(path.join(SRCTAURI, "tests"));
  corpora.srctauri = rsFiles.sort().map(rustSites);
  corpora.tools = fs.readdirSync(TOOLS).filter(n => /\.test\.js$/.test(n)).sort().map(n => jsSites(path.join(TOOLS, n)));
  return corpora;
}

/* ------------------------------------------------------ site attribution ---
 * A FAIL line tells you a guard fired; it does not tell you WHICH guard. Matching the
 * printed message back to a source string is the mention-vs-use problem again — messages
 * interpolate, and two guards in a file often share wording.
 *
 * So attribution is taken from the stack instead of from the text. `_sitehook.js` wraps
 * console.log in the test process; when a logged line contains FAIL it prints the WHOLE
 * frame list, and resolution happens here against the inventory: the site is the first
 * frame that is a known assertion site in that file.
 *
 * Resolving against the inventory rather than against the stack alone is the load-bearing
 * part. The first version took the topmost non-hook frame and got the HELPER'S OWN
 * declaration line for every one of twelve results — a plausible file:line that was the
 * same number for every guard in the file, which is exactly the shape of an answer that
 * looks attributed and is not. It also silently counted each file's closing
 * `console.log(\`\${fails} FAILURE(S)\`)` as a thirteenth guard.
 *
 * Events that resolve to no known site are counted and reported as unresolved; the
 * end-of-run summary line is recognised by shape and excluded rather than counted as one.
 */
const SITEHOOK = `/* written by guard-census.js — reports the frames behind any FAIL */
(function () {
  const _l = console.log.bind(console);
  const self = __filename;
  console.log = function (...a) {
    let s = ""; try { s = a.map(x => typeof x === "string" ? x : require("util").inspect(x)).join(" "); } catch (e) {}
    if (/FAIL/.test(s)) {
      const frames = (new Error().stack || "").split("\\n").slice(1);
      const here = [];
      for (const f of frames) {
        const m = /\\(?([A-Za-z]:[^):]*\\.js):(\\d+):(\\d+)\\)?\\s*$/.exec(f.trim());
        if (m && m[1] !== self) here.push(m[1] + ":" + m[2]);
      }
      _l("@@FAILEV " + JSON.stringify({ msg: s.slice(0, 120), frames: here }));
    }
    return _l(...a);
  };
})();
`;

/* the closing tally every one of these files prints; it contains FAIL and is not a guard */
const SUMMARY = /^\s*\d+\s+(FAILURE\(S\)|FAILED|FAILURES?)\b|FAILURE\(S\)\s*$/;

/** Resolve @@FAILEV events to assertion sites, using the inventory as the authority. */
function resolveSites(out, siteIndex) {
  const fired = new Set();
  let unresolved = 0, summaries = 0;
  for (const m of out.matchAll(/@@FAILEV (\{.*\})/g)) {
    let ev; try { ev = JSON.parse(m[1]); } catch (e) { unresolved++; continue; }
    let hit = null;
    for (const f of ev.frames) {
      const i = f.lastIndexOf(":");
      const key = path.basename(f.slice(0, i)) + ":" + f.slice(i + 1);
      if (siteIndex.has(key)) { hit = key; break; }
    }
    if (hit) fired.add(hit);
    else if (SUMMARY.test(ev.msg.trim())) summaries++;
    else unresolved++;
  }
  return { fired: [...fired], unresolved, summaries };
}

/** basename:line for every known assertion site in a corpus — the resolver's authority. */
function siteIndexFor(files) {
  const s = new Set();
  for (const f of files) for (const st of f.sites) s.add(path.basename(f.file) + ":" + st.line);
  return s;
}

function installHook(dir) {
  fs.writeFileSync(path.join(dir, "_sitehook.js"), SITEHOOK);
  const files = fs.readdirSync(dir).filter(n => /^test_.*\.js$|\.test\.js$/.test(n));
  for (const n of files) {
    const p = path.join(dir, n);
    let src = fs.readFileSync(p, "utf8");
    if (src.includes("_sitehook")) continue;
    // Appended to the END of the "use strict" line, never on a line of its own: the resolver
    // matches file:line against the inventory, and inserting a line would shift every site
    // in the file by one — an attribution that is off by one everywhere and looks precise.
    const m = /^(?:\s*\/\*[\s\S]*?\*\/\s*)?"use strict";/.exec(src);
    const at = m ? m.index + m[0].length : 0;
    src = src.slice(0, at) + ` require(${JSON.stringify("./_sitehook.js")});` + src.slice(at);
    fs.writeFileSync(p, src);
  }
  return files.length;
}

/* Outcome of one test process. The classes are the negative control: only TRIGGER counts. */
function classify(name, code, out, opts = {}) {
  const r = resolveSites(out, opts.siteIndex || new Set());
  const sites = r.fired;
  const failLines = (out.match(/@@FAILEV/g) || []).length - r.summaries;
  if (/^SKIP:|\bSKIP:/m.test(out) && code === 0) return { name, klass: "NOT-RUN", sites: [], note: "skipped" };
  if (code === 0) return { name, klass: "GREEN", sites: [] };
  if (opts.subjectAbsent) return { name, klass: "ABSENT-RED", sites, note: opts.subjectAbsent };
  if (/Cannot find module|SyntaxError|ReferenceError|TypeError|is not a function|error\[E\d+\]|error: /.test(out) && !failLines)
    return { name, klass: "CRASH-RED", sites: [], note: (/(?:Error|error)[^\n]{0,90}/.exec(out) || [""])[0] };
  if (failLines && sites.length) return { name, klass: "TRIGGER-RED", sites, unresolved: r.unresolved };
  if (failLines && !sites.length) return { name, klass: "UNCLASSIFIED", sites: [], note: `${failLines} FAIL event(s), none resolved to a known site` };
  return { name, klass: "CRASH-RED", sites: [], note: "nonzero exit, no FAIL line" };
}

/* ------------------------------------------------------------- mutation ---
 * Operators are deliberately few and plausible: an off-by-one on a literal, a boundary
 * flipped, a conjunction turned into a disjunction. These are the defects this room's own
 * history is made of (the `pos` boundary bug, the cursor-vs-capacity count, the trim window
 * read at the wrong default). Positions come from the BLANKED source, so a number inside a
 * comment or a message string is never mutated and a mutation is never cosmetic.
 */
function mutants(src, lang, set = "narrow") {
  const blanked = lang === "rs" ? blankRust(src) : blankJs(src);
  const out = [];
  const push = (i, len, to, op) => out.push({ at: i, len, to, op, from: src.slice(i, i + len), line: lineOf(src, i) });
  let m;
  const numRe = /(?<![\w.])(\d+)(?:\.(\d+))?(?![\w.])/g;

  if (set === "narrow" || set === "both") {
    while ((m = numRe.exec(blanked))) {
      const txt = m[0];
      const v = parseFloat(txt);
      const to = m[2] === undefined ? String(v + 1) : (v * 1.25).toFixed(Math.min(6, (m[2] || "").length + 1));
      push(m.index, txt.length, to, "num");
    }
    for (const [re, map, op] of [
      [/(?<![<>=!])(<=|>=|===|!==|==|!=|<|>)(?![=>])/g,
       { "<=": "<", ">=": ">", "<": "<=", ">": ">=", "===": "!==", "!==": "===", "==": "!=", "!=": "==" }, "cmp"],
      [/(&&|\|\|)/g, { "&&": "||", "||": "&&" }, "logic"],
    ]) {
      while ((m = re.exec(blanked))) { const to = map[m[1]]; if (to) push(m.index, m[1].length, to, op); }
    }
  }

  /* THE HELD-OUT SET. The narrow three (±1, boundary flip, conjunction flip) are the operators
   * the first census measured with, and a floor measured with three operators can mean "the
   * guards are weak" or "the operators are weak" — the number alone cannot separate those.
   * These five are disjoint from the narrow three by construction, so the DELTA in demonstrated
   * sites is attributable to the operator set and nothing else. They also exist to be held out:
   * publishing a fixed seed and a fixed operator list invites guards written to catch exactly
   * those, and a reserve nobody has optimised against is the only defence that keeps working. */
  if (set === "wide" || set === "both") {
    numRe.lastIndex = 0;
    while ((m = numRe.exec(blanked))) {
      const txt = m[0], v = parseFloat(txt);
      push(m.index, txt.length, v === 0 ? "1" : "0", "zero");            // collapse, not nudge
      if (v !== 0) push(m.index, txt.length, "-" + txt, "neg");          // sign inversion
    }
    // return-value inversion: the boolean a caller actually branches on
    for (const [re, map] of [[/\breturn (true|false)\b/g, { true: "return false", false: "return true" }]]) {
      while ((m = re.exec(blanked))) push(m.index, m[0].length, map[m[1]], "retbool");
    }
    // statement deletion — restricted to a whole line that is a bare call expression, so the
    // parse survives; anything that could be a declaration or a control header is left alone
    const lineRe = lang === "rs" ? /^[ \t]*([a-z_][\w:.]*(?:\([^;{}]*\))?[^;{}\n]*);[ \t]*$/gm
                                 : /^[ \t]*([A-Za-z_$][\w$.]*\([^;{}\n]*\));[ \t]*$/gm;
    while ((m = lineRe.exec(blanked))) {
      if (/\b(let|const|var|return|if|for|while|fn|use|mod|match)\b/.test(m[0])) continue;
      const at = m.index + m[0].indexOf(m[1]);
      push(at, m[1].length, lang === "rs" ? "()" : "void 0", "del");     // keep it a statement
    }
  }
  return out.sort((a, b) => a.at - b.at || a.op.localeCompare(b.op));
}

/** Blank everything outside <script>…</script> so offsets stay true and markup is untouched. */
function onlyScript(html) {
  const out = html.split("");
  let keep = new Array(html.length).fill(false);
  const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    const a = m.index + m[0].indexOf(">") + 1;
    for (let i = a; i < a + m[1].length; i++) keep[i] = true;
  }
  for (let i = 0; i < out.length; i++) if (!keep[i] && out[i] !== "\n") out[i] = " ";
  return out.join("");
}

/* Narrow and wide results live in SEPARATE files. Appending the held-out set into the same
 * ledger would silently redefine what every previously quoted rate was a rate OF — the
 * denominator moving under a number that keeps its name. */
const MUTFILE = (corpus, opset) => `mutation-${corpus}${opset === "narrow" ? "" : "-" + opset}.jsonl`;

/* ------------------------------------------------------- crash-safe edit ---
 * A `finally` does not run when the process is SIGKILLed, and an in-place sweep that dies
 * mid-mutation leaves the keeper's source perturbed. That has now happened TWICE tonight —
 * `whats-live.js` and `main.rs` — both caught by `git status` and reverted by hand. Twice is
 * a mechanism, not a lesson: the original bytes go to disk BEFORE the mutation does, and any
 * later run restores them before doing anything else.
 *
 * Note what this is not: it is not a guard against losing the work. It is a guard against
 * leaving a perturbation in somebody else's tree, which is the harm.
 */
function inflightPath() { fs.mkdirSync(SCRATCH, { recursive: true }); return path.join(SCRATCH, "inflight.json"); }

function withRestore(p, fn) {
  const orig = fs.readFileSync(p);
  fs.writeFileSync(inflightPath(), JSON.stringify({ path: p, bytes: orig.toString("base64") }));
  try { return fn(); }
  finally { fs.writeFileSync(p, orig); try { fs.unlinkSync(inflightPath()); } catch (e) {} }
}

function restoreInflight() {
  const f = inflightPath();
  if (!fs.existsSync(f)) return false;
  let rec; try { rec = JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { fs.unlinkSync(f); return false; }
  fs.writeFileSync(rec.path, Buffer.from(rec.bytes, "base64"));
  fs.unlinkSync(f);
  console.log(`RESTORED a mutation left in place by a killed run: ${rec.path}`);
  return true;
}

/* deterministic sample, so a re-run of the census reproduces the same perturbations */
function pick(list, k, seed) {
  let s = seed >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, k);
}

/* `timedOut` is reported, not folded into the exit code. The held-out operators make it
 * matter: zeroing a loop step or deleting an advance statement produces a mutant that never
 * terminates, and the suite "notices" it only by running out of time. A timeout is NOT a
 * guard firing — nothing was discriminated, the clock simply ran out — so it gets its own
 * class rather than being counted as a catch or buried in CRASH-RED. */
function run(cmd, args, cwd, timeout = 600000) {
  try { return { code: 0, out: execFileSync(cmd, args, { cwd, encoding: "utf8", timeout, maxBuffer: 64 << 20 }) }; }
  catch (e) {
    return { code: e.status === undefined ? 1 : e.status, out: (e.stdout || "") + (e.stderr || ""),
             timedOut: e.killed === true || e.signal === "SIGTERM" };
  }
}

/* ---------------------------------------------------------------- report --- */
function fmtInventory(inv) {
  const lines = [];
  for (const [name, files] of Object.entries(inv)) {
    const total = files.reduce((a, f) => a + f.sites.length, 0);
    const empty = files.filter(f => !f.sites.length);
    lines.push(`\n== ${name}: ${total} assertion sites across ${files.length} files`);
    if (empty.length) {
      lines.push(`   ${empty.length} file(s) with ZERO sites — cannot go red except by crashing:`);
      for (const f of empty) lines.push(`     ${path.basename(f.file)}`);
    }
    const top = files.filter(f => f.sites.length).sort((a, b) => b.sites.length - a.sites.length);
    for (const f of top) lines.push(`   ${String(f.sites.length).padStart(4)}  ${path.basename(f.file)}`);
  }
  return lines.join("\n");
}

/* ------------------------------------------------------------- drivers --- */

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const jsonl = (name, rec) => fs.appendFileSync(path.join(OUT, name), JSON.stringify(rec) + "\n");

/* JS corpora: mutate the sources the tests read, run the suite in a COPY of the repo, and
 * record which named sites fired. A copy rather than the keeper's tree — a census must not
 * be able to leave a perturbation behind if it dies mid-run. */
function mutateJs(corpus, budget, seed, opset) {
  // The tools corpus is mutated IN PLACE. Its tests reach ../data and ../../ by relative
  // path, so a copy under data/ silently changes what they read — a working copy that is
  // not the thing under test is the sandbox-supplies-what-it-verifies defect, and it showed
  // up as a red baseline rather than as a wrong number only by luck.
  const cfg = corpus === "blackbox"
    ? { root: BLACKBOX, work: path.join(SCRATCH, "work-blackbox"), inPlace: false, exclude: ["src-tauri", ".git", "samples"] }
    : { root: TOOLS, work: TOOLS, inPlace: true, exclude: [] };
  fs.mkdirSync(OUT, { recursive: true });
  restoreInflight();
  const resuming = parseInt(arg("--skip", "0"), 10) > 0 && fs.existsSync(cfg.work);
  if (!cfg.inPlace && !resuming) {                    // a resume reuses the copy it left behind
    if (fs.existsSync(cfg.work)) fs.rmSync(cfg.work, { recursive: true, force: true });
    // TRACKED FILES ONLY. Another instance is writing uncommitted work in this repo right now,
    // and an untracked file half-written by somebody else would land in my suite and move my
    // baseline under me. The corpus being censused is the committed one; say which.
    for (const rel of run("git", ["-C", cfg.root, "ls-files"], cfg.root).out.trim().split("\n")) {
      if (!rel || rel.startsWith("src-tauri/")) continue;
      const a = path.join(cfg.root, rel), b = path.join(cfg.work, rel);
      if (!fs.existsSync(a)) continue;
      fs.mkdirSync(path.dirname(b), { recursive: true });
      fs.copyFileSync(a, b);
    }
  }
  // built BEFORE the hook goes in, from the same extractor the inventory publishes
  const siteIndex = siteIndexFor(fs.readdirSync(cfg.work)
    .filter(n => /^test_.*\.js$|\.test\.js$/.test(n)).map(n => jsSites(path.join(cfg.work, n))));
  if (!cfg.inPlace) installHook(cfg.work);            // node:test carries its own stack
  const suiteTimeout = parseInt(arg("--suite-timeout", "600000"), 10);
  const runSuite = () => corpus === "blackbox"
    ? run("node", ["runtests.js"], cfg.work, suiteTimeout)
    : runToolsSuite(cfg.work);
  /* The baseline is measured, not assumed green. The tools corpus is NOT green at HEAD —
   * actors.test.js is red against the live board and there is no runner that would have said
   * so — and aborting here would have hidden that behind "census aborted". Instead the
   * baseline's own reds are recorded and subtracted: a mutation counts as caught only when a
   * guard fires that was NOT already firing before it. Otherwise a standing red would score
   * as a kill for every perturbation in the sweep. */
  const base = runSuite();
  const baseFired = new Set(cfg.inPlace ? toolFrames(base.out, siteIndex) : resolveSites(base.out, siteIndex).fired);
  const baseFiles = new Set([...base.out.matchAll(/^FAIL\s+(\S+)/gm)].map(m => m[1]));
  console.log(base.code === 0
    ? "baseline GREEN in " + cfg.work
    : `baseline RED in ${cfg.work}: ${[...baseFiles].join(",") || "(unnamed)"} — ${baseFired.size} site(s) already firing, subtracted from every result`);

  // ui/index.html still carries 889 lines of inline script, and testenv's uiSource() feeds it
  // to every lexical guard in the suite. Leaving it out of the mutation universe would have
  // measured a SURVIVED rate against a corpus smaller than the one under test — the sample
  // frame quietly excluding part of the population, which reads as a rate and is not one.
  const srcFiles = corpus === "blackbox"
    ? fs.readdirSync(path.join(cfg.work, "ui")).filter(n => /\.js$|^index\.html$/.test(n)).map(n => path.join("ui", n))
    : fs.readdirSync(cfg.work).filter(n => n.endsWith(".js") && !/\.test\.js$|^_sitehook/.test(n));
  const all = [];
  for (const rel of srcFiles) {
    const p = path.join(cfg.work, rel);
    let text = fs.readFileSync(p, "utf8");
    if (rel.endsWith(".html")) text = onlyScript(text);        // never mutate markup or prose
    for (const mu of mutants(text, "js", opset)) all.push({ ...mu, rel });
  }
  const chosen = pick(all, budget, seed);
  console.log(`${all.length} candidate mutations; running ${chosen.length} (seed ${seed})`);
  // --skip resumes an interrupted sweep. pick() is seeded, so positions 1..N are the same
  // perturbations they were the first time and the appended rows stay one sample.
  const skip = parseInt(arg("--skip", "0"), 10);
  let i = 0;
  for (const mu of chosen) {
    i++;
    if (i <= skip) continue;
    const p = path.join(cfg.work, mu.rel);
    const orig = fs.readFileSync(p, "utf8");
    // offsets come from a text that was blanked (comments, strings, markup); confirm the byte
    // range still holds what the mutation says it does before writing anything
    if (orig.slice(mu.at, mu.at + mu.len) !== mu.from) {
      jsonl(MUTFILE(corpus, opset), { n: i, rel: mu.rel, line: mu.line, op: mu.op, from: mu.from, to: mu.to, klass: "MISAPPLIED", sites: [] });
      console.log(`${String(i).padStart(4)}/${chosen.length} MISAPPLIED  ${mu.rel}:${mu.line} — offset does not hold ${JSON.stringify(mu.from)}`);
      continue;
    }
    let r;
    if (cfg.inPlace) r = withRestore(p, () => { fs.writeFileSync(p, orig.slice(0, mu.at) + mu.to + orig.slice(mu.at + mu.len)); return runSuite(); });
    else { try { fs.writeFileSync(p, orig.slice(0, mu.at) + mu.to + orig.slice(mu.at + mu.len)); r = runSuite(); } finally { fs.writeFileSync(p, orig); } }
    // node:test reports an assertion by raising; the frames land in the failure output, so
    // the same authority (a line that IS a known site) resolves both runners.
    const res = cfg.inPlace ? { fired: toolFrames(r.out, siteIndex), unresolved: 0 } : resolveSites(r.out, siteIndex);
    const sites = res.fired.filter(s => !baseFired.has(s));            // net of the standing reds
    const failedFiles = [...new Set([...r.out.matchAll(/^FAIL\s+(\S+)/gm)].map(m => m[1]))].filter(f => !baseFiles.has(f));
    const crash = /Cannot find module|SyntaxError|ReferenceError|TypeError/.test(r.out) && !sites.length;
    const klass = r.timedOut ? "TIMEOUT"
                : (r.code === 0 || (!sites.length && !failedFiles.length && !crash)) ? "SURVIVED"
                : (sites.length ? "TRIGGER-RED" : (crash ? "CRASH-RED" : "UNCLASSIFIED"));
    jsonl(MUTFILE(corpus, opset), { n: i, rel: mu.rel, line: mu.line, op: mu.op, from: mu.from, to: mu.to, klass, sites, failedFiles, unresolved: res.unresolved });
    console.log(`${String(i).padStart(4)}/${chosen.length} ${klass.padEnd(12)} ${mu.rel}:${mu.line} ${mu.op} ${JSON.stringify(mu.from)}->${JSON.stringify(mu.to)}  sites=${sites.length}`);
  }
}

/* node:test raises rather than printing FAIL, so its frames arrive in the failure report.
 * Same authority as the FAIL hook: a frame counts only if it IS a known assertion site. */
function toolFrames(out, siteIndex) {
  const seen = new Set();
  // STRIP ANSI FIRST. node:test colours its stack, so the frame arrives as
  // `…\x1b[39mgroove.test.js:287:10\x1b[90m`, and `m` is a word character: the filename
  // pattern captured `39mgroove.test.js`, matched nothing in the index, and the whole tools
  // arm reported zero attributed sites for forty perturbations. It read as a finding about
  // the corpus. It was a defect in five characters of regex — and it survived because this
  // is the one arm I did not write a positive control for.
  out = out.replace(/\x1b\[[0-9;]*m/g, "");
  for (const f of out.matchAll(/([A-Za-z0-9_.-]+\.test\.js):(\d+):\d+/g)) {
    const key = f[1] + ":" + f[2];
    if (siteIndex.has(key)) seen.add(key);
  }
  return [...seen];
}

function runToolsSuite(dir) {
  let out = "", code = 0;
  for (const n of fs.readdirSync(dir).filter(x => /\.test\.js$/.test(x))) {
    const r = run("node", [n], dir, 120000);
    out += `\n===== ${n} =====\n` + r.out;
    if (r.code !== 0) { code = 1; out += `\nFAIL ${n}\n`; }
  }
  return { code, out };
}

function copyTree(from, to, exclude) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    if (exclude.includes(e.name)) continue;
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copyTree(a, b, exclude);
    else fs.copyFileSync(a, b);
  }
}

/* Rust: mutated in place, because a fresh target dir means a full Tauri build. Every file is
 * backed up bytes-first and restored in a finally; `--restore` and a git status check close
 * the loop if this process is killed. */
function mutateRust(budget, seed, opset) {
  fs.mkdirSync(OUT, { recursive: true });
  const srcDir = path.join(SRCTAURI, "src");
  const files = fs.readdirSync(srcDir).filter(n => n.endsWith(".rs"));
  const all = [];
  for (const n of files) for (const mu of mutants(fs.readFileSync(path.join(srcDir, n), "utf8"), "rs", opset)) all.push({ ...mu, rel: path.join("src", n) });
  const chosen = pick(all, budget, seed);
  console.log(`${all.length} candidate mutations in src/*.rs; running ${chosen.length} (seed ${seed})`);
  restoreInflight();
  const cargoTimeout = parseInt(arg("--suite-timeout", "600000"), 10);
  const base = run(CARGO, ["test", "--no-fail-fast"], SRCTAURI, cargoTimeout);
  if (base.code !== 0) { console.error("BASELINE NOT GREEN — aborted"); process.exit(2); }
  console.log("baseline green");
  let i = 0;
  for (const mu of chosen) {
    i++;
    const p = path.join(SRCTAURI, mu.rel);
    const orig = fs.readFileSync(p);
    withRestore(p, () => {
      const txt = orig.toString("utf8");
      fs.writeFileSync(p, txt.slice(0, mu.at) + mu.to + txt.slice(mu.at + mu.len));
      const r = run(CARGO, ["test", "--no-fail-fast"], SRCTAURI, cargoTimeout);
      // A mutant that never terminates is not a mutant the suite caught — the clock ran out
      // and nothing was discriminated. The held-out operators make this common: zeroing a
      // loop step or deleting an advance produces exactly this.
      const compileFail = /^error(\[E\d+\])?:/m.test(r.out) && !/panicked at/.test(r.out);
      const panics = r.timedOut ? [] : [...new Set([...r.out.matchAll(/panicked at ([^\s:]+):(\d+):/g)].map(m => m[1].replace(/\\/g, "/") + ":" + m[2]))];
      const failedTests = [...new Set([...r.out.matchAll(/^\s{4}(\S+)$/gm)].map(m => m[1]))].filter(x => /::|^[a-z_]+$/.test(x));
      const klass = r.timedOut ? "TIMEOUT"
                  : r.code === 0 ? "SURVIVED" : (compileFail ? "CRASH-RED" : (panics.length ? "TRIGGER-RED" : "UNCLASSIFIED"));
      jsonl(MUTFILE("srctauri", opset), { n: i, rel: mu.rel, line: mu.line, op: mu.op, from: mu.from, to: mu.to, klass, sites: panics, failedTests: failedTests.slice(0, 40) });
      console.log(`${String(i).padStart(4)}/${chosen.length} ${klass.padEnd(12)} ${mu.rel}:${mu.line} ${mu.op} ${JSON.stringify(mu.from)}->${JSON.stringify(mu.to)}  sites=${panics.length}`);
    });
  }
}

/* History: does a guard discriminate the state it was BORN to guard? Check the source out at
 * the commit before the test appeared, drop the test in as it was written, and run it. */
function history(limit) {
  fs.mkdirSync(OUT, { recursive: true });
  const wt = path.join(SCRATCH, "wt-blackbox");
  const gb = (...a) => run("git", ["-C", BLACKBOX, ...a], BLACKBOX);
  if (!fs.existsSync(wt)) gb("worktree", "add", "--detach", wt, "HEAD");
  const tests = fs.readdirSync(BLACKBOX).filter(n => /^test_.*\.js$/.test(n)).sort();
  let i = 0;
  for (const t of tests) {
    i++; if (limit && i > limit) break;
    const birth = gb("log", "--diff-filter=A", "--format=%H", "-1", "--", t).out.trim();
    if (!birth) { jsonl("history.jsonl", { test: t, klass: "NO-BIRTH" }); continue; }
    const parent = gb("rev-parse", birth + "^").out.trim();
    if (!parent || /unknown revision|fatal/.test(parent)) { jsonl("history.jsonl", { test: t, birth, klass: "NO-PARENT", note: "born in the root commit" }); console.log(`${t}: NO-PARENT`); continue; }
    const co = run("git", ["-C", wt, "checkout", "--detach", "-f", parent], wt);
    if (co.code !== 0) { jsonl("history.jsonl", { test: t, birth, klass: "CHECKOUT-FAILED", note: co.out.slice(0, 300) }); continue; }
    run("git", ["-C", wt, "clean", "-fdq"], wt);
    // the test AND the helpers it was written against, taken from the birth commit
    for (const dep of [t, "testenv.js"]) {
      const blob = gb("show", `${birth}:${dep}`);
      if (blob.code === 0) fs.writeFileSync(path.join(wt, dep), blob.out);
    }
    // does the subject even exist at the parent? a guard cannot be shown discriminating
    // against a tree where the thing it guards had not been written yet.
    const src = fs.readFileSync(path.join(wt, t), "utf8");
    // require() targets only. An earlier version also scanned for "ui/…" string literals and
    // caught test_covgap.js's own FIXTURE paths ("ui/fake.js"), which would have marked a
    // genuine result absent. Wrong in the safe direction, but wrong.
    // scanned on the BLANKED source: test_covgap.js writes fixture files whose CONTENT is
    // `require("./ui/fake.js")`, and reading those as this test's own dependencies is the
    // mention-vs-use error inside the instrument that measures it.
    const blanked = blankJs(src);
    const reqs = [...src.matchAll(/require\(["'](\.[^"']+)["']\)/g)]
      .filter(m => blanked.slice(m.index, m.index + 7) === "require")   // the token, not a quoted copy of it
      .map(m => m[1]);
    const missing = reqs.filter(d => !/sitehook/.test(d))
      .filter(d => !fs.existsSync(path.join(wt, d.replace(/^\.\//, ""))) && !fs.existsSync(path.join(wt, d.replace(/^\.\//, "") + ".js")));
    // the inventory of the test AS IT WAS BORN, not as it stands today — line numbers move
    const siteIndex = siteIndexFor([jsSites(path.join(wt, t))]);
    installHook(wt);
    const r = run("node", [t], wt, 300000);
    const res = classify(t, r.code, r.out, { siteIndex, subjectAbsent: missing.length ? "missing at parent: " + missing.join(",") : null });
    /* A red against the parent means two different things, and only one is a demonstration
     * that the guard discriminates a DEFECT.
     *   fix-born     the birth commit edited source that already existed — the guard fired
     *                against a real prior state somebody had shipped.
     *   feature-born the birth commit only added new source — the guard fired against the
     *                absence of a thing not yet written, which shows it is wired to
     *                something real but not that it can tell right from wrong.
     * The proxy is the birth commit's own numstat over ui/ and index.html: any deletions
     * against a file that existed at the parent means existing code moved. */
    const stat = gb("show", "--numstat", "--format=", birth, "--", "ui", "index.html").out;
    let edited = false;
    for (const ln of stat.split("\n")) {
      const m = /^(\d+)\s+(\d+)\s+(\S+)/.exec(ln.trim());
      if (m && +m[2] > 0 && run("git", ["-C", BLACKBOX, "cat-file", "-e", `${parent}:${m[3]}`], BLACKBOX).code === 0) edited = true;
    }
    const born = edited ? "fix-born" : "feature-born";
    jsonl("history.jsonl", { test: t, birth, parent, born, ...res, tail: r.out.trim().split("\n").slice(-6).join(" | ").slice(0, 400) });
    console.log(`${String(i).padStart(3)}/${tests.length} ${res.klass.padEnd(13)} ${born.padEnd(12)} ${t}  ${res.note || ""}`);
  }
}

/* --------------------------------------------------------------- canfail ---
 * THE SHARPER HALF, aimed at the population it was asked about.
 *
 * A random sweep over 23 MB of source answers "how much can move unnoticed" and is far too
 * sparse to answer "can THIS guard fail." So for the guards that came out green-since-birth,
 * this arm attacks each one at its own referent: most of them are lexical — they assert that
 * a rule is PRESENT in the shipped source — so the perturbation is to break exactly the text
 * that guard names, and nothing else, and see whether that guard fires by name.
 *
 * A guard that stays green when the string it searches for is gone is not merely unfired.
 * It is INERT: it cannot report on its referent at all. That is a verdict this arm can
 * deliver and the random sweep cannot.
 */
function canfail(only) {
  const work = path.join(SCRATCH, "work-canfail");
  fs.mkdirSync(OUT, { recursive: true });
  if (fs.existsSync(work)) fs.rmSync(work, { recursive: true, force: true });
  for (const rel of run("git", ["-C", BLACKBOX, "ls-files"], BLACKBOX).out.trim().split("\n")) {
    if (!rel || rel.startsWith("src-tauri/")) continue;
    const a = path.join(BLACKBOX, rel), b = path.join(work, rel);
    if (!fs.existsSync(a)) continue;
    fs.mkdirSync(path.dirname(b), { recursive: true }); fs.copyFileSync(a, b);
  }
  const tests = (only ? only.split(",") : readJsonl("history.jsonl").filter(r => r.klass === "GREEN").map(r => r.test));
  const uiDir = path.join(work, "ui");
  const uiFiles = fs.readdirSync(uiDir).filter(n => /\.js$|^index\.html$/.test(n));

  for (const t of tests) {
    const p = path.join(work, t);
    if (!fs.existsSync(p)) { console.log(`  ${t}: absent`); continue; }
    const raw = fs.readFileSync(p, "utf8");
    const inv = jsSites(p);
    const siteIndex = siteIndexFor([inv]);
    installHook(work);
    const base = run("node", [t], work, 300000);
    if (base.code !== 0) { jsonl("canfail.jsonl", { test: t, klass: "BASELINE-RED" }); console.log(`  ${t}: BASELINE RED — skipped`); continue; }
    if (/SKIP:/.test(base.out)) { jsonl("canfail.jsonl", { test: t, klass: "NOT-RUN", note: "skips on this machine" }); console.log(`  ${t}: SKIPS here`); continue; }

    /* the referents this test names: string literals long enough to be a rule rather than a
     * word, that actually occur in the shipped source it reads */
    // No heuristic about which literals "look like code" is needed: the host lookup below
    // keeps only the ones that literally occur in the shipped source, which is the definition
    // of a referent. Comments are excluded because a rule quoted in a comment is a mention.
    const lits = codeStrings(raw).filter(s => s.text.length >= 12 && s.text.length <= 120);
    const seen = new Set();
    let attacked = 0, fired = 0, inert = [];
    for (const lit of lits) {
      if (seen.has(lit.text)) continue; seen.add(lit.text);
      const host = uiFiles.find(f => fs.readFileSync(path.join(uiDir, f), "utf8").includes(lit.text));
      if (!host) continue;                              // not a referent in the shipped source
      const hp = path.join(uiDir, host);
      const orig = fs.readFileSync(hp, "utf8");
      const broken = orig.replace(lit.text, lit.text.slice(0, -1) + " BROKEN");
      let r;
      try { fs.writeFileSync(hp, broken); r = run("node", [t], work, 300000); }
      finally { fs.writeFileSync(hp, orig); }
      attacked++;
      const res = resolveSites(r.out, siteIndex);
      const ok = r.code !== 0 && res.fired.length > 0;
      if (ok) fired++; else inert.push({ lit: lit.text.slice(0, 60), host, code: r.code });
      jsonl("canfail.jsonl", { test: t, klass: ok ? "CAN-FAIL" : (r.code !== 0 ? "RED-UNATTRIBUTED" : "INERT"),
                               referent: lit.text.slice(0, 80), host, sites: res.fired });
    }
    // a per-test summary, written even when nothing was attackable — a test that produced no
    // rows would otherwise vanish from the report, and a missing row reads as no finding
    jsonl("canfail.jsonl", { test: t, klass: "SUMMARY", attacked, fired, inert: inert.map(x => x.lit) });
    console.log(`  ${t.padEnd(24)} referents attacked ${String(attacked).padStart(2)}  fired ${String(fired).padStart(2)}` +
                (inert.length ? `  INERT: ${inert.map(x => JSON.stringify(x.lit)).join(" ")}` : ""));
  }
}

/* ------------------------------------------------------------ selfcheck ---
 * THE POSITIVE CONTROL, and the sweep's numbers are void without it.
 *
 * A mutation sweep that reports "nothing was caught" is indistinguishable, from the outside,
 * from a harness whose attribution is broken and therefore catches nothing. That is the
 * NOT-RUN-masquerading-as-GREEN shape one level up — in the instrument built to measure it.
 * The census may not report a SURVIVED rate until it has been shown, on this machine and in
 * this working copy, to turn a known-guarded constant into a named TRIGGER-RED.
 *
 * Each case is a constant some test in the corpus pins, with the file that must catch it.
 * A case that does NOT go red is a defect in the harness, not a finding about the suite.
 */
const CONTROLS = [
  { rel: "ui/smokesim.js", from: "const MARK_FADE_SECONDS = 13.5", to: "const MARK_FADE_SECONDS = 14.5", expect: "test_markfade.js" },
  { rel: "ui/collider.js", from: "const CELL_BUDGET = 2000000", to: "const CELL_BUDGET = 2000001", expect: "test_collidergrid.js" },
  { rel: "ui/index.html", from: "Math.round(dtMs / frameBudgetMs()) - 1", to: "Math.round(dtMs / frameBudgetMs()) - 2", expect: "test_vsync.js" },
];
/* The first control set was wrong, and being wrong is what the control is for. It used
 * THR_KC and SHADOW_CASTER_REACH, and both SURVIVED. Neither was a harness fault:
 * test_glowpool asserts the pool is sized FROM the constants rather than pinning their
 * value — deliberately, and correctly — and no test pins SHADOW_CASTER_REACH at all. Two of
 * my three predictions about what this suite guards were false, which is a finding about the
 * corpus, not a bug to quietly swap out. The three above are pins verified by reading the
 * assertion that does the pinning. */

/* The tools corpus needs its own control, and the reason is not symmetry. The blackbox arm had
 * one and the tools arm did not, and the tools arm was broken for forty perturbations without
 * saying so. A control per RUNNER, not per project. */
const TOOL_CONTROLS = [
  { rel: "groove.js", from: "for (let a = 0; a + W <= onsetsSec.length", to: "for (let a = 1; a + W <= onsetsSec.length", expect: "groove.test.js" },
];

function selfcheckTools() {
  const siteIndex = siteIndexFor(fs.readdirSync(TOOLS).filter(n => /\.test\.js$/.test(n)).map(n => jsSites(path.join(TOOLS, n))));
  let bad = 0;
  for (const c of TOOL_CONTROLS) {
    const p = path.join(TOOLS, c.rel);
    const orig = fs.readFileSync(p, "utf8");
    if (!orig.includes(c.from)) { console.log(`  SKIP  ${c.rel}: control has gone stale`); bad++; continue; }
    let r;
    try { fs.writeFileSync(p, orig.replace(c.from, c.to)); r = run("node", [c.expect], TOOLS, 120000); }
    finally { fs.writeFileSync(p, orig); }
    const named = toolFrames(r.out, siteIndex).filter(s => s.startsWith(c.expect));
    const ok = r.code !== 0 && named.length > 0;
    if (!ok) bad++;
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${c.rel} -> caught by ${named.join(",") || "(nothing named)"}`);
  }
  return bad;
}

function selfcheck() {
  const work = path.join(SCRATCH, "work-selfcheck");
  fs.mkdirSync(OUT, { recursive: true });
  if (fs.existsSync(work)) fs.rmSync(work, { recursive: true, force: true });
  for (const rel of run("git", ["-C", BLACKBOX, "ls-files"], BLACKBOX).out.trim().split("\n")) {
    if (!rel || rel.startsWith("src-tauri/")) continue;
    const a = path.join(BLACKBOX, rel), b = path.join(work, rel);
    if (!fs.existsSync(a)) continue;
    fs.mkdirSync(path.dirname(b), { recursive: true }); fs.copyFileSync(a, b);
  }
  const siteIndex = siteIndexFor(fs.readdirSync(work).filter(n => /^test_.*\.js$/.test(n)).map(n => jsSites(path.join(work, n))));
  installHook(work);
  const base = run("node", ["runtests.js"], work);
  console.log("baseline: " + (base.code === 0 ? "GREEN" : "RED — control invalid"));
  let bad = 0;
  for (const c of CONTROLS) {
    const p = path.join(work, c.rel);
    const orig = fs.readFileSync(p, "utf8");
    if (!orig.includes(c.from)) { console.log(`  SKIP  ${c.rel}: "${c.from}" not present — the control has gone stale`); bad++; continue; }
    let r;
    try { fs.writeFileSync(p, orig.replace(c.from, c.to)); r = run("node", ["runtests.js"], work); }
    finally { fs.writeFileSync(p, orig); }
    const res = resolveSites(r.out, siteIndex);
    const named = res.fired.filter(s => s.startsWith(c.expect));
    const ok = r.code !== 0 && named.length > 0;
    if (!ok) bad++;
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${c.rel} ${JSON.stringify(c.from.slice(-12))} -> caught by ${named.join(",") || "(nothing named)"}` +
                `  [all fired: ${res.fired.length}, unresolved: ${res.unresolved}]`);
  }
  console.log("tools corpus (node:test runner — its own control, because it has its own frames):");
  bad += selfcheckTools();
  console.log(bad ? `\n${bad} control(s) failed — the mutation numbers are VOID until this passes.`
                  : `\nAll ${CONTROLS.length} controls fired by name. The harness can report a kill; a SURVIVED is therefore about the suite.`);
  process.exitCode = bad ? 1 : 0;
}

/* One derivation, used everywhere a class is read back. ARM 2c originally re-read the raw
 * ledger and trusted its stored labels while the main tally derived them, so the same rows
 * produced two different valid-denominators in one report — the unit error this census
 * opened by naming, committed inside the census. */
function derive(rows, corpus) {
  for (const r of rows) {
    if (r.klass === "MISAPPLIED" || r.klass === "TIMEOUT" || corpus === "srctauri") continue;
    r.klass = (r.sites || []).length ? "TRIGGER-RED"
            : (r.unresolved > 0) ? "UNCLASSIFIED"
            : (r.klass === "SURVIVED") ? "SURVIVED" : "CRASH-RED";
  }
  return rows;
}

const readJsonl = f => { try { return fs.readFileSync(path.join(OUT, f), "utf8").trim().split("\n").filter(Boolean).map(JSON.parse); } catch (e) { return []; } };

function report() {
  const inv = inventory();
  const L = [];
  const sitesOf = c => inv[c].reduce((a, f) => a + f.sites.length, 0);
  L.push("GUARD CENSUS — how many of this room's guards have been shown to fail against what they guard");
  L.push("=".repeat(100));
  /* Pinned, because the corpus moved under this census while it ran: a sibling committed a
   * new tool and its test into blackbox mid-sweep. A census of a moving corpus that does not
   * say WHICH corpus is a number about nothing. */
  for (const [name, repo] of [["blackbox", BLACKBOX], ["lighthouse", path.join(SRCTAURI, "..", "..")]]) {
    const sha = run("git", ["-C", repo, "rev-parse", "--short", "HEAD"], repo).out.trim();
    const dirty = run("git", ["-C", repo, "status", "--porcelain"], repo).out.trim().split("\n").filter(Boolean).length;
    L.push(`  corpus: ${name} @ ${sha}  (${dirty} uncommitted path(s) at report time, excluded from every denominator)`);
  }
  L.push("\nDENOMINATORS (assertion SITES, not test cases — the two differ by 2x and are never summed)");
  for (const c of ["blackbox", "srctauri", "tools"]) {
    const empt = inv[c].filter(f => !f.sites.length);
    L.push(`  ${c.padEnd(10)} ${String(sitesOf(c)).padStart(5)} sites in ${inv[c].length - empt.length} files` +
           `   (+${empt.length} file(s) carrying no assertion at all)`);
  }
  L.push(`  ${"TOTAL".padEnd(10)} ${String(["blackbox", "srctauri", "tools"].reduce((a, c) => a + sitesOf(c), 0)).padStart(5)} sites`);

  const hist = readJsonl("history.jsonl");
  if (hist.length) {
    const by = k => hist.filter(r => r.klass === k);
    const trig = by("TRIGGER-RED"), green = by("GREEN");
    const answerable = trig.length + green.length;
    L.push("\nARM 1 — HISTORY: does the guard discriminate the state it was BORN to guard?");
    L.push("  (source checked out at the commit BEFORE the test appeared; the test run as it was written)");
    for (const k of ["TRIGGER-RED", "GREEN", "ABSENT-RED", "CRASH-RED", "NO-PARENT", "NOT-RUN", "UNCLASSIFIED"]) {
      const g = by(k); if (!g.length) continue;
      L.push(`    ${k.padEnd(13)} ${String(g.length).padStart(3)}   ${g.map(r => r.test.replace(/^test_|\.js$/g, "")).join(" ")}`);
    }
    const fixBorn = trig.filter(r => r.born === "fix-born");
    L.push(`\n    ANSWERABLE: ${answerable} of ${hist.length} files (the rest could not be run against their parent at all)`);
    L.push(`    demonstrated at birth : ${trig.length}/${answerable}  (${(100 * trig.length / answerable).toFixed(0)}%)`);
    L.push(`      of which fix-born   : ${fixBorn.length}  — fired against code somebody had already shipped`);
    L.push(`      of which feature-born: ${trig.length - fixBorn.length}  — fired against the ABSENCE of a thing not yet written`);
    L.push(`    born green            : ${green.length}/${answerable}  — never shown discriminating anything`);
    const gsites = new Set(trig.flatMap(r => r.sites || []));
    L.push(`    assertion sites this arm has ever seen fire: ${gsites.size} of ${sitesOf("blackbox")} blackbox sites`);
  }

  for (const [corpus, label] of [["blackbox", "blackbox / runtests.js"], ["tools", "consonance tools/"], ["srctauri", "consonance src-tauri (cargo)"]]) {
    const mu = readJsonl(`mutation-${corpus}.jsonl`);
    if (!mu.length) continue;
    /* Class is DERIVED here from the recorded evidence rather than trusted from the sweep's
     * own label, because the sweep's first rule spotted a crash by matching error NAMES and
     * a RangeError fell through to UNCLASSIFIED. The evidence needs no name list: an
     * assertion event either happened or it did not. Raw jsonl keeps what was measured. */
    derive(mu, corpus);
    const killed = mu.filter(r => r.klass === "TRIGGER-RED");
    const crashed = mu.filter(r => r.klass === "CRASH-RED");
    const survived = mu.filter(r => r.klass === "SURVIVED");
    const unc = mu.filter(r => r.klass === "UNCLASSIFIED");
    // cochlea.rs compiles into three targets, so one panic reports as src/cochlea.rs:N AND
    // src/bin/../cochlea.rs:N. Counting both would inflate "distinct guards shown firing" by
    // a factor of the build graph rather than of the corpus.
    const fired = new Set(mu.flatMap(r => r.sites || []).map(s => s.replace(/src\/bin\/\.\.\//, "src/")));
    const misapplied = mu.filter(r => r.klass === "MISAPPLIED");
    const timedOut = mu.filter(r => r.klass === "TIMEOUT");
    const valid = mu.length - crashed.length - misapplied.length - timedOut.length;
    L.push(`\nARM 2 — MUTATION: ${label}  (${mu.length} perturbations of the source the guards read)`);
    L.push(`    broke the build/load instead (CRASH)  : ${crashed.length}   <- NOT a demonstration; excluded from the rate`);
    L.push(`    offset no longer held (MISAPPLIED)    : ${misapplied.length}   <- never written to disk`);
    L.push(`    never terminated (TIMEOUT)            : ${timedOut.length}   <- the clock ran out; nothing discriminated`);
    L.push(`    SEMANTICALLY VALID perturbations      : ${valid}   <- the denominator that means anything`);
    L.push(`      caught by a named guard             : ${killed.length}  (${valid ? (100 * killed.length / valid).toFixed(0) : 0}%)`);
    L.push(`      red with nothing resolvable (UNCL.) : ${unc.length}   <- counted against the census, not dropped`);
    L.push(`      SURVIVED — nothing went red at all  : ${survived.length}  (${valid ? (100 * survived.length / valid).toFixed(0) : 0}% of real perturbations unnoticed)`);
    L.push(`    distinct guards shown firing          : ${fired.size} of ${sitesOf(corpus)} sites in this corpus`);
  }

  /* ARM 2c — is the floor real, or an artifact of three operators?
   * The narrow set (±1, boundary flip, conjunction flip) and the wide set (collapse-to-zero,
   * sign inversion, return inversion, statement deletion) are disjoint, run at the same
   * budget over the same corpus. If the demonstrated count jumps, the floor was operator-
   * limited and every rate quoted from the narrow set needs that caveat. If it barely moves,
   * the floor is close to real. */
  const wideRows = {};
  for (const c of ["blackbox", "srctauri", "tools"]) wideRows[c] = readJsonl(`mutation-${c}-wide.jsonl`);
  if (Object.values(wideRows).some(r => r.length)) {
    const norm = s => path.basename(s.replace(/src\/bin\/\.\.\//, "src/"));
    L.push(`\nARM 2c — NARROW vs HELD-OUT OPERATORS: is 6.9% a property of the guards or of the operators?`);
    L.push(`    corpus      set      valid  caught          sites   NEW sites the other set never reached`);
    for (const c of ["blackbox", "srctauri", "tools"]) {
      if (!wideRows[c].length) continue;
      const rows = { narrow: derive(readJsonl(MUTFILE(c, "narrow")), c), wide: derive(wideRows[c], c) };
      const sites = {};
      for (const set of ["narrow", "wide"]) {
        const rs = rows[set];
        const excluded = rs.filter(r => ["CRASH-RED", "MISAPPLIED", "TIMEOUT"].includes(r.klass)).length;
        const valid = rs.length - excluded;
        const caught = rs.filter(r => (r.sites || []).length).length;
        sites[set] = new Set(rs.flatMap(r => (r.sites || []).map(norm)));
        L.push(`    ${c.padEnd(11)} ${set.padEnd(8)} ${String(valid).padStart(4)}  ${String(caught).padStart(3)} (${valid ? (100 * caught / valid).toFixed(0) : 0}%)`.padEnd(46) +
               `${String(sites[set].size).padStart(4)}`);
      }
      const onlyWide = [...sites.wide].filter(s => !sites.narrow.has(s));
      const onlyNarrow = [...sites.narrow].filter(s => !sites.wide.has(s));
      L.push(`    ${" ".repeat(11)} union    ${String(new Set([...sites.narrow, ...sites.wide]).size).padStart(4)} distinct sites` +
             `   (+${onlyWide.length} reachable ONLY by the held-out set, +${onlyNarrow.length} only by the narrow set)`);
    }
    L.push(`    Read the NEW-sites column, not the percentages: a rate can move because the operators`);
    L.push(`    crash more often, which shrinks the denominator. The site union cannot move that way.`);
    L.push(`    Bias that remains and is not correctable here: collapse-to-zero, sign inversion and`);
    L.push(`    statement deletion all produce EQUIVALENT MUTANTS on unreached or dead code — no`);
    L.push(`    behaviour change, so they read as SURVIVED and push the caught rate DOWN. The wide`);
    L.push(`    rate is therefore a floor on its own terms, not a like-for-like of the narrow rate.`);
  }

  const cf = readJsonl("canfail.jsonl");
  if (cf.length) {
    L.push(`\nARM 2b — CAN IT FAIL AT ALL? each guard attacked at its OWN referent (the born-green set, plus a control)`);
    for (const r of cf.filter(x => x.klass === "SUMMARY")) {
      L.push(`    ${r.test.padEnd(24)} referents ${String(r.attacked).padStart(2)}  fired ${String(r.fired).padStart(2)}` +
             (r.attacked ? (r.inert.length ? `   inert: ${r.inert.map(s => JSON.stringify(s)).join(" ")}` : "")
                         : "   <- no lexical referent: THIS ARM CANNOT REACH IT"));
    }
    L.push(`    Files with zero attackable referents are UNANSWERED, not inert. The arm reaches lexical`);
    L.push(`    guards only; a guard that computes over real data has no string to break.`);
  }

  /* ARM 3 — the prose record. Every commit in both repos whose BODY claims a guard went red,
   * read and classified by hand. Listed here rather than regex-counted because the whole
   * point is telling a real red from a red-for-the-wrong-reason, and no pattern does that. */
  const PROSE = [
    ["lighthouse", "214d987", "GENUINE", "two swell-head tests went red when the head clause moved — an asserted count, not a printed one"],
    ["lighthouse", "1d4111c", "GENUINE", "tell-index's existing tests went red on the canonical-actors fix"],
    ["lighthouse", "14da621", "GENUINE", "the dynamics window test refuted its author's first guess"],
    ["lighthouse", "bba7cda", "GENUINE", "TRIGGER 3 shown going red on the record at birth"],
    ["lighthouse", "d494e5c", "GENUINE", "TRIGGER 2 shown going red on the record at birth"],
    ["blackbox", "d52f15b", "GENUINE", "test_carscene caught an 852,176-triangle drift on arrival from the laptop"],
    ["blackbox", "d9bde4d", "GENUINE", "eight deliberate mutations each turned the suite red — the trigger form, practiced"],
    ["lighthouse", "a04fb34", "WRONG-REASON", "the live-ledger test went red on an under-powered sample; nothing was broken"],
    ["blackbox", "0eca92c", "WRONG-REASON", "\"my own test failed three times first, all three my errors rather than the code's\""],
  ];
  const gen = PROSE.filter(r => r[2] === "GENUINE");
  L.push(`\nARM 3 — THE PROSE RECORD: commits whose body states a guard fired (429 commits across both repos)`);
  for (const [repo, h, k, why] of PROSE) L.push(`    ${k.padEnd(13)} ${repo.padEnd(11)} ${h}  ${why}`);
  L.push(`    ${gen.length} genuine, ${PROSE.length - gen.length} red-for-the-wrong-reason — and the second class is named by the room itself, in its own commit messages.`);

  /* THE ANSWER, one number with its denominator. A site counts as DEMONSTRATED when it has
   * been observed firing for the right reason — historically against the state it was born
   * to guard, or under a perturbation of the source it reads. Everything else is UNFIRED,
   * which is not a claim that it cannot fire. */
  const demonstrated = new Set();
  for (const r of hist) if (r.klass === "TRIGGER-RED") for (const s of r.sites || []) demonstrated.add(path.basename(s));
  // EVERY ledger, narrow and held-out. The wide files were missing here on the first render
  // and the headline sat unchanged at 130 while ARM 2c showed 37 new sites two screens above
  // — a total that silently excluded the arm run to move it.
  const LEDGERS = ["blackbox", "tools", "srctauri"].flatMap(c => [MUTFILE(c, "narrow"), MUTFILE(c, "wide")]).concat("canfail.jsonl");
  for (const f of LEDGERS)
    for (const r of readJsonl(f))
      for (const s of r.sites || []) demonstrated.add(path.basename(s.replace(/src\/bin\/\.\.\//, "src/")));
  const grand = ["blackbox", "srctauri", "tools"].reduce((a, c) => a + sitesOf(c), 0);
  L.push(`\nTHE ANSWER`);
  L.push(`  assertion sites observed firing for the right reason : ${demonstrated.size}`);
  L.push(`  assertion sites in both repos                        : ${grand}`);
  L.push(`  fraction ever demonstrated discriminating            : ${(100 * demonstrated.size / grand).toFixed(1)}%`);
  // NOT "green since birth" — that label would claim these were tried and stayed green. The
  // overwhelming majority were never attacked at all. Say what the number is, not what it
  // would be convenient for it to be.
  L.push(`  the rest: ${grand - demonstrated.size} sites NOT OBSERVED FIRING — the overwhelming majority never attacked`);
  L.push(`  by any arm here, not shown inert. This is a floor on what has been demonstrated, not`);
  L.push(`  a ceiling on what could be.`);

  L.push("\nWHAT THIS NUMBER DOES NOT MEAN");
  L.push("  - IT IS NOT A SAFETY METRIC. It measures whether a guard has been shown to fire, never");
  L.push("    whether what it guards matters. A demonstrated guard on something trivial and one on");
  L.push("    the thing that would ruin the app score identically here. No sentence of the form");
  L.push("    \"we are covered\" follows from any number on this page.");
  L.push("  - THE RATE IS OPERATOR-RELATIVE. Change the operator set and the rate changes; see the");
  L.push("    narrow-vs-wide comparison above if present. A fixed seed and a published operator list");
  L.push("    can be optimised against, so five operators are held in reserve (`--ops wide`).");
  L.push("  - unfired is a LOWER BOUND, never a verdict of vacuity: a guard no perturbation here reached");
  L.push("    may still be reachable by one this sweep did not generate.");
  L.push("  - the history arm sees the BIRTH state only. A guard that went red in somebody's working tree");
  L.push("    and was fixed before the commit leaves no trace in git, and this tool cannot see it.");
  L.push("  - CRASH-RED and ABSENT-RED are excluded by construction. If the census cannot tell a real");
  L.push("    demonstration from a compile break it says UNCLASSIFIED rather than reporting the cleaner number.");
  console.log(L.join("\n"));
  fs.writeFileSync(path.join(OUT, "REPORT.txt"), L.join("\n") + "\n");
}

if (require.main === module) {
  const cmd = process.argv[2] || "inventory";
  if (cmd === "history") { history(parseInt(arg("--limit", "0"), 10)); }
  else if (cmd === "mutation") {
    const c = arg("--corpus", "blackbox"), b = parseInt(arg("--budget", "60"), 10), s = parseInt(arg("--seed", "20260801"), 10);
    const ops = arg("--ops", "narrow");
    if (c === "srctauri") mutateRust(b, s, ops); else mutateJs(c, b, s, ops);
  }
  else if (cmd === "cleanup") {
    /* The history arm registers a git WORKTREE in the other repo. That is a write into
     * somebody else's .git that outlives this process and shows up in their `git worktree
     * list` — a side effect of measuring, left behind by the measurement. Undo it. */
    const wt = path.join(SCRATCH, "wt-blackbox");
    console.log(run("git", ["-C", BLACKBOX, "worktree", "remove", "--force", wt], BLACKBOX).out || "worktree removed");
    run("git", ["-C", BLACKBOX, "worktree", "prune"], BLACKBOX);
    for (const d of ["work-blackbox", "work-selfcheck", "work-canfail", "work-tools", "wt-blackbox"]) {
      const p = path.join(SCRATCH, d);
      if (fs.existsSync(p)) { fs.rmSync(p, { recursive: true, force: true }); console.log("removed " + p); }
    }
    console.log(run("git", ["-C", BLACKBOX, "worktree", "list"], BLACKBOX).out.trim());
  }
  else if (cmd === "canfail") { canfail(arg("--tests", null)); }
  else if (cmd === "selfcheck") { selfcheck(); }
  else if (cmd === "report") { report(); }
  else if (cmd === "inventory") {
    const inv = inventory();
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(path.join(OUT, "inventory.json"), JSON.stringify(inv, null, 1));
    console.log(fmtInventory(inv));
    const grand = Object.values(inv).reduce((a, fs_) => a + fs_.reduce((b, f) => b + f.sites.length, 0), 0);
    console.log(`\nTOTAL SITES: ${grand}`);
  } else { console.error("unknown command " + cmd); process.exit(1); }
}

module.exports = { withRestore, restoreInflight, MUTFILE, toolFrames, blankJs, blankRust, jsSites, rustSites, inventory, resolveSites, onlyScript, mutants, classify, codeStrings };
