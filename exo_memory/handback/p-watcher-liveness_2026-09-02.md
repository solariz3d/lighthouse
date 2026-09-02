# P-WATCHER-LIVENESS — PARKED, NOT STARTED. BRAVO, L033/L034, 2026-09-02.

**This hand-back builds nothing. It exists to RELEASE `consonance/src-tauri/src/main.rs`.** The
08:00 cutoff arrived before this packet started, and every item in it rides a later build.

**I never entered `main.rs`.** The only reads I made against it were for P-CORPUS-BUDGET (landed
`e33c200`), where I read `librarian_shelf`, `librarian_shelf_room` and the `order` table and made no
edit. The chair reports CHARLIE entered it for P-INBOX and has handed back; `main.rs` is clean
against HEAD in the shared checkout as I write this.

## What is still owed — the three items, unstarted

    1  RECOVER, DO NOT BREAK.  main.rs:1071 `Err(_) => break` — the WATCHER dies on a poisoned
       lock while the READER at :1038 (`if let Ok(mut e) = emu_r.lock()`) tolerates one. Take
       `into_inner()` and continue; make the watcher's policy match its own reader's.
    2  catch_unwind AROUND THE EXTRACTION BODY, so a panic costs one turn rather than the pane.
    3  A PER-PANE LAST-HARVEST-*ATTEMPT* STAMP, exposed as a field for E to wire. ATTEMPT, never
       last WRITE. Its mutant — stamp only on write ⇒ red — is the one that decides whether item 3
       was built or whether a write-log was built and named a liveness signal.

Plus the two folded-in items, also unstarted: unifying `librarian_map_path()` (`main.rs:5364`) onto
`map_dir()`, and placing E's `src/bin/harvest_replay.rs` beside `cochlea_replay` and `capture_probe`
as a kept instrument — **E authored it; the attribution is E's, not mine.**

## The time-expiring observation — NOT TAKEN

Whether a resize still renders the stalled panes — which would separate a poisoned mutex from a
panic — **was not taken, and I could not have taken it.** It needs a hand on the window; a pane has
no way to resize the app it is running inside, and the app's stderr goes to no file, so the panic
reading is unobservable after the fact. It expires at the relaunch. **Not taken** is the answer, and
the reason it is worth recording is that the question stays open rather than being closed by
assumption: after the relaunch, nobody can say from the artifacts which of the two it was.

**I am not claiming the relaunch falsifier.** Nothing here changed the stall.

## Two facts about the gate, the chair's to admit and mine to carry

Recorded here because this note is the evidence, and because both are findings rather than
bookkeeping:

1. The packet's `WHAT YOU OWN` block first declared `src/bin/harvest_replay.rs` — **src-tauri-
   relative, not repo-relative.** The gate could not derive ownership and **failed closed**, which is
   the correct direction to fail. Cost: minutes. The path is fixed in the packet.
2. A PARKED note was then written into that packet whose prose **quoted the phrase `WHAT YOU OWN`.**
   The parser takes the first occurrence, hit the blockquote, saw a `>` on the next line, stopped,
   and derived **zero paths** — so the packet claimed nothing and everything failed closed. **A
   packet's prose can silently disable its own ownership block by mentioning the heading.** Worth
   carrying to A as a real fragility; not fixed here, and not mine to fix.

## Why a parked packet must still hand back

A packet nobody started holds its files exactly as hard as one under active work: **held-because-
someone-is-working and held-because-nobody-ever-did have the same footprint at the gate.** There is
no other way for a parked packet to let go. That is the same shape as the defect this packet was
dispatched to fix — a dead watcher and a quiet pane sharing a footprint — reappearing one level up,
inside the guard.

**RELEASED:** `consonance/src-tauri/src/main.rs`, `consonance/src-tauri/src/bin/harvest_replay.rs`.

## Files

    exo_memory/handback/p-watcher-liveness_2026-09-02.md   (this file)
    exo_memory/map/B.md                                    one line appended

**Nothing committed. Nothing built. Non-author read: E.**
