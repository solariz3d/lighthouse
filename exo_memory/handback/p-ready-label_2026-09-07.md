# P-READY-LABEL — the row that asserted a fact and its negation

Pane C · 2026-09-07 · files touched: `consonance/src-tauri/src/main.rs` only. Nothing committed.

Every figure below re-derives from a command printed beside it.

---

## 1. The hypothesis in the brief is REFUTED, and the real cause is worse in a more useful way

The brief's hypothesis: *"the LABEL was computed at a different moment from the DECISION, so it
printed the stamp's later state beside a decision made on its earlier one."*

That cannot happen, and the code says so in one read. `drain_inboxes` calls `pane_state` **once**
per pane per tick and hands the same `gate` value to `take_ready` (the decision) and to the row
(the label):

```
sed -n '7700,7716p' consonance/src-tauri/src/main.rs      # one `let (gate, …)`, two uses
```

There is one moment. There is no flip to construct.

**And the board proves it independently of the code.** The same message's QUEUED row, four minutes
earlier, also read `stamp=ready`:

```
grep -o '"text":"QUEUED -> [^"]*"' /c/Consonance/data/board.jsonl | tail -1
grep -n "the gate never got a positive ready signal" /c/Consonance/data/board.jsonl
```

    QUEUED    ts=1788763716180   (1 waiting, stamp=ready)
    DELIVERED ts=1788763956456   [stamp=ready] (FORCED …)

**240,276 ms apart — the full `MAX_HOLD_MS` bound plus one tick.** The gate read `Ready` at the
door and `Ready` at the drain. The stamp was positive for the entire four minutes.

### What actually happened

`Drain::Forced` had **three** producers and the sentence named **two**.

```rust
PaneGate::Ready              => bounded(box_empty),    // ← this one had no sentence
PaneGate::Working            => Drain::Hold,
PaneGate::Stale | Unstamped  => bounded(screen_idle),  // ← the sentence was written for these
```

The chair's pane was `Ready` by its own stamp and its **composer was not clear** — the keeper's
rule of 2026-09-02, that his hand outranks the stamp, and the one place a ready pane keeps a
bound. It held four minutes on the composer and then forced. Both halves of the row were true
about their own fact. The row was false, and **no function owned the row to be false in.**

### The part that is mine to own

`the_keeper_typing_still_holds_a_pane_that_says_it_is_ready` — my own test, shipped yesterday in
P-READY-SIGNAL — already asserted `Ready` + occupied composer → `Forced`. **The code knew about
the third path, was tested on it, and the sentence was written as though it did not exist.** I
wrote both, an hour apart. This is not a missed case; it is a case I proved and then described
wrongly in the same file.

---

## 2. What I built

**`Drain::Forced` now carries `Forced`**, bound at the branch that knows the cause, so a force
cannot be printed without saying why:

| cause | when | the row |
|---|---|---|
| `SignalOutranked` | stamp positive, composer never cleared | `[stamp=ready] (FORCED … the pane's own signal said ready; its composer never cleared)` |
| `NoUsableSignal` | stale or absent stamp; the screen gate carried it | `[stamp=STALE …]` / `[NO STAMP …]` `(FORCED … the gate never got a usable ready signal)` |

**One function owns the whole sentence** — `delivery_note(gate, forced)`. Both halves were
independent strings before; that is the defect at its root, and it is now structurally impossible
for a caller to compose them into a reading neither makes.

### Why I did NOT take the brief's suggested fixes

- **"Drop the tag on any forced delivery"** deletes a *true* fact — and the one the reader needs.
  `stamp=ready` on that row is what makes it say *the keeper had something in his composer for
  four minutes*, rather than *the ready signal is broken*. Deleting a true fact so it cannot be
  misread is how the row lost its meaning to begin with.
- **"Print both moments"** would manufacture a distinction that does not exist. There is one read.
  A row printing two would be a second false sentence, this time about the architecture.
- **"Label the decision rather than the file"** is what this does — but the decision's state *is*
  `ready`. Naming the FORCE's cause is the part that was missing, not the gate's name.

**The plog had the identical defect one level down.** Its guard was `forced && !gate.is_stamped()`,
which filters out the outranked cause — so the one delivery that has ever forced on this machine
wrote **nothing** to the log. Now every force logs, with its cause.

---

## 3. Tests: 4 added, and honestly, only 2 are red-first

Measured, not asserted — I reverted the wording, re-ran, and restored it:

| test | red on the old wording? |
|---|---|
| `no_delivered_row_claims_a_ready_signal_and_denies_one` | **RED** — reproduces the live row verbatim |
| `the_three_forced_rows_each_name_their_own_cause` | **RED** |
| `a_reason_can_only_come_from_the_gate_that_owns_it` | green both arms — a guard on the new type, not a proof |
| `an_unforced_row_carries_no_forced_clause` | green both arms — guards the 43-of-47 ordinary row |

The red-first run, verbatim:

```
thread 'ready_signal_tests::no_delivered_row_claims_a_ready_signal_and_denies_one' panicked:
ready, composer occupied: one row, two contradictory facts:
[stamp=ready] (FORCED after the bounded hold — the gate never got a positive ready signal)
```

**The first test builds every forced case by asking `drain_decision`, never by naming a variant.**
It did not have to change between the red run and the green one, and a fourth forcing path added
later arrives already covered.

Three existing `== Drain::Forced` assertions had to name their reason. That is the type change
forcing them to say more, not a weakening: `the_keeper_typing_still_holds…` now asserts the force
is `SignalOutranked`, which is the exact fact the board got wrong.

```
cargo test --bin consonance ready_signal   # 13 passed, 0 failed
cargo test --bin consonance inbox_tests    # 14 passed, 0 failed
cargo test --bin consonance                # 439 passed, 1 failed  (see §6)
```

---

## 4. The stale case: covered in tests, NEVER exercised live — and the row is where it was missing

`pane_gate` has told stale from working since it shipped (`a_stale_stamp_and_a_working_pane_do_not_read_alike`,
`a_pane_killed_mid_turn_does_not_become_unreachable`). So the answer to the brief's question is
**yes at the gate**. But:

```
grep -o '"text":"DELIVERED -> [^"]*STALE[^"]*"' /c/Consonance/data/board.jsonl | wc -l   # 0
grep -c '"text":"DELIVERED -> ' /c/Consonance/data/board.jsonl                            # 47
```

**Zero STALE rows in 47 deliveries.** The distinction existed everywhere except where a person
reads it, and all three causes printed one sentence. `the_three_forced_rows_each_name_their_own_cause`
now asserts the stale row is nameable, because otherwise it is asserted nowhere.

**And the stamp era has exactly ONE delivery on record** — the first row carrying any `[stamp…]`
tag is the row the brief is about, `2026-09-07T06:52:36Z`. Every conclusion about this mechanism's
live behaviour rests on n=1. I am not going to dress that up.

---

## 5. REGISTERED, NOT FIXED — the gate does not know about its own writes

Found while in here. **Measured**, with a throwaway probe I then removed:

    PROBE gate over (ready stamp + live spinner + 200ms quiet) = Ready
    PROBE decision = Deliver
    PROBE screen-only verdict would have been = false

**A positive stamp over a screen with a live turn in flight delivers IMMEDIATELY, with no screen
check at all.** `PaneGate::Ready => bounded(box_empty)` consults neither `turn_in_flight` nor
quiescence. `PaneGate::Stale` catches a working-stamp-over-idle-screen; **there is no mirror** for
ready-stamp-over-busy-screen, and the mirror is the splice case — the failure the whole inbox
exists to prevent.

It is reachable by the gate's own action. Two channels, one cause:

1. **The stamp has not flipped yet.** We inject, the pane submits, its UserPromptSubmit hook writes
   `ready:false`. The hook process costs **75–81 ms** (n=5, isolated:
   `CONSONANCE_PANE=probe CONSONANCE_READY_DIR=$TMP node dev/shell/hooks/ready-prompt.js`) — plus
   claude's own hook dispatch, **which I did not measure**. The drain ticks every 250 ms. Whether
   a second queued message beats the stamp therefore depends on a quantity I have not measured, and
   I am not claiming it does.
2. **`last_byte` has not moved yet.** `inject_to_pane` writes to `sess.writer`; `last_byte` only
   advances when the pane *echoes*. So for one round-trip the gate's quiescence clock still reads
   the pane as long-idle after we have already written to it. This one affects the **pre-stamp
   paths too** — `Stale` and `Unstamped` both gate on `screen_idle`.

**Consistent, but NOT evidence:** four live back-to-back deliveries into one pane, 411/411/418/429 ms
apart (`2026-09-02T13:55`, `2026-09-06T08:10/08:11 ×3`). All four **predate the stamp**, so they
cannot be attributed to channel 1. They are consistent with channel 2 and nothing more.

**The fix I would write, and did not.** Not a timer — a causal fact: record the instant we write to
a pane, and treat a stamp whose `at` predates our write as not-yet-usable (hold, bounded). Constant-free,
and it needs `parse_stamp` to read `at`, which it currently discards.

**Why it is not in this packet.** It is a change to *delivery semantics*, not to a label, and it
belongs behind its own red-first attack. Landing it inside a label fix would mean the chair scores
two changes as one, an hour before the acceptance proofs — and the naive version of it (consult
`turn_in_flight` on the Ready path) would put every ready delivery back on the screen gate and undo
P-READY-SIGNAL. It needs a decision, not a patch.

---

## 6. Reported, not touched: one test is red at HEAD and it is not mine

```
cargo test --bin consonance the_shelf_windows_the_librarians_own_notes
  → 5 librarian files carried; the window allows at most 4 (today, yesterday, LEDGER, README)
```

`git diff consonance/src-tauri/src/main.rs | grep "shelf\|dirs_guard"` is **empty** — my diff
touches neither module. The window matches by date prefix and `exo_memory/librarian/` now holds
`2026-09-06.desktop.md` **and** `2026-09-06.md`, so yesterday counts twice (plus `DOSSIER.md`,
which no window arm names). **A test that reads live corpus state goes red on ordinary filing.**

Also: `dirs_guard_tests::a_panicking_writer_still_puts_dirs_back` failed in the full run and
**passes alone** — parallel pollution against a global, not a real failure. Both times I checked
before blaming my change, and both times the answer was that it was not mine.

---

## 7. What this does NOT establish

- That the fix is right **live**. It is right in 13 unit tests over fake screens. The stamp era has
  one delivery on record; nothing here has been seen working on a real pane.
- That three forcing causes is the complete set. It is the complete set *of the current match arms*,
  and the invariant test will fail loudly if a fourth is added without a sentence — which is the
  most I can honestly claim.
- Anything about §5's channel 1 firing in practice. Unmeasured, and named as unmeasured.
- That the composer read false for the right reason on 06:52. `input_box_empty` returns `false` both
  when the keeper is genuinely typing **and** when no composer row is found at all. The row cannot
  currently tell those apart, and I did not split them — a fourth cause needs its own evidence.

## 8. Corrections I made to myself

- I set out to fix "the label lied about a moment" and had to abandon it: the two moments are one
  read. Refuting the brief's hypothesis was the finding, and I nearly built the fix it asked for.
- My first red test used `matches!(d, Drain::Forced { .. })` and a hardcoded `forced: true`. That
  would have proved the wording changed without proving the *cause* reached the row. Rewritten to
  destructure the real reason out of `drain_decision`.
- I claimed red-first for four tests before measuring. Two of them pass on both arms. Corrected
  above rather than quietly rounded up.
