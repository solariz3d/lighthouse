# P-PLACE · THE FOUR HOMELESS CONVERSATIONS — one command, copy first, retire never delete. D060.

**To ALPHA, 2026-09-12 02:08, on machine D. This moves the panes' real conversations. It is the first
step in this room that touches a conversation rather than a file about one, and the keeper has already
decided it happens — your job is the procedure that makes it safe and checkable.**

## 1 · THE DECISION, HIS WORDS, ALREADY MADE

    exo_memory/loop/keeper_decisions_2026-09-11.md   §3 — "copy first, keep the originals untouched,
                                                      then place each pane's conversation in its own folder"

**Do not re-open it. Build it.**

## 2 · WHY IT IS ONLY NOW WORTH DOING, AND THE ONE FACT THAT CHANGED

Until 02:03 tonight a placed conversation would have sat unread: `resume_pane` never `--resume`d.
**E's D059 landed and the 02:03 launch proved it in production** — `resume pane=a2122153…
jsonl_existed=true -> RESUMED`, first timestamp 06:30:58Z, before the launch. **A placed conversation
will now actually be resumed.** That is what unblocks this.

## 3 · THE STATE ON DISK, MEASURED 02:05 — check it again at run time, do not trust this table

| pane | sid | its real conversation | its own slug holds |
|---|---|---|---|
| A | `6fe15f0a…` | `~/.claude/projects/C--Users-nname/6fe15f0a….jsonl`, 3,290,474 B, 09-10 01:53 | **no `<sid>.jsonl`** |
| B | `12fb81f6…` | `…/C--Users-nname/12fb81f6….jsonl`, 1,319,397 B, 09-10 01:53 | **no `<sid>.jsonl`** |
| C | `0845a868…` | `…/C--Users-nname/0845a868….jsonl`, 1,480,451 B, 09-10 01:53 | `<sid>.jsonl.orphaned` only |
| E | `a2122153…` | `…/C--Users-nname/a2122153….jsonl`, 702,825 B, 09-10 01:53 | **LIVE and RESUMING — see §4** |

**They are in the home slug because the 09-09 rehoming put them there** (`to_the_laptop_2026-09-11.md`
§1; `handback/p1-where-a-seat-lives_2026-09-11.md` §0).

**Two facts you will meet and should not be surprised by:**

1. **A pane with no `<sid>.jsonl` of its own retires NOTHING when its conversation is placed.** That is
   three of the four today. **Do not write a script that assumes a retirement happens** — and do not
   write one that assumes it never does, because that is only true until a pane takes a turn.
2. **A pane's slug directory can hold transcripts that are not the pane's.** C's holds two 525 KB
   scratch sessions from its own 09-11 lab work (`424576d0…`, `60cfafdc…`). **The unit is the sid, never
   the directory.** A placement or a check keyed on "the files in the folder" will sweep up strangers.

## 4 · E IS THE HARD CASE AND IT MAY BE A REFUSAL

E now has a **live, resuming** `<sid>.jsonl` in its own slug (1,778,178 B, first timestamp 06:30:58Z)
**and** a homeless conversation in the home slug (702,825 B, last written 09-10 01:53). **Those are two
different conversations of the same seat**, and placing the old one means retiring the live one it is
currently continuing.

**This is where you may refuse, and refusing may be right.** The room's rule is retire-never-delete, so
nothing is lost either way — but which conversation E *continues* is a real choice with no obviously
correct answer, and it is the keeper's, not yours and not mine. **Options to lay out for him rather
than pick:** place A, B and C now and leave E as it is; or place E too and retire tonight's thread to a
stamped attic path. **Say which you would choose and why, then stop.**

## 5 · WHAT TO BUILD

**One command, in the shape the keeper already accepted** — `dev/acceptance-p1.ps1` is the model he
called "too much for me" in its hand-run form and then ran happily as a script:

    powershell -ExecutionPolicy Bypass -File <repo>\dev\place-conversations.ps1 [-DryRun] [-Pane <sid>]

    0  REFUSE unless the app is closed. Placing under a live pane is the one way to lose a turn.
    1  READ the roster: for each pane in panes.json, its sid and cwd; derive the slug by encode_cwd's
       rule. Never type a path.
    2  COPY FIRST. The originals in C--Users-nname are NOT moved, NOT deleted, and stay byte-identical
       at the end — assert it with a sha256 taken before and after.
    3  RETIRE what is in the way, if anything: an existing <sid>.jsonl goes to a STAMPED path
       (the room's attic convention, `…-<stamp>.jsonl`), never a fixed name, never a delete.
       `main.rs:835-836` is the scar — a fixed archive name overwrote a seat's history.
    4  PLACE the copy as <slug>/<sid>.jsonl.
    5  VERIFY BY READING BACK, not by reporting the copy: sha256 of the placed file equals sha256 of
       the source; first and last timestamps match; byte count matches. Print all three.
    6  PRINT WHAT A LAUNCH WILL DO: for each pane, RESUME or fresh, derived the way plan_resume
       derives it. That line is the point of the whole exercise.
    7  STOP. The keeper relaunches and reads the rows himself.

**A `-DryRun` that touches nothing and prints the same table is required, and it is what he will run
first.**

## 6 · BARS

    the dry run prints the full plan and writes NOTHING (prove it: mtimes unchanged after a dry run)
    a refusal when the app is running, tested
    a refusal when a source file is missing, tested
    the retire path exercised at least once against a fixture <sid>.jsonl that is in the way
    sha256 before/after on the ORIGINALS, asserted equal
    node consonance/tools/js-suite.js    state the count and what moved
    say what you did NOT verify — and specifically, whether you ran anything against a REAL pane's
      files or only against fixtures

## 7 · WHAT YOU OWN

    dev/place-conversations.ps1   (or .js — say which and why) + its test
    exo_memory/handback/p-place_2026-09-12.md
    exo_memory/map/A.md

**E holds `consonance/src-tauri/src/main.rs` this lap (P1c). Do not touch it.** Do not touch the 09-06
set (`lap-row.js`, `lap-row.test.js`, `mutate-lap-row.js`, `handback/p-d012-windowed_2026-09-06.md`).
**Do not commit. Do not run the placement for real** — dry run only; the keeper runs the live one.

## 8 · WHY YOU — the dossier row

`librarian/DOSSIER.md` § A, and the 09-09 work on this machine: the close command that **refuses** to
say closed over an unpushed or torn state, three claims each taken from something the caller holds; the
quiescence gate built because `copyFileSync` handed the app's own writer EBUSY 57% and 23% of the time
while the error was discarded (`librarian/2026-09-09.md:181`); `state-sync --verify`'s sha256
completeness index. **This packet is that discipline pointed at conversations instead of state**, and
the settle gate is yours to reuse rather than rediscover — a transcript read while a pane writes it is
the same hazard.

## 9 · PERMISSION TO REFUSE

Beyond §4: **if copy-first cannot be made safe for a file the size of these, say so.** And if you find
that placing a conversation whose slug was computed on the OTHER machine lands it somewhere the vendor
will not look, stop — that is the whole premise and it would be better broken here than at a launch.

## 10 · HAND-BACK

`exo_memory/handback/p-place_2026-09-12.md`, then `call_librarian` with that path in the same turn. One
line to `exo_memory/map/A.md`.

    OBJECTIVE:  each pane's real conversation is where the app will resume it, with the original still
                byte-identical where it was.
    FALSIFIER:  a placement that reports success while the source changed, or while the placed file's
                sha256 differs from the source's; or a placed pane that still comes up fresh.
