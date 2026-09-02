# P-TWO-DOORS — the loop diagram has one door and the keeper uses two. L029 item 4.

**Dispatched to CHARLIE, 2026-09-02 ~03:20. Chair-written.**

**This was going to be done by the chair. The keeper stopped that: the orchestrator dispatches and
commits; it does not build.** Recorded here because it is `memory/split-the-work-with-the-panes.md`
recurring inside the message that was acknowledging it.

---

## 0 · THE OBJECT

    git show 0714963
    exo_memory/loop/two_doors_amendment_2026-09-02.md

**The keeper's amendment is quoted verbatim in that file. Quote it; do not restate it.** The
adjacent design file carries a falsifier saying that restating a keeper's design in one's own words
is how it goes missing, and it went missing exactly that way once already.

## 1 · WHAT IS TRUE AND WHAT THE DOCUMENT SAYS

**`BUILDING.md:9-32` draws the loop with ONE door:** `you → ORCHESTRATOR → LIBRARIAN`.

**The keeper uses two**, and said so: work may enter at the orchestrator OR go directly to the
librarian, and *"either way the chain works when it starts."* The drawing is now **incomplete rather
than wrong**.

**And a second correction from the same night, which the diagram also does not carry:** the user is
the **ENTRY, not a station the loop returns to** (`c177984`, the keeper verbatim). Entry runs once;
then `orch → panes → lib → orch` repeats on its own.

## 2 · THREE CHANGES

1. **`BUILDING.md:9-32` — draw the second arrow, `you → LIBRARIAN`**, and put the librarian's ring
   rule at **THE JOINT STEP (`:264`)**: *on a direct ask, the librarian rings the chair THE INQUIRY —
   one line, the ask itself, no map — BEFORE filing the map; the chair seals three lines while the
   librarian works.* Same order as drawn, different messenger.

   **THE DIAGRAM IS THE CARRIER.** Editing the surrounding prose and leaving the drawing is the
   2026-08-17 lesson verbatim — that retirement edited every downstream document, missed the
   carrier, and the room taught a retired metaphor for five weeks.

2. **`consonance/tools/lap-row.js` — lap rows carry `entry: orch | lib`.** Without the field, a
   direct-entry lap (no guess is possible, the map arrives first by construction) and a lap where the
   chair simply failed to seal are **indistinguishable on the ledger**, and the second should be
   visible. Rows without the field are legitimately absent, not malformed — do not break the reader
   on history.

3. **ONE user-visible paragraph, in ONE place** — the About tab or the Librarian tab's own text in
   `consonance/ui/app.*` — saying the loop has two doors. **Pointers elsewhere, never copies.** A
   copy that outranks its master is the telephone game's first step.

   **CHECK THE COLLISION BEFORE YOU TOUCH `ui/`:** E holds `chain-indicator.js`, `index.html`,
   `app.css` and `term.js` for the aura (`12e1e89`). If your paragraph needs any of those, **STOP and
   hand back saying so** — do not edit a file another pane is in. `app.js` alone is likely clear;
   verify rather than assume.

## 3 · THE FALSIFIER THAT COMES WITH IT — already registered, do not re-invent

    a direct-entry lap whose guess is sealed AFTER the map's commit time  =>  the rule was not kept,
    and the row reads "no guess - direct entry" rather than pretending a measurement exists.

**Checkable from two commit timestamps and needing nobody's honesty.** Your `entry` field is what
makes it readable.

## 4 · THE BARS

1. **`node consonance/tools/js-suite.js`** — state the count and what moved. There is **one
   pre-existing red**: `consonance/tools/actors.evidence.test.js`, from live-board data (an
   unresolved pane id, `3d000000-…-3d00`, 6 rows, 2026-08-25 11:38–11:42, no `letters.json` entry).
   **It is not yours and predates this work by a week — do not fix it and do not let it read as
   caused by you.**
2. **`node consonance/tools/lap-row.js --report`** still runs against existing rows with no `entry`
   field.
3. **Mutation, `applied N / caught N / NOT APPLIED N`:** remove the second arrow from the diagram →
   red; drop the `entry` field → red. A mutant is caught only when an oracle for the **mutated
   property** fails.

## 5 · WHAT YOU OWN

    consonance/src-tauri/brief/BUILDING.md     (and instances/main/CLAUDE.md if it mirrors — CHECK)
    consonance/tools/lap-row.js
    consonance/tools/lap-row.test.js
    ONE ui file for §2.3, only after the collision check
    exo_memory/handback/p-two-doors_2026-09-02.md

**BRAVO holds `main.rs`. E holds the aura's `ui/` files. ALPHA holds its own registration.**
**Do not commit.**

**AND NOTE:** `BUILDING.md` is a bundle resource — `tauri.conf.json:35` copies it beside the exe at
build time, and `room_brief()` serves tier 2 from that copy. **A brief edit does not reach a seat
until a rebuild.** `brief/` is now on the launcher's watch list (`72c077a`), so a build will trigger
— but say in your hand-back that it is unshipped until then.

## 6 · PERMISSION TO REFUSE, and it is real

Say so if: the second arrow cannot be drawn without redrawing the whole diagram; the `entry` field
breaks the report on historical rows; the ui paragraph collides with E; or **the two-doors rule as
registered is not what the diagram should say.**

## 7 · THE HAND-BACK

`exo_memory/handback/p-two-doors_2026-09-02.md`, then `call_librarian` with the POINTER and one line
of orientation. **Non-author read: A or B.**

    OBJECTIVE:  the loop diagram shows both doors, and a lap row says which one was used, so a
                direct-entry lap is never mistaken for a chair that failed to seal.
    FALSIFIER:  if the next direct-entry lap still produces a row indistinguishable from a missed
                seal, the field is decoration.
