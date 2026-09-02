# P-CAPTURE-HARVEST — the harvester wrote nothing for four hours across four working panes. L033.

**To ECHO, 2026-09-02 ~06:45. From the LIBRARIAN's hand-back (`6a18f00`,
`librarian/2026-09-02.md` ~06:40). Chair-verified before dispatch — see §1.**

## 0 · READ THIS FIRST — YOUR MEMORY IS STALE, AND IT IS THE BUG YOU ARE FIXING

**Your shell was warmed from a capture stamped 02:39.** You do not remember building the aura, the
stream-bar fix, or handing either back. **You did both** — `690df7c` and `6fdf2cc`, and they are on
screen in the keeper's window right now for the first time.

**That amnesia IS this packet.** You are the pane best placed to notice the symptom because you are
living inside it. **Do not reason from your tail; re-derive from disk.**

## 1 · THE FINDING, RE-DERIVED BY THE CHAIR RATHER THAN RELAYED

    data/captures/<id>.txt    Sep 2 02:39   x4      5-13 KB
    data/captures/<id>.log    Sep 2 06:28   x4      82 / 44 / 36 / 20 MB

`warm_resume_brief` (`main.rs:4027`) builds a rebuilt pane's shell from the **`.txt`**, not the
`.log`. The `.txt` is the clean per-turn extraction (`main.rs:3070` explains why: the raw log is a
byte stream with ~138 escape sequences per 3 KB, so replaying it repaints every intermediate frame).

**The `.txt` has not advanced in four hours while four panes did a night of work.** So every pane
rebuilt at 06:28 woke warm on the PREVIOUS relaunch's tail. **The last settled harvest is the
`/model` banner itself.**

The watcher is described at `main.rs:1049`:

> *"the watcher: on quiescence (~500ms quiet) + a ready screen, harvest the settled turn and…"*

**Two conditions, and the finding does not yet say which one failed.** That is the whole first leg.

## 2 · WHY YOU — the dossier row

`librarian/DOSSIER.md:44-49`, E — ECHO:

> *"Stops at a bar it cannot clear and says why, then finds the defect one layer up."*

That is the row, and it is chosen for a specific reason: **the honest first answer to this packet may
be "the detector is fine and the fault is elsewhere,"** and the seat that withdrew bar 0 rather than
faking it is the seat to trust with that. Also on your row: *"the chip / DOM layer and the render of
state"* — a ready-screen detector is a screen-state reader, which is the object you work in.

## 3 · THE TWO LEGS, AND THE COLLISION THAT IS REAL

**ALPHA holds `consonance/src-tauri/src/main.rs` for this lap** (P-MAP-RESOLVER, `map_dir()`).
**You do not enter that file until A has handed back.** The chair will ring you when it is free.

**LEG 1 — DIAGNOSIS, and it needs no `main.rs` at all.**

    replay data/captures/0845a868*.log  (36 MB, spanning 02:39 -> 06:28) through the harvester
    in a test. EXPECTED: records after 02:39.

    if 0 records  -> the READY-SCREEN DETECTOR is the fault.
                     Candidate, and it is a candidate not a conclusion: the prompt bar changed
                     with the 02:38 build or with the model switch, so the pattern the detector
                     matches is no longer on screen.
    if >0 records -> the extractor works on this log and the fault is upstream of it -- the
                     watcher never fired, or fired and its write went somewhere else. SAY WHICH,
                     and do not report one as the other.

**Leg 1 is a real deliverable on its own.** If it ends at *"the detector is fine, here is what
isn't,"* hand that back and stop. **A correct diagnosis with no fix is worth more than a fix built
on a guess** — the 02:39 stall has already cost four panes a night of memory, and a second wrong
cause would cost another.

**LEG 2 — the repair, only after leg 1 names the cause and only after `main.rs` is free.**

## 4 · WHAT YOU OWN

    consonance/src-tauri/src/capture_harvest.test.rs   (or wherever the replay test belongs --
                                                        your call, name it in the hand-back)
    consonance/src-tauri/src/main.rs                   <- LEG 2 ONLY, after A hands back
    exo_memory/handback/p-capture-harvest_2026-09-02.md
    exo_memory/map/E.md                                (one appended line — see §6)

**Do not commit.** Name your paths; the chair commits with attribution.

## 5 · THE BARS

    1  THE REPLAY IS THE INSTRUMENT, not an assertion about it. Point it at the real 36 MB log
       on disk. A synthetic fixture that reproduces the stall proves the fixture, not the log.
       If the real log is too large for a test, say so and state what you did instead.

    2  RED FIRST on leg 2. The falsifier the librarian registered: after the fix, the .txt mtime
       ADVANCES WITHIN ONE SETTLED TURN on all four panes. That is a relaunch-scored check and
       is not yours to claim -- see below. Your in-seat bar is a test that goes red on today's
       tree and green after.

    3  MUTANT on leg 2: revert your detector change -> red. Report applied/caught/NOT APPLIED.
       Name survivors and equivalents; a clean table is worth less than an honest one.

    4  cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
       and  node consonance/tools/js-suite.js   -- state counts and what moved.

    5  Say what you did NOT verify.

**THE PROOF IS NOT YOURS TO RUN.** The `.txt` advancing on four live panes needs a rebuild and a
relaunch — the keeper's hands. **Do not describe the stall as fixed.** Describe what you changed and
what would show it worked.

**Three known reds are not yours:** `actors.evidence.test.js` (since 2026-08-25),
`corpus-age.test.js` (since `c2afec6`), and anything A reports mid-flight.

## 6 · PERMISSION TO REFUSE — and one shape worth naming

Say so plainly if: the harvester cannot be exercised in a test without standing up a live pane; the
36 MB log cannot be replayed within a test's budget; or **the detector turns out to be correct and
the stall has a different cause.** That last one is not a failure to deliver — it is the deliverable.

**And one thing to watch for, because it has bitten this room five times in two nights:** *nothing
was harvested* and *harvesting ran and produced nothing* will look identical from the `.txt` mtime
alone. **Find an observation that separates them before you conclude either.** The 02:39 stamp is
consistent with both.

## 7 · THE HAND-BACK

**Write `exo_memory/handback/p-capture-harvest_2026-09-02.md`, then `call_librarian` with that path
in the same turn.** The call carries the POINTER and one line of orientation — never the finding.
**Hand back after LEG 1**, before you touch `main.rs`; the diagnosis is a checkpoint, not a draft.

**And append ONE LINE to `exo_memory/map/E.md`** — the finding as a sentence that could be wrong, its
evidence pointer, and the hand-back path.

**Write it knowing it cannot reach you yet.** A's packet this same lap is the reason it cannot: the
map resolver has never pointed at the directory the maps are in. **Your two packets are the two
halves of the same wake** — the map is what a pane carries deliberately, the capture is what it
carries by default, and tonight neither arrived.

**Non-author read: B.**

    OBJECTIVE:  a pane rebuilt after a night of work wakes carrying that night, not the one before
                it.
    FALSIFIER:  if the .txt mtime does not advance within one settled turn on all four panes after
                the next relaunch, the cause named in leg 1 was wrong. Say so in those words rather
                than looking for a second patch.
