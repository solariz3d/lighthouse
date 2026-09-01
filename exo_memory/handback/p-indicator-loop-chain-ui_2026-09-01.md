# P-INDICATOR (L025) — the loop indicator in the UI

**Seat:** pane at `instances/sibling-07b8a48f`, chair-dispatched. **Non-author read: BRAVO, after me.**
**Objects:** `887d133` (CHARLIE's registration) and `consonance/tools/chain-status.js`.

**BUILT. THE REFUSAL WAS AVAILABLE AND IS NOT TAKEN — with a narrower one substituted in its place,
and one declared deviation from the registration that the chair and librarian should rule on rather
than let me settle alone.**

**NOT LIVE UNTIL THE REBUILD.** `frontendDist` is `../ui`, bundled at build time. Nothing below is
in the running app. Uncommitted; paths named at the end; nothing pushed.

---

## §0 — THE HEADLINE, BEFORE ANYTHING I BUILT

**The brief's load-bearing number is wrong, and it was corrected two days before the brief quoted
it.** The brief says *"32 uses of `additionalContext` against exactly ONE using `systemMessage`."*
CHARLIE's §1a — in the very file the brief routes as its object — had already retired that: *"32:1
compares occurrences to files."* Re-derived tonight, and it has moved again:

```
grep -ro "additionalContext" consonance/hooks/*.js | wc -l   ->  32   occurrences
grep -ro "systemMessage"     consonance/hooks/*.js | wc -l   ->  35   occurrences
grep -rl "additionalContext" consonance/hooks/*.js | wc -l   ->  11   files (of 23)
grep -rl "systemMessage"     consonance/hooks/*.js | wc -l   ->   2   files
grep -rn "systemMessage:" consonance/hooks/*.js | grep -v '\.test\.js'   ->  2 live emission sites
```

**"Exactly ONE" is false on every current unit** — 35 occurrences, 2 files. The growth is almost
entirely `dispatch-gate.test.js` (24 of the 35), which landed at `dd9f75a` after CHARLIE measured;
`dispatch-gate.js` itself went 3 → 4 with a new comment about its `print` mode.

**The substance is untouched, and that is the part worth keeping.** Live emissions are still exactly
two — `dispatch-gate.js:221` (fires only when the repo cannot be resolved) and `:259` (fires only on
an uncited dispatch), at CHARLIE's `:184`/`:212` re-numbered. **Both are still conditional. The
room's one working visible cue still never prints as status.** That is CHARLIE's §1b and it survives.

**So this is the carrier class again, and it is a NUMBER this time, not a path.** A figure was
corrected on 2026-08-30, in a registration written to be careful, and the corrected form did not
reach the brief that cited that registration two days later. Fifth-and-sixth instances tonight, and
the second one is smaller and worse: **the brief's object path is `visible_channel_registration_2026-09-01.md`
and the file is `visible_channel_registration_2026-08-30.md`.** A pointer that names the wrong date
resolves to nothing; I found the file by `git show --stat` on the sha.

---

## §1 — WHAT I DID NOT REFUSE, AND WHAT I REFUSED INSTEAD

The registered refusal was *"the loop's position cannot be read reliably enough to draw an arrow
from."* **I do not take it, and the reason is a distinction the brief did not make.**

`chain-status.js` is unreliable in the ways its own header documents, and it is unreliable *because
it collates `lap.jsonl` stage rows* — words a seat CHOSE TO WRITE, after the fact, about its own
state. The board's chair-audit rows are a different class: **receipts written by the control plane at
the instant the verb fired.** Reading `call_librarian E -> LIB [Received]` as *E handed back to LIB*
is reading a receipt, not re-deriving a claim. That is reliable enough for an arrow.

**What I refuse instead, narrowly: the arrow is never drawn from a reading that cannot be shown
current.** Three states carry no arrow at all — board unreadable, no hop in the ring, blind window
open. This is not decoration; see §3, where the most common of those three turns out to be the
state the app is in *every time it launches*.

---

## §2 — THE DEVIATION FROM THE REGISTRATION, DECLARED RATHER THAN SMUGGLED

**R2 registers the notice as exception-triggered. R11 names "acquires an always-on rendering so it
is easier to see" as the DEGENERATION MARKER. The chip I built has a quiet always-on state, so it
meets that marker.** I am not going to argue it doesn't; R11 predicted the argument, and making it
would be the move the section exists to catch.

Two things instead, neither of which I should settle alone:

1. **R11's own remedy is the right one and I am invoking it, not routing around it:** such a
   rendering *"should require a fresh registration with the ferry line's 233 as its declared
   baseline."* **This chip is therefore NOT instrument 1 and must NOT be scored against R4/R5.** It
   needs its own registration, written by a seat that is not me. Until that exists, the honest
   status is: built, tested, unregistered, unscoreable.
2. **The reason it is not exception-only is a law already on disk, not a convenience.** An
   instrument invisible until it fires cannot be told from a dead one. `chain-status.js`'s own
   header, on why `--why` exists: *"otherwise 'it printed nothing' and 'it crashed and was
   swallowed' look the same, which is the blindness this tool exists to end."* An exception-only UI
   element reproduces exactly that blindness in the UI. **The quiet state is the liveness proof; the
   escalation at CHARLIE's registered 15 minutes is the exception trigger.** One element, two
   saliences.

**Registered against myself, before any score exists — what marks THIS instrument degenerating:**
the 15-minute escalation, the two-salience design, or the poll cadence is changed after anyone has
seen a detection score; or it ships and no scorecard is ever produced.

---

## §3 — THE FINDING I DID NOT GO LOOKING FOR

**`get_board` does not return persisted history, and `term.js` said for months that it does.**

`consonance/ui/term.js:1081` (pre-edit) read: *"load the persisted board history into the stream (survives app
restarts)."* It does not survive app restarts. `main.rs` constructs the ring as
`VecDeque::new()`; the only three uses of `board_path()` are all
`OpenOptions::new().create(true).append(true)`; and **`main.rs:1401` says it outright in its own
words: *"board.jsonl is a write-only mirror, never reloaded."*** Two comments in one repo asserting
opposite things about the same mechanism.

The likely history: it was true when the board replayed each pane's whole transcript on relaunch
(the ~15 full re-reads recorded on 2026-08-15), and Cycle 3b persisted the tailer offsets precisely
to stop that replay — which silently made the comment false. **The change that broke it is the
change that fixed something else, and the comment was not carried with it.**

**Corrected as a comment, not as behaviour** (`term.js`, +19/-2). Making the ring survive restarts
means loading `board.jsonl` in `main.rs`, which is BRAVO's file this lap and a backend feature
nobody asked for.

**It is load-bearing for this chip, which is why it is here and not filed as trivia:** the ring is
EMPTY at every launch, so the very first thing the indicator must do is read an empty board as
*position unknown* and draw no arrow. **Immediately after the rebuild that ships it, the chip will
show "position unknown" — and that is correct, not broken.** It populates as the first hops fire.
Pinned by a test that goes red if anyone later rehydrates the ring, so the header stops being true
loudly instead of quietly.

---

## §4 — THE SPOOF, WHICH IS NOT HYPOTHETICAL

A pane that *writes* `call_librarian C -> LIB [Received]` in its own turn has that turn pushed to
the board as a pane row. A text-only scanner reads a pane's prose as a control-plane event — **and
panes discuss these exact strings constantly. This hand-back does it four times.**

Guarded: a hop is only read from a row whose `pane` field is literally `chair`, which is what
`chair_audit()` stamps (`fn chair_audit`) and what no pane turn can forge from inside its own
transcript. **Tested with a hostile fixture and a positive control** — the identical text on a chair
row must still be read, or the guard would pass by rejecting everything.

**Second cut, from the same class:** every SUCCESS audit line says `chair injected ` (space); every
failure and refusal says `chair_inject ` (underscore) — *"DELIVERY FAILED ... nothing reached the
pane."* `chair_inject_audit_line` exists because a write that never reached a pane once entered the
trail as an act. A chip that read those as hops would re-commit that error one layer up. `FAILED`,
`REFUSED` and `EXPIRED unexecuted` are all excluded, each with a test.

---

## §5 — WHAT IT SHOWS

The loop `user -> orch -> LIB -> orch -> panes -> LIB -> orch`, from three receipt shapes:

| audit row | hop | **arrow points at** |
|---|---|---|
| `chair injected (chair: M) -> ID [...]` | orch → pane | **that pane**, to hand back to LIB |
| `call_librarian L -> LIB [Received]` | pane → LIB | **LIB**, to ring the orchestrator |
| `call_chair -> Main [Received]` | LIB → orch | **orch**, to dispatch |

**The arrow is the next hop, never the last** — the brief's distinction, and it is the one thing
tested directly by name.

Five states. Only two carry an arrow: `quiet` (muted) and `waiting` (amber, at 15 min, with the
elapsed minutes). `unknown`, `unavailable` and `blind` carry none, and none of them may render a
position — *an old value read as a current one* is the
"stale-digest" failure (§7, on the path that names it) and the one `chain-status` has hit four
distinct ways in two days.

**Elapsed, not state, is the payload** — R2's requirement, from A4's static-state paradox: a stall is
the state NOT changing, so a payload of the state alone would be byte-identical on every emission and
habituate. The minutes grow; the growth is the signal.

**IT IS A SENSOR.** Same law as `chain-status.js` and `sourced-stop.js`: no verdicts. It never says
stalled, stuck, dead, hung or late, **and there is a test asserting no such word can reach the DOM in
any state.** The reason is `chain-status`'s own data refuting the axis: **L009 sat 3554s and the panes
DID work; L010 sat 3557s and the lap was dead.** Three seconds apart, opposite classes. Dwell is a
number for the keeper; the meaning is his.

**The 15 minutes is CHARLIE's registered value, carried and not re-invented** — asserted as a
constant in the test so a later tuning is a visible edit.

---

## §6 — WHY IT READS THE BOARD, WHICH IS A WEAKNESS AND IS SAID AS ONE

It would rather call `chain-status.js`, which collates two ledgers. **It cannot.** The WebView has no
filesystem and no shell: `tauri.conf.json` declares no fs and no shell plugin, the capability set is
`core:default` + dialog, and no Tauri command reads `lap.jsonl` or runs a tool. Adding one means
`main.rs`. So `get_board` is the only chain data reachable from `ui/`.

**This chip is a SECOND and WEAKER chain reader than the tool, and two readers of one undeclared
contract is a real hazard.** `main.rs` declares a format contract (search `is a CONTRACT with`) with `chain-status.js` and
with nothing else. Mitigation, since I cannot add myself to that contract from here: **the audit
formats are asserted against `main.rs`'s own source text**, so a rename there turns this file RED
instead of leaving the chip silently blank. Four such pins, including one on `chair_audit` still
stamping `pane:"chair"`, which the spoof guard depends on.

**It also polls** — 15s — because `chair_audit` pushes to the ring and emits no event. Cheap
(in-process, ≤300 rows), but it is a poll and not a subscription, and a hop is visible up to 15s
late.

---

## §7 — MY OWN INSTRUMENTS PRODUCED THREE FALSE REDS, ALL CAUGHT BEFORE FILING

Kept because a record of only surviving claims reads as though nothing was ever wrong:

1. **The `innerHTML` test went red on the COMMENT explaining why `innerHTML` is avoided.** A scanner
   red over a problem already fixed — the exact inverse CHARLIE flagged at his §4. Fixed by stripping
   comments before scanning, **plus a positive control proving the strip cannot quietly remove
   everything and read clean forever.** The explanation stays in the source; the test now asserts the
   write, which is the actual defect shape.
2. **The DOM harness counted promise ticks and reported "the chip rendered nothing" against working
   code.** Replaced with `setImmediate`, which lands after all microtasks and does not depend on the
   shape of the chain being tested.
3. **A wiring test asserted `chain-quiet` using a fixture stamped in the past**, so it rendered
   `chain-waiting` — correct behaviour, wrong fixture. `start()` reads the real clock while the pure
   tests inject one; the fixtures are now stamped relative to `Date.now()`.

**All three were my instrument, not the code.** Worth stating plainly given how much of tonight's
work is instruments catching things: they also generate false reds, and two of these three would
have been reported as defects if I had trusted the first red.

**AND A FOURTH, IN THIS FILE, CAUGHT ON THE LAST PASS — the night's own defect class, committed by
me.** Every `main.rs` line number in the first draft of this hand-back was **correct when I read it
and stale by the time I wrote it down.** `main.rs` is dirty under BRAVO this lap: `git diff --stat`
shows **+159/-5 while I worked**, so `.manage(Board(...))` moved 5988 → 6118, `fn chair_audit` 5594 →
5724, the contract comment 8049 → 8180. I also cited `term.js:1080` for a line at **1081**.

**Nothing was wrong with the reading; the pointer rotted between the read and the write, inside a
single session, in a document written to be careful.** All of them are now **string anchors instead
of line numbers** — here, and in `chain-indicator.js`'s and `term.js`'s comments, which had the same
numbers embedded in prose that will outlive them.

**The general form, offered for whoever is tracking the class: a line number into a file another seat
holds open is not a pointer, it is a guess with a timestamp.** The test file was already immune
without my planning it — it asserts against `main.rs`'s *source strings*, so BRAVO's 159 lines moved
nothing it depends on. That was luck in origin and is worth making a rule.

**AND A FIFTH, WHICH IS THE CLEANEST INSTANCE OF THE CLASS TONIGHT, BECAUSE I PROPAGATED IT.**
CHARLIE's R2 grounds the staleness rule with: *"Per `memory/stale-digest-is-not-a-deliverable.md`:
an old value reads as fresh completion."* **That file does not exist.**

```
ls memory/                                        ->  (empty)
git log --all --diff-filter=A -- "*stale-digest*" ->  (empty; never tracked)
```

**I copied that path into my source comment and into this hand-back without opening it**, which is
the carrier failure performed rather than described — and I only caught it because I was auditing my
*own* citations at the end, not because I doubted the one I inherited. **A path arriving inside a
registration that survived attack is exactly the kind a reader stops checking.**

**The lesson is real; only the pointer is a phantom.** It is on disk under other names —
`exo_memory/muscle_map.md` (*"the stale-digest misread"*, in the keeper-caught ledger) and
`exo_memory/librarian/2026-08-30.md` (*"the ferry and stale-digest lessons"*, in the passage
proposing this very indicator). Both of my references now cite those. **R2's citation should be
corrected at its source by someone who is not me** — I have not touched CHARLIE's file.

---

## §8 — THE NUMBERS, EACH WITH ITS COMMAND

```
node consonance/ui/chain-indicator.test.js     ->  31 passed, 0 failed
node consonance/ui/scripts-load.test.js        ->   4 passed, 0 failed
node consonance/ui/librarian-wiring.test.js    ->  11 passed, 0 failed
node consonance/ui/third-place-wiring.test.js  ->  10 passed, 0 failed
node consonance/tools/js-suite.js              ->  68 green · 1 failed · 0 crashed · 0 silent
                                                   · 0 canary · 0 not-run  (of 69)
```

**The single red is `consonance/tools/actors.evidence.test.js`, and it is not mine.** Verified rather
than assumed: it contains no reference to any file I touched, and it **fails identically with all
three of my `ui/` edits stashed** (`git stash push` on the three, re-run, exit 1, `stash pop`). The
handoff already recorded it as the user's own.

**`scripts-load.test.js` now parses my new file in the shared global scope** — the 2026-08-15
redeclaration guard covers `chain-indicator.js` automatically, because it reads the `<script src>`
list out of `index.html` rather than a roster. It passes.

**MUTATION-PROVEN, 8 of 8 caught** — the tests were made to fail on purpose before being trusted:

| mutation | result |
|---|---|
| remove the spoof guard (`pane !== 'chair'`) | 1 red |
| relax the dispatch regex to also match `chair_inject` | 2 red |
| move the escalation from 15m to 30m | 1 red |
| draw an arrow in the `unknown` state | 2 red |
| ignore the blind window | 1 red |
| `render()` writes no text | 3 red |
| register no polling interval | 1 red |
| swallow the invoke error, leaving a stale value | 1 red |

**One of those was itself a correction:** the `chair_inject` mutation was first attempted with `sed`,
which errored on an unescaped paren and did not apply. **The run printed `exit 0` — a non-result that
reads exactly like a surviving mutation.** Re-done with an anchored node replacement that fails loudly
(`ANCHOR NOT FOUND`, exit 9) if the anchor is missing. Both `-> 2 red`. Reported because an
un-applied mutation reporting green is the same false-green class the suite exists to catch, and I
nearly filed it.

---

## §9 — WHAT THIS DOES NOT ESTABLISH

- **Not live.** Bundled at build time; nothing here is in the running app. **This lap's one rebuild
  is what ships it.** No claim about the running app can be made from this file.
- **Never rendered in WebView2.** The wiring is exercised against a fake DOM under node. **No
  browser has drawn this chip.** That is the precise gap that made 2026-08-15 a blank window with
  every instrument green, and I have narrowed it (`start()`, the invoke path, the reject path, the
  DOM write and the styling are all exercised) without closing it. **The CSS in particular is
  unproven** — no test can tell me `--amber` on `--panel2` is legible at 11px in that WebView. The
  first look is the keeper's.
- **No stall was detected by it.** The baseline is five keeper-caught stalls; **this chip has caught
  zero, because it has never run.** Nothing here supports CHARLIE's R1 in either direction.
- **The falsifier stands unrun, carried verbatim:** *"if stalls are still noticed by silence after a
  visible chain line ships, visibility is not the lever."* It belongs to instrument 1, which this is
  not (§2).
- **`lap.jsonl` is not read.** `chain-status`'s unwitnessed-work-leg rule — the axis that actually
  separates a dead lap from a healthy one — is invisible here. **This chip shows position and dwell.
  It cannot tell a dead lap from a working one, and does not try.**
- **Eviction, at least, cannot mislead it**, and this is the one degraded case I can rule out rather
  than merely flag: the ring evicts from the FRONT, so every dropped row is older than the newest
  hop. Eviction can erase the last hop entirely (→ `unknown`); it can never leave a stale one
  standing while a fresher one exists.

**R9's open question — whether `systemMessage`-class visibility means the same thing in a pane as in
Main — I have NOT answered, and I want to be exact about that: this chip makes it irrelevant to
itself rather than settling it.** The chip lives in the app's own chrome. It is not a hook, not in
any seat's context, and **no pane's model can see it at all.**

Two consequences, and the second is a genuine advantage worth someone else's scrutiny:
- R9's *payload-carries-no-ask* mitigation is satisfied trivially — there is no payload in anyone's
  context to carry an ask.
- **R9's confound does not apply.** The registration notes that the visible channel is emitted
  *through the seat's own turn*, so visibility and focality are confounded at every hook moment.
  **The UI channel is not emitted through anyone's turn**, which makes it the one visible channel in
  the room that is *not* confounded with a seat's own composition. If that holds up under someone
  else's reading, it is an argument for registering the UI channel as its own line rather than as a
  variant of the hook one — but it is my argument about my own build, which is exactly the thing a
  seat should not score for itself.

---

## §10 — PATHS, FOR THE COMMIT (not mine to make)

```
NEW       consonance/ui/chain-indicator.js          298 lines
NEW       consonance/ui/chain-indicator.test.js     334 lines
MODIFIED  consonance/ui/index.html                  +7    chip markup + script tag (LAST, after term.js)
MODIFIED  consonance/ui/app.css                     +18   five states, two saliences
MODIFIED  consonance/ui/term.js                     +19/-2  the false-persistence comment, corrected
```

`main.rs` NOT touched (BRAVO's this lap) — it is read-only in every reference above. `git add -A` is
not to be used; these five paths are the whole change. **Written by the P-INDICATOR pane at
`instances/sibling-07b8a48f`** — for the commit body, per the 2026-08-26 amendment.

**Script order is load-bearing and is tested:** `chain-indicator.js` loads AFTER `term.js`, because
it reads `term.js`'s `paneLetters` and **`typeof` on a `let` still in its temporal dead zone THROWS
rather than returning `"undefined"`** — the guard in that file only holds once `term.js` has actually
executed.
