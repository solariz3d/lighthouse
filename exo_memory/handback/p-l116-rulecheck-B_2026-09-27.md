# P-L116-RULECHECK · BRAVO — the §9 pre-run rule check: NOT CLEAN. My code is fixed to the registration on three points (tests added, 25/0). A's written unit rule disagrees with §4 on 13 boundaries of a 22-unit dummy. Four registration lines are ambiguous in ways that move units or hits, and they are the librarian's to rule, not mine

**B (pane `12fb81f6`), machine L, 2026-09-27 ~01:0x–01:3x local.** Packet: the chair's L116.
- **Seal checked:** `git log -1` = `c8c18d4…` and `sha256sum exo_memory/loop/claim_recognition_registration_2026-09-27.md` → `0cea938b8130781abc2685c80a7e545165123e7ac4fe7f5475743ab792fe8415` ✓.
- **Nothing under `C:\Consonance\retrieval\l115\` was opened**, key included. The registration was not edited. Code only. **Nothing committed.**

**CLEAN or NOT CLEAN: NOT CLEAN** — for §3 (A's rule, if the key uses it) and §4 (four ambiguous lines), below. My own code is now CLEAN against every line the registration states unambiguously.

## 0 · THE FIXED DUMMY (never an item)

`scratchpad/l116/dummy.md`, sha256 `58311935acf729edf4371d7e7b9a3e3b4de59557eba6f2cccc173ab3109affbc`. It is built to exercise every §4 rule and A's reply format (the `[text]` / `[written through Bash]` part lines, an unfenced shell body):

````
[text]
The report is ready. It covers the three failing tests (see below). The fix went in at 09:14, e.g. Before lunch.
He said "the build is green." Then he left.
Dr. J. Smith approved it. The value is **1400.** Next step is review.

[written through Bash]
#!/bin/bash
# fix the path
cp a.txt b.txt. Done now.

## Results
| test | status |
|---|---|
| a.js | PASS. Really. |

1) First item. Second sentence.
2. Third item
   continues here. And more?
- `cfg.v2. Next` stays whole. Final.
---
```
x = 1. Y = 2.

z = 3
```
````

## 1 · §4 BY HAND, then MY splitter and A's written rule against it

**§4 by hand** (`:118-125`, read literally; "?" marks a boundary that hangs on an ambiguous line, §4 below). The `B` column is `node exo_memory/loop/claimrec/units.js dummy.md`; the `A` column is A's rule from its written text (§2).

| §4 by hand | B (mine) | A's written rule | where A differs from §4 |
|---|---|---|---|
| `[text] The report is ready.` | same | `The report is ready.` | drops the part line (§4: it has letters, no blank line after it, so it joins; rule 6/7) |
| `It covers the three failing tests (see below).` | same | same | |
| `The fix went in at 09:14, e.g. Before lunch.` | same | `…, e.g.` · `Before lunch.` | **splits after `e.g.`** (§4 rule 5 forbids it) |
| `He said "the build is green." Then he left.` | same | `…green."` · `Then he left.` | **splits after `."`** (§4 needs whitespace right after the `.`) |
| `Dr.` | same | same | (both split "Dr." off: literal §4) |
| `J. Smith approved it.` | same | `J.` · `Smith approved it.` | **splits after an initial** (§4 forbids it) |
| `The value is **1400.** Next step is review.` | same | `…**1400.**` · `Next step is review.` | **splits after `.**`** (§4 needs whitespace right after the `.`) |
| `[written through Bash] #!/bin/bash` **?** | same | `#!/bin/bash` | the part line dropped; `#!` as its own unit: **AMBIGUOUS, §4.1** |
| `# fix the path` | same | same | |
| `cp a.txt b.txt.` · `Done now.` | same | same | |
| `## Results` | same | same | |
| `\| test \| status \|` | same | same | |
| `\| a.js \| PASS. Really. \|` | same | `\| a.js \| PASS.` · `Really.` · `\|` | **splits inside a table row** (§4 rule 2: one unit) |
| `1) First item.` · `Second sentence.` | same | same | (same here only because a blank line precedes it; see F1) |
| `2.` **?** · `Third item continues here.` · `And more?` | same | `2.` · `Third item` · `continues here.` · `And more?` | **splits a list item at its line break** (§4 joins until a blank line or a new unit); the `2.` unit: **AMBIGUOUS, §4.2** |
| `` - `cfg.v2. Next` stays whole. `` · `Final. ---` | same | `` - `cfg.v2. `` · `` Next` stays whole. `` · `Final.` | **splits inside backticks** (§4 forbids it); drops `---` (§4 joins it to "Final." as a continuation, rule 7 only drops units with no letter) |
| the fenced block, one unit | same | `x = 1.` · `Y = 2.` · `z = 3` | **splits a fenced block per line and sentence** (§4 rule 1: one unit) |

**Counts:** §4 by hand **22** · mine **22, every boundary equal** to the hand result, taking my reading at the two "?" rows · A's rule **32**, with **13 boundaries different from §4** (the rows marked, counting each split or join).

**What A's difference does:**
- **Registration `:82` defines the key as "the unit number(s) (§4)".** A's hand-back says A's split is in `key\sentences\<id>.json` and its counts (sum 1,898) are under A's rule. If A's key numbers A's sentences, it is in the wrong units, and joining it to my §4 packets would score the wrong units.
- **I cannot see the key** (not to be opened), so I can't tell whether it holds A's sentence numbers or the claim's quote.
- **§9 is explicit:** "Any disagreement is resolved to §4 first." The key has to be expressed in §4 units (e.g. by A running `units.js` on each reply and locating the key quote) before the librarian scores. **That is A's to do; nothing I may touch.**

## 2 · A's WRITTEN RULE, as applied

`scratchpad/l116/a_rule.js` implements A's §4 text **as written**, verbatim in its header. A's own script is in A's session scratchpad and was not used; this checks the rule A wrote down. It is per line; it splits after `.`/`!`/`?` plus any closing quotes, brackets, `*` or backticks, when whitespace follows and the next character is not lowercase; it drops fence lines, horizontal rules, table separators and the `[…]` part lines. **Not verified:** that A's code does exactly what its text says. A's 6/6 fixtures are A's.

## 3 · FIXES TO MY CODE (code only; each with its test)

| # | the difference from the registration | fix | test added |
|---|---|---|---|
| **F1** | `units.js` treated `n)` as a list marker. §4 rule 4 (`:122`) names `-`, `*`, `+`, `n.` only | `isListStart` = `^\s*([-*+]\|\d+\.)\s+` | `units.test.js`: "an n) line is not a list marker and joins the text before it"; "an n. line is a list marker and starts a new unit" |
| **F2** | `parseStatements` fell back to matching an UNQUOTED item's whole text mechanically. §3 step 1 (`:100`) maps "a quoted item"; the rest is the coder's (step 2) | no fallback: an unquoted item has no quotes and goes to the coder | `claimrec.test.js`: "an unquoted list item carries no quotes, so step 1 leaves it for the coder" |
| **F3** | the coder prompt carried my intro sentence and my answer-format line. §3 (`:104-107`): the coder "receives **only**" the numbered units, the reader's list and the quoted instruction | the prompt is now exactly: the `U<n>:` lines, a blank line, the `S<k>:` lines, a blank line, the instruction verbatim | `claimrec.test.js`: "the coder prompt holds only unit lines, statement lines and the instruction" |
| **F3b** (made necessary by F3) | with no format line, the coder answers free-form. The first live run answered as a **markdown table** (skipped by the parser), and a **prose line** ("S5, S6 and S7 each pick out one part of U3 … U2 and U4") was misread as S5 → U3, U2, U4 | `parseCoder` reads table rows, reads a line only if `S<k>` is followed directly by a separator, and stops at the next `S<k>` | `claimrec.test.js`: "a markdown-table coder answer is read row by row"; "a prose line naming several statements is not read as the first one's answer"; "a free-form coder answer is still read per statement" |

- **Tests:** `node --test exo_memory/loop/claimrec/units.test.js exo_memory/loop/claimrec/claimrec.test.js` → **25 pass, 0 fail**: `units.test.js` 12 (10 + 2) and `claimrec.test.js` 13 (8 + 5).
- **The live proof of F3/F3b:** `packets` then `coders` on L115's dummy reader output, 2 coder calls, both exit 0, `claude --version` 2.1.283 before and after, 0 transcripts. First answer (table): after F3b it parses all 10 statements correctly. Second answer (`- **S1:** U1` bullets): **unmapped 0**, `score` → **HIT**, COST 0.80. It is the same result as L115 by a registration-exact prompt.
- **Hashes now:** `claimrec.js` `0ef71060…40e9` · `units.js` `fd037245…9f72` · `claimrec.test.js` `f66a9fe1…9a9f` · `units.test.js` `ab3ab8e3…abc`. These **replace L115's `c8c18d4` versions**. §3 says the mapping script and coder prompt are "hashed before the readers run", so A must hash THESE.

## 4 · AMBIGUOUS IN THE REGISTRATION — named, not resolved (the librarian rules)

1. **`:121` "every heading line (`#…`) is one unit".** Is it any line beginning `#`, or a markdown heading (`#` then a space)?
   - It decides `#!/bin/bash`, `#comment` and similar in the **14 replies carrying Bash heredoc bodies** (A's hand-back §2), where shell lines sit unfenced.
   - Mine uses the markdown reading (`#{1,6}` then whitespace); A's per-line rule makes every line a unit anyway.
   - **What changes:** units and COST on those replies.
2. **`:122`–`:123` list items "start a new unit" and "each list item is split into sentences".** Is the `n.` marker part of the item's text for rule 5?
   - Read literally (and so in mine and A's), `2. Third item` splits into a unit `2.` whenever the item starts with a capital, and rule 7 keeps it because it has a digit.
   - **What changes:** one extra junk unit per capitalised numbered item, which inflates the denominator of COST.
3. **`:99`/`:106` "the reader's list".** Is it the reader's answer as written, or the list items parsed out of it?
   - The harness parses list and `>` lines into numbered statements, so the coder can answer per statement and step 1 can be joined per statement.
   - That drops the reader's framing ("These are predictions … can't be checked") and counts sub-bullets as statements.
   - **What changes:** which statements exist, and the per-statement join of step 1 with step 2.
4. **`:97` "the reader's list flags at least one key unit".** Does an item the reader lists but explicitly says NOT to check count as flagged?
   - The ask asks for statements "that should be checked". §3 and §4 never define exclusion, so they do not settle it. This is the packet's point 2, and **§3/§4 do not define it**, so I cannot count it "as §3/§4 define it". The harness today counts it as flagged.
   - **What changes:** COST, and possibly a HIT that comes from an item the reader called uncheckable.
   - The coder cannot be asked to mark it without breaking `:104`'s "only". A ruling for exclusion needs a mark by someone other than the coder, or a declared literal reading.

## 5 · WRONG column (mine)

- **W1:** the first append of the three new tests went through a bash `node -e` string, which ate the `\n` and `\d` escapes (the recurring shell-string class). It showed up as a file-level syntax failure. Re-done with the Edit tool.
- **W2:** my first "n. line" test expected `['Intro line', '1.', 'item one']`, but §4 splits only before an uppercase letter, digit, quote, backtick, `*` or `(`, and "item" is lowercase. The test was wrong and the code right; the expectation was corrected to `['Intro line', '1. item one']`. That is a new test of mine, not a weakened existing one.
- **W3:** in L115 I built the coder prompt with a format line and called it "my addition, A/E can refuse it". §3's "only" already refused it. It should have been caught at L115.
- The edit tool wrote my `\u201C…` regex escapes as literal curly-quote characters. The behaviour is identical, and there are 0 BOMs in all four files (`grep -c $'\xef\xbb\xbf'`).

## 6 · NOT VERIFIED

- **Whether A's key is in A's sentence numbers or carries the quote.** I can't see it. That decides whether §1 is a live scoring defect or a naming one.
- **§4 on the real replies:** only the dummy was split by hand. Tables inside list items, inline HTML and nested fences were not exercised.
- **The coder's free-form answers beyond two runs.** F3b handles the two formats seen plus bullets. A new format falls to "unmapped", which the map reports per item (`unmappedStatements`), so the librarian sees it and it never silently scores.
- **The registered nonce probe** (A's, §8).

NEXT: librarian call_librarian with the pointer when the hand-back is written — plan default after it: A runs the 22 readers and the coder if you read CLEAN, unless your check says otherwise
