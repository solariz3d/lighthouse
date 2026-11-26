# LAP R2: the ring that sat unsent, and the Third Place's silence on D (pane O, 2026-11-25)

Tier: PROVE IT (a delivery change), red first. **BASE:** lighthouse `4cf03bf4`, worked in my own worktree `G:/consonance-scratch/o-r2-lh`.
Answers the chair's LAP R2 (sent 2026-11-25T15:34:50Z). Nothing pushed, nothing rebuilt or restarted.

**Evidence:** `p-r2-delivery-O_2026-11-25_evidence/`, each script beside its output.

## 1. The ring that sat unsent: found, reproduced, fixed

### What happened

My `call_librarian` of 2026-11-24T15:54:16Z (lap 4's hand-back, 1437 characters, 10 newlines) was pasted into the librarian's box. It
sat there until the keeper pressed Enter at 20:04:35Z (board row 210049). The board row said
`call_librarian O -> LIB [Unconfirmed]` (15:54:18.553Z).

### What the librarian's own screen did (replayed, not guessed)

I fed the librarian's raw capture, `C:/Consonance/data/captures/0c0c0c0b-…115b.log` (61×305), from its last full clear through
`vt100`. At every change I printed `composer_state`, `ours_in_box`, the composer row and the footer
(`replay_librarian_capture.txt`, lines 385–400; `replay_instrument.rs` is the test that printed it, kept out of the commit):

| capture offset | composer | ours | footer |
|---|---|---|---|
| 684348769 | **Empty** (`❯`) | no | the idle footer (the turn had just ended) |
| 684348865 | **Empty** (`❯`) | no | **`Pasting…`** |
| 684348881 / 897 | HasText (`[Pasted`, `[Pasted text #14`) | no | `Pasting…` |
| 684348913 | HasText `[Pasted text #14 +10 lines]` | **yes** | `Pasting…`, then the idle footer |

The box stays ours and full to the end of the trace. Our Enter never took.

### The cause, with file:line on `4cf03bf4`

1. **`main.rs:13752`**: `deliver` pressed Enter `submit_delay_ms` after the paste. For this ring that was 120 + 1449/32 = 165 ms.
   The librarian's TUI had just ended a turn and had not yet drawn the paste. An Enter at that moment is lost.
2. **`main.rs:13672`**: `submit_step` maps `Composer::Empty => SubmitStep::Submitted`. A box the TUI has not drawn the paste into
   yet is empty in exactly the way a submitted box is empty (rows 1–2 of the table).
3. **`main.rs:13764`**: the first reading, 200 ms after the Enter, saw that empty box and returned `Submitted { retries: 0 }`. No
   retry Enter was ever sent.
4. **`main.rs:13791`**: `delivery_receipt` turned (no render, `Submitted`) into `Unconfirmed`. A collapsed paste never draws the
   needle, so the render check never confirms it. That is the board's `[Unconfirmed]`, where `NOT SUBMITTED` was the truth.

**What the record cannot show.** The capture has no times, so the gap between the paste and the drawing was not measured. The other
two paths to `[Unconfirmed]` do not fit the record:
- `Unknown`, an unreadable box, does not fit: the box read cleanly at every step of the replay.
- `NotOurs` does not fit either. It needs a reading to land between two 16-byte paints of one PTY chunk, and the reader feeds the
  emulator whole chunks.

The empty-before-drawn reading is the one path that fits the board, the screen and the code together.

### The fix (`main.rs`, `deliver` and `submit_step`)

- **The Enter waits until the paste is seen drawn.** After the same `submit_delay_ms`, the box is read. If our text is not in it
  yet, it is read every `PASTE_SEEN_POLL_MS` (50) until it is, for at most `PASTE_SEEN_MAX_MS` (1,500) more, and then the Enter
  goes.
  - A fast TUI is seen on the first reading. It gets the same bytes at the same moments as before, plus one reading.
  - It is still one call to the writer, so no keystroke can land between the paste and the Enter.
- **An empty box is a submit only once our text has been seen in it** (`submit_step`'s new `seen`). Before that, empty decides
  nothing and the readings go on. If our text then appears, it gets the Enter again.
- **No Enter on the last reading.** If our text is first seen on the last reading, it gets no Enter, because no reading would follow
  to say whether it took. It is reported `NotSubmitted`, and the board says `NOT SUBMITTED`.
- **A box that never showed our text is `Unknown`, never `Submitted`.** The drain's note for it now says "could not be read after
  the Enter, **or never showed this message**".
- **Unchanged:** one paste, never re-pasted, nothing cleared, no Enter on an unreadable box (D415), nothing that takes focus. The
  writes go to the PTY, never to the window.

**Lock order, checked.** The screen is now read while the pane map's lock is held. `live_screen` takes the emulator map and then
the emulator. No holder of either ever takes the pane map: the PTY reader (`:1439`), the watcher (`:1497`, `:12365`) and the exit
thread take only the emulator locks. `pty_resize` takes them in the same order as `deliver`. So the reads cannot deadlock against
the hold.

**Cost.** Another pane's keystrokes wait for this hold. In the worst case that is now the delay plus 1.5 s; before, it was at most
900 ms. That case is a TUI that never shows our text, or a placeholder whose line count we do not match (L225 B4's CRLF case).

### Red, then green: `cargo test --bin consonance submit_check_tests`, BelowNormal

**The simulated TUI.** Five new rows drive `deliver` over a TUI with its own clock. It draws the paste `d` ms after it is written.
Before that the box reads empty. An Enter before the drawing is lost; an Enter after it submits and clears the box. The rows
assert what happened to the message.

**Red on `4cf03bf4`** (`red_on_4cf03bf4.txt`), 18 passed and 4 failed:

| row | result |
|---|---|
| `r2_a_paste_the_tui_draws_late_is_submitted_and_not_counted_on_the_empty_box_before_it` | red: "the ring must leave the input line: Ok(Submitted { retries: 0 }), 1 Enter(s), 1 lost". This is the incident exactly. |
| `r2_an_empty_box_where_our_text_was_never_seen_is_never_reported_submitted` | red |
| `r2_whatever_the_tui_speed_the_report_says_submitted_exactly_when_the_ring_left_the_line` | red: "drawn after 365 ms: reported Ok(Submitted { retries: 0 }), submitted false" |
| `r2_a_tui_drawing_within_the_wait_gets_the_ring_submitted` | red |
| `r2_a_fast_tui_still_gets_one_enter` | green on the base too, as it should be |

(My first run went red on a harness fault of mine: an `Rc` still borrowed. That run is not this one.)

**Green with the fix** (`green.txt`): 22 passed, 0 failed.

**Two changes to existing tests, said by name:**
- The decision table's `submit_step` calls take the new `seen` argument. They pass `true`, so the assertions are unchanged. Two
  rows were added for `seen = false`.
- `run`, the harness, now answers the readings taken before the Enter with `ours()`: a TUI that draws the paste at once. Its
  `reads` count only the readings after the Enter, which is what every scripted row meant by them. No assertion in an existing row
  changed.

**Mutants** (`mutants.js` / `mutants.txt`, source restored after each): **3 of 3 caught**.

| mutant | caught by |
|---|---|
| empty is a submit again | 3 rows |
| no wait for the paste to be drawn | `r2_a_tui_drawing_within_the_wait…` |
| an Enter on the last reading again | `r2_whatever_the_tui_speed…` |

Only this module was run, as the lap said. The full suite runs at the landing.

### What a rebuilt app changes

- **Every pane write** goes through `deliver`: rings, chair injects, keep-warm, pulls and the drain.
- **The Enter waits** until the paste is seen in the box: up to 1.5 s more on a slow TUI, nothing more on a fast one.
- **An Enter lost to a late drawing is retried** once our text shows.
- **A ring that is not submitted** reads `NOT SUBMITTED` or `UNCONFIRMED`, never `[Received]` and never a silent `Submitted`.
- **The installed app is unchanged** until the next landing and rebuild.

**Not measured:** the fix has not been tried live. Doing so needs a slow TUI on demand. `bin/ring_probe.rs` (L225 B4) did not try
a collapsed paste; that is the probe to run next if one is wanted.

**Board on D for scale** (all `-> X [receipt]` rows): 2148 `[Received]`, 61 `[Unconfirmed]`, 8 rows saying `NOT SUBMITTED`. How
many of the 61 are this cause is not known.

## 2. The Third Place's silence on D: the seat is not visited, and that is the activation rule, not plumbing

**The chain.** A working seat's visit carries the Third Place's answer, which comes from the Third Place's reply to its **visit
hour**. The visit hour is that seat's own keep-warm turn, sent only while lines are held (`main.rs:14784`), and only if the Third
Place is pinged at all.

### Link 1: is the Third Place visited on D? NO, since 2026-11-16T17:56:40Z

From `kw_board.js` / `kw_board.txt`, board rows since 11-14:
- `keep-warm -> the Third Place` rows: 10 on 11-14 and 22 on 11-16, **none since 11-16 17:56:40Z**.
- The last visit hour was 11-16 11:40:15Z: "answered 1 of 1".
- Lines are still being held for it: 3 on 11-23 and 5 on 11-24, the last at 21:58:38Z. No visit hour follows them.

### Is the seat open on D? Yes

- Its capture (`3d000000-…3d00.log`) has a `consonance · resumed` seam from this morning's launch.
- Its ready stamp (`harvest/3d000000-…3d00.json`) was written at 15:48Z today, with `exited: false`.

### Why it is not pinged

`keep_warm_decision` (`:14448`) skips any seat "not activated this session: no request since the app started; it waits to be
spoken to". Activation (`:14724`) is a request answered since the app started.

The Third Place's transcript has no request after 2026-11-16T17:56Z, the same keep-warm ping the board shows last. That transcript
was read locally for times and row types only. Its record stays off every transport, so nothing from it is in the evidence.

Since then the app has been relaunched and nobody has spoken to the seat, so it never re-activates. Every working seat's visit
therefore says "The Third Place has no answer yet".

### Links 2 and 3

- **Does it reply?** Up to 11-16, every ping was followed by an ended turn in its transcript, each with its own Stop row.
- **Does the harvest carry the reply back?** It did: the 11-16 visit hour answered 1 of 1.

Neither link has been exercised since, so neither is faulted.

### Answer

**The missing link is the first one, and it is the keeper's activation rule working as written** ("wait for each seat and pane to
activate", 05:57). It is not a plumbing fault, so per the lap **nothing was changed**.

One fact for the keeper: the held lines live only in the app's memory (`VisitBook`), so this morning's relaunch dropped the 11-23
and 11-24 ones.

**What would restart it is his call, not mine:**
- he says a word to the Third Place once per launch; or
- held lines count as activating it.

## Files

- `consonance/src-tauri/src/main.rs`: the fix and its rows (`submit_step`, `deliver`, `PASTE_SEEN_*`, `submit_note`'s Unknown text,
  `submit_check_tests`).
- `consonance/src-tauri/src/MAP.md`: `deliver`'s line.
- `exo_memory/map/O.md`: one line.
- This hand-back and its evidence.
