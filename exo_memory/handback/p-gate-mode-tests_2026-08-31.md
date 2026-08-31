# P-GATE-MODE-TESTS — the gate's tests made mode-aware (2026-08-31 ~06:20, BRAVO, L022)

**Seat:** pane B (BRAVO). **Files owned and touched:** `consonance/hooks/dispatch-gate.test.js`
(rewritten in place; every pre-existing test kept, four made mode-aware, eight added) and
`consonance/tools/dispatch-gate-report.js` (NEW — item 5's `--report`). **`dispatch-gate.js` untouched**,
and the suite's last test asserts its sha256 is identical at exit to what was loaded. Nothing committed.
**Non-author read:** ECHO, after L1 lands, per the brief.

**Bias, declared.** The print-no-ask cell is my own separating-test design; I have a stake in the
natural experiment being scoreable. That stake is what §1 below is about, and it cuts against the
comfortable reading.

---

## 0 · Verdict, four sentences

**Green: 31 of 31, twice, 9.1 s** (`node --test consonance/hooks/dispatch-gate.test.js`). **Seven contract
mutants applied, seven caught, zero NOT APPLIED** (items 1, 2a, 2b, 3, 4, 5, 6 — the librarian's item 2
names two mutations, so six items are seven mutants), each applied to a temp COPY and probed with the
same predicate the contract test asserts; the source hash is checked at the end. **Two findings about
`7d40480`, reported not patched:** the two channels already differ by exactly one prefix (item 1's literal
third equality cannot hold), and the gate exposes no flip (item 4 as stated cannot be met from the test
side). **And one finding about the live machine that outranks all of it: the installed hook is
`f8b64e8` from Aug 24 — `7d40480` has never run live, the keeper is still being clicked, and the
natural experiment has zero rows.**

---

## 1 · THE LIVE HOOK IS STALE — read this before scoring anything

    cmp ~/.claude/shell/dispatch-gate.js <(git show f8b64e8:consonance/hooks/dispatch-gate.js) && echo IDENTICAL
    grep -c GATE_MODE ~/.claude/shell/dispatch-gate.js        -> 0
    ls -la ~/.claude/shell/dispatch-gate.js                   -> 10943 bytes, Aug 24 05:32
    grep -n dispatch-gate ~/.claude/settings.json             -> :86  node.exe  C:\Users\zackn\.claude\shell\dispatch-gate.js

`settings.json` runs the COPY under `~/.claude/shell/`, and that copy is byte-identical to the repo at
`f8b64e8` (2026-08-24). It predates `62a07cf` (the L018 join keys and leak closure) as well as `7d40480`.
So:

- **The keeper's click was not removed.** The live gate still returns `permissionDecision:'ask'`. The
  commit message's *"the click stops reaching the keeper"* describes the repo, not the machine.
- **The natural experiment has not started.** The live ledger has **179 rows, 0 with a `mode` field**
  (`node -e` over `C:/Consonance/data/dispatch-gate.jsonl`). Three of them were written AFTER the switch
  instant (11:40:04Z) and carry no mode — the new report prints them as `UNSTAMPED after the switch: 3`
  rather than folding them into either period.
- **Fix is the installer, not code:** `dev/shell/install.ps1` (its manifest at `:120` copies
  `consonance\hooks\dispatch-gate.js` → `dispatch-gate.js`). Same class as 08-17: *landed is not shipped,
  now for hooks as well as code.* Not mine to run — it changes the keeper's machine.

**Consequence for the registered falsifier.** Until the install runs, every row is `ask` and the comparison
`print vs 90.4%` has an empty right-hand side. The report says so in its own output (`print 0 cited of 0
gated = NOT REPORTABLE`). Nothing about the lever is scoreable yet, in either direction.

---

## 2 · The contract, clause by clause — source re-derived, brief checked against it

| # | librarian's clause | source (`dispatch-gate.js`) | test | mutant | result |
|---|---|---|---|---|---|
| 1 | question byte-identical across modes; print sysMsg == ask sysMsg == ask question | `:254` sysMsg = `'UNCITED DISPATCH — ' + question`; `:261` reason = `question` | CONTRACT 1: print sysMsg === ask sysMsg === `'UNCITED DISPATCH — ' + buildQuestion(verb,false)`; ask reason === `buildQuestion`; **and** sysMsg === prefix + reason | print-only one-char softening (`'uNCITED'` under print) | caught. **Literal third equality REFUSED — see §3.1** |
| 2 | print: sysMsg present, decision ABSENT; ask: both | `:254–264` — `hookSpecificOutput` set only inside `if (GATE_MODE === 'ask')` | CONTRACT 2: print has no `hookSpecificOutput` key and the string `permissionDecision` appears nowhere; ask has `PreToolUse` + `'ask'` | 2a: `permissionDecision:'allow'` under print; 2b: sysMsg dropped | both caught |
| 3 | row's `mode` reports what was EMITTED | `:243–249` stamps `mode: GATE_MODE` at both record sites | CONTRACT 3: `row.mode === emittedMode(stdout)` where `emittedMode` reads ONLY the hook's output; cited rows stamped too | asked-row stamps literal `'ask'` under print | caught |
| 4 | mode read from ONE place; both values exercised by flipping, never by editing source | `:120` one const; **no env read, no export** | CONTRACT 4: exactly one declaration; no literal `mode:` at a record site; no literal compare at the emit site; the two arms emit different shapes | `if ('print' === 'ask')` at the emit site | caught. **Flip mechanism REFUSED as unmet — see §3.2** |
| 5 | `--report` splits by mode, refuses pooled; pre-switch rows are ask by construction | **no `--report` exists in the hook**; its only cited-rate is the POOLED line in `--quarantine`'s dry run (`:400–403`) | CONTRACT 5 on the NEW tool: pure `splitByMode` on a 10-row fixture (3 pre-switch → ask by construction, 1 stamped ask, 4 stamped print, 1 unstamped-after-switch, 1 inert); no `pooled`/`all`/`total` key; `render` prints the refusal line and no pooled rate; CLI exit 0; `--pooled` exit 1 | refusal line replaced by a pooled rate | caught. **Note §3.3: the hook's own pooled line still prints** |
| 6 | `[interrupt]` exempt in both modes | `:131,:144` — checked before any mode logic | CONTRACT 6: both arms → empty stdout, row `allowed`/`interrupt` | exemption stripped under print | caught |

Every mutant is a `find` string asserted to occur exactly once in the source; a `find` that misses is
counted NOT APPLIED and fails the test — none did. Every probe is asserted `false` on the unmutated source
first, so a catch means the mutation was seen and not that the probe is broken.

---

## 3 · Findings about `7d40480`, reported and left

### 3.1 Item 1's literal form does not hold, and did not before the switch

`systemMessage` carries the prefix `'UNCITED DISPATCH — '`; `permissionDecisionReason` does not
(`:254` vs `:261`). Same in `f8b64e8` (`git show f8b64e8:consonance/hooks/dispatch-gate.js | sed -n '212p;216p'`).
So *print sysMsg == ask sysMsg* holds and is asserted byte-for-byte; *== ask's question* does not. The
test pins the divergence as **exactly a prefix** (`sysMsg === 'UNCITED DISPATCH — ' + reason`) so a second
divergence goes red. This is the refusal the brief named as valid: a finding about the chair's code, not
patched around. Whether the prefix should go is the chair's call; I lean keep — it labels the channel that
survives bypass, which is the one a reader sees without the harness's framing.

### 3.2 Item 4 cannot be met from the test side: there is nothing to flip

`GATE_MODE` is a bare const, not exported, no env read. The suite **probes `CONSONANCE_GATE_MODE` first**
and would run both arms on the source if the gate honoured it; it does not, so the ask arm runs a
**derived copy** — the source with the one word substituted, in a temp dir, the substitution asserted to
apply exactly once. The suite prints which path it took on every run:

    GATE MODE ARMS: flip via derived-copy  <- FINDING (contract item 4): the gate exposes no env override and no export ...

The one-line change that would satisfy item 4 as written, for the chair to make or decline:

    const GATE_MODE = (process.env.CONSONANCE_GATE_MODE === 'ask' ? 'ask' : 'print');

The tests need no edit if that lands — the probe flips to `env` automatically. **A derived copy is not
"editing the source between runs"** (the source is never written; its hash is asserted), but it is also
not a test of a flip mechanism, because there isn't one. Stated rather than smoothed.

### 3.3 The pooled figure still prints — in the chair's file

`node consonance/hooks/dispatch-gate.js --quarantine` (dry run) prints `156 cited of 179 gated = 87.2%`
across both periods. That line is `:400–403` of the object under test and I did not touch it. Item 5 is
satisfied by the new tool; the old pooled line remains available to anyone who runs the quarantine dry run.
The chair may want it to defer to the report, or to be labelled pooled.

### 3.4 Small ones

- `GATE_MODE_SINCE = '2026-08-31'` (`:121`) is a bare date and is not exported. A date is too coarse: rows
  written that morning before 05:40 local were asked, and were. The report uses the commit instant
  (`git log -1 --format=%cI 7d40480` → `2026-08-31T05:40:04-06:00`), and buckets by **field presence
  first, instant second** — so no row is ever backfilled, and a post-switch row with no field is surfaced
  as a stale-hook fact instead of being silently called ask.
- The hook's comment block at `:284–290` ("one run of the suite emits exactly these four rows") describes
  the pre-08-30 suite. The classifier still quarantines that historical quadruple correctly (tests 24–27,
  mutants 4/4), and the leak-proof test still shows the rows reappear when the fix line is deleted
  (test 28). The comment is now a description of history, which is fine, but it is the chair's comment.

---

## 4 · The report, run live tonight

    node consonance/tools/dispatch-gate-report.js
    dispatch-gate cited-rate BY MODE   (switch: 2026-08-31T11:40:04Z = 7d40480)
      ask   155 cited of 176 gated = 88.1%   (asked 19, [interrupt] 2)   incl. 176 pre-switch rows with no mode field — ask by construction, not backfilled
      print 0 cited of 0 gated = NOT REPORTABLE — no rows   (asked 0, [interrupt] 0)
      UNSTAMPED after the switch: 3 row(s) with no mode field written after 2026-08-31T11:40:04Z — an installed hook older than 7d40480 wrote them. Counted in NEITHER mode. Run dev/shell/install.ps1 -Check.
      pooled figure: REFUSED — two periods are not one population (L017).
      rows 179   test-run rows excluded 0

    node consonance/tools/dispatch-gate-report.js --pooled   -> exit 1

**88.1% is not 90.4%, and that is not a correction of CHARLIE's figure.** CHARLIE's 123/136 was the ledger
at ~07:11Z with row 137 onward excluded; tonight's 176 gated is the full pre-switch period through 11:40Z.
Different window, same definition (cited = sha|path, gated = allowed|asked, interrupt rows uncited). Re-run
the command; do not quote either number without its window.

---

## 5 · What the suite does NOT establish

- Nothing about the live hook's behaviour — it runs the repo file and derived copies of it. §1 is why that
  distinction is not academic tonight.
- Nothing about bypass mode: whether `permissionDecision:'ask'` actually stops the verb under the keeper's
  settings is the harness's behaviour, measured on 08-24, not re-measured here.
- The repo-wide runner (`node consonance/tools/js-suite.js`) shows one red, `tools/actors.evidence.test.js`
  ("the real board resolves with nothing left over — under the REAL letters map") — **pre-existing, on
  the live-edge list before this packet, zero references to either of my files.** Not mine, not touched.
- Whether the prefix in §3.1 should stay. Reported, not decided.

## 6 · Reproduction

    cd C:/Consonance/lighthouse
    node --test consonance/hooks/dispatch-gate.test.js            # 31 pass, prints the ARMS line and both MUTATION tallies
    node consonance/tools/dispatch-gate-report.js                 # live split; --pooled refuses
    cmp ~/.claude/shell/dispatch-gate.js <(git show f8b64e8:consonance/hooks/dispatch-gate.js) && echo STALE-INSTALL-CONFIRMED
    git status --short consonance/                                # M dispatch-gate.test.js, ?? tools/dispatch-gate-report.js, nothing else

*Own falsifier:* if ECHO finds a contract clause whose mutant is caught by a probe that would also fire on
some CORRECT implementation (a probe measuring the mutation's shape rather than the clause's meaning), that
mutant is decoration and the clause is unproven; strike the "seven caught" and name the clause.

*A trace to re-run, not a doctrine to believe.*

---

## Appended 2026-08-31 ~06:50 (L022 P-GATE-TESTS-FIX, BRAVO) — my §3.2 prediction was false, and the failure was the one this file warns about

**What I claimed:** §3.2, *"the tests need no edit if that lands — the probe flips to `env` automatically."*
**What happened:** the chair landed the one-liner verbatim (`d00050e`); `GATE_MODE_DECL` at `:86` pinned the
BARE-CONST shape, so `armsFor` threw at module load and the suite reported **`pass 0 / fail 1` — a file that
failed to load, not a red.** ECHO found it; the librarian re-derived it; I reproduced it before touching
anything (`node --test --test-reporter=tap …` → `AssertionError … at armsFor (dispatch-gate.test.js:103)`, `# pass 0`).
**The sentence was a prediction with no check behind it.** The disk-side proxy the room names — *did a check
precede the claim?* — no. I had the env form in my own hand-back and never ran the suite against it.

**The fix, in my file only:**
1. `GATE_MODE_DECL` now matches the declaration LINE in either shape (`/^const GATE_MODE = [^\n]*;/m`);
   `gateModeDefault()` takes the default as the LAST `'print'|'ask'` on that line (the value in the bare
   form, the fallback in the env form) and returns an error object instead of throwing.
2. Arm construction is wrapped: a failure is captured, printed on the `GATE MODE ARMS` line as `SETUP FAILED: …`,
   and asserted by a new FIRST test — **`SETUP — both gate-mode arms were constructed`** — so a shape this
   suite cannot read is a red with a message, never a load failure. `fire()` names the same cause if any
   later test reaches it without arms. (The chair asked whether this was scope creep: no — it is the
   assertion the episode argues for, ten lines, and it changes no other test's meaning.)

**Verified, all three from commands rather than from ECHO's scratch copy:**

    node --test consonance/hooks/dispatch-gate.test.js                      # HEAD d00050e
      GATE MODE ARMS: flip via env · MUTATION (contract): 7/7 · pass 32 / fail 0
    # test copy pointed at `git show 7d40480:consonance/hooks/dispatch-gate.js` (bare const)
      GATE MODE ARMS: flip via derived-copy · 7/7 · pass 32 / fail 0        # the fallback still works
    # test copy pointed at a gate whose line reads `const GATE_MODE = modeFromSomewhereElse();`
      GATE MODE ARMS: flip via NOT BUILT <- SETUP FAILED: the GATE_MODE line names neither 'print' nor 'ask'
      not ok 1 - SETUP — both gate-mode arms were constructed …            # loads; red; says why

32 not 31 because SETUP is a new test. `dispatch-gate.js` still untouched by me (the `M` on it is the chair's
parallel pooled-line edit). Not committed.

*Correction to my own record:* §3.2's "no edit needed" is struck by this append. The env read was the right
change and I do not ask for it back; the test's assumption about the declaration's shape was mine and too narrow.
