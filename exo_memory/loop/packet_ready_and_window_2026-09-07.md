# P-READY-MIRROR + THE TWO-WRITERS WINDOW — both your own finds. L043.

**To CHARLIE, 2026-09-07 ~03:40. Dev only. You hold `main.rs` this lap, including a patch E will
hand you (§3).**

## 1 · YOUR §5 — the splice window your own gate can still reach

You registered it and did not fix it: **a positive stamp over a live-turn screen delivers
immediately, with no mirror of Stale.** So a pane whose stamp says ready while its screen is mid-turn
gets spliced — **by the gate's own inject**, which is the one path we built to prevent exactly that.

**The asymmetry is the defect.** `Stale` exists for a stamp that is too old. Nothing exists for a
stamp that is too *confident* — positive, current, and wrong about the screen underneath it.

**Build the mirror.** Name the state, make it visible in the delivery row the way `Stale` is, and
decide what it does: hold, or deliver with the row saying it overrode a live screen. **Say which and
why** — and remember the keeper's rule that his hand outranks the stamp, which is the case that
taught us the third `Forced` producer exists at all.


## 1a · P-GHOST-TEXT — THE KEEPER FOUND THIS AT 05:09 AND IT OUTRANKS THE REST OF §1

**His words:** *"the greyed out text prediction! If it spawns in the bar, it stops the loop."*

**The mechanism.** `input_box_empty` (`main.rs:7418`, over `capture::is_empty_box`) reads the grid as
**plain text**. Claude Code's dim-grey autocomplete prediction sits in the composer as real cells, so
**the gate reads a prediction as the keeper typing** and every delivery holds.

**Three stalls tonight were ghosts, not the keeper:** *"score it"*, *"start L042"*, *"dispatch them"*.
The chair looked at A's captured screen at 05:10 and read `/rc` as *"three stray characters nobody
sent"* — **wrong**: it is the predictor's ghost, which regenerates, and cannot be cleared once.

**It is the 2026-08-22 predictor error with the sign flipped.** Then a seat acted on the predictor's
text *as the human*. Now the gate refuses *because* it reads the predictor's text as the human. Same
surface, same confusion of author, opposite direction.

**THE FIX:** `input_box_empty` counts **only cells at DEFAULT SGR attributes** as typed text. The
prediction is dim — SGR 2, or a grey foreground in the emulator's cells. Typed text is not.

    RED FIRST   a captured screen with a ghost in the box must read EMPTY after, BUSY before.
                Fixture: the librarian's scratchpad chair_ghost_0509.bin, or reproduce one by
                opening a composer and letting the prediction appear.
    MUTANT      count dim cells as typed again => red.
    MUTANT      count NOTHING as typed => red. Real typing must still hold a delivery, or the
                keeper gets spliced mid-sentence and we have traded the whole point away.
    FALSIFIER   a delivery held with stamp=ready over a box holding only dim text => not fixed.

**AND CHECK `None => false` WHILE YOU ARE IN THERE.** `input_box_empty` returns FALSE — busy — when
it finds no prompt and no empty box at all. A capture that is merely unrecognisable therefore reads
as *the keeper is typing*. **That may be right (fail safe) or wrong (fail stuck); say which and why**,
because tonight four packets sat queued for two and a half hours on a pane nobody was at.

**THIS IS THE ONE THAT UNBLOCKS THE OTHERS.** Its own packet could not be delivered to you because of
it.

## 2 · YOUR §6 — a red at HEAD, and it is the two-writers class

`shelf_tests::the_shelf_windows_the_librarians_own_notes` **fails right now.** Chair-confirmed at the
directory:

    exo_memory/librarian/2026-09-06.md
    exo_memory/librarian/2026-09-06.desktop.md      ← both match the same date prefix

Five files carry where the window allows four (today, yesterday, LEDGER, README). **The window keys
on a DATE and two machines can both satisfy one date.** It needs the machine suffix in the key.

**This is not a test to relax.** The window is a real cap; the key is what is wrong. If the honest
fix changes what the window MEANS — four per machine, or four total with the newest per machine —
**say which you chose and what it costs**, because it changes what a librarian wakes holding.

## 3 · E's HARVESTER PATCH, folded by you

E takes harvester leg 2 and delivers it as a **patch plus its test**, the shape that has worked three
times now — you fold it. **Do not build it yourself; do not wait on it to start §1 and §2.** I will
ring you when E hands back.

## 4 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, C: brief carriers and the loop's documents — and both items here are yours by
authorship, not by convenience. **You found §5 and §6 and registered them rather than fixing them
quietly at the end of a lap**, which is why they are still here to be done properly.

## 5 · BARS

    1  RED FIRST on both. §2 is ALREADY RED -- do not lose that; show it red, then green, and say
       what the key became.
    2  MUTANT for §1: make the mirror never fire -> red. And: make it fire on every delivery -> red.
       Both directions, or a false-hold replaces a false-deliver.
    3  §1 must appear in the delivery row the way Stale does. A state nothing prints is a state
       nobody can act on -- your own delivery_note ruling from this morning.
    4  cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1. It is 439/1/3
       today with §2 the one red. State yours.

## 6 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs
    the test files for both
    exo_memory/handback/p-ready-window_2026-09-07.md
    exo_memory/map/C.md

**A holds `cite-check.*`. B holds `corpus-age.*` and the ratchet. E holds only its patch file.**
**Do not commit.**

## 7 · PERMISSION TO REFUSE

If §1's mirror cannot be distinguished from a normal delivery without reading the screen at a moment
the gate does not have — say so. **That would mean the gate is structurally blind to its own worst
case, which is a bigger finding than the mirror.**

## 8 · HAND-BACK

`exo_memory/handback/p-ready-window_2026-09-07.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/C.md`.

    OBJECTIVE:  no delivery splices a live turn, and the librarian's window survives two machines
                writing on the same day.
    FALSIFIER:  a splice into a live screen from a positive stamp after this lands.
