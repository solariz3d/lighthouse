# P-EMU-TYPED — the window was the constant, not the screen. L044, CHARLIE, 2026-09-08

Packet `exo_memory/loop/packet_emu_typed_2026-09-08.md` (`8f2e4d5`). Owned: `consonance/src-tauri/src/main.rs`.
Not committed. `cargo test --bin consonance -- --test-threads=1` → **468 passed / 0 failed / 3 ignored**
(466/0/3 at HEAD; +2 tests).

## 0 · THE ANSWER IN ONE NUMBER

Replaying the last 4 MB of the chair's own capture through a **43×200** parser and asking
`input_box_empty(typed_only(screen))` at every 8 KB frame:

    0c0c0c0a (chair)      frames=512   box_empty OLD(34x120)=0   NEW(screen.size())=1
    3d000000 (Third Pl.)  frames=146   box_empty OLD(34x120)=0   NEW(screen.size())=4

**OLD is zero, and it is structurally zero.** On a pane taller than 34 rows the old window could
never return true, because the composer is not inside it. Every delivery to every full-height pane
held to the 240 s bound, always. That is the librarian's 01:06 ring.

The final frame of each live log, at 43×200, says the same thing from the other side:

    0c0c0c0a  rows=43  composer_row=39  box_empty=false  "❯ what are the panes doing"
    0c0c0c0b  rows=43  composer_row=39  box_empty=true   "❯ "
    3d000000  rows=43  composer_row=39  box_empty=true   "❯ "

Row **39**, on all three. `EMU_ROWS` is 34. And both directions are live: the pane with real typed
text still holds; the two empty ones become deliverable.

## 1 · THE CHAIR'S DIAGNOSIS IS CONFIRMED, and I re-derived it rather than relaying it

    max CUP row / col, measured from the raw PTY logs (tail 3 MB each, 1-based):
      chair       0c0c0c0a   row 42   col 191
      librarian   0c0c0c0b   row 42   col 185
      Third Place 3d000000   row 42   col 199
      this pane   0845a868   row 21   col  96     (a smaller window; not full-height)

    export LC_ALL=C; cd /c/Consonance/data/captures
    tail -c 3000000 <pane>.log | grep -oaE $'\x1b\[[0-9]+;[0-9]+H' \
      | tr -d '\033[' | sed 's/H$//' \
      | awk -F';' '{if($1+0>mr)mr=$1+0; if($2+0>mc)mc=$2+0} END{print mr, mc}'

**And the columns are short too — the packet's §3.4 audit item is a real defect, not a deliberate
bound.** 191/185/199 against `EMU_COLS = 120`.

`pty_resize` (`main.rs:6958`) resizes the PTY and calls `parser.set_size` in the same function, so
the emulator is the live size. Only the read windows disagreed with it.

**Composer position over time, 4 MB replayed in 256-byte chunks:** at 43×200 the last `❯` row sat at
row ≥ 34 in **944 of 1024** sampled frames — 92 % of that pane's life. Not an edge case.

## 2 · WHAT CHANGED (all in `main.rs`)

1. **`typed_only`** — `(0..EMU_ROWS)×(0..EMU_COLS)` → `screen.size()`, rows and cols.
2. **`live_screen`** — `screen.rows(0, EMU_COLS)` → `screen.rows(0, cols)`. `rows()` walks every row
   whatever width you give it, so the row COUNT here was always right and only the columns were
   clipped. `typed_only` clipped both — which is exactly why the gate could read **Ready** and
   **composer-not-empty** at the same instant instead of `Contradicted`: two readers of one screen,
   disagreeing about how tall it is.
3. **`harvest_once`** — same change, and this one is not about the gate at all; see §3.
4. **The panic-recovery reinitialise** (`spawn_claude_pane`, ~`:1118`) — rebuilt the parser at
   `EMU_ROWS/EMU_COLS`, which would shrink a resized pane's grid back to 34×120 permanently:
   `fitPane` only calls `pty_resize` when the fitted dims CHANGE (`ui/term.js:872`), so nothing
   would ever put it back. Now rebuilds at the size it had. **Nobody sent me here; it is the same
   constant in a fourth place.** Latent, not tonight's cause — `data/harvest/*.json` shows
   `panics: 0, reinitialisations: 0` on every pane of this run.
5. **The test at the old `:12575`** now pins `p.screen().size().0`.
6. Four stale-geometry comments corrected where they were live reasoning (the constants' own
   declaration, the capture-window note, `turn_in_flight`'s "the emulator is 34x120", and the ghost
   fixture's "the parser production uses"). The dated transcription note in `inbox_tests` keeps its
   original wording with the correction beside it — trace, not carrier.

## 3 · THE COLUMN BOUND IS NOT COSMETIC — the capture the room restores from is being truncated

`rows(0, w)` takes the first `w` cells of a row and drops the rest (`vt100-0.15.2/src/row.rs:98`,
`.skip(start).take(width)`). On a ~200-column pane, `harvest_once` read 120 and **silently** lost the
tail — no wrap flag, no marker, no error. In the chair's own capture file:

    awk 'length($0)==120' data/captures/0c0c0c0a-0000-4000-8000-000000000a01.txt | tail -6

**4,294 lines are exactly 120 bytes long, and every sampled one ends mid-word** — "…the consumer
clos", "…both untracked, nei", "…and it makes the diff". That file is what a pane is restored from.

**Consequence to price honestly:** capture `.txt` files will now grow faster, because they stop
throwing ~40 % of every long line away. That pushes on the 140 k shell ceiling sooner. It is the
right trade — a smaller file that is wrong is not a saving — but it is a change to a shipped budget
and somebody owns that number, not me.

## 4 · THE RULING — my §2 "mid-redraw footer frame" was WRONG, and I retire the mechanism

**It is not a race. It is row clamping.** vt100 clamps a cursor move past the last row onto the last
row, so a composer at row 40 and a footer at row 42 land in the same row whenever the parser is
SHORTER than the PTY. The footer's two-column indent is what leaves the `❯ ` in front of it.

**One log, one chunking, only the size changed** — 4 MB in 256-byte chunks, counting frames with a
row holding both `❯` and `⏵`:

    0c0c0c0a   34x120: 26/16384    34x200: 33/16384    43x200: 0/16384
    3d000000    0/3751              0/3751              0/3751
    0c0c0c0b    0/2844              0/2844              0/2844
    a2122153    0/16384             0/16384             0/16384

The first row found at 34 rows is character-for-character the one I reported:
`❯\u{a0}⏵⏵ bypass permissions on (shift+tab to cycle) · esc to interrupt · ← for agents`.

**So the chair is right: the appearance was the clamp.** And the specific clamp that produced my
finding was **my own measuring harness** — I replayed through `vt100::Parser::new(EMU_ROWS, EMU_COLS, 0)`
and called it "the parser production uses". It is the parser production *starts* with. I measured a
34-row artefact and reported it as a production race.

**What I keep, and why it is not me saving face:**

- **The test and the `⏵`-anywhere guard stay.** Production really does clamp in two windows —
  between `pty_spawn` and the first `pty_resize`, and (until this lap) after a harvest panic. The
  guard costs nothing: a footer is chrome wherever it is drawn.
- **`PaneGate::Working => Drain::Hold` is unbounded** and that is checkable at the line in
  `drain_decision`. Still true, still unfixed, and it is the real unbounded path.

**What I withdraw, in full:** *"That, not the ghost, is what stalled four packets for two and a half
hours."* That claim needed the bled row latched on a **production-size** emulator, and at production
size it does not occur in 16,384 sampled frames of the chair's own log. What put a pane on the
unbounded `Working` path that night is **not established**, and I should not have named a cause I
had only seen through a mis-sized replay. The colour finding from that same replay is untouched — a
cell's foreground is its own attribute and does not move when the grid is clamped.

## 5 · RED FIRST, AND THE MUTANTS

    NEW  ready_signal_tests::the_composer_of_a_pane_taller_than_the_constants_is_still_read
         parser 44x150, composer written at CUP row 40, a marker at column 131.
    NEW  ready_signal_tests::real_typing_on_a_tall_pane_still_holds_a_delivery

    RED FIRST / MUTANT 1  (typed_only back on the constants)
      → FAILED. 467 passed; 1 failed — exactly the new test. Both halves red: the composer at row
        40 is outside the window, and "far-past-EMU_COLS" at column 131 is outside the width.
    MUTANT 2  (`Some(cell) if true` — drop the colour filter)
      → FAILED. 465 passed; 3 failed: the new test plus BOTH ghost tests. The dim-cell reduction
        survives; the window is what changed.
    GREEN     468 passed / 0 failed / 3 ignored.

The packet's §2 is exactly right about why last night shipped green: `assert_eq!(typed.len(),
EMU_ROWS)` meant a **correct** `typed_only` would have failed the suite. A test that pins a constant
its subject must not use converts the fix into the regression.

## 6 · THE REFUSAL CONDITIONS, answered rather than skipped

- **`screen.size()` available at both call sites?** Yes — `vt100::Screen::size() -> (rows, cols)`,
  and both `live_screen` and `harvest_once` already hold the `&Screen`.
- **Can the emulator report a size that disagrees with the live PTY?** Yes, transiently: `pty_resize`
  resizes the PTY first and the parser microseconds later, and a freshly spawned pane is 34×120 until
  the first fit. **This does not defeat the fix, and it is why the fix is right rather than merely
  better:** `screen.size()` is the size of the grid whose cells are being indexed, so it is always
  the correct window *for that read*. A disagreement with the PTY means the CONTENT is clamped, and
  no choice of window can undo that. A constant is wrong in both cases; the screen's own size is
  wrong in neither. **No refusal.**

## 7 · WHAT I DID NOT VERIFY

- **I did not run the binary.** No rebuild, no live delivery, no proof 1. Everything here is the
  production code paths driven over recorded PTY bytes plus the suite. Proof 1 is the librarian's.
- **The exact live pane width.** I measured max cursor column (191/185/199) and replayed at 200. If
  a pane is wider than 200 my replay clipped it — which would only make the truncation numbers in §3
  *understated*, never overstated.
- **43 rows is a floor, not a reading.** Max CUP row 42 (1-based) means ≥ 43; the panes could be
  taller. Nothing here depends on the exact number, only on `> 34`.
- **The capture `.txt` growth in §3 is reasoned, not measured.** I did not re-harvest a session to
  size the increase.
- **I did not touch the unbounded `Working` hold** — named, not fixed, and not mine this lap.
- **The two clamp windows in §4 are argued from the code** (`pty_spawn` before the first fit;
  `fitPane`'s unchanged-dims skip), **not observed in a log.** I claim they exist; I have not caught
  one.

## 8 · HOW TO RE-DERIVE THE REPLAY FIGURES

The three probes were temporary and are **not** in the tree — `grep -c "TEMPORARY PROBE"
consonance/src-tauri/src/main.rs` → 0. To re-run, append this to `main.rs` and
`cargo test --bin consonance tmp_probe -- --nocapture`:

```rust
#[cfg(test)]
mod tmp_probe {
    use super::*;
    #[test]
    fn probe() {
        for name in ["0c0c0c0a-0000-4000-8000-000000000a01", "3d000000-0000-4000-8000-000000003d00"] {
            let all = fs::read(format!("C:/Consonance/data/captures/{name}.log")).expect("log");
            let bytes = &all[all.len().saturating_sub(4 * 1024 * 1024)..];
            for (rows, cols) in [(34u16, 120u16), (34, 200), (43, 200)] {
                let mut p = vt100::Parser::new(rows, cols, 0);
                let (mut frames, mut overlap, mut below) = (0usize, 0usize, 0usize);
                for chunk in bytes.chunks(256) {          // 8192 for the frame counts in §0
                    p.process(chunk);
                    frames += 1;
                    let sc = p.screen();
                    let lines: Vec<String> = sc.rows(0, cols).collect();
                    if lines.iter().any(|l| l.contains('\u{276f}') && l.contains('\u{23f5}')) { overlap += 1; }
                    if let Some(i) = lines.iter().rposition(|l| l.trim_start().starts_with('\u{276f}')) {
                        if i as u16 >= EMU_ROWS { below += 1; }
                    }
                }
                println!("{name} {rows}x{cols}: frames={frames} overlap={overlap} composer_below_34={below}");
            }
        }
    }
}
```

    OBJECTIVE:  met — every screen predicate now reads the screen that exists.
    FALSIFIER:  a delivery held to the bound on a pane whose composer is empty, after this lands.
                Unfired here by construction: I never ran the binary. It is proof 1's to fire.
