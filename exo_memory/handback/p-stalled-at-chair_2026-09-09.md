# P-STALLED-AT-CHAIR — the timer is refused, and the event was already on the board

**SEAT: pane BRAVO. LAP: L050. WRITTEN 2026-09-09, 01:35–02:5x local.** Packet:
`exo_memory/loop/packet_stalled_at_chair_2026-09-09.md` (1b4287c). Nothing committed, nothing staged.

    node consonance/tools/chain-status.js                     the line
    node --test consonance/tools/chain-status.test.js         79 pass, 0 fail (66 before)
    node consonance/tools/js-suite.js                         80 green · 5 failed · 1 canary (of 86)

---

## 1 · THE RULING: THE TIMER IS REFUSED, AND THE REFUSAL IS A MEASUREMENT OF TONIGHT

§3c asked whether idle can be told from working, and said that if the answer is no, that is the
finding. **The answer is no, and tonight is the proof — not an argument from principle.**

**What actually happened, re-derived from the ledger and the board rather than from the account:**

    06:54:16  L049 return leg opens, holder chair        (lap.jsonl)
    06:55:50  the chair rings A for three items E's landing depends on
    06:56:06  THE CHAIR'S LAST ROW of the leg
    06:59:51  the ring is DELIVERED to A — A is working
    07:12:39  call_librarian REFUSED OUT OF TURN — mount A tried to speak while NO open lap
              is held by panes; open laps are held by ["chair"]        <- A's hand-back BOUNCED
    07:25:47  the KEEPER carries A's items in through the librarian
    07:27:54  L049 filed

**The chair's own pane wrote nothing between 06:56:06 and 07:25:47 — 29m41s.** So the chair was
idle by the only signal that exists. And the proposed detector would still have been wrong twice
over:

1. **It fires at 07:06:06 on a correct state.** From 06:56 to 07:12 the chair was waiting for a
   pane it had just rung and that had just been delivered to. Nothing was wrong. That is **six
   minutes of alarm before the fault existed**, on the very night the detector was built for.
2. **It never names the fault.** The fault is not in the chair. At 07:12:39 A's hand-back bounced,
   and **no `call_librarian A -> LIB` row ever follows** — scanned to the end of the board. A's
   follow-up was never delivered by the edge at all; it reached the chair because **the keeper
   carried it**. The packet's complaint ("the keeper had to be the detector") is exact, and its
   cause sits one hop from where the packet put it: not a chair that stopped, **a channel that
   bounced a hand-back and told nobody.**

**And the axis was already refuted twice in this same file, by measurement, before I got here:**
the work-leg clause found durations *three seconds apart with opposite classes* (L009 healthy 3554s,
L010 dead 3557s); the collation clause found that *"a pane inside one long silent tool call is idle
and still working."* A third clause on the axis the first two refuted would make one instrument
disagree with itself, and both halves would be printing.

**So: no timer, no threshold, no `STALLED-AT-CHAIR` label.** The packet's §3a asked where 10
minutes comes from. It comes from nowhere, and I did not pick a better number, because the room's
standing answer — reached twice in this file from opposite directions — is that **the axis is an
event, not a duration.**

---

## 2 · WHAT WAS BUILT INSTEAD

**CLAUSE 3 — UNDELIVERED.**

    A mount is UNDELIVERED while its newest delivery REFUSAL since the anchor is newer than its
    newest successful delivery.

Opened by an app-written row and closed by an app-written row, exactly like the collation claim it
sits beside, and with the same asymmetry running the same safe way: the refusal is written by the
control plane and a seat cannot suppress its own, while the clear is a delivery the app also
writes. A missing row on either side makes it **stay silent** rather than fire wrongly. Anchored to
the previous `filed` row, so it is self-limiting — an old bounce cannot print forever, which is how
an alarm stops being read. **There is no threshold in it to tune, and none to get wrong.**

**It rides EVERY holder, and that is the one place it departs from its neighbour.** The collation
claim is gated to `holder panes`; a bounced hand-back is a fault under any holder, and tonight's
bounce happened under `holder chair` — **which is precisely why the existing board scan never ran.**
The collation segments stay gated, so a `holder chair` line gains clause 3 and nothing else; there
is a test asserting exactly that.

**THE DIRTY COUNT, ATTRIBUTED FOR THE ONE CLASS THAT CAN BE.** This file already states that
`dirty N repo-wide` cannot attribute those files to the holder, and that stands. But one subset can
be named without inferring anything: **an untracked file in `exo_memory/handback/` is a hand-back
written and not landed** — the same third state as `ON-DISK-NOT-COMMITTED` (L047): neither done nor
never-started. Tonight there were two of them for the whole 31 minutes (`p-state-set_2026-09-09.md`
and `p-live-host_2026-09-09.md`, both landed at 07:26:47 UTC) while the line said `dirty 21
repo-wide`, which is 21 files a reader cannot act on. It costs one filter over the
`git status --porcelain` that was already being run — **one git call, not two**, because this runs
from the pulse on every prompt in every seat.

**§3b — what the line says.** No verdict, no advice, no accusation. This file is a sensor and the
seat reading it decides what it means:

    chain: L949 RETURN-LEG · holder chair · dirty 21 repo-wide (2 hand-backs uncommitted:
    p-live-host_2026-09-09.md, p-state-set_2026-09-09.md) · 29m · UNDELIVERED A (refused 15m ago)

It names **who** bounced and **when**, and separately names **what is sitting**. A hand-back
uncommitted one minute after it is filed is normal and this says nothing about whether that is
late — the reader has the fact and makes the call.

---

## 3 · THE BARS, AND THE TWO I DID NOT MEET AS WRITTEN

**RED FIRST — met, in the shape the ruling allows.** The fixture reproduces tonight (RETURN-LEG,
holder chair, the 07:12:39 refusal row in its own words, two untracked hand-backs) and the line
carries `UNDELIVERED A (refused 15m ago)` plus the named hand-backs. Its pair is the red half: **the
same leg, the same 29 minutes, no bounce → no verdict at all**, which is the state a 10-minute timer
would have fired on tonight. Removing the clause fails 4 tests (M1 below), which is the before/after
the bar asked for.

**NOT MET AS WRITTEN:** the bar said the fixture must print `STALLED-AT-CHAIR` after the change. It
does not, and will not — see §1. **Both required mutants are also about a conjunction I did not
build:** there is no dirty-tree condition to drop and no leg-duration to fire on. Their intent is
carried by M2 and M3.

**MUTANTS — seven, all killed, source byte-identical after the run** (tap reporter; the spec
reporter prints two lines per failure and doubles the count):

    M1  the clause is removed entirely  (the red-first proof)          4 failing   KILLED
    M2  the dirty count claims EVERY untracked file as a hand-back     1 failing   KILLED
    M3  clause 3 gated to one holder, like its neighbour               3 failing   KILLED
    M4  a bounce is never cleared by a later delivery                  1 failing   KILLED
    M5  the anchor is dropped: an old bounce prints forever            1 failing   KILLED
    M6  an unresolved refusal is dropped instead of counted            1 failing   KILLED
    M7  an unreadable tree still lists hand-backs                      1 failing   KILLED

**js-suite: 80 green · 5 failed · 0 crashed · 0 silent · 1 canary (of 86).** The universe grew from
83 to 86 files while I worked — three other panes are landing test files in this checkout right now
— so the count is not a clean before/after of anything.

    portable-paths.test.js    C's residue on replay-check.js, rung to C separately. NOT MINE, as
                              the packet says; C's addendum is already filed.
    forget-rate.test.js       the standing false red — a deliberate deletion reported as
                              "1 files left the reading path (161,665 bytes)".
    gen-consumer ×2           key assertions on main.rs LINE NUMBERS, and main.rs is modified
                              uncommitted in this tree by a live pane. Same as L048; unproven,
                              because proving it means touching a file another seat holds.
    state-block.test.js       NEW, and worth someone's lap: "live block is 3000 chars, over the
                              3000 cap". NOT chain-status — `grep -c chain` in state-block.js is 0
                              and the rendered block carries no `chain:` line. It reads SOURCE.md,
                              git and the head-watch ledger, all of which grew tonight. The test is
                              doing its job; the cap is genuinely breached.

**THE PULSE CARRY NEEDS NOTHING, and I checked rather than assuming.** `userprompt_pulse.py:317-331`
runs the reader and takes `splitlines()[0]` whole; clause 3 stays on that line. The hook is
untouched. **Its `timeout=3` is the real constraint and it is measured:** the whole reader runs in
**152–166 ms**, of which the board scan is **25 ms** (10 ms tail read, 15 ms parse of 7,671 lines).
Clause 3 adds that 25 ms to turns where the holder is not `panes`. **0.8% of the pulse budget** —
and worth saying plainly because a hook that times out drops the entire chain line silently.

---

## 4 · CAUGHT IN MY OWN WORK

1. **My first baseline comparison was an artifact and I nearly filed it as a regression.** I ran
   HEAD's `chain-status.js` from a scratchpad directory to compare lines, and it printed
   `collation UNKNOWN — blind window (blind.js unavailable)` where mine printed a normal line. The
   difference was not my change: `require('../hooks/blind.js')` cannot resolve from a temp dir, and
   the blind gate **fails closed**, so copying the tool somewhere else silently mutes it. **A
   baseline run outside the tree is not a baseline.** The real check is the 66 pre-existing tests,
   which pass unchanged.
2. **Two patches written through a shell heredoc landed with real control characters in them** —
   `\r?\n` arrived as an actual newline inside a regex literal, which node caught as
   `Invalid regular expression`. Same class as the two NUL bytes I wrote into `essay-provenance.js`
   last lap and did not learn enough from: **backslashes do not survive the way I write them into a
   heredoc.** Every patch after that was written as a file and run, and the file is scanned for NULs
   after each one (0).
3. **One existing test's rendered line changed and I am naming it rather than letting it pass
   quietly.** `THE NEW ROUTE — a REFUSED call is not a hand-back` uses the *other* refusal shape
   (`no address row`, not `out of turn`). `REFUSED_RE` matches both, deliberately — an
   address-table refusal is also work that could not be delivered — so that fixture's line now also
   carries `UNDELIVERED A`. Its assertion is on the collation segment and is unaffected, and the new
   segment is correct for that fixture: A tried and bounced.

---

## 5 · WHAT I DID NOT VERIFY

- **Whether the chair was reading or stopped between 06:56 and 07:12.** I can measure that its pane
  wrote no rows. I cannot see a tool call in flight from here, and that is the whole of §3c's
  answer: **there is no signal for it, so I built nothing that claims one.**
- **That the two gen-consumer failures are the concurrent `main.rs` edit.** Reasoned, not proven;
  the isolating run needs a file another seat holds.
- **`main.rs`'s refusal wording as a contract.** `REFUSED_RE` is written against the rows on the
  live board (two shapes, both matched). If E's `mcp.rs` work or a later `main.rs` change reworded
  those refusals, this clause goes **silent**, not wrong — the safe direction, and still a hole. **A
  test in `mcp.rs`'s own suite naming this reader would close it**, the way the `call_librarian`
  audit row is already a stated contract; that is E's file, not mine, and I did not touch it.
- **A refusal that is never written.** A delivery that fails without a row is invisible here. This
  reads bounces, not silences.
- **The desktop.** Ledger and board are machine-local; `this machine only` still rides the line.
- **Any cross-machine or multi-lap replay of clause 3.** `--replay` covers the collation claim only;
  I did not extend it.

---

## 6 · WHAT THIS DOES NOT ESTABLISH

**It does not give the chair a watcher.** It gives the *channel* one. A chair that receives every
hand-back cleanly and then stops for an hour is still invisible, and after this lap it is still
invisible **on purpose**: the only available signal for it is the duration axis this file has now
refuted three times.

**The honest coverage claim, stated the way the collation clause was made to state its own:** of the
two things that went wrong tonight, clause 3 sees **one** — the bounce, from 07:12:39, which is the
first moment anything was observably wrong. It would not have saved the sixteen minutes before that,
because nothing was wrong in them. **It would have saved the thirteen minutes between the bounce and
the keeper noticing**, and it would have named A.

---

## 7 · FILES

    consonance/tools/chain-status.js        clause 3, tree(), and the dated header record of the
                                            refusal with tonight's measurements in it
    consonance/tools/chain-status.test.js   +13 tests (66 -> 79)
    exo_memory/handback/p-stalled-at-chair_2026-09-09.md   this file
    exo_memory/map/B.md                     one dated entry

**Nothing committed. Nothing staged.** `main.rs` (C) and `mcp.rs` (E) untouched; the pulse hook
untouched.

    OBJECTIVE  the seat with no second party watching it gets one.
    FALSIFIER  a chair stall longer than the threshold that this prints no verdict for — or a
               verdict printed over a chair that was working.

**The objective is met sideways and the falsifier's first half is unmet by construction, so I am
registering the replacement rather than claiming the original.** There is no threshold, so the
falsifier as written cannot be evaluated. **Its replacement, registered before the next lap:** *a
hand-back that fails to reach its destination and is not printed by this line — or a mount named
UNDELIVERED whose work had in fact arrived.* Both are checkable against the board by anyone.

---

## ADDENDUM — the uncolumned ledger, and which reds I am counting (chair's line, 01:56)

**§A · CLOSED. `exo_memory/provenance_corrections.jsonl` is now `STAYS_PRIVATE` in
`gen-consumer.js`, with the reason written out.** Both gen-consumer suites are green:

    node --test consonance/tools/gen-consumer.test.js                59 pass, 0 fail
    node --test consonance/tools/gen-consumer.fixture-scope.test.js   7 pass, 0 fail

The reason, in the register the `review` entry uses — what the thing IS, not that it is private —
and it withholds for **two independent reasons**, so the entry survives one of them becoming wrong:

1. it names this room's seats (`chair`, `librarian`) beside the commits they landed, which is this
   committee's internal attribution and no part of the method;
2. **it is inert elsewhere by construction.** Every row is verified against a blob frozen at a sha
   in *this* tree. A consumer's history contains none of those shas, so `essay-provenance` would
   refuse all four as `NO-SUCH-COMMIT`. Shipping it ships claims nobody can check and nobody needs.
   **The mechanism ships with the tool; this room's corrections do not.**

**§B · WHAT IS WORTH NOTICING, and the chair named it before I did.** The ledger I built last lap to
make the attribution record right **was itself unclassified from the moment it landed**, and the
manifest guard — A's bar, a path in no column refuses the build — caught it on the newest file in
the repo, one lap later. C §4 measured that gap at 17 files and 276,112 bytes. It is not that the
guard is new and the file slipped in ahead of it: the guard was there, the file landed after it, and
**nobody classified on landing.** The instrument works. The habit does not exist. Worth one line in
the packet template rather than a lap: *a new top-level `exo_memory/` entry is columned in the same
turn it is created.*

**§C · THE REDS, SAID PLAINLY, since §3 of this hand-back listed five and the chair's run reads four.**

    gen-consumer.test.js               MINE. Closed by §A above.
    gen-consumer.fixture-scope.test.js MINE. Same cause, same fix, closed.
    portable-paths.test.js             NOT MINE — E's live-host fixtures, rung to E. C's
                                       replay-check residue that §3 attributed it to is CLOSED and
                                       landed at 4b72293, so §3's attribution of this file is
                                       superseded by the chair's: same suite, different cause.
    forget-rate.test.js                NOT MINE — the standing false red, a deliberate deletion
                                       reported as loss.
    state-block.test.js                NOT MINE, and NOT IN THE CHAIR'S FOUR. It is still red at
                                       this desk right now ("live block is 3000 chars, over the
                                       3000 cap"), so I am neither counting it nor withdrawing it.
                                       It reads live git state, and the CLI form of the block
                                       measures 2,801 chars against the test's 3,000 — so the two
                                       are measuring different objects, or one of them moves with
                                       the tree. `grep -c chain` in `state-block.js` is 0 and the
                                       rendered block carries no `chain:` line, so it is not this
                                       lap either way. **Routing it, not owning it.**

**So: two of the reds were mine and both are closed. Two are named to their seats. One is a live red
nobody has claimed, and I am not going to let it read as either mine or fixed.**

**§D · CLAUSE 3 FIRED ON LIVE DATA WITHIN MINUTES OF LANDING, and it was a true positive.** The
01:56 pulse carried `UNDELIVERED C (refused 4m ago)` alongside `dirty 13 repo-wide (3 hand-backs
uncommitted: …)`, and C's own line that turn reads *"the `call_librarian` ring was refused."* That
is the exact shape of tonight's 07:12:39 bounce, caught by the instrument at the moment it happened
instead of thirteen minutes later by a human. **One live true positive is not a false-positive rate**
— the thing this clause could still do wrong is fire over a bounce whose work did arrive, and that
has not been observed yet because nothing has been running long enough to observe it.
