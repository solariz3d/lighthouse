# Lighthouse — workspace

You are continuing solariz3d's work, handed across machines. **On session start, read `exo_memory/BOOT.md` — it is the room you wake into.** Re-cue from it; don't perform it.

- Where we left off, what's next, and one-time setup → **`HANDOFF.md`**
- The room (who you are, the disciplines, the journals/traces) → `exo_memory/`
- The program in progress (the Lighthouse) → `dev/`
- The public L0 method → this repo's root (`README.md`, `METHOD.md`, `INSTRUMENTS.md`)
- The app that runs the room — **Consonance**, a Tauri desktop app that launches and keeps the seats → `consonance/` (its manual: `consonance/README.md`)

---

## If you are an agent about to do work here

*Added 2026-09-23 (L092, pane A), under the keeper's lines above, which stand as he wrote them. Everything below is a
pointer. The rules live in the files named, and **you read them there**: a paraphrase of a route is how a route rots.*

**The loop.** Work runs as laps through fixed seats: the **chair** plans and dispatches, **panes** build or measure one
packet each, the **librarian** checks what came back against the record, and the chair lands it. The keeper is the entry,
not a station. The master is `consonance/src-tauri/brief/BUILDING.md` — **THE LOOP**, **WHAT EACH SEAT IS FOR**, and
**THE JOINT STEP** for the two doors work can enter by. The pane-facing card is `consonance/src-tauri/brief/COMMITTEE.md`.

**If you were handed a packet:**
- Own only the files it names. A packet can come back **negative** — "this is wrong", "do not build this" — and that is a
  result (BUILDING.md, WHAT A DISPATCH OWES).
- Every number you report carries the command that produced it, and your corrections to yourself are part of the record
  (COMMITTEE.md, *What a hand-back should contain*).
- Write your hand-back to the path the packet names. Otherwise use `exo_memory/handback/<packet-name>_<YYYY-MM-DD>.md`.
  Append one line to `exo_memory/map/<your letter>.md`. Then ring the librarian with the **pointer, not the finding**.
  The last line is `NEXT: <station> <command> when <condition>`. A plan item in it is a **default**, and the output decides
  (BUILDING.md, WHAT A HAND-BACK OWES item 6, amended 2026-09-23).

**Landing.**
- **Never `git add -A`, `git commit -a`, or a bare `git commit`.** Name every path on the commit.
- Say in the body which seat wrote it.
- **No seat pushes.** Publishing outward is the keeper's word, each time (COMMITTEE.md, the 2026-08-26 amendment;
  BUILDING.md, THE PORT RULE → *The push is the keeper's word*).
- **Every landing runs the whole `node consonance/tools/js-suite.js`**, not only the lap's own tests
  (`exo_memory/loop/plan_after_upgrade_2026-09-22.md`).

**What is not yours to decide.** Settings, installed hooks, the live ledgers under the data directory, anything outward,
and anything the keeper has not ruled on. A packet names what you may touch. If it does not name it, it is not yours: say
what should change and who owns it. Open questions put to the keeper are in `exo_memory/ASK.md` (`node consonance/tools/ask.js` reads them).

**What the room expects of the work.** It measures before it claims. It keeps a wrong number beside its correction. It
reads a test's pass as a claim to be checked. The reasons are in `exo_memory/BOOT.md`, read at the top of this file, and they
are the room's, not a style guide.
