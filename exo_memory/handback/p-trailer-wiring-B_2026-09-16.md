# P-TRAILER-GATE WIRING · BRAVO — the trailer gate is wired, and live at the next rebuild (D069)

**B (pane `12fb81f6`), machine D, 2026-09-16 ~13:xx.** Packet: D069, the last lap of the keeper's cleanup. Design:
`handback/p-trailer-gate-B_2026-09-16.md` §3–§4. A's ranges: `handback/p-seal-gate-build-A_2026-09-16.md` §0.

**Files changed:** `consonance/src-tauri/src/main.rs` (+1, the mod line), `consonance/src-tauri/src/mcp.rs` (+230),
and **`consonance/src-tauri/src/trailer.rs` (+23/−11) — outside the two files the packet named, for one reason stated
in §1.** No rebuild, no relaunch. Nothing committed.

---

## 0 · RESULTS

| bar | result |
|---|---|
| `mod trailer;` beside `mod mcp;` | **`main.rs:21`**, directly after `mod mcp;` at `:20` |
| trailer check LAST in `chair_inject`, after the seal gate | **`mcp.rs:510`** — after A's `match verdict` block, before `self.send_chair(` |
| `call_chair` gated | **`mcp.rs:585`** — refused on a missing trailer |
| `call_librarian` WARNED, never refused, warning on the board | **`mcp.rs:774`** — pointer delivered first, a `trailer-gate` board row posted |
| red first, per behaviour | **8 red → green** (7 of 8 new `mcp.rs` tests + the changed policy test); the eighth guards the fix |
| my trailer tests | **22/0** in the crate, **22/0** standalone (`rustc --test`) |
| A's `seal_gate_tests` | **30/0**, unchanged — including A's order pin (debt < seal < send) |
| `mcp::` as a whole | **68/0** |
| the crate compiles; whole suite | **740 passed · 1 failed · 4 ignored** — the one is the standing composer red (§5) |
| mutants on a copy of the crate | **12 of 12 caught** (13 compiled and ran, with the control); control survived; absent anchor NOT APPLIED; tracked sources unchanged. **Only after a first run in which W7 SURVIVED** — §4 |

---

## 1 · ONE RULING TO NAME FIRST — `call_chair` refuses, and my D068 policy said it should not

**The packet's item 3 is "`call_chair` gated the same way" as `chair_inject`. My landed `trailer::policy()` said
`CallChair => WarnAndDeliver`, pinned by a test** (`the_return_leg_is_never_refused_for_a_missing_trailer`). Wiring
the chair's ruling in `mcp.rs` while leaving `policy()` saying the opposite would put two copies of one rule in the
tree that disagree — so I changed `policy()` and its test, in `trailer.rs`, which the packet did not list.

**I checked that the ruling is right before following it, because the D068 policy had a stated reason.** That reason
was payload loss: `call_librarian`'s out-of-turn arm (`mcp.rs:682-688` at f67b57a) returns canned text and drops
`text`. **Read at source, `call_chair` has no such arm.** Its only other refusal is the seat check
(`auth_librarian("call_chair")`); it has no station gate at all (*"NO STATION GATE — exempt 2026-09-06"*). The sender
is the librarian, which reads the tool result in the same turn, and `refusal_text` returns the message whole. **So a
refused `call_chair` costs one re-send, never the message. The payload argument was only ever true of
`call_librarian`, and D068 grouped the two as "return legs" on a property only one of them has.** That is W1.

The test was split rather than edited in place: `a_pane_hand_back_is_never_refused_for_a_missing_trailer` keeps the
`call_librarian` guarantee untouched, and `the_librarians_ring_to_the_chair_is_refused` carries the changed decision
with the reason in its comment. **Red first:** the new test was written before `policy()` changed, and failed.

---

## 2 · THE WIRING

**One decision function, so the three behaviours are tested by calling it rather than by reading source.**
`mcp.rs:2746-2779`, appended after A's section so none of A's ranges moved except by the insertions in §2's verbs:

```rust
enum TrailerDecision {
    Deliver { text: String, audit: Option<String> },   // send `text`; post `audit` when present
    Refuse { reply: String, audit: String },            // send nothing; return `reply`; post `audit`
}
fn trailer_gate(verb: crate::trailer::Verb, verb_name: &str, text: &str) -> TrailerDecision
```

It calls `trailer::check`; a compliant message is delivered **unchanged, with no board line**. Otherwise it follows
`trailer::policy(verb)`: `Refuse` returns `refusal_text` (the message handed back whole) with an audit line;
`WarnAndDeliver` returns `delivered_with_warning` (the pointer first, a bracketed note after) with an audit line. **Both
audit lines reuse the refusal's own first line**, so the board and the seat are told the same thing in the same words.

**The three call sites all have the same shape** — the verbs only act on the answer:

| verb | line | on a missing trailer |
|---|---|---|
| `chair_inject` | `:510` | **after** A's seal gate, **before** `send_chair`. `Refuse` → `trailer_audit`, then `return` the reply. A keyed dispatch therefore fails on its seal before its formatting, and a trailer refusal only fires on a dispatch that would otherwise have been sent |
| `call_chair` | `:585` | after the seat check, before `send_chair`. Same `Refuse` arm |
| `call_librarian` | `:774` | **after the out-of-turn arm** (so `mark_owed` is untouched), before `send_chair`. `Deliver` → `trailer_audit` the warning, send the warned text. **The `Refuse` arm is unreachable under `policy()` and is written to deliver anyway** — so a later policy change cannot make this the verb that destroys a hand-back |

**The warning is on the board**, as the packet required: `fn trailer_audit` (`:557`), beside A's `seal_audit` and the
same shape, pushes a row with pane `trailer-gate`. **Its own pane name on purpose:** the line can be about any seat's
message, and A's `seal_audit` names its rows `chair`, which would misattribute a pane's warned hand-back. A
`trailer-gate` row cannot start with `[chair:`, so it cannot inflate `boundary-check.js`'s dispatch denominator.

---

## 3 · RED FIRST, THEN GREEN

Tests and a **stub** `trailer_gate` (always `Deliver { text, audit: None }`, no wiring) went in first, with the mod
line so the crate compiled:

```
$ cargo test --bin consonance trailer
test result: FAILED. 22 passed; 8 failed        (7.0 s, incremental)

  FAILED  chair_inject_without_a_trailer_is_refused_and_the_message_comes_back_whole
  FAILED  call_chair_without_a_trailer_is_refused_and_the_message_comes_back_whole
  FAILED  call_librarian_without_a_trailer_is_delivered_pointer_first_with_a_board_warning
  FAILED  the_audit_line_names_what_was_missing
  FAILED  chair_inject_runs_the_trailer_gate_last_after_the_seal_gate_and_returns_on_refusal
  FAILED  call_chair_runs_the_trailer_gate_before_delivery_and_returns_on_refusal
  FAILED  call_librarian_warns_after_the_out_of_turn_arm_and_can_never_refuse_on_a_trailer
  FAILED  the_librarians_ring_to_the_chair_is_refused                                 (trailer.rs, the policy)
  ok      every_verb_with_a_trailer_delivers_the_message_unchanged_and_posts_nothing   (green on the stub by design:
                                                                                         it guards the fix)
```

**The three behaviours, each proven by calling the decision:** `chair_inject` without a trailer → `Refuse`, reply
contains the message whole and `WHAT A DISPATCH OWES`; `call_chair` → `Refuse`, reply contains the message and
`WHAT A HAND-BACK OWES`; `call_librarian` → `Deliver` with the text **starting with the pointer** and an audit line
that **must exist** (`audit: None` fails with *"a warning nobody sees is the silent-absence class"*).

**The wiring, pinned by position and by arm, on A's precedent** (`body_of`, CRLF-normalised): seal gate < trailer
gate < delivery in `chair_inject`; seat check < gate < delivery in `call_chair`; out-of-turn arm < gate < delivery in
`call_librarian`; the `Refuse` arm of the first two contains both `self.trailer_audit(` and `return Ok(`; and the
`call_librarian` segment between the gate and delivery contains **no `return ` at all**.

**After:**

```
$ cargo test --bin consonance mcp::              test result: ok. 68 passed; 0 failed
$ cargo test --bin consonance trailer            test result: ok. 30 passed; 0 failed   (22 trailer.rs + 8 wiring)
$ cargo test --bin consonance seal_gate_tests    test result: ok. 30 passed; 0 failed   (A's, unchanged)
$ rustc --edition 2021 --test src/trailer.rs     test result: ok. 22 passed; 0 failed   (still builds alone)
$ cargo test --bin consonance -- --test-threads=1
  test ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect ... FAILED
  test result: FAILED. 740 passed; 1 failed; 4 ignored
```

---

## 4 · MUTANTS ON A COPY OF THE CRATE

`scratchpad/wiring/mutants.js`. The copy mirrors the repo's relative layout (`consonance/src-tauri`, `consonance/ui`,
`README.md`, `GUIDE.md`, and `exo_memory/{cards,spread,research,record,SOURCE.md}`), because `tauri-build` validates
`../ui` and the `../../exo_memory` resource globs at compile time; own `CARGO_TARGET_DIR`. Every anchor must match
exactly once — the three verbs' blocks look alike, so anchors inside one verb are matched **within that verb's block**
— or the row is NOT APPLIED. A copy that fails to compile is reported and never counted.

```
BASELINE copy: 30p/0f
W1 chair_inject never runs the gate            29p/1f  chair_inject_runs_the_trailer_gate_last_after_the_seal_gate_and_returns_on_refusal
W2 call_chair never runs the gate              29p/1f  call_chair_runs_the_trailer_gate_before_delivery_and_returns_on_refusal
W3 call_librarian never runs the gate          29p/1f  call_librarian_warns_after_the_out_of_turn_arm_and_can_never_refuse_on_a_trailer
W4 chair_inject refusal delivers anyway        29p/1f  chair_inject_runs_the_trailer_gate_last_after_the_seal_gate_and_returns_on_refusal
W5 call_chair refusal is not audited           29p/1f  call_chair_runs_the_trailer_gate_before_delivery_and_returns_on_refusal
W6 call_librarian refusal returns              29p/1f  call_librarian_warns_after_the_out_of_turn_arm_and_can_never_refuse_on_a_trailer
W7 call_librarian warning not on the board     29p/1f  call_librarian_warns_after_the_out_of_turn_arm_and_can_never_refuse_on_a_trailer
W8 decision: warning carries no audit line     28p/2f  call_librarian_without_a_trailer_is_delivered_pointer_first_with_a_board_warning | the_audit_line_names_what_was_missing
W9 decision: refusal drops the message         28p/2f  chair_inject_without_a_trailer_is_refused_and_the_message_comes_back_whole | call_chair_without_a_trailer_is_refused_and_the_message_comes_back_whole
W10 decision: compliant message is audited     29p/1f  every_verb_with_a_trailer_delivers_the_message_unchanged_and_posts_nothing
P1 policy: call_chair back to warn             28p/2f  call_chair_without_a_trailer_is_refused_and_the_message_comes_back_whole | the_librarians_ring_to_the_chair_is_refused
P2 policy: call_librarian refused              27p/3f  a_pane_hand_back_is_never_refused_for_a_missing_trailer | the_audit_line_names_what_was_missing | call_librarian_without_a_trailer_is_delivered_pointer_first_with_a_board_warning
CONTROL reword a comment                       30p/0f  SURVIVED
SKIP-CONTROL anchor not present                NOT APPLIED — anchor not unique or absent

13 compiled and ran · 12 with a new red test · tracked sources unchanged: true
```

**Every behaviour the packet named has a mutant that breaks it and a test that goes red:** removing the gate from any verb (W1–W3), letting a refusal deliver (W4), dropping a refusal's board line (W5), making `call_librarian` return (W6), dropping its warning from the board (W7), and the decision's own three failure modes (W8–W10). P1 and P2 hold the policy in both directions.

**The first run was not this clean, and the difference is the most useful thing in this section.**

- **W7 SURVIVED.** Replacing the warning's `self.trailer_audit(line)` in `call_librarian`'s Deliver arm with `let _ = audit;` left every test green. My wiring pin searched the whole gate-to-delivery segment for `self.trailer_audit(` — and the unreachable Refuse arm carries that token too. **A warning deleted from the board passed the test written to guarantee it was on the board.** That is A's harness lesson — pin the arm, not the token — and I had written the token form. The pin now requires `self.trailer_audit(` **between the Deliver arm and the Refuse arm**; the real suite is still 30/0; on the rerun W7 is caught.
- **W1–W3 DID NOT COMPILE** on the first run: my replacement put a bare struct literal (`TrailerDecision::Deliver { … }`) in a `match` scrutinee, which Rust rejects. A harness defect, not a code finding; wrapped in parentheses, all three compile and are caught. **They were reported as not counted, never as caught** — which is what the harness exists to guarantee.
- **The first run printed `tracked sources unchanged: false`.** That was my own edit to `trailer.rs`'s header comment, made while the run was in flight; the harness writes only to the copy. The rerun had no concurrent edits and prints `true`.

---

## 5 · WHAT A LIVE CHECK AFTER THE REBUILD ON D MUST SHOW

**Both gates go live at the next rebuild. Nothing here has run inside the app.** A live check is five observations,
each with the thing that would prove it wrong:

1. **A dispatch with no trailer is refused and nothing renders.** The chair's `chair_inject` returns a reply beginning
   *"refused by the NEXT-trailer gate:"* that contains the whole message; the target pane receives **nothing**; the
   board gets one `trailer-gate` row *"chair_inject -> X REFUSED BY THE NEXT-TRAILER GATE: …"*. **Wrong if** the pane
   renders the dispatch, or the refusal has no board row.
2. **A dispatch WITH a trailer is untouched.** Delivered byte-identical, and **no** `trailer-gate` row. **Wrong if**
   a compliant message gains a note or a row — that would be the gate counting the good case as noise.
3. **The seal gate still fires first.** A keyed dispatch with a bad seal *and* no trailer is refused **by the seal
   gate's message**, not the trailer's. **Wrong if** the trailer refusal speaks first.
4. **A librarian ring with no trailer is refused, and the librarian gets its message back.** **Wrong if** the ring is
   delivered, or the reply does not contain the message.
5. **A pane's hand-back with no trailer ARRIVES.** The librarian's pane shows the pointer first and the bracketed note
   after; the board gets *"call_librarian from X DELIVERED WITHOUT A NEXT TRAILER: …"*. **Wrong if** the hand-back is
   refused, held, or arrives without the pointer first — that is the one failure this design exists to make impossible.

**And the number, after one lap live** — `scratchpad/trailer/measure.js` re-pointed at the new lap's window, plus a
count of `trailer-gate` rows by verb. **Read it carefully, because the gate changes what the old number means:** a
refused librarian ring never reaches the board as a delivered message, so **delivered** librarian rings will read
100% compliant **by construction**. The honest measures are **the refusal count on `call_chair`** (how many re-sends
the rule cost) and **the pane rings' trailer rate plus the warning-row count** (the only edge where behaviour, not the
gate, decides). The baseline those have to move is D068's: **6 of 14** messages, **pane rings 1 of 5**, **librarian
rings 0 of 4**.

---

## 6 · WHAT THIS DOES NOT FIX, AND ONE GAP IT OPENS

- **The chair's own stall is still invisible** (D068 §5): *"NEXT: chunk 2 opens"* was the chair's turn text, not a
  verb message. No verb gate sees a hand-off that was never sent.
- **THE GAP, and it is mine from L062: the librarian is now refused by a rule its own shell does not carry.**
  `BUILDING.md` — where both item-6 texts live — is seated only in the chair's shell (`main.rs:6543`,
  `main_intake`). The librarian wakes into `LIBRARIAN.md` (`main.rs:7342`) and panes into `COMMITTEE.md`
  (`main.rs:2865`), and **`grep -c "NEXT:"` returns 0 in both.** In L062 I argued that BUILDING.md being chair-only was
  the point. That held while only the chair could be refused. **Now `call_chair` refuses, and the seat it refuses has
  never been shown the rule except inside the refusal.** The refusal text names the file and shows the shape, so the
  first refusal teaches it — but the librarian's baseline is 0 of 4, so **expect the first live `call_chair` of the
  next lap to be refused.** **Next packet, not this one:** the item-6 sentence into `LIBRARIAN.md` (it is refused) and
  `COMMITTEE.md` (it is warned), in the keeper's words.

---

## 7 · WHAT I DID NOT VERIFY

1. **Nothing ran inside the app.** No rebuild, no relaunch; every behaviour is proven in `cargo test` only. §5 is owed.
2. **The async verb bodies are pinned by position, not executed.** The suite has no async verb tests (it uses `body_of`
   pins and pure functions throughout); I followed that rather than build a server harness. A defect *between* the pinned
   anchors — e.g. a delivered text that is not the gated one — is covered only by the mutants in §4.
3. **The standing composer failure** was not re-run at HEAD without my change. It is `ready_signal_tests`, in `main.rs`,
   where my only edit is one `mod` line, and it is the same test named as the standing red in earlier laps.
4. **`trailer-gate` as a board pane name** was checked only against `boundary-check.js`'s `[chair:` filter. Other board
   readers (`board-digest.js`, `chain-status`) were not checked for how they render an unknown pane.
5. **The `trailer.rs` header edit** landed during the first mutant run and caused its `unchanged: false`; the rerun was taken after it and prints `true`.
6. **Nothing committed.**

---

## 8 · WRONG (mine)

- **W1. My D068 policy grouped `call_chair` with `call_librarian` as "return legs", and protected both from refusal on
  a property only one of them has.** The payload loss is `call_librarian`'s out-of-turn arm; `call_chair` has none.
  **Class: extending a finding about one code path to its neighbour by analogy instead of by reading it.** The chair's
  ruling caught it; I checked it at source before following it.
- **W2. My first `call_librarian` wiring pin looked for `self.send_chair(`, and rustfmt splits that call across two
  lines in that verb** (`self` / `.send_chair(`). The test failed on correct wiring. Re-pointed to
  `.send_chair(ChairCmd::CallLibrarian`, with a comment saying why. **Class: a source pin that assumes formatting** —
  the anchor was a token, not a shape, and A's lesson says exactly that.
- **W3. The L062 placement argument ("BUILDING.md is chair-only, so the rule costs one shell") became a defect the
  moment a second seat could be refused** (§6). Right when written; wrong now; not re-checked when the policy changed
  — until I went looking for where the librarian learns the rule.

- **W4. My `call_librarian` board-warning pin was a token pin, and mutant W7 proved it:** the warning could be deleted and the test stayed green, because an unreachable arm carried the same token. Found by the harness, not by reading my own test. **Class: the exact lesson A filed tonight, in the first test I wrote after reading it.**
- **W5. Three of my first mutants did not compile** (a struct literal in a `match` scrutinee). Caught because the harness refuses to count a non-compiling copy — had it counted "the suite went red", three failed builds would have read as three catches.

---

## 9 · THE ONE LINE

**The gate is wired: a dispatch or a librarian ring without a trailer is refused and handed back whole, a pane's
hand-back is always delivered pointer-first with its warning on the board — and the seat most likely to meet the first
live refusal is the one whose shell has never carried the rule.**

NEXT: librarian re-derive 68/0, 30/0 and the §4 mutant table when you collate D069, then the chair rebuilds on D and runs §5's five checks before the next task opens.
