# P-COMPOSER-TRISTATE — hand-back (pane E, D074 composer lap 1, on D)

Packet: `exo_memory/loop/plan_composer_predicate_2026-09-19.md` @1ead762, row E (line 17) and the falsifier
(lines 26-28), read at source. Written 2026-09-19 ~01:1x by the E seat. **Nothing committed. Nothing built for
release, nothing relaunched** — the live app (pid 18840) still runs the old gate.

## 0 · Headline

**Built as specified, no decision changed, and the bar is met in every line but one I rule on in §5.**

    consonance/src-tauri/src/main.rs   +636 / -34   (238 lines of code, 398 of tests)   sha256 64e40db2...0fd7
    4 new fixtures in consonance/src-tauri/fixtures/screens/, all cut from this machine's real captures
    cargo test --bin consonance (in place)    769 passed · 1 failed · 4 ignored    = 746 + 23 new; the 1 is the known red
    red first (stage-1 stubs)                 11 of the first 18 new tests red, each at its intended assertion
    mutants (scratch copy)                    19 applied, 19 caught · 0 SURVIVED · + P0 no-op clean · X20 control NOT APPLIED · 0 INVALID

**The finding that matters more than the build, and C reached it too, from the other side:** on a real screen the
tri-state reads a dim prompt suggestion as **HAS TEXT**. `composer_placeholder_reads_as_text_2026-09-19.bin` is a
fresh pane's `Try "how do I log an error?"`, drawn `ESC[2m`; vt100 0.15 drops SGR 2, `typed_only` keeps it, and an
EMPTY composer reads as text. That is C's mechanism (`handback/p-delivery-census-C_2026-09-19.md`, filed at d997a2c)
met from a frame scan instead of from transcripts. I found it before reading anything of C's, and I have read only
the librarian's summary of C, not C's file (§6). Which of us saw it first I do not know and do not claim. **Consequence for the plan's falsifier:** "has text dominating" can NOT be read off this tri-state as the
keeper's hand. HAS TEXT means *the gate read text*; on D it is mostly the suggestion. So the forced row no longer
says "its composer never cleared" even when every reading was text — it says **"never read clear — read as text"**,
which is what the gate actually knows.

## 1 · What changed

    enum Composer { Empty, HasText, Unreadable(Unreadable) }
    enum Unreadable { NoRow, GridMismatch, NoScreen }
    fn composer_state(rendered, typed) -> Composer         the logic that was inside input_box_empty, unchanged
    fn input_box_empty(rendered, typed) -> bool            now composer_state(..).is_empty(); signature and doc kept
    Composer::is_empty                                      THE one place the three answers collapse to the gate's bit
    struct Reads { empty, text, no_row, grid_mismatch, no_screen, last }   every reading of one message's hold
    Inbox::note_reading(pane, composer)                     records a reading on EVERY message queued for that pane
    Inbox::take_ready_read(..) -> (.., Reads)               take_ready is now a view of it - one decision, not two
    pane_state -> (gate, box_empty, screen_idle, Composer)  box_empty DERIVED from the Composer, once, inside
    delivery_note_with(gate, forced, Option<&Reads>)        delivery_note is now delivery_note_with(.., None)
    drain_inboxes                                           note_reading before the take; the row and the plog built from the Reads

**`drain_decision` is not touched.** Its inputs are the same bit from the same screen, so every decision is the
old one by construction; §3 is the evidence that the construction holds.

**The row, as the board will read it** (strings pinned by tests; the full forms are in `delivery_note_with`):

PRINTED by the built code, not typed by me (a throwaway test appended to the scratch copy only,
`scratchpad/mut/print_rows.rs` -> `scratchpad/mut/rows.txt`; 960 readings = 240 s of 250 ms ticks):

    [stamp=ready] (FORCED after the bounded hold — the pane's own signal said ready; its composer never read clear — read as text on all 960 readings; at the bound: text)
    [stamp=ready] (FORCED after the bounded hold — the pane's own signal said ready; its composer could not be read on any of 960 readings (no composer row on 960); at the bound: could not be read (no composer row))
    [stamp=ready] (FORCED after the bounded hold — the pane's own signal said ready; its composer did not read clear when the bound ran out — read as text on 3, could not be read on 2 (no composer row on 2) of 5 readings; at the bound: text)
    [NO STAMP — fell back to the bounded screen gate] (FORCED after the bounded hold — the gate never got a usable ready signal; composer: read as text on 1, read empty on 1, could not be read on 1 (no composer row on 1) of 3 readings)
    [stamp=ready CONTRADICTED (says done, a live turn is on screen)] (FORCED after the bounded hold — the pane's signal said ready and a live turn stayed on screen; the screen gate carried this; composer: could not be read on 2 (no screen on 2) of 2 readings)

With no readings recorded the row is the old one exactly (`with_no_readings_every_row_is_the_old_row`), except the
CONTRADICTED row, which lost its nineteen blanks (below).

**The plog line for an outranked force** said *"This is the keeper's rule firing"*. It now says the ready signal
did not fail and the composer rule held it, *"Text read there may be the keeper's or a dim prompt suggestion - the
gate cannot tell"*, or — where any reading was unreadable — that the hold is the gate's unknown-holds rule, **not
the keeper's hand**.

**Fixed in passing, in text I own:** the CONTRADICTED row carried **nineteen literal blanks mid-sentence**
(`"...a live turn                   stayed on screen..."`) — a lost `\` continuation. Pinned by
`no_forced_row_has_a_run_of_blanks_in_it`, which was red on the old text.

## 2 · Why these rulings, where the bar was silent

- **A tally over the whole hold, not the reading at the bound.** "Its composer never cleared" is a claim about 240
  seconds. The reading at the moment the bound ran out is one 250 ms tick of it; a sentence built from that tick
  alone would say "could not be read" for a hold that read text for four minutes and lost the row on the last tick,
  or the reverse. The tally costs five counters per queued message; the last reading is still named, as
  "at the bound: ...", because that is literally "which case it was" when it forced.
- **Every queued message collects the reading, not only the head.** The second message's bound starts when IT was
  queued; if it only counted readings once at the front, a message forced on its first tick at the front would
  report one reading for a four-minute hold.
- **A THIRD unreadable reason the plan did not name: `NoScreen`.** `pane_state` has always had an arm for "no
  screen at all" (`live_screen` returned None) that hands the gate `false` — the same bit as text. It forces as
  NO STAMP, never as outranked, but it is unreadable and the row can now say so. Test:
  `a_pane_with_no_screen_reads_unreadable_no_screen_and_still_holds`.
- **`GridMismatch` is unreachable in production and I say so in the code.** `live_screen` builds both grids from
  one lock, one screen, one size. It is kept as a value, not a panic, and tested on a constructed pair.
- **One more unreachable arm, named not hidden:** `composer_row` only returns a row that `is_empty_box` or
  `is_prompt` accepted, and both demand a leading marker, so "a composer row with no marker" cannot happen. It maps
  to `NoRow` with the reason in a comment.
- **`delivery_note` and `take_ready` kept, not deleted**, because existing tests call them - 4 call sites of `delivery_note` (`:15244`, `:15270`,
  `:15328`, `:15392` at HEAD) and 5 of `take_ready` (`:16127`-`:16152`). They are now views, and production no longer calls them — which is why
  `the_old_row_invariants_hold_with_readings_too` exists: the two old row invariants (no row claims and denies a
  ready signal; no two causes read alike) were guarding a path the app stopped taking, so they are re-asserted with
  readings. Cost: two dead-code warnings in the non-test build (`delivery_note`, `take_ready`), the pattern the file
  already carries for `depth` and `is_stamped`. Measured: `cargo check --bin consonance` in the scratch copy,
  HEAD's main.rs 8 warnings, this text 9 (`take_ready` joins `depth` in one existing warning; `delivery_note` is new).

## 3 · No behaviour change — the evidence

- **An oracle, not a tautology.** `old_input_box_empty` in the test module is the pre-lap body verbatim.
  `the_bit_the_gate_decides_on_is_unchanged_on_every_screen` asserts both `input_box_empty` and
  `composer_state(..).is_empty()` equal it on all six real fixtures (the four new at 43x99, the two older at their
  own geometries, **the known-red slash screen included**), a constructed grid mismatch, rendered-as-typed, and no
  rows. **My first draft compared `composer_state(..).is_empty()` to `input_box_empty` — which is now defined as
  that. It could not fail.** Caught while writing the mutant list, before any mutant ran.
- **At the caller.** `pane_state_hands_the_gate_the_old_bit_and_the_reading_beside_it` drives `pane_state` itself
  with a real `EmuState` fed each fixture (pane id with no stamp file; nothing on disk is written).
- **At the inbox.** `take_ready_read_decides_exactly_as_take_ready` sweeps 5 gates x box x idle x 4 waits x
  enabled = 160 cases, the second inbox carrying a reading, and requires the same answer on every one.
- **Mutants T4, T14, T15 are behaviour changes on purpose** (unreadable counts as empty; no screen counts as
  empty; the gate always handed "not empty"). All three caught — §4.

## 4 · Mutants

    node scratchpad/mut/mutants.js        each on a FRESH copy of the pristine main.rs (sha256 64e40db2...0fd7)
                                          in a scratch copy of the crate with its own CARGO_TARGET_DIR; the WHOLE
                                          bin suite each time; an anchor must match exactly once or NOT APPLIED;
                                          a mutant that does not compile is INVALID, never caught

    P0   no-op: the pristine text                          nothing beyond the baseline fails (the control that the baseline is right)
    caught  T1   no row reads HAS TEXT (the old collapse)            by the dialog fixture, no-rows, pane_state
    caught  T2   grid mismatch reads NO ROW                          by two_grids_of_different_sizes_...
    caught  T3   empty and text swapped                              by 5 new tests + 15 existing ready_signal tests
    caught  T4   BEHAVIOUR CHANGE: unreadable counts as empty        by the oracle sweep, pane_state, and 2 EXISTING tests
                                                                       (a_screen_with_no_prompt_row_at_all_holds,
                                                                        a_prompt_row_with_no_rule_above_it_is_not_the_composer)
    caught  T5   a reading reaches only the head                     by a_reading_reaches_every_message_...
    caught  T6   the take forgets the readings                       by 2 inbox tests
    caught  T7   an empty tally is not filtered to the old row       by with_no_readings_every_row_is_the_old_row
    caught  T8   an all-unreadable hold falls to the mixed wording   by an_outranked_hold_the_gate_could_not_read_...
    caught  T9   "never read clear" whenever ANY reading saw text    by the mixed test and empty_readings_are_counted_not_dropped
    caught  T10  the reading at the bound misnamed                   by the_reading_at_the_bound_is_named
    caught  T11  no-row readings counted as grid mismatch            by 3 tests
    caught  T12  drain_inboxes records no reading                    by drain_inboxes_records_each_reading_... (source shape)
    caught  T13  drain_inboxes builds the reading-blind row          by the same
    caught  T14  BEHAVIOUR CHANGE: no screen counts as empty         by a_pane_with_no_screen_reads_unreadable_no_screen_...
    caught  T15  BEHAVIOUR CHANGE: the gate always handed "not empty" by pane_state_hands_the_gate_the_old_bit_...
    caught  T16  the other two forced rows lose the composer clause  by the_composer_clause_rides_on_the_other_two_forced_rows
    caught  T17  empty readings dropped from the counts              by empty_readings_are_counted_not_dropped
    caught  T18  the last reading is never recorded                  by 2 tests
    caught  T19  the nineteen blanks come back                       by no_forced_row_has_a_run_of_blanks_in_it
    NOT APPLIED  X20  control: an anchor that is not in the file

    19 applied: 19 caught · 0 SURVIVED · 0 INVALID  (+ P0 clean, + X20 NOT APPLIED)      full per-mutant lists: scratchpad/mut/mutants-run.txt

**T17 SURVIVED the first run, and the first run's table said "caught".** On the text before
`empty_readings_are_counted_not_dropped` existed, T17 was reported caught by `a_panicking_writer_still_puts_dirs_back`
— a test nothing here touches, failing once, and passing in P0 and in all 19 other runs. A flake credited as a kill.
No test of mine pinned the empty count; I added one and re-ran ALL twenty on the final text (above). The first table
is kept at `scratchpad/mut/mutants-run-1.txt`. **A catch by a test with no path to the mutant is not a catch.**

**Baseline of the copy, measured, not assumed:** the pristine text in the scratch copy fails THREE tests, not one —
the known red plus `repo_root_tests::the_checkout_resolves_wherever_this_source_actually_is` and
`managed_cwd_tests::the_map_walk_reaches_the_repo_maps_when_no_data_dir_map_exists`, both because the copy is not a
git checkout. All three are the baseline; P0 (the pristine text, no change) reports nothing beyond them.

## 5 · The fixtures, and the one line of the bar I rule on

    scratchpad/vtdump/target/release/scan.exe <log> <rows> <cols> [carve]      (source: scratchpad/vtdump/src/bin/scan.rs)
      replays a capture in 256-byte chunks, classifies EVERY frame with the same predicates (capture.rs included by
      path, composer_row copied verbatim), and in carve mode lists, for each ESC[2J in the log, the first frame of
      each class after it

    fixture                                          source log (C:/Consonance/data/captures/)   bytes              reads
    composer_empty_2026-09-19.bin                    12fb81f6-...-f0cdce091925.log              1057703..1058983   Empty
    composer_unreadable_trust_dialog_2026-09-19.bin  12fb81f6-...-f0cdce091925.log                   77..1357      Unreadable(NoRow)
    composer_has_pasted_text_2026-09-19.bin          0845a868-...-431e0c088fb1.log              1571993..1583001   HasText
    composer_placeholder_reads_as_text_2026-09-19.bin 12fb81f6-...-f0cdce091925.log             1054947..1057217   HasText (THE DEFECT)

    sha256  4cca6b60...db4f  4de9ad9c...6918  71307ac0...b011  709ffcab...78ba   (same order)

**Every fixture starts at a clear-screen**, so it replays the same wherever it runs. **The `None` screen is the
trust-folder dialog**: a `❯ No, exit` row with no separator rule above it — a real dialog covering the composer, the
exact case "never cleared" misnamed. The HAS-TEXT screen is `❯ [Pasted text #1 +6 lines]` — a paste sitting in the
composer, the delivery case itself. Readable text in all four checked before they entered the repo: Claude Code's
banner, instance paths, a usage-limit line; nothing else.

**Geometry is read off the frames, and it had to be.** My first scan of 12fb81f6 at the log's max cursor address
(64x103) read **20,758 of 20,767 frames as no-row** — the separator rule is 99 cells, so at 103 the `❯` wrapped
onto the rule row. At 99 the same log reads 17,931 empty, 154 text, 8 placeholder, 1,091 no-marker and 1,583
marker-without-rule (`scan.exe <log> 64 99`). **Those counts are the tool that found the fixtures, not a
measurement of holds** — one fixed geometry across a log that resized, and 256-byte chunks are not gate ticks. C's
census is the measurement.

**THE RULING: the plan says "including one screen where `composer_row` returns `None`", and the obvious candidate
was the known-red slash screen — it returns `None` on D.** I did not use it for that. It returns `None` on D and
`Some` on L (green in L053's hand-back, 513/0/4, `handback/p-composer-anchor_2026-09-09.md:128,158`; red on D since
09-09, `handback/p-seat-sweep_2026-09-09.md:133`, and "the same D-only failure" in
`handback/p-diverged-read2-C_2026-09-14.md:152-156`). On D its replay at 21x98 draws the `❯` at column 15 of a rule
row — a torn screen. The fixture bytes are identical to the git blob here (sha256 a7a276c4...5a0b, both), and
vt100 0.15.2 / unicode-width 0.1.14 are pinned in Cargo.lock, so **the L/D difference is not the bytes and not the
dependency versions; I did not find what it is.** A None-fixture that is None on one machine only would make my
test red on L. The trust dialog is None by structure on every machine. The slash screen stays where it was, named
and untouched; my sweep includes it only to show the bit is unchanged on it.

## 6 · Corrections, including mine

- **The tautological oracle** (§3) — the one that would have mattered: a no-behaviour-change guard that could not
  fail, which is the class this room keeps finding.
- **My test's word order was wrong, not the code:** `the_composer_clause_rides_on_the_other_two_forced_rows`
  expected `could not be read on 3 of 3 readings (no screen on 3)`; the format I built puts the reasons before the
  total. The test was written before the formatter and I changed the test, and I say so because that is the
  direction that can hide a bug. The assertion now pins the full produced clause.
- **I broke an unrelated test and it was right to break:** `leave_wiring_tests::no_string_the_app_can_show_claims_
  it_stops_a_restart` lexes main.rs by splitting on EVERY `"` — global parity. My `"Try \""` added three quote
  characters, flipped the parity for the rest of the file, and code became "strings" (`block_shutdown` matched).
  Fixed on my side (no escaped quotes; `"` count 8,804 at HEAD, 9,090 in the final text, +286, even — a `node -e` count
  beside the edit). **The lexer's fragility is pre-existing and not mine**: any odd quote count anywhere in main.rs
  turns every later line of code into a string for that test. Flagged, not fixed.
- **"Text in it" was my first wording** for an all-text hold. C's finding made it false on D: the text is mostly a
  suggestion nobody typed. Reworded to "read as text" before the mutants ran; the plog's "the keeper's rule firing"
  went with it.
- **Order of reading:** I found the placeholder in my own scan before opening anything of C's; I then read the
  librarian's entry at d997a2c (which summarises C) and did not open C's hand-back. Two vantages, no
  shared file, the same mechanism.
- **Bash ate a script twice** (a heredoc with an apostrophe; an escape written as a raw ESC byte into scratch Rust).
  Both caught before anything relied on them; repo text was edited only through the Edit tool or a Write'd node
  script with anchors that must match once. `main.rs` has 0 ESC bytes (`grep -c $'\x1b'`).

- **One byte outside the packet, in my own file:** `exo_memory/map/E.md` carried a BACKSPACE (0x08) at HEAD, in an
  older entry of mine (line 988) — an escape layer had eaten `C:\build\lighthouse-target` into `C:` + BS +
  `uildlighthouse-target`. Found by the control-byte scan after appending this lap's line; restored to the path.
  My first repair attempt went through the same escape layer and wrote the backspace back; the second was a
  Write'd script with the backslash as a char code. `git diff exo_memory/map/E.md` shows the one-line change.

## 7 · NOT verified

- **Nothing ran in the live app.** The tri-state, the tally and the new rows have never produced a board row. The
  first real forced delivery after a rebuild is the first real test; the rebuild is not this packet's.
- **`drain_inboxes` is asserted by source shape**, not by running it (it needs an AppHandle). The order
  note-before-take and the row's argument are pinned; the loop around them is not exercised.
- **The dim-suggestion defect is pinned, not fixed** — no behaviour change this lap, by the plan. HAS TEXT on D
  mostly means the suggestion, so lap 2's "has text dominating" arm of the falsifier needs C's census, not these rows.
- **The slash screen's D/L difference** is undiagnosed (§5).
- **The fixture geometry 43x99** is read off the frames' rules; the panes' real sizes at those moments are not in
  the byte stream (resizes arrive as `set_size`, not as bytes).
- **On L:** nothing run. The new tests should be machine-independent by construction; not checked.
