# P-RETURN-LEG-OPEN · CHARLIE — the out-of-turn refusals, measured; and the amendment, with its cost

Lap L062, 2026-09-16 ~06:40–07:2x, machine **L** (ZachsLEGION), seat C (Around).
Packet: `exo_memory/loop/plan_L062_loop_mechanics_2026-09-16.md` (e3a764e), the **C → P-RETURN-LEG-OPEN**
paragraph, read at source.

**Design lap. No code. Nothing edited but this file and one line in `exo_memory/map/C.md`.** Nothing
installed, nothing built, nothing run that writes. All reads.

---

## 0 · THE ANSWER

**30 system-written OUT OF TURN refusals exist, ever, 2026-09-02 13:50 → 2026-09-16 07:35 UTC.**
Split by verb:

| verb | refusals | what it is in the loop |
|---|---|---|
| `chair_inject` | **16** | outbound — the chair talking over a working pane |
| `call_librarian` | **9** | **the return leg** — a pane's finished hand-back |
| `call_chair` | **5** | **the return leg's second hop** — lib → orch, step 7 of the ring |

**14 of 30 — 47% — were the loop trying to come back.** The rule was written to stop stations
talking *over* each other; on the record, nearly half its firings stopped work coming *home*.

**And every one of the 9 was a finished hand-back.** Not inferred from the payload — the board does
not record payloads (§2) — but established two ways that agree: by the verb's definition, and by
correlating each refusal with the refused mount's own preceding turn (§1.3). Those turns read
*"Writing the hand-back"*, *"Fold done"*, *"Appending the follow-up to the hand-back"*, *"is filed
and rung"*.

**Refusal rate on the return leg: 9 refused against 72 delivered = 11.1% of all return legs ever
attempted.** Roughly one hand-back in nine has been refused by the gate meant to protect the loop.

**The amendment is worth making and it is not free.** §4 states what it lets through, from the
original's own words, and the answer is uncomfortable: **the concrete harm that created the rule was
a hand-back arriving and cutting the keeper's message off mid-word.** That is precisely the event
this amendment re-admits.

---

## 1 · THE MEASUREMENT

### 1.1 · Universe printed

Three board files hold rows; a fourth predates the gate entirely.

| file | lines | rows containing "OUT OF TURN" |
|---|---|---|
| `C:\Consonance\data\board.jsonl` (live, 06:4x) | 30,995 | 63 |
| `C:\Consonance\data\attic\board.jsonl.2026-09-09` (pre-compaction) | 269,032 | 83 |
| `C:\Consonance\state\data\board.jsonl` | 30,160 | 53 |
| `C:\Consonance\backups\board.jsonl.pre-thirdplace-purge-2026-08-29` | 133,999 | **0** |

    for f in <the four>; do grep -c "OUT OF TURN" "$f"; done

The 08-29 backup's zero is a **positive control on the window, not a gap**: the gate shipped with
`packet_one_station_2026-09-02.md` on 09-02, and the earliest refusal on record is 09-02T13:50. A
file that predates the guard containing none of its output is what a correct measurement looks like.

Union of the three, deduped on `(pane, ts, text)`: **63 distinct rows mention the phrase.**

### 1.2 · Only 30 of those 63 are refusals — and two of the impostors are mine

The phrase appears in ordinary prose whenever a seat *discusses* being refused. **Two of the 33
non-refusal rows are my own turns from 12:40 UTC today, written while performing this measurement**
— my text entered the corpus I was measuring, within the same hour. A third is B at 07:06 describing
its own refusal; a fourth is the librarian at 11:54 doing the same.

My first two passes counted 63, then 43, both wrong in the direction of a bigger, more dramatic
number. The discriminator that survives is the row `auth_station` actually emits (`mcp.rs:650-666`):
`pane == "chair"`, text matching `REFUSED OUT OF TURN — mount`.

    rows mentioning the phrase   63
    SYSTEM-WRITTEN refusals      30
    prose quoting it             33

**The counts reconcile exactly**, which is the check that the discriminator is right:

    by verb                by mount
    chair_inject     16    D  16     (the chair's mount — all 16 chair_inject)
    call_librarian    9    M   5     (the librarian's mount — all 5 call_chair)
    call_chair        5    B 4 · A 3 · E 1 · C 1  = 9  (the panes — all 9 call_librarian)

Holder at the time, parsed from the rows that state one: `panes` 11, `chair` 6, `librarian` 1;
12 rows do not name a holder in the row.

### 1.3 · The split the packet asked for, and how it was established

The packet asks whether the refused message was a hand-back pointer. **The board cannot answer that
directly** — see §2. Two independent routes, which agree:

**(a) By the verb's definition.** `call_librarian` carries nothing else. Its own tool description:
*"deliver your HAND-BACK into the LIBRARIAN's pane … Send a POINTER to the file you wrote"*. And the
code says it outright, in the comment that writes the OWED mark on refusal (`mcp.rs:683-685`):
*"a pane only calls this verb when it has something to hand back, so the call itself is the evidence
that work is finished and undeliverable."*

**(b) By correlation.** For each of the 9, the refused mount's nearest preceding assistant row on the
board (within 20 minutes):

| refusal (UTC) | mount | that seat's own preceding turn |
|---|---|---|
| 09-06 07:50 | A | "Now the three edits — the two you named, plus one my own §2 forced within the lap." |
| 09-06 08:38 | B | *(no assistant row in the 20 min before — the one case with no corroboration)* |
| 09-06 10:03 | A | "Fold done — and it surfaced one more of tonight's class before it could land." |
| 09-06 10:17 | E | "js-suite still running. **Writing the hand-back.**" |
| 09-07 07:05 | B | "Everything is read and the arithmetic is run. **Writing the hand-back.**" |
| 09-09 07:12 | A | "**Appending the follow-up to the hand-back.**" |
| 09-09 07:52 | C | "The packet's premise is refuted by the room's own log. Writing it up:" |
| 09-09 07:59 | B | "**L050 P-STALLED-AT-CHAIR is filed and rung.**" |
| 09-16 07:06 | B | "Measured, not quoted: L's ledger has three real exports…" |

**8 of 9 corroborated as finished work; 1 uncorroborated, named rather than rounded up.**

### 1.4 · The denominator

    DISTINCT successful deliveries (`call_librarian X -> LIB [Received]`)   72
      A 22 · C 17 · E 16 · B 16 · L 1
    refused                                                                 9
    attempted                                                              81   ->  11.1% refused

---

## 2 · WHAT THE BOARD CANNOT TELL ME, AND IT IS A FINDING ABOUT THE GATE

**When `call_librarian` is refused, the message it carried is discarded and never recorded anywhere.**
The path, at `mcp.rs:682-687`:

```rust
if !self.auth_station("call_librarian") {
    let who = self.identity.clone().unwrap_or_else(|| "a pane".to_string());
    mark_owed(&who, now_ms());
    return Ok(CallToolResult::success(vec![Content::text(self.out_of_turn_handback_message())]));
}
```

The `text` parameter is bound in the signature and **never read on this branch**. `auth_station`'s
board row carries the verb and the mount only. So the refusal's own sentence — *"the attempt was
posted to the board"* (`mcp.rs:163`) — **is true for chair verbs and overstated here**: what is
posted is *that* an attempt happened, not the attempt.

**Consequence beyond this packet:** a refused return leg is the one message class in this room that
leaves no copy. The pane still holds it, and the hand-back file exists on disk, so nothing is lost in
the end — but nothing on the board could ever reconstruct what was refused, which is why this
measurement had to go the long way round. **If the amendment is not made, the cheap repair is to post
the attempted pointer on refusal**, and I note it here rather than design it, because it is not what
I was asked for.

---

## 3 · THE AMENDMENT

**`call_librarian` is admitted whenever the open lap has dispatched cells that have not yet returned,
whoever holds the baton.** Chair verbs — `chair_inject`, `chair_phase`, and the rest — keep the
one-station refusal exactly as written.

**The predicate, stated so it can be built without a judgement call.** A lap qualifies when its
ledger shows a `dispatched` stage row whose named cells are not all matched by a return. Concretely,
from `lap.jsonl`: a row `{stage:"chain", chain:"dispatched", to:[…]}` exists since the lap opened, and
the count of `call_librarian … -> LIB [Received]` rows for that lap's dispatched mounts is fewer than
`to.length`. **Open the gate on the difference, close it when it reaches zero.** This is readable from
the two ledgers the room already keeps, needs no new state, and is a pure function of them — the same
shape as `required_station` (`mcp.rs:587-593`), which is already pure and already tested without disk.

**Why this predicate rather than "always admit `call_librarian`".** It keeps a refusal for the case
the original was really aimed at: a pane speaking when nothing was asked of it. A seat with no
outstanding dispatch has no return leg to make, and its call is the thing the one-station rule calls
talking out of turn. **The amendment should be as narrow as the harm it repairs**, or it is the
repeal the packet warns about.

**What it replaces.** The L050 "return-leg trap" machinery (`mcp.rs:46-72`, the RUNG/OWED marks and
the two-recovery refusal text) exists because the gate could not be opened, so the room built a
better sign to hang on the locked door. Under this amendment the trap state is mostly unreachable and
that machinery becomes belt to the amendment's braces. **I would not delete it in the same lap that
adds the amendment** — it is the only thing that catches the case where the predicate is wrong.

---

## 4 · THE HARD PART — WHAT THIS LETS THROUGH, FROM THE ORIGINAL'S OWN REASONS

`packet_one_station_2026-09-02.md` gives three reasons. The amendment costs something against each.

### 4.1 · It re-admits the exact event that created the rule

The packet's §1, verbatim:

> **It was demonstrated in the act of being reported.** Three of his messages were spliced by rings
> into the librarian's pane inside ten minutes — **one cut off mid-word by A's own hand-back
> arriving.**

**The incident that produced the one-station rule was a hand-back arriving at the wrong moment.** Not
a chair dispatch — a hand-back. The amendment admits hand-backs whenever cells are outstanding, which
is precisely when panes are finishing and the librarian is most likely to be mid-composition. **This
is not a residual risk I am pricing low; it is the founding case, and the amendment re-opens it.**
Anyone who lands this should be able to say that sentence out loud first.

### 4.2 · It breaks "exactly ONE station is active", which was the keeper's rule and not an implementation detail

> **While a loop runs, exactly ONE station is active — terminals, or orch, or lib — and every other
> seat waits for the loop to come back to it.**

Under the amendment, during any dispatched-and-unreturned window, **two stations are live**: whoever
holds the baton, and every pane with an outstanding cell. With four panes dispatched, that is five
live speakers into one librarian. The room has already priced this shape once — `required_station`'s
own comment (`mcp.rs:607-611`) says of the multi-lap fix: *"the guard's strength is now inversely
proportional to how many laps are left open"*. **The amendment makes it inversely proportional to how
many cells are dispatched**, which on a four-pane lap is a larger factor than the multi-lap case that
warranted a named price.

### 4.3 · It moves the "nothing renders into a working pane" protection onto a gate that is currently being forced

> **And the human is not the exception**: nothing renders into a pane whose prompt is not idle.

The one-station packet split the work deliberately: *"Yours is the REFUSAL half. C has the DELIVERY
half (P-INBOX). Together they are the baton: your half says who may speak; C's says when it lands."*
The amendment relaxes the refusal half and **transfers the splice protection entirely to the delivery
half** — the PaneGate and its bounded hold.

**That half is not currently holding.** Tonight's own measurement, in the plan I was briefed from
(`plan_L062_loop_mechanics_2026-09-16.md`, the Why section): **26 of 43 dispatches DELIVERED only by
"FORCED after the bounded hold", and all four L061 dispatches forced.** A forced delivery is a
delivery into a pane the gate could not confirm was idle — which is the splice, arriving by the other
door.

**So the amendment's safety rests on a gate that is being overridden about 60% of the time.** This is
the coupling I would refuse to land without: **P-RETURN-LEG-OPEN should not ship before
P-DELIVERY-ACK's repair**, or it should carry its own condition — admit the return leg only when the
librarian's own gate reads idle, and hold otherwise. Landing the two in the wrong order converts a
refusal that was at least loud into a splice that is silent.

### 4.4 · The smaller thing it gives up, named because it is real

The current refusal produces the **OWED mark** (`mark_owed`, `mcp.rs:687`), which is what
`chair_inject` reads to refuse the chair and print `owed_refusal_text`. **That mark exists only
because the call was refused.** Admit the call and the mark is never written, so the chair loses the
one signal that currently tells it a pane finished and could not answer. In the amended world the
equivalent signal is the delivered pointer itself, which is strictly better — but it is a different
mechanism, and `owed_refusal_text` and everything reading those marks would need to be re-grounded
rather than left to quietly never fire.

---

## 5 · TESTS, AS FIXTURES — specified, not written

Following `required_station`'s example, the predicate should be pure and testable with no disk:

1. **dispatched-and-unreturned ⇒ admitted**, holder `chair`. The 01:06 case.
2. **all cells returned ⇒ refused**, holder `chair`. The narrowness bar — proves it is not a repeal.
3. **no dispatch since the lap opened ⇒ refused**, holder `chair`. A pane speaking unasked.
4. **no open lap ⇒ admitted**, unchanged (`mcp.rs:598-600` — freestyle is not gated).
5. **chair verbs unchanged in every one of the above.** The mutation that matters: if a mutant admits
   `chair_inject` under the amendment's predicate, a test must go red.
6. **the founding case, as a regression fixture**: cells outstanding, librarian's pane NOT idle ⇒
   the call is admitted by the station gate and **held by the delivery gate**, not spliced. This is
   the §4.3 coupling written as a test, and it is the one I would require before landing.

---

## 6 · WHAT THIS DOES NOT ESTABLISH

- **The payload split is inferred, not read.** §2 shows the board never records what a refused call
  carried. The claim "all 9 were return legs" rests on the verb's definition plus 8 corroborating
  turns; **one of the 9 (B, 09-06 08:38) has no corroborating row at all.**
- **Board-derived counts are a floor.** 257 torn rows exist in the live board; a refusal torn through
  its own text would not match my discriminator. The 09-09 compaction removed byte-identical replays
  only, and I checked the pre-compaction original, but I did not verify that no refusal row was ever
  lost to a launch that failed to flush.
- **This is L's board.** `board.jsonl` is machine-local. D's refusals are not in these 30, and D's
  board is not on this disk.
- **I did not run anything.** No test, no build, no `chain-status`. Every figure is from `grep`,
  `node` over the ledgers, and reading `mcp.rs`; §4's forced-delivery number is **quoted from the
  plan**, not re-derived by me, and E holds that measurement tonight.
- **The predicate in §3 is designed, not validated.** I did not replay it against the 30 recorded
  refusals to check it would have admitted the 9 and still refused the rest. **That replay is the
  first thing the building lap should do**, and if it admits any of the 16 `chair_inject` refusals
  the predicate is wrong.
- **I am not disinterested.** One of the 9 refused return legs is mine (C, 09-09 07:52), and the
  amendment would make my own hand-backs land more often.
