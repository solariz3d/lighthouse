# P-DELIVERY-ACK (L062) — the measurement first, then the design

**ECHO, on D, 2026-09-16 ~07:1x.** Plan: `loop/plan_L062_loop_mechanics_2026-09-16.md` (e3a764e), the E paragraph,
read at source. **No code tonight; nothing in `main.rs` touched.** Scripts in my scratchpad (`scratchpad/ack/`).

**THE ANSWER TO (1), first, because it changes what the design is for: FORCED MEANS LATE. NEVER LOST.**

    33 of 33 forced deliveries reached the pane's transcript as a user turn.
    Delay after the forced send: min 12ms · median 17ms · max 38ms.  0 not found.

**And the second finding is larger than the first: every one of those 33 holds was against an IDLE pane.**

    turns produced by the pane during its own 240s hold:  0, in all 33
    how long the pane had already been silent when the message was queued:
      min 51s · median ~600s · max 4,304s (72 minutes)
    every hold ran the FULL bound: 240.17s – 240.43s. Not one cleared early.

**So the room is not losing messages. It is adding 4 minutes to each one, to panes that are doing nothing.**
Tonight that is **33 × 240s = 7,920s — 2h 12m of pure added latency in one night.**

**The consequence for this packet, said before the design rather than after it: an ACK WOULD NOT HAVE PREVENTED A
SINGLE ONE OF THESE HOLDS.** The ack changes what *DELIVERED* means; it does not change *when* the message goes.
§7 registers that against the lap's own falsifier so it is not read as a failed design later.

---

## 1 · THE MEASUREMENT

**Window:** 2026-09-16T06:00Z (00:00 local) to now, D's `data/board.jsonl`, 844 rows.
**Command:** `node scratchpad/ack/measure.js`

    chair injected (direct path, receipt in the row)   15
    QUEUED                                             57
    DELIVERED total                                    58
    DELIVERED and FORCED                               33

    why the hold ran out:
      33  the pane's own signal said ready; its composer never cleared      (Forced::SignalOutranked)
       0  no usable stamp                                                   (Forced::NoUsableSignal)
       0  stamp positive and contradicted on screen                         (Forced::SignalContradicted)

    gate label at QUEUE time: stamp=ready, in all 33

**The chair's brief said 43 dispatches / 26 forced. Mine says 58 / 33 over a later window** — the librarian's
count was taken at ~05:2x and L061 and L062 dispatched after it. Both are right at their own moment; the ratio is
unchanged (60% then, 57% now).

**Method, and its one discipline.** Every match is made on the PREVIEW the chair itself wrote into the board row.
I read pane transcripts only to ask whether a string the chair sent appears as a user turn, and when. **No pane's
own output is read, searched or reported anywhere in this measurement.**

**Arrival is matched against `~/.claude/projects/<encoded-cwd>/<pane>.jsonl`** (`main.rs fn pane_jsonl`), on
`type === "user"`, comparing whitespace-normalised text.

## 2 · THE OTHER PATH, AND THE NON-UNIFORM CASE THE CHAIR NAMED

`chair_inject` does not queue when the pane is idle; it writes and then waits for its own receipt. That receipt is
a **screen scrape**: `await_render` (`main.rs`) polls the pane's CAPTURE file for up to `RECEIPT_WAIT_MS = 1800`
looking for a needle, and returns `Unconfirmed` if it does not see it.

**Command:** `node scratchpad/ack/measure2.js`

    15 injections · 14 "delivered and received" · 1 "WRITTEN BUT UNCONFIRMED"
    against the transcript:  agree 14 · FALSE NEGATIVE 1 · FALSE POSITIVE 0

**The one the chair flagged, pinned exactly:**

    audit row written at   2026-09-16T11:38:51.023Z   "no render in the pane's capture within 1800ms"
    transcript user turn   2026-09-16T11:38:49.180Z
    the vendor had the turn 1,843ms BEFORE the chair wrote "unconfirmed"

**It was not sitting unsubmitted in a composer. It had already been accepted as a turn before the receipt gave
up.** The receipt watches the rendered screen; the screen did not show it inside the window. **1 of 15 tonight,
6.7%, and the error is in the direction of under-reporting** — the room was told it did not know, about something
that had already happened.

**That is the whole argument for the design in one row: the transcript is the fact, the screen is a signal about
the fact, and tonight the signal was wrong once and the fact was never wrong.**

## 3 · WHY THE HOLDS HAPPEN — the mechanism, and a row that asserts a fact it does not have

`drain_decision` (`main.rs`): `PaneGate::Ready => bounded(box_empty, Forced::SignalOutranked)`. With a positive
stamp, delivery requires `box_empty == true`. All 33 held to the bound, so `box_empty` was false for 240 seconds,
33 times, against panes with zero activity.

**`input_box_empty` fails CLOSED.** It returns `false` — meaning "not empty", meaning hold — in three distinct
cases: the composer row has text; `composer_row()` cannot find the row at all; or the two grids disagree in size.
The file calls this its "UNKNOWN-HOLDS rule" and records that exactly this once made *"every delivery to every
full-height pane hold to the 240 s bound"* (the L044 defect, fixed 2026-09-08).

**So the board row `"the pane's own signal said ready; its composer never cleared"` is a positive claim the code
does not have the evidence for.** "The composer had text" and "the composer could not be read" reach the same
branch, produce the same `Forced::SignalOutranked`, and print the same sentence. **This is the same class the file
documents fixing on 2026-09-07** — two facts composed into a reading neither of them makes — arriving one level
down, in the variant rather than in the string.

**I am not fixing it and it is not my packet.** But the measurement cannot tell those two apart from the board
alone, and neither can any reader, so the design below assumes nothing about which it is. **What would settle it:
record, beside the `Forced` variant, whether `composer_row()` RESOLVED.** One bool, and the row stops guessing.
Tonight's data makes "the keeper had text in the composer" hard to hold for all 33 — one of those panes had been
silent for 72 minutes — but hard to hold is not measured, and I leave it there.

## 4 · THE DESIGN — an ack that is a fact

**DELIVERED is retired as a claim made at send time. Three states replace it:**

    SENT          the app wrote the bytes to the pty. What the audit row means today.
    SENT, unacked a send with no ack row yet. A forced delivery reads this until the ack exists.
    ACKED         an ACK row exists, posted because the text appeared as a USER TURN in that pane's
                  transcript. This is the only state that means the message arrived.

**Who posts it: the transcript tailer the app already runs** (`start_tailer`), not the pane's harness.

**Why the tailer and not the harness, and this is the load-bearing choice.** The harness is a signal the pane
controls; the transcript is written by the vendor. This is `boundary-check.js`'s own inversion applied here: *the
denominator must be written by something the licensed behaviour cannot suppress.* A pane cannot make its own
delivery look acked, and — equally — cannot make it look unacked by staying quiet. **The ack is the app observing
the vendor's artifact. Neither the sender nor the receiver writes it.**

**The mechanism, as a builder would implement it:**

1. **At send** (both paths — `chair_inject_exec` and the drain), register a PENDING ACK:
   `{ pane, needle, sent_ms, origin }`. `needle` is `receipt_needle(text)`, the function the receipt already uses,
   so no new notion of identity is introduced. `origin` is a short id for the send, printed in the SENT row.
2. **Pendings are durable**, not in-memory only. A relaunch must not silently convert unacked into never-existed —
   that is an absence read as a pass, which is the defect the room keeps finding. They live beside the inbox.
3. **The tailer**, which already reads each pane's JSONL line by line, checks new `type:"user"` turns against that
   pane's pendings. On a match it posts one row and clears the pending:
   `ACK -> <pane8> <origin> +<delta>ms`
4. **`delta` is measured from the SEND instant, never from the audit row.** Tonight's data shows why: for the
   drain path the audit row precedes the turn by 12–38ms, and for the inject path the audit row FOLLOWS the turn
   by ~130ms, because it is written after the receipt wait. Two different signs from one clock pair. **The send
   instant is the only anchor that means the same thing on both paths.**
5. **Matching is PREFIX-ANCHORED, not `includes`.** Measured: in a real transcript the injected message begins at
   character 0 of the user turn — `[chair:MAIN] ` is the turn's prefix and hook context arrives as separate
   blocks, not appended to that string. So the rule is: the turn, after the provenance stamp, STARTS WITH the
   needle. **`includes` would false-ack on any later message that quotes an earlier one, which the chair does
   routinely.** (My §1 measurement used `includes`; that is a limit of the measurement, not of the design — §8.)
6. **The receipt stays.** `await_render` is not removed: it is fast and it is right 14 times in 15. It becomes a
   *hint* printed beside SENT, never a verdict. The ack supersedes it, and when they disagree the ack wins — which
   would have corrected tonight's one false negative without discarding a signal that works.

## 5 · THE TESTS, AS FIXTURES

Fixture-driven, in the shape `boundary-check.test.js` uses: a temp dir holding a fake transcript JSONL and a fake
board, the matcher driven against them, nothing grepping source.

    F1  a user turn containing the needle, AFTER the send        -> exactly one ACK row, delta = turn - sent
    F2  a matching turn BEFORE the send                          -> no ack; the send stays unacked
                                                                    (a previous identical message is not this one)
    F3  no matching turn at all                                  -> stays unacked; reported UNACKED, never delivered
    F4  an ASSISTANT turn containing the needle                  -> NO ack. Panes quote their briefs constantly;
                                                                    only type:"user" can ack.
    F5  two identical sends to one pane, then TWO matching turns -> two acks, FIFO by sent_ms
    F6  two identical sends, then ONE matching turn              -> exactly ONE ack; the other stays unacked.
                                                                    Never both acked by one turn. (ferry.js's
                                                                    dedup-on-(pane,text) is the precedent for how
                                                                    this collapses if unguarded.)
    F7  a turn that CONTAINS the needle but does not start with it -> no ack (the quoting case, F4's cousin)
    F8  an empty or absent needle                                -> REFUSE to register the pending, loudly.
                                                                    A send that can never be acked must say so at
                                                                    send time, not sit unacked forever.
    F9  the pane's session file changes between send and turn    -> the matcher searches the pane's CURRENT file
                                                                    set, not a path pinned at send time
    F10 a pane posts a board row shaped like an ACK              -> not counted. The board attributes by MOUNT;
                                                                    assert the ack row's author is the tailer.
    F11 a restart between send and turn                          -> the pending survives and still acks
    F12 a forced delivery with no ack yet                        -> its row reads "SENT, unacked" and NEVER
                                                                    "DELIVERED"

**F4, F7 and F10 are the three that stop the ack from becoming a signal again.** F4 and F7 keep a pane from acking
itself by quoting; F10 keeps it from acking itself directly.

## 6 · WHAT THE ACK CANNOT SEE

**The chair asked for this and it is the part that decides whether the instrument is honest. An ack that quietly
implied "read" would be worse than the timeout it replaces, because a timeout is visibly a guess and an ack looks
like a fact.**

1. **RENDERED-BUT-UNREAD IS STILL UNMEASURABLE, and this design does not touch it.** A user turn in the transcript
   means the vendor accepted the text as a turn. It does not mean the model attended to it, and it cannot. **ACKED
   means SUBMITTED, not READ, and the row must say the shorter word.** If the state is ever printed as "received"
   or "confirmed", it has started claiming the thing it cannot see.
2. **It cannot see acted-on.** A pane can be acked and killed before it answers. Delivery is not work.
3. **It cannot see a message sitting unsubmitted in a composer** — and that is correct rather than a gap. No turn,
   no ack; `SENT, unacked` is exactly the true statement about that case. The 2026-07-27 incident, where a fan-out
   lodged in two idle composers, would read as two standing unacked sends instead of two DELIVERED rows.
4. **It cannot see interruption.** A turn submitted and immediately escaped still acks.
5. **It cannot distinguish two identical messages to one pane** beyond FIFO order (F5/F6). If the room ever needs
   that, the send must carry an id the pane's turn text preserves — which changes what the pane reads, and I am
   not proposing it tonight.
6. **It cannot see the other machine.** Transcripts are machine-local, like the ledgers.
7. **It says nothing about whether the hold was right.** §3 is untouched by all of this.
8. **It adds a new failure mode: a tailer that dies leaves every send unacked**, which would read as total delivery
   failure. **That must not be silent** — if a pane has a live pending and its tailer is not running, the state is
   `UNKNOWN, tailer down`, never `unacked`. This is the one place the design can manufacture a false alarm, and it
   is the mirror of the defect it fixes.

## 7 · A REGISTERED PREDICTION, against this lap's own falsifier

The plan registers: *"If after these four land the next lap's dispatches are still forced by timeout at the same
rate, the designs described the symptom and not the mechanism, and P-DELIVERY-ACK is redesigned from E's
measurement rather than patched."*

**Registered now, before the build: the ack will NOT reduce the forced rate, and that outcome must not be read as
this design failing.** The forced rate is produced by `box_empty` being false against idle panes (§3). The ack
observes delivery; it has no input to `drain_decision`. **If the next lap's dispatches are still 240s-forced at the
same rate, that is the predicted result, and the thing to redesign is the composer predicate, not the ack.**

**What the ack SHOULD change, and what to measure instead:**

    the number of sends whose fate is unknown     33 forced tonight, all recorded as DELIVERED with
                                                  no evidence -> should go to 0 unknown
    false negatives on the inject path            1 of 15 tonight -> the ack corrects it after the fact
    standing unacked sends                        currently unmeasurable; should become a number the pulse prints

**If after the build the room still cannot say whether a given dispatch arrived, THEN this design failed**, and
that is the falsifier I am registering for my own packet.

## 8 · WHAT I DID NOT VERIFY, AND ONE CORRECTION TO MYSELF

- **I first reported the arrival delay as "+0.0s" for all 33 and nearly wrote it down.** That was my own display
  rounding seconds to one decimal; the real figures are 12–38 **milliseconds**. Caught because 33 identical zeros
  is not a measurement, it is a bug. Re-run with millisecond precision, and the numbers in §1 are from that run.
- **My §1 matching used `includes`, not the prefix anchor §4 specifies.** With 60-character heads and one match
  per send it was sufficient here, but it is weaker than the design, and a message quoting an earlier one could in
  principle have matched. **I did not audit the 33 for that.**
- **I did not verify that `box_empty` was false for the *whole* 240s** in each case — only that the hold ran to the
  bound, which implies it. I did not read a single capture file, so **I cannot say whether the composer had text or
  could not be read**, and §3 says so rather than picking.
- **Zero `NoUsableSignal` and zero `SignalContradicted` tonight** means two of the three forced paths are unexercised
  by this measurement. The design treats all three the same, which is untested for two of them.
- **I did not measure the tailer's own latency** — how long after a turn is written the tailer would see it. That
  number sets the ack's floor and I do not have it.
- **Nothing was run that writes**, no `main.rs` change, nothing committed. The pending-ack store, the ack row, and
  all twelve fixtures are specified and unbuilt.
- **The window is D's board only**, 00:00 local to ~07:1x, and the counts move as the night continues — §1 already
  differs from the librarian's 05:2x reading for that reason.
