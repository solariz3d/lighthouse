# P-BRACE-COUNTER · ALPHA — the cfg(test) brace counter reads Rust: strings, raw strings, char literals and comments are skipped

**Pane A, machine D, 2026-09-19 11:4x–12:3x.** Lap D083. Source: B's `handback/p-six-reds-B_2026-09-19.md` §2.6(b), read
at source. **Two files: `consonance/tools/portable-paths.js` (+51 −4) and `consonance/tools/portable-paths.test.js`
(+86)** (`git diff --stat`). Not committed. No `--update`. `main.rs` is not edited, and the baseline is untouched:

    sha256sum consonance/src-tauri/src/main.rs consonance/tools/portable-paths.baseline.json
      before and after: ba53e5df… · 703df452…

---

## 1 · WHAT CHANGED

`rustTestLines` used to count every `{` and `}` character from a `#[cfg(test)]` attribute's opening brace.
`main.rs:5784` — `after[..after.find("\n}\n").expect("no end of function")].to_string()` — closed
`mod where_a_seat_lives_tests` at `:5785`, as B found.

A new `rustBraceScan(line, st, onBrace)` counts braces only in code. It carries its state across lines, and skips:
- **strings**, including those spanning lines and `\` escapes;
- **raw strings** `r"…"`, `r#"…"#`, `br##"…"##`, where the close needs the same number of hashes. The bar said "if
  cheap"; it was about ten lines;
- **char literals** `'}'`, `'\''`, `'\u{7d}'`, `'\x7d'`;
- **comments**, `//` and nested `/* */`.

**Comments were not in the bar and are there on purpose.** Skipping strings without skipping comments is unsound: the
apostrophe in `// don't` would open a char literal or string that swallows the module's real close. A `'` that is not
a char literal is a lifetime or a label and opens nothing.

## 2 · BARS — the command beside every number

    BEFORE (HEAD 5c97769):
      node consonance/tools/portable-paths.js                 RED — 35 machine-specific path(s) not in the baseline · exit 1
      node --test consonance/tools/portable-paths.test.js     tests 35 · pass 32 · fail 3
        the three: main.rs has no drive literal in LIVE code (:113-119, B's (b)); the green line says…; the real repo is green…

    RED FIRST (the new tests, the counter still HEAD's):
      node --test consonance/tools/portable-paths.test.js     tests 40 · pass 32 · fail 8   (all 5 new + the 3 above)
        On my first red run one new test PASSED VACUOUSLY: the char-literal line's braces balanced ('}' against "{").
        I removed the "{" so the line nets one `}` if characters are counted; then it was red.
      After §4's three fixture lines were added, the final test file against HEAD's counter (a copy of HEAD's
      portable-paths.js beside the test, in scratch): all 5 new tests red. One unrelated failure, "the shipped-prose
      universe is READ from the manifest", comes from running outside the repo.

    GREEN:
      node --test consonance/tools/portable-paths.test.js     tests 40 · pass 38 · fail 2
        :113-119 "main.rs has no drive literal in LIVE code" is GREEN.
        The 2 red are the baseline ratchet's: "the green line says how many baselined sites are FATAL" and "the real repo
        is green against its committed baseline". They are untouched, and red as required.
      node consonance/tools/portable-paths.js                 RED — 35 … · exit 1   (still 35, no --update)
        diff against the before-run: the same 35 sites. Two change CLASS, as the fix should make them:
          main.rs:6056  REVIEW          -> BENIGN-TEST   (B's "one of the 2 REVIEW is not what it seems")
          main.rs:6237  BENIGN-FIXTURE  -> BENIGN-TEST
        Three state-sync.test.js sites moved line number (904->922, 905->923, 1131->1149). That is C's concurrent edit
        of that file (git status shows it modified; it is not mine). The ratchet keys ignore line numbers.

    AN INDEPENDENT CHECK OF EVERY REGION (<scratchpad>/pp_oracle.js: in a rustfmt-formatted file, a column-0 #[cfg(test)]
    item ends at the first later line that is exactly "}"), over all 24 .rs files under consonance/src-tauri/src:
      main.rs   HEAD 8432 lines · oracle 7689 · tool-not-oracle 2133 · oracle-not-tool 1390
                NEW  7697 lines · oracle 7689 · tool-not-oracle 8    · oracle-not-tool 0
                the 8 = main.rs:389-396, the one INDENTED `#[cfg(test)] { … }` block (:388), which the oracle does not
                judge; read by hand, the new count is right
      mcp.rs         HEAD 468 · NEW 1215 · oracle 1215   (HEAD missed 747 test lines)
      sync_launch.rs HEAD 1804 · NEW 1785 · oracle 1785  (HEAD scored 19 live lines as test)
      cochlea.rs     HEAD 2023 · NEW 2020 · oracle 2020
      the other 20 files: HEAD = NEW = oracle
      `for f in $(git ls-files 'consonance/src-tauri/src/*.rs'); do node pp_oracle.js pp_head.js $f; done`

    MUTANTS — consonance/tools/mutant-harness.js, as the bar said, on a COPY:
      node consonance/tools/mutant-harness.js <scratchpad>/pp_rows.js        (worktree of HEAD, removed afterwards)
      scorer <scratchpad>/pp_score.js: copies the LIVE working test file into the worktree (see §5), runs node --test
      with the two baseline ratchet tests skipped by name, and prints cargo's summary shape
      pre-flight (unmutated copy): green 38/0
      FIRST RUN:  11 listed · 8 killed · 3 survived · 0 no result · 0 not applied
      FINAL RUN:  11 listed · 11 killed · 0 survived · 0 no result · 0 not applied · live portable-paths.js unchanged: true
        #1 strings not skipped                  THE LINE, spanning string, main.rs LIVE
        #2 escapes in a string not honoured     spanning-string test (the new `"say \"}\" twice"` line)
        #3 raw strings not recognised           raw-strings test
        #4 raw string ends at any quote         raw-strings test
        #5 char literals not skipped            char test
        #6 the \u{..} char escape not known     char test (the new `['\u{7d}','}']` line)
        #7 line comments counted                comment test
        #8 block comments counted               comment test (the new `/* a lone } */` line)
        #9 nested block comments close early    comment test
        #10 lexer state not carried over lines  spanning string, main.rs LIVE
        #11 the old character count restored    all 5 new tests + main.rs LIVE

## 3 · CORRECTIONS, INCLUDING TO MYSELF

- **The test-region count went DOWN, 8432 → 7697,** and I expected it to go up. I did not take the fix on trust. The
  oracle (§2) shows the HEAD counter was wrong in both directions: it ran `offset_tests` (`:1845`) to `:4578` and
  covered about 2500 live lines as test code, while cutting others short. So the old counter also HID live code from
  the guard. The `main.rs` LIVE test was green with the new count, so no drive literal was hiding there.
- **My first probe line in THE LINE's fixture** was a real `"C:\\Consonance\\instances\\…"` literal. It added a 36th site
  to the ratchet (tool RED — 36). It is now `let probe = 1;`, since a fixture must not add a site.
- **The first mutant run left 3 survivors (#2, #6, #8), each a real fixture gap,** not an equivalent mutant: no
  escaped quote, a lone `\u{..}` whose braces balance, a block comment whose braces balance. One line was added to each
  test, the line numbers in those tests were renumbered, and the final run is 11/11.
- **The harness's anchor gate refused one of my rows** before anything was mutated. A backslash was lost when I
  rewrote the rows file with awk. I rewrote the file cleanly.
- **Three scratch escaping errors** (`\u{..}` inside a JS string) cost three re-runs of the rows file. None reached a
  tracked file.

## 4 · OPEN QUESTIONS — the conservative default was taken; the keeper is asleep and none was asked

1. **Comments are now skipped too (§1).** The bar named strings, chars and raw strings. **Default:** keep it, because
   the string skip is unsound without it (tested). The chair may call that scope.
2. **B's (a), the 35-site baseline, is untouched and red,** as the bar requires. Two of its sites are now BENIGN-TEST
   rather than REVIEW / BENIGN-FIXTURE, so an `--update` lap will see 1 REVIEW left (`state-sync.js:141`), not 2.

## 5 · WHAT I DID NOT VERIFY, AND THE HARNESS'S LIMITS THIS LAP SHOWED

- **Only rustfmt-shaped regions were checked by the oracle.** Cases the oracle cannot see:
  - a `#[cfg(test)]` on a `fn` or an item whose `{` sits on the attribute's own line;
  - the one indented block, checked by hand;
  - byte chars `b'}'` (the `'…'` rule covers them; not fixtured);
  - raw identifiers `r#type` (the `r#` prefix is followed by `t`, not `"`, so it is not read as a raw string;
    not fixtured).
- **A lifetime immediately followed by `'`** (`'a'` as a char literal vs `'a` as a lifetime) is decided by the char
  regex. It was not fixtured beyond `fn f<'a>(s: &'a str)`.
- **mutant-harness.js copies ONE file into its worktree and parses only cargo's output.** For a JS target with an
  uncommitted test file, the scorer had to copy the live test in and translate node's TAP into cargo's shape
  (`<scratchpad>/pp_score.js`). Both are limits of my D081 tool. Both were named at D081 (§5); this is the first lap
  they bit. The harness itself was used unchanged.
- **The JS suite was not re-run.** The one file changed was run directly. `state-sync.test.js` is C's and was being
  edited.
- **Nothing on L.**

NEXT: librarian re-derive the green bar and the 35-site diff, and route the two harness limits (§5) when the file is read
