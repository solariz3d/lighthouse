# D064 STEP 0 · ALPHA — redact.js, its test, and the arm-word list

**Pane A, machine D, 2026-09-15.** Built against `loop/anchor_similarity_registration_DRAFT_2026-09-15.md`:
- §8.9 STEP 0 "redact" (87b799a)
- §8.10 K6 (5ff17be)
- K6 CORRECTED (5a62cd9)

**Built; K6 can be built as written. One conflict inside the registration is named in §2.1**: STEP 0's own leak
regex against K6's figure rule. I built K6.

**Files (untracked; no others touched; E's phase-window.* not opened):**

| file | sha256 | size |
|---|---|---|
| `dev/diversity/redact.js` | `cb3f3ea1bdbbdd533b5bdacbbde95393d8dfe4ec9173126b6aad1fab74ed6d3d` | 106 lines, 6,241 B |
| `dev/diversity/redact.test.js` | `1d5b0a20fdb0190db1ae87d0802c8296155189287553da5ad3d80fda065c8025` | 255 lines, 14,010 B |
| `dev/diversity/arm-words.txt` | `59579593b3a9d7c9d810b6eeb6339c8af0f1ece16644b951db67c8445d25b91e` | 38 lines, 2,676 B |

`sha256sum dev/diversity/redact.js dev/diversity/redact.test.js dev/diversity/arm-words.txt` reproduces the table.

---

## 1 · WHAT IT IS

**Usage.** `node dev/diversity/redact.js <file> [--words <list>] [--letters B,E]` prints the redacted text on stdout.
- Exports: `redact(text, {words, letters})`, `leaks(text, words, letters)`, `parseWords`, `patterns`, `TOKEN`.
- A bad argument exits 2.

**Every removal becomes ONE token, `[redacted]`**, so a scorer is not told what kind of thing was removed. It runs line
by line: no pattern crosses a line break and no line is removed. **A label's cited line number is therefore the same
in the redacted text** (B's read: 197 lines in, 197 out).

**What it removes, in the order it applies.** The order matters in two places, and both have a mutant.
1. **Packet filenames**, with any directory in front: `[dir/]packet_<…>`.
2. **An abbreviated `<hex>…<hex>` sha**, whole. It runs BEFORE the plain sha pattern, or `…6509` survives (M3).
3. **Shas**: K6 corrected, `\b(?=[0-9a-f]*[a-f])(?=[0-9a-f]*[0-9])[0-9a-f]{7,64}\b/i`.
4. **`§`**, with an optional space and the run of word characters, dots and dashes after it: `§2.7`, `§8.10.1`,
   `§2.1–2.6`, `§RESUME`, a bare `§`.
5. **The pane-letter forms K6 names**, for every capital A–Z: `[pane:X]`, `pane:X`, `pane X`, `X pane`, `X's` and
   `X’s`.
6. **Four more forms these texts carry that K6 does not name:**
   - a letter before "(pane" (`B (pane 12fb81f6)`, p-leave-read-B:3);
   - a hand-back filename's letter (`p-leave-read-B_2026-09-14.md`);
   - a map file's letter (`map/K.md`);
   - a ruling owner `(E)`.
7. **Every NATO callsign**, ALPHA … ZULU (JULIET/JULIETT, WHISKY/WHISKEY, XRAY/X-RAY), in capitals or Title case.
8. **Every arm-word entry**, whole word, any case.
9. **Opt-in `--letters`**: a bare standalone capital for each seat letter named. It refuses A and I.
   - It is for the arm letters recorded at step 3b.
   - It keeps a byte unit ("190 B"), a ruling id ("D-2"), a drive ("E:") and a file ("B.md").
   - It is not in K6. I added it because a real control carries bare seat letters on its first line:
     *"— B, before A and E build"*, B's read :1. No named form reaches them.

**What it keeps, and the test fails if it doesn't:**
- `defaced`, `effaced`, `348026190`, `1757000000`;
- every figure shape these texts use: `348,026,190 B`, `55 s`, `664/1/4`, `0.271`, `12:41:31`, `main.rs:10885`,
  `2026-09-14`;
- `A seat` and `a pane`;
- lower-case `echo` and `delta`;
- path:line citations.

### 1.1 The arm-word list: 14 entries, with the reason for each in the file

**The rule, written at the top of the file.** A word is on the list only if it exists in one arm's text and not the
other's *by construction* of step 3, or if it is the run's own name for an arm. A word that merely *tends* to differ
is not listed: the guess rate measures that, and listing it would cost claims.

| entries | why |
|---|---|
| briefed, unbriefed, un-briefed | the arm's own name in R8b |
| brief, briefs, briefing | the room's other name for the packet; the briefed arm cites "the brief" |
| packet, packets | what only the briefed arm is handed (3e); 3d voids an unbriefed task with "packet_" |
| chair, orchestrator | the packet's author and the signer of its dispatch |
| arm, arms | the run's word for the condition |
| dispatch, dispatched | how a packet reaches a pane |

**Considered and left off:**

| words | why |
|---|---|
| ruling / ruled / re-rule | a ruling is a claim TYPE in R8b; removing the word strips the claim a label cites |
| control / controls | "control plane" is everywhere, and the controls are old texts a scorer can date anyway |
| keeper, quote | both arms receive the keeper quote |
| hand-back | both arms write one |
| lap ids (D063, L059) | they date the controls. An arm's lap id is unknown before step 3, and an id is not a word. A residual (§3) |
| anchor / anchoring | ordinary in mutant-harness text; a false hit costs more than it hides |
| uptake / polarity / deference | study vocabulary no mapless sibling can reach; "deference" is a room-card word both arms wake into |
| task | both arms get one |
| orch | considered; found in no hand-back I checked, so not guessed at |

---

## 2 · MEASURED

    RED FIRST  node dev/diversity/redact.test.js against a stub (parseWords and leaks real, redact = identity)
      9 passed · 12 failed. The 12 are every removal test and the CLI. The 9 that passed are the over-redaction and
      structure guards (figures, English, line count, idempotence), which an identity function satisfies by definition.
      The mutants below are what exercise them.
    SECOND RED  after the real control's two forms were found (§1 item 6, item 9): 22 passed · 3 failed
      ("B (pane", --letters removes, --letters refuses A and I)
    GREEN      node dev/diversity/redact.test.js      28 passed · 0 failed

    MUTANTS    on a replica (scratchpad/redact_mutants.js); pre-flight 28/0; the three tracked files hashed before and after
      M1  packet filename pattern removed                      CAUGHT
      M2  abbreviated <hex>…<hex> removed                      CAUGHT
      M3  abbreviated applied after the plain sha              CAUGHT
      M4  sha loses /i                                         CAUGHT
      M5  sha loses the digit lookahead ("defaced" goes)       CAUGHT
      M6  sha loses the letter lookahead (figures go)          CAUGHT
      M7  sha back to {7,40}                                   CAUGHT
      M8  § pattern removed                                    CAUGHT
      M9  § takes the sign only                                CAUGHT
      M10 [pane:X] removed (pane:X overlaps it)                CAUGHT  (see §4: SURVIVED on the first run)
      M11 pane:X removed                                       CAUGHT
      M12 "pane X" removed                                     CAUGHT
      M13 "X pane" removed                                     CAUGHT
      M14 "X's" removed                                        CAUGHT
      M15 "X's" loses the curly apostrophe                     CAUGHT
      M16 "X (pane" removed                                    CAUGHT
      M17 hand-back filename letter removed                    CAUGHT
      M18 map/X.md removed                                     CAUGHT
      M19 "(X)" removed                                        CAUGHT
      M20 NATO Title case dropped                              CAUGHT
      M21 ZULU dropped                                         CAUGHT
      M22 the arm-word list never applied                      CAUGHT
      M23 arm words case-sensitive                             CAUGHT
      M24 whole-text redaction AND "pane\sX"                   CAUGHT
      M25 --letters accepts A and I                            CAUGHT
      M26 bare letters lose the byte-unit guard                CAUGHT
      M27 bare letters lose the "-" guard                      CAUGHT
      M28 bare-letter pattern never added                      CAUGHT
      M29 parseWords keeps the reason                          CAUGHT
      M30 one token per kind                                   CAUGHT
      SURVIVE-CONTROL  reword a comment                        SURVIVED
      SKIP-CONTROL     an anchor that does not exist           NOT APPLIED
      30 applied · 30 caught · 0 NOT APPLIED (bar the skip control) · tracked files unchanged: true · post-run 28/0

### 2.1 The conflict inside the registration, and what I built

**Two rules that cannot both hold:**
- STEP 0 (87b799a) says the fixture must leave nothing matching
  `/\b[A-Z]\b pane|§\d|packet_|[0-9a-f]{7,40}/`. Its last alternative matches `348026190` and `1757000000`.
- K6 (5ff17be, corrected 5a62cd9) says those figures MUST survive, and that a pure-digit run is never removed.

**What I built:** K6, the later ruling that says it replaces the sha line. The leak check (`leaks()`) is STEP 0's
check, with K6's corrected sha pattern in place of `[0-9a-f]{7,40}`. The other three alternatives are kept: `§\d` is
inside my `§` pattern, `packet_` is in the filename pattern, and `X pane` is its own pattern. **If the chair meant
STEP 0's regex literally, K6 cannot hold and this needs a ruling.** I did not stop, because K6 states outright that it
replaces the sha line.

### 2.2 The cost to R8b: redact over my feasibility pair

Run with `scratchpad/redact_cost.js`, over B's read and against my 48 non-SILENT labels (feasibility §5).

**Headline: redaction destroyed none of the 48 labels.**
- 20 labels have at least one cited line changed, across 21 distinct lines. Line numbers are unchanged.
- B's read: 42 tokens; `leaks()` on the output returns [].

**What those 21 lines lost is locators, not propositions:**

| claims | lines | what went | what stays |
|---|---|---|---|
| 6-10, 12-15, 17, 18, 19 | :150-:163 | the "§1" in the "packet line" column of B's citation table | each row's claim text and B's verdict ("right", "drifted: :221") |
| 16, 62 | :160 | `2f7233c`, twice | *"`[redacted]` says **348,026,190 B**, 55 s"*: the figure and the contradiction survive. The commit B checked does not, so a scorer cannot see it was the same commit the packet cites |
| 37, 52 | :20, :94 | "B's §8" becomes "[redacted] [redacted] race" | :91-93, the D-4 sequence, are unchanged |
| 35, 39 | :16, :75 | "§3" | :70-74, the retry, and :74, the sentence 39 rests on, are unchanged |
| 41 | :114 | "§8" | :110-113, :115 |
| 46 | :40, :43 | "which §2 should say"; "E's lane" | the pid derivation at :40-42 |

**Under the ruled grain** (§8.10.1: G1 drops superseded claims, G2 makes drift SILENT), 36 labels are non-SILENT, and
13 of them touch a changed line (6-10, 12-15, 17, 46, 52, 62). None is destroyed.

**The real cost is to how a scorer MATCHES a line to a claim, not to what the line says.** Wherever a hand-back
locates a claim by "§n", the scorer must match it by content instead. B mostly wrote section numbers without the sign
("2.2 step 3"), and those survive (§3).

**The packet and E's hand-back.** The packet is not given to scorers redacted (5a writes the list from the committed
packet), so this is for scale only:
- packet @c59530a: 82 tokens, 51 of 259 lines changed;
- E's hand-back: 73 tokens, 49 of 423 lines changed.

`leaks()` returns [] on both.

---

## 3 · WHAT A SCORER CAN STILL INFER ABOUT THE ARM FROM REDACTED TEXT

This is what K6's guess rate measures. **My expectation: at least one scorer's arm-guess rate reaches ≥ 0.75 and
polarity reads UNBLINDED.** It is an expectation from reading two control texts, not a measurement of any arm. Here is
why, strongest first.

1. **Packet structure survives without the sign.** Counted in B's redacted read:
   - 25 ruling ids (`D-n`, `D-nn`);
   - 7 falsifier ids (`F1`-`F4`);
   - 9 "n.n step n" and 12 "step n".

   A briefed hand-back answers the packet's numbering and its registered falsifiers by id. An unbriefed one has no
   falsifiers to cite. Removing these is not in K6: they are claim locators, and the ruling ids are B's own invention.
2. **Verbatim quotation of the brief.** Uptake is the thing the run measures, and S40 overlap is visible to any reader.
   A text quoting long brief-shaped sentences reads as briefed. **No redaction can blind polarity to uptake.**
3. **Token density.** The briefed arm's text holds more removable things (arm words, `§`, packet paths), so it carries
   more `[redacted]`. One uniform token hides the kind of removal, not the count.
4. **Bare seat letters.** Without `--letters`: B's read keeps "— B, before A and E build" (:1) and "tells A that" (:75).
   Even with `--letters B,E`, **A and I can never be removed bare.** An arm seated at letter A leaks through every
   "A" that means the seat. Recommendation for 3b: seat no arm at A or I.
5. **Dates and lap ids** (`2026-09-14`, `D063`) place the two controls a day before the arms. They are figures and are
   kept. A scorer who knows the run's date can separate controls from arms.
6. **The stop-rule register.** "cannot be built as written", "STOP", "§5 applies" (now "[redacted] applies") echo the
   packet's §5 wording verbatim in a briefed read.
7. **Machine letters** (D, L) and **ruling words** (RULED, ruling) are kept on purpose, as claim types and context. They
   say little about the arm, but they are not removed.

---

## 4 · CORRECTIONS, INCLUDING TO MYSELF

- **M10 SURVIVED on the first mutant run.** With `[pane:X]` gone, `pane:X` still took the letter, leaving
  `[[redacted]]`. No letter leaked, but the bracket shape told the form.
  - I added a test of exact outputs (`[pane:B]` → one token; the filename, map and `(E)` letters) and re-ran: caught.
  - **That test was written after the survivor, not red first.**
- **M17, M18, M19 and M29 were caught only by the leak-checker test or the CLI test** on the first run, because
  `leaks()` shares `redact()`'s patterns: a pattern dropped from both passes any check that goes through `leaks()`.
  The same exact-output test and a `parseWords` test now catch each one directly.
- **K6's four named forms did not cover a real control's first three lines.** I found this only by running the
  surveying grep over B's read and E's hand-back, not from the spec. That grep also showed that "A seat" and "A pane"
  are English (so "X seat" is not a pattern), and that "D's" and "L's" are machines. `X's` removes those machine
  possessives too; that is a named cost.
- **The CLI's first form dropped its own file argument** when `--words` was absent (`wi + 1 === 0`). The CLI test
  caught it before any use.
- **Two node heredoc edits broke on escape sequences and wrote nothing.** Both were redone with Edit. This is the
  same class as my P-LEAVE sed probe.

## 5 · WHAT I DID NOT VERIFY

- **Any arm text.** No arm exists. The guess-rate expectation in §3 is a reading of two controls, not a scoring run.
- **Real scorers.** No scorer saw a redacted text, and nobody tried to guess an arm from one.
- **A sha made only of the letters a–f survives**, as K6 corrected says. There is no test for it.
- **A 4-character `…d6de` tail on its own** (with no head) survives. It is below every pattern's length.
- **Other ellipsis forms:** "…" is the only one handled. `abcd1234...ef56` with three dots is not.
- **Letters in Title-case callsign words that are real names or places** ("Mike", "Victor", "Lima", "India", "Delta")
  are removed. No fixture measures how often a hand-back uses them as words.
- **The arm-word list was not tuned against any briefed or unbriefed pair,** only against the rule in its header and
  the two controls. "brief" as an adjective ("a brief pause") is removed.
- **Windows line endings:** a `\r` stays at the end of each line, untouched. No test holds a CRLF file.
- **Nothing was committed or run against the app.** E's `phase-window.*` files were not opened.
