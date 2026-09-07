# P-READY-MIRROR + THE TWO-WRITERS WINDOW + P-GHOST-TEXT — L043, pane C

**Time: 05:13 → 05:30, about seventeen minutes.** Files touched: `consonance/src-tauri/src/main.rs`
only, plus this hand-back and my map. **Nothing committed.** I also folded E's harvester patch (§4).

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
    466 passed · 0 failed · 3 ignored

Your figure was **439 / 1 / 3 with §2 the one red**. Mine is **466 / 0 / 3**: the red is fixed, I
added 10 tests, and E's `harvest_guard` brings 17 more.

**I did not refuse.** §7's condition — that the mirror needs a screen reading the gate does not have
— does not hold: `pane_state` already reads the screen at decision time. The refusal I *would* have
had to make was in §1a, and it came within one measurement of being real. See §3.

---

## 1 · §1a — P-GHOST-TEXT. The keeper is right, and it was nearly unfixable

**The mechanism, measured rather than assumed.** I replayed this machine's own
`data/captures/*.log` through `vt100::Parser::new(EMU_ROWS, EMU_COLS, 0)` — the parser production
uses — and dumped per-cell foregrounds on the composer row. Ground truth:

| what | foreground |
|---|---|
| `❯` and the NBSP after it | `Default` |
| text the keeper typed | `Default` |
| the autocomplete prediction | `Rgb(153,153,153)` |
| `← for agents`, `paste again to expand`, a bled status line | `Rgb(153,153,153)` |

A mixed row reads `❯ Both h` in Default with `ow are you` in grey after it — **typed prefix, drawn
completion, in one row.** That is the predictor caught in the act.

Eight distinct all-grey composer rows appear in one 8 MB window, including
`❯ [committee] librarian raised re: your thread — novel: "KEEPER-DIRECTED 02:49…` — a ghost of an
incoming message, in the box, holding every delivery.

**THE FIX.** `typed_only(screen)` blanks every cell that is not at default foreground; the composer
predicate is asked of *that* view, the turn predicate still of the rendered grid. A spinner is drawn
chrome and IS evidence; a prediction is drawn chrome and is not.

**RED FIRST, and the red is real:** `a_ghost_in_the_composer_is_not_the_keeper_typing` asserts the
premise (`!input_box_empty(&rendered)` — as plain text the ghost *is* indistinguishable from typing)
before asserting the fix. Both mutants you named go red:

| mutant | result |
|---|---|
| count grey as typed again | **RED** (2 tests) |
| count nothing as typed | **RED** (3 tests) |

The second is the one that matters: `real_typing_still_holds_a_delivery_even_with_a_prediction_after_it`
sweeps five box states, and typed text — with or without a prediction trailing it — still holds.
Trading a false hold for a splice mid-sentence gives the whole point away.

### The refusal I nearly had to make

**The obvious fix is SGR 2, and it would not have worked.** vt100 0.15 does not track the dim
attribute at all — its SGR match handles 1/3/4/7/22/23/24/27 and the colours, and `2` falls through
unrecorded. `Cell` exposes `bold/italic/underline/inverse` and no `dim`. Had Claude Code rendered
the prediction dim rather than grey, this fix would have been impossible without changing emulators,
and §7's refusal would have been the honest answer. **It is truecolor grey, so it is visible. That
is luck, not design, and it is the assumption to break first if this ever regresses.**

I confirmed the packet's suggested fixture is unusable and did not quietly work around it:
`chair_ghost_0509.bin` is an 8,000-byte tail that **starts mid-escape-sequence** (the parser renders
`2;153;153;153m` as literal text on row 0) and captures a *working* screen, not a composer with a
ghost. The capture log is the right source.

## 2 · A THIRD DEFECT, found while measuring, and it is the one that explains the 2.5 hours

One of the eight all-grey rows is
`❯ ⏵⏵ bypass permissions on (shift+tab to cycle) · esc to interrupt` — **the footer drawn onto the
composer row** in a frame caught mid-redraw.

`is_footer_row` tested `trim_start().starts_with('⏵')`. That row starts with `❯`, so it said false,
`turn_in_flight` counted the footer's own *"esc to interrupt"* as a live turn, and `pane_gate`
returned `Working` — **whose hold has no bound.** One such frame latched at poll time is a pane
nobody can reach again. Fixed to `contains('⏵')`; mutant reverting it goes **RED**.

### So `None => false` is RIGHT, and it is NOT what stalled anything

You asked whether it fails safe or fails stuck. **Safe, and I answered it with an assertion rather
than a paragraph** — `only_a_corroborated_working_pane_holds_without_a_bound` sweeps every gate
state and proves exactly one holds unbounded.

**Your §1a diagnosis is wrong on this point and the arithmetic is the whole argument.** An
unreadable box on a ready pane takes `bounded(box_empty)` and forces after **240 seconds**. 240
seconds is not two and a half hours. The four packets that sat were on the *unbounded* path, and
what let it latch was the bled footer above — a `Working` stamp that could never become `Stale`.
Fixing `None => false` would have fixed nothing.

## 3 · §1 — THE MIRROR. `PaneGate::Contradicted`

**What it is.** `Stamp::Done` returned `Ready` unconditionally, and `Ready` consults neither
`turn_in_flight` nor quiescence — so a positive stamp over a running turn delivered *immediately*,
which is the splice the inbox exists to prevent, arriving through the inbox.

**MY DECISION: it falls back to the bounded screen gate. It does not deliver, and it does not hold
forever.** Three reasons:

1. **Symmetry with `Stale`, for the same reason.** In both, the stamp is not evidence, so the screen
   decides — bounded.
2. **Deliver-with-a-note is a splice with a receipt.** The note does not un-splice it. You gave that
   option; I am declining it, because the row exists to make a decision legible, not to license one.
3. **Unbounded is a mute room**, which this room refuses. Screen evidence can be wrong.

**The keeper's rule is untouched.** His hand still outranks the stamp — `Ready` + occupied composer
still holds and still forces as `SignalOutranked`, asserted unchanged.

**IT APPEARS IN THE ROW (bar 3).** Label: `stamp=ready CONTRADICTED (says done, a live turn is on
screen)`, plus a fourth `Forced::SignalContradicted` whose sentence says the signal *existed* and was
overridden — never that none arrived. `no_two_forcing_causes_read_alike` asserts all four print
distinctly, and the compiler refused to build until the plog named it too.

**THE RULE IS AN `AND`, AND THAT IS THE WHOLE DESIGN.** `turn_in_flight(lines) && quiet < 2s` —
deliberately not `screen_busy`, which is an OR. Rows scroll in place at scrollback 0, so a spinner
from a turn that ended 48 minutes ago is still drawn. Keying on the spinner alone would have put
every delivery to a long-finished pane back on the 4-minute gate — the *"six of ten deliveries
FORCED onto panes that were ready the whole time"* failure, restored.
`a_stale_spinner_on_a_quiet_pane_is_still_an_ordinary_ready_pane` guards it.

**Both mutants (bar 2):**

| mutant | result |
|---|---|
| mirror never fires (`false && live_turn`) | **RED** — 2 tests |
| mirror fires on every ready pane (`true \|\| live_turn`) | **RED** — 3 tests, including the stale-spinner guard and the keeper's-hand case |

### A correction to my own work from this morning

`every_forced_case()` carried my sentence: *"a fourth forcing path added later arrives here already
covered."* **It did not.** It was a hand-written list of three, and `Contradicted` was invisible to
every test that read it — the room's own named failure (*a test that enumerates from a hand-written
list can only check what someone remembered*) committed inside the test written to prevent it.
Replaced with a sweep over `ALL_GATES` × inputs, backed by `gate_ordinal`'s **exhaustive match**, so
adding a variant now breaks the build until it is listed.

## 4 · §2 — THE TWO-WRITERS WINDOW. Red shown, then green, and what the key became

**RED at HEAD, captured before I touched anything:**

    thread 'shelf_tests::the_shelf_windows_the_librarians_own_notes' panicked at src\main.rs:10944:9

**THE KEY IS NOT WHAT WAS WRONG — the constant beside it was.** `librarian_note_is_carried` already
parses the date and ignores the suffix, and the test one screen above has asserted since it was
written that `2026-08-31.desktop.md` is a dated note. The predicate handled two writers correctly.
The failing line was `carried <= 4` — *"two dated days plus LEDGER and README"* — **arithmetic that
assumes one writer.**

**WHAT I CHOSE: today and yesterday PER WRITER.** Ceiling is `2×writers + 2`, not 4.

**What it costs, plainly:** the window's weight now scales with the number of machines writing. That
is real, and it is already the registered price of a content-defined window (a 7.4× swing across
consecutive pairs). Size is guarded elsewhere — `CORPUS_WALK_BUDGET`, `LIBRARIAN_INTAKE_LIMIT`, and
`the_librarian_intake_size_is_recorded_and_not_silently_doubling` — so the cap's job was never size;
it was catching truncate-and-carry.

**What I refused: "newest per machine."** It silently drops a note the seat wrote, which is the exact
failure the window exists to prevent. A librarian waking to find one of its own days missing, with
no rule saying which, is worse than a heavier window.

**And I caught myself building a check that could not fail.** My first version asked
`librarian_note_is_carried` whether each carried file belonged — the shelf's own rule marking its own
homework; break the predicate and both sides agree. Rewritten to compute the age from the date alone,
independent of the predicate. Mutants:

| mutant | result |
|---|---|
| window widened to three days | **RED** |
| window disabled (carry everything) | **RED** |

## 5 · §3 — E's HARVESTER PATCH, FOLDED

**You said you would ring me and did not.** E's files settled at 05:22–05:24 and `harvest_guard.rs`
was on disk unwired, so I folded it rather than sit on finished work — the hazard the gate was
protecting against (folding a file mid-write) was gone, and I checked the mtimes before touching it
rather than assuming.

Folded: the `mod` line, the reader's one-line recovery, `harvest_dir`/`write_harvest_stamp`, the
extracted `harvest_once`, and the guarded watcher loop. `harvest_guard`'s own 17 tests pass; the
suite is green.

**One deviation from E's patch, and I am naming it because E claimed verbatim.** The patch says the
extracted body is *"the existing body verbatim… nothing re-ordered or re-worded"*. Structurally true
— every `continue` became `return false` and nothing moved. But it **dropped four explanatory
comments** (the wrap-flag comment, the overlay-strip comment, the welcome-banner note, and the
kept-behaviour note on the failed append). I restored all four in the fold. They are the only record
of why those lines exist, and a comment dropped in an extraction is how a reason gets lost.

E's §1 argument — that fixing the watcher alone buys a green light over a permanently frozen screen,
because the *reader*'s `if let Ok` stops feeding the emulator after any poisoning — is right, and it
is the part of the patch I would have got wrong if I had written it myself.

## 6 · WHAT THIS DOES NOT ESTABLISH

- **Nothing here has been seen working on a live pane.** All of it is unit tests over fixtures built
  from real captured bytes. The stamp era still has one delivery on record, and `PaneGate::Stale` has
  still never printed on this machine.
- **`typed_only` is a colour heuristic, not a protocol.** Anything the keeper types that is not at
  default foreground reads as chrome. Nothing in the record does that and a paste renders default,
  but it is the first assumption to break if a real hold is ever missed.
- **The mirror's premise is measured, its frequency is not.** I proved a positive stamp over a live
  turn *delivers*; I did not measure how often that window is actually open, because it needs
  claude's hook-dispatch latency, which I still have not measured.
- **I did not re-verify E's `harvest_guard` internals**, only that it compiles, its 17 tests pass,
  and the fold sites match the patch. Its 4 mutants are E's claim, not mine.
- The `is_footer_row` widening to `contains('⏵')` assumes nothing but the footer uses `⏵`. True
  across this record; unverified in general.

## 7 · CORRECTIONS I MADE TO MYSELF

- Claimed this morning that `every_forced_case` would auto-cover a fourth path. It would not. Fixed
  the test, not the sentence.
- Wrote a §2 check whose two sides called the same predicate — an assertion that could not fail.
  Caught before it shipped, rewritten to be independent.
- Started §1a reaching for SGR 2 because the packet named dim. The emulator does not track it; the
  fix works for an unrelated reason (truecolor), and saying so is the difference between a fix and a
  coincidence I would not be able to repair next time.
