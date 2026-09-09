# P-COMPOSER-UPDATE — the defect is real, the diagnosis was wrong three ways, and I am REFUSING the fix as scoped.

**C (CHARLIE), 2026-09-09 ~02:00. L050.** Packet `loop/packet_composer_update_2026-09-09.md` (1b4287c);
diagnosis `librarian/2026-09-09.md` 01:35.

**MY SCOPE, in my own words:** find why every delivery tonight held to the 240 s bound, using
tonight's real captured screens as fixtures; fix it if the fix is safe; register the version-stamp
rule. Do not commit.

---

## 0 · THE ANSWER IN FOUR LINES

1. **The defect is real and I have it pinned on a real screen.** `typed_only` deletes the composer
   marker `❯`, so `input_box_empty` finds no prompt row and returns false by UNKNOWN-HOLDS. A pane
   with an empty composer reads BUSY. Test and fixture below.
2. **The packet's mechanism is wrong.** The update row is not read as typed text. It is drawn
   green and the reduction already strips it.
3. **The packet's premise is wrong, and the room's own log says so.** This did not start with
   tonight's auto-update: `persist.log` carries **31 forced deliveries on 2026-09-08** — before the
   update — against **9 today**. It was worse yesterday.
4. **I am refusing the fix.** The obvious repair makes a greyed prompt row carrying the keeper's
   words indistinguishable from a drawn autocomplete prediction. That is the packet's own stated
   grounds to stop, and it is not hypothetical — I have the frame.

---

## 1 · WHAT I MEASURED — the marker is not Default

The discriminator `typed_only` rests on is colour: keep `Color::Default` cells, blank the rest, on
the stated measurement that *"the `❯` and the NBSP after it are Default."* Read straight out of the
librarian's live capture, the bytes that draw the composer marker are:

    ESC[38;2;80;80;80m  ESC[48;2;55;55;55m  ❯          -> Rgb(80,80,80) on Rgb(55,55,55)

**Not Default.** So the reduction blanks the marker itself, `input_box_empty` finds no `❯` row
anywhere, and its `None => false` — *"UNKNOWN HOLDS"* — reports the composer occupied. With
`PaneGate::Ready` (which comes from the pane's **stamp**, not from the screen),
`drain_decision` takes `bounded(box_empty, SignalOutranked)` and holds the full 240 s. That is
verbatim the board's *"the pane's own signal said ready; its composer never cleared."*

**Frame classes, replaying each pane's own capture at 43x201 in 4 KB steps** (the width is not
assumed: the separator rule measures 201 columns in the live captures, and at 202 the repaint
visibly tears — that is how it was established):

| pane | frames where the composer is EMPTY on screen but the reduction says BUSY |
|---|---|
| librarian `0c0c0c0b` | **339 of 395** |
| third place `3d000000` | **581 of 750** |
| A `6fe15f0a` (tonight's tail) | 0 of 1,024 |

**And the guard that should have caught it is in the same file, ten lines away.**
`the_prompt_marker_survives_the_reduction` exists precisely for this, and says so:
*"if it were not [Default], blanking non-default cells would delete the marker, `input_box_empty`
would find no prompt row, and `None => false` would call every pane busy forever — a worse stall
than the one being fixed, and silent."* It could not fire because its fixture, `box_screen`, paints
the marker Default by construction. **It pinned the model of the screen, not the screen** — the
third time in this one function (L044's row window, L044's footer, now this).

## 2 · THE PACKET'S MECHANISM IS REFUTED — the update row is not involved

    ESC[K ESC[38;2;78;186;101m ✔ Update installed · Restart to update  ESC[38;2;136;136;136m ────…

`Rgb(78,186,101)` — green. `typed_only` blanks it like any other chrome. The same holds for
`paste again to expand` (`Rgb(153,153,153)`, already named in the doc comment). **Neither new row
can be read as typed text, so neither is the cause, and no update-row handling is needed.** The
packet's first mutant — *"remove the update-row handling ⇒ red"* — cannot be built, because there is
nothing correct to remove.

## 3 · THE PREMISE IS REFUTED — it was worse yesterday, before the update

    node -e "…parse 'DELIVERY FORCED' rows out of C:\Consonance\data\persist.log…"

| day | forced deliveries |
|---|---|
| **2026-09-08** (pre-update) | **31**, 01:10:18 → 07:52:42, across 6 panes |
| 2026-09-09 (post-update) | 9 |
| all time in `persist.log` | 40 |

Spread over seven hours and six panes: not test pollution. **The claim that "proof 1 passed
yesterday on the first ring and nothing changed between then and now" does not survive its own
log.** Something forced 31 deliveries yesterday under the old Claude Code.

Two more corrections to figures in the brief, both small and both hand-made:

- **"6 of 6" is 9.** The 01:35 entry enumerates five (three to the librarian, one to A, one to the
  chair) and reports six. Re-derived: nine today, the last three arriving after the packet was
  written — two of them into my own pane, including the ring that carried this packet.
- Replaying pre-update bytes of A's log shows the same marker-blanking (788 frames). **The defect
  is not new.** *Stated with its limit:* a raw PTY log replayed at a fixed width is only valid for
  the width the pane actually had, and **a resize is an ioctl that leaves no trace in the byte
  stream** — so I cannot verify the geometry of an old window, and that cross-window comparison is
  the weakest evidence in this hand-back. The `persist.log` count above does not depend on it.

## 4 · WHY I AM REFUSING THE FIX, with the frame that makes it a refusal and not a preference

The obvious repair is *"keep the `❯` whatever colour it is drawn in."* It turns the fixture green.
It is not safe, and the packet named this exact hazard as grounds to stop.

Once the marker survives at any colour, a row reading `❯ <non-Default text>` reduces to `❯` alone
and reports **EMPTY**. And to a colour test, **a drawn autocomplete prediction and a greyed prompt
row carrying the keeper's own words are the same row.** Both are non-Default text after a
non-Default marker. Today they are told apart only by accident — the marker's colour hides the whole
row, so `None => false` holds it.

**The frame is on disk.** Replaying the librarian's log, the last prompt row is:

    ❯ tomorrow we will finish the lap the orch stopped, then work on making the synched consonance

— the keeper's own instruction, every cell non-Default, reduced by `typed_only` to nothing. Under
the naive repair that row reads EMPTY and the queued message is spliced into it.

**In fairness to the repair, that particular frame is a replay artifact** — a partially painted
screen produced by starting the parser mid-stream, which the live gate's 2 s `QUIET_FOR_DELIVERY_MS`
quiescence rule would very likely exclude. *Very likely* is not a basis for a change whose failure
mode is unrecoverable. **Holding a delivery four minutes is annoying; splicing his sentence is
not.** So: refused, and the reason is registered rather than left as a feeling.

## 5 · WHAT WOULD EARN IT — the structural anchor, from the same real screens

The composer is not *"the last `❯` row."* It is *"the `❯` row **below the separator rule**"* — the
full-width `────` in `Rgb(136,136,136)` Claude Code draws directly above it. On the fixture screen
that is row 38, with the composer at row 39 and the footer at 41.

That anchor is **structural, not chromatic**: it survives a recolour of the marker, and it separates
scrollback prompt rows from the composer *by construction* rather than by hue — which is exactly
what §4 says colour cannot do. It needs its own fixtures and its own mutants. **A packet, not a
patch**, and the acceptance test for it is already written and `#[ignore]`d (§7).

## 6 · THE VERSION-STAMP RULE — my ruling, and what it costs when it is wrong

> **A screen predicate carries the Claude Code version it was pinned against, and the launcher
> posts a version change to the board.**

**Adopt it. On a version change the launcher POSTS AND PROCEEDS; it never refuses.** Refusing locks
the keeper out of his own app over a cosmetic row, and the room's whole correction is *with you, not
above you* — a launcher that will not launch is an overseer. The board row is the whole mechanism:
an auto-update is silent, unattended, and arrives between a passing proof and a failing one **with
no commit in our history to blame**, which is why three of these have each cost a night.

**Where it lives, so it is not a sentence nobody reads:** the pinned version belongs in the doc
comment of `typed_only` and `input_box_empty` beside the colour measurements they already carry, and
the launcher's post belongs next to the `backfill` announcement — the one place in `main.rs` that
already writes a one-line seam notice to the board at startup.

**AND THE COST WHEN THE STAMP IS WRONG, which the packet was right to demand.** A predicate pinned
to a version that is not running is a **false assurance, and worse than none** — a reader sees
"pinned against 2.1.266", believes the screen was checked, and stops looking. Tonight is the
demonstration: the room reasoned from a version change to a mechanism and got the mechanism, the
premise and the novelty all wrong, and it would have reasoned *harder* in that direction with a
stamp on the file. **So the stamp is only worth its cost if it says when it was last VERIFIED
against a real screen, not merely which version was current when the line was typed.** A bare
version number is a date pretending to be a check. Mine reads: *pinned 2026-09-09 against
`fixtures/screens/composer_empty_reads_busy_2026-09-09.bin`, Claude Code 2.1.266* — and the fixture
is what makes it checkable.

**Its own falsifier:** if a future screen defect is found while the stamp is current and nobody
looked because the stamp said current, the rule has cost more than it saved and should be struck.

## 7 · THE FIXTURE AND THE TESTS

    consonance/src-tauri/fixtures/screens/composer_empty_reads_busy_2026-09-09.bin   524,288 bytes

**Real raw PTY output**, not a synthetic composer: the librarian pane's own capture log, the 512 KB
ending at byte 1,794,048 — a frame located by scanning the log for the failing class, not composed.
Content is committee routing and shell lines; nothing private. **The third place's capture was
deliberately NOT used as a fixture** despite being the strongest example (581 frames): its record
never leaves, and a raw PTY slice is its conversation. Main's was excluded for the same reason.

*On the size, since half a megabyte is a real cost:* smaller slices do not work, and the reason is
informative — 32/64/128/256 KB all fail to repaint the composer region, because a terminal only
redraws what changed. The nearest cursor-home anchor is ~470 KB back. The recipe is in the test's
doc comment so it can be regenerated, but captures rotate, so a recipe alone rots. **Keeping it is
my recommendation; it is uncommitted and the call is the chair's.**

    consonance/src-tauri/src/main.rs
      ready_signal_tests::a_real_empty_composer_reads_busy_because_the_marker_is_not_default
        GREEN. Asserts the evidence: the rendered composer IS empty; the reduction deletes the row;
        no prompt row survives anywhere; input_box_empty(rendered)=true and (typed)=false.
        Written to pass so the finding is permanent without reddening a board — asserting the wrong
        behaviour as a change-detector would go red the day someone fixes it, which is backwards.

      ready_signal_tests::an_empty_composer_must_read_empty_whatever_colour_the_marker_is_drawn_in
        #[ignore]d ON PURPOSE. The acceptance test for §5. Its doc comment carries the refusal, so
        the next reader cannot un-ignore it and reach for the unsafe shortcut without meeting the
        argument first.

**The packet's second mutant is already killed and needs nothing from me.** *"Count everything as
empty ⇒ red"* is caught by the existing `real_typing_still_holds_a_delivery_even_with_a_prediction_after_it`,
which asserts `("score it", "", false)` and `("Both h", "ow are you", false)`. Verified by running
it, not by reading it.

## 8 · BARS

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
    test result: FAILED. 479 passed; 1 failed; 4 ignored

**The single failure is `offset_tests::the_backfill_decision_must_be_made_after_the_configured_dirs_resolve`
— MY EXPECTED-RED from `a17007f`, and it is not this packet's failure.** It stays red until the
rebuild moves the offsets read after `set_dirs`. 4 ignored = 3 pre-existing + my new acceptance test.

**Observed once and not reproduced, reported because a flake is a finding:**
`mcp::tests::no_open_lap_gates_nothing` (E's file, `mcp.rs:1325`) failed on one run and passed on
the next under the identical `--test-threads=1` invocation. Not mine to chase; E should know it is
not deterministic.

**The six captures with before/after readings — I cannot give this as asked, and the reason is a
category error in the request.** There are not six capture files. There are nine forced *deliveries*
today landing across five pane *logs*, and a log is not a screen — it is a byte stream from which
a screen must be reconstructed. What I can name is what I read:

| capture log | frames sampled | empty-composer-reads-busy | fixture? |
|---|---|---|---|
| `C:\Consonance\data\captures\0c0c0c0b-…115b.log` (librarian, 3 forced) | 395 | **339** | **yes** |
| `C:\Consonance\data\captures\3d000000-…3d00.log` (third place) | 750 | **581** | no — record never leaves |
| `C:\Consonance\data\captures\6fe15f0a-…6b4f.log` (A, 1 forced) | 1,024 | 0 tonight, 788 pre-update | no |
| `C:\Consonance\data\captures\0c0c0c0a-…0a01.log` (chair, 1 forced) | not read | — | no — the keeper's own pane |
| `C:\Consonance\data\captures\0845a868-…88f1.log` (me, 2 forced) | not read | — | no |

## 9 · WHAT I DID NOT VERIFY

- **That this defect caused any specific forced delivery.** I never observed the gate's own reading
  at a delivery moment; the stamp state is inferred from the board's `SignalOutranked` wording. The
  mechanism is sufficient and it is present on real frames — that is not the same as caught in the act.
- **The chair's and my own capture logs.** Excluded on privacy grounds, not read at all. Two of
  today's nine forced deliveries are in the one I did not open.
- **Whether the marker's colour depends on the composer's dimmed state.** The blanked frames
  co-occur with `esc to interrupt` on screen; I did not establish that as the trigger, and the
  footer is known to persist through a background shell independent of any turn.
- **Any geometry other than 43x201**, and by extension any historical window. See §3's limit.
- **That 201 is the live width right now** rather than the width of the recent tail. It is inferred
  from the separator rule in the captures, not read from the PTY.

---

**FALSIFIER as registered:** *a delivery forced at the bound on a pane whose composer is empty,
after this lands.* It is **still live** — I fixed nothing, deliberately. It fired nine times today,
twice into this pane while this was being written.

**Nothing committed.** Dirty and mine: `consonance/src-tauri/src/main.rs`,
`consonance/src-tauri/fixtures/screens/composer_empty_reads_busy_2026-09-09.bin`, this file,
`exo_memory/map/C.md`.
