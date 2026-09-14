# The stick as a launch verdict — the keeper's idea, saved with its prior art (not built)

*Librarian (the lineage, resumed on L at 00:55 by the stick). Filed at the keeper's word, 2026-09-14 00:5x, verbatim first.*

## The keeper's words

> "now that we are back, I had this idea to make this process a lot smoother, lets create an attachment or module to consonance that opens first, that searches for thumbdrive with the certain handoff and transcripts left for the transfer, you know what I mean? Something to make sure the transfer lands every time through the thumbdrive from laptop to desktop and also from desktop to laptop"

## What exists already, which is most of it (paths, not summaries)

- **`dev/tail-carry.js`** (A, D061, `da5d178`): export/import/rehearse; the ledger on the stick (`consonance-tails/ledger.json`); refuses forks by exact size; refuses import while the app runs; `--retire-far` per seat. 47 tests, 28/28 mutants.
- **`ARRIVING.ps1` / `LEAVING.ps1` / `ON-EXIT.ps1`** on the stick (09-12 13:00): the arrival sequence by hand — pull the repo, rehearse, import, launch; the departure — export on exit, with ON-EXIT waiting for the app to close so the export cannot be forgotten. **These ARE the module, as scripts. The idea is to move them inside the app.**
- **The carried receipt** (`~/.claude/consonance-carried.json`, written by `applyImport`; read by `sync_launch.rs::read_carried`; `apply_retire` keeps a transcript whose first timestamped record matches) — built tonight by the launch-born librarian seat on L, uncommitted at the time of writing; it is what made the 00:55 launch print `MIGRATE SEAT main|librarian|third place KEPT (the stick placed it)`.
- **`sync_launch.rs::Verdict`** (`:172`): Standalone / Resume / Migrate / LocalHouse / ReadOnly. The launch already decides from the state record before any seat spawns. That is the seam the module fits.
- The 09-09 lesson that shapes it: **the launch must never be the thing that retires a carried seat by mistake.** Tonight's 00:37:55 launch did exactly that (today's master §7) until the receipt fix.

## The shape, as a design for the chair to dispatch (not a build)

**Arrive.** A sixth verdict, decided BEFORE the state record is read: enumerate mounted volumes; a volume is *the stick* when it holds `consonance-tails/ledger.json` and a `HANDOFF*.md`. If the ledger's agreed state for any seat is newer than this machine's copy (the tail carry's own comparison, size + key), run the import with the app's seats not yet spawned (the one moment the import's "app must be closed" gate is satisfied by construction), write the receipt, then fall through to today's decision with the receipt in hand. If the stick is absent: today's behaviour, unchanged.

**Leave.** On app exit, if the stick is mounted, run the export; show the result and refuse to be dismissed until it is DONE or FAILED by name — ON-EXIT's behaviour, inside the app.

**Both ways is one code path:** the machine you arrive at imports; the machine you leave exports; the ledger is the only state and it lives on the stick.

## Bars, before any packet

1. It reuses `tail-carry.js` as a subprocess or a shared module; it does not re-implement the carry. The carry's refusals stay refusals; the module surfaces them, never overrides them.
2. Never on a running seat: import only before spawns; export only reads (the tool re-stats a growing source).
3. The stick is found by content (ledger + handoff), never by drive letter — the letter differs by machine and by port.
4. A launch with the stick absent must be byte-identical in behaviour to today; a test pins it.
5. The operating rule stands and the module states it on screen: one machine open between carries, carry both ways; a refused seat is named, with `--retire-far` as the keeper's choice, never automatic for a fixed seat.
6. The state repo's `close.js`/push hold stays until Migrate is reconciled with the receipt (now partly done: KEPT).

## Falsifiers, registered

- A launch on either machine, stick present with newer seats, that ends with any seat `-> fresh` or with a first timestamp at the launch minute.
- A launch with the stick absent whose `persist.log` rows differ from a launch before the module existed.
- An exit with the stick mounted after which the ledger's agreed state is older than the seats' files.
