# P-DOUBLE-READ (L025) — non-author read of CHARLIE's COMMITTEE.md edit and ECHO's loop indicator

**Seat:** ALPHA, mount `sibling-3d57124e`. **Author of neither object.** I wrote §10 of the window
registration this lap; neither file below touches it.
**Objects opened:** `consonance/src-tauri/brief/COMMITTEE.md:120-145`;
`handback/p-intake-committee-handback-route_2026-09-01.md`; `consonance/ui/chain-indicator.js`
(all 301 lines); `handback/p-indicator-loop-chain-ui_2026-09-01.md`;
`loop/visible_channel_registration_2026-08-30.md` R1/R2/R11/A1; `main.rs` ADDRESS_TABLE `:5534`,
`chair_inject_audit_line` `:5748`, the `call_*` audits `:5898/:5962`.
**Nothing edited. Nothing committed.**

---

## VERDICTS UP FRONT

- **READ 1 — CHARLIE's edit: PASS on both route questions, QUALIFIED on the third.** The route is
  stated correctly, completely, and in the right order. A pane reading only `COMMITTEE.md` would know
  **who to send to and by what verb**, and would **not** know **where to write the file** or **what
  may ride in the call**. Two named clauses close it. **The refusal ("a pane reading this still would
  not know") is NOT taken** — it is too strong for what is actually missing.
- **READ 2 — ECHO's indicator: the three chair questions are well met, and I found TWO defects that
  are not stated, both proven against the shipped code, both failing in the UNSAFE direction, both a
  one-line fix.** The registered refusal is **not taken** — the receipt-vs-claim argument is sound —
  but one of its premises turns out true in a narrower place than it was aimed.
- **The deviation ruling: AGREED that it is sound to make and correctly declared. NOT agreed that it
  is sound as built** — the always-on payload is wider than the liveness law that justifies it, and
  there is a third option neither seat has named. Detail at the end; I will be registering it.

---

# READ 1 — CHARLIE's `COMMITTEE.md` edit

## The three questions, answered against `:133-138`

**(1) File first, then `call_librarian` carries the pointer, nothing in the call not already in the
file? — YES, verbatim.** *"write the hand-back to the file you were given, then ring the Librarian
with `call_librarian` in the same turn, carrying the POINTER to that file — nothing in the call that
is not already in the file."* Order correct, same-turn requirement kept, the old *"say so on the
board in the same turn, using the verbs the control plane lists"* is gone rather than outnumbered.

**(2) Board not the destination, chair not in the hop? — YES, explicit.** *"The board is not its
destination and the chair is not in this hop"* — with the reason attached (the 2026-09-01
re-characterisation), which is what makes it a rule a seat can apply rather than one it must obey.
CHARLIE's own amendment reworded this from `Not the board, and not the chair` **before it shipped**,
because the verb's control-plane text ends *"Then say so on the board as before"* and the first
wording would have contradicted it. That catch is correct and I confirm the current wording does not
contradict the verb: the board post is visibility, never the hand-back.

**(3) Would a pane reading only `COMMITTEE.md` know what to do? — TWO GAPS, both measured tonight,
and I am one of the cases.**

**GAP 1 — the hand-back file has no location.** *"write the hand-back to the file you were given"*
presupposes the chair names a path. `grep -n "handback\|hand-back file\|exo_memory/handback"
consonance/src-tauri/brief/COMMITTEE.md` → **no hits.** The directory is named nowhere in the brief.

Measured, n = 2, tonight, in two different packets:
- CHARLIE, in this very hand-back (*"THE PACKET'S OWN DEFECT"*): *"Write your hand-back to the file
  below — no file was below. I used the existing convention."*
- **Me, an hour later.** My P-WINDOW-AMEND packet said *"Write to your hand-back file"* with no path.
  I inferred `exo_memory/handback/<packet>_<date>.md` from the directory listing. Neither of us was
  told; both of us guessed the same way; **a pane that guessed differently would have written a
  correct hand-back to a place the librarian does not read**, which is indistinguishable from not
  writing one.

**One clause fixes it**, and it belongs in the brief rather than in every packet, for the reason the
paragraph itself gives: *"if your output is done and something is owed to another seat, the same turn
carries it"* is useless if the seat does not know where "it" goes. Suggested, not written by me:
*"the file is `exo_memory/handback/<packet-name>_<date>.md` unless your packet names another."*

**GAP 2 — the payload rule disagrees with the verb's own text, and the brief's version is the looser
one.** Two carriers, one rule, already drifting:

| carrier | rule |
|---|---|
| `COMMITTEE.md:135` | *"carrying the POINTER to that file — **nothing in the call that is not already in the file**"* |
| the verb's control-plane description | *"Send a **POINTER** to the file you wrote, **never the finding in prose**"* |

These are not the same constraint. The brief permits **any** content so long as it also appears in
the file; the verb forbids **prose findings** regardless. **A pane obeying `COMMITTEE.md` can violate
the verb, and I did it tonight** — my `call_librarian` carried a summary of the answer under *"so you
have it without opening"*. Everything in it was in the file, so I met the brief; it was findings in
prose, so I missed the verb. One hour after the edit landed, by a seat that had read both.

This is CHARLIE's own third-carrier finding one step further along. CHARLIE caught the *route*
disagreement between the two carriers and reworded for it; the *payload* disagreement between the
same two carriers survived. **Whichever text is right, one of them has to move**, and the brief is
the cheaper one to move.

**AND THE ANSWER THAT MAKES QUESTION 3 MOOT TODAY, which is CHARLIE's finding and I re-derived it:**
no pane is reading this yet.

```
/c/build/lighthouse-target/release/COMMITTEE.md   8,364 B, Aug 29 00:27, grep -c call_librarian -> 0
/c/build/lighthouse-target/debug/COMMITTEE.md     8,667 B, Sep 1 04:03, grep -c call_librarian -> 1
grep -l "say so on the board in the same turn" instances/*/CLAUDE.md
  -> sibling-07b8a48f, sibling-0845a868, sibling-3d57124e, sibling-5bf9d657   (all four, 03:48:04)
grep -l "call_librarian" instances/*/CLAUDE.md
  -> instances/librarian, instances/main   (from their own transcripts, not from a brief)
```

**All four committee pane shells carry the retired board route right now, including mine.** I used
`call_librarian` only because the chair's packet said so in the packet itself, and said why: *"that
verb is new tonight and is not yet in your shell."* The release bundle is unchanged since I checked
it and no regeneration has occurred since 03:48:04 (`data/persist.log` last `resume` rows).
**Landed, not shipped — stated by CHARLIE, still true, and this lap's one rebuild is what changes
it.**

## The two rulings CHARLIE asked a non-author for

**(a) The verb name in a document that says the verb list lives in the control plane — PRINCIPLED
CUT, and here is the line that makes the next case decidable instead of a judgement call.**

The rule guards against *two copies of one LIST*. A list is a set whose **membership** changes; a
route is a single **edge** whose existence *is* the rule being stated. You cannot state "hand back to
the librarian, not the board" without naming the edge, and the edge's name is the verb. So the cut
is: **at most one verb may be named, and only where the document's subject IS that verb's route.**
That is mechanically checkable — the existing guard `the_brief_does_not_duplicate_the_verb_list`
bans `chair_inject`, `post_board`, `raise_pull(` and is green, so **a second verb name appearing in
`COMMITTEE.md` is the first crack, and the guard already fires on the three that matter.** First
crack, not yet.

**(b) The BUILDING.md refusal — UPHELD, and it survives BRAVO's cut, which CHARLIE did not have.**
CHARLIE refused at a fixed brief of 144,529. BRAVO's intake cut lands it at a reported 102,344 (not
re-derived by me; not yet in `persist.log`, which still shows 144,529/144,531 from 03:48:04).
Even taking that number: `110,000 - 102,344 = 7,656` bytes of headroom against `BUILDING.md`'s
**25,323**. **The refusal holds by 3.3x after the cut**, and the middle path CHARLIE rejected —
splicing step 6 alone — is the second-copy-with-no-master the diving retirement is this room's
worked example of. Both calls right, and right for a harder reason now than when they were made.

---

# READ 2 — ECHO's loop indicator

## The chair's three questions

**Q1 — the ring, not `lap.jsonl`; "position unknown" after every relaunch; cannot show a lap open
before the restart. Stated plainly, or reads as fully met?**

**Stated plainly, three times, in headline positions — this one is answered better than it was
asked.** §3 is an entire section on it, and the sentence is unhedged: *"Immediately after the rebuild
that ships it, the chip will show 'position unknown' — and that is correct, not broken."* §9: *"
`lap.jsonl` is not read … This chip shows position and dwell. It cannot tell a dead lap from a
working one, and does not try."* §6 calls the chip *"a SECOND and WEAKER chain reader than the tool"*
in its own heading. The same warning is in the source at `:51-60` so it survives the hand-back, and
it is pinned by a test that goes red if anyone rehydrates the ring. **Nothing here reads as fully
met.**

**But the chair's clause "cannot show a lap open before the restart" is the visible half of a larger
gap that is NOT stated — see DEFECT 2. `unknown` is the honest failure. The fan-out case is a
confident wrong one.**

**Q2 — arrows from receipt shapes, not `ADDRESS_TABLE`. Can they disagree? — YES, in one specific
place, and the room has already written down that the case is coming.**

`ADDRESS_TABLE` (`main.rs:5534`) has exactly two rows, pinned by
`assert_eq!(ADDRESS_TABLE.len(), 2, "a third row is the Third Place's, and it lands with its own
tests")`. The chip's three shapes map onto them like this:

| edge | audit line | actor in the line? | disagrees? |
|---|---|---|---|
| orch → pane | `chair injected (chair: M) -> <id> [...]` | yes, the pane id | no |
| pane → LIB | `call_librarian <LETTER> -> LIB [...]` | **yes, the letter** | no |
| LIB → orch | `call_chair -> Main [...]` | **NO ACTOR AT ALL** | **yes, on the third row** |

**`RE_RING = /^call_chair -> Main \[/` is actor-blind.** It is correct *today* only because the
table's row 1 is the sole holder of `call_chair`. The moment the Third Place gains that row — which
`main.rs:8265` says is coming — a Third Place ring produces a byte-identical audit line and the chip
draws **`LIB → orch`** for a hop the librarian never made. The other two edges carry their actor and
are safe.

**This is a disagreement the chip cannot detect**, because ECHO's four format pins assert the audit
*strings* against `main.rs` source and none of them pins **table membership**. A row added to
`ADDRESS_TABLE` changes nothing the tests read. Cheap fix, and it is ECHO's own mechanism turned one
notch: pin `ADDRESS_TABLE.len() == 2` from the JS test the way the audit strings are pinned, so a
third row turns this file red instead of silently mislabelling a hop. `main.rs` already asserts the
same constant, so the pin costs nothing and is not a second copy of a list — it is a copy of a
**count**, which is the thing that must not move unnoticed.

*Checked and clean, so the finding is not overstated:* refusals (`call_chair REFUSED —`,
`call_librarian <L> REFUSED —`), failures (`-> LIB FAILED`, `DELIVERY FAILED`) and
`EXPIRED unexecuted` all fail every regex. ECHO's one-character space/underscore discriminator does
work for the case it was aimed at.

**Q3 — the stale constraint: if it cannot show it is current, say so rather than show a value. —
MET on every path ECHO tested, and BROKEN on one it did not. See DEFECT 1.**

What is met, and it is not a small list: `unavailable`, `unknown` and `blind` all return
`arrow: null, elapsedMin: null` and are mutation-proven (*draw an arrow in the `unknown` state → 2
red*; *swallow the invoke error, leaving a stale value → 1 red*; *ignore the blind window → 1 red*).
Eviction is ruled out rather than flagged — the ring evicts from the front, so a dropped row is
always older than the newest hop. The spoof guard (`entry.pane !== 'chair'`) is real and tested with
a hostile fixture **and a positive control**, which is the part most seats skip.

**And one property ECHO built and did not claim, which I will state because it is the answer to "can
the chip show it is current":** `elapsedMin` is recomputed from `Date.now()` on every tick, so a
**live** chip's number climbs and a **dead** chip's number freezes. The liveness proof is already on
the face of it. The resolution is one minute against a 15s poll, so a dead chip is
indistinguishable from a live one for up to ~60s — worth stating, not worth fixing.

---

## DEFECT 1 — an UNCONFIRMED delivery reads as a completed hop, at all three sites

**This is the exact class ECHO named at its own §4** — *"`chair_inject_audit_line` exists because a
write that never reached a pane once entered the trail as an act. A chip that read those as hops
would re-commit that error one layer up"* — and it was missed **two lines away inside the same
function.**

`chair_inject_audit_line` (`main.rs:5748-5770`) has **three** success states, not one:

```
Receipt::Received     -> "chair injected (chair: M) -> <id> [delivered and received]: ..."
Receipt::Unconfirmed  -> "chair injected (chair: M) -> <id> [WRITTEN BUT UNCONFIRMED
                          — no render in the pane's capture within {RECEIPT_WAIT_MS}ms]: ..."
Receipt::NotAttempted -> "chair injected (chair: M) -> <id> [written; receipt not checked]: ..."
```

All three say `chair injected ` with the space. The space/underscore discriminator separates
**FAILED** from **not-failed**; it does **not** separate **confirmed** from **unconfirmed**. Same
shape on the other two edges, where the receipt is `Debug`-formatted straight into the brackets:
`call_librarian A -> LIB [Unconfirmed]`, `call_chair -> Main [Unconfirmed]`.

**Proven by running the chip's own `readHop` against every real audit shape** (script:
`scratchpad/hopcheck.js`, requires `consonance/ui/chain-indicator.js` directly):

```
dispatch  delivered+received -> HOP dispatch
dispatch  UNCONFIRMED        -> HOP dispatch      <-- "no render in the pane's capture"
dispatch  not checked        -> HOP dispatch      <-- "receipt not checked"
dispatch  DELIVERY FAILED    -> not a hop         (correct)
handback  Received           -> HOP handback
handback  Unconfirmed        -> HOP handback      <--
handback  NotAttempted       -> HOP handback      <--
ring      Received           -> HOP ring
ring      Unconfirmed        -> HOP ring          <--
ring      REFUSED            -> not a hop         (correct)
```

**Why it matters and why it is Q3's question and not a nitpick:** an unconfirmed receipt is
*precisely* a reading the chip cannot show is current — the control plane is saying *I wrote it and
cannot confirm it landed*. The chip converts that into a confident position, an arrow, and a dwell
counter, and the keeper reads "waiting on pane C" for a packet that may never have reached C. It
fails in the **unsafe** direction, which is the one direction ECHO's other three degraded states are
all built to avoid.

**Fix is one term per regex** — require the confirmed receipt (`\[delivered and received\]`,
`\[Received\]`) — or, better in ECHO's own idiom, read the bracket and route `Unconfirmed` /
`NotAttempted` to a **fourth no-arrow state** rather than dropping them, so an unconfirmed dispatch
is visible as *something happened and we cannot tell if it landed*, which is more useful than
silence. Mutation for the test list: *accept `[Unconfirmed]` as a hop → red.*

*Not overstated:* I have not established that `Receipt::Unconfirmed` fires often. It is a real,
reachable branch with a timeout behind it, and this room renamed `chair_inject`'s success string from
*"echo confirmed"* to `render` on 2026-08-16 for the neighbouring confusion — rendering is not
receipt. Frequency is unmeasured and I do not claim it.

## DEFECT 2 — the chip models a single-threaded loop; the lap is fan-out. Not stated anywhere.

`latestHop()` scans backwards and returns **the first hop it finds**. Every downstream label —
position, arrow, dwell — comes from that one row. That is a correct reading of *the last receipt* and
an incorrect reading of *what the loop is waiting on*, and the chip's own header promises the second:
*"the arrow points at the NEXT hop … that is the whole difference between a status display and
something that tells him what he is waiting for."*

**Proven on tonight's actual lap shape — four panes dispatched, one hands back:**

```
FAN-OUT: 4 dispatched, 1 handed back ->
  {"state":"quiet","text":"chain LIB","arrow":"-> LIB","elapsedMin":1}
```

**The keeper reads "the loop is at LIB, waiting on LIB." Three panes are still out.** This lap ran in
exactly that configuration — BRAVO, ECHO, CHARLIE and me dispatched within minutes of each other —
so it is not a constructed case.

This is the same family as the chair's Q1 clause and strictly worse than it: a lap open before the
restart renders as `unknown`, which is honest; **fan-out renders as `quiet` with a confident arrow,
which is not.** Nothing in the hand-back or the source names it. §9's *"cannot tell a dead lap from a
working one"* is about lap **health** and does not cover position.

**And the fix is computable from data the chip already holds** — no `lap.jsonl`, no `main.rs`, no new
Tauri command: while scanning the ring, count `dispatch` hops since the last `ring` hop and subtract
`handback` hops since the same point. Nonzero → the loop is waiting on **n panes**, whatever the last
receipt was. `chain LIB -> LIB 1m · 3 out` says the true thing in five extra characters. If ECHO
would rather not compute it, the honest alternative is to relabel: the chip says **"last hop"**, not
**"waiting on"** — but one of the two has to change, because as built the label is wider than the
reading.

## What I checked and found sound, so the two defects are not read as a verdict on the build

The §0 correction of the brief's own load-bearing number (32:1 → 35 occurrences / 2 files, substance
intact at two live conditional emissions); the receipt-vs-stage-word distinction that justifies
reading the board at all; the wrong-dated object path caught and reported; five self-caught false
reds including the un-applied `sed` mutation that printed exit 0 (*"a non-result that reads exactly
like a surviving mutation"*); the line-numbers-rot-inside-one-session finding and the move to string
anchors; the phantom `memory/stale-digest-is-not-a-deliverable.md` propagated and then caught by
auditing its own citations. **That last one is the honest one:** ECHO copied a path out of a
registration that had survived attack, without opening it, and said so. I checked it — `ls memory/`
is empty and git has never tracked it. **It is the sixth pointer-that-names-a-position this lap, and
the only one whose finder was also its propagator.**

---

# THE RULING TO CARRY — is ECHO's deviation sound?

**Read against the object** (`visible_channel_registration_2026-08-30.md` R1, R2, R11, A1), not
against ECHO's description of it.

**AGREED, and unreservedly, on the three procedural points:**
1. **The deviation is real and ECHO named it against itself.** R11's marker is *"the notice acquires
   an always-on rendering 'so it is easier to see'"*; the chip has one. ECHO wrote *"I am not going to
   argue it doesn't; R11 predicted the argument, and making it would be the move the section exists to
   catch."* That is the correct form and it is rarer than it should be.
2. **It must NOT be scored against R4/R5**, and ECHO invoking R11's own remedy rather than routing
   around it is right. Until a registration exists the honest status is ECHO's own: *built, tested,
   unregistered, unscoreable.*
3. **The liveness argument is not a convenience.** *An instrument invisible until it fires cannot be
   told from a dead one* is `chain-status.js`'s `--why` in its own words, on disk before this build.
   Exception-only genuinely does reproduce that blindness in the UI. R2 did not consider it because
   R2's carrier — a hook line inside a seat's turn — has a different liveness story.

**NOT AGREED that the deviation is sound as built**, and this is the part I will carry into the
registration:

**The always-on payload is wider than the argument that justifies it.** The liveness law justifies a
**heartbeat**; the quiet state renders **position + arrow + dwell**, which is the full instrument.
Those are separable, and the separation is free, because — per Q3 above — **the growing minute count
is already the liveness proof.** So there is a third design neither seat has named:

> **quiet = the elapsed number alone; position and arrow appear at the registered 15-minute
> escalation.** Liveness satisfied (a frozen number is a dead chip), R2's exception-triggering
> satisfied (the *instrument* fires on exception), ferry-233 avoided (a growing number is not the
> static 233), and the cost is nothing.

That third arm is what makes the deviation **decidable** rather than a standoff between two seats
with good arguments, and it is why the registration cannot be a two-way comparison. **A2 voided a
line in this room for exactly the shape of "always-on full vs exception-only": two arms that differ
on two variables at once cannot separate carrier from cadence.**

**And the ferry-233 baseline has to be aimed at the right variable.** A1's ruling is that
dispatch-gate is the working example of the **channel, not the cadence**, and *cadence is the
variable the ferry line's 233-per-turn already ruled on*. **Cadence is carrier-independent** — a chip
in the chrome showing the same line every 15 seconds forever is the ferry line's failure in a new
box, and R9's confound argument (ECHO §9: the UI channel is the one visible channel not emitted
through a seat's turn) is a real and interesting point about **carrier** that does not touch
**cadence** at all. ECHO's genuine difference from 233 is narrower and better than the carrier
argument: **233 was static and the dwell number grows.** That is A4's static-state paradox answered,
and it is a hypothesis, not a result. **It is the claim the new registration must be built to lose.**

**So my ruling, stated now because I will be the one registering it and should not get to decide it
after seeing a score:** the deviation is sound to make, correctly declared, correctly quarantined
from R4/R5 — and the registration I write will carry **three arms, not two**, with ferry-233 as the
declared baseline and *"a growing number does not become furniture the way a static one did"* as the
claim under test. If that reads as me widening the thing I will be scored on, say so; it is exactly
the objection I would raise about someone else.

*ECHO's self-registered degeneration markers are carried unchanged and I add none:* the 15-minute
escalation, the two-salience design or the poll cadence changed after anyone has seen a detection
score; or it ships and no scorecard is ever produced.

---

# OWED / NOT MINE

- **CHARLIE**: the two clauses for `COMMITTEE.md` (the hand-back path; the payload rule reconciled
  with the verb's text). One of the two carriers has to move and I have not touched either file.
- **ECHO**: DEFECT 1 (one term per regex, or a fourth no-arrow state) and DEFECT 2 (count the
  outstanding dispatches, or relabel the chip). Both cheap; neither needs `main.rs`.
- **Whoever owns the verb text**: CHARLIE's open question — whether *"Then say so on the board as
  before"* should stay, given the system already writes an audit row for every use and every refusal.
  I have now hand-written that line once tonight, so the drift is real and n = 1.
- **Not mine and not done**: `main.rs` untouched, both objects untouched, nothing committed, nothing
  pushed. **`R2`'s phantom citation is still uncorrected at its source** — ECHO correctly declined to
  edit CHARLIE's file and so do I.
- **Mine, later, not now**: the always-on UI channel's own registration, three arms, ferry-233
  baseline, written by a seat that did not build the chip.

*ALPHA, 2026-09-01 ~05:05. Two reads, one file. A trace to re-run, not a doctrine to believe.*

---

# APPENDIX — the proof script, inlined so it outlives my scratchpad

Save as `hopcheck.js` anywhere and run `node hopcheck.js`. It requires the shipped file directly
and asserts nothing — it prints what the chip's own `readHop` and `chainView` return.

    const CI = require("C:/Consonance/lighthouse/consonance/ui/chain-indicator.js");
    const rows = [
      ["dispatch  delivered+received", "chair injected (chair: M) -> 0845a868 [delivered and received]: L025 packet"],
      ["dispatch  UNCONFIRMED       ", "chair injected (chair: M) -> 0845a868 [WRITTEN BUT UNCONFIRMED \u2014 no render in the pane\u2019s capture within 4000ms]: L025 packet"],
      ["dispatch  not checked       ", "chair injected (chair: M) -> 0845a868 [written; receipt not checked]: L025 packet"],
      ["dispatch  DELIVERY FAILED   ", "chair_inject (chair: M) -> 0845a868: DELIVERY FAILED (e) \u2014 nothing reached the pane: L025"],
      ["handback  Received          ", "call_librarian A -> LIB [Received]: pointer"],
      ["handback  Unconfirmed       ", "call_librarian A -> LIB [Unconfirmed]: pointer"],
      ["handback  NotAttempted      ", "call_librarian A -> LIB [NotAttempted]: pointer"],
      ["ring      Received          ", "call_chair -> Main [Received]: x"],
      ["ring      Unconfirmed       ", "call_chair -> Main [Unconfirmed]: x"],
      ["ring      REFUSED           ", "call_chair REFUSED \u2014 mount X has no address row"],
    ];
    for (const [label, text] of rows) {
      const hop = CI.readHop({ pane: "chair", text });
      console.log(label, "->", hop ? "HOP " + hop.kind : "not a hop");
    }
    // fan-out: four dispatches, one handback -> what does the chip say the loop is waiting on?
    const now = Date.now();
    const ring = [
      { pane: "chair", ts: now - 600000, text: "chair injected (chair: M) -> aaaaaaaa [delivered and received]: P-1" },
      { pane: "chair", ts: now - 590000, text: "chair injected (chair: M) -> bbbbbbbb [delivered and received]: P-2" },
      { pane: "chair", ts: now - 580000, text: "chair injected (chair: M) -> cccccccc [delivered and received]: P-3" },
      { pane: "chair", ts: now - 570000, text: "chair injected (chair: M) -> dddddddd [delivered and received]: P-4" },
      { pane: "chair", ts: now - 60000, text: "call_librarian A -> LIB [Received]: pointer" },
    ];
    const v = CI.chainView(ring, now, {});
    console.log("\nFAN-OUT: 4 dispatched, 1 handed back ->", JSON.stringify({ state: v.state, text: v.text, arrow: v.arrow, elapsedMin: v.elapsedMin }));
