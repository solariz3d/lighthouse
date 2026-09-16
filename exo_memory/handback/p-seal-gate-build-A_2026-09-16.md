# P-SEAL-GATE build · ALPHA — a keyed dispatch does not render until its row is on origin and its key is out of the search space

**Pane A, machine D, 2026-09-16 12:20–12:4x.** Lap D068, chunk 3. Packet row: `loop/plan_cleanup_chunks_2026-09-16.md`
(chunk 3, row A). Design: `handback/p-seal-gate-A_2026-09-16.md` (L062). The keeper's YES:
`loop/keeper_decisions_2026-09-16.md`. **Source only: nothing rebuilt, nothing relaunched; it builds at the next launch.**

**Files, both modified and uncommitted, and no others:**

    consonance/src-tauri/src/mcp.rs          +1096 −1
    consonance/src-tauri/brief/COMMITTEE.md  +8

---

## 0 · FOR B — THE EXACT LINES I TOUCHED IN `mcp.rs`, so your edit lands clean

From `git diff -U0` against `f67b57a` (HEAD has since moved to `51c8978`, which touched only the librarian's journal):

| hunk | new lines | what |
|---|---|---|
| `@@ -299,0 +300,5 @@` | 300–304 | `ChairInjectArgs` gains `seal: Option<String>` with `#[serde(default)]` and its doc |
| `@@ -463 +468 @@` | 468 | `chair_inject`'s destructure: `{ token, target, text, seal }` |
| `@@ -482,0 +488,19 @@` | 488–506 | **the gate's call**, in `chair_inject`, right after the debt gate's `}` and before `let (tx, rx)` |
| `@@ -502,0 +527,12 @@` | 527–538 | `fn seal_audit(&self, text: String)`, right after `owed_handback_refusal` |
| `@@ -1582,0 +1619,1059 @@` | 1619–2677 | **appended at the end of the file**: the gate's section (1619–2239) and `mod seal_gate_tests` with its doc comment (2240–2677; `mod` itself at 2244) |

**Nothing else in `mcp.rs` moved.** Your trailer gate will sit on the same path. Order is your call. If it goes in
`chair_inject`, one constraint from my side: the `chair_inject_runs_the_seal_gate_after_the_debt_gate_and_before_anything_is_sent`
test pins **debt gate < seal gate < `self.send_chair(`** by position, and does not care what sits between them.

---

## 1 · WHAT THE GATE ENFORCES, AND WHAT STAYS A SENTENCE

| | status | how |
|---|---|---|
| a DECLARED seal's row is under `exo_memory/loop/`, on disk, parses, names one task | **GATE** | G1; a malformed block refuses by field and line |
| the row is committed, **and committed as it stands** — the block on disk is the block in that commit | **GATE** | G2: `git log -1 -- <row>`, then `git show <c>:<row>`, block compared |
| **the row is on origin at the instant of the call** | **GATE** | G3: `git fetch --quiet <remote>`, then `git merge-base --is-ancestor <c> <upstream>`. No clock anywhere. A failed fetch **refuses**; it never falls back to the cached ref |
| the key is on this machine, **outside the checkout**, and unchanged since sealing | **GATE** | G4: `is_file`, a path-prefix check, `git hash-object --no-filters` against `key-git-blob` |
| the key is not in the directory the subjects are pointed at, and the dispatch does not name the key | **GATE** | G5 |
| the object's filename is not a tracked file (T5: one diff from its original) | **GATE**, heuristic | G6: `git ls-files`. A renamed copy defeats it |
| **THE T3-KEY RULE**: every `DISTINCTIVE:` and `QUESTION:` literal from the key file is absent from tracked files AND from untracked files git does not ignore | **GATE** | G7, refusing by `path:line (kind)`, never by text |
| no refusal ever prints the key's text | **GATE** | asserted on **every** refusal a fixture produces |
| an UNDECLARED dispatch that names a sealed row's object or key path is refused | **GATE**, partial | reverse lookup over `exo_memory/loop/*.md`; no git, no subprocess |
| **an undeclared keyed task with no sealed row at all** | *sentence* | nothing in a keyed dispatch's text marks it — §2 |
| **the push that put the row on origin was exactly one file** | *sentence*, with an audit aid | the gate cannot see who pushed or whether anyone was awake. Its audit line says whether the sealing commit touched exactly one file |
| whether the distinctive line is a good fingerprint of the key | *sentence* | only a reader holding both can tell |
| whether the task can measure anything (its ceiling) | *sentence* | T2 was sealed correctly and was void by ceiling |
| a key file larger than 8 MB, or ignored files | *not searched* | the audit line says so if a file was skipped |

---

## 2 · THE L062 DESIGN WAS WRONG IN THREE PLACES, and the build corrects all three

**(a) THE SNIFFER IS NOT BUILT. It was measured, and it caught none of the real keyed tasks.** L062 measured it on
15 board previews of 110 characters. Tonight it ran against **40 full chair dispatches** in this seat's own
transcripts on D (`scratchpad/sniffer_measure.js`, which reads only user turns beginning `[chair:MAIN]`):

    marker hits: 6 of 40; keyed tasks found: 3 real (T3, T2, T5), of which hit: 0
      the 6 hits: three ordinary packets citing sha256, the two packets ABOUT sealing, one compaction artifact

**A keyed dispatch is written to hide its key from the subject, so its text never names one. The sniffer was
aimed at the one text guaranteed not to carry the signal.** What replaced it is narrower and honest about it: a
reverse lookup from sealed rows to the paths a dispatch points at. That lookup **would have caught T5**: its row
existed but was not pushed, and its dispatch named `…\scratchpad\t5\ferry.js`. **It would not have caught T3**,
which had no machine-readable row. A keyed task with no row and no declaration passes, and §1 says so.

**(b) The L062 block carried the row's own sha256.** A file cannot contain its own hash. Replaced by G2's
comparison: the block on disk must equal the block in the commit that last touched the row.

**(c) The L062 block carried the key's distinctive line and question IN THE COMMITTED ROW.** That puts the key's
fingerprint inside the search space, which is the T3 leak the gate exists to stop. **Both literals now live only
in the off-repo key file** (`DISTINCTIVE: …`, `QUESTION: …` lines), and the gate reads them from `key-path`.

**And one constraint forced by the crate:** there is no sha256 in `Cargo.toml` and no new dependency was allowed,
so the key's revision seal is `key-git-blob`, the id from `git hash-object --no-filters`. git is already the gate's
one dependency, and the digest names its function (`cards/every-digest-carries-its-function.md`).

### The row format, as built

    ```seal
    task:         T9
    key-path:     C:\...\scratchpad\keys\T9_key.md          ← off the repo, not beside the object
    key-git-blob: <40 hex from git hash-object --no-filters <key-path>>
    object-path:  C:\...\scratchpad\t9\T9_text.md
    subjects:     A, C, E
    ```

    the key file itself carries, besides the answer:
    DISTINCTIVE: <a literal of 12+ characters that must not exist in the checkout>     (one or more)
    QUESTION: <the task's question in the brief's exact words, 12+ characters>          (one or more)

    declared at dispatch as:   seal: "exo_memory/loop/<row>.md#T9"
    override, reason posted:   seal: "none: <why this dispatch is not that task>"

---

## 3 · THE REFUSAL TEXT, AND THE CROSS-CHECK AGAINST EVERY OTHER GATE'S RECOVERY

Every refusal has one shape (`seal_refusal`):

    refused: <WHAT> — the dispatch was not sent (posted to the board).
      row     exo_memory/loop/<row>.md#<task>
      detail  <which check, by path and line; never the key's text>
    Recovery, in this order:
      1  git commit -- <row>      (that path ONLY — a bare commit takes the shared index)
      2  git push                  (unattended only if that commit's diff is exactly this one row file:
                                    brief/COMMITTEE.md, the seal-row exception)
      3  re-send this dispatch unchanged, with the same `seal`
    This is NOT a turn problem: nothing here moves the baton, and nothing here tells you to. If the station gate
    or the debt gate refuses your re-send, that is a different gate with its own recovery. Never printed here:
    the key's distinctive line, its question, or any matched text.

The recovery differs by failure: push for a row not on origin, fix-the-row for a malformed one, and **"THE
QUESTION IS SPENT"** when the key's text is in files that cannot be moved (T3).

**Checked against each gate that can meet a seal refusal on the same path:**

| gate | its recovery | against mine |
|---|---|---|
| station (`mcp.rs`, `chair_inject`) | "wait for the loop, or move the baton with lap-row.js" | **mine never names the baton or `lap-row.js`**, asserted on every refusal in the fixtures. A seal refusal returns before `mark_rung`, so it does not change the station state either |
| debt (`owed_refusal_text`) | "Move the baton, then re-send" | sequential, not contradictory. The debt gate runs first, and its re-send meets the seal gate afterwards. Mine does not claim to be the last gate |
| hand-back trap (`handback_refusal_text`) | a pane retakes the baton | different verb (`call_librarian`); the seal gate is on `chair_inject` only |
| **commit gate** (`consonance/tools/commit-gate.js`) | refuses a commit of a path another seat holds | a new sealed row is claimed by no packet, so it is **allowed** by its own rule ("AN UNCLAIMED PATH is ALLOWED"). **But its "UNREADABLE STATE fails CLOSED" arm would refuse step 1** mid-lap if the lap's packets did not parse. **It is not installed on D** (`.git/hooks` holds only samples; `core.hooksPath` unset), so there is no live collision. Named, because installing it would create one |

---

## 4 · BARS

    RED FIRST, on the real crate, with seal_gate STUBBED to allow (scratchpad/seal_patch.js red):
      cargo test --bin consonance seal_gate_tests        5 passed · 24 failed
        the 24: every refusal fixture, and the two audit-line fixtures (F1, F13)
        the 5 green are the ones that must not depend on the verdict: an ordinary dispatch runs no git (F2b), an
        ignored file is not the search space (F9b), the no-checkout split, the wiring-order pin, the bounded runner

    GREEN (the real body swapped in, then F1b added):
      cargo test --bin consonance seal_gate_tests        30 passed · 0 failed
      cargo test --bin consonance mcp::                  baseline before any edit: 30 passed · 0 failed (26 s)
      cargo test --bin consonance -- --test-threads=1    709 passed · 1 failed · 4 ignored
        the 1: ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect — the
        long-standing known red; 709 + 1 + 4 = 685 existing + 29 new at that run
      cargo test --bin consonance committee              10 passed · 0 failed   (after the COMMITTEE.md edit)
      cargo test --bin consonance brief                  13 passed · 0 failed
      node consonance/tools/lap-row.test.js              113 pass · 0 fail      (it checks COMMITTEE.md's diagram copy)
      warnings in the new section: none (the only mcp.rs warning is the pre-existing `tool_router` field)

    MUTANTS, on a copy: a git worktree of HEAD in the scratchpad with both working files copied in, its own
    CARGO_TARGET_DIR, the live checkout's files hashed before and after (scratchpad/seal_mutants.js):
      pre-flight, unmutated copy, cold target: green 30/0 in 68 s
      14 listed · 14 killed · 0 survived · 0 NOT APPLIED · live checkout's files unchanged: true
        #1  NO FETCH — checked against the cached remote ref (the L062 packet's own command)   2 failed
        #2  NO ANCESTRY — a seal not on origin passes                                          2 failed
        #3  a block edited after its commit passes                                             1 failed
        #4  a key changed since sealing passes                                                 1 failed
        #5  the leak search reads tracked files only                                           2 failed
        #6  G9 broken — the refusal quotes the matched line                                    3 failed
        #7  a key beside the object passes                                                     1 failed
        #8  a dispatch naming the key path passes                                              1 failed
        #9  an object with a committed twin passes                                             1 failed
        #10 the undeclared reverse lookup never fires                                          2 failed
        #11 seal: "none" with no reason is accepted                                            1 failed
        #12 a key inside the checkout passes this check                                        1 failed
        #13 the audit stops flagging a sealing commit wider than the row                       1 failed
        #14 chair_inject no longer calls the gate                                              1 failed
      the worktree was removed afterwards (git worktree list shows only the checkout); no seal-gate-* fixture
      directory is left in %TEMP%

    **Two kills are weaker than they look, and I am saying which.** #12 is caught by the refusal's HEAD TEXT: with
    that check off, the leak search behind it still refuses the same fixture, for a different stated reason. The
    behaviour stays safe, and the test pins which gate speaks. #14 is caught by the wiring-order TEXT pin; no
    fixture drives `chair_inject` itself (see §6).

    **F6b is the fixture this gate exists for.** Origin is force-pushed past the seal. The fixture ASSERTS, as a
    precondition, that `git branch -r --contains <seal>` still lists origin/main, and the gate refuses anyway.
    Mutant #1 (no fetch) turns it green-for-the-wrong-reason and is caught.

---

## 5 · CORRECTIONS, INCLUDING TO MYSELF

- **My own L062 design, three times** (§2): a sniffer that caught none of the three keyed tasks, a row that had to
  contain its own hash, and a schema that committed the key's fingerprint into the search space.
- **The mutant harness's dirty-source check refused the first run**, correctly by its own rule. Mutant #4's
  replacement (`Ok(o) if o.code == 0 => {}`) is a legitimate line elsewhere in `mcp.rs`, and the check is a
  substring match. That is the limit I filed against that check on L061 §6.5, met again in my own harness. Fixed
  with a unique replacement (`&& true`), not by weakening the check.
- **Nearly broke a test before writing a word:** `the_brief_does_not_duplicate_the_verb_list` (`main.rs`) fails if
  `COMMITTEE.md` names `chair_inject`. The push rule says "the seal gate" and never names the verb.
- **The fixture list grew one** after green: F1b, a sealing commit that carries a second file, which must be
  reported as *not* the push exception. Without it, the exception's one enforceable aid had no test, and mutant
  #13 would have survived.
- **My rings earlier today carried no NEXT trailer** (`BUILDING.md`, both item 6s). This hand-back and its ring
  do.

---

## 6 · WHAT I DID NOT VERIFY

- **No end-to-end dispatch.** No fixture calls `chair_inject` through the MCP server. The gate is tested as
  `seal_gate` / `seal_gate_at` on real repositories, and its placement by a positional text pin. The `spawn_blocking`
  wiring, the board line from `seal_audit`, and the new `seal` field in the tool schema the chair's client sees have
  not been exercised in a running app. **That needs the next launch**, and a first keyed dispatch will be its
  first real run.
- **The chair's MCP client must reconnect to see `seal`.** A client holding the old schema cannot pass it. An
  undeclared keyed dispatch still meets the reverse lookup, so this is a degradation, not a hole.
- **Nothing on L**, and no real network. G3's fetch was exercised against a local bare repository, a renamed
  (unreachable) one, and a force-pushed one — not against GitHub. The 30 s fetch limit is covered by a `ping`
  timeout test of the runner, not by a hung fetch.
- **Every chair dispatch now reads `exo_memory/loop/*.md`.** Measured in node on D: 350 files, 3.89 MB, 23 ms. Not
  measured in the Rust path, which reads the same files.
- **No sealed row exists yet.** Zero column-0 ```` ```seal ```` fences under `exo_memory/loop/` today, so the
  first keyed task after this lands is the first time a real row, a real key and a real push meet the gate.
- **Not committed, not pushed, not rebuilt.**

NEXT: librarian call_librarian with the pointer — now, in the same turn as this file
