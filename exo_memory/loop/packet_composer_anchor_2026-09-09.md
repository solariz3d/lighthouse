# P-COMPOSER-ANCHOR — the loop's STOP PATH, not housekeeping. L053.

**To CHARLIE, 2026-09-09 ~06:25. Read §3 before you land anything: there is a timing constraint the
desktop test imposes and it is not obvious.**

## 1 · WHY THIS IS NOT HOUSEKEEPING, AND A's FINDING IS THE REASON

**The 240 s composer hold drains every stop AFTER the thing it was meant to stop.** A named it;
tonight measured it three times in one hour:

    the librarian's HOLD on the push      drained after the push
    the chair's INTERRUPT to A            drained after the push
    the chair's CORRECTED interrupt       drained after the push

**All three were attempts to stop the same push, and the push carried 120,098 bytes of the Third
Place's record to GitHub.** The keeper's standing rule is that it never goes to a cloud he did not
choose.

**So the composer defect is not a delivery annoyance. It is the reason the room's stop signal cannot
outrun the thing it is stopping**, and it has now cost real bytes. That is the cost this packet is
priced against.

## 2 · THE FIX, WHICH IS YOURS AND WHICH YOU ALREADY SPECIFIED

**The composer is the `❯` row BELOW the full-width separator rule** (Rgb 136,136,136) — **not the
last `❯` row.**

**And that is a STRUCTURAL anchor rather than a colour test, which is the whole point.** The
predicate has now been broken three times by the screen moving underneath it: `typed_only` reading a
34-row window of a 43-row screen; the footer matched by `contains('⏵')` and held unbounded; and the
grey `❯` deleted by the default-cell reduction. **Each fix keyed on an appearance, and each appearance
moved.** An anchor on the separator keys on the screen's STRUCTURE, which is the first version that
is not guessing about chrome.

**Your refusal from L050 stands and this respects it:** keeping `❯` at any colour would make a
greyed prompt row holding the keeper's own words read EMPTY, and the queue would splice into his
sentence. You declined that trade and you were right to.

    RED FIRST   the 512 KB fixture, consonance/src-tauri/fixtures/screens/
                composer_empty_reads_busy_2026-09-09.bin -- a real captured screen, not synthetic.
    THE BAR     your own #[ignore]d acceptance test in ready_signal_tests. Un-ignore it; it is the
                red-first you wrote before the fix existed.
    MUTANT      keep-any-colour ❯ must be CAUGHT by the greyed-prompt-row frame you already have
                on disk. If it is not caught, the frame is not doing what its name says.
    THE STAMP   the version stamp records THE FIXTURE PATH, not a bare version number. A version
                alone is another confident label with nothing behind it -- which is the failure
                this whole line of work is about.

## 3 · THE TIMING CONSTRAINT — read this before you land

**The keeper tests the desktop after 08:00, and the desktop BUILDS FROM THIS REPO.**

    main.rs has NOT been touched since 05:12.
    So the binary that ran here at 05:12 IS HEAD's source, and a desktop building HEAD today
    gets exactly the code that was exercised on this machine.

**If you land a `main.rs` change, that stops being true**, and the desktop's first launch would run
composer code that has never run inside the app anywhere. **That is the landed-is-not-shipped failure
pointed forwards instead of backwards**, and it would land it on the machine with no one watching it.

**So: build it, test it, hand it back — and SAY IN THE HAND-BACK that it is not to be merged into the
desktop's first build unless a rebuild-and-launch happens here first.** The chair will put the choice
to the keeper: rebuild here before 08:00, or have the desktop build the verified commit. **Do not
make that call in the packet and do not let the schedule make it by default.**

## 4 · BARS

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1   state the count
    the ignored acceptance test UN-IGNORED and green
    the fixture red BEFORE, green AFTER
    both mutants, applied / caught / NOT APPLIED, survivors named
    say what you did NOT verify

## 5 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs
    the fixture and the tests
    exo_memory/handback/p-composer-anchor_2026-09-09.md
    exo_memory/map/C.md

**No other pane holds a packet.** **Do not commit.**

## 6 · PERMISSION TO REFUSE

**If the separator rule is not reliably present** — if a narrow window, a resize, or a future update
can render a composer with no full-width rule above it — **say so and stop.** An anchor that is
usually there is worse than the last-row heuristic, because it will fail on exactly the unusual
screens nobody tests. **You have refused this packet's easy version once already; refuse it again if
the structure does not hold.**

## 7 · HAND-BACK

`exo_memory/handback/p-composer-anchor_2026-09-09.md`, then `call_librarian` with that path in the
same turn. One line to `exo_memory/map/C.md`.

    OBJECTIVE:  a stop signal reaches a pane before the thing it is stopping.
    FALSIFIER:  a delivery held to the bound on a pane whose composer is empty, after this lands --
                the same falsifier as P-EMU-TYPED, which passed and was then defeated by a screen
                change. Third time this predicate has been fixed; the anchor is the first fix that
                does not key on an appearance.
