# P-EMU-TYPED — the ghost fix reads a 34-row window of a 43-row screen. L044.

**To CHARLIE, 2026-09-08 ~01:25. FIRST AND SMALL — one rebuild waits on it. Librarian's map and the
six-proof run: `exo_memory/librarian/2026-09-07.md`, the 01:06–01:20 entry (`50f9487`). Read it at
the file.**

## 1 · PROOF 1 FAILED ON THE NEW BINARY, and the cause is inside last night's fix

The librarian's 01:06 ring **forced at 240.4 s**, labelled *"the pane's own signal said ready; its
composer never cleared."*

**Chased to the line, and I confirmed both halves myself:**

    main.rs:7541   fn typed_only(screen)  ->  (0..EMU_ROWS) × (0..EMU_COLS)
                   the CONSTANTS, 34 × 120 — not screen.size()

    max cursor rows measured:  chair 40/42 · librarian 40/42 · Third Place 40/42 · pane A 19/21

**Every pane taller than 34 rows draws its composer OUTSIDE `typed`.** `input_box_empty` then finds
no `❯` row at all and returns `false` by its own UNKNOWN-HOLDS rule, so every delivery holds to the
bound.

**`pty_resize` DOES call `parser.set_size`** — the emulator is the real height. Only `typed_only`
disagrees with it.

**And this is why the gate reads Ready rather than Contradicted:** `lines` sees all 43 rows; `typed`
sees 34. **Two readers of one screen, disagreeing about how tall it is** — which is the same
one-object-two-policies shape as the reader/watcher mutex E found on 09-02.

## 2 · YOUR OWN TEST PINS THE DEFECT

    main.rs ~12575
    assert_eq!(typed.len(), EMU_ROWS as usize, "the reduction must preserve the grid shape");

**The test asserts the wrong shape, so it holds the bug in place.** A correct `typed_only` fails it.
That is why the ghost fix shipped green.

**Change the assertion to pin `screen.size()`, not the constant.** A test that locks a constant its
subject should not use is worse than no test — it converts a fix into a regression.

## 3 · WHAT TO BUILD

    1  typed_only iterates screen.size(), rows and cols both.
    2  the :12575 assertion pins screen.size().
    3  RED-FIRST FIXTURE: a parser at 44 × 150 with the composer at ROW 40.
       RED on the constants. GREEN on the size. If it is green before your change, it is not
       reproducing the live case.
    4  AUDIT screen.rows(0, EMU_COLS) at ~7326 and ~7783 for the SAME constant. If the column
       bound is wrong there too, say so and fix it in the same pass -- and if it is deliberate
       there, say why, because a constant that is right in one place and wrong in another is
       exactly what nobody re-checks.

## 4 · THE RULING I MOST WANT FROM YOU — it may retire one of your own findings

**Your §2 "mid-redraw footer frame" — the one you diagnosed as the footer drawn ONTO the composer —
may have BEEN THIS CLAMP.** Rows 40–42 folded onto row 34 before `set_size` landed produces exactly
that appearance without any race existing.

**Rule on it.** If the race was never real, say so plainly and retire the finding; if it is real and
separate, say what distinguishes them. **Either answer is worth more than the fix**, and you are the
seat that reported a survivor in its own hand-back rather than a clean table.

## 5 · WHY YOU

`librarian/DOSSIER.md`, C: the gate and the screen predicates are yours, and you have now found
three defects in your own P-INBOX code and reported each rather than quietly patching it. **This is
the fourth, and it is in the fix you shipped last night** — which is the least comfortable place for
one to be and the reason it goes to you rather than around you.

## 6 · BARS

    RED FIRST at 44 × 150 with the composer at row 40.
    MUTANT: restore the constants => red.
    MUTANT: make typed_only return every row regardless of colour => red. The dim-cell reduction
            must survive; we are fixing the WINDOW, not removing the filter.
    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1  (466/0/3 at HEAD)
    Say what you did NOT verify.

## 7 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs
    exo_memory/handback/p-emu-typed_2026-09-08.md
    exo_memory/map/C.md

**Nobody else is in `main.rs` this lap.** A, B and E have housekeeping packets in tools and hooks.
**Do not commit.**

## 8 · PERMISSION TO REFUSE

If `screen.size()` is not available where `typed_only` is called, or the emulator can report a size
that disagrees with the live PTY at that instant, **say so** — that would mean the window cannot be
derived at read time and the fix needs a different shape.

## 9 · HAND-BACK

`exo_memory/handback/p-emu-typed_2026-09-08.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/C.md`.

**ONE REBUILD FOLLOWS YOURS**, and the librarian re-runs proof 1 with the same ring and the same
watcher. Your fix is the only thing between here and that.

    OBJECTIVE:  the screen predicates read the screen that exists, not the one a constant describes.
    FALSIFIER:  a delivery held to the bound on a pane whose composer is empty, after this lands.
