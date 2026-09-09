# P-OFFSETS-FIX — land the fix you specified, before the rebuild. L051.

**To CHARLIE, 2026-09-09 ~02:35. One place. The keeper is holding the rebuild for this.**

## 1 · YOUR OWN SPECIFICATION IS THE TASK

    exo_memory/handback/p-board-replay_2026-09-09.md    the fix, as you specified it

**Open your own hand-back and land what is in it.** This packet routes it and does not restate it —
you already wrote the diagnosis and the shape, and a chair paraphrase of a pane's own fix is the
copy-of-a-copy this room forbids.

The site, unchanged since you found it:

    main.rs:8809   .manage(TailerOffsets(Arc::new(Mutex::new({
                       BACKFILL_ACTIVE.store(!offsets_path().exists(), Ordering::Relaxed);
                       load_offsets()
                   }))))

A `.manage()` argument, evaluated before `.setup()` runs `set_dirs`.

**`offset_tests` goes GREEN with this.** It landed deliberately red at `a17007f` as the carrier;
this is the commit that earns it.

## 2 · WHAT ELSE IS RIDING THIS REBUILD, so you know what not to touch

    E's mcp.rs debt gate    ALREADY IN THE TREE (bd62a74). Do not touch mcp.rs.
    the composer fix        NOT in this rebuild, by your own refusal. The 240 s hold stays until
                            P-COMPOSER-ANCHOR. Do not fix it here.

**One rebuild, two fixes, and the rebuild is its own verification.**

## 3 · PREDICT THE FIRST LAUNCH, OR IT WILL READ AS A FAILURE TOMORROW

**Measured just now:** `C:\Consonance\data\tailer-offsets.json` exists (606 bytes, written 02:33).
There is **no** `tailer-offsets.json` anywhere under `~/`. So the file has been written to the
CONFIGURED path all along, and the DEFAULT path — the one the buggy read uses — has never had one.

**Which means the first launch after your fix may still do a full backfill**, and that would be
CORRECT rather than a failure: the read finally looks where the writes went, and whether it finds
usable offsets depends on what `set_dirs` resolves to at that moment versus what wrote that file.

**Say, before the rebuild, what you predict the first launch does** — backfill or resume — **and
why.** A prediction written before the run is the difference between a result and a story told
afterwards, and this room has spent two nights on the second kind.

## 4 · THE SCORING SEQUENCE — the before-picture is destroyed if it is taken late

    node consonance/tools/replay-check.js --mark      BEFORE the keeper rebuilds
    <the keeper rebuilds and relaunches>
    node consonance/tools/replay-check.js --score     AFTER

**`--mark` must run before the rebuild or there is no baseline to score against** — and the rebuild
is the keeper's move, not yours, so **say plainly in the hand-back that the mark is taken and the
next step is his.** Do not leave the sequence implicit; last night an owed step sat undelivered for
29 minutes because nobody said whose it was.

**And say what a SECOND relaunch would show**, if one backfill is expected on the first.

## 5 · BARS

    cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
      offset_tests must go 13/13. State the whole suite count too.
    the prediction of section 3, written BEFORE the rebuild
    --mark taken, and said out loud as taken
    say what you did NOT verify

## 6 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs
    exo_memory/handback/p-offsets-fix_2026-09-09.md
    exo_memory/map/C.md

**Do not touch `mcp.rs` (E's gate, landed) or the composer predicate (your own refusal stands).**
**Do not commit.**

## 7 · PERMISSION TO REFUSE

**If moving the load out of `.manage()` changes when `BACKFILL_ACTIVE` is observable to anything
that reads it early, say so and stop.** A fix that resolves the path correctly but announces the
backfill to a reader that has already run is the same defect wearing the other shoe, and you are the
seat that found the first one.

## 8 · HAND-BACK

`exo_memory/handback/p-offsets-fix_2026-09-09.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/C.md`.

    OBJECTIVE:  the offsets are read from where they are written, and the launch's claim is true.
    FALSIFIER:  a relaunch after the rebuild that re-reads any transcript from the top, beyond the
                one backfill you predict in section 3.
