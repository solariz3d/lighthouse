# P-SEAL-GATE · ALPHA — the seal gate for `chair_inject`: design, refusal text, fixtures

**Pane A, machine L, 2026-09-16 07:0x–07:2x.** Plan `loop/plan_L062_loop_mechanics_2026-09-16.md` (e3a764e),
the A paragraph. **DESIGN ONLY — no line of `main.rs` was edited tonight, and nothing was run that writes.**

Prior art read at source, not from the plan's summary: `packet_commit_gate_2026-09-02.md`,
`packet_first_push_gate_2026-09-06.md`, `battery_run1_T2_sealed_row_2026-09-16.md`,
`pane_battery_registration_2026-09-16.md` §9–§10 (A1, A2, A5, A8), `librarian/2026-09-16.md` 04:22 / 04:39 / 05:10,
`consonance/hooks/dispatch-gate.js`, `consonance/src-tauri/src/mcp.rs`, `main.rs:9077, 9256, 9456-9540`.

---

## 1 · THE ANSWER FIRST: WHAT A GATE CAN ENFORCE, AND WHAT STAYS A SENTENCE

My own rule from the harness packet, turned on my own design. **A rule nobody enforces is still worth having; its
silence must never read as a passing gate.**

| # | the check | status | why |
|---|---|---|---|
| G1 | the declared row file exists and parses into a machine block | **GATE** | a file and a grammar, both in front of the verb |
| G2 | the triple `(commit, path, sha256)` resolves at that commit | **GATE** | three git commands, no judgment |
| G3 | the commit is **on origin** — an ancestor of the pushed head | **GATE** | but only with a `fetch` first; see §4, the packet's own command is not sufficient |
| G4 | the key's **distinctive line** is absent from the checkout, tracked **and untracked** | **GATE** | literal string, literal search space |
| G5 | the task's **question line** is absent from the checkout | **GATE** | same |
| G6 | the key does not live in a directory the subject is pointed at | **GATE** | path prefix comparison (the 05:10 extension, T5's exposure) |
| G7 | the object's basename does not exist in the repo | **GATE**, heuristic | one `git ls-files`; it is what would have caught T5's `ferry.js` |
| G8 | a dispatch that *smells* of a key but declares none is refused | **GATE**, heuristic | makes silence loud; §3 |
| G9 | the refusal **names** paths and **never quotes** matched text | **GATE** | assertable in a test |
| S1 | the declared distinctive line is genuinely representative of the key | *sentence* | a lazy declarer seals a line that appears nowhere; only a reader who has both can tell |
| S2 | the object's original is not recoverable by a `diff` against something committed | *sentence* | G7 catches the exact-name case; a renamed copy defeats it |
| S3 | the subjects have not already read the prediction (§9 A1) | *sentence* | the gate cannot read four transcripts and judge contamination |
| S4 | the ceiling and floor were chosen so the task can measure something (A5) | *sentence* | that is what T2 proved, and it is a judgment about difficulty |
| S5 | the key's content never reaches a subject **after** dispatch | *sentence* | this gate fires once, before delivery; the leak check is the instrument for after |

**The honest shape: this gate closes the door that was open tonight and it does not make a task sound.** T2 was not
leaked and still measured nothing — it hit its ceiling. **A gate that cannot see S4 cannot save a run from being
void**, and saying otherwise is the "claims more than it checks" line I filed against myself in L061.

---

## 2 · THE TWO INCIDENTS, AS THE RECORD HAS THEM — the chair's account needs one correction

The packet says the second failure was a task the chair *shipped* "two hours later, built from a committed file,
where one `diff` printed all eight planted defects". **The record names two different events and only one of them
shipped**, and which one it was changes what the gate must catch.

    T3   04:12:13  key committed INSIDE the repo (7c8642e) · brief 04:13:34 · dispatch 04:17:46-04:17:58
                   DISPATCHED. Void, all four cells. Every seat's obvious grep hit the key; E stopped under §6.
                   (librarian/2026-09-16.md 04:22 · battery_run1_T2_sealed_row_2026-09-16.md)

    T2   04:3x     the FIRST T2 text was the committed ask-channel registration with 8 defects planted in it —
                   one diff against `git show HEAD:...` prints all eight.  **WITHDRAWN BEFORE DISPATCH**, by the
                   chair applying its own new rule to its own work (row d3c1d2e, corrected 62a4f3a; the
                   librarian at 04:39: "the T3-KEY rule applied by the chair before I could").  NOT shipped.

    T5   05:0x     SHIPPED with NO SEALED ROW ON ORIGIN before delivery, and its object is a copy of a committed
                   file — "at ceiling by construction because the plant is one `diff -u` from its committed
                   original" (librarian 05:10). Three cells, descriptive only, 8 of 8 to every seat.

**So the second shipped failure is T5, not the withdrawn T2 text, and T5 broke two different rules at once** — no
row on origin (A2's own "NO TASK IS DISPATCHED BEFORE THAT PUSH") and an object whose original is in the repo.
The withdrawn T2 text is the counter-case and it matters: **a human check did work once tonight.** It is not an
argument against the gate — it is the reason the gate must fire on the state, not on whether anyone remembered.

**And the rule was written down before all three.** K4/K5 (`anchor_similarity_registration_DRAFT_2026-09-15.md:517`)
ruled the off-repo artifact and the void-grep on 09-15; the chair carried K5 into that draft's own §8.10 and did not
carry it to the first task it shipped. **This is the commit-gate finding again, verbatim: "a rule that its violator
can recite is not a control."**

---

## 3 · HOW A DISPATCH DECLARES A KEY — the part the gate cannot guess

### 3.1 · One new optional argument, and the row carries the rest

    chair_inject(token, target, text, seal: Option<String>)
                                      +-- repo-relative path of the sealed row, or the string "none: <reason>"

Nothing else moves onto the tool surface. Everything the gate needs is in the row, so the row stays the master and
the call stays a pointer — the same rule as `call_librarian`.

### 3.2 · The row gets a machine block; the prose above it is untouched

Tonight's rows are prose tables a human reads well and a parser cannot. One fenced block per task, appended under
the prose, `key: value`, one per line:

    ```seal
    task:        T5
    key-path:    <absolute path, OFF the repo>
    key-sha256:  8d9b9039783f003234745df58ec78c3f962291a9e2507704e7cb06c5a5110b46
    object-path: <absolute path of the thing the seats are pointed at>
    row-commit:  62a4f3a
    row-path:    exo_memory/loop/battery_run1_T2_sealed_row_2026-09-16.md
    row-sha256:  <sha256 of row-path AS COMMITTED at row-commit>
    distinctive: <one literal line from the key that must not exist in the checkout>
    question:    <the task's question, in the exact words the brief uses>
    subjects:    A, C, E
    ```

`row-commit` + `row-path` + `row-sha256` is **A8's triple, and A8 is why the sha alone is refused**: a bare sha
stops identifying its object the moment the file is touched for any reason, which is exactly what happened to
`8bf0b5ee...` when `d1546db` corrected a timestamp line.

### 3.3 · THE SNIFFER — because a declaration the sender controls can simply be omitted

**This is the load-bearing weakness and I will not bury it: `seal` is optional, so a chair that forgets it gets no
gate at all.** That is the T5 failure mode exactly — nobody lied, the step was skipped. So the gate is two halves:

- **declared** → every check in §4 runs, hard.
- **undeclared** → the dispatch text is matched against a marker set (`sealed`, `answer key`, `planted`, `N PLANTED`,
  `sha256`, `CEILING`, `FLOOR`, `scored against the key`). A hit with no `seal` argument is **REFUSED**:
  *"this dispatch names a key and declares none — pass `seal: <row path>`, or `seal: "none: <reason>"`, which is
  posted to the board."*

The override is not a loophole as long as it is **audited and reasoned**: `none:` with no reason is refused, and the
reason lands on the board where a scorer reads it later. **Omission becomes a visible act instead of a silence.**

*Measured, and it is the one number I could get tonight (§7): over today's 15 board-visible dispatch previews the
marker set fires **once** — on this packet, which names a key and has none. A false positive rate of 1 in 15 on
110-character previews, and the one hit is the packet that designs the sniffer.*

---

## 4 · THE CHECKS, IN ORDER, WITH THE COMMANDS — and two corrections to the packet's own prescription

Run in `chair_inject_exec`, **after** the token, station and debt gates and **before** `gate_or_queue` — so that
nothing about a broken seal can render, and the ordering follows this file's own precedent for the debt gate:
*"deliberately AFTER the station gate and narrower than it"* (`mcp.rs:470-479`). The cost of that order is named in
§6.

    G1  row parses            the file exists at `row-path` in the working tree, the seal block is present,
                              every field above is non-empty. A missing field is a refusal naming the field.

    G2  the triple resolves   git cat-file -e <row-commit>^{commit}
                              git cat-file -e <row-commit>:<row-path>
                              git show <row-commit>:<row-path> | sha256   ==   row-sha256

    G3  ON ORIGIN             git fetch --quiet origin
                              git merge-base --is-ancestor <row-commit> origin/<branch>

    G4  the key is not        the DISTINCTIVE line, literal, over tracked AND untracked files:
        in the search space     git grep -F -n -- "<distinctive>"                      (tracked)
                                grep -rF -n --exclude-dir=.git "<distinctive>" .       (everything else)

    G5  the question is not   the same two searches for `question`.
        in the search space

    G6  the key is not beside the object     `key-path`'s directory must not be a prefix of `object-path`'s
                                             directory, and vice versa.

    G7  the object is not one diff from      basename(`object-path`) must not appear in `git ls-files`.
        something committed

**CORRECTION 1 — `git branch -r --contains` is not sufficient, and the packet prescribes it.** It reads
remote-TRACKING refs, which are a local cache. After a force-push, or simply between fetches, a commit that no
longer exists on origin still "contains" — the gate would pass a seal that is not there. **`git fetch` first, then
`merge-base --is-ancestor`.** The fetch is the part that talks to the world; without it the check is a claim about
this disk wearing the word *origin*.

**CORRECTION 2 — "the commit precedes the delivery" is a weaker test than the one available.** Comparing
`git show -s --format=%cI` to the wall clock trusts a committer date that a rebase rewrites and a clock can lie
about. **The gate verifies the row is on origin AT THE INSTANT OF THE CALL**, which is strictly stronger and needs
no timestamp: if it is there now and this is the first delivery, it preceded it. What the gate owes the *scorer* is
the audit line — `seal verified (commit, path, sha) -> <pane> at <ts>` on the board — so "before the first
delivery" is checkable afterwards by someone who was not here.

---

## 5 · THE REFUSAL TEXT — and the rule that a refusal NAMES but never QUOTES

Two forms, because the two failures have opposite recoveries. **G9: no refusal ever prints the matched text.** A
board line that quotes the key to explain that the key leaked *is the leak*, one hop later — and the board is
readable by every pane in OPEN phase. This is the leak-check refinement I wrote in L061 pointed at my own output:
**a name tells you a file exists; it cannot tell you what the file says.**

    refused: THIS DISPATCH NAMES A KEY AND ITS SEAL IS NOT ON ORIGIN.
      row     exo_memory/loop/<row>.md
      seal    (<commit>, <row-path>, <sha256>)
      failed  <commit> is not an ancestor of origin/main (checked after `git fetch --quiet origin`)
    Nothing that names a key renders into a pane until the row a scorer will judge it against is witnessed
    somewhere other than this machine. Recovery, in this order:
      1  git commit -- <row-path>          (this path ONLY — see the commit gate)
      2  git push origin <branch>          (see THE COLLISION below; this needs the keeper's standing yes)
      3  re-send this dispatch unchanged
    This is NOT a turn problem. It does not move the baton and nothing here tells you to. If the station gate or
    the debt gate refuses your re-send, that is a different gate with a different recovery; do not read this as
    its cause. This refusal does not clear itself — it clears when the row is on origin.
    (Posted to the board: the row, the triple, and which check failed. Never the key's text.)

    refused: THE KEY IS READABLE INSIDE THE SEARCH SPACE — 2 hit(s) in the checkout.
      row      exo_memory/loop/<row>.md
      matched  exo_memory/loop/battery_run1_T3_key_2026-09-16.md:7   (tracked)
               scratch/notes.md:12                                   (untracked, working tree)
      on       the key's DISTINCTIVE line — not printed here, by rule
    A task whose object is this repository cannot have its key inside it. Recovery: move the key out of the
    checkout, leave only the (commit, path, sha) row, and re-send. If the hits are in files you cannot move —
    a map line, a plan, another seat's hand-back — THE QUESTION IS SPENT and no re-send fixes it; T3 is the
    worked case (librarian/2026-09-16.md 04:22).
    (Posted to the board: the paths and line numbers. Never the line.)

### 5.1 · CHECKED AGAINST THE OTHER VERBS, WHICH IS WHAT THE PACKET ASKED FOR

Tonight two gates each named a recovery the other rejects: the station gate tells the chair *"wait for the loop, or
move the baton"* (`mcp.rs:470`) while the hand-back trap tells a pane the loop **is not coming back** and to retake
the baton (`mcp.rs:163-180`). Mine is checked against all three:

- **vs the station gate** — my recovery is git, not a baton move, and the text says so explicitly. No contradiction,
  and it must never be softened into "move the baton and try again": that would be the same collision.
- **vs the debt gate** — my refusal does not promise the re-send will land. It says which gate it is and does not
  claim to be the last one.
- **vs the commit gate** (`packet_commit_gate_2026-09-02.md` §3) — step 1 names **one path**. A bare `git commit`
  during a lap captures whatever is in the shared index, which is the 09-04 `38ae5c2` capture; the recovery would
  otherwise walk the chair straight into it.

### 5.2 · THE COLLISION, AND IT IS A REAL ONE — the gate's required recovery is an act another rule forbids

**`COMMITTEE.md`, the 08-26 amendment, rule 3: *"Nothing is pushed by a seat. Publishing outward keeps a human awake
saying yes."*** And A2 requires: *"NO TASK IS DISPATCHED BEFORE THAT PUSH."* **Both are live, and together they say
a seat may not ship a keyed task at all without waking the keeper.** Tonight the chair pushed (MAIN, 06:4x:
"Pushed. `origin/main` = `d90f4c7`"), so in practice one of the two rules is already being read as not applying to
the chair — and nothing in either file says that.

This is not mine to rule. **Three ways it can go, and the gate is different under each:**

1. **A narrow standing yes for seal rows only** *(what I would recommend)*. A push whose diff is exactly the row
   file and nothing else. It is enforceable, which is why I prefer it: the gate can verify the push contained only
   that path — `git diff --name-only <old-origin-head>..<new-head>` equals `row-path` — and refuse otherwise. The
   keeper's yes then covers a shape, not an occasion.
2. **The seal is witnessed by something other than origin** — a second machine, a timestamping service. Heavier,
   and it makes the room depend on a thing it does not own.
3. **Keyed tasks only run while the keeper is awake to push.** Honest, and it collapses the battery into his hours.

**Until one is chosen, the gate as designed refuses every keyed dispatch on a night the keeper is asleep.** That is
the correct behaviour under the rules as written, and it is also the kind of gate that gets disabled at 3am
(`packet_commit_gate_2026-09-02.md` §4 bar 5, in its own words). **Saying so is the deliverable; quietly choosing
one of the three on the chair's behalf is not.**

---

## 6 · WHERE IT LIVES, AND WHY NOT A HOOK — measured, not argued

`consonance/hooks/dispatch-gate.js` already exists and already asks before an uncited dispatch. **Its own header
records why it cannot carry this gate** (`:29-36`): *"BYPASS-PERMISSIONS MODE OVERRIDES 'ask'. An uncited dispatch
went through with no prompt while `data/dispatch-gate.jsonl` recorded outcome:'asked' ... this gate BITES only when
bypass is off."* Every seat on this machine, including the one writing this, is running under bypass right now.

**So the seal gate belongs in `chair_inject_exec`, in the verb, which is where the packet put it** — and the reason
is a measured failure of the hook layer, not a preference. The commit-gate packet's §7 anticipated the same shape:
*"a gate the chair can step over on a bad night is worth less than an honest note."*

**The cost of the ordering** (after station and debt, per `mcp.rs:470`'s precedent): a dispatch that is both out of
turn and unsealed costs the chair two round trips — it learns about the turn, fixes it, and only then learns about
the seal. I take that over inventing a new precedence, and it should be re-read if it ever bites.

**One more cost, named because nobody will measure it later:** G3 shells out to `git fetch` on the dispatch path.
`--quiet`, and only when `seal` is present or the sniffer fires, so an ordinary fan-out runs **zero** git commands —
that is fixture F15 and it is a bar, not an aspiration.

---

## 7 · MEASURED TONIGHT, each with the command that produced it

    node -e "<board.jsonl filter>"  over C:/Consonance/data/board.jsonl, rows with ts >= 2026-09-16T00:00-06:00
      chair-injected rows on the board today              15   (plus 1 `chair_inject ... refused`)
      of those, previews matching the marker set           1   — this packet, which names a key and has none

    read at source
      dispatch-gate.js's bypass limit                      consonance/hooks/dispatch-gate.js:29-36
      the two contradicting recoveries                     consonance/src-tauri/src/mcp.rs:163-180, :470
      chair_inject's refusal path                          main.rs:9485 (`chair_inject_refusal_line`),
                                                           :9489 (`chair_inject_exec`), :9256
                                                           (`chair_target_guard`), :9077 (`inject_to_pane`)

**A figure I could not reconcile, and I am not going to smooth it:** the plan's §"Why" cites **43 dispatches since
00:00, 26 forced**. The board carries **16** `chair_inject` acts in that window by the filter above. The two are
counting different things — mine is board rows whose text begins `chair injected`, and the librarian's is likely the
delivery ledger — **but I did not find the command that produces 43, so I am reporting mine with its filter and
naming the gap.** E is measuring delivery tonight and that number is E's to settle.

---

## 8 · THE FIXTURES — as tests on a copy, red first, none of them against the live checkout

**The fixture is a real git repo with a real origin**, built in a temp dir per test: `git init` a bare repo as
`origin`, `git clone` it, commit into the clone, push or do not push. Nothing in `C:/Consonance/lighthouse` is
touched — the same discipline as every mutant run I have filed, and for the same reason: a gate tested against the
live tree is a gate that will one day edit it.

     F1  happy path: row committed AND pushed, key off-repo, distinctive line absent      -> ALLOW
     F2  the text sniffs as a key task, no `seal` argument                                -> REFUSE (§3.3)
     F3  `seal` names a path that does not exist                                          -> REFUSE, names the path
     F4  the seal block is missing a field                                                -> REFUSE, names the field
     F5  `row-commit` does not resolve (`git cat-file -e` fails)                          -> REFUSE
     F6  the commit exists locally and was NEVER pushed            **T5's exact defect**  -> REFUSE
     F6b the commit is on a STALE remote-tracking ref (origin force-pushed past it)       -> REFUSE
         **F6b is the discriminating one:** it passes `git branch -r --contains` and fails `merge-base` after a
         fetch. A gate built from the packet's command as written goes GREEN here, which is why it is a fixture.
     F7  `row-sha256` does not match the file at that commit (A8's own case)              -> REFUSE
     F8  the distinctive line is in a TRACKED file              **T3's exact defect**     -> REFUSE, names file:line
     F9  the distinctive line is in an UNTRACKED working-tree file                        -> REFUSE
         F9 is why the check is two searches. `git grep` alone would go green on an uncommitted key sitting in the
         tree, which is readable by every seat and invisible to the tracked half.
    F10  the question's exact words appear in the checkout                                -> REFUSE
    F11  the key sits in the directory the object sits in        **T5's exposure**        -> REFUSE
    F12  basename(object) appears in `git ls-files`              **T5's diff**            -> REFUSE
    F13  `seal: "none: <reason>"`                                                         -> ALLOW **and** a board
         row carrying the reason. Assert the row exists: an override that is silent is not an override, it is a hole.
    F14  `seal: "none:"` with no reason                                                   -> REFUSE
    F15  an ordinary dispatch with no `seal` and no marker hit                            -> ALLOW, and **zero git
         subprocesses** (assert by a spy on the runner). The cost bar from §6.
    F16  G9: for every refusal above, the returned string and the board line do **not** contain the distinctive
         line, the question, or any matched content. One assertion, run over all of them.

    MUTANTS, on a copy, reported applied / caught / NOT APPLIED — the L061 rules apply to this harness too:
      M1  the refusal becomes a warning (return Ok, log only)                             -> F2, F6, F8 red
      M2  `merge-base --is-ancestor` reverts to `branch -r --contains`                    -> F6b red   <- the point
      M3  the untracked half of the grep is dropped                                       -> F9 red
      M4  the sniffer's marker set is emptied                                             -> F2 red
      M5  the refusal prints the matched line "for clarity"                               -> F16 red
      M6  the gate runs AFTER `gate_or_queue` instead of before                           -> a queued dispatch
          delivers later with no seal check; needs a fixture that queues, and I have not designed it — §9.

---

## 9 · WHAT THIS DOES NOT ESTABLISH, AND WHAT I DID NOT VERIFY

- **Nothing was built and nothing was run against `main.rs`.** No compile, no test. Every line number above was
  read tonight; none of the code was exercised.
- **The parser, the marker set and the refusal strings have never been run.** They are text in this file. The first
  build will find shapes I did not: in particular the seal block's grammar has no escaping rule for a
  `distinctive` line containing a newline or a colon, and that is a real hole I am naming rather than papering.
- **M6's fixture is not designed.** The interaction between the seal gate and `gate_or_queue` — a dispatch that is
  queued now and delivered when the pane goes idle — is the one path where "checked before delivery" could become
  "checked long before delivery", and a row could be force-pushed away in between. **Re-check at flush, or refuse to
  queue a keyed dispatch at all.** I lean to the second and have not thought it through.
- **The 15/1 sniffer figure is a lower bound on a 110-character preview.** The board stores a truncated preview, not
  the dispatch; the real measurement needs the full text, which lives only in the chair's own transcript. **A marker
  set measured on previews will underestimate both its hits and its false positives.**
- **I did not reconcile the plan's 43 dispatches with the board's 16** (§7).
- **S1–S5 are sentences and are not made true by this design.** T2 was sealed correctly and measured nothing.
- **I did not open other seats' work from tonight** — not E's delivery measurement, not C's address-table lap, not
  B's. If any of them touches `chair_inject`'s ordering, this design has to be re-read against theirs before a build.
- **The collision in §5.2 is unresolved and is not mine to resolve.** As the rules stand tonight, this gate refuses
  every keyed dispatch while the keeper is asleep.
