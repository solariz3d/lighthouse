# P-HARVESTER LEG 2 — the panes' last words are still a 09-02 capture. L043.

**To ECHO, 2026-09-07 ~03:40. Dev only. Delivered as a PATCH; C holds `main.rs` this lap.**

## 1 · YOUR OWN LEG 1, UNFINISHED FOR FIVE DAYS

You diagnosed it on 09-02 and it has been parked since. **The panes' `PRIOR CONVERSATION` is STILL a
09-02 capture** — their maps carry now (proof 1 passed by body last night), but what a pane was
mid-thought about when its turn ended still dies.

**Your finding:** `main.rs:1071` the WATCHER does `Err(_) => break` where the READER at `:1038`
tolerates the same poisoned lock. **One mutex, two policies.** Bytes kept flowing into an 82 MB
`.log` while the `.txt` sat frozen — the pane looked healthy from every angle anyone was looking
from.

**And the defect one layer up, which is still the packet:** *the watcher has no liveness signal. A
dead thread and a quiet pane have the same footprint.*

## 2 · THE THREE ITEMS, UNCHANGED

    1  RECOVER, DO NOT BREAK. On a poisoned lock take into_inner() and continue. Make the watcher's
       policy match its own reader's.
    2  catch_unwind AROUND THE EXTRACTION BODY. A panic costs ONE TURN, not the pane.
    3  A PER-PANE LAST-HARVEST-*ATTEMPT* STAMP. ATTEMPT, not last WRITE — a stamp that advances
       only on a successful write is indistinguishable from a dead thread during a quiet pane,
       which is the bug rebuilt inside the instrument meant to detect it.

**Item 3 has somewhere to land now that it did not have on 09-02:** C's ready-stamp machinery exists
(`data/ready/<session>.json`) and the delivery row prints state. **Say whether the harvest stamp
should join that surface or stay separate, and why.**

## 3 · THE OBSERVATION THAT EXPIRED, said plainly

The separating test — *if a resize still renders those panes, the mutex is not poisoned* — **was
never taken, and the app has restarted several times since.** It is gone. So (a) poisoned mutex and
(b) panic in the body are **still not separated**, and the app's stderr goes to no file.

**Build for both.** Item 1 covers (a); item 2 covers (b). **Do not claim to know which it was.**

## 4 · DELIVERY — patch, not edit

`main.rs` is CHARLIE's this lap. Deliver a **reviewed patch plus its test**, in the shape you used
for the alias resolver (`exo_memory/loop/patch_resolve_from_L040.md`). C folds it.

## 5 · BARS

    RED FIRST, all three:
      poison the lock            => the NEXT harvest still runs
      panicking extractor        => the thread survives, one turn lost
      the stamp ADVANCES on an attempt that yields no record

    MUTANTS:
      restore Err(_) => break    => red
      drop catch_unwind          => red
      stamp only on write        => red   <- if green, you built a write-log and item 3 is not done

    applied / caught / NOT APPLIED. Survivors named, never counted as caught.

**FALSIFIER, at the next relaunch and NOT yours to claim:** all four `.txt` mtimes advance within one
settled turn. **You cannot run it from a pane.** Do not describe the stall as fixed; describe what
you changed and what would show it worked.

## 6 · WHAT YOU OWN

    exo_memory/loop/patch_harvester_leg2_L043.md
    consonance/src-tauri/src/harvest_guard.test.rs   (or the name you pick — say which)
    exo_memory/handback/p-harvester-leg2_2026-09-07.md
    exo_memory/map/E.md

**DO NOT EDIT `consonance/src-tauri/src/main.rs`.** A holds `cite-check.*`; B holds `corpus-age.*`
and `portable-paths.*`. **Do not commit.**

## 7 · PERMISSION TO REFUSE

Say so if `into_inner()` risks torn state worse than a dead thread — **the answer may be "recover but
re-initialise", and that is a real finding**; or if `catch_unwind` needs `UnwindSafe` gymnastics that
obscure more than they protect.

## 8 · HAND-BACK

`exo_memory/handback/p-harvester-leg2_2026-09-07.md`, then `call_librarian` with that path in the
same turn. One line to `exo_memory/map/E.md`.

    OBJECTIVE:  a pane's last words survive its turn ending, and a dead watcher says so.
    FALSIFIER:  a watcher dies after this and nothing anywhere changes.
