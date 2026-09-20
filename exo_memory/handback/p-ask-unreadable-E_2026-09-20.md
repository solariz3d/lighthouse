# P-ASK-UNREADABLE — a heading the tool cannot read now says so (pane E, D091, on D)

Packet: the chair's D091 dispatch; evidence at `exo_memory/librarian/2026-09-16.md` (f8b6e50). Started 09:48:35,
filed 10:00 (`date +%T` at both ends). Machine D. **Nothing committed.** Files touched, all three mine this lap:
`consonance/tools/ask.js`, `consonance/tools/ask.test.js`, `exo_memory/ask.md` (ASK-006's Source line only).

## 0 · Registered BEFORE the build — the null, the falsifier, and the can-it-vary check

**THE NULL:** after the repair, every `### ASK-` heading in the shipped store parses, the new unreadable counter
never fires on it, and the store reads 0 unreadable — the same number it printed while it was wrong.

**THE FALSIFIER, in the words that would make it true:** a heading that does not parse is still absorbed into the
block above it, or still prints as `0 unreadable`. Either means the guard has no input and reads exactly like a
guard finding nothing — the defect one level up.

**CAN THE QUANTITY TAKE MORE THAN ONE VALUE ON THIS OBJECT? Checked before writing any code, and the answer for the
SHIPPED STORE ALONE IS NO.** On `exo_memory/ask.md` the unreadable count is 0 before the repair and 0 after: before,
because the swallowed heading produced no entry; after, because the widened heading parses. **So the shipped store
cannot distinguish a working guard from an inert one** — which is exactly how this defect hid behind a confident
"0 unreadable", and exactly the L063 trap. The new counter is therefore pinned on FIXTURES that contain a heading no
widening can rescue (`### ASK-009 — no asked-date at all`), where the quantity does take both values: 0 on the
shipped store, 1 on the fixture. Mutants #2 and #3 exist to prove that pin is load-bearing.

## 1 · The fact, re-derived before touching anything

    node -e '<HEAD_RE over exo_memory/ask.md>'
      ### ASK- headings: 14 · MATCH: 12 · MISS: 2
        :40   ### ASK-00N — <goal>, asked YYYY-MM-DD          (the template — inside a ``` fence)
        :132  ### ASK-009 — the Third Place board rows (SIX, not eleven — corrected 2026-08-30), asked 2026-08-29

    node consonance/tools/ask.js | head -3        BEFORE
      ASK — 12 open · 0 cleared · 0 unreadable · store exo_memory\ASK.md
      ASK-008 listed OPEN, carrying ASK-009's question ("The rows are your conversation — remove, keep, or redact?")
      and ASK-009's source verbatim; ASK-009 printed zero times.

All three symptoms reproduce, and the store says `**Status:** [ANSWERED 2026-08-30 …]` on ASK-008 at `ask.md:128`.

## 2 · The repair — two halves, because widening alone leaves the class open

    ask.js  HEAD_RE title group   `([^,]+)` → `(.+)`, with the date still anchored at `$`
                                  greedy, so the LAST ", asked <date>" wins; commas, em-dashes and brackets now ride
    ask.js  ASK_HEAD_RE (new)     `^###\s+(ASK-\S*)` — a line that MEANT to be an ASK heading
    ask.js  the rule (new)        such a line that does not parse: push() the block above FIRST (so its fields stop
                                  collecting — the absorption), then record it as UNREADABLE with its id and the
                                  line quoted. This is what `ask.js:47` already claimed the tool did.
    ask.js  FENCE_RE (new)        ```fenced``` lines are documentation and are skipped entirely

**Why the fence rather than an exemption for `ASK-00N`:** the template must stay harmless, and it was harmless
before only by luck — `ASK-\d+` rejects `00N`. Under the new rule it starts with `### ASK-`, so without the fence it
would begin reading as an unreadable ask. The fence says WHY it is exempt: an example is not a store entry. Mutants
#4 and #5 are the two ways to break that and both die.

    node consonance/tools/ask.js | head -1        AFTER
      ASK — 12 open · 1 cleared · 0 unreadable · store exo_memory\ASK.md
      ASK-009   22d  the Third Place board rows (SIX, not eleven — corrected 2026-08-30)

**The count is the same 12 and its MEMBERSHIP changed**, which is the whole shape of this defect — measured by
running the pre-repair parser and the new one over the same store in one process:

    OLD open (12): ASK-001 002 003 004 005 006 007 ASK-008 010 011 012 013
    NEW open (12): ASK-001 002 003 004 005 006 007 ASK-009 010 011 012 013
    left: ASK-008 (it is ANSWERED in the store) · joined: ASK-009 (it was invisible)

## 3 · Red first

    node consonance/tools/ask.test.js       BEFORE the repair   23 pass · 3 fail
      ✖ D091 · a comma in the title does not break the heading
      ✖ D091 · an unparsable heading is UNREADABLE and does not inherit the block above it
      ✖ D091 · on the shipped store, ASK-009 parses OPEN and ASK-008 keeps its own ANSWERED status
    node consonance/tools/ask.test.js       AFTER                27 pass · 0 fail

The fourth new test — the fenced template — passed both before and after, and I say so rather than counting it as
red-first: before, because `ASK-\d+` never matched `ASK-00N`; after, because the fence rule skips it. It is a guard
test, and mutants #4/#5 are what make it load-bearing.

**The suite, four ways** (`sed`-stripped of ANSI; the summary line is `ℹ pass N`):

    node consonance/tools/ask.test.js                                          27 / 27 / 0   exit 0
    node --test consonance/tools/ask.test.js                                   27 / 27 / 0   exit 0
    node --test --test-concurrency=4 consonance/tools/ask.test.js              27 / 27 / 0   exit 0
    node --test --test-name-pattern D091 consonance/tools/ask.test.js           5 /  5 / 0   exit 0

**The whole JS suite, because `ask.js` has a caller** (`node consonance/tools/js-suite.js`):

    js-suite: 101 green · 7 failed · 0 crashed · 0 silent · 1 canary · 0 sang · 0 not-run · 0 class-error  (of 109)
    consonance\tools\ask.test.js   ok

The seven failures are `actors.evidence`, `carrier-drift`, `forget-rate`, `gen-consumer`,
`gen-consumer.fixture-scope`, `portable-paths` and `dev/shell/hooks/userprompt_pulse`; none of them reads the ask
store or the parser. **I did NOT re-derive a pre-change baseline on this machine**, so "the same reds as before" is
not a claim I can make — the night plan's `95 green · 6 failed … of 102` was measured on L, a different machine and
a different file count. What I can say is that `ask.test.js` is green and no failing file imports `ask.js`.
(`actors.evidence.test.js` is red because of ASK-009's own subject — the board rows the keeper has not ruled on.)

## 4 · Mutants — the tracked harness, on a copy

    node consonance/tools/mutant-harness.js scratchpad/askmut/rows.js
    (score adapter scratchpad/askmut/score.js: copies the LIVE test into the HEAD worktree, pins ASK_STORE to the
     live store, and prints the harness's cargo-shaped line from node:test's real counts — both harness limits are
     the ones measured in handback/p-harness-audit-E_2026-09-20.md)

    pre-flight (unmutated copy): green 27/0 · live consonance/tools/ask.js unchanged: true

    killed  #1  the title group goes back to [^,]+ — THE ORIGINAL DEFECT
    killed  #2  an unparsable heading is ignored again (the guard never fires)
    killed  #3  the unparsable heading does not close the block above it (absorption returns)
    killed  #4  the fence is not tracked, so the documented template reads as an unreadable ask
    killed  #5  fenced lines are parsed anyway
    killed  #6  the unreadable row loses the id it could have carried
    killed  #7  the heading rule catches ANY ### heading, not only ASK ones
    killed  #8  the reason stops saying it was the heading

    8 listed · 8 killed · 0 survived · 0 no result · 0 NOT APPLIED

**#8 SURVIVED the first run, and the reason is mine.** My assertion was `/heading/i` on the unreadable reason — and
my own fixture's heading read `### ASK-009 — a heading with no asked-date at all`, so the quoted line satisfied the
assertion by itself whatever the label said. Fixed in both directions: the fixture no longer contains the word, and
the assertion is pinned to the label (`/^unparsable heading: /`) plus a quote of the line. **Second night running
that a mutant found an assertion satisfied by text the mutant never touched** — last night it was a second mention
of `--shuffles` inside a reason string. The class: *an assertion that can be satisfied by the fixture's own wording
is not testing the code.*

No control row: the harness refuses the whole RUN on a missing anchor rather than marking one row NOT APPLIED
(measured at L061), so a deliberate never-matching row cannot ride along. Its gates did fire here — all 8 rows
passed shape, dirty-source and anchor checks before the run.

## 5 · ASK-006's referent — RECOVERED, one line, into the Source

The ask says "add the `CLAUDE_OVERSEER_RUN` guard those two hooks are missing" and never names them. **They are
named nine lines above the cited line, in the same log:**

    ~/.claude/shell/duration/drift-watch/system-cron.log:1437-1439
      :1438  hooks/session-start.js:14 guards only on CONSONANCE_DREAM; :221 emits "## L3 — arc-perceptions surfaced"
      :1439  hooks/userprompt-submit.js has no guard at all; :168 emits "## L3 — arc-perception, new since last turn"

**Re-checked on disk today**, because a 26-day-old log line is a claim about a file:

    grep -c CLAUDE_OVERSEER_RUN ~/.claude/shell/hooks/session-start.js      0    (CONSONANCE_DREAM: 1, at :14)
    grep -c CLAUDE_OVERSEER_RUN ~/.claude/shell/hooks/userprompt-submit.js  0    (no guard of any kind)
    grep -n arc-perception …/session-start.js …/userprompt-submit.js        :228 and :168

Both still lack it. The L3 emitter in `session-start.js` has drifted from the log's `:221` to `:228`; the other is
exactly where the log said. I added that to ASK-006's **Source** line — provenance, not the question, so the goal's
verbatim words are untouched — naming both hooks, both line numbers, the re-check date, and the negative result the
librarian established (it is NOT `l2-overseer.js`/`l3-overseer.js`, which read the guard at `:109`/`:120`).

**I did not touch either hook.** They are user-level files outside this lap's ownership, and the ask exists because
the change is the keeper's call: it changes what the overseers see, and 18 consecutive `quiet_spiral` verdicts sit
downstream of it.

## 6 · NOT verified

- **The unreadable counter has never fired on the real store**, by construction (§0). Its evidence is fixtures plus
  mutants #2/#3. If a future store grows a heading that truly cannot parse, this is the first time the new path runs
  in anger.
- **`ask-surface.js` is the caller and it has NO test file.** It does not `require` the parser — it spawns the tool
  (`ask-surface.js:36`, `const TOOL = …/tools/ask.js`) and reads its output — so the js-suite never exercises the new
  parse through it. I read four lines of it to establish that and no more. If its contract depends on the header's
  wording, or on ASK-008 sitting in the open list, this lap moved that and nothing here would have caught it.
- **I did not test a fence that never closes.** An unterminated ``` would swallow the rest of the store as
  documentation and the tool would report it as an empty queue rather than as unreadable — a hole of the same shape
  as the one this lap closed, one level down. Named rather than fixed, because the store has no such fence today.
- **Nothing was installed and nothing rebuilt.** `ask.js` is read by whatever calls it from the repo; there is no
  install step in this lap.
- **ASK-006's recovery is a provenance claim, not a fix**, and I did not verify the log's causal claim that the 18
  `quiet_spiral` verdicts are downstream of the missing guard.
- **The store edit touches one line of one ask.** I did not audit the other twelve for the same
  referent-lives-elsewhere defect; ASK-006 is the one the chair named.
