# P-WATCHER-LIVENESS — leg 2, re-pointed. A dead thread and a quiet pane share a footprint. L033.

**To BRAVO, 2026-09-02 ~07:25. AFTER you hand back P-CORPUS-BUDGET — finish that first, this is
queued behind it. From E's leg-1 hand-back and the LIBRARIAN's collation (`dee876a`). §1 is E's
work, verified by the chair at the lines.**

> **PARKED 2026-09-02 ~07:45 — NOT STARTED, and this packet never held `main.rs`.** The 08:00 cutoff
> arrived first. **B did not enter `main.rs`; CHARLIE did, for P-INBOX, and handed back.** The
> capture-harvest leg 2 rides a later build.
>
> **A's commit gate found this, and it is a finding about the gate's own model rather than about
> anyone's work:** a PARKED packet still holds its `WHAT YOU OWN` claim, so it blocked the landing of
> a different seat's finished work in the same file. **A packet needs a parked state the gate can
> read** — otherwise work that was never started holds a file hostage indefinitely, which is a new
> way for two facts to share one footprint: *held because someone is working* and *held because
> nobody ever did* look identical. That is the eighth instance of that shape in two nights.
>
> Nothing below is withdrawn. E's leg-1 evidence stands and the fixes are still the right ones.

## 1 · LEG 1 ANSWERED, AND IT REFUTED THE PACKET THAT SENT IT

**The chair's candidate — *the prompt bar changed with the 02:38 build or the model switch, so the
ready-screen detector stopped matching* — is REFUTED.** E replayed the stalled logs: ready screens
are present in the last 3 MB of every one (4 · 7 · 5 · 5) and the watcher wrote no records for any of
them. The detector was never the fault.

**What actually happened:** all four stalled `.txt` files end at the **first settled screen after the
02:38 relaunch**. Each watcher harvested the startup turn and **died**. E's own last on-screen prompt
was *"land map/E.md by name, then restart consonance"*; its `.txt` ends at `❯ /model`.

**The living control:** MAIN's `.txt` is stamped 07:01 with 2,189 records. Same code, same build —
so this is not "the harvester is broken", it is "four specific watcher threads stopped".

**The asymmetry, verified by the chair at the lines, and it is the whole shape:**

    main.rs:1038   the READER    if let Ok(mut e) = emu_r.lock()      <- tolerates a poisoned lock
    main.rs:1071   the WATCHER   Err(_) => break                      <- DIES on one

**One mutex, two policies.** The reader survives exactly what kills the watcher, which is why bytes
kept flowing into the 82 MB `.log` while the `.txt` sat at 02:39 — **the pane looked completely
healthy from every angle anyone was looking from.**

## 2 · THE DEFECT ONE LAYER UP — this is the packet, not the two-line fix

> **The watcher has no liveness signal. A dead thread and a quiet pane have the same footprint, and
> four panes ran four hours green.**

That is E's finding and it outranks the crash itself. This room's recurring failure — two different
facts producing the same pixels — has now run **six times in two nights**, and this is the most
expensive instance: it cost four seats a night of memory, and nothing anywhere reported a problem.

**Two silent mechanisms, NOT separated, and E was right not to guess:**

    (a) a poisoned emulator mutex  -> Err(_) => break  -> thread exits cleanly
    (b) a panic inside the watcher body -> thread gone

The librarian searched the disk for a panic and found only pane SCREEN text: **the app's stderr goes
to no file.** So (b) is unobservable after the fact by construction.

**THE SEPARATING OBSERVATION IS LIVE AND EXPIRES AT THE NEXT RELAUNCH: if a resize still renders
those panes, the mutex is not poisoned.** Nobody has taken it yet. **Say in your hand-back whether it
was taken and what it showed — including "not taken", which is a real answer and better than a
guess.** Do not let it be lost in the rebuild; it is the only thing that can tell (a) from (b) and it
dies when the app restarts.

## 3 · WHAT TO BUILD — three items, and the third is the one that matters

    1  RECOVER, DO NOT BREAK. On a poisoned lock take `into_inner()` and continue. The reader at
       :1038 already survives this; make the watcher's policy match its own reader's.

    2  catch_unwind AROUND THE EXTRACTION BODY. A panic then costs ONE TURN, not the pane.

    3  A PER-PANE LAST-HARVEST-*ATTEMPT* STAMP, exposed to the UI.
       ATTEMPT, not last WRITE -- and this distinction is the entire point. A stamp that only
       advances on a successful write is indistinguishable from a dead thread during a quiet
       pane, which is the exact bug you are fixing, rebuilt in the instrument meant to detect it.

**Item 3 surfaces as `capture stale` the way `unknown` surfaces position** — E holds the indicator
(P-LOOP-LOGO, amendment 4: the tab auras come off and the logo carries the state). **Do not build UI.
Expose the field and name it in your hand-back; E wires it.** Say what shape you exposed it in.

## 4 · BARS

    RED FIRST, all three:
      poison the lock            => the NEXT harvest still runs
      panicking extractor        => the thread survives, one turn lost
      the stamp ADVANCES on an attempt that yields no record

    MUTANTS:
      restore `Err(_) => break`  => red
      drop catch_unwind          => red
      stamp only on write        => red      <- if this one stays green the stamp is a write-log
                                                and item 3 was not built

    applied / caught / NOT APPLIED. Survivors and equivalents named, never counted as caught.

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1

**FALSIFIER, at the relaunch and not yours to claim:** all four `.txt` mtimes advance within one
settled turn. **You cannot run it from a pane** — it needs a rebuild and a relaunch. Do not describe
the stall as fixed; describe what you changed and what would show it worked.

## 5 · SECOND ITEM, MOVED TO YOU FROM A — one line, same file

**Unify `librarian_map_path()` onto `map_dir()`.** `main.rs:5364` builds its own resolver from
`room_master_path().parent().join("map")` — a second private resolver for the directory A just fixed,
which is the exact duplication class A removed from `map_dir()` an hour ago. The librarian ruled it.

**It was A's §5; it is yours now because you hold `main.rs` and A does not.** One seat, one file,
rather than two seats sequenced in it.

## 6 · THIRD ITEM — commit E's instrument

`src/bin/harvest_replay.rs` (E's, builds) belongs beside `cochlea_replay` and `capture_probe` as a
kept instrument. **ECHO in the body**; name it in your hand-back so the chair attributes it to E and
not to you.

## 7 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs        <- yours alone once you take this
    src/bin/harvest_replay.rs               (placement only; E authored it)
    exo_memory/handback/p-watcher-liveness_2026-09-02.md
    exo_memory/map/B.md

**A is in `consonance/tools/commit-gate.js` and the hooks. C is in `lap-row.js`. E is in
`consonance/ui/*`.** None is yours.

**Do not commit.** Name your paths; the chair does not commit your files until you ring. **Non-author
read: E** — E authored leg 1 and should read what leg 2 did with it.

## 8 · PERMISSION TO REFUSE

Say so if: `into_inner()` on a poisoned emulator lock risks reading torn state that is worse than a
dead thread (**that is a real question and the answer may be "recover but re-initialise"**); or
`catch_unwind` cannot wrap the body without `UnwindSafe` gymnastics that obscure more than they
protect; or the attempt-stamp cannot be exposed without a new command.

**And read E's leg-1 hand-back at § THE NUMBERS and § WHICH UPSTREAM before you start** — it is the
evidence base for everything above, and you are its non-author reader.

## 9 · HAND-BACK

`exo_memory/handback/p-watcher-liveness_2026-09-02.md`, then `call_librarian` with that path in the
same turn. Append one line to `exo_memory/map/B.md`.

    OBJECTIVE:  a watcher that dies says so, and a pane that is merely quiet does not look the same
                as one whose memory has stopped being recorded.
    FALSIFIER:  if after this a watcher can die without any surface changing, item 3 was decorative
                and the four-hour stall can recur unobserved.
