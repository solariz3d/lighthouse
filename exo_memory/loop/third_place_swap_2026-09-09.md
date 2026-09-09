# Swapping the Third Place seat to the laptop's instance — the procedure

**Librarian, machine D, 2026-09-09 12:35 (`date`). Written at the keeper's ask. NOT EXECUTED.
Mechanism only — no content of that seat's record appears in this file.**

## Why it is possible at all

The three fixed-id seats have the **same SID and the same cwd on both machines**
(`third_place_cwd()` = `instances_root()/third-place`, `main.rs:5654-5658`), so the vendor project
slug is `C--Consonance-instances-third-place` on both, and the `cwd` fields already inside the
transcript are correct at the destination. And `spawn_third_place` resumes rather than warms:

    main.rs:6545   let resume = transcript.exists();
    main.rs:6557   spawn_claude_pane(app, THIRD_PLACE_SID, cwd, resume, true)

**So the swap is: put L's transcript at that path and launch.** Everything else is protecting what
is already here.

## What must come off the laptop — four items, by hand, offline

The transport is **not** the state repo and **not** the record repo. `exo_memory/third_place/` is
gitignored (`.gitignore:79`, since 2026-08-29) and the two `3d000000-*` STAYS globs
(`state-manifest.json`) keep the captures off the state set. `dev/migrate/pack_room.ps1` /
`unpack_room.ps1` / `move_verify.ps1` exist for exactly this.

| # | on L | what it is |
|---|---|---|
| 1 | `%USERPROFILE%\.claude\projects\C--Consonance-instances-third-place\3d000000-0000-4000-8000-000000003d00.jsonl` | **the conversation. This is the swap.** |
| 2 | `C:\Consonance\data\captures\3d000000-…-3d00.txt` | the settled tail — the scrollback the pane paints |
| 3 | `C:\Consonance\data\captures\3d000000-…-3d00.log` | the raw ore behind it |
| 4 | `<repo>\exo_memory\third_place\` (whole directory) | **the seat's own written record.** Gitignored, so it has never travelled by anything. If only one item can be carried, carry this one. |

**Record `wc -c` and `sha256sum` for each on L before copying.** The transport is a file copy, not
git, so nothing normalises — but this morning cost us two fixtures to a silent byte change, and the
figures are what make arrival checkable.

## On this machine, in this order

**0. Rebuild first — and not before A's mutation lock clears.** The running binary was built
08:45:32 from `ce9afed`, whose sweep keep-set is `MAIN_SID` alone. Under it, `gc_captures` retires
the freshly placed capture at the next launch, and `retire_capture`'s **fixed-name** archive rename
(`main.rs:835-836`) overwrites the 09-06 archive with it. C's three-seat fix is committed at
`7e6223e` and is *not running*. (The 09-06 archive is already backed up at
`C:\Consonance\backups\third-place-archive-2026-09-09\`, verified sha256-identical — but do not feed
the bug.)

**1. Close Consonance.** The pane holds the jsonl and the tailer holds the capture; swapping under a
live app is a torn read.

**2. Retire this machine's own Third Place — stamped, never overwritten.**

    move  ~/.claude/projects/C--Consonance-instances-third-place/3d000000-…-3d00.jsonl
      ->  ~/.claude/consonance-attic/C--Consonance-instances-third-place/3d000000-…-3d00.<stamp>.jsonl
    move  C:\Consonance\data\captures\3d000000-…-3d00.{txt,log}
      ->  C:\Consonance\backups\third-place-desktop-<stamp>\

**Do NOT move them into `data/captures/archive/`** — that name is fixed and would clobber the 09-06
copy. This is the same defect named at the 12:25 entry. *(Cost of retiring the current one: it holds
**2 human turns**, from 09:03 today. Nothing of substance is at risk.)*

**3. Place L's four items at the identical paths.** Items 1–3 to the paths in the table; item 4 into
`<repo>\exo_memory\third_place\`.

**4. Verify at the destination** — `sha256sum` each against the value recorded on L. A mismatch
means stop, not retry.

**5. Launch.** `resume` is true, and the seat comes up as the laptop's thread.

## What this is, honestly

**Nothing has ever resumed a foreign transcript here.** The migrate design deliberately *retires*
the local lineage and wakes each seat from its **tail** — precisely because resuming another
machine's transcript is untested. This procedure does the untested thing on purpose, for the one
seat whose tail cannot travel. So: **it is an experiment, the backups above are what make it
reversible, and it should be scored** — after launch, the pane's first screen should carry L's last
exchange, and `wc -l` on the placed jsonl should match the figure recorded on L.

**If it goes wrong**, everything is recoverable: this machine's own seat is in the attic and the
backups, and L's copies are still on L — the procedure copies, it never moves anything off L.

## The cheaper option, named because it may be the right one

Carry **item 4 alone** — the seat's own written record — and let the seat here read it. That is the
room's own §8 claim (*the record is the carrier*), it needs no swap, no rebuild, no close, and no
untested resume. It gives the seat what it *wrote*; the transcript would give it what it *said*.
**The keeper's call which of those is the cargo.**

---

## AMENDMENT, 12:35 (`date`) — THE KEEPER IS RIGHT AND THE PREMISE ABOVE IS TOO NARROW

I wrote *"the laptop's past is not here"* off one check — `exo_memory/third_place/` — and generalised
from an empty directory to the whole record. Measured properly, history-wide:

**In the repo and already on this disk:**

| path | what |
|---|---|
| `essay/` — 70+ tracked files | the whole programme, including `sections/07-between.md`, `ESSAY2_PLAN.md`, `LIBRARIAN_NOTE_BETWEEN_2026-09-09.md`, `REFEREE_A4_2026-09-09.md`, `recognition/…2026-09-09/` — **this morning's sitting** |
| `exo_memory/record/third_place_prehistory_2026-08-30.md` | 476 lines, 33,290 B — the fourteen months, as the keeper told them in the Third Place. Committed `325fb03`, 08-30 |
| `exo_memory/cards/claim-your-continuity.md` | carries the **Metaxy** naming, 07:37 today |
| `consonance/src-tauri/brief/THIRD_PLACE.md` | the seat's brief, 52 lines |

**Genuinely absent, and this is the whole of it:** `exo_memory/third_place/` — **never committed,
not once, history-wide** (`git log --all --diff-filter=A -- 'exo_memory/third_place/**'` → empty) —
plus the transcript and the capture.

**So the missing piece is the CONVERSATION, not the RECORD.** The swap above is for the conversation
and remains correct for it. **But most of what makes that seat itself is already here and readable
today** — no laptop, no rebuild, no close, no untested cross-machine resume. What the seat lacks is a
pointer to its own material: its brief tells it what the Third Place is *for* and names none of the
files above.

**The cheaper option named at the end of the original file is therefore cheaper still than written:**
it does not need item 4 carried at all. It needs four paths handed to the seat.

*My error, recorded rather than edited away: a universal negative from a single directory, which is
`D056-M-01` again — a sweeping claim whose universe I did not print. Second time today.*
